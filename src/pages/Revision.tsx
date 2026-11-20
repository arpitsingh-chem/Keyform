import { Link } from 'react-router-dom';
import { questions, questionById } from '../data/questions';
import { topics } from '../data/content';
import { useStudy } from '../lib/store';
import { EmptyState, Note, Pill, SectionTitle } from '../components/ui';
import { IconArrowRight } from '../components/icons';

export default function Revision() {
  const { attempts, bookmarks, ready } = useStudy();

  const mistakeIds = [...new Set(attempts.filter((a) => !a.correct).map((a) => a.questionId))];
  const mistakeQuestions = mistakeIds
    .map((id) => questionById(id))
    .filter((question): question is NonNullable<typeof question> => Boolean(question));
  const attemptsById = new Map<string, number>();
  for (const attempt of attempts) {
    attemptsById.set(attempt.questionId, (attemptsById.get(attempt.questionId) ?? 0) + 1);
  }

  const savedQuestions = bookmarks
    .map((id) => questionById(id))
    .filter((question): question is NonNullable<typeof question> => Boolean(question));

  return (
    <div className="stack-lg">
      <div className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Learning</span>
          <h1>Revision</h1>
          <p className="lead">
            Mistakes, saved items and recent attempts are kept separate, because they answer
            different questions: what went wrong, what you chose to keep, and what you actually did.
          </p>
        </div>
      </div>

      <Note>
        <strong>Suggested order.</strong> Retry a mistake after a day. If it comes back correct,
        leave it out of the next revision round; if not, revisit the explanation before trying again.
        This workspace does not schedule reminders for you.
      </Note>

      <section aria-labelledby="mistakes-heading">
        <SectionTitle
          title="Mistakes"
          hint={`${ready ? mistakeQuestions.length : 0} distinct items answered incorrectly`}
        />
        {!ready ? (
          <p className="small muted">Loading local history…</p>
        ) : mistakeQuestions.length === 0 ? (
          <EmptyState
            title="No mistakes recorded"
            action={
              <Link className="btn btn-primary" to="/practice">
                Start a practice session
              </Link>
            }
          >
            Items you answer incorrectly collect here automatically. Nothing has been added yet, so
            there is nothing to retry.
          </EmptyState>
        ) : (
          <ul className="record-list">
            {mistakeQuestions.slice(0, 12).map((question) => (
              <li className="record" key={question.id}>
                <div className="record-main" style={{ gap: 4 }}>
                  <span className="small muted">
                    {topics.find((topic) => topic.id === question.topic)?.name ?? question.topic} ·{' '}
                    {question.skill}
                  </span>
                  <span className="record-title">{question.prompt}</span>
                  <span className="small muted">
                    Expected: <strong>{question.options[question.correctIndex]}</strong> · seen{' '}
                    {attemptsById.get(question.id) ?? 1}×
                  </span>
                  <span className="small muted">{question.explanation}</span>
                </div>
                <Link
                  className="btn btn-secondary"
                  to={`/practice/${question.exams[0]}/${question.topic}`}
                >
                  Retry topic
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="saved-heading">
        <SectionTitle title="Saved items" hint={`${ready ? savedQuestions.length : 0} saved`} />
        {!ready ? (
          <p className="small muted">Loading saved items…</p>
        ) : savedQuestions.length === 0 ? (
          <EmptyState title="Nothing saved yet">
            Use “Save for revision” during practice, or “Save linked question” on the vocabulary
            page. Saved items stay on this device.
          </EmptyState>
        ) : (
          <ul className="record-list">
            {savedQuestions.map((question) => (
              <li className="record" key={question.id}>
                <div className="record-main" style={{ gap: 4 }}>
                  <span className="small muted">{question.skill}</span>
                  <span className="record-title">{question.prompt}</span>
                  <span className="small muted">
                    Answer: <strong>{question.options[question.correctIndex]}</strong>
                  </span>
                </div>
                <Pill tone="info">Saved</Pill>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card" aria-labelledby="attempts-heading">
        <SectionTitle
          title="Recent attempts"
          hint={`${attempts.length} of ${questions.length} items attempted at least once`}
        />
        {!ready ? (
          <p className="small muted">Loading attempts…</p>
        ) : attempts.length === 0 ? (
          <p className="small muted">No attempts recorded on this device.</p>
        ) : (
          <ul className="record-list">
            {[...attempts]
              .reverse()
              .slice(0, 8)
              .map((attempt) => {
                const question = questionById(attempt.questionId);
                return (
                  <li className="record" key={attempt.id}>
                    <div className="record-main">
                      <span className="record-title">{question?.skill ?? attempt.questionId}</span>
                      <span className="small muted">
                        {attempt.exam} ·{' '}
                        {new Date(attempt.submittedAt).toLocaleString(undefined, {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <Pill tone={attempt.correct ? 'success' : 'error'}>
                      {attempt.correct ? 'Correct' : 'Incorrect'}
                    </Pill>
                  </li>
                );
              })}
          </ul>
        )}
        <p className="small" style={{ marginTop: 'var(--space-3)' }}>
          <Link to="/analytics">
            See the full picture in analytics <IconArrowRight size={14} />
          </Link>
        </p>
      </section>
    </div>
  );
}
