import type { Rule, RawMatch } from '../types';
import adjs from '../lexicons/judgmental-adjectives.json';

const WEATHER_NOUNS = ['天气', '天', '味道', '环境', '空气', '心情'];

export const judgmentalRule: Rule = {
  id: 'judgmental',
  name: '评判语言',
  description: '直接给人或行为下定义的形容词，遮住了背后的具体观察。',
  detect(sentence) {
    if (sentence.isQuestion) return [];
    const matches: RawMatch[] = [];
    const text = sentence.text;
    for (const w of adjs as string[]) {
      let idx = 0;
      while ((idx = text.indexOf(w, idx)) !== -1) {
        const after = text.slice(idx + w.length, idx + w.length + 3);
        const before = text.slice(Math.max(0, idx - 4), idx);
        if (WEATHER_NOUNS.some((n) => after.startsWith(n) || before.endsWith(n))) {
          idx += w.length;
          continue;
        }
        matches.push({
          patternId: 'judgmental',
          start: sentence.start + idx,
          end: sentence.start + idx + w.length,
          trigger: w,
          sentence: text,
          sentenceStart: sentence.start,
          reason: `「${w}」是一个评判词，背后通常有更具体的观察。`,
          confidence: sentence.inQuote ? 0.4 : 0.7,
        });
        idx += w.length;
      }
    }
    return matches;
  },
};
