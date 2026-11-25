import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuTileProps {
  title: string;
  subtitle: string;
  accentBg: string;
  badgeBg: string;
  icon: ReactNode;
  isTapped: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function MenuTile({
  title,
  subtitle,
  accentBg,
  badgeBg,
  icon,
  isTapped,
  disabled,
  onClick,
}: MenuTileProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.04, y: -4 }}
      animate={
        isTapped
          ? { scale: [1, 0.9, 1.08, 1], rotate: [0, -3, 3, 0] }
          : { scale: 1, rotate: 0 }
      }
      transition={{ duration: 0.35 }}
      className={`btn-storybook relative flex w-full max-w-[290px] cursor-pointer flex-col items-center rounded-[32px] p-6 text-center disabled:cursor-default ${
        isTapped ? 'btn-storybook-pressed' : ''
      }`}
      style={{ backgroundColor: accentBg }}
    >
      {/* Percikan Bintang saat diketuk pensil maskot */}
      <AnimatePresence>
        {isTapped && (
          <>
            <motion.span
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{ scale: 1.4, opacity: 0, x: -55, y: -55 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="pointer-events-none absolute top-4 left-6 text-3xl text-[#FACC15]"
            >
              ✦
            </motion.span>
            <motion.span
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{ scale: 1.5, opacity: 0, x: 60, y: -48 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="pointer-events-none absolute top-4 right-6 text-3xl text-[#FB7185]"
            >
              ★
            </motion.span>
            <motion.span
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{ scale: 1.3, opacity: 0, x: 0, y: -70 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="pointer-events-none absolute top-2 text-2xl text-[#38BDF8]"
            >
              ✨
            </motion.span>
          </>
        )}
      </AnimatePresence>

      {/* Visual Ikon Menu */}
      <div
        className="mb-4 flex h-32 w-full items-center justify-center rounded-3xl border-[3px] border-dashed border-[#3D2314]/35"
        style={{ backgroundColor: badgeBg }}
      >
        {icon}
      </div>

      <span className="font-display text-2xl font-bold text-[#3D2314] sm:text-3xl">
        {title}
      </span>
      <span className="mt-1 text-sm font-bold text-[#3D2314]/75">
        {subtitle}
      </span>
    </motion.button>
  );
}