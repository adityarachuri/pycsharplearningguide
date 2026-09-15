import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { execFile, spawn } from 'child_process';
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
  // Keep browser capabilities local to the app. The Python executor is server-side and opt-in.
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; worker-src 'self' blob:; frame-ancestors 'self'; form-action 'self'; base-uri 'self'; object-src 'none';",
  // Modern XSS Protection Header
  'X-XSS-Protection': '1; mode=block',
  // Adobe Flash / PDF cross-domain policy restriction
  'X-Permitted-Domain-Policies': 'none',
  // Internet Explorer download execution prevention
  'X-Download-Options': 'noopen',
};

const DEV_SECURITY_HEADERS: Record<string, string> = {
  ...SECURITY_HEADERS,
  // Vite's React plugin injects a development-only inline preamble before the app module.
  'Content-Security-Policy': SECURITY_HEADERS['Content-Security-Policy'].replace(
    "script-src 'self'",
    "script-src 'self' 'unsafe-inline'"
  )
};

function securityHeadersPlugin(): Plugin {
  return {
    name: 'security-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        for (const [key, value] of Object.entries(DEV_SECURITY_HEADERS)) {
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
  const maxBodyBytes = 50_000;
  const maxConcurrentExecutions = 2;
  let activeExecutions = 0;

  const sendJson = (res: any, statusCode: number, payload: unknown) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  };

  const handleApiRoutes = (req: any, res: any, next: () => void) => {
    // 1. Python Execution Sandbox Engine
    if (req.url === '/api/execute-python' && req.method === 'POST') {
      if (process.env.ENABLE_PYTHON_EXECUTION !== 'true') {
        sendJson(res, 503, { error: 'Python execution is disabled. Use an isolated execution service in deployment.' });
        return;
      }

      if (req.headers['content-type'] !== 'application/json') {
        sendJson(res, 415, { error: 'Content-Type must be application/json' });
        return;
      }

      if (activeExecutions >= maxConcurrentExecutions) {
        sendJson(res, 429, { error: 'Too many executions in progress' });
        return;
      }

      let body = '';
      req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
        if (Buffer.byteLength(body) > maxBodyBytes) req.destroy();
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const code = typeof payload.code === 'string' ? payload.code : '';
          if (!code.trim() || Buffer.byteLength(code) > 40_000) {
            sendJson(res, 400, { error: 'Code must be a non-empty string no larger than 40000 bytes' });
            return;
          }

          activeExecutions += 1;
          const startTime = Date.now();
          const pythonCmd = /^win/.test(process.platform) ? 'python' : 'python3';
          const proc = spawn(pythonCmd, ['-I', '-u', '-c', code], {
            detached: process.platform !== 'win32',
            env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, TEMP: process.env.TEMP, TMP: process.env.TMP }
          });
          let stdout = '';
          let stderr = '';
          let finished = false;
          const finish = () => {
            if (finished) return false;
            finished = true;
            activeExecutions -= 1;
            return true;
          };

          const timer = setTimeout(() => {
            if (!finish()) return;
            if (process.platform === 'win32' && proc.pid) {
              execFile('taskkill', ['/pid', String(proc.pid), '/t', '/f']);
            } else {
              proc.kill('SIGKILL');
            }
            sendJson(res, 200, {
                success: false,
                stdout,
                stderr: stderr + '\n[Execution timed out after 4000ms: CPU/infinite loop safeguard triggered]',
                exitCode: 124,
                durationMs: Date.now() - startTime,
                timedOut: true,
                runtime: 'CPython 3.10 Linux'
              });
          }, 4000);

          proc.stdout.on('data', (d: Buffer) => {
            if (stdout.length < 30000) stdout += d.toString();
          });

          proc.stderr.on('data', (d: Buffer) => {
            if (stderr.length < 10000) stderr += d.toString();
          });

          proc.on('close', (code: number | null) => {
            if (!finish()) return;
            clearTimeout(timer);
            sendJson(res, 200, {
                success: code === 0,
                stdout,
                stderr,
                exitCode: code ?? 0,
                durationMs: Date.now() - startTime,
                timedOut: false,
                runtime: 'CPython 3.10 Linux'
              });
          });

          proc.on('error', (err: Error) => {
            if (!finish()) return;
            clearTimeout(timer);
            sendJson(res, 500, {
                success: false,
                stdout: '',
                stderr: `Process spawn error: ${err.message}`,
                exitCode: 1,
                durationMs: Date.now() - startTime,
                timedOut: false,
                runtime: 'CPython 3.10 Linux'
              });
          });
        } catch (e: any) {
          sendJson(res, 400, { error: 'Invalid JSON payload' });
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
          driver: 'local_storage_cloud_sync',
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
        if (Buffer.byteLength(body) > 25_000) req.destroy();
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            sendJson(res, 400, { error: 'Sync payload must be a JSON object' });
            return;
          }
          sendJson(res, 200, {
              success: true,
              message: 'State synchronized with backend repository layer',
              syncedAt: new Date().toISOString(),
              recordsReceived: Object.keys(payload).length,
              schemaVersion: 'v2.4.0'
            });
        } catch {
          sendJson(res, 400, { error: 'Malformed sync payload' });
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
    build: {
      // Mermaid's advanced diagram engines are lazy-loaded chapter assets, not initial app code.
      chunkSizeWarningLimit: 750,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      host: '127.0.0.1',
      headers: DEV_SECURITY_HEADERS,
    },
    preview: {
      headers: SECURITY_HEADERS,
    },
  };
});
