export interface MissingLetterQuestion {
  id: string;
  word: string;
  missingIndex: number;
  answer: string;
  options: string[];
  image: string;
  emoji: string;
}

export const MISSING_LETTER_QUESTIONS: MissingLetterQuestion[] = [
  {
    id: 'q1',
    word: 'pisang',
    missingIndex: 0,
    answer: 'p',
    options: ['p', 'b', 'd', 'q', 'f', 'v'],
    image: '/assets/images/quiz/pisang.png',
    emoji: '🍌',
  },
  {
    id: 'q2',
    word: 'bunga',
    missingIndex: 0,
    answer: 'b',
    options: ['p', 'v', 'f', 'q', 'd', 'b'],
    image: '/assets/images/quiz/bunga.png',
    emoji: '🌸',
  },
  {
    id: 'q3',
    word: 'kebun',
    missingIndex: 2,
    answer: 'b',
    options: ['v', 'd', 'f', 'q', 'b', 'p'],
    image: '/assets/images/quiz/kebun.png',
    emoji: '🌿',
  },
  {
    id: 'q4',
    word: 'sofa',
    missingIndex: 2,
    answer: 'f',
    options: ['f', 'b', 'd', 'q', 'p', 'v'],
    image: '/assets/images/quiz/sofa.png',
    emoji: '🛋️',
  },
  {
    id: 'q5',
    word: 'babi',
    missingIndex: 0,
    answer: 'b',
    options: ['p', 'q', 'b', 'd', 'f', 'v'],
    image: '/assets/images/quiz/babi.png',
    emoji: '🐷',
  },
  {
    id: 'q6',
    word: 'sepeda',
    missingIndex: 4,
    answer: 'd',
    options: ['b', 'p', 'f', 'q', 'd', 'v'],
    image: '/assets/images/quiz/sepeda.png',
    emoji: '🚲',
  },
  {
    id: 'q7',
    word: 'sapu',
    missingIndex: 2,
    answer: 'p',
    options: ['d', 'b', 'p', 'q', 'f', 'v'],
    image: '/assets/images/quiz/sapu.png',
    emoji: '🧹',
  },
  {
    id: 'q8',
    word: 'televisi',
    missingIndex: 4,
    answer: 'v',
    options: ['v', 'b', 'f', 'q', 'd', 'p'],
    image: '/assets/images/quiz/televisi.png',
    emoji: '📺',
  },
  {
    id: 'q9',
    word: 'foto',
    missingIndex: 0,
    answer: 'f',
    options: ['p', 'v', 'd', 'q', 'b', 'f'],
    image: '/assets/images/quiz/foto.png',
    emoji: '🖼️',
  },
  {
    id: 'q10',
    word: 'vas',
    missingIndex: 0,
    answer: 'v',
    options: ['p', 'b', 'd', 'v', 'f', 'q'],
    image: '/assets/images/quiz/vas.png',
    emoji: '🏺',
  },
  {
    id: 'q11',
    word: 'lava',
    missingIndex: 2,
    answer: 'v',
    options: ['p', 'v', 'q', 'd', 'f', 'b'],
    image: '/assets/images/quiz/lava.png',
    emoji: '🌋',
  },
  {
    id: 'q12',
    word: 'daun',
    missingIndex: 0,
    answer: 'd',
    options: ['d', 'b', 'p', 'q', 'f', 'v'],
    image: '/assets/images/quiz/daun.png',
    emoji: '🍃',
  },
];