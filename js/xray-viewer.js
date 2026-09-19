/**
 * INTERACTIVE MEDICAL X-RAY & DICOM VIEWER SIMULATOR
 * พัฒนาโดย: ภูมิภัทร สว่างเวียง (Phumphat Sawangwiang)
 * สาขาวิชารังสีเทคนิค วิทยาลัยเทคโนโลยีทางการแพทย์และสาธารณสุข กาญจนาภิเษก (วทก.)
 * 
 * ฟีเจอร์:
 * - Real Radiographic Datasets (Chest PA, Abdomen KUB, Cervical Spine Lateral)
 * - Window Width (Contrast) & Window Level (Brightness) Real-time Processing
 * - Invert Grayscale Mode (Bone White / Film Negative)
 * - Interactive Magnifier Loupe Lens (2.5x Zoom with Crosshair)
 * - Collimator Beam Grid (Central Ray & Ruler Overlay)
 * - Anatomical Landmark Pins with Clinical Descriptions
 * - Preset Quick Windows (Bone, Soft Tissue, Invert, Normal)
 */

class XRayViewer {
  constructor() {
    this.datasets = {
      chest: {
        id: 'chest',
        name: 'Chest PA (ภาพรังสีทรวงอก)',
        src: 'assets/projects/radpose-chest.jpg',
        technique: '110 kVp | 3.2 mAs',
        distance: 'SID 180 cm (72 in)',
        position: 'ท่ายืน หายใจเข้าเต็มที่ (Erect PA Insp.)',
        description: 'การตรวจประเมินภาวะปอด, เส้นขอบหัวใจ, และกระดูกซี่โครงตามเกณฑ์มาตรฐานรังสีเทคนิค',
        landmarks: [
          { name: 'Trachea', th: 'หลอดลมคอ (กึ่งกลาง)', x: 50, y: 18 },
          { name: 'Aortic Knob', th: 'ส่วนโค้งหลอดเลือดเอออร์ตา', x: 56, y: 33 },
          { name: 'Carina', th: 'จุดแยกหลอดลมซ้าย-ขวา', x: 50, y: 36 },
          { name: 'Cardiac Silhouette', th: 'เงาหัวใจ (Cardiothoracic Ratio)', x: 57, y: 56 },
          { name: 'Right Hemidiaphragm', th: 'กะบังลมขวา (ระดับ Rib 10 หลัง)', x: 32, y: 74 },
          { name: 'Left Hemidiaphragm', th: 'กะบังลมซ้าย', x: 68, y: 78 },
          { name: 'Costophrenic Angle', th: 'มุมกระดูกซี่โครงกะบังลม (คมชัด)', x: 19, y: 80 }
        ]
      },
      abdomen: {
        id: 'abdomen',
        name: 'Abdomen KUB (ภาพรังสีช่องท้อง)',
        src: 'assets/projects/radpose-abdomen.jpg',
        technique: '75 kVp | 24 mAs',
        distance: 'SID 100 cm (40 in)',
        position: 'ท่านอนหงาย หายใจออกหมด (Supine AP Expir.)',
        description: 'ประเมินก้อนนิ่วในระบบทางเดินปัสสาวะ, ลมอิสระในช่องท้อง, และแนวกล้ามเนื้อ Psoas',
        landmarks: [
          { name: 'Liver Shadow', th: 'เงาตับ (Right Hypochondrium)', x: 26, y: 24 },
          { name: 'Lumbar Spine (L1-L5)', th: 'แนวกระดูกสันหลังส่วนเอว', x: 50, y: 46 },
          { name: 'Psoas Margin', th: 'ขอบกล้ามเนื้อโซแอส (bilateral)', x: 63, y: 55 },
          { name: 'Iliac Crest', th: 'ขอบกระดูกเชิงกราน (Landmark L4-L5)', x: 23, y: 72 },
          { name: 'Sacroiliac Joint', th: 'ข้อต่อกระเบนเหน็บและเชิงกราน', x: 42, y: 83 },
          { name: 'Symphysis Pubis', th: 'ขอบล่างกระดูกหัวเหน่า', x: 50, y: 94 }
        ]
      },
      cspine: {
        id: 'cspine',
        name: 'C-Spine Lateral (กระดูกคอด้านข้าง)',
        src: 'assets/projects/radpose-cspine.jpg',
        technique: '68 kVp | 12 mAs',
        distance: 'SID 150 cm (60 in)',
        position: 'ท่ายืนด้านข้าง ไหล่หย่อนลง (Lateral Erect)',
        description: 'การตรวจหารอยแตกร้าว การเคลื่อนตัวของแนวกระดูกคอ C1-C7 และช่อง Prevertebral Space',
        landmarks: [
          { name: 'C1 (Atlas)', th: 'กระดูกคอชิ้นที่ 1 (วงแหวนแอตลาส)', x: 52, y: 20 },
          { name: 'C2 Dens (Axis)', th: 'ยอดเดนส์กระดูกคอชิ้นที่ 2', x: 50, y: 28 },
          { name: 'Vertebral Body C4', th: 'ตัวกระดูกคอ C4 (จุดอ้างอิง)', x: 48, y: 48 },
          { name: 'Intervertebral Disc Space', th: 'ช่องว่างหมอนรองกระดูกคอ', x: 47, y: 58 },
          { name: 'C7 Vertebra Prominens', th: 'กระดูกคอชิ้นที่ 7 (ปุ่มยื่นยาวเด่น)', x: 43, y: 78 },
          { name: 'Spinous Process', th: 'แนวกระดูกหนามสันคอ', x: 26, y: 58 }
        ]
      }
    };

    this.currentId = 'chest';
    this.windowWidth = 100; // Contrast: 20 - 250%
    this.windowLevel = 100; // Brightness: 20 - 200%
    this.invert = false;
    this.showGrid = true;
    this.showLoupe = false;
    this.showLandmarks = true;

    this.loupeX = 0;
    this.loupeY = 0;
    this.isMouseOver = false;

    this.canvas = null;
    this.ctx = null;
    this.loadedImages = {};

    this.init();
  }

