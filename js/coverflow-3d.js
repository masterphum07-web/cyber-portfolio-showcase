/**
 * 3D COVERFLOW PROJECT SHOWCASE ENGINE
 * พัฒนาโดย: ภูมิภัทร สว่างเวียง (Phumphat Sawangwiang)
 * 
 * นำเสนอผลงานทั้ง 14 โปรเจคในรูปแบบ 3D Coverflow ลอยในอวกาศ
 * - คำนวณระนาบ 3D Spatial Transforms (rotateY, translateZ, translateX)
 * - รองรับ Drag & Swipe ทั้งเมาส์และจอสัมผัสบนมือถือ
 * - รองรับปุ่มลูกศรคีย์บอร์ด (Left / Right) และ Mouse Wheel
 * - เงาสะท้อนกระจกนีออนบนพื้น (Neon Floor Reflection)
 * - คลิกการ์ดตรงกลางเพื่อเปิด Project Detail Modal ทันที
 */

class Coverflow3D {
  constructor(containerId = 'projects-3d-stage') {
    this.container = document.getElementById(containerId);
    this.projects = [];
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentDragX = 0;
    this.dragThreshold = 45;
    this.cardSpacing = 160; // Base horizontal spacing between cards in 3D
    this.wheelDebounce = false;

    this.init();
  }

  init() {
    if (!this.container) return;

    this.bindEvents();
  }

  setProjects(projects) {
    this.projects = Array.isArray(projects) 
      ? projects 
      : (window.PORTFOLIO_DATA?.projects || []);
    
    if (this.currentIndex >= this.projects.length || this.currentIndex < 0) {
      this.currentIndex = Math.max(0, this.projects.length - 1);
    }
    this.render(true);
  }

