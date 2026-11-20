import { useState } from 'react';
import { Link } from 'react-router-dom';
import { examTracks, topics } from '../data/content';
import { questionsFor } from '../data/questions';
import { useStudy } from '../lib/store';
import { Note, Pill, SectionTitle } from '../components/ui';
import { IconArrowRight } from '../components/icons';

export default function Practice() {
  const { settings, updateSettings } = useStudy();
  const [exam, setExam] = useState<string>('CDS');
  const items = questionsFor(exam);

  return (
    <div className="stack-lg">
      <div className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Typing practice</span>
          <h1>Practise by typing the answer</h1>
          <p className="lead">
            Choose a track and a topic. Every session returns the reason for each result, and the
            clock is informational — it does not decide anything outside a mock test.
          </p>
        </div>
      </div>

      <Note>
        <strong>Answer checking.</strong> Your typed answer is compared after Unicode normalisation,
        trimming and ignoring case. Internal spaces are collapsed, punctuation is kept, and there is
        no fuzzy or “close enough” acceptance.
      </Note>

      <section className="card" aria-labelledby="setup-heading">
        <SectionTitle title="Session setup" hint="These defaults are stored on this device." />
        <div className="settings-grid">
          <div className="field">
            <label htmlFor="exam-select">Exam track</label>
            <select
              id="exam-select"
              value={exam}
              onChange={(event) => setExam(event.target.value)}
            >
              {examTracks.map((track) => (
                <option key={track.code} value={track.code}>
                  {track.code} — {track.name}
                </option>
              ))}
            </select>
            <span className="field-hint">{items.length} released items in this track.</span>
          </div>

          <div className="field">
            <label htmlFor="mode-select">Answer mode</label>
            <select
              id="mode-select"
              value={settings.answerMode}
              onChange={(event) =>
                updateSettings({ answerMode: event.target.value as 'text' | 'letter' })
              }
            >
              <option value="text">Type the answer text</option>
              <option value="letter">Type the option letter (A–D)</option>
            </select>
            <span className="field-hint">
              Letter mode grades only the letter; text mode grades the answer string exactly.
            </span>
          </div>

          <div className="field">
            <label htmlFor="length-select">Session length</label>
            <select
              id="length-select"
              value={settings.sessionLength}
              onChange={(event) => updateSettings({ sessionLength: Number(event.target.value) })}
            >
              {[5, 10, 15, 20].map((length) => (
                <option key={length} value={length}>
                  {length} questions
                </option>
              ))}
            </select>
            <span className="field-hint">
              A session stops early if the topic has fewer items than this.
            </span>
          </div>
        </div>
      </section>

      <section aria-labelledby="topics-heading">
        <SectionTitle
          title={`${exam} topics`}
          hint="Only topics with released practice items can be started."
        />
        <div className="grid-cards">
          {topics.map((topic) => {
            const topicItems = items.filter((question) => question.topic === topic.id);
            if (topicItems.length === 0) {
              return (
                <article className="card" key={topic.id} style={{ opacity: 0.72 }}>
                  <div className="row-between">
                    <h3>{topic.name}</h3>
                    <Pill>Empty</Pill>
                  </div>
                  <p className="small muted" style={{ marginTop: 6 }}>
                    No released items for {exam}. Nothing is generated to fill the gap.
                  </p>
                </article>
              );
            }
            return (
              <Link
                className="card card-link"
                key={topic.id}
                to={`/practice/${exam}/${topic.id}`}
              >
                <div className="row-between" style={{ alignItems: 'flex-start' }}>
                  <h3>{topic.name}</h3>
                  <Pill tone="info">{topicItems.length} items</Pill>
                </div>
                <p className="small" style={{ marginTop: 6 }}>
                  {topic.description}
                </p>
                <p className="small" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Start session <IconArrowRight size={14} />
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <p className="small muted">
        Looking for a timed run? <Link to="/mocks">Mock tests</Link> hold solutions back until the
        end.
      </p>
    </div>
  );
}
