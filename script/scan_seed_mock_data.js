#!/usr/bin/env node

/**
 * Audit and Detection Script: Sample, Seed, Default, and Mock Data Finder
 *
 * Scans the codebase across VerdantIQCLIENT and VerdantIQServices for:
 * 1. Hardcoded mock arrays / objects (e.g. SEEDED_*, MOCK_*, SAMPLE_*, dummyData)
 * 2. Hardcoded fallback fake entities (names, dummy accounts, synthetic records)
 * 3. Default constant data arrays injected into UI views or routes
 *
 * Usage:
 *   node script/scan_seed_mock_data.js
 *   node script/scan_seed_mock_data.js --strict
 *   node script/scan_seed_mock_data.js --json
 */

const fs = require('fs');
const path = require('path');

const ARGS = process.argv.slice(2);
const IS_STRICT = ARGS.includes('--strict');
const IS_JSON = ARGS.includes('--json');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const SCAN_DIRS = [
  path.join(PROJECT_ROOT, 'VerdantIQCLIENT', 'app'),
  path.join(PROJECT_ROOT, 'VerdantIQCLIENT', 'components'),
  path.join(PROJECT_ROOT, 'VerdantIQCLIENT', 'lib'),
  path.join(PROJECT_ROOT, 'VerdantIQCLIENT', 'context'),
  path.join(PROJECT_ROOT, 'VerdantIQServices', 'ml-gateway', 'app'),
  path.join(PROJECT_ROOT, 'VerdantIQServices', 'sb-gateway', 'src'),
];

const IGNORED_DIRS = new Set([
  'node_modules',
  '.next',
  'build',
  'dist',
  'win-unpacked',
  '.venv',
  '__pycache__',
  'target',
  '.mvn',
  '.git',
  '.gradle',
]);

// Exclude standalone DB seed migration routes / seeding utilities from flagging
const EXCLUDED_PATHS = [
  path.normalize('VerdantIQCLIENT/app/api/db/seed/route.ts'),
  path.normalize('VerdantIQCLIENT/app/api/db/init/route.ts'),
  path.normalize('VerdantIQCLIENT/scripts/seed_database.js'),
];

const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.py', '.java']);

const PATTERNS = [
  {
    name: 'Seeded / Mock Identifier Pattern',
    regex: /\b(?:SEEDED_|MOCK_|SAMPLE_|DUMMY_|INITIAL_SAMPLE_|DEFAULT_SAMPLE_)[A-Z0-9_]*\b/g,
  },
  {
    name: 'Mock Data Variable Pattern',
    regex: /\b(?:mockData|dummyData|sampleData|seedData|mockEvents|fakeData)\b/g,
  },
  {
    name: 'Hardcoded Mock Constant Definition',
    regex: /const\s+(?:mock[A-Z]\w*|dummy[A-Z]\w*|sample[A-Z]\w*)\s*[:=]/g,
  },
  {
    name: 'Default Mock Data Array Assignment',
    regex: /const\s+[A-Za-z0-9_]*(?:Mock|Dummy|Sample)\s*[:=]\s*\[/g,
  },
];

const findings = [];

function scanFile(filePath) {
  const relPath = path.relative(PROJECT_ROOT, filePath).replace(/\\/g, '/');

  // Skip intentional database init/seed scripts if not in strict mode
  if (!IS_STRICT && EXCLUDED_PATHS.some((ex) => relPath.includes(path.normalize(ex).replace(/\\/g, '/')))) {
    return;
  }

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    return;
  }

  const lines = content.split('\n');

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const rawLine = lines[lineNum];
    const trimmed = rawLine.trim();

    // Skip comment lines
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('#')
    ) {
      continue;
    }

    for (const pat of PATTERNS) {
      pat.regex.lastIndex = 0;
      const match = pat.regex.exec(rawLine);
      if (match) {
        findings.push({
          file: relPath,
          line: lineNum + 1,
          rule: pat.name,
          matched: match[0],
          preview: trimmed.slice(0, 110),
        });
        break; // one match per line
      }
    }
  }
}

function walkDirectory(dirPath) {
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(full);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.has(ext)) {
        scanFile(full);
      }
    }
  }
}

for (const dir of SCAN_DIRS) {
  if (fs.existsSync(dir)) {
    walkDirectory(dir);
  }
}

if (IS_JSON) {
  console.log(JSON.stringify(findings, null, 2));
} else {
  console.log('='.repeat(70));
  console.log('  VERDANTIQ ZERO-MOCK / ZERO-SEED CODEBASE AUDITOR');
  console.log('='.repeat(70));
  console.log(`Directories Scanned : ${SCAN_DIRS.length}`);
  console.log(`Strict Mode         : ${IS_STRICT ? 'ENABLED' : 'DISABLED (seeding routes excluded)'}`);
  console.log(`Total Violations    : ${findings.length}\n`);

  if (findings.length === 0) {
    console.log(' [PASS] No hardcoded seed, mock, or default dummy data constants found in application code.');
  } else {
    findings.forEach((f, idx) => {
      console.log(`[${idx + 1}] ${f.file}:${f.line}`);
      console.log(`    Matched: "${f.matched}" (${f.rule})`);
      console.log(`    Code   : ${f.preview}\n`);
    });
  }
}

process.exit(findings.length === 0 ? 0 : 1);
