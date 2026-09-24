import { NextResponse } from "next/server";
import { COMPANIES } from "@/data/companies";

// Autocomplete endpoint to prevent spelling issues (§5).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const list = COMPANIES.filter((c) => c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q)).slice(0, 8);
  return NextResponse.json({ companies: list.map((c) => ({ id: c.id, name: c.name, ticker: c.ticker })) });
}
