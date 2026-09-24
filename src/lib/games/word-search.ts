// Deterministic word-search generator (§18).
// Same (words, size, directions, seed) -> identical grid. Store the
// generated puzzle; don't regenerate per request.

export type Direction = "H" | "V" | "D" | "H_REV" | "V_REV" | "D_REV";

export interface PlacedWord {
  word: string;
  row: number;
  col: number;
  direction: Direction;
}

export interface WordSearchResult {
  grid: string[][];
  placed: PlacedWord[];
}

// mulberry32 — small seeded PRNG for determinism
export function seededRandom(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DELTAS: Record<Direction, [number, number]> = {
  H: [0, 1],
  V: [1, 0],
  D: [1, 1],
  H_REV: [0, -1],
  V_REV: [-1, 0],
  D_REV: [-1, -1],
};

export function generateWordSearch(
  words: string[],
  rows = 12,
  cols = 12,
  allowed: Direction[] = ["H", "V", "D"],
  seed = "finquest",
): WordSearchResult {
  const rand = seededRandom(seed + ":" + words.join(","));
  const grid: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const placed: PlacedWord[] = [];

  const sorted = [...words].map((w) => w.toUpperCase()).sort((a, b) => b.length - a.length);

  for (const word of sorted) {
    let done = false;
    for (let attempt = 0; attempt < 200 && !done; attempt++) {
      const dir = allowed[Math.floor(rand() * allowed.length)];
      const [dr, dc] = DELTAS[dir];
      const r0 = Math.floor(rand() * rows);
      const c0 = Math.floor(rand() * cols);
      const r1 = r0 + dr * (word.length - 1);
      const c1 = c0 + dc * (word.length - 1);
      if (r1 < 0 || r1 >= rows || c1 < 0 || c1 >= cols) continue;
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const cell = grid[r0 + dr * i][c0 + dc * i];
        if (cell !== null && cell !== word[i]) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      for (let i = 0; i < word.length; i++) grid[r0 + dr * i][c0 + dc * i] = word[i];
      placed.push({ word, row: r0, col: c0, direction: dir });
      done = true;
    }
  }

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const out: string[][] = grid.map((row) =>
    row.map((c) => (c === null ? letters[Math.floor(rand() * letters.length)] : c)),
  );
  return { grid: out, placed };
}
