const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const files = [
  'src/assets/TimeofInternet.png',
  'src/assets/brain-logo.png',
  'src/assets/dct-seal.png',
  'src/assets/ccs-seal.png',
];

(async () => {
  for (const f of files) {
    const abs = path.resolve(f);
    if (!fs.existsSync(abs)) {
      console.warn('not found:', f);
      continue;
    }
    const out = abs.replace(/\.png$/i, '.webp');
    try {
      await sharp(abs).webp({ quality: 80 }).toFile(out);
      console.log('converted:', f, '->', out);
      fs.unlinkSync(abs);
      console.log('removed:', f);
    } catch (err) {
      console.error('error converting', f, err);
    }
  }
})();
