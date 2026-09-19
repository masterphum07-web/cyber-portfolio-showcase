const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

function serveAndSnap({ rootDir, port, routePrefix = '', destFile, waitMs = 4000, width = 1280, height = 850 }) {
  return new Promise((resolve) => {
    const mime = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.json': 'application/json'
    };

    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (routePrefix && reqPath.startsWith(routePrefix)) {
        reqPath = reqPath.slice(routePrefix.length);
      }
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
      const filePath = path.join(rootDir, reqPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(port, () => {
      try {
        const cmd = `"${edgePath}" --headless=new --disable-gpu --virtual-time-budget=${waitMs} --screenshot="${destFile}" --window-size=${width},${height} http://localhost:${port}`;
        execSync(cmd, { stdio: 'ignore', timeout: 20000 });
        if (fs.existsSync(destFile)) {
          console.log(`[Snap OK] ${path.basename(destFile)} (${Math.round(fs.statSync(destFile).size / 1024)} KB)`);
        }
      } catch (e) {
        console.warn(`[Snap Error] ${path.basename(destFile)}:`, e.message);
      } finally {
        server.close(() => resolve());
      }
    });
  });
}

async function run() {
  const destDir = path.join(__dirname, '..', 'assets', 'projects');

  // 1. Bloom & Care
  await serveAndSnap({
    rootDir: 'C:\\Users\\phumshop\\Desktop\\New HAHHA\\out',
    port: 8991,
    routePrefix: '/fang001',
    destFile: path.join(destDir, 'bloom-care.png'),
    waitMs: 5000
  });

  // 2. Photobooth App
  await serveAndSnap({
    rootDir: 'C:\\Users\\phumshop\\Desktop\\Photobooth\\photobooth-app\\dist',
    port: 8992,
    destFile: path.join(destDir, 'photobooth-ui.png'),
    waitMs: 4000
  });

  // 3. PhumShop App
  await serveAndSnap({
    rootDir: 'C:\\Users\\phumshop\\Desktop\\New folder (2)\\phumshop-v2',
    port: 8993,
    destFile: path.join(destDir, 'phumshop-ui.png'),
    waitMs: 4000
  });

  // 4. SMO Attendance App (เช็คชื่อ)
  await serveAndSnap({
    rootDir: 'C:\\Users\\phumshop\\Desktop\\เช็คชื่อ',
    port: 8994,
    destFile: path.join(destDir, 'smo-attendance.png'),
    waitMs: 4000
  });

  // Copy badminton
  const b1 = path.join(destDir, 'test-badminton-2.png');
  const b2 = path.join(destDir, 'badminton-scoreboard.png');
  if (fs.existsSync(b1)) {
    fs.copyFileSync(b1, b2);
    console.log('[Copied] badminton-scoreboard.png');
  }

  console.log('Advanced captures completed!');
}

run();
