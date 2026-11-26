import * as THREE from 'three';

function createSoftParticleTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.45, 'rgba(240,246,255,0.85)');
  g.addColorStop(0.75, 'rgba(180,205,235,0.22)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function buildHeroScene(particleTex, isMobile) {
  const group = new THREE.Group();

  // 1. Volumetric organic particle cloud matching diagonal helix flow + cyan highlights
  const count = isMobile ? 1600 : 3800;
  const positions = new Float32Array(count * 3);
  const basePos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  const cWhite = new THREE.Color('#EEF1F8');
  const cGrey = new THREE.Color('#7C8496');
  const cCyan = new THREE.Color('#22EEFF');

  for (let i = 0; i < count; i++) {
    const t = (i / count) * 2 - 1; // -1 .. 1 along diagonal ribbon
    const angle = t * 5.2 + Math.random() * Math.PI * 2;
    const radius = (0.35 + Math.pow(Math.random(), 0.65) * 2.15) * (1 - Math.abs(t) * 0.25);

    const x = t * 3.4 + Math.cos(angle) * radius * 0.85 + (Math.random() - 0.5) * 0.65;
    const y = t * 2.6 + Math.sin(angle) * radius * 0.72 + (Math.random() - 0.5) * 0.6;
    const z = Math.sin(angle * 1.4) * radius * 1.25 - 1.4;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    basePos[i * 3] = x;
    basePos[i * 3 + 1] = y;
    basePos[i * 3 + 2] = z;
    phases[i] = Math.random() * Math.PI * 2;

    const r = Math.random();
    const col = r < 0.065 ? cCyan : r < 0.52 ? cWhite : cGrey;
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  const cloudGeo = new THREE.BufferGeometry();
  cloudGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  cloudGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const cloudMat = new THREE.PointsMaterial({
    size: isMobile ? 0.18 : 0.22,
    map: particleTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const cloudPoints = new THREE.Points(cloudGeo, cloudMat);
  group.add(cloudPoints);

  // 2. Procedural 3D Obsidian Basalt Canyon + Sculpted Astronaut Explorer Silhouette (Stage 2)
  const canyonGroup = new THREE.Group();
  canyonGroup.position.set(0, -1.6, -6.2);
  canyonGroup.visible = false;

  const ridgeMat = new THREE.MeshStandardMaterial({
    color: 0x0b0e16,
    roughness: 0.92,
    metalness: 0.22,
    flatShading: true
  });

  const buildRidge = (side, zOffset, heightBoost) => {
    const geo = new THREE.PlaneGeometry(11, 20, 26, 36);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const strata =
        Math.sin(px * 0.85 + side * 1.4) * 0.85 +
        Math.cos(py * 0.45) * 1.05 +
        Math.sin((px * 1.6 - py * 0.9)) * 0.38;
      const cliffWall = Math.max(0, (side > 0 ? px + 3.2 : 3.2 - px) * 0.62);
      pos.setZ(i, strata + cliffWall + heightBoost);
    }
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, ridgeMat);
    mesh.rotation.x = -Math.PI * 0.43;
    mesh.rotation.z = side * 0.14;
    mesh.position.set(side * 5.2, -1.7, zOffset);
    return mesh;
  };

  canyonGroup.add(buildRidge(-1, -2.8, 0.3));
  canyonGroup.add(buildRidge(1, -2.8, 0.3));
  canyonGroup.add(buildRidge(-1, -7.2, 1.4));
  canyonGroup.add(buildRidge(1, -7.2, 1.4));

  // Foreground basalt promontory rock where explorer stands
  const ledgeGeo = new THREE.DodecahedronGeometry(1.75, 2);
  const lPos = ledgeGeo.attributes.position;
  for (let i = 0; i < lPos.count; i++) {
    lPos.setX(i, lPos.getX(i) * 1.35);
    lPos.setY(i, lPos.getY(i) * 0.55 + (Math.sin(lPos.getX(i) * 3.1) * 0.14));
  }
  ledgeGeo.computeVertexNormals();
  const ledge = new THREE.Mesh(ledgeGeo, ridgeMat);
  ledge.position.set(-1.65, -1.15, 2.2);
  canyonGroup.add(ledge);

  // Subtle luminous canyon horizon portal ring
  const horizonRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.018, 16, 96),
    new THREE.MeshBasicMaterial({ color: 0x22eeff, transparent: true, opacity: 0.42 })
  );
  horizonRing.position.set(-1.55, 0.65, -1.8);
  canyonGroup.add(horizonRing);

  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.45, 0.01, 12, 96),
    new THREE.MeshBasicMaterial({ color: 0x1d3cff, transparent: true, opacity: 0.48 })
  );
  outerRing.position.set(-1.55, 0.65, -2.4);
  canyonGroup.add(outerRing);

  // Sculpted Chiaroscuro 3D Explorer Figure (obsidian ceramic suit + cobalt reflective visor)
  const explorer = new THREE.Group();
  const armorMat = new THREE.MeshPhysicalMaterial({
    color: 0x181e2c,
    roughness: 0.36,
    metalness: 0.55,
    clearcoat: 0.45,
    clearcoatRoughness: 0.25
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xdbe5ff,
    roughness: 0.28,
    metalness: 0.4
  });
  const visorMat = new THREE.MeshPhysicalMaterial({
    color: 0x051126,
    roughness: 0.05,
    metalness: 0.96,
    clearcoat: 1.0,
    emissive: 0x1d3cff,
    emissiveIntensity: 0.65
  });

  // Helmet + rim collar + curved reflective visor
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.36, 32, 32), trimMat);
  helmet.scale.set(0.95, 1.04, 1.02);
  helmet.position.set(0, 1.44, 0.02);
  explorer.add(helmet);

  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.33, 28, 24, -Math.PI * 0.36, Math.PI * 0.72, Math.PI * 0.26, Math.PI * 0.46),
    visorMat
  );
  visor.position.set(0, 1.44, 0.08);
  explorer.add(visor);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.055, 14, 32), armorMat);
  collar.rotation.x = Math.PI * 0.5;
  collar.position.set(0, 1.12, 0);
  explorer.add(collar);

  // Sculpted tapered torso + chest plate + shoulder pauldrons
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.24, 0.84, 18), armorMat);
  torso.position.set(0, 0.66, 0);
  explorer.add(torso);

  const chestBeacon = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.06, 0.08),
    new THREE.MeshBasicMaterial({ color: 0x22eeff })
  );
  chestBeacon.position.set(0, 0.78, 0.31);
  explorer.add(chestBeacon);

  const shoulderGeo = new THREE.SphereGeometry(0.18, 20, 20);
  const shL = new THREE.Mesh(shoulderGeo, trimMat);
  shL.position.set(-0.38, 0.96, 0);
  const shR = new THREE.Mesh(shoulderGeo, trimMat);
  shR.position.set(0.38, 0.96, 0);
  explorer.add(shL, shR);

  // Life-support backpack
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.72, 0.28), armorMat);
  pack.position.set(0, 0.72, -0.28);
  explorer.add(pack);

  // Relaxed grounded arms & standing legs
  const armGeo = new THREE.CapsuleGeometry(0.095, 0.54, 8, 16);
  const armL = new THREE.Mesh(armGeo, armorMat);
  armL.position.set(-0.44, 0.54, 0.04);
  armL.rotation.z = -0.14;
  armL.rotation.x = 0.08;
  const armR = new THREE.Mesh(armGeo, armorMat);
  armR.position.set(0.44, 0.54, -0.02);
  armR.rotation.z = 0.14;
  armR.rotation.x = -0.06;
  explorer.add(armL, armR);

  const legGeo = new THREE.CapsuleGeometry(0.115, 0.72, 8, 16);
  const legL = new THREE.Mesh(legGeo, armorMat);
  legL.position.set(-0.17, -0.14, 0.06);
  legL.rotation.z = -0.05;
  const legR = new THREE.Mesh(legGeo, armorMat);
  legR.position.set(0.18, -0.16, -0.08);
  legR.rotation.z = 0.06;
  explorer.add(legL, legR);

  explorer.position.set(-1.6, -0.32, 2.35);
  explorer.rotation.y = 0.42;
  canyonGroup.add(explorer);
  group.add(canyonGroup);

  return {
    group,
    update(time, progress, pointer) {
      const attr = cloudGeo.attributes.position;
      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        const ph = phases[i];
        const drift = Math.sin(time * 0.55 + ph) * 0.14;
        const spread = 1 + progress * 1.45;
        attr.array[ix] = basePos[ix] * spread + drift + pointer.x * 0.35;
        attr.array[ix + 1] = basePos[ix + 1] * spread + Math.cos(time * 0.45 + ph) * 0.12 - pointer.y * 0.22;
        attr.array[ix + 2] = basePos[ix + 2] + progress * 2.2;
      }
      attr.needsUpdate = true;
      cloudPoints.rotation.z = time * 0.045 + progress * 0.65;
      cloudPoints.rotation.y = pointer.x * 0.18;
      cloudMat.opacity = Math.max(0.18, 0.92 - progress * 0.58);

      // Reveal 3D obsidian canyon & sculpted explorer cleanly ONLY on Stage 2 (progress > 0.52)
      const stage2 = Math.max(0, Math.min(1, (progress - 0.52) / 0.48));
      canyonGroup.visible = stage2 > 0.01;
      if (canyonGroup.visible) {
        canyonGroup.position.z = -6.2 + stage2 * 4.4;
        canyonGroup.position.y = -2.2 + stage2 * 1.9;
        explorer.rotation.y = 0.42 + Math.sin(time * 0.4) * 0.12 + pointer.x * 0.24;
        horizonRing.rotation.z = time * 0.18;
        outerRing.rotation.z = -time * 0.12;
        outerRing.rotation.x = 0.35 + Math.sin(time * 0.4) * 0.12;
      }
    }
  };
}

