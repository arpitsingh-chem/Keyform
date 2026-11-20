import { describe, expect, it } from 'vitest';
import { authoredQuestions, questions, expectedAnswer } from '../src/data/questions';
import { examTracks, topics } from '../src/data/content';
import { checkAnswer } from '../src/lib/answer';

const validStatuses = [
  'verified_official_paper',
  'adapted_from_cited_source',
  'original_platform_practice',
  'probable_pattern_practice',
];

describe('question bank integrity', () => {
  it('has unique identifiers', () => {
    const ids = questions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses a known topic for every item', () => {
    const topicIds = new Set(topics.map((topic) => topic.id));
    for (const question of questions) {
      expect(topicIds.has(question.topic), question.id).toBe(true);
    }
  });

  it('uses known exam codes for every item', () => {
    const codes = new Set(examTracks.map((track) => track.code));
    for (const question of questions) {
      expect(question.exams.length, question.id).toBeGreaterThan(0);
      for (const exam of question.exams) expect(codes.has(exam), question.id).toBe(true);
    }
  });

  it('offers exactly four distinct non-empty options', () => {
    for (const question of questions) {
      expect(question.options, question.id).toHaveLength(4);
      expect(new Set(question.options).size, question.id).toBe(4);
      for (const option of question.options) expect(option.trim().length).toBeGreaterThan(0);
    }
  });

  it('points correctIndex at a real option', () => {
    for (const question of questions) {
      expect(question.correctIndex, question.id).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex, question.id).toBeLessThanOrEqual(3);
    }
  });

  it('provides an explanation and a long enough prompt', () => {
    for (const question of questions) {
      expect(question.explanation.trim().length, question.id).toBeGreaterThan(20);
      expect(question.prompt.trim().length, question.id).toBeGreaterThan(16);
    }
  });

  it('records provenance status and never mislabels original items as PYQs', () => {
    for (const question of questions) {
      expect(validStatuses, question.id).toContain(question.provenance.status);
      if (question.provenance.status === 'verified_official_paper') {
        expect(question.provenance.sourceUrl, question.id).toBeTruthy();
      }
    }
    const claimedPyq = questions.filter(
      (question) => question.provenance.status === 'verified_official_paper',
    );
    expect(claimedPyq).toHaveLength(0);
  });

  it('avoids duplicate prompt/answer pairs', () => {
    const keys = questions.map(
      (question) => `${question.prompt.toLowerCase()}|${question.options[question.correctIndex].toLowerCase()}`,
    );
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('accepts its own expected answer in both modes', () => {
    for (const question of questions) {
      const text = expectedAnswer(question, 'text');
      const letter = expectedAnswer(question, 'letter');
      expect(checkAnswer(text, text, 'text').correct, question.id).toBe(true);
      expect(checkAnswer(letter.toLowerCase(), letter, 'letter').correct, question.id).toBe(true);
      expect(letter).toBe('ABCD'[question.correctIndex]);
    }
  });

  it('rejects every wrong option as a text answer', () => {
    for (const question of questions) {
      question.options.forEach((option, index) => {
        if (index === question.correctIndex) return;
        const result = checkAnswer(option, expectedAnswer(question, 'text'), 'text');
        expect(result.correct, `${question.id} option ${index}`).toBe(false);
      });
    }
  });

  it('releases a bank large enough to practise with', () => {
    expect(questions.length).toBeGreaterThanOrEqual(85);
  });

  it('spreads the correct answer across all four positions', () => {
    const counts = [0, 0, 0, 0];
    for (const question of questions) counts[question.correctIndex] += 1;
    for (const count of counts) {
      // No position may dominate: with 90 items each should hold roughly 20.
      expect(count).toBeGreaterThanOrEqual(12);
    }
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    expect(max - min).toBeLessThanOrEqual(18);
  });

  it('balances option positions without changing any answer', () => {
    expect(questions).toHaveLength(authoredQuestions.length);
    questions.forEach((question, index) => {
      const authored = authoredQuestions[index];
      expect(question.id, String(index)).toBe(authored.id);
      // Same set of options, same correct option text: only the order moved.
      expect([...question.options].sort(), question.id).toEqual([...authored.options].sort());
      expect(question.options[question.correctIndex], question.id).toBe(
        authored.options[authored.correctIndex],
      );
    });
  });

  it('keeps error-detection part labels in place', () => {
    for (const question of questions.filter((item) => item.topic === 'error-detection')) {
      expect(question.options, question.id).toEqual(['A', 'B', 'C', 'D']);
    }
  });

  it('explains answers without referring to a letter position', () => {
    const positional = /\b(first|second|third|fourth|last) option\b|\boption [A-D]\b/i;
    for (const question of questions) {
      expect(positional.test(question.explanation), question.id).toBe(false);
    }
  });

  it('has items for each of the three tracks', () => {
    for (const track of examTracks) {
      const count = questions.filter((question) => question.exams.includes(track.code)).length;
      expect(count, track.code).toBeGreaterThanOrEqual(10);
    }
  });
});
