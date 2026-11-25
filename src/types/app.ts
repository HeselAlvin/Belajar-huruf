export type PageView = 'home' | 'alphabet' | 'missing-letter';

export type MenuTarget = 'alphabet' | 'missing-letter';

export interface AlphabetItem {
  id: string;
  upper: string;
  lower: string;
  word: string;
  emoji: string;        // Fallback ilustrasi otomatis jika PNG belum dimasukkan
  image: string;        // Path PNG di public/assets/images/alphabet/
  letterAudio: string;  // Path MP3 huruf di public/assets/audio/letters/
  wordAudio: string;    // Path MP3 kata di public/assets/audio/words/
  cardBg: string;       // Warna latar kartu pastel
  letterColor: string;  // Warna isi huruf
}