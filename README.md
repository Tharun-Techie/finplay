# FinQuest — Play your way through finance

Modular-monolith MVP (Next.js + TypeScript + Prisma + Postgres).

## Quick start (no DB — seed fallback)
```bash
npm install
npm run dev        # http://localhost:3000
```
APIs work out of the box via deterministic seed data (`src/data/*`).

## With Postgres + Redis
```bash
cp .env.example .env
docker compose up -d
npm run db:push
npm run dev
```

## Structure
- `prisma/schema.prisma` — User, Company, CompanyMetric (value/currency/period/asOf/source), Puzzle envelope + per-game tables, GameSession (signed), Score (flagged), XP, Streak, Achievements (configurable rules)
- `src/lib/games/registry.ts` — add a game = GameDefinition + engine + scoring + content + UI
- `src/lib/games/word-search.ts` — deterministic seeded generator (§18)
- `src/lib/games/crossword.ts` — greedy intersection placer + validator (§19)
- `src/lib/games/guess-stock.ts` — tolerant answer check
- `src/lib/scoring.ts` — configurable XP tables + levels; `isPlausibleScore` anti-cheat
- `src/lib/streak.ts` — server-side streak calc
- `src/lib/session.ts` — HMAC-signed sessions (§21)
- `src/lib/market-data/provider.ts` — pluggable NSE/BSE/ProviderX abstraction (§15)
- `src/data/` — NSE seed companies, glossary, deterministic daily quests
- `src/app/api/` — daily, guess-stock guess/complete, word-search/crossword complete, companies autocomplete, leaderboard, admin (x-admin-token), me/stats

## Key guarantees
- Answers & scores validated server-side; clients never submit XP (§20).
- Daily puzzles share one ID per date; grids pre-generated from seed (§8, §32).
- Finance metrics always carry asOf/source; UI disclaims "not investment advice" (§36).
- Future games render as Coming Soon without touching existing games (§46).
