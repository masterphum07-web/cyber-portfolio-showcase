# 🚀 Project Showcase Portfolio Website (3D & Interactive - Boosted Edition)

เว็บไซต์ Portfolio สำหรับโชว์ผลงานโปรเจค (Project Showcase) ดีไซน์สไตล์ Cyber-Glassmorphism ล้ำสมัย พร้อมลูกเล่น **3D Interactive Specular Glare & Parallax Depth**, **PWA Offline Support**, **Cyber Web Audio Synthesizer**, **Keyboard Shortcuts HUD**, ระบบกรองและค้นหาผลงาน, แกลเลอรีภาพ Carousel พร้อม Video Demo Player, และรองรับทั้ง **Dark Mode** และ **Light Mode** สมบูรณ์แบบ 100%

---

## 📁 โครงสร้างโฟลเดอร์และไฟล์ (File Structure)

```
รวมโปรเจค/
├── index.html              # โครงสร้างหน้าเว็บหลัก (Semantic HTML5, SEO, Modals, 8 Sections)
├── README.md               # คู่มือการติดตั้ง ใช้งาน และ Deploy
├── manifest.webmanifest    # PWA Web App Manifest สำหรับติดตั้งลงเครื่อง (Desktop / Mobile)
├── sw.js                   # Service Worker จัดการ Offline Caching & Stale-While-Revalidate
├── assets/
│   └── icons/              # ไอคอน PWA & Favicon (SVG & PNG: 192x192, 512x512, maskable)
├── css/
│   ├── style.css           # ดีไซน์ Glassmorphism, 3D Glare, Grid/List View, Print Stylesheet
│   └── animations.css      # Keyframes, 3D Tilt, Floating Badges, Toasts, HUD, Reduced-Motion
├── js/
│   ├── data.js             # Data Store (โปรเจค, ข้อมูลส่วนตัว, สกิล, ไทม์ไลน์, บทความ)
│   ├── particles.js        # Background FX Engine (3-in-1: Particles, Matrix Rain, Starfield)
│   ├── three-hero.js       # Three.js WebGL 3D Interactive Hero Core & Orbiting Neon Cloud
│   ├── projects.js         # Vanilla-Tilt 3D Glare Engine, Device Simulator, Swiper, Filtering
│   ├── main.js             # Chart.js Radar, Swiper Testimonials, Tippy HUD, Web Audio, PWA
│   ├── admin.js            # In-Place Live CMS & Admin CRUD Backoffice Suite
│   ├── command-palette.js  # Command Palette (Ctrl+K) inspired by cmdk & Raycast
│   ├── terminal.js         # Interactive Developer Cyber Terminal (CLI Mode) with history & auto-complete
│   └── resume.js           # Developer Resume / CV Viewer & Print Engine (ATS A4 Optimized)
├── data/
│   └── projects.json       # ไฟล์ JSON เก็บข้อมูลโปรเจคทั้งหมดสำหรับเชื่อมต่อ API / Fetch
└── tests/
    ├── verify-portfolio.js # Automated Test Suite ตรวจสอบความถูกต้องครบ 259 จุด
    └── server-check.js     # Script ทดสอบ HTTP Serving & MIME Types
```

---

## ✨ ฟีเจอร์เด่นระดับ Production (Boosted Key Features)

1. **📱 PWA (Progressive Web App) & Offline Ready**
   - ติดตั้งลงบนสมาร์ตโฟน (iOS / Android) และคอมพิวเตอร์ (Windows / macOS / ChromeOS) ได้เสมือนแอป Native
   - มี Service Worker (`sw.js`) ทำ Precache ทรัพยากรหลักทั้งหมด เปิดใช้งานได้แม้ไม่มีสัญญาณอินเทอร์เน็ต
   - ระบบภาพสำรอง SVG Offline Placeholder ไม่แสดงภาพเสียเมื่อออฟไลน์

