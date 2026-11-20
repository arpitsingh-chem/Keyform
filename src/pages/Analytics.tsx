import { useMemo, useState } from 'react';
import { examTracks, topics } from '../data/content';
import { questions, questionById } from '../data/questions';
import { useStudy } from '../lib/store';
import {
  currentStreak,
  formatAccuracy,
  formatDuration,
  summarize,
  weeklyActivity,
} from '../lib/stats';
import { EmptyState, Metric, Note, SectionTitle } from '../components/ui';

const WINDOWS = [
  { id: '7', label: 'Last 7 days', days: 7 },
  { id: '30', label: 'Last 30 days', days: 30 },
  { id: 'all', label: 'All time', days: null },
] as const;

export default function Analytics() {
  const { attempts, ready } = useStudy();
  const [windowId, setWindowId] = useState<'7' | '30' | 'all'>('7');

  const filtered = useMemo(() => {
    if (windowId === 'all') return attempts;
    const days = windowId === '7' ? 7 : 30;
    const cutoff = Date.now() - days * 86_400_000;
    return attempts.filter((attempt) => new Date(attempt.submittedAt).getTime() >= cutoff);
  }, [attempts, windowId]);

  const stats = summarize(filtered);
  const activity = weeklyActivity(filtered, 7);
  const maxActivity = Math.max(1, ...activity.map((day) => day.count));
  const streak = currentStreak(attempts);

  const byTopic = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    for (const attempt of filtered) {
      const entry = map.get(attempt.topic) ?? { total: 0, correct: 0 };
      entry.total += 1;
      entry.correct += attempt.correct ? 1 : 0;
      map.set(attempt.topic, entry);
    }
    return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [filtered]);

  const byExam = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    for (const attempt of filtered) {
      const entry = map.get(attempt.exam) ?? { total: 0, correct: 0 };
      entry.total += 1;
      entry.correct += attempt.correct ? 1 : 0;
      map.set(attempt.exam, entry);
    }
    return [...map.entries()];
  }, [filtered]);

  const hardest = useMemo(() => {
    const map = new Map<string, { total: number; correct: number }>();
    for (const attempt of filtered) {
      const entry = map.get(attempt.questionId) ?? { total: 0, correct: 0 };
      entry.total += 1;
      entry.correct += attempt.correct ? 1 : 0;
      map.set(attempt.questionId, entry);
    }
    return [...map.entries()]
      .filter(([, value]) => value.total >= 1 && value.correct < value.total)
      .sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total)
      .slice(0, 5);
  }, [filtered]);

  return (
    <div className="stack-lg">
      <div className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Insights</span>
          <h1>Analytics</h1>
          <p className="lead">
            Reported window: <strong>{WINDOWS.find((entry) => entry.id === windowId)?.label}</strong>.
            Everything here is computed from attempts stored on this device.
          </p>
        </div>
        <div className="field" style={{ minWidth: 200 }}>
          <label htmlFor="window-select">Reporting window</label>
          <select
            id="window-select"
            value={windowId}
            onChange={(event) => setWindowId(event.target.value as '7' | '30' | 'all')}
          >
            {WINDOWS.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Note>
        <strong>Reading these numbers.</strong> Accuracy is correct ÷ submitted answers in the
        window. Time is the sum of per-question time recorded in practice. Streak is calculated from
        local calendar days, so a session just after midnight counts for the new day.
      </Note>

      <section aria-labelledby="window-metrics">
        <h2 id="window-metrics" className="visually-hidden">
          Metrics for the selected window
        </h2>
        <div className="grid-metrics">
          <Metric label="Attempts" value={ready ? String(stats.total) : '—'} note="Answered items" />
          <Metric
            label="Accuracy"
            value={ready ? formatAccuracy(stats.accuracy) : '—'}
            note={`${stats.correct} correct, ${stats.incorrect} incorrect`}
          />
          <Metric
            label="Time on task"
            value={ready ? formatDuration(stats.elapsedMs) : '—'}
            note={
              stats.perMinute === null ? 'No timing yet' : `${stats.perMinute} answers/minute`
            }
          />
          <Metric
            label="Streak"
            value={ready ? String(streak) : '—'}
            note="Consecutive local days, all time"
          />
        </div>
      </section>

      <div className="grid-two">
        <section className="card" aria-labelledby="volume-heading">
          <SectionTitle title="Weekly volume" hint="Questions answered per day; volume, not accuracy." />
          {filtered.length === 0 ? (
            <EmptyState title="No activity in this window">
              Choose a wider window or complete a practice session.
            </EmptyState>
          ) : (
            <div className="spark" role="img" aria-label={activityLabel(activity)}>
              {activity.map((day) => (
                <div className="spark-col" key={day.key}>
                  <span className="spark-value">{day.count > 0 ? day.count : ''}</span>
                  <div
                    className="spark-bar"
                    data-active={day.count > 0}
                    style={{ height: `${Math.max(4, (day.count / maxActivity) * 100)}%` }}
                  />
                  <span className="spark-label">{day.label.slice(0, 2)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card" aria-labelledby="exam-heading">
          <SectionTitle title="By exam track" hint="Attempts and accuracy." />
          {byExam.length === 0 ? (
            <p className="small muted">No attempts in this window.</p>
          ) : (
            <div className="stack">
              {examTracks.map((track) => {
                const entry = byExam.find(([code]) => code === track.code);
                if (!entry) return null;
                const accuracy = (entry[1].correct / entry[1].total) * 100;
                return (
                  <div className="bar-row" key={track.code}>
                    <span>{track.code}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${accuracy}%` }} />
                    </div>
                    <span className="mono">{accuracy.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <section className="card" aria-labelledby="topic-heading">
        <SectionTitle title="By topic" hint="Numeric value beside every bar." />
        {byTopic.length === 0 ? (
          <p className="small muted">No attempts in this window.</p>
        ) : (
          <div className="stack">
            {byTopic.map(([topicId, value]) => {
              const name = topics.find((topic) => topic.id === topicId)?.name ?? topicId;
              const accuracy = (value.correct / value.total) * 100;
              return (
                <div className="bar-row" key={topicId}>
                  <span>
                    {name} <span className="muted small">({value.total})</span>
                  </span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${accuracy}%` }} />
                  </div>
                  <span className="mono">{accuracy.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="card" aria-labelledby="hardest-heading">
        <SectionTitle title="Items to revisit" hint="Lowest accuracy in this window, at least one miss." />
        {hardest.length === 0 ? (
          <p className="small muted">
            No missed items in this window. Nothing is listed rather than showing a rearranged list
            of correct answers.
          </p>
        ) : (
          <ul className="record-list">
            {hardest.map(([questionId, value]) => {
              const question = questionById(questionId);
              return (
                <li className="record" key={questionId}>
                  <div className="record-main" style={{ gap: 2 }}>
                    <span className="record-title">{question?.skill ?? questionId}</span>
                    <span className="small muted">
                      {question?.prompt ?? 'Item no longer in the bank'}
                    </span>
                  </div>
                  <span className="small mono">
                    {value.correct}/{value.total} correct
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="small muted">
        Bank size: {questions.length} items. Coverage is not the same as mastery — an item answered
        once correctly is counted as attempted, not secure.
      </p>
    </div>
  );
}

function activityLabel(activity: { label: string; count: number }[]): string {
  return `Daily question volume: ${activity.map((day) => `${day.label} ${day.count}`).join(', ')}.`;
}
