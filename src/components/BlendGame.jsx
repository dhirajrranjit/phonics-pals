// /src/components/BlendGame.jsx
//
// CVC Blending game mode.
//
// Each round:
//   1) Show 3 letter tiles: C - A - T
//   2) Auto-play: each letter highlights in sequence with its sound
//   3) Then the full word is spoken: "Cat!"
//   4) Show 3 picture choices — child taps the matching one
//   5) Correct → celebration → next round
//   6) Wrong → gentle wiggle → sounds replay
//
// "Hear Again" button replays the blend sequence anytime.

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cvcWords from '../data/cvcWords.js';
import {
  playBlend,
  playSuccess,
  playOops,
  playTap,
  playWord,
  say,
  cancelSpeech,
} from '../utils/audio.js';

const TOTAL_ROUNDS = 8;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build a queue of rounds. Each round has a target word and 2 distractors. */
function buildBlendQueue(allWords, count) {
  const pool = shuffle(allWords);
  const queue = [];
  for (let i = 0; i < count && i < pool.length; i++) {
    const target = pool[i];
    // Pick 2 random distractors (different word)
    const others = allWords.filter((w) => w.word !== target.word);
    const distractors = shuffle(others).slice(0, 2);
    const choices = shuffle([target, ...distractors]);
    queue.push({ target, choices });
  }
  return queue;
}

export default function BlendGame({ onFinish }) {
  const roundQueue = useMemo(() => buildBlendQueue(cvcWords, TOTAL_ROUNDS), []);
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [wordRevealed, setWordRevealed] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [locked, setLocked] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [shakePick, setShakePick] = useState(null);

  const cleanupRef = useRef(null);
  const timeoutsRef = useRef([]);

  const addTimeout = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timeoutsRef.current.push(t);
    return t;
  };

  const clearAll = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    cancelSpeech();
  };

  const current = roundQueue[roundIdx];

  // Play the blend sequence for the current round.
  const playCurrentBlend = useCallback(() => {
    if (!current) return;
    clearAll();
    setHighlightIdx(-1);
    setWordRevealed(false);
    setShowChoices(false);
    setLocked(false);
    setCelebrate(false);
    setShakePick(null);

    // Small delay so the UI settles
    const t = addTimeout(() => {
      cleanupRef.current = playBlend(
        current.target.word,
        (idx) => setHighlightIdx(idx),
        () => {
          setWordRevealed(true);
          // Show picture choices after the word is spoken
          addTimeout(() => setShowChoices(true), 600);
        }
      );
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // Auto-play on round change.
  useEffect(() => {
    playCurrentBlend();
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx]);

  // Cleanup on unmount.
  useEffect(() => () => clearAll(), []);

  const handleReplay = useCallback(() => {
    playTap();
    playCurrentBlend();
  }, [playCurrentBlend]);

  const handlePictureTap = useCallback(
    (word) => {
      if (!current || locked) return;

      if (word === current.target.word) {
        // ✅ Correct!
        setLocked(true);
        setCelebrate(true);
        setScore((s) => s + 1);
        playSuccess();
        addTimeout(() => {
          say(`Yes! ${current.target.word}!`, { rate: 0.9, pitch: 1.25 });
        }, 400);
        addTimeout(() => {
          if (roundIdx + 1 >= TOTAL_ROUNDS) {
            onFinish({ score: score + 1, total: TOTAL_ROUNDS });
          } else {
            setRoundIdx((i) => i + 1);
          }
        }, 2200);
      } else {
        // ❌ Wrong
        playOops();
        setShakePick(word);
        addTimeout(() => setShakePick(null), 600);
        // Replay the blend so they can try again
        addTimeout(() => {
          playCurrentBlend();
        }, 1000);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, locked, roundIdx, score]
  );

  if (!current) return null;

  const { target, choices } = current;

  // Confetti
  const confetti = celebrate
    ? Array.from({ length: 14 }, (_, i) => ({
        id: i,
        emoji: ['🎉', '⭐', '✨', '🌟', '🎈', '💫'][i % 6],
        x: (Math.random() - 0.5) * (typeof window !== 'undefined' ? window.innerWidth : 400),
        y: -(typeof window !== 'undefined' ? window.innerHeight * 0.5 : 300) - Math.random() * 200,
        rot: Math.random() * 360,
        delay: Math.random() * 0.2,
      }))
    : [];

  return (
    <>
      {/* Top bar */}
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
          aria-label="Hear the sounds again"
          whileTap={{ scale: 0.85, y: 4 }}
        >
          🔊
        </motion.button>
      </div>

      <div className="stage blend-stage">
        {/* Letter tiles */}
        <div className="blend-letters" role="group" aria-label="Letters to blend">
          {target.letters.map((letter, i) => (
            <motion.div
              key={`${roundIdx}-${i}`}
              className={`blend-tile ${highlightIdx === i ? 'active' : ''}`}
              initial={{ scale: 0, rotate: -20 }}
              animate={{
                scale: highlightIdx === i ? 1.15 : 1,
                rotate: 0,
                y: highlightIdx === i ? -8 : 0,
              }}
              transition={{
                delay: i * 0.1,
                type: 'spring',
                stiffness: 300,
                damping: 18,
              }}
            >
              {letter.toUpperCase()}
            </motion.div>
          ))}
        </div>

        {/* Revealed word + emoji */}
        <AnimatePresence>
          {wordRevealed && (
            <motion.div
              className="blend-word-reveal"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 16 }}
            >
              <span className="blend-word-emoji">{target.emoji}</span>
              <span className="blend-word-text">{target.word.toUpperCase()}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Picture choices */}
        <AnimatePresence>
          {showChoices && (
            <motion.div
              className="blend-choices"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              role="group"
              aria-label="Pick the matching picture"
            >
              {choices.map((choice, i) => {
                const isCorrectPick = celebrate && choice.word === target.word;
                const isShaking = shakePick === choice.word;
                return (
                  <motion.button
                    key={`${roundIdx}-choice-${choice.word}`}
                    type="button"
                    className={`blend-choice ${isCorrectPick ? 'correct' : ''}`}
                    onClick={() => handlePictureTap(choice.word)}
                    disabled={locked}
                    whileTap={locked ? {} : { scale: 0.92 }}
                    animate={
                      isShaking
                        ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
                        : isCorrectPick
                        ? { scale: [1, 1.15, 1], rotate: [0, -4, 4, 0] }
                        : {}
                    }
                    transition={isShaking ? { duration: 0.5 } : { duration: 0.6 }}
                    aria-label={choice.word}
                  >
                    <span className="blend-choice-emoji">{choice.emoji}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {celebrate && (
          <div className="celebrate" aria-hidden="true">
            {confetti.map((c) => (
              <motion.span
                key={c.id}
                className="confetti"
                initial={{ x: c.x, y: c.y, rotate: 0, opacity: 0 }}
                animate={{
                  y: (typeof window !== 'undefined' ? window.innerHeight : 600) * 0.7,
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
    </>
  );
}
