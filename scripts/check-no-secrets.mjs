import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const failures = [];
const notes = [];

// The managed key name is assembled at runtime so this checker can scan its
// own source without matching itself.
const MANAGED_KEY_NAME = ['META', 'API', 'KEY'].join('_');
const ASSIGN = '=';

function fail(message) {
  failures.push(message);
}

// 1. .env.example must exist and carry an empty key placeholder.
const examplePath = join(root, '.env.example');
if (!existsSync(examplePath)) {
  fail('.env.example is missing');
} else {
  const example = readFileSync(examplePath, 'utf8');
  const placeholderPattern = new RegExp(`^${MANAGED_KEY_NAME}${ASSIGN}(.*)$`, 'm');
  const match = example.match(placeholderPattern);
  if (!match || match[1].trim().length > 0) {
    fail('.env.example must define an empty META_API_KEY placeholder');
  }
}

// 2. Live env files must be ignored and untracked.
const gitignorePath = join(root, '.gitignore');
const gitignore = existsSync(gitignorePath) ? readFileSync(gitignorePath, 'utf8') : '';
const ignored = gitignore.split(/\r?\n/).map((line) => line.trim());
if (!ignored.includes('.env*') && !ignored.includes('.env.local')) {
  fail('.gitignore must ignore live env files (.env* or .env.local)');
}
try {
  const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' });
  const trackedFiles = tracked.split(/\r?\n/);
  if (trackedFiles.includes('.env.local')) {
    fail('.env.local is tracked by git');
  }
  if (trackedFiles.some((file) => file.startsWith('.env.') && file !== '.env.example')) {
    fail('a live env file is tracked by git');
  }
  notes.push(`git tracks ${trackedFiles.filter(Boolean).length} files; no live env file among them`);
} catch (error) {
  fail(`could not verify git tracking state: ${error.message}`);
}

// 3. Tracked source must not embed secrets or public key prefixes.
const SOURCE_DIRS = ['app', 'components', 'content', 'lib', 'tests', 'scripts'];
const SECRET_PATTERNS = [
  new RegExp(`${MANAGED_KEY_NAME}\\s*${ASSIGN}\\s*['"]?\\S+`),
  /NEXT_PUBLIC_[A-Z0-9_]*(KEY|SECRET|TOKEN)/,
];

function scan(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      scan(full);
      continue;
    }
    if (!/\.(ts|tsx|js|mjs|css|json)$/.test(entry)) {
      continue;
    }
    const text = readFileSync(full, 'utf8');
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(text)) {
        fail(`${relative(root, full)} matches forbidden pattern ${pattern}`);
      }
    }
  }
}

for (const dir of SOURCE_DIRS) {
  const full = join(root, dir);
  if (existsSync(full)) {
    scan(full);
  }
}

for (const note of notes) {
  console.log(`note: ${note}`);
}
if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }
  process.exit(1);
}
console.log('PASS: no secrets in tracked source; live env files ignored and untracked.');
