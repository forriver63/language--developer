import EngineWorker from './worker?worker';
import type { AnalysisReport } from './types';

let worker: Worker | null = null;
let counter = 0;
const pending = new Map<number, (r: AnalysisReport) => void>();
const pendingReject = new Map<number, (e: unknown) => void>();

function getWorker(): Worker {
  if (worker) return worker;
  const w = new EngineWorker();
  w.onmessage = (
    e: MessageEvent<{ id: number; ok: boolean; report?: AnalysisReport; error?: string }>
  ) => {
    const { id, ok, report, error } = e.data;
    const resolve = pending.get(id);
    const reject = pendingReject.get(id);
    pending.delete(id);
    pendingReject.delete(id);
    if (ok && report && resolve) resolve(report);
    else if (reject) reject(new Error(error || 'worker failed'));
  };
  worker = w;
  return w;
}

export function runAnalysisAsync(text: string, minConfidence?: number): Promise<AnalysisReport> {
  const id = ++counter;
  return new Promise((resolve, reject) => {
    pending.set(id, resolve);
    pendingReject.set(id, reject);
    getWorker().postMessage({ id, text, minConfidence });
  });
}
