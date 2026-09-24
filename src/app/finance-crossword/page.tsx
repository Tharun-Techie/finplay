import { getPublicCrossword } from "@/data/puzzles";
import { todayYMD } from "@/lib/streak";
import CrosswordGrid from "@/components/CrosswordGrid";

// Server-rendered: puzzle data is baked into first paint, so there is no
// client-side fetch that can get stuck on "Loading…".
export default function CrosswordPage() {
  const date = todayYMD();
  const data = getPublicCrossword(date);
  return <CrosswordGrid data={data} puzzleId={data.puzzleId} />;
}
