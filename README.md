# Keyform

An independent, offline-first English practice workspace for CDS, NDA and AFCAT aspirants.
The core loop is **read → recall → type → explain → revisit**: you type the answer instead of
clicking a letter, and every attempt returns one reason.

> Keyform is not affiliated with UPSC, the Indian Air Force or any examination body. It does not
> present practice scores as official results. Practice items in this release are original material,
> not previous-year papers.

**Live site:** <https://steep-dew-97ac.getsetflytech0209.workers.dev>

## What exists in this release

- Introduction, overview dashboard, exam tracks, topic pages.
- Typed-answer practice with exact, case-insensitive, whitespace-tolerant checking.
- Letter mode (A–D) as an alternative answer mode.
- Explanations, bookmarking, retry, session summary.
- **Recall mode** that hides the four options until you submit.
- **Backup and restore** of local progress as a portable JSON file.
- Mock runs: timer, question navigator, review marks, confirm-on-submit, omitted vs incorrect,
  deferred solutions, raw scoring with no negative marking.
- Vocabulary and grammar learning pages, revision centre, analytics, settings.
- Local persistence through IndexedDB with a localStorage fallback and session-only fallback.
- Light and dark themes, responsive layouts from 360px to 1920px.

93 practice items across 7 topics, all labelled `original_platform_practice`, with the correct
answer spread evenly across A–D.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 53 unit and content-integrity tests
npm run build      # type-check and produce dist/
npm run preview    # serve the production build
```

Browser smoke check (needs a Playwright browser):

```bash
npx playwright install chromium
node scripts/smoke.mjs http://127.0.0.1:5173
```

It runs 44 checks and writes `qa/smoke-report.json` plus screenshots in `qa/screenshots/`.

## Project structure

```text
src/
  components/   Shell, practice engine, UI primitives, icons
  data/         exam tracks, topics, questions, learning content
  lib/          answer checking, statistics, storage, app store
  pages/        one file per route
  styles/       design tokens and layout
tests/          unit and content-integrity tests
scripts/        browser smoke check
qa/             generated reports and screenshots
docs/           planning and architecture notes (repository root)
```

## Answer checking

`src/lib/answer.ts` is the only place an answer is graded:

1. Unicode NFKC normalization.
2. Trim, collapse internal whitespace, lowercase.
3. Exact comparison. Punctuation is preserved and never stripped.

There is no fuzzy, partial or "close enough" acceptance. Letter mode accepts only A, B, C or D.
Empty submissions are refused and are not counted as answers.

## Content rules

Every question carries a provenance record. Allowed statuses are `verified_official_paper`,
`adapted_from_cited_source`, `original_platform_practice` and `probable_pattern_practice`.
No item may be described as a previous-year question without a checked official source, and the
test suite fails if a `verified_official_paper` claim appears without a source URL.

## Status and limitations

- No accounts, no server, no cloud sync. Progress lives in this browser; use the backup file to
  move it between devices.
- No previous-year transcription; official sources are linked, not copied.
- AFCAT topic mapping awaits review of the official syllabus and scheme document.
- Mock length, timing and marking are the workspace's own settings, not an exam scheme.
- Cloud sync (optional Supabase) is planned, not implemented.
