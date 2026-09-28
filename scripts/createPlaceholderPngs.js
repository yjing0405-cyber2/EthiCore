const fs = require('fs');
const path = require('path');

const outDir = path.resolve('src/screens/assets');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 1x1 transparent PNG
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMBAQJcG0sAAAAASUVORK5CYII=';
const buf = Buffer.from(pngBase64, 'base64');

const files = ['time_per_day_spent_internet.png', 'TimeofInternet.png'];
for (const f of files) {
  const p = path.join(outDir, f);
  fs.writeFileSync(p, buf);
  console.log('wrote', p);
}