export function createWebGLStage(canvas, { reducedMotion = false } = {}) {
  const isMobile = window.innerWidth < 768;
  const state = {
    activeScene: 'hero',
    heroProgress: 0,
    teamProgress: 0,
    teamIndex: 0,
    keahlianProgress: 0,
    keahlianDrag: 0,
    ctaProgress: 0,
    paused: reducedMotion,
    pointer: { x: 0, y: 0, tx: 0, ty: 0 }
  };

  let renderer = null;
  let webglAvailable = true;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch {
    webglAvailable = false;
  }

  if (!webglAvailable || !renderer) {
    // Graceful Canvas 2D ambient fallback
    const ctx = canvas.getContext('2d');
    const drawFallback = () => {
      if (!ctx) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const grad = ctx.createRadialGradient(
        canvas.width * 0.55,
        canvas.height * 0.42,
        20,
        canvas.width * 0.55,
        canvas.height * 0.42,
        canvas.width * 0.55
      );
      grad.addColorStop(0, 'rgba(34,238,255,0.18)');
      grad.addColorStop(0.45, 'rgba(255,255,255,0.08)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    drawFallback();
    window.addEventListener('resize', drawFallback);
    return {
      isWebGL: false,
      setState(patch) { Object.assign(state, patch); },
      setPaused(v) { state.paused = Boolean(v); },
      registerScene() {},
      destroy() { window.removeEventListener('resize', drawFallback); }
    };
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 80);
  camera.position.set(0, 0, 7.2);

  // Studio rim lighting for procedural 3D scenes
  const ambient = new THREE.AmbientLight(0xdce6ff, 0.65);
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(4, 6, 5);
  const rimLight = new THREE.DirectionalLight(0x22eeff, 1.8);
  rimLight.position.set(-5, 2, -4);
  const blueBounce = new THREE.PointLight(0x1d3cff, 3.2, 18);
  blueBounce.position.set(0, -3, 2);
  scene.add(ambient, keyLight, rimLight, blueBounce);

  const particleTex = createSoftParticleTexture();
  const scenes = {};
  const heroObj = buildHeroScene(particleTex, isMobile);
  scenes.hero = heroObj;
  scene.add(heroObj.group);

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    if (state.paused) renderFrame(0);
  };

  const onPointerMove = (e) => {
    state.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    state.pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };

  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  let rafId = 0;
  let elapsed = 0;
  let lastTs = performance.now();

  function renderFrame(dt) {
    state.pointer.x += (state.pointer.tx - state.pointer.x) * 0.06;
    state.pointer.y += (state.pointer.ty - state.pointer.y) * 0.06;

    for (const [name, obj] of Object.entries(scenes)) {
      const visible = state.activeScene === name;
      obj.group.visible = visible;
      if (visible && typeof obj.update === 'function') {
        obj.update(elapsed, state, camera, dt);
      }
    }

    if (state.activeScene === 'hero') {
      heroObj.update(elapsed, state.heroProgress, state.pointer);
      camera.position.x = state.pointer.x * 0.28;
      camera.position.y = -state.pointer.y * 0.18;
      camera.position.z = 7.2 - state.heroProgress * 1.4;
      camera.lookAt(0, 0, -1.2);
    }

    renderer.render(scene, camera);
  }

  // Render initial frame immediately so reduced-motion still shows rich static 3D frame
  renderFrame(0);

  const tick = (now) => {
    rafId = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - lastTs) / 1000);
    lastTs = now;
    if (!state.paused) {
      elapsed += dt;
      renderFrame(dt);
    }
  };
  rafId = requestAnimationFrame(tick);

  return {
    isWebGL: true,
    THREE,
    particleTex,
    isMobile,
    setState(patch) {
      Object.assign(state, patch);
      if (state.paused) renderFrame(0);
    },
    setPaused(v) {
      state.paused = Boolean(v);
      if (!state.paused) lastTs = performance.now();
      renderFrame(0);
    },
    registerScene(name, obj) {
      scenes[name] = obj;
      obj.group.visible = state.activeScene === name;
      scene.add(obj.group);
    },
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
    }
  };
}
