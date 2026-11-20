# Project Plan

## Goal
Deliver an accessible, mobile-first CDS/NDA/AFCAT English practice platform whose core interaction is typing the answer to an MCQ. Prioritize reliable answer checking, traceable content and resilient local progress.

## Milestones
1. Architecture approval and design-reference review (approved: Cloudflare-oriented hosting if cloud features are needed; visual reference pending).
2. Foundation and documentation; reproducible dependencies and quality gates.
3. Approved responsive design system.
4. Typed-answer question engine with unit tests (first end-to-end feature).
5. Versioned, validated question data and provenance workflow.
6. IndexedDB progress, bookmarks, retry and export/reset.
7. Exam/topic learning modules and revision center.
8. Configurable mock tests and verified exam mappings.
9. Accessibility, performance, security and browser QA.
10. Cloudflare deployment; optional Supabase integration only after separate scope and privacy review.

## MVP boundary
Includes static question content, exact normalized answer checking, explanations, keyboard controls, topic practice, session metrics, local progress, retry, bookmarks, responsive layouts and export/reset. Excludes accounts, shared leaderboards and mandatory cloud services.

## Acceptance criteria
- Core practice is usable without account or database.
- Wrong answer never accepted through fuzzy matching.
- Data schema validates and every released item records provenance status.
- Tests cover answer normalization, session transitions, persistence failures and keyboard flow.
- Deployment URL, HTTPS, assets, navigation and practice flow verified before claiming release.
- Accessibility and responsive checks are recorded; unexecuted checks are explicitly marked.

## Timeline estimate
MVP: 2-4 weeks focused effort. First complete release: 5-9 weeks. Verified content expansion and advanced cloud features are ongoing and depend on review and account authorization.

## User decisions pending
- Share visual reference URL or screenshots.
- Decide whether sync is desired for first public release or remains a later optional feature.
- Review and approve educational content policy and any proposed reproduction permissions.

## Project status
Architecture direction approved by user on 2026-11-20: use a more service-oriented host if cloud features are needed. Static local-first core, Cloudflare Pages preferred, optional Supabase cloud sync. Implementation of the local-first release is complete in the workspace; nothing is deployed yet.

## Implementation status (20 Nov 2026)

Milestones 1-6 and most of 7-9 are implemented as a first working release; see PROJECT_STATE.md and QA.md for what was executed. Milestone 10 (maintenance) continues with content expansion and source review. Remaining user decisions: interface feedback, AFCAT syllabus mapping approval, and cloud/deployment authorization.
