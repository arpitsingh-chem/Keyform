import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { trackByCode, topicById } from '../data/content';
import { questionsFor } from '../data/questions';
import { PracticeSession } from '../components/PracticeSession';
import { useStudy } from '../lib/store';

export default function PracticeTopic() {
  const { code, topic } = useParams();
  const { settings, ready } = useStudy();
  const track = trackByCode(code);
  const topicInfo = topicById(topic);

  if (!track || !topicInfo) {
    return (
      <div className="empty">
        <h1>That practice link is not valid</h1>
        <p>
          The track or topic in this address does not exist. Choose a topic from the practice setup
          instead of editing the address.
        </p>
        <Link className="btn btn-primary" to="/practice">
          Open practice setup
        </Link>
      </div>
    );
  }

  const items = useMemo(
    () => questionsFor(track?.code ?? '', topicInfo?.id ?? ''),
    [track?.code, topicInfo?.id],
  );

  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>No released items for {topicInfo.name} in {track.code}</h2>
        <p>
          This topic has no reviewed practice questions for this track yet. Another topic will have
          material, and nothing is generated to fill an empty set.
        </p>
        <Link className="btn btn-primary" to={`/exams/${track.code}`}>
          Back to {track.code} topics
        </Link>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="quiz-panel" aria-busy="true">
        <p className="lead">Preparing your session…</p>
      </div>
    );
  }

  return (
    <PracticeSession
      questions={items}
      exam={track.code}
      topic={topicInfo.id}
      answerMode={settings.answerMode}
      sessionLength={settings.sessionLength}
      backTo={`/exams/${track.code}`}
      backLabel={`${track.code} topics`}
      title={`${track.code} · ${topicInfo.name}`}
    />
  );
}
