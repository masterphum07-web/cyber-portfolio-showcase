/**
 * DEVELOPER RESUME / CV VIEWER & PRINT ENGINE
 * แสดงผลเรซูเม่และประวัติย่อแบบ Interactive และพร้อมสำหรับการพิมพ์มาตรฐาน A4 (ATS-Friendly)
 * - สั่งพิมพ์ / บันทึกเป็น PDF มาตรฐาน (A4 Optimized Print Styles)
 * - คัดลอกเนื้อหาเรซูเม่แบบ Plain Text (ATS-Compliant) เข้า Clipboard
 * - ดาวน์โหลดไฟล์ Markdown (.md) สำหรับเก็บข้อมูล
 * - รองรับคีย์ลัด Alt + R เพื่อเปิดอย่างรวดเร็ว
 */

class ResumeViewer {
  constructor() {
    this.isOpen = false;
    this.modal = document.getElementById('resume-modal');
    this.lastFocusedElement = null;

    this.init();
  }

  init() {
    // Keyboard shortcut listeners (Alt + R)
    window.addEventListener('keydown', (e) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable;
      if (!isInput && e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        this.toggle();
        return;
      }

      if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.close();
      }
    });

    // Close on backdrop click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }

    // Trigger button clicks across the site
    document.querySelectorAll('.resume-trigger-btn').forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });
  }

  open() {
    if (!this.modal) return;
    this.lastFocusedElement = document.activeElement;
    this.isOpen = true;
    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    window.soundFx?.modalOpen?.();
    if (window.lucide) window.lucide.createIcons();

    const firstFocusable = this.modal.querySelector('button, [href], input, [tabindex="0"]');
    if (firstFocusable) firstFocusable.focus();
  }

  close() {
    if (!this.modal || !this.isOpen) return;
    this.isOpen = false;
    this.modal.classList.remove('open');
    document.body.style.overflow = '';

    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  // สั่งพิมพ์หรือเซฟเป็น PDF ผ่านระบบ Print ของเบราว์เซอร์
  printResume() {
    window.soundFx?.click?.();
    window.print();
  }

  // คัดลอกเนื้อหา Plain Text สำหรับส่งระบบ ATS
  copyPlainText() {
    const text = `
PHUMPHAT SAWANGWIANG (ภูมิภัทร สว่างเวียง)
Full-Stack Developer & Radiologic Technology Innovator
Bangkok / Nonthaburi, Thailand | contact@phumshop.dev | +66 81-234-5678
Portfolio: https://masterphum07-web.github.io/cyber-portfolio-showcase/
GitHub: https://github.com/masterphum07-web

PROFESSIONAL SUMMARY
Senior Full-Stack Developer with 5+ years of experience designing and architecting high-performance web applications, scalable cloud microservices, and interactive 3D WebGL experiences. Proven track record in improving system throughput, optimizing SEO and web vitals, and leading cross-functional engineering teams.

CORE TECHNICAL SKILLS
- Frontend: React 18, Next.js 14, TypeScript, Vue.js, Tailwind CSS, Three.js, WebGL, Canvas API, HTML5/CSS3.
- Backend & APIs: Node.js, Express, Python (FastAPI/Django), Go (Golang), RESTful APIs, GraphQL, WebSockets.
- Database & Cloud: PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, Google Cloud Platform, Supabase.
- Architecture & Tools: Microservices, Event-Driven Architecture, CI/CD (GitHub Actions), Jest, Git, Agile/Scrum.

WORK EXPERIENCE
Lead / Senior Full-Stack Developer | CyberTech Studio, Bangkok (2023 - Present)
- Architected enterprise cloud platforms using Next.js 14, TypeScript, and Go microservices, handling over 2M monthly requests.
- Developed real-time 3D WebGL interactive visualization dashboards reducing client onboarding time by 45%.
- Implemented automated CI/CD deployment pipelines with zero-downtime rolling updates.

Full-Stack Developer | NextGen Creative Solutions (2021 - 2023)
- Engineered scalable REST and GraphQL APIs using Node.js and PostgreSQL with sub-100ms response times.
- Optimized frontend bundle sizes and web vitals achieving Lighthouse scores of 98+ across all web properties.
- Mentored junior engineers and conducted weekly architecture and code review sessions.

Frontend Engineer | Digital Frontier Labs (2019 - 2021)
- Developed responsive web applications using modern JavaScript/TypeScript and Tailwind CSS.
- Integrated payment gateways (Omise, Stripe) and third-party SaaS APIs with robust error handling.

EDUCATION
Bachelor of Science in Computer Science (First-Class Honors)
King Mongkut's University of Technology (2015 - 2019)

CERTIFICATIONS
- AWS Certified Solutions Architect - Associate
- Google Cloud Certified Professional Cloud Developer
- Meta Front-End Developer Professional Certificate

LANGUAGES
- Thai: Native
- English: Professional Working Proficiency (TOEIC Score: 850+)
    `.trim();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        window.soundFx?.success?.();
        window.showToast?.('คัดลอกเรซูเม่ฉบับ Plain Text (ATS-Ready) เข้าคลิปบอร์ดแล้ว', 'success', 'clipboard-check');
      }).catch(() => {
        this.fallbackCopyText(text);
      });
    } else {
      this.fallbackCopyText(text);
    }
  }

  fallbackCopyText(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      window.soundFx?.success?.();
      window.showToast?.('คัดลอกเรซูเม่ฉบับ Plain Text เข้าคลิปบอร์ดแล้ว', 'success', 'clipboard-check');
    } catch {
      window.showToast?.('ไม่สามารถคัดลอกข้อความได้อัตโนมัติ', 'error', 'alert-circle');
    }
    document.body.removeChild(ta);
  }

  // ดาวน์โหลดไฟล์ Markdown (.md)
  downloadMarkdown() {
    const mdContent = `# Phumphat Sawangwiang (ภูมิภัทร สว่างเวียง)
**Full-Stack Developer & Radiologic Technology Innovator**
- Email: contact@phumshop.dev | Phone: +66 81-234-5678 | Bangkok / Nonthaburi, Thailand
- Portfolio: https://masterphum07-web.github.io/cyber-portfolio-showcase/

---

## Executive Summary
Senior Full-Stack Developer with 5+ years of experience in architecting scalable web applications, cloud backends, and high-performance 3D WebGL interfaces.

## Technical Skills
- **Languages:** TypeScript, JavaScript (ESNext), Python, Go, SQL, HTML5/CSS3
- **Frontend:** React 18, Next.js 14, Vue.js, Tailwind CSS, Three.js, WebGL
- **Backend:** Node.js, Express, FastAPI, Django, PostgreSQL, Redis, MongoDB
- **Cloud & DevOps:** Docker, Kubernetes, AWS, Google Cloud, CI/CD, Git

## Experience
### Lead / Senior Full-Stack Developer — CyberTech Studio (2023 - Present)
- Architected enterprise cloud platforms using Next.js 14, TypeScript, and Go microservices.
- Developed real-time 3D WebGL interactive visualization dashboards.

### Full-Stack Developer — NextGen Solutions (2021 - 2023)
- Engineered scalable REST and GraphQL APIs using Node.js and PostgreSQL.
- Optimized web vitals achieving Lighthouse scores of 98+.

## Education
- **B.Sc. in Computer Science (First-Class Honors)** — King Mongkut's University of Technology
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Phumphat-Developer-Resume.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    window.soundFx?.click?.();
    window.showToast?.('ดาวน์โหลดไฟล์ Phumphat-Developer-Resume.md สำเร็จ', 'success', 'download');
  }
}

// Global exports & initialization
window.openResumeModal = function() {
  window.resumeViewer?.open();
};

window.closeResumeModal = function() {
  window.resumeViewer?.close();
};

window.printResume = function() {
  window.resumeViewer?.printResume();
};

window.copyResumeText = function() {
  window.resumeViewer?.copyPlainText();
};

document.addEventListener('DOMContentLoaded', () => {
  window.resumeViewer = new ResumeViewer();
});
