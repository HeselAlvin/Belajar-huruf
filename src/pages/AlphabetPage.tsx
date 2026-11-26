import { useState } from 'react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { LetterGridCard } from '../components/alphabet/LetterGridCard';
import { LetterFocusModal } from '../components/alphabet/LetterFocusModal';
import type { AlphabetItem } from '../types/app';

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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedItem =
    selectedIndex !== null ? ALPHABET_DATA[selectedIndex] : null;

  const handleSelect = (item: AlphabetItem) => {
    const idx = ALPHABET_DATA.findIndex((entry) => entry.id === item.id);
    setSelectedIndex(idx);
    onPlayPop(580);
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
    <main className="mx-auto max-w-6xl px-4 pt-2 pb-14 sm:px-6">
      {/* Grid Langsung Tampil Semua Kartu A - Z */}
      <div className="mx-auto grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4">
        {ALPHABET_DATA.map((item, idx) => (
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