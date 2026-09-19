/**
 * PROJECTS ENGINE & 3D INTERACTIVE CONTROLLER (BOOSTED & AUDITED)
 * จัดการการเรนเดอร์โปรเจค, ฟิลเตอร์หมวดหมู่, ค้นหาแบบเรียลไทม์ (Debounced),
 * สลับมุมมอง Grid / List View, เรียงลำดับ (Sorting: Default, Title, Date, Category),
 * ระบบ 3D Tilt & Specular Glare Physics พร้อมรองรับ Gyroscope บนมือถือ, Focus Trap Accessibility,
 * สลับดูภาพแกลเลอรี / วิดีโอเดโม (YouTube/Vimeo auto-embed), และแชร์คัดลอกลิงก์
 */

// Helper: สร้าง Data URI ของภาพตัวอย่าง SVG สำรองแบบปลอดภัย ไม่พังเมื่อมี single quote หรือตัวอักษรพิเศษ
function getSafeSvgPlaceholder(title) {
  const safeTitle = (title || 'Project Preview')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect fill="#0f1026" width="800" height="450"/><rect x="20" y="20" width="760" height="410" rx="16" fill="none" stroke="#00f2fe" stroke-width="2" stroke-dasharray="8 8"/><circle cx="400" cy="200" r="44" fill="rgba(0, 242, 254, 0.1)" stroke="#00f2fe" stroke-width="2.5"/><path d="M380 200 H420 M400 180 V220" stroke="#00f2fe" stroke-width="2.5" stroke-linecap="round"/><text fill="#00f2fe" x="50%" y="280" dominant-baseline="middle" text-anchor="middle" font-family="'Orbitron', sans-serif" font-size="20" font-weight="700" letter-spacing="2">${safeTitle}</text><text fill="#9aa5be" x="50%" y="315" dominant-baseline="middle" text-anchor="middle" font-family="'Inter', sans-serif" font-size="13">PROJECT PREVIEW</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg).replace(/'/g, '%27');
}

// Helper: แปลง URL วิดีโอทั่วไป (YouTube watch, youtu.be, shorts, Vimeo) เป็น Embed URL อัตโนมัติ
function normalizeEmbedUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  try {
    if (trimmed.includes('/embed/')) return trimmed;

    // YouTube watch URL or short URL or shorts
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    }

    // Vimeo URL
    const vimeoMatch = trimmed.match(/vimeo\.com\/([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    return trimmed;
  } catch {
    return trimmed;
  }
}

class TiltEngine {
  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.boundCards = new Set();
    this.deviceOrientationBound = false;
    this.lastGamma = 0;
    this.lastBeta = 0;

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      if (this.isReducedMotion) {
        this.resetAllCards();
      } else {
        this.bind(document);
      }
    });

    this.initDeviceOrientation();
  }

  resetAllCards() {
    this.boundCards.forEach(card => {
      if (card.vanillaTilt) {
        try { card.vanillaTilt.destroy(); } catch (e) {}
      }
      card.style.transform = '';
      card.style.removeProperty('--glare-x');
      card.style.removeProperty('--glare-y');
      card.dataset.tiltReady = 'false';
    });
    this.boundCards.clear();
  }

  initDeviceOrientation() {
    if (this.isReducedMotion || this.deviceOrientationBound) return;
    if (typeof window.DeviceOrientationEvent !== 'undefined') {
      const handleOrientation = (e) => {
        if (this.isReducedMotion) return;
        const gamma = e.gamma; // Left to right (-90 to 90)
        const beta = e.beta;   // Front to back (-180 to 180)
        if (gamma === null || beta === null) return;

        // Smooth damping
        this.lastGamma += (gamma - this.lastGamma) * 0.1;
        this.lastBeta += (beta - this.lastBeta) * 0.1;

        const tiltX = Math.max(Math.min((this.lastBeta - 45) * 0.25, 8), -8);
        const tiltY = Math.max(Math.min(this.lastGamma * 0.25, 8), -8);

        // Apply gentle tilt only to cards currently in viewport or hero
        const heroCard = document.querySelector('.hero-3d-card');
        if (heroCard && !this.isReducedMotion && !heroCard.vanillaTilt) {
          heroCard.style.transform = `perspective(1000px) rotateX(${(-tiltX).toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
        }
      };

      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      this.deviceOrientationBound = true;
    }
  }

  bind(container = document) {
    if (this.isReducedMotion) return;

    const cards = container.querySelectorAll('[data-tilt]');
    if (cards.length === 0) return;

    // Use VanillaTilt library if loaded via CDN
    if (typeof VanillaTilt !== 'undefined') {
      const unready = Array.from(cards).filter(c => c.dataset.tiltReady !== 'true');
      if (unready.length > 0) {
        // Destroy auto-initialized instances so custom settings (glare: true) apply reliably
        unready.forEach(c => {
          if (c.vanillaTilt && typeof c.vanillaTilt.destroy === 'function') {
            try { c.vanillaTilt.destroy(); } catch (e) {}
          }
        });
        VanillaTilt.init(unready, {
          max: 12,
          speed: 400,
          glare: true,
          'max-glare': 0.28,
          perspective: 1000,
          scale: 1.02,
          gyroscope: true
        });
        unready.forEach(c => {
          c.dataset.tiltReady = 'true';
          this.boundCards.add(c);
        });
      }
      // Prune disconnected cards from bound set
      this.boundCards.forEach(c => {
        if (!c.isConnected) this.boundCards.delete(c);
      });
      return;
    }

    // Native Lerp & Specular Glare Fallback
    cards.forEach(card => {
      if (card.dataset.tiltReady === 'true') return;
      card.dataset.tiltReady = 'true';
      this.boundCards.add(card);

      // เพิ่ม glare overlay element ถ้ายังไม่มี
      let glare = card.querySelector('.card-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      let rafId = null;
      let targetRotateX = 0;
      let targetRotateY = 0;
      let currentRotateX = 0;
      let currentRotateY = 0;
      let isHovered = false;

      const updateMotion = () => {
        if (!isHovered && Math.abs(currentRotateX) < 0.05 && Math.abs(currentRotateY) < 0.05) {
          currentRotateX = 0;
          currentRotateY = 0;
          card.style.transform = '';
          return;
        }

        // Smooth Lerp Damping
        currentRotateX += (targetRotateX - currentRotateX) * 0.15;
        currentRotateY += (targetRotateY - currentRotateY) * 0.15;

        card.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) translateY(${isHovered ? '-6px' : '0px'})`;
        rafId = requestAnimationFrame(updateMotion);
      };

      card.addEventListener('mouseenter', () => {
        if (this.isReducedMotion) return;
        isHovered = true;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateMotion);
      });

      card.addEventListener('mousemove', (e) => {
        if (this.isReducedMotion) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        targetRotateX = ((y - centerY) / centerY) * -11;
        targetRotateY = ((x - centerX) / centerX) * 11;

        // คำนวณพิกัดแสงสะท้อน Specular Glare
        const glareX = ((x / rect.width) * 100).toFixed(1);
        const glareY = ((y / rect.height) * 100).toFixed(1);
        card.style.setProperty('--glare-x', `${glareX}%`);
        card.style.setProperty('--glare-y', `${glareY}%`);
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRotateX = 0;
        targetRotateY = 0;
      });

      // Mobile Touch support: reset transform smoothly on touch end
      card.addEventListener('touchend', () => {
        isHovered = false;
        targetRotateX = 0;
        targetRotateY = 0;
      }, { passive: true });

      card.addEventListener('touchcancel', () => {
        isHovered = false;
        targetRotateX = 0;
        targetRotateY = 0;
      }, { passive: true });
    });
  }
}

