import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

interface Limiters {
  perIp: Ratelimit;
  global: Ratelimit;
}

let cached: Limiters | null | undefined;

export function getLimiters(): Limiters | null {
  if (cached !== undefined) return cached;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    cached = null;
    return null;
  }
  const redis = new Redis({ url, token });
  cached = {
    perIp: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        Number(process.env.RATE_PER_IP_LIMIT) || 10,
        (process.env.RATE_PER_IP_WINDOW as `${number} ${string}`) || '1 h'
      ),
      prefix: 'ld:ip',
      analytics: false,
    }),
    global: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        Number(process.env.RATE_GLOBAL_LIMIT) || 800,
        (process.env.RATE_GLOBAL_WINDOW as `${number} ${string}`) || '1 d'
      ),
      prefix: 'ld:global',
      analytics: false,
    }),
  };
  return cached;
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'anon';
}

export type RateCheck =
  | { ok: true }
  | { ok: false; reason: 'ip' | 'global'; retryAfterSec: number };

export async function checkRate(ip: string): Promise<RateCheck> {
  const lim = getLimiters();
  if (!lim) return { ok: true };
  const [ipR, gR] = await Promise.all([lim.perIp.limit(ip), lim.global.limit('global')]);
  if (!ipR.success) {
    return { ok: false, reason: 'ip', retryAfterSec: Math.max(1, Math.ceil((ipR.reset - Date.now()) / 1000)) };
  }
  if (!gR.success) {
    return { ok: false, reason: 'global', retryAfterSec: Math.max(1, Math.ceil((gR.reset - Date.now()) / 1000)) };
  }
  return { ok: true };
}
