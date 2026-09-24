export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold">Admin — Content pipeline</h1>
      <p className="text-sm text-zinc-600">Create → validate → fact-check → review → publish. AI drafts never go public without review. Use <code>x-admin-token</code> header for <code>/api/admin/*</code>.</p>
      <div className="mt-4 rounded-xl border bg-white p-4 text-sm">
        <p>Prisma models ready: Puzzle, GuessStockPuzzle, WordSearchPuzzle, CrosswordPuzzle, Company, CompanyMetric, Category, ContentSource.</p>
        <p className="mt-2">Run: <code>docker compose up -d && npx prisma db push && npx prisma studio</code></p>
      </div>
    </div>
  );
}
