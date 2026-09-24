import { NextResponse } from "next/server";
import { z } from "zod";
import { getWordSearchDaily } from "@/data/puzzles";
import { GAME_XP } from "@/lib/scoring";

const Body = z.object({
  found: z.array(z.string().max(24)).max(30),
  seconds: z.number().int().min(0).max(7200).optional(),
});

// POST validate found words against server-side placed words (§20).
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid submission" }, { status: 400 });

  const date = id.replace("daily-", "").replace("-word-search", "") || new Date().toISOString().slice(0, 10);
  const puzzle = getWordSearchDaily(date);
  const valid = new Set(puzzle._placed.map((p) => p.word));
  const claimed = [...new Set(parsed.data.found.map((w) => w.toUpperCase()))];
  const correct = claimed.filter((w) => valid.has(w));
  const solved = correct.length >= puzzle.words.length;
  const xp = solved ? GAME_XP.WORD_SEARCH_COMPLETED + GAME_XP.DAILY_BONUS : Math.min(correct.length * 10, 90);
  return NextResponse.json({ correct, solved, total: puzzle.words.length, xp, points: xp });
}
