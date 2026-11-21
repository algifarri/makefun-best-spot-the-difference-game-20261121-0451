// Pointer and keyboard handling: clicks on the pictures become panel
// coordinates for game.clickAt; clicks on the header buttons and the overlay
// cards do their jobs; H hints, M mutes, Enter starts or advances.

import { PANEL } from './config.js';
import { SCREEN, clickAt, game, newGame, startLevel, useHint } from './game.js';
import { ui } from './render.js';
import { sound } from './sound.js';
import { toStage } from './viewport.js';

function inside(p, rect) {
  return rect && p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h;
}

/** The overlay card's one big button, per screen. */
export function primaryAction() {
  if (game.screen === SCREEN.TITLE) newGame();
  else if (game.screen === SCREEN.CLEAR) startLevel(game.levelIndex + 1);
  else if (game.screen === SCREEN.WIN) newGame();
  else if (game.screen === SCREEN.TIMEUP) startLevel(game.levelIndex);
}

export function initInput(canvas) {
  canvas.addEventListener('pointerdown', (event) => {
    sound.unlock();
    const p = toStage(canvas, event.clientX, event.clientY);
    if (game.screen !== SCREEN.PLAY) {
      if (inside(p, ui.primary)) primaryAction();
      return;
    }
    if (inside(p, ui.hint)) {
      useHint();
      return;
    }
    if (inside(p, ui.mute)) {
      sound.toggleMute();
      return;
    }
    for (const left of [PANEL.leftA, PANEL.leftB]) {
      if (p.x >= left && p.x <= left + PANEL.size && p.y >= PANEL.top && p.y <= PANEL.top + PANEL.size) {
        clickAt(p.x - left, p.y - PANEL.top);
        return;
      }
    }
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') useHint();
    else if (event.key === 'm' || event.key === 'M') sound.toggleMute();
    else if ((event.key === 'Enter' || event.key === ' ') && game.screen !== SCREEN.PLAY) {
      event.preventDefault();
      sound.unlock();
      primaryAction();
    }
  });
}
