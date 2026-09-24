// FinQuest game registry (§46). The platform is designed around
// "a platform for finance games", not "three games".
// To add a future game (Quiz, Chart Hunt...): add a GameDefinition +
// engine + scoring rules + puzzle content + UI. No changes to other games.

export type GameType = "GUESS_STOCK" | "WORD_SEARCH" | "CROSSWORD";

export interface GameDefinition {
  type: GameType;
  slug: string; // URL slug, e.g. "guess-the-stock"
  title: string;
  icon: string;
  description: string;
  comingSoon?: boolean;
}

export const GAMES: Record<GameType, GameDefinition> = {
  GUESS_STOCK: {
    type: "GUESS_STOCK",
    slug: "guess-the-stock",
    title: "Guess the Stock",
    icon: "📈",
    description: "Identify the mystery NSE/BSE company from progressive clues.",
  },
  WORD_SEARCH: {
    type: "WORD_SEARCH",
    slug: "finance-word-search",
    title: "Finance Word Search",
    icon: "🔎",
    description: "Find hidden finance terms in the grid. Tap a term to learn it.",
  },
  CROSSWORD: {
    type: "CROSSWORD",
    slug: "finance-crossword",
    title: "Finance Crossword",
    icon: "🧩",
    description: "Solve across & down clues from basic to WACC-level mastery.",
  },
};

// Future games stay locked / "Coming Soon" on homepage (§4).
export const FUTURE_GAMES: GameDefinition[] = [
  { type: "GUESS_STOCK", slug: "quiz", title: "Quiz", icon: "📝", description: "Rapid-fire finance quizzes.", comingSoon: true },
  { type: "GUESS_STOCK", slug: "chart-hunt", title: "Chart Hunt", icon: "📉", description: "Guess the company from its price chart.", comingSoon: true },
  { type: "GUESS_STOCK", slug: "detective", title: "Financial Detective", icon: "🕵️", description: "Follow the money through statements.", comingSoon: true },
];
