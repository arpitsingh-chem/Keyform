# Keyform · English preparation workspace
Design specification 1.0 • 20 November 2026 • Functional concept, not an official exam service.

## 1 / Product
Help CDS, NDA and AFCAT learners retrieve language, not merely recognize it. The core loop is **read → recall → type → explain → revisit**. Use original examples in the prototype. Do not imply that illustrative questions, scores, curricula or timings are official.

## 2 / Principles
One clear next action per surface. Preserve the familiar lettered exam format without turning choices into buttons. Give evidence of learning rather than a competitive leaderboard. Keep error recovery adjacent to the mistake. Separate practice (immediate explanations) from assessment (deferred scoring).

## 3–4 / Research and translation
Method: inspected publicly retrievable page contents on 20 November 2026. These are content/interface observations, not authenticated usability tests or pixel measurements. No account created. No proprietary graphics reused.

|Public source|Direct observation|Interpretation|Keyform decision|
|---|---|---|---|
|[Testbook](https://testbook.com/)|Popular Exams groups include Defence Exams; courses, practice questions and mock tests are separate offerings.|Exam identity is a useful first filter, but a huge catalogue is unnecessary here.|Three tracks; carry the selected exam into topics and practice. Separate a mock catalogue from the daily drill.|
|[Monkeytype](https://monkeytype.com/)|Public content exposes time/words/quote/zen/custom, duration presets, language and a word stream. The extracted page also contained a CSS-load warning.|Move configuration out of the main reading line. Keyboard continuity matters more than ornamental metrics.|One labelled answer field; contextual mode selector; Enter to submit and continue. No per-character correctness leakage.|
|[Duolingo](https://www.duolingo.com/)|Splash describes bite-sized lessons, points, levels, challenges and reminders.|Small finishable units encourage return visits.|Small daily goal, quiet streak badge and a session recap instead of confetti or a mascot.|
|[Khan Academy](https://www.khanacademy.org/)|Skip link, learner-role paths, course exploration, mastery-based practice, feedback and measurable progress are explicit.|Skills should have names, explanations and a visible place in a curriculum.|Exam → topic → skill → question. Present the reason after each practice attempt and link mistakes to revision.|

Limitations: public text and publicly linked illustrations were available; signed-in lessons, dashboards, live timers, focus behavior, exact dark palettes and reward transitions were not verified. Those details below are original proposals, not claims about the reference sites.

## 5 / Identity
Keyform: a calm study desk for deliberate English practice. Use direct verbs (Start session, Review answer), not military orders. Lower visual noise in the workspace, richer personality on the dashboard. Black geometric wordmark alongside a purple keyboard key. Icons: Lucide outlined, 18–20px, 1.7 stroke; never mix emoji and product icons. Original vector keyboard with dimensional caps and sparse technical construction marks; avoid official military insignia. Track emblems are generic shield, swords and plane.

## 6 / Semantic colours and dark mode (19)
|Token|Light|Dark|Use|
|---|---|---|---|
|primary|#6547C8|#BDAAFF|Active links, focus ring, primary action|
|secondary|#49337F|#D8CCFF|Hero heading and emphasis|
|accent|#E9E1FC|#352B49|Selected navigation, icon fields|
|background|#F8F9FC|#171721|Reading canvas|
|surface|#FFFFFF|#22222E|Panels, rail and header|
|elevated|#FCFBFF|#2B2939|Popovers, neutral controls|
|text|#20212B|#F3EFFA|Headings, answers|
|secondary text|#545462|#CCC8D4|Supporting copy|
|muted|#696976|#B8B3C2|Legends and metadata|
|border|#E3E3EA|#444350|Decorative dividers; use stronger outlines for fields|
|success|#246D52|#97DDBB|Correct + check icon|
|error|#AA3547|#FFA6B1|Incorrect + correction text|
|warning|#87501F|#F7C388|Review marker and streak|
|information|#355F9F|#A8C9FF|Source notes, neutral hints|

Keep pastel art bounded in its own light illustration field even in dark mode. Never invert assets globally. Use dark ink on pastel badges. Check text contrast on the actual composite colour, not a token in isolation.

## 7 / Typography
System sans stack: Arial, Helvetica, sans-serif; no font download required. System monospace only for numerals in timers and keyboard hints. H1 32/38, H2 22/28, H3 16/22; weights 650–750. Hero 34/38. Body 15/23, input 18/26, question 26/35, stats 26/30 tabular numerals. Labels 11–12/16, uppercase eyebrows +1px tracking; use sentence case for actions (14/20, 600). On phones reduce H1 to 27, questions to 22, keep inputs at least 16px. Limit explanation lines to 65–75 characters.

## 8–9 / Geometry
4px foundation with 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 steps. Desktop rail 216px; header 64px; main max-width 1490px including gutters. Main padding 30–40px. Hero full span, then four stat cards, then 3:2 track/activity columns. Use 16–20px gaps and 18–24px panel interiors. 12–16px card corners; 8px button radius; pills only for status. Quiet one-pixel borders, subtle shadow under primary call to action only. Do not stack elevated cards inside elevated cards.

## 10–12 / Navigation, sitemap and page contracts
Persistent rail: Workspace (overview, exam tracks, typing practice, mock tests, previous years); Learning (vocabulary, grammar, revision); Insights (analytics). Settings and profile at foot. Brand opens public introduction. Use hash routes so browser history and deep links work on static hosts. Topic selection is a child of exam tracks.

|Page|Primary hierarchy and behaviors|
|---|---|
|Introduction|Value proposition → how the typing loop works → exam selection → learning categories → start. Footer identifies independent demonstration.|
|Dashboard|Greeting and date → recommended typing session → four headline metrics → exam tracks and weekly activity → daily goal and revision suggestion → recent sessions. Sample status always visible.|
|Exams|Each track has distinct emblem, full name, completion value and next arrow; select to reveal topic list in that track. Progress is content coverage, not predicted exam rank.|
|Topics|Vocabulary, grammar, spelling, comprehension, sentence improvement, error detection, idioms and substitutions. Name + level + labelled progress + practice. Only offer drills that have actual sample items.|
|Typing|Context row and count, progress, question, lettered reference options, labelled input, submit. Inline feedback explains the relationship. Keep input and next action inside one panel.|
|Previous years|Exam/year/topic/search filters intersect. List matching records, source and verification. Unverified examples must never be presented as real exam papers. Empty state explains how to broaden filters.|
|Mocks|Exam → instructions and duration → timed answers → numbered navigator with saved/review status → confirm submit → results. Do not show solutions mid-test. Distinguish omitted from incorrect.|
|Vocabulary|Daily word, definition, grammatical class, example, synonyms and antonyms. Bookmark toggle with text; saved words appear in revision.|
|Grammar|Rule selector → concise rule → correct example → common mistake → targeted exercise. Avoid a dense textbook wall.|
|Revision|Mistakes, saved words and recent attempts grouped separately. Explain empty groups and provide a clear start action. Proposed schedule: retry after a day, extend after successful recall.|
|Analytics|Define the reporting window; show attempts, accuracy, time and streak. Weekly activity is question volume, not accuracy. Topic and exam breakdowns include numeric equivalents.|
|Settings|Persist theme, answer mode and preferences locally. Offer explicit confirmation before deleting local activity. No account or remote synchronization.|

## 13 / Typing state machine
Idle: show options as a semantic list, not fake radio buttons. Focus: 3px high-contrast outline outside the input. Typing: echo text normally; do not penalize correction before submission. Normalize Unicode (NFKC), trim whitespace, collapse runs of spaces, lowercase English. Preserve punctuation. Full mode accepts answer text only; letter mode accepts A–D only. Enter submits unless composing via IME. Reject empty responses without advancing. Snapshot answer and lock editing on submission. Show “Correct” or “Not quite”, the expected answer and one reason. Focus Next question; Enter proceeds once. Next resets field, increments count and restores focus. Local sample content is synchronous: do not add fake loading. For remote content use aria-busy, retain panel height and retry in place. Completion reports correct / total and accuracy; allow a new session or return to overview. Clock is informational except in mock mode. Accuracy denominator is submitted items only; show dash before first submission.

## 14 / Engagement
Goal counts completed answers, not page views. Daily streak is consecutive local calendar days with at least one submission. Production: calculate from dated events and define time zone; prototype historical values are illustrative. Weekly goal badge after five study days; mastery milestone after completing all skills in a topic. Personal best compares equivalent drill modes only. Optional reminder belongs in settings, off by default, not an unsolicited notification. Never interrupt the typing field to celebrate. Missed days use neutral language.

## 15–16 / Components and interaction contracts
|Component|Construction / behavior|
|---|---|
|Buttons|Primary filled violet for one main action; secondary surface + border, tertiary text. Hover darkens or tints, pressed translates 1px, keyboard focus outside edge. Disabled native disabled with reason nearby. Pending keeps width and swaps label to Working… .|
|Input|Visible label, border stronger than card edges, 44px minimum field height. Hint associated by aria-describedby; error prefix plus text. Read-only after submit.|
|Navigation|Icon + text; active accent fill and aria-current. Mobile menu toggle announces expanded state. Skip link precedes navigation.|
|Card|Surface, border, no arbitrary gradients. Interactive whole-row button or link, not clickable div. Hover border darkens; noninteractive metrics have no hand cursor.|
|Question / options|Readable measure, four individually lettered options; 2 × 2 desktop / one column mobile. Grade typed answer, not option click.|
|Progress / stats|Text percentage alongside bar; hide redundant visual from AT. Numbers with tabular figures. State what numerator means. Timer not a live region every second.|
|Modal|Native dialog or browser confirmation for destructive actions. Escape cancels; retain focus on cancellation; give submit consequences before acceptance.|
|Tabs / filters|Prefer native select for compact choices. If implementing tabs use roving tabindex, arrow keys and associated panel. Filter intersection is deterministic; never silently drop filters.|
|Notifications|Inline polite status for submission, bookmark or reset; reserve alert for blocking failure. Do not rely on a vanishing toast.|
|Tooltip|Supplementary only, shown on focus and hover, dismissible with Escape. Icon-only controls always have accessible names; no tooltip-only instructions.|
|Empty / loading / failure|Explain why empty then offer one action. Loading placeholders match final geometry, no repetitive shimmer. Failure retains answer draft; retry should be idempotent.|

## 17 / Responsive behavior
At 1440/1920 keep a persistent rail and cap measure; allow wide whitespace beyond content cap. At 1024 compress gutters/rail and allow recommendations to wrap. At 768 use header menu instead of rail; metric grid two across; lower panels stack. At 390/375/360 stack practice options; reduce illustration prominence, use two short stat cards per row, avoid fixed bottom actions that the software keyboard obscures. Maintain document scroll and no horizontally scrolling body. No orientation lock.

## 18 / Accessibility target
WCAG 2.2 AA target, not certification. Text contrast 4.5:1, large text 3:1; functional control boundaries 3:1 when needed. Focus-visible ring 3px with 3px offset. Avoid positive tabindex and global letter shortcuts. Respect reduced motion. Pair colour with numbers, words or icons; charts require accessible labels. Primary forms work without pointer input. Test 200% zoom, screen reader order, touch and soft keyboard on physical devices before launch.

## 20–21 / Tokens and implementation
CSS custom properties at :root, dark overrides at html[data-theme=dark]. Components consume semantic roles, not exam-specific brand colour for grading. Track tints: mint for CDS, peach for NDA, lilac for AFCAT. Reuse TrackRow, Sparkline, Metric, SectionTitle and page shell. Store question {topic, prompt, options, correctIndex, explanation}; resolve expected answer at submission, never evaluate free-form code. Use stable content IDs in production. Store only local demonstration preferences and attempts. Do not store personal credentials. Chart samples and attempt logs are separate datasets: do not suggest historical values are remote user records. Production migration: replace local data behind repository layer, verify paper provenance, version answer keys, define mock scoring/negative marking per official exam, then audit keyboard flow and data retention.

## 22 / Release checklist
- [ ] Every route has a title and a way back; browser Back works.
- [ ] Validate full text, letter, blank, repeated Enter, normalization and IME.
- [ ] Test correct/incorrect, next, completion, revision and interrupted sessions.
- [ ] Check real hardware keyboard on phones, focus order and reduced motion.
- [ ] Check all seven target widths and contrast in both themes.
- [ ] Verify mock cancellation, expiry and unanswered scoring.
- [ ] No sample question labelled verified; no score presented as an official result.
- [ ] Build, exercise live UI, capture screenshots; separate executed checks from planned checks in QA.md.
