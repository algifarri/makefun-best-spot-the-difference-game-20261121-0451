// Tiny WebAudio synth — no audio files. A bright arpeggio for a find, a low
// buzz for a miss, a soft chime for a hint and a little fanfare for a win.
// Sound starts only after the player's first gesture, as browsers require.

let ctx = null;
let muted = false;

function audio() {
  if (ctx === null) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'sine', gain = 0.16) {
  const ac = audio();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  const t0 = ac.currentTime + start;
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(amp).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sound = {
  unlock() {
    audio();
  },
  find() {
    tone(659.25, 0, 0.16);
    tone(830.61, 0.07, 0.16);
    tone(1046.5, 0.14, 0.3);
  },
  miss() {
    tone(150, 0, 0.22, 'sawtooth', 0.07);
    tone(110, 0.05, 0.24, 'sawtooth', 0.06);
  },
  hint() {
    tone(1318.5, 0, 0.2, 'triangle', 0.1);
    tone(1568, 0.1, 0.28, 'triangle', 0.08);
  },
  clear() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.34, 'triangle', 0.13));
  },
  win() {
    [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.11, 0.4, 'triangle', 0.13));
  },
  lose() {
    [392, 329.63, 261.63].forEach((f, i) => tone(f, i * 0.16, 0.34, 'triangle', 0.11));
  },
  toggleMute() {
    muted = !muted;
    return muted;
  },
  isMuted() {
    return muted;
  },
};
