import { getPublicWordSearch } from "@/data/puzzles";
import { todayYMD } from "@/lib/streak";
import WordSearchGame from "@/components/WordSearchGame";

// Server-rendered: grid + word list baked into first paint.
export default function WordSearchPage() {
  const data = getPublicWordSearch(todayYMD());
  return <WordSearchGame initialGrid={data.grid} initialWords={data.words} puzzleId={data.puzzleId} />;
}
