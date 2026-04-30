// /src/components/LetterButton.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * LetterButton — large rounded tappable letter.
 *
 * Props:
 *   letter      string  — the letter to show (rendered uppercase)
 *   onClick     fn      — called with the letter when tapped
 *   colorIndex  number  — 0..2, picks a kid-friendly color slot
 *   isCorrect   bool    — when true, button glows green (post-tap reveal)
 *   disabled    bool    — locks all buttons after a correct answer
 *   shake       bool    — triggers a wiggle animation on wrong tap
 */
export default function LetterButton({
  letter,
  onClick,
  colorIndex = 0,
  isCorrect = false,
  disabled = false,
  shake = false,
}) {
  // Wiggle on wrong tap; otherwise idle (no animation).
  const animate = shake
    ? { x: [0, -14, 14, -10, 10, -6, 6, 0], rotate: [0, -6, 6, -4, 4, -2, 2, 0] }
    : { x: 0, rotate: 0 };

  return (
    <motion.button
      type="button"
      className={`letter-btn ${isCorrect ? 'is-correct' : ''}`}
      data-color={colorIndex}
      onClick={() => !disabled && onClick(letter)}
      disabled={disabled}
      aria-label={`Letter ${letter.toUpperCase()}`}
      whileTap={disabled ? {} : { scale: 0.9, y: 6 }}
      animate={animate}
      transition={shake ? { duration: 0.55 } : { type: 'spring', stiffness: 500, damping: 18 }}
    >
      {letter.toUpperCase()}
    </motion.button>
  );
}
