import imperatives from './lexicons/imperatives.json';
import absolutizers from './lexicons/absolutizers.json';
import adjectives from './lexicons/judgmental-adjectives.json';

const IMPERATIVE_SWAP: Record<string, string> = {
  应该: '希望',
  应当: '希望',
  必须: '想要',
  一定要: '希望',
  一定得: '希望',
  不得不: '选择',
  非得: '希望',
  必需: '需要',
  必要: '需要',
  理应: '希望',
  本应: '曾期待',
  本该: '曾期待',
};

const ABSOLUTIZER_SWAP: Record<string, string> = {
  永远: '常常',
  从不: '很少',
  从来不: '很少',
  从来没有: '至今没有',
  从来没: '至今没有',
  总是: '经常',
  老是: '经常',
  一直: '最近一直',
  完全: '基本上',
  绝对: '大多数情况下',
  彻底: '基本上',
  全部: '大部分',
  所有: '很多',
  任何: '大多数',
  没有人: '很少有人',
  没有一个: '很少',
  毫无: '几乎没有',
  百分百: '大部分',
  百分之百: '大部分',
  根本不: '不太',
  根本没: '没怎么',
  一点也不: '不太',
  一点都不: '不太',
};

const ADJ_SWAP: Record<string, string> = {
  愚蠢: '不熟练',
  笨: '还不熟练',
  蠢: '让我困惑',
  傻: '让我意外',
  自私: '更顾自己',
  懒: '没动手',
  懒惰: '没行动',
  懦弱: '犹豫',
  胆小: '犹豫',
  无能: '还做不到',
  糟糕: '不理想',
  差劲: '不理想',
  失败: '没达到',
  完美: '让我满意',
  厉害: '让我印象深刻',
  优秀: '让我印象深刻',
  了不起: '让我印象深刻',
  牛: '让我印象深刻',
  牛逼: '让我印象深刻',
  废物: '还没能做到',
  烂: '不理想',
  差: '不理想',
  幼稚: '像更早的样子',
  肤浅: '只触到表层',
  虚伪: '说和做不一致',
  做作: '不太自然',
  矫情: '情绪比预期多',
  丢人: '不好意思',
  丢脸: '不好意思',
  渣: '让我失望',
};

const BINARY_PHRASES: Array<[RegExp, string]> = [
  [/不是(.{1,6}?)就是(.{1,6}?)([，。！？\n]|$)/g, '可能是$1，也可能是$2，也可能在两者之间$3'],
  [/要么(.{1,8}?)要么(.{1,8}?)([，。！？\n]|$)/g, '可以是$1，也可以是$2，或者别的样子$3'],
  [/非(.)即(.)/g, '不只是$1或$2'],
];

const IDENTITY_PHRASES: Array<[RegExp, string]> = [
  [/我是一个(.{1,8}?)的人/g, '在这件事上，我感到自己有些$1'],
  [/我是个(.{1,8}?)的人/g, '在这件事上，我感到自己有些$1'],
  [/我就是(.{1,8}?)的人/g, '在这件事上，我感到自己有些$1'],
  [/他就是(.{1,8}?)的人/g, '在这件事上，他显得有些$1'],
  [/她就是(.{1,8}?)的人/g, '在这件事上，她显得有些$1'],
  [/我天生(.{1,6}?)([，。！])/g, '我目前还不太$1$2'],
];

function isQuestion(s: string): boolean {
  return /[？?]\s*$/.test(s.trim());
}

function looksLikeWeather(text: string, idx: number, _word: string): boolean {
  const before = text.slice(Math.max(0, idx - 4), idx);
  if (/(天气|味道|环境|空气|心情|结果)$/.test(before)) return true;
  const after = text.slice(idx + _word.length, idx + _word.length + 3);
  return /^(天气|味道|环境|空气)/.test(after);
}

function looksLikeMathFactual(text: string, idx: number, word: string): boolean {
  const win = text.slice(idx, idx + word.length + 6);
  return /[0-9一二三四五六七八九十百千万]|偶数|奇数|质数|整数|实数|元素|集合|公民/.test(win);
}

function isImperativeDe(text: string, idx: number): boolean {
  const before = text[idx - 1] ?? '';
  if (/[一二三四五六七八九十百千万0-9的地]/.test(before)) return false;
  const after = text.slice(idx + 1, idx + 4);
  return /^[要去做让把给吃喝走跑想说看回]/.test(after);
}

function splitSentences(text: string): Array<{ s: string; sep: string }> {
  const out: Array<{ s: string; sep: string }> = [];
  let buf = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/[。！？!?\n]/.test(ch)) {
      out.push({ s: buf, sep: ch });
      buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf.length > 0) out.push({ s: buf, sep: '' });
  return out;
}

function rewriteSentence(s: string): string {
  if (isQuestion(s)) return s;

  // identity (regex-based, do first so capture groups intact)
  for (const [re, rep] of IDENTITY_PHRASES) {
    re.lastIndex = 0;
    s = s.replace(re, rep as string);
  }

  // binary phrases
  for (const [re, rep] of BINARY_PHRASES) {
    re.lastIndex = 0;
    s = s.replace(re, rep as string);
  }

  // imperatives
  for (const w of imperatives as string[]) {
    if (!s.includes(w)) continue;
    const swap = IMPERATIVE_SWAP[w];
    if (!swap) continue;
    if (w === '得') {
      // only swap 得 in imperative usage
      let out = '';
      for (let i = 0; i < s.length; i++) {
        if (s[i] === '得' && isImperativeDe(s, i)) {
          out += swap;
        } else {
          out += s[i];
        }
      }
      s = out;
    } else {
      s = s.split(w).join(swap);
    }
  }

  // absolutizers (skip math/factual context)
  for (const w of absolutizers as string[]) {
    const swap = ABSOLUTIZER_SWAP[w];
    if (!swap) continue;
    let out = '';
    let i = 0;
    while (i < s.length) {
      if (s.startsWith(w, i) && !looksLikeMathFactual(s, i, w)) {
        out += swap;
        i += w.length;
      } else {
        out += s[i];
        i++;
      }
    }
    s = out;
  }

  // judgmental adjectives (skip weather/environment)
  for (const w of adjectives as string[]) {
    const swap = ADJ_SWAP[w];
    if (!swap) continue;
    let out = '';
    let i = 0;
    while (i < s.length) {
      if (s.startsWith(w, i) && !looksLikeWeather(s, i, w)) {
        out += swap;
        i += w.length;
      } else {
        out += s[i];
        i++;
      }
    }
    s = out;
  }

  return s;
}

export interface DevelopResult {
  rewritten: string;
  changed: boolean;
}

export function develop(text: string): DevelopResult {
  if (!text.trim()) return { rewritten: '', changed: false };
  const parts = splitSentences(text);
  const out = parts.map((p) => rewriteSentence(p.s) + p.sep).join('');
  return { rewritten: out, changed: out !== text };
}
