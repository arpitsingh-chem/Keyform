# Project State

Last updated: 20 November 2026 · version 0.2.0

## Version 0.2.0 (this turn)

- Backup export/import with strict validation and graceful handling of unknown items.
- Recall mode: options hidden until submission.
- Practice bank grown from 44 to 93 original items; option positions balanced (A22/B27/C23/D21).
- Three new tests files/checks: 53 unit and content tests, 44 browser checks.
- GitHub publication package prepared: source zip, seven-commit git bundle, `GITHUB-SETUP.md`.
- The live site still serves 0.1.0 until the owner uploads `releases/keyform-site-v0.2.0.zip`.

## Shipped in 0.1.0

A working local-first application (v0.1.0) implementing the approved architecture and the
`Design.md` specification:

- Introduction, overview dashboard, exam tracks, topic pages, practice set-up.
- Typed-answer practice engine with exact normalized checking, letter mode, explanations,
  bookmarks, next/finish, and a session summary.
- Mock runs: countdown, navigator with review marks, confirm on submit, omitted vs incorrect,
  deferred solutions, raw scoring.
- Vocabulary, grammar, revision, analytics, settings, previously-linked sources page, 404 recovery.
- IndexedDB persistence with localStorage and session-only fallbacks; export of nothing (no
  accounts), delete-local-data with confirmation, print.
- Light/dark themes, responsive layouts, skip link, focus management, reduced-motion handling.
- 44 original practice items across 7 topics with provenance records.

## Verified by execution

- `npx tsc -b --noEmit` — clean.
- `npx vitest run` — 37 tests passing (answer engine, statistics, content integrity).
- `npm run build` — production build succeeds.
- `node scripts/smoke.mjs` — 37 browser checks passing in Chromium, 0 console errors, screenshots
  captured. See `QA.md` and `qa/smoke-report.json`.

One real defect was found by the browser run and fixed (practice set re-shuffling mid-session).

## Publishing status (updated this turn)

- Hosting choice confirmed by the owner: **Cloudflare Pages**.
- Production build re-verified: served `dist/` from a plain static server and ran the full browser
  suite against it — 37/37 checks passed, 0 console errors (`qa/smoke-report-built-site.json`).
- Upload artifact prepared and inspected: `releases/keyform-site-v0.1.0.zip` (86 KB, `index.html` at
  root plus `assets/`), scanned for secret-like strings — none found.
- Owner instructions written: `PUBLISH-CLOUDFLARE.md`.
- **Deployed and verified.** Live URL: **https://steep-dew-97ac.getsetflytech0209.workers.dev**
  (Cloudflare *Upload your static files* route, so the hostname is `workers.dev` rather than
  `pages.dev`).
- Live verification performed: HTTPS 200, correct HTML, both assets return 200 with correct MIME
  types, and the full browser suite passed **37/37 with 0 console errors** against the public URL
  (`qa/smoke-report-live.json`, screenshots in `qa/live-screenshots/`).

## Pending / next

1. Review the interface on your own devices and give feedback on design and learning flow.
2. Expand the question bank; each new item needs a provenance record and answer review.
3. Verify the AFCAT syllabus and scheme document, then finalise the AFCAT topic mapping.
4. Optional: Supabase project for account sync (needs your authorization, plus privacy and quota
   review). Not implemented; the app works without it.
5. Deployment to Cloudflare Pages: workflow is written, and the owner must add
   `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets and approve publishing.
6. Accessibility work still owed: screen-reader passes, axe scan, 200% zoom, physical keyboards.

## Not started

- Cloud sync, authentication, row-level security policies, leaderboards.
- Previous-year transcriptions or permissions.
- Firefox/Safari verification (browsers unavailable in this environment).

## Blocked

- GitHub-based automatic deployment: optional, awaits the owner creating a repository. The current
  site is updated by uploading a new zip.
- Cloud features: await explicit scope decision and account authorization.
