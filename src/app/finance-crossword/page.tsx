"use client";
import { useEffect, useState } from "react";

interface Clue { number: number; dir: string; clue: string; len: number }

export default function CrosswordPage() {
  const today = new Date().toISOString().slice(0, 10);
  const puzzleId = `daily-${today}-crossword`;
  const [clues, setClues] = useState<Clue[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [res, setRes] = useState("");

  useEffect(() => {
    fetch(`/api/games/crossword/${puzzleId}`).then((r) => r.json()).then((d) => setClues(d.clues ?? []));
  }, [puzzleId]);

  async function submit() {
    const r = await fetch(`/api/games/crossword/${puzzleId}/complete`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    }).then((x) => x.json());
    setRes(r.solved ? `🎉 Solved! +${r.xp} XP` : `${r.correct}/${r.total} correct`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold">🧩 Finance Crossword</h1>
      <p className="text-sm text-zinc-600">Answers validated server-side. Works with touch + desktop keyboards.</p>
      <div className="mt-4 space-y-2">
        {clues.map((c) => {
          const key = `${c.number}-${c.dir}`;
          return (
            <div key={key} className="rounded-lg border bg-white p-3">
              <label htmlFor={key} className="text-sm font-semibold">{c.number} {c.dir} — {c.clue} ({c.len})</label>
              <input id={key} value={answers[key] ?? ""} onChange={(e) => setAnswers((a) => ({ ...a, [key]: e.target.value }))}
                className="mt-1 w-full rounded border px-3 py-2 font-mono uppercase" autoComplete="off" />
            </div>
          );
        })}
      </div>
      <button onClick={submit} className="mt-4 rounded-full bg-emerald-600 px-5 py-2 font-semibold text-white">Check crossword</button>
      <p className="mt-2 text-sm" aria-live="polite">{res}</p>
    </div>
  );
}
