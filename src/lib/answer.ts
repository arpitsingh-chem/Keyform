/**
 * Answer normalization for typed multiple-choice answers.
 *
 * Rules (see FEATURE_SPECIFICATION.md / Design.md §13):
 *  - Unicode NFKC normalization
 *  - trim leading and trailing whitespace
 *  - collapse internal runs of whitespace to a single space
 *  - lowercase (English, locale-independent)
 *  - punctuation is preserved, never stripped
 *
 * This function is deliberately deterministic and narrow: it never removes
 * punctuation, letters or small words, and it is not a fuzzy matcher.
 */
export function normalizeAnswer(raw: string): string {
  return raw
    .normalize('NFKC')
    .replace(/\s+/gu, ' ')
    .trim()
    .toLowerCase();
}

/** Accepts only the single letters A, B, C or D (surrounding space ignored). */
export function parseLetterAnswer(raw: string): string | null {
  const value = raw.normalize('NFKC').replace(/\s+/gu, '').toUpperCase();
  return ['A', 'B', 'C', 'D'].includes(value) ? value : null;
}

export type AnswerMode = 'text' | 'letter';

export interface AnswerCheck {
  /** True only for an exact normalized match against the expected answer. */
  correct: boolean;
  /** The normalized value the learner submitted (empty when unusable). */
  submitted: string;
  /** The canonical expected value, for display and explanation. */
  expected: string;
  /** Why the submission was rejected, when it was not an exact match. */
  reason: 'empty' | 'invalid-letter' | 'mismatch' | null;
}

/**
 * Compare a typed answer with the expected answer.
 *
 * Text mode accepts the answer string itself; letter mode accepts A–D only.
 * There is no fuzzy, partial-word or "close enough" acceptance anywhere.
 */
export function checkAnswer(
  submitted: string,
  expected: string,
  mode: AnswerMode,
): AnswerCheck {
  if (mode === 'letter') {
    const letter = parseLetterAnswer(submitted);
    const expectedLetter = expected.trim().toUpperCase();
    if (submitted.trim() === '') {
      return { correct: false, submitted: '', expected: expectedLetter, reason: 'empty' };
    }
    if (letter === null) {
      return { correct: false, submitted, expected: expectedLetter, reason: 'invalid-letter' };
    }
    return {
      correct: letter === expectedLetter,
      submitted: letter,
      expected: expectedLetter,
      reason: letter === expectedLetter ? null : 'mismatch',
    };
  }

  const normalized = normalizeAnswer(submitted);
  const expectedNormalized = normalizeAnswer(expected);
  if (normalized === '') {
    return { correct: false, submitted: '', expected: expectedNormalized, reason: 'empty' };
  }
  return {
    correct: normalized === expectedNormalized,
    submitted: normalized,
    expected: expectedNormalized,
    reason: normalized === expectedNormalized ? null : 'mismatch',
  };
}

/** True when Enter should submit (never while an IME composition is active). */
export function shouldSubmitOnEnter(event: {
  key: string;
  shiftKey?: boolean;
  isComposing?: boolean;
  nativeEvent?: { isComposing?: boolean };
}): boolean {
  const composing =
    event.isComposing === true || event.nativeEvent?.isComposing === true;
  return event.key === 'Enter' && !event.shiftKey && !composing;
}
