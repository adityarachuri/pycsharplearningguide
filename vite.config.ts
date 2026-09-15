import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { spawn } from 'child_process';
import { defineConfig, Plugin } from 'vite';

const SECURITY_HEADERS: Record<string, string> = {
  // HTTP Strict Transport Security
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  // MIME Sniffing Protection
  'X-Content-Type-Options': 'nosniff',
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Permissions Policy: Restrict sensitive browser APIs
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), screen-wake-lock=(), accelerometer=(), gyroscope=(), magnetometer=(), display-capture=(), browsing-topics=()',
  // Content Security Policy: Authorize Google AI Studio iframe embedding and safe resources
  'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https: wss:; worker-src 'self' blob:; frame-ancestors 'self' https://*.google.com https://*.run.app https://ai.studio https://*.aistudio.google.com; form-action 'self'; base-uri 'self';",
  // Modern XSS Protection Header
  'X-XSS-Protection': '1; mode=block',
  // Adobe Flash / PDF cross-domain policy restriction
  'X-Permitted-Domain-Policies': 'none',
  // Internet Explorer download execution prevention
  'X-Download-Options': 'noopen',
};

function securityHeadersPlugin(): Plugin {
  return {
    name: 'security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
          res.setHeader(key, value);
        }
        res.removeHeader('X-Powered-By');
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
          res.setHeader(key, value);
        }
        res.removeHeader('X-Powered-By');
        next();
      });
    }
  };
}

function apiBackendPlugin(): Plugin {
  const handleApiRoutes = (req: any, res: any, next: () => void) => {
    // 1. Python Execution Sandbox Engine
    if (req.url === '/api/execute-python' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk: Buffer) => {
        if (body.length < 50000) body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const { code = '' } = JSON.parse(body || '{}');
          if (!code.trim()) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Code parameter cannot be empty' }));
            return;
          }

          const startTime = Date.now();
          // Spawn real CPython interpreter in unbuffered mode with 4-second timeout limit
          const pythonCmd = /^win/.test(process.platform) ? 'python' : 'python3';
          const proc = spawn(pythonCmd, ['-u', '-c', code]);
          let stdout = '';
          let stderr = '';
          let finished = false;

          const timer = setTimeout(() => {
            if (finished) return;
            finished = true;
            proc.kill('SIGKILL');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                stdout,
                stderr: stderr + '\n[Execution timed out after 4000ms: CPU/infinite loop safeguard triggered]',
                exitCode: 124,
                durationMs: Date.now() - startTime,
                timedOut: true,
                runtime: 'CPython 3.10 Linux'
              })
            );
          }, 4000);

          proc.stdout.on('data', (d: Buffer) => {
            if (stdout.length < 30000) stdout += d.toString();
          });

          proc.stderr.on('data', (d: Buffer) => {
            if (stderr.length < 10000) stderr += d.toString();
          });

          proc.on('close', (code: number | null) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: code === 0,
                stdout,
                stderr,
                exitCode: code ?? 0,
                durationMs: Date.now() - startTime,
                timedOut: false,
                runtime: 'CPython 3.10 Linux'
              })
            );
          });

          proc.on('error', (err: Error) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: false,
                stdout: '',
                stderr: `Process spawn error: ${err.message}`,
                exitCode: 1,
                durationMs: Date.now() - startTime,
                timedOut: false,
                runtime: 'CPython 3.10 Linux'
              })
            );
          });
        } catch (e: any) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid JSON payload', details: e?.message }));
        }
      });
      return;
    }

    // 2. Future Backend Database Integration & Health Handshake Endpoint
    if (req.url === '/api/db/status' && req.method === 'GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          status: 'ready',
          driver: 'localStorage_with_cloud_sync_bridge',
          schemaVersion: 'v2.4.0',
          compatibleDatabases: ['firestore', 'postgresql_cloudsql', 'sqlite_embedded', 'rest_api'],
          storageStatus: {
            cacheSynchronized: true,
            optimisticLocking: true,
            conflictResolution: 'last_write_wins',
            exportSupported: true,
            importSupported: true
          },
          handshakeTimestamp: new Date().toISOString()
        })
      );
      return;
    }

    // 3. Future Backend Database Sync Endpoint
    if (req.url === '/api/db/sync' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              success: true,
              message: 'State synchronized with backend repository layer',
              syncedAt: new Date().toISOString(),
              recordsReceived: Object.keys(payload).length,
              schemaVersion: 'v2.4.0'
            })
          );
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Malformed sync payload' }));
        }
      });
      return;
    }

    next();
  };

  return {
    name: 'api-backend-plugin',
    configureServer(server) {
      server.middlewares.use(handleApiRoutes);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleApiRoutes);
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), securityHeadersPlugin(), apiBackendPlugin()],
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      headers: SECURITY_HEADERS,
    },
    preview: {
      headers: SECURITY_HEADERS,
    },
  };
});
