import type { RawMatch, Suggestion } from './types';

const IMPERATIVE_REWRITE: Record<string, string> = {
  应该: '我希望',
  应当: '我希望',
  必须: '我想要',
  一定要: '我希望',
  一定得: '我希望',
  不得不: '我选择',
  非得: '我希望',
  必需: '我需要',
  必要: '我需要',
  理应: '我希望',
  本应: '我曾期待',
  本该: '我曾期待',
};

const JUDGMENTAL_HINT: Record<string, string> = {
  愚蠢: '我对他这次的做法感到困惑',
  笨: '我注意到他在这件事上还不熟练',
  蠢: '我对这次的判断感到困惑',
  傻: '我注意到这次的处理让我意外',
  自私: '我注意到他这次更顾自己的需要',
  懒: '我注意到他这次没有动手',
  懒惰: '我注意到他这段时间没有行动',
  懦弱: '我注意到他这次没有上前',
  胆小: '我注意到他这次犹豫了',
  无能: '我注意到这次他没能完成',
  糟糕: '我对这次的结果不满意',
  差劲: '我对这次的表现不满意',
  失败: '这次没有达到我想要的结果',
  完美: '这次让我很满意',
  优秀: '这次表现让我印象深刻',
  厉害: '这次让我印象深刻',
  幼稚: '我注意到这次的反应像更早的自己',
  虚伪: '我注意到他说的和做的不一致',
  做作: '我感觉这次的表达不太自然',
  矫情: '我感觉这次的情绪比我预期更多',
  丢人: '我感到不好意思',
  丢脸: '我感到不好意思',
};

const ABSOLUTIZER_SOFTEN: Record<string, string> = {
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

export function suggestFor(match: RawMatch): Suggestion | null {
  const original = match.sentence.trim();
  switch (match.patternId) {
    case 'imperative': {
      const rep = IMPERATIVE_REWRITE[match.trigger];
      if (!rep) return null;
      return {
        matchIndex: -1,
        original,
        rewrite: original.replace(match.trigger, rep),
        rationale: `把「${match.trigger}」换成「${rep}」，让需要被看见，而不是被强加。`,
      };
    }
    case 'absolutizing': {
      const soft = ABSOLUTIZER_SOFTEN[match.trigger] ?? '常常';
      return {
        matchIndex: -1,
        original,
        rewrite: original.replace(match.trigger, soft),
        rationale: `用「${soft}」代替「${match.trigger}」，给例外留出空间。`,
      };
    }
    case 'judgmental': {
      const hint = JUDGMENTAL_HINT[match.trigger];
      if (!hint) return null;
      return {
        matchIndex: -1,
        original,
        rewrite: hint,
        rationale: '把评判换成具体观察。',
      };
    }
    case 'binary': {
      return {
        matchIndex: -1,
        original,
        rewrite: `${original.replace(/[。！]$/, '')}——也许还有中间状态？`,
        rationale: '在两极之间，多半还有第三种可能。',
      };
    }
    case 'identity': {
      const inner = extractIdentityInner(match.trigger);
      const rewrite = inner
        ? original.replace(match.trigger, `在最近这件事上，我感到自己有些${inner}`)
        : original;
      return {
        matchIndex: -1,
        original,
        rewrite,
        rationale: '把固定身份换成在具体情境下的状态。',
      };
    }
    case 'attachment': {
      return {
        matchIndex: -1,
        original,
        rewrite: `${original.replace(/[。！]$/, '')}——这是「${match.trigger}」的其中一种样子。`,
        rationale: `留意「${match.trigger}」是否只有一种样子。`,
      };
    }
  }
}

function extractIdentityInner(trigger: string): string | null {
  const m =
    trigger.match(/^(?:我是一个|我是个|我就是|他就是|她就是)(.{1,8}?)的人$/) ||
    trigger.match(/^我天生(.{1,6}?)[，。！]?$/) ||
    trigger.match(/^(.{1,8}?)型人格$/);
  return m ? m[1] : null;
}
