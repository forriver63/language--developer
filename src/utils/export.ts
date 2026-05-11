import type { AnalysisReport } from '../engine/types';

export function exportReport(report: AnalysisReport, opts: { includeText: boolean; text?: string }) {
  const payload = opts.includeText && opts.text != null ? { ...report, sourceText: opts.text } : report;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  a.href = url;
  a.download = `language-developer-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
