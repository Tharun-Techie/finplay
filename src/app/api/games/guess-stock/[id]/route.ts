import { NextResponse } from "next/server";
import { getGuessStockDaily } from "@/data/puzzles";

// GET /api/games/guess-stock/{id} — clues only, NEVER the answer (§20, §34).
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const date = id.replace("daily-", "").replace("-guess-stock", "") || new Date().toISOString().slice(0, 10);
  const p = getGuessStockDaily(date);
  return NextResponse.json({
    puzzleId: p.puzzleId,
    maxAttempts: p.maxAttempts,
    clues: p.clues,
    companies: p.companies,
  });
}
