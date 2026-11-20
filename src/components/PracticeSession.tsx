import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '../data/content';
import { expectedAnswer } from '../data/questions';
import { checkAnswer, shouldSubmitOnEnter, type AnswerCheck } from '../lib/answer';
import { formatAccuracy, formatDuration, summarize } from '../lib/stats';
import { newId } from '../lib/storage';
import { useStudy } from '../lib/store';
import { Note, Pill } from './ui';
import { IconArrowLeft, IconArrowRight, IconBookmark, IconCheck, IconClose } from './icons';

interface Props {
  questions: Question[];
  exam: string;
  topic: string;
  answerMode: 'text' | 'letter';
  sessionLength: number;
  backTo: string;
  backLabel: string;
  title: string;
}

interface Answered {
  question: Question;
  check: AnswerCheck;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function PracticeSession({
  questions,
  exam,
  topic,
  answerMode,
  sessionLength,
  backTo,
  backLabel,
  title,
}: Props) {
  const { recordAttempt, bookmarks, toggleBookmark, settings } = useStudy();
  const sessionId = useMemo(() => newId('session'), []);
  // The question order is fixed once per mounted session. It must not depend on
  // the identity of the incoming array, or a parent re-render would re-shuffle the
  // set while the learner is working through it.
  const [items] = useState(() =>
    shuffle(questions).slice(0, Math.max(1, Math.min(sessionLength, questions.length))),
  );

  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [result, setResult] = useState<AnswerCheck | null>(null);
  const [emptyWarning, setEmptyWarning] = useState<string | null>(null);
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [finished, setFinished] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const questionStart = useRef<number>(Date.now());

  const question = items[index];
  const mode = answerMode;
  // The learner can ask to type from memory first; the options appear after submission.
  const showOptions = !settings.hideOptions || result !== null;
  const isBookmarked = question ? bookmarks.includes(question.id) : false;

  useEffect(() => {
    questionStart.current = Date.now();
    inputRef.current?.focus();
  }, [index]);

  useEffect(() => {
    // Keep a running clock that is informational only in practice.
    const timer = window.setInterval(() => {
      setElapsedMs((current) => current + 1000);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  function submit() {
    if (!question || result) return;
    const check = checkAnswer(value, expectedAnswer(question, mode), mode);
    if (check.reason === 'empty') {
      setEmptyWarning('Type your answer before submitting. An empty response is not counted.');
      inputRef.current?.focus();
      return;
    }
    if (check.reason === 'invalid-letter') {
      setEmptyWarning('Letter mode accepts a single letter: A, B, C or D.');
      inputRef.current?.focus();
      return;
    }
    setEmptyWarning(null);
    const spent = Date.now() - questionStart.current;
    recordAttempt({
      questionId: question.id,
      exam,
      topic,
      correct: check.correct,
      elapsedMs: spent,
      sessionId,
    });
    setResult(check);
    setAnswered((current) => [...current, { question, check }]);
    window.setTimeout(() => nextRef.current?.focus(), 30);
  }

  function next() {
    if (index + 1 >= items.length) {
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
    setValue('');
    setResult(null);
    setEmptyWarning(null);
  }

  function restart() {
    setIndex(0);
    setValue('');
    setResult(null);
    setEmptyWarning(null);
    setAnswered([]);
    setFinished(false);
    setElapsedMs(0);
    questionStart.current = Date.now();
  }

  const stats = summarize(
    answered.map((entry) => ({
      questionId: entry.question.id,
      submittedAt: new Date().toISOString(),
      correct: entry.check.correct,
      elapsedMs: 0,
      exam,
      topic,
    })),
  );

  if (finished) {
    return (
      <section className="quiz-panel" aria-labelledby="summary-heading">
        <div className="session-summary">
          <span className="eyebrow">Session complete</span>
          <h1 id="summary-heading">
            {stats.correct} of {stats.total} correct
          </h1>
          <p className="lead" style={{ maxWidth: '48ch' }}>
            Accuracy is calculated from submitted answers only, so an unanswered question never
            counts as a wrong answer.
          </p>
          <div className="grid-metrics" style={{ width: '100%', maxWidth: '620px' }}>
            <div className="metric">
              <div className="metric-label">Accuracy</div>
              <div className="metric-value">{formatAccuracy(stats.accuracy)}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Not quite</div>
              <div className="metric-value">{stats.incorrect}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Session clock</div>
              <div className="metric-value mono">{formatDuration(elapsedMs)}</div>
            </div>
          </div>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={restart}>
              New session
            </button>
            <Link className="btn btn-secondary" to="/revision">
              Review mistakes
            </Link>
            <Link className="btn btn-tertiary" to={backTo}>
              Back to {backLabel.toLowerCase()}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!question) {
    return (
      <div className="empty">
        <h2>No practice items here yet</h2>
        <p>
          This topic has no released practice questions for the selected exam. Try another topic
          rather than a generated or unverified set.
        </p>
        <Link className="btn btn-primary" to={backTo}>
          Choose another topic
        </Link>
      </div>
    );
  }

  return (
    <section className="stack-lg" aria-labelledby="practice-heading">
      <div className="row-between">
        <Link className="btn btn-tertiary" to={backTo}>
          <IconArrowLeft size={16} /> {backLabel}
        </Link>
        <span className="small muted mono">
          <span className="visually-hidden">Session clock </span>
          {formatDuration(elapsedMs)}
        </span>
      </div>

      <div className="quiz-panel">
        <div className="quiz-context">
          <div className="stack" style={{ gap: 2 }}>
            <h1 id="practice-heading" style={{ fontSize: 22, lineHeight: '28px' }}>
              {title}
            </h1>
            <span className="small muted">
              {question.skill} · {question.level}
            </span>
          </div>
          <span className="quiz-count">
            Question {index + 1} of {items.length}
          </span>
        </div>

        <div className="progress">
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Session progress"
            aria-valuemin={0}
            aria-valuemax={items.length}
            aria-valuenow={index}
            aria-valuetext={`${index} of ${items.length} answered`}
          >
            <div
              className="progress-fill"
              style={{ width: `${Math.round((index / items.length) * 100)}%` }}
            />
          </div>
        </div>

        {question.passage ? <div className="passage">{question.passage}</div> : null}

        <p className="question-text" id="question-text">
          {question.prompt}
        </p>

        {showOptions ? (
        <ul className="options" aria-label="Reference options">
          {question.options.map((option, optionIndex) => {
            const letter = 'ABCD'[optionIndex];
            const isCorrect = result !== null && optionIndex === question.correctIndex;
            return (
              <li
                key={letter}
                className={isCorrect ? 'option option-correct' : 'option'}
                aria-label={`Option ${letter}: ${option}${isCorrect ? ' — correct answer' : ''}`}
              >
                <span className="option-letter" aria-hidden="true">
                  {letter}
                </span>
                <span>{option}</span>
              </li>
            );
          })}
        </ul>
        ) : (
          <p className="note" style={{ margin: 0 }}>
            <strong>Options hidden.</strong> Type the answer from memory and submit; the four options
            and the correct letter appear with the explanation. You can turn this off in Settings.
          </p>
        )}

        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <div className="field">
            <label htmlFor="answer-input">
              {mode === 'letter' ? 'Type the letter of your answer (A, B, C or D)' : 'Type the correct answer'}
            </label>
            <input
              id="answer-input"
              ref={inputRef}
              className="input input-answer"
              type="text"
              value={value}
              readOnly={result !== null}
              aria-describedby="answer-hint"
              aria-invalid={emptyWarning ? true : undefined}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              onChange={(event) => {
                setValue(event.target.value);
                if (emptyWarning) setEmptyWarning(null);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  if (!shouldSubmitOnEnter(event)) {
                    // IME composition: let the input method finish.
                    if (event.nativeEvent.isComposing) return;
                  }
                  event.preventDefault();
                  submit();
                }
              }}
            />
            <span className="field-hint" id="answer-hint">
              {mode === 'letter'
                ? 'Only the letter is graded. Punctuation and extra words are not accepted.'
                : 'Case and extra spaces are ignored. Spelling and punctuation are not corrected for you.'}
            </span>
            {emptyWarning ? (
              <span className="field-error" role="alert">
                {emptyWarning}
              </span>
            ) : null}
          </div>

          <div className="btn-row">
            {result === null ? (
              <button type="submit" className="btn btn-primary">
                Submit answer
              </button>
            ) : (
              <button type="button" className="btn btn-primary" ref={nextRef} onClick={next}>
                {index + 1 >= items.length ? 'Finish session' : 'Next question'} <IconArrowRight size={16} />
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => toggleBookmark(question.id)}
              aria-pressed={isBookmarked}
            >
              <IconBookmark size={16} />
              {isBookmarked ? 'Saved for revision' : 'Save for revision'}
            </button>
          </div>
        </form>

        <div aria-live="polite">
          {result ? (
            <div
              className={
                result.correct ? 'feedback feedback-correct' : 'feedback feedback-incorrect'
              }
            >
              <div className="feedback-head">
                {result.correct ? <IconCheck size={18} /> : <IconClose size={18} />}
                {result.correct ? 'Correct' : 'Not quite'}
              </div>
              <p className="answer-line">
                Expected answer: <strong>{expectedAnswer(question, mode)}</strong>
                {mode === 'letter' ? ` — ${question.options[question.correctIndex]}` : null}
              </p>
              <p>{question.explanation}</p>
              <p className="small muted">
                Reason: {describeReason(result, value)}
              </p>
            </div>
          ) : null}
        </div>

        <div className="row-between">
          <span className="small muted">
            Source: <Pill tone="info">Original practice item</Pill>
          </span>
          <span className="small muted">ID {question.id} · v{question.contentVersion}</span>
        </div>
      </div>

      {settings.answerMode !== answerMode ? (
        <Note>
          You are practising in <strong>{answerMode}</strong> mode because this session was started
          with it. Change the default in Settings.
        </Note>
      ) : null}
    </section>
  );
}

function describeReason(result: AnswerCheck, raw: string): string {
  if (result.reason === 'mismatch') {
    return `Your answer “${raw.trim()}” does not match the expected answer exactly after trimming spaces and ignoring case.`;
  }
  return 'Your answer matches the expected answer exactly.';
}
