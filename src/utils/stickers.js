// /src/utils/stickers.js
//
// Sticker system for Phonics Pals.
//
// - 72 unique stickers across 6 categories
// - Persisted in localStorage
// - Each game session earns 1–3 stickers based on score
// - Stickers are awarded randomly from the uncollected pool
// - Once all are collected, duplicates show a sparkle badge

const STORAGE_KEY = 'phonics-pals-stickers';

// ============================================================
// Sticker catalog — 72 stickers, 12 per category
// ============================================================

export const STICKER_CATEGORIES = [
  {
    name: 'Animals',
    icon: '🐾',
    stickers: [
      { id: 'a01', emoji: '🐶', label: 'Puppy' },
      { id: 'a02', emoji: '🐱', label: 'Kitten' },
      { id: 'a03', emoji: '🐰', label: 'Bunny' },
      { id: 'a04', emoji: '🦊', label: 'Fox' },
      { id: 'a05', emoji: '🐼', label: 'Panda' },
      { id: 'a06', emoji: '🦁', label: 'Lion' },
      { id: 'a07', emoji: '🐸', label: 'Frog' },
      { id: 'a08', emoji: '🦋', label: 'Butterfly' },
      { id: 'a09', emoji: '🐙', label: 'Octopus' },
      { id: 'a10', emoji: '🦄', label: 'Unicorn' },
      { id: 'a11', emoji: '🐧', label: 'Penguin' },
      { id: 'a12', emoji: '🦀', label: 'Crab' },
    ],
  },
  {
    name: 'Food',
    icon: '🍕',
    stickers: [
      { id: 'f01', emoji: '🍎', label: 'Apple' },
      { id: 'f02', emoji: '🍕', label: 'Pizza' },
      { id: 'f03', emoji: '🧁', label: 'Cupcake' },
      { id: 'f04', emoji: '🍩', label: 'Donut' },
      { id: 'f05', emoji: '🍉', label: 'Watermelon' },
      { id: 'f06', emoji: '🌮', label: 'Taco' },
      { id: 'f07', emoji: '🍦', label: 'Ice Cream' },
      { id: 'f08', emoji: '🍪', label: 'Cookie' },
      { id: 'f09', emoji: '🍓', label: 'Strawberry' },
      { id: 'f10', emoji: '🧀', label: 'Cheese' },
      { id: 'f11', emoji: '🥕', label: 'Carrot' },
      { id: 'f12', emoji: '🍌', label: 'Banana' },
    ],
  },
  {
    name: 'Nature',
    icon: '🌈',
    stickers: [
      { id: 'n01', emoji: '🌈', label: 'Rainbow' },
      { id: 'n02', emoji: '🌻', label: 'Sunflower' },
      { id: 'n03', emoji: '🌙', label: 'Moon' },
      { id: 'n04', emoji: '⭐', label: 'Star' },
      { id: 'n05', emoji: '🌊', label: 'Wave' },
      { id: 'n06', emoji: '🍄', label: 'Mushroom' },
      { id: 'n07', emoji: '🌴', label: 'Palm Tree' },
      { id: 'n08', emoji: '🔥', label: 'Fire' },
      { id: 'n09', emoji: '❄️', label: 'Snowflake' },
      { id: 'n10', emoji: '🌸', label: 'Blossom' },
      { id: 'n11', emoji: '☀️', label: 'Sunshine' },
      { id: 'n12', emoji: '🍃', label: 'Leaf' },
    ],
  },
  {
    name: 'Space',
    icon: '🚀',
    stickers: [
      { id: 's01', emoji: '🚀', label: 'Rocket' },
      { id: 's02', emoji: '🛸', label: 'UFO' },
      { id: 's03', emoji: '🌍', label: 'Earth' },
      { id: 's04', emoji: '🪐', label: 'Saturn' },
      { id: 's05', emoji: '☄️', label: 'Comet' },
      { id: 's06', emoji: '🌟', label: 'Glowing Star' },
      { id: 's07', emoji: '👽', label: 'Alien' },
      { id: 's08', emoji: '🔭', label: 'Telescope' },
      { id: 's09', emoji: '👩‍🚀', label: 'Astronaut' },
      { id: 's10', emoji: '🌑', label: 'New Moon' },
      { id: 's11', emoji: '💫', label: 'Dizzy Star' },
      { id: 's12', emoji: '🛰️', label: 'Satellite' },
    ],
  },
  {
    name: 'Vehicles',
    icon: '🚗',
    stickers: [
      { id: 'v01', emoji: '🚗', label: 'Car' },
      { id: 'v02', emoji: '🚒', label: 'Fire Truck' },
      { id: 'v03', emoji: '✈️', label: 'Airplane' },
      { id: 'v04', emoji: '🚂', label: 'Train' },
      { id: 'v05', emoji: '🚁', label: 'Helicopter' },
      { id: 'v06', emoji: '⛵', label: 'Sailboat' },
      { id: 'v07', emoji: '🏎️', label: 'Race Car' },
      { id: 'v08', emoji: '🚀', label: 'Spaceship' },
      { id: 'v09', emoji: '🚲', label: 'Bicycle' },
      { id: 'v10', emoji: '🛴', label: 'Scooter' },
      { id: 'v11', emoji: '🚜', label: 'Tractor' },
      { id: 'v12', emoji: '🛥️', label: 'Speedboat' },
    ],
  },
  {
    name: 'Fun',
    icon: '🎉',
    stickers: [
      { id: 'x01', emoji: '🎈', label: 'Balloon' },
      { id: 'x02', emoji: '🎸', label: 'Guitar' },
      { id: 'x03', emoji: '🎨', label: 'Art' },
      { id: 'x04', emoji: '🏆', label: 'Trophy' },
      { id: 'x05', emoji: '🎭', label: 'Theater' },
      { id: 'x06', emoji: '🎪', label: 'Circus' },
      { id: 'x07', emoji: '🧸', label: 'Teddy Bear' },
      { id: 'x08', emoji: '🎮', label: 'Game' },
      { id: 'x09', emoji: '🎁', label: 'Present' },
      { id: 'x10', emoji: '🏅', label: 'Medal' },
      { id: 'x11', emoji: '👑', label: 'Crown' },
      { id: 'x12', emoji: '💎', label: 'Gem' },
    ],
  },
];

