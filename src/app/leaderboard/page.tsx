"use client";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";

const PERIODS = ["Daily", "Weekly", "Monthly", "All-time"] as const;

const RANK_COLORS = ["#B7791F", "#757575", "#8D6E63"];

export default function LeaderboardPage() {
  const [tab, setTab] = useState(0);
  // TODO: fetch from /api/leaderboard/{period}; stub rows until aggregation lands.
  const entries = [
    { rank: 1, name: "MarketWizard", xp: 1450 },
    { rank: 2, name: "DalalDebut", xp: 1200 },
    { rank: 3, name: "You", xp: 800 },
    { rank: 4, name: "BearBull", xp: 640 },
    { rank: 5, name: "RookieRupee", xp: 410 },
  ];

  return (
    <>
      <Typography variant="h4" component="h1">
        Leaderboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Global · Country · Friends. Hide your profile anytime in settings.
      </Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="Leaderboard periods">
        {PERIODS.map((p) => (
          <Tab key={p} label={p} />
        ))}
      </Tabs>
      <Card sx={{ mt: 2 }}>
        <List>
          {entries.map((e) => (
            <ListItem key={e.rank} divider secondaryAction={<Chip icon={<StarIcon />} label={`${e.xp} XP`} size="small" variant="outlined" />}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: RANK_COLORS[e.rank - 1] ?? "primary.main" }}>
                  {e.rank <= 3 ? <EmojiEventsIcon /> : e.rank}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={e.name}
                secondary={e.name === "You" ? "That's you" : `Rank #${e.rank} · ${PERIODS[tab]}`}
              />
            </ListItem>
          ))}
        </List>
      </Card>
    </>
  );
}
