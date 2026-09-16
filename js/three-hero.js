/**
 * THREE.JS 3D INTERACTIVE HERO ENGINE
 * Adds real WebGL 3D cyber element with glowing wireframe shader,
 * neon particle cloud, pointer tracking, drag inertia, and geometry morphing.
 * Includes battery/CPU saver (IntersectionObserver & visibilitychange) and WebGL fallbacks.
 */

class ThreeHeroScene {
  constructor(canvasId = 'hero-three-canvas') {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.container = this.canvas ? this.canvas.parentElement : null;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.lights = [];

    // Meshes
    this.coreGroup = null;
    this.icosahedronGroup = null;
    this.torusKnotGroup = null;
    this.particleSystem = null;
    this.currentShape = 'icosahedron'; // 'icosahedron' | 'torusknot'

    // Motion & Interaction
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.drag = {
      isDragging: false,
      previousX: 0,
      previousY: 0,
      velocityX: 0,
      velocityY: 0
    };
    this.pulseScale = 1.0;
    this.pulseVelocity = 0;
    this.animationFrameId = null;
    this.isRunning = false;

    this.init();
  }

  isWebGLAvailable() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  handleFallbackUI() {
    const badgeLabel = document.getElementById('hero-3d-mesh-name');
    if (badgeLabel) badgeLabel.textContent = '2D CYBER MESH';
    const toggleBtn = document.getElementById('hero-3d-toggle-btn');
    if (toggleBtn) toggleBtn.style.display = 'none';
  }

  init() {
    if (!this.canvas) return;
    if (typeof THREE === 'undefined') {
      console.warn('[ThreeHero] Three.js library not loaded yet; fallback active.');
      this.handleFallbackUI();
      return;
    }
    if (!this.isWebGLAvailable()) {
      console.warn('[ThreeHero] WebGL not supported on this device; graceful fallback active.');
      this.handleFallbackUI();
      return;
    }

    try {
      // 1. Scene Setup
      this.scene = new THREE.Scene();

      // 2. Camera Setup
      const width = this.container ? this.container.clientWidth : (this.canvas.clientWidth || 360);
      const height = this.container ? this.container.clientHeight : (this.canvas.clientHeight || 440);
      const aspect = width / height;
      this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
      this.camera.position.z = 7.0;

      // 3. WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.setSize(width, height, false);
    } catch (e) {
      console.warn('[ThreeHero] WebGL initialization error:', e);
      this.handleFallbackUI();
      return;
    }

    // 4. Lighting (Neon Cyberpunk Palette)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 3, 25);
    cyanLight.position.set(4, 4, 4);
    this.scene.add(cyanLight);

    const pinkLight = new THREE.PointLight(0xff007f, 3, 25);
    pinkLight.position.set(-4, -3, 3);
    this.scene.add(pinkLight);

    const purpleLight = new THREE.DirectionalLight(0x8a2be2, 1.5);
    purpleLight.position.set(0, 5, 2);
    this.scene.add(purpleLight);

    // 5. Construct Core Group
    this.coreGroup = new THREE.Group();
    this.scene.add(this.coreGroup);

    this.createIcosahedronCore();
    this.createTorusKnotCore();
    this.createParticleCloud();

    this.setShape(this.currentShape);

    // 6. Setup Listeners
    this.setupEventListeners();

    // 7. Start Animation
    this.start();
  }

  createIcosahedronCore() {
    this.icosahedronGroup = new THREE.Group();

    // Solid inner faceted crystalline core
    const innerGeom = new THREE.IcosahedronGeometry(1.45, 1);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x070b19,
      roughness: 0.25,
      metalness: 0.9,
      flatShading: true
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    this.icosahedronGroup.add(innerMesh);

    // Glowing Neon Cyan Wireframe
    const wireGeom = new THREE.IcosahedronGeometry(1.48, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    this.icosahedronGroup.add(wireMesh);

    // Outer Dodecahedron Cage (Neon Pink)
    const outerGeom = new THREE.DodecahedronGeometry(1.95, 0);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const outerMesh = new THREE.Mesh(outerGeom, outerMat);
    this.icosahedronGroup.add(outerMesh);

    // Vertex points glow
    const pointGeom = new THREE.IcosahedronGeometry(1.5, 1);
    const pointMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.08,
      transparent: true,
      opacity: 0.9
    });
    const pointMesh = new THREE.Points(pointGeom, pointMat);
    this.icosahedronGroup.add(pointMesh);

