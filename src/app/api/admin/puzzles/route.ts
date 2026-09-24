import { NextResponse } from "next/server";

// Admin stubs (§27) — require elevated auth (middleware checks x-admin-token in MVP).
function forbidden(req: Request) {
  return req.headers.get("x-admin-token") !== process.env.ADMIN_TOKEN;
}

export async function GET(req: Request) {
  if (forbidden(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ puzzles: [], note: "Admin list — wire to Prisma Puzzle model." });
}

export async function POST(req: Request) {
  if (forbidden(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ ok: true, draft: body }, { status: 201 });
}
