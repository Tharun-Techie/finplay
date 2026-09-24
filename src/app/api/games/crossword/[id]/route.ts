import { NextResponse } from "next/server";
import { getCrosswordDaily } from "@/data/puzzles";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const date = id.replace("daily-", "").replace("-crossword", "") || new Date().toISOString().slice(0, 10);
  const p = getCrosswordDaily(date);
  // Publish grid shape + numbers + clue placements, NOT solution letters (§34).
  const numbers: (number | null)[][] = p.grid.map((row) => row.map(() => null));
  for (const w of p.placed) {
    if (numbers[w.row]?.[w.col] == null) numbers[w.row][w.col] = w.number;
  }
  return NextResponse.json({
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
  });
}
