"use client";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface Clue {
  order: number;
  kind: string;
  text: string;
}
interface CompanyOpt {
  id: string;
  name: string;
  ticker?: string;
}
interface Solved {
  points: number;
  company: {
    name: string;
    ticker: string;
    exchange: string;
    industry: string;
    description: string;
    metrics: { key: string; value: number; asOf: string; source: string }[];
  };
}

const MAX_ATTEMPTS = 5;

export interface GuessStockGameProps {
  initialClues: Clue[];
  puzzleId: string;
}

export default function GuessStockGame({ initialClues, puzzleId }: GuessStockGameProps) {
  const [clues] = useState<Clue[]>(initialClues);
  const [revealed, setRevealed] = useState(1);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<CompanyOpt[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [log, setLog] = useState<{ ok: boolean; text: string }[]>([]);
  const [done, setDone] = useState<Solved | null>(null);

  useEffect(() => {
    if (input.length < 1) {
      setOptions([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/companies?q=${encodeURIComponent(input)}`)
        .then((r) => r.json())
        .then((d) => setOptions(d.companies ?? []))
        .catch(() => {});
    }, 200);
    return () => clearTimeout(t);
  }, [input]);

  async function submitGuess(name: string) {
    if (!name || done || attempts >= MAX_ATTEMPTS) return;
    const res = await fetch(`/api/games/guess-stock/${puzzleId}/guess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess: name, clueUsed: revealed }),
    }).then((r) => r.json());
    const n = attempts + 1;
    setAttempts(n);
    if (res.correct) {
      setDone(res);
      setLog((l) => [...l, { ok: true, text: `${name} — correct! +${res.points} XP` }]);
    } else {
      setLog((l) => [...l, { ok: false, text: `${name} — try again` }]);
      setRevealed((r) => Math.min(r + 1, Math.max(clues.length, 1)));
      setInput("");
    }
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 720, mx: "auto" }}>
      <div>
        <Typography variant="h4" component="h1">
          📈 Guess the Stock
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Identify the mystery company from progressive clues. {MAX_ATTEMPTS} attempts — scoring
          is server-side.
        </Typography>
      </div>

      <LinearProgress
        variant="determinate"
        value={(attempts / MAX_ATTEMPTS) * 100}
        aria-label={`Attempts used: ${attempts} of ${MAX_ATTEMPTS}`}
        sx={{ borderRadius: 2, height: 8 }}
      />

      <List>
        {clues.slice(0, revealed).map((c) => (
          <ListItem key={c.order} component={Card} sx={{ mb: 1 }} aria-live="polite">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <LightbulbIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`Clue ${c.order} · ${c.kind}`}
              secondary={c.text}
              slotProps={{
                primary: { variant: "overline", color: "primary" },
                secondary: { variant: "body1", color: "text.primary" },
              }}
            />
          </ListItem>
        ))}
      </List>

      {!done && attempts < MAX_ATTEMPTS ? (
        <Card>
          <CardContent>
            <Autocomplete
              freeSolo
              inputValue={input}
              onInputChange={(_, v) => setInput(v)}
              options={options.map((o) => o.name)}
              onChange={(_, v) => v && submitGuess(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search company…"
                  placeholder="Avenue Supermarts, ITC, HDFC Bank…"
                  helperText={`Attempts: ${attempts} / ${MAX_ATTEMPTS}`}
                />
              )}
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              disabled={!input}
              onClick={() => submitGuess(input)}
            >
              Submit guess
            </Button>
          </CardContent>
        </Card>
      ) : (
        done && (
          <Card sx={{ bgcolor: "success.light" }}>
            <CardContent>
              <Typography variant="h6">
                {done.company.name} ({done.company.ticker} · {done.company.exchange})
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {done.company.industry} — {done.company.description}
              </Typography>
              <Table size="small" sx={{ mt: 1.5, bgcolor: "background.paper", borderRadius: 2 }}>
                <TableBody>
                  {done.company.metrics.map((m) => (
                    <TableRow key={m.key}>
                      <TableCell sx={{ fontWeight: 700 }}>{m.key}</TableCell>
                      <TableCell>{m.value}</TableCell>
                      <TableCell>as of {m.asOf}</TableCell>
                      <TableCell>src {m.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Alert severity="info" sx={{ mt: 2 }}>
                Educational content — not investment advice. +{done.points} XP
              </Alert>
            </CardContent>
          </Card>
        )
      )}

      {attempts >= MAX_ATTEMPTS && !done && (
        <Alert severity="warning">Out of attempts — come back tomorrow for a new mystery stock.</Alert>
      )}

      <Stack spacing={1} aria-live="polite">
        {log.map((l, i) => (
          <Alert key={i} severity={l.ok ? "success" : "error"} icon={l.ok ? <CheckCircleIcon /> : <CancelIcon />}>
            {l.text}
          </Alert>
        ))}
      </Stack>
    </Stack>
  );
}
