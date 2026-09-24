import { NextResponse } from "next/server";
import { getPublicCrossword } from "@/data/puzzles";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const date = id.replace("daily-", "").replace("-crossword", "") || new Date().toISOString().slice(0, 10);
  // Public shape only — numbers + placements, NOT solution letters (§34).
  return NextResponse.json(getPublicCrossword(date));
}
