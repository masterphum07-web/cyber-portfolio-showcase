/**
 * INTERACTIVE DEVELOPER CYBER TERMINAL (CLI MODE)
 * เทอร์มินัลคำสั่งจำลองแบบอินเทอร์แอคทีฟ สไตล์ Cyberpunk / Retro Hacker
 * รองรับคำสั่งหลากหลาย: help, projects, open, skills, bio, contact, theme, fx, matrix, starfield, particles, resume, admin, stats, clear, date, echo, cat, sudo, exit
 * พร้อมฟังก์ชัน Command History (Up/Down) และ Tab Auto-completion
 */

class CyberTerminal {
  constructor() {
    this.isOpen = false;
    this.isMaximized = false;
    this.isMinimized = false;

    this.container = document.getElementById('cyber-terminal-modal');
    this.windowEl = document.getElementById('cyber-terminal-window');
    this.outputEl = document.getElementById('terminal-output');
    this.inputEl = document.getElementById('terminal-input');

    this.history = [];
    this.historyIndex = -1;
    this.commandsList = [
      'help', 'projects', 'open', 'project', 'skills', 'bio', 'whoami',
      'contact', 'theme', 'fx', 'matrix', 'starfield', 'particles',
      'resume', 'cv', 'stats', 'clear', 'cls', 'date', 'echo', 'cat',
      'sudo', 'admin', 'exit'
    ];

    this.init();
  }

  init() {
    // Keyboard shortcut to toggle terminal (Ctrl + ` or ~)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === '~')) {
        e.preventDefault();
        this.toggle();
        return;
      }

