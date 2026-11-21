// The three scenes of Twin Harbours, painted procedurally on a 600x600 canvas.
// Each painter receives `alt`, the set of difference ids switched on for the
// right-hand panel; the left panel is painted with an empty set. A difference
// is a small, controlled change — a lamp lit or dark, a sail re-coloured, a
// cat that is simply not there — defined once in DIFFERENCES with the point a
// player must click (in panel coordinates) and the radius that counts as a hit.

import { cat, cloud, disc, gull, lantern, poly, ring, roundRect, shade, skyGrad, sparkle } from './art.js';
import { mulberry32, range } from './random.js';

export const SCENE_SIZE = 600;

/** Difference metadata per scene: id, click point, hit radius, recap label. */
export const DIFFERENCES = {
  harbour: [
    { id: 'lamp', x: 98, y: 150, r: 30, label: 'The lighthouse lamp' },
    { id: 'sail', x: 330, y: 372, r: 38, label: 'The colour of the tall sail' },
    { id: 'gull', x: 430, y: 88, r: 22, label: 'A missing gull' },
    { id: 'awning', x: 490, y: 402, r: 44, label: 'The café awning stripes' },
    { id: 'buoy', x: 520, y: 452, r: 20, label: 'An extra buoy' },
    { id: 'cat', x: 150, y: 496, r: 28, label: 'The cat on the crates' },
  ],
  workshop: [
    { id: 'hands', x: 300, y: 165, r: 46, label: 'The time on the big clock' },
    { id: 'book', x: 455, y: 96, r: 16, label: 'A book spine changed colour' },
    { id: 'shelfclock', x: 520, y: 166, r: 24, label: 'A missing shelf clock' },
    { id: 'gear', x: 205, y: 150, r: 32, label: 'The brass gear, tarnished' },
    { id: 'steam', x: 430, y: 372, r: 20, label: 'The teapot steam' },
    { id: 'lamp', x: 505, y: 378, r: 28, label: 'The desk lamp shade' },
    { id: 'cat', x: 185, y: 508, r: 30, label: 'The cat, awake or asleep' },
    { id: 'bird', x: 95, y: 288, r: 20, label: 'A bird on the windowsill' },
  ],
  market: [
    { id: 'moon', x: 498, y: 78, r: 30, label: 'The moon, crescent or full' },
    { id: 'star', x: 200, y: 58, r: 16, label: 'A missing bright star' },
    { id: 'bulb', x: 243, y: 166, r: 15, label: 'One bulb burns teal' },
    { id: 'owl', x: 545, y: 176, r: 22, label: 'The owl on the signpost' },
    { id: 'canopy', x: 300, y: 296, r: 46, label: 'The middle canopy stripes' },
    { id: 'lantern', x: 115, y: 330, r: 20, label: 'A lantern changed colour' },
    { id: 'sign', x: 66, y: 428, r: 18, label: 'The hanging sign shape' },
    { id: 'fruit', x: 320, y: 476, r: 26, label: 'Apples became oranges' },
    { id: 'jar', x: 478, y: 406, r: 14, label: 'A missing honey jar' },
    { id: 'scarf', x: 455, y: 524, r: 24, label: "The cat's scarf" },
  ],
};

/* ---------------- Level 1: Harbour at Golden Hour ---------------- */

