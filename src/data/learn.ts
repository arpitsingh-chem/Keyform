export interface VocabWord {
  word: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
  exams: string[];
}

export const vocabularyWords: VocabWord[] = [
  {
    word: 'abate',
    partOfSpeech: 'verb',
    meaning: 'to become less intense or widespread',
    example: 'The wind began to abate as the convoy reached the ridge.',
    synonyms: ['subside', 'diminish', 'ease'],
    antonyms: ['intensify', 'grow'],
    exams: ['CDS', 'NDA', 'AFCAT'],
  },
  {
    word: 'candid',
    partOfSpeech: 'adjective',
    meaning: 'truthful and straightforward',
    example: 'A candid assessment of the drill helped the squad improve.',
    synonyms: ['frank', 'direct', 'open'],
    antonyms: ['evasive', 'guarded'],
    exams: ['CDS', 'NDA', 'AFCAT'],
  },
  {
    word: 'meticulous',
    partOfSpeech: 'adjective',
    meaning: 'showing great attention to detail',
    example: 'Her meticulous notes made the revision schedule easy to follow.',
    synonyms: ['careful', 'thorough', 'precise'],
    antonyms: ['careless', 'sloppy'],
    exams: ['CDS', 'NDA'],
  },
  {
    word: 'tenacious',
    partOfSpeech: 'adjective',
    meaning: 'holding firmly to a purpose',
    example: 'A tenacious learner returns to the same mistake until it is fixed.',
    synonyms: ['persistent', 'dogged', 'resolute'],
    antonyms: ['yielding', 'irresolute'],
    exams: ['CDS', 'NDA', 'AFCAT'],
  },
  {
    word: 'prudent',
    partOfSpeech: 'adjective',
    meaning: 'showing careful judgement about the future',
    example: 'It was prudent to revise the weak topics before the mock test.',
    synonyms: ['judicious', 'sensible', 'wise'],
    antonyms: ['reckless', 'imprudent'],
    exams: ['CDS', 'NDA', 'AFCAT'],
  },
  {
    word: 'succinct',
    partOfSpeech: 'adjective',
    meaning: 'expressed briefly and clearly',
    example: 'His succinct reply ended the discussion in one sentence.',
    synonyms: ['concise', 'terse', 'brief'],
    antonyms: ['verbose', 'rambling'],
    exams: ['CDS', 'NDA', 'AFCAT'],
  },
  {
    word: 'equivocal',
    partOfSpeech: 'adjective',
    meaning: 'open to more than one interpretation',
    example: 'The order was equivocal, so the section waited for clarification.',
    synonyms: ['ambiguous', 'vague'],
    antonyms: ['unambiguous', 'clear'],
    exams: ['CDS', 'NDA'],
  },
];

export interface GrammarRule {
  id: string;
  title: string;
  rule: string;
  correct: string;
  mistake: string;
  why: string;
  practiceTopic: string;
  practiceSkill?: string;
}

export const grammarRules: GrammarRule[] = [
  {
    id: 'agreement-neither-nor',
    title: 'Neither … nor and the nearer subject',
    rule: 'When two subjects are joined by “neither … nor” or “either … or”, the verb agrees with the subject nearer to it.',
    correct: 'Neither the cadet nor the instructors were aware of the change.',
    mistake: 'Neither the cadet nor the instructors was aware of the change.',
    why: 'The nearer subject is plural (“instructors”), so the plural verb “were” is required.',
    practiceTopic: 'grammar',
    practiceSkill: 'Subject–verb agreement',
  },
  {
    id: 'agreement-as-well-as',
    title: '“As well as” does not pluralise the subject',
    rule: 'Phrases such as “as well as”, “along with” and “together with” add information but do not change the number of the subject.',
    correct: 'The manager, as well as his assistants, is attending the briefing.',
    mistake: 'The manager, as well as his assistants, are attending the briefing.',
    why: 'The grammatical subject is still the singular “manager”.',
    practiceTopic: 'sentence-improvement',
  },
  {
    id: 'since-for',
    title: 'Since a point, for a period',
    rule: 'Use “since” with the starting point of an action and “for” with its duration.',
    correct: 'He has served in the unit since 2019.',
    mistake: 'He has served in the unit for 2019.',
    why: '“2019” is a point in time, so “since” is needed. “For six years” would be correct with a duration.',
    practiceTopic: 'grammar',
    practiceSkill: 'Prepositions',
  },
  {
    id: 'senior-to',
    title: 'Senior, junior, superior, inferior take “to”',
    rule: 'These adjectives compare with “to”, never with “than”.',
    correct: 'She is senior to me by two years.',
    mistake: 'She is senior than me by two years.',
    why: 'The comparative form is built into the adjective, so “than” is not used.',
    practiceTopic: 'grammar',
    practiceSkill: 'Adjectives with “to”',
  },
  {
    id: 'gerund-after-preposition',
    title: 'A preposition takes a gerund',
    rule: 'When “to” is a preposition rather than part of an infinitive, the verb after it takes “-ing”.',
    correct: 'I look forward to hearing from you.',
    mistake: 'I look forward to hear from you.',
    why: 'In “look forward to”, “to” is a preposition, so the gerund “hearing” follows.',
    practiceTopic: 'grammar',
    practiceSkill: 'Gerunds after prepositions',
  },
  {
    id: 'no-sooner-than',
    title: 'No sooner … than; hardly … when',
    rule: 'These two fixed pairs cannot be mixed. “No sooner” is followed by “than”, and “hardly” or “scarcely” by “when”.',
    correct: 'No sooner did the bell ring than the trainees assembled.',
    mistake: 'No sooner did the bell ring when the trainees assembled.',
    why: 'The correct partner of “no sooner” is “than”.',
    practiceTopic: 'sentence-improvement',
  },
  {
    id: 'each-of-singular',
    title: 'Each of / one of take a singular verb',
    rule: '“Each of”, “one of” and “neither of” are singular subjects even when followed by a plural noun.',
    correct: 'Each of the trainees has submitted the form.',
    mistake: 'Each of the trainees have submitted the form.',
    why: 'The head of the subject is “each”, which is singular.',
    practiceTopic: 'grammar',
    practiceSkill: 'Distributive pronouns',
  },
];

