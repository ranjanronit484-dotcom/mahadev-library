const http = require('http');
const fs = require('fs');
const path = require('path');
const servePath = process.cwd();
const port = process.env.PORT || 8080;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(servePath, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const ct = mime[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(port, () => {
  console.log(`Mahadev Library Server is running at http://localhost:${port}/`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = Number(port) + 1;
    console.log(`Port ${port} in use, trying http://localhost:${nextPort}/...`);
    server.listen(nextPort, () => {
      console.log(`Mahadev Library Server is running at http://localhost:${nextPort}/`);
    });
  } else {
    console.error('Server error:', err);
  }
});
