import type { Question } from './content';
import { moreQuestions } from './questions-more';
import { balanceOptionPositions } from './balance';

/**
 * Practice bank, version 1.
 *
 * Every item in this file is ORIGINAL practice material written for Keyform.
 * None of it is reproduced from an official paper, and none of it is labelled
 * as a previous-year question. Provenance is recorded on each record so the
 * interface can state that plainly.
 */
const ORIGINAL = {
  status: 'original_platform_practice',
  note: 'Written for this prototype. Not an official question and not a previous-year paper.',
} as const;

const baseQuestions: Question[] = [
  /* ---------------- Vocabulary ---------------- */
  {
    id: 'vocab-001',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'vocabulary',
    skill: 'Synonyms',
    level: 'developing',
    prompt: 'Choose the word closest in meaning to “abate”.',
    options: ['increase', 'lessen', 'delay', 'assist'],
    correctIndex: 1,
    explanation:
      'To abate is to become less intense or widespread, so “lessen” is the closest meaning. “Delay” describes timing, not intensity.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'vocab-002',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'vocabulary',
    skill: 'Antonyms',
    level: 'foundation',
    prompt: 'Choose the word most nearly opposite to “frugal”.',
    options: ['thrifty', 'wasteful', 'careful', 'modest'],
    correctIndex: 1,
    explanation:
      'Frugal means economical or sparing. “Thrifty” and “careful” are near-synonyms; “wasteful” is the opposite.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'vocab-003',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'vocabulary',
    skill: 'One-word substitution',
    level: 'developing',
    prompt: 'One word for “a person who speaks many languages”.',
    options: ['polyglot', 'linguist', 'orator', 'pedant'],
    correctIndex: 0,
    explanation:
      'A polyglot speaks several languages. A linguist studies language as a subject, which is not the same thing.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'vocab-004',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'vocabulary',
    skill: 'Synonyms',
    level: 'developing',
    prompt: 'Choose the word closest in meaning to “tenacious”.',
    options: ['stubborn', 'generous', 'brief', 'timid'],
    correctIndex: 0,
    explanation:
      'Tenacious means holding on firmly. “Stubborn” is the closest of the four, since it also describes persistence that resists being moved.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'vocab-005',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'vocabulary',
    skill: 'Antonyms',
    level: 'secure',
    prompt: 'Choose the word most nearly opposite to “candid”.',
    options: ['frank', 'evasive', 'open', 'blunt'],
    correctIndex: 1,
    explanation:
      'Candid means open and direct. “Frank” and “blunt” share that sense, while “evasive” is the true opposite.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'vocab-006',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'vocabulary',
    skill: 'Word in context',
    level: 'foundation',
    prompt: 'Choose the word that best completes the sentence: “The officer remained ___ despite repeated provocations.”',
    options: ['composed', 'composing', 'composure', 'composedly'],
    correctIndex: 0,
    explanation:
      'The verb “remained” is completed by a subject complement, which needs the adjective “composed”. “Composure” is a noun and “composedly” is an adverb.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'vocab-007',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'vocabulary',
    skill: 'Word in context',
    level: 'developing',
    prompt: 'Choose the word closest in meaning to “meticulous”.',
    options: ['careless', 'very careful', 'hurried', 'doubtful'],
    correctIndex: 1,
    explanation:
      'Meticulous describes extreme attention to detail, so “very careful” fits. “Careless” is its opposite.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'vocab-008',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'vocabulary',
    skill: 'Antonyms',
    level: 'foundation',
    prompt: 'Choose the word most nearly opposite to “scarce”.',
    options: ['rare', 'plentiful', 'costly', 'limited'],
    correctIndex: 1,
    explanation:
      'Scarce means in short supply. “Rare” and “limited” point the same way; “plentiful” is the opposite.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },

  /* ---------------- Grammar and usage ---------------- */
  {
    id: 'gram-001',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'grammar',
    skill: 'Subject–verb agreement',
    level: 'developing',
    prompt: 'Choose the correct option: “Neither the cadet nor the instructors ___ aware of the change.”',
    options: ['was', 'were', 'is', 'has'],
    correctIndex: 1,
    explanation:
      'With “neither … nor”, the verb agrees with the nearer subject, “instructors”, which is plural: “were”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'gram-002',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'grammar',
    skill: 'Prepositions',
    level: 'foundation',
    prompt: 'Choose the correct option: “He has been serving in the unit ___ 2019.”',
    options: ['for', 'since', 'from', 'during'],
    correctIndex: 1,
    explanation:
      '“Since” marks the starting point of an action that continues into the present. “For” would need a duration such as “six years”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'gram-003',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'grammar',
    skill: 'Active to passive voice',
    level: 'developing',
    prompt: 'Choose the correct passive form of “The sergeant briefed the squad.”',
    options: [
      'The squad was briefed by the sergeant.',
      'The squad is briefed by the sergeant.',
      'The squad has briefed the sergeant.',
      'The sergeant was briefed by the squad.',
    ],
    correctIndex: 0,
    explanation:
      'The original is simple past and active, so the passive needs “was briefed” and the object “the squad” becomes the subject.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'gram-004',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'grammar',
    skill: 'Conditionals',
    level: 'secure',
    prompt: 'Choose the correct option: “If I ___ the timetable earlier, I would have finished the drill.”',
    options: ['knew', 'had known', 'know', 'would know'],
    correctIndex: 1,
    explanation:
      'A past unreal condition uses “had + past participle” in the if-clause, followed by “would have + past participle”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'gram-005',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'grammar',
    skill: 'Subject–verb agreement',
    level: 'secure',
    prompt: 'Choose the correct option: “The report, along with its annexures, ___ submitted yesterday.”',
    options: ['was', 'were', 'have', 'are'],
    correctIndex: 0,
    explanation:
      '“Along with its annexures” is a parenthetical addition, so the subject remains the singular “report”: “was submitted”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'gram-006',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'grammar',
    skill: 'Relative clauses',
    level: 'secure',
    prompt: 'Choose the correct option: “She is one of those officers who ___ punctuality.”',
    options: ['value', 'values', 'valued', 'is valuing'],
    correctIndex: 0,
    explanation:
      'The relative pronoun “who” refers to “officers”, which is plural, so the plural verb “value” is required. The singular “values” would agree with “she”, which is not the antecedent of “who” here.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'gram-007',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'grammar',
    skill: 'Inversion after “hardly”',
    level: 'secure',
    prompt: 'Choose the correct option: “Hardly had the parade begun ___ it started to rain.”',
    options: ['than', 'when', 'then', 'that'],
    correctIndex: 1,
    explanation:
      '“Hardly … when” is the fixed pair. “No sooner … than” is the equivalent pattern with a different first word.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'gram-008',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'grammar',
    skill: 'Adjectives with “to”',
    level: 'developing',
    prompt: 'Choose the correct sentence.',
    options: [
      'He is senior than me by two years.',
      'He is senior to me by two years.',
      'He is more senior than I by two years.',
      'He is senior from me by two years.',
    ],
    correctIndex: 1,
    explanation:
      'The adjectives senior, junior, superior and inferior take “to”, not “than”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'gram-009',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'grammar',
    skill: 'Gerunds after prepositions',
    level: 'developing',
    prompt: 'Choose the correct option: “I look forward to ___ from you.”',
    options: ['hear', 'hearing', 'heard', 'be hearing'],
    correctIndex: 1,
    explanation:
      '“To” here is a preposition inside the phrase “look forward to”, so it is followed by the gerund “hearing”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'gram-010',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'grammar',
    skill: 'Distributive pronouns',
    level: 'foundation',
    prompt: 'Choose the correct option: “Each of the trainees ___ submitted the form.”',
    options: ['have', 'has', 'are', 'were'],
    correctIndex: 1,
    explanation:
      '“Each of” is followed by a plural noun but takes a singular verb: “has submitted”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },

  /* ---------------- Spelling ---------------- */
  {
    id: 'spell-001',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'spelling',
    skill: 'Correctly spelt word',
    level: 'foundation',
    prompt: 'Choose the correctly spelt word.',
    options: ['occurence', 'occurrence', 'occurrance', 'ocurrence'],
    correctIndex: 1,
    explanation:
      '“Occurrence” doubles the “r” and keeps the “e” before “-nce”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'spell-002',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'spelling',
    skill: 'Correctly spelt word',
    level: 'foundation',
    prompt: 'Choose the correctly spelt word.',
    options: ['accomodation', 'accommodation', 'acommodation', 'accomodattion'],
    correctIndex: 1,
    explanation:
      '“Accommodation” has double “c” and double “m” after the initial “a”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'spell-003',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'spelling',
    skill: 'Correctly spelt word',
    level: 'developing',
    prompt: 'Choose the correctly spelt word.',
    options: ['perseverance', 'perserverance', 'perseverence', 'preseverance'],
    correctIndex: 0,
    explanation:
      'The word is “perseverance”: persevere plus “-ance”. The “e” after “v” is kept and the ending is “-ance”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'spell-004',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'spelling',
    skill: 'Doubled consonants',
    level: 'developing',
    prompt: 'Choose the correctly spelt word.',
    options: ['commited', 'committed', 'comitted', 'committeed'],
    correctIndex: 1,
    explanation:
      'The final consonant is doubled before “-ed” in “committed”, just as in “planned”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'spell-005',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'spelling',
    skill: 'Common misspellings',
    level: 'secure',
    prompt: 'Choose the correctly spelt word.',
    options: ['maintainance', 'maintenance', 'maintenence', 'maintinance'],
    correctIndex: 1,
    explanation:
      '“Maintenance” keeps “mainten-” and ends in “-ance”. It is not formed by adding “-ance” to “maintain”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'spell-006',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'spelling',
    skill: 'Common misspellings',
    level: 'secure',
    prompt: 'Choose the correctly spelt word.',
    options: ['pronounciation', 'pronunciation', 'pronuntiation', 'prononciation'],
    correctIndex: 1,
    explanation:
      'The noun is “pronunciation”, without the “o” found in the verb “pronounce”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },

  /* ---------------- Comprehension ---------------- */
  {
    id: 'comp-001',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'comprehension',
    skill: 'Main idea',
    level: 'developing',
    passage:
      'A disciplined routine is not a punishment. It is a structure that frees attention for the work that matters. Learners who plan their study in short, regular blocks often retain more than those who wait for long, rare sessions. The habit matters more than the hours.',
    prompt: 'According to the passage, the main benefit of a routine is that it',
    options: [
      'shortens the number of study hours',
      'frees attention for important work',
      'removes the need for rest',
      'replaces long sessions entirely',
    ],
    correctIndex: 1,
    explanation:
      'The second sentence states the benefit directly: the routine is “a structure that frees attention for the work that matters”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'comp-002',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'comprehension',
    skill: 'Inference',
    level: 'developing',
    passage:
      'A disciplined routine is not a punishment. It is a structure that frees attention for the work that matters. Learners who plan their study in short, regular blocks often retain more than those who wait for long, rare sessions. The habit matters more than the hours.',
    prompt: 'The passage suggests that short, regular blocks',
    options: [
      'are less effective than rare long sessions',
      'support better retention',
      'should replace all planning',
      'suit only experienced learners',
    ],
    correctIndex: 1,
    explanation:
      'The third sentence says those who plan in short, regular blocks “often retain more”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'comp-003',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'comprehension',
    skill: 'Tone',
    level: 'secure',
    passage:
      'A disciplined routine is not a punishment. It is a structure that frees attention for the work that matters. Learners who plan their study in short, regular blocks often retain more than those who wait for long, rare sessions. The habit matters more than the hours.',
    prompt: 'The tone of the passage is best described as',
    options: ['instructive and reassuring', 'sarcastic', 'alarmed', 'neutral reporting'],
    correctIndex: 0,
    explanation:
      'The writer explains a practical idea and reassures the reader that routine “is not a punishment”, which is instructional rather than critical or alarmed.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'comp-004',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'comprehension',
    skill: 'Author’s point',
    level: 'secure',
    passage:
      'Maps are arguments as much as instruments. Every map chooses what to show and what to omit, and those choices shape what a reader believes about a place. A route map that hides a difficult crossing is not lying about distance; it is answering a different question.',
    prompt: 'The author’s main point about maps is that they',
    options: [
      'are unreliable for measuring distance',
      'always mislead their readers',
      'reflect choices about what matters',
      'should show every available feature',
    ],
    correctIndex: 2,
    explanation:
      'The first two sentences state that selection, not deception, defines a map: “every map chooses what to show and what to omit”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'comp-005',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'comprehension',
    skill: 'Use of example',
    level: 'secure',
    passage:
      'Maps are arguments as much as instruments. Every map chooses what to show and what to omit, and those choices shape what a reader believes about a place. A route map that hides a difficult crossing is not lying about distance; it is answering a different question.',
    prompt: 'The route-map example is used to show that',
    options: [
      'maps can serve different purposes',
      'mapmakers conceal dangers deliberately',
      'distances cannot be measured accurately',
      'readers usually ignore maps',
    ],
    correctIndex: 0,
    explanation:
      'The example illustrates that a map may answer “a different question”, which is a purpose, not a deliberate deception.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },

  /* ---------------- Sentence improvement ---------------- */
  {
    id: 'impr-001',
    exams: ['CDS', 'NDA'],
    topic: 'sentence-improvement',
    skill: 'Correlative conjunctions',
    level: 'developing',
    prompt: 'Choose the word that makes the sentence standard English: “No sooner did the bell ring ___ the trainees assembled.”',
    options: ['than', 'when', 'then', 'that'],
    correctIndex: 0,
    explanation:
      '“No sooner … than” is the fixed pair. “Hardly … when” is a different pattern and cannot be mixed with “no sooner”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'impr-002',
    exams: ['CDS', 'NDA'],
    topic: 'sentence-improvement',
    skill: 'Agreement with “as well as”',
    level: 'secure',
    prompt: 'Choose the correct option: “The manager, as well as his assistants, ___ attending the briefing.”',
    options: ['are', 'is', 'were', 'have been'],
    correctIndex: 1,
    explanation:
      '“As well as” does not make the subject plural, so the singular “manager” takes “is”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'impr-003',
    exams: ['CDS', 'NDA'],
    topic: 'sentence-improvement',
    skill: 'Modal idioms',
    level: 'developing',
    prompt: 'Choose the correct option: “You had better ___ the instructions before you start.”',
    options: ['to read', 'read', 'reading', 'have read'],
    correctIndex: 1,
    explanation:
      '“Had better” is followed by the bare infinitive: “had better read”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'impr-004',
    exams: ['CDS', 'NDA'],
    topic: 'sentence-improvement',
    skill: 'Pronoun agreement',
    level: 'secure',
    prompt: 'Choose the correct option: “Neither of the two options ___ acceptable.”',
    options: ['are', 'is', 'were', 'have been'],
    correctIndex: 1,
    explanation:
      '“Neither of” takes a singular verb: “neither of the two options is acceptable”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'impr-005',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'sentence-improvement',
    skill: 'Collective nouns',
    level: 'developing',
    prompt: 'Choose the correct option: “The committee has submitted ___ report.”',
    options: ['their', 'its', 'it’s', 'there'],
    correctIndex: 1,
    explanation:
      'A collective noun acting as a single body takes the singular possessive “its”. “It’s” means “it is”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },

  /* ---------------- Error detection ---------------- */
  {
    id: 'err-001',
    exams: ['CDS', 'NDA'],
    topic: 'error-detection',
    skill: 'Subject–verb agreement',
    level: 'developing',
    prompt:
      'Identify the part that contains the error: “The list of items (A) / were displayed (B) / on the notice board (C) / No error (D)”',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 1,
    explanation:
      'The subject is the singular “list”, so part B should read “was displayed”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'err-002',
    exams: ['CDS', 'NDA'],
    topic: 'error-detection',
    skill: 'Question tags',
    level: 'secure',
    prompt:
      'Identify the part that contains the error: “He does not (A) / know how to (B) / swim, isn’t it? (C) / No error (D)”',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 2,
    explanation:
      'The statement is negative and uses “does”, so the tag must be the positive “does he?”. Part C is the error.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'err-003',
    exams: ['CDS', 'NDA'],
    topic: 'error-detection',
    skill: '“One of” constructions',
    level: 'secure',
    prompt:
      'Identify the part that contains the error: “One of my friends (A) / have gone (B) / to the academy (C) / No error (D)”',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 1,
    explanation:
      '“One of” is the subject and is singular: “one of my friends has gone”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'err-004',
    exams: ['CDS', 'NDA'],
    topic: 'error-detection',
    skill: 'Uncountable nouns',
    level: 'secure',
    prompt:
      'Identify the part that contains the error: “The scenery of this place (A) / are very beautiful (B) / in the morning (C) / No error (D)”',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 1,
    explanation:
      '“Scenery” is an uncountable noun and takes a singular verb: “is very beautiful”.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },

  /* ---------------- Idioms and substitutions ---------------- */
  {
    id: 'idiom-001',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'idioms',
    skill: 'Idiom meaning',
    level: 'foundation',
    prompt: 'What does “to bury the hatchet” mean?',
    options: ['to hide a weapon', 'to make peace', 'to end a journey', 'to keep a secret'],
    correctIndex: 1,
    explanation:
      'The idiom means to end a quarrel and become friendly again.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'idiom-002',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'idioms',
    skill: 'Idiom meaning',
    level: 'foundation',
    prompt: 'What does “to let the cat out of the bag” mean?',
    options: ['to lose a possession', 'to reveal a secret', 'to start a quarrel', 'to escape danger'],
    correctIndex: 1,
    explanation:
      'To let the cat out of the bag is to reveal something that was meant to stay hidden.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'idiom-003',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'idioms',
    skill: 'Idiom meaning',
    level: 'developing',
    prompt: 'What does “at the eleventh hour” mean?',
    options: [
      'at exactly eleven o’clock',
      'at the last possible moment',
      'after a long delay',
      'before the agreed time',
    ],
    correctIndex: 1,
    explanation:
      'The phrase refers to the final moment before something must be decided or done, not to a literal time.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'idiom-004',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'idioms',
    skill: 'Idiom meaning',
    level: 'developing',
    prompt: 'What does “a bolt from the blue” mean?',
    options: [
      'a sudden, unexpected event',
      'a loud disagreement',
      'a well-planned decision',
      'a change in the weather',
    ],
    correctIndex: 0,
    explanation:
      'The image is lightning from a clear sky, so the idiom describes something startling and unannounced.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'idiom-005',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'idioms',
    skill: 'Idiom meaning',
    level: 'secure',
    prompt: 'What does “to call a spade a spade” mean?',
    options: [
      'to speak plainly and directly',
      'to misuse a tool',
      'to avoid a difficult subject',
      'to repeat a complaint',
    ],
    correctIndex: 0,
    explanation:
      'The idiom praises plain, unvarnished speech rather than evasion.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
  {
    id: 'idiom-006',
    exams: ['CDS', 'NDA', 'AFCAT'],
    topic: 'idioms',
    skill: 'Idiom meaning',
    level: 'foundation',
    prompt: 'What does “once in a blue moon” mean?',
    options: ['very rarely', 'every month', 'at night', 'without warning'],
    correctIndex: 0,
    explanation:
      'The idiom describes something that happens very infrequently.',
    provenance: ORIGINAL,
    contentVersion: '1.0.0',
  },
];

/** Authored order, before option-position balancing. Kept for provenance tests. */
export const authoredQuestions: Question[] = [...baseQuestions, ...moreQuestions];

/**
 * The released bank: batch 1 (v1.0.0) plus batch 2 (v1.1.0), with option
 * positions balanced so the correct answer is not concentrated in one letter.
 */
export const questions: Question[] = balanceOptionPositions(authoredQuestions);

export function questionsFor(exam: string, topic?: string): Question[] {
  return questions.filter(
    (question) =>
      question.exams.includes(exam as never) &&
      (topic === undefined || question.topic === topic),
  );
}

export function questionById(id: string): Question | undefined {
  return questions.find((question) => question.id === id);
}

export function expectedAnswer(question: Question, mode: 'text' | 'letter'): string {
  return mode === 'letter'
    ? 'ABCD'[question.correctIndex]
    : question.options[question.correctIndex];
}
