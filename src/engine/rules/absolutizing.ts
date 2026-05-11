import type { Rule, RawMatch } from '../types';
import words from '../lexicons/absolutizers.json';

const MATH_FACTUAL = /[0-9一二三四五六七八九十百千万]|偶数|奇数|质数|整数|实数|元素|集合|公民/;

export const absolutizingRule: Rule = {
  id: 'absolutizing',
  name: '绝对化',
  description: '「永远 / 从不 / 所有」这类词把一种情况说成全部，留意是否真是如此。',
  detect(sentence) {
    if (sentence.isQuestion) return [];
    const matches: RawMatch[] = [];
    const text = sentence.text;
    for (const w of words as string[]) {
      let idx = 0;
      while ((idx = text.indexOf(w, idx)) !== -1) {
        const window = text.slice(idx, idx + w.length + 6);
        if (MATH_FACTUAL.test(window)) {
          idx += w.length;
          continue;
        }
        matches.push({
          patternId: 'absolutizing',
          start: sentence.start + idx,
          end: sentence.start + idx + w.length,
          trigger: w,
          sentence: text,
          sentenceStart: sentence.start,
          reason: `「${w}」把一种情况扩到全部，可以问问是否真的没有例外。`,
          confidence: sentence.inQuote ? 0.4 : 0.8,
        });
        idx += w.length;
      }
    }
    return matches;
  },
};
