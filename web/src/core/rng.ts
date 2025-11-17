const MOD = 0x100000000; // 2^32
const MULTIPLIER = 1664525;
const INCREMENT = 1013904223;

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function initRng(seed: string): number {
  return hashSeed(seed) || 1;
}

export function nextRandom(state: number): { state: number; value: number } {
  const next = (Math.imul(state, MULTIPLIER) + INCREMENT) % MOD;
  return { state: next, value: next / MOD };
}

export function randomInt(state: number, maxExclusive: number): {
  state: number;
  value: number;
} {
  if (maxExclusive <= 0) {
    throw new Error('maxExclusive must be greater than 0');
  }
  const { state: nextState, value } = nextRandom(state);
  return { state: nextState, value: Math.floor(value * maxExclusive) };
}

