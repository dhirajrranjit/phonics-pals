// /src/components/LetterTracer.jsx
//
// Full-screen overlay that lets a child trace an uppercase letter
// with their finger (touch) or mouse after answering correctly.
//
// How it works:
//   1) The letter is rendered as a large dotted outline on a canvas.
//   2) A "guide" layer shows directional arrows for stroke order.
//   3) As the child draws near the letter path, strokes turn green.
//   4) A progress ring in the corner fills up.
//   5) At ≥70% coverage → celebration burst → auto-advances.
//   6) A skip button lets impatient kids move on.
//
// Letter paths are defined as polyline sequences (arrays of {x,y} points
// on a 0–100 normalized grid). They are intentionally simplified —
// a 4-year-old doesn't need perfect typography, they need a clear,
// traceable shape that teaches the *idea* of each letter's form.

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSuccess, playTap, say } from '../utils/audio.js';

// ============================================================
// Letter path data — polylines on a 0–100 coordinate grid.
// Each letter is an array of strokes; each stroke is an array
// of {x,y} points that the child should trace through.
// ============================================================

const LETTER_PATHS = {
  A: [
    [{ x: 15, y: 90 }, { x: 50, y: 10 }, { x: 85, y: 90 }],
    [{ x: 30, y: 58 }, { x: 70, y: 58 }],
  ],
  B: [
    [{ x: 25, y: 10 }, { x: 25, y: 90 }],
    [{ x: 25, y: 10 }, { x: 60, y: 10 }, { x: 72, y: 22 }, { x: 72, y: 38 }, { x: 60, y: 50 }, { x: 25, y: 50 }],
    [{ x: 25, y: 50 }, { x: 62, y: 50 }, { x: 78, y: 62 }, { x: 78, y: 78 }, { x: 62, y: 90 }, { x: 25, y: 90 }],
  ],
  C: [
    [{ x: 80, y: 25 }, { x: 65, y: 12 }, { x: 45, y: 10 }, { x: 28, y: 18 }, { x: 18, y: 35 }, { x: 18, y: 65 }, { x: 28, y: 82 }, { x: 45, y: 90 }, { x: 65, y: 88 }, { x: 80, y: 75 }],
  ],
  D: [
    [{ x: 25, y: 10 }, { x: 25, y: 90 }],
    [{ x: 25, y: 10 }, { x: 55, y: 10 }, { x: 75, y: 25 }, { x: 82, y: 50 }, { x: 75, y: 75 }, { x: 55, y: 90 }, { x: 25, y: 90 }],
  ],
  E: [
    [{ x: 25, y: 10 }, { x: 25, y: 90 }],
    [{ x: 25, y: 10 }, { x: 78, y: 10 }],
    [{ x: 25, y: 50 }, { x: 65, y: 50 }],
    [{ x: 25, y: 90 }, { x: 78, y: 90 }],
  ],
  F: [
    [{ x: 25, y: 10 }, { x: 25, y: 90 }],
    [{ x: 25, y: 10 }, { x: 78, y: 10 }],
    [{ x: 25, y: 50 }, { x: 65, y: 50 }],
  ],
  G: [
    [{ x: 80, y: 25 }, { x: 65, y: 12 }, { x: 45, y: 10 }, { x: 28, y: 18 }, { x: 18, y: 35 }, { x: 18, y: 65 }, { x: 28, y: 82 }, { x: 45, y: 90 }, { x: 65, y: 88 }, { x: 80, y: 75 }, { x: 80, y: 55 }],
    [{ x: 55, y: 55 }, { x: 80, y: 55 }],
  ],
  H: [
    [{ x: 22, y: 10 }, { x: 22, y: 90 }],
    [{ x: 78, y: 10 }, { x: 78, y: 90 }],
    [{ x: 22, y: 50 }, { x: 78, y: 50 }],
  ],
  I: [
    [{ x: 35, y: 10 }, { x: 65, y: 10 }],
    [{ x: 50, y: 10 }, { x: 50, y: 90 }],
    [{ x: 35, y: 90 }, { x: 65, y: 90 }],
  ],
  J: [
    [{ x: 35, y: 10 }, { x: 75, y: 10 }],
    [{ x: 62, y: 10 }, { x: 62, y: 72 }, { x: 55, y: 85 }, { x: 42, y: 90 }, { x: 30, y: 85 }, { x: 25, y: 72 }],
  ],
  K: [
    [{ x: 25, y: 10 }, { x: 25, y: 90 }],
    [{ x: 78, y: 10 }, { x: 25, y: 55 }],
    [{ x: 42, y: 42 }, { x: 78, y: 90 }],
  ],
  L: [
    [{ x: 25, y: 10 }, { x: 25, y: 90 }],
    [{ x: 25, y: 90 }, { x: 78, y: 90 }],
  ],
  M: [
    [{ x: 15, y: 90 }, { x: 15, y: 10 }, { x: 50, y: 55 }, { x: 85, y: 10 }, { x: 85, y: 90 }],
  ],
  N: [
    [{ x: 20, y: 90 }, { x: 20, y: 10 }, { x: 80, y: 90 }, { x: 80, y: 10 }],
  ],
  O: [
    [{ x: 50, y: 10 }, { x: 30, y: 14 }, { x: 18, y: 30 }, { x: 18, y: 70 }, { x: 30, y: 86 }, { x: 50, y: 90 }, { x: 70, y: 86 }, { x: 82, y: 70 }, { x: 82, y: 30 }, { x: 70, y: 14 }, { x: 50, y: 10 }],
  ],
  P: [
    [{ x: 25, y: 10 }, { x: 25, y: 90 }],
    [{ x: 25, y: 10 }, { x: 60, y: 10 }, { x: 78, y: 22 }, { x: 78, y: 38 }, { x: 60, y: 50 }, { x: 25, y: 50 }],
  ],
  Q: [
    [{ x: 50, y: 10 }, { x: 30, y: 14 }, { x: 18, y: 30 }, { x: 18, y: 70 }, { x: 30, y: 86 }, { x: 50, y: 90 }, { x: 70, y: 86 }, { x: 82, y: 70 }, { x: 82, y: 30 }, { x: 70, y: 14 }, { x: 50, y: 10 }],
    [{ x: 60, y: 72 }, { x: 85, y: 95 }],
  ],
  R: [
    [{ x: 25, y: 10 }, { x: 25, y: 90 }],
    [{ x: 25, y: 10 }, { x: 60, y: 10 }, { x: 75, y: 22 }, { x: 75, y: 38 }, { x: 60, y: 50 }, { x: 25, y: 50 }],
    [{ x: 52, y: 50 }, { x: 80, y: 90 }],
  ],
  S: [
    [{ x: 75, y: 22 }, { x: 62, y: 12 }, { x: 42, y: 10 }, { x: 28, y: 18 }, { x: 22, y: 30 }, { x: 28, y: 42 }, { x: 50, y: 50 }, { x: 72, y: 58 }, { x: 78, y: 70 }, { x: 72, y: 82 }, { x: 58, y: 90 }, { x: 38, y: 88 }, { x: 25, y: 78 }],
  ],
  T: [
    [{ x: 15, y: 10 }, { x: 85, y: 10 }],
    [{ x: 50, y: 10 }, { x: 50, y: 90 }],
  ],
  U: [
    [{ x: 20, y: 10 }, { x: 20, y: 68 }, { x: 30, y: 82 }, { x: 50, y: 90 }, { x: 70, y: 82 }, { x: 80, y: 68 }, { x: 80, y: 10 }],
  ],
  V: [
    [{ x: 15, y: 10 }, { x: 50, y: 90 }, { x: 85, y: 10 }],
  ],
  W: [
    [{ x: 10, y: 10 }, { x: 28, y: 90 }, { x: 50, y: 40 }, { x: 72, y: 90 }, { x: 90, y: 10 }],
  ],
  X: [
    [{ x: 18, y: 10 }, { x: 82, y: 90 }],
    [{ x: 82, y: 10 }, { x: 18, y: 90 }],
  ],
  Y: [
    [{ x: 15, y: 10 }, { x: 50, y: 50 }],
    [{ x: 85, y: 10 }, { x: 50, y: 50 }],
    [{ x: 50, y: 50 }, { x: 50, y: 90 }],
  ],
  Z: [
    [{ x: 18, y: 10 }, { x: 82, y: 10 }],
    [{ x: 82, y: 10 }, { x: 18, y: 90 }],
    [{ x: 18, y: 90 }, { x: 82, y: 90 }],
  ],
};

