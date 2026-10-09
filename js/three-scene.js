/* ==========================================================================
   js/three-scene.js
   Three.js 3D environment.
   1) Ambient full-page background: floating data particles + wireframe shapes
   2) Hero stage: holographic rings, orbiting analytics objects around the
      profile photo (database cylinder, bar chart, pie chart, data nodes,
      connecting lines, tool cubes)
   Both scenes are intentionally subtle so the profile photo stays the focus.
   ========================================================================== */

(function () {
  "use strict";

  const HAS_THREE = typeof THREE !== "undefined";
  if (!HAS_THREE) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 900;
  const COLORS = {
    blue: 0x38bdf8,
    cyan: 0x22d3ee,
    purple: 0x8b5cf6,
    white: 0xf8fafc,
  };

  /* ------------------------------------------------------------------ *
   * 1) AMBIENT BACKGROUND SCENE  (#bg-canvas)
   * ------------------------------------------------------------------ */
  function initBackgroundScene() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Floating particle field (data points)
    const particleCount = isMobile ? 140 : 380;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: COLORS.cyan,
      size: 0.09,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // A handful of large soft wireframe shapes drifting in the deep background
    const wireGroup = new THREE.Group();
    const wireGeoms = [
      new THREE.IcosahedronGeometry(3.2, 0),
      new THREE.OctahedronGeometry(2.6, 0),
      new THREE.TorusGeometry(2.4, 0.05, 8, 40),
    ];
    const wireColors = [COLORS.blue, COLORS.purple, COLORS.cyan];
    const shapeCount = isMobile ? 2 : 5;
    for (let i = 0; i < shapeCount; i++) {
      const geo = wireGeoms[i % wireGeoms.length];
      const mat = new THREE.MeshBasicMaterial({
        color: wireColors[i % wireColors.length],
        wireframe: true,
        transparent: true,
        opacity: 0.10,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((Math.random() - 0.5) * 44, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20 - 10);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.userData.spin = (Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? -1 : 1);
      wireGroup.add(mesh);
    }
    scene.add(wireGroup);

    let mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        particles.rotation.y = t * 0.015;
        particles.rotation.x = t * 0.006;

        wireGroup.children.forEach((m) => {
          m.rotation.x += 0.0009 * m.userData.spin;
          m.rotation.y += 0.0013 * m.userData.spin;
        });

        camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    }
    animate();
  }

  /* ------------------------------------------------------------------ *
   * 2) HERO ANALYTICS STAGE  (#hero-canvas)
   * ------------------------------------------------------------------ */
  function initHeroScene() {
    const canvas = document.getElementById("hero-canvas");
    const stage = document.getElementById("visual-stage");
    if (!canvas || !stage) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function sizeRenderer() {
      const rect = stage.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4 || 560;
      renderer.setSize(size, size);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    }
    sizeRenderer();

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.PointLight(COLORS.blue, 2, 30);
    key.position.set(4, 3, 6);
    scene.add(key);
    const rim = new THREE.PointLight(COLORS.purple, 1.6, 30);
    rim.position.set(-4, -2, 4);
    scene.add(rim);

    const root = new THREE.Group();
    scene.add(root);

    /* --- Holographic rings around the profile frame --- */
    const ringGroup = new THREE.Group();
    const ringDefs = [
      { r: 3.4, tube: 0.02, color: COLORS.blue, tilt: 0.35, speed: 0.09 },
      { r: 3.9, tube: 0.015, color: COLORS.cyan, tilt: -0.5, speed: -0.06 },
      { r: 4.4, tube: 0.012, color: COLORS.purple, tilt: 1.15, speed: 0.045 },
    ];
    ringDefs.forEach((d) => {
      const geo = new THREE.TorusGeometry(d.r, d.tube, 16, 100);
      const mat = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.55 });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = d.tilt;
      ring.userData.speed = d.speed;
      ringGroup.add(ring);
    });
    root.add(ringGroup);

    /* --- Data particles orbiting the frame --- */
    const orbitCount = isMobile ? 60 : 160;
    const orbitPositions = new Float32Array(orbitCount * 3);
    for (let i = 0; i < orbitCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 3.2 + Math.random() * 2.2;
      orbitPositions[i * 3] = Math.cos(theta) * r;
      orbitPositions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      orbitPositions[i * 3 + 2] = Math.sin(theta) * r;
    }
    const orbitGeo = new THREE.BufferGeometry();
    orbitGeo.setAttribute("position", new THREE.BufferAttribute(orbitPositions, 3));
    const orbitMat = new THREE.PointsMaterial({ color: COLORS.cyan, size: 0.055, transparent: true, opacity: 0.8 });
    const orbitParticles = new THREE.Points(orbitGeo, orbitMat);
    root.add(orbitParticles);

    /* --- Floating analytics objects (bar chart, pie chart, database, cubes) --- */
    const objects = new THREE.Group();

    // Bar chart (group of boxes of varying height)
    const barChart = new THREE.Group();
    const barHeights = [0.5, 1.1, 0.8, 1.4, 0.65];
    barHeights.forEach((h, i) => {
      const geo = new THREE.BoxGeometry(0.22, h, 0.22);
      const mat = new THREE.MeshStandardMaterial({ color: COLORS.blue, emissive: COLORS.blue, emissiveIntensity: 0.35, transparent: true, opacity: 0.85 });
      const bar = new THREE.Mesh(geo, mat);
      bar.position.set(i * 0.3 - 0.6, h / 2, 0);
      barChart.add(bar);
    });
    barChart.position.set(-4.6, 1.6, 0.6);
    barChart.rotation.y = 0.4;
    barChart.userData.float = { speed: 0.6, amp: 0.12, offset: 0 };
    objects.add(barChart);

    // Pie chart (ring segments approximated with torus arcs)
    const pieGroup = new THREE.Group();
    const pieSegs = [
      { color: COLORS.cyan, start: 0, len: 2.1 },
      { color: COLORS.purple, start: 2.1, len: 1.6 },
      { color: COLORS.blue, start: 3.7, len: 2.58 },
    ];
    pieSegs.forEach((s) => {
      const geo = new THREE.TorusGeometry(0.55, 0.22, 10, 32, s.len);
      const mat = new THREE.MeshStandardMaterial({ color: s.color, emissive: s.color, emissiveIntensity: 0.3 });
      const seg = new THREE.Mesh(geo, mat);
      seg.rotation.x = Math.PI / 2;
      seg.rotation.z = s.start;
      pieGroup.add(seg);
    });
    pieGroup.position.set(4.5, -1.4, 0.4);
    pieGroup.userData.float = { speed: 0.5, amp: 0.14, offset: 1.4 };
    objects.add(pieGroup);

    // Database cylinder stack
    const dbGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.CylinderGeometry(0.42, 0.42, 0.16, 24, 1, true);
      const mat = new THREE.MeshStandardMaterial({ color: COLORS.purple, emissive: COLORS.purple, emissiveIntensity: 0.25, transparent: true, opacity: 0.75, side: THREE.DoubleSide });
      const disc = new THREE.Mesh(geo, mat);
      disc.position.y = i * 0.22;
      dbGroup.add(disc);
    }
    dbGroup.position.set(-4.3, -2, -0.4);
    dbGroup.userData.float = { speed: 0.45, amp: 0.1, offset: 2.6 };
    objects.add(dbGroup);

    // Small floating tool cubes (SQL / Python / Excel / Power BI represented as glowing cubes)
    const cubeColors = [COLORS.blue, COLORS.cyan, COLORS.purple, COLORS.blue];
    const cubePositions = [
      [4.6, 2.1, -0.6],
      [3.8, 3.4, 0.8],
      [-3.6, 3.2, -0.3],
      [4.9, 0.2, 1.1],
    ];
    cubePositions.forEach((pos, i) => {
      const geo = new THREE.BoxGeometry(0.34, 0.34, 0.34);
      const mat = new THREE.MeshStandardMaterial({ color: cubeColors[i], emissive: cubeColors[i], emissiveIntensity: 0.4, transparent: true, opacity: 0.85 });
      const cube = new THREE.Mesh(geo, mat);
      cube.position.set(...pos);
      cube.userData.float = { speed: 0.5 + i * 0.1, amp: 0.16, offset: i };
      cube.userData.spinRate = 0.01 + i * 0.004;
      objects.add(cube);
    });

    // Data nodes + connecting lines (network graph feel)
    const nodeGroup = new THREE.Group();
    const nodePositions = [];
    const nodeTotal = isMobile ? 7 : 11;
    for (let i = 0; i < nodeTotal; i++) {
      const theta = (i / nodeTotal) * Math.PI * 2;
      const r = 5.4 + Math.sin(i) * 0.4;
      const p = new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta * 1.7) * 1.6, Math.sin(theta) * r * 0.6 - 1);
      nodePositions.push(p);
      const nodeGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: COLORS.cyan });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.copy(p);
      nodeGroup.add(node);
    }
    const lineMat = new THREE.LineBasicMaterial({ color: COLORS.blue, transparent: true, opacity: 0.18 });
    for (let i = 0; i < nodePositions.length; i++) {
      const next = nodePositions[(i + 1) % nodePositions.length];
      const geo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], next]);
      nodeGroup.add(new THREE.Line(geo, lineMat));
    }
    objects.add(nodeGroup);

    root.add(objects);

    // Mouse-reactive parallax
    let targetRX = 0, targetRY = 0;
    stage.addEventListener("mousemove", (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRY = x * 0.5;
      targetRX = y * 0.35;
    }, { passive: true });
    stage.addEventListener("mouseleave", () => { targetRX = 0; targetRY = 0; }, { passive: true });

    window.addEventListener("resize", sizeRenderer);

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        ringGroup.children.forEach((ring) => { ring.rotation.z += ring.userData.speed * 0.01; });
        orbitParticles.rotation.y = t * 0.06;

        objects.children.forEach((obj) => {
          if (obj.userData.float) {
            const f = obj.userData.float;
            obj.position.y += Math.sin(t * f.speed + f.offset) * 0.0009;
          }
          if (obj.userData.spinRate) {
            obj.rotation.x += obj.userData.spinRate;
            obj.rotation.y += obj.userData.spinRate;
          }
        });
        barChart.rotation.y += 0.0018;
        pieGroup.rotation.z += 0.0012;
        dbGroup.rotation.y += 0.0016;
        nodeGroup.rotation.y = t * 0.03;

        root.rotation.y += (targetRY - root.rotation.y) * 0.04;
        root.rotation.x += (targetRX - root.rotation.x) * 0.04;
      }

      renderer.render(scene, camera);
    }
    animate();
  }

  function boot() {
    initBackgroundScene();
    initHeroScene();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
