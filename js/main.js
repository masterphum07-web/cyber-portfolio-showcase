/**
 * MAIN INTERACTION & APP CONTROLLER (BOOSTED)
 * ควบคุม: Preloader, Dark/Light Mode, PWA Service Worker, Web Audio SFX,
 * Keyboard Shortcuts HUD, Toast Notifications, Contact Form Auto-Draft,
 * Custom Cursor, Stats Counter, และ Scroll Animations
 */

class SoundEffectsEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('portfolio-sound-muted') !== 'false'; // ค่าเริ่มต้น Mute เพื่อไม่กวนผู้ใช้
    this.init();
  }

  init() {
    this.updateToggleButton();
    const unlock = () => {
      if (!this.isMuted) this.getAudioContext();
    };
    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
  }

  getAudioContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('portfolio-sound-muted', this.isMuted.toString());
    this.updateToggleButton();

    if (!this.isMuted) {
      this.getAudioContext();
      this.click();
      window.showToast?.('เปิดเสียงเอฟเฟกต์ Cyber Audio แล้ว 🔊', 'info', 'volume-2');
    } else {
      window.showToast?.('ปิดเสียงเอฟเฟกต์แล้ว 🔇', 'info', 'volume-x');
    }
  }

  updateToggleButton() {
    const btn = document.getElementById('sound-toggle-btn');
    if (!btn) return;
    btn.innerHTML = `<i data-lucide="${this.isMuted ? 'volume-x' : 'volume-2'}"></i>`;
    if (window.lucide) window.lucide.createIcons();
    btn.setAttribute('title', this.isMuted ? 'เปิดเสียงเอฟเฟกต์ (กด M)' : 'ปิดเสียงเอฟเฟกต์ (กด M)');
    btn.setAttribute('aria-label', this.isMuted ? 'เปิดเสียงเอฟเฟกต์' : 'ปิดเสียงเอฟเฟกต์');
    btn.classList.toggle('active', !this.isMuted);
  }

  playTone(freq, type = 'sine', duration = 0.05, gainValue = 0.04) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio synthesis errors on strict policies
    }
  }

  hover() {
    this.playTone(850, 'sine', 0.03, 0.015);
  }

  click() {
    this.playTone(600, 'triangle', 0.04, 0.035);
  }

  modalOpen() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {}
  }

  modalClose() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  success() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.18, 0.03);
      }, idx * 75);
    });
  }
}

// Global Sound Instance
window.soundFx = new SoundEffectsEngine();

/* ═══════════════════════════════════════════════════════════
   TOAST NOTIFICATION SYSTEM
   ═══════════════════════════════════════════════════════════ */
window.showToast = function(message, type = 'info', iconName = 'info', duration = 3600) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()" aria-label="ปิดแจ้งเตือน">&times;</button>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => toast.classList.add('visible'), 10);

  const timer = setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 350);
  }, duration);

  toast.addEventListener('mouseenter', () => clearTimeout(timer));
};

/* ═══════════════════════════════════════════════════════════
   APP INITIALIZATION
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThemeSwitcher();
  initPWA();
  initCustomCursor();
  initTypewriter();
  initScrollRevealAndCounters();
  initMagneticButtons();
  initRippleEffect();
  initContactFormWithDraft();
  initMobileMenu();
  initBackToTop();
  initKeyboardShortcuts();
  initSkillsRadarChart();
  initTestimonialsSwiper();
  initTechStackTooltips();
});

/* ═══════════════════════════════════════════════════════════
   1. PRELOADER (LOAD SYNCHRONIZED)
   ═══════════════════════════════════════════════════════════ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const loaderBar = document.getElementById('loader-bar');
  const loaderText = document.getElementById('loader-text');
  if (!preloader || !loaderBar) return;

  let progress = 10;
  let isPageLoaded = false;

  window.addEventListener('load', () => {
    isPageLoaded = true;
  });

  const interval = setInterval(() => {
    if (isPageLoaded) {
      progress += 20;
    } else {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress > 88) progress = 88; // รอ window.load ก่อนพุ่งถึง 100
    }

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      loaderBar.style.width = '100%';
      if (loaderText) loaderText.textContent = 'SYSTEM READY 100%';

      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.style.overflow = '';
      }, 300);
    } else {
      loaderBar.style.width = `${progress}%`;
      if (loaderText) loaderText.textContent = `INITIALIZING SYSTEM... ${progress}%`;
    }
  }, 35);
}

/* ═══════════════════════════════════════════════════════════
   2. DARK / LIGHT THEME TOGGLE
   ═══════════════════════════════════════════════════════════ */
