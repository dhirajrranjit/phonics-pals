// /src/components/SoundGame.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCard from './ImageCard.jsx';
import LetterButton from './LetterButton.jsx';
import LetterTracer from './LetterTracer.jsx';
import wordsData from '../data/words.js';
import {
  preloadHowls,
  playPhonics,
  playWord,
  playSuccess,
  playOops,
  playTap,
  playFanfare,
  say,
  cancelSpeech,
} from '../utils/audio.js';

const TOTAL_ROUNDS = 10;
const NEXT_DELAY_MS = 1800; // pause on success before advancing

// Shuffle helper (Fisher–Yates) — pure, deterministic-friendly.
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a randomized round queue.
// Rules:
//   1) Same word never appears twice in a row.
//   2) Same target letter never appears twice in a row (so "apple"→"ant"
//      won't both ask for A, which would let the child win without learning).
function buildRoundQueue(allWords, count) {
  const pool = shuffle(allWords);
  const queue = [];
  let attempts = 0;
  const maxAttempts = count * 20; // safety net

  while (queue.length < count && attempts < maxAttempts) {
    attempts++;
    // Find the next item in the pool that satisfies both rules.
    const last = queue[queue.length - 1];
    const candidateIdx = pool.findIndex(
      (w) => !last || (w.word !== last.word && w.correct !== last.correct)
    );

    if (candidateIdx >= 0) {
      // Pull it out of the pool and use it.
      const [picked] = pool.splice(candidateIdx, 1);
      queue.push(picked);
    } else {
      // Pool exhausted of valid candidates — refill by reshuffling all words.
      // This only triggers when allWords < count, which shouldn't happen
      // with our 52-word dataset, but guarantees we never deadlock.
      pool.push(...shuffle(allWords));
    }
  }

  return queue.slice(0, count);
}

export default function SoundGame({ onFinish }) {
  // Build the queue ONCE per game session.
  const roundQueue = useMemo(() => buildRoundQueue(wordsData, TOTAL_ROUNDS), []);
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [shakeLetter, setShakeLetter] = useState(null);
  const [revealCorrect, setRevealCorrect] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showTracer, setShowTracer] = useState(false);

  // Per-round state: shuffled options so the correct letter isn't always first.
  const current = roundQueue[roundIdx];
  const shuffledOptions = useMemo(
    () => (current ? shuffle(current.options) : []),
    [current]
  );

  // Track timeouts so we can clean them up on unmount / round change.
  const timeoutsRef = useRef([]);
  const addTimeout = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
    return t;
  };
  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // Preload all phonics + word audio once on mount.
  useEffect(() => {
    const srcs = [];
    wordsData.forEach((w) => {
      if (w.phonicsSound) srcs.push(w.phonicsSound);
      if (w.wordSound) srcs.push(w.wordSound);
    });
    preloadHowls(srcs);
    return () => {
      clearTimeouts();
      cancelSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-play the phonics sound on every new round.
  useEffect(() => {
    if (!current) return;
    setShakeLetter(null);
    setRevealCorrect(false);
    setCelebrate(false);
    setLocked(false);
    setShowTracer(false);

    // Tiny delay so the swap animation lands first.
    const t = addTimeout(() => {
      playPhonics(current.phonicsSound, current.word);
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx]);

  const handleReplay = useCallback(() => {
    if (!current) return;
    playTap();
    playPhonics(current.phonicsSound, current.word);
  }, [current]);

  const handleLetterTap = useCallback(
    (letter) => {
      if (!current || locked) return;

      if (letter === current.correct) {
        // ✅ Correct
        setLocked(true);
        setRevealCorrect(true);
        setCelebrate(true);
        setScore((s) => s + 1);
        playSuccess();
        // Slight stagger so success chime plays before voice.
        addTimeout(() => {
          playWord(current.wordSound, current.word, current.correct);
        }, 480);

        // Show the letter tracer after the celebration.
        addTimeout(() => {
          setShowTracer(true);
        }, NEXT_DELAY_MS);
      } else {
        // ❌ Wrong — gentle, no negative messaging.
        playOops();
        setShakeLetter(letter);
        // Reset shake after animation finishes so the same letter can shake again.
        addTimeout(() => setShakeLetter(null), 600);
        // Re-cue the phonics so the child can try again.
        addTimeout(() => playPhonics(current.phonicsSound, current.word), 700);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, locked, roundIdx, score]
  );

  // Called when the child finishes tracing (or skips).
  const handleTracingComplete = useCallback(() => {
    setShowTracer(false);
    if (roundIdx + 1 >= TOTAL_ROUNDS) {
      onFinish({ score, total: TOTAL_ROUNDS });
    } else {
      setRoundIdx((i) => i + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, score]);

  if (!current) return null;

  // Confetti for celebrate overlay
  const confetti = celebrate
    ? Array.from({ length: 18 }, (_, i) => ({
        id: i,
        emoji: ['🎉', '🎊', '⭐', '✨', '🌈', '🎈'][i % 6],
        x: (Math.random() - 0.5) * window.innerWidth,
        y: -window.innerHeight * 0.5 - Math.random() * 200,
        rot: Math.random() * 360,
        delay: Math.random() * 0.2,
      }))
    : [];

  return (
    <>
      <div className="topbar">
        <div className="score-badge" aria-label={`Score: ${score}`}>
          <span className="star" aria-hidden="true">⭐</span>
          <span>{score}</span>
        </div>

        <div className="progress-dots" aria-label={`Round ${roundIdx + 1} of ${TOTAL_ROUNDS}`}>
          {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
            <span
              key={i}
              className={`dot ${i < roundIdx ? 'done' : i === roundIdx ? 'current' : ''}`}
            />
          ))}
        </div>

        <motion.button
          type="button"
          className="replay-btn"
          onClick={handleReplay}
          aria-label="Hear the sound again"
          whileTap={{ scale: 0.85, y: 4 }}
        >
          🔊
        </motion.button>
      </div>

      <div className="stage">
        <ImageCard
          image={current.image}
          emoji={current.emoji}
          word={current.word}
          celebrate={celebrate}
          wordKey={`${current.word}-${roundIdx}`}
        />

        <div className="letters" role="group" aria-label="Pick the matching letter">
          {shuffledOptions.map((letter, idx) => (
            <LetterButton
              key={`${roundIdx}-${letter}`}
              letter={letter}
              colorIndex={idx % 3}
              onClick={handleLetterTap}
              isCorrect={revealCorrect && letter === current.correct}
              shake={shakeLetter === letter}
              disabled={locked && letter !== current.correct}
            />
          ))}
        </div>
      </div>

      {/* Celebration confetti overlay */}
      <AnimatePresence>
        {celebrate && !showTracer && (
          <div className="celebrate" aria-hidden="true">
            {confetti.map((c) => (
              <motion.span
                key={c.id}
                className="confetti"
                initial={{ x: c.x, y: c.y, rotate: 0, opacity: 0 }}
                animate={{
                  y: window.innerHeight * 0.7,
                  rotate: c.rot + 540,
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: 1.6, delay: c.delay, ease: 'easeIn' }}
              >
                {c.emoji}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Letter tracing overlay — appears after correct answer */}
      <AnimatePresence>
        {showTracer && (
          <LetterTracer
            key={`tracer-${roundIdx}`}
            letter={current.correct}
            word={current.word}
            onComplete={handleTracingComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Re-export for App so it can announce on game-over.
export { TOTAL_ROUNDS, playFanfare, say };
