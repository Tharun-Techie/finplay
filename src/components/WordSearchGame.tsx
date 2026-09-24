"use client";
import { useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import CheckIcon from "@mui/icons-material/Check";
import { termFor } from "@/data/glossary";

export interface WordSearchGameProps {
  initialGrid: string[][];
  initialWords: string[];
  puzzleId: string;
}

export default function WordSearchGame({ initialGrid, initialWords, puzzleId }: WordSearchGameProps) {
  const [grid] = useState<string[][]>(initialGrid);
  const [words] = useState<string[]>(initialWords);
  const [found, setFound] = useState<string[]>([]);
  const [sel, setSel] = useState<[number, number][]>([]);
  const [result, setResult] = useState("");
  const [activeTerm, setActiveTerm] = useState<string | null>(null);

  const selWord = useMemo(
    () => sel.map(([r, c]) => grid[r]?.[c] ?? "").join(""),
    [sel, grid],
  );

  function toggle(r: number, c: number) {
    setSel((s) =>
      s.some(([a, b]) => a === r && b === c)
        ? s.filter(([a, b]) => !(a === r && b === c))
        : [...s, [r, c]],
    );
  }

  async function submitSelection() {
    const rev = [...selWord].reverse().join("");
    const match = words.find((x) => x === selWord || x === rev);
    if (match && !found.includes(match)) {
      const next = [...found, match];
      setFound(next);
      setActiveTerm(match);
      setSel([]);
      const res = await fetch(`/api/games/word-search/${puzzleId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ found: next }),
      }).then((r) => r.json());
      setResult(res.solved ? `🎉 Solved! +${res.xp} XP` : `${next.length}/${words.length} found`);
    } else {
      setSel([]);
    }
  }

  const term = activeTerm ? termFor(activeTerm) : null;
  const isSel = (r: number, c: number) => sel.some(([a, b]) => a === r && b === c);

  return (
    <Stack spacing={2} sx={{ maxWidth: 720, mx: "auto" }}>
      <div>
        <Typography variant="h4" component="h1">
          🔎 Finance Word Search
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tap letters to select them, then check the word. Tap a found word to learn what it
          means. Touch, mouse &amp; keyboard friendly.
        </Typography>
      </div>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }} aria-live="polite">
        {words.map((w) => (
          <Chip
            key={w}
            label={w}
            clickable
            onClick={() => setActiveTerm(w)}
            onDelete={found.includes(w) ? () => setActiveTerm(w) : undefined}
            deleteIcon={found.includes(w) ? <CheckIcon /> : undefined}
            color={found.includes(w) ? "success" : "default"}
            variant={found.includes(w) ? "filled" : "outlined"}
            sx={{ fontFamily: "monospace", fontWeight: 700 }}
          />
        ))}
      </Box>

      {grid.length === 0 ? (
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: 5 }} />
      ) : (
        <Card>
          <CardContent>
            <Box
              role="grid"
              aria-label="Word search grid"
              sx={{
                display: "grid",
                gap: 0.5,
                userSelect: "none",
                gridTemplateColumns: `repeat(${grid[0]?.length ?? 12}, minmax(0,1fr))`,
              }}
            >
              {grid.map((row, r) =>
                row.map((ch, c) => (
                  <Button
                    key={`${r}-${c}`}
                    role="gridcell"
                    aria-pressed={isSel(r, c)}
                    aria-label={`Row ${r + 1} column ${c + 1}, letter ${ch}`}
                    onClick={() => toggle(r, c)}
                    variant={isSel(r, c) ? "contained" : "outlined"}
                    color={isSel(r, c) ? "secondary" : "primary"}
                    sx={{ minWidth: 0, aspectRatio: "1", p: 0, fontWeight: 800 }}
                  >
                    {ch}
                  </Button>
                )),
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mt: 2 }}>
              <Button variant="contained" onClick={submitSelection} disabled={!selWord}>
                Check “{selWord || "…"}”
              </Button>
              <Button onClick={() => setSel([])}>Clear</Button>
            </Box>
            {result && (
              <Alert severity={result.startsWith("🎉") ? "success" : "info"} sx={{ mt: 2 }} aria-live="polite">
                {result}
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {term && (
        <Card sx={{ bgcolor: "tertiary.main", color: "tertiary.contrastText" }}>
          <CardContent>
            <Typography variant="h6">
              {term.term} — {term.short}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {term.long}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
