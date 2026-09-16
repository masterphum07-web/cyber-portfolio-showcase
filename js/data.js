/**
 * PORTFOLIO DATA STORE
 * โครงสร้างข้อมูลโปรเจค, ข้อมูลส่วนตัว, สกิล, ไทม์ไลน์ และบทความ
 * รองรับทั้งการเปิดแบบไฟล์ตรง (file://) และเว็บเซิร์ฟเวอร์
 */

window.PORTFOLIO_DATA = {
  portfolio_owner: {
    name: "กฤษณะ เกียรติอนันต์",
    english_name: "Kritsana Kiat-anan",
    title: "Full-Stack Developer & Creative Coder",
    roles: [
      "Full-Stack Developer",
      "Creative Coder & 3D Web",
      "AI & Cloud Architect",
      "DevOps Specialist"
    ],
    bio: "ผู้พัฒนาซอฟต์แวร์และเว็บแอปพลิเคชันที่หลงใหลใน 3D Interactive Web, AI Integration และ Modern UX/UI สรรค์สร้างผลงานดิจิทัลที่ล้ำสมัย รวดเร็ว และตอบสนองต่อธุรกิจ",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    experience_years: 4,
    completed_projects: 38,
    technologies_count: 24,
    github_commits: 1420,
    email: "contact@yourportfolio.dev",
    phone: "+66 81 234 5678",
    location: "กรุงเทพมหานคร, ประเทศไทย",
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      line: "https://line.me",
      discord: "https://discord.com"
    }
  },

  projects: [
    {
      id: 1,
      title: "Nexus E-Commerce Platform",
      description_short: "ระบบร้านค้าออนไลน์ Next-Gen รองรับชำระเงิน Real-time และระบบจัดการคลังสินค้าอัจฉริยะ",
      description_full: "แพลตฟอร์ม E-Commerce เต็มรูปแบบที่สร้างด้วย Next.js 14 และ Node.js microservices มีระบบค้นหา ElasticSearch แนะนำสินค้าด้วย AI, ระบบตระกร้าสินค้าพร้อมคำนวณภาษีและค่าจัดส่งอัตโนมัติ และระบบชำระเงินผ่าน Stripe & PromptPay Webhook พร้อมแผง Admin ควบคุมสินค้า",
      thumbnail: "https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=800&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
      ],
      video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      category: "Web App",
      status: "completed",
      tech_stack: ["React", "Next.js", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
      features: [
        "ระบบตะกร้าสินค้าแบบ Optimistic UI อัปเดตยอดและไอเทมทันทีโดยไม่โหลดหน้าใหม่",
        "เกตเวย์ชำระเงิน Stripe & QR PromptPay แบบ Real-time พร้อม Webhook ปลอดภัย",
        "แผงควบคุมหลังบ้าน (Admin Dashboard) วิเคราะห์ยอดขายสดและสถิติสินค้าขายดี",
        "ระบบสิทธิ์สมาชิก และประวัติการสั่งซื้อพร้อมสร้างใบเสร็จรับเงิน PDF",
        "ระบบจัดการสต็อกสินค้าแบบแจ้งเตือนเมื่อสินค้าใกล้หมดสต็อก"
      ],
      architecture: "Microservices Architecture บน Docker Container พร้อม Nginx Reverse Proxy และ Redis In-memory Caching",
      author: "กฤษณะ เกียรติอนันต์ & Core Team",
      github_url: "https://github.com",
      live_url: "https://demo.example.com",
      docs_url: "https://docs.example.com",
      start_date: "2025-03",
      end_date: "2025-08"
    },
    {
      id: 2,
      title: "Synapse AI Medical Diagnostic",
      description_short: "ระบบช่วยวินิจฉัยภาพถ่ายรังสีและผลเอกซเรย์ปอดด้วย Deep Learning Vision",
      description_full: "เว็บแอปพลิเคชันทางการแพทย์สำหรับแพทย์และบุคลากรสาธารณสุข ประมวลผลภาพ X-ray ทรวงอกเพื่อตรวจหาความผิดปกติ เช่น ปอดอักเสบ หรือรอยโรค ด้วยโมเดล Vision Transformer ที่มีความแม่นยำ 97.4% พร้อม Explainable AI (Grad-CAM) ไฮไลท์จุดที่น่าสงสัยบนภาพฟิล์ม",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80"
      ],
      video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      category: "AI/ML",
      status: "completed",
      tech_stack: ["Python", "PyTorch", "FastAPI", "React", "Docker", "Grad-CAM"],
      features: [
        "วิเคราะห์ภาพ X-Ray พร้อมให้คะแนนความน่าจะเป็นแบบจำแนก 14 สภาวะโรค",
        "Grad-CAM Heatmap ชี้ตำแหน่งจุดเสี่ยงบนฟิล์มรังสีแบบโปร่งแสงให้แพทย์ตรวจดู",
        "สร้างรายงานสรุปการตรวจวินิจฉัยมาตรฐาน DICOM ออกเป็นไฟล์ PDF ได้ทันที",
        "ระบบรักษาความปลอดภัยข้อมูลเวชระเบียนสอดคล้องมาตรฐาน HIPAA สากล"
      ],
      architecture: "FastAPI Async Backend สำหรับรัน PyTorch Inference + TorchServe + React Dashboard",
      author: "กฤษณะ เกียรติอนันต์",
      github_url: "https://github.com",
      live_url: "https://demo.example.com",
      docs_url: "https://docs.example.com",
      start_date: "2025-07",
      end_date: "2025-12"
    },
    {
      id: 3,
      title: "Zenith Crypto & Stock Portfolio",
      description_short: "แอปมือถือติดตามพอร์ตโฟลิโอสินทรัพย์และการเงินดิจิทัลแบบ Multi-Chain",
      description_full: "Cross-platform Mobile Application พัฒนาด้วย Flutter รองรับการเชื่อมต่อ Web3 Wallets (Ethereum, Solana) และตลาดหุ้นระดับโลก อัปเดตราคาแบบ Real-time WebSocket พร้อมคำนวณกำไร/ขาดทุน (P&L) และส่งสัญญาณแจ้งเตือนราคาตามเงื่อนไขที่กำหนด",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80"
      ],
      video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      category: "Mobile App",
      status: "completed",
      tech_stack: ["Flutter", "Dart", "Firebase", "Web3Dart", "WebSocket", "Riverpod"],
      features: [
        "เชื่อมต่อ Web3 Wallet ได้อัตโนมัติ (MetaMask, Phantom, Trust Wallet)",
        "ชาร์ตวิเคราะห์ทางเทคนิค CandleStick และ Indicators สด (TradingView Integration)",
        "แจ้งเตือน Push Notification เมื่อราคาทะลุแนวรับ-แนวต้าน",
        "ระบบบันทึกรายการภาษีคริปโตและคำนวณต้นทุนเฉลี่ย FIFO อัตโนมัติ"
      ],
      architecture: "Clean Architecture แบ่ง UI, Domain และ Data Layer พร้อม Riverpod State Management",
      author: "กฤษณะ เกียรติอนันต์",
      github_url: "https://github.com",
      live_url: "https://demo.example.com",
      docs_url: "https://docs.example.com",
      start_date: "2025-01",
      end_date: "2025-06"
    },
    {
      id: 4,
      title: "Neon Odyssey: Cyber Roguelike",
      description_short: "เกมแอ็กชัน 2.5D ไซเบอร์พังก์สไตล์ Roguelite รันบน WebGL 60FPS",
      description_full: "เกมมุมมอง Isometric สไตล์ Cyberpunk สร้างด้วย Unity C# และคอมไพล์ลง WebGL เพื่อเล่นผ่านเว็บเบราว์เซอร์ได้ทันที มีระบบ Procedural Level Generation สร้างด่านไม่ซ้ำกัน, ระบบแสงสีนีออนและ Shader กราฟิกล้ำอนาคต",
      thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
      ],
      video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      category: "Game",
      status: "in_progress",
      tech_stack: ["Unity", "C#", "HLSL Shaders", "WebGL", "FMOD Sound Engine"],
      features: [
        "ระบบ Procedural Map Generation สุ่มฉาก ศัตรู และไอเทมไม่ซ้ำกันทุกการเล่น",
        "ระบบการต่อสู้ Fast-Paced Hack & Slash พร้อมสกิลปรับแต่งได้กว่า 50 ชนิด",
        "Post-Processing Bloom และ Neon Lighting ปรับแต่งให้ลื่นไหล 60FPS บน Browser",
        "ระบบ Global Leaderboard บันทึกสถิติคะแนนผู้เล่นรอบโลกผ่าน Cloud API"
      ],
      architecture: "Unity DOTS/ECS สำหรับจัดการกระสุนและศัตรูนับร้อยตัว + WebGL WASM Export",
      author: "กฤษณะ เกียรติอนันต์ & Studio",
      github_url: "https://github.com",
      live_url: "https://demo.example.com",
      docs_url: "https://docs.example.com",
      start_date: "2025-09",
      end_date: "ปัจจุบัน (กำลังพัฒนา)"
    },
    {
      id: 5,
      title: "CloudPulse: Distributed DevOps Monitor",
      description_short: "เครื่องมือตรวจวัดประสิทธิภาพเซิร์ฟเวอร์และ Kubernetes Cluster แบบเรียลไทม์",
      description_full: "Open-source Monitoring CLI และ Web Dashboard ที่ใช้ทรัพยากรน้อยเป็นพิเศษ พัฒนาด้วย Go สำหรับ Agent และ React สำหรับ Web UI สามารถเก็บเมตริก CPU, RAM, Network I/O, Disk, และ Pod Health รายวินาที โดยกินแรมเครื่องเซิร์ฟเวอร์ไม่ถึง 15MB",
      thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80"
      ],
      video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      category: "Tool",
      status: "completed",
      tech_stack: ["Go (Golang)", "React", "Docker", "Prometheus", "Tailwind CSS"],
      features: [
        "Lightweight Go Daemon ดึงเมตริกระดับ OS Kernel ผ่าน eBPF ที่ความเร็วสูง",
        "Real-time Dashboard กราฟแสดงสถานะเซิร์ฟเวอร์ด้วยความหน่วงต่ำกว่า 50ms",
        "ระบบแจ้งเตือนผ่าน Slack, Discord Webhook และ Telegram เมื่อพบสิ่งผิดปกติ",
        "One-line bash script สำหรับติดตั้งได้อัตโนมัติบนเซิร์ฟเวอร์ Linux ทุกตระกูล"
      ],
      architecture: "eBPF Kernel Collector (Go) -> gRPC Streaming Server -> React/Tailwind Web Dashboard",
      author: "กฤษณะ เกียรติอนันต์",
      github_url: "https://github.com",
      live_url: "https://demo.example.com",
      docs_url: "https://docs.example.com",
      start_date: "2025-04",
      end_date: "2025-08"
    },
    {
      id: 6,
      title: "AuraFlow: Generative UI AI Canvas",
      description_short: "เครื่องมือออกแบบ UI อัตโนมัติด้วยคำสั่ง Prompt ขับเคลื่อนด้วย LLM",
      description_full: "เว็บแอปพลิเคชันสาย AI Creative Tool ที่แปลงข้อความ Prompt ภาษาธรรมชาติให้กลายเป็นโค้ด React & Tailwind CSS แบบสดๆ บน Interactive Canvas มีระบบ Drag & Drop จัดวางตำแหน่ง และส่งออกเป็นโค้ด Production Ready ในคลิกเดียว",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80"
      ],
      video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      category: "AI/ML",
      status: "in_progress",
      tech_stack: ["TypeScript", "Next.js", "Gemini API", "Tailwind CSS", "Monaco Editor"],
      features: [
        "Prompt to Component: สร้าง UI Component ทันสมัยด้วย AI Streaming Response",
        "Live Code Editor พร้อม Syntax Highlighting (Monaco Editor จาก VSCode)",
        "Interactive Preview ปรับขนาดมุมมอง Responsive ได้ในหน้าต่างเดียว",
        "Export โค้ดออกมาเป็น React, Vue, หรือ Pure HTML/CSS"
      ],
      architecture: "Next.js App Router + Server-Sent Events (SSE) AI Streaming Engine",
      author: "กฤษณะ เกียรติอนันต์",
      github_url: "https://github.com",
      live_url: "https://demo.example.com",
      docs_url: "https://docs.example.com",
      start_date: "2025-10",
      end_date: "ปัจจุบัน (กำลังพัฒนา)"
    },
    {
      id: 7,
      title: "OmniStream: 4K Peer-to-Peer Meeting",
      description_short: "ระบบประชุมและแชร์หน้าจอความละเอียดสูงไร้เซิร์ฟเวอร์คนกลาง (WebRTC P2P)",
      description_full: "ระบบการประชุมออนไลน์ผ่านเบราว์เซอร์ที่มีความปลอดภัยสูงด้วย End-to-End Encryption (E2EE) ส่งผ่านข้อมูลแบบ P2P ทำให้ภาพคมชัดระดับ 4K 60FPS ความหน่วงต่ำ พร้อมระบบไวท์บอร์ดวาดร่วมกันแบบ Real-time",
      thumbnail: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
      ],
      video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      category: "Web App",
      status: "archived",
      tech_stack: ["WebRTC", "JavaScript", "Node.js", "Socket.io", "Canvas API"],
      features: [
        "วิดีโอคอลแบบ P2P Mesh และ Selective Forwarding Unit (SFU) รองรับกลุ่มใหญ่",
        "ไวท์บอร์ดวาดรูปร่วมกันแบบ Zero-Latency และแชร์หน้าจอหลายจอพร้อมกัน",
        "ระบบตัดเสียงรบกวนรอบข้างด้วย Web Audio API AudioWorklet",
        "เข้ารหัสข้อมูลการสนทนา E2EE ป้องกันการดักฟังและรักษาความเป็นส่วนตัว"
      ],
      architecture: "WebRTC Mesh Signaling Server via Node.js WebSockets & TURN Server",
      author: "กฤษณะ เกียรติอนันต์",
      github_url: "https://github.com",
      live_url: "https://demo.example.com",
      docs_url: "https://docs.example.com",
      start_date: "2024-05",
      end_date: "2024-11"
    },
    {
      id: 8,
      title: "HyperCLI: Terminal Productivity Suite",
      description_short: "ชุดเครื่องมือ CLI ภาษา Rust ยกระดับการจัดการไฟล์และ Git ให้รวดเร็ว 10 เท่า",
      description_full: "เครื่องมือบน Terminal ที่เขียนด้วย Rust สำหรับนักพัฒนา รวมคำสั่งค้นหาไฟล์แบบ Fuzzy Finder, แสดงประวัติ Git แบบ Interactive Graph, และวิเคราะห์ขนาดโฟลเดอร์แบบดิสเพลย์สีสันสวยงาม รองรับทั้ง macOS, Linux และ Windows",
      thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80",
      screenshots: [
        "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"
      ],
      video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      category: "Tool",
      status: "completed",
      tech_stack: ["Rust", "Crossterm", "Tokio", "Git2-rs"],
      features: [
        "ค้นหาไฟล์และข้อความความเร็วแสงด้วย Multi-threaded SIMD search",
        "แสดง Git Log แบบต้นไม้อนิเมชัน Interactive พร้อม checkout ได้ทันทีในหน้าจอ",
        "วิเคราะห์การกินพื้นที่ดิสก์พร้อมแผนภาพสถิติแบบ Terminal TUI",
        "รองรับการเชื่อมต่อ Extension ด้วย Lua Scripting Engine"
      ],
      architecture: "Async Rust Tokio Runtime + Zero Memory Allocations + TUI Renderer",
      author: "กฤษณะ เกียรติอนันต์",
      github_url: "https://github.com",
      live_url: "https://demo.example.com",
      docs_url: "https://docs.example.com",
      start_date: "2025-02",
      end_date: "2025-05"
    }
  ],

  skills: [
    { name: "React / Next.js", category: "Frontend", level: 95, icon: "atom", color: "#61DAFB", desc: "Server Components, Hooks, State Management" },
    { name: "TypeScript / JS", category: "Frontend", level: 92, icon: "file-code-2", color: "#3178C6", desc: "Type Safety, Modern ESNext, Async/Await" },
    { name: "Tailwind / CSS3", category: "Frontend", level: 94, icon: "palette", color: "#06B6D4", desc: "Responsive Design, Glassmorphism, Animations" },
    { name: "Three.js / WebGL", category: "Frontend", level: 82, icon: "box", color: "#9b51e0", desc: "3D Shaders, Particle Systems, 60FPS Optimization" },
    { name: "Node.js / Express", category: "Backend", level: 90, icon: "server", color: "#339933", desc: "RESTful APIs, Microservices, Event Loop" },
    { name: "Python / FastAPI", category: "Backend", level: 88, icon: "cpu", color: "#3776AB", desc: "AI Serving, Data Processing, Async Endpoints" },
    { name: "Go (Golang)", category: "Backend", level: 80, icon: "zap", color: "#00ADD8", desc: "High Performance APIs, Goroutines, Concurrency" },
    { name: "PostgreSQL / MySQL", category: "Database", level: 86, icon: "database", color: "#4169E1", desc: "Schema Indexing, Query Optimization, ORMs" },
    { name: "MongoDB / Redis", category: "Database", level: 85, icon: "hard-drive", color: "#47A248", desc: "NoSQL Modeling, Caching, Pub/Sub Messaging" },
    { name: "Docker / K8s", category: "DevOps", level: 82, icon: "container", color: "#2496ED", desc: "Containerization, Orchestration, CI Pipeline" },
    { name: "AWS / Google Cloud", category: "DevOps", level: 80, icon: "cloud", color: "#FF9900", desc: "Serverless, S3/Storage, Cloud Functions" },
    { name: "Git / GitHub Actions", category: "DevOps", level: 92, icon: "git-branch", color: "#F05032", desc: "Branching Strategy, Automated Tests, Releases" }
  ],

  timeline: [
    {
      year: "2024 - ปัจจุบัน",
      role: "Senior Full-Stack Developer",
      company: "TechNova Studio",
      description: "ดูแลสถาปัตยกรรมระบบเว็บและโมบายล์แอปพลิเคชันสำหรับลูกค้าองค์กร ออกแบบโซลูชันระบบ AI และให้คำแนะนำทางเทคนิคแก่ทีมพัฒนา",
      tag: "การทำงาน",
      icon: "briefcase"
    },
    {
      year: "2022 - 2024",
      role: "Full-Stack Web Developer",
      company: "Digital Horizon Agency",
      description: "พัฒนาเว็บแอปพลิเคชัน Interactive และระบบ E-Commerce สำหรับแบรนด์ชั้นนำมากกว่า 15 โครงการ ทั้งส่วนหน้าบ้านและหลังบ้าน",
      tag: "การทำงาน",
      icon: "briefcase"
    },
    {
      year: "2020 - 2022",
      role: "Frontend Developer (Intern & Junior)",
      company: "InnovateX Lab",
      description: "พัฒนาระบบ Dashboard แสดงผลข้อมูลแบบ Real-time และโมดูล UI Responsive ด้วย React และ Three.js",
      tag: "การทำงาน",
      icon: "laptop"
    },
    {
      year: "2018 - 2022",
      role: "วิทยาศาสตรบัณฑิต (วิทยาการคอมพิวเตอร์)",
      company: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าฯ",
      description: "เกียรตินิยมอันดับ 1 | วิทยานิพนธ์: 'ระบบตรวจจับและวิเคราะห์ภาพถ่ายทางการแพทย์ด้วย Deep Learning Vision'",
      tag: "การศึกษา",
      icon: "graduation-cap"
    }
  ],

  testimonials: [
    {
      id: 1,
      name: "ดร. ธีรภัทร วัฒนพาณิชย์",
      position: "Head of Engineering @ TechNova",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "คุณกฤษณะมีความเชี่ยวชาญทั้ง Frontend และ Backend อย่างแท้จริง โค้ดสะอาด มีเอกสารครบถ้วน และส่งมอบงานระบบได้ตรงเวลาอย่างน่าทึ่ง การทำงานร่วมกันราบรื่นมากครับ"
    },
    {
      id: 2,
      name: "กมลวรรณ สุขประเสริฐ",
      position: "Product Manager @ Digital Horizon",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "ประทับใจความสามารถในการสร้างสรรค์ 3D Web และ User Experience ที่ล้ำสมัย ลูกค้าของเราทุกคนชมว่าเว็บไซต์ทำงานได้รวดเร็ว ลื่นไหล และสวยสะดุดตามาก"
    },
    {
      id: 3,
      name: "Alexandre Dupont",
      position: "CTO @ CloudSync Global",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "Exceptional architecture sense and proactive communication. His Go & Docker monitoring tool saved us hundreds of hours of debugging in our production clusters."
    },
    {
      id: 4,
      name: "ศิรวิชญ์ เมธาอนันต์",
      position: "Lead Architect @ Synergy Solutions",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "ระบบ Full-Stack และ Cloud Infrastructure ที่คุณกฤษณะวางโครงสร้างไว้มีความยืดหยุ่นและรองรับการขยายตัวได้ดีเยี่ยม การส่งมอบงานมีคุณภาพระดับมืออาชีพ"
    },
    {
      id: 5,
      name: "Sarah Jenkins",
      position: "Design Director @ CyberCraft Labs",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      text: "Working with Kritsana on our 3D interactive web product was a game-changer. The WebGL shaders and smooth animations blew our clients away. Highly recommended!"
    }
  ],

  articles: [
    {
      id: 1,
      title: "เจาะลึก 3D Web ด้วย Three.js และ Shader สำหรับ Modern Web 2026",
      excerpt: "เรียนรู้เทคนิคการเรนเดอร์กราฟิก 3 มิติบนเบราว์เซอร์ให้ลื่นไหล 60FPS โดยไม่กินสเปกเครื่องผู้ใช้ พร้อมตัวอย่าง Particle Mesh และ Interactive Controls",
      date: "14 กุมภาพันธ์ 2026",
      read_time: "6 นาที",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      tags: ["Three.js", "WebGL", "Creative Coding"],
      link: "#"
    },
    {
      id: 2,
      title: "สถาปัตยกรรม Microservices บน Next.js 14 และ Docker ในการใช้งานจริง",
      excerpt: "แนวทางออกแบบระบบให้รองรับทราฟฟิกหลักล้าน การทำ Caching ด้วย Redis และจัดการ State แบบ Optimistic UI ให้ผู้ใช้สัมผัสความเร็วระดับศูนย์วินาที",
      date: "28 มกราคม 2026",
      read_time: "8 นาที",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
      tags: ["Architecture", "Next.js", "Docker"],
      link: "#"
    },
    {
      id: 3,
      title: "สร้าง AI Vision Diagnostic ด้วย PyTorch และ FastAPI แบบ Step-by-Step",
      excerpt: "จากโมเดล Deep Learning สู่ Web API ระดับ Production พร้อมเทคนิค Grad-CAM Heatmap สำหรับอธิบายการตัดสินใจของ AI ให้ผู้ใช้งานและบุคลากรเข้าใจง่าย",
      date: "10 มกราคม 2026",
      read_time: "10 นาที",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
      tags: ["AI/ML", "PyTorch", "FastAPI"],
      link: "#"
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          window.PORTFOLIO_DATA.projects = parsed;
        }
      }

      const savedProfile = localStorage.getItem('portfolio_profile_data');
      if (savedProfile) {
        const parsedProf = JSON.parse(savedProfile);
        if (parsedProf && parsedProf.name) {
          window.PORTFOLIO_DATA.portfolio_owner = Object.assign({}, window.PORTFOLIO_DATA.portfolio_owner, parsedProf);
        }
      }
    }
  } catch (err) {
    console.warn('[DataStore] Error restoring data from localStorage:', err);
  }
}
