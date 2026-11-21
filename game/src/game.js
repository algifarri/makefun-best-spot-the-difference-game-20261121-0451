// The rules of Twin Harbours: levels, the clock, scoring, hints and the
// found/missed marks. Pure state and logic — rendering lives in render.js and
// pointer handling in input.js, which both read this state.

import { LEVELS, RULES } from './config.js';
import { DIFFERENCES } from './scenes.js';
import { sound } from './sound.js';

export const SCREEN = { TITLE: 'title', PLAY: 'play', CLEAR: 'clear', WIN: 'win', TIMEUP: 'timeup' };

export const game = {
  screen: SCREEN.TITLE,
  levelIndex: 0,
  found: new Set(),
  score: 0,
  timeLeft: 0,
  hintsLeft: RULES.hintsPerLevel,
  marks: [], // transient {x, y, kind: 'found'|'miss', age} in panel coordinates
  hintPulse: null, // {diff, age} — a ring that breathes around one unfound difference
  shake: 0,
  lastFindLabel: null,
  clearBonus: 0,
};

export function level() {
  return LEVELS[game.levelIndex];
}

export function differences() {
  return DIFFERENCES[level().scene];
}

export function remaining() {
  return differences().length - game.found.size;
}

export function newGame() {
  game.score = 0;
  startLevel(0);
}

export function startLevel(index) {
  game.levelIndex = index;
  game.found = new Set();
  game.timeLeft = LEVELS[index].time;
  game.hintsLeft = RULES.hintsPerLevel;
  game.marks = [];
  game.hintPulse = null;
  game.lastFindLabel = null;
  game.screen = SCREEN.PLAY;
}

/** A click in panel coordinates. Returns 'found' | 'already' | 'miss' | null (not playing). */
export function clickAt(x, y) {
  if (game.screen !== SCREEN.PLAY) return null;
  for (const diff of differences()) {
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) {
      if (game.found.has(diff.id)) return 'already';
      game.found.add(diff.id);
      game.score += RULES.findScore;
      game.lastFindLabel = diff.label;
      game.marks.push({ x: diff.x, y: diff.y, kind: 'found', age: 0 });
      sound.find();
      if (remaining() === 0) {
        game.clearBonus = Math.round(game.timeLeft) * RULES.secondBonus;
        game.score += game.clearBonus;
        game.screen = game.levelIndex === LEVELS.length - 1 ? SCREEN.WIN : SCREEN.CLEAR;
        if (game.screen === SCREEN.WIN) sound.win();
        else sound.clear();
      }
      return 'found';
    }
  }
  game.score = Math.max(0, game.score - RULES.missPenaltyScore);
  game.timeLeft = Math.max(0, game.timeLeft - RULES.missPenaltySeconds);
  game.marks.push({ x, y, kind: 'miss', age: 0 });
  game.shake = 0.32;
  sound.miss();
  return 'miss';
}

/** Spend a hint: pulse a ring around one unfound difference for a moment. */
export function useHint() {
  if (game.screen !== SCREEN.PLAY || game.hintsLeft <= 0 || game.hintPulse) return false;
  const open = differences().filter((d) => !game.found.has(d.id));
  if (open.length === 0) return false;
  const pick = open[Math.floor(Math.random() * open.length)];
  game.hintPulse = { diff: pick, age: 0 };
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - RULES.hintCostScore);
  sound.hint();
  return true;
}

/** Advance the clock and the transient animations. dt in seconds. */
export function tick(dt) {
  if (game.shake > 0) game.shake = Math.max(0, game.shake - dt);
  for (const mark of game.marks) mark.age += dt;
  game.marks = game.marks.filter((m) => m.age < (m.kind === 'found' ? 0.9 : 0.55));
  if (game.hintPulse) {
    game.hintPulse.age += dt;
    if (game.hintPulse.age > 1.6) game.hintPulse = null;
  }
  if (game.screen !== SCREEN.PLAY) return;
  game.timeLeft -= dt;
  if (game.timeLeft <= 0) {
    game.timeLeft = 0;
    game.screen = SCREEN.TIMEUP;
    sound.lose();
  }
}
