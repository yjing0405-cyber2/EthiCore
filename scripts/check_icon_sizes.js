const fs = require('fs');
const path = require('path');
const assets = [
  'src/assets/Icon.png',
  'src/assets/brain-logo.png',
  'src/assets/brain-logo-small.png',
];
for (const asset of assets) {
  const file = path.resolve(asset);
  if (!fs.existsSync(file)) {
    console.log(`${asset}: missing`);
    continue;
  }
  const buf = fs.readFileSync(file);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  console.log(`${asset}: ${width}x${height}, ${Math.round(buf.length / 1024)}KB`);
}
