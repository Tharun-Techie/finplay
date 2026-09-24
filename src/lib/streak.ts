// Server-side streak calculation (§11). Never trust client dates.
export function updateStreak(lastActiveYMD: string | null, todayYMD: string, current: number) {
  if (!lastActiveYMD) return { current: 1, longest: Math.max(1, current) };
  if (lastActiveYMD === todayYMD) return null; // already counted today
  const last = new Date(lastActiveYMD + "T00:00:00Z");
  const today = new Date(todayYMD + "T00:00:00Z");
  const diffDays = Math.round((today.getTime() - last.getTime()) / 86400000);
  if (diffDays === 1) return { current: current + 1 };
  return { current: 1 }; // missed a day -> reset
}

export function todayYMD(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
