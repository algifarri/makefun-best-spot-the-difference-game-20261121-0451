// Everything the player sees: the header with its counter and clock, the two
// framed panels, the found markers, and the title / clear / win / time-up
// cards. Scenes themselves are painted by scenes.js; this file only lays
// them out and draws the game's chrome around them.

import { FONT, HEADER, INK, LEVELS, PANEL, STAGE } from './config.js';
import { SCREEN, differences, game, level, remaining } from './game.js';
import { PAINTERS } from './scenes.js';
import { disc, ring, roundRect } from './art.js';
import { sound } from './sound.js';

/** Clickable regions, recomputed each frame and read by input.js. */
export const ui = { hint: null, mute: null, primary: null };

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function render(ctx, now) {
  ctx.save();
  if (game.shake > 0) {
    const m = game.shake * 10;
    ctx.translate(Math.sin(now * 91) * m * 0.4, Math.cos(now * 113) * m * 0.3);
  }
  ctx.fillStyle = INK.page;
  ctx.fillRect(-12, -12, STAGE.width + 24, STAGE.height + 24);
  drawHeader(ctx, now);
  drawPanel(ctx, PANEL.leftA, false, now);
  drawPanel(ctx, PANEL.leftB, true, now);
  drawFooter(ctx);
  if (game.screen !== SCREEN.PLAY) drawOverlay(ctx, now);
  ctx.restore();
}

function drawHeader(ctx, now) {
  ctx.fillStyle = INK.header;
  ctx.fillRect(0, 0, STAGE.width, HEADER.height);
  ctx.fillStyle = INK.headerEdge;
  ctx.fillRect(0, HEADER.height - 3, STAGE.width, 3);
  // title block
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = INK.gold;
  ctx.font = `800 30px ${FONT}`;
  ctx.fillText('TWIN HARBOURS', 26, 44);
  ctx.fillStyle = INK.muted;
  ctx.font = `500 14.5px ${FONT}`;
  ctx.fillText('spot the difference', 27, 68);
  // level name and progress pips
  ctx.textAlign = 'center';
  ctx.fillStyle = INK.text;
  ctx.font = `700 19px ${FONT}`;
  ctx.fillText(`Scene ${game.levelIndex + 1} of ${LEVELS.length} — ${level().name}`, STAGE.width / 2, 38);
  const diffs = differences();
  const pipY = 62;
  const totalW = diffs.length * 24 - 8;
  let px = STAGE.width / 2 - totalW / 2;
  for (const d of diffs) {
    if (game.found.has(d.id)) {
      disc(ctx, px + 8, pipY, 8, INK.found);
      ctx.strokeStyle = '#0e2413';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px + 4.5, pipY);
      ctx.lineTo(px + 7, pipY + 3);
      ctx.lineTo(px + 11.5, pipY - 3.5);
      ctx.stroke();
    } else {
      ring(ctx, px + 8, pipY, 7.5, INK.muted, 2);
    }
    px += 24;
  }
  // the counter the whole game turns on
  ctx.fillStyle = remaining() === 0 ? INK.found : INK.text;
  ctx.font = `800 21px ${FONT}`;
  const counter = game.screen === SCREEN.TITLE
    ? `${diffs.length} differences are hiding`
    : `${game.found.size} of ${diffs.length} found · ${remaining()} to go`;
  ctx.fillText(counter, STAGE.width / 2, 92);
  // score, clock and buttons (right block)
  ctx.textAlign = 'right';
  ctx.fillStyle = INK.muted;
  ctx.font = `600 12.5px ${FONT}`;
  ctx.fillText('SCORE', STAGE.width - 26, 24);
  ctx.fillStyle = INK.gold;
  ctx.font = `800 27px ${FONT}`;
  ctx.fillText(String(game.score), STAGE.width - 26, 52);
  const urgent = game.timeLeft <= 30 && game.screen === SCREEN.PLAY;
  ctx.fillStyle = urgent ? INK.miss : INK.text;
  ctx.font = `800 21px ${FONT}`;
  ctx.fillText(`⏱ ${fmtTime(game.timeLeft)}`, STAGE.width - 26, 80);
  // hint + mute buttons (left of the score block is free real estate at x 1052..)
  ui.hint = { x: 1030, y: 58, w: 92, h: 34 };
  ctx.globalAlpha = game.hintsLeft > 0 && game.screen === SCREEN.PLAY ? 1 : 0.45;
  roundRect(ctx, ui.hint.x, ui.hint.y, ui.hint.w, ui.hint.h, 8, '#2b3852');
  ctx.fillStyle = INK.hint;
  ctx.font = `700 14.5px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(`💡 Hint ×${game.hintsLeft}`, ui.hint.x + ui.hint.w / 2, ui.hint.y + 22);
  ctx.globalAlpha = 1;
  ui.mute = { x: 1132, y: 58, w: 40, h: 34 };
  roundRect(ctx, ui.mute.x, ui.mute.y, ui.mute.w, ui.mute.h, 8, '#2b3852');
  ctx.fillStyle = INK.text;
  ctx.fillText(sound.isMuted() ? '🔇' : '🔊', ui.mute.x + 20, ui.mute.y + 23);
  ctx.textAlign = 'left';
  // timer bar along the header's bottom edge
  const frac = Math.max(0, game.timeLeft / level().time);
  ctx.fillStyle = 'rgba(255,255,255,0.10)';
  ctx.fillRect(0, HEADER.height - 3, STAGE.width, 3);
  ctx.fillStyle = urgent ? INK.miss : INK.gold;
  if (game.screen !== SCREEN.TITLE) ctx.fillRect(0, HEADER.height - 3, STAGE.width * frac, 3);
  void now;
}

function drawPanel(ctx, left, altered, now) {
  const top = PANEL.top;
  // frame and shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, left - 5, top - 5, PANEL.size + 10, PANEL.size + 10, 14, '#232c44');
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(left, top, PANEL.size, PANEL.size, 9);
  ctx.clip();
  ctx.translate(left, top);
  const alt = altered ? new Set(differences().map((d) => d.id)) : new Set();
  PAINTERS[level().scene](ctx, alt);
  drawMarkers(ctx, now);
  ctx.restore();
  // picture tag
  roundRect(ctx, left + 12, top + 12, 96, 26, 6, 'rgba(13,17,28,0.72)');
  ctx.fillStyle = '#f4f1e6';
  ctx.font = `700 13px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(altered ? 'PICTURE B' : 'PICTURE A', left + 60, top + 30);
  ctx.textAlign = 'left';
}

