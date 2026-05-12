import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { develop, type ChainMemory } from './lib/develop-core';
import { checkRate, getClientIp } from './lib/ratelimit';

function devApiPlugin(): PluginOption {
  return {
    name: 'dev-api-develop',
    configureServer(server) {
      server.middlewares.use('/api/develop', async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        const apiKey = process.env.DEEPSEEK_API_KEY;
        if (!apiKey) {
          res.statusCode = 503;
          res.end('LLM not configured');
          return;
        }
        const fakeReq = new Request('http://x', {
          method: 'POST',
          headers: Object.fromEntries(
            Object.entries(req.headers).filter(([, v]) => typeof v === 'string') as [string, string][]
          ),
        });
        const ip = getClientIp(fakeReq);
        const rate = await checkRate(ip);
        if (!rate.ok) {
          res.statusCode = 429;
          res.setHeader('Retry-After', String(rate.retryAfterSec));
          res.end(rate.reason === 'ip' ? '你这一小时的次数用完了。' : '今天的总额度已用完。');
          return;
        }
        let raw = '';
        for await (const c of req) raw += c.toString();
        let text = '';
        let chainMemory: ChainMemory | undefined;
        try {
          const body = JSON.parse(raw);
          text = String(body.text ?? '').trim();
          if (body.chainMemory && typeof body.chainMemory === 'object') {
            chainMemory = body.chainMemory as ChainMemory;
          }
        } catch {
          res.statusCode = 400;
          res.end('invalid body');
          return;
        }
        if (!text) {
          res.statusCode = 400;
          res.end('empty text');
          return;
        }
        try {
          const report = await develop(text, apiKey, undefined, chainMemory);
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(report));
        } catch (e) {
          res.statusCode = 502;
          res.end((e as Error).message);
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.DEEPSEEK_API_KEY) process.env.DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
  return {
    plugins: [react(), devApiPlugin()],
    build: { target: 'es2020' },
  };
});
