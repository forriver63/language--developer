import { runAnalysis } from './index';

self.onmessage = (e: MessageEvent<{ id: number; text: string; minConfidence?: number }>) => {
  const { id, text, minConfidence } = e.data;
  try {
    const report = runAnalysis(text, { minConfidence });
    (self as unknown as Worker).postMessage({ id, ok: true, report });
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, ok: false, error: String(err) });
  }
};
