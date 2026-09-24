import { getGuessStockDaily } from "@/data/puzzles";
import { todayYMD } from "@/lib/streak";
import GuessStockGame from "@/components/GuessStockGame";

// Server-rendered: clues baked into first paint (answer stays server-side).
export default function GuessStockPage() {
  const data = getGuessStockDaily(todayYMD());
  return <GuessStockGame initialClues={data.clues} puzzleId={data.puzzleId} />;
}
