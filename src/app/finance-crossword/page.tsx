"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

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
    let next: Entry;
    if (current && opts.length > 1 && activeCell?.[0] === r && activeCell?.[1] === c) {
      next = opts[(opts.indexOf(current) + 1) % opts.length];
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
    const list = cellsForEntry(e);
    const empty = list.find(([r, c]) => !cells[cellKey(r, c)]);
    focusCell(...(empty ?? [e.row, e.col]));
  }

  function typeAt(r: number, c: number, ch: string) {
    const v = ch.toUpperCase().replace(/[^A-Z]/g, "").slice(-1);
    setCells((prev) => ({ ...prev, [cellKey(r, c)]: v }));
    if (v && activeEntry && data) {
      const list = cellsForEntry(activeEntry);
      const i = list.findIndex(([a, b]) => a === r && b === c);
      const nxt = list[i + 1];
      if (nxt && !data.blocks[nxt[0]]?.[nxt[1]]) focusCell(nxt[0], nxt[1]);
    }
  }

  function handleKey(r: number, c: number, e: React.KeyboardEvent) {
    if (!data) return;
    const move = (dr: number, dc: number, wantDir?: "ACROSS" | "DOWN") => {
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nr < data.rows && nc >= 0 && nc < data.cols) {
        if (!data.blocks[nr][nc]) {
          focusCell(nr, nc);
          if (wantDir) {
            const opts = entriesByCell.get(cellKey(nr, nc)) ?? [];
            const match = opts.find((x) => x.dir === wantDir);
            if (match) setActiveKey(key(match.number, match.dir));
          }
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
    } else if (e.key === "ArrowRight") { move(0, 1, "ACROSS"); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { move(0, -1, "ACROSS"); e.preventDefault(); }
    else if (e.key === "ArrowDown") { move(1, 0, "DOWN"); e.preventDefault(); }
    else if (e.key === "ArrowUp") { move(-1, 0, "DOWN"); e.preventDefault(); }
    else if (e.key === "Tab") {
      const list = data.entries;
      const i = list.findIndex((x) => key(x.number, x.dir) === activeKey);
      const nxt = list[(i + (e.shiftKey ? -1 : 1) + list.length) % list.length];
      if (nxt) selectEntry(nxt);
      e.preventDefault();
    }
  }

  async function submit() {
    if (!data) return;
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
      <Stack spacing={2} sx={{ maxWidth: 720, mx: "auto" }}>
        <Typography variant="h4" component="h1">
          🧩 Finance Crossword
        </Typography>
        <Alert severity="error" role="alert">
          Couldn&apos;t load today&apos;s crossword: {loadError}
        </Alert>
        <Button variant="contained" onClick={() => setRetryN((n) => n + 1)} sx={{ alignSelf: "flex-start" }}>
          Retry
        </Button>
      </Stack>
    );
  }

  if (!data) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 8 }} aria-live="polite">
        <CircularProgress aria-label="Loading crossword" />
        <Typography variant="body2" color="text.secondary">
          Loading crossword…
        </Typography>
      </Stack>
    );
  }

  const across = data.entries.filter((e) => e.dir === "ACROSS");
  const down = data.entries.filter((e) => e.dir === "DOWN");

  return (
    <Stack spacing={2} sx={{ maxWidth: 960, mx: "auto" }}>
      <div>
        <Typography variant="h4" component="h1">
          🧩 Finance Crossword
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tap a square or clue to play. Touch, mobile &amp; desktop keyboards supported.
          Solutions never leave the server.
        </Typography>
      </div>

      {activeEntry && (
        <Alert severity="success" icon={false} aria-live="polite">
          <strong>
            {activeEntry.number} {activeEntry.dir}
          </strong>{" "}
          — {activeEntry.clue} ({activeEntry.len})
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "auto 1fr" },
          alignItems: "start",
        }}
      >
        <Card>
          <CardContent>
            <Box
              role="grid"
              aria-label="Crossword grid"
              sx={{
                display: "grid",
                gap: "2px",
                bgcolor: "divider",
                p: "2px",
                borderRadius: 2,
                width: { xs: "100%", md: 420 },
                gridTemplateColumns: `repeat(${data.cols}, minmax(0,1fr))`,
              }}
            >
              {Array.from({ length: data.rows }, (_, r) =>
                Array.from({ length: data.cols }, (_, c) => {
                  if (data.blocks[r][c]) {
                    return <Box key={`${r}-${c}`} role="presentation" sx={{ aspectRatio: "1", bgcolor: "text.primary", opacity: 0.85 }} />;
                  }
                  const ck = cellKey(r, c);
                  const num = data.numbers[r][c];
                  const isActive = activeCells.has(ck);
                  const isCursor = activeCell?.[0] === r && activeCell?.[1] === c;
                  return (
                    <Box
                      key={`${r}-${c}`}
                      role="gridcell"
                      sx={{
                        position: "relative",
                        aspectRatio: "1",
                        bgcolor: isCursor ? "secondary.light" : isActive ? "secondary.main" : "background.paper",
                        outline: isCursor ? 2 : 0,
                        outlineColor: "primary.main",
                        "&:focus-within": { bgcolor: "secondary.light" },
                      }}
                    >
                      {num != null && (
                        <Typography
                          aria-hidden
                          sx={{
                            position: "absolute",
                            left: 2,
                            top: 0,
                            fontSize: 9,
                            fontWeight: 800,
                            lineHeight: 1.2,
                            color: "text.secondary",
                            pointerEvents: "none",
                          }}
                        >
                          {num}
                        </Typography>
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
                          style={{
                            height: "100%",
                            width: "100%",
                            background: "transparent",
                            border: "none",
                            textAlign: "center",
                            fontSize: 16,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            color: "inherit",
                          }}
                        />
                    </Box>
                  );
                }),
              )}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr" }, alignItems: "start" }}>
          {(
            [
              ["Across", across],
              ["Down", down],
            ] as [string, Entry[]][]
          ).map(([title, list]) => (
            <Card key={title}>
              <CardContent sx={{ pb: 1 }}>
                <Typography variant="overline" color="text.secondary">
                  {title}
                </Typography>
                <List dense disablePadding aria-label={`${title} clues`}>
                  {list.map((e) => {
                    const k = key(e.number, e.dir);
                    const filled = cellsForEntry(e).every(([r, c]) => cells[cellKey(r, c)]);
                    return (
                      <ListItemButton
                        key={k}
                        selected={k === activeKey}
                        onClick={() => selectEntry(e)}
                        sx={{ borderRadius: 2 }}
                      >
                        <ListItemText
                          primary={`${e.number}. ${e.clue} (${e.len})`}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                        {filled && <Chip label="filled" size="small" variant="outlined" />}
                      </ListItemButton>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
        <Button variant="contained" onClick={submit}>
          Check crossword
        </Button>
        <Button onClick={clearEntry}>Clear this clue</Button>
        <Button onClick={() => setCells({})}>Clear all</Button>
      </Stack>
      {res && (
        <Alert severity={res.startsWith("🎉") ? "success" : "info"} aria-live="polite">
          {res}
        </Alert>
      )}
    </Stack>
  );
}
