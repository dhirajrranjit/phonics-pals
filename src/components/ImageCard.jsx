// /src/components/ImageCard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ImageCard — large centered visual.
 *
 * - Tries to load a real image from `image` prop.
 * - Falls back to the `emoji` (always works) if image fails or is missing.
 * - Idle: gentle floating bob.
 * - On correct: scales up + bounces + emits sparkle particles.
 *
 * Props:
 *   image      string  — image path
 *   emoji      string  — emoji fallback
 *   word       string  — for alt text / aria-label
 *   celebrate  bool    — when true, plays the "yay!" animation
 *   wordKey    any     — changes when word changes; triggers swap animation
 */
export default function ImageCard({ image, emoji, word, celebrate, wordKey }) {
  const [imgOk, setImgOk] = useState(false);

  // Reset image-ok flag whenever the word changes.
  useEffect(() => {
    setImgOk(false);
    if (!image) return;
    const probe = new Image();
    probe.onload = () => setImgOk(true);
    probe.onerror = () => setImgOk(false);
    probe.src = image;
  }, [image, wordKey]);

  // Random sparkle positions, regenerated each celebration.
  const sparkles = celebrate
    ? Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.cos((i / 8) * Math.PI * 2) * 140,
        y: Math.sin((i / 8) * Math.PI * 2) * 140,
        emoji: ['✨', '⭐', '🌟', '💫'][i % 4],
        delay: i * 0.04,
      }))
    : [];

  return (
    <motion.div
      className="image-card"
      role="img"
      aria-label={word}
      animate={
        celebrate
          ? { scale: [1, 1.18, 0.96, 1.1, 1], rotate: [0, -4, 4, -2, 0] }
          : { y: [0, -8, 0], scale: 1, rotate: 0 }
      }
      transition={
        celebrate
          ? { duration: 0.9, ease: 'easeInOut' }
          : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={wordKey}
          className="pic"
          initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.4, opacity: 0, rotate: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          {imgOk ? (
            <img src={image} alt={word} draggable={false} />
          ) : (
            <span aria-hidden="true">{emoji}</span>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.span
            key={`spark-${wordKey}-${s.id}`}
            className="sparkle"
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{ x: s.x, y: s.y, scale: 1.4, opacity: 1, rotate: 360 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.7, delay: s.delay, ease: 'easeOut' }}
            aria-hidden="true"
          >
            {s.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
