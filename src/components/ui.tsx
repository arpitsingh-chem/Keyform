import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { ExamTrack } from '../data/content';
import { IconPlane, IconShield, IconSwords } from './icons';

export function SectionTitle({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div className="stack" style={{ gap: 2 }}>
        <h2>{title}</h2>
        {hint ? <span className="small muted">{hint}</span> : null}
      </div>
      {action}
    </div>
  );
}

export function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="metric">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {note ? <div className="metric-note">{note}</div> : null}
    </div>
  );
}

export function Progress({
  value,
  max,
  label,
  caption,
}: {
  value: number;
  max: number;
  label: string;
  caption?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="progress">
      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value} of ${max}`}
      >
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-caption">
        <span aria-hidden="true">{pct}%</span>
        <span>{caption ?? `${value} of ${max}`}</span>
      </div>
    </div>
  );
}

export function Pill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'error' | 'warning' | 'info';
}) {
  const className =
    tone === 'neutral' ? 'pill' : `pill pill-${tone}`;
  return <span className={className}>{children}</span>;
}

export function Note({
  children,
  tone = 'info',
}: {
  children: ReactNode;
  tone?: 'info' | 'warning';
}) {
  return (
    <div className={tone === 'warning' ? 'note note-warning' : 'note'}>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}

export function PrimaryLink({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={secondary ? 'btn btn-secondary' : 'btn btn-primary'} to={to}>
      {children}
    </Link>
  );
}

export function TrackEmblem({ track, size = 44 }: { track: ExamTrack; size?: number }) {
  const Icon =
    track.emblem === 'shield' ? IconShield : track.emblem === 'swords' ? IconSwords : IconPlane;
  return (
    <span
      className={`track-emblem tint-${track.tint}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Icon size={Math.round(size * 0.55)} />
    </span>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      {/* The key mark keeps a fixed violet field in both themes so the white strokes stay legible. */}
      <span className="brand-mark" aria-hidden="true" style={{ background: '#6547C8' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="6" width="20" height="12" rx="3" fill="#ffffff" opacity="0.18" />
          <rect
            x="2.9"
            y="6.9"
            width="18.2"
            height="10.2"
            rx="2.2"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <path d="M7 10.2h.01M11 10.2h.01M15 10.2h.01M7 13.8h6" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="14.6" y="12.6" width="4" height="3.2" rx="1" fill="#ffffff" />
        </svg>
      </span>
      <span className="stack" style={{ gap: 0 }}>
        <span className="brand-name">Keyform</span>
        {compact ? null : <span className="brand-sub">English workspace</span>}
      </span>
    </span>
  );
}
