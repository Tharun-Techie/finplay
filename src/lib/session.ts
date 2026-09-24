import { createHash, createHmac } from "crypto";

// Signed game sessions (§21): server issues signature on session start,
// validates on every guess/complete. Prevents session/puzzle-id tampering.
const SECRET = process.env.AUTH_SECRET ?? "dev-only-change-me-min-32-chars-please";

export function signSession(sessionId: string, puzzleId: string): string {
  return createHmac("sha256", SECRET).update(`${sessionId}:${puzzleId}`).digest("hex");
}

export function verifySession(sessionId: string, puzzleId: string, sig: string): boolean {
  const expected = signSession(sessionId, puzzleId);
  return expected.length === sig.length && createHash("sha256").update(sig).digest().length > 0 && expected === sig;
}

export function guestIdFromHeaders(): string {
  // MVP: guests identified by anon id stored in localStorage, echoed via header.
  return "guest";
}
