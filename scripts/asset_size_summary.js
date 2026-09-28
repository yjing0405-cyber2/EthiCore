const fs = require('fs');
const path = require('path');

function walk(dir, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, results);
    } else if (entry.isFile()) {
      const stat = fs.statSync(fullPath);
      results.push({ path: fullPath, size: stat.size });
    }
  }
}

const base = path.resolve('src/assets');
if (!fs.existsSync(base)) {
  console.error('src/assets does not exist');
  process.exit(1);
}
const files = [];
walk(base, files);
const total = files.reduce((sum, f) => sum + f.size, 0);
files.sort((a, b) => b.size - a.size);
console.log('TOTAL src/assets size MB:', (total / 1024 / 1024).toFixed(2));
console.log('TOP 20 largest files:');
files.slice(0, 20).forEach(file => console.log(`${(file.size / 1024 / 1024).toFixed(2)} MB\t${file.path}`));
