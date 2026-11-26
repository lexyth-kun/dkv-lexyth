export function createKeahlianShardScene(THREE, isMobile) {
  const group = new THREE.Group();

  // Sculpted asymmetric crystalline monolith shard (original procedural geometry)
  const shardGeo = new THREE.OctahedronGeometry(1.55, 1);
  const pos = shardGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Elongate vertically & add asymmetric chiseled blade planes
    const sy = y * 1.55;
    const sx = x * (0.68 + Math.sin(y * 2.1) * 0.14);
    const sz = z * (0.52 + Math.cos(x * 2.4) * 0.12);
    pos.setXYZ(i, sx, sy, sz);
  }
  shardGeo.computeVertexNormals();

  // Custom GLSL Iridescent Liquid Chrome Shader (original procedural thin-film fresnel)
  const uniforms = {
    uTime: { value: 0 },
    uAccentPhase: { value: 0 }
  };

  const shardMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec3 vNormalW;
      varying vec3 vViewDir;
      varying vec3 vPos;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        vPos = position;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uAccentPhase;
      varying vec3 vNormalW;
      varying vec3 vViewDir;
      varying vec3 vPos;

      vec3 thinFilm(float x) {
        vec3 c = 0.5 + 0.5 * cos(6.28318 * (x + vec3(0.0, 0.28, 0.56)));
        return c;
      }

      void main() {
        vec3 N = normalize(vNormalW);
        vec3 V = normalize(vViewDir);
        float ndv = clamp(dot(N, V), 0.0, 1.0);
        float fresnel = pow(1.0 - ndv, 2.35);

        // Two crisp studio strip lights for liquid chrome facets
        vec3 L1 = normalize(vec3(0.65, 0.85, 0.72));
        vec3 L2 = normalize(vec3(-0.8, -0.35, 0.6));
        vec3 H1 = normalize(L1 + V);
        vec3 H2 = normalize(L2 + V);

        float spec1 = pow(max(dot(N, H1), 0.0), 42.0);
        float spec2 = pow(max(dot(N, H2), 0.0), 22.0);
        float diff = max(dot(N, L1), 0.0) * 0.55 + max(dot(N, L2), 0.0) * 0.25;

        // Chrome obsidian base + thin-film electric blue/cyan/silver iridescence
        vec3 baseDark = vec3(0.05, 0.06, 0.09);
        vec3 chromeSilver = vec3(0.84, 0.89, 0.98);
        vec3 irid = thinFilm(fresnel * 1.45 + vPos.y * 0.22 + uAccentPhase * 0.14 + uTime * 0.06);
        vec3 studioBlue = mix(vec3(0.11, 0.24, 1.0), vec3(0.13, 0.93, 1.0), fresnel);

        vec3 col = mix(baseDark, chromeSilver, diff * 0.72);
        col = mix(col, mix(irid, studioBlue, 0.52), fresnel * 0.88);
        col += vec3(1.0, 1.0, 1.0) * spec1 * 1.15;
        col += vec3(0.28, 0.86, 1.0) * spec2 * 0.65;

        gl_FragColor = vec4(col, 1.0);
      }
    `
  });

  const shardRig = new THREE.Group();
  shardRig.position.set(0, isMobile ? 0.55 : 0.12, 0);
  const shardMesh = new THREE.Mesh(shardGeo, shardMat);
  shardRig.add(shardMesh);

  // Subtle wireframe edge highlight accentuating crystalline geometry
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(shardGeo, 12),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 })
  );
  shardRig.add(wire);

  // Orbiting micro-crystal satellites
  const satellites = [];
  const satGeo = new THREE.OctahedronGeometry(0.14, 0);
  const satMat = new THREE.MeshStandardMaterial({
    color: 0xdce6ff,
    metalness: 0.92,
    roughness: 0.15
  });
  for (let i = 0; i < 6; i++) {
    const m = new THREE.Mesh(satGeo, satMat);
    const a = (i / 6) * Math.PI * 2;
    m.userData = { angle: a, radius: 2.25 + (i % 2) * 0.45, yOff: (i - 2.5) * 0.42 };
    shardRig.add(m);
    satellites.push(m);
  }

  group.add(shardRig);

  let targetRotY = 0;
  let currentRotY = 0;
  let lastIdx = 0;

  return {
    group,
    spinToIndex(idx) {
      if (idx !== lastIdx) {
        const dir = idx > lastIdx ? 1 : -1;
        targetRotY += dir * Math.PI * 0.55;
        lastIdx = idx;
      }
    },
    update(time, state, camera) {
      uniforms.uTime.value = time;
      uniforms.uAccentPhase.value = state.keahlianIndex || 0;

      const dragKick = (state.keahlianDrag || 0) * 0.012;
      const goalY = targetRotY + time * 0.32 + state.pointer.x * 0.48 + dragKick;
      currentRotY += (goalY - currentRotY) * 0.09;

      shardRig.rotation.y = currentRotY;
      shardRig.rotation.x = Math.sin(time * 0.65) * 0.16 - state.pointer.y * 0.24;
      shardRig.rotation.z = Math.cos(time * 0.42) * 0.09;
      shardRig.scale.setScalar(isMobile ? 0.72 : 1.0);

      for (const s of satellites) {
        const a = s.userData.angle + time * 0.35;
        s.position.set(
          Math.cos(a) * s.userData.radius,
          s.userData.yOff + Math.sin(time * 1.1 + a) * 0.18,
          Math.sin(a) * s.userData.radius * 0.75
        );
        s.rotation.x = time * 0.8 + a;
        s.rotation.y = time * 0.6;
      }

      camera.position.set(state.pointer.x * 0.16, -state.pointer.y * 0.1, 6.2);
      camera.lookAt(0, isMobile ? 0.25 : 0, 0);
    }
  };
}