// Flat list of all sticker IDs for quick lookup.
export const ALL_STICKERS = STICKER_CATEGORIES.flatMap((cat) => cat.stickers);
export const TOTAL_STICKER_COUNT = ALL_STICKERS.length;

// Sticker lookup map: id → { emoji, label, category }
const STICKER_MAP = {};
STICKER_CATEGORIES.forEach((cat) => {
  cat.stickers.forEach((s) => {
    STICKER_MAP[s.id] = { ...s, category: cat.name };
  });
});
export function getStickerById(id) {
  return STICKER_MAP[id] || null;
}

// ============================================================
// Persistence — localStorage
// ============================================================

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { collected: [], sessions: 0 };
    const parsed = JSON.parse(raw);
    return {
      collected: Array.isArray(parsed.collected) ? parsed.collected : [],
      sessions: typeof parsed.sessions === 'number' ? parsed.sessions : 0,
    };
  } catch {
    return { collected: [], sessions: 0 };
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or blocked — silently fail
  }
}

/** Get all collected sticker IDs. */
export function getCollectedStickers() {
  return loadData().collected;
}

/** Get session count. */
export function getSessionCount() {
  return loadData().sessions;
}

/** Get total unique stickers collected. */
export function getCollectedCount() {
  return new Set(loadData().collected).size;
}

/**
 * Award stickers based on game score.
 * Returns an array of newly awarded sticker objects (1–3 items).
 *
 * Logic:
 *   - score 1–4 → 1 sticker
 *   - score 5–7 → 2 stickers
 *   - score 8–10 → 3 stickers
 *
 * Picks from uncollected pool first; if all are collected,
 * picks randomly from the full pool (duplicate = extra sparkle).
 */
export function awardStickers(score, total = 10) {
  const data = loadData();
  const collectedSet = new Set(data.collected);

  // Determine how many stickers to award
  let count;
  if (score >= total * 0.8) count = 3;
  else if (score >= total * 0.5) count = 2;
  else count = 1;

  // Build uncollected pool
  const uncollected = ALL_STICKERS.filter((s) => !collectedSet.has(s.id));

  const awarded = [];
  for (let i = 0; i < count; i++) {
    let pick;
    if (uncollected.length > 0) {
      // Pick random from uncollected
      const idx = Math.floor(Math.random() * uncollected.length);
      pick = uncollected.splice(idx, 1)[0];
    } else {
      // All collected — pick any random (duplicate)
      pick = ALL_STICKERS[Math.floor(Math.random() * ALL_STICKERS.length)];
    }
    awarded.push({ ...pick, isNew: !collectedSet.has(pick.id) });
    collectedSet.add(pick.id);
  }

  // Persist
  data.collected = [...collectedSet];
  data.sessions += 1;
  saveData(data);

  return awarded;
}

/** Reset all sticker data. */
export function resetStickers() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}
