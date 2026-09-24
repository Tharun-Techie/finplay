import { NextResponse } from "next/server";

// MVP stub — real implementation aggregates Score/XPTransaction server-side (§13, §28).
export async function GET() {
  return NextResponse.json({
    period: "daily",
    entries: [
      { rank: 1, name: "MarketWizard", xp: 1450 },
      { rank: 2, name: "DalalDebut", xp: 1200 },
      { rank: 3, name: "You", xp: 800 },
    ],
  });
}
