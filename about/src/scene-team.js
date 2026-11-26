export function createTeamPointCloudScene(THREE, particleTex, isMobile) {
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

  // Anonymous Faceless Hologram Silhouette Rig
  const silhouetteRig = new THREE.Group();
  silhouetteRig.position.set(isMobile ? 0 : -0.22, isMobile ? 0.52 : -0.05, 0.35);
  group.add(silhouetteRig);

  // Bold geometric background letter plane behind the 3D hologram silhouette
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

  // Build 100% Procedural 3D Faceless Hooded Anonymous Hologram Silhouette
  // Zero facial features: hollow dark face cavity framed by glowing holographic cowl, collar, and shoulders
  const pts = [];
  const cols = [];
  const isWisp = [];
  const phs = [];
  const rimFlags = [];

  const pushPt = (x, y, z, r, g, b, wisp = 0, rim = 0) => {
    pts.push(x, y, z);
    cols.push(r, g, b);
    isWisp.push(wisp);
    rimFlags.push(rim);
    phs.push(Math.random() * Math.PI * 2);
  };

  // Deterministic seeded pseudo-random for consistent crisp geometry
  let seed = 133742;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  const density = isMobile ? 0.62 : 1.0;

  // 1. Sculpted Hood Cowl (wraps around back, crown, and sides; front face cavity stays EMPTY/DARK)
  const hoodRings = Math.round(78 * density);
  const hoodCols = Math.round(96 * density);
  for (let iy = 0; iy < hoodRings; iy++) {
    const v = iy / (hoodRings - 1); // 0 = base of hood/neck (y=0.52), 1 = top apex of hood (y=2.08)
    const y = 0.52 + v * 1.56;

    // Natural sculpted hood profile: slightly wider around cheeks/jaw, smooth tapered apex
    const crownProfile = Math.sin(Math.pow(v, 0.72) * Math.PI);
    const rx = 0.62 + crownProfile * 0.34 - v * 0.08;
    const rz = 0.68 + crownProfile * 0.36;

    // Slight forward overhang at hood brow apex
    const zShift = Math.sin(v * Math.PI) * 0.14 - 0.05;

    for (let ix = 0; ix < hoodCols; ix++) {
      const u = ix / hoodCols;
      const theta = u * Math.PI * 2; // 0 = front (+Z), PI = back (-Z)
      const frontAngle = Math.abs(Math.atan2(Math.sin(theta), Math.cos(theta))); // 0 at front, PI at back

      // Define the faceless oval opening in front of the hood (completely dark hollow void!)
      const openingHalfAngle = 0.96 * Math.sin(Math.max(0, Math.min(1, (v - 0.05) / 0.84)) * Math.PI);
      if (v > 0.06 && v < 0.88 && frontAngle < openingHalfAngle) {
        continue; // Pure dark faceless cavity: ZERO eyes, ZERO nose, ZERO mouth
      }

      // Highlight the glowing sculptural rim framing the faceless hood opening
      const distFromRim = Math.abs(frontAngle - openingHalfAngle);
      const isOpeningRim = v > 0.06 && v < 0.9 && distFromRim < 0.14;
      const isSilhouetteEdge = Math.abs(Math.sin(theta)) > 0.86;
      const scanStripe = (iy % 3 === 0) ? 1.0 : 0.45;

      // Thin back interior slightly so silhouette stays airy & clearly holographic
      if (!isOpeningRim && !isSilhouetteEdge && rand() > 0.52 * scanStripe) continue;

      const x = Math.sin(theta) * rx + (rand() - 0.5) * 0.018;
      const z = Math.cos(theta) * rz + zShift + (rand() - 0.5) * 0.018;

      if (isOpeningRim) {
        // Razor-crisp bright ice-cyan/white holographic hood rim defining the faceless silhouette
        pushPt(x, y, z, 0.78, 0.98, 1.0, 0, 1);
      } else if (isSilhouetteEdge || v > 0.91) {
        pushPt(x, y, z, 0.68, 0.9, 1.0, 0, 1);
      } else {
        const shade = 0.22 + (1 - frontAngle / Math.PI) * 0.34;
        pushPt(x, y, z, shade * 0.72, shade * 0.92, Math.min(1, shade * 1.15), 0, 0);
      }
    }
  }

  // Extra crisp double-pass rim ribbon around the faceless cowl opening for unmistakable silhouette read
  const rimSteps = Math.round(260 * density);
  for (let i = 0; i < rimSteps; i++) {
    const t = i / (rimSteps - 1);
    const v = 0.06 + t * 0.83;
    const y = 0.52 + v * 1.56;
    const crownProfile = Math.sin(Math.pow(v, 0.72) * Math.PI);
    const rx = 0.62 + crownProfile * 0.34 - v * 0.08;
    const rz = 0.68 + crownProfile * 0.36;
    const zShift = Math.sin(v * Math.PI) * 0.14 - 0.05;
    const openingHalfAngle = 0.96 * Math.sin(Math.max(0, Math.min(1, (v - 0.05) / 0.84)) * Math.PI);

    for (const side of [-1, 1]) {
      const ang = side * openingHalfAngle;
      const x = Math.sin(ang) * rx + (rand() - 0.5) * 0.025;
      const z = Math.cos(ang) * rz + zShift + (rand() - 0.5) * 0.025;
      pushPt(x, y, z, 0.85, 0.99, 1.0, 0, 1);
    }
  }

  // 2. Sculpted High Collar + Broad Anonymous Shoulders + Upper Torso Silhouette
  const torsoRings = Math.round(92 * density);
  const torsoCols = Math.round(112 * density);
  for (let iy = 0; iy < torsoRings; iy++) {
    const v = iy / (torsoRings - 1); // 0 = bottom fade (y=-2.25), 1 = neck/collar join (y=0.66)
    const y = -2.25 + v * 2.91;

    // Anatomically grounded silhouette width: narrow neck -> smooth sloping shoulders -> solid upper chest
    let rx;
    let rz;
    if (v > 0.84) {
      // High structured hoodie collar around neck
      const k = (v - 0.84) / 0.16; // 0 = shoulder top, 1 = collar top
      rx = 1.05 - k * 0.44;
      rz = 0.64 - k * 0.1;
    } else if (v > 0.62) {
      // Broad shoulder slope
      const k = (v - 0.62) / 0.22; // 0 = full shoulder breadth, 1 = collar base
      const ease = 1 - k * k;
      rx = 1.05 + ease * 0.88;
      rz = 0.64 + ease * 0.18;
    } else {
      // Upper chest & jacket silhouette tapering cleanly down
      const k = v / 0.62; // 0 = bottom, 1 = shoulder line
      rx = 1.56 + k * 0.37;
      rz = 0.68 + Math.sin(k * Math.PI * 0.85) * 0.16;
    }

    // Bottom holographic dissolve probability
    const bottomFade = Math.min(1, v / 0.26);
    const isScanBand = iy % 3 === 0;

    for (let ix = 0; ix < torsoCols; ix++) {
      const u = ix / torsoCols;
      const theta = u * Math.PI * 2;
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      // Subtle V-seam along front center hoodie zipper/lapel
      const isCenterSeam = cosT > 0.92 && Math.abs(sinT) < 0.09 && v > 0.18 && v < 0.88;
      const isEdgeRim = Math.abs(sinT) > 0.84;
      const isCollarRim = v > 0.83 && v < 0.94 && cosT > 0.15;

      const keepProb = isEdgeRim || isCollarRim || isCenterSeam
        ? 0.92 * bottomFade
        : (isScanBand ? 0.56 : 0.22) * bottomFade;

      if (rand() > keepProb) continue;

      // Subtle cloth folds across shoulders & chest
      const fold = Math.sin(theta * 5 + y * 2.2) * 0.028;
      const x = sinT * (rx + fold) + (rand() - 0.5) * 0.02;
      const z = cosT * (rz + fold * 0.5) + (rand() - 0.5) * 0.02;

      if (isEdgeRim || isCollarRim) {
        const bright = (0.68 + rand() * 0.3) * bottomFade;
        pushPt(x, y, z, bright * 0.72, bright * 0.96, Math.min(1, bright * 1.15), 0, 1);
      } else if (isCenterSeam) {
        pushPt(x, y, z, 0.35 * bottomFade, 0.88 * bottomFade, 1.0 * bottomFade, 0, 1);
      } else {
        const frontLight = Math.max(0.14, cosT * 0.45 + 0.36) * bottomFade;
        pushPt(x, y, z, frontLight * 0.78, frontLight * 0.9, Math.min(1, frontLight * 1.12), 0, 0);
      }

      // Drifting holographic energy wisps trailing off shoulders & lower silhouette
      if ((isEdgeRim || v < 0.22) && rand() < (isMobile ? 0.09 : 0.16)) {
        const drop = 0.18 + rand() * 0.72;
        const wb = (0.34 + rand() * 0.45) * Math.max(0.45, bottomFade);
        pushPt(
          x + (rand() - 0.5) * 0.24,
          y - drop,
          z - rand() * 0.38,
          wb * 0.55,
          wb * 0.92,
          Math.min(1, wb * 1.2),
          1,
          0
        );
      }
    }
  }

  // 3. Subtle Holographic Projection Halo Ring at Shoulder/Neck Plane (pure geometric accent)
  const ringPts = Math.round(180 * density);
  for (let i = 0; i < ringPts; i++) {
    const a = (i / ringPts) * Math.PI * 2;
    const x = Math.cos(a) * 2.25;
    const z = Math.sin(a) * 1.05;
    const y = -1.95 + Math.sin(a * 2) * 0.06;
    pushPt(x, y, z, 0.14, 0.78, 1.0, 0, 1);
  }

  const baseCoords = new Float32Array(pts);
  const baseColors = new Float32Array(cols);
  const wispMask = new Uint8Array(isWisp);
  const rimMask = new Uint8Array(rimFlags);
  const phases = new Float32Array(phs);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cols), 3));

  const mat = new THREE.PointsMaterial({
    size: isMobile ? 0.056 : 0.058,
    map: particleTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.96,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });

  const silhouettePoints = new THREE.Points(geo, mat);
  silhouetteRig.add(silhouettePoints);

  let currentRole = 0;
  let morphImpulse = 0;
  let curRotY = -0.14;
  let curRotX = 0.03;
  let curScale = isMobile ? 0.72 : 1.04;

  const ROLE_POSES = [
    { rotY: -0.14, rotX: 0.03, scale: 1.04, cyanBoost: 0.18, spread: 0.0 },
    { rotY: 0.34, rotX: -0.05, scale: 1.08, cyanBoost: 0.28, spread: 0.06 },
    { rotY: -0.32, rotX: 0.07, scale: 1.02, cyanBoost: 0.52, spread: 0.12 },
    { rotY: 0.18, rotX: -0.03, scale: 1.06, cyanBoost: 0.32, spread: 0.04 }
  ];

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
      // Animate vertical dotted matrix rain
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
      const mobileScale = isMobile ? 0.72 : 1.0;
      const targetRotY = pose.rotY + state.pointer.x * 0.28;
      const targetRotX = pose.rotX + state.pointer.y * 0.14;
      const targetScale = pose.scale * mobileScale;

      curRotY += (targetRotY - curRotY) * 0.08;
      curRotX += (targetRotX - curRotX) * 0.08;
      curScale += (targetScale - curScale) * 0.08;

      silhouetteRig.rotation.y = curRotY;
      silhouetteRig.rotation.x = curRotX;
      silhouetteRig.scale.setScalar(curScale);

      const posAttr = silhouettePoints.geometry.attributes.position;
      const colAttr = silhouettePoints.geometry.attributes.color;
      const arr = posAttr.array;
      const cArr = colAttr.array;
      const total = wispMask.length;
      const burst = morphImpulse * morphImpulse;

      // Sweeping upward holographic scanline plane (-2.4 .. +2.2)
      const scanY = -2.4 + ((time * 0.75) % 4.6);

      for (let i = 0; i < total; i++) {
        const i3 = i * 3;
        const bx = baseCoords[i3];
        const by = baseCoords[i3 + 1];
        const bz = baseCoords[i3 + 2];
        const ph = phases[i];

        if (wispMask[i] === 1) {
          const drift = (time * 0.38 + ph) % 1.0;
          arr[i3] = bx + Math.sin(time * 1.4 + ph) * 0.09;
          arr[i3 + 1] = by - drift * 0.45;
          arr[i3 + 2] = bz + Math.cos(time * 1.1 + ph) * 0.09;
        } else {
          const breath = Math.sin(time * 1.15 + ph) * 0.012;
          const scatter = burst * (0.42 + pose.spread);
          arr[i3] = bx + Math.sin(ph * 2.1 + time * 3.0) * scatter;
          arr[i3 + 1] = by + Math.cos(ph * 1.7 + time * 2.6) * scatter * 0.7 + breath;
          arr[i3 + 2] = bz + Math.sin(ph * 3.3) * (scatter * 1.35 + pose.spread * 0.22);
        }

        // Holographic scanline pulse + subtle cyan rim boost per role
        const scanDist = Math.abs(by - scanY);
        const scanPulse = scanDist < 0.28 ? (1 - scanDist / 0.28) * 0.55 : 0;
        const rimBoost = rimMask[i] === 1 ? pose.cyanBoost * 0.22 : 0;

        cArr[i3] = Math.min(1, baseColors[i3] + scanPulse * 0.35);
        cArr[i3 + 1] = Math.min(1, baseColors[i3 + 1] + scanPulse * 0.75 + rimBoost * 0.5);
        cArr[i3 + 2] = Math.min(1, baseColors[i3 + 2] + scanPulse * 0.95 + rimBoost);
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      camera.position.set(state.pointer.x * 0.18, -state.pointer.y * 0.12, 6.2);
      camera.lookAt(0, isMobile ? 0.2 : 0, 0);
    }
  };
}
