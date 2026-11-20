export type ExamCode = 'CDS' | 'NDA' | 'AFCAT';

export type TopicId =
  | 'vocabulary'
  | 'grammar'
  | 'spelling'
  | 'comprehension'
  | 'sentence-improvement'
  | 'error-detection'
  | 'idioms';

export type ProvenanceStatus =
  | 'verified_official_paper'
  | 'adapted_from_cited_source'
  | 'original_platform_practice'
  | 'probable_pattern_practice';

export interface Question {
  id: string;
  exams: ExamCode[];
  topic: TopicId;
  skill: string;
  level: 'foundation' | 'developing' | 'secure';
  passage?: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  provenance: {
    status: ProvenanceStatus;
    sourceName?: string;
    sourceUrl?: string;
    note?: string;
  };
  contentVersion: string;
}

export interface ExamTrack {
  code: ExamCode;
  name: string;
  tint: 'mint' | 'peach' | 'lilac';
  emblem: 'shield' | 'swords' | 'plane';
  blurb: string;
  syllabusNote: string;
}

export interface Topic {
  id: TopicId;
  name: string;
  description: string;
}

export const examTracks: ExamTrack[] = [
  {
    code: 'CDS',
    name: 'Combined Defence Services',
    tint: 'mint',
    emblem: 'shield',
    blurb: 'English usage at the standard of the UPSC Combined Defence Services examination.',
    syllabusNote:
      'The UPSC CDS notice describes the English paper as testing understanding of English and workmanlike use of words. Topics here are practice groupings, not a claim that each one is separately listed in the notice.',
  },
  {
    code: 'NDA',
    name: 'National Defence Academy',
    tint: 'peach',
    emblem: 'swords',
    blurb: 'Grammar, vocabulary and comprehension for the UPSC NDA English paper.',
    syllabusNote:
      'The UPSC NDA notice names grammar and usage, vocabulary, comprehension and cohesion in extended text. Items here are practice material, not a reproduction of an official paper.',
  },
  {
    code: 'AFCAT',
    name: 'Air Force Common Admission Test',
    tint: 'lilac',
    emblem: 'plane',
    blurb: 'Language accuracy and comprehension practice for AFCAT.',
    syllabusNote:
      'The official syllabus and scheme document published by the Indian Air Force remains the authority for AFCAT scope. This group is a practice structure awaiting final mapping against that document.',
  },
];

export const topics: Topic[] = [
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    description: 'Synonyms, antonyms, one-word substitutions and words in context.',
  },
  {
    id: 'grammar',
    name: 'Grammar and usage',
    description: 'Agreement, tense, prepositions, voice and sentence structure.',
  },
  {
    id: 'spelling',
    name: 'Spelling',
    description: 'Correctly spelt forms and commonly confused endings.',
  },
  {
    id: 'comprehension',
    name: 'Comprehension',
    description: 'Short passages with inference, purpose and tone questions.',
  },
  {
    id: 'sentence-improvement',
    name: 'Sentence improvement',
    description: 'Choose the wording that makes a sentence standard English.',
  },
  {
    id: 'error-detection',
    name: 'Error detection',
    description: 'Find the part of a sentence that is not grammatically acceptable.',
  },
  {
    id: 'idioms',
    name: 'Idioms and substitutions',
    description: 'Fixed expressions and their accepted meanings.',
  },
];

export function trackByCode(code: string | undefined): ExamTrack | undefined {
  return examTracks.find((track) => track.code === code);
}

export function topicById(id: string | undefined): Topic | undefined {
  return topics.find((topic) => topic.id === id);
}
