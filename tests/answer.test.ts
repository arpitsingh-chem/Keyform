import { describe, expect, it } from 'vitest';
import { checkAnswer, normalizeAnswer, parseLetterAnswer, shouldSubmitOnEnter } from '../src/lib/answer';

describe('normalizeAnswer', () => {
  it('trims and lowercases', () => {
    expect(normalizeAnswer('  Lessen  ')).toBe('lessen');
  });

  it('collapses internal whitespace runs', () => {
    expect(normalizeAnswer('very    careful')).toBe('very careful');
    expect(normalizeAnswer('very\t\ncareful')).toBe('very careful');
  });

  it('applies NFKC so compatibility characters match', () => {
    expect(normalizeAnswer('ＡＢＣ')).toBe('abc');
    expect(normalizeAnswer('ﬁnal')).toBe('final');
  });

  it('keeps punctuation and never strips words', () => {
    expect(normalizeAnswer('it’s')).toBe('it’s');
    expect(normalizeAnswer("isn't it?")).toBe("isn't it?");
  });

  it('does not accept a different phrasing', () => {
    expect(normalizeAnswer('lessen')).not.toBe(normalizeAnswer('to lessen'));
  });
});

describe('parseLetterAnswer', () => {
  it('accepts a single letter in either case with surrounding space', () => {
    expect(parseLetterAnswer(' b ')).toBe('B');
  });

  it('rejects multi-letter and non-option input', () => {
    expect(parseLetterAnswer('bc')).toBeNull();
    expect(parseLetterAnswer('E')).toBeNull();
    expect(parseLetterAnswer('lessen')).toBeNull();
  });
});

describe('checkAnswer text mode', () => {
  it('accepts case and spacing differences', () => {
    expect(checkAnswer('  VERY   careful ', 'very careful', 'text').correct).toBe(true);
  });

  it('rejects near misses, including punctuation differences', () => {
    const nearMisses = ['careful', 'very carefull', 'very-careful', 'very careful.'];
    for (const attempt of nearMisses) {
      const result = checkAnswer(attempt, 'very careful', 'text');
      expect(result.correct, attempt).toBe(false);
      expect(result.reason).toBe('mismatch');
    }
  });

  it('reports an empty answer without counting it as a mismatch', () => {
    expect(checkAnswer('   ', 'lessen', 'text')).toMatchObject({
      correct: false,
      reason: 'empty',
    });
  });

  it('reports the normalized expected value for display', () => {
    expect(checkAnswer('x', 'At the Last Moment', 'text').expected).toBe('at the last moment');
  });
});

describe('checkAnswer letter mode', () => {
  it('grades only the letter', () => {
    expect(checkAnswer('b', 'B', 'letter').correct).toBe(true);
    expect(checkAnswer('B', 'A', 'letter').reason).toBe('mismatch');
  });

  it('does not accept the answer text in letter mode', () => {
    const result = checkAnswer('lessen', 'B', 'letter');
    expect(result.correct).toBe(false);
    expect(result.reason).toBe('invalid-letter');
  });

  it('does not accept an out-of-range letter', () => {
    expect(checkAnswer('E', 'B', 'letter').reason).toBe('invalid-letter');
  });
});

describe('shouldSubmitOnEnter', () => {
  it('submits on a plain Enter', () => {
    expect(shouldSubmitOnEnter({ key: 'Enter' })).toBe(true);
  });

  it('does not submit during IME composition', () => {
    expect(shouldSubmitOnEnter({ key: 'Enter', isComposing: true })).toBe(false);
    expect(
      shouldSubmitOnEnter({ key: 'Enter', nativeEvent: { isComposing: true } }),
    ).toBe(false);
  });

  it('ignores other keys and modified Enter', () => {
    expect(shouldSubmitOnEnter({ key: 'a' })).toBe(false);
    expect(shouldSubmitOnEnter({ key: 'Enter', shiftKey: true })).toBe(false);
  });
});
