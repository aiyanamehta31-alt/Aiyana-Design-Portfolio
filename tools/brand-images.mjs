// Makes web copies of one brand's images for the Branding project:
//
//   node tools/brand-images.mjs <brand> [--crops-only]
//
// Reads every PNG/JPG in content/branding/<brand>/ and writes, to
// assets/images/projects/branding/<brand>/, keeping the file name:
//   <name>.webp      the full picture (max 2400px wide, quality 0.84)
//   <name>-sm.webp   a small copy (max 720px wide) for the book's pages
// Crops (logos, monograms) are listed in tools/brand-crops/<brand>.json as
//   { "name": "logo-primary", "from": "file.png", "x": 0, "y": 0, "w": 100, "h": 100 }
// in the original's pixels, and are written as <name>.webp (max 1200px wide).
// Uses your installed Chrome or Edge (headless) to encode, so nothing needs
// installing. Originals are never changed.
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { tmpdir } from 'node:os';

// `--project <slug>` does the same for a whole project: content/<slug>/ → assets/images/projects/<slug>/.
const asProject = process.argv[2] === '--project';
const brand = asProject ? process.argv[3] : process.argv[2];
if (!brand || !/^[a-z0-9-]+$/.test(brand)) { console.error('usage: node tools/brand-images.mjs <brand-slug> | --project <slug>'); process.exit(1); }
const src = asProject ? join('content', brand) : join('content', 'branding', brand);
const out = asProject ? join('assets', 'images', 'projects', brand) : join('assets', 'images', 'projects', 'branding', brand);
const cropFile = join('tools', 'brand-crops', brand + '.json');
if (!existsSync(src)) { console.error('No folder ' + src); process.exit(1); }
mkdirSync(out, { recursive: true });

const chrome = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome', '/usr/bin/chromium'
].find(existsSync);
if (!chrome) { console.error('No Chrome, Edge or Chromium found.'); process.exit(1); }

const files = readdirSync(src).filter((f) => /\.(png|jpe?g)$/i.test(f));
const crops = existsSync(cropFile) ? JSON.parse(readFileSync(cropFile, 'utf8')) : [];
const dir = mkdtempSync(join(tmpdir(), 'brand-img-'));
const proc = spawn(chrome, ['--headless=new', '--remote-debugging-port=0', '--user-data-dir=' + dir, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const ws = await new Promise((res, rej) => {
  let buf = ''; proc.stderr.on('data', (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); });
  setTimeout(() => rej(new Error('Chrome did not start')), 20000);
});
const sock = new WebSocket(ws);
await new Promise((r) => { sock.onopen = r; });
let id = 0; const pending = new Map();
sock.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}, sessionId) => new Promise((r) => { const i = ++id; pending.set(i, r); sock.send(JSON.stringify({ id: i, method, params, sessionId })); });
const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });

// Draws part of a picture (the whole of it by default) at up to `max` px wide, as WebP.
async function encode(f, max, box) {
  const type = /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';
  const data = 'data:' + type + ';base64,' + readFileSync(join(src, f)).toString('base64');
  const expr = `new Promise(function (done) { var i = new Image(); i.onload = function () {
      var b = ${JSON.stringify(box || null)} || { x: 0, y: 0, w: i.naturalWidth, h: i.naturalHeight };
      var s = Math.min(1, ${max} / b.w), c = document.createElement('canvas');
      c.width = Math.round(b.w * s); c.height = Math.round(b.h * s);
      var g = c.getContext('2d'); g.imageSmoothingQuality = 'high';
      g.drawImage(i, b.x, b.y, b.w, b.h, 0, 0, c.width, c.height);
      done(c.toDataURL('image/webp', 0.84)); }; i.src = ${JSON.stringify(data)}; })`;
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }, sessionId);
  return r.result && r.result.result && r.result.result.value;
}
function save(name, url) {
  if (!url) { console.log('skipped ' + name); return; }
  writeFileSync(join(out, name), Buffer.from(url.split(',')[1], 'base64'));
  console.log(out + '/' + name);
}

const cropsOnly = process.argv.includes('--crops-only');
for (const f of cropsOnly ? [] : files) {
  const name = basename(f, extname(f)).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  save(name + '.webp', await encode(f, 2400));
  save(name + '-sm.webp', await encode(f, 720));
}
for (const c of crops) save(c.name + '.webp', await encode(c.from, c.max || 1200, { x: c.x, y: c.y, w: c.w, h: c.h }));

sock.close();
proc.kill();
// Chrome needs a moment to let go of its profile before it can be removed.
await new Promise((r) => { proc.once('exit', r); setTimeout(r, 3000); });
try { rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {}
