import { useState } from 'react';
import { Link } from 'react-router-dom';
import { grammarRules } from '../data/learn';
import { questions } from '../data/questions';
import { Note, Pill, SectionTitle } from '../components/ui';
import { IconArrowRight } from '../components/icons';

export default function Grammar() {
  const [selectedId, setSelectedId] = useState(grammarRules[0].id);
  const rule = grammarRules.find((entry) => entry.id === selectedId) ?? grammarRules[0];
  const relatedCount = questions.filter(
    (question) => question.topic === rule.practiceTopic,
  ).length;

  return (
    <div className="stack-lg">
      <div className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Learning</span>
          <h1>Grammar and usage</h1>
          <p className="lead">
            One rule at a time: the rule, a correct example, the mistake it prevents, and a link to
            items that test it.
          </p>
        </div>
      </div>

      <section className="card" aria-labelledby="rule-select-heading">
        <SectionTitle title="Choose a rule" hint={`${grammarRules.length} rules in this release`} />
        <div className="field" style={{ maxWidth: 460 }}>
          <label htmlFor="rule-select" id="rule-select-heading">
            Rule
          </label>
          <select
            id="rule-select"
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            {grammarRules.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.title}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="card" aria-labelledby="rule-heading">
        <div className="stack">
          <Pill tone="info">{rule.practiceTopic.replace('-', ' ')}</Pill>
          <h2 id="rule-heading">{rule.title}</h2>
          <p className="lead prose">{rule.rule}</p>

          <div className="panel" style={{ borderColor: 'var(--success)' }}>
            <span className="field-label" style={{ color: 'var(--success)' }}>
              Correct
            </span>
            <p style={{ marginTop: 4 }}>{rule.correct}</p>
          </div>

          <div className="panel" style={{ borderColor: 'var(--error)' }}>
            <span className="field-label" style={{ color: 'var(--error)' }}>
              Common mistake
            </span>
            <p style={{ marginTop: 4 }}>{rule.mistake}</p>
            <p className="small muted" style={{ marginTop: 6 }}>
              {rule.why}
            </p>
          </div>

          <div className="btn-row">
            <Link className="btn btn-primary" to={`/practice/CDS/${rule.practiceTopic}`}>
              Practise this rule <IconArrowRight size={15} />
            </Link>
            <span className="small muted">{relatedCount} related CDS items</span>
          </div>
        </div>
      </section>

      <Note>
        A rule is an explanation, not a guarantee about how a question will be phrased. Practice
        items test the rule in context, and the explanation after each attempt is the part worth
        re-reading.
      </Note>
    </div>
  );
}
