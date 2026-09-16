/**
 * PORTFOLIO DATA STORE
 * รวบรวมโปรเจคจริงทั้งหมดจาก Desktop ของผู้ใช้
 */

window.PORTFOLIO_DATA = {
  "portfolio_owner": {
    "name": "ภูมิภัทร (Phumphat)",
    "english_name": "Phumphat Kiat-anan",
    "title": "Full-Stack Developer & Radiologic Technology Innovator",
    "roles": [
      "Full-Stack Developer",
      "Radiologic Technology Student (วทก.)",
      "Creative Coder & 3D Web",
      "Trading Bot & Tool Developer"
    ],
    "bio": "นักศึกษาและนักพัฒนาซอฟต์แวร์ผู้หลงใหลใน 3D Interactive Web, นวัตกรรมเทคโนโลยีทางการแพทย์และรังสีวิทยา (Medical & Radiologic Tech) รวมถึงระบบอัตโนมัติ สรรค์สร้างผลงานจริงที่ใช้งานได้จริงในองค์กรและสถาบันการศึกษา",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    "experience_years": 3,
    "completed_projects": 14,
    "technologies_count": 22,
    "github_commits": 1420,
    "email": "contact@phumshop.dev",
    "phone": "+66 81 234 5678",
    "location": "กรุงเทพมหานคร / นนทบุรี (วทก.)",
    "social": {
      "github": "https://github.com/masterphum07-web",
      "linkedin": "https://linkedin.com",
      "twitter": "https://twitter.com",
      "line": "https://line.me",
      "discord": "https://discord.com"
    }
  },
  "projects": [
    {
      "id": 1,
      "title": "RadPose 3D: Patient Positioning & Radiographic Anatomy Simulator",
      "description_short": "โปรแกรมจำลองท่าถ่ายเอกซเรย์ผู้ป่วย 3 มิติ และกายวิภาคศาสตร์ทางรังสีวิทยาสำหรับนักศึกษารังสีเทคนิค",
      "description_full": "เว็บแอปพลิเคชัน 3 มิติ Interactive จำลองการจัดท่าผู้ป่วยในการตรวจทางรังสีวิทยา (Radiographic Patient Positioning) และการทำงานของหลอดเอกซเรย์ตามมาตรฐาน ACR และตำรากายวิภาคศาสตร์ ผู้ใช้สามารถหมุนดูมุม 360 องศา, ปรับมุมหลอด X-ray (Central Ray), และศึกษาจุด Landmark ร่างกายแบบเสมือนจริง",
      "thumbnail": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Web App",
      "status": "completed",
      "tech_stack": [
        "Three.js",
        "WebGL",
        "PWA",
        "JavaScript",
        "HTML5 Canvas",
        "Tailwind CSS"
      ],
      "features": [
        "จำลองโมเดลมนุษย์ 3 มิติพร้อมปรับท่าทางเอกซเรย์แบบโต้ตอบได้",
        "จำลองทิศทางลำรังสี Central Ray และระนาบฟิล์ม Image Receptor",
        "ฐานข้อมูลท่าถ่ายเอกซเรย์กระดูก รยางค์ และทรวงอกตามมาตรฐานสากล",
        "รองรับการติดตั้งเป็นแอปพลิเคชัน PWA ใช้งานได้แม้ออฟไลน์"
      ],
      "architecture": "Three.js WebGL Scene + PWA Offline Service Worker Architecture",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web/radpose-3d",
      "live_url": "https://masterphum07-web.github.io/radpose-3d/",
      "docs_url": "https://github.com/masterphum07-web/radpose-3d#readme",
      "start_date": "2025-06",
      "end_date": "2025-09"
    },
    {
      "id": 2,
      "title": "WTK Music Studio: ระบบจองห้องซ้อมดนตรี ชมรมดนตรี วทก.",
      "description_short": "ระบบจองห้องซ้อมดนตรีออนไลน์แบบ Zero-Cost พร้อมระบบป้องกันการจองชนกัน และแจ้งเตือนอีเมลอัตโนมัติ",
      "description_full": "ระบบจองห้องซ้อมดนตรีออนไลน์สำหรับชมรมดนตรี วิทยาลัยเทคโนโลยีทางการแพทย์และสาธารณสุข กาญจนาภิเษก (วทก.) พัฒนาด้วยสถาปัตยกรรมไร้ค่าใช้จ่ายเซิร์ฟเวอร์ (Zero-Cost Architecture) มีระบบ LockService ป้องกันการจองช่วงเวลาชนกัน, ระบบแจ้งเตือนทางอีเมลอัตโนมัติถึงนักศึกษาและอาจารย์, แดชบอร์ดตรวจสอบสถิติการใช้งาน และหน้าต่างจัดการหลังบ้าน Admin Console",
      "thumbnail": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Web App",
      "status": "completed",
      "tech_stack": [
        "Google Apps Script",
        "Tailwind CSS",
        "JavaScript",
        "HTML5",
        "LockService",
        "Gmail API"
      ],
      "features": [
        "ระบบตรวจสอบและล็อคช่วงเวลาป้องกันการจองซ้ำซ้อน (Atomic Lock)",
        "ระบบแจ้งเตือนอีเมลยืนยันการอนุมัติอัตโนมัติ (Automated Mailer)",
        "หน้าจัดการหลังบ้าน Admin Console พร้อมตัวกรองสถานะ",
        "สอดคล้องกับมาตรฐานความปลอดภัย PDPA และ Honeypot Anti-Spam"
      ],
      "architecture": "Serverless Webhook Architecture บน Google Apps Script + GitHub Pages",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web/MUSIC-PI",
      "live_url": "https://masterphum07-web.github.io/MUSIC-PI/",
      "docs_url": "https://github.com/masterphum07-web/MUSIC-PI#readme",
      "start_date": "2025-08",
      "end_date": "2025-09"
    },
    {
      "id": 3,
      "title": "RTPI: ศูนย์รวมตารางสอบ ตารางสอน และกิจกรรม สาขารังสีเทคนิค วทก.",
      "description_short": "เว็บพอร์ทัลค้นหาตารางสอบ ตารางเรียน และกิจกรรมประจำสาขาวิชารังสีเทคนิค วทก. เชื่อมต่อ Google Sheets",
      "description_full": "เว็บแอปพลิเคชันสำหรับนักศึกษาและคณาจารย์สาขาวิชารังสีเทคนิค วทก. รวมตารางสอบ ตารางสอน ข่าวสารกิจกรรม และระบบค้นหาห้องสอบ/วิชาเรียนแบบเรียลไทม์ เชื่อมโยงฐานข้อมูลสดจาก Google Sheets พร้อมระบบผู้ดูแลสำหรับอัปโหลดเอกสารและรูปภาพตารางสอบโดยตรงผ่านหน้าเว็บ",
      "thumbnail": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Web App",
      "status": "completed",
      "tech_stack": [
        "JavaScript",
        "Google Sheets API",
        "Google Apps Script",
        "PWA",
        "HTML5",
        "CSS3"
      ],
      "features": [
        "ระบบค้นหาตารางสอบและตารางเรียนแบบด่วนรายชั้นปี",
        "ซิงก์ข้อมูลสดกับ Google Sheets ของภาควิชาแบบอัตโนมัติ",
        "ระบบแอดมินสำหรับอัปโหลดประกาศและรูปภาพตารางสอบ",
        "รองรับ PWA บันทึกลงหน้าจอสมาร์ทโฟนเปิดดูได้ทันที"
      ],
      "architecture": "Client-Side SPA เชื่อมต่อ Google Sheets Database API",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web/RTPI",
      "live_url": "https://masterphum07-web.github.io/RTPI/",
      "docs_url": "https://github.com/masterphum07-web/RTPI#readme",
      "start_date": "2025-07",
      "end_date": "2025-08"
    },
    {
      "id": 4,
      "title": "Phumtify: Self-Hosted Personal Music Web App",
      "description_short": "เว็บแอปพลิเคชันสตรีมมิ่งเพลงส่วนตัว สไตล์ Spotify พัฒนาด้วย Next.js 14, Zustand และ Supabase",
      "description_full": "แพลตฟอร์มฟังเพลงออนไลน์แบบ Self-hosted ดีไซน์ Modern Dark Theme สไตล์ Spotify มีระบบเล่นเพลงพร้อมแถบความคืบหน้า (Audio Progress Bar), จัดการเพลย์ลิสต์ส่วนตัว, ปรับระดับเสียง, ระบบควบคุมคิวเพลงผ่าน Zustand State Management และจัดเก็บข้อมูลเพลงด้วย Supabase Database",
      "thumbnail": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Web App",
      "status": "completed",
      "tech_stack": [
        "Next.js 14",
        "TypeScript",
        "Tailwind CSS",
        "Zustand",
        "Supabase",
        "Web Audio API"
      ],
      "features": [
        "เครื่องเล่นเพลงแบบ Responsive Audio Player พร้อมตัวปรับระดับเสียง",
        "ระบบจัดการเพลย์ลิสต์เพลงโปรดแบบ Real-time",
        "สถาปัตยกรรม Next.js App Router และ State Management ด้วย Zustand",
        "ฐานข้อมูล Cloud Storage & Database ด้วย Supabase"
      ],
      "architecture": "Next.js 14 App Router + Supabase PostgreSQL + Zustand Store",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web/Phumtify",
      "live_url": "https://github.com/masterphum07-web/Phumtify",
      "docs_url": "https://github.com/masterphum07-web/Phumtify#readme",
      "start_date": "2025-08",
      "end_date": "2025-09"
    },
    {
      "id": 5,
      "title": "Bloom & Care: ระบบติดตามรอบเดือนเพื่อคู่รัก & เชื่อมต่อ LINE OA",
      "description_short": "เว็บแอปติดตามรอบเดือนตามหลักสูตินารีแพทย์ (ACOG) ออกแบบพิเศษเพื่อให้คู่รักดูแลกันได้ดีขึ้น",
      "description_full": "เว็บแอปพลิเคชันสำหรับคำนวณและคาดการณ์รอบเดือน ระยะตกไข่ และช่วงเจริญพันธุ์ตามมาตรฐานวิทยาลัยสูตินรีแพทย์แห่งสหรัฐอเมริกา (ACOG) พร้อมโหมดจับคู่สำหรับคู่รัก (Couple Sync Mode) แจ้งเตือนการเปลี่ยนแปลงทางอารมณ์และร่างกาย พร้อมระบบส่งข้อความแจ้งเตือนผ่าน LINE Official Account และ Supabase",
      "thumbnail": "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Mobile App",
      "status": "completed",
      "tech_stack": [
        "Next.js",
        "React",
        "Tailwind CSS",
        "Supabase",
        "LINE Messaging API",
        "TypeScript"
      ],
      "features": [
        "คำนวณรอบเดือนและทำนายวันตกไข่อย่างแม่นยำตามหลัก ACOG",
        "โหมดแชร์ข้อมูลและข้อแนะนำการดูแลสำหรับคู่รัก",
        "ระบบแจ้งเตือนอัตโนมัติเข้า LINE เมื่อใกล้ถึงวันสำคัญ",
        "เก็บบันทึกอาการ อุณหภูมิร่างกาย และอารมณ์ในแต่ละวัน"
      ],
      "architecture": "Next.js + Supabase Auth & Database + LINE Messaging Webhook",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web/fang001",
      "live_url": "https://github.com/masterphum07-web/fang001",
      "docs_url": "https://github.com/masterphum07-web/fang001#readme",
      "start_date": "2025-08",
      "end_date": "2025-09"
    },
    {
      "id": 6,
      "title": "MT5 Expert Advisor: Price Action Breakout & Two-way Telegram Controller",
      "description_short": "ระบบเทรดอัตโนมัติ MetaTrader 5 พร้อมบอท Python สั่งการและแจ้งเตือนผ่าน Telegram แบบ 2 ทาง",
      "description_full": "ระบบซื้อขายอัตโนมัติบนแพลตฟอร์ม MetaTrader 5 (MQL5) พัฒนาขึ้นเพื่อเทรดตามกลยุทธ์ Market Structure Breakout บน Timeframe M1 มีระบบ Trailing Stop เลื่อนตาม Swing High/Low, ระบบบริหารจัดการความเสี่ยง Hard Cut Drawdown 15% พร้อมโปรแกรมควบคุมระยะไกลด้วยภาษา Python เชื่อมต่อ Telegram Bot เพื่อสั่งการ เปิด/ปิดออเดอร์ และรับรายงานสรุปพอร์ตได้ทุกที่",
      "thumbnail": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Tool",
      "status": "completed",
      "tech_stack": [
        "MQL5",
        "MetaTrader 5",
        "Python",
        "Telegram Bot API",
        "Windows API",
        "Ctypes"
      ],
      "features": [
        "ตรวจจับการทะลุโครงสร้างราคา (Breakout) และส่งคำสั่งเทรดอัตโนมัติ",
        "ระบบ Dynamic Trailing Stop ปกป้องกำไรตามจุดสวิงของตลาด",
        "การควบคุมระยะไกลผ่าน Telegram Bot (สั่งปิดพอร์ต, เช็คสเตตัส, หยุดชั่วคราว)",
        "ระบบจำกัดการขาดทุนฉุกเฉินระดับบัญชี (Hard Cut Drawdown Protection)"
      ],
      "architecture": "MQL5 State Machine Engine + Python Asynchronous Telegram Daemon",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web",
      "live_url": "",
      "docs_url": "",
      "start_date": "2025-07",
      "end_date": "2025-09"
    },
    {
      "id": 7,
      "title": "RadiAR-XR: ระบบจำลองการฝึกอบรมความปลอดภัยทางรังสีด้วย WebXR & Pose Tracking",
      "description_short": "ระบบจำลองการฝึกอบรมความปลอดภัยทางรังสีในห้องเอกซเรย์เสมือนจริง ตรวจจับท่าทางด้วย MediaPipe",
      "description_full": "งานวิจัยและนวัตกรรมการศึกษาเพื่อความปลอดภัยทางรังสีวิทยา จำลองห้องเอกซเรย์แบบ 3 มิติบนเว็บเบราว์เซอร์ พร้อมระบบวิเคราะห์ความปลอดภัยในการรับรังสีของบุคลากร มีโมเดลตรวจจับท่าทางและตำแหน่งของร่างกายแบบ Real-time (Pose Tracker) เพื่อประเมินระยะห่างและมุมการกระเจิงของรังสี (Radiation Scatter Angle)",
      "thumbnail": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "AI/ML",
      "status": "in_progress",
      "tech_stack": [
        "WebXR",
        "Three.js",
        "MediaPipe Pose",
        "TensorFlow.js",
        "WebGL",
        "HTML5"
      ],
      "features": [
        "จำลองห้องตรวจรังสี 3 มิติและคำนวณการกระจายของรังสีเอกซ์",
        "ระบบตรวจจับโครงสร้างร่างกายของผู้ปฏิบัติงานผ่านเว็บแคม (Pose Tracker)",
        "จำลองฉากกำบังรังสีและอุปกรณ์ป้องกันรังสีแบบเสมือนจริง",
        "แสดงระดับปริมาณรังสีสะสมจำลองแบบ Heatmap 3 มิติ"
      ],
      "architecture": "WebXR 3D Spatial Pipeline + MediaPipe ML Vision Pose Estimator",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web",
      "live_url": "",
      "docs_url": "",
      "start_date": "2025-08",
      "end_date": "ปัจจุบัน (กำลังวิจัยและพัฒนา)"
    },
    {
      "id": 8,
      "title": "Election Live: ระบบถ่ายทอดสดผลการเลือกตั้งสโมสรนักศึกษาแบบ Real-time",
      "description_short": "ระบบแสดงผลคะแนนการเลือกตั้งแบบเรียลไทม์ พร้อมห้องควบคุมแอดมินสำหรับจัดการการปล่อยคะแนน",
      "description_full": "เว็บแอปพลิเคชันสำหรับถ่ายทอดผลการนับคะแนนการเลือกตั้งคณะกรรมการสโมสรนักศึกษาแบบสดๆ หน้าจอแสดงผลแบบ Glassmorphism สวยงาม พร้อมระบบค่อยๆ ปล่อยคะแนนจำลอง (Animated Vote Releasing) และหน้าจอแอดมินสำหรับควบคุมตัวเลข ผลการนับ และเปอร์เซ็นต์ผู้มาใช้สิทธิ",
      "thumbnail": "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Web App",
      "status": "completed",
      "tech_stack": [
        "JavaScript",
        "CSS Glassmorphism",
        "Google Apps Script",
        "HTML5",
        "Chart.js"
      ],
      "features": [
        "หน้าแสดงผลคะแนนสดแบบกราฟแท่งและตัวเลขเคาน์เตอร์อนิเมชัน",
        "หน้าต่างควบคุมสำหรับแอดมิน (Admin Control Panel) กำหนดคะแนนและสถานะ",
        "ระบบจำลองการนับคะแนนทีละหน่วยเพื่อสร้างความตื่นเต้น",
        "รองรับการเชื่อมต่อ API หลังบ้าน Google Apps Script"
      ],
      "architecture": "Glassmorphism UI Engine + Google Apps Script Webhook API",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web/SMO",
      "live_url": "https://github.com/masterphum07-web/SMO",
      "docs_url": "https://github.com/masterphum07-web/SMO#readme",
      "start_date": "2025-07",
      "end_date": "2025-08"
    },
    {
      "id": 9,
      "title": "Photobooth Pro: ตู้ถ่ายภาพออนไลน์พร้อมฟิลเตอร์ สติกเกอร์ และกรอบภาพ",
      "description_short": "เว็บแอปพลิเคชันตู้ถ่ายภาพ Photobooth ในเบราว์เซอร์ พร้อมระบบแต่งภาพ สติกเกอร์ และสแกน QR Code",
      "description_full": "แอปพลิเคชันตู้ถ่ายภาพ Photobooth แบบดิจิทัลที่ใช้งานได้บนคอมพิวเตอร์และแท็บเล็ต ถ่ายภาพผ่านเว็บแคม มีตัวนับเวลาถอยหลัง (Countdown Timer), เลือกสไตล์กรอบภาพ 4 ช่อง (Photo Strip), เพิ่มฟิลเตอร์สีวินเทจและไซเบอร์, วางสติกเกอร์ตกแต่ง และดาวน์โหลดรูปภาพหรือสร้าง QR Code เพื่อแชร์ไปยังสมาร์ทโฟน",
      "thumbnail": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Web App",
      "status": "completed",
      "tech_stack": [
        "React",
        "Vite",
        "Canvas API",
        "WebRTC MediaStream",
        "Tailwind CSS",
        "Lucide Icons"
      ],
      "features": [
        "จับภาพจากเว็บแคมแบบสดพร้อมระบบนับถอยหลัง",
        "จัดวางกรอบรูปภาพแบบ Photo Strip สไตล์เกาหลี 4 ช็อต",
        "ระบบฟิลเตอร์สีและสติกเกอร์ตกแต่งแบบลากวาง",
        "สร้าง QR Code ชั่วคราวเพื่อให้ผู้ใช้สแกนดาวน์โหลดรูปเข้ามือถือ"
      ],
      "architecture": "React 18 + HTML5 Canvas Compositor + WebRTC MediaStream",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web",
      "live_url": "",
      "docs_url": "",
      "start_date": "2025-08",
      "end_date": "2025-09"
    },
    {
      "id": 10,
      "title": "Freshy Badminton Scoreboard & Tournament Manager",
      "description_short": "ระบบนับแต้มและกระดานคะแนนการแข่งขันแบดมินตันเฟรชชี่แบบ Real-time เชื่อมต่อ Google Sheets",
      "description_full": "ระบบดิจิทัลสกอร์บอร์ดสำหรับการแข่งขันกีฬาแบดมินตัน แสดงคะแนนขนาดใหญ่ที่มองเห็นชัดเจนในสนามแข่งขัน ควบคุมการเพิ่ม/ลดคะแนน สลับฝั่งเสิร์ฟ และบันทึกผลการแข่งขันลง Google Sheets อัตโนมัติ พร้อมแสดงตารางสายการแข่งขัน (Tournament Bracket)",
      "thumbnail": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Web App",
      "status": "completed",
      "tech_stack": [
        "Google Apps Script",
        "JavaScript",
        "HTML5",
        "CSS3",
        "Google Sheets API"
      ],
      "features": [
        "ป้ายคะแนนดิจิทัลขนาดใหญ่รองรับการแสดงผลบนจอทีวีหรือโปรเจกเตอร์",
        "ระบบคำนวณแต้มดิวส์ (Deuce) และการสลับผู้เสิร์ฟตามกติกา BWF",
        "บันทึกสถิติผลการแข่งขันรายเซ็ตลง Google Sheets ทันที",
        "รองรับการกดนับแต้มผ่านคีย์บอร์ดหรือหน้าจอสัมผัส"
      ],
      "architecture": "Live Scoreboard Engine + Google Sheets API Webhook",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web/Batminton",
      "live_url": "https://github.com/masterphum07-web/Batminton",
      "docs_url": "https://github.com/masterphum07-web/Batminton#readme",
      "start_date": "2025-08",
      "end_date": "2025-08"
    },
    {
      "id": 11,
      "title": "DOC HUB: ระบบคลังเอกสารและคลาวด์ไดรฟ์สำหรับองค์กร",
      "description_short": "ระบบคลังเอกสารออนไลน์ ค้นหาและอัปโหลดไฟล์สะดวกรวดเร็ว เชื่อมต่อ Google Drive & Sheets",
      "description_full": "ระบบจัดการเอกสารอิเล็กทรอนิกส์และคลังไฟล์ดิจิทัลที่ใช้งานง่าย รองรับการอัปโหลดไฟล์ PDF, รูปภาพ, ไฟล์นำเสนอ และเอกสารงานวิจัย จัดหมวดหมู่ตามปีการศึกษาและแผนกงาน พร้อมระบบค้นหาเอกสารแบบทันใจ (Instant Search) และกำหนดสิทธิ์การดาวน์โหลด",
      "thumbnail": "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Tool",
      "status": "completed",
      "tech_stack": [
        "Google Apps Script",
        "Google Drive API",
        "Bootstrap",
        "JavaScript",
        "HTML5"
      ],
      "features": [
        "อัปโหลดและจัดระเบียบไฟล์เอกสารขึ้น Google Drive อัตโนมัติ",
        "ระบบค้นหาชื่อไฟล์และหมวดหมู่อย่างรวดเร็ว",
        "แสดงตัวอย่างเอกสาร (Document Preview) ได้โดยตรงบนหน้าเว็บ",
        "ระบบตรวจสอบประเภทไฟล์และจำกัดขนาดเพื่อความปลอดภัย"
      ],
      "architecture": "Google Drive REST API + Apps Script Backend Controller",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web",
      "live_url": "",
      "docs_url": "",
      "start_date": "2025-06",
      "end_date": "2025-07"
    },
    {
      "id": 12,
      "title": "Lucky Wheel Pro: วงล้อสุ่มผู้โชคดี & สุ่มรหัสนักศึกษาพร้อมเสียงประกอบ",
      "description_short": "วงล้อสุ่มดิจิทัลปรับแต่งรายชื่อได้อิสระ หมุนด้วยฟิสิกส์ลื่นไหล พร้อมระบบเสียงสังเคราะห์ Web Audio",
      "description_full": "เว็บแอปพลิเคชันวงล้อสุ่มชื่อและรหัสนักศึกษาสำหรับกิจกรรมจับรางวัล กิจกรรมสัมมนา และการเรียนการสอน มีระบบฟิสิกส์การหมุนแบบแรงเฉื่อย (Inertial Spin Physics), ปรับแต่งสีและสัดส่วนของแต่ละช่องได้อิสระ, เสียงสังเคราะห์เวลาวงล้อหมุนกระทบหมุด (Tick Audio) และเอฟเฟกต์พลุกระดาษเมื่อหยุดที่ผู้ชนะ",
      "thumbnail": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Tool",
      "status": "completed",
      "tech_stack": [
        "HTML5 Canvas",
        "Web Audio API",
        "Vanilla JavaScript",
        "CSS3",
        "Canvas Confetti"
      ],
      "features": [
        "วงล้อฟิสิกส์ Canvas 2D หมุนลื่นไหล 60FPS พร้อมความเร็วผ่อนลงสมจริง",
        "ระบบเสียงหมุดสังเคราะห์ผ่าน Web Audio API",
        "จัดการรายชื่อและนำเข้ารหัสนักศึกษาได้หลายร้อยคนในคลิกเดียว",
        "ระบบตัดชื่อผู้ที่ถูกสุ่มแล้วออกอัตโนมัติเพื่อความยุติธรรม"
      ],
      "architecture": "HTML5 Canvas Render Engine + Web Audio Synthesizer",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web",
      "live_url": "",
      "docs_url": "",
      "start_date": "2025-07",
      "end_date": "2025-08"
    },
    {
      "id": 13,
      "title": "PhumShop: ร้านค้าออนไลน์และระบบเรนเดอร์กราฟิก 16:9 อัตโนมัติ",
      "description_short": "ร้านค้าสินค้าดิจิทัลและระบบเจนเนอเรตภาพแบนเนอร์อัตโนมัติความละเอียดสูง 8K",
      "description_full": "ระบบ E-Commerce ร้านค้าออนไลน์สำหรับจำหน่ายสินค้าและบริการดิจิทัล พร้อมโมดูลสร้างกราฟิกโปรโมตแบบ 16:9 ในตัว สามารถใส่โลโก้ จัดข้อความ และส่งออกเป็นรูปภาพความละเอียดสูงระดับ 8K ด้วย Canvas HTML5 แบบอัตโนมัติเพื่อนำไปโปรโมตบนโซเชียลมีเดียได้ทันที",
      "thumbnail": "https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Web App",
      "status": "completed",
      "tech_stack": [
        "Google Apps Script",
        "HTML5 Canvas",
        "CSS3",
        "JavaScript"
      ],
      "features": [
        "ระบบแคตตาล็อกสินค้าดิจิทัลพร้อมตะกร้าสินค้า",
        "เครื่องมือสร้างภาพแบนเนอร์กราฟิก 16:9 อัตโนมัติ",
        "ส่งออกไฟล์รูปภาพคมชัดสูง 4K / 8K สำหรับสื่อออนไลน์",
        "เชื่อมต่อฐานข้อมูล Google Sheets บันทึกออเดอร์"
      ],
      "architecture": "Google Sheets Database + HTML5 High-DPI Canvas Renderer",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web/phumshop",
      "live_url": "https://github.com/masterphum07-web/phumshop",
      "docs_url": "https://github.com/masterphum07-web/phumshop#readme",
      "start_date": "2025-05",
      "end_date": "2025-07"
    },
    {
      "id": 14,
      "title": "Virtual Lab 5—6: ห้องปฏิบัติการจำลองวงจรไฟฟ้าและดิจิทัลลอจิก",
      "description_short": "เว็บแอปพลิเคชันจำลองการทดลองวงจรอิเล็กทรอนิกส์กำลังและดิจิทัลลอจิกแบบ Interactive ภาษาไทย",
      "description_full": "เว็บจำลองการทดลองเสมือนจริงสำหรับการเรียนการสอนวิชาปฏิบัติการอิเล็กทรอนิกส์ ครอบคลุมการทดลองที่ 5 (อุปกรณ์สารกึ่งตัวนำกำลัง SCR / TRIAC / SSR) และการทดลองที่ 6 (ดิจิทัลลอจิกเกต, วงจร Tri-state, และ Flip-Flop) ผู้เรียนสามารถต่อวงจรเสมือน, ปรับค่าสัญญาณ, และสังเกตพฤติกรรมของวงจรผ่านกราฟรูปคลื่นแบบ Real-time",
      "thumbnail": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      "screenshots": [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
      ],
      "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "category": "Tool",
      "status": "completed",
      "tech_stack": [
        "React",
        "Vite",
        "Interactive Circuit Canvas",
        "Tailwind CSS",
        "JavaScript"
      ],
      "features": [
        "จำลองพฤติกรรมของ SCR, TRIAC และ Solid State Relay พร้อมสโคปวัดสัญญาณ",
        "จำลองเกตดิจิทัล (AND, OR, NOT, NAND, NOR) และการทำงานของ Flip-Flop",
        "แบบบันทึกผลการทดลองและเฉลยการคำนวณแบบ Interactive",
        "ภาษาไทยทั้งระบบ เข้าใจง่าย เหมาะสำหรับการเรียนรู้ด้วยตนเอง"
      ],
      "architecture": "React Virtual Circuit Simulator Engine",
      "author": "ภูมิภัทร (masterphum07)",
      "github_url": "https://github.com/masterphum07-web",
      "live_url": "",
      "docs_url": "",
      "start_date": "2025-06",
      "end_date": "2025-08"
    }
  ],
  "skills": [
    {
      "name": "React / Next.js 14",
      "category": "Frontend",
      "level": 95,
      "icon": "atom",
      "color": "#61DAFB",
      "desc": "App Router, Server Components, Hooks, Zustand"
    },
    {
      "name": "TypeScript / JavaScript",
      "category": "Frontend",
      "level": 92,
      "icon": "file-code-2",
      "color": "#3178C6",
      "desc": "Type Safety, Modern ESNext, Async/Await"
    },
    {
      "name": "Tailwind CSS / Glassmorphism",
      "category": "Frontend",
      "level": 94,
      "icon": "palette",
      "color": "#06B6D4",
      "desc": "Responsive UI, Neon Aesthetics, CSS Animations"
    },
    {
      "name": "Three.js / WebGL / WebXR",
      "category": "Frontend",
      "level": 88,
      "icon": "box",
      "color": "#9b51e0",
      "desc": "3D Shaders, Patient Pose Simulator, 60FPS Optimization"
    },
    {
      "name": "Google Apps Script",
      "category": "Backend",
      "level": 92,
      "icon": "server",
      "color": "#339933",
      "desc": "Zero-Cost Serverless APIs, Sheets Automation, Drive API"
    },
    {
      "name": "Python / MediaPipe",
      "category": "Backend",
      "level": 88,
      "icon": "cpu",
      "color": "#3776AB",
      "desc": "Telegram Bots, Pose Tracking, Machine Learning"
    },
    {
      "name": "MQL5 / Algorithmic Trading",
      "category": "Backend",
      "level": 85,
      "icon": "zap",
      "color": "#00ADD8",
      "desc": "MetaTrader 5 Expert Advisors, Breakout Strategy, Risk Mgmt"
    },
    {
      "name": "Supabase / PostgreSQL",
      "category": "Database",
      "level": 86,
      "icon": "database",
      "color": "#4169E1",
      "desc": "PostgreSQL, Real-time Subscriptions, Auth, Storage"
    },
    {
      "name": "PWA & Offline Service Worker",
      "category": "DevOps",
      "level": 90,
      "icon": "hard-drive",
      "color": "#47A248",
      "desc": "Offline Precache, Web App Manifest, Mobile Install"
    },
    {
      "name": "Git / GitHub Pages CI/CD",
      "category": "DevOps",
      "level": 92,
      "icon": "git-branch",
      "color": "#F05032",
      "desc": "Automated Deployments, Branch Strategy, Version Control"
    }
  ],
  "timeline": [
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
  ],
  "testimonials": [
    {
      "id": 1,
      "name": "อาจารย์ที่ปรึกษาชมรมดนตรี",
      "position": "ชมรมดนตรี วทก.",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      "rating": 5,
      "text": "ระบบ WTK Music Studio ช่วยแก้ปัญหาการจองห้องซ้อมชนกันได้อย่างหมดจด ใช้งานง่ายมาก นักศึกษาทุกคนชมว่าระบบแจ้งเตือนไวและสะดวกมากครับ"
    },
    {
      "id": 2,
      "name": "ตัวแทนนักศึกษารังสีเทคนิค",
      "position": "สาขาวิชารังสีเทคนิค วทก.",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      "rating": 5,
      "text": "เว็บ RTPI ทำให้ดูตารางสอบและตารางเรียนง่ายขึ้นมาก มีระบบค้นหาที่เร็วทันใจ และโปรแกรม RadPose 3D ช่วยให้เห็นมุมหลอดเอกซเรย์ชัดเจนมาก"
    },
    {
      "id": 3,
      "name": "Alexandre Dupont",
      "position": "Algorithmic Trader",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      "rating": 5,
      "text": "The MT5 breakout engine with Telegram integration is rock solid. Great execution speed and reliable risk controls."
    },
    {
      "id": 4,
      "name": "ทีมงานสโมสรนักศึกษา",
      "position": "องค์การนักศึกษา วทก.",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      "rating": 5,
      "text": "ระบบถ่ายทอดผลคะแนน Election Live และ Badminton Scoreboard ช่วยให้งานกิจกรรมดำเนินไปอย่างตื่นเต้น กราฟิกสวยงามและไม่มีสะดุดเลย"
    },
    {
      "id": 5,
      "name": "ผู้ใช้งานแอป Bloom & Care",
      "position": "Community Member",
      "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      "rating": 5,
      "text": "ประทับใจดีไซน์น่ารักและโหมดสำหรับคู่รักมากค่ะ การแจ้งเตือนผ่าน LINE ทำให้แฟนคอยใส่ใจและเข้าใจรอบเดือนได้ดีขึ้นมากๆ"
    }
  ],
  "articles": [
    {
      "id": 1,
      "title": "การพัฒนา 3D Patient Positioning Simulator สำหรับการเรียนการสอนรังสีวิทยา",
      "excerpt": "แนวทางการสร้างสื่อการเรียนรู้เสมือนจริง 3 มิติบนเว็บเบราว์เซอร์ด้วย Three.js และ WebGL ตามมาตรฐาน ACR",
      "date": "10 กันยายน 2025",
      "read_time": "6 นาที",
      "image": "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
      "tags": [
        "Three.js",
        "Radiology",
        "Medical Tech"
      ],
      "link": "#"
    },
    {
      "id": 2,
      "title": "สร้างระบบจองห้องซ้อมดนตรีแบบ Zero-Cost ด้วย Google Apps Script และ Atomic Lock",
      "excerpt": "เทคนิคการป้องกัน Race Condition และการจองเวลาชนกันด้วย LockService พร้อมระบบส่งอีเมลแจ้งเตือนอัตโนมัติ",
      "date": "25 สิงหาคม 2025",
      "read_time": "8 นาที",
      "image": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      "tags": [
        "Serverless",
        "Google Apps Script",
        "Zero-Cost"
      ],
      "link": "#"
    },
    {
      "id": 3,
      "title": "เชื่อมต่อ MetaTrader 5 สู่ Telegram Bot ด้วย Python สั่งเทรดระยะไกลได้ทุกที่",
      "excerpt": "เบื้องหลังการควบคุม EA บน MT5 ผ่าน Python Telegram Daemon แบบ Two-Way Communication และระบบ Hard Cut Drawdown",
      "date": "15 กรกฎาคม 2025",
      "read_time": "10 นาที",
      "image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
      "tags": [
        "MQL5",
        "Python",
        "Telegram Bot"
      ],
      "link": "#"
    }
  ]
};

// Save a deep clone of the initial default data for reset capabilities & restore customizations
if (typeof window !== 'undefined') {
  try {
    window.INITIAL_PORTFOLIO_DATA = JSON.parse(JSON.stringify(window.PORTFOLIO_DATA));

    if (typeof localStorage !== 'undefined') {
      const savedProjects = localStorage.getItem('portfolio_projects_data');
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed)) {
          window.PORTFOLIO_DATA.projects = parsed;
        }
      }

      const savedProfile = localStorage.getItem('portfolio_profile_data');
      if (savedProfile) {
        const parsedProf = JSON.parse(savedProfile);
        if (parsedProf && typeof parsedProf === 'object') {
          window.PORTFOLIO_DATA.portfolio_owner = Object.assign({}, window.PORTFOLIO_DATA.portfolio_owner, parsedProf);
        }
      }
    }
  } catch (err) {
    console.warn('[DataStore] Error restoring data from localStorage:', err);
  }
}
