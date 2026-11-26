import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';
import { MISSING_LETTER_QUESTIONS } from '../data/missingLetterData';

interface MissingLetterPageProps {
  onPlayPop: (pitch?: number) => void;
  onPlayCorrect: (spokenFeedback?: string) => void;
  onPlayWrong: (spokenCorrection?: string) => void;
  onSpeakText: (text: string) => void;
  onStopAudio: () => void;
}

const LETTER_COLORS: Record<string, { outer: string; inner: string }> = {
  p: { outer: '#6CC424', inner: '#8CE043' },
  b: { outer: '#2B93E8', inner: '#56B4FF' },
  d: { outer: '#F47E1A', inner: '#FFA347' },
  q: { outer: '#E52B2B', inner: '#FF5757' },
  f: { outer: '#9E47E5', inner: '#BF76FF' },
  v: { outer: '#D83B74', inner: '#F46297' },
};

export function MissingLetterPage({
  onPlayPop,
  onPlayCorrect,
  onPlayWrong,
  onSpeakText,
  onStopAudio,
}: MissingLetterPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [clickedLetter, setClickedLetter] = useState<string | null>(null);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [imgError, setImgError] = useState(false);

  const speakRef = useRef(onSpeakText);
  speakRef.current = onSpeakText;
  const autoSpeakTimerRef = useRef<number | null>(null);

  const total = MISSING_LETTER_QUESTIONS.length;
  const question = MISSING_LETTER_QUESTIONS[currentIndex];
  const letters = question.word.split('');

  const clearAutoSpeak = () => {
    if (autoSpeakTimerRef.current) {
      window.clearTimeout(autoSpeakTimerRef.current);
      autoSpeakTimerRef.current = null;
    }
  };

  useEffect(() => {
    setStatus('idle');
    setClickedLetter(null);
    setImgError(false);

    if (isFinished) return;

    clearAutoSpeak();
    autoSpeakTimerRef.current = window.setTimeout(() => {
      speakRef.current(question.word);
    }, 280);

    return () => clearAutoSpeak();
  }, [currentIndex, isFinished, question.word]);

  const handleLetterClick = (letter: string) => {
    clearAutoSpeak();
    setClickedLetter(letter);
    const upperAnswer = question.answer.toUpperCase();

    if (letter.toLowerCase() === question.answer.toLowerCase()) {
      setStatus('correct');
      setCorrectIds((prev) =>
        prev.includes(question.id) ? prev : [...prev, question.id]
      );
      onPlayCorrect(`Hebat! Huruf ${upperAnswer}, ${question.word}`);
    } else {
      setStatus('wrong');
      onPlayWrong(`Ups, salah. Harusnya huruf ${upperAnswer}, ${question.word}`);
    }
  };

  const handleNext = () => {
    clearAutoSpeak();
    onStopAudio();
    onPlayPop(620);
    if (currentIndex + 1 < total) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    clearAutoSpeak();
    onStopAudio();
    onPlayPop(460);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleRestart = () => {
    clearAutoSpeak();
    onStopAudio();
    onPlayPop(560);
    setCurrentIndex(0);
    setCorrectIds([]);
    setIsFinished(false);
    setStatus('idle');
    setClickedLetter(null);
  };

  if (isFinished) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 pb-8">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full rounded-[30px] border-[4px] border-[#3D2314] bg-white p-6 text-center shadow-[0_8px_0_#3D2314] sm:p-8"
        >
          <div className="mb-2 text-6xl">🏆</div>
          <h2 className="font-display text-2xl font-bold text-[#3D2314] sm:text-3xl">
            Hore, Semua Selesai!
          </h2>
          <p className="mt-2 text-base font-extrabold text-[#3D2314]/80 sm:text-lg">
            Kamu berhasil menjawab benar{' '}
            <span className="text-[#16A34A]">{correctIds.length}</span> dari{' '}
            <span>{total}</span> soal!
          </p>

          <motion.button
            type="button"
            onClick={handleRestart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="btn-storybook mt-6 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[#FFD166] px-6 py-3 font-display text-lg font-bold text-[#3D2314]"
          >
            <RotateCcw className="h-5 w-5 stroke-[2.8]" />
            Main Lagi
          </motion.button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col px-3 pt-0 pb-4 sm:px-5">
      {/* Bar Progres Compact */}
      <div className="mb-2.5 flex items-center justify-between gap-2.5">
        <span className="rounded-full border-[2.5px] border-[#3D2314] bg-[#FFD166] px-3 py-0.5 font-display text-xs font-bold text-[#3D2314] shadow-[0_2px_0_#3D2314] sm:px-3.5 sm:text-sm">
          Soal {currentIndex + 1} / {total}
        </span>

        <div className="h-3.5 flex-1 overflow-hidden rounded-full border-[2.5px] border-[#3D2314] bg-white">
          <motion.div
            className="h-full bg-[#4ADE80]"
            animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          />
        </div>

        <span className="rounded-full border-[2.5px] border-[#3D2314] bg-[#BBF7D0] px-3 py-0.5 font-display text-xs font-bold text-[#3D2314] shadow-[0_2px_0_#3D2314] sm:px-3.5 sm:text-sm">
          ⭐ {correctIds.length}
        </span>
      </div>

      {/* Bingkai Biru Langit Berbintang (Compact agar muat 1 layar) */}
      <div className="relative overflow-hidden rounded-[26px] border-[3.5px] border-[#3D2314] bg-gradient-to-b from-[#9EDBFF] via-[#BCE8FF] to-[#9AD8FF] p-2.5 shadow-[0_7px_0_#3D2314] sm:rounded-[30px] sm:p-3.5">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1.5 left-3 text-lg text-[#FACC15] sm:text-xl"
        >
          ★
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1.5 right-3 text-lg text-[#FACC15] sm:text-xl"
        >
          ★
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1.5 left-2.5 text-base text-[#FB7185]"
        >
          ★
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 bottom-1.5 text-base text-[#A855F7]"
        >
          ★
        </span>

        {/* Papan Putih Utama */}
        <div className="relative rounded-[20px] border-[2.5px] border-[#3D2314]/15 bg-white px-3 py-3 shadow-inner sm:rounded-[22px] sm:px-6 sm:py-4">
          <p className="text-center font-display text-base font-bold text-[#3D2314] sm:text-xl">
            Lengkapi Huruf yang Hilang!
          </p>

          {/* Ilustrasi Benda */}
          <div className="mt-2 flex flex-col items-center">
            <motion.button
              key={question.id}
              type="button"
              onClick={() => {
                clearAutoSpeak();
                onPlayPop(540);
                onSpeakText(question.word);
              }}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex h-28 w-40 cursor-pointer items-center justify-center rounded-2xl bg-[#FFFDF8] p-1.5 sm:h-36 sm:w-48"
              title="Klik untuk dengar nama gambar"
            >
              {!imgError ? (
                <img
                  src={question.image}
                  alt={question.word}
                  onError={() => setImgError(true)}
                  draggable={false}
                  className="max-h-full max-w-full object-contain drop-shadow-sm"
                />
              ) : (
                <span className="text-7xl leading-none sm:text-8xl">
                  {question.emoji}
                </span>
              )}

              <span className="absolute right-1 bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#3D2314] bg-[#FFD166] text-[#3D2314] shadow-[0_2px_0_#3D2314] transition-transform group-hover:scale-110">
                <Volume2 className="h-4 w-4 stroke-[2.8]" />
              </span>
            </motion.button>

            {/* Susunan Kata dengan Kotak Huruf Hilang */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
              {letters.map((char, idx) => {
                if (idx === question.missingIndex) {
                  const showAnswer = status === 'correct';
                  const isWrong = status === 'wrong';

                  return (
                    <motion.div
                      key="missing-slot"
                      animate={
                        isWrong
                          ? { x: [0, -7, 7, -5, 5, 0] }
                          : showAnswer
                            ? { scale: [1, 1.15, 1] }
                            : {}
                      }
                      transition={{ duration: 0.35 }}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-dashed font-display text-3xl font-bold sm:h-14 sm:w-14 sm:rounded-2xl sm:text-4xl ${
                        showAnswer
                          ? 'border-[#16A34A] bg-[#DCFCE7] text-[#15803D]'
                          : isWrong
                            ? 'border-[#EF4444] bg-[#FEE2E2] text-[#DC2626]'
                            : 'border-[#F97316] bg-[#FFF7ED] text-[#F97316]'
                      }`}
                    >
                      {showAnswer ? (
                        question.answer
                      ) : isWrong ? (
                        <span className="opacity-85">{question.answer}</span>
                      ) : (
                        <span className="mt-4 block h-1 w-7 rounded-full bg-[#F97316]" />
                      )}
                    </motion.div>
                  );
                }

                return (
                  <span
                    key={`${idx}-${char}`}
                    className="font-display text-4xl font-bold tracking-wide text-[#3D2314] sm:text-5xl"
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Banner Feedback Compact */}
            <div className="mt-2 flex min-h-[34px] items-center justify-center">
              <AnimatePresence mode="wait">
                {status === 'correct' && (
                  <motion.div
                    key="correct-banner"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border-[2.5px] border-[#15803D] bg-[#DCFCE7] px-3.5 py-1 text-center font-display text-xs font-bold text-[#166534] sm:text-sm"
                  >
                    🎉 Hebat! Jawabannya huruf “
                    {question.answer.toUpperCase()}” ({question.word})
                  </motion.div>
                )}

                {status === 'wrong' && (
                  <motion.div
                    key="wrong-banner"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border-[2.5px] border-[#DC2626] bg-[#FEE2E2] px-3.5 py-1 text-center font-display text-xs font-bold text-[#991B1B] sm:text-sm"
                  >
                    Ups, kurang tepat! Harusnya huruf{' '}
                    <span className="underline">
                      “{question.answer.toUpperCase()}”
                    </span>{' '}
                    ({question.word})
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 6 Tombol Huruf: 3x2 rapi di HP, 1 baris 6 tombol di tablet/laptop */}
          <div className="mx-auto mt-3 grid max-w-xs grid-cols-3 justify-items-center gap-3 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            {question.options.map((opt, idx) => {
              const palette =
                LETTER_COLORS[opt.toLowerCase()] ?? LETTER_COLORS.p;
              const isCorrectOption =
                opt.toLowerCase() === question.answer.toLowerCase();
              const isSelectedWrong =
                status === 'wrong' && clickedLetter === opt && !isCorrectOption;
              const shouldHintCorrect = status === 'wrong' && isCorrectOption;

              return (
                <motion.button
                  key={`${question.id}-${opt}-${idx}`}
                  type="button"
                  onClick={() => handleLetterClick(opt)}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.9, y: 2 }}
                  animate={
                    shouldHintCorrect
                      ? { scale: [1, 1.12, 1], y: [0, -5, 0] }
                      : isSelectedWrong
                        ? { x: [0, -5, 5, -4, 4, 0] }
                        : {}
                  }
                  transition={
                    shouldHintCorrect
                      ? { duration: 0.7, repeat: 2 }
                      : { duration: 0.25 }
                  }
                  aria-label={`Pilih huruf ${opt}`}
                  className={`relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-[3px] font-display text-2xl font-bold text-[#3D2314] shadow-[0_5px_0_#3D2314] transition-shadow active:shadow-[0_2px_0_#3D2314] sm:h-16 sm:w-16 sm:text-3xl ${
                    shouldHintCorrect
                      ? 'ring-4 ring-[#22C55E] ring-offset-2'
                      : isSelectedWrong
                        ? 'opacity-70 ring-4 ring-[#EF4444] ring-offset-2'
                        : ''
                  }`}
                  style={{
                    backgroundColor: palette.outer,
                    borderColor: '#3D2314',
                  }}
                >
                  <span
                    className="flex h-[82%] w-[82%] items-center justify-center rounded-full border-2 border-white/45 shadow-inner"
                    style={{ backgroundColor: palette.inner }}
                  >
                    {opt}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tombol Navigasi Bawah */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <motion.button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          whileHover={currentIndex > 0 ? { scale: 1.04 } : {}}
          whileTap={currentIndex > 0 ? { scale: 0.94 } : {}}
          className={`btn-storybook flex items-center gap-1 rounded-2xl bg-white px-4 py-2 font-display text-sm font-bold text-[#3D2314] sm:px-5 sm:py-2.5 sm:text-base ${
            currentIndex === 0
              ? 'cursor-not-allowed opacity-45'
              : 'cursor-pointer'
          }`}
        >
          <ChevronLeft className="h-5 w-5 stroke-[3]" />
          Sebelumnya
        </motion.button>

        <motion.button
          type="button"
          onClick={handleNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          animate={status !== 'idle' ? { scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 0.4 }}
          className={`btn-storybook flex cursor-pointer items-center gap-1 rounded-2xl px-5 py-2 font-display text-sm font-bold text-[#3D2314] sm:px-6 sm:py-2.5 sm:text-base ${
            status !== 'idle' ? 'bg-[#4ADE80]' : 'bg-[#FFD166]'
          }`}
        >
          {currentIndex + 1 === total ? 'Selesai 🎉' : 'Lanjut'}
          <ChevronRight className="h-5 w-5 stroke-[3]" />
        </motion.button>
      </div>
    </main>
  );
}