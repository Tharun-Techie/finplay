"use client";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import StarIcon from "@mui/icons-material/Star";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import Skeleton from "@mui/material/Skeleton";

interface Stats {
  xp: number;
  name: string;
  level: number;
  streak: number;
}

const NEXT_LEVEL_XP: Record<number, number> = { 1: 500, 2: 1500, 3: 3000, 4: 6000, 5: 10000, 6: 10000 };

export default function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/me/stats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  if (!stats) return <Skeleton variant="rounded" height={84} sx={{ borderRadius: 5 }} />;

  const target = NEXT_LEVEL_XP[stats.level] ?? stats.xp + 1;
  const base = stats.level === 1 ? 0 : (NEXT_LEVEL_XP[stats.level - 1] ?? 0);
  const pct = Math.min(100, Math.max(0, ((stats.xp - base) / Math.max(1, target - base)) * 100));

  return (
    <Card sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
      <CardContent>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Chip icon={<StarIcon />} label={`Lv ${stats.level} · ${stats.name}`} color="secondary" size="small" />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {stats.xp} XP
          </Typography>
          <Chip
            icon={<LocalFireDepartmentIcon />}
            label={`${stats.streak}-day streak`}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "inherit" }}
          />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{ mt: 1.5, borderRadius: 2, height: 8, bgcolor: "rgba(255,255,255,0.25)" }}
          aria-label={`Progress to next level: ${Math.round(pct)} percent`}
        />
      </CardContent>
    </Card>
  );
}
