/**
 * INTERACTIVE 3D PARTICLE MESH BACKGROUND (BOOSTED)
 * แคนวาสจำลองอนุภาค 3 มิติ ตอบสนองต่อตำแหน่งเมาส์และนิ้วสัมผัส
 * พร้อมระบบประหยัดพลังงาน: หยุดทำงานอัตโนมัติเมื่อซ่อนแท็บหรือเลื่อนพ้นจอ
 * รองรับ prefers-reduced-motion และปรับความหนาแน่นตามขนาดหน้าจออย่างลื่นไหล
 */

class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numParticles = 70;
    this.maxDistance = 140;
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

    this.createParticles();

    if (this.isReducedMotion) {
      this.renderSingleStaticFrame();
    } else {
      this.start();
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

    const countChanged = this.particles.length !== targetNum;
    this.numParticles = targetNum;

    if (countChanged || this.particles.length === 0) {
      this.createParticles();
    } else {
      // ปรับพิกัดอนุภาคที่อาจล้นขอบจอใหม่ โดยไม่รีเซ็ตตำแหน่งทั้งหมดให้กระตุก
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < this.particles.length; i++) {
        if (this.particles[i].x > w) this.particles[i].x = Math.random() * w;
        if (this.particles[i].y > h) this.particles[i].y = Math.random() * h;
      }
    }

    if (this.isReducedMotion) {
      this.renderSingleStaticFrame();
    }
  }

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
    this.ctx.clearRect(0, 0, w, h);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const lineColor = isLight ? 'rgba(79, 172, 254, ' : 'rgba(0, 242, 254, ';
    const maxDistSq = this.maxDistance * this.maxDistance;
    const mouseRadiusSq = this.mouse.radius * this.mouse.radius;
    const hasMouse = this.mouse.x !== null && this.mouse.y !== null;

    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      const p = this.particles[i];

      // Move particle
      p.x += p.vx;
      p.y += p.vy;

      // Bounce
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      else if (p.x > w) { p.x = w; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      else if (p.y > h) { p.y = h; p.vy *= -1; }

      // Mouse repulsion / attraction
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

      // Draw particle dot
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = isLight ? '#4facfe' : p.baseColor;
      this.ctx.fill();

      // Connect particles with lines (fast spatial bounding box filter)
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

      // Connect to mouse pointer
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

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.particleNetwork = new ParticleNetwork('particle-canvas');
});