// ============================================================
// Helpers
// ============================================================

/** Sample points along all strokes of a letter for hit-testing. */
function sampleLetterPoints(letter, density = 2) {
  const strokes = LETTER_PATHS[letter.toUpperCase()] || [];
  const points = [];
  for (const stroke of strokes) {
    for (let i = 0; i < stroke.length - 1; i++) {
      const a = stroke[i];
      const b = stroke[i + 1];
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const steps = Math.max(1, Math.round(dist / density));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        points.push({
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
        });
      }
    }
  }
  return points;
}

/** Distance between two points. */
function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// ============================================================
// Component
// ============================================================

const HIT_RADIUS = 8; // how close (in 0-100 coords) the finger needs to be
const COMPLETE_THRESHOLD = 0.70; // 70% coverage = done

export default function LetterTracer({ letter, word, onComplete }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const pointsRef = useRef([]);
  const hitMapRef = useRef(new Set());
  const isDrawingRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [canvasSize, setCanvasSize] = useState(400);

  const upperLetter = letter.toUpperCase();

  // Calculate canvas size and sample points on mount / letter change.
  useEffect(() => {
    setProgress(0);
    setCompleted(false);
    hitMapRef.current = new Set();
    pointsRef.current = sampleLetterPoints(upperLetter, 2);

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const s = Math.min(rect.width - 32, rect.height - 160, 500);
        setCanvasSize(Math.max(200, s));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Voice prompt
    say(`Trace the letter ${upperLetter}!`, { rate: 0.9, pitch: 1.2 });

    return () => window.removeEventListener('resize', updateSize);
  }, [upperLetter]);

  // Draw the guide + user strokes whenever progress updates.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvasSize;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear
    ctx.clearRect(0, 0, size, size);

    const scale = size / 100;
    const strokes = LETTER_PATHS[upperLetter] || [];

    // 1) Draw dotted guide strokes (light gray)
    ctx.save();
    ctx.strokeStyle = 'rgba(43, 45, 66, 0.18)';
    ctx.lineWidth = Math.max(18, size * 0.06);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([4, 12]);
    for (const stroke of strokes) {
      ctx.beginPath();
      stroke.forEach((p, i) => {
        const px = p.x * scale;
        const py = p.y * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
    ctx.restore();

    // 2) Draw solid path underneath where the user has traced
    ctx.save();
    ctx.strokeStyle = '#A8E063';
    ctx.lineWidth = Math.max(20, size * 0.065);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([]);

    const hitSet = hitMapRef.current;
    const allPts = pointsRef.current;

    // Draw small circles at every hit point for a "coloring in" feel
    ctx.fillStyle = '#A8E063';
    for (const idx of hitSet) {
      const pt = allPts[idx];
      if (!pt) continue;
      ctx.beginPath();
      ctx.arc(pt.x * scale, pt.y * scale, Math.max(10, size * 0.032), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3) Draw solid letter outline on top of the green fill
    ctx.save();
    ctx.strokeStyle = 'rgba(43, 45, 66, 0.35)';
    ctx.lineWidth = Math.max(3, size * 0.008);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([]);
    for (const stroke of strokes) {
      ctx.beginPath();
      stroke.forEach((p, i) => {
        const px = p.x * scale;
        const py = p.y * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }
    ctx.restore();

    // 4) Draw start dots (green circles at the beginning of each stroke)
    if (hitSet.size === 0) {
      ctx.save();
      for (const stroke of strokes) {
        const start = stroke[0];
        ctx.fillStyle = '#4ECDC4';
        ctx.beginPath();
        ctx.arc(start.x * scale, start.y * scale, Math.max(12, size * 0.04), 0, Math.PI * 2);
        ctx.fill();
        // Arrow-like indicator
        ctx.fillStyle = '#FFF8E7';
        ctx.font = `${Math.max(14, size * 0.045)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('●', start.x * scale, start.y * scale);
      }
      ctx.restore();
    }
  }, [progress, canvasSize, upperLetter]);

  // Convert a pointer event to 0-100 coordinates.
  const eventToCoord = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      // Handle both touch and mouse events
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * 100,
        y: ((clientY - rect.top) / rect.height) * 100,
      };
    },
    []
  );

  // Check which letter-path points the pointer is near and mark them hit.
  const checkHits = useCallback(
    (coord) => {
      if (!coord || completed) return;
      const allPts = pointsRef.current;
      const hitSet = hitMapRef.current;
      let changed = false;
      for (let i = 0; i < allPts.length; i++) {
        if (!hitSet.has(i) && dist(coord, allPts[i]) < HIT_RADIUS) {
          hitSet.add(i);
          changed = true;
        }
      }
      if (changed) {
        const pct = hitSet.size / allPts.length;
        setProgress(pct);
        if (pct >= COMPLETE_THRESHOLD && !completed) {
          setCompleted(true);
          playSuccess();
          say(`Great job tracing ${upperLetter}!`, { rate: 0.9, pitch: 1.2 });
          setTimeout(() => onComplete(), 1800);
        }
      }
    },
    [completed, upperLetter, onComplete]
  );

  // --- Pointer handlers ---
  const handleStart = useCallback(
    (e) => {
      e.preventDefault();
      isDrawingRef.current = true;
      checkHits(eventToCoord(e));
    },
    [eventToCoord, checkHits]
  );

  const handleMove = useCallback(
    (e) => {
      e.preventDefault();
      if (!isDrawingRef.current) return;
      checkHits(eventToCoord(e));
    },
    [eventToCoord, checkHits]
  );

  const handleEnd = useCallback((e) => {
    e.preventDefault();
    isDrawingRef.current = false;
  }, []);

  const handleSkip = useCallback(() => {
    playTap();
    onComplete();
  }, [onComplete]);

  // Progress ring values
  const ringRadius = 22;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - Math.min(progress / COMPLETE_THRESHOLD, 1));

  return (
    <AnimatePresence>
      <motion.div
        className="tracer-overlay"
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Header with progress ring and skip */}
        <div className="tracer-header">
          <div className="tracer-progress-ring">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle
                cx="28" cy="28" r={ringRadius}
                fill="none"
                stroke="rgba(43,45,66,0.12)"
                strokeWidth="5"
              />
              <circle
                cx="28" cy="28" r={ringRadius}
                fill="none"
                stroke="#A8E063"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                transform="rotate(-90 28 28)"
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <span className="tracer-progress-pct">
              {Math.min(100, Math.round((progress / COMPLETE_THRESHOLD) * 100))}%
            </span>
          </div>

          <div className="tracer-label">
            <span className="tracer-emoji" aria-hidden="true">✏️</span>
            <span className="tracer-letter-preview">{upperLetter}</span>
          </div>

          <motion.button
            type="button"
            className="tracer-skip-btn"
            onClick={handleSkip}
            whileTap={{ scale: 0.9 }}
            aria-label="Skip tracing"
          >
            ▶▶
          </motion.button>
        </div>

        {/* Canvas */}
        <div className="tracer-canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="tracer-canvas"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            onTouchCancel={handleEnd}
            style={{ width: canvasSize, height: canvasSize }}
          />
          {completed && (
            <motion.div
              className="tracer-complete-badge"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              ⭐
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
