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
  const speakDelayRef = useRef<number | null>(null);
  const isMutedRef = useRef(isMuted);
  const sfxCtxRef = useRef<AudioContext | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Muat daftar suara TTS browser (Chrome memuatnya secara asynchronous)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const list = synth.getVoices();
      if (list.length > 0) {
        voicesRef.current = list;
      }
    };

    loadVoices();
    synth.addEventListener('voiceschanged', loadVoices);
    return () => {
      synth.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const pickIndonesianVoice = useCallback(() => {
    if (!('speechSynthesis' in window)) return null;
    const voices =
      voicesRef.current.length > 0
        ? voicesRef.current
        : window.speechSynthesis.getVoices();

    return (
      voices.find((v) =>
        v.name.toLowerCase().includes('google bahasa indonesia')
      ) ||
      voices.find((v) =>
        v.lang.toLowerCase().replace('_', '-').startsWith('id')
      ) ||
      null
    );
  }, []);

  const getSfxContext = useCallback(() => {
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
    return ctx;
  }, []);

  // 1. Inisialisasi BGM
  useEffect(() => {
    const bgm = new Howl({
      src: [BGM_SRC],
      html5: true,
      loop: true,
      autoplay: !isMutedRef.current,
      volume: BGM_VOLUME,
      onloaderror: (_id, err) => {
        console.error('[BGM] Gagal memuat file:', BGM_SRC, err);
      },
      onplayerror: () => {
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
    if (speakDelayRef.current) {
      window.clearTimeout(speakDelayRef.current);
      speakDelayRef.current = null;
    }
    if (activeHowlRef.current) {
      activeHowlRef.current.stop();
      activeHowlRef.current.unload();
      activeHowlRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setBgmDucking(false);
  }, [setBgmDucking]);

  // Pembaca suara Bahasa Indonesia (anti-bug Chrome cancel/GC)
  const speakText = useCallback(
    (text: string, onComplete?: () => void, restoreBgmOnEnd = true) => {
      if (isMutedRef.current || !('speechSynthesis' in window)) {
        onComplete?.();
        return;
      }

      if (speakDelayRef.current) {
        window.clearTimeout(speakDelayRef.current);
        speakDelayRef.current = null;
      }

      const synth = window.speechSynthesis;
      const needsCancel = synth.speaking || synth.pending;
      if (needsCancel) {
        synth.cancel();
      }

      const runSpeak = () => {
        if (isMutedRef.current) {
          onComplete?.();
          return;
        }

        setBgmDucking(true);

        const utter = new SpeechSynthesisUtterance(text);
        const idVoice = pickIndonesianVoice();
        if (idVoice) {
          utter.voice = idVoice;
        }
        utter.lang = 'id-ID';
        utter.rate = 0.92;
        utter.pitch = 1.08;
        utter.volume = 1;

        const finish = () => {
          utteranceRef.current = null;
          if (restoreBgmOnEnd) setBgmDucking(false);
          onComplete?.();
        };

        utter.onend = finish;
        utter.onerror = finish;

        utteranceRef.current = utter;

        if (synth.paused) {
          synth.resume();
        }
        synth.speak(utter);
      };

      if (needsCancel) {
        speakDelayRef.current = window.setTimeout(runSpeak, 65);
      } else {
        runSpeak();
      }
    },
    [pickIndonesianVoice, setBgmDucking]
  );

  // Efek suara klik "pop-ting"
  const playPop = useCallback(
    (pitch = 520) => {
      if (isMuted) return;
      try {
        const ctx = getSfxContext();
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
    [getSfxContext, isMuted]
  );

  // Efek suara BENAR (ding-ding-ding) + ucapan
  const playCorrect = useCallback(
    (spokenFeedback?: string) => {
      stopAll();
      if (isMuted) return;
      try {
        const ctx = getSfxContext();
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99];

        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + i * 0.085;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.45, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.26);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.28);
        });
      } catch {
        // Abaikan error AudioContext
      }

      if (spokenFeedback) {
        timerRef.current = window.setTimeout(() => {
          speakText(spokenFeedback);
        }, 280);
      }
    },
    [getSfxContext, isMuted, speakText, stopAll]
  );

  // Efek suara SALAH (tet-tot lembut) + ucapan koreksi huruf yang benar
  const playWrong = useCallback(
    (spokenCorrection?: string) => {
      stopAll();
      if (isMuted) return;
      try {
        const ctx = getSfxContext();
        const now = ctx.currentTime;
        const notes = [310, 235];

        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + i * 0.14;

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);
          osc.frequency.linearRampToValueAtTime(freq * 0.9, start + 0.12);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.24, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.2);
        });
      } catch {
        // Abaikan error AudioContext
      }

      if (spokenCorrection) {
        timerRef.current = window.setTimeout(() => {
          speakText(spokenCorrection);
        }, 340);
      }
    },
    [getSfxContext, isMuted, speakText, stopAll]
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

      const sound = new Howl({
        src: [src],
        onend: handleDone,
        onloaderror: () => speakText(fallbackText, onComplete, restoreBgmOnEnd),
        onplayerror: () => speakText(fallbackText, onComplete, restoreBgmOnEnd),
      });

      activeHowlRef.current = sound;
      sound.play();
    },
    [isMuted, setBgmDucking, speakText]
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

  return {
    playPop,
    playCorrect,
    playWrong,
    speakText,
    playLetter,
    playWord,
    playLetterThenWord,
    stopAll,
  };
}