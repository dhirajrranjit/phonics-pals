// /src/utils/audio.js
//
// Audio system for Phonics Pals.
//
// Strategy:
//   1) Try to load real mp3 files via Howler (preloaded for instant playback).
//   2) If a file is missing or fails to load, fall back to the browser's
//      built-in Speech Synthesis — so the "Sound First" experience works
//      out of the box even before real audio assets are added.
//
// Sound effects (success / error / start) are generated procedurally with
// the Web Audio API so there are zero external dependencies for the MVP.

import { Howl } from 'howler';

// ----- Howler cache -------------------------------------------------------

const howlCache = new Map();
const failedSrcs = new Set();

function getHowl(src) {
  if (failedSrcs.has(src)) return null;
  if (howlCache.has(src)) return howlCache.get(src);

  const howl = new Howl({
    src: [src],
    preload: true,
    html5: false,
    onloaderror: () => {
      failedSrcs.add(src);
      howlCache.delete(src);
    },
    onplayerror: () => {
      failedSrcs.add(src);
    },
  });

  howlCache.set(src, howl);
  return howl;
}

export function preloadHowls(srcs) {
  srcs.forEach((src) => {
    if (src) getHowl(src);
  });
}

// ----- Speech synthesis fallback -----------------------------------------

let voicesReady = false;
function ensureVoices() {
  if (voicesReady || typeof window === 'undefined' || !window.speechSynthesis) return;
  // Trigger voice list load
  window.speechSynthesis.getVoices();
  voicesReady = true;
}

function speak(text, { rate = 0.9, pitch = 1.2 } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  ensureVoices();
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = rate;
  utter.pitch = pitch;
  utter.volume = 1;
  // Pick an English voice if available
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find((v) => /en[-_]/i.test(v.lang)) || voices[0];
  if (enVoice) utter.voice = enVoice;
  window.speechSynthesis.speak(utter);
}

// ----- Public sound helpers ----------------------------------------------

/**
 * Play a phonics sound for the current round.
 *
 * If a real audio file is available at `src`, plays that.
 * Otherwise falls back to speaking the WORD itself, twice, with a pause
 * between — e.g., "Goat... goat." This is far better than reading
 * the textbook phoneme "guh" out loud, because the child hears the real
 * initial sound (/g/) in natural speech, exactly how phonics teachers
 * present it in classrooms.
 */
export function playPhonics(src, word) {
  const h = getHowl(src);
  if (h && h.state() !== 'loaderror') {
    h.stop();
    h.play();
    // Howler may still fail on play — give it a moment, then check.
    setTimeout(() => {
      if (failedSrcs.has(src)) sayWordOnce(word);
    }, 60);
    return;
  }
  sayWordOnce(word);
}

/** Speak the word once, slowly and clearly — so the child hears the initial sound. */
function sayWordOnce(word) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  ensureVoices();
  window.speechSynthesis.cancel();

  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find((v) => /en[-_]/i.test(v.lang)) || voices[0];

  const u = new SpeechSynthesisUtterance(word);
  u.rate = 0.75;
  u.pitch = 1.25;
  u.volume = 1;
  if (enVoice) u.voice = enVoice;
  window.speechSynthesis.speak(u);
}

/** Play a full-word audio. Speaks "<letter> is for <word>!" as fallback. */
export function playWord(src, word, correctLetter) {
  const h = getHowl(src);
  if (h && h.state() !== 'loaderror') {
    h.stop();
    h.play();
    setTimeout(() => {
      if (failedSrcs.has(src)) {
        speak(`${correctLetter.toUpperCase()} is for ${word}!`, { rate: 0.85, pitch: 1.25 });
      }
    }, 60);
    return;
  }
  speak(`${correctLetter.toUpperCase()} is for ${word}!`, { rate: 0.85, pitch: 1.25 });
}

// ----- Procedural sound effects ------------------------------------------

let audioCtx = null;
function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  // Auto-resume if suspended (mobile autoplay policies)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function tone({ freq, duration = 0.18, type = 'sine', gain = 0.18, startAt = 0, slideTo = null }) {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + startAt;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo != null) {
    osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  }
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** Cheerful ascending arpeggio. */
export function playSuccess() {
  // C–E–G–C major arpeggio with a sparkly top note
  tone({ freq: 523.25, duration: 0.14, type: 'triangle', gain: 0.22, startAt: 0.00 });
  tone({ freq: 659.25, duration: 0.14, type: 'triangle', gain: 0.22, startAt: 0.10 });
  tone({ freq: 783.99, duration: 0.16, type: 'triangle', gain: 0.22, startAt: 0.20 });
  tone({ freq: 1046.5, duration: 0.30, type: 'triangle', gain: 0.20, startAt: 0.32 });
  // Sparkle
  tone({ freq: 1568, duration: 0.18, type: 'sine', gain: 0.10, startAt: 0.40 });
}

/** Friendly “oops” boing — never harsh. */
export function playOops() {
  tone({ freq: 380, duration: 0.22, type: 'sine', gain: 0.18, startAt: 0.00, slideTo: 220 });
  tone({ freq: 320, duration: 0.18, type: 'triangle', gain: 0.12, startAt: 0.18, slideTo: 200 });
}

/** Tiny tap blip for button feedback. */
export function playTap() {
  tone({ freq: 660, duration: 0.06, type: 'square', gain: 0.07 });
}

/** Triumphant fanfare for end-of-game. */
export function playFanfare() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  notes.forEach((f, i) => tone({ freq: f, duration: 0.22, type: 'triangle', gain: 0.22, startAt: i * 0.15 }));
}

/** Speak a free-form sentence (for the start-screen invitation, end-screen praise). */
export function say(text, opts) {
  speak(text, opts);
}

/** Cancel any in-flight speech. */
export function cancelSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Blend CVC sounds: speak each letter sound individually with pauses,
 * then say the full word. Calls `onLetterHighlight(index)` as each
 * letter is spoken so the UI can highlight them in sequence.
 *
 * Returns a cleanup function that cancels pending timeouts.
 */
export function playBlend(word, onLetterHighlight, onWordSpoken) {
  cancelSpeech();
  const letters = word.split('');
  const timeouts = [];

  // Speak each letter sound with ~700ms spacing
  letters.forEach((_, i) => {
    const t = setTimeout(() => {
      if (onLetterHighlight) onLetterHighlight(i);
      // Speak the letter name as a phonics cue — the word gives natural sound
      speak(letters[i], { rate: 0.65, pitch: 1.3 });
    }, i * 800);
    timeouts.push(t);
  });

  // After all letters, pause then say the full word
  const blendDelay = letters.length * 800 + 500;
  const t1 = setTimeout(() => {
    if (onLetterHighlight) onLetterHighlight(-1); // clear highlight
    // Small blending tone
    tone({ freq: 440, duration: 0.08, type: 'sine', gain: 0.08 });
  }, blendDelay);
  timeouts.push(t1);

  const t2 = setTimeout(() => {
    speak(word, { rate: 0.78, pitch: 1.2 });
    if (onWordSpoken) onWordSpoken();
  }, blendDelay + 300);
  timeouts.push(t2);

  return () => timeouts.forEach(clearTimeout);
}
