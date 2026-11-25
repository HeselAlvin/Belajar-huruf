import { useCallback, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import type { AlphabetItem } from '../types/app';

const BGM_SRC = '/assets/audio/sfx/bgm.mp3';
const BGM_VOLUME = 0.25;
const BGM_DUCK_VOLUME = 0.05;

export function useAudioPlayer(isMuted: boolean) {
  const activeHowlRef = useRef<Howl | null>(null);
  const bgmRef = useRef<Howl | null>(null);
  const timerRef = useRef<number | null>(null);
  const isMutedRef = useRef(isMuted);
  const sfxCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // 1. Langsung coba autoplay saat web dibuka + backup jika browser memblokir
  useEffect(() => {
    const bgm = new Howl({
      src: [BGM_SRC],
      html5: true,
      loop: true,
      autoplay: !isMutedRef.current, // Langsung putar saat halaman dibuka
      volume: BGM_VOLUME,
      onloaderror: (_id, err) => {
        console.error('[BGM] Gagal memuat file:', BGM_SRC, err);
      },
      onplayerror: () => {
        // Jika browser memblokir autoplay, otomatis putar di interaksi pertama
        const unlockBgm = () => {
          if (!isMutedRef.current && !bgm.playing()) {
            bgm.play();
          }
          if (bgm.playing()) {
            window.removeEventListener('pointerdown', unlockBgm);
            window.removeEventListener('touchstart', unlockBgm);
            window.removeEventListener('click', unlockBgm);
            window.removeEventListener('keydown', unlockBgm);
          }
        };

        window.addEventListener('pointerdown', unlockBgm);
        window.addEventListener('touchstart', unlockBgm);
        window.addEventListener('click', unlockBgm);
        window.addEventListener('keydown', unlockBgm);
      },
    });

    bgmRef.current = bgm;

    return () => {
      bgm.unload();
      bgmRef.current = null;
      if (sfxCtxRef.current && sfxCtxRef.current.state !== 'closed') {
        void sfxCtxRef.current.close().catch(() => {});
        sfxCtxRef.current = null;
      }
    };
  }, []);

  // 2. Sinkronkan tombol Mute/Unmute di TopBar
  useEffect(() => {
    const bgm = bgmRef.current;
    if (!bgm) return;

    if (isMuted) {
      if (bgm.playing()) bgm.pause();
    } else if (!bgm.playing()) {
      bgm.volume(BGM_VOLUME);
      bgm.play();
    }
  }, [isMuted]);

  const setBgmDucking = useCallback((duck: boolean) => {
    const bgm = bgmRef.current;
    if (!bgm || !bgm.playing()) return;
    bgm.fade(bgm.volume(), duck ? BGM_DUCK_VOLUME : BGM_VOLUME, 220);
  }, []);

  const stopAll = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (activeHowlRef.current) {
      activeHowlRef.current.stop();
      activeHowlRef.current.unload();
      activeHowlRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setBgmDucking(false);
  }, [setBgmDucking]);

  // Efek suara "pop-ting" jelas dan tembus di atas BGM
  const playPop = useCallback(
    (pitch = 520) => {
      if (isMuted) return;
      try {
        if (!sfxCtxRef.current || sfxCtxRef.current.state === 'closed') {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext })
              .webkitAudioContext;
          sfxCtxRef.current = new AudioCtx();
        }

        const ctx = sfxCtxRef.current;
        if (ctx.state === 'suspended') {
          void ctx.resume();
        }

        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(pitch * 0.75, now);
        osc1.frequency.exponentialRampToValueAtTime(pitch * 1.45, now + 0.09);

        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.55, now + 0.015);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.17);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(pitch * 1.5, now + 0.05);
        osc2.frequency.exponentialRampToValueAtTime(pitch * 1.9, now + 0.16);

        gain2.gain.setValueAtTime(0.001, now + 0.05);
        gain2.gain.linearRampToValueAtTime(0.35, now + 0.07);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.05);
        osc2.stop(now + 0.23);
      } catch {
        // Abaikan jika audio context belum aktif
      }
    },
    [isMuted]
  );

  const playClip = useCallback(
    (
      src: string,
      fallbackText: string,
      onComplete?: () => void,
      restoreBgmOnEnd = true
    ) => {
      if (isMuted) {
        onComplete?.();
        return;
      }

      setBgmDucking(true);

      const handleDone = () => {
        if (restoreBgmOnEnd) setBgmDucking(false);
        onComplete?.();
      };

      const speakFallback = () => {
        if (!('speechSynthesis' in window)) {
          handleDone();
          return;
        }
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(fallbackText);
        utter.lang = 'id-ID';
        utter.rate = 0.88;
        utter.pitch = 1.15;
        utter.onend = handleDone;
        utter.onerror = handleDone;
        window.speechSynthesis.speak(utter);
      };

      const sound = new Howl({
        src: [src],
        onend: handleDone,
        onloaderror: () => speakFallback(),
        onplayerror: () => speakFallback(),
      });

      activeHowlRef.current = sound;
      sound.play();
    },
    [isMuted, setBgmDucking]
  );

  const playLetter = useCallback(
    (item: AlphabetItem) => {
      stopAll();
      playClip(item.letterAudio, item.lower);
    },
    [playClip, stopAll]
  );

  const playWord = useCallback(
    (item: AlphabetItem) => {
      stopAll();
      playClip(item.wordAudio, item.word);
    },
    [playClip, stopAll]
  );

  const playLetterThenWord = useCallback(
    (item: AlphabetItem) => {
      stopAll();
      playClip(
        item.letterAudio,
        item.lower,
        () => {
          timerRef.current = window.setTimeout(() => {
            playClip(item.wordAudio, item.word);
          }, 450);
        },
        false
      );
    },
    [playClip, stopAll]
  );

  return { playPop, playLetter, playWord, playLetterThenWord, stopAll };
}