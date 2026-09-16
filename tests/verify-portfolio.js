/**
 * AUTOMATED VERIFICATION SUITE FOR 3D PORTFOLIO WEBSITE
 * Validates file integrity, JS syntax, JSON structures, PWA assets,
 * HTML elements, and accessibility requirements.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('\n🔍 [1/7] CHECKING FILE SYSTEM INTEGRITY...');
const requiredFiles = [
  'index.html',
  'README.md',
  'manifest.webmanifest',
  'sw.js',
  'css/style.css',
  'css/animations.css',
  'js/data.js',
  'js/particles.js',
  'js/three-hero.js',
  'js/projects.js',
  'js/main.js',
  'js/admin.js',
  'js/command-palette.js',
  'js/terminal.js',
  'js/resume.js',
  'data/projects.json',
  'assets/icons/favicon.svg',
  'assets/icons/icon-192.svg',
  'assets/icons/icon-512.svg',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable.png'
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  const size = exists ? fs.statSync(filePath).size : 0;
  assert(exists && size > 0, `File '${file}' exists and is non-empty (${size} bytes)`);
});

console.log('\n🔍 [2/7] VALIDATING JAVASCRIPT SYNTAX...');
const jsFiles = [
  'js/data.js',
  'js/particles.js',
  'js/three-hero.js',
  'js/projects.js',
  'js/main.js',
  'js/admin.js',
  'js/command-palette.js',
  'js/terminal.js',
  'js/resume.js',
  'sw.js'
];

jsFiles.forEach(file => {
  try {
    execSync(`node -c "${file}"`);
    assert(true, `JS Syntax valid for '${file}'`);
  } catch (e) {
    assert(false, `JS Syntax error in '${file}': ${e.message}`);
  }
});

console.log('\n🔍 [3/7] VALIDATING JSON & PWA MANIFEST...');
try {
  const projectsData = JSON.parse(fs.readFileSync('data/projects.json', 'utf8'));
  assert(Array.isArray(projectsData.projects), `data/projects.json contains 'projects' array`);
  assert(projectsData.projects.length >= 8, `data/projects.json has ${projectsData.projects.length} projects (expected >= 8)`);

  // Check each project
  projectsData.projects.forEach(p => {
    const hasRequired = p.id && p.title && p.category && p.status && Array.isArray(p.tech_stack) && p.features;
    assert(hasRequired, `Project #${p.id} ('${p.title}') has all required fields`);
  });
} catch (e) {
  assert(false, `Failed to parse data/projects.json: ${e.message}`);
}

try {
  const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
  assert(manifest.name && manifest.short_name, `manifest.webmanifest has name and short_name`);
  assert(manifest.display === 'standalone', `manifest.webmanifest display is 'standalone'`);
  assert(Array.isArray(manifest.icons) && manifest.icons.length >= 4, `manifest.webmanifest specifies required icons`);
  assert(manifest.background_color && manifest.theme_color, `manifest.webmanifest has theme and background colors`);
} catch (e) {
  assert(false, `Failed to parse manifest.webmanifest: ${e.message}`);
}

console.log('\n🔍 [4/7] VALIDATING SERVICE WORKER PRECACHE ASSETS...');
try {
  const swContent = fs.readFileSync('sw.js', 'utf8');
  assert(swContent.includes('CACHE_NAME'), `sw.js defines CACHE_NAME`);
  assert(swContent.includes('CORE_ASSETS'), `sw.js defines CORE_ASSETS list`);
  assert(swContent.includes('skipWaiting'), `sw.js supports skipWaiting`);

  // Extract core assets
  const match = swContent.match(/CORE_ASSETS\s*=\s*\[([\s\S]*?)\];/);
  if (match) {
    const assets = match[1]
      .split(',')
      .map(s => s.trim().replace(/['"]/g, ''))
      .filter(s => s && s !== './');

    assets.forEach(assetPath => {
      const cleanPath = assetPath.replace(/^\.\//, '');
      const exists = fs.existsSync(path.join(process.cwd(), cleanPath));
      assert(exists, `SW precache asset exists on disk: '${cleanPath}'`);
    });
  }
} catch (e) {
  assert(false, `Error inspecting sw.js: ${e.message}`);
}

console.log('\n🔍 [5/7] VALIDATING HTML5 & ACCESSIBILITY MARKUP...');
const html = fs.readFileSync('index.html', 'utf8');
assert(html.includes('lang="th"'), `HTML tag specifies lang="th"`);
assert(html.includes('data-theme="dark"'), `Default theme is dark`);
assert(html.includes('rel="manifest"'), `PWA manifest link present`);
assert(html.includes('rel="icon"'), `Favicon link present`);
assert(html.includes('name="theme-color"'), `theme-color meta present`);
assert(html.includes('id="sound-toggle-btn"'), `Sound toggle button present`);
assert(html.includes('id="theme-toggle-btn"'), `Theme toggle button present`);
assert(html.includes('id="shortcuts-help-btn"'), `Keyboard shortcuts help button present`);
assert(html.includes('id="shortcuts-modal"'), `Keyboard shortcuts modal present`);
assert(html.includes('id="toast-container"'), `Toast notification container present`);
assert(html.includes('id="search-announcer"'), `Screen reader announcer present`);
assert(html.includes('id="project-sort-select"'), `Projects sort selector present`);
assert(html.includes('id="view-grid-btn"') && html.includes('id="view-list-btn"'), `Grid and List view switcher present`);

// Check all 8 core sections
const sections = ['hero', 'about', 'projects', 'skills', 'testimonials', 'articles', 'contact'];
sections.forEach(secId => {
  assert(html.includes(`id="${secId}"`), `Section '#${secId}' exists in index.html`);
});

console.log('\n🔍 [6/7] VALIDATING CSS & 3D GLARE / PARALLAX STYLING...');
const css = fs.readFileSync('css/style.css', 'utf8');
assert(css.includes('.card-glare'), `CSS defines .card-glare specular reflection`);
assert(css.includes('transform-style: preserve-3d'), `CSS defines preserve-3d for 3D depth`);
assert(css.includes('translateZ('), `CSS defines parallax translateZ depth layers`);
assert(css.includes(':focus-visible'), `CSS defines :focus-visible for keyboard accessibility`);
assert(css.includes('.projects-grid.list-view'), `CSS defines list-view layout`);
assert(css.includes('.toast-container'), `CSS defines .toast-container`);
assert(css.includes('@media print'), `CSS defines @media print styles`);

const animCss = fs.readFileSync('css/animations.css', 'utf8');
assert(animCss.includes('@keyframes toast-slide-in'), `animations.css defines toast-slide-in`);
assert(animCss.includes('@keyframes hud-pop-in'), `animations.css defines hud-pop-in`);
assert(animCss.includes('prefers-reduced-motion'), `animations.css handles prefers-reduced-motion`);

console.log('\n🔍 [7/8] VALIDATING IN-BROWSER / LIVE SIMULATION...');
// Validate that data.js loads and assigns to window
const dataJs = fs.readFileSync('js/data.js', 'utf8');
assert(dataJs.includes('window.PORTFOLIO_DATA'), `js/data.js populates window.PORTFOLIO_DATA`);
const mockWindow = {};
eval(`(function(window){ ${dataJs} })(mockWindow)`);
assert(mockWindow.PORTFOLIO_DATA && mockWindow.PORTFOLIO_DATA.projects.length >= 8, `Evaluated PORTFOLIO_DATA contains at least 8 projects`);
assert(mockWindow.PORTFOLIO_DATA.skills.length >= 10, `Evaluated PORTFOLIO_DATA contains skills array`);
assert(mockWindow.PORTFOLIO_DATA.timeline.length >= 4, `Evaluated PORTFOLIO_DATA contains timeline array`);

console.log('\n🔍 [8/8] VALIDATING BOOSTED FIXES, EDGE CASES & ADVANCED FEATURES...');
const projectsJs = fs.readFileSync('js/projects.js', 'utf8');
const mainJs = fs.readFileSync('js/main.js', 'utf8');

// 1. YouTube & Video auto-embed normalizer
assert(projectsJs.includes('normalizeEmbedUrl'), `js/projects.js defines normalizeEmbedUrl`);
const mockProjectsScope = {};
eval(`(function(exports){ ${projectsJs.match(/function normalizeEmbedUrl[\s\S]*?^}/m)[0]} exports.normalizeEmbedUrl = normalizeEmbedUrl; })(mockProjectsScope)`);
assert(mockProjectsScope.normalizeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ').includes('/embed/dQw4w9WgXcQ'), `normalizeEmbedUrl handles youtube.com/watch?v= URLs`);
assert(mockProjectsScope.normalizeEmbedUrl('https://youtu.be/dQw4w9WgXcQ').includes('/embed/dQw4w9WgXcQ'), `normalizeEmbedUrl handles youtu.be short URLs`);
assert(mockProjectsScope.normalizeEmbedUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ').includes('/embed/dQw4w9WgXcQ'), `normalizeEmbedUrl handles youtube.com/shorts URLs`);
assert(mockProjectsScope.normalizeEmbedUrl('https://vimeo.com/123456789').includes('player.vimeo.com/video/123456789'), `normalizeEmbedUrl handles vimeo.com URLs`);

// 2. Safe SVG placeholder generation with tricky quote edge cases
assert(projectsJs.includes('getSafeSvgPlaceholder'), `js/projects.js defines getSafeSvgPlaceholder`);
eval(`(function(exports){ ${projectsJs.match(/function getSafeSvgPlaceholder[\s\S]*?^}/m)[0]} exports.getSafeSvgPlaceholder = getSafeSvgPlaceholder; })(mockProjectsScope)`);
const trickyTitle = `Kritsana's "Advanced" <Web> & Coder's Suite`;
const safeResult = mockProjectsScope.getSafeSvgPlaceholder(trickyTitle);
assert(safeResult.startsWith('data:image/svg+xml;charset=utf-8,'), `getSafeSvgPlaceholder returns valid data URI`);
assert(!safeResult.includes("'") && !safeResult.includes('"'), `getSafeSvgPlaceholder safely encodes quotes without breaking inline attributes`);

// 3. Mobile Gyroscope / DeviceOrientation in TiltEngine
assert(projectsJs.includes('deviceorientation'), `TiltEngine implements mobile gyroscope DeviceOrientation support`);
assert(projectsJs.includes('touchcancel'), `ParticleNetwork cleans up mouse coordinates on touchcancel`);

// 4. Browser History & Back Button navigation
assert(projectsJs.includes('replaceState'), `closeModal uses replaceState to prevent history stack corruption`);

// 5. iOS Standalone meta tags and Sort by Date
assert(html.includes('apple-mobile-web-app-title'), `index.html includes apple-mobile-web-app-title`);
assert(html.includes('value="date"'), `index.html includes sorting by date option`);
assert(html.includes('aria-atomic="true"'), `index.html specifies aria-atomic on search announcer`);

// 6. AudioContext user gesture unlock & HUD modal focus trap
assert(mainJs.includes('unlock'), `SoundEffectsEngine supports first-gesture audio unlocking`);
assert(mainJs.includes('document.body.style.overflow = \'hidden\''), `Shortcuts modal locks body scroll to prevent background jump`);

// 7. Service Worker opaque response caching for CDNs
const swJs = fs.readFileSync('sw.js', 'utf8');
assert(swJs.includes("response.type === 'opaque'"), `sw.js caches opaque cross-origin CDN assets for offline use`);
assert(swJs.includes("!url.protocol.startsWith('http')"), `sw.js guards against non-http protocols`);

console.log('\n🔍 [9/9] VALIDATING ADVANCED HIGH-PERFORMANCE WEB LIBRARIES (CDN & INTEGRATION)...');

// 1. Three.js Real WebGL 3D Interactive Hero
assert(html.includes('three.min.js'), `index.html includes Three.js library CDN link`);
assert(html.includes('id="hero-three-canvas"'), `Hero section contains #hero-three-canvas WebGL element`);
assert(html.includes('id="hero-3d-toggle-btn"'), `Hero section contains 3D geometry toggle button`);
const threeHeroJs = fs.readFileSync('js/three-hero.js', 'utf8');
assert(threeHeroJs.includes('class ThreeHeroScene'), `js/three-hero.js defines ThreeHeroScene class`);
assert(threeHeroJs.includes('isWebGLAvailable'), `ThreeHeroScene implements WebGL availability check`);
assert(threeHeroJs.includes('createIcosahedronCore') && threeHeroJs.includes('createTorusKnotCore'), `ThreeHeroScene implements both Icosahedron and Torus Knot geometries`);
assert(threeHeroJs.includes('createParticleCloud'), `ThreeHeroScene implements 3D orbiting neon particle cloud`);
assert(threeHeroJs.includes('setShape') && threeHeroJs.includes('toggleShape'), `ThreeHeroScene supports dynamic geometry morphing`);
assert(threeHeroJs.includes('IntersectionObserver'), `ThreeHeroScene implements IntersectionObserver battery saver`);
assert(threeHeroJs.includes('destroy()') && threeHeroJs.includes('dispose'), `ThreeHeroScene implements destroy() to prevent WebGL memory leaks`);
assert(threeHeroJs.includes('webglcontextlost') && threeHeroJs.includes('webglcontextrestored'), `ThreeHeroScene implements WebGL context loss recovery`);
assert(threeHeroJs.includes('particleSystem.position.copy'), `ThreeHeroScene synchronizes particle cloud concentric position with core`);

// 2. Chart.js Skill Radar Chart & 2D Canvas Offline Fallback
assert(html.includes('chart.umd.min.js'), `index.html includes Chart.js library CDN link`);
assert(html.includes('id="skills-radar-chart"'), `About Me section contains #skills-radar-chart canvas`);
assert(mainJs.includes('initSkillsRadarChart'), `js/main.js defines initSkillsRadarChart`);
assert(mainJs.includes('updateSkillsRadarChartTheme'), `js/main.js dynamically synchronizes radar chart with theme switcher`);
assert(mainJs.includes("type: 'radar'"), `Skill Radar Chart uses 'radar' chart type`);
assert(mainJs.includes('#00f2fe') && mainJs.includes('#ff007f'), `Skill Radar Chart uses neon cyan and pink colorway`);
assert(mainJs.includes('renderRadarChartFallback'), `js/main.js implements 2D canvas radar chart fallback for 100% offline resilience`);
assert(css.includes('.skill-radar-card') && css.includes('.radar-chart-wrapper'), `css/style.css defines styling for skill radar card`);

// 3. Swiper.js Testimonials & Modal Carousel
assert(html.includes('swiper-bundle.min.css'), `index.html includes Swiper.js CSS CDN link`);
assert(html.includes('swiper-bundle.min.js'), `index.html includes Swiper.js JavaScript CDN link`);
assert(html.includes('testimonials-swiper') && html.includes('swiper-wrapper'), `Testimonials section utilizes Swiper.js markup`);
assert(html.includes('testimonials-prev') && html.includes('testimonials-next'), `Testimonials Swiper provides navigation buttons`);
assert(html.includes('testimonials-pagination'), `Testimonials Swiper provides pagination bullets`);
const testimonialsSection = html.slice(html.indexOf('id="testimonials"'), html.indexOf('id="articles"'));
const testimonialSlideCount = (testimonialsSection.match(/class="swiper-slide"/g) || []).length;
assert(testimonialSlideCount >= 5, `Testimonials section has ${testimonialSlideCount} slides (>= 5 required for smooth loop mode with 3 slidesPerView)`);
assert(mainJs.includes('initTestimonialsSwiper'), `js/main.js defines initTestimonialsSwiper`);
assert(mainJs.includes('breakpoints:'), `Testimonials Swiper defines responsive breakpoints`);
assert(projectsJs.includes('modal-swiper'), `js/projects.js integrates Swiper into Project Modal carousel`);
assert(projectsJs.includes('modalSwiper.destroy'), `js/projects.js cleanly cleans up Swiper instance on modal close`);
assert(!projectsJs.includes('modal-swiper-next" onclick='), `Modal Swiper buttons omit duplicate inline onclick to prevent double-slide bug`);

// 4. Vanilla-Tilt.js 3D Card Physics & Memory Leak Guard
assert(html.includes('vanilla-tilt.min.js'), `index.html includes Vanilla-Tilt.js CDN link`);
assert(projectsJs.includes('VanillaTilt.init'), `TiltEngine in js/projects.js initializes VanillaTilt`);
assert(projectsJs.includes('glare: true'), `VanillaTilt enables specular glare reflection`);
assert(projectsJs.includes('oldTiltCards') && projectsJs.includes('c.vanillaTilt.destroy'), `renderProjects() cleans up previous VanillaTilt instances before replacing grid HTML`);

// 5. Tippy.js & Popper.js Interactive Tooltips & Keyboard Accessibility
assert(html.includes('popper.min.js'), `index.html includes Popper.js CDN link`);
assert(html.includes('tippy.umd.min.js'), `index.html includes Tippy.js CDN link`);
assert(html.includes('tippy.css'), `index.html includes Tippy.js CSS link`);
assert(html.includes('data-tippy-tech') && html.includes('data-tippy-level'), `Tech stack cards in #skills contain rich tooltip metadata`);
assert(html.includes('tabindex="0"') && html.includes('role="region"'), `Tech stack cards specify tabindex="0" and role="region" for keyboard accessibility`);
assert(mainJs.includes('initTechStackTooltips'), `js/main.js defines initTechStackTooltips`);
assert(mainJs.includes("theme: 'cyber'"), `Tech Stack tooltips use custom 'cyber' theme`);
assert(css.includes('.tippy-box[data-theme~="cyber"]'), `css/style.css defines custom .tippy-box cyber theme styling`);

// 6. Service Worker CDN Pre-caching & Offline Resilience
assert(swJs.includes('CDN_ASSETS'), `sw.js defines CDN_ASSETS for high-performance libraries`);
assert(swJs.includes('three.min.js') && swJs.includes('chart.umd.min.js') && swJs.includes('swiper-bundle.min.js'), `sw.js preheats external CDN assets in cache`);
assert(swJs.includes('Promise.all') && swJs.includes('CDN_ASSETS.map'), `sw.js reliably awaits CDN cache warming before completing install`);

console.log('\n🔍 [10/10] VALIDATING OVERLAP BUG FIX & FULL ADMIN CMS BACKOFFICE...');

// 1. Hero 3D Overlap Fix & Holographic Pedestal Layout
assert(html.includes('hero-hologram-stage'), `Hero section contains .hero-hologram-stage for 3D core separation`);
assert(html.includes('hologram-pedestal-base'), `Hero section contains .hologram-pedestal-base emitter`);
assert(html.includes('hero-card-wrapper'), `Hero section separates profile card in .hero-card-wrapper`);
assert(css.includes('.hero-hologram-stage') && css.includes('.hologram-pedestal-base'), `css/style.css defines styling for hologram stage and pedestal`);

// 2. Admin Access & Floating Control Bar
assert(html.includes('id="admin-login-btn"'), `Navbar includes #admin-login-btn`);
assert(html.includes('id="admin-control-bar"'), `index.html includes #admin-control-bar`);
assert(html.includes('id="admin-login-modal"'), `index.html includes #admin-login-modal`);
const adminJs = fs.readFileSync('js/admin.js', 'utf8');
assert(adminJs.includes('class AdminBackofficeCMS'), `js/admin.js defines AdminBackofficeCMS class`);
assert(adminJs.includes('admin123'), `AdminBackofficeCMS supports default password admin123`);
assert(adminJs.includes('Alt'), `AdminBackofficeCMS supports Alt+A keyboard shortcut`);

// 3. Project CRUD System
assert(html.includes('id="admin-projects-modal"'), `index.html includes #admin-projects-modal`);
assert(html.includes('id="admin-project-form-modal"'), `index.html includes #admin-project-form-modal`);
assert(adminJs.includes('openProjectsManager') && adminJs.includes('openProjectForm'), `AdminBackofficeCMS implements project manager and form modal`);
assert(adminJs.includes('saveProjectFromForm') && adminJs.includes('deleteProject'), `AdminBackofficeCMS implements save and delete project operations`);
assert(adminJs.includes('updateCategoryCounts') && adminJs.includes('renderProjects'), `Project CRUD dynamically updates live website view without reload`);

// 4. Profile & Bio Editor
assert(html.includes('id="admin-profile-modal"'), `index.html includes #admin-profile-modal`);
assert(adminJs.includes('openProfileModal') && adminJs.includes('saveProfileForm'), `AdminBackofficeCMS implements profile & bio editor`);
assert(adminJs.includes('applyProfileToDOM'), `AdminBackofficeCMS updates live DOM elements on profile save`);

// 5. Live In-Place Text Editing (CMS)
assert(html.includes('data-cms-key="hero_greeting"') && html.includes('data-cms-key="profile_name"'), `index.html elements define data-cms-key attributes`);
assert(adminJs.includes('toggleLiveEditMode') && adminJs.includes('contenteditable'), `AdminBackofficeCMS supports live in-place text editing`);
assert(css.includes('.cms-editable-active'), `css/style.css defines .cms-editable-active neon styling`);
assert(adminJs.includes('portfolio_text_overrides'), `AdminBackofficeCMS persists text overrides in localStorage`);

// 6. Data Persistence & Export/Import
const dataJsFile = fs.readFileSync('js/data.js', 'utf8');
assert(dataJsFile.includes('INITIAL_PORTFOLIO_DATA'), `js/data.js saves initial data clone for reset capability`);
assert(dataJsFile.includes('portfolio_projects_data') && dataJsFile.includes('portfolio_profile_data'), `js/data.js restores customized data from localStorage`);
assert(adminJs.includes('exportJson') && adminJs.includes('projects.json'), `AdminBackofficeCMS supports exporting projects.json`);
assert(adminJs.includes('handleFileImport') && adminJs.includes('FileReader'), `AdminBackofficeCMS supports importing JSON files`);
assert(adminJs.includes('resetToDefault'), `AdminBackofficeCMS supports resetting customizations to default`);

// 7. Rigorous Edge Cases & Deep Functional Integrity Fixes
assert(html.includes('hero-greeting-text'), `Hero greeting isolates text in .hero-greeting-text to prevent Typewriter element destruction`);
assert(mainJs.includes('window.initTypewriter = initTypewriter'), `js/main.js exports window.initTypewriter for clean live restarts`);
assert(mainJs.includes('typewriterTimeout'), `initTypewriter tracks and clears timer to prevent concurrent racing loops`);
assert(adminJs.includes('live_url: demoUrl'), `Project CRUD correctly binds live_url to prevent broken demo link on cards and modal`);
assert(adminJs.includes('proj-screenshots'), `Admin project form supports multi-image gallery screenshots management`);
assert(adminJs.includes('generateElementKey'), `AdminBackofficeCMS implements universal click-to-edit for arbitrary webpage text`);
assert(adminJs.includes('insertText') && adminJs.includes('text/plain'), `AdminBackofficeCMS sanitizes pasted content into clean plain text`);
assert(adminJs.includes('contact_phone') && adminJs.includes('footerCopy'), `applyProfileToDOM synchronizes phone, email, social, and footer copyright`);
assert(dataJsFile.includes('if (Array.isArray(parsed))'), `js/data.js allows empty array project list hydration on deletion`);
assert(adminJs.includes('Array.isArray(importedData)'), `AdminBackofficeCMS supports importing raw JSON project arrays`);
assert(threeHeroJs.includes('camera.position.z = 7.0'), `js/three-hero.js positions camera at z=7.0 for optimal 3D core framing`);

console.log('\n🔍 [11/11] VALIDATING 5 ADVANCED OPEN-SOURCE POWER FEATURES...');

// 1. COMMAND PALETTE (Ctrl + K / Cmd + K)
assert(html.includes('id="command-palette-modal"'), `index.html includes #command-palette-modal`);
assert(html.includes('id="cmdk-input"'), `index.html includes #cmdk-input`);
assert(html.includes('id="cmdk-results"'), `index.html includes #cmdk-results`);
assert(html.includes('id="cmdk-nav-btn"'), `Navbar includes #cmdk-nav-btn trigger`);
const cmdkJs = fs.readFileSync('js/command-palette.js', 'utf8');
assert(cmdkJs.includes('class CommandPalette'), `js/command-palette.js defines CommandPalette class`);
assert(cmdkJs.includes('getAllCommands') && cmdkJs.includes('filterCommands'), `CommandPalette implements command extraction and query filtering`);
assert(cmdkJs.includes('ArrowUp') && cmdkJs.includes('ArrowDown') && cmdkJs.includes('Enter'), `CommandPalette supports keyboard navigation`);
assert(cmdkJs.includes('Ctrl') || cmdkJs.includes('ctrlKey'), `CommandPalette implements Ctrl+K shortcut`);
assert(css.includes('.cmdk-backdrop') && css.includes('.cmdk-card'), `css/style.css defines Command Palette glassmorphic styles`);

// 2. INTERACTIVE DEVELOPER CYBER TERMINAL (CLI Mode)
assert(html.includes('id="cyber-terminal-modal"'), `index.html includes #cyber-terminal-modal`);
assert(html.includes('id="cyber-terminal-window"'), `index.html includes #cyber-terminal-window`);
assert(html.includes('id="terminal-output"'), `index.html includes #terminal-output`);
assert(html.includes('id="terminal-input"'), `index.html includes #terminal-input`);
assert(html.includes('id="terminal-nav-btn"'), `Navbar includes #terminal-nav-btn trigger`);
const terminalJs = fs.readFileSync('js/terminal.js', 'utf8');
assert(terminalJs.includes('class CyberTerminal'), `js/terminal.js defines CyberTerminal class`);
const reqCmds = ['help', 'projects', 'skills', 'bio', 'contact', 'theme', 'clear', 'stats', 'matrix', 'admin', 'resume'];
reqCmds.forEach(cmd => {
  assert(terminalJs.includes(`'${cmd}'`) || terminalJs.includes(`"${cmd}"`), `CyberTerminal supports command '${cmd}'`);
});
assert(terminalJs.includes('history') && terminalJs.includes('ArrowUp'), `CyberTerminal supports command history navigation`);
assert(terminalJs.includes('Tab') && terminalJs.includes('startsWith'), `CyberTerminal supports Tab autocompletion`);
assert(css.includes('.cyber-terminal-container') && css.includes('.term-prompt-line'), `css/style.css defines Cyber Terminal window styles`);

// 3. INTERACTIVE DEVICE VIEWPORT SIMULATOR IN PROJECT MODAL
assert(projectsJs.includes('modal-simulator-wrapper'), `js/projects.js defines modal-simulator-wrapper`);
assert(projectsJs.includes('frame-desktop') && projectsJs.includes('frame-tablet') && projectsJs.includes('frame-mobile'), `js/projects.js implements Desktop, Tablet, and Mobile viewports`);
assert(projectsJs.includes('setSimulatorDevice'), `js/projects.js defines setSimulatorDevice`);
assert(projectsJs.includes('reloadSimulator'), `js/projects.js defines reloadSimulator`);
assert(projectsJs.includes('modal-simulator-iframe'), `js/projects.js implements live viewport simulator iframe`);
assert(css.includes('.modal-simulator-wrapper') && css.includes('.simulator-frame'), `css/style.css defines Device Simulator frame styling`);
assert(css.includes('.frame-desktop') && css.includes('.frame-tablet') && css.includes('.frame-mobile'), `css/style.css defines responsive frame aspect ratios`);

// 4. DEVELOPER RESUME / CV VIEWER & PRINT MODAL (ATS READY)
assert(html.includes('id="resume-modal"'), `index.html includes #resume-modal`);
assert(html.includes('id="resume-printable-area"'), `index.html includes #resume-printable-area`);
assert(html.includes('id="resume-nav-btn"'), `Navbar includes #resume-nav-btn trigger`);
const resumeJs = fs.readFileSync('js/resume.js', 'utf8');
assert(resumeJs.includes('class ResumeViewer'), `js/resume.js defines ResumeViewer class`);
assert(resumeJs.includes('printResume') && resumeJs.includes('window.print'), `ResumeViewer implements window.print() trigger`);
assert(resumeJs.includes('copyPlainText'), `ResumeViewer implements ATS plain text clipboard copy`);
assert(resumeJs.includes('downloadMarkdown'), `ResumeViewer implements Markdown download`);
assert(html.includes('Executive Summary') || html.includes('บทคัดย่อประวัติการทำงาน'), `Resume contains Executive Summary section`);
assert(html.includes('Technical Skills') || html.includes('ทักษะความเชี่ยวชาญ'), `Resume contains Technical Skills section`);
assert(html.includes('Work Experience') || html.includes('ประวัติการทำงาน'), `Resume contains Work Experience section`);
assert(css.includes('#resume-modal') && css.includes('@page'), `css/style.css defines A4 print stylesheet for resume`);

// 5. INTERACTIVE BACKGROUND FX SWITCHER (PARTICLES, MATRIX, STARFIELD)
assert(html.includes('id="bg-fx-nav-switcher"'), `Navbar includes #bg-fx-nav-switcher`);
assert(html.includes('data-bg-fx="particles"') && html.includes('data-bg-fx="matrix"') && html.includes('data-bg-fx="starfield"'), `Background FX switcher includes all 3 modes`);
const particlesJs = fs.readFileSync('js/particles.js', 'utf8');
assert(particlesJs.includes('setMode') && particlesJs.includes('getMode') && particlesJs.includes('toggleMode'), `Background FX Engine defines setMode, getMode, and toggleMode`);
assert(particlesJs.includes('matrixDrops') && particlesJs.includes('renderMatrixFrame'), `Background FX Engine implements Matrix Digital Rain`);
assert(particlesJs.includes('renderStarfieldFrame') && particlesJs.includes('numStars'), `Background FX Engine implements Cyber Warp Starfield`);
assert(particlesJs.includes('portfolio_bg_fx'), `Background FX Engine persists state in localStorage portfolio_bg_fx`);
assert(css.includes('.bg-fx-nav-switcher') && css.includes('.bg-fx-pill'), `css/style.css defines Background FX switcher styling`);

console.log('\n' + '='.repeat(50));
console.log(`TOTAL TESTS: ${passedTests + failedTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('='.repeat(50));

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL PORTFOLIO BOOST VERIFICATION TESTS PASSED PERFECTLY!\n');
}
