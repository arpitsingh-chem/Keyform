# QA record

Every check below was executed. Anything not executed is listed separately under
"Not yet executed" rather than implied by omission.

## Environment

- Date: 20 November 2026
- Node 20.20.2, npm 10.8.2
- Chromium (Playwright headless shell 159.0.8154.6) at 1440×1000, 1920×1080, 768×1024, 360×780
- Dev server: Vite 5.4.21 on `http://127.0.0.1:5173`

## Commands executed

| Command | Result |
|---|---|
| `npx tsc -b --noEmit` | Passed, no type errors |
| `npx vitest run` | 37 tests passed in 3 files |
| `npm run build` | Passed; `dist/` = 0.69 kB HTML, 17.05 kB CSS (3.88 kB gzip), 272.39 kB JS (82.65 kB gzip) |
| `node scripts/smoke.mjs` | 37 browser checks passed, 0 failed, 0 console errors |

## Version 0.2.0 re-run (20 November 2026)

| Command | Result |
|---|---|
| `npx tsc -b --noEmit` | clean |
| `npx vitest run` | **53 tests passed** in 4 files |
| `npm run build` | passed; JS 298.96 kB (89.45 kB gzip), CSS 17.05 kB (3.88 kB gzip) |
| `node scripts/smoke.mjs` (dev server) | **44/44 checks passed**, 0 console errors |
| `node scripts/smoke.mjs` (production build, static server) | **44/44 checks passed**, 0 console errors |

New coverage added in 0.2.0:

- `tests/backup.test.ts` (11): round trip, dated file name, rejection of non-JSON / wrong format /
  unsupported version / missing collections, dropping unknown or malformed attempts with counts,
  and settings sanitisation (bad theme, out-of-range goal, unknown session length, missing object).
- `tests/content.test.ts` (+3): bank size, option-position balance without any answer text changing,
  error-detection part labels left in place, and explanations free of positional wording.
- Browser: backup download (dated filename, valid payload), restore into the app, recall mode hiding
  the options and revealing them after submission.

## Automated test coverage (0.1.0 baseline)

`tests/answer.test.ts` (17)
- trimming, lowercasing, whitespace collapsing, NFKC compatibility characters
- punctuation preserved; no word dropping
- letter parsing (accepts `b`, rejects `bc`/`E`/free text)
- near-miss rejection (`careful`, `very carefull`, `very-careful`, `very careful.`)
- empty answer separated from a mismatch
- IME composition does not submit; Shift+Enter does not submit

`tests/stats.test.ts` (9)
- accuracy is null before the first submission and computed from submitted answers only
- answers-per-minute, zero-duration guard
- duration formatting
- streak across consecutive days, yesterday-only streak, stale streak
- seven-day activity series

`tests/content.test.ts` (11)
- unique IDs, known topics, known exam codes
- exactly four distinct non-empty options, valid `correctIndex`
- explanation and prompt minimum lengths
- provenance status validity; no item claims `verified_official_paper`
- no duplicate prompt/answer pairs
- each item's own expected answer is accepted in both modes
- every wrong option is rejected as a text answer
- at least 10 items per exam track

## Browser checks (`qa/smoke-report.json`)

37 passing checks, including:
- introduction renders, skip link present, demonstration status disclosed
- dashboard route and headline metrics
- answer field receives focus on load
- empty submission refused with an `role="alert"` message
- wrong answer shows "Not quite" plus the reason
- answer input is read-only after submission
- a full session can be completed; the summary screen appears
- the field resets on "Next question"
- **8 of 8 items accepted when typed in different case with surrounding spaces**
- attempts appear in analytics and survive a page reload (IndexedDB)
- all seven secondary routes render their expected heading
- mock timer present; omitted answers reported separately from incorrect ones
- dark theme applies via `data-theme="dark"`
- no horizontal overflow at 360px and 768px
- mobile menu button present
- unknown route offers recovery
- zero console errors and zero page errors during the run

Screenshots: `qa/screenshots/` (introduction 1440/1920, dashboard dark 1440, dashboard 360, practice 360,
dashboard 768).

## Defects found and fixed during QA

1. **Practice re-shuffled the question set mid-session.** The session items were memoised on the
   identity of the array passed by the parent, which was rebuilt on every render, so advancing a
   question could show an unrelated item while the counter moved on. Found by the browser check that
   answers each item correctly in a second session. Fixed by fixing the order once per mounted
   session (`useState` initialiser) and memoising the parent's filter.
2. **Brand mark contrast in dark mode.** The key mark inherited a light primary colour, leaving white
   strokes on a pale field. Fixed with a fixed violet field in both themes.
3. **Track emblem ink.** Pastel illustration fields now always carry dark ink instead of inheriting a
   theme colour.
4. **"1 answers"** in recent sessions; pluralised.

## Not yet executed

- Firefox and Safari rendering (browsers were not available in this environment).
- Screen-reader passes (NVDA, JAWS, VoiceOver, TalkBack).
- Physical-device testing, including a real hardware keyboard on a phone and soft-keyboard layout.
- Automated axe/contrast scanning and Lighthouse performance scoring.
- 200% zoom and text-spacing overrides.
- Cloud sync, authentication and database row-level security (not implemented).
- Deployment to Cloudflare Pages (no account authorization yet).

## Live deployment verification (20 November 2026)

URL: https://steep-dew-97ac.getsetflytech0209.workers.dev (Cloudflare Workers static assets, free plan).

| Check | Result |
|---|---|
| `curl -I` over HTTPS | `HTTP/2 200`, `content-type: text/html`, served by Cloudflare |
| JS asset | 200, `application/javascript`, 273,238 bytes |
| CSS asset | 200, `text/css`, 17,046 bytes |
| Browser suite against the public URL | **37/37 checks passed, 0 console errors** |
| Storage persistence on the live site | attempts survived a reload (16 before, 16 after) |
| Mobile 360 px on the live site | no horizontal overflow; menu button present |

Report: `qa/smoke-report-live.json`. Screenshots: `qa/live-screenshots/`.

Observed, not a defect: plain `http://` also returns 200 rather than redirecting to HTTPS. The
`workers.dev` hostname has no zone-level redirect setting. Recorded as a follow-up, not fixed.

Still not executed: Firefox/Safari, screen-reader passes, axe and Lighthouse scoring, physical
device testing.
