import { develop } from '../lib/develop-core';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return new Response('LLM not configured', { status: 503 });

  let text = '';
  try {
    const body = await req.json();
    text = String(body.text ?? '').trim();
  } catch {
    return new Response('invalid body', { status: 400 });
  }
  if (!text) return new Response('empty text', { status: 400 });
  if (text.length > 4000) return new Response('text too long', { status: 413 });

  try {
    const report = await develop(text, apiKey, req.signal);
    return new Response(JSON.stringify(report), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 502 });
  }
}
