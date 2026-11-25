import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function TopBar({
  title,
  showBack = false,
  onBack,
  isMuted,
  onToggleMute,
}: TopBarProps) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-5 pb-3 sm:px-6">
      <div className="w-14">
        {showBack && onBack && (
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            aria-label="Kembali ke Menu Utama"
            className="btn-storybook flex h-13 w-13 cursor-pointer items-center justify-center rounded-full bg-[#FFD166] text-[#3D2314]"
          >
            <ArrowLeft className="h-7 w-7 stroke-[3]" />
          </motion.button>
        )}
      </div>

      {title && (
        <h1 className="font-display text-center text-2xl font-bold tracking-wide text-[#3D2314] sm:text-4xl">
          {title}
        </h1>
      )}

      <div className="flex w-14 justify-end">
        <motion.button
          type="button"
          onClick={onToggleMute}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
          aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          className={`btn-storybook flex h-13 w-13 cursor-pointer items-center justify-center rounded-full text-[#3D2314] ${
            isMuted ? 'bg-[#E5E7EB]' : 'bg-[#A7F3D0]'
          }`}
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6 stroke-[2.8]" />
          ) : (
            <Volume2 className="h-6 w-6 stroke-[2.8]" />
          )}
        </motion.button>
      </div>
    </header>
  );
}