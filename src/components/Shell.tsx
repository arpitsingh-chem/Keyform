import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  IconBook,
  IconChart,
  IconClock,
  IconFile,
  IconHome,
  IconKeyboard,
  IconMenu,
  IconClose,
  IconRevision,
  IconSettings,
  IconSpell,
  IconTracks,
} from './icons';
import { Wordmark } from './ui';

const groups: { label: string; items: { to: string; label: string; Icon: typeof IconHome }[] }[] = [
  {
    label: 'Workspace',
    items: [
      { to: '/workspace', label: 'Overview', Icon: IconHome },
      { to: '/exams', label: 'Exam tracks', Icon: IconTracks },
      { to: '/practice', label: 'Typing practice', Icon: IconKeyboard },
      { to: '/mocks', label: 'Mock tests', Icon: IconClock },
      { to: '/previous-years', label: 'Previous years', Icon: IconFile },
    ],
  },
  {
    label: 'Learning',
    items: [
      { to: '/vocabulary', label: 'Vocabulary', Icon: IconBook },
      { to: '/grammar', label: 'Grammar', Icon: IconSpell },
      { to: '/revision', label: 'Revision', Icon: IconRevision },
    ],
  },
  {
    label: 'Insights',
    items: [{ to: '/analytics', label: 'Analytics', Icon: IconChart }],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.label}>
          <div className="rail-group-label">{group.label}</div>
          <div className="rail-nav">
            {group.items.map(({ to, label, Icon }) => (
              <NavLink key={to} to={to} className="rail-link" onClick={onNavigate}>
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="shell">
        <aside className="rail" aria-label="Primary">
          <Link to="/" style={{ textDecoration: 'none' }} aria-label="Keyform — introduction">
            <Wordmark />
          </Link>
          <nav aria-label="Primary navigation" className="stack" style={{ gap: 'var(--space-4)' }}>
            <NavLinks />
          </nav>
          <div className="rail-foot">
            <NavLink to="/settings" className="rail-link">
              <IconSettings size={18} />
              <span>Settings</span>
            </NavLink>
          </div>
        </aside>

        <div style={{ minWidth: 0 }}>
          <header className="mobile-header">
            <Link to="/" style={{ textDecoration: 'none' }} aria-label="Keyform — introduction">
              <Wordmark compact />
            </Link>
            <button
              type="button"
              className="mobile-menu-button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <IconClose size={18} /> : <IconMenu size={18} />}
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </header>
          {menuOpen ? (
            <div className="mobile-nav" id="mobile-navigation">
              <nav aria-label="Primary navigation (mobile)" className="stack" style={{ gap: 'var(--space-4)' }}>
                <NavLinks onNavigate={() => setMenuOpen(false)} />
                <NavLink to="/settings" className="rail-link" onClick={() => setMenuOpen(false)}>
                  <IconSettings size={18} />
                  <span>Settings</span>
                </NavLink>
              </nav>
            </div>
          ) : null}

          <main className="main" id="main-content" tabIndex={-1}>
            <div className="main-inner">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