function paintHarbour(ctx, alt) {
  const rng = mulberry32(20261121);
  skyGrad(ctx, 0, 0, 600, 600, [
    [0, '#ffd98e'], [0.35, '#ffb26b'], [0.62, '#ff8e6e'], [1, '#e56b6f'],
  ]);
  // sun and its glow
  const glow = ctx.createRadialGradient(468, 108, 8, 468, 108, 120);
  glow.addColorStop(0, 'rgba(255,244,190,0.95)');
  glow.addColorStop(0.35, 'rgba(255,214,120,0.45)');
  glow.addColorStop(1, 'rgba(255,214,120,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(348, 0, 240, 228);
  disc(ctx, 468, 108, 33, '#fff3b0');
  disc(ctx, 468, 108, 27, '#ffe27a');
  cloud(ctx, 128, 66, 1.05, 'rgba(255,240,214,0.92)');
  cloud(ctx, 292, 44, 0.8, 'rgba(255,240,214,0.85)');
  cloud(ctx, 540, 196, 0.62, 'rgba(255,226,196,0.8)');
  gull(ctx, 250, 112, 1, '#7a4a3a');
  gull(ctx, 352, 142, 0.8, '#7a4a3a');
  if (!alt.has('gull')) gull(ctx, 430, 88, 0.95, '#7a4a3a');
  // distant headland
  poly(ctx, [[430, 332], [505, 282], [600, 300], [600, 336]], '#b8575f');
  poly(ctx, [[430, 332], [505, 282], [600, 300], [600, 312], [500, 296], [452, 332]], '#cf6a63');
  // sea
  skyGrad(ctx, 0, 330, 600, 142, [[0, '#f7a56b'], [0.25, '#e2706a'], [1, '#8e4a72']]);
  ctx.fillStyle = 'rgba(255,227,150,0.5)';
  for (let i = 0; i < 46; i += 1) {
    const y = 338 + rng() * 126;
    const w = 6 + rng() * 22 * (0.4 + (y - 330) / 142);
    ctx.fillRect(452 + (rng() - 0.5) * 90 - w / 2, y, w, 2.2);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.20)';
  for (let i = 0; i < 60; i += 1) ctx.fillRect(rng() * 600, 336 + rng() * 128, 3 + rng() * 9, 1.6);
  // rocks and lighthouse (left)
  poly(ctx, [[18, 392], [52, 344], [104, 330], [150, 352], [168, 392]], '#6e4a52');
  poly(ctx, [[52, 344], [104, 330], [128, 344], [70, 356]], '#86606a');
  poly(ctx, [[74, 348], [122, 348], [114, 218], [82, 218]], '#f6efe3'); // tower
  poly(ctx, [[80, 300], [118, 300], [115, 262], [83, 262]], '#d64550'); // band
  poly(ctx, [[84, 218], [112, 218], [110, 196], [86, 196]], '#d64550'); // band
  roundRect(ctx, 70, 348, 56, 10, 3, '#54383f');
  roundRect(ctx, 78, 168, 40, 30, 4, '#37404f'); // lamp room
  if (alt.has('lamp')) {
    disc(ctx, 98, 150, 26, 'rgba(30,34,44,0.9)');
  } else {
    const lampGlow = ctx.createRadialGradient(98, 150, 2, 98, 150, 44);
    lampGlow.addColorStop(0, 'rgba(255,240,170,0.95)');
    lampGlow.addColorStop(1, 'rgba(255,240,170,0)');
    ctx.fillStyle = lampGlow;
    ctx.fillRect(54, 106, 88, 88);
    disc(ctx, 98, 150, 10, '#ffe98a');
    ring(ctx, 98, 150, 12.5, '#ffd23e', 2.5);
  }
  poly(ctx, [[70, 168], [126, 168], [98, 138]], '#37404f'); // roof
  // boats
  boat(ctx, 330, 402, 1.15, alt.has('sail') ? '#e5534b' : '#fdf6e3', '#8a5a3b');
  boat(ctx, 208, 428, 0.7, '#f2c94c', '#6e4a2f');
  // fishing boat, right
  poly(ctx, [[448, 428], [540, 428], [524, 448], [462, 448]], '#4a6b8a');
  ctx.fillRect(490, 388, 4, 42);
  poly(ctx, [[494, 392], [494, 424], [522, 424]], '#fdf6e3');
  roundRect(ctx, 452, 420, 84, 9, 3, '#38506b');
  // buoys
  buoy(ctx, 252, 452, '#e5534b');
  if (alt.has('buoy')) buoy(ctx, 520, 452, '#f28c28');
  // quay
  skyGrad(ctx, 0, 470, 600, 130, [[0, '#8a5a48'], [1, '#66402f']]);
  ctx.fillStyle = 'rgba(0,0,0,0.16)';
  for (let x = 8; x < 600; x += 46) ctx.fillRect(x, 470, 2.5, 130);
  ctx.fillRect(0, 516, 600, 2.5);
  // café building on the quay (right)
  roundRect(ctx, 398, 318, 188, 152, 4, '#f3e2c2');
  roundRect(ctx, 398, 318, 188, 16, 4, '#b8575f');
  roundRect(ctx, 424, 356, 34, 44, 3, '#5b7a99'); // window
  roundRect(ctx, 516, 356, 34, 44, 3, '#5b7a99');
  roundRect(ctx, 476, 420, 30, 50, 3, '#7a4a3b'); // door
  // awning: striped, colours are a difference
  const stripeA = alt.has('awning') ? '#3e8e8a' : '#d64550';
  for (let i = 0; i < 6; i += 1) {
    poly(ctx, [[408 + i * 28, 402], [436 + i * 28, 402], [430 + i * 28, 424], [402 + i * 28, 424]], i % 2 ? '#fdf6e3' : stripeA);
  }
  // café tables
  for (const tx of [446, 528]) {
    disc(ctx, tx, 512, 17, '#fdf6e3');
    ctx.fillRect(tx - 2, 512, 4, 20);
    disc(ctx, tx + 6, 506, 4, '#d64550');
  }
  // lamp post
  ctx.fillStyle = '#2f3542';
  ctx.fillRect(368, 452, 5, 108);
  lantern(ctx, 370, 438, 13, '#f2b33d');
  // crates with (or without) the cat
  roundRect(ctx, 84, 522, 62, 44, 3, '#a9713f');
  roundRect(ctx, 100, 484, 62, 42, 3, '#bb8148');
  ctx.strokeStyle = 'rgba(70,40,15,0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(88, 526, 54, 36);
  ctx.strokeRect(104, 488, 54, 34);
  if (!alt.has('cat')) cat(ctx, 138, 492, 0.95, '#3b3f4a', true);
  // rope railing along the quay edge
  ctx.strokeStyle = '#e8dcc4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 478);
  for (let x = 0; x <= 600; x += 75) ctx.quadraticCurveTo(x + 37, 490, x + 75, 478);
  ctx.stroke();
  ctx.fillStyle = '#4a3226';
  for (let x = 0; x <= 600; x += 75) ctx.fillRect(x - 3, 466, 6, 16);
}

function boat(ctx, x, y, s, sailColour, hullColour) {
  ctx.fillStyle = hullColour;
  poly(ctx, [[x - 42 * s, y], [x + 42 * s, y], [x + 30 * s, y + 18 * s], [x - 30 * s, y + 18 * s]], hullColour);
  ctx.fillRect(x - 1.5 * s, y - 62 * s, 3 * s, 62 * s);
  poly(ctx, [[x + 4 * s, y - 58 * s], [x + 4 * s, y - 6 * s], [x + 34 * s, y - 6 * s]], sailColour);
  poly(ctx, [[x - 4 * s, y - 50 * s], [x - 4 * s, y - 6 * s], [x - 26 * s, y - 6 * s]], shade(sailColour === '#fdf6e3' ? '#e8e0cc' : sailColour, -18));
}

function buoy(ctx, x, y, colour) {
  disc(ctx, x, y, 9, colour);
  disc(ctx, x, y - 3, 5.5, shade(colour, 26));
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(x, y + 9, 13, 3.4, 0, 0, Math.PI * 2);
  ctx.fill();
}

/* ---------------- Level 2: The Clockmaker's Workshop ---------------- */

function paintWorkshop(ctx, alt) {
  const rng = mulberry32(1955);
  skyGrad(ctx, 0, 0, 600, 600, [[0, '#e8d3ac'], [0.78, '#d9bd8d'], [1, '#b98d5f']]);
  // floorboards
  skyGrad(ctx, 0, 470, 600, 130, [[0, '#9a6a42'], [1, '#7a4f2c']]);
  ctx.fillStyle = 'rgba(60,32,8,0.35)';
  for (let x = 30; x < 600; x += 58) ctx.fillRect(x, 470, 2, 130);
  // window (left) with a garden view
  roundRect(ctx, 38, 56, 136, 248, 6, '#6e4a2f');
  skyGrad(ctx, 48, 66, 116, 228, [[0, '#bfe3f2'], [0.6, '#cfe8c8'], [1, '#8fbf7a']]);
  disc(ctx, 132, 96, 17, '#ffdf6b');
  cloud(ctx, 84, 92, 0.5, 'rgba(255,255,255,0.9)');
  poly(ctx, [[48, 294], [92, 236], [128, 294]], '#7fae62');
  poly(ctx, [[104, 294], [140, 248], [164, 294]], '#6d9c54');
  ctx.strokeStyle = '#6e4a2f';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(106, 66); ctx.lineTo(106, 294);
  ctx.moveTo(48, 180); ctx.lineTo(164, 180);
  ctx.stroke();
  roundRect(ctx, 34, 300, 144, 10, 3, '#5d3c22'); // sill
  if (!alt.has('bird')) {
    // a small bird perched on the sill
    disc(ctx, 95, 288, 9, '#4a7fb5');
    disc(ctx, 103, 281, 6, '#6fa3d8');
    poly(ctx, [[108, 280], [118, 283], [108, 286]], '#f2b33d');
    poly(ctx, [[86, 290], [76, 284], [84, 296]], '#3a6a9c');
  }
  // wall gear (a difference: brass vs tarnished copper)
  gear(ctx, 205, 150, 30, alt.has('gear') ? '#b06a3b' : '#d9a441');
  gear(ctx, 238, 196, 17, '#8a8f7a');
  // the big pendulum clock (centre)
  roundRect(ctx, 252, 84, 96, 352, 10, '#6e4a2f');
  roundRect(ctx, 260, 92, 80, 336, 8, '#845c36');
  disc(ctx, 300, 165, 50, '#f7ecd2');
  ring(ctx, 300, 165, 50, '#54383f', 5);
  ring(ctx, 300, 165, 41, 'rgba(84,56,63,0.35)', 1.5);
  ctx.fillStyle = '#54383f';
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    ctx.fillRect(300 + Math.cos(a) * 36 - 1.5, 165 + Math.sin(a) * 36 - 1.5, 3, 3);
  }
  // hands — the time itself is a difference (3:00 vs 4:25)
  const hourA = alt.has('hands') ? (4.42 / 12) * Math.PI * 2 : (3 / 12) * Math.PI * 2;
  const minA = alt.has('hands') ? (25 / 60) * Math.PI * 2 : 0;
  hand(ctx, 300, 165, hourA, 24, 5.5);
  hand(ctx, 300, 165, minA, 36, 3.5);
  disc(ctx, 300, 165, 5, '#54383f');
  // pendulum window
  roundRect(ctx, 276, 246, 48, 130, 6, '#3d2c1c');
  ctx.strokeStyle = '#c9a86a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 252);
  ctx.lineTo(286, 330);
  ctx.stroke();
  disc(ctx, 286, 342, 15, '#d9a441');
  // shelves (right) with clocks, books and jars
  shelf(ctx, 384, 128);
  shelf(ctx, 384, 208);
  // top shelf books — one spine changes colour
  bookRow(ctx, 398, 128, ['#a03d4a', '#3f6186', alt.has('book') ? '#3e7d4e' : '#a03d4a', '#c9862f']);
  miniClock(ctx, 540, 108, '#7a4a6e');
  // second shelf: jars and the small clock that may vanish
  jar(ctx, 408, 186, '#c9862f');
  jar(ctx, 440, 190, '#7a9c59');
  if (!alt.has('shelfclock')) miniClock(ctx, 520, 186, '#4a6b8a');
  gear(ctx, 566, 188, 13, '#a9713f');
  // workbench
  roundRect(ctx, 52, 428, 496, 16, 4, '#5d3c22');
  roundRect(ctx, 66, 444, 14, 74, 3, '#4c3018');
  roundRect(ctx, 520, 444, 14, 74, 3, '#4c3018');
  // scattered clock parts and tools on the bench
  gear(ctx, 120, 414, 15, '#c9a86a');
  gear(ctx, 152, 420, 10, '#8a8f7a');
  ring(ctx, 210, 416, 11, '#7a4a6e', 4);
  ctx.strokeStyle = '#37404f';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(238, 424); ctx.lineTo(268, 404); ctx.stroke();
  roundRect(ctx, 330, 404, 46, 24, 4, '#37404f'); // open watch case
  disc(ctx, 353, 416, 9, '#f7ecd2');
  // teapot — its steam is a difference
  disc(ctx, 430, 410, 20, '#b8575f');
  ctx.beginPath();
  ctx.ellipse(430, 398, 12, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#a34a52';
  ctx.fill();
  poly(ctx, [[448, 402], [464, 394], [450, 414]], '#a34a52');
  if (!alt.has('steam')) {
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (const dx of [-7, 4]) {
      ctx.beginPath();
      ctx.moveTo(430 + dx, 384);
      ctx.quadraticCurveTo(430 + dx - 5, 370, 430 + dx + 2, 358);
      ctx.stroke();
    }
  }
  // desk lamp — shade colour is a difference
  ctx.strokeStyle = '#37404f';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(492, 428); ctx.lineTo(512, 396); ctx.stroke();
  poly(ctx, [[488, 384], [522, 384], [514, 362], [496, 362]], alt.has('lamp') ? '#e8a33d' : '#3e7d4e');
  disc(ctx, 505, 388, 5, '#ffe98a');
  // rug and the cat (awake in one panel, asleep in the other)
  ctx.fillStyle = '#a03d4a';
  ctx.beginPath();
  ctx.ellipse(240, 528, 150, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#b8575f';
  ctx.beginPath();
  ctx.ellipse(240, 528, 118, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  cat(ctx, 172, 516, 1.05, '#5a4632', alt.has('cat'));
  // stool
  roundRect(ctx, 452, 486, 56, 10, 4, '#6e4a2f');
  ctx.fillRect(462, 496, 7, 34);
  ctx.fillRect(492, 496, 7, 34);
  // a few dust motes in the window light
  ctx.fillStyle = 'rgba(255,246,214,0.5)';
  for (let i = 0; i < 22; i += 1) disc(ctx, 60 + rng() * 260, 90 + rng() * 330, 1.4, 'rgba(255,246,214,0.5)');
}

function gear(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.save();
    ctx.translate(x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92);
    ctx.rotate(a);
    ctx.fillRect(-r * 0.16, -r * 0.3, r * 0.32, r * 0.6);
    ctx.restore();
  }
  disc(ctx, x, y, r * 0.86, colour);
  disc(ctx, x, y, r * 0.38, 'rgba(0,0,0,0.28)');
  disc(ctx, x, y, r * 0.2, shade(colour, 24));
}

function hand(ctx, cx, cy, angle, len, width) {
  ctx.strokeStyle = '#37404f';
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.sin(angle) * len, cy - Math.cos(angle) * len);
  ctx.stroke();
}

function shelf(ctx, x, y) {
  roundRect(ctx, x, y, 196, 9, 3, '#5d3c22');
  poly(ctx, [[x + 14, y + 9], [x + 30, y + 9], [x + 14, y + 26]], '#4c3018');
  poly(ctx, [[x + 166, y + 9], [x + 182, y + 9], [x + 182, y + 26]], '#4c3018');
}

function bookRow(ctx, x, baseY, colours) {
  let bx = x;
  for (const c of colours) {
    const h = 34 + (bx % 3) * 3;
    roundRect(ctx, bx, baseY - h, 13, h, 2, c);
    bx += 16;
  }
}

function miniClock(ctx, x, y, colour) {
  disc(ctx, x, y, 17, '#f7ecd2');
  ring(ctx, x, y, 17, colour, 5);
  hand(ctx, x, y, 5.2, 9, 2.4);
  hand(ctx, x, y, 1.1, 13, 1.8);
  disc(ctx, x, y, 2.4, colour);
}

function jar(ctx, x, y, colour) {
  roundRect(ctx, x - 10, y - 20, 20, 22, 5, colour);
  roundRect(ctx, x - 7, y - 26, 14, 7, 2, '#5d3c22');
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(x - 6, y - 16, 4, 12);
}

/* ---------------- Level 3: Night Market in the Old Town ---------------- */

function paintMarket(ctx, alt) {
  const rng = mulberry32(777);
  skyGrad(ctx, 0, 0, 600, 600, [[0, '#131a38'], [0.55, '#232c52'], [1, '#3a3358']]);
  // stars
  ctx.fillStyle = '#e8ecff';
  for (let i = 0; i < 90; i += 1) {
    const r = rng() * 1.6 + 0.5;
    ctx.globalAlpha = 0.35 + rng() * 0.65;
    disc(ctx, rng() * 600, rng() * 250, r, '#e8ecff');
  }
  ctx.globalAlpha = 1;
  if (!alt.has('star')) sparkle(ctx, 200, 58, 13, '#ffe98a');
  sparkle(ctx, 96, 130, 8, '#cdd7ff');
  sparkle(ctx, 356, 40, 7, '#cdd7ff');
  // the moon — crescent in one panel, full in the other
  if (alt.has('moon')) {
    disc(ctx, 498, 78, 27, '#f5efcf');
    disc(ctx, 488, 70, 5, '#ddd3a8');
    disc(ctx, 508, 88, 4, '#ddd3a8');
    disc(ctx, 502, 62, 3, '#ddd3a8');
  } else {
    disc(ctx, 498, 78, 27, '#f5efcf');
    disc(ctx, 509, 70, 23, '#232c52');
  }
  // rooftops silhouette
  poly(ctx, [[0, 360], [0, 292], [70, 292], [70, 262], [150, 262], [150, 300], [238, 300], [238, 252], [330, 252], [330, 296], [420, 296], [420, 258], [505, 258], [505, 300], [600, 300], [600, 360]], '#1a213f');
  poly(ctx, [[58, 262], [110, 224], [162, 262]], '#232c52');
  poly(ctx, [[226, 252], [284, 210], [342, 252]], '#232c52');
  poly(ctx, [[408, 258], [462, 218], [516, 258]], '#232c52');
  ctx.fillStyle = '#2c355c';
  ctx.fillRect(276, 224, 14, 26); // chimney
  ctx.fillRect(96, 236, 12, 24);
  // lit windows in the rooftops
  ctx.fillStyle = '#ffca6a';
  for (const [wx, wy] of [[88, 272], [196, 276], [268, 268], [452, 272], [540, 282], [30, 306], [368, 272]]) {
    ctx.fillRect(wx, wy, 11, 14);
  }
  ctx.fillStyle = 'rgba(255,202,106,0.25)';
  for (const [wx, wy] of [[88, 272], [268, 268], [452, 272]]) ctx.fillRect(wx - 3, wy - 3, 17, 20);
  // string lights between two poles — one bulb burns a different colour
  ctx.fillStyle = '#141a30';
  ctx.fillRect(52, 138, 7, 226);
  ctx.fillRect(536, 128, 7, 236);
  const bulbPoints = [];
  for (const [y0, sag] of [[150, 44], [196, 38]]) {
    ctx.strokeStyle = 'rgba(10,12,24,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(56, y0);
    ctx.quadraticCurveTo(300, y0 + sag * 2, 540, y0 - 8);
    ctx.stroke();
    for (let i = 1; i < 10; i += 1) {
      const t = i / 10;
      const bx = (1 - t) * 56 + t * 540;
      const by = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (y0 + sag * 2) + t * t * (y0 - 8);
      bulbPoints.push([bx, by + 7, y0 === 150 && i === 4]);
    }
  }
  const bulbColours = ['#ffd23e', '#ff8e6e', '#7ee081', '#6ec6ff', '#ff6b9d'];
  bulbPoints.forEach(([bx, by, isDiff], i) => {
    const colour = isDiff && alt.has('bulb') ? '#2ee6c8' : bulbColours[i % bulbColours.length];
    const g = ctx.createRadialGradient(bx, by, 1, bx, by, 13);
    g.addColorStop(0, 'rgba(255,240,190,0.9)');
    g.addColorStop(1, 'rgba(255,240,190,0)');
    ctx.fillStyle = g;
    ctx.fillRect(bx - 13, by - 13, 26, 26);
    disc(ctx, bx, by, 4.6, colour);
  });
  // ground: cobblestones
  skyGrad(ctx, 0, 470, 600, 130, [[0, '#4a4266'], [1, '#332c4c']]);
  ctx.fillStyle = 'rgba(230,225,255,0.10)';
  for (let row = 0; row < 4; row += 1) {
    for (let i = 0; i < 9; i += 1) {
      ctx.beginPath();
      ctx.ellipse(36 + i * 68 + (row % 2) * 30, 492 + row * 28, 26, 8.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // the three stalls
  stall(ctx, 26, '#d64550', alt);
  stall(ctx, 214, alt.has('canopy') ? null : '#7a4a9e', alt, true);
  stall(ctx, 402, '#3e8e8a', alt);
  // stall 1 extras: hanging lantern (colour difference) and shaped sign
  ctx.strokeStyle = '#141a30';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(115, 316); ctx.lineTo(115, 330); ctx.stroke();
  lantern(ctx, 115, 344, 15, alt.has('lantern') ? '#2ee6c8' : '#e5534b');
  roundRect(ctx, 44, 402, 44, 52, 4, '#5d3c22');
  if (alt.has('sign')) {
    disc(ctx, 66, 428, 12, '#f5efcf');
    disc(ctx, 72, 422, 10, '#5d3c22');
  } else {
    sparkle(ctx, 66, 428, 13, '#ffd23e');
  }
  // stall 2 extras: the fruit crate — apples or oranges
  roundRect(ctx, 282, 452, 76, 40, 4, '#8a5a3b');
  ctx.strokeStyle = 'rgba(60,32,8,0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(286, 456, 68, 32);
  const fruitColour = alt.has('fruit') ? '#f28c28' : '#d64550';
  for (const [fx, fy] of [[300, 466], [320, 460], [340, 466], [310, 478], [330, 478]]) {
    disc(ctx, fx, fy, 9, fruitColour);
    disc(ctx, fx - 3, fy - 3, 2.6, 'rgba(255,255,255,0.45)');
  }
  // stall 3 extras: honey jar that may vanish, and the cat with (or without) a scarf
  if (!alt.has('jar')) jarOnCounter(ctx, 478, 414);
  cat(ctx, 442, 530, 1.0, '#2c3145', true);
  if (!alt.has('scarf')) {
    ctx.strokeStyle = '#d64550';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(452, 512, 10, Math.PI * 0.15, Math.PI * 0.95);
    ctx.stroke();
  }
  // signpost with (or without) its owl
  ctx.fillStyle = '#141a30';
  ctx.fillRect(541, 196, 6, 120);
  roundRect(ctx, 500, 196, 88, 20, 4, '#5d3c22');
  ctx.fillStyle = '#f7ecd2';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MARKET', 544, 210);
  if (!alt.has('owl')) {
    disc(ctx, 545, 182, 11, '#8a6f4d');
    disc(ctx, 545, 168, 8, '#a5855c');
    disc(ctx, 541, 167, 2.6, '#141a30');
    disc(ctx, 549, 167, 2.6, '#141a30');
    poly(ctx, [[543, 170], [547, 170], [545, 174]], '#f2b33d');
  }
}

function stall(ctx, x, canopyColour, alt, isMiddle = false) {
  // posts and counter
  ctx.fillStyle = '#4c3018';
  ctx.fillRect(x + 8, 330, 8, 140);
  ctx.fillRect(x + 156, 330, 8, 140);
  roundRect(ctx, x, 440, 172, 34, 4, '#6e4a2f');
  roundRect(ctx, x, 470, 172, 8, 2, '#54383f');
  // goods on the counter
  const rng = mulberry32(x * 7 + 11);
  for (let i = 0; i < 5; i += 1) {
    const gx = x + 18 + i * 32;
    disc(ctx, gx, 428, 10, ['#e8a33d', '#a5c65c', '#d64550', '#7a4a9e', '#3e8e8a'][Math.floor(rng() * 5)]);
  }
  jarOnCounter(ctx, x + 138, 440);
  // canopy: striped, or — for the middle stall in one panel — plain
  if (canopyColour === null) {
    poly(ctx, [[x - 8, 336], [x + 86, 282], [x + 180, 336]], '#7a4a9e');
    poly(ctx, [[x - 8, 336], [x + 180, 336], [x + 168, 352], [x + 4, 352]], '#6d4190');
  } else {
    // striped canopy drawn as bands following the roof slope
    for (let i = 0; i < 6; i += 1) {
      const x0 = x - 8 + i * 31.3;
      const y0 = 336 - slope(i);
      const y1 = 336 - slope(i + 1);
      poly(ctx, [[x0, y0], [x0 + 31.3, y1], [x0 + 31.3, y1 + 16], [x0, y0 + 16]], i % 2 ? '#f7ecd2' : canopyColour);
    }
  }
  function slope(i) {
    return i <= 3 ? i * 18 : (6 - i) * 18;
  }
}

function jarOnCounter(ctx, x, baseY) {
  roundRect(ctx, x - 10, baseY - 26, 20, 26, 5, '#e8a33d');
  roundRect(ctx, x - 7, baseY - 32, 14, 7, 2, '#5d3c22');
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(x - 6, baseY - 21, 4, 14);
}

/** Painters by scene id, as named in LEVELS. */
export const PAINTERS = { harbour: paintHarbour, workshop: paintWorkshop, market: paintMarket };
