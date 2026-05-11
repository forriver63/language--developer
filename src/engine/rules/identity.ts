import type { Rule, RawMatch } from '../types';
import professions from '../lexicons/profession-whitelist.json';

const PATTERNS: RegExp[] = [
  /我是一个(.{1,8}?)的人/g,
  /我就是(.{1,8}?)的人/g,
  /我是个(.{1,8}?)的人/g,
  /他就是(.{1,8}?)的人/g,
  /她就是(.{1,8}?)的人/g,
  /我天生(.{1,6}?)[，。！]/g,
  /(.{1,8}?)型人格/g,
];

export const identityRule: Rule = {
  id: 'identity',
  name: '身份标签',
  description: '把一时的状态固化成「我是 X」的身份。',
  detect(sentence) {
    if (sentence.isQuestion) return [];
    const matches: RawMatch[] = [];
    const text = sentence.text;
    for (const re of PATTERNS) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        const inner = m[1] ?? '';
        if (professions.includes(inner.trim())) continue;
        matches.push({
          patternId: 'identity',
          start: sentence.start + m.index,
          end: sentence.start + m.index + m[0].length,
          trigger: m[0],
          sentence: text,
          sentenceStart: sentence.start,
          reason: `「${m[0]}」把一种状态说成了固定身份。`,
          confidence: sentence.inQuote ? 0.4 : 0.8,
        });
      }
    }
    return matches;
  },
};
