// /src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SoundGame from './components/SoundGame.jsx';
import BlendGame from './components/BlendGame.jsx';
import StickerBook from './components/StickerBook.jsx';
import StickerReveal from './components/StickerReveal.jsx';
import { say, playTap, playFanfare, cancelSpeech } from './utils/audio.js';
import { awardStickers, getCollectedCount, TOTAL_STICKER_COUNT } from './utils/stickers.js';

const SCREENS = { START: 'start', PLAY: 'play', BLEND: 'blend', END: 'end' };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.START);
  const [result, setResult] = useState({ score: 0, total: 10 });
  const [showStickerBook, setShowStickerBook] = useState(false);
  const [awardedStickers, setAwardedStickers] = useState([]);
  const [collectedCount, setCollectedCount] = useState(getCollectedCount());

  // Decorative background blobs — generated once, slow-floating.
  const blobs = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        size: 80 + Math.random() * 180,
        left: Math.random() * 100,
        top: Math.random() * 100,
        color: ['#FFD93D', '#FF8FA3', '#6BCBFF', '#B5F2A0', '#B388EB'][i % 5],
        delay: Math.random() * 4,
        duration: 8 + Math.random() * 6,
      })),
    []
  );

  // Cleanup any pending speech on unmount.
  useEffect(() => () => cancelSpeech(), []);

  const handleStart = () => {
    playTap();
    cancelSpeech();
    setAwardedStickers([]);
    setScreen(SCREENS.PLAY);
  };

  const handleStartBlend = () => {
    playTap();
    cancelSpeech();
    setAwardedStickers([]);
    setScreen(SCREENS.BLEND);
  };

  const handleFinish = ({ score, total }) => {
    setResult({ score, total });

    // Award stickers!
    const newStickers = awardStickers(score, total);
    setAwardedStickers(newStickers);
    setCollectedCount(getCollectedCount());
    setSessionCount(getSessionCount());

    setScreen(SCREENS.END);
    // Tiny delay so transition lands first
    setTimeout(() => {
      playFanfare();
      const praise =
        score === total
          ? 'Wow! You got them all!'
          : score >= total * 0.7
          ? 'Awesome job!'
          : 'Great try! Let\'s play again!';
      setTimeout(() => say(praise, { rate: 0.9, pitch: 1.2 }), 800);
    }, 200);
  };

  const handleReplay = () => {
    playTap();
    cancelSpeech();
    setAwardedStickers([]);
    setScreen(SCREENS.START);
    // brief flash so React fully resets the SoundGame state next time
    setTimeout(() => setScreen(SCREENS.PLAY), 50);
  };

  const handleHome = () => {
    playTap();
    cancelSpeech();
    setAwardedStickers([]);
    setScreen(SCREENS.START);
  };

  const handleOpenStickerBook = () => {
    playTap();
    setShowStickerBook(true);
  };

  const handleCloseStickerBook = () => {
    setCollectedCount(getCollectedCount());
    setShowStickerBook(false);
  };

  const stars = Math.max(1, Math.round((result.score / result.total) * 3));

  return (
    <>
      {/* Animated background blobs */}
      <div className="bg-shapes" aria-hidden="true">
        {blobs.map((b) => (
          <motion.span
            key={b.id}
            className="blob"
            style={{
              width: b.size,
              height: b.size,
              left: `${b.left}%`,
              top: `${b.top}%`,
              background: b.color,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="app">
        <AnimatePresence mode="wait">
          {screen === SCREENS.PLAY && (
            <motion.div
              key="play"
              style={{ display: 'contents' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SoundGame onFinish={handleFinish} />
            </motion.div>
          )}
          {screen === SCREENS.BLEND && (
            <motion.div
              key="blend"
              style={{ display: 'contents' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BlendGame onFinish={handleFinish} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* START SCREEN */}
      <AnimatePresence>
        {screen === SCREENS.START && !showStickerBook && (
          <motion.div
            key="start"
            className="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="start-card"
              initial={{ y: 40, scale: 0.85, rotate: -2 }}
              animate={{ y: 0, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            >
              <motion.div
                style={{ fontSize: 'clamp(64px, 12vh, 96px)', lineHeight: 1 }}
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                🦊
              </motion.div>
              <h1>Phonics Pals</h1>
              <p className="tagline">Tap to play! 🎈</p>
              <motion.button
                type="button"
                className="start-btn"
                onClick={handleStart}
                whileTap={{ scale: 0.92, y: 6 }}
                whileHover={{ scale: 1.04 }}
                aria-label="Start playing"
              >
                PLAY ▶
              </motion.button>

              {/* Blend mode button */}
              <motion.button
                type="button"
                className="start-blend-btn"
                onClick={handleStartBlend}
                whileTap={{ scale: 0.93, y: 3 }}
                aria-label="Play blending game"
              >
                <span>BLEND</span>
                <span aria-hidden="true">🔤</span>
              </motion.button>

              {/* Sticker book button */}
              <motion.button
                type="button"
                className="start-sticker-btn"
                onClick={handleOpenStickerBook}
                whileTap={{ scale: 0.93, y: 3 }}
                aria-label="Open sticker book"
              >
                <span aria-hidden="true">📖</span>
                <span>Stickers</span>
                <span className="btn-badge">{collectedCount}/{TOTAL_STICKER_COUNT}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* END SCREEN */}
      <AnimatePresence>
        {screen === SCREENS.END && !showStickerBook && (
          <motion.div
            key="end"
            className="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="start-card end-card"
              initial={{ y: 60, scale: 0.7 }}
              animate={{ y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            >
              <motion.div
                style={{ fontSize: 'clamp(72px, 14vh, 120px)', lineHeight: 1 }}
                animate={{ rotate: [0, -10, 10, -6, 6, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6 }}
                aria-hidden="true"
              >
                🎉
              </motion.div>

              <p className="big-score">
                {result.score}/{result.total}
              </p>

              <div className="stars" aria-label={`${stars} out of 3 stars`}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 260 }}
                    style={{ display: 'inline-block', filter: i < stars ? 'none' : 'grayscale(1) opacity(0.3)' }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              {/* Sticker reveal */}
              <StickerReveal stickers={awardedStickers} />

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <motion.button
                  type="button"
                  className="start-btn"
                  onClick={handleHome}
                  whileTap={{ scale: 0.92, y: 6 }}
                  whileHover={{ scale: 1.04 }}
                  aria-label="Go home"
                  style={{ background: 'var(--sun)', color: 'var(--ink)' }}
                >
                  🏠
                </motion.button>

                <motion.button
                  type="button"
                  className="start-btn"
                  onClick={handleReplay}
                  whileTap={{ scale: 0.92, y: 6 }}
                  whileHover={{ scale: 1.04 }}
                  aria-label="Play again"
                  style={{ background: 'var(--sky)' }}
                >
                  AGAIN ↻
                </motion.button>

                <motion.button
                  type="button"
                  className="start-sticker-btn"
                  onClick={handleOpenStickerBook}
                  whileTap={{ scale: 0.93, y: 3 }}
                  aria-label="View sticker book"
                  style={{ marginTop: 0 }}
                >
                  <span aria-hidden="true">📖</span>
                  <span>Stickers</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKER BOOK */}
      <AnimatePresence>
        {showStickerBook && (
          <StickerBook
            key="sticker-book"
            onClose={handleCloseStickerBook}
          />
        )}
      </AnimatePresence>
    </>
  );
}
