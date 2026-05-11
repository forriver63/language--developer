import type { DevelopReport } from '../types/report';

export async function fetchDevelop(text: string, signal?: AbortSignal): Promise<DevelopReport> {
  const r = await fetch('/api/develop', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    signal,
  });
  if (!r.ok) {
    const msg = await r.text().catch(() => '');
    throw new Error(msg || `HTTP ${r.status}`);
  }
  return (await r.json()) as DevelopReport;
}
