# Architecture

## Decision
Adopt a local-first hybrid web application. Cloudflare Pages hosts the static frontend. The core question bank is versioned JSON; practice and progress must continue without a cloud connection. Supabase Free is a later, optional service for authentication and cross-device progress synchronization, enabled only after the account, privacy, quota and deployment checks are approved.

## System diagram
```text
GitHub repository -> GitHub Actions (test/build/deploy) -> Cloudflare Pages
                                                            |
Browser: React/Vite/TypeScript -> static question JSON       |
           |                                                 |
           +-> IndexedDB (local attempts, bookmarks)         |
           +-> optional explicit sync -> Supabase Auth/Postgres
```

## Boundary and trust
The browser is untrusted. Never trust client-submitted scores for a public leaderboard or expose privileged service keys in client code. The MVP has no backend-dependent feature and collects no account data. Cloud sync is opt-in; access is constrained to a user's own records with database policies. Static content remains available if Supabase pauses or becomes unavailable.

## Technology choices
- Vite + React + TypeScript: component-driven, typed interface and static build.
- JSON + schema validation: editable, versioned question bank.
- IndexedDB: structured device-local history and bookmarks.
- Cloudflare Pages: static production hosting.
- Supabase Free, optional: authentication and Postgres sync; current quotas and inactivity pause are documented in project setup.
- Vitest, Playwright, ESLint: unit, browser-flow and code-quality checks.

## Routes
Use hash-based routing initially to avoid static-host rewrite configuration: `#/`, `#/practice/:exam/:topic`, `#/revision`, `#/progress`, `#/settings`, `#/learn/:exam/:topic`, `#/mock/:exam`. Unknown routes show a recovery link to Home.

## Data flow
Questions are loaded from static exam/topic JSON. A pure answer-normalization/checking module evaluates typed answers. Session state is kept in memory, and completed attempts are persisted to IndexedDB. Analytics are derived from attempt records, not separately maintained counters. Optional cloud sync is a separately tested adapter; local records remain canonical until sync conflict rules are implemented.

## Failure handling
- JSON/schema failure: show a clear content error and do not start a broken session.
- IndexedDB unavailable: fall back to session memory and explain that progress will not persist.
- Cloud unavailable/paused: continue local use, queue or defer sync, disclose status.
- Invalid route/filter: recover to a valid selection.

## Major decision record
| Decision | Reason | Alternatives | Limitation | Verification |
|---|---|---|---|---|
| Local-first | Works without backend and avoids account/data dependency | Cloud-only application | No sync in MVP | Disconnect network and complete practice |
| Cloudflare Pages | Free static host with service-side path available later | GitHub Pages, Firebase Hosting | quotas and terms may change | Production URL and deployment checks |
| Supabase optional | SQL/auth integration reduces custom backend work | Cloudflare D1, Firebase | inactivity pause/free quotas | Test auth, row policies, pause/failure mode |
| Static JSON MVP bank | Easy review and source control | SQL database | Release updates require deployment | Schema and answer validation in CI |
