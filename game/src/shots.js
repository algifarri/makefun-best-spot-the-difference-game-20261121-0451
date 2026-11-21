// Screenshot staging behind ?shot=… — the same scenes a player reaches, set
// up deterministically so the maker's screenshots are real frames of the
// game: ?shot=play&level=2&found=5 shows scene 2 mid-hunt with five markers
// down, ?shot=end the final card, anything else the title. In shot mode the
// clock is frozen (main.js skips tick), so the frame never drifts.

import { LEVELS } from './config.js';
import { SCREEN, differences, game, startLevel } from './game.js';

export const shotMode = new URLSearchParams(window.location.search).has('shot');

export function stageShot() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('shot');
  if (name === 'end') {
    startLevel(LEVELS.length - 1);
    for (const d of differences()) game.found.add(d.id);
    game.score = 2875;
    game.timeLeft = 47;
    game.screen = SCREEN.WIN;
    return;
  }
  if (name !== 'play') return; // title screen is the boot state
  const levelIndex = Math.min(LEVELS.length - 1, Math.max(0, Number(params.get('level') || '1') - 1));
  startLevel(levelIndex);
  const diffs = differences();
  const wanted = Math.min(diffs.length - 2, Math.max(0, Number(params.get('found') || '3')));
  // spread the "found" picks evenly across the list, as a real hunt would
  for (let i = 0; i < wanted; i += 1) {
    const diff = diffs[Math.floor((i * diffs.length) / wanted)];
    game.found.add(diff.id);
    game.lastFindLabel = diff.label;
  }
  game.score = levelIndex * 640 + game.found.size * 100 - 25;
  game.timeLeft = Math.round(LEVELS[levelIndex].time * 0.62);
}
