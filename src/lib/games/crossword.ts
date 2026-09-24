// Crossword engine (§19): place words via intersections, validate, store grid.
// Simple greedy placer — sufficient for MVP themed puzzles; replaceable later.

export interface CrosswordWord {
  word: string;
  clue: string;
}

export interface CrosswordPlaced {
  word: string;
  clue: string;
  row: number;
  col: number;
  dir: "ACROSS" | "DOWN";
  number: number;
}

export interface CrosswordResult {
  rows: number;
  cols: number;
  grid: (string | null)[][];
  placed: CrosswordPlaced[];
}

export function generateCrossword(
  words: CrosswordWord[],
  rows = 11,
  cols = 11,
  seed = "finquest",
): CrosswordResult {
  const grid: (string | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const placed: CrosswordPlaced[] = [];
  const sorted = [...words].sort((a, b) => b.word.length - a.word.length);
  let num = 1;

  const canPlace = (word: string, r: number, c: number, dir: "ACROSS" | "DOWN") => {
    for (let i = 0; i < word.length; i++) {
      const rr = dir === "ACROSS" ? r : r + i;
      const cc = dir === "ACROSS" ? c + i : c;
      if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) return false;
      const cell = grid[rr][cc];
      if (cell !== null && cell !== word[i]) return false;
    }
    return true;
  };
  const doPlace = (word: string, clue: string, r: number, c: number, dir: "ACROSS" | "DOWN") => {
    for (let i = 0; i < word.length; i++) {
      const rr = dir === "ACROSS" ? r : r + i;
      const cc = dir === "ACROSS" ? c + i : c;
      grid[rr][cc] = word[i];
    }
    placed.push({ word, clue, row: r, col: c, dir, number: num++ });
  };

  // First word centered horizontally
  const first = sorted[0];
  if (first) {
    const r = Math.floor(rows / 2);
    const c = Math.max(0, Math.floor((cols - first.word.length) / 2));
    if (canPlace(first.word, r, c, "ACROSS")) doPlace(first.word, first.clue, r, c, "ACROSS");
  }

  for (const { word, clue } of sorted.slice(1)) {
    let done = false;
    // Try intersections with existing letters
    for (let pr = 0; pr < rows && !done; pr++) {
      for (let pc = 0; pc < cols && !done; pc++) {
        const cell = grid[pr][pc];
        if (cell === null) continue;
        for (let i = 0; i < word.length && !done; i++) {
          if (word[i] !== cell) continue;
          // try ACROSS with word[i] at (pr,pc)
          const c0 = pc - i;
          if (canPlace(word, pr, c0, "ACROSS")) {
            doPlace(word, clue, pr, c0, "ACROSS");
            done = true;
          } else {
            const r0 = pr - i;
            if (canPlace(word, r0, pc, "DOWN")) {
              doPlace(word, clue, r0, pc, "DOWN");
              done = true;
            }
          }
        }
      }
    }
    void done;
    void seed;
  }

  return { rows, cols, grid, placed };
}

export function checkCrosswordSolution(
  placed: CrosswordPlaced[],
  answers: Record<string, string>,
): { correct: number; total: number; solved: boolean } {
  let correct = 0;
  for (const p of placed) {
    const key = `${p.number}-${p.dir}`;
    if ((answers[key] ?? "").toUpperCase().replace(/[^A-Z]/g, "") === p.word.toUpperCase()) correct++;
  }
  return { correct, total: placed.length, solved: correct === placed.length && placed.length > 0 };
}