function initThemeSwitcher() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    window.soundFx?.click();
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a1a' : '#f5f7fc');
    }
    const currentToggleBtn = document.getElementById('theme-toggle-btn');
    if (currentToggleBtn) {
      currentToggleBtn.innerHTML = `<i id="theme-icon" data-lucide="${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
      if (window.lucide) window.lucide.createIcons();
    }
    // อัปเดต canvas สีอนุภาคทันทีหากอยู่ในโหมด static frame
    if (window.particleNetwork && window.particleNetwork.isReducedMotion) {
      window.particleNetwork.renderSingleStaticFrame();
    }
    // อัปเดตธีมของ Chart.js Skill Radar
    updateSkillsRadarChartTheme(theme);
  }

  // Sound toggle button listener
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      window.soundFx.toggleMute();
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   3. PWA (SERVICE WORKER & INSTALL PROMPT)
   ═══════════════════════════════════════════════════════════ */
function initPWA() {
  // Service Worker Registration
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          reg.onupdatefound = () => {
            const installing = reg.installing;
            installing.onstatechange = () => {
              if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                window.showToast?.('มีอัปเดตเว็บไซต์เวอร์ชันใหม่! รีเฟรชเพื่อรับฟีเจอร์ล่าสุด', 'info', 'refresh-cw');
              }
            };
          };
        })
        .catch((err) => {
          console.log('SW registration skipped or failed:', err);
        });
    });
  }

  // Before Install Prompt Banner
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // แสดงปุ่ม/Toast ติดตั้งแอปถ้ายังไม่เคยติดตั้ง
    const installToast = setTimeout(() => {
      window.showToast?.(
        'ติดตั้งพอร์ตโฟลิโอนี้เป็นแอปบนอุปกรณ์ของคุณได้ทันที <button id="pwa-install-btn" class="btn btn-primary btn-sm" style="margin-left: 10px; padding: 4px 12px; font-size: 0.8rem;">ติดตั้ง</button>',
        'info',
        'download',
        8000
      );

      const installBtn = document.getElementById('pwa-install-btn');
      if (installBtn) {
        installBtn.addEventListener('click', () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choice) => {
              if (choice.outcome === 'accepted') {
                window.showToast?.('ขอบคุณที่ติดตั้งแอป!', 'success', 'check-circle');
              }
              deferredPrompt = null;
            });
          }
        });
      }
    }, 4000);
  });
}

/* ═══════════════════════════════════════════════════════════
   4. CUSTOM CURSOR
   ═══════════════════════════════════════════════════════════ */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
    if (!isMoving) {
      isMoving = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  window.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  function renderCursorRing() {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursorRing);
  }
  renderCursorRing();

  const hoverTargets = 'a, button, input, textarea, .glass-card, .filter-btn, .theme-toggle-btn, .tech-chip, .sound-toggle-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.add('active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      ring.classList.remove('active');
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   5. TYPEWRITER ANIMATION (HERO SECTION)
   ═══════════════════════════════════════════════════════════ */
let typewriterTimeout = null;

function initTypewriter() {
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
    typewriterTimeout = null;
  }

  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const roles = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.portfolio_owner && window.PORTFOLIO_DATA.portfolio_owner.roles) || [
    "Full-Stack Developer",
    "Creative Coder & 3D Web",
    "AI & Cloud Architect",
    "DevOps Specialist"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeLoop() {
    if (!target) return;
    const currentRole = roles[roleIdx] || "Full-Stack Developer";

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 45;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 105;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1900;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 380;
    }

    typewriterTimeout = setTimeout(typeLoop, typingSpeed);
  }

  typeLoop();
}

window.initTypewriter = initTypewriter;

/* ═══════════════════════════════════════════════════════════
   6. SCROLL REVEAL & STATS COUNTER
   ═══════════════════════════════════════════════════════════ */
function initScrollRevealAndCounters() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const counterElements = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        const counters = entry.target.querySelectorAll('.stat-number');
        counters.forEach(counter => animateCounter(counter));

        const bars = entry.target.querySelectorAll('.skill-bar-fill');
        bars.forEach(bar => {
          const targetWidth = bar.getAttribute('data-width') || '0%';
          bar.style.width = targetWidth;
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => observer.observe(el));

  counterElements.forEach(counter => {
    const statBox = counter.closest('.stat-box');
    if (statBox) observer.observe(statBox);
  });

  function animateCounter(counter) {
    if (counter.dataset.animated === 'true') return;
    counter.dataset.animated = 'true';

    const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
    const duration = 1600;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const easeVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(target * easeVal);
      counter.textContent = currentVal.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }
}

/* ═══════════════════════════════════════════════════════════
   7. MAGNETIC BUTTON EFFECT
   ═══════════════════════════════════════════════════════════ */
function initMagneticButtons() {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) return;

  const magneticButtons = document.querySelectorAll('.btn-magnetic');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   8. RIPPLE EFFECT
   ═══════════════════════════════════════════════════════════ */
function initRippleEffect() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

/* ═══════════════════════════════════════════════════════════
   9. CONTACT FORM WITH AUTO-DRAFT SAVING & VALIDATION
   ═══════════════════════════════════════════════════════════ */
function initContactFormWithDraft() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success-msg');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  // กู้คืนข้อมูลแบบร่าง (Draft) ถ้าผู้ใช้เคยพิมพ์ไว้
  const savedDraft = localStorage.getItem('contact-form-draft');
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      if (nameInput && draft.name) nameInput.value = draft.name;
      if (emailInput && draft.email) emailInput.value = draft.email;
      if (subjectInput && draft.subject) subjectInput.value = draft.subject;
      if (messageInput && draft.message) messageInput.value = draft.message;
    } catch {}
  }

  // บันทึก Draft อัตโนมัติทุกครั้งที่พิมพ์
  const saveDraft = () => {
    const draftData = {
      name: nameInput?.value || '',
      email: emailInput?.value || '',
      subject: subjectInput?.value || '',
      message: messageInput?.value || ''
    };
    localStorage.setItem('contact-form-draft', JSON.stringify(draftData));
  };

  [nameInput, emailInput, subjectInput, messageInput].forEach(el => {
    if (el) el.addEventListener('input', saveDraft);
  });

  // จัดการการส่งฟอร์ม
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
      window.showToast?.('กรุณาระบุชื่อของคุณ', 'error', 'alert-circle');
      nameInput.focus();
      return;
    }

    // ตรวจสอบ Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      window.showToast?.('กรุณาระบุอีเมลที่ถูกต้อง (เช่น you@example.com)', 'error', 'alert-circle');
      emailInput.focus();
      return;
    }

    if (!message || message.length < 10) {
      window.showToast?.('กรุณาระบุข้อความรายละเอียดอย่างน้อย 10 ตัวอักษร', 'error', 'alert-circle');
      messageInput.focus();
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i data-lucide="loader-2" style="animation: spin 1s linear infinite;"></i> กำลังส่งข้อความ...`;
    if (window.lucide) window.lucide.createIcons();
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      if (window.lucide) window.lucide.createIcons();

      // ล้าง Draft
      localStorage.removeItem('contact-form-draft');
      form.reset();

      // แสดง Success Alert
      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 7000);
      }

      window.showToast?.('ส่งข้อความสำเร็จ! จะติดต่อกลับโดยเร็วที่สุดครับ 🎉', 'success', 'check-circle-2');
      window.soundFx?.success();
      fireConfetti();
    }, 1000);
  });
}

function fireConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#00f2fe', '#4facfe', '#8a2be2', '#ff007f', '#00ff88']
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   10. MOBILE MENU & SCROLLSPY
   ═══════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    window.soundFx?.click();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 140;
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        if (navLink) navLink.classList.add('active');
      } else {
        if (navLink) navLink.classList.remove('active');
      }
    });
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   11. BACK TO TOP
   ═══════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.soundFx?.click();
  });
}

/* ═══════════════════════════════════════════════════════════
   12. KEYBOARD SHORTCUTS HUD & GLOBAL HOTKEYS
   ═══════════════════════════════════════════════════════════ */
function initKeyboardShortcuts() {
  const modal = document.getElementById('shortcuts-modal');
  let lastFocused = null;

  window.toggleShortcutsModal = function(forceState) {
    if (!modal) return;
    const projectModal = document.getElementById('project-modal');
    const isProjectModalOpen = projectModal && projectModal.classList.contains('open');

    const shouldOpen = typeof forceState === 'boolean' ? forceState : !modal.classList.contains('open');

    // ไม่เปิด Shortcuts HUD หาก Project Modal กำลังเปิดอยู่
    if (shouldOpen && isProjectModalOpen) return;

    if (shouldOpen) {
      lastFocused = document.activeElement;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      window.soundFx?.modalOpen();

      // Focus close button inside shortcuts modal
      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 50);
      }
    } else {
      modal.classList.remove('open');
      if (!isProjectModalOpen) {
        document.body.style.overflow = '';
      }
      window.soundFx?.modalClose();

      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }
  };

  // Focus Trap inside Shortcuts Modal
  modal?.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      const focusable = Array.from(modal.querySelectorAll(
        'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
      )).filter(el => el.offsetParent !== null || el.getClientRects().length > 0);

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!modal.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
        return;
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('keydown', (e) => {
    // ข้ามถ้ากำลังพิมพ์อยู่ใน input หรือ textarea
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const isInput = activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable;

    // กด ESC เพื่อปิด Shortcuts Modal
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      e.preventDefault();
      window.toggleShortcutsModal(false);
      return;
    }

    if (isInput) return;

    const projectModal = document.getElementById('project-modal');
    const isProjectModalOpen = projectModal && projectModal.classList.contains('open');

    // กด '?' หรือ '/' เพื่อเปิด Help / Focus Search
    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault();
      window.toggleShortcutsModal();
    } else if (e.key === '/') {
      if (isProjectModalOpen) return;
      e.preventDefault();
      const searchInput = document.getElementById('project-search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (e.key === 't' || e.key === 'T') {
      const themeBtn = document.getElementById('theme-toggle-btn');
      if (themeBtn) themeBtn.click();
    } else if (e.key === 'm' || e.key === 'M') {
      window.soundFx?.toggleMute();
    } else if (e.key === 'g' || e.key === 'G') {
      if (isProjectModalOpen) return;
      if (window.projectsApp) {
        const nextMode = window.projectsApp.currentView === 'grid' ? 'list' : 'grid';
        window.projectsApp.setViewMode(nextMode);
        window.showToast?.(`สลับมุมมองเป็น ${nextMode === 'grid' ? 'ตาราง (Grid)' : 'รายการ (List)'}`, 'info', 'layout');
      }
    }
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.toggleShortcutsModal(false);
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   13. CHART.JS: INTERACTIVE SKILL RADAR CHART (ABOUT SECTION)
   ═══════════════════════════════════════════════════════════ */
let skillsRadarChartInstance = null;

function renderRadarChartFallback(canvas, theme = null) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.clientWidth || 320;
  const height = canvas.clientHeight || 255;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 34;

  const isDark = (theme || document.documentElement.getAttribute('data-theme')) !== 'light';
  const labels = ['Frontend', 'Backend', 'Database', '3D WebGL', 'DevOps', 'AI / ML'];
  const numAxes = labels.length;
  const kritsanaData = [0.95, 0.90, 0.86, 0.82, 0.84, 0.88];
  const seniorData = [0.82, 0.80, 0.75, 0.68, 0.76, 0.74];

  ctx.clearRect(0, 0, width, height);

  // Concentric polygon grids
  const levels = [0.25, 0.5, 0.75, 1.0];
  ctx.strokeStyle = isDark ? 'rgba(0, 242, 254, 0.18)' : 'rgba(0, 180, 216, 0.2)';
  ctx.lineWidth = 1;

  levels.forEach(lvl => {
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
      const x = centerX + Math.cos(angle) * (radius * lvl);
      const y = centerY + Math.sin(angle) * (radius * lvl);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  });

  // Radial axes & labels
  ctx.font = "600 11px 'Kanit', sans-serif";
  ctx.fillStyle = isDark ? '#cbd5e1' : '#1e293b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < numAxes; i++) {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    const labelX = centerX + Math.cos(angle) * (radius + 20);
    const labelY = centerY + Math.sin(angle) * (radius + 20);
    ctx.fillText(labels[i], labelX, labelY);
  }

  // Senior benchmark polygon
  ctx.beginPath();
  for (let i = 0; i < numAxes; i++) {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (radius * seniorData[i]);
    const y = centerY + Math.sin(angle) * (radius * seniorData[i]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(138, 43, 226, 0.15)';
  ctx.fill();
  ctx.strokeStyle = '#8a2be2';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Kritsana level polygon
  ctx.beginPath();
  for (let i = 0; i < numAxes; i++) {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (radius * kritsanaData[i]);
    const y = centerY + Math.sin(angle) * (radius * kritsanaData[i]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 242, 254, 0.22)';
  ctx.fill();
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Kritsana points
  for (let i = 0; i < numAxes; i++) {
    const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (radius * kritsanaData[i]);
    const y = centerY + Math.sin(angle) * (radius * kritsanaData[i]);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ff007f';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function initSkillsRadarChart() {
  const canvas = document.getElementById('skills-radar-chart');
  if (!canvas) return;

  if (typeof Chart === 'undefined') {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (typeof Chart !== 'undefined') {
        clearInterval(timer);
        initSkillsRadarChart();
      } else if (attempts > 30) {
        clearInterval(timer);
        console.warn('[Chart.js] CDN timed out; rendering canvas radar fallback.');
        renderRadarChartFallback(canvas);
      }
    }, 100);
    return;
  }

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const angleLineColor = isDark ? 'rgba(0, 242, 254, 0.22)' : 'rgba(0, 180, 216, 0.2)';
  const labelColor = isDark ? '#cbd5e1' : '#1e293b';

  const data = {
    labels: [
      'Frontend (React/Next)',
      'Backend (Node/Go)',
      'Database (SQL/Redis)',
      '3D WebGL (Three.js)',
      'DevOps (Docker/K8s)',
      'AI / ML (Python/FastAPI)'
    ],
    datasets: [
      {
        label: 'กฤษณะ (Kritsana Level)',
        data: [95, 90, 86, 82, 84, 88],
        fill: true,
        backgroundColor: 'rgba(0, 242, 254, 0.22)',
        borderColor: '#00f2fe',
        borderWidth: 2.5,
        pointBackgroundColor: '#ff007f',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 4.5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#00f2fe',
        pointHoverBorderColor: '#ff007f'
      },
      {
        label: 'Senior Benchmark Standard',
        data: [82, 80, 75, 68, 76, 74],
        fill: true,
        backgroundColor: 'rgba(138, 43, 226, 0.12)',
        borderColor: '#8a2be2',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: '#8a2be2',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointRadius: 3.5,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#8a2be2',
        pointHoverBorderColor: '#00f2fe'
      }
    ]
  };

  const config = {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1400,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(10, 10, 26, 0.92)' : 'rgba(255, 255, 255, 0.96)',
          titleColor: '#00f2fe',
          bodyColor: isDark ? '#ffffff' : '#0f172a',
          borderColor: 'rgba(0, 242, 254, 0.4)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      },
      scales: {
        r: {
          min: 30,
          max: 100,
          ticks: {
            stepSize: 20,
            display: false,
            backdropColor: 'transparent'
          },
          grid: {
            color: gridColor,
            circular: true
          },
          angleLines: {
            color: angleLineColor,
            lineWidth: 1.2
          },
          pointLabels: {
            font: {
              family: "'Kanit', 'Inter', sans-serif",
              size: 11,
              weight: '600'
            },
            color: labelColor,
            padding: 8
          }
        }
      }
    }
  };

  if (skillsRadarChartInstance) {
    skillsRadarChartInstance.destroy();
  }

  skillsRadarChartInstance = new Chart(canvas, config);
  window.skillsRadarChart = skillsRadarChartInstance;
}

