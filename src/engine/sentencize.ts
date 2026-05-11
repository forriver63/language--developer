import type { Sentence } from './types';

const SENT_END = /[。！？!?\n]/;
const QUESTION_MARKS = /[？?]\s*$/;

export function sentencize(text: string): Sentence[] {
  const sentences: Sentence[] = [];
  let buf = '';
  let start = 0;
  let inQuote = false;
  const quotePairs: Array<[number, number]> = [];
  let quoteStart = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' || ch === '“' || ch === '「') {
      if (!inQuote) {
        inQuote = true;
        quoteStart = i;
      }
    } else if (ch === '"' || ch === '”' || ch === '」') {
      if (inQuote) {
        inQuote = false;
        quotePairs.push([quoteStart, i]);
      }
    }
    buf += ch;
    if (SENT_END.test(ch)) {
      flush();
    }
  }
  flush();

  function flush() {
    const trimmed = buf;
    if (trimmed.trim().length === 0) {
      start += buf.length;
      buf = '';
      return;
    }
    const end = start + buf.length;
    const inQ = quotePairs.some(([qs, qe]) => qs < end && qe > start);
    sentences.push({
      text: trimmed,
      start,
      end,
      isQuestion: QUESTION_MARKS.test(trimmed.trim()),
      inQuote: inQ,
    });
    start = end;
    buf = '';
  }

  return sentences;
}
