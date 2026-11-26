function makeGlyphSpriteTexture(THREE, kind) {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';

  if (kind === 'dot') {
    ctx.beginPath();
    ctx.arc(32, 32, 14, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'plus') {
    ctx.beginPath();
    ctx.moveTo(32, 14);
    ctx.lineTo(32, 50);
    ctx.moveTo(14, 32);
    ctx.lineTo(50, 32);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(32, 13);
    ctx.lineTo(50, 47);
    ctx.lineTo(14, 47);
    ctx.closePath();
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export function createExpertiseRibbonScene(THREE, isMobile) {
  const group = new THREE.Group();

  // Flowing 3D sculpted pure-white satin ribbon weaving behind the 4 fanned cards
  const segsU = 110;
  const segsV = 12;
  const geo = new THREE.PlaneGeometry(16, 1.85, segsU, segsV);
  const posAttr = geo.attributes.position;
  const baseX = new Float32Array(posAttr.count);
  const baseY = new Float32Array(posAttr.count);
  for (let i = 0; i < posAttr.count; i++) {
    baseX[i] = posAttr.getX(i);
    baseY[i] = posAttr.getY(i);
  }

  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xdce6ff,
    emissiveIntensity: 0.32,
    roughness: 0.25,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const ribbonMesh = new THREE.Mesh(geo, ribbonMat);
  ribbonMesh.position.set(0, 0, -1.8);
  group.add(ribbonMesh);

  // Second thinner companion white ribbon crossing counter-diagonal
  const geo2 = new THREE.PlaneGeometry(16, 0.55, 80, 6);
  const posAttr2 = geo2.attributes.position;
  const baseX2 = new Float32Array(posAttr2.count);
  const baseY2 = new Float32Array(posAttr2.count);
  for (let i = 0; i < posAttr2.count; i++) {
    baseX2[i] = posAttr2.getX(i);
    baseY2[i] = posAttr2.getY(i);
  }
  const ribbonMesh2 = new THREE.Mesh(
    geo2,
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, side: THREE.DoubleSide })
  );
  ribbonMesh2.position.set(0, -0.4, -2.6);
  group.add(ribbonMesh2);

  return {
    group,
    update(time, state, camera) {
      const p = state.expertiseProgress || 0;
      const t = time * 0.9 + p * 3.8;

      for (let i = 0; i < posAttr.count; i++) {
        const bx = baseX[i];
        const by = baseY[i];
        const waveY = Math.sin(bx * 0.45 + t) * 1.45 + Math.cos(bx * 0.22 - t * 0.6) * 0.65;
        const twist = Math.sin(bx * 0.35 + t * 0.8) * 0.7;
        const y = waveY + by * Math.cos(twist);
        const z = Math.cos(bx * 0.42 + t) * 1.2 + by * Math.sin(twist);
        posAttr.setXYZ(i, bx, y, z);
      }
      posAttr.needsUpdate = true;
      geo.computeVertexNormals();

      for (let i = 0; i < posAttr2.count; i++) {
        const bx = baseX2[i];
        const by = baseY2[i];
        const waveY = Math.cos(bx * 0.38 - t * 0.75) * 1.9;
        const z = Math.sin(bx * 0.35 - t * 0.7) * 1.1;
        posAttr2.setXYZ(i, bx, waveY + by, z);
      }
      posAttr2.needsUpdate = true;

      ribbonMesh.rotation.z = -0.18 + p * 0.28;
      ribbonMesh.scale.setScalar(isMobile ? 0.75 : 1.0);
      ribbonMesh2.rotation.z = 0.22 - p * 0.24;

      camera.position.set(state.pointer.x * 0.22, -state.pointer.y * 0.14, 7.0);
      camera.lookAt(0, 0, -1.2);
    }
  };
}

export function createCtaParticleArchScene(THREE, isMobile) {
  const group = new THREE.Group();

  const kinds = ['dot', 'plus', 'tri'];
  const layers = [];

  for (let k = 0; k < kinds.length; k++) {
    const tex = makeGlyphSpriteTexture(THREE, kinds[k]);
    const count = isMobile ? 90 : 190;
    const positions = new Float32Array(count * 3);
    const meta = [];

    for (let i = 0; i < count; i++) {
      // Sculptural parabolic triumphal arch over the centered CTA headline
      const u = (i / (count - 1)) * 2 - 1; // -1 .. 1
      const spread = (Math.random() - 0.5) * 1.15;
      const archX = u * (isMobile ? 3.2 : 5.6) + (Math.random() - 0.5) * 0.28;
      const archY = (1 - u * u) * (isMobile ? 2.5 : 3.25) - 1.1 + spread * 0.65;
      const archZ = -1.6 - Math.abs(u) * 1.2 + (Math.random() - 0.5) * 1.4;

      positions[i * 3] = archX;
      positions[i * 3 + 1] = archY;
      positions[i * 3 + 2] = archZ;
      meta.push({ bx: archX, by: archY, bz: archZ, ph: Math.random() * Math.PI * 2, speed: 0.6 + Math.random() * 0.9 });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: kinds[k] === 'dot' ? 0.19 : 0.24,
      map: tex,
      color: 0xffffff,
      transparent: true,
      opacity: kinds[k] === 'dot' ? 0.85 : 0.72,
      depthWrite: false,
      sizeAttenuation: true
    });

    const pts = new THREE.Points(geo, mat);
    group.add(pts);
    layers.push({ geo, meta, pts });
  }

  return {
    group,
    update(time, state, camera) {
      const p = state.ctaProgress || 0;
      for (const layer of layers) {
        const attr = layer.geo.attributes.position;
        for (let i = 0; i < layer.meta.length; i++) {
          const m = layer.meta[i];
          const sway = Math.sin(time * m.speed + m.ph) * 0.16;
          const lift = Math.cos(time * 0.8 + m.ph) * 0.14;
          attr.array[i * 3] = m.bx * (0.94 + p * 0.14) + sway;
          attr.array[i * 3 + 1] = m.by + lift;
          attr.array[i * 3 + 2] = m.bz + Math.sin(time * 0.5 + m.ph) * 0.18;
        }
        attr.needsUpdate = true;
      }
      group.rotation.y = state.pointer.x * 0.14;
      group.rotation.x = -state.pointer.y * 0.08;
      camera.position.set(0, 0, 6.8);
      camera.lookAt(0, 0, -1.5);
    }
  };
}
