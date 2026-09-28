const fs = require('fs');
const z = require('zlib');
const path = process.argv[2] || 'eas_build_b648.txt';
const d = fs.readFileSync(path);
console.log('len', d.length);
console.log('head', d.slice(0,32).toString('hex'));
function tryRun(name, fn){
  try{
    const out = fn(d);
    console.log('SUCCESS', name, 'len', out.length);
    console.log(out.toString('utf8',0,1200));
  }catch(e){
    console.log('FAIL', name, e && e.message ? e.message : e);
  }
}
tryRun('gunzip', (b)=>z.gunzipSync(b));
tryRun('inflate', (b)=>z.inflateSync(b));
tryRun('inflateRaw', (b)=>z.inflateRawSync(b));
if(z.brotliDecompressSync) tryRun('brotli', (b)=>z.brotliDecompressSync(b));
