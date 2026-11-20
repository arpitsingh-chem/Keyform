# Changelog

All dates are local to the project (Asia/Kolkata).

## 0.2.0 — 20 November 2026

### Added
- **Backup and restore.** Download a JSON backup of attempts, saved items and preferences, and
  restore it on another device or browser. Import validates structure, refuses unknown formats and
  versions, drops records whose question no longer exists and reports how many were skipped.
- **Recall mode.** A setting that hides the four reference options until an answer is submitted, so
  a drill becomes pure recall. The options and the correct letter appear with the explanation.
- **49 new practice items** (batch 2), bringing the bank to **93 items** across seven topics. New
  grammar skills include reported speech, “be used to” gerunds, passive continuous and uncountable
  nouns; new comprehension passages cover briefs and practice-test interpretation.
- **Three error-detection items with “No error” answers**, so the skill is tested honestly rather
  than always assuming a fault exists.
- **Option-position balancing.** The correct answer was concentrated in one letter; positions are
  now rotated deterministically. No answer text changes, which is asserted by a test.
- `CHANGELOG.md`, `GITHUB-SETUP.md`, and three new QA artefacts.

### Changed
- Practice bank split into `questions.ts` (batch 1) and `questions-more.ts` (batch 2), merged behind
  a single `questions` export.
- Settings gained a fifth preference (`hideOptions`), including import sanitisation.
- Live site documentation updated with the deployed Cloudflare URL.

### Fixed
- (0.1.0, found by browser QA) practice set re-shuffled mid-session because the item list was
  memoised on a parent array identity; the order is now fixed once per mounted session.
- (0.1.0) brand mark contrast in dark mode; pastel track emblems now keep dark ink in both themes.

### Verified
- 53 unit and content-integrity tests passing.
- 44 Playwright checks passing against the development server, the production build, and the live
  Cloudflare URL.

## 0.1.0 — 20 November 2026

First working release: typed-answer practice engine with exact normalised checking, session
summaries, mock runs with deferred scoring, learning and revision pages, analytics, local
persistence with IndexedDB and fallbacks, light/dark themes, 44 original practice items, and a
deployed static site.
