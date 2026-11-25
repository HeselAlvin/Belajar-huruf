import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StorybookBackdrop } from './components/layout/StorybookBackdrop';
import { TopBar } from './components/layout/TopBar';
import { HomePage } from './pages/HomePage';
import { AlphabetPage } from './pages/AlphabetPage';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { MenuTarget } from './types/app';

export default function App() {
  const [activeMenu, setActiveMenu] = useState<MenuTarget | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const { playPop, playLetter, playWord, playLetterThenWord, stopAll } =
    useAudioPlayer(isMuted);

  const backToHome = () => {
    stopAll();
    playPop(440);
    setActiveMenu(null);
  };

  const pageTitle =
    activeMenu === 'alphabet'
      ? 'BELAJAR ALFABET A – Z'
      : activeMenu === 'missing-letter'
        ? 'LENGKAPI HURUF'
        : undefined;

  return (
    <StorybookBackdrop variant={activeMenu === null ? 'sky' : 'cream'}>
      <TopBar
        title={pageTitle}
        showBack={activeMenu !== null}
        onBack={backToHome}
        isMuted={isMuted}
        onToggleMute={() => {
          if (!isMuted) stopAll();
          setIsMuted((prev) => !prev);
        }}
      />

      <AnimatePresence mode="wait">
        {activeMenu === null && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            <HomePage
              onSelectMenu={(target) => setActiveMenu(target)}
              onPlayPop={playPop}
            />
          </motion.div>
        )}

        {activeMenu === 'alphabet' && (
          <motion.div
            key="alphabet"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            <AlphabetPage
              onPlayPop={playPop}
              onPlayLetter={playLetter}
              onPlayWord={playWord}
              onPlayLetterThenWord={playLetterThenWord}
              onStopAudio={stopAll}
            />
          </motion.div>
        )}

        {activeMenu === 'missing-letter' && (
          <motion.div
            key="missing-letter"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
              <div className="w-full rounded-[28px] border-[4px] border-[#3D2314] bg-white p-8 shadow-[0_8px_0_#3D2314]">
                <div className="mb-3 text-6xl">🌸</div>
                <h2 className="font-display text-3xl font-bold text-[#3D2314]">
                  Lengkapi Huruf
                </h2>
                <p className="mt-2 font-bold text-[#3D2314]/70">
                  Siap kita kerjakan lanjutannya setelah halaman Huruf A–Z aman!
                </p>
                <button
                  type="button"
                  onClick={backToHome}
                  className="btn-storybook mt-6 cursor-pointer rounded-2xl bg-[#FFD166] px-6 py-3 font-display text-lg font-bold text-[#3D2314]"
                >
                  Balik ke Menu Utama
                </button>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </StorybookBackdrop>
  );
}