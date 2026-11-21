// A tiny seeded random number generator (mulberry32). Scenes are painted with
// a fixed seed per level, so every player — and every screenshot — sees the
// exact same harbour, workshop and market.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random float in [min, max) from a generator made by mulberry32. */
export function range(rng, min, max) {
  return min + rng() * (max - min);
}

/** Random integer in [min, max] inclusive. */
export function intIn(rng, min, max) {
  return Math.floor(range(rng, min, max + 1));
}
