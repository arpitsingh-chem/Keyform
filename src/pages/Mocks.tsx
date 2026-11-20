import { Link } from 'react-router-dom';
import { examTracks } from '../data/content';
import { questionsFor } from '../data/questions';
import { Note, Pill, SectionTitle, TrackEmblem } from '../components/ui';
import { IconArrowRight } from '../components/icons';

export const MOCK_LENGTH = 10;
export const MOCK_MINUTES = 8;

export default function Mocks() {
  return (
    <div className="stack-lg">
      <div className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Mock tests</span>
          <h1>Timed runs with deferred scoring</h1>
          <p className="lead">
            A mock keeps explanations back until you submit, so a timed run measures retrieval
            rather than reading. You can move between questions and mark any of them for review.
          </p>
        </div>
      </div>

      <Note tone="warning">
        <strong>This is a practice format, not an official paper.</strong> Length, timing and
        marking here are {MOCK_LENGTH} questions in {MOCK_MINUTES} minutes with no negative marking.
        Those values are the workspace’s own settings and are not presented as the examination’s
        scheme. Official patterns must be confirmed against the current notice before a test is
        described as exam-format.
      </Note>

      <section aria-labelledby="mock-list-heading">
        <SectionTitle title="Available mock runs" hint="Built only from released practice items." />
        <div className="grid-cards">
          {examTracks.map((track) => {
            const count = questionsFor(track.code).length;
            const available = count >= MOCK_LENGTH;
            return (
              <article className="card" key={track.code}>
                <div className="row-between" style={{ alignItems: 'flex-start' }}>
                  <TrackEmblem track={track} />
                  <Pill tone={available ? 'info' : 'neutral'}>
                    {available ? `${MOCK_LENGTH} questions` : `${count} items`}
                  </Pill>
                </div>
                <h3 style={{ margin: 'var(--space-3) 0 4px' }}>{track.code} mock run</h3>
                <p className="small muted">
                  {MOCK_MINUTES} minutes · answers are typed · solutions after submission
                </p>
                <p style={{ marginTop: 'var(--space-3)' }}>
                  {available ? (
                    <Link className="btn btn-secondary" to={`/mocks/${track.code}`}>
                      Start {track.code} run <IconArrowRight size={15} />
                    </Link>
                  ) : (
                    <span className="small muted">
                      Needs at least {MOCK_LENGTH} released items. More content must be written and
                      reviewed first.
                    </span>
                  )}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card" aria-labelledby="mock-rules-heading">
        <SectionTitle title="How a run behaves" />
        <ul className="stack small" style={{ paddingLeft: '1.1rem' }}>
          <li>No explanation, correct-answer marking or score appears while the timer runs.</li>
          <li>
            A question you leave blank is reported as <strong>omitted</strong>, which is separate
            from an incorrect answer.
          </li>
          <li>Submitting asks for confirmation and lists how many questions are still blank.</li>
          <li>
            The result screen shows raw correct, incorrect and omitted counts. No negative marking
            is applied in this release.
          </li>
        </ul>
      </section>
    </div>
  );
}
