// Boot and the frame loop: fit the stage to the window, advance the game
// clock, draw a frame, repeat. In screenshot mode (?shot=…) the staged frame
// is drawn without the clock, so it stays exactly as staged.

import { initInput } from './input.js';
import { render } from './render.js';
import { shotMode, stageShot } from './shots.js';
import { tick } from './game.js';
import { applyTransform, fit } from './viewport.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

fit(canvas);
window.addEventListener('resize', () => fit(canvas));
initInput(canvas);
if (shotMode) stageShot();

let last = performance.now();
function frame(nowMs) {
  const now = nowMs / 1000;
  const step = Math.min(0.05, (nowMs - last) / 1000);
  last = nowMs;
  if (!shotMode) tick(step);
  applyTransform(ctx);
  render(ctx, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
