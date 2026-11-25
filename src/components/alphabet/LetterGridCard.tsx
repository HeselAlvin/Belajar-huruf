import { useState } from 'react';
import { motion } from 'framer-motion';
import type { AlphabetItem } from '../../types/app';

interface LetterGridCardProps {
  item: AlphabetItem;
  index: number;
  onSelect: (item: AlphabetItem) => void;
}

export function LetterGridCard({ item, index, onSelect }: LetterGridCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(item)}
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: Math.min(index * 0.025, 0.35),
        type: 'spring',
        stiffness: 280,
        damping: 20,
      }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.94, y: 2 }}
      className="group relative aspect-[7/6] w-full cursor-pointer overflow-hidden rounded-[22px] border-[3px] border-dashed border-[#3D2314] shadow-[0_5px_0_#3D2314] transition-shadow active:shadow-[0_2px_0_#3D2314]"
      style={{ backgroundColor: item.cardBg }}
      aria-label={`Huruf ${item.upper}, ${item.word}`}
    >
      {!imgError ? (
        <img
          src={item.image}
          alt={`${item.upper}${item.lower} ${item.word}`}
          onError={() => setImgError(true)}
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
        />
      ) : (
        /* Fallback otomatis kalau file PNG belum diekstrak */
        <div className="flex h-full w-full flex-col items-center justify-center p-3">
          <div className="flex items-center gap-2">
            <span
              className="font-display letter-outline text-5xl font-bold leading-none"
              style={{ color: item.letterColor }}
            >
              {item.upper}
              {item.lower}
            </span>
            <span className="text-5xl">{item.emoji}</span>
          </div>
          <span className="mt-2 font-display text-xl font-bold text-[#3D2314]">
            {item.word}
          </span>
        </div>
      )}
    </motion.button>
  );
}