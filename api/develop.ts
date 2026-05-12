import { develop, type ChainMemory } from '../lib/develop-core';
import { checkRate, getClientIp } from '../lib/ratelimit';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return new Response('LLM 未配置', { status: 503 });

  const ip = getClientIp(req);
  const rate = await checkRate(ip);
  if (!rate.ok) {
    const msg =
      rate.reason === 'ip'
        ? '你这一小时的次数用完了，先去歇歇，下个整点再来。'
        : '今天的总额度已经用完，明天再来 :)';
    return new Response(msg, {
      status: 429,
      headers: { 'Retry-After': String(rate.retryAfterSec) },
    });
  }

  let text = '';
  let chainMemory: ChainMemory | undefined;
  try {
    const body = await req.json();
    text = String(body.text ?? '').trim();
    if (body.chainMemory && typeof body.chainMemory === 'object') {
      chainMemory = body.chainMemory as ChainMemory;
    }
  } catch {
    return new Response('invalid body', { status: 400 });
  }
  if (!text) return new Response('empty text', { status: 400 });
  if (text.length > 4000) return new Response('text too long', { status: 413 });

  try {
    const report = await develop(text, apiKey, req.signal, chainMemory);
    return new Response(JSON.stringify(report), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 502 });
  }
}
