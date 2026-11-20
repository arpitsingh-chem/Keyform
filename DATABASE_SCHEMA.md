# Data Schema

## MVP question JSON
```json
{
  "id": "cds-vocab-0001",
  "exam": ["CDS"],
  "year": null,
  "category": "vocabulary",
  "subcategory": "synonyms",
  "type": "mcq_typed_answer",
  "prompt": "Choose the synonym of ...",
  "options": [{"id":"A","text":"..."},{"id":"B","text":"..."},{"id":"C","text":"..."},{"id":"D","text":"..."}],
  "correctOptionId": "B",
  "acceptedAnswers": ["..."],
  "normalization": "casefold_trim_collapse_whitespace",
  "explanation": "...",
  "difficulty": "medium",
  "provenance": {"status":"original_platform_practice","sourceName":null,"sourceUrl":null,"verificationDate":null,"reviewerNotes":""},
  "tags": []
}
```

## Validation rules
- Unique stable `id`; exam/category/type use enumerated values.
- Exactly four options for standard MCQ; option IDs unique.
- `correctOptionId` must reference exactly one option.
- At least one accepted answer and an explanation for released questions.
- PYQ status requires examination, year, source URL and a recorded verification date.
- No `verified_official_paper` status without checking the source paper.
- Exact normalized matching only for ordinary answer checking; spelling exercise rules are separately declared and tested.
- Detect duplicate IDs, exact duplicate stems and near-duplicate candidates for human review.

## Local records
`Attempt`: questionId, sessionId, exam, category, submittedAt, isCorrect, elapsedMs, answer outcome (avoid retaining raw text unless needed), contentVersion.
`Session`: id, startedAt, endedAt, mode, filters, questionIds, correctCount, incorrectCount, durationMs.
`Bookmark`: questionId, createdAt.
`Settings`: theme, sound, preferred session settings.

## Optional cloud tables
Do not create until cloud scope is approved. Proposed minimal tables: `profiles` (auth user ID, minimal preferences), `attempts` (owner ID, question ID/content version, correctness, timestamp, elapsed time), `bookmarks` (owner ID, question ID), `sync_metadata` (owner ID, device ID, updated timestamp). Enforce row-level security for every user-owned table. Never store service-role credentials in the browser. Define retention, deletion and conflict rules before enabling sync.

## Formats
JSON is runtime source for MVP. CSV may be used for editorial interchange, not canonical storage. PostgreSQL is reserved for optional cloud records; local SQLite is not needed for static hosting.
