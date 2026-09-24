import { NextResponse } from "next/server";
import { z } from "zod";
import { getCrosswordDaily } from "@/data/puzzles";
import { checkCrosswordSolution } from "@/lib/games/crossword";
import { GAME_XP } from "@/lib/scoring";

const Body = z.object({ answers: z.record(z.string(), z.string().max(24)) });

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  const date = id.replace("daily-", "").replace("-crossword", "") || new Date().toISOString().slice(0, 10);
  const p = getCrosswordDaily(date);
  const res = checkCrosswordSolution(p.placed, parsed.data.answers);
  const xp = res.solved ? GAME_XP.CROSSWORD_COMPLETED + GAME_XP.DAILY_BONUS : res.correct * 10;
  return NextResponse.json({ ...res, xp, points: xp });
}
