/**
 * INTERACTIVE BACKGROUND FX ENGINE (BOOSTED 3-IN-1: PARTICLES, MATRIX, STARFIELD)
 * รองรับ 3 รูปแบบเอฟเฟกต์สุดล้ำที่สลับได้แบบเรียลไทม์:
 * 1. 3D Particle Mesh & Constellation (โหมดตาข่ายอนุภาคตอบสนองเมาส์)
 * 2. Matrix Digital Rain (ฝนโค้ดตัวอักษรดิจิทัลสไตล์ Cyberpunk)
 * 3. Cyber Warp Starfield (การท่องอวกาศไฮเปอร์สเปซ 3D Warp Stars)
 * 
 * พร้อมระบบประหยัดพลังงาน: หยุดทำงานอัตโนมัติเมื่อสลับแท็บ, รองรับ prefers-reduced-motion,
 * และบันทึกสถานะลง localStorage (portfolio_bg_fx)
 */

class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // FX Modes: 'particles' | 'matrix' | 'starfield'
    const savedMode = localStorage.getItem('portfolio_bg_fx');
    this.currentMode = (savedMode === 'matrix' || savedMode === 'starfield') ? savedMode : 'particles';

    // Particle Mesh Settings
    this.particles = [];
    this.numParticles = 70;
    this.maxDistance = 140;

    // Matrix Rain Settings
    this.matrixFontSize = 16;
    this.matrixColumns = 0;
    this.matrixDrops = [];
    this.matrixChars = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEF<>{}/*+=~';

    // Starfield Warp Settings
    this.stars = [];
    this.numStars = 320;
    this.starSpeed = 4.5;
    this.warpFov = 300;

    this.animationFrameId = null;
    this.isRunning = false;
    this.isReducedMotion = false;

    this.mouse = {
      x: null,
      y: null,
      radius: 160
    };

    this.init();
  }

  init() {
    // ตรวจสอบ prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.isReducedMotion = motionQuery.matches;
    motionQuery.addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      if (this.isReducedMotion) {
        this.stop();
        this.renderSingleStaticFrame();
      } else {
        this.start();
      }
    });

    this.resize();
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.resize(), 100);
    });

    // Mouse listeners
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Touch listeners
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    window.addEventListener('touchcancel', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Battery & CPU Saver: หยุดทำงานเมื่อผู้ใช้สลับแท็บ
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else if (!this.isReducedMotion) {
        this.start();
      }
    });

    // IntersectionObserver: หยุดทำงานเมื่อ canvas ไม่อยู่ใน viewport (เช่น ถูกซ่อน)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !document.hidden && !this.isReducedMotion) {
            this.start();
          } else {
            this.stop();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(this.canvas);
    }

    this.initModeData();

    if (this.isReducedMotion) {
      this.renderSingleStaticFrame();
    } else {
      this.start();
    }
  }

  // กำหนดโหมดเอฟเฟกต์ (particles, matrix, starfield)
  setMode(mode, silent = false) {
    if (!['particles', 'matrix', 'starfield'].includes(mode)) return;
    this.currentMode = mode;
    localStorage.setItem('portfolio_bg_fx', mode);

    // ล้าง Canvas ทันทีเพื่อป้องกันภาพซ้อน
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    this.initModeData();
    this.updateSwitcherUI();

    if (!silent) {
      const modeNames = {
        particles: 'ตาข่ายอนุภาค 3D (Particle Mesh)',
        matrix: 'Matrix Digital Rain (ฝนโค้ดดิจิทัล)',
        starfield: 'Cyber Warp Starfield (ท่องอวกาศ 3D)'
      };
      window.soundFx?.click();
      window.showToast?.(`สลับเอฟเฟกต์พื้นหลังเป็น: ${modeNames[mode]}`, 'info', 'sparkles');
    }
  }

  getMode() {
    return this.currentMode;
  }

  toggleMode() {
    const modes = ['particles', 'matrix', 'starfield'];
    const nextIndex = (modes.indexOf(this.currentMode) + 1) % modes.length;
    this.setMode(modes[nextIndex]);
  }

  // อัปเดตปุ่ม Active ใน UI Background FX Switcher
  updateSwitcherUI() {
    document.querySelectorAll('[data-bg-fx]').forEach(btn => {
      const btnMode = btn.getAttribute('data-bg-fx');
      const isActive = btnMode === this.currentMode;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  initModeData() {
    if (this.currentMode === 'particles') {
      this.createParticles();
    } else if (this.currentMode === 'matrix') {
      this.initMatrix();
    } else if (this.currentMode === 'starfield') {
      this.initStarfield();
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.ctx.scale(dpr, dpr);

    // ปรับสเกลอนุภาคตามขนาดหน้าจออย่างนุ่มนวล
    let targetNum = 75;
    if (window.innerWidth < 768) {
      targetNum = 32;
      this.maxDistance = 95;
      this.mouse.radius = 120;
    } else if (window.innerWidth < 1200) {
      targetNum = 55;
      this.maxDistance = 125;
      this.mouse.radius = 150;
    } else {
      targetNum = 75;
      this.maxDistance = 145;
      this.mouse.radius = 175;
    }

    this.numParticles = targetNum;

    // รีเฟรชข้อมูลตามโหมดปัจจุบัน
    this.initModeData();

    if (this.isReducedMotion) {
      this.renderSingleStaticFrame();
    }
  }

  // ==========================================
  // MODE 1: PARTICLES MESH
  // ==========================================
  createParticles() {
    this.particles = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const colors = ['#00f2fe', '#8a2be2', '#ff007f'];

    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        size: Math.random() * 2.2 + 1.2,
        baseColor: colors[i % colors.length]
      });
    }
  }

  renderParticlesFrame(isLight, w, h) {
    this.ctx.clearRect(0, 0, w, h);

    const lineColor = isLight ? 'rgba(79, 172, 254, ' : 'rgba(0, 242, 254, ';
    const maxDistSq = this.maxDistance * this.maxDistance;
    const mouseRadiusSq = this.mouse.radius * this.mouse.radius;
    const hasMouse = this.mouse.x !== null && this.mouse.y !== null;

    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      const p = this.particles[i];

      // เคลื่อนที่อนุภาค
      p.x += p.vx;
      p.y += p.vy;

      // เด้งขอบจอ
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      else if (p.x > w) { p.x = w; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      else if (p.y > h) { p.y = h; p.vy *= -1; }

      // ปฏิสัมพันธ์กับเมาส์
      if (hasMouse) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        if (Math.abs(dx) < this.mouse.radius && Math.abs(dy) < this.mouse.radius) {
          const distSq = dx * dx + dy * dy;
          if (distSq < mouseRadiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (this.mouse.radius - dist) / this.mouse.radius;
            const angle = Math.atan2(dy, dx);
            p.x -= Math.cos(angle) * force * 2.5;
            p.y -= Math.sin(angle) * force * 2.5;
          }
        }
      }

      // วาดจุดอนุภาค
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = isLight ? '#4facfe' : p.baseColor;
      this.ctx.fill();

      // เส้นเชื่อมโยงอนุภาคที่อยู่ใกล้กัน
      for (let j = i + 1; j < len; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        if (Math.abs(dx) > this.maxDistance) continue;
        const dy = p.y - p2.y;
        if (Math.abs(dy) > this.maxDistance) continue;

        const distSq = dx * dx + dy * dy;
        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / this.maxDistance) * (isLight ? 0.22 : 0.35);
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `${lineColor}${alpha.toFixed(3)})`;
          this.ctx.lineWidth = 0.85;
          this.ctx.stroke();
        }
      }

      // เส้นเชื่อมหาพิกัดเมาส์
      if (hasMouse) {
        const dx = p.x - this.mouse.x;
        if (Math.abs(dx) < this.mouse.radius) {
          const dy = p.y - this.mouse.y;
          if (Math.abs(dy) < this.mouse.radius) {
            const distSq = dx * dx + dy * dy;
            if (distSq < mouseRadiusSq) {
              const dist = Math.sqrt(distSq);
              const alpha = (1 - dist / this.mouse.radius) * 0.45;
              this.ctx.beginPath();
              this.ctx.moveTo(p.x, p.y);
              this.ctx.lineTo(this.mouse.x, this.mouse.y);
              this.ctx.strokeStyle = `rgba(255, 0, 127, ${alpha.toFixed(3)})`;
              this.ctx.lineWidth = 1;
              this.ctx.stroke();
            }
          }
        }
      }
    }
  }

  // ==========================================
  // MODE 2: MATRIX DIGITAL RAIN
  // ==========================================
  initMatrix() {
    const w = window.innerWidth;
    this.matrixFontSize = window.innerWidth < 768 ? 14 : 16;
    this.matrixColumns = Math.floor(w / this.matrixFontSize);
    this.matrixDrops = [];

    for (let i = 0; i < this.matrixColumns; i++) {
      // สุ่มจุดเริ่มต้นของหยดฝนในแนวแกน Y
      this.matrixDrops[i] = Math.floor(Math.random() * -60);
    }
  }

  renderMatrixFrame(isLight, w, h) {
    // Semi-transparent trailing overlay
    this.ctx.fillStyle = isLight ? 'rgba(240, 244, 248, 0.22)' : 'rgba(10, 10, 26, 0.16)';
    this.ctx.fillRect(0, 0, w, h);

    this.ctx.font = `${this.matrixFontSize}px 'Courier New', monospace`;

    const primaryColor = isLight ? '#0284c7' : '#00f2fe';
    const accentColor = isLight ? '#0369a1' : '#00ff88';

    for (let i = 0; i < this.matrixColumns; i++) {
      const char = this.matrixChars.charAt(Math.floor(Math.random() * this.matrixChars.length));
      const x = i * this.matrixFontSize;
      const y = this.matrixDrops[i] * this.matrixFontSize;

      // ปฏิสัมพันธ์กับเมาส์: หากเมาส์อยู่ใกล้ หยดฝนจะสว่างและเบี่ยงเบน
      const hasMouse = this.mouse.x !== null && this.mouse.y !== null;
      let isNearMouse = false;
      if (hasMouse) {
        const dx = x - this.mouse.x;
        const dy = y - this.mouse.y;
        if (Math.abs(dx) < 80 && Math.abs(dy) < 80) {
          isNearMouse = true;
        }
      }

      if (isNearMouse) {
        this.ctx.fillStyle = '#ff007f'; // ไฮไลต์สีชมพูนีออนเมื่อโดนเมาส์
        this.ctx.shadowColor = '#ff007f';
        this.ctx.shadowBlur = 8;
      } else if (Math.random() > 0.85) {
        this.ctx.fillStyle = '#ffffff'; // หัวขบวนเรืองแสงขาวบริสุทธิ์
        this.ctx.shadowColor = accentColor;
        this.ctx.shadowBlur = 6;
      } else {
        this.ctx.fillStyle = (i % 2 === 0) ? primaryColor : accentColor;
        this.ctx.shadowBlur = 0;
      }

      if (y > 0 && y < h + this.matrixFontSize) {
        this.ctx.fillText(char, x, y);
      }

      this.ctx.shadowBlur = 0;

      // รีเซ็ตหยดฝนเมื่อตกทะลุจอ
      if (y > h && Math.random() > 0.975) {
        this.matrixDrops[i] = 0;
      }
      this.matrixDrops[i]++;
    }
  }

  // ==========================================
  // MODE 3: CYBER WARP STARFIELD
  // ==========================================
  initStarfield() {
    this.stars = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.numStars = window.innerWidth < 768 ? 160 : 320;

    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * w,
        pz: Math.random() * w,
        color: ['#00f2fe', '#8a2be2', '#ffffff', '#ff007f'][Math.floor(Math.random() * 4)]
      });
    }
  }

  renderStarfieldFrame(isLight, w, h) {
    // Fading trail effect
    this.ctx.fillStyle = isLight ? 'rgba(240, 244, 248, 0.28)' : 'rgba(10, 10, 26, 0.25)';
    this.ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Perspective offset influenced gently by mouse
    let offsetX = 0;
    let offsetY = 0;
    if (this.mouse.x !== null && this.mouse.y !== null) {
      offsetX = (this.mouse.x - cx) * 0.15;
      offsetY = (this.mouse.y - cy) * 0.15;
    }

    const len = this.stars.length;
    for (let i = 0; i < len; i++) {
      const s = this.stars[i];
      s.pz = s.z;
      s.z -= this.starSpeed;

      // Respawn when star passes camera
      if (s.z <= 0) {
        s.z = w;
        s.pz = w;
        s.x = (Math.random() - 0.5) * w * 2;
        s.y = (Math.random() - 0.5) * h * 2;
      }

      // Projected 2D coordinates
      const k = this.warpFov / s.z;
      const px = (s.x + offsetX) * k + cx;
      const py = (s.y + offsetY) * k + cy;

      const pk = this.warpFov / s.pz;
      const prevX = (s.x + offsetX) * pk + cx;
      const prevY = (s.y + offsetY) * pk + cy;

      if (px >= 0 && px <= w && py >= 0 && py <= h) {
        const size = Math.max(0.8, (1 - s.z / w) * 3);
        const alpha = Math.min(1, Math.max(0.2, (1 - s.z / w) * 1.2));

        // Draw warp streak line
        this.ctx.beginPath();
        this.ctx.moveTo(prevX, prevY);
        this.ctx.lineTo(px, py);
        this.ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${alpha.toFixed(2)})` : s.color;
        this.ctx.lineWidth = size;
        this.ctx.stroke();

        // Draw star head
        this.ctx.beginPath();
        this.ctx.arc(px, py, size * 0.75, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
      }
    }
  }

  renderSingleStaticFrame() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.ctx.clearRect(0, 0, w, h);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = isLight ? '#4facfe' : p.baseColor;
      this.ctx.fill();
    }
  }

  animate() {
    if (!this.isRunning) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    if (this.currentMode === 'matrix') {
      this.renderMatrixFrame(isLight, w, h);
    } else if (this.currentMode === 'starfield') {
      this.renderStarfieldFrame(isLight, w, h);
    } else {
      this.renderParticlesFrame(isLight, w, h);
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.particleNetwork = new ParticleNetwork('particle-canvas');
  window.bgFxEngine = window.particleNetwork;
});
