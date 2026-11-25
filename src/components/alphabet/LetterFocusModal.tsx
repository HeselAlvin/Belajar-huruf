import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, X } from 'lucide-react';
import type { AlphabetItem } from '../../types/app';

interface LetterFocusModalProps {
  item: AlphabetItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onPlayLetter: (item: AlphabetItem) => void;
  onPlayWord: (item: AlphabetItem) => void;
}

export function LetterFocusModal({
  item,
  onClose,
  onPrev,
  onNext,
  onPlayLetter,
  onPlayWord,
}: LetterFocusModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [item?.id]);

  // Bisa digeser pakai tombol panah keyboard & tutup pakai Esc
  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#3D2314]/55 p-4 backdrop-blur-[2px]"
        >
          <motion.div
            key={item.id}
            initial={{ scale: 0.72, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.82, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-[34px] border-[4px] border-[#3D2314] bg-[#FFF8EE] p-5 shadow-[0_10px_0_#3D2314] sm:p-7"
          >
            {/* Tombol Tutup */}
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Tutup"
              className="btn-storybook absolute -top-4 -right-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#FF6B6B] text-white"
            >
              <X className="h-7 w-7 stroke-[3]" />
            </motion.button>

            {/* Kartu Besar (klik kartunya untuk ulang suara benda) */}
            <motion.button
              type="button"
              onClick={() => onPlayWord(item)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="block aspect-[7/6] w-full cursor-pointer overflow-hidden rounded-[26px] border-[3px] border-dashed border-[#3D2314] shadow-[0_5px_0_#3D2314]"
              style={{ backgroundColor: item.cardBg }}
            >
              {!imgError ? (
                <img
                  src={item.image}
                  alt={`${item.upper}${item.lower} ${item.word}`}
                  onError={() => setImgError(true)}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6">
                  <div className="flex items-center gap-4">
                    <span
                      className="font-display letter-outline text-8xl font-bold leading-none"
                      style={{ color: item.letterColor }}
                    >
                      {item.upper}
                      {item.lower}
                    </span>
                    <span className="text-8xl">{item.emoji}</span>
                  </div>
                  <span className="mt-4 font-display text-4xl font-bold text-[#3D2314]">
                    {item.word}
                  </span>
                </div>
              )}
            </motion.button>

            {/* Tombol Putar Ulang Suara Huruf & Kata */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <motion.button
                type="button"
                onClick={() => onPlayLetter(item)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="btn-storybook flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#FFD166] px-4 py-3 font-display text-lg font-bold text-[#3D2314]"
              >
                <Volume2 className="h-5 w-5 stroke-[2.8]" />
                Huruf “{item.upper}”
              </motion.button>

              <motion.button
                type="button"
                onClick={() => onPlayWord(item)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="btn-storybook flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#A7F3D0] px-4 py-3 font-display text-lg font-bold text-[#3D2314]"
              >
                <Volume2 className="h-5 w-5 stroke-[2.8]" />
                {item.word}
              </motion.button>
            </div>

            {/* Navigasi Sebelumnya & Selanjutnya */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <motion.button
                type="button"
                onClick={onPrev}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                className="btn-storybook flex cursor-pointer items-center gap-1.5 rounded-2xl bg-white px-4 py-2.5 font-display text-base font-bold text-[#3D2314] sm:px-5 sm:text-lg"
              >
                <ChevronLeft className="h-6 w-6 stroke-[3]" />
                Sebelumnya
              </motion.button>

              <motion.button
                type="button"
                onClick={onNext}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                className="btn-storybook flex cursor-pointer items-center gap-1.5 rounded-2xl bg-white px-4 py-2.5 font-display text-base font-bold text-[#3D2314] sm:px-5 sm:text-lg"
              >
                Selanjutnya
                <ChevronRight className="h-6 w-6 stroke-[3]" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}