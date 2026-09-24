import { NextResponse } from "next/server";
import { getDailyQuests } from "@/data/puzzles";
import { todayYMD } from "@/lib/streak";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? todayYMD();
  // TODO: picks PUBLISHED daily puzzles from DB; seed fallback for MVP.
  return NextResponse.json({ date, quests: getDailyQuests(date) });
}
