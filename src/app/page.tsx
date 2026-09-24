import NextLink from "next/link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ScheduleIcon from "@mui/icons-material/Schedule";
import StarIcon from "@mui/icons-material/Star";
import LockClockIcon from "@mui/icons-material/LockClock";
import { GAMES, FUTURE_GAMES } from "@/lib/games/registry";
import { getDailyQuests } from "@/data/puzzles";
import { todayYMD } from "@/lib/streak";
import StatsBar from "@/components/StatsBar";

const GAME_ICON: Record<string, string> = {
  GUESS_STOCK: "📈",
  WORD_SEARCH: "🔎",
  CROSSWORD: "🧩",
};

const DIFFICULTY_COLOR = {
  EASY: "success",
  MEDIUM: "warning",
  HARD: "error",
} as const;

export default function Home() {
  const date = todayYMD();
  const quests = getDailyQuests(date);

  return (
    <Stack spacing={3}>
      <StatsBar />

      <Card
        sx={{
          background: "linear-gradient(135deg, #0F5132 0%, #1B7A43 55%, #0E7490 100%)",
          color: "white",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: "0.2em" }}>
            FinQuest
          </Typography>
          <Typography variant="h4" component="h1" sx={{ mt: 1 }}>
            Play your way through finance.
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, opacity: 0.9, maxWidth: 560 }}>
            Play · Discover · Think · Learn. Daily puzzles on Indian markets —
            Wordle-style fun, zero brokerage.
          </Typography>
        </CardContent>
        <CardActions sx={{ px: 4, pb: 4, gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<PlayArrowIcon />}
            component={NextLink}
            href="/guess-the-stock"
          >
            Play Today&apos;s Quest
          </Button>
          <Button variant="outlined" size="large" href="#games" sx={{ color: "white", borderColor: "rgba(255,255,255,0.6)" }}>
            Explore Games
          </Button>
        </CardActions>
      </Card>

      <Box>
        <Typography variant="h5" component="h2">
          Today&apos;s challenges
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {date} · same puzzle for everyone
        </Typography>
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          }}
        >
          {quests.map((q) => {
            const meta = Object.values(GAMES).find((g) => g.type === q.gameType)!;
            return (
              <Card key={q.puzzleId} sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: "primary.main", width: 44, height: 44 }}>
                      {GAME_ICON[q.gameType]}
                    </Avatar>
                    <Typography variant="h6" component="h3">
                      {q.title}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
                    <Chip label={q.difficulty} color={DIFFICULTY_COLOR[q.difficulty]} size="small" />
                    <Chip icon={<ScheduleIcon />} label={`~${q.estMinutes} min`} size="small" variant="outlined" />
                    <Chip icon={<StarIcon />} label={`+${q.xpReward} XP`} size="small" variant="outlined" />
                  </Stack>
                </CardContent>
                <CardActions>
                  <Button size="small" endIcon={<PlayArrowIcon />} component={NextLink} href={`/${meta.slug}`}>
                    Play
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      </Box>

      <Box id="games">
        <Typography variant="h5" component="h2">
          Game categories
        </Typography>
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          }}
        >
          {Object.values(GAMES).map((g) => (
            <Card key={g.slug} component={NextLink} href={`/${g.slug}`} sx={{ textDecoration: "none" }}>
              <CardContent>
                <Avatar sx={{ bgcolor: "tertiary.main" }}>{g.icon}</Avatar>
                <Typography variant="h6" component="h3" sx={{ mt: 1.5 }}>
                  {g.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {g.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
          {FUTURE_GAMES.map((g) => (
            <Card key={g.slug} sx={{ bgcolor: "action.hover" }} aria-disabled>
              <CardContent>
                <Avatar sx={{ bgcolor: "action.disabled" }}>{g.icon}</Avatar>
                <Typography variant="h6" component="h3" sx={{ mt: 1.5 }}>
                  {g.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {g.description}
                </Typography>
                <Chip icon={<LockClockIcon />} label="Coming Soon" size="small" sx={{ mt: 1.5 }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Stack>
  );
}
