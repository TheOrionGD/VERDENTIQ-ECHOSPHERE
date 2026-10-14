import fs from 'fs';
import { execSync } from 'child_process';

function runLinter() {
  const out = execSync('npx oxlint -f json', { encoding: 'utf-8' });
  return JSON.parse(out).diagnostics;
}

const diags = runLinter();
const unusedImports = diags.filter(d => d.code === 'eslint(no-unused-vars)' && d.help && d.help.includes('import'));

// Group by file
const filesMap = {};
for (const u of unusedImports) {
  if (!filesMap[u.filename]) filesMap[u.filename] = new Set();
  const match = u.message.match(/Identifier '([^']+)' is imported/);
  if (match) {
    filesMap[u.filename].add(match[1]);
  }
}

for (const [filePath, set] of Object.entries(filesMap)) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const ident of set) {
    // Regex to remove ident from import lists
    const r1 = new RegExp('\\b' + ident + '\\s*,\\s*', 'g');
    const r2 = new RegExp(',?\\s*\\b' + ident + '\\b', 'g');
    
    let updated = content.replace(r1, '');
    if (updated === content) {
      updated = content.replace(r2, '');
    }
    content = updated;
  }
  
  // Clean up any empty imports like import { } from '...'
  content = content.replace(/import\s*\{\s*\}\s*from\s*['"][^'"]+['"];?\r?\n?/g, '');
  fs.writeFileSync(filePath, content, 'utf-8');
}

console.log('Unused imports cleanup pass complete.');
