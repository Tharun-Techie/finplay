// Configurable scoring engine (§5, §10, §20).
// Frontend must NEVER submit score/xp directly; backend computes from
// attempts + puzzle config. Suspicious values get flagged (§21).

export interface ScoringTable {
  // clue/attempt index (1-based) -> XP
  [clueUsed: number]: number;
}

export const DEFAULT_GUESS_STOCK_SCORING: ScoringTable = {
  1: 1000,
  2: 800,
  3: 600,
  4: 400,
  5: 200,
};

export const GAME_XP: Record<string, number> = {
  WORD_SEARCH_COMPLETED: 100,
  CROSSWORD_COMPLETED: 150,
  DAILY_BONUS: 200,
  PERFECT_DAY: 100, // all 3 dailies
};

export function scoreGuessStock(clueUsed: number, table = DEFAULT_GUESS_STOCK_SCORING): number {
  if (clueUsed < 1) return 0;
  if (table[clueUsed] !== undefined) return table[clueUsed];
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  return table[keys[keys.length - 1]] ?? 0;
}

export function isPlausibleScore(gameType: string, points: number): boolean {
  const caps: Record<string, number> = {
    GUESS_STOCK: 1000,
    WORD_SEARCH: 500,
    CROSSWORD: 500,
  };
  const cap = caps[gameType] ?? 1000;
  return Number.isInteger(points) && points >= 0 && points <= cap;
}

// Levels (§10) — names configurable.
export const LEVELS = [
  { level: 1, name: "Finance Rookie", minXp: 0 },
  { level: 2, name: "Market Student", minXp: 500 },
  { level: 3, name: "Stock Explorer", minXp: 1500 },
  { level: 4, name: "Fundamental Analyst", minXp: 3000 },
  { level: 5, name: "Market Detective", minXp: 6000 },
  { level: 6, name: "Finance Nerd", minXp: 10000 },
];

export function levelForXp(xp: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.minXp) current = l;
  return current;
}
