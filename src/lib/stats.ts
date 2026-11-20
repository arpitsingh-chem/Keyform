/**
 * Session metrics. Every value here is derived from answer records so that the
 * dashboard never keeps a second, drifting set of counters.
 */

export interface AttemptLike {
  questionId: string;
  submittedAt: string; // ISO timestamp
  correct: boolean;
  elapsedMs: number;
  exam: string;
  topic: string;
}

export interface SessionStats {
  total: number;
  correct: number;
  incorrect: number;
  /** Percentage with one decimal place, or null when nothing was submitted. */
  accuracy: number | null;
  elapsedMs: number;
  /** Answered items per minute, or null when no time has elapsed. */
  perMinute: number | null;
}

export function summarize(attempts: AttemptLike[]): SessionStats {
  const total = attempts.length;
  const correct = attempts.filter((a) => a.correct).length;
  const elapsedMs = attempts.reduce((sum, a) => sum + a.elapsedMs, 0);
  const minutes = elapsedMs / 60000;
  return {
    total,
    correct,
    incorrect: total - correct,
    accuracy: total === 0 ? null : round1((correct / total) * 100),
    elapsedMs,
    perMinute: minutes > 0 ? round1(total / minutes) : null,
  };
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Formats degrees of accuracy for display: "—" before the first submission. */
export function formatAccuracy(accuracy: number | null): string {
  return accuracy === null ? '—' : `${accuracy.toFixed(1)}%`;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Local calendar day key (YYYY-MM-DD) used for streaks and weekly activity. */
export function dayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Consecutive local calendar days, ending today or yesterday, with a submission. */
export function currentStreak(attempts: AttemptLike[], now = new Date()): number {
  const days = new Set(attempts.map((a) => dayKey(new Date(a.submittedAt))));
  let streak = 0;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dayKey(cursor))) return 0;
  }
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Question volume per day for the last `days` local days (oldest first). */
export function weeklyActivity(
  attempts: AttemptLike[],
  days = 7,
  now = new Date(),
): { label: string; key: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const attempt of attempts) {
    const key = dayKey(new Date(attempt.submittedAt));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const out: { label: string; key: string; count: number }[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    date.setDate(date.getDate() - offset);
    const key = dayKey(date);
    out.push({
      key,
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      count: counts.get(key) ?? 0,
    });
  }
  return out;
}
