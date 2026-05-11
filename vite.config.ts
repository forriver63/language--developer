import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { develop } from './lib/develop-core';

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
        let raw = '';
        for await (const c of req) raw += c.toString();
        let text = '';
        try {
          text = String(JSON.parse(raw).text ?? '').trim();
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
          const report = await develop(text, apiKey);
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