  render(forceRebuild = false) {
    if (!this.container) return;

    if (this.projects.length === 0) {
      this.container.innerHTML = `
        <div class="coverflow-empty-state">
          <i data-lucide="folder-search" style="width: 48px; height: 48px; color: var(--neon-cyan); margin-bottom: 12px;"></i>
          <p>ไม่พบโปรเจคที่ตรงกับเงื่อนไขการค้นหา</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // If already rendered and not forcing rebuild, just update transforms & HUD for 60 FPS smooth transitions
    const stageEl = this.container.querySelector('#coverflow-stage');
    const existingCards = this.container.querySelectorAll('.coverflow-card');
    if (!forceRebuild && stageEl && existingCards.length === this.projects.length) {
      this.updateCardTransforms();
      this.updateHUD();
      return;
    }

    const currentProject = this.projects[this.currentIndex];

    this.container.innerHTML = `
      <div class="coverflow-viewport" id="coverflow-viewport" tabindex="0" role="region" aria-label="3D Coverflow Project Carousel">
        <!-- 3D Perspective Stage -->
        <div class="coverflow-stage" id="coverflow-stage">
          ${this.projects.map((p, i) => this.renderCard(p, i)).join('')}
        </div>

        <!-- Left / Right Floating Neon Nav Arrows -->
        <button type="button" class="coverflow-nav-btn prev" id="coverflow-prev-btn" onclick="window.coverflowApp?.prev()" title="โปรเจคก่อนหน้า (←)" aria-label="โปรเจคก่อนหน้า">
          <i data-lucide="chevron-left" style="width: 28px; height: 28px;"></i>
        </button>
        <button type="button" class="coverflow-nav-btn next" id="coverflow-next-btn" onclick="window.coverflowApp?.next()" title="โปรเจคถัดไป (→)" aria-label="โปรเจคถัดไป">
          <i data-lucide="chevron-right" style="width: 28px; height: 28px;"></i>
        </button>
      </div>

      <!-- Active Project Info HUD -->
      <div class="coverflow-hud glass-card reveal" id="coverflow-hud">
        <div class="coverflow-hud-header">
          <div class="coverflow-counter-badge">
            <span class="hud-counter-cur">${this.currentIndex + 1}</span>
            <span class="hud-counter-sep">/</span>
            <span class="hud-counter-total">${this.projects.length}</span>
          </div>
          <span class="category-badge">${this.escapeHtml(currentProject.category || '')}</span>
          <span class="status-badge status-${currentProject.status || 'completed'}">
            ${currentProject.status === 'completed' ? 'เสร็จสมบูรณ์ ✅' : 'กำลังพัฒนา 🚧'}
          </span>
        </div>

        <h3 class="coverflow-hud-title">${this.escapeHtml(currentProject.title)}</h3>
        <p class="coverflow-hud-desc">${this.escapeHtml(currentProject.description_short)}</p>

        <div class="coverflow-hud-tech">
          ${(currentProject.tech_stack || []).slice(0, 5).map(t => `<span class="tech-chip">${this.escapeHtml(t)}</span>`).join('')}
        </div>

        <div class="coverflow-hud-actions">
          <button type="button" class="btn btn-primary" onclick="window.projectsApp?.openProjectModal('${currentProject.id}')">
            <i data-lucide="maximize-2" style="width: 16px; height: 16px;"></i> ดูรายละเอียดแบบเต็ม
          </button>
          ${currentProject.live_url ? `
            <a href="${currentProject.live_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              <i data-lucide="external-link" style="width: 16px; height: 16px;"></i> เปิดเว็บเดโม
            </a>
          ` : ''}
          ${currentProject.github_url ? `
            <a href="${currentProject.github_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" title="GitHub Repository">
              <i data-lucide="github" style="width: 16px; height: 16px;"></i> ซอร์สโค้ด
            </a>
          ` : ''}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.updateCardTransforms();
  }

  updateHUD() {
    if (this.projects.length === 0) return;
    const currentProject = this.projects[this.currentIndex];
    if (!currentProject) return;

    const curEl = this.container.querySelector('.hud-counter-cur');
    if (curEl) curEl.textContent = String(this.currentIndex + 1);

    const totalEl = this.container.querySelector('.hud-counter-total');
    if (totalEl) totalEl.textContent = String(this.projects.length);

    const catBadge = this.container.querySelector('.category-badge');
    if (catBadge) catBadge.textContent = currentProject.category || '';

    const statusBadge = this.container.querySelector('.status-badge');
    if (statusBadge) {
      statusBadge.className = `status-badge status-${currentProject.status || 'completed'}`;
      statusBadge.textContent = currentProject.status === 'completed' ? 'เสร็จสมบูรณ์ ✅' : 'กำลังพัฒนา 🚧';
    }

    const titleEl = this.container.querySelector('.coverflow-hud-title');
    if (titleEl) titleEl.textContent = currentProject.title || '';

    const descEl = this.container.querySelector('.coverflow-hud-desc');
    if (descEl) descEl.textContent = currentProject.description_short || '';

    const techEl = this.container.querySelector('.coverflow-hud-tech');
    if (techEl) {
      techEl.innerHTML = (currentProject.tech_stack || [])
        .slice(0, 5)
        .map(t => `<span class="tech-chip">${this.escapeHtml(t)}</span>`)
        .join('');
    }

    const actionsEl = this.container.querySelector('.coverflow-hud-actions');
    if (actionsEl) {
      actionsEl.innerHTML = `
        <button type="button" class="btn btn-primary" onclick="window.projectsApp?.openProjectModal('${currentProject.id}')">
          <i data-lucide="maximize-2" style="width: 16px; height: 16px;"></i> ดูรายละเอียดแบบเต็ม
        </button>
        ${currentProject.live_url ? `
          <a href="${currentProject.live_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <i data-lucide="external-link" style="width: 16px; height: 16px;"></i> เปิดเว็บเดโม
          </a>
        ` : ''}
        ${currentProject.github_url ? `
          <a href="${currentProject.github_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" title="GitHub Repository">
            <i data-lucide="github" style="width: 16px; height: 16px;"></i> ซอร์สโค้ด
          </a>
        ` : ''}
      `;
      if (window.lucide) window.lucide.createIcons();
    }

    // Screen reader announcement
    const announcer = document.getElementById('search-announcer');
    if (announcer) {
      announcer.textContent = `โปรเจคที่ ${this.currentIndex + 1} จาก ${this.projects.length}: ${currentProject.title}`;
    }
  }

  renderCard(project, index) {
    const thumb = project.thumbnail || project.image || 'assets/profile-phum.jpg';
    return `
      <div 
        class="coverflow-card" 
        data-index="${index}" 
        data-id="${project.id}"
        onclick="window.coverflowApp?.handleCardClick(${index}, '${project.id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.coverflowApp?.handleCardClick(${index}, '${project.id}')}"
        role="button"
        tabindex="0"
        aria-label="${this.escapeHtml(project.title)}"
      >
        <div class="coverflow-card-inner">
          <div class="coverflow-card-media">
            <img 
              src="${thumb}" 
              alt="${this.escapeHtml(project.title)}" 
              loading="lazy" 
              decoding="async" 
              class="coverflow-card-img"
              onerror="this.onerror=null; this.src='assets/profile-phum.jpg';"
            />
            <div class="coverflow-card-glow-overlay"></div>
          </div>
          <div class="coverflow-card-footer">
            <div class="coverflow-card-category">${this.escapeHtml(project.category || '')}</div>
            <div class="coverflow-card-title">${this.escapeHtml(project.title)}</div>
          </div>
        </div>
      </div>
    `;
  }

  updateCardTransforms() {
    const cards = this.container.querySelectorAll('.coverflow-card');
    if (!cards || cards.length === 0) return;

    // Detect responsive card spacing
    const isMobile = window.innerWidth <= 768;
    const spacing = isMobile ? 120 : 190;
    const centerOffset = isMobile ? 80 : 160;

    cards.forEach((card, i) => {
      const offset = i - this.currentIndex;

      if (offset === 0) {
        // Active Center Card
        card.style.transform = `translateX(0px) translateZ(100px) rotateY(0deg) scale(1.06)`;
        card.style.opacity = '1';
        card.style.zIndex = '100';
        card.classList.add('active');
        card.classList.remove('side');
        card.setAttribute('aria-current', 'true');
      } else if (offset < 0) {
        // Left Side Cards
        const dist = Math.abs(offset);
        const tx = offset * spacing - centerOffset;
        const tz = -dist * 130;
        const ry = Math.min(dist * 20 + 35, 65);
        const op = Math.max(0.2, 1 - dist * 0.25);
        card.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${Math.max(0.7, 1 - dist * 0.08)})`;
        card.style.opacity = String(op);
        card.style.zIndex = String(100 - dist);
        card.classList.remove('active');
        card.classList.add('side');
        card.removeAttribute('aria-current');
      } else {
        // Right Side Cards
        const dist = Math.abs(offset);
        const tx = offset * spacing + centerOffset;
        const tz = -dist * 130;
        const ry = -Math.min(dist * 20 + 35, 65);
        const op = Math.max(0.2, 1 - dist * 0.25);
        card.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${Math.max(0.7, 1 - dist * 0.08)})`;
        card.style.opacity = String(op);
        card.style.zIndex = String(100 - dist);
        card.classList.remove('active');
        card.classList.add('side');
        card.removeAttribute('aria-current');
      }
    });

    // Update Counter in HUD
    const curEl = this.container.querySelector('.hud-counter-cur');
    if (curEl) curEl.textContent = String(this.currentIndex + 1);
  }

