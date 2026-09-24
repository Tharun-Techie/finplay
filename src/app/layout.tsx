import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinQuest — Play your way through finance",
  description: "Gamified finance learning: Guess the Stock, Word Search, Crossword. Daily quests, XP, streaks. Educational content, not investment advice.",
  openGraph: {
    title: "FinQuest",
    description: "Play your way through finance.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3" aria-label="Main">
            <a href="/" className="text-xl font-extrabold tracking-tight">FINQUEST</a>
            <div className="flex gap-4 text-sm font-medium">
              <a href="/guess-the-stock" className="hover:underline">Guess the Stock</a>
              <a href="/finance-word-search" className="hover:underline">Word Search</a>
              <a href="/finance-crossword" className="hover:underline">Crossword</a>
              <a href="/leaderboard" className="hover:underline">Leaderboard</a>
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
        <footer className="border-t bg-white px-4 py-4 text-xs text-zinc-500">
          <p className="mx-auto max-w-5xl">Educational gaming content — not investment advice. Market data shown with as-of dates &amp; sources.</p>
        </footer>
      </body>
    </html>
  );
}
