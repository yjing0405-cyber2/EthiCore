const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
let content = '';
try {
  content = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error('Could not read .env at', envPath);
  console.error(e.message || e);
  process.exit(1);
}

const lines = content.split(/\r?\n/);
const keyNameRegex = /^EXPO_PUBLIC_GROQ_API_KEY(_\d+)?$/i;
const valueRegex = /^gsk_[A-Za-z0-9_-]{40,}$/;

const found = [];
for (const line of lines) {
  if (!line || line.trim().startsWith('#')) continue;
  const m = line.match(/^([^=]+)=(.*)$/);
  if (!m) continue;
  const name = m[1].trim();
  const val = m[2].trim();
  if (keyNameRegex.test(name)) {
    const parts = val.split(',').map(s => s.trim()).filter(Boolean);
    for (const p of parts) {
      found.push({ name, key: p, valid: valueRegex.test(p) });
    }
  }
}

if (found.length === 0) {
  console.log('No EXPO_PUBLIC_GROQ_API_KEY* entries found in .env');
  process.exit(0);
}

console.log('Detected Groq key entries:');
found.forEach((k, i) => {
  console.log(`${i + 1}. ${k.name} -> ${k.key} (${k.valid ? 'valid' : 'INVALID'})`);
});
console.log(`Summary: total keys: ${found.length}, valid: ${found.filter(k => k.valid).length}`);
