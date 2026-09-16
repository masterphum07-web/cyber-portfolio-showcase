const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'data', 'projects.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

data.timeline = [
  {
    "year": "2024 - ปัจจุบัน",
    "role": "นักศึกษาและผู้พัฒนาระบบนวัตกรรมดิจิทัล",
    "company": "วิทยาลัยเทคโนโลยีทางการแพทย์และสาธารณสุข กาญจนาภิเษก (วทก.)",
    "description": "พัฒนาระบบบริการนักศึกษาและภาควิชารังสีเทคนิค เช่น WTK Music Studio, RTPI Portal, RadPose 3D และระบบจองห้องออนไลน์",
    "tag": "การศึกษา & นวัตกรรม",
    "icon": "graduation-cap"
  },
  {
    "year": "2023 - 2024",
    "role": "Full-Stack & Automation Developer",
    "company": "PhumShop & Independent Projects",
    "description": "พัฒนาบอทเทรด MT5 อัตโนมัติ, ระบบร้านค้าดิจิทัล, เว็บแอปพลิเคชันสำหรับกิจกรรมองค์กร และ WebXR Radiation Research",
    "tag": "การพัฒนาซอฟต์แวร์",
    "icon": "briefcase"
  },
  {
    "year": "2022 - 2023",
    "role": "Web & Multimedia Technical Lead",
    "company": "องค์การนักศึกษาและกิจกรรมสโมสร วทก.",
    "description": "พัฒนาระบบคะแนนเลือกตั้งสด (Election Live), สกอร์บอร์ดแบดมินตันดิจิทัล, และเว็บแอปพลิเคชันกิจกรรมนักศึกษา",
    "tag": "กิจกรรม & องค์กร",
    "icon": "award"
  },
  {
    "year": "2021 - 2022",
    "role": "Creative Coding & Self-Taught Developer",
    "company": "Personal Lab & Open Source Explorations",
    "description": "เริ่มต้นศึกษาพัฒนาเว็บแอปพลิเคชัน, การจำลองวงจรไฟฟ้าเสมือนจริง (Virtual Lab), ระบบ Cloud Automation และ 3D Web Graphics",
    "tag": "จุดเริ่มต้น",
    "icon": "code"
  }
];

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated timeline! Total timeline items:', data.timeline.length);
