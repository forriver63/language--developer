import type { Rule, RawMatch } from '../types';
import nouns from '../lexicons/abstract-nouns.json';

const MODALS = ['必须', '唯一', '真正的', '真正', '才是', '就是', '本就是'];

export const attachmentRule: Rule = {
  id: 'attachment',
  name: '概念执着',
  description: '把抽象概念（自由、真相、命运）说成唯一或必须的样子。',
  detect(sentence) {
    if (sentence.isQuestion) return [];
    const matches: RawMatch[] = [];
    const text = sentence.text;
    for (const n of nouns as string[]) {
      const idx = text.indexOf(n);
      if (idx < 0) continue;
      const around = text.slice(Math.max(0, idx - 6), idx + n.length + 6);
      const hit = MODALS.find((m) => around.includes(m));
      if (!hit) continue;
      matches.push({
        patternId: 'attachment',
        start: sentence.start + idx,
        end: sentence.start + idx + n.length,
        trigger: n,
        sentence: text,
        sentenceStart: sentence.start,
        reason: `这里把「${n}」说成「${hit}」的样子，是一种概念上的固定。`,
        confidence: sentence.inQuote ? 0.4 : 0.7,
      });
    }
    return matches;
  },
};
