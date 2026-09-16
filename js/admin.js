/**
 * CYBER PORTFOLIO ADMIN BACKOFFICE & IN-PLACE CMS ENGINE
 * 
 * Provides:
 * 1. Admin Authentication & Floating Cyber Control Bar
 * 2. Complete Project CRUD (Add, Edit, Delete with Instant Live Re-render)
 * 3. Profile & Bio Editor (Name, Title, Typewriter Roles, Bio, Avatar, Contact, Stats)
 * 4. Live In-Place Text Editing (contenteditable on any page text with neon highlights)
 * 5. Data Persistence in localStorage with Export/Import JSON & Reset to Default
 */

class AdminBackofficeCMS {
  constructor() {
    this.defaultPassword = 'admin123';
    this.isLoggedIn = false;
    this.isLiveEditActive = false;
    this.textOverrides = {};
    this.activeEditProjectId = null;
    this.debounceSaveTimer = null;

    this.init();
  }

  init() {
    // 1. Restore persistent login state
    try {
      this.isLoggedIn = localStorage.getItem('portfolio_admin_logged_in') === 'true';
      this.isLiveEditActive = localStorage.getItem('portfolio_live_edit_active') === 'true';
      const savedOverrides = localStorage.getItem('portfolio_text_overrides');
      if (savedOverrides) {
        this.textOverrides = JSON.parse(savedOverrides);
      }
    } catch (e) {
      console.warn('[AdminCMS] LocalStorage read warning:', e);
    }

    // 2. Setup Event Listeners & Shortcuts
    this.setupShortcuts();
    this.setupNavbarButton();
    this.setupLoginModal();
    this.setupProjectsManager();
    this.setupProfileEditor();
    this.setupExportImport();

    // 3. Apply saved customizations to DOM
    this.applyProfileToDOM();
    this.applyTextOverridesToDOM();

    // 4. Update UI State if already logged in
    if (this.isLoggedIn) {
      this.showControlBar();
      if (this.isLiveEditActive) {
        this.enableLiveEditMode(false);
      }
    }

    // 5. Check URL hash (#admin)
    if (window.location.hash === '#admin') {
      if (!this.isLoggedIn) {
        this.openLoginModal();
      } else {
        this.showControlBar();
      }
    }

    // 6. Setup In-Place Click & Input Handlers
    this.setupInPlaceEditingListeners();
  }

