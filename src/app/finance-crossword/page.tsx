"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Entry {
  number: number;
  dir: "ACROSS" | "DOWN";
  clue: string;
  len: number;
  row: number;
  col: number;
}

interface PuzzleData {
  puzzleId: string;
  rows: number;
  cols: number;
  blocks: boolean[][];
  numbers: (number | null)[][];
  entries: Entry[];
}

const key = (n: number, d: string) => `${n}-${d}`;
const cellKey = (r: number, c: number) => `${r}-${c}`;

function cellsForEntry(e: Entry): [number, number][] {
  return Array.from({ length: e.len }, (_, i) =>
    e.dir === "ACROSS" ? [e.row, e.col + i] : [e.row + i, e.col],
  ) as [number, number][];
}

export default function CrosswordPage() {
  const today = new Date().toISOString().slice(0, 10);
  const puzzleId = `daily-${today}-crossword`;
  const [data, setData] = useState<PuzzleData | null>(null);
  const [cells, setCells] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryN, setRetryN] = useState(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [res, setRes] = useState("");
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    fetch(`/api/games/crossword/${puzzleId}`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`Server responded ${r.status}`);
        return r.json();
      })
      .then((d: PuzzleData) => {
        if (cancelled) return;
        if (!d || !Array.isArray(d.blocks) || !Array.isArray(d.entries)) {
          throw new Error("Unexpected puzzle shape from server");
        }
        setData(d);
        if (d.entries.length > 0) {
          const first = d.entries.find((e) => e.dir === "ACROSS") ?? d.entries[0];
          setActiveKey(key(first.number, first.dir));
          setActiveCell([first.row, first.col]);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Failed to load puzzle");
      });
    return () => {
      cancelled = true;
    };
  }, [puzzleId, retryN]);

  const activeEntry = useMemo(
    () => data?.entries.find((e) => key(e.number, e.dir) === activeKey) ?? null,
    [data, activeKey],
  );
  const activeCells = useMemo(
    () => new Set((activeEntry ? cellsForEntry(activeEntry) : []).map(([r, c]) => cellKey(r, c))),
    [activeEntry],
  );

  const entriesByCell = useMemo(() => {
    const m = new Map<string, Entry[]>();
    for (const e of data?.entries ?? []) {
      for (const [r, c] of cellsForEntry(e)) {
        const k = cellKey(r, c);
        m.set(k, [...(m.get(k) ?? []), e]);
      }
    }
    return m;
  }, [data]);

  const focusCell = useCallback((r: number, c: number) => {
    setActiveCell([r, c]);
    requestAnimationFrame(() => inputRefs.current.get(cellKey(r, c))?.focus());
  }, []);

  function selectCell(r: number, c: number) {
    const opts = entriesByCell.get(cellKey(r, c)) ?? [];
    if (opts.length === 0) return;
    const current = activeKey ? opts.find((e) => key(e.number, e.dir) === activeKey) : null;
    // Tapping the same cell toggles ACROSS/DOWN when both exist (§30 touch support).
    let next: Entry;
    if (current && opts.length > 1 && activeCell?.[0] === r && activeCell?.[1] === c) {
      const i = opts.indexOf(current);
      next = opts[(i + 1) % opts.length];
    } else if (current && opts.includes(current)) {
      next = current;
    } else {
      next = opts[0];
    }
    setActiveKey(key(next.number, next.dir));
    focusCell(r, c);
  }

  function selectEntry(e: Entry) {
    setActiveKey(key(e.number, e.dir));
    // Jump to first empty cell in the entry, else its start.
    const cellsList = cellsForEntry(e);
    const empty = cellsList.find(([r, c]) => !cells[cellKey(r, c)]);
    focusCell(...(empty ?? [e.row, e.col]));
  }

  function typeAt(r: number, c: number, ch: string) {
    const v = ch.toUpperCase().replace(/[^A-Z]/g, "").slice(-1);
    setCells((prev) => ({ ...prev, [cellKey(r, c)]: v }));
    if (v && activeEntry) {
      const list = cellsForEntry(activeEntry);
      const i = list.findIndex(([a, b]) => a === r && b === c);
      const nxt = list[i + 1];
      if (nxt && data && !data.blocks[nxt[0]]?.[nxt[1]]) focusCell(nxt[0], nxt[1]);
    }
  }

  function handleKey(r: number, c: number, e: React.KeyboardEvent) {
    if (!data) return;
    const move = (dr: number, dc: number) => {
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < data.rows && nc >= 0 && nc < data.cols) {
        if (!data.blocks[nr][nc]) {
          // Keep typing direction aligned with active entry when using arrows.
          focusCell(nr, nc);
          // If arrow implies a direction change, switch active entry if possible.
          const opts = entriesByCell.get(cellKey(nr, nc)) ?? [];
          const wantDir = dc !== 0 ? "ACROSS" : "DOWN";
          const match = opts.find((x) => x.dir === wantDir);
          if (match && (dr !== 0 || dc !== 0)) setActiveKey(key(match.number, match.dir));
          return;
        }
        nr += dr;
        nc += dc;
      }
    };
    if (e.key === "Backspace") {
      if (cells[cellKey(r, c)]) {
        setCells((prev) => ({ ...prev, [cellKey(r, c)]: "" }));
      } else if (activeEntry) {
        const list = cellsForEntry(activeEntry);
        const i = list.findIndex(([a, b]) => a === r && b === c);
        const prevCell = list[i - 1];
        if (prevCell) {
          setCells((prev) => ({ ...prev, [cellKey(prevCell[0], prevCell[1])]: "" }));
          focusCell(prevCell[0], prevCell[1]);
        }
      }
      e.preventDefault();
    } else if (e.key === "ArrowRight") { move(0, 1); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { move(0, -1); e.preventDefault(); }
    else if (e.key === "ArrowDown") { move(1, 0); e.preventDefault(); }
    else if (e.key === "ArrowUp") { move(-1, 0); e.preventDefault(); }
    else if (e.key === "Tab") {
      // Cycle through clues instead of leaving the grid.
      const list = data.entries;
      const i = list.findIndex((x) => key(x.number, x.dir) === activeKey);
      const nxt = list[(i + (e.shiftKey ? -1 : 1) + list.length) % list.length];
      if (nxt) selectEntry(nxt);
      e.preventDefault();
    }
  }

  async function submit() {
    if (!data || !activeEntry) return;
    const answers: Record<string, string> = {};
    for (const e of data.entries) {
      answers[key(e.number, e.dir)] = cellsForEntry(e)
        .map(([r, c]) => cells[cellKey(r, c)] ?? "")
        .join("");
    }
    const r = await fetch(`/api/games/crossword/${puzzleId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    }).then((x) => x.json());
    setRes(r.solved ? `🎉 Solved! +${r.xp} XP` : `${r.correct}/${r.total} correct — keep going`);
  }

  function clearEntry() {
    if (!activeEntry) return;
    setCells((prev) => {
      const next = { ...prev };
      for (const [r, c] of cellsForEntry(activeEntry)) delete next[cellKey(r, c)];
      return next;
    });
    focusCell(activeEntry.row, activeEntry.col);
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-extrabold">🧩 Finance Crossword</h1>
        <p className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm" role="alert">
          Couldn&apos;t load today&apos;s crossword: {loadError}
        </p>
        <button
          onClick={() => setRetryN((n) => n + 1)}
          className="mt-3 rounded-full bg-emerald-600 px-5 py-2 font-semibold text-white"
        >
          Retry
        </button>
      </div>
    );
  }
  if (!data) return <p className="text-sm" aria-live="polite">Loading crossword…</p>;

  const across = data.entries.filter((e) => e.dir === "ACROSS");
  const down = data.entries.filter((e) => e.dir === "DOWN");

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-extrabold">🧩 Finance Crossword</h1>
      <p className="text-sm text-zinc-600">
        Tap a square or clue to play. Type with touch, mobile, or desktop keyboard. Answers are validated server-side — solutions never ship to the browser.
      </p>

      {activeEntry && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold" aria-live="polite">
          {activeEntry.number} {activeEntry.dir} — {activeEntry.clue} ({activeEntry.len})
        </p>
      )}

      <div className="mt-4 grid gap-6 md:grid-cols-[auto_1fr]">
        <div
          role="grid"
          aria-label="Crossword grid"
          className="grid w-full max-w-[420px] gap-[2px] rounded-lg bg-zinc-300 p-[2px]"
          style={{ gridTemplateColumns: `repeat(${data.cols}, minmax(0,1fr))` }}
        >
          {Array.from({ length: data.rows }, (_, r) =>
            Array.from({ length: data.cols }, (_, c) => {
              if (data.blocks[r][c]) {
                return <div key={`${r}-${c}`} role="presentation" className="aspect-square bg-zinc-900/90" />;
              }
              const ck = cellKey(r, c);
              const num = data.numbers[r][c];
              const isActive = activeCells.has(ck);
              const isCursor = activeCell?.[0] === r && activeCell?.[1] === c;
              return (
                <div key={`${r}-${c}`} role="gridcell" className={`relative aspect-square ${isActive ? "bg-amber-100" : "bg-white"} ${isCursor ? "outline-2 outline-emerald-600" : ""}`}>
                  {num != null && (
                    <span className="pointer-events-none absolute left-[2px] top-0 text-[9px] font-bold leading-none text-zinc-600" aria-hidden>
                      {num}
                    </span>
                  )}
                  <input
                    ref={(el) => {
                      if (el) inputRefs.current.set(ck, el);
                      else inputRefs.current.delete(ck);
                    }}
                    value={cells[ck] ?? ""}
                    onChange={(e) => typeAt(r, c, e.target.value)}
                    onKeyDown={(e) => handleKey(r, c, e)}
                    onFocus={() => {
                      setActiveCell([r, c]);
                      const opts = entriesByCell.get(ck) ?? [];
                      if (opts.length > 0 && !opts.some((x) => key(x.number, x.dir) === activeKey)) {
                        setActiveKey(key(opts[0].number, opts[0].dir));
                      }
                    }}
                    onClick={() => selectCell(r, c)}
                    maxLength={1}
                    autoComplete="off"
                    autoCapitalize="characters"
                    aria-label={`Row ${r + 1} column ${c + 1}${num ? `, number ${num}` : ""}`}
                    className="h-full w-full bg-transparent text-center text-base font-bold uppercase caret-emerald-700 focus:bg-amber-200 focus:outline-none sm:text-lg"
                  />
                </div>
              );
            }),
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          {(
            [
              ["Across", across],
              ["Down", down],
            ] as [string, Entry[]][]
          ).map(([title, list]) => (
            <section key={title} aria-label={`${title} clues`}>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-zinc-500">{title}</h2>
              <ol className="mt-2 space-y-1">
                {list.map((e) => {
                  const k = key(e.number, e.dir);
                  const filled = cellsForEntry(e).every(([r, c]) => cells[cellKey(r, c)]);
                  return (
                    <li key={k}>
                      <button
                        onClick={() => selectEntry(e)}
                        aria-current={k === activeKey}
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${k === activeKey ? "border-emerald-600 bg-emerald-50 font-semibold" : "bg-white hover:bg-amber-50"} ${filled ? "border-dashed" : ""}`}
                      >
                        <span className="font-bold">{e.number}.</span> {e.clue} <span className="text-zinc-500">({e.len})</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={submit} className="rounded-full bg-emerald-600 px-5 py-2 font-semibold text-white">
          Check crossword
        </button>
        <button onClick={clearEntry} className="text-sm underline">
          Clear this clue
        </button>
        <button onClick={() => setCells({})} className="text-sm underline">
          Clear all
        </button>
        <span className="text-sm" aria-live="polite">{res}</span>
      </div>
    </div>
  );
}