function drawMarkers(ctx, now) {
  // settled rings on everything found so far
  for (const diff of differences()) {
    if (!game.found.has(diff.id)) continue;
    const pulse = 1 + Math.sin(now * 3 + diff.x) * 0.03;
    ring(ctx, diff.x, diff.y, (diff.r * 0.62 + 7) * pulse, INK.found, 4);
    ring(ctx, diff.x, diff.y, (diff.r * 0.62 + 7) * pulse, 'rgba(255,255,255,0.75)', 1.6);
    ctx.strokeStyle = INK.found;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(diff.x - 7, diff.y + 1);
    ctx.lineTo(diff.x - 2, diff.y + 6);
    ctx.lineTo(diff.x + 8, diff.y - 6);
    ctx.stroke();
  }
  // transient marks: a blooming ring for a find, a red cross for a miss
  for (const mark of game.marks) {
    const t = mark.age / (mark.kind === 'found' ? 0.9 : 0.55);
    ctx.globalAlpha = 1 - t;
    if (mark.kind === 'found') {
      ring(ctx, mark.x, mark.y, 10 + t * 44, INK.found, 4.5);
      ring(ctx, mark.x, mark.y, 6 + t * 26, '#ffffff', 2);
    } else {
      ctx.strokeStyle = INK.miss;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      const r = 11;
      ctx.beginPath();
      ctx.moveTo(mark.x - r, mark.y - r);
      ctx.lineTo(mark.x + r, mark.y + r);
      ctx.moveTo(mark.x + r, mark.y - r);
      ctx.lineTo(mark.x - r, mark.y + r);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // the hint pulse breathes around one unfound difference
  if (game.hintPulse) {
    const { diff, age } = game.hintPulse;
    const fade = age > 1.25 ? 1 - (age - 1.25) / 0.35 : 1;
    ctx.globalAlpha = Math.max(0, fade);
    const rr = diff.r + 12 + Math.sin(age * 9) * 4;
    ring(ctx, diff.x, diff.y, rr, INK.hint, 4.5);
    ring(ctx, diff.x, diff.y, rr + 8, 'rgba(255,201,77,0.5)', 2.5);
    ctx.globalAlpha = 1;
  }
}

function drawFooter(ctx) {
  ctx.fillStyle = INK.muted;
  ctx.font = `500 14px ${FONT}`;
  ctx.textAlign = 'center';
  const msg = game.lastFindLabel && game.screen === SCREEN.PLAY
    ? `Found: ${game.lastFindLabel}!`
    : 'Click a difference in either picture · a wrong click costs 3 seconds · H for a hint';
  ctx.fillText(msg, STAGE.width / 2, 750);
  ctx.textAlign = 'left';
}

function drawOverlay(ctx, now) {
  ctx.fillStyle = 'rgba(10,13,22,0.62)';
  ctx.fillRect(0, 0, STAGE.width, STAGE.height);
  const cardW = 560;
  const cardH = game.screen === SCREEN.TITLE ? 356 : 318;
  const cx = (STAGE.width - cardW) / 2;
  const cy = (STAGE.height - cardH) / 2 + 16;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 30;
  roundRect(ctx, cx, cy, cardW, cardH, 18, '#1b2438');
  ctx.restore();
  ctx.strokeStyle = INK.headerEdge;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cx, cy, cardW, cardH, 18);
  ctx.stroke();
  ctx.textAlign = 'center';
  const mid = STAGE.width / 2;
  let title = '';
  let lines = [];
  let button = '';
  if (game.screen === SCREEN.TITLE) {
    title = 'TWIN HARBOURS';
    lines = [
      'Two pictures of the same place — almost.',
      'Somewhere in the second one, small things have changed:',
      'a lamp gone dark, a sail re-coloured, a cat that slipped away.',
      '',
      'Click each difference you spot, in either picture.',
      'Three scenes, 24 differences, one ticking clock.',
    ];
    button = 'Start the hunt';
  } else if (game.screen === SCREEN.CLEAR) {
    title = 'Scene cleared!';
    lines = [
      `${level().name} — every difference found.`,
      `Time bonus: +${game.clearBonus}`,
      '',
      `Next: ${LEVELS[game.levelIndex + 1].name}`,
      'More differences, craftier hiding places.',
    ];
    button = 'Next scene →';
  } else if (game.screen === SCREEN.WIN) {
    title = 'Master Spotter!';
    lines = [
      'All three scenes cleared — all 24 differences found.',
      '',
      `Final score: ${game.score}`,
      '',
      'The harbours are identical again. Mostly.',
    ];
    button = 'Play again';
  } else {
    title = "Time's up!";
    lines = [
      `The clock beat you on ${level().name}.`,
      `${remaining()} difference${remaining() === 1 ? '' : 's'} still hiding.`,
      '',
      `Score so far: ${game.score}`,
    ];
    button = 'Try again';
  }
  ctx.fillStyle = INK.gold;
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText(title, mid, cy + 66);
  ctx.fillStyle = INK.text;
  ctx.font = `500 16.5px ${FONT}`;
  lines.forEach((line, i) => ctx.fillText(line, mid, cy + 112 + i * 25));
  ui.primary = { x: mid - 110, y: cy + cardH - 74, w: 220, h: 48 };
  const hover = Math.sin(now * 2.4) * 1.5;
  roundRect(ctx, ui.primary.x, ui.primary.y + hover * 0.3, ui.primary.w, ui.primary.h, 10, INK.gold);
  ctx.fillStyle = '#23180a';
  ctx.font = `800 18px ${FONT}`;
  ctx.fillText(button, mid, ui.primary.y + 31 + hover * 0.3);
  ctx.textAlign = 'left';
}
