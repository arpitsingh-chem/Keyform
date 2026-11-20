# Testing Strategy

## Automated layers
- Unit (Vitest): normalization, exact answer check, spelling-specific policy, metrics, timer/pause, retry and scoring.
- Data validation: schema, required provenance, valid answer references, unique IDs and duplicate candidates.
- Integration: question loading, session progression and IndexedDB persistence/fallback.
- End-to-end (Playwright): navigation, typed-answer correct/incorrect, keyboard submission, filters, reload persistence, export and reset.
- CI: install from lockfile, lint, typecheck, unit/integration tests and production build.

## Required edge cases
Correct, incorrect, upper/lower case, leading/trailing/multiple spaces, empty text, Unicode, repeated submissions, fast transitions, invalid data, offline and storage unavailable.

## Responsive viewport set
360, 375, 390, 768, 1024, 1440 and 1920 CSS pixels. Record actual browser/tool availability; never claim unavailable device/browser checks passed.

## Accessibility
Target WCAG 2.2 AA. Check keyboard-only flow, semantic names, labels, contrast, focus, announcements of result state, reduced motion and zoom/reflow. Combine automated checks with manual review.

## Performance and browser support
Run production build and Lighthouse where available; record LCP, CLS, INP, bundle size and date. Test current Chrome, Edge, Firefox and Safari where access exists. No metric is marked passed unless collected.

## Reports
Store dated test reports with commands, environment, pass/fail and known limitations. Fix failures and rerun regression suite before release.
