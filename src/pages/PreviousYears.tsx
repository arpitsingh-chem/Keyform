import { useMemo, useState } from 'react';
import { examTracks } from '../data/content';
import { previousYearEntries } from '../data/learn';
import { Note, Pill, SectionTitle } from '../components/ui';

export default function PreviousYears() {
  const [exam, setExam] = useState('all');
  const [year, setYear] = useState('all');
  const [topic, setTopic] = useState('all');
  const [query, setQuery] = useState('');

  const years = useMemo(
    () => [...new Set(previousYearEntries.map((entry) => entry.year))].sort(),
    [],
  );
  const topics = useMemo(
    () => [...new Set(previousYearEntries.map((entry) => entry.topic))].sort(),
    [],
  );

  const results = previousYearEntries.filter((entry) => {
    const matchesExam = exam === 'all' || entry.exam === exam;
    const matchesYear = year === 'all' || entry.year === year;
    const matchesTopic = topic === 'all' || entry.topic === topic;
    const haystack = `${entry.paper} ${entry.sourceName} ${entry.note}`.toLowerCase();
    const matchesQuery = query.trim() === '' || haystack.includes(query.trim().toLowerCase());
    return matchesExam && matchesYear && matchesTopic && matchesQuery;
  });

  return (
    <div className="stack-lg">
      <div className="page-head">
        <div className="page-head-copy">
          <span className="eyebrow">Workspace · sourced material</span>
          <h1>Previous years and syllabus sources</h1>
          <p className="lead">
            This page links official material instead of copying it. A paper being publicly
            downloadable does not by itself grant permission to republish it, so Keyform links to the
            commission’s own page.
          </p>
        </div>
      </div>

      <Note tone="warning">
        <strong>Nothing on this page is a transcription.</strong> Records are labelled{' '}
        <em>source page linked</em>. A question becomes <em>verified official paper</em> only after
        an item has been checked against the named official paper, which has not been done in this
        release.
      </Note>

      <section className="card" aria-labelledby="filters-heading">
        <SectionTitle title="Filters" hint="Filters intersect; an active filter is never dropped silently." />
        <div className="settings-grid">
          <div className="field">
            <label htmlFor="py-exam">Exam</label>
            <select id="py-exam" value={exam} onChange={(event) => setExam(event.target.value)}>
              <option value="all">All exams</option>
              {examTracks.map((track) => (
                <option key={track.code} value={track.code}>
                  {track.code}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="py-year">Year</label>
            <select id="py-year" value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="all">All years</option>
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="py-topic">Material</label>
            <select id="py-topic" value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="all">All material</option>
              {topics.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="py-search">Search</label>
            <input
              id="py-search"
              type="text"
              className="input"
              value={query}
              placeholder="e.g. general english, syllabus"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="records-heading">
        <SectionTitle
          title={`${results.length} record${results.length === 1 ? '' : 's'}`}
          hint={`Exam: ${exam} · year: ${year} · material: ${topic}${query ? ` · search: “${query}”` : ''}`}
        />
        {results.length === 0 ? (
          <div className="empty">
            <h3>No records match these filters</h3>
            <p>
              Widen one filter — for example choose “All years” — or clear the search box. Keyform
              does not fill an empty result with invented papers.
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setExam('all');
                setYear('all');
                setTopic('all');
                setQuery('');
              }}
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <ul className="record-list">
            {results.map((entry) => (
              <li className="record" key={entry.id}>
                <div className="record-main" style={{ gap: 4 }}>
                  <div className="chip-row">
                    <Pill tone="info">{entry.exam}</Pill>
                    <Pill>{entry.year}</Pill>
                    <Pill>{entry.topic}</Pill>
                  </div>
                  <span className="record-title">{entry.paper}</span>
                  <span className="small muted">
                    {entry.sourceName} · {entry.note}
                  </span>
                  <span className="small">
                    <a href={entry.sourceUrl} target="_blank" rel="noreferrer noopener">
                      Open official source
                    </a>
                  </span>
                </div>
                <Pill tone="warning">Source page linked</Pill>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