  init() {
    this.canvas = document.getElementById('xray-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.bindEvents();
    this.preloadImages();
    this.updateHUD();
    this.render();
  }

  preloadImages() {
    Object.values(this.datasets).forEach(d => {
      const img = new Image();
      img.onload = () => {
        this.loadedImages[d.id] = img;
        if (d.id === this.currentId) {
          this.render();
        }
      };
      img.onerror = () => {
        console.warn(`[XRayViewer] Failed to load radiographic dataset: ${d.src}`);
        this.loadedImages[d.id] = false;
        if (d.id === this.currentId) {
          this.render();
        }
      };
      img.src = d.src;
    });
  }

  bindEvents() {
    // Sliders
    const contrastSlider = document.getElementById('xray-contrast-slider');
    const brightnessSlider = document.getElementById('xray-brightness-slider');

    if (contrastSlider) {
      contrastSlider.addEventListener('input', (e) => {
        this.windowWidth = parseInt(e.target.value, 10);
        // Clear preset buttons active state since user customized values
        document.querySelectorAll('.xray-preset-btn').forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        });
        this.updateHUD();
        this.render();
      });
    }

    if (brightnessSlider) {
      brightnessSlider.addEventListener('input', (e) => {
        this.windowLevel = parseInt(e.target.value, 10);
        // Clear preset buttons active state since user customized values
        document.querySelectorAll('.xray-preset-btn').forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        });
        this.updateHUD();
        this.render();
      });
    }

    // Canvas Loupe Interaction
    if (this.canvas) {
      const updateLoupeCoords = (e) => {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches && e.touches.length > 0 
          ? e.touches[0] 
          : (e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0] : e);
        if (!touch || typeof touch.clientX !== 'number') return;

        const clientX = touch.clientX;
        const clientY = touch.clientY;

        // Subpixel High-DPI and CSS border-box coordinate calibration
        const dpr = window.devicePixelRatio || 1;
        const logicalW = this.canvas.width / dpr;
        const logicalH = this.canvas.height / dpr;
        const scaleX = rect.width > 0 ? logicalW / rect.width : 1;
        const scaleY = rect.height > 0 ? logicalH / rect.height : 1;

        this.loupeX = (clientX - rect.left) * scaleX;
        this.loupeY = (clientY - rect.top) * scaleY;
        if (this.showLoupe) {
          this.render();
        }
      };

      this.canvas.addEventListener('mousemove', (e) => {
        this.isMouseOver = true;
        updateLoupeCoords(e);
      });

      this.canvas.addEventListener('mouseenter', () => {
        this.isMouseOver = true;
        if (this.showLoupe) this.render();
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.isMouseOver = false;
        if (this.showLoupe) this.render();
      });

      this.canvas.addEventListener('touchstart', (e) => {
        this.isMouseOver = true;
        updateLoupeCoords(e);
      }, { passive: true });

      this.canvas.addEventListener('touchmove', (e) => {
        this.isMouseOver = true;
        updateLoupeCoords(e);
      }, { passive: true });

      this.canvas.addEventListener('touchend', () => {
        this.isMouseOver = false;
        if (this.showLoupe) this.render();
      });

      this.canvas.addEventListener('touchcancel', () => {
        this.isMouseOver = false;
        if (this.showLoupe) this.render();
      });

      // Window resize
      window.addEventListener('resize', () => {
        this.render();
      });
    }
  }

  setDataset(id) {
    if (!this.datasets[id]) return;
    this.currentId = id;

    // Update active tab buttons and ARIA states
    document.querySelectorAll('.xray-dataset-tab').forEach(btn => {
      const isActive = btn.dataset.dataset === id;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    this.updateHUD();
    this.render();
    window.soundFx?.click?.();
  }

  setPreset(preset) {
    const contrastSlider = document.getElementById('xray-contrast-slider');
    const brightnessSlider = document.getElementById('xray-brightness-slider');

    switch (preset) {
      case 'bone':
        this.windowWidth = 170;
        this.windowLevel = 85;
        this.invert = false;
        break;
      case 'soft':
        this.windowWidth = 85;
        this.windowLevel = 120;
        this.invert = false;
        break;
      case 'invert':
        this.windowWidth = 110;
        this.windowLevel = 100;
        this.invert = !this.invert;
        break;
      case 'reset':
      default:
        this.windowWidth = 100;
        this.windowLevel = 100;
        this.invert = false;
        break;
    }

    if (contrastSlider) contrastSlider.value = this.windowWidth;
    if (brightnessSlider) brightnessSlider.value = this.windowLevel;

    // Update preset button active and ARIA pressed states
    document.querySelectorAll('.xray-preset-btn').forEach(btn => {
      const isActive = btn.dataset.preset === preset;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    this.updateHUD();
    this.render();
    window.soundFx?.click?.();
  }

  toggleInvert() {
    this.invert = !this.invert;
    this.updateHUD();
    this.render();
    window.soundFx?.click?.();
  }

  toggleGrid() {
    this.showGrid = !this.showGrid;
    const btn = document.getElementById('xray-toggle-grid-btn');
    if (btn) {
      btn.classList.toggle('active', this.showGrid);
      btn.setAttribute('aria-pressed', this.showGrid ? 'true' : 'false');
    }
    this.render();
    window.soundFx?.click?.();
  }

  toggleLoupe() {
    this.showLoupe = !this.showLoupe;
    const btn = document.getElementById('xray-toggle-loupe-btn');
    if (btn) {
      btn.classList.toggle('active', this.showLoupe);
      btn.setAttribute('aria-pressed', this.showLoupe ? 'true' : 'false');
    }
    this.render();
    window.soundFx?.click?.();
  }

  toggleLandmarks() {
    this.showLandmarks = !this.showLandmarks;
    const btn = document.getElementById('xray-toggle-landmarks-btn');
    if (btn) {
      btn.classList.toggle('active', this.showLandmarks);
      btn.setAttribute('aria-pressed', this.showLandmarks ? 'true' : 'false');
    }
    this.render();
    window.soundFx?.click?.();
  }

  updateHUD() {
    const d = this.datasets[this.currentId];
    if (!d) return;

    // Title & Specs
    const titleEl = document.getElementById('xray-info-title');
    if (titleEl) titleEl.textContent = d.name;

    const techEl = document.getElementById('xray-info-tech');
    if (techEl) techEl.textContent = `${d.technique} • ${d.distance}`;

    const posEl = document.getElementById('xray-info-position');
    if (posEl) posEl.textContent = `${d.position} — ${d.description}`;

    // Readout values
    const contrastVal = document.getElementById('xray-contrast-val');
    if (contrastVal) contrastVal.textContent = `${this.windowWidth}%`;

    const brightnessVal = document.getElementById('xray-brightness-val');
    if (brightnessVal) brightnessVal.textContent = `${this.windowLevel}%`;

    const invertBadge = document.getElementById('xray-invert-badge');
    if (invertBadge) {
      invertBadge.textContent = this.invert ? 'INVERT (BONE BLACK)' : 'STANDARD (BONE WHITE)';
      invertBadge.style.color = this.invert ? 'var(--neon-pink)' : 'var(--neon-cyan)';
    }
  }

  render() {
    if (!this.canvas || !this.ctx) return;

    const d = this.datasets[this.currentId];
    const img = this.loadedImages[this.currentId];

    // Responsive Canvas Resizing
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const displayW = Math.max(rect.width, 320);
    const displayH = Math.min(Math.max(displayW * 0.75, 380), 560);

    const dpr = window.devicePixelRatio || 1;
    if (this.canvas.width !== displayW * dpr || this.canvas.height !== displayH * dpr) {
      this.canvas.width = displayW * dpr;
      this.canvas.height = displayH * dpr;
    }

    const ctx = this.ctx;
    ctx.save();
    ctx.scale(dpr, dpr);

    const w = displayW;
    const h = displayH;

    // 1. Dark Film Background
    ctx.fillStyle = '#060713';
    ctx.fillRect(0, 0, w, h);

    if (img && img.complete && img.naturalWidth > 0) {
      // Compute Fitted Dimensions (Contain)
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = w / h;

      let drawW, drawH, drawX, drawY;
      if (imgAspect > canvasAspect) {
        drawW = w * 0.94;
        drawH = drawW / imgAspect;
        drawX = (w - drawW) / 2;
        drawY = (h - drawH) / 2;
      } else {
        drawH = h * 0.94;
        drawW = drawH * imgAspect;
        drawX = (w - drawW) / 2;
        drawY = (h - drawH) / 2;
      }

      this.currentDrawRect = { x: drawX, y: drawY, w: drawW, h: drawH };

      // 2. Draw Image with CSS Filters on Canvas Context
      ctx.save();
      const contrastFilter = `contrast(${this.windowWidth}%)`;
      const brightnessFilter = `brightness(${this.windowLevel}%)`;
      const invertFilter = this.invert ? 'invert(100%)' : 'invert(0%)';
      ctx.filter = `${contrastFilter} ${brightnessFilter} ${invertFilter} grayscale(100%)`;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      // Film frame border
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(drawX, drawY, drawW, drawH);

      // 3. Collimator Grid & Central Ray
      if (this.showGrid) {
        this.renderCollimatorGrid(ctx, drawX, drawY, drawW, drawH);
      }

      // 4. Anatomical Landmark Pins
      if (this.showLandmarks && d.landmarks) {
        this.renderLandmarks(ctx, drawX, drawY, drawW, drawH, d.landmarks);
      }

      // 5. Magnifier Loupe Lens (2.5x Zoom)
      if (this.showLoupe && this.isMouseOver) {
        this.renderLoupe(ctx, img, drawX, drawY, drawW, drawH);
      }
    } else if (img === false) {
      // Failed State
      ctx.fillStyle = 'rgba(255, 0, 127, 0.9)';
      ctx.font = '14px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FAILED TO LOAD RADIOGRAPHIC DATASET', w / 2, h / 2 - 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '12px Kanit, sans-serif';
      ctx.fillText('ไม่สามารถโหลดภาพฟิล์มเอกซเรย์ได้ กรุณาตรวจสอบการเชื่อมต่อ', w / 2, h / 2 + 14);
    } else {
      // Loading State
      ctx.fillStyle = 'rgba(0, 242, 254, 0.8)';
      ctx.font = '14px Orbitron, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LOADING RADIOGRAPHIC DATASET...', w / 2, h / 2);
    }

    // 6. Cyber Medical HUD Corner Overlays
    this.renderHUDOverlays(ctx, w, h, d);

    ctx.restore();
  }

  renderCollimatorGrid(ctx, x, y, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Grid lines (6x6)
    const stepsX = 6;
    const stepsY = 6;
    for (let i = 1; i < stepsX; i++) {
      const gx = x + (w / stepsX) * i;
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.lineTo(gx, y + h);
      ctx.stroke();
    }
    for (let j = 1; j < stepsY; j++) {
      const gy = y + (h / stepsY) * j;
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + w, gy);
      ctx.stroke();
    }

    // Central Ray Crosshair (Solid Neon Cyan)
    const cx = x + w / 2;
    const cy = y + h / 2;
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.45)';
    ctx.lineWidth = 1.5;

    // Crosshair arms
    ctx.beginPath();
    ctx.moveTo(cx - 24, cy);
    ctx.lineTo(cx + 24, cy);
    ctx.moveTo(cx, cy - 24);
    ctx.lineTo(cx, cy + 24);
    ctx.stroke();

    // Crosshair ring
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();

    // Central Ray Indicator Tag
    ctx.fillStyle = 'rgba(0, 242, 254, 0.85)';
    ctx.font = '10px Kanit, sans-serif';
    ctx.fillText('CENTRAL RAY (CR) ⊥ 90°', cx + 18, cy - 8);

    ctx.restore();
  }

  renderLandmarks(ctx, x, y, w, h, landmarks) {
    ctx.save();
    landmarks.forEach((lm) => {
      const lx = x + (w * lm.x) / 100;
      const ly = y + (h * lm.y) / 100;

      // Outer pulsating glow ring
      ctx.beginPath();
      ctx.arc(lx, ly, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 0, 127, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 0, 127, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center pin
      ctx.beginPath();
      ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ff007f';
      ctx.fill();

      // Landmark label tag
      const isRightSide = lm.x > 55;
      const tagX = isRightSide ? lx + 12 : lx - 12;
      const textAlign = isRightSide ? 'left' : 'right';

      ctx.font = 'bold 11px Kanit, sans-serif';
      ctx.textAlign = textAlign;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(lm.name, tagX, ly - 2);

      ctx.font = '9px Kanit, sans-serif';
      ctx.fillStyle = 'rgba(0, 242, 254, 0.9)';
      ctx.fillText(lm.th, tagX, ly + 10);
      ctx.shadowBlur = 0;
    });
    ctx.restore();
  }

  renderLoupe(ctx, img, drawX, drawY, drawW, drawH) {
    const loupeRadius = 65;
    const zoom = 2.4;
    const lx = this.loupeX;
    const ly = this.loupeY;

    // Check if cursor is inside drawn image boundaries
    if (lx < drawX - 10 || lx > drawX + drawW + 10 || ly < drawY - 10 || ly > drawY + drawH + 10) {
      return;
    }

    ctx.save();

    // Clip circular lens
    ctx.beginPath();
    ctx.arc(lx, ly, loupeRadius, 0, Math.PI * 2);
    ctx.clip();

    // Loupe background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(lx - loupeRadius, ly - loupeRadius, loupeRadius * 2, loupeRadius * 2);

    // Calculate source rect on original image
    const relX = (lx - drawX) / drawW;
    const relY = (ly - drawY) / drawH;
    const srcCenterX = relX * img.naturalWidth;
    const srcCenterY = relY * img.naturalHeight;

    const srcW = (loupeRadius * 2) / zoom * (img.naturalWidth / drawW);
    const srcH = (loupeRadius * 2) / zoom * (img.naturalHeight / drawH);
    const srcX = srcCenterX - srcW / 2;
    const srcY = srcCenterY - srcH / 2;

    // Draw zoomed image through lens with current filters
    const contrastFilter = `contrast(${this.windowWidth}%)`;
    const brightnessFilter = `brightness(${this.windowLevel}%)`;
    const invertFilter = this.invert ? 'invert(100%)' : 'invert(0%)';
    ctx.filter = `${contrastFilter} ${brightnessFilter} ${invertFilter} grayscale(100%)`;

    ctx.drawImage(
      img,
      srcX, srcY, srcW, srcH,
      lx - loupeRadius, ly - loupeRadius, loupeRadius * 2, loupeRadius * 2
    );

    ctx.restore();

    // Loupe Lens Glass Ring & Glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(lx, ly, loupeRadius, 0, Math.PI * 2);
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 10;
    ctx.stroke();

    // Target reticle
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(lx - 12, ly);
    ctx.lineTo(lx + 12, ly);
    ctx.moveTo(lx, ly - 12);
    ctx.lineTo(lx, ly + 12);
    ctx.stroke();

    // Zoom badge
    ctx.fillStyle = 'rgba(0, 242, 254, 0.9)';
    ctx.font = 'bold 10px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${zoom}x LOUPE`, lx, ly + loupeRadius - 8);

    ctx.restore();
  }

  renderHUDOverlays(ctx, w, h, d) {
    ctx.save();
    ctx.font = '10px Kanit, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

    // Top-left: Hospital / Academic Accreditation
    ctx.textAlign = 'left';
    ctx.fillText('🏥 วทก. • วิทยาลัยเทคโนโลยีทางการแพทย์และสาธารณสุข กาญจนาภิเษก', 16, 20);
    ctx.fillStyle = 'rgba(0, 242, 254, 0.8)';
    ctx.fillText(`RADIOLOGIC TECHNOLOGY LAB • ${d.name.toUpperCase()}`, 16, 35);

    // Top-right: Radiation Exposure Parameters
    ctx.textAlign = 'right';
    ctx.fillStyle = '#00ff88';
    ctx.fillText(`⚡ EXP: ${d.technique}`, w - 16, 20);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fillText(`📏 ${d.distance}`, w - 16, 35);

    // Bottom-left: Window/Level Live Readout
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(0, 242, 254, 0.9)';
    ctx.fillText(`WW (CONTRAST): ${this.windowWidth}%  |  WL (BRIGHTNESS): ${this.windowLevel}%`, 16, h - 14);

    // Bottom-right: Anatomical Marker (R / L)
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 14px Kanit, sans-serif';
    ctx.fillText('R (ขวา)', w - 16, h - 14);

    ctx.restore();
  }
}

// Global initialization helper
window.initXRayViewer = function() {
  if (!window.xrayViewer) {
    window.xrayViewer = new XRayViewer();
  }
};
