import type { Question } from './content';

/**
 * Option-position balancing.
 *
 * Authors naturally place the answer where it reads best, which in this bank
 * put almost half the correct answers in position B. A learner can exploit that
 * without knowing any English, so the shipped bank rotates each item's options
 * (and its key) to a deterministic target position.
 *
 * Rules:
 *  - Only the *order* changes. The set of options and the correct option's text
 *    are never altered, and `tests/content.test.ts` asserts exactly that against
 *    the authored key.
 *  - The rotation is deterministic, so an answer key stays stable between
 *    sessions, revisions and exports.
 *  - Error-detection items are skipped: their options are the literal part
 *    labels (A), (B), (C), (D) inside the sentence, so their position carries
 *    meaning and cannot be moved.
 */

const POSITION_FIXED_TOPICS = new Set(['error-detection']);

export function rotateOptions<T>(options: readonly T[], shift: number): [T, T, T, T] {
  const n = options.length;
  const k = ((shift % n) + n) % n;
  return options.map((_, index) => options[(index - k + n) % n]) as [T, T, T, T];
}

export function balanceOptionPositions(items: Question[]): Question[] {
  let positionalIndex = 0;
  return items.map((item) => {
    if (POSITION_FIXED_TOPICS.has(item.topic)) return item;
    const target = (positionalIndex % 4) as 0 | 1 | 2 | 3;
    positionalIndex += 1;
    const shift = (target - item.correctIndex + 4) % 4;
    if (shift === 0) return item;
    return {
      ...item,
      options: rotateOptions(item.options, shift),
      correctIndex: target,
    };
  });
}
