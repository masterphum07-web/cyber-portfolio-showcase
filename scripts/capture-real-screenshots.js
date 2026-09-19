const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const destDir = path.join(__dirname, '..', 'assets', 'projects');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 1. Copy direct real files
const copyMappings = [
  {
    src: 'C:\\Users\\phumshop\\Desktop\\เว้ปจองห้องดนตรี\\public\\site_full.png',
    dest: 'wtk-music-site.png'
  },
  {
    src: 'C:\\Users\\phumshop\\Desktop\\เว้ปจองห้องดนตรี\\public\\wtk_graphic_16_9.png',
    dest: 'wtk-music-banner.png'
  },
  {
    src: 'C:\\Users\\phumshop\\Desktop\\เว้ปจองห้องดนตรี\\public\\wtk_infographic_16_9.png',
    dest: 'wtk-music-info.png'
  },
  {
    src: 'C:\\Users\\phumshop\\Desktop\\Rt\\_tmp\\table-1.png',
    dest: 'rtpi-schedule.png'
  },
  {
    src: 'C:\\Users\\phumshop\\Desktop\\Rt\\_tmp\\table-2.png',
    dest: 'rtpi-exam.png'
  },
  {
    src: 'C:\\Users\\phumshop\\Desktop\\Rt\\icons\\logo-college.png',
    dest: 'rtpi-logo.png'
  },
  {
    src: 'C:\\Users\\phumshop\\Desktop\\มาใหม่\\MySpotify\\public\\phumtify-logo.png',
    dest: 'phumtify-logo.png'
  },
  {
    src: 'C:\\Users\\phumshop\\Desktop\\New folder (2)\\phumshop-v2\\phumshop_graphic_16_9.png',
    dest: 'phumshop-banner.png'
  },
  {
    src: 'C:\\Users\\phumshop\\Pictures\\phumshop-rich-menu.png',
    dest: 'phumshop-menu.png'
  },
  {
    src: 'C:\\Users\\phumshop\\Desktop\\haha\\assets\\images\\positioning\\chest-pa.jpg',
    dest: 'radpose-chest.jpg'
  },
  {
    src: 'C:\\Users\\phumshop\\Desktop\\haha\\assets\\images\\positioning\\abdomen-upright.jpg',
    dest: 'radpose-abdomen.jpg'
  },
  {
    src: 'C:\\Users\\phumshop\\Desktop\\haha\\assets\\images\\positioning\\c-spine-lateral.jpg',
    dest: 'radpose-cspine.jpg'
  },
  {
    src: 'C:\\Users\\phumshop\\Downloads\\LoGo Smo.png',
    dest: 'smo-logo.png'
  },
  {
    src: 'C:\\Users\\phumshop\\Downloads\\BeautyPlus-photo_booth-2026-07-22T05_51_22.png',
    dest: 'photobooth-strip.png'
  }
];

copyMappings.forEach(m => {
  if (fs.existsSync(m.src)) {
    const target = path.join(destDir, m.dest);
    fs.copyFileSync(m.src, target);
    console.log(`[Copied] ${m.dest} (${Math.round(fs.statSync(target).size / 1024)} KB)`);
  } else {
    console.warn(`[Skip Copy] Source not found: ${m.src}`);
  }
});

// 2. Headless screenshots
const screenshotTargets = [
  {
    name: 'radpose-3d-ui.png',
    file: 'C:\\Users\\phumshop\\Desktop\\haha\\index.html',
    budget: 3500
  },
  {
    name: 'election-live.png',
    file: 'C:\\Users\\phumshop\\Desktop\\เลือกตั้ง\\site\\index.html',
    budget: 3500
  },
  {
    name: 'lucky-wheel.png',
    file: 'C:\\Users\\phumshop\\Desktop\\โปรเจคหา\\index.html',
    budget: 3500
  },
  {
    name: 'doc-hub.png',
    file: 'C:\\Users\\phumshop\\Desktop\\เว้ปเก็บไฟล์\\index.html',
    budget: 3500
  },
  {
    name: 'photobooth-ui.png',
    file: 'C:\\Users\\phumshop\\Desktop\\Photobooth\\photobooth-app\\dist\\index.html',
    budget: 3500
  },
  {
    name: 'radiar-xr.png',
    file: 'C:\\Users\\phumshop\\Desktop\\วิจัยกังๆ\\index.html',
    budget: 3500
  },
  {
    name: 'bloom-care.png',
    file: 'C:\\Users\\phumshop\\Desktop\\New HAHHA\\out\\index.html',
    budget: 3500
  },
  {
    name: 'smo-attendance.png',
    file: 'C:\\Users\\phumshop\\Desktop\\เช็คชื่อ\\index.html',
    budget: 3500
  }
];

screenshotTargets.forEach(t => {
  if (fs.existsSync(t.file)) {
    const targetFile = path.join(destDir, t.name);
    const fileUrl = 'file:///' + t.file.replace(/\\/g, '/');
    const cmd = `"${edgePath}" --headless=new --disable-gpu --virtual-time-budget=${t.budget} --screenshot="${targetFile}" --window-size=1280,800 "${fileUrl}"`;
    try {
      execSync(cmd, { stdio: 'ignore', timeout: 20000 });
      if (fs.existsSync(targetFile)) {
        console.log(`[Screenshot Captured] ${t.name} (${Math.round(fs.statSync(targetFile).size / 1024)} KB)`);
      }
    } catch (e) {
      console.warn(`[Screenshot Error] ${t.name}:`, e.message);
    }
  } else {
    console.warn(`[Skip Screenshot] File not found: ${t.file}`);
  }
});
