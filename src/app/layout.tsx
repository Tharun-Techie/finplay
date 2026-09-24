import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ThemeRegistry from "@/components/ThemeRegistry";
import NavShell from "@/components/NavShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinQuest — Play your way through finance",
  description:
    "Gamified finance learning: Guess the Stock, Word Search, Crossword. Daily quests, XP, streaks. Educational content, not investment advice.",
  openGraph: {
    title: "FinQuest",
    description: "Play your way through finance.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NavShell>
            <Container maxWidth="lg" sx={{ pt: 3 }}>
              {children}
              <Box sx={{ py: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Educational gaming content — not investment advice. Market data shown with
                  as-of dates &amp; sources.
                </Typography>
              </Box>
            </Container>
          </NavShell>
        </ThemeRegistry>
      </body>
    </html>
  );
}
