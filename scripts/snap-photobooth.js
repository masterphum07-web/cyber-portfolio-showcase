const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const htmlPath = 'C:\\Users\\phumshop\\Desktop\\Photobooth\\photobooth-app\\dist\\index.html';
const tempPath = 'C:\\Users\\phumshop\\Desktop\\Photobooth\\photobooth-app\\dist\\temp.html';
const outImg = path.join(__dirname, '..', 'assets', 'projects', 'photobooth-ui.png');

let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/\/photobooth-app\//g, './');
fs.writeFileSync(tempPath, html);

const fileUrl = 'file:///' + tempPath.replace(/\\/g, '/');
try {
  execSync(`"${edgePath}" --headless=new --disable-gpu --virtual-time-budget=4000 --screenshot="${outImg}" --window-size=1280,850 "${fileUrl}"`, { stdio: 'ignore' });
  console.log('Photobooth snap size:', fs.statSync(outImg).size);
} catch (e) {
  console.log('Error:', e.message);
} finally {
  if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
}