2. **💎 3D Specular Glare & Parallax Depth Physics (with Mobile Gyroscope)**
   - แผ่นการ์ดเอียง 3D ตามตำแหน่งเมาส์ พร้อมประกายแสงสะท้อน (Specular Glare Highlight) และความลึกแบบ Parallax Layers
   - คำนวณด้วย Linear Interpolation (Lerp) Damping มอบความนุ่มนวลระดับ 60–120 FPS ไม่กระตุก
   - **Mobile Gyroscope**: รองรับการเอียง 3D อัตโนมัติตามเซนเซอร์ DeviceOrientation บนสมาร์ตโฟนและแท็บเล็ต
   - ป้องกัน Memory Leak ด้วยการผูก Event Listener เพียงครั้งเดียวผ่าน `data-tilt-ready`

3. **🔊 Cyber Web Audio Synthesizer (Zero External Dependencies)**
   - สังเคราะห์เสียงประกอบ Sci-Fi ด้วย Web Audio API แท้ 100% (เสียงคลิก, เสียงเปิดวาร์ป Modal, เสียงสำเร็จ Confetti)
   - ปลดล็อก AudioContext ทันทีตั้งแต่การคลิกหรือกดคีย์แรก (User Gesture Auto-Unlock)
   - มีปุ่มเปิด/ปิดเสียง (Mute Toggle) บน Navbar หรือกดปุ่ม `M` บนคีย์บอร์ด โดยค่าเริ่มต้น Mute ไว้เพื่อเคารพผู้ใช้

4. **⌨️ Keyboard Shortcuts HUD & Accessibility (a11y)**
   - กดปุ่ม `?` เพื่อเปิดหน้าต่าง HUD แสดงรายการคีย์ลัด:
     - `/` : โฟกัสช่องค้นหาโปรเจคทันที
     - `T` : สลับโหมด Dark / Light
     - `M` : เปิด/ปิดเสียง Cyber Audio
     - `G` : สลับมุมมองระหว่าง Grid (ตาราง) และ List (รายการ)
     - `←` / `→` : สไลด์ดูรูปภาพโปรเจค
     - `Esc` : ปิดหน้าต่าง Modal หรือ HUD
   - ระบบ **Focus Trap & Scroll Lock**: ล็อกปุ่ม Tab และล็อกการเลื่อนหน้าจอด้านหลังทั้งใน Project Modal และ HUD Shortcuts Modal
   - คืนค่า Focus สู่ปุ่มเดิมอัตโนมัติเมื่อปิดหน้าต่าง Modal
   - รองรับ `prefers-reduced-motion` อย่างสมบูรณ์สำหรับผู้ใช้ที่ไวต่อภาพเคลื่อนไหว

5. **⭐ Projects Showcase, Video Demo & Tech Stack Filter**
   - **Interactive Tech Filtering**: คลิกที่แท็กเทคโนโลยีใดๆ (เช่น React, Docker, Python) บนการ์ดหรือใน Modal เพื่อกรองโปรเจคทันที!
   - **Media Switcher & Auto Embed**: สลับดูได้ทั้งแกลเลอรีภาพ และวิดีโอเดโม พร้อมระบบแปลงลิงก์ YouTube (watch, youtu.be, shorts) และ Vimeo เป็น iframe embed อัตโนมัติ
   - **View Switcher & Sorting**: เลือกดูแบบ Grid View หรือ List View และจัดเรียงตาม แนะนำ, ชื่อ (A-Z), วันที่พัฒนา (ใหม่สุด) หรือ หมวดหมู่
   - **Clean History Navigation**: รองรับปุ่ม Back / Forward ของเบราว์เซอร์อย่างแม่นยำ ไม่ติดลูปประวัติหน้าเว็บ
   - **Share & Copy Link**: ปุ่มคัดลอกลิงก์ตรงของแต่ละโปรเจค `#project-{id}` เพื่อส่งต่อให้ HR หรือทีมงานได้ทันที

6. **📝 Contact Form with Auto-Draft & Real-time Toasts**
   - บันทึกแบบร่างข้อความอัตโนมัติลงใน `localStorage` ไม่ต้องกลัวข้อความหายหากเผลอกดรีเฟรชหน้าจอ
   - ระบบ Toast Notifications แจ้งเตือนสถานะต่างๆ ที่มุมขวาบนอย่างสวยงาม
   - ฉลองความสำเร็จด้วยเอฟเฟกต์ Confetti หลากสีสันเมื่อส่งข้อความสำเร็จ

