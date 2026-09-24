"use client";
import { usePathname, useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import HomeIcon from "@mui/icons-material/Home";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GridOnIcon from "@mui/icons-material/GridOn";
import AppsIcon from "@mui/icons-material/Apps";
import SavingsIcon from "@mui/icons-material/Savings";

const TABS = [
  { label: "Quest", href: "/", icon: <HomeIcon /> },
  { label: "Stocks", href: "/guess-the-stock", icon: <TrendingUpIcon /> },
  { label: "Words", href: "/finance-word-search", icon: <GridOnIcon /> },
  { label: "Cross", href: "/finance-crossword", icon: <AppsIcon /> },
  { label: "Ranks", href: "/leaderboard", icon: <LeaderboardIcon /> },
];

export default function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const active = Math.max(
    0,
    TABS.findIndex((t) => (t.href === "/" ? pathname === "/" : pathname.startsWith(t.href))),
  );

  return (
    <Box sx={{ pb: 10 }}>
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar>
          <SavingsIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component="button"
            onClick={() => router.push("/")}
            sx={{
              flexGrow: 1,
              textAlign: "left",
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              fontWeight: 800,
              letterSpacing: "0.06em",
            }}
          >
            FINQUEST
          </Typography>
          <IconButton color="inherit" aria-label="Leaderboard" onClick={() => router.push("/leaderboard")}>
            <LeaderboardIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {children}

      <Paper
        elevation={3}
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1100 }}
      >
        <BottomNavigation
          showLabels
          value={active}
          onChange={(_, v) => router.push(TABS[v].href)}
          aria-label="Primary game navigation"
        >
          {TABS.map((t) => (
            <BottomNavigationAction key={t.href} label={t.label} icon={t.icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
