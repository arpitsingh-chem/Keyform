import { Link } from 'react-router-dom';
import { examTracks, topics } from '../data/content';
import { questions, questionsFor, questionById } from '../data/questions';
import { useStudy } from '../lib/store';
import {
  currentStreak,
  dayKey,
  formatAccuracy,
  summarize,
  weeklyActivity,
} from '../lib/stats';
import { Metric, Note, Pill, Progress, SectionTitle, TrackEmblem } from '../components/ui';
import { IconArrowRight, IconKeyboard } from '../components/icons';

export default function Dashboard() {
  const { attempts, settings, storageMode, ready } = useStudy();

  const stats = summarize(attempts);
  const today = new Date();
  const todayCount = attempts.filter(
    (attempt) => dayKey(new Date(attempt.submittedAt)) === dayKey(today),
  ).length;
  const streak = currentStreak(attempts);
  const activity = weeklyActivity(attempts);
  const maxActivity = Math.max(1, ...activity.map((day) => day.count));

  const sessions = new Map<string, { count: number; correct: number; at: string; exam: string }>();
  for (const attempt of attempts) {
    const entry = sessions.get(attempt.sessionId) ?? {
      count: 0,
      correct: 0,
      at: attempt.submittedAt,
      exam: attempt.exam,
    };
    entry.count += 1;
    entry.correct += attempt.correct ? 1 : 0;
    entry.at = attempt.submittedAt > entry.at ? attempt.submittedAt : entry.at;
    sessions.set(attempt.sessionId, entry);
  }
  const recentSessions = [...sessions.values()]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 4);

  const mistakes = attempts.filter((attempt) => !attempt.correct);
  const weakTopic = (() => {
    const byTopic = new Map<string, { total: number; correct: number }>();
    for (const attempt of mistakes) {
      const entry = byTopic.get(attempt.topic) ?? { total: 0, correct: 0 };
      entry.total += 1;
      byTopic.set(attempt.topic, entry);
    }
    return [...byTopic.entries()].sort((a, b) => b[1].total - a[1].total)[0]?.[0];
  })();

  const greeting = (() => {
    const hour = today.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="stack-lg">
      <div className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">
            {today.toLocaleDateString(undefined, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <h1>{greeting}. Ready for a short session?</h1>
          <p className="lead">
            Your progress is saved on this device. Nothing here is sent to a server, and no account
            is required.
          </p>
        </div>
        <div className="btn-row">
          <Link className="btn btn-primary" to="/practice">
            <IconKeyboard size={18} /> Start practice
          </Link>
        </div>
      </div>

      <Note>
        <strong>Prototype status.</strong> Practice items are original material written for this
        workspace. No question is labelled a previous-year paper, and no score is an official
        result. Storage: {storageModeLabel(storageMode)}.
      </Note>

      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="visually-hidden">
          Headline metrics
        </h2>
        <div className="grid-metrics">
          <Metric
            label="Answered"
            value={ready ? String(stats.total) : '—'}
            note="Submitted answers, all time"
          />
          <Metric
            label="Accuracy"
            value={ready ? formatAccuracy(stats.accuracy) : '—'}
            note="Correct ÷ submitted"
          />
          <Metric
            label="Day streak"
            value={ready ? String(streak) : '—'}
            note={streak === 1 ? 'Consecutive local day' : 'Consecutive local days'}
          />
          <Metric
            label="Today"
            value={ready ? `${todayCount}` : '—'}
            note={`Daily goal: ${settings.dailyGoal} answers`}
          />
        </div>
      </section>

      <div className="grid-two">
        <section className="card" aria-labelledby="tracks-heading">
          <SectionTitle
            title="Exam tracks"
            hint="Coverage is how much of each track you have attempted, not a predicted rank."
            action={
              <Link className="btn btn-tertiary" to="/exams">
                All tracks
              </Link>
            }
          />
          <div className="stack-lg">
            {examTracks.map((track) => {
              const total = questionsFor(track.code).length;
              const attempted = new Set(
                attempts.filter((attempt) => attempt.exam === track.code).map((a) => a.questionId),
              ).size;
              return (
                <div className="stack" key={track.code}>
                  <div className="row-between">
                    <div className="btn-row" style={{ gap: 'var(--space-3)' }}>
                      <TrackEmblem track={track} size={38} />
                      <div className="stack" style={{ gap: 0 }}>
                        <strong>{track.code}</strong>
                        <span className="small muted">{track.name}</span>
                      </div>
                    </div>
                    <Link className="btn btn-tertiary" to={`/exams/${track.code}`}>
                      Open <IconArrowRight size={15} />
                    </Link>
                  </div>
                  <Progress
                    value={attempted}
                    max={total}
                    label={`${track.code} coverage`}
                    caption={`${attempted} of ${total} items assessed`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="card" aria-labelledby="activity-heading">
          <SectionTitle title="This week" hint="Question volume, not accuracy." />
          <div className="spark" role="img" aria-label={describeActivity(activity)}>
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
          <div className="stack" style={{ marginTop: 'var(--space-4)' }}>
            <Progress
              value={Math.min(todayCount, settings.dailyGoal)}
              max={settings.dailyGoal}
              label="Daily goal"
              caption={`${todayCount} of ${settings.dailyGoal} answers today`}
            />
            {weakTopic ? (
              <p className="small muted">
                Most recent misses cluster in{' '}
                <strong>{topics.find((topic) => topic.id === weakTopic)?.name ?? weakTopic}</strong>.{' '}
                <Link to="/revision">Review them</Link>.
              </p>
            ) : (
              <p className="small muted">
                Mistakes you make will collect here for revision. Nothing has been missed yet.
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="card" aria-labelledby="recent-heading">
        <SectionTitle
          title="Recent sessions"
          hint="A session is one run of questions; accuracy counts submitted answers only."
        />
        {recentSessions.length === 0 ? (
          <p className="small muted">
            No sessions yet. <Link to="/practice">Start a short session</Link> and it will appear
            here.
          </p>
        ) : (
          <ul className="record-list">
            {recentSessions.map((session, index) => (
              <li className="record" key={`${session.at}-${index}`}>
                <div className="record-main">
                  <span className="record-title">{session.exam} practice session</span>
                  <span className="small muted">
                    {new Date(session.at).toLocaleString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    · {session.count} {session.count === 1 ? 'answer' : 'answers'}
                  </span>
                </div>
                <Pill tone={session.correct / session.count >= 0.7 ? 'success' : 'warning'}>
                  {session.correct}/{session.count} correct
                </Pill>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card" aria-labelledby="content-heading">
        <SectionTitle title="Content in this release" hint="Every item states its provenance." />
        <ul className="record-list">
          <li className="record">
            <div className="record-main">
              <span className="record-title">{questions.length} original practice items</span>
              <span className="small muted">
                Written for Keyform across {topics.filter((t) => questions.some((q) => q.topic === t.id)).length}{' '}
                topics. Verified one by one for internal consistency, not against an official key.
              </span>
            </div>
            <Pill tone="info">Original practice</Pill>
          </li>
          <li className="record">
            <div className="record-main">
              <span className="record-title">0 previous-year transcriptions</span>
              <span className="small muted">
                Official paper pages are linked, not copied. See{' '}
                <Link to="/previous-years">Previous years</Link> for the source list.
              </span>
            </div>
            <Pill>Not yet added</Pill>
          </li>
        </ul>
      </section>
    </div>
  );
}

function describeActivity(activity: { label: string; count: number }[]): string {
  return `Questions answered per day for the last week: ${activity
    .map((day) => `${day.label} ${day.count}`)
    .join(', ')}.`;
}

function storageModeLabel(mode: string): string {
  if (mode === 'indexeddb') return 'device database available';
  if (mode === 'localstorage') return 'limited device storage';
  return 'this session only (storage unavailable)';
}

/** Kept for future "continue where you left off" affordance. */
export function lastQuestionTitle(questionId: string | undefined): string | undefined {
  if (!questionId) return undefined;
  return questionById(questionId)?.skill;
}
