import { GAMES, FUTURE_GAMES } from "@/lib/games/registry";
import { getDailyQuests } from "@/data/puzzles";
import { todayYMD } from "@/lib/streak";

export default async function Home() {
  const date = todayYMD();
  const quests = getDailyQuests(date);

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-80">FinQuest</p>
        <h1 className="mt-2 text-4xl font-extrabold">Play your way through finance.</h1>
        <p className="mt-2 max-w-xl text-white/90">Play · Discover · Think · Learn. Daily puzzles on Indian markets — Wordle-style fun, zero brokerage.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/guess-the-stock" className="rounded-full bg-white px-5 py-2.5 font-semibold text-emerald-700">Play Today&apos;s Quest</a>
          <a href="#games" className="rounded-full border border-white/60 px-5 py-2.5 font-semibold">Explore Games</a>
        </div>
      </section>

      <section aria-labelledby="daily">
        <h2 id="daily" className="text-xl font-bold">Today&apos;s challenges — {date}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {quests.map((q) => {
            const meta = Object.values(GAMES).find((g) => g.type === q.gameType)!;
            return (
              <a key={q.puzzleId} href={`/${meta.slug}`} className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="text-2xl" aria-hidden>{meta.icon}</div>
                <h3 className="mt-2 font-bold">{q.title}</h3>
                <dl className="mt-2 text-sm text-zinc-600">
                  <div className="flex justify-between"><dt>Difficulty</dt><dd>{q.difficulty}</dd></div>
                  <div className="flex justify-between"><dt>Time</dt><dd>~{q.estMinutes} min</dd></div>
                  <div className="flex justify-between"><dt>XP</dt><dd>+{q.xpReward}</dd></div>
                </dl>
                <span className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Play →</span>
              </a>
            );
          })}
        </div>
      </section>

      <section id="games" aria-labelledby="cats">
        <h2 id="cats" className="text-xl font-bold">Game categories</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {Object.values(GAMES).map((g) => (
            <a key={g.slug} href={`/${g.slug}`} className="rounded-xl border bg-white p-5">
              <div className="text-2xl" aria-hidden>{g.icon}</div>
              <h3 className="mt-2 font-bold">{g.title}</h3>
              <p className="text-sm text-zinc-600">{g.description}</p>
            </a>
          ))}
          {FUTURE_GAMES.map((g) => (
            <div key={g.slug} className="rounded-xl border border-dashed bg-zinc-100 p-5 opacity-70" aria-disabled>
              <div className="text-2xl" aria-hidden>{g.icon}</div>
              <h3 className="mt-2 font-bold">{g.title} · Coming Soon</h3>
              <p className="text-sm text-zinc-600">{g.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
