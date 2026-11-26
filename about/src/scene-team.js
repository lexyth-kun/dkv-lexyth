export function createTeamPointCloudScene(THREE, particleTex, portraitSrc, isMobile) {
  const group = new THREE.Group();

  // Subtle vertical dotted rain matrix in background (Lusion Team signature)
  const rainCount = isMobile ? 420 : 950;
  const rainPos = new Float32Array(rainCount * 3);
  const rainSpeeds = new Float32Array(rainCount);
  for (let i = 0; i < rainCount; i++) {
    const col = Math.floor(Math.random() * 26) - 13;
    rainPos[i * 3] = col * 0.48 + (Math.random() - 0.5) * 0.05;
    rainPos[i * 3 + 1] = (Math.random() - 0.5) * 9.5;
    rainPos[i * 3 + 2] = -3.2 - Math.random() * 2.5;
    rainSpeeds[i] = 0.35 + Math.random() * 0.65;
  }
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  const rainMat = new THREE.PointsMaterial({
    size: 0.045,
    color: 0x8a95ad,
    transparent: true,
    opacity: 0.34,
    depthWrite: false
  });
  const rainPoints = new THREE.Points(rainGeo, rainMat);
  group.add(rainPoints);

  // Portrait holder group (rotates smoothly between 4 role poses)
  const portraitRig = new THREE.Group();
  portraitRig.position.set(isMobile ? 0 : -0.25, isMobile ? 0.55 : -0.05, 0.4);
  group.add(portraitRig);

  // Bold geometric background letter plane behind the 3D point-cloud (Lusion 'E' depth layering)
  const ROLE_GLYPHS = ['V', 'G', 'A', 'W'];
  const glyphCanvas = document.createElement('canvas');
  glyphCanvas.width = 512;
  glyphCanvas.height = 512;
  const glyphCtx = glyphCanvas.getContext('2d');
  const glyphTex = new THREE.CanvasTexture(glyphCanvas);

  const drawGlyph = (letter) => {
    glyphCtx.clearRect(0, 0, 512, 512);
    glyphCtx.fillStyle = '#FFFFFF';
    glyphCtx.font = '800 390px Inter, system-ui, sans-serif';
    glyphCtx.textAlign = 'center';
    glyphCtx.textBaseline = 'middle';
    glyphCtx.fillText(letter, 256, 272);
    glyphTex.needsUpdate = true;
  };
  drawGlyph(ROLE_GLYPHS[0]);

  const glyphPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(isMobile ? 2.1 : 3.4, isMobile ? 2.1 : 3.4),
    new THREE.MeshBasicMaterial({
      map: glyphTex,
      transparent: true,
      opacity: 0.94,
      depthWrite: false
    })
  );
  glyphPlane.position.set(isMobile ? 0.82 : 1.75, isMobile ? 1.25 : 0.15, -1.4);
  group.add(glyphPlane);

  let portraitPoints = null;
  let baseCoords = null;
  let wispMask = null;
  let phases = null;
  let baseColors = null;
  let currentRole = 0;
  let morphImpulse = 0;
  let curRotY = -0.08;
  let curRotX = 0.02;
  let curScale = isMobile ? 0.72 : 1.08;

  const ROLE_POSES = [
    { rotY: -0.08, rotX: 0.02, scale: 1.08, cyanBoost: 0.14, spread: 0.0 },
    { rotY: 0.24, rotX: -0.04, scale: 1.12, cyanBoost: 0.22, spread: 0.06 },
    { rotY: -0.22, rotX: 0.06, scale: 1.06, cyanBoost: 0.44, spread: 0.1 },
    { rotY: 0.12, rotX: -0.02, scale: 1.1, cyanBoost: 0.28, spread: 0.04 }
  ];

  // Sample real portrait photo into luminous high-contrast 3D point cloud
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const sampleW = isMobile ? 124 : 184;
    const sampleH = Math.round(sampleW * (img.naturalHeight / img.naturalWidth));
    const off = document.createElement('canvas');
    off.width = sampleW;
    off.height = sampleH;
    const ctx = off.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, sampleW, sampleH);
    const data = ctx.getImageData(0, 0, sampleW, sampleH).data;

    const pts = [];
    const cols = [];
    const isWisp = [];
    const phs = [];

    const lumAt = (x, y) => {
      const cx = Math.max(0, Math.min(sampleW - 1, x));
      const cy = Math.max(0, Math.min(sampleH - 1, y));
      const idx = (cy * sampleW + cx) * 4;
      if (data[idx + 3] < 40) return 0;
      return (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;
    };

    const aspect = sampleW / sampleH;
    const worldH = isMobile ? 4.35 : 5.2;
    const worldW = worldH * aspect;

    for (let y = 0; y < sampleH; y++) {
      for (let x = 0; x < sampleW; x++) {
        const idx = (y * sampleW + x) * 4;
        const alpha = data[idx + 3];
        if (alpha < 44) continue;

        const r = data[idx] / 255;
        const g = data[idx + 1] / 255;
        const b = data[idx + 2] / 255;
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        const gx = Math.abs(lumAt(x + 1, y) - lumAt(x - 1, y));
        const gy = Math.abs(lumAt(x, y + 1) - lumAt(x, y - 1));
        const edge = Math.min(1, (gx + gy) * 3.0);

        // Keep skin/collar/watch dense & bright; thin dark blazer interior for crisp monochrome photo clarity
        if (lum < 0.09 && edge < 0.12 && Math.random() > 0.24) continue;

        const nx = (x / sampleW) - 0.5;
        const ny = 0.5 - (y / sampleH);

        const faceDist = Math.hypot((nx - 0.02) * 1.4, (ny - 0.22) * 1.3);
        const convex = Math.max(0, 1 - faceDist * 1.15) * 0.72;
        const px = nx * worldW + (Math.random() - 0.5) * 0.012;
        const py = ny * worldH + (Math.random() - 0.5) * 0.012;
        const pz = (lum * 0.85 + edge * 0.35 + convex - 0.42) * 1.15;

        pts.push(px, py, pz);

        // High-contrast monochrome lighting curve so face/eyes/collar read crisply like studio photography
        const contrastLum = Math.pow(Math.min(1, lum * 1.25), 0.78);
        const boost = Math.min(1, 0.12 + contrastLum * 0.92 + edge * 0.42);
        const cyanTint = edge > 0.32 ? 0.24 : 0.03;
        cols.push(
          Math.min(1, boost * (1 - cyanTint * 0.45)),
          Math.min(1, boost * (0.98 + cyanTint * 0.1)),
          Math.min(1, boost * (1.0 + cyanTint * 0.32))
        );
        isWisp.push(0);
        phs.push(Math.random() * Math.PI * 2);

        if ((ny < 0.04 || edge > 0.36) && Math.random() < (isMobile ? 0.06 : 0.13)) {
          const wispLen = 0.16 + Math.random() * 0.58;
          pts.push(
            px + (Math.random() - 0.5) * 0.2,
            py - wispLen,
            pz - Math.random() * 0.42
          );
          const wBright = 0.32 + Math.random() * 0.42;
          cols.push(wBright * 0.78, wBright * 0.94, Math.min(1, wBright * 1.12));
          isWisp.push(1);
          phs.push(Math.random() * Math.PI * 2);
        }
      }
    }

    baseCoords = new Float32Array(pts);
    baseColors = new Float32Array(cols);
    wispMask = new Uint8Array(isWisp);
    phases = new Float32Array(phs);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cols), 3));

    const mat = new THREE.PointsMaterial({
      size: isMobile ? 0.058 : 0.062,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.96,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    portraitPoints = new THREE.Points(geo, mat);
    portraitRig.add(portraitPoints);
  };
  img.src = portraitSrc;

  return {
    group,
    triggerRole(roleIndex) {
      if (roleIndex !== currentRole) {
        currentRole = roleIndex;
        morphImpulse = 1.0;
        drawGlyph(ROLE_GLYPHS[currentRole % ROLE_GLYPHS.length]);
      }
    },
    update(time, state, camera, dt) {
      // Animate subtle vertical dotted matrix rain
      const rAttr = rainGeo.attributes.position;
      for (let i = 0; i < rainCount; i++) {
        let y = rAttr.array[i * 3 + 1] - rainSpeeds[i] * dt * 0.9;
        if (y < -4.8) y = 4.8;
        rAttr.array[i * 3 + 1] = y;
      }
      rAttr.needsUpdate = true;

      if (state.teamIndex !== currentRole) {
        currentRole = state.teamIndex;
        morphImpulse = 1.0;
        drawGlyph(ROLE_GLYPHS[currentRole % ROLE_GLYPHS.length]);
      }
      morphImpulse = Math.max(0, morphImpulse - dt * 1.85);
      glyphPlane.position.x = (isMobile ? 0.82 : 1.75) - state.pointer.x * 0.22;
      glyphPlane.position.y = (isMobile ? 1.25 : 0.15) + state.pointer.y * 0.14;

      const pose = ROLE_POSES[currentRole % ROLE_POSES.length];
      const mobileScale = isMobile ? 0.76 : 1.0;
      const targetRotY = pose.rotY + state.pointer.x * 0.24;
      const targetRotX = pose.rotX + state.pointer.y * 0.14;
      const targetScale = pose.scale * mobileScale;

      curRotY += (targetRotY - curRotY) * 0.08;
      curRotX += (targetRotX - curRotX) * 0.08;
      curScale += (targetScale - curScale) * 0.08;

      portraitRig.rotation.y = curRotY;
      portraitRig.rotation.x = curRotX;
      portraitRig.scale.setScalar(curScale);

      if (portraitPoints && baseCoords) {
        const posAttr = portraitPoints.geometry.attributes.position;
        const colAttr = portraitPoints.geometry.attributes.color;
        const arr = posAttr.array;
        const cArr = colAttr.array;
        const total = wispMask.length;
        const burst = morphImpulse * morphImpulse;

        for (let i = 0; i < total; i++) {
          const i3 = i * 3;
          const bx = baseCoords[i3];
          const by = baseCoords[i3 + 1];
          const bz = baseCoords[i3 + 2];
          const ph = phases[i];

          if (wispMask[i] === 1) {
            // Drifting shoulder wisps
            const drift = ((time * 0.35 + ph) % 1.0);
            arr[i3] = bx + Math.sin(time * 1.4 + ph) * 0.08;
            arr[i3 + 1] = by - drift * 0.42;
            arr[i3 + 2] = bz + Math.cos(time * 1.1 + ph) * 0.09;
          } else {
            // Subtle breathing + role-switch curl-noise scatter burst
            const breath = Math.sin(time * 1.2 + ph) * 0.012;
            const scatter = burst * (0.42 + pose.spread);
            arr[i3] = bx + Math.sin(ph * 2.1 + time * 3.0) * scatter;
            arr[i3 + 1] = by + Math.cos(ph * 1.7 + time * 2.6) * scatter * 0.7 + breath;
            arr[i3 + 2] = bz + Math.sin(ph * 3.3) * (scatter * 1.4 + pose.spread * 0.25);
          }

          // Subtle cyan highlight modulation per role
          const cBoost = pose.cyanBoost;
          cArr[i3] = Math.min(1, baseColors[i3] * (1 - cBoost * 0.18));
          cArr[i3 + 1] = Math.min(1, baseColors[i3 + 1] + cBoost * 0.06);
          cArr[i3 + 2] = Math.min(1, baseColors[i3 + 2] + cBoost * 0.18);
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
      }

      camera.position.set(state.pointer.x * 0.18, -state.pointer.y * 0.12, 6.3);
      camera.lookAt(0, isMobile ? 0.2 : 0, 0);
    }
  };
}
