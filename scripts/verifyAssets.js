const fs = require('fs');
const path = require('path');

const root = path.resolve('src');
const exts = ['.ts', '.tsx', '.js', '.jsx', '.json'];

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && exts.includes(path.extname(entry.name))) out.push(full);
  }
}

const files = [];
walk(root, files);

const assetRegex = /require\(\s*['\"]([^'\"]+\.(?:png|jpg|jpeg|webp|gif))['\"]\s*\)/g;
const importRegex = /['\"]([^'\"]+\.(?:png|jpg|jpeg|webp|gif))['\"]/g;

let totalRefs = 0;
const missing = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = assetRegex.exec(content))) {
    totalRefs++;
    const rel = m[1];
    const candidate = path.resolve(path.dirname(file), rel);
    if (!fs.existsSync(candidate)) missing.push({ source: file, ref: rel, resolved: candidate });
  }
  // also check strings that reference assets directly (e.g., in app.json or maps)
  while ((m = importRegex.exec(content))) {
    totalRefs++;
    const rel = m[1];
    if (rel.startsWith('.') || rel.startsWith('..')) {
      const candidate = path.resolve(path.dirname(file), rel);
      if (!fs.existsSync(candidate)) missing.push({ source: file, ref: rel, resolved: candidate });
    }
  }
}

console.log('Total image references scanned:', totalRefs);
if (missing.length === 0) {
  console.log('All referenced assets exist.');
  process.exit(0);
}

console.log('Missing assets:', missing.length);
for (const m of missing) {
  console.log('- source:', m.source);
  console.log('  ref   :', m.ref);
  console.log('  expect:', m.resolved);
}
process.exit(2);
