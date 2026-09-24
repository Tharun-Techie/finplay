import { NextResponse } from "next/server";
import { z } from "zod";
import { COMPANIES } from "@/data/companies";
import { getGuessStockDaily } from "@/data/puzzles";
import { isCorrectGuess } from "@/lib/games/guess-stock";
import { scoreGuessStock, isPlausibleScore } from "@/lib/scoring";

const Body = z.object({
  guess: z.string().min(1).max(120),
  clueUsed: z.number().int().min(1).max(10), // client reports progress; server clamps + validates
});

// POST /api/games/guess-stock/{id}/guess — server-side answer + scoring (§20).
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid guess" }, { status: 400 });

  const date = id.replace("daily-", "").replace("-guess-stock", "") || new Date().toISOString().slice(0, 10);
  const puzzle = getGuessStockDaily(date);
  const company = COMPANIES.find((c) => c.id === puzzle.companyId)!;

  const { guess, clueUsed } = parsed.data;
  const correct = isCorrectGuess(guess, company);
  const points = correct ? scoreGuessStock(Math.min(clueUsed, puzzle.maxAttempts)) : 0;

  if (!isPlausibleScore("GUESS_STOCK", points)) {
    return NextResponse.json({ correct, flagged: true, points: 0 }, { status: 200 });
  }

  if (correct) {
    // Educational reveal — never investment advice (§36). Metrics carry asOf/source.
    return NextResponse.json({
      correct: true,
      points,
      xp: points,
      company: {
        name: company.name,
        ticker: company.ticker,
        exchange: company.exchange,
        industry: company.industry,
        description: company.description,
        metrics: company.metrics,
      },
      disclaimer: "Educational game content — not investment advice.",
    });
  }
  const attemptsLeft = Math.max(0, puzzle.maxAttempts - clueUsed);
  const nextClue = puzzle.clues[Math.min(clueUsed, puzzle.clues.length - 1)];
  return NextResponse.json({ correct: false, points: 0, attemptsLeft, nextClue });
}
