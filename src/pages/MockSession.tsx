import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trackByCode } from '../data/content';
import { expectedAnswer, questionsFor } from '../data/questions';
import { checkAnswer, shouldSubmitOnEnter } from '../lib/answer';
import { formatDuration } from '../lib/stats';
import { newId } from '../lib/storage';
import { useStudy } from '../lib/store';
import { Note, Pill, SectionTitle } from '../components/ui';
import { MOCK_LENGTH, MOCK_MINUTES } from './Mocks';

interface Marked {
  value: string;
  review: boolean;
}

export default function MockSession() {
  const { code } = useParams();
  const { settings, recordAttempt } = useStudy();
  const track = trackByCode(code);

  const items = useMemo(
    () => (track ? questionsFor(track.code).slice(0, MOCK_LENGTH) : []),
    [track],
  );
  const sessionId = useMemo(() => newId('mock'), []);

  const [marked, setMarked] = useState<Marked[]>(() =>
    items.map(() => ({ value: '', review: false })),
  );
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(MOCK_MINUTES * 60);
  const [phase, setPhase] = useState<'running' | 'submitted'>('running');
  const [status, setStatus] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    setMarked(items.map(() => ({ value: '', review: false })));
  }, [items]);

  useEffect(() => {
    if (phase !== 'running') return;
    const timer = window.setInterval(() => {
      setRemaining((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          setPhase('submitted');
          setStatus('Time is up. The run was submitted automatically.');
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'running') inputRef.current?.focus();
  }, [index, phase]);

  if (!track) {
    return (
      <div className="empty">
        <h1>That mock link is not valid</h1>
        <p>The track in this address does not exist.</p>
        <Link className="btn btn-primary" to="/mocks">
          Back to mock tests
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty">
        <h1>No released items for a {track.code} mock run</h1>
        <p>A mock needs at least {MOCK_LENGTH} reviewed items. More content has to be written first.</p>
        <Link className="btn btn-primary" to="/mocks">
          Back to mock tests
        </Link>
      </div>
    );
  }

  const examCode = track.code;
  const current = items[index];
  const currentMark = marked[index];

  function update(patch: Partial<Marked>) {
    setMarked((all) =>
      all.map((entry, entryIndex) => (entryIndex === index ? { ...entry, ...patch } : entry)),
    );
    setStatus('');
  }

  function trySubmit() {
    const blanks = marked.filter((entry) => entry.value.trim() === '').length;
    const message =
      blanks > 0
        ? `Submit the run? ${blanks} question${blanks === 1 ? '' : 's'} will be reported as omitted.`
        : 'Submit the run? Solutions will be revealed and answers can no longer change.';
    if (!window.confirm(message)) return;
    finish();
  }

  function finish() {
    setPhase('submitted');
    setStatus('Run submitted. Solutions are shown below.');
    const spent = Date.now() - startedAt.current;
    marked.forEach((entry, entryIndex) => {
      const question = items[entryIndex];
      if (!question) return;
      if (entry.value.trim() === '') return; // omitted answers are not counted as attempts
      const check = checkAnswer(entry.value, expectedAnswer(question, settings.answerMode), settings.answerMode);
      if (check.reason === 'empty' || check.reason === 'invalid-letter') return;
      recordAttempt({
        questionId: question.id,
        exam: examCode,
        topic: question.topic,
        correct: check.correct,
        elapsedMs: Math.round(spent / Math.max(1, items.length)),
        sessionId,
      });
    });
  }

  if (phase === 'submitted') {
    const results = items.map((question, itemIndex) => {
      const entry = marked[itemIndex];
      const omitted = entry.value.trim() === '';
      const check = omitted
        ? null
        : checkAnswer(entry.value, expectedAnswer(question, settings.answerMode), settings.answerMode);
      return { question, entry, omitted, check };
    });
    const omittedCount = results.filter((r) => r.omitted).length;
    const correct = results.filter((r) => r.check?.correct).length;
    const incorrect = results.length - omittedCount - correct;

    return (
      <div className="stack-lg">
        <div className="page-head">
          <div className="page-head-copy">
            <span className="eyebrow">{examCode} mock run · results</span>
            <h1>
              {correct} correct · {incorrect} incorrect · {omittedCount} omitted
            </h1>
            <p className="lead">
              Raw counts only. No negative marking is applied, because this workspace has not
              verified an official marking scheme for this format.
            </p>
          </div>
          <div className="btn-row">
            <Link className="btn btn-secondary" to="/revision">
              Review mistakes
            </Link>
            <Link className="btn btn-primary" to="/mocks">
              Another run
            </Link>
          </div>
        </div>

        <p aria-live="polite" className="small muted">
          {status}
        </p>

        <section className="card" aria-labelledby="answer-review-heading">
          <SectionTitle title="Answer review" hint="Omitted items are separated from wrong ones." />
          <ul className="record-list">
            {results.map(({ question, entry, omitted }, resultIndex) => {
              const correctOption = question.options[question.correctIndex];
              return (
                <li className="record" key={question.id}>
                  <div className="record-main" style={{ gap: 6 }}>
                    <span className="small muted">
                      Q{resultIndex + 1} · {question.skill}
                    </span>
                    <span className="record-title">{question.prompt}</span>
                    <span className="small">
                      Your answer:{' '}
                      <strong className="mono">{omitted ? '— (omitted)' : entry.value.trim()}</strong>
                      {' · '}Expected: <strong className="mono">{correctOption}</strong>
                    </span>
                    <span className="small muted">{question.explanation}</span>
                  </div>
                  <Pill
                    tone={
                      omitted
                        ? 'neutral'
                        : checkAnswer(
                              entry.value,
                              expectedAnswer(question, settings.answerMode),
                              settings.answerMode,
                            ).correct
                          ? 'success'
                          : 'error'
                    }
                  >
                    {omitted
                      ? 'Omitted'
                      : checkAnswer(
                            entry.value,
                            expectedAnswer(question, settings.answerMode),
                            settings.answerMode,
                          ).correct
                        ? 'Correct'
                        : 'Incorrect'}
                  </Pill>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    );
  }

  const answeredCount = marked.filter((entry) => entry.value.trim() !== '').length;
  const reviewCount = marked.filter((entry) => entry.review).length;

  return (
    <div className="stack-lg">
      <div className="row-between">
        <Link className="btn btn-tertiary" to="/mocks">
          ← Leave without submitting
        </Link>
        <span className="pill pill-warning mono" role="timer" aria-label="Time remaining">
          {formatDuration(remaining * 1000)} left
        </span>
      </div>

      <div className="quiz-panel">
        <div className="quiz-context">
          <div className="stack" style={{ gap: 2 }}>
            <h1 style={{ fontSize: 22, lineHeight: '28px' }}>{examCode} mock run</h1>
            <span className="small muted">
              {answeredCount} answered · {reviewCount} marked for review · {items.length} questions
            </span>
          </div>
          <span className="quiz-count">Question {index + 1} of {items.length}</span>
        </div>

        <p className="question-text">{current.prompt}</p>

        <ul className="options" aria-label="Reference options">
          {current.options.map((option, optionIndex) => (
            <li className="option" key={optionIndex}>
              <span className="option-letter" aria-hidden="true">
                {'ABCD'[optionIndex]}
              </span>
              <span>{option}</span>
            </li>
          ))}
        </ul>

        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="field">
            <label htmlFor="mock-answer">
              {settings.answerMode === 'letter'
                ? 'Type the letter of your answer (A, B, C or D)'
                : 'Type the correct answer'}
            </label>
            <input
              id="mock-answer"
              ref={inputRef}
              className="input input-answer"
              type="text"
              value={currentMark.value}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-describedby="mock-hint"
              onChange={(event) => update({ value: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && shouldSubmitOnEnter(event)) {
                  event.preventDefault();
                  setIndex((current) => Math.min(items.length - 1, current + 1));
                }
              }}
            />
            <span className="field-hint" id="mock-hint">
              Enter moves to the next question. Nothing is graded until you submit the run.
            </span>
          </div>

          <div className="btn-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => update({ review: !currentMark.review })}
              aria-pressed={currentMark.review}
            >
              {currentMark.review ? 'Remove review mark' : 'Mark for review'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={index === 0}
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={index === items.length - 1}
              onClick={() => setIndex((current) => Math.min(items.length - 1, current + 1))}
            >
              Next
            </button>
            <button type="button" className="btn btn-primary" onClick={trySubmit}>
              Submit run
            </button>
          </div>
        </form>

        <div>
          <h2 style={{ fontSize: 16, marginBottom: 'var(--space-2)' }}>Question navigator</h2>
          <div className="chip-row" role="group" aria-label="Jump to a question">
            {marked.map((entry, entryIndex) => {
              const answered = entry.value.trim() !== '';
              const label = `Question ${entryIndex + 1}${answered ? ', answered' : ', blank'}${
                entry.review ? ', marked for review' : ''
              }`;
              return (
                <button
                  key={entryIndex}
                  type="button"
                  className="btn btn-secondary"
                  style={{
                    minWidth: 44,
                    padding: '0 10px',
                    borderColor:
                      entryIndex === index
                        ? 'var(--primary)'
                        : entry.review
                          ? 'var(--warning)'
                          : 'var(--border-strong)',
                    fontWeight: entryIndex === index ? 700 : 600,
                  }}
                  aria-label={label}
                  aria-current={entryIndex === index ? 'true' : undefined}
                  onClick={() => setIndex(entryIndex)}
                >
                  {entryIndex + 1}
                </button>
              );
            })}
          </div>
          <p className="small muted" style={{ marginTop: 'var(--space-2)' }}>
            A warning-coloured border marks a question for review. Blank questions are reported as
            omitted, not incorrect.
          </p>
        </div>
      </div>

      <Note>
        Leaving this page discards the run. Nothing is graded or saved until you submit.
      </Note>
    </div>
  );
}