  /* ═══════════════════════════════════════════════════════════
     AUTHENTICATION & ACCESS
     ═══════════════════════════════════════════════════════════ */
  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Shortcut: Alt + A to toggle admin login / bar
      if (e.altKey && (e.key === 'a' || e.key === 'A' || e.code === 'KeyA')) {
        e.preventDefault();
        if (this.isLoggedIn) {
          this.toggleControlBarVisibility();
        } else {
          this.openLoginModal();
        }
      }
    });

    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#admin') {
        if (!this.isLoggedIn) this.openLoginModal();
      }
    });
  }

  setupNavbarButton() {
    const navBtn = document.getElementById('admin-login-btn');
    if (navBtn) {
      navBtn.addEventListener('click', () => {
        window.soundFx?.click?.();
        if (this.isLoggedIn) {
          this.toggleControlBarVisibility();
        } else {
          this.openLoginModal();
        }
      });
    }
  }

  setupLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    const form = document.getElementById('admin-login-form');
    const closeBtn = document.getElementById('admin-login-close');
    const toggleEye = document.getElementById('admin-pass-toggle');
    const passInput = document.getElementById('admin-password-input');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeLoginModal());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeLoginModal();
      });
    }

    if (toggleEye && passInput) {
      toggleEye.addEventListener('click', () => {
        const type = passInput.type === 'password' ? 'text' : 'password';
        passInput.type = type;
        toggleEye.innerHTML = `<i data-lucide="${type === 'password' ? 'eye' : 'eye-off'}"></i>`;
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = passInput ? passInput.value.trim() : '';
        this.attemptLogin(password);
      });
    }
  }

  openLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const passInput = document.getElementById('admin-password-input');
    if (passInput) {
      passInput.value = '';
      setTimeout(() => passInput.focus(), 150);
    }
    window.soundFx?.modalOpen?.();
  }

  closeLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  attemptLogin(password) {
    if (password === this.defaultPassword || password === 'admin') {
      this.isLoggedIn = true;
      try {
        localStorage.setItem('portfolio_admin_logged_in', 'true');
      } catch (e) {}

      this.closeLoginModal();
      this.showControlBar();
      window.soundFx?.success?.();
      window.showToast?.('ยินดีต้อนรับสู่ระบบหลังบ้านแอดมิน! 🚀', 'success', 'shield-check');

      // Update admin navbar button appearance
      const navBtn = document.getElementById('admin-login-btn');
      if (navBtn) navBtn.classList.add('admin-active');
    } else {
      window.soundFx?.error?.();
      window.showToast?.('รหัสผ่านไม่ถูกต้อง! (รหัสเริ่มต้นคือ admin123)', 'error', 'alert-triangle');
      const passInput = document.getElementById('admin-password-input');
      if (passInput) {
        passInput.classList.add('shake');
        setTimeout(() => passInput.classList.remove('shake'), 500);
        passInput.focus();
      }
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.disableLiveEditMode(false);
    try {
      localStorage.setItem('portfolio_admin_logged_in', 'false');
      localStorage.setItem('portfolio_live_edit_active', 'false');
    } catch (e) {}

    const bar = document.getElementById('admin-control-bar');
    if (bar) bar.classList.remove('visible');

    const navBtn = document.getElementById('admin-login-btn');
    if (navBtn) navBtn.classList.remove('admin-active');

    window.soundFx?.click?.();
    window.showToast?.('ออกจากระบบหลังบ้านแล้ว 🔒', 'info', 'lock');
  }

  showControlBar() {
    const bar = document.getElementById('admin-control-bar');
    if (!bar) return;
    bar.classList.add('visible');
    const navBtn = document.getElementById('admin-login-btn');
    if (navBtn) navBtn.classList.add('admin-active');
    this.updateLiveEditToggleUI();
  }

  toggleControlBarVisibility() {
    const bar = document.getElementById('admin-control-bar');
    if (!bar) return;
    bar.classList.toggle('visible');
  }

  /* ═══════════════════════════════════════════════════════════
     LIVE IN-PLACE TEXT EDITING (CMS)
     ═══════════════════════════════════════════════════════════ */
  toggleLiveEditMode() {
    if (this.isLiveEditActive) {
      this.disableLiveEditMode();
    } else {
      this.enableLiveEditMode();
    }
  }

  enableLiveEditMode(notify = true) {
    this.isLiveEditActive = true;
    try {
      localStorage.setItem('portfolio_live_edit_active', 'true');
    } catch (e) {}

    this.updateLiveEditToggleUI();

    // Find all CMS editable elements
    const editableElements = document.querySelectorAll('[data-cms-key]');
    editableElements.forEach(el => {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
      el.classList.add('cms-editable-active');
    });

    if (notify) {
      window.soundFx?.click?.();
      window.showToast?.('เปิดโหมดแก้ไขสดแล้ว! คลิกที่ข้อความบนหน้าเว็บเพื่อแก้ไขได้ทันที ✏️', 'success', 'edit-3');
    }
  }

  disableLiveEditMode(notify = true) {
    this.isLiveEditActive = false;
    try {
      localStorage.setItem('portfolio_live_edit_active', 'false');
    } catch (e) {}

    this.updateLiveEditToggleUI();

    const editableElements = document.querySelectorAll('[data-cms-key]');
    editableElements.forEach(el => {
      el.removeAttribute('contenteditable');
      el.classList.remove('cms-editable-active');
    });

    if (notify) {
      window.soundFx?.click?.();
      window.showToast?.('ปิดโหมดแก้ไขสดแล้ว 🔒', 'info', 'check');
    }
  }

  updateLiveEditToggleUI() {
    const toggleBtn = document.getElementById('admin-live-edit-btn');
    const toggleBadge = document.getElementById('admin-live-edit-status');
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', this.isLiveEditActive);
    }
    if (toggleBadge) {
      toggleBadge.textContent = this.isLiveEditActive ? 'เปิดใช้งาน (ON)' : 'ปิด (OFF)';
      toggleBadge.style.color = this.isLiveEditActive ? 'var(--neon-green)' : 'var(--text-muted)';
    }
  }

  setupInPlaceEditingListeners() {
    // Listen for blur and input on editable elements
    document.addEventListener('blur', (e) => {
      if (this.isLiveEditActive && e.target && e.target.hasAttribute && e.target.hasAttribute('data-cms-key')) {
        this.saveElementText(e.target);
      }
    }, true);

    document.addEventListener('input', (e) => {
      if (this.isLiveEditActive && e.target && e.target.hasAttribute && e.target.hasAttribute('data-cms-key')) {
        clearTimeout(this.debounceSaveTimer);
        this.debounceSaveTimer = setTimeout(() => {
          this.saveElementText(e.target, false);
        }, 1200);
      }
    });

    // Enter key blur on single-line headings
    document.addEventListener('keydown', (e) => {
      if (this.isLiveEditActive && e.target && e.target.hasAttribute && e.target.hasAttribute('data-cms-key')) {
        if (e.key === 'Enter' && !e.shiftKey && (e.target.tagName.startsWith('H') || e.target.classList.contains('hero-card-role'))) {
          e.preventDefault();
          e.target.blur();
        }
      }
    });
  }

  saveElementText(el, showToastNotification = true) {
    const key = el.getAttribute('data-cms-key');
    if (!key) return;

    const value = el.innerText.trim();
    this.textOverrides[key] = value;

    try {
      localStorage.setItem('portfolio_text_overrides', JSON.stringify(this.textOverrides));
    } catch (e) {
      console.warn('[AdminCMS] Failed to save text override:', e);
    }

    // Also synchronize corresponding data if it's profile field
    if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.portfolio_owner) {
      if (key === 'profile_name') {
        window.PORTFOLIO_DATA.portfolio_owner.name = value;
      } else if (key === 'profile_role') {
        window.PORTFOLIO_DATA.portfolio_owner.title = value;
      } else if (key === 'profile_location') {
        window.PORTFOLIO_DATA.portfolio_owner.location = value;
      } else if (key === 'hero_bio') {
        window.PORTFOLIO_DATA.portfolio_owner.bio = value;
      }
      try {
        localStorage.setItem('portfolio_profile_data', JSON.stringify(window.PORTFOLIO_DATA.portfolio_owner));
      } catch (e) {}
    }

    if (showToastNotification) {
      window.soundFx?.click?.();
      const snippet = value.length > 25 ? value.substring(0, 25) + '...' : value;
      window.showToast?.(`บันทึกข้อความเรียบร้อย: "${snippet}" ✏️`, 'success', 'check-circle');
    }
  }

  applyTextOverridesToDOM() {
    if (!this.textOverrides || Object.keys(this.textOverrides).length === 0) return;

    Object.keys(this.textOverrides).forEach(key => {
      const value = this.textOverrides[key];
      const elements = document.querySelectorAll(`[data-cms-key="${key}"]`);
      elements.forEach(el => {
        el.innerText = value;
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     PROFILE & BIO EDITOR
     ═══════════════════════════════════════════════════════════ */
  setupProfileEditor() {
    const openBtn = document.getElementById('admin-edit-profile-btn');
    const modal = document.getElementById('admin-profile-modal');
    const closeBtn = document.getElementById('admin-profile-close');
    const form = document.getElementById('admin-profile-form');

    if (openBtn) {
      openBtn.addEventListener('click', () => this.openProfileModal());
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeProfileModal());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeProfileModal();
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProfileForm();
      });
    }
  }

  openProfileModal() {
    const modal = document.getElementById('admin-profile-modal');
    if (!modal) return;

    const owner = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.portfolio_owner) || {};

    // Pre-populate Form Fields
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined ? val : '';
    };

    setVal('prof-name', owner.name || 'กฤษณะ เกียรติอนันต์');
    setVal('prof-english-name', owner.english_name || 'Kritsana Kiat-anan');
    setVal('prof-title', owner.title || '<CREATIVE DEVELOPER />');
    setVal('prof-roles', Array.isArray(owner.roles) ? owner.roles.join('\n') : 'Full-Stack Developer\nCreative Coder & 3D Web');
    setVal('prof-bio', owner.bio || '');
    setVal('prof-avatar', owner.avatar || '');
    setVal('prof-email', owner.email || '');
    setVal('prof-phone', owner.phone || '');
    setVal('prof-location', owner.location || 'กรุงเทพมหานคร, ประเทศไทย');
    setVal('prof-github', (owner.social && owner.social.github) || '');
    setVal('prof-linkedin', (owner.social && owner.social.linkedin) || '');
    setVal('prof-projects-stat', owner.completed_projects || 38);
    setVal('prof-satisfaction-stat', 100);
    setVal('prof-exp-stat', owner.experience_years || 4);

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    window.soundFx?.modalOpen?.();
  }

  closeProfileModal() {
    const modal = document.getElementById('admin-profile-modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  saveProfileForm() {
    const getVal = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const rolesRaw = getVal('prof-roles');
    const rolesArray = rolesRaw ? rolesRaw.split('\n').map(r => r.trim()).filter(Boolean) : [];

    const updatedProfile = {
      name: getVal('prof-name'),
      english_name: getVal('prof-english-name'),
      title: getVal('prof-title'),
      roles: rolesArray.length > 0 ? rolesArray : ['Full-Stack Developer'],
      bio: getVal('prof-bio'),
      avatar: getVal('prof-avatar'),
      email: getVal('prof-email'),
      phone: getVal('prof-phone'),
      location: getVal('prof-location'),
      completed_projects: parseInt(getVal('prof-projects-stat'), 10) || 38,
      experience_years: parseInt(getVal('prof-exp-stat'), 10) || 4,
      social: {
        github: getVal('prof-github'),
        linkedin: getVal('prof-linkedin')
      }
    };

    if (window.PORTFOLIO_DATA) {
      window.PORTFOLIO_DATA.portfolio_owner = Object.assign({}, window.PORTFOLIO_DATA.portfolio_owner, updatedProfile);
    }

    try {
      localStorage.setItem('portfolio_profile_data', JSON.stringify(window.PORTFOLIO_DATA.portfolio_owner));
    } catch (e) {
      console.warn('[AdminCMS] Failed to save profile data to localStorage:', e);
    }

    // Apply updates to the Live DOM
    this.applyProfileToDOM();
    this.closeProfileModal();

    window.soundFx?.success?.();
    window.showToast?.('บันทึกข้อมูลส่วนตัวและอัปเดตหน้าเว็บเรียบร้อยแล้ว! ✨', 'success', 'user-check');
  }

  applyProfileToDOM() {
    const owner = window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.portfolio_owner;
    if (!owner) return;

    // 1. Hero Card Profile Name, Role, Location, Avatar
    const nameEls = document.querySelectorAll('#hero-profile-name, [data-cms-key="profile_name"]');
    nameEls.forEach(el => el.textContent = owner.name);

    const roleEls = document.querySelectorAll('#hero-profile-role, [data-cms-key="profile_role"]');
    roleEls.forEach(el => el.textContent = owner.title);

    const locEls = document.querySelectorAll('#hero-profile-location span, [data-cms-key="profile_location"]');
    locEls.forEach(el => el.textContent = owner.location);

    if (owner.avatar) {
      const avatarImgs = document.querySelectorAll('#hero-profile-avatar, .hero-avatar-glow-ring img, .about-avatar-wrapper img');
      avatarImgs.forEach(img => {
        img.src = owner.avatar;
      });
    }

    // 2. Hero Bio
    if (owner.bio) {
      const bioEls = document.querySelectorAll('.hero-bio, [data-cms-key="hero_bio"]');
      bioEls.forEach(el => el.textContent = owner.bio);
    }

    // 3. Stats Numbers
    const statProjects = document.getElementById('hero-stat-projects');
    if (statProjects) {
      statProjects.setAttribute('data-target', owner.completed_projects || 38);
      statProjects.textContent = owner.completed_projects || 38;
    }

    const statYears = document.getElementById('hero-stat-years');
    if (statYears) {
      statYears.setAttribute('data-target', owner.experience_years || 4);
      statYears.textContent = owner.experience_years || 4;
    }

    // 4. Contact Info
    if (owner.email) {
      const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
      emailLinks.forEach(link => {
        link.href = `mailto:${owner.email}`;
        link.textContent = owner.email;
      });
    }

    // 5. Restart Typewriter with updated roles
    if (window.initTypewriter && Array.isArray(owner.roles)) {
      window.initTypewriter();
    }
  }

  /* ═══════════════════════════════════════════════════════════
     PROJECT CRUD OPERATIONS
     ═══════════════════════════════════════════════════════════ */
  setupProjectsManager() {
    const openBtn = document.getElementById('admin-manage-projects-btn');
    const modal = document.getElementById('admin-projects-modal');
    const closeBtn = document.getElementById('admin-projects-close');
    const addNewBtn = document.getElementById('admin-add-new-project-btn');
    const searchInput = document.getElementById('admin-project-search');
    const formModal = document.getElementById('admin-project-form-modal');
    const formCloseBtn = document.getElementById('admin-project-form-close');
    const projectForm = document.getElementById('admin-project-form');

    if (openBtn) {
      openBtn.addEventListener('click', () => this.openProjectsManager());
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeProjectsManager());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeProjectsManager();
      });
    }

    if (addNewBtn) {
      addNewBtn.addEventListener('click', () => this.openProjectForm(null));
    }

    if (formCloseBtn) {
      formCloseBtn.addEventListener('click', () => this.closeProjectForm());
    }

    if (formModal) {
      formModal.addEventListener('click', (e) => {
        if (e.target === formModal) this.closeProjectForm();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderProjectsAdminList(e.target.value.trim().toLowerCase());
      });
    }

    if (projectForm) {
      projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProjectFromForm();
      });
    }
  }

  openProjectsManager() {
    const modal = document.getElementById('admin-projects-modal');
    if (!modal) return;
    this.renderProjectsAdminList();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    window.soundFx?.modalOpen?.();
  }

  closeProjectsManager() {
    const modal = document.getElementById('admin-projects-modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  renderProjectsAdminList(query = '') {
    const listContainer = document.getElementById('admin-projects-list');
    if (!listContainer) return;

    const projects = (window.projectsApp && window.projectsApp.projects) || (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) || [];

    const filtered = projects.filter(p => {
      if (!query) return true;
      const t = (p.title || '').toLowerCase();
      const c = (p.category || '').toLowerCase();
      const s = Array.isArray(p.tech_stack) ? p.tech_stack.join(' ').toLowerCase() : '';
      return t.includes(query) || c.includes(query) || s.includes(query);
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="admin-empty-state">
          <i data-lucide="folder-x" style="width: 38px; height: 38px; color: var(--text-muted); margin-bottom: 8px;"></i>
          <p>ไม่พบโปรเจคที่ตรงกับคำค้นหา</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    listContainer.innerHTML = filtered.map(p => `
      <div class="admin-project-row" data-id="${p.id}">
        <img class="admin-project-thumb" src="${p.thumbnail || 'assets/icons/favicon.svg'}" alt="${p.title}" onerror="this.src='assets/icons/favicon.svg'" />
        <div class="admin-project-info">
          <div class="admin-project-title">${p.title}</div>
          <div class="admin-project-meta">
            <span class="admin-tag-cat">${p.category}</span>
            <span class="admin-tag-status ${p.status === 'completed' ? 'status-completed' : 'status-progress'}">${p.status}</span>
            <span class="admin-tech-preview">${Array.isArray(p.tech_stack) ? p.tech_stack.slice(0, 3).join(', ') : ''}</span>
          </div>
        </div>
        <div class="admin-project-actions">
          <button type="button" class="btn-admin-action btn-admin-edit" onclick="window.adminCMS.openProjectForm(${p.id})" title="แก้ไขโปรเจค">
            <i data-lucide="edit-2"></i> แก้ไข
          </button>
          <button type="button" class="btn-admin-action btn-admin-delete" onclick="window.adminCMS.deleteProject(${p.id})" title="ลบโปรเจค">
            <i data-lucide="trash-2"></i> ลบ
          </button>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  openProjectForm(projectId = null) {
    this.activeEditProjectId = projectId;
    const formModal = document.getElementById('admin-project-form-modal');
    const formTitle = document.getElementById('admin-project-form-title');
    if (!formModal) return;

    const projects = (window.projectsApp && window.projectsApp.projects) || (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) || [];

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined ? val : '';
    };

    if (projectId) {
      // Edit Mode
      const proj = projects.find(p => p.id === projectId);
      if (!proj) return;

      if (formTitle) formTitle.innerHTML = `<i data-lucide="edit-2"></i> แก้ไขโปรเจค #${proj.id}: ${proj.title}`;
      setVal('proj-title', proj.title || '');
      setVal('proj-category', proj.category || 'Web App');
      setVal('proj-status', proj.status || 'completed');
      setVal('proj-desc-short', proj.description_short || '');
      setVal('proj-desc-full', proj.description_full || '');
      setVal('proj-thumb', proj.thumbnail || '');
      setVal('proj-video', proj.video_url || '');
      setVal('proj-tech', Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : '');
      setVal('proj-features', Array.isArray(proj.features) ? proj.features.join('\n') : '');
      setVal('proj-github', proj.github_url || '');
      setVal('proj-demo', proj.demo_url || '');
    } else {
      // Create New Project Mode
      if (formTitle) formTitle.innerHTML = `<i data-lucide="plus-circle"></i> เพิ่มโปรเจคใหม่ (New Project)`;
      setVal('proj-title', '');
      setVal('proj-category', 'Web App');
      setVal('proj-status', 'completed');
      setVal('proj-desc-short', '');
      setVal('proj-desc-full', '');
      setVal('proj-thumb', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80');
      setVal('proj-video', '');
      setVal('proj-tech', 'React, TypeScript, Tailwind CSS');
      setVal('proj-features', 'ระบบทำงานแบบ Real-time High Performance\nดีไซน์ล้ำสมัย Cyberpunk UX/UI\nรองรับ Responsive ทุกหน้าจอ 100%');
      setVal('proj-github', 'https://github.com');
      setVal('proj-demo', 'https://example.com');
    }

    formModal.classList.add('open');
    if (window.lucide) window.lucide.createIcons();
    window.soundFx?.modalOpen?.();
  }

  closeProjectForm() {
    const formModal = document.getElementById('admin-project-form-modal');
    if (!formModal) return;
    formModal.classList.remove('open');
  }

  saveProjectFromForm() {
    const getVal = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const title = getVal('proj-title');
    if (!title) {
      alert('กรุณากรอกชื่อโปรเจค');
      return;
    }

    const techRaw = getVal('proj-tech');
    const techArray = techRaw ? techRaw.split(',').map(t => t.trim()).filter(Boolean) : ['JavaScript'];

    const featuresRaw = getVal('proj-features');
    const featuresArray = featuresRaw ? featuresRaw.split('\n').map(f => f.trim()).filter(Boolean) : ['Complete Feature Set'];

    const projectData = {
      title,
      category: getVal('proj-category') || 'Web App',
      status: getVal('proj-status') || 'completed',
      description_short: getVal('proj-desc-short'),
      description_full: getVal('proj-desc-full') || getVal('proj-desc-short'),
      thumbnail: getVal('proj-thumb') || 'assets/icons/favicon.svg',
      video_url: getVal('proj-video'),
      tech_stack: techArray,
      features: featuresArray,
      github_url: getVal('proj-github') || '#',
      demo_url: getVal('proj-demo') || '#',
      screenshots: [getVal('proj-thumb')]
    };

    let projects = (window.projectsApp && window.projectsApp.projects) || (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) || [];

    if (this.activeEditProjectId) {
      // Update existing
      const idx = projects.findIndex(p => p.id === this.activeEditProjectId);
      if (idx !== -1) {
        projects[idx] = Object.assign({}, projects[idx], projectData);
      }
    } else {
      // Add new
      const maxId = projects.reduce((max, p) => Math.max(max, p.id || 0), 0);
      projectData.id = maxId + 1;
      projects.unshift(projectData); // prepend as newest
    }

    // Save state
    if (window.PORTFOLIO_DATA) window.PORTFOLIO_DATA.projects = projects;
    if (window.projectsApp) window.projectsApp.projects = projects;

    try {
      localStorage.setItem('portfolio_projects_data', JSON.stringify(projects));
    } catch (e) {
      console.warn('[AdminCMS] Failed to save projects to localStorage:', e);
    }

    // Re-render Live Webpage
    if (window.projectsApp) {
      window.projectsApp.updateCategoryCounts();
      window.projectsApp.renderProjects();
    }

    this.closeProjectForm();
    this.renderProjectsAdminList();

    window.soundFx?.success?.();
    window.showToast?.(
      this.activeEditProjectId ? 'แก้ไขโปรเจคเรียบร้อยแล้ว! 🚀' : 'เพิ่มโปรเจคใหม่สำเร็จ! 🎉',
      'success',
      'check-circle'
    );
  }

  deleteProject(projectId) {
    if (!confirm(`คุณต้องการลบโปรเจค #${projectId} ออกจากเว็บไซต์ใช่หรือไม่?`)) {
      return;
    }

    let projects = (window.projectsApp && window.projectsApp.projects) || (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) || [];
    projects = projects.filter(p => p.id !== projectId);

    if (window.PORTFOLIO_DATA) window.PORTFOLIO_DATA.projects = projects;
    if (window.projectsApp) window.projectsApp.projects = projects;

    try {
      localStorage.setItem('portfolio_projects_data', JSON.stringify(projects));
    } catch (e) {}

    if (window.projectsApp) {
      window.projectsApp.updateCategoryCounts();
      window.projectsApp.renderProjects();
    }

    this.renderProjectsAdminList();
    window.soundFx?.click?.();
    window.showToast?.(`ลบโปรเจค #${projectId} เรียบร้อยแล้ว`, 'info', 'trash');
  }

  /* ═══════════════════════════════════════════════════════════
     EXPORT, IMPORT & RESET DATA
     ═══════════════════════════════════════════════════════════ */
  setupExportImport() {
    const exportBtn = document.getElementById('admin-export-btn');
    const importBtn = document.getElementById('admin-import-btn');
    const fileInput = document.getElementById('admin-import-file-input');
    const resetBtn = document.getElementById('admin-reset-btn');

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportJson());
    }

    if (importBtn && fileInput) {
      importBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => this.handleFileImport(e));
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetToDefault());
    }
  }

  exportJson() {
    const projects = (window.projectsApp && window.projectsApp.projects) || (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) || [];
    const owner = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.portfolio_owner) || {};
    const skills = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.skills) || [];
    const timeline = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.timeline) || [];

    const exportPayload = {
      portfolio_owner: owner,
      projects: projects,
      skills: skills,
      timeline: timeline,
      text_overrides: this.textOverrides,
      exported_at: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    window.soundFx?.success?.();
    window.showToast?.('ส่งออกไฟล์ projects.json เรียบร้อยแล้ว! นำไปวางในโฟลเดอร์ data/ ได้ทันที 📥', 'success', 'download');
  }

  handleFileImport(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (!importedData) throw new Error('ไฟล์ JSON ว่างเปล่า');

        // 1. Projects
        if (Array.isArray(importedData.projects)) {
          window.PORTFOLIO_DATA.projects = importedData.projects;
          if (window.projectsApp) window.projectsApp.projects = importedData.projects;
          localStorage.setItem('portfolio_projects_data', JSON.stringify(importedData.projects));
        }

        // 2. Profile
        if (importedData.portfolio_owner) {
          window.PORTFOLIO_DATA.portfolio_owner = Object.assign({}, window.PORTFOLIO_DATA.portfolio_owner, importedData.portfolio_owner);
          localStorage.setItem('portfolio_profile_data', JSON.stringify(window.PORTFOLIO_DATA.portfolio_owner));
          this.applyProfileToDOM();
        }

        // 3. Text Overrides
        if (importedData.text_overrides && typeof importedData.text_overrides === 'object') {
          this.textOverrides = importedData.text_overrides;
          localStorage.setItem('portfolio_text_overrides', JSON.stringify(this.textOverrides));
          this.applyTextOverridesToDOM();
        }

        // Re-render
        if (window.projectsApp) {
          window.projectsApp.updateCategoryCounts();
          window.projectsApp.renderProjects();
        }

        window.soundFx?.success?.();
        window.showToast?.('นำเข้าข้อมูลสำเร็จและอัปเดตหน้าเว็บเรียบร้อยแล้ว! 🎉', 'success', 'check-circle');
      } catch (err) {
        console.error('[AdminCMS] Import JSON Error:', err);
        window.soundFx?.error?.();
        window.showToast?.('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: รูปแบบไม่ถูกต้อง', 'error', 'alert-triangle');
      } finally {
        e.target.value = ''; // reset file input
      }
    };

    reader.readAsText(file);
  }

  resetToDefault() {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นเดิม? การปรับแต่งทั้งหมดในเบราว์เซอร์นี้จะถูกล้าง')) {
      return;
    }

    try {
      localStorage.removeItem('portfolio_projects_data');
      localStorage.removeItem('portfolio_profile_data');
      localStorage.removeItem('portfolio_text_overrides');
    } catch (e) {}

    window.soundFx?.click?.();
    window.showToast?.('กำลังรีเซ็ตข้อมูลกลับสู่ค่าเริ่มต้น...', 'info', 'refresh-cw');

    setTimeout(() => {
      window.location.reload();
    }, 600);
  }
}

// Auto-initialize Admin CMS when ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.adminCMS = new AdminBackofficeCMS();
  });
}
