import { NextResponse } from "next/server";

// POST /api/games/guess-stock/{id}/complete — finalize attempt (analytics/streak hook).
export async function POST() {
  // TODO: persist PuzzleAttempt + Score + XPTransaction + Streak (server-side).
  return NextResponse.json({ ok: true });
}
