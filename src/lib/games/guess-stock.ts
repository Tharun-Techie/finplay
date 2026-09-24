// Guess-the-Stock answer validation (§5, §20). Case/spelling tolerant;
// autocomplete on client prevents typos, server normalizes + matches ticker too.
export function normalizeCompany(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isCorrectGuess(
  guess: string,
  company: { name: string; ticker: string },
): boolean {
  const g = normalizeCompany(guess);
  if (!g) return false;
  return g === normalizeCompany(company.name) || g === normalizeCompany(company.ticker);
}
