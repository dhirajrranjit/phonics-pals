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

/**
 * Sample points along all strokes.
 * Each point also records which stroke it belongs to
 * and its sequential index within that stroke.
 * density = distance between points in 0-100 coords.
 */
function sampleLetterPoints(letter, density = 1.5) {
  const strokes = LETTER_PATHS[letter.toUpperCase()] || [];
  const points = [];
  for (let si = 0; si < strokes.length; si++) {
    const stroke = strokes[si];
    let strokePointIdx = 0;
    for (let i = 0; i < stroke.length - 1; i++) {
      const a = stroke[i];
      const b = stroke[i + 1];
      const segDist = Math.hypot(b.x - a.x, b.y - a.y);
      const steps = Math.max(1, Math.round(segDist / density));
      for (let s = 0; s <= steps; s++) {
        // Avoid duplicate at segment junctions
        if (s === 0 && i > 0) continue;
        const t = s / steps;
        points.push({
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
          stroke: si,
          idx: strokePointIdx++,
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

/**
 * Divide sample points into checkpoints — evenly spaced "gates"
 * along each stroke that must be reached in order.
 * This prevents "spray" hits from counting and forces sequential tracing.
 */
function buildCheckpoints(samplePoints, gateSpacing = 6) {
  const byStroke = {};
  for (const pt of samplePoints) {
    if (!byStroke[pt.stroke]) byStroke[pt.stroke] = [];
    byStroke[pt.stroke].push(pt);
  }
  const checkpoints = [];
  for (const strokeIdx of Object.keys(byStroke).sort((a, b) => a - b)) {
    const pts = byStroke[strokeIdx];
    let accumulated = 0;
    checkpoints.push({ ...pts[0], cpIdx: checkpoints.length }); // always include start
    for (let i = 1; i < pts.length; i++) {
      accumulated += dist(pts[i - 1], pts[i]);
      if (accumulated >= gateSpacing) {
        checkpoints.push({ ...pts[i], cpIdx: checkpoints.length });
        accumulated = 0;
      }
    }
    // Always include the last point of each stroke
    const last = pts[pts.length - 1];
    const lastCp = checkpoints[checkpoints.length - 1];
    if (dist(last, lastCp) > 2) {
      checkpoints.push({ ...last, cpIdx: checkpoints.length });
    }
  }
  return checkpoints;
}

// ============================================================
// Component
// ============================================================

const HIT_RADIUS = 4.5;          // how close finger must be (in 0-100 coords)
const COMPLETE_THRESHOLD = 0.92;  // 92% of checkpoints must be reached
const LOOKAHEAD = 3;              // how many checkpoints ahead the child can reach

export default function LetterTracer({ letter, word, onComplete }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const samplePtsRef = useRef([]);
  const checkpointsRef = useRef([]);
  const reachedRef = useRef(new Set());
  const nextCpRef = useRef(0);       // next checkpoint the child should reach
  const isDrawingRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [canvasSize, setCanvasSize] = useState(400);

  const upperLetter = letter.toUpperCase();

  // Set up on mount / letter change.
  useEffect(() => {
    setProgress(0);
    setCompleted(false);
    reachedRef.current = new Set();
    nextCpRef.current = 0;

    const samples = sampleLetterPoints(upperLetter, 1.5);
    samplePtsRef.current = samples;
    checkpointsRef.current = buildCheckpoints(samples, 5);

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const s = Math.min(rect.width - 32, rect.height - 160, 500);
        setCanvasSize(Math.max(200, s));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    say(`Trace the letter ${upperLetter}!`, { rate: 0.9, pitch: 1.2 });

    return () => window.removeEventListener('resize', updateSize);
  }, [upperLetter]);

  // Redraw whenever progress changes.
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
    ctx.clearRect(0, 0, size, size);

    const scale = size / 100;
    const strokes = LETTER_PATHS[upperLetter] || [];
    const reached = reachedRef.current;
    const checkpoints = checkpointsRef.current;

    // 1) Dotted guide path (light gray)
    ctx.save();
    ctx.strokeStyle = 'rgba(43, 45, 66, 0.18)';
    ctx.lineWidth = Math.max(22, size * 0.07);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([3, 10]);
    for (const stroke of strokes) {
      ctx.beginPath();
      stroke.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * scale, p.y * scale);
        else ctx.lineTo(p.x * scale, p.y * scale);
      });
      ctx.stroke();
    }
    ctx.restore();

    // 2) Green fill at reached checkpoints
    ctx.save();
    ctx.fillStyle = '#A8E063';
    for (const cpIdx of reached) {
      const cp = checkpoints[cpIdx];
      if (!cp) continue;
      ctx.beginPath();
      ctx.arc(cp.x * scale, cp.y * scale, Math.max(11, size * 0.035), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3) Solid letter outline on top
    ctx.save();
    ctx.strokeStyle = 'rgba(43, 45, 66, 0.3)';
    ctx.lineWidth = Math.max(2.5, size * 0.006);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const stroke of strokes) {
      ctx.beginPath();
      stroke.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x * scale, p.y * scale);
        else ctx.lineTo(p.x * scale, p.y * scale);
      });
      ctx.stroke();
    }
    ctx.restore();

    // 4) Show the NEXT checkpoint(s) the child should aim for
    ctx.save();
    const nextIdx = nextCpRef.current;
    for (let look = 0; look < LOOKAHEAD; look++) {
      const targetIdx = nextIdx + look;
      if (targetIdx >= checkpoints.length || reached.has(targetIdx)) continue;
      const cp = checkpoints[targetIdx];
      const isImmediate = look === 0;
      // Pulsing teal dot for the next target
      ctx.fillStyle = isImmediate ? '#4ECDC4' : 'rgba(78, 205, 196, 0.35)';
      ctx.beginPath();
      const r = isImmediate ? Math.max(13, size * 0.042) : Math.max(8, size * 0.025);
      ctx.arc(cp.x * scale, cp.y * scale, r, 0, Math.PI * 2);
      ctx.fill();
      if (isImmediate) {
        // White inner dot
        ctx.fillStyle = '#FFF8E7';
        ctx.beginPath();
        ctx.arc(cp.x * scale, cp.y * scale, Math.max(5, size * 0.015), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }, [progress, canvasSize, upperLetter]);

  // Convert pointer to 0-100 coords.
  const eventToCoord = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  /**
   * Sequential checkpoint hit-testing.
   * Only the NEXT few checkpoints (LOOKAHEAD) can be reached.
   * This forces the child to trace in order along each stroke.
   */
  const checkHits = useCallback(
    (coord) => {
      if (!coord || completed) return;
      const checkpoints = checkpointsRef.current;
      const reached = reachedRef.current;
      let changed = false;
      let next = nextCpRef.current;

      // Check the next few upcoming checkpoints
      for (let look = 0; look < LOOKAHEAD; look++) {
        const targetIdx = next + look;
        if (targetIdx >= checkpoints.length) break;
        if (reached.has(targetIdx)) continue;
        const cp = checkpoints[targetIdx];
        if (dist(coord, cp) < HIT_RADIUS) {
          reached.add(targetIdx);
          changed = true;
          // Advance the "next" pointer past all reached checkpoints
          while (nextCpRef.current < checkpoints.length && reached.has(nextCpRef.current)) {
            nextCpRef.current++;
          }
          next = nextCpRef.current;
          break; // only hit one per move event for responsiveness
        }
      }

      if (changed) {
        const pct = reached.size / checkpoints.length;
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

  const handleStart = useCallback((e) => {
    e.preventDefault();
    isDrawingRef.current = true;
    checkHits(eventToCoord(e));
  }, [eventToCoord, checkHits]);

  const handleMove = useCallback((e) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    checkHits(eventToCoord(e));
  }, [eventToCoord, checkHits]);

  const handleEnd = useCallback((e) => {
    e.preventDefault();
    isDrawingRef.current = false;
  }, []);

  const handleSkip = useCallback(() => {
    playTap();
    onComplete();
  }, [onComplete]);

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
