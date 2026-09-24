import { NextResponse } from "next/server";
import { getPublicWordSearch } from "@/data/puzzles";

// GET grid + word list (NOT coordinates — validated server-side).
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const date = id.replace("daily-", "").replace("-word-search", "") || new Date().toISOString().slice(0, 10);
  return NextResponse.json(getPublicWordSearch(date));
}
