// /src/components/StickerReveal.jsx
//
// Animated reveal of newly awarded stickers.
// Shown on the end screen after the score.
// Each sticker pops in with a bounce + sparkle.

import React from 'react';
import { motion } from 'framer-motion';

export default function StickerReveal({ stickers }) {
  if (!stickers || stickers.length === 0) return null;

  return (
    <div className="sticker-reveal">
      <p className="sr-label">
        {stickers.length === 1 ? 'New sticker!' : `${stickers.length} new stickers!`}
      </p>
      <div className="sr-stickers">
        {stickers.map((sticker, i) => (
          <motion.div
            key={sticker.id + '-' + i}
            className="sr-sticker"
            initial={{ scale: 0, rotate: -40, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              delay: 0.5 + i * 0.3,
              type: 'spring',
              stiffness: 340,
              damping: 12,
            }}
          >
            <span className="sr-emoji">{sticker.emoji}</span>
            {sticker.isNew && (
              <motion.span
                className="sr-new-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.3, type: 'spring', stiffness: 400 }}
              >
                NEW
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
