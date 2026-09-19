const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const dir = path.join(__dirname, '..', 'assets', 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function getSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a1a"/>
      <stop offset="100%" stop-color="#12142a"/>
    </linearGradient>
    <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f2fe"/>
      <stop offset="50%" stop-color="#4facfe"/>
      <stop offset="100%" stop-color="#8a2be2"/>
    </linearGradient>
    <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff007f"/>
      <stop offset="100%" stop-color="#8a2be2"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect x="20" y="20" width="472" height="472" rx="90" fill="url(#bgGrad)" stroke="url(#neonGrad)" stroke-width="8"/>
  <rect x="40" y="40" width="432" height="432" rx="72" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
  <path d="M40 256 H472 M256 40 V472" stroke="rgba(0, 242, 254, 0.08)" stroke-width="2"/>
  <g filter="url(#glow)">
    <path d="M140 200 L90 256 L140 312" fill="none" stroke="url(#neonGrad)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M372 200 L422 256 L372 312" fill="none" stroke="url(#pinkGrad)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M210 160 V352" fill="none" stroke="url(#neonGrad)" stroke-width="28" stroke-linecap="round"/>
    <path d="M305 165 L218 256 L308 348" fill="none" stroke="url(#neonGrad)" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="218" cy="256" r="10" fill="#00ff88"/>
  </g>
  <text x="256" y="420" text-anchor="middle" fill="#00f2fe" font-family="'Orbitron', sans-serif" font-weight="800" font-size="30" letter-spacing="8">PHUM</text>
</svg>`;
}

function createSolidPng(width, height, r, g, b, a = 255) {
  const rowBytes = width * 4 + 1;
  const rawData = Buffer.alloc(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowBytes;
    rawData[rowStart] = 0;
    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * 4;
      const isBorder = (x < 6 || x >= width - 6 || y < 6 || y >= height - 6);
      if (isBorder) {
        rawData[px] = 0;
        rawData[px + 1] = 242;
        rawData[px + 2] = 254;
        rawData[px + 3] = 255;
      } else {
        rawData[px] = r;
        rawData[px + 1] = g;
        rawData[px + 2] = b;
        rawData[px + 3] = a;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const combined = Buffer.concat([typeBuf, data]);
    const crc = crc32(combined);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, combined, crcBuf]);
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        const bit = (byte ^ crc) & 1;
        crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
        byte >>>= 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync(path.join(dir, 'favicon.svg'), getSvg(64));
fs.writeFileSync(path.join(dir, 'icon-192.svg'), getSvg(192));
fs.writeFileSync(path.join(dir, 'icon-512.svg'), getSvg(512));

fs.writeFileSync(path.join(dir, 'icon-192.png'), createSolidPng(192, 192, 10, 10, 26));
fs.writeFileSync(path.join(dir, 'icon-512.png'), createSolidPng(512, 512, 10, 10, 26));
fs.writeFileSync(path.join(dir, 'icon-maskable.png'), createSolidPng(512, 512, 10, 10, 26));

console.log('PWA and Favicon assets generated in assets/icons!');
