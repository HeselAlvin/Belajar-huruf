import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StorybookBackdrop } from './components/layout/StorybookBackdrop';
import { TopBar } from './components/layout/TopBar';
import { HomePage } from './pages/HomePage';
import { AlphabetPage } from './pages/AlphabetPage';
import { MissingLetterPage } from './pages/MissingLetterPage';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { MenuTarget } from './types/app';

export default function App() {
  const [activeMenu, setActiveMenu] = useState<MenuTarget | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const {
    playPop,
    playCorrect,
    playWrong,
    speakText,
    playLetter,
    playWord,
    playLetterThenWord,
    stopAll,
  } = useAudioPlayer(isMuted);

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
              onSpeakText={speakText}
              onStopAudio={stopAll}
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
            <MissingLetterPage
              onPlayPop={playPop}
              onPlayCorrect={playCorrect}
              onPlayWrong={playWrong}
              onSpeakText={speakText}
              onStopAudio={stopAll}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </StorybookBackdrop>
  );
}