      if (e.key === 'Escape' && this.isOpen) {
        // Close terminal if open and not in input
        e.preventDefault();
        this.close();
      }
    });

    if (this.inputEl) {
      this.inputEl.addEventListener('keydown', (e) => this.handleInputKeyDown(e));
    }

    // Auto-focus input when terminal window is clicked
    if (this.windowEl) {
      this.windowEl.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('a')) {
          this.inputEl?.focus();
        }
      });
    }

    // Print initial banner
    this.printBanner();
  }

  printBanner() {
    if (!this.outputEl) return;
    const banner = `
<span class="term-banner-glow">
  ██╗  ██╗██████╗ ██╗████████╗███████╗ █████╗ ███╗   ██╗ █████╗ 
  ██║ ██╔╝██╔══██╗██║╚══██╔══╝██╔════╝██╔══██╗████╗  ██║██╔══██╗
  █████╔╝ ██████╔╝██║   ██║   ███████╗███████║██╔██╗ ██║███████║
  ██╔═██╗ ██╔══██╗██║   ██║   ╚════██║██╔══██║██║╚██╗██║██╔══██║
  ██║  ██╗██║  ██║██║   ██║   ███████║██║  ██║██║ ╚████║██║  ██║
  ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
</span>
<span class="term-dim">══════════════════════════════════════════════════════════════════════</span>
<span class="term-highlight">CYBER TERMINAL v2.4.0 (x86_64-kritsana-dev-webos)</span>
<span class="term-info">ยินดีต้อนรับสู่ Interactive CLI Portfolio! พิมพ์ <span class="term-cmd">'help'</span> เพื่อดูคำสั่งทั้งหมด</span>
<span class="term-info">หรือพิมพ์ <span class="term-cmd">'projects'</span> เพื่อเปิดดูผลงานโปรเจค และ <span class="term-cmd">'matrix'</span> เพื่อดูเอฟเฟกต์</span>
<span class="term-dim">══════════════════════════════════════════════════════════════════════</span>
`;
    this.outputEl.innerHTML = banner;
  }

  open() {
    if (!this.container) return;
    this.isOpen = true;
    this.isMinimized = false;
    this.container.classList.add('open');
    this.container.classList.remove('minimized');
    window.soundFx?.click?.();

    setTimeout(() => {
      this.inputEl?.focus();
      this.scrollToBottom();
    }, 100);
  }

  close() {
    if (!this.container) return;
    this.isOpen = false;
    this.container.classList.remove('open');
    window.soundFx?.click?.();
  }

  toggle() {
    if (this.isOpen && !this.isMinimized) {
      this.close();
    } else {
      this.open();
    }
  }

  minimize() {
    if (!this.container) return;
    this.isMinimized = !this.isMinimized;
    this.container.classList.toggle('minimized', this.isMinimized);
    window.soundFx?.click?.();
  }

  maximize() {
    if (!this.container) return;
    this.isMaximized = !this.isMaximized;
    this.container.classList.toggle('maximized', this.isMaximized);
    window.soundFx?.click?.();
  }

  scrollToBottom() {
    if (this.outputEl) {
      this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }
  }

  handleInputKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const command = this.inputEl.value.trim();
      this.inputEl.value = '';

      if (command) {
        this.history.push(command);
        this.historyIndex = this.history.length;
      }

      this.executeCommand(command);
      return;
    }

    // Command History Up
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length > 0 && this.historyIndex > 0) {
        this.historyIndex--;
        this.inputEl.value = this.history[this.historyIndex] || '';
      }
      return;
    }

    // Command History Down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.inputEl.value = this.history[this.historyIndex] || '';
      } else {
        this.historyIndex = this.history.length;
        this.inputEl.value = '';
      }
      return;
    }

    // Tab Auto-completion
    if (e.key === 'Tab') {
      e.preventDefault();
      const val = this.inputEl.value.trim().toLowerCase();
      if (!val) return;

      const matches = this.commandsList.filter(c => c.startsWith(val));
      if (matches.length === 1) {
        this.inputEl.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        this.printLine(`<span class="term-prompt">guest@kritsana-dev:~$</span> ${val}`);
        this.printLine(`<span class="term-dim">${matches.join('   ')}</span>`);
      }
      return;
    }
  }

  printLine(html) {
    if (!this.outputEl) return;
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = html;
    this.outputEl.appendChild(line);
    this.scrollToBottom();
  }

  executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    this.printLine(`<span class="term-prompt">guest@kritsana-dev:~$</span> <span class="term-user-input">${this.escapeHtml(trimmed)}</span>`);

    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        this.cmdHelp();
        break;
      case 'projects':
      case 'ls':
        if (args[0] === 'projects' || args.length === 0) {
          this.cmdProjects();
        } else {
          this.printLine(`<span class="term-dim">Desktop  Documents  Downloads  projects/  skills/  bio.txt  README.md</span>`);
        }
        break;
      case 'open':
      case 'project':
        this.cmdOpenProject(args[0]);
        break;
      case 'skills':
        this.cmdSkills();
        break;
      case 'bio':
      case 'whoami':
      case 'about':
        this.cmdBio();
        break;
      case 'contact':
        this.cmdContact();
        break;
      case 'theme':
        this.cmdTheme(args[0]);
        break;
      case 'fx':
        this.cmdFx(args[0]);
        break;
      case 'matrix':
        window.particleNetwork?.setMode?.('matrix');
        this.printLine(`<span class="term-success">🟩 สลับเอฟเฟกต์พื้นหลังเป็น Matrix Digital Rain สำเร็จ!</span>`);
        break;
      case 'starfield':
        window.particleNetwork?.setMode?.('starfield');
        this.printLine(`<span class="term-success">✨ สลับเอฟเฟกต์พื้นหลังเป็น Cyber Warp Starfield สำเร็จ!</span>`);
        break;
      case 'particles':
        window.particleNetwork?.setMode?.('particles');
        this.printLine(`<span class="term-success">🔮 สลับเอฟเฟกต์พื้นหลังเป็น 3D Particle Mesh สำเร็จ!</span>`);
        break;
      case 'resume':
      case 'cv':
        this.printLine(`<span class="term-info">📄 กำลังเปิดหน้าต่าง Developer Resume & CV...</span>`);
        window.openResumeModal?.();
        break;
      case 'stats':
        this.cmdStats();
        break;
      case 'date':
        this.printLine(`<span class="term-info">🕒 ${new Date().toLocaleString('th-TH', { dateStyle: 'full', timeStyle: 'medium' })}</span>`);
        break;
      case 'echo':
        this.printLine(this.escapeHtml(args.join(' ')));
        break;
      case 'cat':
        this.cmdCat(args[0]);
        break;
      case 'admin':
        this.printLine(`<span class="term-info">🔒 กำลังเปิดหน้าต่าง Admin CMS Backoffice Login...</span>`);
        window.adminCMS?.openLoginModal?.();
        break;
      case 'sudo':
        this.printLine(`<span class="term-error">🚫 Permission denied: User 'guest' is not in the sudoers file. This incident will be reported to Kritsana. 😎</span>`);
        break;
      case 'clear':
      case 'cls':
        this.outputEl.innerHTML = '';
        break;
      case 'exit':
        this.printLine(`<span class="term-dim">Closing session... Goodbye!</span>`);
        setTimeout(() => this.close(), 400);
        break;
      default:
        this.printLine(`<span class="term-error">bash: command not found: ${this.escapeHtml(cmd)}. Type <span class="term-cmd">'help'</span> for available commands.</span>`);
        window.soundFx?.toast?.();
        break;
    }
  }

  cmdHelp() {
    const helpText = `
<div class="term-table">
  <div class="term-row"><span class="term-cmd">help</span><span>แสดงคู่มือรายการคำสั่งทั้งหมด</span></div>
  <div class="term-row"><span class="term-cmd">projects</span><span>แสดงรายชื่อผลงานโปรเจคทั้งหมดในพอร์ต</span></div>
  <div class="term-row"><span class="term-cmd">open &lt;id&gt;</span><span>เปิดดูรายละเอียดโปรเจคตามรหัส (เช่น 'open 1')</span></div>
  <div class="term-row"><span class="term-cmd">skills</span><span>แสดงผังความเชี่ยวชาญด้านเทคโนโลยี (Tech Stack)</span></div>
  <div class="term-row"><span class="term-cmd">bio / whoami</span><span>ประวัติส่วนตัว, ประสบการณ์ และตำแหน่งงาน</span></div>
  <div class="term-row"><span class="term-cmd">contact</span><span>ช่องทางติดต่อทั้งหมด (Email, Phone, Socials)</span></div>
  <div class="term-row"><span class="term-cmd">resume / cv</span><span>เปิดดูเรซูเม่ฉบับสมบูรณ์ พร้อมสั่งพิมพ์ A4</span></div>
  <div class="term-row"><span class="term-cmd">theme [dark|light]</span><span>สลับธีม Dark Mode / Light Mode</span></div>
  <div class="term-row"><span class="term-cmd">fx [mode]</span><span>สลับเอฟเฟกต์พื้นหลัง (particles / matrix / starfield)</span></div>
  <div class="term-row"><span class="term-cmd">matrix</span><span>คำสั่งลัดเปิด Matrix Digital Rain</span></div>
  <div class="term-row"><span class="term-cmd">starfield</span><span>คำสั่งลัดเปิด Cyber Warp Starfield</span></div>
  <div class="term-row"><span class="term-cmd">particles</span><span>คำสั่งลัดเปิด 3D Particle Mesh</span></div>
  <div class="term-row"><span class="term-cmd">stats</span><span>สถิติพอร์ตโฟลิโอ, ผลการทดสอบ และเวอร์ชันระบบ</span></div>
  <div class="term-row"><span class="term-cmd">cat &lt;file&gt;</span><span>ดูเนื้อหาไฟล์ (เช่น cat README.md, cat package.json)</span></div>
  <div class="term-row"><span class="term-cmd">date</span><span>แสดงวันและเวลาปัจจุบัน</span></div>
  <div class="term-row"><span class="term-cmd">admin</span><span>เข้าสู่ระบบหลังบ้าน Admin CMS</span></div>
  <div class="term-row"><span class="term-cmd">clear</span><span>ล้างหน้าจอเทอร์มินัล</span></div>
  <div class="term-row"><span class="term-cmd">exit</span><span>ปิดหน้าต่างเทอร์มินัล</span></div>
</div>
`;
    this.printLine(helpText);
  }

  cmdProjects() {
    const projects = window.PORTFOLIO_DATA?.projects || [];
    if (projects.length === 0) {
      this.printLine(`<span class="term-dim">ไม่พบรายการโปรเจคในระบบ</span>`);
      return;
    }

    let out = `<div class="term-highlight" style="margin-bottom: 6px;">📂 ผลงานโปรเจคทั้งหมด (${projects.length} รายการ):</div>`;
    out += `<div class="term-project-grid">`;
    projects.forEach(p => {
      out += `
        <div class="term-proj-item">
          <span class="term-proj-id">#${p.id}</span>
          <span class="term-proj-name">${this.escapeHtml(p.title)}</span>
          <span class="term-proj-cat">[${p.category}]</span>
          <span class="term-dim">| ${(p.tech_stack || []).slice(0, 2).join(', ')}</span>
        </div>
      `;
    });
    out += `</div>`;
    out += `<div class="term-info" style="margin-top: 6px;">พิมพ์ <span class="term-cmd">'open &lt;id&gt;'</span> เพื่อดูรายละเอียดโปรเจค (เช่น <span class="term-cmd">'open 1'</span>)</div>`;
    this.printLine(out);
  }

  cmdOpenProject(idStr) {
    if (!idStr) {
      this.printLine(`<span class="term-error">กรุณาระบุ ID โปรเจค เช่น 'open 1' หรือ 'project 2'</span>`);
      return;
    }

    const id = parseInt(idStr, 10);
    const projects = window.PORTFOLIO_DATA?.projects || [];
    const p = projects.find(item => item.id === id);

    if (!p) {
      this.printLine(`<span class="term-error">ไม่พบโปรเจคหมายเลข #${idStr} (พิมพ์ 'projects' เพื่อดู ID ทั้งหมด)</span>`);
      return;
    }

    this.printLine(`<span class="term-success">🚀 กำลังเปิดโปรเจค: #${p.id} - ${this.escapeHtml(p.title)}...</span>`);
    window.soundFx?.modalOpen?.();
    window.projectsApp?.openProjectModal(p.id);
  }

  cmdSkills() {
    const skills = [
      { name: 'React 18 / Next.js 14', level: '95%', bar: '███████████████████░', cat: 'Frontend' },
      { name: 'TypeScript / JavaScript', level: '92%', bar: '██████████████████░░', cat: 'Language' },
      { name: 'Three.js / WebGL 3D', level: '82%', bar: '████████████████░░░░', cat: 'Creative' },
      { name: 'Tailwind CSS / UI UX', level: '94%', bar: '███████████████████░', cat: 'Styling' },
      { name: 'Node.js / Express', level: '90%', bar: '██████████████████░░', cat: 'Backend' },
      { name: 'Python / FastAPI', level: '85%', bar: '█████████████████░░░', cat: 'Backend' },
      { name: 'PostgreSQL / MongoDB', level: '88%', bar: '█████████████████░░░', cat: 'Database' },
      { name: 'Docker / K8s / Cloud', level: '84%', bar: '████████████████░░░░', cat: 'DevOps' }
    ];

    let out = `<div class="term-highlight" style="margin-bottom: 6px;">⚡ TECHNICAL SKILLS MATRIX:</div>`;
    skills.forEach(s => {
      out += `
        <div class="term-skill-row">
          <span class="term-skill-name">${s.name.padEnd(24, ' ')}</span>
          <span class="term-skill-bar">${s.bar}</span>
          <span class="term-skill-val">${s.level}</span>
          <span class="term-dim">[${s.cat}]</span>
        </div>
      `;
    });
    this.printLine(out);
  }

  cmdBio() {
    const bioText = `
<div class="term-bio-box">
  <div class="term-highlight">👤 KRITSANA KIAT-ANAN (กฤษณะ เกียรติอนันต์)</div>
  <div class="term-dim">Role: Senior Full-Stack Developer & Creative Web Engineer</div>
  <div class="term-dim">Location: Bangkok, Thailand (Open for Remote Worldwide)</div>
  <div class="term-dim">Experience: 5+ Years in Full-Stack & 3D Web Systems</div>
  <p style="margin-top: 8px; color: var(--text-main);">
    ผู้พัฒนาเว็บแอปพลิเคชันและซอฟต์แวร์ระดับมืออาชีพที่หลงใหลในการผสมผสานสถาปัตยกรรมระบบที่มั่นคง 
    (High Performance & Clean Code) เข้ากับประสบการณ์ 3D Interactive Graphics ล้ำสมัย
  </p>
</div>
`;
    this.printLine(bioText);
  }

  cmdContact() {
    const contactText = `
<div class="term-table">
  <div class="term-row"><span class="term-highlight">Email:</span><span><a href="mailto:contact@kritsana.dev" class="term-link">contact@kritsana.dev</a></span></div>
  <div class="term-row"><span class="term-highlight">GitHub:</span><span><a href="https://github.com" target="_blank" class="term-link">github.com/kritsana-dev</a></span></div>
  <div class="term-row"><span class="term-highlight">LinkedIn:</span><span><a href="https://linkedin.com" target="_blank" class="term-link">linkedin.com/in/kritsana-dev</a></span></div>
  <div class="term-row"><span class="term-highlight">LINE / Phone:</span><span>+66 89-123-4567</span></div>
</div>
`;
    this.printLine(contactText);
  }

  cmdTheme(target) {
    if (!target) {
      window.toggleTheme?.();
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      this.printLine(`<span class="term-success">🎨 สลับธีมเป็น: ${current.toUpperCase()} แล้ว</span>`);
      return;
    }

    const t = target.toLowerCase();
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('portfolio-theme', t);
      window.updateThemeIcon?.(t);
      this.printLine(`<span class="term-success">🎨 เปลี่ยนธีมเป็น ${t.toUpperCase()} สำเร็จ!</span>`);
    } else {
      this.printLine(`<span class="term-error">การระบุธีมไม่ถูกต้อง: เลือก 'dark' หรือ 'light'</span>`);
    }
  }

  cmdFx(mode) {
    if (!mode) {
      this.printLine(`<span class="term-info">โหมดปัจจุบัน: ${window.particleNetwork?.getMode() || 'particles'} (ระบุ: 'fx particles', 'fx matrix', หรือ 'fx starfield')</span>`);
      return;
    }
    const m = mode.toLowerCase();
    if (['particles', 'matrix', 'starfield'].includes(m)) {
      window.particleNetwork?.setMode?.(m);
      this.printLine(`<span class="term-success">✨ เปลี่ยนเอฟเฟกต์พื้นหลังเป็น ${m} เรียบร้อย!</span>`);
    } else {
      this.printLine(`<span class="term-error">ไม่พบโหมด '${mode}'. ตัวเลือกที่รองรับ: particles, matrix, starfield</span>`);
    }
  }

  cmdStats() {
    const projects = window.PORTFOLIO_DATA?.projects || [];
    const statsHtml = `
<div class="term-highlight" style="margin-bottom: 6px;">📊 SYSTEM & PORTFOLIO METRICS:</div>
<div class="term-table">
  <div class="term-row"><span class="term-dim">Total Projects:</span><span class="term-success">${projects.length} Showcases Live</span></div>
  <div class="term-row"><span class="term-dim">Core Technologies:</span><span class="term-info">React 18, Three.js, TypeScript, Next.js</span></div>
  <div class="term-row"><span class="term-dim">Test Suite Status:</span><span class="term-success">100% Automated Tests Passing</span></div>
  <div class="term-row"><span class="term-dim">PWA & Offline:</span><span class="term-info">ServiceWorker v2.0 Active</span></div>
  <div class="term-row"><span class="term-dim">Audio Engine:</span><span class="term-info">Web Audio API Synth Active</span></div>
  <div class="term-row"><span class="term-dim">Terminal Engine:</span><span class="term-highlight">v2.4.0 Online (0 latency)</span></div>
</div>
`;
    this.printLine(statsHtml);
  }

  cmdCat(filename) {
    if (!filename) {
      this.printLine(`<span class="term-error">cat: กรุณาระบุชื่อไฟล์ เช่น 'cat README.md' หรือ 'cat package.json'</span>`);
      return;
    }

    const fn = filename.toLowerCase();
    if (fn === 'readme.md' || fn === 'readme') {
      this.printLine(`<span class="term-dim"># Kritsana 3D Showcase Portfolio\nModern Interactive Full-Stack Portfolio with WebGL 3D, Terminal CLI, Command Palette, and Device Simulator.</span>`);
    } else if (fn === 'package.json') {
      this.printLine(`<span class="term-dim">{\n  "name": "cyber-3d-portfolio",\n  "version": "2.4.0",\n  "author": "Kritsana Kiat-anan",\n  "license": "MIT"\n}</span>`);
    } else if (fn === 'secrets.txt' || fn === '.env') {
      this.printLine(`<span class="term-error">🔒 Access Denied: Nice try, hacker! 😉 All secrets are encrypted in the quantum vault.</span>`);
    } else {
      this.printLine(`<span class="term-error">cat: ${this.escapeHtml(filename)}: No such file or directory</span>`);
    }
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
window.toggleTerminal = function(forceOpen) {
  if (!window.cyberTerminal) return;
  if (typeof forceOpen === 'boolean') {
    if (forceOpen) window.cyberTerminal.open();
    else window.cyberTerminal.close();
  } else {
    window.cyberTerminal.toggle();
  }
};

window.openTerminal = function() {
  window.cyberTerminal?.open();
};

window.closeTerminal = function() {
  window.cyberTerminal?.close();
};

document.addEventListener('DOMContentLoaded', () => {
  window.cyberTerminal = new CyberTerminal();
});
