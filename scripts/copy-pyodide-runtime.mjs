// Vendors the minimal Pyodide runtime (interpreter + stdlib, no extra
// scientific packages) from node_modules into public/pyodide/ so it's
// served same-origin — required to keep the sandbox working under the
// site's strict CSP (no third-party CDN script/connect sources) and to
// keep the in-browser sandbox fully offline-capable once cached.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(projectRoot, 'node_modules', 'pyodide');
const targetDir = path.join(projectRoot, 'public', 'pyodide');

const REQUIRED_FILES = [
  'pyodide.mjs',
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'pyodide-lock.json',
  'python_stdlib.zip'
];

if (!fs.existsSync(sourceDir)) {
  console.warn('⚠️  node_modules/pyodide not found — skipping runtime vendoring (run `npm install` first).');
  process.exit(0);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const file of REQUIRED_FILES) {
  const src = path.join(sourceDir, file);
  const dest = path.join(targetDir, file);
  if (!fs.existsSync(src)) {
    console.error(`❌ Missing expected Pyodide file: ${file}`);
    process.exit(1);
  }
  fs.copyFileSync(src, dest);
}

const totalBytes = REQUIRED_FILES.reduce(
  (sum, file) => sum + fs.statSync(path.join(targetDir, file)).size,
  0
);
console.log(`✅ Vendored Pyodide runtime (${(totalBytes / 1024 / 1024).toFixed(1)} MB) into public/pyodide/`);
