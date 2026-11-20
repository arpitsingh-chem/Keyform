# Feature Specification

## MVP
- Exam selection: CDS, NDA, AFCAT.
- Topic practice and mixed practice; difficulty and exam filters.
- Typed MCQ answer field; options are shown as reference, not clickable answers.
- Case-insensitive exact check with trim and defined whitespace normalization; no fuzzy matching for ordinary questions.
- Enter submits; accessible focus order; feedback, correct option, explanation and next action.
- Progress, accuracy, elapsed time, answered-per-minute, streak; pause/resume and retry incorrect.
- IndexedDB local attempts, bookmarks, incorrect queue, progress dashboard, export and reset.
- Responsive, keyboard-operable, reduced-motion-aware interface.

## Version 2
- Topic lessons, vocabulary collections, spelling mode, richer revision scheduling, mock test configurations and expanded analytics.
- Spelling mode can use its own explicitly configured tolerance policy; disclose and explain corrections. It must not alter MCQ checking.

## Version 3
- Optional account sync, shared study groups, server-validated leaderboard, content editor and adaptive recommendations.

## Interaction states
Idle -> typing -> submitted (correct or incorrect) -> explanation/review -> next question. Prevent duplicate submission for the same item; clear or preserve answer according to tested navigation rules. Empty submissions show an actionable prompt and do not count as answered. Timer pause/resume must accurately exclude paused duration.

## Non-functional requirements
Mobile-first, robust without network after content is available, no mandatory account, clear data status, WCAG 2.2 AA target, fast initial load and versioned content.
