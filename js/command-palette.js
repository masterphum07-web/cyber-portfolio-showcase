/**
 * COMMAND PALETTE (CTRL + K / CMD + K) - INSPIRED BY CMDK & RAYCAST
 * แผงสั่งการแบบ Glassmorphism ล้ำสมัย รองรับการค้นหาและเข้าถึงทุกฟังก์ชันในเว็บอย่างรวดเร็ว:
 * - นำทางไปยังหมวดหมู่ต่างๆ (Sections Navigation)
 * - การดำเนินการด่วน (Quick Actions: Theme, Audio, Terminal, Resume, Background FX, Grid/List)
 * - ค้นหาและเปิดดูโปรเจคโดยตรง (Live Project Search & Launch)
 * - กรองผลงานตามแท็กเทคโนโลยี (Tech Stack Filtering)
 * - รองรับคีย์บอร์ดเต็มรูปแบบ (Arrow Up/Down, Enter, Esc) และ Screen Reader Accessibility
 */

class CommandPalette {
  constructor() {
    this.isOpen = false;
    this.modal = document.getElementById('command-palette-modal');
    this.input = document.getElementById('cmdk-input');
    this.resultsList = document.getElementById('cmdk-results');
    this.announcer = document.getElementById('cmdk-announcer');
    this.lastFocusedElement = null;
    this.selectedIndex = 0;
    this.filteredItems = [];

    this.init();
  }

