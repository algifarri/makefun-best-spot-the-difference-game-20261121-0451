// How the fixed 1280x760 stage maps onto the player's window: one scale that
// fits both dimensions, centred with letterbox margins. main.js draws through
// this transform and input.js converts clicks back through it.

import { STAGE } from './config.js';

export const view = { scale: 1, ox: 0, oy: 0, dpr: 1 };

/** Recompute the transform for the canvas's current CSS size. */
export function fit(canvas) {
  view.dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  view.scale = Math.min(w / STAGE.width, h / STAGE.height);
  view.ox = (w - STAGE.width * view.scale) / 2;
  view.oy = (h - STAGE.height * view.scale) / 2;
  canvas.width = Math.round(w * view.dpr);
  canvas.height = Math.round(h * view.dpr);
}

/** Apply the transform to a 2D context before drawing a frame. */
export function applyTransform(ctx) {
  ctx.setTransform(view.dpr * view.scale, 0, 0, view.dpr * view.scale, view.dpr * view.ox, view.dpr * view.oy);
}

/** Convert a mouse event's client position to stage coordinates. */
export function toStage(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - view.ox) / view.scale,
    y: (clientY - rect.top - view.oy) / view.scale,
  };
}