export interface PreviousYearEntry {
  id: string;
  exam: string;
  year: string;
  paper: string;
  topic: string;
  sourceName: string;
  sourceUrl: string;
  /** Only records genuinely checked against the named official source may claim verification. */
  status: 'source_page_linked' | 'verified_official_paper';
  note: string;
}

/**
 * Paper availability records. These are links to official UPSC examination
 * pages, not reproductions of papers, and they are not labelled as verified
 * question-by-question transcriptions.
 */
export const previousYearEntries: PreviousYearEntry[] = [
  {
    id: 'py-cds1-2025',
    exam: 'CDS',
    year: '2025',
    paper: 'Combined Defence Services (I) examination papers',
    topic: 'Full paper',
    sourceName: 'Union Public Service Commission',
    sourceUrl:
      'https://upsc.gov.in/examinations/Combined%20Defence%20Services%20Examination%20(I),%202025',
    status: 'source_page_linked',
    note: 'Official examination page is the source of the paper. Contents have not been transcribed into Keyform.',
  },
  {
    id: 'py-cds1-2022',
    exam: 'CDS',
    year: '2022',
    paper: 'Combined Defence Services (I) — General English',
    topic: 'General English',
    sourceName: 'Union Public Service Commission',
    sourceUrl:
      'https://upsc.gov.in/examinations/Combined%20Defence%20Services%20Examination%20(I),%202022',
    status: 'source_page_linked',
    note: 'The official page lists the General English paper for this examination.',
  },
  {
    id: 'py-nda2-2026-notice',
    exam: 'NDA',
    year: '2026',
    paper: 'NDA (II) examination notice — English scope',
    topic: 'Syllabus',
    sourceName: 'Union Public Service Commission',
    sourceUrl:
      'https://www.upsc.gov.in/sites/default/files/Notif-NDA-II-2026-Engl-200526.pdf',
    status: 'source_page_linked',
    note: 'Official notice naming grammar and usage, vocabulary, comprehension and cohesion in extended text.',
  },
  {
    id: 'py-cds2-2026-notice',
    exam: 'CDS',
    year: '2026',
    paper: 'CDS (II) examination notice — English section',
    topic: 'Syllabus',
    sourceName: 'Union Public Service Commission',
    sourceUrl:
      'https://www.upsc.gov.in/sites/default/files/Notif-CDS-II-2026-Engl-200526.pdf',
    status: 'source_page_linked',
    note: 'Official notice describing the English paper as testing understanding and workmanlike use of words.',
  },
  {
    id: 'py-afcat-syllabus',
    exam: 'AFCAT',
    year: 'Current',
    paper: 'Syllabus and schemes of AFCAT',
    topic: 'Syllabus',
    sourceName: 'Indian Air Force — AFCAT official site',
    sourceUrl: 'https://afcat.cdac.in/AFCAT/guidelines',
    status: 'source_page_linked',
    note: 'Official guidelines page links the syllabus and scheme document. Topic mapping must be checked against that document.',
  },
];
