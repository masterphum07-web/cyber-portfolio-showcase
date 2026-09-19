const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'projects.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Update owner
data.portfolio_owner.name = "ภูมิภัทร สว่างเวียง (Phumphat Sawangwiang)";
data.portfolio_owner.english_name = "Phumphat Sawangwiang";
data.portfolio_owner.avatar = "assets/profile-phum.jpg";

// Real image mappings
const realProjectsMap = {
  1: { // RadPose 3D
    image: "assets/projects/radpose-3d-ui.png",
    gallery: [
      "assets/projects/radpose-3d-ui.png",
      "assets/projects/radpose-chest.jpg",
      "assets/projects/radpose-abdomen.jpg",
      "assets/projects/radpose-cspine.jpg"
    ]
  },
  2: { // WTK Music Studio
    image: "assets/projects/wtk-music-site.png",
    gallery: [
      "assets/projects/wtk-music-site.png",
      "assets/projects/wtk-music-banner.png",
      "assets/projects/wtk-music-info.png"
    ]
  },
  3: { // RTPI
    image: "assets/projects/rtpi-schedule.png",
    gallery: [
      "assets/projects/rtpi-schedule.png",
      "assets/projects/rtpi-exam.png",
      "assets/projects/rtpi-logo.png"
    ]
  },
  4: { // Phumtify
    image: "assets/projects/phumtify-logo.png",
    gallery: [
      "assets/projects/phumtify-logo.png"
    ]
  },
  5: { // Bloom & Care
    image: "assets/projects/bloom-care.png",
    gallery: [
      "assets/projects/bloom-care.png"
    ]
  },
  6: { // MT5 EA
    image: "assets/projects/mt5-ea.png",
    gallery: [
      "assets/projects/mt5-ea.png"
    ]
  },
  7: { // RadiAR-XR
    image: "assets/projects/radiar-xr.png",
    gallery: [
      "assets/projects/radiar-xr.png"
    ]
  },
  8: { // Election Live
    image: "assets/projects/election-live.png",
    gallery: [
      "assets/projects/election-live.png",
      "assets/projects/smo-logo.png"
    ]
  },
  9: { // Photobooth Pro
    image: "assets/projects/photobooth-strip.png",
    gallery: [
      "assets/projects/photobooth-strip.png"
    ]
  },
  10: { // Freshy Badminton Scoreboard
    image: "assets/projects/badminton-scoreboard.png",
    gallery: [
      "assets/projects/badminton-scoreboard.png"
    ]
  },
  11: { // DOC HUB
    image: "assets/projects/doc-hub.png",
    gallery: [
      "assets/projects/doc-hub.png"
    ]
  },
  12: { // Lucky Wheel Pro
    image: "assets/projects/lucky-wheel.png",
    gallery: [
      "assets/projects/lucky-wheel.png"
    ]
  },
  13: { // PhumShop
    image: "assets/projects/phumshop-banner.png",
    gallery: [
      "assets/projects/phumshop-banner.png",
      "assets/projects/phumshop-menu.png"
    ]
  },
  14: { // SMO Attendance
    title: "ระบบเช็คชื่อสโมสรนักศึกษาปี 69 (SMO Attendance System)",
    description_short: "ระบบบันทึกเวลาและตรวจสอบการเข้าร่วมกิจกรรมองค์ประชุมสโมสรนักศึกษา วทก. เชื่อมต่อ Google Sheets API อัตโนมัติ",
    category: "Web App",
    tech_stack: ["Google Apps Script", "Tailwind CSS", "JavaScript", "Google Sheets API"],
    image: "assets/projects/smo-attendance.png",
    gallery: [
      "assets/projects/smo-attendance.png",
      "assets/projects/smo-logo.png"
    ],
    features: [
      "สรุปผลการเข้าประชุม Leaderboard รายชื่อผู้เข้าร่วมประชุมแบบเรียลไทม์",
      "ระบบคำนวณแต้มคะแนนกิจกรรม สถิติมาสาย ขอลา และขาดกิจกรรมอัตโนมัติ",
      "ระบบล็อกอินความปลอดภัยสำหรับแอดมินและผู้บันทึกสโมสรนักศึกษา",
      "เชื่อมต่อฐานข้อมูล Google Sheets และคลาวด์ไดรฟ์ของวิทยาลัยโดยตรง"
    ]
  }
};

data.projects.forEach(p => {
  if (realProjectsMap[p.id]) {
    Object.assign(p, realProjectsMap[p.id]);
  }
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated data/projects.json with all authentic real images!');
