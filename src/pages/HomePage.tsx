import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MascotPointer } from '../components/home/MascotPointer';
import { MenuTile } from '../components/home/MenuTile';
import type { MenuTarget } from '../types/app';

interface HomePageProps {
  onSelectMenu: (target: MenuTarget) => void;
  onPlayPop: (pitch?: number) => void;
}

export function HomePage({ onSelectMenu, onPlayPop }: HomePageProps) {
  const [selectedTarget, setSelectedTarget] = useState<MenuTarget | null>(null);
  const [phase, setPhase] = useState<'idle' | 'moving' | 'tapping'>('idle');
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handleMenuClick = (target: MenuTarget) => {
    if (phase !== 'idle') return;

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

        {/* Maskot Tengah */}
        <div className="my-1 shrink-0 md:my-0">
          <MascotPointer target={selectedTarget} phase={phase} />
        </div>

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