    this.coreGroup.add(this.icosahedronGroup);
  }

  createTorusKnotCore() {
    this.torusKnotGroup = new THREE.Group();

    // Inner Torus Knot
    const knotGeom = new THREE.TorusKnotGeometry(1.15, 0.32, 100, 24);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x08091a,
      roughness: 0.2,
      metalness: 0.85
    });
    const knotMesh = new THREE.Mesh(knotGeom, knotMat);
    this.torusKnotGroup.add(knotMesh);

    // Glowing Neon Wireframe Torus Knot
    const knotWireGeom = new THREE.TorusKnotGeometry(1.17, 0.33, 80, 20);
    const knotWireMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const knotWireMesh = new THREE.Mesh(knotWireGeom, knotWireMat);
    this.torusKnotGroup.add(knotWireMesh);

    // Outer Gyroscope Rings
    const ringGeom = new THREE.TorusGeometry(1.9, 0.025, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      transparent: true,
      opacity: 0.65
    });
    const ring1 = new THREE.Mesh(ringGeom, ringMat);
    ring1.rotation.x = Math.PI / 3;
    this.torusKnotGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeom, new THREE.MeshBasicMaterial({ color: 0x8a2be2, transparent: true, opacity: 0.55 }));
    ring2.rotation.y = Math.PI / 3;
    this.torusKnotGroup.add(ring2);

    this.torusKnotGroup.visible = false;
    this.coreGroup.add(this.torusKnotGroup);
  }

  createParticleCloud() {
    const particleCount = 420;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0x00f2fe), // Neon Cyan
      new THREE.Color(0xff007f), // Neon Pink
      new THREE.Color(0x8a2be2), // Neon Purple
      new THREE.Color(0x00ff88)  // Neon Green
    ];

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const radius = 2.1 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = colorPalette[i % colorPalette.length];
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(geometry, material);
    this.scene.add(this.particleSystem);
  }

  setShape(shapeName) {
    this.currentShape = shapeName;
    if (this.icosahedronGroup && this.torusKnotGroup) {
      if (shapeName === 'torusknot') {
        this.icosahedronGroup.visible = false;
        this.torusKnotGroup.visible = true;
      } else {
        this.icosahedronGroup.visible = true;
        this.torusKnotGroup.visible = false;
      }
    }

    const badgeLabel = document.getElementById('hero-3d-mesh-name');
    if (badgeLabel) {
      badgeLabel.textContent = shapeName === 'torusknot' ? '3D TORUS KNOT' : '3D ICOSAHEDRON';
    }

    this.triggerPulse(1.3);
  }

  toggleShape() {
    const nextShape = this.currentShape === 'icosahedron' ? 'torusknot' : 'icosahedron';
    this.setShape(nextShape);
    window.soundFx?.click?.();
  }

  triggerPulse(intensity = 1.25) {
    this.pulseScale = intensity;
    this.pulseVelocity = 0.04;
  }

  setupEventListeners() {
    // 1. Mouse movement tracking over hero section
    const heroSection = document.getElementById('hero') || document.body;
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.mouse.targetX = x * 0.8;
      this.mouse.targetY = y * 0.8;
    }, { passive: true });

    // 2. Drag to rotate canvas directly
    const targetEl = this.canvas;
    const onPointerDown = (clientX, clientY) => {
      this.drag.isDragging = true;
      this.drag.previousX = clientX;
      this.drag.previousY = clientY;
      this.drag.velocityX = 0;
      this.drag.velocityY = 0;
    };

    const onPointerMove = (clientX, clientY) => {
      if (!this.drag.isDragging) return;
      const deltaX = clientX - this.drag.previousX;
      const deltaY = clientY - this.drag.previousY;

      this.drag.velocityX = deltaX * 0.008;
      this.drag.velocityY = deltaY * 0.008;

      if (this.coreGroup) {
        this.coreGroup.rotation.y += this.drag.velocityX;
        this.coreGroup.rotation.x += this.drag.velocityY;
      }

      this.drag.previousX = clientX;
      this.drag.previousY = clientY;
    };

    const onPointerUp = () => {
      if (this.drag.isDragging) {
        this.drag.isDragging = false;
      }
    };

    targetEl.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY), { passive: true });
    window.addEventListener('mouseup', onPointerUp);

    targetEl.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('touchcancel', onPointerUp);

    // 3. Click to pulse
    targetEl.addEventListener('click', () => {
      this.triggerPulse(1.28);
      window.soundFx?.click?.();
    });

    // 4. Toggle button in UI
    const toggleBtn = document.getElementById('hero-3d-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleShape();
      });
    }

    // 5. Resize handler
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.resize(), 120);
    });

    // 6. Reduced Motion Listener
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
    });

    // 7. Battery Saver: visibilitychange & IntersectionObserver
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });

    if ('IntersectionObserver' in window && this.canvas) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !document.hidden) {
            this.start();
          } else {
            this.stop();
          }
        });
      }, { threshold: 0.05 });
      observer.observe(this.canvas);
    }

    // 8. WebGL Context Loss Recovery
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.stop();
      console.warn('[ThreeHero] WebGL context lost.');
    }, false);

    this.canvas.addEventListener('webglcontextrestored', () => {
      console.log('[ThreeHero] WebGL context restored; reinitializing.');
      this.init();
    }, false);
  }

  resize() {
    if (!this.renderer || !this.camera || !this.canvas) return;
    const width = this.container ? this.container.clientWidth : (this.canvas.clientWidth || 360);
    const height = this.container ? this.container.clientHeight : (this.canvas.clientHeight || 440);
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);
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

  destroy() {
    this.stop();
    if (this.renderer) {
      try {
        this.renderer.dispose();
      } catch (e) {}
    }
    const disposeGroup = (group) => {
      if (!group) return;
      group.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
    disposeGroup(this.coreGroup);
    disposeGroup(this.particleSystem);
  }

  animate() {
    if (!this.isRunning) return;

    const baseRotSpeed = this.isReducedMotion ? 0.002 : 0.009;

    // Smooth Mouse Lerping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Apply drag inertia
    if (!this.drag.isDragging) {
      this.drag.velocityX *= 0.94;
      this.drag.velocityY *= 0.94;
      if (this.coreGroup) {
        this.coreGroup.rotation.y += this.drag.velocityX;
        this.coreGroup.rotation.x += this.drag.velocityY;
      }
    }

    // Core Rotation
    if (this.coreGroup) {
      this.coreGroup.rotation.y += baseRotSpeed;
      this.coreGroup.rotation.x += baseRotSpeed * 0.45;

      // Parallax target from mouse
      this.coreGroup.position.x += (this.mouse.x * 0.4 - this.coreGroup.position.x) * 0.05;
      this.coreGroup.position.y += (this.mouse.y * 0.4 - this.coreGroup.position.y) * 0.05;

      // Pulse spring effect
      if (this.pulseScale > 1.0) {
        this.pulseScale -= this.pulseVelocity;
        if (this.pulseScale < 1.0) {
          this.pulseScale = 1.0;
          this.pulseVelocity = 0;
        }
      }
      this.coreGroup.scale.set(this.pulseScale, this.pulseScale, this.pulseScale);
    }

    // Outer Particles Orbit (concentric with coreGroup position)
    if (this.particleSystem && this.coreGroup) {
      this.particleSystem.position.copy(this.coreGroup.position);
      this.particleSystem.rotation.y -= baseRotSpeed * 0.7;
      this.particleSystem.rotation.z += baseRotSpeed * 0.3;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// Auto-initialize when DOM and Three.js are ready
function initThreeHeroWhenReady() {
  if (typeof THREE !== 'undefined') {
    window.threeHero = new ThreeHeroScene('hero-three-canvas');
  } else {
    // Retry shortly if CDN script is still downloading
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (typeof THREE !== 'undefined') {
        clearInterval(timer);
        window.threeHero = new ThreeHeroScene('hero-three-canvas');
      } else if (attempts > 30) {
        clearInterval(timer);
        console.warn('[ThreeHero] Three.js loading timed out.');
      }
    }, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThreeHeroWhenReady);
} else {
  initThreeHeroWhenReady();
}
