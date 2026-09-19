import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.jpg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.xml':'application/xml', '.ttf':'font/ttf', '.woff2':'font/woff2', '.avif':'image/avif', '.png':'image/png', '.txt':'text/plain' };
http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const relative = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  const target = path.join(root, relative);
  if (!target.startsWith(root) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
    res.writeHead(404); res.end('Not found'); return;
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`El’Craso preview: http://127.0.0.1:${port}`));