function updateSkillsRadarChartTheme(theme) {
  if (!skillsRadarChartInstance) {
    const canvas = document.getElementById('skills-radar-chart');
    if (canvas && typeof Chart === 'undefined') {
      renderRadarChartFallback(canvas, theme);
    }
    return;
  }
  const isDark = theme !== 'light';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const angleLineColor = isDark ? 'rgba(0, 242, 254, 0.22)' : 'rgba(0, 180, 216, 0.2)';
  const labelColor = isDark ? '#cbd5e1' : '#1e293b';

  skillsRadarChartInstance.options.scales.r.grid.color = gridColor;
  skillsRadarChartInstance.options.scales.r.angleLines.color = angleLineColor;
  skillsRadarChartInstance.options.scales.r.pointLabels.color = labelColor;
  skillsRadarChartInstance.options.plugins.tooltip.backgroundColor = isDark ? 'rgba(10, 10, 26, 0.92)' : 'rgba(255, 255, 255, 0.96)';
  skillsRadarChartInstance.options.plugins.tooltip.bodyColor = isDark ? '#ffffff' : '#0f172a';
  skillsRadarChartInstance.update();
}

/* ═══════════════════════════════════════════════════════════
   14. SWIPER.JS: TESTIMONIALS SLIDER
   ═══════════════════════════════════════════════════════════ */
