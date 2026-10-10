// BC Mastery server. Zero dependencies: run `node server.js`, open http://localhost:3000
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const PORT = +process.env.PORT || 3000, HOST = process.env.HOST || '127.0.0.1';
const ROOT = path.join(__dirname, 'public'), DATA = path.join(__dirname, 'data'), PROG = path.join(DATA, 'progress');
fs.mkdirSync(PROG, { recursive: true });
const jread = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return d; } };
const jwrite = (f, o) => { const t = f + '.tmp'; fs.writeFileSync(t, JSON.stringify(o)); fs.renameSync(t, f); };
const UF = path.join(DATA, 'users.json'), SF = path.join(DATA, 'sessions.json');
const users = jread(UF, {}), sessions = jread(SF, {});
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const uid = (n) => String(n).toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 32);
const scrypt = (p, s) => new Promise((ok, no) => crypto.scrypt(p, s, 64, (e, k) => (e ? no(e) : ok(k.toString('hex')))));
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
const readBody = (req) => new Promise((ok) => { let b = ''; req.on('data', (c) => { b += c; if (b.length > 6e6) req.destroy(); }); req.on('end', () => { try { ok(JSON.parse(b || '{}')); } catch (e) { ok({}); } }); });
const tries = new Map(); // simple brute-force limiter: 8 attempts / 5 min / ip+name
const limited = (k) => { const n = Date.now(), a = (tries.get(k) || []).filter((t) => n - t < 3e5); a.push(n); tries.set(k, a); return a.length > 8; };
const newSession = (id) => { const t = crypto.randomBytes(32).toString('hex'); sessions[t] = { id, at: Date.now() }; jwrite(SF, sessions); return t; };
const auth = (req) => { const t = (req.headers.authorization || '').replace('Bearer ', ''); const s = sessions[t]; return s && Date.now() - s.at < 30 * 864e5 ? { id: s.id, t } : null; };
const progFile = (id) => path.join(PROG, id + '.json');
const clean = (p) => ({ chk: p.chk || {}, st: p.st || {}, log: (p.log || []).slice(0, 300), frq: (p.frq || []).slice(0, 200), hist: (p.hist || []).slice(-500), seen: p.seen || {}, ts: +p.ts || Date.now() });

async function api(req, res, url) {
  const ep = url.pathname.slice(5), ip = req.socket.remoteAddress;
  if (ep === 'register' && req.method === 'POST') {
    const { name, pin } = await readBody(req); const id = uid(name || '');
    if (id.length < 2 || String(pin || '').length < 4) return send(res, 400, { error: 'Username (2+ chars) and PIN (4+ chars) required.' });
    if (users[id]) return send(res, 409, { error: 'That username exists. Sign in instead.' });
    const salt = crypto.randomBytes(16).toString('hex'); users[id] = { name: String(name).slice(0, 32), salt, hash: await scrypt(String(pin), salt), created: Date.now() }; jwrite(UF, users);
    return send(res, 200, { token: newSession(id), id, name: users[id].name, progress: {} });
  }
  if (ep === 'login' && req.method === 'POST') {
    const { name, pin } = await readBody(req); const id = uid(name || '');
    if (limited(ip + id)) return send(res, 429, { error: 'Too many attempts. Wait a few minutes.' });
    const u = users[id]; if (!u || (await scrypt(String(pin || ''), u.salt)) !== u.hash) return send(res, 401, { error: 'Wrong username or PIN.' });
    return send(res, 200, { token: newSession(id), id, name: u.name, progress: jread(progFile(id), {}) });
  }
  const a = auth(req); if (!a) return send(res, 401, { error: 'Not signed in.' });
  if (ep === 'progress' && req.method === 'GET') return send(res, 200, { id: a.id, name: users[a.id].name, progress: jread(progFile(a.id), {}) });
  if (ep === 'progress' && req.method === 'PUT') { const p = await readBody(req); jwrite(progFile(a.id), clean(p)); return send(res, 200, { ok: true }); }
  if (ep === 'logout' && req.method === 'POST') { delete sessions[a.t]; jwrite(SF, sessions); return send(res, 200, { ok: true }); }
  send(res, 404, { error: 'Not found' });
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    if (url.pathname.startsWith('/api/')) return await api(req, res, url);
    let p = decodeURIComponent(url.pathname); if (p.endsWith('/')) p += 'index.html';
    const f = path.normalize(path.join(ROOT, p)); if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.readFile(f, (e, d) => {
      if (e) { res.writeHead(404); return res.end('Not found'); }
      const ext = path.extname(f); res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': f.includes('vendor') ? 'public,max-age=604800' : 'no-cache' }); res.end(d);
    });
  } catch (e) { send(res, 500, { error: 'Server error' }); }
}).listen(PORT, HOST, () => console.log(`BC Mastery running at http://${HOST === '127.0.0.1' ? 'localhost' : HOST}:${PORT}`));
