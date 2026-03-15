// NOVA TECH — Static File Server
const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5173;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.ico':  'image/x-icon'
};

http.createServer((req, res) => {
  const url  = req.url.split('?')[0];
  const fp   = path.join(ROOT, url === '/' ? 'index.html' : url);
  const ext  = path.extname(fp);
  const type = MIME[ext] || 'text/plain';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');

  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
    res.writeHead(200, { 'Content-Type': type });
    fs.createReadStream(fp).pipe(res);
  } else {
    // SPA fallback → index.html
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(path.join(ROOT, 'index.html')).pipe(res);
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`NOVA TECH running → http://localhost:${PORT}`);
});
