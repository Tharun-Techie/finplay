import { NextResponse } from "next/server";
import { levelForXp } from "@/lib/scoring";

export async function GET() {
  // TODO: resolve user from session/JWT; guest fallback from localStorage id.
  return NextResponse.json({ xp: 800, ...levelForXp(800), streak: 3, completedToday: 1 });
}
