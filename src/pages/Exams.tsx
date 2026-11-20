import { Link, useParams } from 'react-router-dom';
import { examTracks, topics } from '../data/content';
import { questionsFor } from '../data/questions';
import { useStudy } from '../lib/store';
import { Note, Pill, Progress, SectionTitle, TrackEmblem } from '../components/ui';
import { IconArrowRight } from '../components/icons';

export default function Exams() {
  const { code } = useParams();
  const { attempts } = useStudy();
  const track = examTracks.find((item) => item.code === code);

  if (code && !track) {
    return (
      <div className="empty">
        <h1>Track not found</h1>
        <p>“{code}” is not one of the three tracks in this workspace.</p>
        <Link className="btn btn-primary" to="/exams">
          See all exam tracks
        </Link>
      </div>
    );
  }

  if (track) {
    const items = questionsFor(track.code);
    const attemptedIds = new Set(
      attempts.filter((attempt) => attempt.exam === track.code).map((a) => a.questionId),
    );
    return (
      <div className="stack-lg">
        <Link className="btn btn-tertiary" to="/exams">
          ← All exam tracks
        </Link>
        <div className="page-head">
          <div className="btn-row" style={{ alignItems: 'flex-start', gap: 'var(--space-4)' }}>
            <TrackEmblem track={track} size={56} />
            <div className="page-head-copy">
              <span className="eyebrow">{track.name}</span>
              <h1>{track.code} English practice</h1>
              <p className="lead">{track.blurb}</p>
            </div>
          </div>
          <Link className="btn btn-primary" to={`/practice/${track.code}/${firstTopicWithItems(track.code)}`}>
            Start {track.code} practice <IconArrowRight size={16} />
          </Link>
        </div>

        <Note tone="warning">
          <strong>Syllabus note.</strong> {track.syllabusNote}
        </Note>

        <section className="card" aria-labelledby="coverage-heading">
          <SectionTitle title="Coverage" hint="Items you have attempted at least once." />
          <Progress
            value={items.filter((question) => attemptedIds.has(question.id)).length}
            max={items.length}
            label={`${track.code} coverage`}
            caption={`${items.filter((q) => attemptedIds.has(q.id)).length} of ${items.length} items attempted`}
          />
        </section>

        <section aria-labelledby="topics-heading">
          <SectionTitle title="Topics" hint="Only drills with released items are offered." />
          <div className="grid-cards">
            {topics.map((topic) => {
              const topicItems = items.filter((question) => question.topic === topic.id);
              const skills = [...new Set(topicItems.map((item) => item.skill))];
              return (
                <article className="card" key={topic.id}>
                  <div className="row-between" style={{ alignItems: 'flex-start' }}>
                    <h3>{topic.name}</h3>
                    <Pill tone={topicItems.length > 0 ? 'info' : 'neutral'}>
                      {topicItems.length > 0 ? `${topicItems.length} items` : 'Not available'}
                    </Pill>
                  </div>
                  <p className="small" style={{ marginTop: 6 }}>
                    {topic.description}
                  </p>
                  {skills.length > 0 ? (
                    <p className="small muted">Skills: {skills.slice(0, 3).join(' · ')}</p>
                  ) : null}
                  {topicItems.length > 0 ? (
                    <Progress
                      value={topicItems.filter((q) => attemptedIds.has(q.id)).length}
                      max={topicItems.length}
                      label={`${topic.name} coverage`}
                      caption="attempted"
                    />
                  ) : (
                    <p className="small muted">No released practice items for {track.code} in this topic.</p>
                  )}
                  {topicItems.length > 0 ? (
                    <p style={{ marginTop: 'var(--space-3)' }}>
                      <Link to={`/practice/${track.code}/${topic.id}`}>
                        Practise {topic.name.toLowerCase()} <IconArrowRight size={14} />
                      </Link>
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <div className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Workspace</span>
          <h1>Exam tracks</h1>
          <p className="lead">
            Each track carries its own practice inventory. Coverage shows how much of the released
            material you have attempted; it is not a prediction of your examination result.
          </p>
        </div>
      </div>

      <div className="stack">
        {examTracks.map((item) => {
          const total = questionsFor(item.code).length;
          const attempted = new Set(
            attempts.filter((attempt) => attempt.exam === item.code).map((a) => a.questionId),
          ).size;
          return (
            <Link className="card card-link" key={item.code} to={`/exams/${item.code}`}>
              <div className="row-between" style={{ alignItems: 'center', gap: 'var(--space-4)' }}>
                <div className="btn-row" style={{ gap: 'var(--space-4)' }}>
                  <TrackEmblem track={item} size={48} />
                  <div className="stack" style={{ gap: 2 }}>
                    <strong style={{ fontSize: 17 }}>{item.code}</strong>
                    <span className="small muted">{item.name}</span>
                    <span className="small muted" style={{ maxWidth: '58ch' }}>
                      {item.blurb}
                    </span>
                  </div>
                </div>
                <div className="stack" style={{ width: 220, gap: 6 }}>
                  <Progress
                    value={attempted}
                    max={total}
                    label={`${item.code} coverage`}
                    caption={`${attempted}/${total} attempted`}
                  />
                  <span className="small" style={{ textAlign: 'right', color: 'var(--primary)' }}>
                    Open track <IconArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function firstTopicWithItems(code: string): string {
  const items = questionsFor(code);
  return items[0]?.topic ?? 'vocabulary';
}
