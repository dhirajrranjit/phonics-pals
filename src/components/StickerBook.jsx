// /src/components/StickerBook.jsx
//
// A full-screen sticker collection page.
// - Category tabs along the top (Animals, Food, Nature, Space, Vehicles, Fun)
// - Scrollable grid of stickers
// - Collected stickers are bright and tappable (they wiggle)
// - Uncollected stickers show as dark mystery "?" silhouettes
// - Counter showing "X / 72 collected"

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  STICKER_CATEGORIES,
  TOTAL_STICKER_COUNT,
  getCollectedStickers,
} from '../utils/stickers.js';
import { playTap } from '../utils/audio.js';

export default function StickerBook({ onClose }) {
  const collected = useMemo(() => new Set(getCollectedStickers()), []);
  const [activeTab, setActiveTab] = useState(0);

  const category = STICKER_CATEGORIES[activeTab];
  const totalCollected = collected.size;

  return (
    <motion.div
      className="sticker-book"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
    >
      {/* Header */}
      <div className="sb-header">
        <motion.button
          type="button"
          className="sb-close-btn"
          onClick={() => { playTap(); onClose(); }}
          whileTap={{ scale: 0.85 }}
          aria-label="Close sticker book"
        >
          ✕
        </motion.button>

        <div className="sb-title-row">
          <span className="sb-title-icon" aria-hidden="true">📖</span>
          <h2 className="sb-title">My Stickers</h2>
        </div>

        <div className="sb-counter">
          <span className="sb-counter-num">{totalCollected}</span>
          <span className="sb-counter-slash">/</span>
          <span className="sb-counter-total">{TOTAL_STICKER_COUNT}</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="sb-tabs" role="tablist">
        {STICKER_CATEGORIES.map((cat, i) => {
          const catCollected = cat.stickers.filter((s) => collected.has(s.id)).length;
          const isActive = i === activeTab;
          return (
            <motion.button
              key={cat.name}
              type="button"
              role="tab"
              className={`sb-tab ${isActive ? 'active' : ''}`}
              onClick={() => { playTap(); setActiveTab(i); }}
              whileTap={{ scale: 0.92 }}
              aria-selected={isActive}
              aria-label={`${cat.name} — ${catCollected} of ${cat.stickers.length}`}
            >
              <span className="sb-tab-icon">{cat.icon}</span>
              <span className="sb-tab-count">{catCollected}/{cat.stickers.length}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Sticker grid */}
      <div className="sb-grid-scroll">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="sb-grid"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {category.stickers.map((sticker) => {
              const isCollected = collected.has(sticker.id);
              return (
                <motion.div
                  key={sticker.id}
                  className={`sb-sticker ${isCollected ? 'collected' : 'locked'}`}
                  whileTap={isCollected ? { scale: 1.2, rotate: [0, -12, 12, -6, 0] } : {}}
                  title={isCollected ? sticker.label : '???'}
                >
                  {isCollected ? (
                    <span className="sb-sticker-emoji">{sticker.emoji}</span>
                  ) : (
                    <span className="sb-sticker-mystery">?</span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="sb-progress-bar-wrap">
        <div
          className="sb-progress-bar-fill"
          style={{ width: `${(totalCollected / TOTAL_STICKER_COUNT) * 100}%` }}
        />
      </div>
    </motion.div>
  );
}
