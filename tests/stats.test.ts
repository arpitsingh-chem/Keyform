import { describe, expect, it } from 'vitest';
import {
  currentStreak,
  dayKey,
  formatAccuracy,
  formatDuration,
  summarize,
  weeklyActivity,
  type AttemptLike,
} from '../src/lib/stats';

const make = (overrides: Partial<AttemptLike> = {}): AttemptLike => ({
  questionId: 'q1',
  submittedAt: new Date(2026, 10, 20, 10, 0, 0).toISOString(),
  correct: true,
  elapsedMs: 5000,
  exam: 'CDS',
  topic: 'vocabulary',
  ...overrides,
});

describe('summarize', () => {
  it('returns null accuracy before any submission', () => {
    const stats = summarize([]);
    expect(stats.accuracy).toBeNull();
    expect(formatAccuracy(stats.accuracy)).toBe('—');
  });

  it('computes accuracy from submitted answers only', () => {
    const stats = summarize([make(), make({ correct: false }), make({ correct: false })]);
    expect(stats.total).toBe(3);
    expect(stats.correct).toBe(1);
    expect(stats.incorrect).toBe(2);
    expect(stats.accuracy).toBe(33.3);
  });

  it('computes answers per minute from elapsed time', () => {
    const stats = summarize([make({ elapsedMs: 30_000 }), make({ elapsedMs: 30_000 })]);
    expect(stats.perMinute).toBe(2);
  });

  it('does not divide by zero when no time was recorded', () => {
    expect(summarize([make({ elapsedMs: 0 })]).perMinute).toBeNull();
  });
});

describe('formatting', () => {
  it('formats durations as minutes and seconds', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(65_000)).toBe('1:05');
  });
});

describe('streaks and activity', () => {
  const now = new Date(2026, 10, 20, 18, 0, 0);

  it('counts consecutive days ending today', () => {
    const attempts = [
      make({ submittedAt: new Date(2026, 10, 20, 9, 0).toISOString() }),
      make({ submittedAt: new Date(2026, 10, 19, 9, 0).toISOString() }),
      make({ submittedAt: new Date(2026, 10, 18, 9, 0).toISOString() }),
      make({ submittedAt: new Date(2026, 10, 16, 9, 0).toISOString() }),
    ];
    expect(currentStreak(attempts, now)).toBe(3);
  });

  it('still counts a streak that ended yesterday', () => {
    const attempts = [make({ submittedAt: new Date(2026, 10, 19, 9, 0).toISOString() })];
    expect(currentStreak(attempts, now)).toBe(1);
  });

  it('returns zero when the last activity is too old', () => {
    const attempts = [make({ submittedAt: new Date(2026, 10, 10, 9, 0).toISOString() })];
    expect(currentStreak(attempts, now)).toBe(0);
  });

  it('returns seven ordered days with counts', () => {
    const activity = weeklyActivity([make({ submittedAt: new Date(2026, 10, 20, 9).toISOString() })], 7, now);
    expect(activity).toHaveLength(7);
    expect(activity[6].count).toBe(1);
    expect(activity[6].key).toBe(dayKey(now));
  });
});
