#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- PyCSharp Automated Technical Documentation Generator ---');

const viewsDir = path.join(rootDir, 'src', 'views');
const componentsDir = path.join(rootDir, 'src', 'components');
const dataDir = path.join(rootDir, 'src', 'data');
const docsDir = path.join(rootDir, 'docs');

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

// 1. Analyze Views
const views = fs.readdirSync(viewsDir).filter(f => f.endsWith('.tsx'));
// 2. Analyze Interactive Components
const components = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));
// 3. Analyze Data Modules
const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));

console.log(`Discovered ${views.length} Curriculum Views, ${components.length} Components, ${dataFiles.length} Data modules.`);

const now = new Date().toISOString();

const catalogContent = `# PyCSharp - Automated Modules Catalog
*Generated automatically by \`scripts/generate-docs.mjs\` on ${now}*

## 📚 Curriculum Views (${views.length} Modules)
| View Component | Source File | Category |
| :--- | :--- | :--- |
${views.map(v => `| \`${v.replace('.tsx', '')}\` | \`src/views/${v}\` | Chapter View |`).join('\n')}

## ⚙️ Interactive Architectural Visualizers & Sub-Components (${components.length} Modules)
| Component | Source File | Description |
| :--- | :--- | :--- |
${components.map(c => `| \`${c.replace('.tsx', '')}\` | \`src/components/${c}\` | Interactive Component |`).join('\n')}

## 🗄️ Curriculum Datasets & Reference Engines (${dataFiles.length} Datasets)
| Dataset Engine | Source File | Scope |
| :--- | :--- | :--- |
${dataFiles.map(d => `| \`${d.replace('.ts', '')}\` | \`src/data/${d}\` | Technical Reference |`).join('\n')}

---
**Code Owner:** Aditya Rachuri (adityarachuri@outlook.com)  
**Repository:** https://github.com/adityarachuri/pycsharp
`;

fs.writeFileSync(path.join(docsDir, 'MODULES_CATALOG.md'), catalogContent, 'utf-8');
console.log('✅ Updated docs/MODULES_CATALOG.md');
