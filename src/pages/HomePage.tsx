import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MascotPointer } from '../components/home/MascotPointer';
import { MenuTile } from '../components/home/MenuTile';
import type { MenuTarget } from '../types/app';

interface HomePageProps {
  onSelectMenu: (target: MenuTarget) => void;
  onPlayPop: (pitch?: number) => void;
  onSpeakText: (text: string) => void;
  onStopAudio: () => void;
}

export function HomePage({
  onSelectMenu,
  onPlayPop,
  onSpeakText,
  onStopAudio,
}: HomePageProps) {
  const [selectedTarget, setSelectedTarget] = useState<MenuTarget | null>(null);
  const [phase, setPhase] = useState<'idle' | 'moving' | 'tapping'>('idle');
  const [isGreeting, setIsGreeting] = useState(false);
  const timersRef = useRef<number[]>([]);
  const greetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      if (greetTimerRef.current) {
        window.clearTimeout(greetTimerRef.current);
      }
    };
  }, []);

  const handleMascotClick = () => {
    if (phase !== 'idle') return;

    onPlayPop(600);
    onSpeakText('Halo, aku Deko, detektif kosakata!');
    setIsGreeting(true);

    if (greetTimerRef.current) {
      window.clearTimeout(greetTimerRef.current);
    }
    greetTimerRef.current = window.setTimeout(() => {
      setIsGreeting(false);
    }, 3500);
  };

  const handleMenuClick = (target: MenuTarget) => {
    if (phase !== 'idle') return;

    if (greetTimerRef.current) {
      window.clearTimeout(greetTimerRef.current);
      greetTimerRef.current = null;
    }
    setIsGreeting(false);
    onStopAudio();

    // Bunyi klik instan saat box disentuh
    onPlayPop(440);

    setSelectedTarget(target);
    setPhase('moving');

    // Tahap 1 (300ms): Maskot sampai di dekat tombol lalu mengetuk pakai pensil
    const t1 = window.setTimeout(() => {
      setPhase('tapping');
      onPlayPop(target === 'alphabet' ? 620 : 720);
    }, 300);

    // Tahap 2 (720ms): Setelah tombol membal & bintang muncul, pindah halaman
    const t2 = window.setTimeout(() => {
      onSelectMenu(target);
    }, 720);

    timersRef.current = [t1, t2];
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-84px)] max-w-6xl flex-col items-center justify-center px-4 pb-20">
      {/* Judul Utama */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="mb-8 text-center sm:mb-12"
      >
        <span className="inline-block rounded-full border-[3px] border-[#3D2314] bg-[#FFD166] px-4 py-1 text-sm font-extrabold uppercase tracking-wider text-[#3D2314] shadow-[0_3px_0_#3D2314]">
          Belajar Sambil Bermain
        </span>
        <h1 className="font-display letter-outline mt-3 text-4xl font-bold text-[#FF7B54] sm:text-6xl">
          AYO BELAJAR HURUF!
        </h1>
      </motion.div>

      {/* Baris Utama: Menu Kiri — Maskot Tengah — Menu Kanan */}
      <div className="flex w-full flex-col items-center justify-center gap-6 md:flex-row md:gap-4 lg:gap-8">
        {/* Menu 1: Huruf */}
        <MenuTile
          title="Huruf"
          subtitle="Mengenal Abjad A – Z"
          accentBg="#FFF6E5"
          badgeBg="#FFE5EC"
          isTapped={selectedTarget === 'alphabet' && phase === 'tapping'}
          disabled={phase !== 'idle'}
          onClick={() => handleMenuClick('alphabet')}
          icon={
            <div className="flex items-center gap-2">
              <span className="font-display flex h-14 w-14 -rotate-6 items-center justify-center rounded-2xl border-[3px] border-[#3D2314] bg-[#FF6B6B] text-3xl font-bold text-white shadow-[0_4px_0_#3D2314]">
                A
              </span>
              <span className="font-display flex h-14 w-14 translate-y-2 rotate-3 items-center justify-center rounded-2xl border-[3px] border-[#3D2314] bg-[#38BDF8] text-3xl font-bold text-white shadow-[0_4px_0_#3D2314]">
                b
              </span>
              <span className="font-display flex h-14 w-14 -rotate-3 items-center justify-center rounded-2xl border-[3px] border-[#3D2314] bg-[#FACC15] text-3xl font-bold text-[#3D2314] shadow-[0_4px_0_#3D2314]">
                c
              </span>
            </div>
          }
        />

        {/* Maskot Tengah (Klik untuk sapaan Deko) */}
        <motion.div
          role="button"
          tabIndex={0}
          onClick={handleMascotClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleMascotClick();
            }
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          animate={
            isGreeting
              ? { y: [0, -10, 0, -6, 0], rotate: [0, -3, 3, -2, 0] }
              : { y: 0, rotate: 0 }
          }
          transition={{ duration: 0.55 }}
          aria-label="Klik Deko untuk mendengar perkenalan"
          title="Klik aku!"
          className="relative my-1 shrink-0 cursor-pointer select-none focus:outline-none md:my-0"
        >
          <MascotPointer target={selectedTarget} phase={phase} />

          <AnimatePresence>
            {isGreeting && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                className="pointer-events-none absolute -bottom-3 left-1/2 z-20 w-max max-w-[260px] -translate-x-1/2 rounded-2xl border-[3px] border-[#3D2314] bg-[#FFD166] px-3.5 py-1.5 text-center font-display text-xs font-bold text-[#3D2314] shadow-[0_3px_0_#3D2314] sm:text-sm"
              >
                Halo! Aku Deko, Detektif Kosakata! 🔍
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Menu 2: Lengkapi Huruf */}
        <MenuTile
          title="Lengkapi Huruf"
          subtitle="Tebak Huruf yang Hilang"
          accentBg="#FFF6E5"
          badgeBg="#E0F7FA"
          isTapped={selectedTarget === 'missing-letter' && phase === 'tapping'}
          disabled={phase !== 'idle'}
          onClick={() => handleMenuClick('missing-letter')}
          icon={
            <div className="flex items-center gap-2">
              <span className="font-display flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-dashed border-[#F97316] bg-white text-3xl font-bold text-[#F97316]">
                ?
              </span>
              <span className="font-display text-3xl font-bold tracking-widest text-[#3D2314]">
                unga
              </span>
            </div>
          }
        />
      </div>
    </main>
  );
}