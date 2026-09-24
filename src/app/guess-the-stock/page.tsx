"use client";
import { useEffect, useState } from "react";

interface Clue { order: number; kind: string; text: string }
interface CompanyOpt { id: string; name: string; ticker?: string }

export default function GuessTheStockPage() {
  const [puzzleId, setPuzzleId] = useState("");
  const [clues, setClues] = useState<Clue[]>([]);
  const [revealed, setRevealed] = useState(1);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<CompanyOpt[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState<unknown>(null);
  const [attempts, setAttempts] = useState(0);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const id = `daily-${today}-guess-stock`;
    setPuzzleId(id);
    fetch(`/api/games/guess-stock/${id}`).then((r) => r.json()).then((d) => {
      setClues(d.clues ?? []);
    });
  }, [today]);

  useEffect(() => {
    if (query.length < 1) { setOptions([]); return; }
    const t = setTimeout(() => {
      fetch(`/api/companies?q=${encodeURIComponent(query)}`).then((r) => r.json()).then((d) => setOptions(d.companies ?? []));
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  async function submitGuess(name: string) {
    if (!name || done) return;
    const clueUsed = revealed;
    const res = await fetch(`/api/games/guess-stock/${puzzleId}/guess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess: name, clueUsed }),
    }).then((r) => r.json());
    const n = attempts + 1;
    setAttempts(n);
    if (res.correct) {
      setDone(res);
      setLog((l) => [...l, `✅ ${name} — correct! +${res.points} XP`]);
    } else {
      setLog((l) => [...l, `❌ ${name} — try again`]);
      setRevealed((r) => Math.min(r + 1, clues.length));
      setQuery("");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold">📈 Guess the Stock</h1>
      <p className="text-sm text-zinc-600">Identify the mystery company from progressive clues. 5 attempts. Scoring is server-side.</p>

      <ol className="mt-4 space-y-2" aria-live="polite">
        {clues.slice(0, revealed).map((c) => (
          <li key={c.order} className="rounded-lg border bg-white p-3">
            <span className="text-xs font-bold uppercase text-emerald-700">Clue {c.order} · {c.kind}</span>
            <p className="mt-1">{c.text}</p>
          </li>
        ))}
      </ol>

      {!done ? (
        <div className="mt-4">
          <label htmlFor="co" className="text-sm font-semibold">Search company…</label>
          <input id="co" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Avenue Supermarts, ITC, HDFC Bank…" autoComplete="off"
            className="mt-1 w-full rounded-lg border px-3 py-2" />
          <ul className="mt-1 divide-y rounded-lg border bg-white" role="listbox">
            {options.map((o) => (
              <li key={o.id}>
                <button onClick={() => submitGuess(o.name)} className="w-full px-3 py-2 text-left hover:bg-emerald-50">
                  {o.name} <span className="text-xs text-zinc-500">{o.ticker}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-zinc-500">Attempts: {attempts} / 5</p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border bg-emerald-50 p-4">
          <h2 className="font-bold">{(done as { company: { name: string; ticker: string; exchange: string; industry: string; description: string; metrics: { key: string; value: number; asOf: string; source: string }[] } }).company.name} ({(done as { company: { ticker: string } }).company.ticker})</h2>
          <p className="text-sm">{(done as { company: { description: string } }).company.description}</p>
          <ul className="mt-2 text-sm">
            {(done as { company: { metrics: { key: string; value: number; asOf: string; source: string }[] } }).company.metrics.map((m) => (
              <li key={m.key}>{m.key} = {m.value} · as of {m.asOf} · src {m.source}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-zinc-500">Educational content — not investment advice.</p>
        </div>
      )}

      <ul className="mt-4 space-y-1 text-sm" aria-live="polite">
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
    </div>
  );
}
