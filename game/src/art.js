// Small canvas drawing helpers shared by every scene painter: soft shapes,
// gradients and little props (clouds, gulls, stars, lanterns). Everything is
// drawn in code — the game ships no image files at all.

/** Filled circle. */
export function disc(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Stroked circle. */
export function ring(ctx, x, y, r, colour, width) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

/** Filled rectangle with rounded corners. */
export function roundRect(ctx, x, y, w, h, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

/** A straight filled polygon from [x, y] points. */
export function poly(ctx, points, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

/** Vertical linear gradient fill for a rectangle. stops: [[offset, colour], ...] */
export function skyGrad(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  for (const [offset, colour] of stops) g.addColorStop(offset, colour);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

/** A soft-edged cloud: a cluster of overlapping discs on a flat base. */
export function cloud(ctx, x, y, s, colour) {
  ctx.fillStyle = colour;
  disc(ctx, x, y, 16 * s, colour);
  disc(ctx, x + 18 * s, y + 3 * s, 12 * s, colour);
  disc(ctx, x - 19 * s, y + 4 * s, 11 * s, colour);
  roundRect(ctx, x - 28 * s, y + 2 * s, 56 * s, 10 * s, 5 * s, colour);
}

/** A distant gull: two arcs meeting at a point, like a child's drawing. */
export function gull(ctx, x, y, s, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.2 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 6 * s, y, 6 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.arc(x + 6 * s, y, 6 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

/** A four-point sparkle star, for night skies and magic moments. */
export function sparkle(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

/** A hanging paper lantern: ribbed oval, cap and tassel. */
export function lantern(ctx, x, y, r, colour, lit = true) {
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.2, x, y, r * 1.15);
  g.addColorStop(0, lit ? '#fff3c4' : colour);
  g.addColorStop(0.45, colour);
  g.addColorStop(1, shade(colour, -38));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.82, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(60,30,10,0.35)';
  ctx.lineWidth = 1;
  for (const f of [-0.55, 0, 0.55]) {
    ctx.beginPath();
    ctx.ellipse(x, y, r * Math.abs(f) + r * 0.28, r * 0.82, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  roundRect(ctx, x - r * 0.34, y - r * 0.98, r * 0.68, r * 0.2, 2, '#5b4326');
  ctx.strokeStyle = '#5b4326';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + r * 0.82);
  ctx.lineTo(x, y + r * 1.2);
  ctx.stroke();
}

/** Darken (negative amount) or lighten a #rrggbb colour. */
export function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amount);
  const g = clamp(((n >> 8) & 0xff) + amount);
  const b = clamp((n & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

/** A simple sitting cat silhouette with ears, tail and optional eyes. */
export function cat(ctx, x, y, s, colour, awake) {
  ctx.fillStyle = colour;
  // body
  ctx.beginPath();
  ctx.ellipse(x, y, 16 * s, 13 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  // head
  disc(ctx, x + 10 * s, y - 13 * s, 9.5 * s, colour);
  // ears
  poly(ctx, [[x + 3 * s, y - 19 * s], [x + 5 * s, y - 27 * s], [x + 10 * s, y - 21 * s]], colour);
  poly(ctx, [[x + 13 * s, y - 21 * s], [x + 18 * s, y - 27 * s], [x + 19 * s, y - 18 * s]], colour);
  // tail curling around the base
  ctx.strokeStyle = colour;
  ctx.lineWidth = 5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - 6 * s, y + 4 * s, 15 * s, Math.PI * 0.35, Math.PI * 1.05);
  ctx.stroke();
  if (awake) {
    disc(ctx, x + 7 * s, y - 14 * s, 1.5 * s, '#101623');
    disc(ctx, x + 14 * s, y - 14 * s, 1.5 * s, '#101623');
  } else {
    ctx.strokeStyle = '#101623';
    ctx.lineWidth = 1.4 * s;
    ctx.beginPath();
    ctx.moveTo(x + 5 * s, y - 13 * s);
    ctx.lineTo(x + 9 * s, y - 13 * s);
    ctx.moveTo(x + 12 * s, y - 13 * s);
    ctx.lineTo(x + 16 * s, y - 13 * s);
    ctx.stroke();
  }
}
