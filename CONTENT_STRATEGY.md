# Content Strategy

## Official-source basis
- UPSC NDA notices describe English in terms of understanding/workmanlike use of words; the 2026 notice expressly names grammar and usage, vocabulary, comprehension and cohesion in extended text.
- UPSC CDS notice provides the English paper scheme and broad standard; do not represent an unofficial exhaustive topic list as the official syllabus.
- AFCAT official guidelines page links to the syllabus and schemes document; inspect the current linked document before final exam mapping.
- Use official UPSC examination pages for paper availability and year-specific sources.

## Taxonomy
Vocabulary; grammar and usage; spelling/word formation; sentence correction/completion; reading comprehension; other categories only where substantiated. Maintain separate CDS, NDA and AFCAT mappings with evidence labels: official syllabus, observed official paper, or additional platform practice.

## Provenance labels
`verified_official_paper`, `adapted_from_cited_source`, `original_platform_practice`, `probable_pattern_practice`. Never call generated content a PYQ. Each item stores source URL, year when relevant, verification date and explanation.

## Acquisition and review
1. Locate official notification and paper.
2. Record title, exam, year, URL and source access date.
3. Transcribe only when reproduction rights are clear; otherwise link and create original practice.
4. Have answer and explanation checked independently.
5. Run schema, answer-reference and duplicate validation.
6. Publish status and corrections; retain review trail.

## Copyright safeguard
A publicly downloadable paper is not automatically permission to republish. Prefer links and original items. Obtain permission or appropriate legal advice before reproducing substantial official or third-party content. Do not scrape or copy paid question banks.

## Maintenance
Review official notices and exam pages for each new cycle. Record source review date and content version. Retire or flag obsolete exam-pattern/scoring rules rather than silently overwriting them.

## Option-position balance

Early batches placed most correct answers in position B, which lets a learner score without knowing
any English. `src/data/balance.ts` rotates each item's options to a deterministic target position
before release. Rules:

- Only order changes; the option set and the correct option text are unchanged, and
  `tests/content.test.ts` asserts this against the authored key.
- The rotation is deterministic, so keys stay stable across sessions and revival of old backups.
- Error-detection items are excluded: their options are the literal part labels (A)–(D) inside the
  sentence, so position carries meaning.

## Content review still owed

Batch 1 and batch 2 were written for this project and checked for internal consistency only. A
second, independent human review of every answer and explanation remains the main quality task
before the bank is described as exam-standard.
