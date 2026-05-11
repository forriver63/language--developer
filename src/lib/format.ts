import type { DevelopReport } from '../types/report';

export function formatReportAsText(original: string, r: DevelopReport): string {
  const lines: string[] = [];
  lines.push('【原文】');
  lines.push(original);
  lines.push('');

  if (r.overview.corePattern || r.overview.plainExplanation) {
    lines.push('一　总览显影');
    if (r.overview.corePattern) lines.push(r.overview.corePattern);
    if (r.overview.plainExplanation) lines.push(r.overview.plainExplanation);
    lines.push('');
  }

  if (r.layeredChain.length > 0) {
    lines.push('二　层级链条');
    r.layeredChain.forEach((n, i) => {
      lines.push(`${n.layer}：${n.text}${n.note ? `（${n.note}）` : ''}`);
      if (i < r.layeredChain.length - 1) lines.push('   ↓');
    });
    lines.push('');
  }

  if (r.leaps.length > 0) {
    lines.push('三　关键跳跃');
    r.leaps.forEach((l) => {
      lines.push(`${l.from} → ${l.to}`);
      lines.push(`  ${l.whyItMatters}`);
    });
    lines.push('');
  }

  if (r.bindings.length > 0) {
    lines.push('四　绑定关系');
    r.bindings.forEach((b) => {
      lines.push(b.items.join(' ↔ '));
      lines.push(`  ${b.explanation}`);
    });
    lines.push('');
  }

  if (r.rewrites.length > 0) {
    lines.push('五　分层重构');
    r.rewrites.forEach((rw) => {
      lines.push(`【${rw.level}】${rw.purpose}`);
      lines.push(rw.text);
      lines.push('');
    });
  }

  if (r.reflectionQuestions.length > 0) {
    lines.push('继续观察');
    r.reflectionQuestions.forEach((q, i) => {
      lines.push(`${String(i + 1).padStart(2, '0')}. ${q}`);
    });
    lines.push('');
  }

  if (r.safetyNote) {
    lines.push('—');
    lines.push(r.safetyNote);
    lines.push('');
  }

  lines.push('—— 由「语言显影器」生成');
  return lines.join('\n');
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
