import type { AnalysisReport, PatternId, RawMatch, Rule, Suggestion } from './types';
import { sentencize } from './sentencize';
import { binaryRule } from './rules/binary';
import { imperativeRule } from './rules/imperative';
import { judgmentalRule } from './rules/judgmental';
import { absolutizingRule } from './rules/absolutizing';
import { identityRule } from './rules/identity';
import { attachmentRule } from './rules/attachment';
import { suggestFor } from './suggest';

export const RULES: Rule[] = [
  binaryRule,
  imperativeRule,
  judgmentalRule,
  absolutizingRule,
  identityRule,
  attachmentRule,
];

export function runAnalysis(text: string, options?: { minConfidence?: number }): AnalysisReport {
  const minConfidence = options?.minConfidence ?? 0.5;
  const sentences = sentencize(text);
  const matches: RawMatch[] = [];
  for (const s of sentences) {
    for (const rule of RULES) {
      matches.push(...rule.detect(s));
    }
  }
  const filtered = matches
    .filter((m) => m.confidence >= minConfidence)
    .sort((a, b) => a.start - b.start);

  const stats: Record<PatternId, number> = {
    binary: 0,
    imperative: 0,
    judgmental: 0,
    absolutizing: 0,
    identity: 0,
    attachment: 0,
  };
  for (const m of filtered) stats[m.patternId]++;

  const suggestions: Suggestion[] = [];
  const seenSentence = new Set<string>();
  filtered.forEach((m, i) => {
    const key = `${m.patternId}-${m.sentenceStart}`;
    if (seenSentence.has(key)) return;
    seenSentence.add(key);
    const s = suggestFor(m);
    if (s) suggestions.push({ ...s, matchIndex: i });
  });

  return {
    version: '1.0',
    textHash: hash(text),
    matches: filtered,
    stats,
    suggestions,
    generatedAt: new Date().toISOString(),
  };
}

function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(16);
}

export type { AnalysisReport, RawMatch, Suggestion, PatternId };
export { PATTERN_NAMES, PATTERN_COLORS } from './types';
