import { NextResponse } from "next/server";
import { getCrosswordDaily } from "@/data/puzzles";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const date = id.replace("daily-", "").replace("-crossword", "") || new Date().toISOString().slice(0, 10);
  const p = getCrosswordDaily(date);
  // Publish grid shape + clues, NOT solution letters.
  const mask = p.grid.map((row) => row.map((c) => (c === null ? null : "")));
  return NextResponse.json({
    puzzleId: p.puzzleId,
    rows: p.rows,
    cols: p.cols,
    mask,
    clues: p.placed.map((w) => ({ number: w.number, dir: w.dir, clue: w.clue, len: w.word.length })),
  });
}
