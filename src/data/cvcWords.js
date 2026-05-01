// /src/data/cvcWords.js
//
// CVC (Consonant-Vowel-Consonant) words for blending practice.
// Each word has exactly 3 letters and a recognizable emoji.
//
// The child sees the 3 letters, hears each sound individually,
// then hears them blended together. They then pick the matching
// picture from 3 choices.
//
// Organized by short vowel so the game can ensure variety.

const cvcWords = [
  // ─── Short A ─────────────────────────
  { word: 'cat', letters: ['c', 'a', 't'], sounds: ['kuh', 'ah', 'tuh'], emoji: '🐱', vowel: 'a' },
  { word: 'bat', letters: ['b', 'a', 't'], sounds: ['buh', 'ah', 'tuh'], emoji: '🦇', vowel: 'a' },
  { word: 'hat', letters: ['h', 'a', 't'], sounds: ['huh', 'ah', 'tuh'], emoji: '🎩', vowel: 'a' },
  { word: 'map', letters: ['m', 'a', 'p'], sounds: ['mmm', 'ah', 'puh'], emoji: '🗺️', vowel: 'a' },
  { word: 'van', letters: ['v', 'a', 'n'], sounds: ['vvv', 'ah', 'nnn'], emoji: '🚐', vowel: 'a' },
  { word: 'fan', letters: ['f', 'a', 'n'], sounds: ['fff', 'ah', 'nnn'], emoji: '🪭', vowel: 'a' },
  { word: 'jam', letters: ['j', 'a', 'm'], sounds: ['juh', 'ah', 'mmm'], emoji: '🍯', vowel: 'a' },

  // ─── Short E ─────────────────────────
  { word: 'bed', letters: ['b', 'e', 'd'], sounds: ['buh', 'eh', 'duh'], emoji: '🛏️', vowel: 'e' },
  { word: 'hen', letters: ['h', 'e', 'n'], sounds: ['huh', 'eh', 'nnn'], emoji: '🐔', vowel: 'e' },
  { word: 'net', letters: ['n', 'e', 't'], sounds: ['nnn', 'eh', 'tuh'], emoji: '🥅', vowel: 'e' },
  { word: 'pen', letters: ['p', 'e', 'n'], sounds: ['puh', 'eh', 'nnn'], emoji: '🖊️', vowel: 'e' },
  { word: 'ten', letters: ['t', 'e', 'n'], sounds: ['tuh', 'eh', 'nnn'], emoji: '🔟', vowel: 'e' },
  { word: 'web', letters: ['w', 'e', 'b'], sounds: ['wuh', 'eh', 'buh'], emoji: '🕸️', vowel: 'e' },
  { word: 'jet', letters: ['j', 'e', 't'], sounds: ['juh', 'eh', 'tuh'], emoji: '✈️', vowel: 'e' },

  // ─── Short I ─────────────────────────
  { word: 'pig', letters: ['p', 'i', 'g'], sounds: ['puh', 'ih', 'guh'], emoji: '🐷', vowel: 'i' },
  { word: 'bin', letters: ['b', 'i', 'n'], sounds: ['buh', 'ih', 'nnn'], emoji: '🗑️', vowel: 'i' },
  { word: 'fin', letters: ['f', 'i', 'n'], sounds: ['fff', 'ih', 'nnn'], emoji: '🦈', vowel: 'i' },
  { word: 'sit', letters: ['s', 'i', 't'], sounds: ['sss', 'ih', 'tuh'], emoji: '🪑', vowel: 'i' },
  { word: 'zip', letters: ['z', 'i', 'p'], sounds: ['zzz', 'ih', 'puh'], emoji: '🤐', vowel: 'i' },
  { word: 'wig', letters: ['w', 'i', 'g'], sounds: ['wuh', 'ih', 'guh'], emoji: '💇', vowel: 'i' },
  { word: 'kit', letters: ['k', 'i', 't'], sounds: ['kuh', 'ih', 'tuh'], emoji: '🧰', vowel: 'i' },

  // ─── Short O ─────────────────────────
  { word: 'dog', letters: ['d', 'o', 'g'], sounds: ['duh', 'oh', 'guh'], emoji: '🐶', vowel: 'o' },
  { word: 'log', letters: ['l', 'o', 'g'], sounds: ['lll', 'oh', 'guh'], emoji: '🪵', vowel: 'o' },
  { word: 'fox', letters: ['f', 'o', 'x'], sounds: ['fff', 'oh', 'ks'], emoji: '🦊', vowel: 'o' },
  { word: 'box', letters: ['b', 'o', 'x'], sounds: ['buh', 'oh', 'ks'], emoji: '📦', vowel: 'o' },
  { word: 'pot', letters: ['p', 'o', 't'], sounds: ['puh', 'oh', 'tuh'], emoji: '🍲', vowel: 'o' },
  { word: 'hop', letters: ['h', 'o', 'p'], sounds: ['huh', 'oh', 'puh'], emoji: '🐇', vowel: 'o' },
  { word: 'mop', letters: ['m', 'o', 'p'], sounds: ['mmm', 'oh', 'puh'], emoji: '🧹', vowel: 'o' },

  // ─── Short U ─────────────────────────
  { word: 'bug', letters: ['b', 'u', 'g'], sounds: ['buh', 'uh', 'guh'], emoji: '🐛', vowel: 'u' },
  { word: 'bus', letters: ['b', 'u', 's'], sounds: ['buh', 'uh', 'sss'], emoji: '🚌', vowel: 'u' },
  { word: 'cup', letters: ['c', 'u', 'p'], sounds: ['kuh', 'uh', 'puh'], emoji: '☕', vowel: 'u' },
  { word: 'sun', letters: ['s', 'u', 'n'], sounds: ['sss', 'uh', 'nnn'], emoji: '☀️', vowel: 'u' },
  { word: 'nut', letters: ['n', 'u', 't'], sounds: ['nnn', 'uh', 'tuh'], emoji: '🥜', vowel: 'u' },
  { word: 'mud', letters: ['m', 'u', 'd'], sounds: ['mmm', 'uh', 'duh'], emoji: '🟫', vowel: 'u' },
  { word: 'tub', letters: ['t', 'u', 'b'], sounds: ['tuh', 'uh', 'buh'], emoji: '🛁', vowel: 'u' },
];

export default cvcWords;