7. **📄 Print / PDF Resume Ready**
   - รองรับ `@media print` จัดรูปแบบหน้าเว็บเป็นเอกสารเรซูเม่อ่านง่าย พื้นหลังขาวสะอาดตา ซ่อนปุ่มและแอนิเมชันที่ไม่จำเป็น เหมาะสำหรับปริ้นท์หรือบันทึกเป็น PDF

8. **🌐 Best-in-Class Modern Web Libraries (High-Performance CDN Integration)**
   - 🪐 **Three.js** (`three.min.js`): วัตถุ 3D WebGL Hero Interactive (Icosahedron & Torus Knot) พร้อม Wireframe Shader เรืองแสง, ละอองนีออน 420 จุดโคจรรอบวัตถุ, การหมุนตามเมาส์/ทัชแบบ Inertia Physics และ IntersectionObserver ประหยัดแบตเตอรี่
   - 📊 **Chart.js** (`chart.umd.min.js`): Interactive Skill Radar Chart ในส่วน About Me แสดงมิติความเชี่ยวชาญ 6 ด้าน (Frontend, Backend, Architecture, DevOps, UI/UX, Security) พร้อมสี Neon Cyan/Pink และซิงค์ธีม Dark/Light Mode อัตโนมัติ
   - 📱 **Swiper.js** (`swiper-bundle.min.js`): Touch-Friendly Carousel ทั้งใน Project Modal (ดูภาพสไลด์และวิดีโอ) และ Testimonials Slider พร้อมปุ่ม Navigation และ Pagination Bullets
   - 🧲 **Vanilla-Tilt.js** (`vanilla-tilt.min.js`): 3D Card Parallax & Glare Specular Physics บนการ์ดโปรเจคและบริการ รองรับ Gyroscope บนมือถือ
   - 💡 **Tippy.js & Popper.js** (`tippy-bundle.umd.min.js`): Cyber HUD Tooltips เรืองแสงนีออน แสดงระดับความชำนาญ (Mastered / Advanced) และรายละเอียดบนการ์ด Tech Stack เมื่อ Hover/Focus

9. **⚡ 5 Advanced Open-Source Trending Features (Next-Level Upgrade)**
   - ⌨️ **Command Palette (`Ctrl + K` / `Cmd + K`)**: แผงสั่งการแบบ Glassmorphism แรงบันดาลใจจาก `cmdk` และ Raycast ค้นหาเมนู คำสั่งระบบ โปรเจค และกรองสแต็กเทคโนโลยีแบบเรียลไทม์ พร้อมการเลื่อนเลือกด้วยคีย์บอร์ด
   - 💻 **Interactive Developer Cyber Terminal (CLI Mode)**: หน้าต่างเทอร์มินัลอินเทอร์แอคทีฟสไตล์ Hacker CLI รองรับคำสั่ง `help`, `projects`, `open <id>`, `skills`, `bio`, `contact`, `theme`, `fx`, `matrix`, `starfield`, `particles`, `resume`, `stats`, `clear` พร้อม Command History (`↑`/`↓`) และ Tab Auto-completion
   - 📱 **Interactive Device Viewport Simulator**: แท็บจำลองหน้าจอใน Project Modal รองรับการพรีวิวผลงานแบบตอบสนองบน **Desktop** (1920×1080), **Tablet** (iPad 768×1024) และ **Mobile** (iPhone 390×844) พร้อม Mockup Browser URL bar, Dynamic Island, Home indicator และ Live iframe loading
   - 📄 **Developer Resume / CV Viewer & Print Modal**: หน้าต่างเรซูเม่ฉบับสมบูรณ์มาตรฐาน ATS แสดงผลประวัติการทำงาน สกิล ผลงานเด่น และการศึกษา พร้อมฟังก์ชัน **สั่งพิมพ์ A4 / บันทึก PDF** ผ่านเบราว์เซอร์ และคัดลอก Plain Text ATS-Ready
   - 🌌 **Interactive Background FX Real-time Switcher**: สลับแคนวาสพื้นหลัง 3 โหมดได้แบบเรียลไทม์:
     1. `particles`: 3D Particle Mesh & Constellation ตอบสนองตำแหน่งเมาส์
     2. `matrix`: Matrix Digital Rain ฝนโค้ดดิจิทัลสีเขียว/ฟ้าเรืองแสง
     3. `starfield`: Cyber Warp Starfield ท่องอวกาศ 3D ไฮเปอร์สเปซ
     พร้อมปุ่มสลับบน Navbar, คีย์ลัด `Alt + B` และบันทึกสถานะลง `localStorage` อัตโนมัติ

