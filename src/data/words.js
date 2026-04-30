// /src/data/words.js
//
// 52 words covering every letter A–Z, with two words per letter.
//
// Each entry follows the spec:
//   word, image, correct, options (3 letters incl. correct), phonicsSound, wordSound
// Plus two MVP-friendly extras:
//   emoji   — always-render visual fallback (used when /assets/images/<file>.png is missing)
//   phoneme — spoken fallback (used when /assets/sounds/phonics/<x>.mp3 is missing)
//
// Distractor strategy: wrong options are letters that are visually or
// phonetically confusable (b/d/p, m/n, f/v, c/k/s, etc.) so the game
// actually trains sound discrimination, not just guessing.

const words = [
  // ─── A ───────────────────────────────
  {
    word: 'apple',
    emoji: '🍎',
    image: '/assets/images/apple.png',
    correct: 'a',
    options: ['a', 'e', 'o'],
    phonicsSound: '/assets/sounds/phonics/a.mp3',
    wordSound: '/assets/sounds/words/apple.mp3',
    phoneme: 'ah',
  },
  {
    word: 'ant',
    emoji: '🐜',
    image: '/assets/images/ant.png',
    correct: 'a',
    options: ['a', 'i', 'u'],
    phonicsSound: '/assets/sounds/phonics/a.mp3',
    wordSound: '/assets/sounds/words/ant.mp3',
    phoneme: 'ah',
  },

  // ─── B ───────────────────────────────
  {
    word: 'ball',
    emoji: '⚽',
    image: '/assets/images/ball.png',
    correct: 'b',
    options: ['b', 'd', 'p'],
    phonicsSound: '/assets/sounds/phonics/b.mp3',
    wordSound: '/assets/sounds/words/ball.mp3',
    phoneme: 'buh',
  },
  {
    word: 'bear',
    emoji: '🐻',
    image: '/assets/images/bear.png',
    correct: 'b',
    options: ['b', 'd', 't'],
    phonicsSound: '/assets/sounds/phonics/b.mp3',
    wordSound: '/assets/sounds/words/bear.mp3',
    phoneme: 'buh',
  },

  // ─── C ───────────────────────────────
  {
    word: 'cat',
    emoji: '🐱',
    image: '/assets/images/cat.png',
    correct: 'c',
    options: ['c', 'k', 's'],
    phonicsSound: '/assets/sounds/phonics/c.mp3',
    wordSound: '/assets/sounds/words/cat.mp3',
    phoneme: 'kuh',
  },
  {
    word: 'cow',
    emoji: '🐮',
    image: '/assets/images/cow.png',
    correct: 'c',
    options: ['c', 'g', 'o'],
    phonicsSound: '/assets/sounds/phonics/c.mp3',
    wordSound: '/assets/sounds/words/cow.mp3',
    phoneme: 'kuh',
  },

  // ─── D ───────────────────────────────
  {
    word: 'dog',
    emoji: '🐶',
    image: '/assets/images/dog.png',
    correct: 'd',
    options: ['d', 'b', 'p'],
    phonicsSound: '/assets/sounds/phonics/d.mp3',
    wordSound: '/assets/sounds/words/dog.mp3',
    phoneme: 'duh',
  },
  {
    word: 'duck',
    emoji: '🦆',
    image: '/assets/images/duck.png',
    correct: 'd',
    options: ['d', 'b', 't'],
    phonicsSound: '/assets/sounds/phonics/d.mp3',
    wordSound: '/assets/sounds/words/duck.mp3',
    phoneme: 'duh',
  },

  // ─── E ───────────────────────────────
  {
    word: 'elephant',
    emoji: '🐘',
    image: '/assets/images/elephant.png',
    correct: 'e',
    options: ['e', 'a', 'i'],
    phonicsSound: '/assets/sounds/phonics/e.mp3',
    wordSound: '/assets/sounds/words/elephant.mp3',
    phoneme: 'eh',
  },
  {
    word: 'egg',
    emoji: '🥚',
    image: '/assets/images/egg.png',
    correct: 'e',
    options: ['e', 'o', 'u'],
    phonicsSound: '/assets/sounds/phonics/e.mp3',
    wordSound: '/assets/sounds/words/egg.mp3',
    phoneme: 'eh',
  },

  // ─── F ───────────────────────────────
  {
    word: 'fish',
    emoji: '🐟',
    image: '/assets/images/fish.png',
    correct: 'f',
    options: ['f', 'v', 'h'],
    phonicsSound: '/assets/sounds/phonics/f.mp3',
    wordSound: '/assets/sounds/words/fish.mp3',
    phoneme: 'fff',
  },
  {
    word: 'frog',
    emoji: '🐸',
    image: '/assets/images/frog.png',
    correct: 'f',
    options: ['f', 'p', 't'],
    phonicsSound: '/assets/sounds/phonics/f.mp3',
    wordSound: '/assets/sounds/words/frog.mp3',
    phoneme: 'fff',
  },

  // ─── G ───────────────────────────────
  {
    word: 'goat',
    emoji: '🐐',
    image: '/assets/images/goat.png',
    correct: 'g',
    options: ['g', 'q', 'c'],
    phonicsSound: '/assets/sounds/phonics/g.mp3',
    wordSound: '/assets/sounds/words/goat.mp3',
    phoneme: 'guh',
  },
  {
    word: 'giraffe',
    emoji: '🦒',
    image: '/assets/images/giraffe.png',
    correct: 'g',
    options: ['g', 'j', 'k'],
    phonicsSound: '/assets/sounds/phonics/g.mp3',
    wordSound: '/assets/sounds/words/giraffe.mp3',
    phoneme: 'guh',
  },

  // ─── H ───────────────────────────────
  {
    word: 'hat',
    emoji: '🎩',
    image: '/assets/images/hat.png',
    correct: 'h',
    options: ['h', 'n', 'r'],
    phonicsSound: '/assets/sounds/phonics/h.mp3',
    wordSound: '/assets/sounds/words/hat.mp3',
    phoneme: 'huh',
  },
  {
    word: 'horse',
    emoji: '🐴',
    image: '/assets/images/horse.png',
    correct: 'h',
    options: ['h', 'b', 'k'],
    phonicsSound: '/assets/sounds/phonics/h.mp3',
    wordSound: '/assets/sounds/words/horse.mp3',
    phoneme: 'huh',
  },

  // ─── I ───────────────────────────────
  {
    word: 'igloo',
    emoji: '🛖',
    image: '/assets/images/igloo.png',
    correct: 'i',
    options: ['i', 'e', 'u'],
    phonicsSound: '/assets/sounds/phonics/i.mp3',
    wordSound: '/assets/sounds/words/igloo.mp3',
    phoneme: 'ih',
  },
  {
    word: 'insect',
    emoji: '🪲',
    image: '/assets/images/insect.png',
    correct: 'i',
    options: ['i', 'a', 'o'],
    phonicsSound: '/assets/sounds/phonics/i.mp3',
    wordSound: '/assets/sounds/words/insect.mp3',
    phoneme: 'ih',
  },

  // ─── J ───────────────────────────────
  {
    word: 'jellyfish',
    emoji: '🪼',
    image: '/assets/images/jellyfish.png',
    correct: 'j',
    options: ['j', 'g', 'y'],
    phonicsSound: '/assets/sounds/phonics/j.mp3',
    wordSound: '/assets/sounds/words/jellyfish.mp3',
    phoneme: 'juh',
  },
  {
    word: 'juice',
    emoji: '🧃',
    image: '/assets/images/juice.png',
    correct: 'j',
    options: ['j', 'g', 'l'],
    phonicsSound: '/assets/sounds/phonics/j.mp3',
    wordSound: '/assets/sounds/words/juice.mp3',
    phoneme: 'juh',
  },

  // ─── K ───────────────────────────────
  {
    word: 'kite',
    emoji: '🪁',
    image: '/assets/images/kite.png',
    correct: 'k',
    options: ['k', 'c', 'x'],
    phonicsSound: '/assets/sounds/phonics/k.mp3',
    wordSound: '/assets/sounds/words/kite.mp3',
    phoneme: 'kuh',
  },
  {
    word: 'key',
    emoji: '🔑',
    image: '/assets/images/key.png',
    correct: 'k',
    options: ['k', 'q', 'y'],
    phonicsSound: '/assets/sounds/phonics/k.mp3',
    wordSound: '/assets/sounds/words/key.mp3',
    phoneme: 'kuh',
  },

  // ─── L ───────────────────────────────
  {
    word: 'lion',
    emoji: '🦁',
    image: '/assets/images/lion.png',
    correct: 'l',
    options: ['l', 'i', 't'],
    phonicsSound: '/assets/sounds/phonics/l.mp3',
    wordSound: '/assets/sounds/words/lion.mp3',
    phoneme: 'lll',
  },
  {
    word: 'leaf',
    emoji: '🍃',
    image: '/assets/images/leaf.png',
    correct: 'l',
    options: ['l', 'r', 'n'],
    phonicsSound: '/assets/sounds/phonics/l.mp3',
    wordSound: '/assets/sounds/words/leaf.mp3',
    phoneme: 'lll',
  },

  // ─── M ───────────────────────────────
  {
    word: 'monkey',
    emoji: '🐵',
    image: '/assets/images/monkey.png',
    correct: 'm',
    options: ['m', 'n', 'w'],
    phonicsSound: '/assets/sounds/phonics/m.mp3',
    wordSound: '/assets/sounds/words/monkey.mp3',
    phoneme: 'mmm',
  },
  {
    word: 'moon',
    emoji: '🌙',
    image: '/assets/images/moon.png',
    correct: 'm',
    options: ['m', 'n', 'o'],
    phonicsSound: '/assets/sounds/phonics/m.mp3',
    wordSound: '/assets/sounds/words/moon.mp3',
    phoneme: 'mmm',
  },

  // ─── N ───────────────────────────────
  {
    word: 'nest',
    emoji: '🪺',
    image: '/assets/images/nest.png',
    correct: 'n',
    options: ['n', 'm', 'h'],
    phonicsSound: '/assets/sounds/phonics/n.mp3',
    wordSound: '/assets/sounds/words/nest.mp3',
    phoneme: 'nnn',
  },
  {
    word: 'nose',
    emoji: '👃',
    image: '/assets/images/nose.png',
    correct: 'n',
    options: ['n', 'm', 'r'],
    phonicsSound: '/assets/sounds/phonics/n.mp3',
    wordSound: '/assets/sounds/words/nose.mp3',
    phoneme: 'nnn',
  },

  // ─── O ───────────────────────────────
  {
    word: 'octopus',
    emoji: '🐙',
    image: '/assets/images/octopus.png',
    correct: 'o',
    options: ['o', 'a', 'u'],
    phonicsSound: '/assets/sounds/phonics/o.mp3',
    wordSound: '/assets/sounds/words/octopus.mp3',
    phoneme: 'oh',
  },
  {
    word: 'orange',
    emoji: '🍊',
    image: '/assets/images/orange.png',
    correct: 'o',
    options: ['o', 'e', 'c'],
    phonicsSound: '/assets/sounds/phonics/o.mp3',
    wordSound: '/assets/sounds/words/orange.mp3',
    phoneme: 'oh',
  },

  // ─── P ───────────────────────────────
  {
    word: 'pig',
    emoji: '🐷',
    image: '/assets/images/pig.png',
    correct: 'p',
    options: ['p', 'b', 'd'],
    phonicsSound: '/assets/sounds/phonics/p.mp3',
    wordSound: '/assets/sounds/words/pig.mp3',
    phoneme: 'puh',
  },
  {
    word: 'pizza',
    emoji: '🍕',
    image: '/assets/images/pizza.png',
    correct: 'p',
    options: ['p', 'b', 'q'],
    phonicsSound: '/assets/sounds/phonics/p.mp3',
    wordSound: '/assets/sounds/words/pizza.mp3',
    phoneme: 'puh',
  },

  // ─── Q ───────────────────────────────
  {
    word: 'queen',
    emoji: '👑',
    image: '/assets/images/queen.png',
    correct: 'q',
    options: ['q', 'g', 'o'],
    phonicsSound: '/assets/sounds/phonics/q.mp3',
    wordSound: '/assets/sounds/words/queen.mp3',
    phoneme: 'kwuh',
  },
  {
    word: 'quilt',
    emoji: '🛏️',
    image: '/assets/images/quilt.png',
    correct: 'q',
    options: ['q', 'p', 'k'],
    phonicsSound: '/assets/sounds/phonics/q.mp3',
    wordSound: '/assets/sounds/words/quilt.mp3',
    phoneme: 'kwuh',
  },

  // ─── R ───────────────────────────────
  {
    word: 'rabbit',
    emoji: '🐰',
    image: '/assets/images/rabbit.png',
    correct: 'r',
    options: ['r', 'l', 'n'],
    phonicsSound: '/assets/sounds/phonics/r.mp3',
    wordSound: '/assets/sounds/words/rabbit.mp3',
    phoneme: 'rrr',
  },
  {
    word: 'rainbow',
    emoji: '🌈',
    image: '/assets/images/rainbow.png',
    correct: 'r',
    options: ['r', 'b', 'w'],
    phonicsSound: '/assets/sounds/phonics/r.mp3',
    wordSound: '/assets/sounds/words/rainbow.mp3',
    phoneme: 'rrr',
  },

  // ─── S ───────────────────────────────
  {
    word: 'sun',
    emoji: '☀️',
    image: '/assets/images/sun.png',
    correct: 's',
    options: ['s', 'z', 'c'],
    phonicsSound: '/assets/sounds/phonics/s.mp3',
    wordSound: '/assets/sounds/words/sun.mp3',
    phoneme: 'sss',
  },
  {
    word: 'snake',
    emoji: '🐍',
    image: '/assets/images/snake.png',
    correct: 's',
    options: ['s', 'z', 'r'],
    phonicsSound: '/assets/sounds/phonics/s.mp3',
    wordSound: '/assets/sounds/words/snake.mp3',
    phoneme: 'sss',
  },

  // ─── T ───────────────────────────────
  {
    word: 'tiger',
    emoji: '🐯',
    image: '/assets/images/tiger.png',
    correct: 't',
    options: ['t', 'd', 'l'],
    phonicsSound: '/assets/sounds/phonics/t.mp3',
    wordSound: '/assets/sounds/words/tiger.mp3',
    phoneme: 'tuh',
  },
  {
    word: 'turtle',
    emoji: '🐢',
    image: '/assets/images/turtle.png',
    correct: 't',
    options: ['t', 'd', 'f'],
    phonicsSound: '/assets/sounds/phonics/t.mp3',
    wordSound: '/assets/sounds/words/turtle.mp3',
    phoneme: 'tuh',
  },

  // ─── U ───────────────────────────────
  {
    word: 'umbrella',
    emoji: '☂️',
    image: '/assets/images/umbrella.png',
    correct: 'u',
    options: ['u', 'o', 'a'],
    phonicsSound: '/assets/sounds/phonics/u.mp3',
    wordSound: '/assets/sounds/words/umbrella.mp3',
    phoneme: 'uh',
  },
  {
    word: 'unicorn',
    emoji: '🦄',
    image: '/assets/images/unicorn.png',
    correct: 'u',
    options: ['u', 'i', 'e'],
    phonicsSound: '/assets/sounds/phonics/u.mp3',
    wordSound: '/assets/sounds/words/unicorn.mp3',
    phoneme: 'uh',
  },

  // ─── V ───────────────────────────────
  {
    word: 'volcano',
    emoji: '🌋',
    image: '/assets/images/volcano.png',
    correct: 'v',
    options: ['v', 'f', 'w'],
    phonicsSound: '/assets/sounds/phonics/v.mp3',
    wordSound: '/assets/sounds/words/volcano.mp3',
    phoneme: 'vvv',
  },
  {
    word: 'violin',
    emoji: '🎻',
    image: '/assets/images/violin.png',
    correct: 'v',
    options: ['v', 'f', 'b'],
    phonicsSound: '/assets/sounds/phonics/v.mp3',
    wordSound: '/assets/sounds/words/violin.mp3',
    phoneme: 'vvv',
  },

  // ─── W ───────────────────────────────
  {
    word: 'whale',
    emoji: '🐳',
    image: '/assets/images/whale.png',
    correct: 'w',
    options: ['w', 'm', 'v'],
    phonicsSound: '/assets/sounds/phonics/w.mp3',
    wordSound: '/assets/sounds/words/whale.mp3',
    phoneme: 'wuh',
  },
  {
    word: 'watermelon',
    emoji: '🍉',
    image: '/assets/images/watermelon.png',
    correct: 'w',
    options: ['w', 'y', 'u'],
    phonicsSound: '/assets/sounds/phonics/w.mp3',
    wordSound: '/assets/sounds/words/watermelon.mp3',
    phoneme: 'wuh',
  },

  // ─── X ───────────────────────────────
  // X is hard! We use words where X appears prominently (end of word).
  {
    word: 'fox',
    emoji: '🦊',
    image: '/assets/images/fox.png',
    correct: 'x',
    options: ['x', 'k', 's'],
    phonicsSound: '/assets/sounds/phonics/x.mp3',
    wordSound: '/assets/sounds/words/fox.mp3',
    phoneme: 'ks',
  },
  {
    word: 'box',
    emoji: '📦',
    image: '/assets/images/box.png',
    correct: 'x',
    options: ['x', 'z', 's'],
    phonicsSound: '/assets/sounds/phonics/x.mp3',
    wordSound: '/assets/sounds/words/box.mp3',
    phoneme: 'ks',
  },

  // ─── Y ───────────────────────────────
  {
    word: 'yarn',
    emoji: '🧶',
    image: '/assets/images/yarn.png',
    correct: 'y',
    options: ['y', 'j', 'v'],
    phonicsSound: '/assets/sounds/phonics/y.mp3',
    wordSound: '/assets/sounds/words/yarn.mp3',
    phoneme: 'yuh',
  },
  {
    word: 'yo-yo',
    emoji: '🪀',
    image: '/assets/images/yoyo.png',
    correct: 'y',
    options: ['y', 'w', 'u'],
    phonicsSound: '/assets/sounds/phonics/y.mp3',
    wordSound: '/assets/sounds/words/yoyo.mp3',
    phoneme: 'yuh',
  },

  // ─── Z ───────────────────────────────
  {
    word: 'zebra',
    emoji: '🦓',
    image: '/assets/images/zebra.png',
    correct: 'z',
    options: ['z', 's', 'x'],
    phonicsSound: '/assets/sounds/phonics/z.mp3',
    wordSound: '/assets/sounds/words/zebra.mp3',
    phoneme: 'zzz',
  },
  {
    word: 'zipper',
    emoji: '🤐',
    image: '/assets/images/zipper.png',
    correct: 'z',
    options: ['z', 's', 'j'],
    phonicsSound: '/assets/sounds/phonics/z.mp3',
    wordSound: '/assets/sounds/words/zipper.mp3',
    phoneme: 'zzz',
  },
];

export default words;