  handleCardClick(index, projectId) {
    if (index === this.currentIndex) {
      // Direct click on center card -> Open Project Modal
      window.soundFx?.modalOpen?.();
      window.projectsApp?.openProjectModal(projectId);
    } else {
      // Click on side card -> Fly to that card smoothly
      this.goTo(index);
    }
  }

  goTo(index) {
    if (index < 0 || index >= this.projects.length) return;
    this.currentIndex = index;
    window.soundFx?.hover?.();
    this.updateCardTransforms();
    this.updateHUD();
  }

  prev() {
    if (this.projects.length === 0) return;
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.projects.length - 1; // Wrap around
    }
    window.soundFx?.click?.();
    this.updateCardTransforms();
    this.updateHUD();
  }

  next() {
    if (this.projects.length === 0) return;
    if (this.currentIndex < this.projects.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Wrap around
    }
    window.soundFx?.click?.();
    this.updateCardTransforms();
    this.updateHUD();
  }

  bindEvents() {
    // Keyboard navigation with input / modal isolation
    document.addEventListener('keydown', (e) => {
      if (!this.isActive()) return;
      const target = e.target;
      if (target) {
        const tag = target.tagName ? target.tagName.toUpperCase() : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) {
          return; // Do not intercept typing inside form inputs or terminal
        }
      }
      const isModalOpen = document.body.classList.contains('modal-open') || 
                          document.getElementById('project-modal')?.classList.contains('active') ||
                          document.getElementById('resume-modal')?.classList.contains('active');
      if (isModalOpen) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'Enter') {
        const activeProj = this.projects[this.currentIndex];
        if (activeProj) {
          window.projectsApp?.openProjectModal(activeProj.id);
        }
      }
    });

    // Mouse Wheel
    this.container.addEventListener('wheel', (e) => {
      if (!this.isActive()) return;
      if (this.wheelDebounce) return;
      if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 30) {
        this.wheelDebounce = true;
        if (e.deltaX > 20 || e.deltaY > 30) {
          this.next();
        } else {
          this.prev();
        }
        setTimeout(() => { this.wheelDebounce = false; }, 260);
      }
    }, { passive: true });

    // Touch & Drag Handling with Vertical Scroll Protection
    let startY = 0;
    let currentDragY = 0;

    const handleDragStart = (clientX, clientY, target) => {
      if (!this.isActive()) return;
      // Do not trigger carousel swipe if touching buttons, links, or HUD controls
      if (target && (target.closest('.coverflow-hud') || target.closest('.coverflow-nav-btn'))) {
        return;
      }
      this.isDragging = true;
      this.startX = clientX;
      this.currentDragX = clientX;
      startY = clientY;
      currentDragY = clientY;
    };

    const handleDragMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      this.currentDragX = clientX;
      currentDragY = clientY;
    };

    const handleDragEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      const deltaX = this.currentDragX - this.startX;
      const deltaY = currentDragY - startY;

      // Ignore horizontal trigger if vertical movement dominates (natural page scroll)
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }

      if (deltaX > this.dragThreshold) {
        this.prev();
      } else if (deltaX < -this.dragThreshold) {
        this.next();
      }
    };

    this.container.addEventListener('mousedown', (e) => handleDragStart(e.clientX, e.clientY, e.target));
    window.addEventListener('mousemove', (e) => handleDragMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', handleDragEnd);

    this.container.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length > 0) {
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', handleDragEnd);
    window.addEventListener('touchcancel', () => { this.isDragging = false; });

    // Responsive Resize
    window.addEventListener('resize', () => {
      if (this.isActive()) {
        this.updateCardTransforms();
      }
    });
  }

  isActive() {
    return this.container && this.container.style.display !== 'none' && this.container.offsetParent !== null;
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// Global initialization helper
window.initCoverflow3D = function() {
  if (!window.coverflowApp) {
    window.coverflowApp = new Coverflow3D();
  }
};