let testimonialsSwiperInstance = null;

function initTestimonialsSwiper() {
  const container = document.querySelector('.testimonials-swiper');
  if (!container) return;

  if (typeof Swiper === 'undefined') {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (typeof Swiper !== 'undefined') {
        clearInterval(timer);
        initTestimonialsSwiper();
      } else if (attempts > 30) {
        clearInterval(timer);
        console.warn('[Swiper.js] Library timed out; static layout preserved.');
      }
    }, 100);
    return;
  }

  try {
    testimonialsSwiperInstance = new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.testimonials-pagination',
        clickable: true,
        dynamicBullets: true
      },
      navigation: {
        nextEl: '.testimonials-next',
        prevEl: '.testimonials-prev'
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24
        },
        1100: {
          slidesPerView: 3,
          spaceBetween: 24
        }
      }
    });
    window.testimonialsSwiper = testimonialsSwiperInstance;
  } catch (e) {
    console.warn('[TestimonialsSwiper] Init fallback:', e);
  }
}

/* ═══════════════════════════════════════════════════════════
   15. TIPPY.JS & POPPER.JS: TECH STACK TOOLTIPS
   ═══════════════════════════════════════════════════════════ */
function initTechStackTooltips() {
  if (typeof tippy === 'undefined') {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (typeof tippy !== 'undefined') {
        clearInterval(timer);
        initTechStackTooltips();
      } else if (attempts > 30) {
        clearInterval(timer);
      }
    }, 100);
    return;
  }

  // 1. Tooltips for Tech Cards
  tippy('#skills .tech-card', {
    theme: 'cyber',
    arrow: true,
    placement: 'top',
    interactive: true,
    allowHTML: true,
    animation: 'scale',
    delay: [80, 150],
    content(reference) {
      const tech = reference.getAttribute('data-tippy-tech') || reference.querySelector('.tech-card-name')?.textContent || 'Tech';
      const level = reference.getAttribute('data-tippy-level') || 'ความเชี่ยวชาญระดับสูง';
      const detail = reference.getAttribute('data-tippy-detail') || reference.querySelector('.tech-card-desc')?.textContent || '';
      return `
        <div class="tippy-cyber-content">
          <div class="tippy-cyber-header">
            <span class="tippy-cyber-badge">TECH INTEL</span>
            <span class="tippy-cyber-level">${level}</span>
          </div>
          <div class="tippy-cyber-title">${tech}</div>
          <div class="tippy-cyber-body">${detail}</div>
        </div>
      `;
    }
  });

  // 2. Tooltips for Marquee Items
  tippy('#skills .marquee-item', {
    theme: 'cyber-mini',
    arrow: true,
    placement: 'bottom',
    delay: [50, 100],
    content(reference) {
      return `⚡ ${reference.textContent.trim()} (เชี่ยวชาญ & ใช้งานจริง)`;
    }
  });
}
