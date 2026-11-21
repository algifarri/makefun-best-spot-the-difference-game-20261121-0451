// Twin Harbours — every shared number and colour in one place.
// The stage is a fixed 1280x760 logical canvas; the renderer scales it to the
// window, so no rule below depends on the player's screen size.

export const STAGE = { width: 1280, height: 760 };

/** The two picture panels: square scenes, side by side, under the header. */
export const PANEL = { size: 600, top: 128, leftA: 26, leftB: 654, gap: 28 };

/** Header band height; the timer bar lives at its bottom edge. */
export const HEADER = { height: 108 };

export const FONT = '"Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif';

/** Seconds on the clock for each level, and what mistakes and hints cost. */
export const RULES = {
  missPenaltySeconds: 3,
  missPenaltyScore: 25,
  hintCostScore: 50,
  findScore: 100,
  secondBonus: 5, // score per second left when a level is cleared
  hintsPerLevel: 2,
};

/** The three hunts, easiest first. `time` is seconds on the clock. */
export const LEVELS = [
  { scene: 'harbour', name: 'Harbour at Golden Hour', time: 150 },
  { scene: 'workshop', name: "The Clockmaker's Workshop", time: 180 },
  { scene: 'market', name: 'Night Market in the Old Town', time: 210 },
];

export const INK = {
  page: '#101623',
  header: '#171f31',
  headerEdge: '#2b3852',
  text: '#f4f1e6',
  muted: '#9aa7bd',
  gold: '#f2b33d',
  found: '#7ee081',
  miss: '#ff6b5e',
  hint: '#ffc94d',
};
