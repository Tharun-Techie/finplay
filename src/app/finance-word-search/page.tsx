"use client";
import { useEffect, useMemo, useState } from "react";
import { termFor } from "@/data/glossary";

export default function WordSearchPage() {
  const today = new Date().toISOString().slice(0, 10);
  const puzzleId = `daily-${today}-word-search`;
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [sel, setSel] = useState<[number, number][]>([]);
  const [result, setResult] = useState<string>("");
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/games/word-search/${puzzleId}`).then((r) => r.json()).then((d) => {
      setGrid(d.grid ?? []); setWords(d.words ?? []);
    });
  }, [puzzleId]);

  const selWord = useMemo(() => sel.map(([r, c]) => grid[r]?.[c] ?? "").join(""), [sel, grid]);

  function toggle(r: number, c: number) {
    setSel((s) => (s.some(([a, b]) => a === r && b === c) ? s.filter(([a, b]) => !(a === r && b === c)) : [...s, [r, c]]));
  }

  async function submitSelection() {
    const w = selWord;
    const rev = [...w].reverse().join("");
    const match = words.find((x) => x === w || x === rev);
    if (match && !found.includes(match)) {
      const next = [...found, match];
      setFound(next);
      setActiveTerm(match);
      setSel([]);
      const res = await fetch(`/api/games/word-search/${puzzleId}/complete`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ found: next }),
      }).then((r) => r.json());
      setResult(res.solved ? `🎉 Solved! +${res.xp} XP` : `${correct(next)}/${words.length} found`);
    } else {
      setSel([]);
    }
  }
  const correct = (f: string[]) => f.length;

  const term = activeTerm ? termFor(activeTerm) : null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold">🔎 Finance Word Search</h1>
      <p className="text-sm text-zinc-600">Drag/tap letters (touch + mouse + keyboard accessible). Select a found word to see what it means.</p>
      <div className="mt-2 flex flex-wrap gap-2 text-sm" aria-live="polite">
        {words.map((w) => (
          <button key={w} onClick={() => setActiveTerm(w)}
            className={`rounded-full px-3 py-1 font-mono ${found.includes(w) ? "bg-emerald-600 text-white" : "bg-white border"}`}>
            {found.includes(w) ? `✓ ${w}` : w}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-0.5 select-none" style={{ gridTemplateColumns: `repeat(${grid[0]?.length ?? 12}, minmax(0,1fr))` }} role="grid" aria-label="Word search grid">
        {grid.map((row, r) => row.map((ch, c) => {
          const on = sel.some(([a, b]) => a === r && b === c);
          return (
            <button key={`${r}-${c}`} role="gridcell" onClick={() => toggle(r, c)}
              className={`aspect-square rounded text-sm font-bold ${on ? "bg-amber-300" : "bg-white border hover:bg-amber-100"}`}>
              {ch}
            </button>
          );
        }))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={submitSelection} className="rounded-full bg-emerald-600 px-5 py-2 font-semibold text-white">Check “{selWord || "…"}”</button>
        <button onClick={() => setSel([])} className="text-sm underline">Clear</button>
        <span className="text-sm" aria-live="polite">{result}</span>
      </div>
      {term && (
        <div className="mt-4 rounded-xl border bg-white p-4">
          <h2 className="font-bold">{term.term} — {term.short}</h2>
          <p className="text-sm">{term.long}</p>
        </div>
      )}
    </div>
  );
}
