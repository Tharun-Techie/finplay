import { generateWordSearch } from "@/lib/games/word-search";
import { generateCrossword } from "@/lib/games/crossword";
import { COMPANIES } from "./companies";

// Daily quest store (§8): same puzzle id for all users each day.
// Pre-generated/cached (§32) — here generated deterministically from date seed.

export interface DailyCard {
  gameType: "GUESS_STOCK" | "WORD_SEARCH" | "CROSSWORD";
  puzzleId: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  estMinutes: number;
  xpReward: number;
}

export function dailyId(dateYMD: string, game: string) {
  return `daily-${dateYMD}-${game}`;
}

export function getDailyQuests(dateYMD: string): DailyCard[] {
  return [
    { gameType: "GUESS_STOCK", puzzleId: dailyId(dateYMD, "guess-stock"), title: "Guess the Stock", difficulty: "MEDIUM", estMinutes: 4, xpReward: 300 },
    { gameType: "WORD_SEARCH", puzzleId: dailyId(dateYMD, "word-search"), title: "Word Search", difficulty: "EASY", estMinutes: 5, xpReward: 100 },
    { gameType: "CROSSWORD", puzzleId: dailyId(dateYMD, "crossword"), title: "Crossword", difficulty: "MEDIUM", estMinutes: 7, xpReward: 150 },
  ];
}

export function getGuessStockDaily(dateYMD: string) {
  // Rotate company deterministically by date
  const idx =
    Math.abs([...dateYMD].reduce((a, c) => a + c.charCodeAt(0), 0)) % COMPANIES.length;
  const company = COMPANIES[idx];
  const fin = company.metrics.map((m) => `${m.key} ${m.value}`).join(", ");
  return {
    puzzleId: dailyId(dateYMD, "guess-stock"),
    companyId: company.id,
    maxAttempts: 5,
    // Answer hidden from client; only clues + company list (no ticker reveal)
    clues: [
      { order: 1, kind: "BUSINESS", text: company.description },
      { order: 2, kind: "INDUSTRY", text: company.industry },
      { order: 3, kind: "FINANCIAL", text: `Key metrics: ${fin}. Period TTM/FY24.` },
      { order: 4, kind: "MARKET", text: `Large-cap Indian listed company on ${company.exchange}.` },
      { order: 5, kind: "GEO", text: company.geography },
    ],
    companies: COMPANIES.map((c) => ({ id: c.id, name: c.name })),
  };
}

export function getWordSearchDaily(dateYMD: string) {
  const words = ["DIVIDEND", "REVENUE", "EBITDA", "ROE", "ROCE", "MARGIN", "EPS", "DCF"];
  const { grid, placed } = generateWordSearch(words, 12, 12, ["H", "V", "D"], `daily-${dateYMD}`);
  return {
    puzzleId: dailyId(dateYMD, "word-search"),
    rows: 12,
    cols: 12,
    grid,
    // Never expose coordinates to client in prod (§34); validated server-side.
    // Coordinates kept here for server validation only.
    _placed: placed,
    words,
    theme: "Fundamental Analysis",
  };
}

export function getCrosswordDaily(dateYMD: string) {
  const words = [
    { word: "STOCK", clue: "Unit of company ownership" },
    { word: "DIVIDEND", clue: "Profit paid to shareholders" },
    { word: "REVENUE", clue: "Total sales before expenses" },
    { word: "MARGIN", clue: "Profit as a percentage of sales" },
    { word: "EPS", clue: "Earnings per share, for short" },
  ];
  const built = generateCrossword(words, 11, 11, `daily-${dateYMD}`);
  return { puzzleId: dailyId(dateYMD, "crossword"), ...built };
}

export interface PublicCrosswordEntry {
  number: number;
  dir: "ACROSS" | "DOWN";
  clue: string;
  len: number;
  row: number;
  col: number;
}

export interface PublicCrossword {
  puzzleId: string;
  rows: number;
  cols: number;
  blocks: boolean[][];
  numbers: (number | null)[][];
  entries: PublicCrosswordEntry[];
}

// Public shape — grid structure + clue placements, NEVER solution letters (§34).
// Shared by the API route and server-rendered pages so the browser gets data
// on first paint with no extra fetch round-trip.
export function getPublicCrossword(dateYMD: string): PublicCrossword {
  const p = getCrosswordDaily(dateYMD);
  const numbers: (number | null)[][] = p.grid.map((row) => row.map(() => null));
  for (const w of p.placed) {
    if (numbers[w.row]?.[w.col] == null) numbers[w.row][w.col] = w.number;
  }
  return {
    puzzleId: p.puzzleId,
    rows: p.rows,
    cols: p.cols,
    blocks: p.grid.map((row) => row.map((c) => c === null)),
    numbers,
    entries: p.placed.map((w) => ({
      number: w.number,
      dir: w.dir,
      clue: w.clue,
      len: w.word.length,
      row: w.row,
      col: w.col,
    })),
  };
}

export interface PublicWordSearch {
  puzzleId: string;
  rows: number;
  cols: number;
  grid: string[][];
  words: string[];
  theme: string;
}

// Public shape — grid + word list, NOT coordinates (validated server-side).
export function getPublicWordSearch(dateYMD: string): PublicWordSearch {
  const { _placed, ...pub } = getWordSearchDaily(dateYMD);
  void _placed;
  return pub;
}