  init() {
    // Keyboard shortcut listeners (Ctrl+K, Cmd+K, /)
    window.addEventListener('keydown', (e) => {
      // Avoid triggering when user is editing in an input, textarea or contenteditable (unless it's cmdk-input)
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable;
      
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
        return;
      }

      if (e.key === '/' && !isInput && !this.isOpen) {
        e.preventDefault();
        this.open();
        return;
      }

      if (this.isOpen) {
        this.handleKeyDown(e);
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

    // Input search listener
    if (this.input) {
      this.input.addEventListener('input', () => {
        this.renderResults(this.input.value);
      });
    }

    // Trigger button clicks (e.g. from navbar or footer)
    document.querySelectorAll('.cmdk-trigger-btn').forEach(btn => {
      btn.addEventListener('click', () => this.open());
    });
  }

  // สร้างรายการคำสั่งทั้งหมด
  getAllCommands() {
    const commands = [];

    // 1. NAVIGATION
    const navItems = [
      { id: 'nav-hero', title: 'ไปที่หน้าแรก (Hero)', section: 'hero', icon: 'home', category: 'Navigation', keywords: 'home hero start top' },
      { id: 'nav-about', title: 'เกี่ยวกับผม (About Me)', section: 'about', icon: 'user', category: 'Navigation', keywords: 'about bio profile me' },
      { id: 'nav-xray', title: 'ศูนย์จำลองภาพรังสี (X-Ray & DICOM Lab)', section: 'xray-lab', icon: 'activity', category: 'Navigation', keywords: 'xray medical dicom pacs chest radiation lab radiologic' },
      { id: 'nav-projects', title: 'ผลงานโปรเจค (Projects Showcase)', section: 'projects', icon: 'folder-git-2', category: 'Navigation', keywords: 'projects work portfolio showcase' },
      { id: 'nav-skills', title: 'เทคโนโลยีที่เชี่ยวชาญ (Skills & Tech)', section: 'skills', icon: 'cpu', category: 'Navigation', keywords: 'skills tech stack tools' },
      { id: 'nav-testimonials', title: 'รีวิวและความประทับใจ (Testimonials)', section: 'testimonials', icon: 'message-square', category: 'Navigation', keywords: 'reviews testimonials clients' },
      { id: 'nav-articles', title: 'บทความและสาระน่ารู้ (Articles & Blog)', section: 'articles', icon: 'book-open', category: 'Navigation', keywords: 'articles blog post news' },
      { id: 'nav-contact', title: 'ติดต่อสอบถาม (Contact Info)', section: 'contact', icon: 'send', category: 'Navigation', keywords: 'contact email hire me message' }
    ];

    navItems.forEach(item => {
      commands.push({
        id: item.id,
        title: item.title,
        subtitle: `นำทางไปยัง #${item.section}`,
        category: 'การนำทาง (Navigation)',
        icon: item.icon,
        badge: 'Nav',
        keywords: item.keywords,
        action: () => {
          const el = document.getElementById(item.section);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // 2. QUICK ACTIONS
    commands.push(
      {
        id: 'act-coverflow',
        title: 'เปิดมุมมองโปรเจค 3D Coverflow (Coverflow 3D Mode)',
        subtitle: 'สลับแสดงผลงานแบบหมุน 3 มิติในอวกาศ (กด 3)',
        category: 'คำสั่งระบบ (System Actions)',
        icon: 'box',
        badge: '3D',
        keywords: 'coverflow 3d space carousel rotate card view projects',
        action: () => {
          const sec = document.getElementById('projects');
          if (sec) sec.scrollIntoView({ behavior: 'smooth' });
          window.projectsApp?.setViewMode('3d');
        }
      },
      {
        id: 'act-terminal',
        title: 'เปิด Cyber Terminal (CLI Mode)',
        subtitle: 'เปิดเทอร์มินัลคำสั่งอินเทอร์แอคทีฟสไตล์แฮกเกอร์',
        category: 'คำสั่งระบบ (System Actions)',
        icon: 'terminal',
        badge: 'CLI',
        keywords: 'terminal cli console bash shell matrix code cmd',
        action: () => window.toggleTerminal?.(true)
      },
      {
        id: 'act-resume',
        title: 'ดูเรซูเม่ / ประวัติย่อ (Resume & CV)',
        subtitle: 'เปิดหน้ารายละเอียด ATS-Ready CV พร้อมปุ่มสั่งพิมพ์และคัดลอก',
        category: 'คำสั่งระบบ (System Actions)',
        icon: 'file-text',
        badge: 'CV',
        keywords: 'resume cv print download bio pdf experience career',
        action: () => window.openResumeModal?.()
      },
      {
        id: 'act-theme',
        title: 'สลับธีม (Toggle Dark / Light Theme)',
        subtitle: 'เปลี่ยนรูปแบบโทนสีระหว่าง Dark Cyberpunk และ Modern Light',
        category: 'คำสั่งระบบ (System Actions)',
        icon: 'sun-medium',
        badge: 'Theme',
        keywords: 'theme dark light mode color toggle',
        action: () => window.toggleTheme?.()
      },
      {
        id: 'act-sound',
        title: 'เปิด/ปิดเสียงเอฟเฟกต์ (Toggle Cyber Audio)',
        subtitle: 'สลับเปิด-ปิดระบบสังเคราะห์เสียง Web Audio SFX',
        category: 'คำสั่งระบบ (System Actions)',
        icon: 'volume-2',
        badge: 'Audio',
        keywords: 'sound audio music mute volume sfx',
        action: () => window.toggleSound?.()
      },
      {
        id: 'act-bg-matrix',
        title: 'เปลี่ยนพื้นหลัง: Matrix Digital Rain',
        subtitle: 'ฝนโค้ดตัวอักษรดิจิทัลสีเขียว/ฟ้าเรืองแสงสไตล์ Cyberpunk',
        category: 'คำสั่งระบบ (System Actions)',
        icon: 'binary',
        badge: 'FX',
        keywords: 'matrix digital rain fx green background canvas code',
        action: () => window.particleNetwork?.setMode?.('matrix')
      },
      {
        id: 'act-bg-starfield',
        title: 'เปลี่ยนพื้นหลัง: Cyber Warp Starfield',
        subtitle: 'จำลองการเดินทางข้ามมิติไฮเปอร์สเปซ 3D Warp Stars',
        category: 'คำสั่งระบบ (System Actions)',
        icon: 'sparkles',
        badge: 'FX',
        keywords: 'starfield warp stars space hyperspace 3d fx background',
        action: () => window.particleNetwork?.setMode?.('starfield')
      },
      {
        id: 'act-bg-particles',
        title: 'เปลี่ยนพื้นหลัง: 3D Particle Mesh',
        subtitle: 'ตาข่ายอนุภาคกลุ่มดาว 3D โต้ตอบการเลื่อนเมาส์',
        category: 'คำสั่งระบบ (System Actions)',
        icon: 'atom',
        badge: 'FX',
        keywords: 'particles mesh network nodes constellation background fx',
        action: () => window.particleNetwork?.setMode?.('particles')
      },
      {
        id: 'act-view-toggle',
        title: 'สลับมุมมอง Grid / List View',
        subtitle: 'สลับการจัดวางการ์ดผลงานโปรเจค',
        category: 'คำสั่งระบบ (System Actions)',
        icon: 'layout-grid',
        badge: 'View',
        keywords: 'grid list view layout toggle switch',
        action: () => {
          const current = window.projectsApp?.currentView || 'grid';
          window.projectsApp?.setViewMode(current === 'grid' ? 'list' : 'grid');
        }
      },
      {
        id: 'act-scroll-top',
        title: 'เลื่อนกลับขึ้นบนสุด (Scroll to Top)',
        subtitle: 'กลับไปยังส่วนบนสุดของหน้าเว็บ',
        category: 'คำสั่งระบบ (System Actions)',
        icon: 'arrow-up',
        badge: 'Scroll',
        keywords: 'top scroll up beginning header',
        action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      {
        id: 'act-admin',
        title: 'เข้าสู่ระบบแอดมิน (Admin CMS Backoffice)',
        subtitle: 'เปิดหน้าต่างล็อกอินเพื่อจัดการและแก้ไขเนื้อหาหน้าเว็บ',
        category: 'คำสั่งระบบ (System Actions)',
        icon: 'shield-check',
        badge: 'Admin',
        keywords: 'admin cms login backoffice edit manage password',
        action: () => window.adminCMS?.openLoginModal?.()
      }
    );

    // 3. PROJECTS DIRECT SEARCH
    const projects = window.PORTFOLIO_DATA?.projects || [];
    projects.forEach(p => {
      commands.push({
        id: `proj-${p.id}`,
        title: p.title,
        subtitle: `${p.category} • ${(p.tech_stack || []).slice(0, 3).join(', ')}`,
        category: 'ผลงานโปรเจค (Projects)',
        icon: 'folder',
        badge: p.category,
        keywords: `${p.title} ${p.category} ${(p.tech_stack || []).join(' ')} ${(p.features || []).join(' ')} ${p.description_short}`,
        action: () => {
          window.projectsApp?.openProjectModal(p.id);
        }
      });
    });

    // 4. TECH STACK FILTERS
    const techSet = new Set();
    projects.forEach(p => {
      if (Array.isArray(p.tech_stack)) {
        p.tech_stack.forEach(t => techSet.add(t));
      }
    });

    Array.from(techSet).sort().forEach(tech => {
      commands.push({
        id: `tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        title: `กรองโปรเจคที่ใช้: ${tech}`,
        subtitle: `แสดงผลงานที่ใช้เทคโนโลยี ${tech}`,
        category: 'เทคโนโลยี (Tech Stack Filters)',
        icon: 'code',
        badge: 'Filter',
        keywords: `tech filter tag ${tech}`,
        action: () => {
          window.projectsApp?.filterByTech(tech);
        }
      });
    });

    return commands;
  }

  // กรองรายการตามคำค้นหา
  filterCommands(query) {
    const all = this.getAllCommands();
    const q = (query || '').trim().toLowerCase();
    if (!q) return all;

    return all.filter(cmd => {
      const matchTitle = cmd.title.toLowerCase().includes(q);
      const matchSub = cmd.subtitle?.toLowerCase().includes(q);
      const matchKeywords = cmd.keywords?.toLowerCase().includes(q);
      const matchCat = cmd.category.toLowerCase().includes(q);
      return matchTitle || matchSub || matchKeywords || matchCat;
    });
  }

  open() {
    if (!this.modal) return;
    this.lastFocusedElement = document.activeElement;
    this.isOpen = true;
    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (this.input) {
      this.input.value = '';
      setTimeout(() => this.input.focus(), 50);
    }

    this.renderResults('');
    window.soundFx?.modalOpen?.();
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
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // เรนเดอร์ผลการค้นหาแบ่งตามหมวดหมู่
  renderResults(query) {
    if (!this.resultsList) return;
    this.filteredItems = this.filterCommands(query);
    this.selectedIndex = 0;

    if (this.filteredItems.length === 0) {
      this.resultsList.innerHTML = `
        <div class="cmdk-empty-state">
          <i data-lucide="search-x" style="width: 36px; height: 36px; color: var(--text-muted); margin-bottom: 8px;"></i>
          <div>ไม่พบคำสั่งหรือผลงานที่ตรงกับ "${this.escapeHtml(query)}"</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">ลองค้นหาด้วยคำอื่น เช่น React, Three.js, theme, terminal หรือ resume</div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // จัดกลุ่มตาม category
    const groups = {};
    this.filteredItems.forEach((item, index) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push({ item, globalIndex: index });
    });

    let html = '';
    Object.keys(groups).forEach(cat => {
      html += `<div class="cmdk-group-title">${this.escapeHtml(cat)}</div>`;
      groups[cat].forEach(({ item, globalIndex }) => {
        const isSelected = globalIndex === this.selectedIndex;
        html += `
          <div 
            class="cmdk-item ${isSelected ? 'selected' : ''}" 
            role="option" 
            id="cmdk-opt-${globalIndex}"
            data-index="${globalIndex}"
            aria-selected="${isSelected ? 'true' : 'false'}"
          >
            <div class="cmdk-item-left">
              <i data-lucide="${item.icon || 'command'}" class="cmdk-item-icon"></i>
              <div class="cmdk-item-text">
                <div class="cmdk-item-title">${this.highlightMatch(item.title, query)}</div>
                ${item.subtitle ? `<div class="cmdk-item-subtitle">${this.escapeHtml(item.subtitle)}</div>` : ''}
              </div>
            </div>
            ${item.badge ? `<span class="cmdk-badge">${this.escapeHtml(item.badge)}</span>` : ''}
          </div>
        `;
      });
    });

    this.resultsList.innerHTML = html;

    // Delegated click
    this.resultsList.querySelectorAll('.cmdk-item').forEach(el => {
      el.addEventListener('click', () => {
        const index = parseInt(el.getAttribute('data-index'), 10);
        this.executeItem(index);
      });
      el.addEventListener('mouseenter', () => {
        const index = parseInt(el.getAttribute('data-index'), 10);
        this.setSelectedIndex(index);
      });
    });

    if (window.lucide) window.lucide.createIcons();
    this.scrollSelectedIntoView();
  }

  setSelectedIndex(index) {
    if (index < 0 || index >= this.filteredItems.length) return;
    this.selectedIndex = index;

    const items = this.resultsList.querySelectorAll('.cmdk-item');
    items.forEach((el, idx) => {
      const isSel = idx === this.selectedIndex;
      el.classList.toggle('selected', isSel);
      el.setAttribute('aria-selected', isSel ? 'true' : 'false');
    });

    this.scrollSelectedIntoView();
  }

  scrollSelectedIntoView() {
    const selectedEl = this.resultsList.querySelector('.cmdk-item.selected');
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  executeItem(index) {
    const target = this.filteredItems[index];
    if (target && typeof target.action === 'function') {
      window.soundFx?.click?.();
      this.close();
      target.action();
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (this.selectedIndex + 1) % Math.max(1, this.filteredItems.length);
      this.setSelectedIndex(next);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (this.selectedIndex - 1 + this.filteredItems.length) % Math.max(1, this.filteredItems.length);
      this.setSelectedIndex(prev);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      this.executeItem(this.selectedIndex);
      return;
    }
  }

  highlightMatch(text, query) {
    if (!query) return this.escapeHtml(text);
    const safeQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!safeQuery) return this.escapeHtml(text);

    const regex = new RegExp(`(${safeQuery})`, 'gi');
    return text.replace(regex, '<mark class="cmdk-highlight">$1</mark>');
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

// Global exports & initialization
window.toggleCommandPalette = function(forceOpen) {
  if (!window.commandPalette) return;
  if (typeof forceOpen === 'boolean') {
    if (forceOpen) window.commandPalette.open();
    else window.commandPalette.close();
  } else {
    window.commandPalette.toggle();
  }
};

window.openCommandPalette = function() {
  window.commandPalette?.open();
};

window.closeCommandPalette = function() {
  window.commandPalette?.close();
};

document.addEventListener('DOMContentLoaded', () => {
  window.commandPalette = new CommandPalette();
});
