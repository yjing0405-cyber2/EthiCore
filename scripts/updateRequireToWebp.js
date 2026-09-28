const fs = require('fs');
const path = require('path');

const root = path.resolve('src');
const exts = ['.ts', '.tsx', '.js', '.jsx'];

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && exts.includes(path.extname(entry.name))) out.push(full);
  }
}

const files = [];
walk(root, files);
let changed = 0;
for (const file of files) {
  let s = fs.readFileSync(file, 'utf8');
  let updated = s;
  // replace require('../assets/...png') -> .webp
  updated = updated.replace(/(require\(\s*['\"][^'\"]*?)\.png(\s*['\"]\s*\))/g, (m, p1, p2) => `${p1}.webp${p2}`);
  // replace paths that use ConsequenceImage (singular) to ConsequenceImages
  updated = updated.replace(/ConsequenceImage\//g, 'ConsequenceImages/');
  if (updated !== s) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log('updated:', file);
    changed++;
  }
}
console.log('files changed:', changed);
