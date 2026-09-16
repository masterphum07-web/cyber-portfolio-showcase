const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeMap = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(process.cwd(), reqPath.replace(/^\//, ''));

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeMap[ext] || 'application/octet-stream';
  const data = fs.readFileSync(filePath);
  res.writeHead(200, { 'Content-Type': contentType });
  res.end(data);
});

server.listen(8199, '127.0.0.1', async () => {
  console.log('Test HTTP server listening on http://127.0.0.1:8199');

  const testEndpoints = [
    '/',
    '/manifest.webmanifest',
    '/sw.js',
    '/data/projects.json',
    '/assets/icons/favicon.svg',
    '/assets/icons/icon-192.png',
    '/css/style.css',
    '/js/three-hero.js',
    '/js/projects.js',
    '/js/command-palette.js',
    '/js/terminal.js',
    '/js/resume.js'
  ];

  let successCount = 0;
  for (const ep of testEndpoints) {
    try {
      const resp = await fetch(`http://127.0.0.1:8199${ep}`);
      if (resp.status === 200) {
        console.log(`  ✅ HTTP GET ${ep} -> 200 OK (${resp.headers.get('content-type')})`);
        successCount++;
      } else {
        console.error(`  ❌ HTTP GET ${ep} -> ${resp.status}`);
      }
    } catch (e) {
      console.error(`  ❌ Failed to fetch ${ep}:`, e.message);
    }
  }

  if (successCount === testEndpoints.length) {
    console.log('\n🎉 ALL HTTP SERVING CHECKS PASSED!\n');
    server.close();
  } else {
    process.exit(1);
  }
});
