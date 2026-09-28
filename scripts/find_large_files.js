const fs = require('fs');
const path = require('path');

const ignoredDirs = new Set(['.git', 'node_modules', 'android', 'ios', 'build', 'dist', 'web-build', '.expo']);

function walk(dir, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      walk(fullPath, results);
    } else if (entry.isFile()) {
      const stat = fs.statSync(fullPath);
      results.push({ path: fullPath, size: stat.size });
    }
  }
}

const results = [];
walk(process.cwd(), results);
results.sort((a, b) => b.size - a.size);
for (const file of results.slice(0, 50)) {
  console.log(`${(file.size / 1024 / 1024).toFixed(2)} MB\t${file.path}`);
}
