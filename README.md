# Phonics Pals 🦊🎈

A delightful phonics learning game for 4-year-olds.
**Sound first, letters later** — kids hear a sound, see a picture, then tap the letter that matches.

Built with **React + Vite + Framer Motion + Howler.js**.

---

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

---

## How it works

1. A big colorful picture appears in the middle of the screen.
2. The phonics sound auto-plays (e.g., **"ah"** for apple).
3. The child sees three large letter buttons.
4. **Correct tap** → green glow, success chime, the word is spoken (*"A is for Apple!"*), the picture bounces, and confetti flies.
5. **Wrong tap** → the button gives a friendly wiggle and a soft "boing." No negative messaging, no "try again" text — the sound just replays so the child can try.
6. After 10 rounds the child sees their star score and can play again.

### Why no text in the UI?

A 4-year-old can't read. Every instruction is delivered by **sound, animation, or icon** — never by words on the screen.

---

## Audio strategy (read this!)

The game expects MP3 files in `src/assets/sounds/phonics/` and `src/assets/sounds/words/`. **Those files are not bundled with this MVP** — you'll add your own (or licensed) recordings.

Until you do, the app **gracefully falls back to the browser's built-in Speech Synthesis API**, so the experience works on day one. Procedural sound effects (the success chime, the "oops" boing, the celebration fanfare) are generated with the Web Audio API and need no files.

To add real audio, just drop files matching the paths in `src/data/words.js`:

```
src/assets/sounds/phonics/a.mp3   ← phoneme: "ah"
src/assets/sounds/words/apple.mp3 ← full word: "Apple!" or "A is for Apple!"
…
```

Howler will preload them on game start for instant playback.

---

## Image strategy

Each word in `src/data/words.js` has both an `image` path **and** an `emoji` fallback. If the image file is missing, the emoji is shown — so the visual is never broken. Drop PNGs into `src/assets/images/` whenever you're ready.

---

## Project structure

```
src/
├── components/
│   ├── SoundGame.jsx     ← main game loop, round logic, scoring
│   ├── LetterButton.jsx  ← big tappable letter w/ shake-on-wrong
│   └── ImageCard.jsx     ← floating image card w/ celebration animation
├── data/
│   └── words.js          ← 12 words: apple, ball, cat, dog, …
├── utils/
│   └── audio.js          ← Howler + Web Speech + procedural FX
├── assets/
│   ├── images/           ← (drop PNGs here)
│   └── sounds/
│       ├── phonics/      ← (drop phoneme MP3s here)
│       └── words/        ← (drop word MP3s here)
├── App.jsx               ← start / play / end screens
├── main.jsx              ← React entry
└── styles.css            ← all styles, CSS-vars-based theming
```

---

## Design choices for tiny hands

| Constraint | How it's handled |
|---|---|
| No reading | Audio + emoji + animation only. Tagline reads "Tap to play!" but is reinforced by a giant ▶ button. |
| Big tap targets | All interactive elements are ≥ 80px tall on phone, scale up on tablet/desktop. |
| Forgiveness | Wrong taps never block — the phonics sound replays so the child stays in flow. |
| No fail states | Score counts correct answers; missed answers are simply not counted, never displayed as failures. |
| Short sessions | Sessions cap at 10 rounds (~2–3 minutes). |
| High contrast | Bowlby One display font, thick black borders on every interactive element, saturated primary colors. |
| Reduced motion | `prefers-reduced-motion` respected — animations collapse to instant transitions. |

---

## Adding new words

Edit `src/data/words.js`. Each entry needs:

```js
{
  word: 'rabbit',
  emoji: '🐰',
  image: '/assets/images/rabbit.png',
  correct: 'r',
  options: ['r', 'l', 'p'],   // include the correct one!
  phonicsSound: '/assets/sounds/phonics/r.mp3',
  wordSound: '/assets/sounds/words/rabbit.mp3',
  phoneme: 'ruh',             // spoken fallback
}
```

That's it — the game randomizes from the full pool automatically.
