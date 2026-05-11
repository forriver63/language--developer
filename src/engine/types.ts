export type PatternId =
  | 'binary'
  | 'imperative'
  | 'judgmental'
  | 'absolutizing'
  | 'identity'
  | 'attachment';

export interface RawMatch {
  patternId: PatternId;
  start: number;
  end: number;
  trigger: string;
  sentence: string;
  sentenceStart: number;
  reason: string;
  confidence: number;
}

export interface Suggestion {
  matchIndex: number;
  original: string;
  rewrite: string;
  rationale: string;
}

export interface AnalysisReport {
  version: '1.0';
  textHash: string;
  matches: RawMatch[];
  stats: Record<PatternId, number>;
  suggestions: Suggestion[];
  generatedAt: string;
}

export interface Sentence {
  text: string;
  start: number;
  end: number;
  isQuestion: boolean;
  inQuote: boolean;
}

export interface Rule {
  id: PatternId;
  name: string;
  description: string;
  detect: (sentence: Sentence) => RawMatch[];
}

export const PATTERN_NAMES: Record<PatternId, string> = {
  binary: '二元对立',
  imperative: '隐藏祈使',
  judgmental: '评判语言',
  absolutizing: '绝对化',
  identity: '身份标签',
  attachment: '概念执着',
};

export const PATTERN_COLORS: Record<PatternId, string> = {
  binary: 'bg-amber-100 border-amber-300 text-amber-900',
  imperative: 'bg-rose-100 border-rose-300 text-rose-900',
  judgmental: 'bg-purple-100 border-purple-300 text-purple-900',
  absolutizing: 'bg-sky-100 border-sky-300 text-sky-900',
  identity: 'bg-emerald-100 border-emerald-300 text-emerald-900',
  attachment: 'bg-indigo-100 border-indigo-300 text-indigo-900',
};
