export default function LeaderboardPage() {
  const entries = [
    { rank: 1, name: "MarketWizard", xp: 1450 },
    { rank: 2, name: "DalalDebut", xp: 1200 },
    { rank: 3, name: "You", xp: 800 },
  ];
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold">🏆 Leaderboard</h1>
      <p className="text-sm text-zinc-600">Daily · Weekly · Monthly · All-time (global / country / friends). Privacy-respecting.</p>
      <ol className="mt-4 space-y-2">
        {entries.map((e) => (
          <li key={e.rank} className="flex justify-between rounded-lg border bg-white p-3">
            <span>#{e.rank} {e.name}</span><span className="font-bold">{e.xp} XP</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
