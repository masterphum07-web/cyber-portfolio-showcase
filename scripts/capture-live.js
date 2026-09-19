const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const targets = [
  { url: 'https://masterphum07-web.github.io/radpose-3d/', file: 'assets/projects/live-radpose3d.png' },
  { url: 'https://masterphum07-web.github.io/MUSIC-PI/', file: 'assets/projects/live-music-pi.png' },
  { url: 'https://masterphum07-web.github.io/RTPI/', file: 'assets/projects/live-rtpi.png' }
];

targets.forEach(t => {
  console.log('Capturing:', t.url);
  try {
    const fullOut = path.resolve(t.file);
    execSync(`"${edgePath}" --headless --screenshot="${fullOut}" --window-size=1920,1080 "${t.url}"`);
    console.log('Saved:', t.file, fs.existsSync(fullOut) ? fs.statSync(fullOut).size + ' bytes' : 'NOT FOUND');
  } catch (err) {
    console.error('Error capturing', t.url, err.message);
  }
});
console.log('ALL CAPTURES COMPLETE!');
