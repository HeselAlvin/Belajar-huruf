import { useState } from 'react';
import { motion } from 'framer-motion';
import { ALPHABET_DATA } from '../data/alphabetData';
import { LetterGridCard } from '../components/alphabet/LetterGridCard';
import { LetterFocusModal } from '../components/alphabet/LetterFocusModal';
import type { AlphabetItem } from '../types/app';

type AlphabetTab = 'all' | 'a-l' | 'm-w' | 'x-z';

const TABS: { id: AlphabetTab; label: string; start: number; end: number }[] = [
  { id: 'all', label: 'Semua (A–Z)', start: 0, end: 26 },
  { id: 'a-l', label: 'A – L', start: 0, end: 12 },
  { id: 'm-w', label: 'M – W', start: 12, end: 23 },
  { id: 'x-z', label: 'X – Z', start: 23, end: 26 },
];

interface AlphabetPageProps {
  onPlayPop: (pitch?: number) => void;
  onPlayLetter: (item: AlphabetItem) => void;
  onPlayWord: (item: AlphabetItem) => void;
  onPlayLetterThenWord: (item: AlphabetItem) => void;
  onStopAudio: () => void;
}

export function AlphabetPage({
  onPlayPop,
  onPlayLetter,
  onPlayWord,
  onPlayLetterThenWord,
  onStopAudio,
}: AlphabetPageProps) {
  const [activeTab, setActiveTab] = useState<AlphabetTab>('a-l');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const visibleItems = ALPHABET_DATA.slice(currentTab.start, currentTab.end);

  const selectedItem =
    selectedIndex !== null ? ALPHABET_DATA[selectedIndex] : null;

  const handleSelect = (item: AlphabetItem) => {
    const idx = ALPHABET_DATA.findIndex((entry) => entry.id === item.id);
    setSelectedIndex(idx);
    onPlayPop(580);
    // Klik huruf -> bunyi huruf dulu ("A"), lalu muncul modal & bunyi benda ("Apel")
    onPlayLetterThenWord(item);
  };

  const handleClose = () => {
    onPlayPop(420);
    onStopAudio();
    setSelectedIndex(null);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    const prevIdx =
      (selectedIndex - 1 + ALPHABET_DATA.length) % ALPHABET_DATA.length;
    setSelectedIndex(prevIdx);
    onPlayPop(500);
    onPlayLetterThenWord(ALPHABET_DATA[prevIdx]);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    const nextIdx = (selectedIndex + 1) % ALPHABET_DATA.length;
    setSelectedIndex(nextIdx);
    onPlayPop(640);
    onPlayLetterThenWord(ALPHABET_DATA[nextIdx]);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pt-1 pb-14 sm:px-6">
      <p className="mb-4 text-center text-base font-bold text-[#3D2314]/80 sm:text-lg">
        Klik salah satu kartu huruf untuk mendengar suaranya! 🔊
      </p>

      {/* Tab Kelompok Huruf (A-L, M-W, X-Z, atau Semua) */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => {
                onPlayPop(520);
                setActiveTab(tab.id);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className={`btn-storybook cursor-pointer rounded-2xl px-4 py-2 font-display text-base font-bold text-[#3D2314] sm:px-5 sm:text-lg ${
                isActive ? 'bg-[#FFD166]' : 'bg-white'
              }`}
            >
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* Grid Kartu Alfabet */}
      <div
        key={activeTab}
        className={`mx-auto grid gap-4 sm:gap-5 ${
          activeTab === 'x-z'
            ? 'max-w-4xl grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
        }`}
      >
        {visibleItems.map((item, idx) => (
          <LetterGridCard
            key={item.id}
            item={item}
            index={idx}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Pop-up Fokus Huruf + Gambar + Suara */}
      <LetterFocusModal
        item={selectedItem}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
        onPlayLetter={onPlayLetter}
        onPlayWord={onPlayWord}
      />
    </main>
  );
}