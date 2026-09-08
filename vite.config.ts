import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-only: run the files in /api (Vercel serverless functions) during
// `npm run dev`, so the frontend can call /api/* without `vercel dev`.
// In production Vercel serves these itself and this plugin does nothing.
function apiDevServer(env: Record<string, string>): Plugin {
  return {
    name: 'api-dev-server',
    apply: 'serve',
    configureServer(server) {
      // Expose non-VITE_ vars (EMAIL_SENDER, etc.) to the API handlers.
      for (const [k, v] of Object.entries(env)) {
        if (process.env[k] === undefined) process.env[k] = v;
      }

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next();

        const routePath = req.url.split('?')[0].replace(/\/+$/, '');

        // Match Vercel: underscore-prefixed paths under /api are shared helpers,
        // never HTTP routes.
        if (routePath.split('/').some((seg) => seg.startsWith('_'))) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `API route ${routePath} not found` }));
          return;
        }

        const file = path.resolve(__dirname, '.' + routePath + '.ts');

        let mod: any;
        try {
          mod = await server.ssrLoadModule(file);
        } catch {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `API route ${routePath} not found` }));
          return;
        }

        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const raw = Buffer.concat(chunks).toString('utf8');
        let body: unknown = {};
        try {
          body = raw ? JSON.parse(raw) : {};
        } catch {
          /* leave body as {} */
        }

        const vreq = Object.assign(req, { body });
        const vres = {
          statusCode: 200,
          status(code: number) {
            this.statusCode = code;
            return this;
          },
          json(obj: unknown) {
            res.statusCode = this.statusCode;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(obj));
            return this;
          },
          end(data?: string) {
            res.statusCode = this.statusCode;
            res.end(data);
            return this;
          },
        };

        try {
          await mod.default(vreq, vres);
        } catch (err: any) {
          console.error('[api-dev-server]', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || 'Server error' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), apiDevServer(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
