import { Link } from 'react-router-dom';
import { examTracks, topics } from '../data/content';
import { questions, questionsFor } from '../data/questions';
import { Note, TrackEmblem } from '../components/ui';
import { IconArrowRight, IconKeyboard } from '../components/icons';

const loop = [
  {
    title: 'Read',
    body: 'A paper-style prompt with four lettered options. The options are reference material, not buttons.',
  },
  {
    title: 'Recall',
    body: 'Retrieve the answer from memory before you look at the letters — that is the step that builds recall.',
  },
  {
    title: 'Type',
    body: 'Type the answer, then press Enter. Spelling and punctuation are checked exactly; case and stray spaces are not.',
  },
  {
    title: 'Explain',
    body: 'Every attempt returns one reason and links the mistake to revision, so an error becomes a note rather than a lost mark.',
  },
];

export default function Introduction() {
  return (
    <div className="stack-lg">
      <section className="hero">
        <div className="stack">
          <span className="eyebrow">Independent study workspace</span>
          <h1>Practise English by typing the answer, not by clicking a letter.</h1>
          <p className="lead" style={{ fontSize: 16, lineHeight: '25px' }}>
            Keyform is a calm practice workspace for CDS, NDA and AFCAT English. You recall the
            answer, type it, and read the reason. Progress is stored on your device, and practice
            works without an account.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" to="/practice">
              <IconKeyboard size={18} /> Start a session
            </Link>
            <Link className="btn btn-secondary" to="/workspace">
              Open the workspace <IconArrowRight size={16} />
            </Link>
          </div>
          <Note>
            <strong>Demonstration content.</strong> All {questions.length} practice items here are
            written for this project. None is an official question, and none is labelled as a
            previous-year paper. Exam names are used only to organise practice.
          </Note>
        </div>

        <div className="panel" aria-label="Illustration of the typing workspace">
          <div className="stack">
            <span className="eyebrow">The practice loop</span>
            <p className="question-text" style={{ fontSize: 20, lineHeight: '28px' }}>
              Choose the word closest in meaning to “abate”.
            </p>
            <ul className="options" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <li className="option">
                <span className="option-letter">A</span> increase
              </li>
              <li className="option">
                <span className="option-letter">B</span> lessen
              </li>
              <li className="option">
                <span className="option-letter">C</span> delay
              </li>
              <li className="option">
                <span className="option-letter">D</span> assist
              </li>
            </ul>
            <div className="field">
              <span className="field-label">Type the correct answer</span>
              <div className="input input-answer" aria-hidden="true">
                lessen
                <span style={{ color: 'var(--muted)' }}>|</span>
              </div>
              <span className="field-hint">
                Case and extra spaces are ignored. Press Enter to submit.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="loop-heading">
        <div className="section-title">
          <h2 id="loop-heading">How the typing loop works</h2>
          <span className="small muted">One clear next action on every screen</span>
        </div>
        <div className="grid-cards">
          {loop.map((step, index) => (
            <article className="card" key={step.title}>
              <span className="eyebrow">Step {index + 1}</span>
              <h3 style={{ marginBottom: 6 }}>{step.title}</h3>
              <p className="small">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="exam-heading">
        <div className="section-title">
          <h2 id="exam-heading">Choose an exam track</h2>
          <span className="small muted">The track follows you into topics and practice</span>
        </div>
        <div className="grid-cards">
          {examTracks.map((track) => {
            const count = questionsFor(track.code).length;
            return (
              <Link className="card card-link" key={track.code} to={`/exams/${track.code}`}>
                <div className="row-between" style={{ alignItems: 'flex-start' }}>
                  <TrackEmblem track={track} />
                  <span className="pill">{count} items</span>
                </div>
                <h3 style={{ margin: 'var(--space-3) 0 4px' }}>{track.code}</h3>
                <p className="small" style={{ marginBottom: 6 }}>
                  {track.name}
                </p>
                <p className="small muted">{track.blurb}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="learn-heading">
        <div className="section-title">
          <h2 id="learn-heading">Learning categories</h2>
          <span className="small muted">Practice groupings, not an official topic list</span>
        </div>
        <div className="grid-cards">
          {topics.map((topic) => {
            const count = questions.filter((question) => question.topic === topic.id).length;
            return (
              <article className="card" key={topic.id}>
                <h3>{topic.name}</h3>
                <p className="small" style={{ marginTop: 6 }}>
                  {topic.description}
                </p>
                <p className="small muted">
                  {count === 0 ? 'No released items yet' : `${count} released items`}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="stack" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-5)' }}>
        <p className="small muted">
          Keyform is an independent demonstration workspace. It is not affiliated with UPSC, the
          Indian Air Force or any examination body, and it does not present practice scores as
          official results. Exam information should always be verified against the current official
          notice.
        </p>
        <p className="small muted">
          Questions in this release: original practice material reviewed for internal consistency.
          Sources for syllabus statements and paper availability are listed under{' '}
          <Link to="/previous-years">Previous years</Link>.
        </p>
      </footer>
    </div>
  );
}
