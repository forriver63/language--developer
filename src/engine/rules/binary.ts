import type { Rule, RawMatch } from '../types';
import pairs from '../lexicons/binary-pairs.json';

export const binaryRule: Rule = {
  id: 'binary',
  name: '二元对立',
  description: '在同一句中出现一对相反词，可能把世界简化成两端。',
  detect(sentence) {
    if (sentence.isQuestion) return [];
    const matches: RawMatch[] = [];
    const text = sentence.text;
    const seen = new Set<string>();
    for (const [a, b] of pairs as [string, string][]) {
      const ia = text.indexOf(a);
      const ib = text.indexOf(b);
      if (ia < 0 || ib < 0) continue;
      const distance = Math.abs(ia - ib);
      if (distance > 25) continue;
      const key = `${ia}-${ib}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const lo = Math.min(ia, ib);
      const hi = Math.max(ia + a.length, ib + b.length);
      matches.push({
        patternId: 'binary',
        start: sentence.start + lo,
        end: sentence.start + hi,
        trigger: text.slice(lo, hi),
        sentence: text,
        sentenceStart: sentence.start,
        reason: `这里出现了「${a}」与「${b}」的对立。`,
        confidence: sentence.inQuote ? 0.4 : 0.75,
      });
    }
    return matches;
  },
};
