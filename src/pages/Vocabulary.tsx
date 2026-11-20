import { Link } from 'react-router-dom';
import { vocabularyWords } from '../data/learn';
import { questions } from '../data/questions';
import { useStudy } from '../lib/store';
import { Note, Pill, SectionTitle } from '../components/ui';
import { IconBookmark } from '../components/icons';

export default function Vocabulary() {
  const { bookmarks, toggleBookmark, ready } = useStudy();

  // The "word of the day" is chosen from the calendar date so it is stable within a day.
  const dayIndex = Math.floor(Date.now() / 86_400_000) % vocabularyWords.length;
  const wordOfDay = vocabularyWords[dayIndex];
  const savedQuestionIds = bookmarks.filter((id) => questions.some((q) => q.id === id));

  return (
    <div className="stack-lg">
      <div className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Learning</span>
          <h1>Vocabulary</h1>
          <p className="lead">
            One word at a time, with a definition you can turn into a sentence. Saved words collect
            in Revision.
          </p>
        </div>
        <Link className="btn btn-primary" to="/practice/CDS/vocabulary">
          Practise vocabulary
        </Link>
      </div>

      <section className="card" aria-labelledby="word-heading">
        <SectionTitle title="Word for today" hint="Changes with the calendar date." />
        <div className="stack">
          <div className="word-head">
            <h1 className="word" id="word-heading">
              {wordOfDay.word}
            </h1>
            <span className="pos">{wordOfDay.partOfSpeech}</span>
            <Pill>{wordOfDay.exams.join(' · ')}</Pill>
          </div>
          <p className="lead">{wordOfDay.meaning}</p>
          <p className="small" style={{ fontStyle: 'italic' }}>
            “{wordOfDay.example}”
          </p>
          <div className="stack" style={{ gap: 6 }}>
            <span className="field-label">Synonyms</span>
            <div className="chip-row">
              {wordOfDay.synonyms.map((synonym) => (
                <Pill key={synonym}>{synonym}</Pill>
              ))}
            </div>
            <span className="field-label" style={{ marginTop: 'var(--space-2)' }}>
              Antonyms
            </span>
            <div className="chip-row">
              {wordOfDay.antonyms.map((antonym) => (
                <Pill key={antonym}>{antonym}</Pill>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Note>
        <strong>How to save a word.</strong> Words are saved through the practice items that use
        them: open a vocabulary question and choose “Save for revision”. Saved items appear under{' '}
        <Link to="/revision">Revision</Link>.
      </Note>

      <section aria-labelledby="word-list-heading">
        <SectionTitle
          title="Word list"
          hint={`${vocabularyWords.length} entries · ${ready ? savedQuestionIds.length : 0} practice items saved`}
        />
        <div className="grid-cards">
          {vocabularyWords.map((word) => {
            const linked = questions.find(
              (question) =>
                question.topic === 'vocabulary' &&
                question.prompt.toLowerCase().includes(word.word),
            );
            return (
            <article className="card" key={word.word}>
              <div className="word-head">
                <h3 style={{ fontSize: 19 }}>{word.word}</h3>
                <span className="pos small">{word.partOfSpeech}</span>
              </div>
              <p className="small" style={{ marginTop: 6 }}>
                {word.meaning}
              </p>
              <p className="small muted">{word.exams.join(' · ')}</p>
              <button
                type="button"
                className="btn btn-secondary"
                aria-pressed={linked ? bookmarks.includes(linked.id) : false}
                onClick={() => {
                  if (linked) toggleBookmark(linked.id);
                }}
                disabled={!linked}
              >
                <IconBookmark size={15} />{' '}
                {linked && bookmarks.includes(linked.id) ? 'Saved' : 'Save linked question'}
              </button>
            </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
