import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty">
      <span className="eyebrow">404</span>
      <h1>That page is not part of the workspace</h1>
      <p>
        The address may be mistyped, or a saved link may point to a page that has moved. Every page
        here is reachable from the overview.
      </p>
      <div className="btn-row">
        <Link className="btn btn-primary" to="/workspace">
          Go to overview
        </Link>
        <Link className="btn btn-secondary" to="/practice">
          Start practice
        </Link>
      </div>
    </div>
  );
}
