import type { Rule, RawMatch } from '../types';
import words from '../lexicons/imperatives.json';

export const imperativeRule: Rule = {
  id: 'imperative',
  name: '隐藏祈使',
  description: '「应该 / 必须」一类的词，藏着对自己或他人的要求。',
  detect(sentence) {
    if (sentence.isQuestion) return [];
    const matches: RawMatch[] = [];
    const text = sentence.text;
    for (const w of words as string[]) {
      let idx = 0;
      while ((idx = text.indexOf(w, idx)) !== -1) {
        if (w === '得' && !isImperativeDe(text, idx)) {
          idx += w.length;
          continue;
        }
        matches.push({
          patternId: 'imperative',
          start: sentence.start + idx,
          end: sentence.start + idx + w.length,
          trigger: w,
          sentence: text,
          sentenceStart: sentence.start,
          reason: `「${w}」是一个祈使词，可以试试看它背后的需要。`,
          confidence: sentence.inQuote ? 0.4 : 0.85,
        });
        idx += w.length;
      }
    }
    return matches;
  },
};

function isImperativeDe(text: string, idx: number): boolean {
  const before = text[idx - 1] ?? '';
  if (/[一二三四五六七八九十百千万0-9]/.test(before)) return false;
  if (/[的地]/.test(before)) return false;
  const after = text.slice(idx + 1, idx + 4);
  return /^[要去做让把给吃喝走跑想说看回]/.test(after);
}