---

## 🛠️ วิธีการเปิดใช้งาน (How to Run)

### วิธีที่ 1: เปิดใช้งานทันที (ไม่ต้องติดตั้งอะไรเลย)
- ดับเบิ้ลคลิกที่ไฟล์ `index.html` เพื่อเปิดบน Google Chrome, Microsoft Edge, Firefox หรือ Safari ได้ทันที! (ระบบรองรับ `file://` โดยตรงผ่าน `js/data.js`)

### วิธีที่ 2: รันผ่าน Local Web Server (แนะนำสำหรับการทดสอบ PWA)
- **Node.js**:
  ```bash
  npx serve .
  ```
- **Python**:
  ```bash
  python -m http.server 8000
  ```
  จากนั้นเปิดเบราว์เซอร์ไปที่ `http://localhost:8000`

---

## 🧪 การรันแบบทดสอบอัตโนมัติ (Automated Tests)

โปรเจคมาพร้อมชุดทดสอบอัตโนมัติที่ครอบคลุมโครงสร้างไฟล์, ไวยากรณ์ JavaScript, Schema ของ JSON, PWA Manifest, Service Worker Precache, และความถูกต้องของ HTML/CSS:

```bash
# รันการทดสอบระบบทั้งหมด 146 จุด
node tests/verify-portfolio.js

# รันการทดสอบ HTTP Server & MIME Types
node tests/server-check.js
```

---

## ➕ วิธีเพิ่มโปรเจคใหม่ (How to Add a New Project)

คุณสามารถเพิ่มโปรเจคใหม่ได้อย่างง่ายดาย เพียงเปิดไฟล์ `js/data.js` (หรือ `data/projects.json`) แล้วเพิ่ม Object โปรเจคใหม่ลงใน Array `projects`:

```javascript
{
  id: 9,
  title: "ชื่อโปรเจคใหม่ของคุณ",
  description_short: "คำอธิบายสั้นๆ 1-2 บรรทัด สำหรับแสดงบนการ์ด",
  description_full: "คำอธิบายรายละเอียดเชิงลึก การทำงาน และเป้าหมายของโปรเจค...",
  thumbnail: "https://images.unsplash.com/... หรือ images/my-project.jpg",
  screenshots: [
    "https://images.unsplash.com/photo-1...",
    "https://images.unsplash.com/photo-2...",
    "https://images.unsplash.com/photo-3..."
  ],
  video_url: "https://www.youtube.com/embed/...",
  category: "Web App", // ตัวเลือก: "Web App", "Mobile App", "AI/ML", "Game", "Tool"
  status: "completed",  // ตัวเลือก: "completed", "in_progress", "archived"
  tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
  features: [
    "ฟีเจอร์ที่ 1 ของระบบ",
    "ฟีเจอร์ที่ 2 ของระบบ",
    "ฟีเจอร์ที่ 3 ของระบบ"
  ],
  architecture: "Next.js App Router + Supabase Edge Functions + Redis In-memory cache",
  author: "ชื่อผู้พัฒนา",
  github_url: "https://github.com/yourname/project",
  live_url: "https://your-live-demo.com",
  docs_url: "https://docs.yourproject.com",
  start_date: "2026-01",
  end_date: "2026-06"
}
```

---

## 🌐 การนำขึ้นออนไลน์ (Deployment)

1. **GitHub Pages**: อัปโหลดขึ้น Repository แล้วเปิด Settings -> Pages -> เลือก branch `main` โฟลเดอร์ `/ (root)`
2. **Vercel / Netlify**: เชื่อมต่อ Git Repository หรือลากวางโฟลเดอร์ลงบนแดชบอร์ด เว็บไซต์จะออนไลน์พร้อม HTTPS และใช้งาน PWA ได้ทันที 100%