class ProjectsManager {
  constructor() {
    this.projects = [];
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.currentSort = 'default';
    this.currentView = localStorage.getItem('portfolio-view-mode') || 'grid';
    this.activeProjectId = null;
    this.currentSlideIndex = 0;
    this.activeModalTab = 'images'; // 'images' | 'video' | 'simulator'
    this.activeSimulatorDevice = 'desktop'; // 'desktop' | 'tablet' | 'mobile'
    this.lastFocusedElement = null;
    this.searchDebounceTimer = null;

    // DOM Elements
    this.gridElement = document.getElementById('projects-grid');
    this.searchInput = document.getElementById('project-search-input');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.modalBackdrop = document.getElementById('project-modal');
    this.modalContainer = document.getElementById('project-modal-container');
    this.searchAnnouncer = document.getElementById('search-announcer');

    this.tiltEngine = new TiltEngine();
    this.init();
  }

  async init() {
    // โหลดข้อมูลโปรเจค
    if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) {
      this.projects = window.PORTFOLIO_DATA.projects;
    } else {
      try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        this.projects = data.projects || [];
      } catch (err) {
        console.warn('Fallback to empty projects array:', err);
      }
    }

    this.applyViewMode(this.currentView);
    this.updateCategoryCounts();
    this.renderProjects();
    this.setupEventListeners();
    this.checkUrlHashForProject();

    // บันทึก engine เข้า window เพื่อเรียกใช้งานภายนอกได้
    window.tiltEngine = this.tiltEngine;
    this.tiltEngine.bind(document);
  }

  // อัปเดตตัวเลขจำนวนโปรเจคบนปุ่ม Filter
  updateCategoryCounts() {
    const counts = { all: this.projects.length };
    this.projects.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    this.filterButtons.forEach(btn => {
      const cat = btn.getAttribute('data-category');
      const countSpan = btn.querySelector('.filter-count');
      if (countSpan) {
        countSpan.textContent = counts[cat] || 0;
      }
    });
  }

  // กรองและเรียงลำดับโปรเจค
  getFilteredProjects() {
    const query = this.searchQuery.trim().toLowerCase();

    let list = this.projects.filter(project => {
      const matchCategory = (this.currentCategory === 'all') || (project.category === this.currentCategory);
      const matchSearch = !query || 
        project.title.toLowerCase().includes(query) ||
        project.description_short.toLowerCase().includes(query) ||
        project.description_full?.toLowerCase().includes(query) ||
        (project.tech_stack && project.tech_stack.some(t => t.toLowerCase().includes(query))) ||
        (project.features && project.features.some(f => f.toLowerCase().includes(query)));

      return matchCategory && matchSearch;
    });

    // เรียงลำดับ
    if (this.currentSort === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }));
    } else if (this.currentSort === 'category') {
      list.sort((a, b) => {
        const catCompare = a.category.localeCompare(b.category, undefined, { numeric: true, sensitivity: 'base' });
        return catCompare !== 0 ? catCompare : a.id - b.id;
      });
    } else if (this.currentSort === 'date') {
      list.sort((a, b) => {
        const dateA = a.end_date || a.start_date || '';
        const dateB = b.end_date || b.start_date || '';
        return dateB.localeCompare(dateA);
      });
    }

    return list;
  }

  // เรนเดอร์การ์ดโปรเจค
  renderProjects() {
    if (!this.gridElement) return;

    // Clean up existing VanillaTilt instances before re-rendering cards to prevent window event listener leaks
    const oldTiltCards = this.gridElement.querySelectorAll('[data-tilt]');
    oldTiltCards.forEach(c => {
      if (c.vanillaTilt && typeof c.vanillaTilt.destroy === 'function') {
        try { c.vanillaTilt.destroy(); } catch (e) {}
      }
      this.tiltEngine.boundCards.delete(c);
    });

    const filtered = this.getFilteredProjects();

    // แจ้งเตือน Screen Reader
    if (this.searchAnnouncer) {
      this.searchAnnouncer.textContent = `พบ ${filtered.length} โปรเจคจากทั้งหมด ${this.projects.length}`;
    }

    if (filtered.length === 0) {
      this.gridElement.innerHTML = `
        <div class="no-projects-found">
          <div class="empty-icon-ring">
            <i data-lucide="folder-search" style="width: 52px; height: 52px; stroke-width: 1.5; color: var(--neon-cyan);"></i>
          </div>
          <h3 style="margin-top: 18px; font-size: 1.4rem;">ไม่พบโปรเจคที่ตรงกับ "${this.escapeHtml(this.searchQuery)}"</h3>
          <p style="margin-top: 6px; color: var(--text-muted);">ลองค้นหาด้วยคำค้นอื่น หรือกดปุ่มรีเซ็ตเพื่อแสดงผลทั้งหมด</p>
          <button class="btn btn-secondary btn-sm" style="margin-top: 20px;" onclick="window.projectsApp.resetFilters()">
            <i data-lucide="rotate-ccw" style="width: 15px; height: 15px;"></i> ล้างตัวกรองทั้งหมด
          </button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    this.filteredProjects = filtered;

    this.gridElement.innerHTML = filtered.map(p => this.createProjectCardHTML(p)).join('');

    // Re-initialize Lucide Icons & 3D Tilt Engine
    if (window.lucide) window.lucide.createIcons();
    this.tiltEngine.bind(this.gridElement);

    // Sync with 3D Coverflow stage if active or initialized
    if (window.coverflowApp) {
      window.coverflowApp.setProjects(filtered);
    }
  }

  // HTML การ์ดโปรเจคแบบ 3D
  createProjectCardHTML(project) {
    const statusMap = {
      completed: { label: 'เสร็จสมบูรณ์ ✅', class: 'status-completed' },
      in_progress: { label: 'กำลังพัฒนา 🚧', class: 'status-in_progress' },
      archived: { label: 'Archived 📦', class: 'status-archived' }
    };
    const status = statusMap[project.status] || { label: project.status, class: '' };
    const placeholderUrl = getSafeSvgPlaceholder(project.title);

    return `
      <article class="glass-card project-card" data-project-id="${project.id}" data-tilt tabindex="0" role="article" aria-label="${this.escapeHtml(project.title)}">
        <div class="project-card-thumb-wrapper">
          <img 
            src="${project.thumbnail || project.image || placeholderUrl}" 
            alt="${this.escapeHtml(project.title)}" 
            class="project-card-thumb" 
            loading="lazy"
            decoding="async"
            data-fallback="${placeholderUrl}"
            onerror="this.onerror=null; if(this.dataset.fallback){ this.src=this.dataset.fallback; }"
          />
          <div class="project-card-thumb-overlay"></div>
          <div class="project-card-badges">
            <span class="category-badge">${project.category}</span>
            <span class="status-badge ${status.class}">${status.label}</span>
          </div>
        </div>

        <div class="project-card-body">
          <h3 class="project-card-title">${this.escapeHtml(project.title)}</h3>
          <p class="project-card-desc">${this.escapeHtml(project.description_short)}</p>

          <div class="project-card-tech-stack" aria-label="เทคโนโลยีที่ใช้">
            ${(project.tech_stack || []).slice(0, 4).map(t => `
              <button type="button" class="tech-chip tech-filter-click" data-tech="${this.escapeHtml(t)}" title="คลิกเพื่อกรองด้วย ${this.escapeHtml(t)}">
                ${this.escapeHtml(t)}
              </button>
            `).join('')}
            ${project.tech_stack && project.tech_stack.length > 4 ? `
              <span class="tech-chip tech-chip-more">+${project.tech_stack.length - 4}</span>
            ` : ''}
          </div>

          <div class="project-card-footer">
            <span class="project-card-author">
              <i data-lucide="user" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"></i>
              ${this.escapeHtml(project.author || 'ผู้พัฒนา')}
            </span>
            <div class="project-card-btns">
              <button class="btn btn-secondary btn-sm btn-view-modal" data-project-id="${project.id}" aria-label="ดูรายละเอียด ${this.escapeHtml(project.title)}">
                <i data-lucide="eye" style="width: 14px; height: 14px;"></i> รายละเอียด
              </button>
              ${project.live_url ? `
                <a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" title="ทดลองใช้งาน (Live Demo)" aria-label="Live Demo ของ ${this.escapeHtml(project.title)}">
                  <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // ตั้งค่า Event Listeners ทั้งหมด
  setupEventListeners() {
    // Filter Category Buttons
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        this.currentCategory = btn.getAttribute('data-category');
        window.soundFx?.click();
        this.renderProjects();
      });
    });

    // Search Input พร้อม Debounce 150ms
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchDebounceTimer);
        this.searchDebounceTimer = setTimeout(() => {
          this.searchQuery = e.target.value;
          this.renderProjects();
        }, 150);
      });
    }

    // Modal Close Backdrop Click
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.modalBackdrop) {
          this.closeModal();
        }
      });
    }

    // Modal Accessibility: Keyboard ESC & Focus Trap & Arrows
    window.addEventListener('keydown', (e) => {
      if (this.modalBackdrop && this.modalBackdrop.classList.contains('open')) {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.closeModal();
          return;
        }

        if (this.activeModalTab === 'images') {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.prevSlide();
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.nextSlide();
          }
        }

        // Focus Trap
        if (e.key === 'Tab') {
          this.handleFocusTrap(e);
        }
      }
    });

    // Delegated Click on Projects Grid (Card click, Tech chip click, Modal button)
    if (this.gridElement) {
      this.gridElement.addEventListener('click', (e) => {
        // 1. Tech chip click
        const techBtn = e.target.closest('.tech-filter-click');
        if (techBtn) {
          e.stopPropagation();
          const tech = techBtn.getAttribute('data-tech');
          if (tech) this.filterByTech(tech);
          return;
        }

        // 2. Avoid hijacking external link clicks
        if (e.target.closest('a')) {
          return;
        }

        // 3. Card or Detail button click
        const card = e.target.closest('.project-card');
        if (card) {
          const id = parseInt(card.getAttribute('data-project-id'), 10);
          if (id) this.openProjectModal(id);
        }
      });

      // Card Keyboard Support (Enter / Space opens modal)
      this.gridElement.addEventListener('keydown', (e) => {
        const card = e.target.closest('.project-card');
        if (card && (e.key === 'Enter' || e.key === ' ') && e.target === card) {
          e.preventDefault();
          const id = parseInt(card.getAttribute('data-project-id'), 10);
          if (id) this.openProjectModal(id);
        }
      });
    }

    // Popstate: รองรับ Back / Forward ของเบราว์เซอร์อย่างแม่นยำ
    window.addEventListener('popstate', () => {
      this.checkUrlHashForProject(true);
    });
  }

  // จัดการ Focus Trap ให้ Tab วนอยู่เฉพาะใน Modal โดยนับเฉพาะ Element ที่มองเห็นจริง
  handleFocusTrap(e) {
    if (!this.modalContainer) return;
    const focusable = Array.from(this.modalContainer.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(el => el.offsetParent !== null || el.getClientRects().length > 0);

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!this.modalContainer.contains(document.activeElement)) {
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

  // กรองโปรเจคด้วยการคลิก Tag เทคโนโลยี
  filterByTech(tech) {
    this.closeModal();
    this.currentCategory = 'all';
    this.searchQuery = tech;
    if (this.searchInput) {
      this.searchInput.value = tech;
    }
    this.filterButtons.forEach(b => {
      const isAll = b.getAttribute('data-category') === 'all';
      b.classList.toggle('active', isAll);
      b.setAttribute('aria-pressed', isAll ? 'true' : 'false');
    });
    this.renderProjects();

    // Scroll to projects section smoothly
    const section = document.getElementById('projects');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }

    window.showToast?.(`กำลังแสดงผลงานที่ใช้เทคโนโลยี "${tech}"`, 'info', 'filter');
  }

  // สลับมุมมอง Grid / List View
  setViewMode(mode) {
    this.currentView = mode;
    localStorage.setItem('portfolio-view-mode', mode);
    this.applyViewMode(mode);
    window.soundFx?.click();
  }

  applyViewMode(mode) {
    if (!this.gridElement) return;
    const stage3d = document.getElementById('projects-3d-stage');
    const gridBtn = document.getElementById('view-grid-btn');
    const listBtn = document.getElementById('view-list-btn');
    const view3dBtn = document.getElementById('view-3d-btn');

    if (mode === '3d') {
      this.gridElement.style.display = 'none';
      if (stage3d) {
        stage3d.style.display = 'block';
        if (!window.coverflowApp) {
          window.initCoverflow3D?.();
        }
        window.coverflowApp?.setProjects(this.filteredProjects || this.getFilteredProjects());
      }
    } else {
      if (stage3d) stage3d.style.display = 'none';
      this.gridElement.style.display = '';
      if (mode === 'list') {
        this.gridElement.classList.add('list-view');
      } else {
        this.gridElement.classList.remove('list-view');
      }
    }

    if (gridBtn) gridBtn.classList.toggle('active', mode === 'grid');
    if (listBtn) listBtn.classList.toggle('active', mode === 'list');
    if (view3dBtn) view3dBtn.classList.toggle('active', mode === '3d');
  }

  // เรียงลำดับโปรเจค
  setSort(sortType) {
    this.currentSort = sortType;
    this.renderProjects();
  }

  resetFilters() {
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.currentSort = 'default';
    if (this.searchInput) this.searchInput.value = '';
    this.filterButtons.forEach(b => {
      const isAll = b.getAttribute('data-category') === 'all';
      b.classList.toggle('active', isAll);
      b.setAttribute('aria-pressed', isAll ? 'true' : 'false');
    });
    this.renderProjects();
    window.showToast?.('ล้างตัวกรองและแสดงโปรเจคทั้งหมดแล้ว', 'info', 'rotate-ccw');
  }

  // เปิด Project Modal
  openProjectModal(projectId, fromHistory = false) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project || !this.modalBackdrop || !this.modalContainer) return;

    // บันทึกตำแหน่งโฟกัสก่อนหน้า เพื่อคืนค่าเมื่อปิด
    this.lastFocusedElement = document.activeElement;
    this.activeProjectId = projectId;
    this.currentSlideIndex = 0;
    this.activeModalTab = 'images';

    const currentIndex = this.projects.findIndex(p => p.id === projectId);
    const hasMultiple = this.projects.length > 1;
    const prevProject = hasMultiple ? (currentIndex > 0 ? this.projects[currentIndex - 1] : this.projects[this.projects.length - 1]) : null;
    const nextProject = hasMultiple ? (currentIndex < this.projects.length - 1 ? this.projects[currentIndex + 1] : this.projects[0]) : null;

    const statusMap = {
      completed: { label: 'เสร็จสมบูรณ์ ✅', class: 'status-completed' },
      in_progress: { label: 'กำลังพัฒนา 🚧', class: 'status-in_progress' },
      archived: { label: 'Archived 📦', class: 'status-archived' }
    };
    const status = statusMap[project.status] || { label: project.status, class: '' };
    const screenshots = (project.screenshots && project.screenshots.length > 0) ? project.screenshots : ((project.gallery && project.gallery.length > 0) ? project.gallery : [project.thumbnail || project.image || '']);
    const placeholderUrl = getSafeSvgPlaceholder(project.title);
    const embedVideoUrl = normalizeEmbedUrl(project.video_url);

    this.modalContainer.innerHTML = `
      <button class="modal-close-btn" onclick="window.projectsApp.closeModal()" title="ปิดหน้าต่าง (ESC)" aria-label="ปิดหน้าต่างรายละเอียด">
        <i data-lucide="x" style="width: 22px; height: 22px;"></i>
      </button>

      <!-- Modal Media Section (Carousel, Video Player, or Device Simulator) -->
      <div class="modal-media-container">
        <!-- Media Type Selector Switch (Real Gallery & Video Demo) -->
        <div class="modal-media-tabs">
          <button type="button" class="modal-tab-btn ${this.activeModalTab === 'images' ? 'active' : ''}" id="tab-images-btn" onclick="window.projectsApp.switchModalMedia('images')">
            <i data-lucide="image" style="width: 14px; height: 14px;"></i> แกลเลอรีภาพจริง (${screenshots.length})
          </button>
          ${embedVideoUrl ? `
            <button type="button" class="modal-tab-btn ${this.activeModalTab === 'video' ? 'active' : ''}" id="tab-video-btn" onclick="window.projectsApp.switchModalMedia('video')">
              <i data-lucide="play-circle" style="width: 14px; height: 14px;"></i> วิดีโอเดโม (Video)
            </button>
          ` : ''}
        </div>

        <!-- Carousel View with Swiper.js & Fallback -->
        <div class="modal-carousel-wrapper" id="modal-carousel-wrapper" style="display: ${this.activeModalTab === 'images' ? 'block' : 'none'};">
          <div class="swiper modal-swiper" id="modal-swiper">
            <div class="swiper-wrapper">
              ${screenshots.map((s, i) => `
                <div class="swiper-slide">
                  <img 
                    id="${i === 0 ? 'modal-carousel-img' : ''}"
                    src="${s}" 
                    alt="${this.escapeHtml(project.title)} (ภาพที่ ${i + 1})" 
                    class="carousel-slide-img" 
                    loading="lazy"
                    data-fallback="${placeholderUrl}"
                    onerror="this.onerror=null; if(this.dataset.fallback){ this.src=this.dataset.fallback; }"
                  />
                </div>
              `).join('')}
            </div>
            
            ${screenshots.length > 1 ? `
              <div class="swiper-button-prev modal-swiper-prev" aria-label="ภาพก่อนหน้า"></div>
              <div class="swiper-button-next modal-swiper-next" aria-label="ภาพถัดไป"></div>
              <div class="swiper-pagination modal-swiper-pagination"></div>
              <div class="carousel-dots" id="modal-carousel-dots" role="tablist" style="display: none;">
                ${screenshots.map((_, i) => `
                  <button type="button" role="tab" class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="window.projectsApp.goToSlide(${i})" aria-label="สไลด์ที่ ${i + 1}"></button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Video Player View -->
        ${embedVideoUrl ? `
          <div class="modal-video-wrapper" id="modal-video-wrapper" style="display: ${this.activeModalTab === 'video' ? 'block' : 'none'};">
            <iframe 
              id="modal-video-iframe"
              src="${this.activeModalTab === 'video' ? embedVideoUrl : ''}" 
              data-video-src="${embedVideoUrl}"
              title="${this.escapeHtml(project.title)} Video Demo" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen
            ></iframe>
          </div>
        ` : ''}
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <div class="modal-header-meta">
          <span class="category-badge">${project.category}</span>
          <span class="status-badge ${status.class}">${status.label}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">
            <i data-lucide="calendar" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"></i>
            ${project.start_date || '-'} ถึง ${project.end_date || '-'}
          </span>
          <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: auto;">
            <i data-lucide="user-check" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"></i>
            ${this.escapeHtml(project.author || 'ภูมิภัทร สว่างเวียง')}
          </span>
        </div>

        <h2 class="modal-title" id="modal-project-title">${this.escapeHtml(project.title)}</h2>
        <p class="modal-desc-full">${this.escapeHtml(project.description_full || project.description_short)}</p>

        <!-- Features List -->
        ${project.features && project.features.length > 0 ? `
          <h4 class="modal-section-subtitle">
            <i data-lucide="sparkles" style="width: 18px; height: 18px;"></i> ฟีเจอร์หลัก (Key Features)
          </h4>
          <ul class="modal-features-list">
            ${project.features.map(f => `
              <li class="modal-feature-item">
                <i data-lucide="check-circle-2" class="feature-check-icon" style="width: 18px; height: 18px;"></i>
                <span>${this.escapeHtml(f)}</span>
              </li>
            `).join('')}
          </ul>
        ` : ''}

        <!-- Tech Stack Used (Clickable Filters) -->
        <h4 class="modal-section-subtitle">
          <i data-lucide="layers" style="width: 18px; height: 18px;"></i> เทคโนโลยีและเครื่องมือ (Tech Stack - คลิกเพื่อกรอง)
        </h4>
        <div class="modal-tech-stack">
          ${(project.tech_stack || []).map(tech => `
            <button type="button" class="modal-tech-pill" data-tech="${this.escapeHtml(tech)}" title="ค้นหาโปรเจคที่ใช้ ${this.escapeHtml(tech)}">
              <i data-lucide="code" style="width: 14px; height: 14px;"></i>
              ${this.escapeHtml(tech)}
            </button>
          `).join('')}
        </div>

        <!-- System Architecture -->
        ${project.architecture ? `
          <h4 class="modal-section-subtitle">
            <i data-lucide="cpu" style="width: 18px; height: 18px;"></i> สถาปัตยกรรมระบบ (Architecture)
          </h4>
          <div class="modal-architecture-box">
            <i data-lucide="git-merge" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; color: var(--neon-purple); margin-right: 8px;"></i>
            ${this.escapeHtml(project.architecture)}
          </div>
        ` : ''}

        <!-- Action Buttons Bar -->
        <div class="modal-actions-bar">
          ${project.live_url ? `
            <a href="${project.live_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              <i data-lucide="rocket" style="width: 18px; height: 18px;"></i> ทดลองใช้งาน (Live Demo)
            </a>
          ` : ''}

          ${project.github_url ? `
            <a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              <i data-lucide="github" style="width: 18px; height: 18px;"></i> ดูโค้ดบน GitHub
            </a>
          ` : ''}

          ${project.docs_url ? `
            <a href="${project.docs_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              <i data-lucide="file-text" style="width: 18px; height: 18px;"></i> ดูเอกสาร (Docs)
            </a>
          ` : ''}

          <button class="btn btn-secondary" onclick="window.projectsApp.copyProjectShareLink(${project.id})" title="คัดลอกลิงก์โปรเจค">
            <i data-lucide="share-2" style="width: 18px; height: 18px;"></i> แชร์โปรเจค
          </button>
        </div>

        <!-- Project Prev / Next Navigation -->
        ${hasMultiple && prevProject && nextProject ? `
          <div class="modal-nav-bar">
            <button class="modal-nav-btn prev-btn" onclick="window.projectsApp.openProjectModal(${prevProject.id})" aria-label="ไปที่โปรเจคก่อนหน้า: ${this.escapeHtml(prevProject.title)}">
              <i data-lucide="arrow-left" style="width: 18px; height: 18px;"></i>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">โปรเจคก่อนหน้า</div>
                <div style="font-weight: 700; color: var(--text-main);">${this.escapeHtml(prevProject.title)}</div>
              </div>
            </button>

            <button class="modal-nav-btn next-btn" onclick="window.projectsApp.openProjectModal(${nextProject.id})" aria-label="ไปที่โปรเจคถัดไป: ${this.escapeHtml(nextProject.title)}">
              <div style="text-align: right;">
                <div style="font-size: 0.75rem; color: var(--text-muted);">โปรเจคถัดไป</div>
                <div style="font-weight: 700; color: var(--text-main);">${this.escapeHtml(nextProject.title)}</div>
              </div>
              <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
        ` : ''}
      </div>
    `;

    // Delegated click for tech pills inside modal
    const techStackContainer = this.modalContainer.querySelector('.modal-tech-stack');
    if (techStackContainer) {
      techStackContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.modal-tech-pill');
        if (pill) {
          const tech = pill.getAttribute('data-tech');
          if (tech) this.filterByTech(tech);
        }
      });
    }

    // Re-initialize Lucide Icons inside modal
    if (window.lucide) window.lucide.createIcons();

    // เปิด Modal และเล่นเสียง
    this.modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    window.soundFx?.modalOpen();

    // Initialize Swiper on Modal Carousel if available
    if (typeof Swiper !== 'undefined' && screenshots.length > 1) {
      if (this.modalSwiper) {
        try { this.modalSwiper.destroy(true, true); } catch (e) {}
        this.modalSwiper = null;
      }
      setTimeout(() => {
        try {
          this.modalSwiper = new Swiper('#modal-swiper', {
            slidesPerView: 1,
            spaceBetween: 16,
            loop: screenshots.length > 1,
            observer: true,
            observeParents: true,
            navigation: {
              nextEl: '.modal-swiper-next',
              prevEl: '.modal-swiper-prev'
            },
            pagination: {
              el: '.modal-swiper-pagination',
              clickable: true
            },
            keyboard: false,
            on: {
              slideChange: () => {
                window.soundFx?.hover?.();
              }
            }
          });
        } catch (e) {
          console.warn('[ProjectsApp] Swiper init fallback:', e);
        }
      }, 40);
    } else if (screenshots.length > 1) {
      // Swiper not loaded fallback: attach click handlers to navigation buttons
      const prevBtn = this.modalContainer.querySelector('.modal-swiper-prev');
      const nextBtn = this.modalContainer.querySelector('.modal-swiper-next');
      if (prevBtn) prevBtn.onclick = () => this.prevSlide();
      if (nextBtn) nextBtn.onclick = () => this.nextSlide();
      const dots = this.modalContainer.querySelector('#modal-carousel-dots');
      if (dots) dots.style.display = 'flex';
      this.currentSlideIndex = 0;
      this.updateCarouselView(screenshots);
    }

    // Focus close button สำหรับ Accessibility
    const closeBtn = this.modalContainer.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();

    // อัปเดต URL Hash เฉพาะเมื่อไม่ได้มาจากการกด Back/Forward ของ browser
    if (!fromHistory) {
      history.pushState({ modalOpen: true, projectId: project.id }, '', `#project-${project.id}`);
    }
  }

  // สลับแท็บมีเดียระหว่าง Images และ Video
  switchModalMedia(tab) {
    this.activeModalTab = tab;
    const project = this.projects.find(p => p.id === this.activeProjectId);
    if (!project) return;

    const imgWrapper = document.getElementById('modal-carousel-wrapper');
    const vidWrapper = document.getElementById('modal-video-wrapper');
    const vidIframe = document.getElementById('modal-video-iframe');
    const tabImgBtn = document.getElementById('tab-images-btn');
    const tabVidBtn = document.getElementById('tab-video-btn');

    if (tabImgBtn) tabImgBtn.classList.toggle('active', tab === 'images');
    if (tabVidBtn) tabVidBtn.classList.toggle('active', tab === 'video');

    if (imgWrapper) imgWrapper.style.display = tab === 'images' ? 'block' : 'none';
    if (vidWrapper) vidWrapper.style.display = tab === 'video' ? 'block' : 'none';

    if (tab === 'video') {
      if (vidIframe) {
        const embedUrl = vidIframe.getAttribute('data-video-src') || normalizeEmbedUrl(project.video_url);
        if (embedUrl) vidIframe.src = embedUrl;
      }
    } else {
      if (vidIframe) vidIframe.src = '';
    }

    if (window.lucide) window.lucide.createIcons();
    window.soundFx?.click();
  }

  // คัดลอกลิงก์แชร์โปรเจค
  copyProjectShareLink(projectId) {
    const url = `${window.location.origin}${window.location.pathname}#project-${projectId}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        window.showToast?.('คัดลอกลิงก์โปรเจคเรียบร้อยแล้ว!', 'success', 'check-check');
        window.soundFx?.success();
      }).catch(() => {
        this.fallbackCopyText(url);
      });
    } else {
      this.fallbackCopyText(url);
    }
  }

  fallbackCopyText(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    window.showToast?.('คัดลอกลิงก์โปรเจคเรียบร้อยแล้ว!', 'success', 'check-check');
    window.soundFx?.success();
  }

  // ปิด Modal
  closeModal() {
    if (!this.modalBackdrop || !this.modalBackdrop.classList.contains('open')) return;
    this.modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    window.soundFx?.modalClose();

    // ล้างและทำลาย Swiper instance
    if (this.modalSwiper) {
      try { this.modalSwiper.destroy(true, true); } catch (e) {}
      this.modalSwiper = null;
    }

    // ล้าง iframe วิดีโอเพื่อหยุดเสียงและประหยัด RAM
    const vidIframe = document.getElementById('modal-video-iframe');
    if (vidIframe) vidIframe.src = '';

    // ล้าง hash โดยใช้ replaceState เพื่อไม่ให้ประวัติ browser เกิด loop
    history.replaceState('', document.title, window.location.pathname + window.location.search);

    // คืนค่า Focus ไปที่ element ล่าสุด
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }
  }

  // สไลด์ Carousel
  nextSlide() {
    if (this.modalSwiper) {
      this.modalSwiper.slideNext();
      return;
    }
    const project = this.projects.find(p => p.id === this.activeProjectId);
    if (!project || !project.screenshots || project.screenshots.length <= 1) return;
    this.currentSlideIndex = (this.currentSlideIndex + 1) % project.screenshots.length;
    this.updateCarouselView(project.screenshots);
    window.soundFx?.hover();
  }

  prevSlide() {
    if (this.modalSwiper) {
      this.modalSwiper.slidePrev();
      return;
    }
    const project = this.projects.find(p => p.id === this.activeProjectId);
    if (!project || !project.screenshots || project.screenshots.length <= 1) return;
    this.currentSlideIndex = (this.currentSlideIndex - 1 + project.screenshots.length) % project.screenshots.length;
    this.updateCarouselView(project.screenshots);
    window.soundFx?.hover();
  }

  goToSlide(index) {
    if (this.modalSwiper) {
      if (typeof this.modalSwiper.slideToLoop === 'function') {
        this.modalSwiper.slideToLoop(index);
      } else {
        this.modalSwiper.slideTo(index);
      }
      return;
    }
    const project = this.projects.find(p => p.id === this.activeProjectId);
    if (!project || !project.screenshots) return;
    this.currentSlideIndex = index;
    this.updateCarouselView(project.screenshots);
    window.soundFx?.hover();
  }

  updateCarouselView(screenshots) {
    const slides = this.modalContainer ? this.modalContainer.querySelectorAll('#modal-swiper .swiper-slide') : [];
    if (slides.length > 0) {
      slides.forEach((slide, idx) => {
        slide.style.display = (idx === this.currentSlideIndex) ? 'flex' : 'none';
      });
    } else {
      const imgElement = document.getElementById('modal-carousel-img');
      const targetSrc = screenshots[this.currentSlideIndex];
      if (imgElement && targetSrc) {
        imgElement.style.opacity = '0';
        const capturedProjectId = this.activeProjectId;
        setTimeout(() => {
          if (this.activeProjectId === capturedProjectId && imgElement) {
            imgElement.src = targetSrc;
            imgElement.style.opacity = '1';
          }
        }, 150);
      }
    }
    const dotsContainer = document.getElementById('modal-carousel-dots');
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentSlideIndex);
      });
    }
  }

  // ตรวจสอบ URL Hash เพื่อเปิด Modal อัตโนมัติ (เช่น #project-1)
  checkUrlHashForProject(fromPopState = false) {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#project-')) {
      const id = parseInt(hash.replace('#project-', ''), 10);
      if (!isNaN(id)) {
        setTimeout(() => this.openProjectModal(id, fromPopState), 200);
      }
    } else if (this.modalBackdrop && this.modalBackdrop.classList.contains('open')) {
      this.closeModal();
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// ผูกเข้ากับ window
document.addEventListener('DOMContentLoaded', () => {
  window.projectsApp = new ProjectsManager();
});
