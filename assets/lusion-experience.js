/* ============================================================================
 * LUSION.CO FLUID CURSOR, 6-WORLD SPACE PORTAL & ABOUT EXPERIENCE
 * For dkv.lexyth.my.id (aligned with amc.web.id Lusion system)
 * ============================================================================ */

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function rangeMap(v, inMin, inMax) {
  if (inMax <= inMin) return 0;
  return clamp01((v - inMin) / (inMax - inMin));
}

function smoothstep(v) {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
}

function easeInOutCubic(v) {
  const x = clamp01(v);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function cleanEmDash(text) {
  return String(text || "").replace(/\s*[—–]\s*/g, ", ");
}

/* ============================================================================
 * PART 0: AMC-PARITY ARROW-FREE CUSTOM CURSOR & WHITE OIL-ON-WATER RIBBON TRAIL
 * ============================================================================ */

function computeOilWaterStopColors(phase, life, velocityNorm = 0.55) {
  const alpha = clamp01(life);
  const blueHue = Math.round(199 + Math.sin(phase * 0.65) * 6);
  const prismHue = Math.round(206 + Math.sin(phase * 0.95 + velocityNorm) * 28);
  return {
    coreWhite: `rgba(255, 255, 255, ${(alpha * 0.56).toFixed(3)})`,
    outlineLight: `rgba(255, 255, 255, ${(alpha * 0.84).toFixed(3)})`,
    outlineBlue: `hsla(${blueHue}, 94%, 62%, ${(alpha * 0.58).toFixed(3)})`,
    outlinePrism: `hsla(${prismHue}, 88%, 74%, ${(alpha * 0.36).toFixed(3)})`,
    shadowBlue: `hsla(${blueHue}, 92%, 68%, ${(alpha * 0.24).toFixed(3)})`,
  };
}

function stepFluidTrailDrops(drops, dt = 1) {
  const step = Math.max(0.25, Math.min(2.2, dt));
  const alive = [];
  for (let i = 0; i < drops.length; i++) {
    const d = drops[i];
    d.life -= d.decay * step;
    if (d.life <= 0.01) continue;
    d.huePhase += 0.05 * step;
    const curlX = Math.cos(d.huePhase * 1.1 + d.swirl) * 0.12 * step;
    const curlY = Math.sin(d.huePhase * 0.95 - d.swirl) * 0.12 * step;
    d.x += (d.vx + curlX) * step;
    d.y += (d.vy + curlY) * step;
    d.vx *= Math.pow(0.91, step);
    d.vy *= Math.pow(0.91, step);
    d.radius += (d.maxRadius - d.radius) * 0.075 * step;
    alive.push(d);
  }
  return alive;
}

export function mountLusionFluidCursor(trailCanvas) {
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduced || !finePointer) {
    return { destroy() {} };
  }

  // Hide default OS arrow cursor cleanly on fine-pointer desktop (matching amc.web.id)
  document.documentElement.classList.add("has-custom-cursor");

  // Reuse or create sleek AMC-style glowing sky-blue cursor dot + spring ring
  let dot = document.getElementById("dkv-cursor-dot");
  let ring = document.getElementById("dkv-cursor-ring");
  let label = document.getElementById("dkv-cursor-label");

  if (!dot) {
    dot = document.createElement("div");
    dot.id = "dkv-cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);
  }
  if (!ring) {
    ring = document.createElement("div");
    ring.id = "dkv-cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    label = document.createElement("span");
    label.id = "dkv-cursor-label";
    label.textContent = "BUKA";
    ring.appendChild(label);
    document.body.appendChild(ring);
  }

  const canvas = trailCanvas || document.getElementById("watercolorCanvas");
  const ctx = canvas ? canvas.getContext("2d", { alpha: true }) : null;

  let trailW = window.innerWidth;
  let trailH = window.innerHeight;
  let drops = [];
  let trailRafId = 0;
  let trailRunning = false;
  let lastTrailFrame = performance.now();
  let phaseCursor = 0;
  let hoveringInput = false;
  let destroyed = false;

  const resizeTrail = () => {
    if (!canvas || !ctx) return;
    trailW = window.innerWidth;
    trailH = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(trailW * dpr);
    canvas.height = Math.round(trailH * dpr);
    canvas.style.width = `${trailW}px`;
    canvas.style.height = `${trailH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  if (canvas && ctx) {
    canvas.classList.add("dkv-oil-trail-canvas");
    resizeTrail();
    window.addEventListener("resize", resizeTrail);
  }

  const renderTrail = (now) => {
    if (destroyed || !ctx || !canvas) {
      trailRunning = false;
      return;
    }
    const dt = Math.min(2, Math.max(0.4, (now - lastTrailFrame) / 16.667));
    lastTrailFrame = now;

    drops = stepFluidTrailDrops(drops, dt);
    ctx.clearRect(0, 0, trailW, trailH);

    // Single seamless closed liquid oil-on-water ribbon polygon:
    // Pure white translucent core + ONLY continuous outer silhouette carries
    // soft light-blue caustic shadow and refractive oil-on-water contour outline.
    const n = drops.length;
    if (n >= 3) {
      const leftX = new Float32Array(n);
      const leftY = new Float32Array(n);
      const rightX = new Float32Array(n);
      const rightY = new Float32Array(n);

      for (let i = 0; i < n; i++) {
        const prev = drops[Math.max(0, i - 1)];
        const next = drops[Math.min(n - 1, i + 1)];
        let tx = next.x - prev.x;
        let ty = next.y - prev.y;
        const len = Math.hypot(tx, ty) || 1;
        tx /= len;
        ty /= len;
        const nx = -ty;
        const ny = tx;

        const t = i / (n - 1);
        const taper = Math.pow(t, 0.85) * Math.sin(Math.min(1, t * 1.06) * Math.PI * 0.88);
        const halfW = Math.max(0.6, drops[i].radius * 0.56 * taper * drops[i].life);

        leftX[i] = drops[i].x + nx * halfW;
        leftY[i] = drops[i].y + ny * halfW;
        rightX[i] = drops[i].x - nx * halfW;
        rightY[i] = drops[i].y - ny * halfW;
      }

      const head = drops[n - 1];
      const tail = drops[0];
      const avgLife = Math.min(1, head.life * 0.95);
      const colors = computeOilWaterStopColors(head.huePhase, avgLife, 0.55);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);

      for (let i = 1; i < n; i++) {
        const mx = (leftX[i - 1] + leftX[i]) * 0.5;
        const my = (leftY[i - 1] + leftY[i]) * 0.5;
        ctx.quadraticCurveTo(leftX[i - 1], leftY[i - 1], mx, my);
      }
      ctx.quadraticCurveTo(leftX[n - 1], leftY[n - 1], head.x, head.y);
      ctx.quadraticCurveTo(rightX[n - 1], rightY[n - 1], rightX[n - 1], rightY[n - 1]);

      for (let i = n - 2; i >= 0; i--) {
        const mx = (rightX[i + 1] + rightX[i]) * 0.5;
        const my = (rightY[i + 1] + rightY[i]) * 0.5;
        ctx.quadraticCurveTo(rightX[i + 1], rightY[i + 1], mx, my);
      }
      ctx.closePath();

      // 1. Pure white clear-water interior + soft light-blue outer shadow ONLY
      ctx.shadowColor = colors.shadowBlue;
      ctx.shadowBlur = 16;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = `rgba(255, 255, 255, ${(avgLife * 0.88).toFixed(3)})`;
      ctx.fill();

      // 2. Crisp continuous refractive light-blue oil-on-water contour outline
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      const rimGrad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      rimGrad.addColorStop(0, "rgba(125, 211, 252, 0)");
      rimGrad.addColorStop(0.35, colors.outlinePrism);
      rimGrad.addColorStop(0.75, colors.outlineBlue);
      rimGrad.addColorStop(1, colors.outlineLight);
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 1.35;
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.restore();
    }

    if (drops.length > 0) {
      trailRafId = requestAnimationFrame(renderTrail);
    } else {
      trailRunning = false;
      trailRafId = 0;
    }
  };

  const ensureTrailLoop = () => {
    if (trailRunning || !ctx || destroyed) return;
    trailRunning = true;
    lastTrailFrame = performance.now();
    trailRafId = requestAnimationFrame(renderTrail);
  };

  let mx = -100;
  let my = -100;
  let prevMx = -100;
  let prevMy = -100;
  let rx = -100;
  let ry = -100;
  let scale = 1;
  let targetScale = 1;
  let active = false;
  let cursorRafId = 0;

  const onPointerMove = (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    const nextX = e.clientX;
    const nextY = e.clientY;

    if (!active) {
      active = true;
      mx = prevMx = rx = nextX;
      my = prevMy = ry = nextY;
      if (!hoveringInput) {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      return;
    }

    const dx = nextX - prevMx;
    const dy = nextY - prevMy;
    const dist = Math.hypot(dx, dy);

    if (dist > 180) {
      drops = [];
      prevMx = nextX;
      prevMy = nextY;
      mx = nextX;
      my = nextY;
      return;
    }

    if (ctx && canvas && !hoveringInput && dist >= 5) {
      const steps = Math.min(3, Math.max(1, Math.floor(dist / 14)));
      const speedBoost = Math.min(1, dist / 34);
      const angle = Math.atan2(dy, dx);
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        phaseCursor += 0.28;
        drops.push({
          x: prevMx + dx * t,
          y: prevMy + dy * t,
          vx: (dx / steps) * 0.08,
          vy: (dy / steps) * 0.08,
          radius: 10 + speedBoost * 6,
          maxRadius: 19 + speedBoost * 10,
          life: 0.9,
          decay: 0.042,
          huePhase: phaseCursor,
          swirl: angle,
        });
      }
      if (drops.length > 22) drops.splice(0, drops.length - 22);
      if (canvas.dataset.trailActive !== "true") canvas.dataset.trailActive = "true";
      ensureTrailLoop();
    }

    prevMx = nextX;
    prevMy = nextY;
    mx = nextX;
    my = nextY;
  };

  const onMouseOver = (e) => {
    const target = e.target;
    if (!target || !target.closest) return;
    hoveringInput = Boolean(target.closest("input, textarea, select"));
    if (hoveringInput) {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      return;
    }
    if (active) {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    }
    const viewEl = Boolean(target.closest('[data-cursor="view"], .syllabus-card, .dkv-space-node'));
    const interactive = Boolean(target.closest('a, button, [role="button"], [role="tab"], [data-cursor="hover"]'));
    ring.classList.toggle("is-view-hover", viewEl);
    dot.classList.toggle("is-view-hover", viewEl);
    if (label) {
      label.textContent = target.closest(".dkv-space-node") ? "MODUL" : "EXPLORE";
    }
    targetScale = viewEl ? 1.04 : interactive ? 1.5 : 1;
  };

  const onMouseOut = (e) => {
    if (!e.relatedTarget) {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      ring.classList.remove("is-view-hover");
      dot.classList.remove("is-view-hover");
      active = false;
    }
  };

  let cursorLoopRunning = false;

  const ensureCursorLoop = () => {
    if (cursorLoopRunning || destroyed) return;
    cursorLoopRunning = true;
    cursorRafId = requestAnimationFrame(cursorLoop);
  };

  const cursorLoop = () => {
    if (destroyed || !active) {
      cursorLoopRunning = false;
      cursorRafId = 0;
      return;
    }
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    scale += (targetScale - scale) * 0.18;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    if (Math.hypot(mx - rx, my - ry) > 0.25 || Math.abs(targetScale - scale) > 0.005) {
      cursorRafId = requestAnimationFrame(cursorLoop);
    } else {
      cursorLoopRunning = false;
      cursorRafId = 0;
    }
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      onPointerMove(e);
      if (active) ensureCursorLoop();
    },
    { passive: true }
  );
  document.addEventListener("mouseover", (e) => {
    onMouseOver(e);
    if (active) ensureCursorLoop();
  });
  window.addEventListener("mouseout", onMouseOut);

  return {
    destroy() {
      destroyed = true;
      cancelAnimationFrame(cursorRafId);
      cancelAnimationFrame(trailRafId);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("resize", resizeTrail);
      document.documentElement.classList.remove("has-custom-cursor");
    },
  };
}

/* ============================================================================
 * PART 1: 6-WORLD SPACE TUNNEL DATA & DETERMINISTIC CHOREOGRAPHY MATH
 * (1-to-1 architectural parity with amc.web.id #dunia-baru 6 formations)
 * ============================================================================ */

const SPACE_WORLDS = [
  {
    index: 0,
    code: "01",
    shortLabel: "Pra-Produksi",
    label: "Pra-Produksi & Storyboard Produk",
    subtitle: "Merumuskan ide iklan TVC, konsep monolog 16:9, naskah 2 kolom, dan storyboard 9 frame.",
    watermark: "STORYBOARD",
    formation: "helix",
    bgHex: 0x06253c,
    accentHex: 0x38bdf8,
    ringSides: 6,
    nodes: [
      { code: "M01", title: "Ide & Konsep TVC", meta: "Tahap 01 • Pertemuan 01", weekId: "pr-01" },
      { code: "M01", title: "Naskah 2 Kolom", meta: "Visual & Voice Over", weekId: "pr-01" },
      { code: "M01", title: "Storyboard 9 Frame", meta: "Shot WS / MS / CU", weekId: "pr-01" },
      { code: "M01", title: "Brief Iklan 16:9", meta: "Cetak Biru Produksi", weekId: "pr-01" },
    ],
  },
  {
    index: 1,
    code: "02",
    shortLabel: "Timeline",
    label: "Foldering & Rough Cut Cepat (Q & W)",
    subtitle: "Menata 5 folder aset secara rapi, memilih klip terbaik (I & O), dan ripple trim cepat Q & W.",
    watermark: "TIMELINE",
    formation: "spiral",
    bgHex: 0x0a2246,
    accentHex: 0x60a5fa,
    ringSides: 48,
    nodes: [
      { code: "M02", title: "5 Folder Aset Rapi", meta: "Manajemen Bins Studio", weekId: "pr-02" },
      { code: "M02", title: "Pilih Klip I & O", meta: "Source Monitor Selection", weekId: "pr-02" },
      { code: "M02", title: "Ripple Trim Q & W", meta: "Rough Cut Super Cepat", weekId: "pr-02" },
      { code: "M02", title: "Pacing & Ritme Cut", meta: "Alur Cerita Timeline", weekId: "pr-02" },
    ],
  },
  {
    index: 2,
    code: "03",
    shortLabel: "Audio",
    label: "Audio Denoise & Audio Ducking",
    subtitle: "Memisahkan 3 jalur suara, menjernihkan vokal dengan DeNoise, dan auto ducking musik latar.",
    watermark: "MIXING",
    formation: "horizon",
    bgHex: 0x0b1f3d,
    accentHex: 0x7dd3fc,
    ringSides: 8,
    nodes: [
      { code: "M03", title: "3 Jalur Suara", meta: "VO, SFX & BGM", weekId: "pr-03" },
      { code: "M03", title: "Restorasi DeNoise", meta: "Vokal Jernih Bebas Noise", weekId: "pr-03" },
      { code: "M03", title: "Auto Ducking BGM", meta: "Essential Sound Mixing", weekId: "pr-03" },
      { code: "M03", title: "Balance Loudness", meta: "Standar Siaran Nyaman", weekId: "pr-03" },
    ],
  },
  {
    index: 3,
    code: "04",
    shortLabel: "Grafis",
    label: "Elemen Grafis Berita & Tipografi",
    subtitle: "Menyalakan Safe Margin TV, menyusun teks fakta Lower Third, running text, hingga slogan penutup.",
    watermark: "BROADCAST",
    formation: "binary",
    bgHex: 0x042838,
    accentHex: 0x22d3ee,
    ringSides: 6,
    nodes: [
      { code: "M04", title: "Batas Safe Margin", meta: "Standar Layar Siaran", weekId: "pr-04" },
      { code: "M04", title: "Lower Third Berita", meta: "Essential Graphics", weekId: "pr-04" },
      { code: "M04", title: "Running Text Fakta", meta: "Tipografi Informatif", weekId: "pr-04" },
      { code: "M04", title: "Slogan Penutup CTA", meta: "Penutup Iklan Kuat", weekId: "pr-04" },
    ],
  },
  {
    index: 4,
    code: "05",
    shortLabel: "Chroma",
    label: "Studio Green Screen & Visual B-Roll",
    subtitle: "Konsep tumpukan multi-layer, hapus layar hijau bersih dengan Ultra Key, dan sisipkan B-Roll bukti.",
    watermark: "CHROMA",
    formation: "starburst",
    bgHex: 0x082d52,
    accentHex: 0x38bdf8,
    ringSides: 5,
    nodes: [
      { code: "M05", title: "Tumpukan Multi-Layer", meta: "Konsep Kue Lapis Video", weekId: "pr-05" },
      { code: "M05", title: "Ultra Key Hijau", meta: "Chroma Keying Bersih", weekId: "pr-05" },
      { code: "M05", title: "Spill Suppression", meta: "Tepi Subjek Natural", weekId: "pr-05" },
      { code: "M05", title: "Sisip Visual B-Roll", meta: "Konteks Cerita Kuat", weekId: "pr-05" },
    ],
  },
  {
    index: 5,
    code: "06",
    shortLabel: "Cinema",
    label: "Color Grading & Master Export H.264",
    subtitle: "Color correction lewat Adjustment Layer, pengecekan 5 titik QC, dan master export H.264.",
    watermark: "CINEMA",
    formation: "chevron",
    bgHex: 0x051c36,
    accentHex: 0xbae6fd,
    ringSides: 4,
    nodes: [
      { code: "M06", title: "Color Correction", meta: "Lumetri Basic & Curves", weekId: "pr-06" },
      { code: "M06", title: "Adjustment Layer", meta: "Look Grading Konsisten", weekId: "pr-06" },
      { code: "M06", title: "5 Titik Quality Control", meta: "Cek Audio, Warna & Cut", weekId: "pr-06" },
      { code: "M06", title: "Master Export H.264", meta: "Ctrl + M Siap Tayang", weekId: "pr-06" },
    ],
  },
];

function computeSpacePhaseState(rawProgress) {
  const p = clamp01(rawProgress);
  const phase = p < 0.15 ? 1 : p < 0.78 ? 2 : p < 0.9 ? 3 : 4;

  const travelT = rangeMap(p, 0, 0.9);
  const cameraZ = 18 - travelT * 100;

  const vortexT = rangeMap(p, 0.78, 0.9);
  const tunnelRadiusScale = 1 - vortexT * 0.68;
  const tunnelTwistRad = p * Math.PI * 3.4 + vortexT * Math.PI * 2.4;

  const orbExpandT = Math.pow(rangeMap(p, 0.76, 0.9), 2.1);
  const orbScale = 1 + rangeMap(p, 0.15, 0.76) * 0.3 + orbExpandT * 7.4;
  const orbGlowIntensity = 1.25 + vortexT * 3.8;

  const p1WordProgress = 0.52 + 0.48 * rangeMap(p, 0.0, 0.055);
  const p1Opacity = p < 0.17 ? 1 - rangeMap(p, 0.11, 0.16) : 0;

  const p2In = rangeMap(p, 0.145, 0.2);
  const p2Out = 1 - rangeMap(p, 0.75, 0.8);
  const phase2Opacity = Math.min(p2In, p2Out);
  const showcaseProgress = rangeMap(p, 0.155, 0.765);

  const wavePulse = Math.abs(Math.sin(showcaseProgress * Math.PI * SPACE_WORLDS.length));
  const warpStreakScale = 1 + (1 - wavePulse) * 0.95 + vortexT * 4.8;

  const whiteoutOpacity = p >= 0.9 ? 1 : Math.pow(rangeMap(p, 0.83, 0.9), 1.6);
  const phase4Reveal = rangeMap(p, 0.9, 0.97);

  return {
    progress: p,
    phase,
    cameraZ,
    tunnelRadiusScale,
    tunnelTwistRad,
    orbScale,
    orbGlowIntensity,
    warpStreakScale,
    p1WordProgress,
    p1Opacity,
    phase2Opacity,
    showcaseProgress,
    whiteoutOpacity,
    phase4Reveal,
  };
}

function computeSpaceNodeMotion(showcaseProgress, worldIndex, itemIndex, totalItems) {
  const count = SPACE_WORLDS.length;
  const slice = 1 / count;
  const pad = slice * 0.05;
  const start = Math.max(0, worldIndex * slice - pad);
  const end = Math.min(1, (worldIndex + 1) * slice + pad);
  const t = (clamp01(showcaseProgress) - start) / Math.max(0.0001, end - start);

  if (t <= 0 || t >= 1) {
    return { visible: false, opacity: 0, xNorm: 0, yNorm: 0, scale: 0.4, rotateDeg: 0, tiltYDeg: 0 };
  }

  const stagger = itemIndex * 0.02;
  const enter = smoothstep(rangeMap(t, stagger, 0.25 + stagger));
  const exit = smoothstep(rangeMap(t, 0.74 + stagger * 0.28, 1.0));
  const opacity = clamp01(enter * (1 - exit));

  const formation = SPACE_WORLDS[worldIndex].formation;
  let baseX = 0;
  let baseY = 0;
  let rotateDeg = 0;
  let tiltYDeg = 0;
  let prominence = 1;

  if (formation === "helix") {
    const coords = [
      [-0.78, -0.52],
      [-0.56, 0.56],
      [0.56, -0.56],
      [0.78, 0.52],
    ];
    const [cx, cy] = coords[itemIndex % coords.length];
    const wave = Math.sin((t - 0.5) * Math.PI * 1.2 + itemIndex * 1.1) * 0.09;
    baseX = cx;
    baseY = cy + wave;
    rotateDeg = (itemIndex % 2 === 0 ? -1 : 1) * 3.8;
    tiltYDeg = cx * 16;
  } else if (formation === "spiral") {
    const angles = [-Math.PI * 0.78, -Math.PI * 0.22, Math.PI * 0.26, Math.PI * 0.76];
    const theta = angles[itemIndex % angles.length] + (t - 0.5) * 0.36;
    const rx = itemIndex % 2 === 0 ? 0.85 : 0.72;
    const ry = itemIndex % 2 === 0 ? 0.68 : 0.6;
    baseX = Math.cos(theta) * rx;
    baseY = Math.sin(theta) * ry;
    rotateDeg = Math.cos(theta) * 5;
    tiltYDeg = Math.sin(theta) * 14;
  } else if (formation === "horizon") {
    const row = itemIndex < 2 ? -1 : 1;
    const col = itemIndex % 2 === 0 ? -1 : 1;
    const drift = row * (t - 0.5) * 0.16;
    const eq = Math.sin(t * Math.PI * 2.6 + itemIndex * 1.4) * 0.06;
    baseX = col * 0.64 + drift;
    baseY = row * 0.56 + eq;
    rotateDeg = row * col * 2.5;
    tiltYDeg = col * 14;
  } else if (formation === "binary") {
    const theta = (itemIndex / Math.max(1, totalItems)) * Math.PI * 2 + (t - 0.5) * Math.PI * 0.42 + Math.PI * 0.25;
    baseX = Math.cos(theta) * 0.78;
    baseY = Math.sin(theta) * 0.56;
    rotateDeg = Math.sin(theta) * 5;
    tiltYDeg = Math.cos(theta) * 18;
    prominence = 1.04;
  } else if (formation === "starburst") {
    const theta = (itemIndex / Math.max(1, totalItems)) * Math.PI * 2 - Math.PI / 4 + (t - 0.5) * 0.35;
    const pulse = 0.78 + Math.sin(t * Math.PI * 3 + itemIndex * 0.7) * 0.06;
    baseX = Math.cos(theta) * pulse * 1.02;
    baseY = Math.sin(theta) * pulse * 0.88;
    rotateDeg = Math.sin(t * Math.PI * 2 + itemIndex) * 5;
    tiltYDeg = Math.cos(theta) * 15;
  } else {
    const coords = [
      [-0.82, 0.44],
      [-0.46, -0.58],
      [0.46, -0.58],
      [0.82, 0.44],
    ];
    const [cx, cy] = coords[itemIndex % coords.length];
    baseX = cx;
    baseY = cy + Math.sin(t * Math.PI * 2.2 + itemIndex) * 0.04;
    rotateDeg = cx * 5.2;
    tiltYDeg = -cx * 18;
  }

  const radial = 0.42 + enter * 0.58 + exit * 0.46;
  const breath = Math.sin(t * Math.PI * 2 + itemIndex * 0.9) * 0.02;
  const scale = (0.48 + enter * 0.52 + breath + exit * 0.32) * prominence;

  return {
    visible: opacity > 0.01,
    opacity,
    xNorm: baseX * radial,
    yNorm: baseY * radial,
    scale,
    rotateDeg,
    tiltYDeg,
  };
}

function worldIndexToSpaceProgress(worldIndex) {
  const clamped = Math.max(0, Math.min(SPACE_WORLDS.length - 1, worldIndex));
  const showcaseTarget = (clamped + 0.5) / SPACE_WORLDS.length;
  return 0.155 + showcaseTarget * 0.61;
}

/* ============================================================================
 * PART 1B: THREE.JS VOLUMETRIC 6-WORLD SPACE RENDERER (+ CANVAS2D FALLBACK)
 * ============================================================================ */

function createCanvas2DSpaceFallback(canvas) {
  const ctx = canvas.getContext("2d");
  let w = 1;
  let h = 1;

  const resize = () => {
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, canvas.clientWidth || window.innerWidth);
    h = Math.max(1, canvas.clientHeight || window.innerHeight);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const hexToRgb = (hex) => [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];

  const drawPoly = (cx, cy, r, sides, rot) => {
    ctx.beginPath();
    if (sides >= 16) {
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    for (let i = 0; i <= sides; i++) {
      const a = rot + (i / sides) * Math.PI * 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  };

  return {
    render(state, px = 0, py = 0) {
      if (!ctx) return;
      const wf = state.showcaseProgress * (SPACE_WORLDS.length - 1);
      const idx = Math.max(0, Math.min(SPACE_WORLDS.length - 1, Math.floor(wf)));
      const theme = SPACE_WORLDS[idx];
      const bg = hexToRgb(theme.bgHex);
      const ac = hexToRgb(theme.accentHex);

      ctx.fillStyle = `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2 + px * 28;
      const cy = h / 2 + py * 18;
      const maxR = Math.hypot(w / 2, h / 2);

      for (let i = 0; i < 16; i++) {
        const depth = (((i / 16 + state.progress * 3) % 1) + 1) % 1;
        const r = Math.max(12, Math.pow(depth, 1.75) * maxR * state.tunnelRadiusScale);
        ctx.strokeStyle =
          i % 3 === 0
            ? `rgba(255,255,255,${(depth * 0.42).toFixed(3)})`
            : `rgba(${ac[0]},${ac[1]},${ac[2]},${(depth * 0.56).toFixed(3)})`;
        ctx.lineWidth = 1.4 + depth * 0.9;
        drawPoly(cx, cy, r, theme.ringSides, state.tunnelTwistRad * 0.2 + i * 0.14);
      }

      const streakLen = 18 + state.warpStreakScale * 26;
      for (let i = 0; i < 48; i++) {
        const angle = i * 1.23 + state.tunnelTwistRad * 0.22;
        const depth = (((i * 0.053 + state.progress * 2.5) % 1) + 1) % 1;
        const r0 = (32 + depth * maxR * 0.74) * state.tunnelRadiusScale;
        ctx.strokeStyle = `rgba(${ac[0]},${ac[1]},${ac[2]},${(depth * 0.65).toFixed(2)})`;
        ctx.lineWidth = 1.1 + depth;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * r0, cy + Math.sin(angle) * r0);
        ctx.lineTo(cx + Math.cos(angle) * (r0 + streakLen * depth), cy + Math.sin(angle) * (r0 + streakLen * depth));
        ctx.stroke();
      }

      const orbR = Math.min(w, h) * 0.075 * state.orbScale;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, Math.max(14, orbR * 2.2));
      grad.addColorStop(0, "#FFFFFF");
      grad.addColorStop(0.32, `rgb(${ac[0]},${ac[1]},${ac[2]})`);
      grad.addColorStop(0.7, `rgba(${ac[0]},${ac[1]},${ac[2]},0.32)`);
      grad.addColorStop(1, "rgba(3,9,26,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(14, orbR * 2.2), 0, Math.PI * 2);
      ctx.fill();
    },
    destroy() {
      window.removeEventListener("resize", resize);
    },
  };
}

function createLusionSpaceRenderer(canvas, T) {
  if (!T || !T.WebGLRenderer) {
    canvas.dataset.renderMode = "canvas2d";
    return createCanvas2DSpaceFallback(canvas);
  }

  try {
    const isCompact = window.innerWidth < 768;
    const renderer = new T.WebGLRenderer({
      canvas,
      antialias: !isCompact,
      alpha: false,
      powerPreference: "high-performance",
    });
    canvas.dataset.renderMode = "webgl";
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isCompact ? 1.25 : 2));
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const liveBg = new T.Color(SPACE_WORLDS[0].bgHex);
    const liveAccent = new T.Color(SPACE_WORLDS[0].accentHex);
    const colA = new T.Color();
    const colB = new T.Color();
    const white = new T.Color(0xffffff);
    const tmpCol = new T.Color();

    renderer.setClearColor(liveBg, 1);

    const scene = new T.Scene();
    const fog = new T.FogExp2(SPACE_WORLDS[0].bgHex, 0.0185);
    scene.fog = fog;

    const camera = new T.PerspectiveCamera(55, 1, 0.1, 160);
    camera.position.set(0, 0, 18);

    const ambient = new T.AmbientLight(0x7dd3fc, 1.45);
    scene.add(ambient);

    const coreLight = new T.PointLight(0x38bdf8, 16, 68);
    coreLight.position.set(0, 0, 4);
    scene.add(coreLight);

    // Volumetric deep-space nebula backdrop shader plane following ahead of camera
    const nebulaMat = new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: T.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAccent: { value: new T.Color(0x38bdf8) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uAccent;
        varying vec2 vUv;
        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float r = length(p);
          float angle = atan(p.y, p.x);
          float swirl = sin(angle * 3.0 + r * 5.0 - uTime * 1.1) * 0.5 + 0.5;
          float glow = exp(-r * 2.15) * (0.45 + swirl * 0.55);
          vec3 col = mix(vec3(0.08, 0.32, 0.78), uAccent, swirl);
          gl_FragColor = vec4(col * glow * 0.56, glow * 0.56);
        }
      `,
    });
    const nebulaDisk = new T.Mesh(new T.SphereGeometry(14, 24, 24), nebulaMat);
    scene.add(nebulaDisk);

    // Sculptural Lusion Celestial Singularity & Gyro Core
    const orbGroup = new T.Group();
    const singularityMat = new T.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uAccent: { value: new T.Color(0x38bdf8) },
        uGlow: { value: 1.3 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vViewPos = -mv.xyz;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uAccent;
        uniform float uGlow;
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vec3 vDir = normalize(vViewPos);
          float ndv = max(dot(vDir, vNormal), 0.0);
          float fresnel = pow(1.0 - ndv, 2.2);
          float pulse = 0.94 + sin(uTime * 3.0) * 0.06;
          vec3 core = mix(uAccent * 0.95, vec3(1.0), pow(ndv, 0.75));
          vec3 finalCol = (core + uAccent * fresnel * 1.4) * (0.85 + uGlow * 0.25) * pulse;
          gl_FragColor = vec4(finalCol, 1.0);
        }
      `,
    });
    orbGroup.add(new T.Mesh(new T.SphereGeometry(0.95, 32, 32), singularityMat));

    const auraMat = new T.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.32,
      blending: T.AdditiveBlending,
      depthWrite: false,
    });
    orbGroup.add(new T.Mesh(new T.SphereGeometry(1.58, 24, 24), auraMat));

    const gyroMatA = new T.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.66,
      blending: T.AdditiveBlending,
      depthWrite: false,
    });
    const gyroRingA = new T.Mesh(new T.TorusGeometry(1.94, 0.028, 8, 64), gyroMatA);
    gyroRingA.rotation.set(Math.PI * 0.34, 0.25, 0);
    orbGroup.add(gyroRingA);

    const gyroMatB = new T.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.58,
      blending: T.AdditiveBlending,
      depthWrite: false,
    });
    const gyroRingB = new T.Mesh(new T.TorusGeometry(2.44, 0.022, 8, 64), gyroMatB);
    gyroRingB.rotation.set(-Math.PI * 0.28, -0.4, Math.PI * 0.18);
    orbGroup.add(gyroRingB);

    const cageMat = new T.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
      blending: T.AdditiveBlending,
      depthWrite: false,
    });
    const energyCage = new T.Mesh(new T.IcosahedronGeometry(2.8, 1), cageMat);
    orbGroup.add(energyCage);

    scene.add(orbGroup);

    // 48 Multi-geometry architectural space portals across all 6 themed zones along Z
    const tunnelGroup = new T.Group();
    const geomBySides = new Map();
    const getPortalGeom = (sides) => {
      if (geomBySides.has(sides)) return geomBySides.get(sides);
      const segs = sides >= 32 ? 48 : sides;
      const g = new T.TorusGeometry(4.7, sides <= 6 ? 0.042 : 0.035, 8, segs);
      geomBySides.set(sides, g);
      return g;
    };

    const portalMeshes = [];
    const portalCount = 48;
    for (let i = 0; i < portalCount; i++) {
      const z = 14 - i * 2.35;
      const zoneIdx =
        z > -16 ? 0 : z > -30 ? 1 : z > -44 ? 2 : z > -58 ? 3 : z > -72 ? 4 : 5;
      const zTheme = SPACE_WORLDS[zoneIdx];
      const mat = new T.MeshBasicMaterial({
        color: i % 3 === 0 ? 0xffffff : zTheme.accentHex,
        transparent: true,
        opacity: 0.14,
        blending: T.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new T.Mesh(getPortalGeom(zTheme.ringSides), mat);
      mesh.position.z = z;
      mesh.rotation.z = i * 0.22 + (zTheme.ringSides === 4 ? Math.PI / 4 : 0);
      tunnelGroup.add(mesh);
      portalMeshes.push({ mesh, mat, idx: i });
    }

    // 4 continuous luminous helical TubeGeometry energy rails running all 6 worlds
    const railMat = new T.MeshBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.26,
      blending: T.AdditiveBlending,
      depthWrite: false,
    });
    for (let r = 0; r < 4; r++) {
      const pts = [];
      const baseAngle = (r / 4) * Math.PI * 2;
      for (let s = 0; s <= 52; s++) {
        const frac = s / 52;
        const z = 16 - frac * 116;
        const theta = baseAngle + frac * Math.PI * 3.6;
        const rad = 4.85 + Math.sin(frac * Math.PI * 6 + r) * 0.25;
        pts.push(new T.Vector3(Math.cos(theta) * rad, Math.sin(theta) * rad, z));
      }
      const curve = new T.CatmullRomCurve3(pts);
      tunnelGroup.add(new T.Mesh(new T.TubeGeometry(curve, 84, 0.018, 5, false), railMat));
    }
    scene.add(tunnelGroup);

    // 2,000+ depth-sorted cosmic star dust field
    const starCount = isCompact ? 900 : 2000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const angle = (i * 2.39996) % (Math.PI * 2);
      const radius = 2.5 + ((i * 7) % 13) * 1.05;
      starPos[i * 3] = Math.cos(angle) * radius;
      starPos[i * 3 + 1] = Math.sin(angle) * radius;
      starPos[i * 3 + 2] = 18 - (i / starCount) * 122;
    }
    const starGeom = new T.BufferGeometry();
    starGeom.setAttribute("position", new T.BufferAttribute(starPos, 3));
    const starMat = new T.PointsMaterial({
      color: 0xbae6fd,
      size: isCompact ? 0.13 : 0.1,
      transparent: true,
      opacity: 0.88,
      blending: T.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new T.Points(starGeom, starMat));

    // Elongated 3D hyper-warp speed beams
    const streakGroup = new T.Group();
    const streakCount = isCompact ? 46 : 96;
    const streakGeom = new T.BoxGeometry(0.022, 0.022, 1.0);
    const streakMat = new T.MeshBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.45,
      blending: T.AdditiveBlending,
      depthWrite: false,
    });
    const streakMeshes = [];
    for (let i = 0; i < streakCount; i++) {
      const angle = (i * 1.6180339 * Math.PI * 2) % (Math.PI * 2);
      const radius = 3.1 + ((i * 11) % 9) * 0.72;
      const m = new T.Mesh(streakGeom, streakMat);
      m.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 14 - (i / streakCount) * 116);
      streakGroup.add(m);
      streakMeshes.push(m);
    }
    scene.add(streakGroup);

    const resize = () => {
      const w = Math.max(1, canvas.clientWidth || window.innerWidth);
      const h = Math.max(1, canvas.clientHeight || window.innerHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;

    return {
      render(state, pointerX = 0, pointerY = 0) {
        time += 0.016;
        const px = Math.max(-1, Math.min(1, pointerX));
        const py = Math.max(-1, Math.min(1, pointerY));

        const worldFloat = state.showcaseProgress * (SPACE_WORLDS.length - 1);
        const idxA = Math.max(0, Math.min(SPACE_WORLDS.length - 1, Math.floor(worldFloat)));
        const idxB = Math.min(SPACE_WORLDS.length - 1, idxA + 1);
        const blend = worldFloat - idxA;

        colA.setHex(SPACE_WORLDS[idxA].bgHex);
        colB.setHex(SPACE_WORLDS[idxB].bgHex);
        liveBg.copy(colA).lerp(colB, blend);

        colA.setHex(SPACE_WORLDS[idxA].accentHex);
        colB.setHex(SPACE_WORLDS[idxB].accentHex);
        liveAccent.copy(colA).lerp(colB, blend);

        renderer.setClearColor(liveBg, 1);
        fog.color.copy(liveBg);
        coreLight.color.copy(liveAccent);
        auraMat.color.copy(liveAccent);
        gyroMatB.color.copy(liveAccent);
        cageMat.color.copy(liveAccent);
        railMat.color.copy(liveAccent);
        streakMat.color.copy(tmpCol.copy(liveAccent).lerp(white, 0.45));

        singularityMat.uniforms.uTime.value = time;
        singularityMat.uniforms.uAccent.value.copy(liveAccent);
        singularityMat.uniforms.uGlow.value = state.orbGlowIntensity;

        nebulaMat.uniforms.uTime.value = time;
        nebulaMat.uniforms.uAccent.value.copy(liveAccent);
        nebulaDisk.position.set(px * 0.6, -py * 0.4, state.cameraZ - 34);

        const targetFov = 55 + Math.min(14, (state.warpStreakScale - 1) * 2.2);
        if (Math.abs(camera.fov - targetFov) > 0.08) {
          camera.fov = targetFov;
          camera.updateProjectionMatrix();
        }
        camera.position.set(px * 0.9, -py * 0.58, state.cameraZ);
        camera.lookAt(px * 0.24, -py * 0.16, state.cameraZ - 14);
        camera.rotation.z += -px * 0.048;

        tunnelGroup.rotation.z = state.tunnelTwistRad * 0.22;
        tunnelGroup.scale.set(state.tunnelRadiusScale, state.tunnelRadiusScale, 1);

        const tunnelFade = rangeMap(state.progress, 0.05, 0.18);
        for (let i = 0; i < portalMeshes.length; i++) {
          const entry = portalMeshes[i];
          const dist = Math.abs(entry.mesh.position.z - (state.cameraZ - 12));
          const boost = Math.max(0, 1 - dist / 24) * 0.3;
          entry.mat.opacity = 0.08 + tunnelFade * 0.38 + boost;
          entry.mesh.scale.setScalar(1 + Math.sin(state.progress * Math.PI * 10 + entry.idx * 0.6) * 0.032);
        }

        const zStretch = 0.9 + state.warpStreakScale * 1.4;
        for (let i = 0; i < streakMeshes.length; i++) {
          streakMeshes[i].scale.z = zStretch;
        }
        streakMat.opacity = Math.min(0.85, 0.24 + (state.warpStreakScale - 1) * 0.14);

        const orbAhead = 11.4 - rangeMap(state.progress, 0.76, 0.9) * 8.6;
        orbGroup.position.set(
          px * 0.36,
          Math.sin(state.progress * Math.PI * 5 + time * 0.6) * 0.16 - py * 0.24,
          state.cameraZ - orbAhead
        );
        orbGroup.scale.setScalar(state.orbScale * 0.52);
        auraMat.opacity = Math.min(0.86, 0.24 + state.progress * 0.54);

        gyroRingA.rotation.x = Math.PI * 0.34 + state.progress * Math.PI * 4.4 + time * 0.25 + py * 0.28;
        gyroRingA.rotation.y = 0.25 + state.progress * Math.PI * 3.1 + px * 0.32;
        gyroRingB.rotation.x = -Math.PI * 0.28 - state.progress * Math.PI * 3.4;
        gyroRingB.rotation.y = -0.4 + state.progress * Math.PI * 5.0 - time * 0.2 - px * 0.28;

        energyCage.rotation.x = state.progress * Math.PI * 2.2 + time * 0.12;
        energyCage.rotation.y = -state.progress * Math.PI * 3.0;
        energyCage.scale.setScalar(1 + rangeMap(state.progress, 0.76, 0.9) * 0.72);
        cageMat.opacity = Math.min(0.58, 0.18 + (state.warpStreakScale - 1) * 0.08);

        renderer.render(scene, camera);
      },
      destroy() {
        window.removeEventListener("resize", resize);
        try {
          renderer.dispose();
        } catch (_) {}
      },
    };
  } catch (_) {
    canvas.dataset.renderMode = "canvas2d";
    return createCanvas2DSpaceFallback(canvas);
  }
}

/* ============================================================================
 * PART 1C: REUSABLE LUSION.CO NEXT-PAGE OVERSCROLL CHARGE GATE (AMC PARITY)
 * ============================================================================ */

const GATE_RING_CIRCUMFERENCE = 163.36;

function renderNextPageGateMarkup({
  id,
  title,
  nextLabel = "HALAMAN BERIKUTNYA",
  eyebrow = "TERUS SCROLL UNTUK LANJUT",
  hint = "Scroll terus ke bawah atau klik untuk langsung berpindah halaman.",
}) {
  return `
    <section
      class="dkv-next-gate"
      id="${id}"
      aria-label="${nextLabel}: ${title}"
    >
      <div class="dkv-next-gate-glow" data-gate-glow aria-hidden="true"></div>
      <div class="dkv-next-gate-hairline" aria-hidden="true"></div>

      <button type="button" class="dkv-next-gate-trigger" data-gate-trigger data-cursor="hover">
        <div class="dkv-next-gate-shell">
          <div class="dkv-next-gate-crosshair" aria-hidden="true">
            <span>+</span>
            <span>${eyebrow}</span>
            <span>+</span>
          </div>

          <div class="dkv-next-gate-row">
            <div class="dkv-next-gate-left">
              <p class="dkv-next-gate-eyebrow">${nextLabel}</p>
              <h2 class="dkv-next-gate-title">${title}</h2>
            </div>

            <div class="dkv-next-gate-right">
              <div class="dkv-next-gate-meter">
                <span class="dkv-next-gate-pct" data-gate-pct>0%</span>
                <span class="dkv-next-gate-circle" aria-hidden="true">
                  <svg class="dkv-next-gate-svg" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(125,211,252,0.28)" stroke-width="2"></circle>
                    <circle
                      data-gate-ring
                      cx="28"
                      cy="28"
                      r="26"
                      fill="none"
                      stroke="#7DD3FC"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-dasharray="${GATE_RING_CIRCUMFERENCE}"
                      stroke-dashoffset="${GATE_RING_CIRCUMFERENCE}"
                    ></circle>
                  </svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7"></path>
                  </svg>
                </span>
              </div>
              <p class="dkv-next-gate-hint">${hint}</p>
            </div>
          </div>

          <div class="dkv-next-gate-track" aria-hidden="true">
            <div class="dkv-next-gate-fill" data-gate-bar></div>
          </div>
        </div>
      </button>
    </section>
  `;
}

function mountNextPageGateController(gateEl, onTrigger, soundEngine) {
  if (!gateEl) return { destroy() {} };

  const triggerBtn = gateEl.querySelector("[data-gate-trigger]");
  const barEl = gateEl.querySelector("[data-gate-bar]");
  const pctEl = gateEl.querySelector("[data-gate-pct]");
  const ringEl = gateEl.querySelector("[data-gate-ring]");
  const glowEl = gateEl.querySelector("[data-gate-glow]");

  let charge = 0;
  let triggered = false;
  let destroyed = false;
  let lastInputTs = 0;
  let lastFrameTs = performance.now();
  let touchStartY = null;
  let rafId = 0;

  const renderCharge = () => {
    if (barEl) barEl.style.transform = `scaleX(${charge.toFixed(4)})`;
    if (pctEl) pctEl.textContent = `${Math.round(charge * 100)}%`;
    if (ringEl) ringEl.style.strokeDashoffset = (GATE_RING_CIRCUMFERENCE * (1 - charge)).toFixed(2);
    if (glowEl) glowEl.style.opacity = (0.2 + charge * 0.78).toFixed(3);
  };

  const fire = () => {
    if (triggered || destroyed) return;
    triggered = true;
    charge = 1;
    renderCharge();
    soundEngine && soundEngine.playWhoosh && soundEngine.playWhoosh(480, 110);
    onTrigger && onTrigger();
  };

  const onClick = () => fire();
  triggerBtn && triggerBtn.addEventListener("click", onClick);

  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    return {
      destroy() {
        destroyed = true;
        triggerBtn && triggerBtn.removeEventListener("click", onClick);
      },
    };
  }

  const isAtBottom = () => {
    const scrollY = Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0);
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return maxY > 120 && scrollY >= maxY - 26;
  };

  const ensureDecayLoop = () => {
    if (rafId || destroyed || triggered) return;
    lastFrameTs = performance.now();
    rafId = requestAnimationFrame(tick);
  };

  const tick = (now) => {
    if (destroyed || triggered) {
      rafId = 0;
      return;
    }
    const dt = Math.min(0.08, (now - lastFrameTs) / 1000);
    lastFrameTs = now;
    if (charge > 0 && now - lastInputTs > 320) {
      charge = Math.max(0, charge - dt * 0.9);
      renderCharge();
    }
    if (charge > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
    }
  };

  const onWheel = (e) => {
    if (triggered || destroyed) return;
    if (!isAtBottom()) {
      if (charge > 0 && e.deltaY < 0) {
        charge = clamp01(charge + (e.deltaY * 1.4) / 440);
        renderCharge();
      }
      return;
    }
    if (e.deltaY > 0) {
      lastInputTs = performance.now();
      charge = clamp01(charge + e.deltaY / 440);
      renderCharge();
      if (charge >= 0.995) fire();
      else ensureDecayLoop();
    } else if (e.deltaY < 0 && charge > 0) {
      lastInputTs = performance.now();
      charge = clamp01(charge + (e.deltaY * 1.4) / 440);
      renderCharge();
    }
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (triggered || destroyed || touchStartY === null || e.touches.length !== 1) return;
    const curY = e.touches[0].clientY;
    const dy = touchStartY - curY;
    touchStartY = curY;
    if (!isAtBottom()) return;
    if (dy > 0) {
      lastInputTs = performance.now();
      charge = clamp01(charge + (dy * 1.6) / 340);
      renderCharge();
      if (charge >= 0.995) fire();
      else ensureDecayLoop();
    }
  };
  const onTouchEnd = () => {
    touchStartY = null;
  };

  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });

  return {
    destroy() {
      destroyed = true;
      cancelAnimationFrame(rafId);
      triggerBtn && triggerBtn.removeEventListener("click", onClick);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    },
  };
}

/* ============================================================================
 * PART 1D: SPACE MARKUP & CONTROLLER EXPORT
 * ============================================================================ */

export function renderLusionSpaceMarkup() {
  const headlineWords = ["MASUK", "KE", "DUNIA", "BARU."];

  const groupsHtml = SPACE_WORLDS.map(
    (world, wIdx) => `
      <div
        class="dkv-space-group"
        data-space-group="${wIdx}"
        data-world-label="${world.label}"
        data-world-sub="${world.subtitle}"
        data-world-watermark="${world.watermark}"
        aria-hidden="${wIdx === 0 ? "false" : "true"}"
        style="${wIdx === 0 ? "" : "opacity:0;"}"
      >
        ${world.nodes
          .map(
            (node, nIdx) => `
              <button
                type="button"
                class="dkv-space-node"
                data-space-node
                data-world-idx="${wIdx}"
                data-item-idx="${nIdx}"
                data-week-id="${node.weekId}"
                data-cursor="view"
                aria-label="Buka modul ${node.title}"
              >
                <span class="dkv-space-node-code">${node.code}</span>
                <span class="dkv-space-node-copy">
                  <span class="dkv-space-node-title">${node.title}</span>
                  <span class="dkv-space-node-meta">${node.meta}</span>
                </span>
              </button>
            `
          )
          .join("")}
      </div>
    `
  ).join("");

  const tabsHtml = SPACE_WORLDS.map(
    (world, idx) => `
      <button
        type="button"
        role="tab"
        aria-selected="${idx === 0 ? "true" : "false"}"
        class="dkv-space-tab ${idx === 0 ? "is-active" : ""}"
        data-space-tab="${idx}"
        data-cursor="hover"
      >
        <span class="dkv-space-tab-num">${world.code}</span>
        <span>${world.shortLabel}</span>
      </button>
    `
  ).join("");

  return `
    <!-- ===================================================================
         SECTION 6: LUSION.CO 6-WORLD SPACE PORTAL TRANSITION (#secAstronaut)
         =================================================================== -->
    <section
      class="dkv-space-root"
      id="secAstronaut"
      aria-label="Transisi ruang angkasa 6 dunia interaktif menuju alur produksi XI DKV dan profil Kak Adrian"
    >
      <div class="dkv-space-sticky" id="dkvSpaceSticky">
        <div class="dkv-space-portal-mask" id="dkvSpacePortalMask">
          <canvas id="dkvSpaceCanvas" class="dkv-space-canvas" aria-hidden="true"></canvas>

          <!-- Act 1 (0% - 15%): Dip Into Cosmic Void -->
          <div class="dkv-space-act1" id="dkvSpaceAct1">
            <div class="dkv-space-act1-inner">
              <p class="dkv-space-eyebrow">EKSPLORASI KREATIF • XI DKV SMK BINA BANGSA</p>
              <h2 class="dkv-space-act1-title">
                ${headlineWords
                  .map(
                    (word) => `
                      <span class="dkv-space-word-mask">
                        <span class="dkv-space-word-inner" data-space-p1-word>${word}</span>
                      </span>
                    `
                  )
                  .join("")}
              </h2>
              <p class="dkv-space-act1-sub">
                Selami 6 dunia alur produksi Editing Audio &amp; Video, mulai dari pra-produksi storyboard hingga color grading dan master export.
              </p>
            </div>
          </div>

          <!-- Act 2 (15% - 78%): 6-World Spatial Choreography -->
          <div class="dkv-space-act2" id="dkvSpaceAct2">
            <div class="dkv-space-watermark-wrap" aria-hidden="true">
              <span class="dkv-space-watermark" id="dkvSpaceWatermark">${SPACE_WORLDS[0].watermark}</span>
            </div>

            <div class="dkv-space-hud-top">
              <p class="dkv-space-eyebrow">6 DUNIA PRODUKSI AUDIO &amp; VIDEO</p>
              <p class="dkv-space-stage-title" id="dkvSpaceStageTitle">01/06 • ${SPACE_WORLDS[0].label}</p>
              <p class="dkv-space-stage-sub" id="dkvSpaceStageSub">${SPACE_WORLDS[0].subtitle}</p>
            </div>

            <div class="dkv-space-orbital-stage" id="dkvSpaceOrbitalStage">
              ${groupsHtml}
            </div>

            <div class="dkv-space-nav" id="dkvSpaceNav" style="pointer-events:none;">
              <div class="dkv-space-tabs" role="tablist" aria-label="Pilih 6 dunia produksi DKV">
                ${tabsHtml}
              </div>
              <div class="dkv-space-progress-track" aria-hidden="true">
                <div class="dkv-space-progress-bar" id="dkvSpaceProgressBar"></div>
              </div>
            </div>
          </div>

          <!-- Act 3 -> 4 (83% - 100%): Reverse Black-Hole Supernova Pure-White Reveal -->
          <div class="dkv-space-whiteout" id="dkvSpaceWhiteout">
            <div class="dkv-space-act4-copy" id="dkvSpaceAct4Copy">
              <p class="dkv-space-act4-eyebrow">DUNIA KREATIF XI DKV</p>
              <h2 class="dkv-space-act4-title">DAN BIARKAN IMAJINASIMU TERUS BERGERAK.</h2>
              <p class="dkv-space-act4-sub">
                Seluruh modul Editing Audio &amp; Video disusun agar setiap karya kelas XI DKV tampil rapi, enak didengar, dan siap masuk standar industri kreatif.
              </p>
              <div class="dkv-space-act4-actions">
                <button type="button" class="dkv-btn-primary" id="btnSpaceGoAbout" data-cursor="hover">
                  <span>KENALAN DENGAN KAK ADRIAN</span>
                  <span aria-hidden="true">→</span>
                </button>
                <button type="button" class="dkv-btn-ghost" id="btnBackToTopSyllabus" data-cursor="hover">
                  <span>KEMBALI KE SILABUS ↑</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================================================================
         SECTION 7: LUSION.CO OVERSCROLL CHARGE GATE -> ABOUT PAGE
         =================================================================== -->
    ${renderNextPageGateMarkup({
      id: "dkvNextPageGate",
      title: "TENTANG KAK ADRIAN",
      nextLabel: "HALAMAN BERIKUTNYA",
      eyebrow: "TERUS SCROLL UNTUK LANJUT",
      hint: "Scroll terus ke bawah atau klik untuk membuka halaman profil hologram & area of expertise.",
    })}
  `;
}

export function mountLusionSpaceController({ three, soundEngine, onOpenDetail, onNavigate }) {
  const section = document.getElementById("secAstronaut");
  const sticky = document.getElementById("dkvSpaceSticky");
  const portalMask = document.getElementById("dkvSpacePortalMask");
  const canvas = document.getElementById("dkvSpaceCanvas");
  const act1 = document.getElementById("dkvSpaceAct1");
  const act2 = document.getElementById("dkvSpaceAct2");
  const orbitalStage = document.getElementById("dkvSpaceOrbitalStage");
  const watermarkEl = document.getElementById("dkvSpaceWatermark");
  const stageTitleEl = document.getElementById("dkvSpaceStageTitle");
  const stageSubEl = document.getElementById("dkvSpaceStageSub");
  const navWrap = document.getElementById("dkvSpaceNav");
  const progressBar = document.getElementById("dkvSpaceProgressBar");
  const whiteoutEl = document.getElementById("dkvSpaceWhiteout");
  const act4Copy = document.getElementById("dkvSpaceAct4Copy");
  const gateSection = document.getElementById("dkvNextPageGate");

  if (!section || !sticky || !canvas) {
    return { onScrollUpdate() {}, destroy() {} };
  }

  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const p1Words = Array.from(section.querySelectorAll("[data-space-p1-word]"));
  const groups = Array.from(section.querySelectorAll("[data-space-group]"));
  const groupNodes = groups.map((g) => Array.from(g.querySelectorAll("[data-space-node]")));
  const tabs = Array.from(section.querySelectorAll("[data-space-tab]"));

  const btnAbout = document.getElementById("btnSpaceGoAbout");
  const btnSyllabus = document.getElementById("btnBackToTopSyllabus");

  const goAbout = () => {
    soundEngine && soundEngine.playWhoosh && soundEngine.playWhoosh(480, 110);
    onNavigate && onNavigate("about");
  };
  btnAbout && btnAbout.addEventListener("click", goAbout);
  btnSyllabus &&
    btnSyllabus.addEventListener("click", () => {
      const target = document.getElementById("secCurriculum");
      if (target) {
        soundEngine && soundEngine.playWhoosh && soundEngine.playWhoosh(400, 95);
        if (window.__dkvLenis && typeof window.__dkvLenis.scrollTo === "function") {
          window.__dkvLenis.scrollTo(target, { duration: 1.1 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });

  const nextGate = mountNextPageGateController(gateSection, goAbout, soundEngine);

  section.querySelectorAll("[data-space-node]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const weekId = btn.getAttribute("data-week-id");
      if (weekId && onOpenDetail) {
        soundEngine && soundEngine.playTick && soundEngine.playTick(1100);
        onOpenDetail(weekId);
      }
    });
  });

  if (reduced) {
    if (navWrap) navWrap.style.pointerEvents = "auto";
    return {
      onScrollUpdate() {},
      destroy() {
        nextGate.destroy();
      },
    };
  }

  const visual = createLusionSpaceRenderer(canvas, three);
  let currentProgress = 0;
  let lastWorldIdx = -1;
  let targetPx = 0;
  let targetPy = 0;
  let smoothPx = 0;
  let smoothPy = 0;
  let rafId = 0;
  let destroyed = false;
  let inView = false;

  const updatePointer = (ev) => {
    if (ev.pointerType === "touch") return;
    const rect = sticky.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    targetPx = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    targetPy = ((ev.clientY - rect.top) / rect.height) * 2 - 1;
  };
  const resetPointer = () => {
    targetPx = 0;
    targetPy = 0;
  };
  sticky.addEventListener("pointermove", updatePointer, { passive: true });
  sticky.addEventListener("pointerleave", resetPointer, { passive: true });

  tabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      soundEngine && soundEngine.playTick && soundEngine.playTick(1150);
      const secTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
      const targetY = secTop + scrollRange * worldIndexToSpaceProgress(idx);
      if (window.__dkvLenis && typeof window.__dkvLenis.scrollTo === "function") {
        window.__dkvLenis.scrollTo(targetY, { duration: 1.05 });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    });
  });

  const applyProgress = (progress, entryRatio = 1) => {
    currentProgress = clamp01(progress);
    const state = computeSpacePhaseState(currentProgress);

    if (portalMask) {
      const openT = smoothstep(entryRatio);
      const insetY = ((1 - openT) * 9).toFixed(2);
      const insetX = ((1 - openT) * 5).toFixed(2);
      const radius = Math.round((1 - openT) * 38);
      portalMask.style.clipPath =
        openT >= 0.99 ? "none" : `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
    }

    if (act1) {
      act1.style.opacity = state.p1Opacity.toFixed(3);
      act1.style.transform = `translate3d(0, ${((1 - state.p1WordProgress) * 22).toFixed(1)}px, 0)`;
    }
    p1Words.forEach((word, idx) => {
      const localStart = idx * 0.1;
      const localP = clamp01((state.p1WordProgress - localStart) / 0.42);
      word.style.transform = `translate3d(0, ${((1 - localP) * 112).toFixed(1)}%, 0)`;
    });

    const phase2Active = state.phase2Opacity > 0.5 && state.whiteoutOpacity < 0.25;
    if (act2) act2.style.opacity = state.phase2Opacity.toFixed(3);
    if (navWrap) navWrap.style.pointerEvents = phase2Active ? "auto" : "none";

    const stageW = orbitalStage ? orbitalStage.clientWidth : window.innerWidth;
    const stageH = orbitalStage ? orbitalStage.clientHeight : window.innerHeight * 0.6;
    const isMobile = stageW < 640;
    const halfW = isMobile ? Math.min(stageW * 0.42, 145) : Math.min(stageW * 0.39, 470);
    const halfH = isMobile ? Math.min(stageH * 0.36, 175) : Math.min(stageH * 0.4, 235);

    const activeWorldIdx = Math.min(
      SPACE_WORLDS.length - 1,
      Math.floor(state.showcaseProgress * SPACE_WORLDS.length)
    );

    groups.forEach((group, gIdx) => {
      const nodes = groupNodes[gIdx] || [];
      let maxOp = 0;
      nodes.forEach((node, nIdx) => {
        const m = computeSpaceNodeMotion(state.showcaseProgress, gIdx, nIdx, nodes.length);
        if (m.opacity > maxOp) maxOp = m.opacity;
        const x = m.xNorm * halfW;
        const y = m.yNorm * halfH;
        node.style.opacity = m.opacity.toFixed(3);
        node.style.transform = `perspective(950px) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${m.scale.toFixed(3)}) rotate(${m.rotateDeg.toFixed(2)}deg) rotateY(${m.tiltYDeg.toFixed(1)}deg)`;
        node.style.pointerEvents = phase2Active && m.opacity > 0.45 ? "auto" : "none";
      });
      const isVis = maxOp > 0.01;
      group.style.opacity = isVis ? "1" : "0";
      group.setAttribute("aria-hidden", isVis ? "false" : "true");
    });

    if (activeWorldIdx !== lastWorldIdx) {
      lastWorldIdx = activeWorldIdx;
      const world = SPACE_WORLDS[activeWorldIdx];
      if (stageTitleEl) stageTitleEl.textContent = `${world.code}/0${SPACE_WORLDS.length} • ${world.label}`;
      if (stageSubEl) stageSubEl.textContent = world.subtitle;
      if (watermarkEl) watermarkEl.textContent = world.watermark;
      tabs.forEach((tEl, idx) => {
        const active = idx === activeWorldIdx;
        tEl.classList.toggle("is-active", active);
        tEl.setAttribute("aria-selected", active ? "true" : "false");
      });
    }

    if (watermarkEl) {
      const scrollDriftX = (currentProgress - 0.45) * -90;
      watermarkEl.style.transform = `translate3d(${(scrollDriftX - smoothPx * 28).toFixed(1)}px, ${(-smoothPy * 16).toFixed(1)}px, 0)`;
    }

    if (progressBar) {
      progressBar.style.transform = `scaleX(${Math.max(0.05, state.showcaseProgress).toFixed(4)})`;
    }

    if (whiteoutEl) {
      whiteoutEl.style.opacity = state.whiteoutOpacity.toFixed(3);
      whiteoutEl.style.pointerEvents = state.whiteoutOpacity > 0.85 ? "auto" : "none";
    }
    if (act4Copy) {
      act4Copy.style.opacity = state.phase4Reveal.toFixed(3);
      act4Copy.style.transform = `translate3d(0, ${((1 - state.phase4Reveal) * 34).toFixed(1)}px, 0)`;
    }

    visual.render(state, smoothPx, smoothPy);
  };

  const computeAndApplyFromViewport = () => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 900;
    const entryRatio = clamp01((vh - rect.top) / (vh * 0.72));
    const scrollable = Math.max(1, rect.height - vh);
    const prog = clamp01(-rect.top / scrollable);
    applyProgress(prog, entryRatio);
  };

  const io = new IntersectionObserver(
    (entries) => {
      inView = Boolean(entries[0] && entries[0].isIntersecting);
      if (inView && !rafId && !destroyed) {
        rafId = requestAnimationFrame(tick);
      }
    },
    { rootMargin: "320px 0px" }
  );
  io.observe(section);

  const tick = () => {
    if (destroyed || !inView) {
      rafId = 0;
      return;
    }
    smoothPx += (targetPx - smoothPx) * 0.09;
    smoothPy += (targetPy - smoothPy) * 0.09;
    computeAndApplyFromViewport();
    rafId = requestAnimationFrame(tick);
  };

  const onNativeScroll = () => computeAndApplyFromViewport();
  window.addEventListener("scroll", onNativeScroll, { passive: true });
  computeAndApplyFromViewport();

  return {
    onScrollUpdate() {
      if (!destroyed) computeAndApplyFromViewport();
    },
    destroy() {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("scroll", onNativeScroll);
      sticky.removeEventListener("pointermove", updatePointer);
      sticky.removeEventListener("pointerleave", resetPointer);
      nextGate.destroy();
      visual.destroy();
    },
  };
}

/* ============================================================================
 * PART 2: LUSION.CO /ABOUT EXPERIENCE (3D SPHERES + HOLOGRAM + 3D FLIP DECK)
 * ============================================================================ */

const SPHERE_PALETTES = {
  pearl: { hi: "#FFFFFF", mid: "#EFF6FF", shadow: "#BFDBFE", rim: "#93C5FD", glow: "rgba(37, 99, 235, 0.13)" },
  light: { hi: "#FFFFFF", mid: "#BAE6FD", shadow: "#38BDF8", rim: "#2563EB", glow: "rgba(37, 99, 235, 0.17)" },
  cobalt: { hi: "#EFF6FF", mid: "#60A5FA", shadow: "#2563EB", rim: "#1E40AF", glow: "rgba(30, 64, 175, 0.22)" },
  deep: { hi: "#93C5FD", mid: "#2563EB", shadow: "#1E3A8A", rim: "#0A0F1D", glow: "rgba(10, 15, 29, 0.22)" },
};

function mountInteractiveSpheres(canvas, stage, density) {
  const ctx = canvas.getContext("2d");
  if (!ctx || !stage) return { setPaused() {}, destroy() {} };

  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth < 768;
  const count = density === "cta" ? (isMobile ? 16 : 36) : isMobile ? 22 : 46;

  let width = 320;
  let height = 320;
  let visible = true;
  let paused = false;
  let rafId = 0;
  let lastTime = performance.now();
  let destroyed = false;

  const spheres = [];
  const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false, grabbedIndex: null };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(300, rect.width || stage.clientWidth || 320);
    height = Math.max(300, rect.height || stage.clientHeight || 320);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const seed = () => {
    spheres.length = 0;
    const tones = ["pearl", "light", "cobalt", "light", "deep", "pearl", "cobalt"];
    const goldenAngle = 2.3999632;
    for (let i = 0; i < count; i++) {
      const bucket = i % 5;
      const radius = isMobile
        ? bucket === 0 ? 27 + (i % 7) : bucket < 3 ? 16 + (i % 8) : 10 + (i % 6)
        : bucket === 0 ? 36 + (i % 12) : bucket < 3 ? 21 + (i % 12) : 12 + (i % 8);
      const t = (i + 0.5) / count;
      const radial = Math.sqrt(t);
      const angle = i * goldenAngle + 0.4;
      const x = Math.max(radius + 10, Math.min(width - radius - 10, width * (0.5 + Math.cos(angle) * radial * 0.47)));
      const y = Math.max(radius + 10, Math.min(height - radius - 10, height * (0.5 + Math.sin(angle) * radial * 0.45)));
      spheres.push({
        x,
        y,
        vx: (i % 2 === 0 ? 1 : -1) * (0.28 + (i % 4) * 0.14),
        vy: (i % 3 === 0 ? -1 : 1) * (0.24 + (i % 3) * 0.14),
        radius,
        mass: Math.max(0.35, (radius / 24) * (radius / 24)),
        tone: tones[i % tones.length],
        phase: (i * 1.17) % (Math.PI * 2),
      });
    }
  };

  const stepPhysics = (dt) => {
    const step = Math.max(0.25, Math.min(2.2, dt));
    const maxSpeed = 24;

    for (let i = 0; i < spheres.length; i++) {
      const s = spheres[i];
      s.phase += 0.012 * step;

      if (pointer.grabbedIndex === i && pointer.active) {
        s.vx = (pointer.x - s.x) * 0.34 + pointer.vx * 0.35;
        s.vy = (pointer.y - s.y) * 0.34 + pointer.vy * 0.35;
        s.x += s.vx * step;
        s.y += s.vy * step;
        continue;
      }

      s.vx += Math.cos(s.phase) * 0.018 * step;
      s.vy += Math.sin(s.phase * 0.85) * 0.016 * step;

      if (pointer.active && pointer.grabbedIndex === null) {
        const dx = s.x - pointer.x;
        const dy = s.y - pointer.y;
        const influence = s.radius + 135;
        const distSq = dx * dx + dy * dy;
        if (distSq > 1 && distSq < influence * influence) {
          const dist = Math.sqrt(distSq);
          const prox = 1 - dist / influence;
          const push = prox * prox * 2.2 * step;
          s.vx += (dx / dist) * push + pointer.vx * prox * 0.16;
          s.vy += (dy / dist) * push + pointer.vy * prox * 0.16;
        }
      }

      const damp = Math.pow(0.976, step);
      s.vx *= damp;
      s.vy *= damp;

      const speed = Math.hypot(s.vx, s.vy);
      if (speed > maxSpeed) {
        const ratio = maxSpeed / speed;
        s.vx *= ratio;
        s.vy *= ratio;
      }

      s.x += s.vx * step;
      s.y += s.vy * step;
    }

    // Pairwise elastic sphere collisions
    for (let i = 0; i < spheres.length; i++) {
      for (let j = i + 1; j < spheres.length; j++) {
        const a = spheres[i];
        const b = spheres[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minDist = a.radius + b.radius + 2;
        const distSq = dx * dx + dy * dy;
        if (distSq > 0.0001 && distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;
          const aGrab = pointer.grabbedIndex === i && pointer.active;
          const bGrab = pointer.grabbedIndex === j && pointer.active;

          if (aGrab && !bGrab) {
            b.x += nx * overlap;
            b.y += ny * overlap;
          } else if (bGrab && !aGrab) {
            a.x -= nx * overlap;
            a.y -= ny * overlap;
          } else {
            const totalMass = a.mass + b.mass;
            a.x -= nx * overlap * (b.mass / totalMass);
            a.y -= ny * overlap * (b.mass / totalMass);
            b.x += nx * overlap * (a.mass / totalMass);
            b.y += ny * overlap * (a.mass / totalMass);
          }

          const velN = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (velN < 0) {
            const invA = aGrab ? 0 : 1 / a.mass;
            const invB = bGrab ? 0 : 1 / b.mass;
            const denom = invA + invB;
            if (denom > 0) {
              const imp = (-(1 + 0.84) * velN) / denom;
              a.vx -= imp * invA * nx;
              a.vy -= imp * invA * ny;
              b.vx += imp * invB * nx;
              b.vy += imp * invB * ny;
            }
          }
        }
      }
    }

    const pad = 6;
    for (let i = 0; i < spheres.length; i++) {
      const s = spheres[i];
      const minX = s.radius + pad;
      const maxX = Math.max(minX, width - s.radius - pad);
      const minY = s.radius + pad;
      const maxY = Math.max(minY, height - s.radius - pad);
      if (s.x < minX) { s.x = minX; s.vx = Math.abs(s.vx) * 0.78; }
      else if (s.x > maxX) { s.x = maxX; s.vx = -Math.abs(s.vx) * 0.78; }
      if (s.y < minY) { s.y = minY; s.vy = Math.abs(s.vy) * 0.78; }
      else if (s.y > maxY) { s.y = maxY; s.vy = -Math.abs(s.vy) * 0.78; }
    }
  };

  const drawSphere = (s, isGrabbed) => {
    const pal = SPHERE_PALETTES[s.tone];
    const r = isGrabbed ? s.radius * 1.07 : s.radius;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(s.x + r * 0.14, s.y + r * 0.22, r * 0.92, r * 0.88, 0, 0, Math.PI * 2);
    ctx.fillStyle = pal.glow;
    ctx.fill();

    const grad = ctx.createRadialGradient(s.x - r * 0.34, s.y - r * 0.36, r * 0.06, s.x, s.y, r);
    grad.addColorStop(0, pal.hi);
    grad.addColorStop(0.38, pal.mid);
    grad.addColorStop(0.78, pal.shadow);
    grad.addColorStop(1, pal.rim);

    ctx.beginPath();
    ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(s.x - r * 0.32, s.y - r * 0.34, r * 0.22, r * 0.13, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(s.x, s.y, r - 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = isGrabbed ? "rgba(37, 99, 235, 0.88)" : "rgba(255,255,255,0.58)";
    ctx.lineWidth = isGrabbed ? 2.5 : 1;
    ctx.stroke();

    if (isGrabbed) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, r + 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
  };

  const render = (now) => {
    if (destroyed) return;
    const dt = Math.min(2, Math.max(0.4, (now - lastTime) / 16.667));
    lastTime = now;

    if (!reduced && !paused) {
      stepPhysics(dt);
      pointer.vx *= 0.82;
      pointer.vy *= 0.82;
    }

    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < spheres.length; i++) {
      if (i !== pointer.grabbedIndex) drawSphere(spheres[i], false);
    }
    if (pointer.grabbedIndex !== null && spheres[pointer.grabbedIndex]) {
      drawSphere(spheres[pointer.grabbedIndex], true);
    }

    if (!reduced && visible && !paused) {
      rafId = requestAnimationFrame(render);
    }
  };

  const getLocal = (cx, cy) => {
    const r = canvas.getBoundingClientRect();
    return { x: cx - r.left, y: cy - r.top };
  };

  const onDown = (e) => {
    if (e.target && e.target.closest && e.target.closest("a, button, input")) return;
    const pos = getLocal(e.clientX, e.clientY);
    pointer.x = pos.x;
    pointer.y = pos.y;
    pointer.vx = 0;
    pointer.vy = 0;
    pointer.active = true;

    let hit = null;
    for (let i = spheres.length - 1; i >= 0; i--) {
      const s = spheres[i];
      if (Math.hypot(pos.x - s.x, pos.y - s.y) <= s.radius + 8) {
        hit = i;
        break;
      }
    }
    if (hit !== null) {
      pointer.grabbedIndex = hit;
      stage.classList.add("is-grabbing");
    } else {
      for (const s of spheres) {
        const dx = s.x - pos.x;
        const dy = s.y - pos.y;
        const d = Math.hypot(dx, dy);
        if (d > 1 && d < 240) {
          const imp = ((240 - d) / 240) * 6.5;
          s.vx += (dx / d) * imp;
          s.vy += (dy / d) * imp;
        }
      }
    }
  };

  const onMove = (e) => {
    const pos = getLocal(e.clientX, e.clientY);
    if (pointer.active) {
      pointer.vx = Math.max(-28, Math.min(28, pos.x - pointer.x));
      pointer.vy = Math.max(-28, Math.min(28, pos.y - pointer.y));
    }
    pointer.x = pos.x;
    pointer.y = pos.y;
    pointer.active = true;
  };

  const release = () => {
    pointer.grabbedIndex = null;
    stage.classList.remove("is-grabbing");
  };
  const onLeave = () => {
    pointer.active = false;
    release();
  };

  resize();
  seed();
  canvas.dataset.sphereCount = String(spheres.length);
  render(performance.now());

  if (reduced) {
    return { setPaused() {}, destroy() {} };
  }

  stage.addEventListener("pointerdown", onDown);
  stage.addEventListener("pointermove", onMove, { passive: true });
  stage.addEventListener("pointerleave", onLeave);
  window.addEventListener("pointerup", release);
  window.addEventListener("pointercancel", release);
  window.addEventListener("resize", resize);

  const io = new IntersectionObserver(
    (entries) => {
      visible = Boolean(entries[0] && entries[0].isIntersecting);
      if (visible && !paused && !destroyed) {
        lastTime = performance.now();
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(rafId);
      }
    },
    { threshold: 0.04 }
  );
  io.observe(canvas);
  rafId = requestAnimationFrame(render);

  return {
    setPaused(next) {
      paused = next;
      if (!paused && visible && !destroyed) {
        lastTime = performance.now();
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(render);
      } else if (paused) {
        cancelAnimationFrame(rafId);
      }
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("resize", resize);
    },
  };
}

function createHologramTexture(img, tint) {
  const outW = 380;
  const outH = 440;
  const off = document.createElement("canvas");
  off.width = outW;
  off.height = outH;
  const octx = off.getContext("2d");
  if (!octx) return off;

  const scale = Math.min((outW * 0.92) / Math.max(1, img.naturalWidth), (outH * 0.94) / Math.max(1, img.naturalHeight));
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = (outW - dw) * 0.5;
  const dy = outH - dh;

  octx.clearRect(0, 0, outW, outH);
  octx.drawImage(img, dx, dy, dw, dh);
  const frame = octx.getImageData(0, 0, outW, outH);
  const data = frame.data;
  const origAlpha = new Uint8Array(outW * outH);
  for (let p = 0; p < outW * outH; p++) origAlpha[p] = data[p * 4 + 3];

  for (let y = 0; y < outH; y++) {
    const scanStripe = y % 3 === 0 ? 0.82 : 1.06;
    const bottomFade = y > outH * 0.84 ? Math.max(0, 1 - (y - outH * 0.84) / (outH * 0.16)) : 1;
    for (let x = 0; x < outW; x++) {
      const pIdx = y * outW + x;
      const srcAlpha = origAlpha[pIdx] / 255;
      const idx = pIdx * 4;
      if (srcAlpha < 0.02) {
        data[idx + 3] = 0;
        continue;
      }
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const rawLum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const lifted = Math.min(1, 0.08 + Math.pow(rawLum, 0.96) * 0.9);

      let edge = 0;
      if (x > 2 && x < outW - 3 && y > 2 && y < outH - 3) {
        const minN = Math.min(
          origAlpha[pIdx - 3],
          origAlpha[pIdx + 3],
          origAlpha[pIdx - outW * 3],
          origAlpha[pIdx + outW * 3]
        ) / 255;
        edge = Math.max(0, srcAlpha - minN);
      }

      const curved = Math.min(1, lifted * scanStripe);
      const maskA = srcAlpha * bottomFade;
      if (tint === "primary") {
        data[idx] = Math.min(255, Math.round(10 + Math.pow(curved, 1.7) * 205 + edge * 160));
        data[idx + 1] = Math.min(255, Math.round(52 + Math.pow(curved, 1.1) * 195 + edge * 125));
        data[idx + 2] = Math.min(255, Math.round(118 + Math.pow(curved, 0.88) * 136 + edge * 95));
        data[idx + 3] = Math.round(Math.min(1, (0.68 + curved * 0.3 + edge * 0.28) * maskA) * 255);
      } else {
        data[idx] = Math.min(255, Math.round(70 + curved * 140));
        data[idx + 1] = Math.min(255, Math.round(170 + curved * 82));
        data[idx + 2] = 255;
        data[idx + 3] = Math.round(Math.min(1, (0.16 + curved * 0.3) * maskA) * 255);
      }
    }
  }
  octx.putImageData(frame, 0, 0);
  return off;
}

function mountMentorHologram(card, canvas, photoSrc) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {} };

  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 360;
  let height = 400;
  let visible = true;
  let rafId = 0;
  let destroyed = false;
  let targetNx = 0;
  let targetNy = 0;
  let currentNx = 0;
  let currentNy = 0;
  let primaryTex = null;
  let ghostTex = null;

  const motes = Array.from({ length: 28 }, (_, idx) => ({
    x: ((idx * 37) % 100) / 100,
    y: ((idx * 23) % 100) / 100,
    speed: 0.002 + (idx % 5) * 0.0008,
    size: 1.1 + (idx % 3) * 0.65,
    phase: idx * 0.7,
  }));

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(240, rect.width || 360);
    height = Math.max(280, rect.height || 400);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (now) => {
    if (destroyed) return;
    ctx.clearRect(0, 0, width, height);
    currentNx += (targetNx - currentNx) * 0.1;
    currentNy += (targetNy - currentNy) * 0.1;

    const t = now * 0.001;
    const scanPhase = reduced ? 0.36 : (t * 0.32) % 1;
    const emitterY = height * 0.9;

    // Volumetric projection light cone
    const cone = ctx.createLinearGradient(width * 0.5, emitterY, width * 0.5, height * 0.06);
    cone.addColorStop(0, "rgba(56, 189, 248, 0.38)");
    cone.addColorStop(0.42, "rgba(96, 165, 250, 0.12)");
    cone.addColorStop(1, "rgba(96, 165, 250, 0)");
    ctx.beginPath();
    ctx.moveTo(width * 0.28, emitterY);
    ctx.lineTo(width * 0.72, emitterY);
    ctx.lineTo(width * 0.94, height * 0.06);
    ctx.lineTo(width * 0.06, height * 0.06);
    ctx.closePath();
    ctx.fillStyle = cone;
    ctx.fill();

    // Concentric emitter pedestal rings
    const rings = [
      { rx: width * 0.34, ry: height * 0.05, alpha: 0.38, dash: [6, 6] },
      { rx: width * 0.24, ry: height * 0.036, alpha: 0.65, dash: [] },
      { rx: width * 0.13, ry: height * 0.02, alpha: 0.9, dash: [] },
    ];
    for (const r of rings) {
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash(r.dash);
      ctx.ellipse(width * 0.5, emitterY, r.rx, r.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(125, 211, 252, ${r.alpha})`;
      ctx.lineWidth = r.dash.length ? 1.2 : 1.7;
      ctx.stroke();
      ctx.restore();
    }

    // Orbiting telemetry ellipse
    ctx.save();
    ctx.translate(width * 0.5 + currentNx * 6, height * 0.45 + currentNy * 4);
    ctx.rotate(-0.16 + currentNx * 0.08);
    ctx.beginPath();
    ctx.ellipse(0, 0, width * 0.43, height * 0.14, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(125, 211, 252, 0.28)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
    const oa = reduced ? 0.5 : t * 1.15;
    const nx = Math.cos(oa) * width * 0.43;
    const ny = Math.sin(oa) * height * 0.14;
    ctx.beginPath();
    ctx.arc(nx, ny, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.restore();

    // Hologram portrait projection
    if (primaryTex && ghostTex) {
      const floatY = reduced ? 0 : Math.sin(t * 1.7) * 3.5;
      const drawH = height * 0.88;
      const drawW = drawH * (primaryTex.width / primaryTex.height);
      const baseX = (width - drawW) * 0.5 + currentNx * 10;
      const baseY = height * 0.03 + floatY + currentNy * 7;
      const splitX = 4 + Math.abs(currentNx) * 6;
      const flicker = reduced ? 1 : 0.93 + Math.sin(t * 11) * 0.03 + Math.cos(t * 17) * 0.025;

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.28 * flicker;
      ctx.drawImage(ghostTex, baseX + splitX, baseY - 1, drawW, drawH);
      ctx.globalAlpha = 0.18 * flicker;
      ctx.drawImage(ghostTex, baseX - splitX * 0.7, baseY + 1, drawW, drawH);

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.95 * flicker;
      ctx.drawImage(primaryTex, baseX, baseY, drawW, drawH);

      if (!reduced) {
        const glitchY = Math.floor(scanPhase * primaryTex.height);
        const sliceH = 18;
        if (glitchY > 12 && glitchY < primaryTex.height - 24) {
          const destY = baseY + (glitchY / primaryTex.height) * drawH;
          const destH = (sliceH / primaryTex.height) * drawH;
          ctx.globalAlpha = 0.65;
          ctx.drawImage(primaryTex, 0, glitchY, primaryTex.width, sliceH, baseX + Math.sin(t * 28) * 5, destY, drawW, destH);
        }
      }
      ctx.restore();
    }

    // Sweeping horizontal scanner laser
    const scanY = height * (0.08 + scanPhase * 0.78);
    const bar = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
    bar.addColorStop(0, "rgba(125,211,252,0)");
    bar.addColorStop(0.5, "rgba(224,242,254,0.68)");
    bar.addColorStop(1, "rgba(125,211,252,0)");
    ctx.fillStyle = bar;
    ctx.fillRect(0, scanY - 20, width, 40);

    for (const m of motes) {
      if (!reduced) {
        m.y -= m.speed;
        if (m.y < 0.04) m.y = 0.92;
      }
      const mx = m.x * width + Math.sin(t * 1.4 + m.phase) * 8 + currentNx * 6;
      ctx.beginPath();
      ctx.arc(mx, m.y * height, m.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(186, 230, 253, ${Math.max(0.12, Math.sin(m.y * Math.PI) * 0.72).toFixed(3)})`;
      ctx.fill();
    }

    if (!reduced && visible) rafId = requestAnimationFrame(draw);
  };

  resize();
  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    primaryTex = createHologramTexture(img, "primary");
    ghostTex = createHologramTexture(img, "ghost");
    canvas.dataset.hologramLoaded = "true";
    draw(performance.now());
  };
  img.src = photoSrc;
  draw(performance.now());

  if (reduced) return { destroy() {} };

  const onMove = (e) => {
    const r = card.getBoundingClientRect();
    const nx = (e.clientX - r.left) / Math.max(1, r.width);
    const ny = (e.clientY - r.top) / Math.max(1, r.height);
    targetNx = (nx - 0.5) * 2;
    targetNy = (ny - 0.5) * 2;
    card.style.setProperty("--holo-x", `${(nx * 100).toFixed(1)}%`);
    card.style.setProperty("--holo-y", `${(ny * 100).toFixed(1)}%`);
    card.style.transform = `perspective(1200px) rotateX(${((0.5 - ny) * 8).toFixed(2)}deg) rotateY(${((nx - 0.5) * 9).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    targetNx = 0;
    targetNy = 0;
    card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  };

  card.addEventListener("pointermove", onMove, { passive: true });
  card.addEventListener("pointerleave", onLeave);
  window.addEventListener("resize", resize);

  const io = new IntersectionObserver(
    (entries) => {
      visible = Boolean(entries[0] && entries[0].isIntersecting);
      if (visible && !destroyed) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(rafId);
      }
    },
    { threshold: 0.05 }
  );
  io.observe(canvas);
  rafId = requestAnimationFrame(draw);

  return {
    destroy() {
      destroyed = true;
      cancelAnimationFrame(rafId);
      io.disconnect();
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    },
  };
}

/* ============================================================================
 * PART 2B: EXPERTISE 3D SCROLL-FLIP DECK DATA & CONTROLLER
 * ============================================================================ */

const EXPERTISE_WAVES = [
  {
    code: "01",
    shortLabel: "Audio & Video",
    label: "Editing Audio & Video (Premiere Pro)",
    summary: "Alur produksi lengkap dari pra-produksi naskah, rough cut timeline, hingga mixing suara dan grading.",
    cards: [
      {
        tag: "PERTEMUAN 01",
        title: "Pra-Produksi & Storyboard TVC",
        desc: "Merumuskan ide dari masalah nyata, menulis naskah 2 kolom monolog 16:9, dan menggambar storyboard 9 frame siap ACC.",
        actionLabel: "Buka Modul 01",
        weekId: "pr-01",
      },
      {
        tag: "PERTEMUAN 02",
        title: "Foldering & Rough Cut Cepat",
        desc: "Manajemen bins rapi standar studio, teknik Ripple Trim Q & W, serta melatih rasa pacing antar potongan klip.",
        actionLabel: "Buka Modul 02",
        weekId: "pr-02",
      },
      {
        tag: "PERTEMUAN 03 & 06",
        title: "Audio Mixing & Color Grading",
        desc: "Restorasi audio denoise, auto ducking musik latar, Lumetri color grading sinematik, dan QC master export H.264.",
        actionLabel: "Buka Modul 06",
        weekId: "pr-06",
      },
    ],
  },
  {
    code: "02",
    shortLabel: "Desain & AI",
    label: "Graphic Design & AI Content Creator",
    summary: "Menggabungkan komposisi grafis siaran, identitas visual modern, dan alur ideation berbasis AI kreatif.",
    cards: [
      {
        tag: "PERTEMUAN 04",
        title: "Grafis Berita & Tipografi Video",
        desc: "Mendesain lower third, running text, dan overlay siaran TV yang bersih dengan hirarki baca yang jelas.",
        actionLabel: "Buka Modul 04",
        weekId: "pr-04",
      },
      {
        tag: "PERTEMUAN 05",
        title: "Green Screen & Visual B-Roll",
        desc: "Chroma keying rapi dengan Ultra Key, spill suppression, dan penyusunan lapisan visual B-Roll untuk konteks cerita.",
        actionLabel: "Buka Modul 05",
        weekId: "pr-05",
      },
      {
        tag: "AI WORKFLOW",
        title: "AI Content Creation & Ideation",
        desc: "Memanfaatkan alur kerja AI kreatif untuk riset konsep visual, eksplorasi referensi, dan akselerasi produksi konten.",
        actionLabel: "Lihat Silabus",
        route: "materi",
      },
    ],
  },
  {
    code: "03",
    shortLabel: "Web & Kelas",
    label: "Web UI Interaktif & Metode Kelas XI DKV",
    summary: "Portal pembelajaran terbuka agar siswa XI DKV SMK Bina Bangsa mudah mengakses materi, kuis, dan kumpul tugas.",
    cards: [
      {
        tag: "WEB DESIGN",
        title: "Antarmuka Web Interaktif",
        desc: "Membangun web edukasi responsif dengan animasi spasial, navigasi cepat, dan akses mudah di komputer lab maupun ponsel.",
        actionLabel: "Buka Beranda",
        route: "home",
      },
      {
        tag: "PRAKTIK NYATA",
        title: "Belajar Berbasis Proyek Studio",
        desc: "Setiap pertemuan mengarah ke output karya nyata dari brief iklan produk hingga penilaian akhir yang terukur.",
        actionLabel: "Buka Silabus",
        route: "materi",
      },
      {
        tag: "PENDAMPINGAN",
        title: "Partner Ngulik di Kelas",
        desc: "Bukan sekadar menghafal tombol software, tapi membangun rasa visual, ritme cerita, dan kerapian eksekusi.",
        actionLabel: "Kumpul Tugas",
        href: "/kumpul-tugas",
      },
    ],
  },
];

function computeFlipDeckState(progress) {
  const p = clamp01(progress);
  const cards = [];
  for (let i = 0; i < 3; i++) {
    const stagger = i * 0.045;
    const f1s = 0.18 + stagger;
    const f1e = 0.42 + stagger;
    const f2s = 0.59 + stagger;
    const f2e = 0.83 + stagger;

    let angle = 0;
    if (p <= f1s) angle = 0;
    else if (p < f1e) angle = easeInOutCubic((p - f1s) / (f1e - f1s)) * 180;
    else if (p <= f2s) angle = 180;
    else if (p < f2e) angle = 180 + easeInOutCubic((p - f2s) / (f2e - f2s)) * 180;
    else angle = 360;

    const frontWave = angle < 180 ? 0 : 2;
    const turn = Math.abs(Math.sin((angle * Math.PI) / 180));
    cards.push({ angle, frontWave, backWave: 1, sheen: turn * 0.65, lift: turn * 26 });
  }
  const activeWave = p < 0.34 ? 0 : p < 0.75 ? 1 : 2;
  return { activeWave, progress: p, cards };
}

function waveToDeckProgress(idx) {
  return idx === 0 ? 0.04 : idx === 1 ? 0.54 : 0.96;
}

const CURRICULUM_LEDGER_GROUPS = [
  {
    title: "Editing Audio & Video (Adobe Premiere Pro)",
    rows: [
      { code: "M01", label: "Pra-Produksi & Storyboard Produk TVC", note: "Ide, Naskah 2 Kolom & 9 Frame", weekId: "pr-01" },
      { code: "M02", label: "Foldering & Rough Cut Cepat (Q & W)", note: "5 Folder Rapi & Ripple Trim", weekId: "pr-02" },
      { code: "M03", label: "Audio Denoise & Audio Ducking", note: "3 Jalur Suara & Essential Sound", weekId: "pr-03" },
      { code: "M04", label: "Elemen Grafis Berita & Tipografi", note: "Safe Margin, Lower Third & CTA", weekId: "pr-04" },
      { code: "M05", label: "Studio Green Screen & Visual B-Roll", note: "Ultra Key & Multi-Layer Video", weekId: "pr-05" },
      { code: "M06", label: "Color Grading & Master Export H.264", note: "Lumetri, 5 Titik QC & Penilaian", weekId: "pr-06" },
    ],
  },
  {
    title: "Motion Graphics (Adobe After Effects)",
    rows: [
      { code: "AE01", label: "Dasar Composition & Keyframe", note: "Modul Pertemuan 01 AE", href: "/ae-pertemuan-1.html" },
      { code: "AE02", label: "Shape Layer & Kinetic Motion", note: "Modul Pertemuan 02 AE", href: "/ae-pertemuan-2.html" },
      { code: "AE03", label: "Masking, Track Matte & Transitions", note: "Modul Pertemuan 03 AE", href: "/ae-pertemuan-3.html" },
      { code: "AE04", label: "Tipografi Gerak & Lower Third AE", note: "Modul Pertemuan 04 AE", href: "/ae-pertemuan-4.html" },
      { code: "AE05", label: "Motion Tracking & Visual Compositing", note: "Modul Pertemuan 05 AE", href: "/ae-pertemuan-5.html" },
      { code: "AE06", label: "Finishing Bumper Studio & Render", note: "Modul Pertemuan 06 AE", href: "/ae-pertemuan-6.html" },
    ],
  },
  {
    title: "Portal & Kanal Resmi Kelas XI DKV",
    rows: [
      { code: "001", label: "Absensi Digital Kelas", note: "Presensi siswa XI DKV SMK Bina Bangsa", href: "/absensi" },
      { code: "002", label: "Kumpul Tugas Karya", note: "Upload link tugas video & storyboard", href: "/kumpul-tugas" },
      { code: "003", label: "Materi Siswa Terpadu", note: "Akses slide PDF & panduan belajar", href: "/materi-siswa" },
      { code: "004", label: "Galeri & Database Tugas", note: "Arsip progres & hasil proyek kelas", href: "/database-tugas" },
    ],
  },
];

const ECOSYSTEM_TOOLS = [
  { badge: "Pr", name: "Premiere Pro", sub: "Editing & Timeline" },
  { badge: "Ae", name: "After Effects", sub: "Motion Graphics" },
  { badge: "Au", name: "Audio Mixing", sub: "DeNoise & Ducking" },
  { badge: "Ps", name: "Graphic Design", sub: "Poster & Broadcast" },
  { badge: "Lu", name: "Lumetri Color", sub: "Grading & QC" },
  { badge: "AI", name: "AI Creative", sub: "Ideation & Riset" },
  { badge: "UI", name: "Web Design", sub: "Portal Interaktif" },
  { badge: "TV", name: "TVC & Berita", sub: "Storyboard 16:9" },
];

export function mountLusionAboutView({ container, profile, soundEngine, onNavigate, onOpenDetail }) {
  const bio = cleanEmDash(profile.bio);
  const quote = cleanEmDash(profile.quote);
  const email = (profile.socials && profile.socials.email) || "hello@lexyth.my.id";
  const socials = profile.socials || {};

  container.innerHTML = `
    <div class="dkv-about-page" id="dkvAboutPage">
      <!-- 01. LUSION.CO INTERACTIVE 3D PHYSICS SPHERES HERO -->
      <section class="dkv-about-hero" id="dkvAboutHero" data-spheres-stage aria-labelledby="dkvAboutHeroTitle">
        <canvas id="dkvAboutHeroSpheres" class="dkv-spheres-canvas" aria-hidden="true"></canvas>

        <div class="dkv-about-shell dkv-about-hero-content">
          <div class="dkv-about-topbar">
            <div class="dkv-about-topbar-left">
              <button type="button" class="dkv-back-pill" id="btnAboutBackHome" data-cursor="hover">
                <span aria-hidden="true">←</span>
                <span>BERANDA</span>
              </button>
              <p class="dkv-about-eyebrow">TENTANG PENGAJAR • XI DKV SMK BINA BANGSA</p>
            </div>
            <button type="button" class="dkv-pause-pill" id="btnAboutPauseSpheres" aria-pressed="false" data-cursor="hover">
              Jeda Bola 3D
            </button>
          </div>

          <div>
            <h1 class="dkv-about-h1" id="dkvAboutHeroTitle">
              <span class="dkv-about-h1-line">PENGAJAR DKV</span>
              <span class="dkv-about-h1-line">VIDEO &amp; AUDIO</span>
              <span class="dkv-about-h1-line">MENTOR KREATIF</span>
              <span class="dkv-about-h1-line dkv-about-h1-accent">SMK BINA BANGSA.</span>
            </h1>

            <div class="dkv-about-hero-bottom">
              <p class="dkv-about-hero-lead">${bio}</p>
              <div class="dkv-about-scroll-cue">
                <span aria-hidden="true">•</span>
                <span>SCROLL UNTUK MENGENAL</span>
                <span aria-hidden="true">•</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 02. SOLO MENTOR 3D HOLOGRAM CHAMBER ([[ 001 ]] KAK ADRIAN) -->
      <section class="dkv-about-founder" id="dkvAboutFounder" aria-labelledby="dkvFounderHeading">
        <div class="dkv-about-shell">
          <div class="dkv-blue-line" aria-hidden="true"></div>

          <div class="dkv-founder-grid">
            <div>
              <div class="dkv-holo-card" id="dkvMentorHoloCard" data-cursor="hover">
                <div class="dkv-holo-scanlines" aria-hidden="true"></div>
                <div class="dkv-holo-iridescence" aria-hidden="true"></div>
                <span class="dkv-holo-reticle tl" aria-hidden="true"></span>
                <span class="dkv-holo-reticle tr" aria-hidden="true"></span>
                <span class="dkv-holo-reticle bl" aria-hidden="true"></span>
                <span class="dkv-holo-reticle br" aria-hidden="true"></span>

                <div class="dkv-holo-header">
                  <span>[[ 001 ]]</span>
                  <span class="dkv-holo-live">
                    <span class="dkv-holo-dot" aria-hidden="true"></span>
                    <span>HOLOGRAM PROFIL • 1 / 1 PENGAJAR</span>
                  </span>
                </div>

                <div class="dkv-holo-viewport">
                  <canvas
                    id="dkvMentorHoloCanvas"
                    class="dkv-holo-canvas"
                    role="img"
                    aria-label="Foto profil hologram 3D interaktif Kak Adrian, pengajar Editing Audio dan Video XI DKV"
                  ></canvas>
                  <div class="dkv-holo-tag-top">
                    <span class="dkv-holo-brand-pill">
                      <img src="/images/logo.png" alt="Logo SMK Bina Bangsa" width="24" height="24" loading="lazy" />
                      <span>XI DKV</span>
                    </span>
                    <span class="dkv-holo-chip">3D HOLO</span>
                  </div>
                  <div class="dkv-holo-readout">
                    <p class="dkv-holo-role-kicker">PENGAJAR &amp; CREATIVE MENTOR</p>
                    <p class="dkv-holo-name">${profile.name}</p>
                    <p class="dkv-holo-caption">Gerakkan kursor untuk memutar proyeksi hologram</p>
                  </div>
                </div>

                <div class="dkv-holo-footer">
                  <span>SMK Bina Bangsa • XI DKV</span>
                  ${socials.instagram ? `<a href="${socials.instagram}" target="_blank" rel="noopener noreferrer">@lexyth →</a>` : `<span>${email}</span>`}
                </div>
              </div>
            </div>

            <div>
              <div class="dkv-founder-index-row">
                <span>[[ 001 ]]</span>
                <span class="dkv-founder-line" aria-hidden="true"></span>
                <span>DI BALIK PORTAL DKV</span>
              </div>
              <h2 class="dkv-founder-title" id="dkvFounderHeading">${profile.name}</h2>
              <p class="dkv-founder-role">${profile.title}</p>
              <p class="dkv-founder-text">${bio}</p>
              <blockquote class="dkv-founder-quote">"${quote}"</blockquote>

              <div class="dkv-founder-actions">
                <button type="button" class="dkv-btn-primary" id="btnAboutOpenSyllabus" data-cursor="hover">
                  <span>JELAJAHI SILABUS MATERI</span>
                  <span aria-hidden="true">→</span>
                </button>
                <a href="mailto:${email}" class="dkv-btn-ghost" data-cursor="hover">
                  <span>KIRIM EMAIL: ${email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 03. SOFTWARE & ECOSYSTEM GRID (LUSION "BRANDS WE WORK WITH") -->
      <section class="dkv-about-eco" id="dkvAboutEco" aria-labelledby="dkvEcoHeading">
        <div class="dkv-about-shell">
          <div class="dkv-blue-line" aria-hidden="true"></div>

          <div class="dkv-eco-header">
            <div>
              <p class="dkv-about-eyebrow">EKOSISTEM PERANGKAT &amp; BIDANG KREATIF</p>
              <h2 class="dkv-deck-title" id="dkvEcoHeading">Perangkat Produksi Studio dalam Satu Kelas.</h2>
            </div>
            <p class="dkv-eco-sub">
              Siswa XI DKV dibimbing mempraktikkan langsung software standar industri kreatif mulai dari editing video, motion graphics, restorasi suara, hingga desain web interaktif.
            </p>
          </div>

          <div class="dkv-eco-grid">
            ${ECOSYSTEM_TOOLS.map(
              (tool) => `
                <article class="dkv-eco-card">
                  <span class="dkv-eco-badge" aria-hidden="true">${tool.badge}</span>
                  <h3 class="dkv-eco-name">${tool.name}</h3>
                  <p class="dkv-eco-desc">${tool.sub}</p>
                </article>
              `
            ).join("")}
          </div>
        </div>
      </section>

      <!-- 04. REAL CURRICULUM ARCHITECTURAL LEDGER (LUSION "AWARDS 58") -->
      <section class="dkv-about-ledger" id="dkvAboutLedger" aria-labelledby="dkvLedgerHeading">
        <div class="dkv-about-shell">
          <div class="dkv-blue-line" aria-hidden="true"></div>

          <div class="dkv-ledger-grid">
            <div class="dkv-ledger-aside">
              <div class="dkv-ledger-sticky">
                <p class="dkv-about-eyebrow">REKAM JEJAK KURIKULUM NYATA</p>
                <h2 class="dkv-deck-title" id="dkvLedgerHeading">Struktur Kelas</h2>

                <div class="dkv-ledger-metric">
                  <span class="dkv-ledger-big">12</span>
                  <span class="dkv-ledger-unit">Modul</span>
                </div>
                <p class="dkv-ledger-caption">
                  6 Pertemuan Editing Audio &amp; Video (Premiere Pro) + 6 Modul Motion Graphics (After Effects) dan 4 Portal Kelas Digital.
                </p>

                <a href="/materi-siswa" class="dkv-btn-ghost dkv-ledger-cta" data-cursor="hover">
                  <span>Buka Semua Materi Siswa →</span>
                </a>
              </div>
            </div>

            <div class="dkv-ledger-groups">
              ${CURRICULUM_LEDGER_GROUPS.map(
                (group) => `
                  <div class="dkv-ledger-group">
                    <h3 class="dkv-ledger-group-title">${group.title}</h3>
                    <ul class="dkv-ledger-list">
                      ${group.rows
                        .map((row) =>
                          row.weekId
                            ? `
                              <li>
                                <button type="button" class="dkv-ledger-row" data-ledger-week="${row.weekId}" data-cursor="hover">
                                  <span class="dkv-ledger-code">${row.code}</span>
                                  <span class="dkv-ledger-label">${row.label}</span>
                                  <span class="dkv-ledger-note">${row.note} →</span>
                                </button>
                              </li>
                            `
                            : `
                              <li>
                                <a href="${row.href}" class="dkv-ledger-row" data-cursor="hover">
                                  <span class="dkv-ledger-code">${row.code}</span>
                                  <span class="dkv-ledger-label">${row.label}</span>
                                  <span class="dkv-ledger-note">${row.note} →</span>
                                </a>
                              </li>
                            `
                        )
                        .join("")}
                    </ul>
                  </div>
                `
              ).join("")}
            </div>
          </div>
        </div>
      </section>

      <!-- 05. PINNED 3D SCROLL-FLIP AREA OF EXPERTISE DECK (LUSION.CO/ABOUT) -->
      <section class="dkv-deck-section" id="dkvExpertiseDeck" aria-labelledby="dkvDeckHeading">
        <div class="dkv-deck-sticky">
          <div class="dkv-about-shell">
            <div class="dkv-blue-line" aria-hidden="true"></div>

            <div class="dkv-deck-header">
              <div>
                <p class="dkv-about-eyebrow">AREA OF EXPERTISE • 3D FLIP DECK</p>
                <h2 class="dkv-deck-title" id="dkvDeckHeading">Keahlian &amp; Fokus Pembelajaran</h2>
              </div>

              <div class="dkv-deck-controls">
                <div class="dkv-deck-tab-group" role="tablist" aria-label="Pilih gelombang keahlian">
                  ${EXPERTISE_WAVES.map(
                    (w, i) => `
                      <button
                        type="button"
                        role="tab"
                        aria-selected="${i === 0 ? "true" : "false"}"
                        class="dkv-deck-tab ${i === 0 ? "is-active" : ""}"
                        data-deck-tab="${i}"
                        data-cursor="hover"
                      >
                        ${w.code} ${w.shortLabel}
                      </button>
                    `
                  ).join("")}
                </div>
                <div class="dkv-deck-progress-track" aria-hidden="true">
                  <div class="dkv-deck-progress-bar" id="dkvDeckProgressBar"></div>
                </div>
              </div>
            </div>

            <!-- Active Wave Descriptor Strip (matching amc.web.id/about) -->
            <div class="dkv-deck-wave-strip">
              <div>
                <p class="dkv-deck-wave-label" id="dkvDeckWaveLabel">01 / 03 • ${EXPERTISE_WAVES[0].label}</p>
                <p class="dkv-deck-wave-summary" id="dkvDeckWaveSummary">${EXPERTISE_WAVES[0].summary}</p>
              </div>
              <button type="button" class="dkv-deck-strip-link" id="btnDeckOpenSyllabus" data-cursor="hover">
                Buka Silabus Lengkap →
              </button>
            </div>

            <div class="dkv-flip-grid" id="dkvFlipGrid">
              ${[0, 1, 2]
                .map(
                  (slotIdx) => `
                    <div class="dkv-flip-slot" data-flip-slot="${slotIdx}">
                      <div class="dkv-flip-card" data-flip-card>
                        <article class="dkv-flip-face is-front" data-flip-front>
                          <div class="dkv-flip-sheen" data-flip-sheen aria-hidden="true"></div>
                          <div>
                            <div class="dkv-flip-top">
                              <span class="dkv-flip-code" data-face-code>01 / 03</span>
                              <span class="dkv-flip-tag" data-face-tag></span>
                            </div>
                            <h3 class="dkv-flip-heading" data-face-title></h3>
                            <p class="dkv-flip-desc" data-face-desc></p>
                          </div>
                          <div class="dkv-flip-footer">
                            <span>XI DKV • KAK ADRIAN</span>
                            <button type="button" class="dkv-flip-action" data-face-action data-cursor="hover">
                              <span data-face-action-label>Buka</span>
                              <span aria-hidden="true">→</span>
                            </button>
                          </div>
                        </article>

                        <article class="dkv-flip-face is-back" data-flip-back>
                          <div class="dkv-flip-sheen" data-flip-sheen aria-hidden="true"></div>
                          <div>
                            <div class="dkv-flip-top">
                              <span class="dkv-flip-code" data-face-code>02 / 03</span>
                              <span class="dkv-flip-tag" data-face-tag></span>
                            </div>
                            <h3 class="dkv-flip-heading" data-face-title></h3>
                            <p class="dkv-flip-desc" data-face-desc></p>
                          </div>
                          <div class="dkv-flip-footer">
                            <span>XI DKV • KAK ADRIAN</span>
                            <button type="button" class="dkv-flip-action" data-face-action data-cursor="hover">
                              <span data-face-action-label>Buka</span>
                              <span aria-hidden="true">→</span>
                            </button>
                          </div>
                        </article>
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        </div>
      </section>

      <!-- 06. FINALE INTERACTIVE 3D PHYSICS SPHERES CTA (LUSION "LET'S WORK TOGETHER") -->
      <section class="dkv-about-cta" id="dkvAboutCta" data-spheres-stage aria-labelledby="dkvAboutCtaTitle">
        <canvas id="dkvAboutCtaSpheres" class="dkv-spheres-canvas" aria-hidden="true"></canvas>

        <div class="dkv-about-cta-inner">
          <p class="dkv-about-eyebrow">SIAP NGULIK BARENG DI KELAS?</p>
          <h2 class="dkv-about-cta-title" id="dkvAboutCtaTitle">
            <span>AYO MULAI</span>
            <span class="dkv-about-h1-accent">BERKARYA!</span>
          </h2>
          <p class="dkv-about-cta-sub">
            Santai saja, Kak Adrian selalu terbuka untuk diskusi seputar Editing Audio &amp; Video, Graphic Design, AI Content, dan Web Design.
          </p>

          <div class="dkv-about-cta-actions">
            <button type="button" class="dkv-btn-primary" id="btnExploreSyllabusFromAbout" data-cursor="hover">
              <span>BUKA SILABUS MATERI</span>
              <span aria-hidden="true">→</span>
            </button>
            <a href="/kumpul-tugas" class="dkv-btn-ghost" data-cursor="hover">KUMPULKAN TUGAS</a>
            <a href="mailto:${email}" class="dkv-btn-ghost" data-cursor="hover">${email}</a>
          </div>

          <div class="dkv-about-socials">
            ${socials.instagram ? `<a href="${socials.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>` : ""}
            ${socials.youtube ? `<a href="${socials.youtube}" target="_blank" rel="noopener noreferrer">YouTube</a>` : ""}
            ${socials.github ? `<a href="${socials.github}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ""}
          </div>
        </div>
      </section>

      <!-- 07. LUSION.CO OVERSCROLL CHARGE GATE -> SILABUS MATERI -->
      ${renderNextPageGateMarkup({
        id: "dkvAboutNextGate",
        title: "SILABUS MATERI XI DKV",
        nextLabel: "LANJUT BELAJAR",
        eyebrow: "TERUS SCROLL UNTUK LANJUT",
        hint: "Scroll terus ke bawah atau klik untuk langsung membuka seluruh modul silabus Editing Audio & Video.",
      })}
    </div>
  `;

  // Wire navigation actions
  const btnHome = document.getElementById("btnAboutBackHome");
  btnHome &&
    btnHome.addEventListener("click", () => {
      soundEngine && soundEngine.playWhoosh && soundEngine.playWhoosh(360, 90);
      onNavigate && onNavigate("home");
    });

  const goSyllabus = () => {
    soundEngine && soundEngine.playWhoosh && soundEngine.playWhoosh(390, 95);
    onNavigate && onNavigate("materi");
  };
  const btnSyl1 = document.getElementById("btnAboutOpenSyllabus");
  const btnSyl2 = document.getElementById("btnExploreSyllabusFromAbout");
  const btnSyl3 = document.getElementById("btnDeckOpenSyllabus");
  btnSyl1 && btnSyl1.addEventListener("click", goSyllabus);
  btnSyl2 && btnSyl2.addEventListener("click", goSyllabus);
  btnSyl3 && btnSyl3.addEventListener("click", goSyllabus);

  container.querySelectorAll("[data-ledger-week]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const weekId = btn.getAttribute("data-ledger-week");
      if (weekId && onOpenDetail) {
        soundEngine && soundEngine.playTick && soundEngine.playTick(1100);
        onOpenDetail(weekId);
      }
    });
  });

  const aboutNextGate = mountNextPageGateController(
    document.getElementById("dkvAboutNextGate"),
    goSyllabus,
    soundEngine
  );

  // Mount Interactive 3D Physics Spheres in Hero & Finale CTA
  const heroSpheres = mountInteractiveSpheres(
    document.getElementById("dkvAboutHeroSpheres"),
    document.getElementById("dkvAboutHero"),
    "hero"
  );
  const ctaSpheres = mountInteractiveSpheres(
    document.getElementById("dkvAboutCtaSpheres"),
    document.getElementById("dkvAboutCta"),
    "cta"
  );

  const pauseBtn = document.getElementById("btnAboutPauseSpheres");
  let spheresPaused = false;
  pauseBtn &&
    pauseBtn.addEventListener("click", () => {
      spheresPaused = !spheresPaused;
      pauseBtn.setAttribute("aria-pressed", spheresPaused ? "true" : "false");
      pauseBtn.textContent = spheresPaused ? "Putar Bola 3D" : "Jeda Bola 3D";
      heroSpheres.setPaused(spheresPaused);
      ctaSpheres.setPaused(spheresPaused);
    });

  // Mount Solo Mentor 3D Hologram Portrait (/images/adrian-hologram.webp)
  const hologram = mountMentorHologram(
    document.getElementById("dkvMentorHoloCard"),
    document.getElementById("dkvMentorHoloCanvas"),
    "/images/adrian-hologram.webp"
  );

  // Mount Pinned 3D Scroll-Flip Area of Expertise Deck
  const deckSection = document.getElementById("dkvExpertiseDeck");
  const slots = Array.from(container.querySelectorAll("[data-flip-slot]"));
  const deckTabs = Array.from(container.querySelectorAll("[data-deck-tab]"));
  const waveLabelEl = document.getElementById("dkvDeckWaveLabel");
  const waveSummaryEl = document.getElementById("dkvDeckWaveSummary");
  const deckBar = document.getElementById("dkvDeckProgressBar");

  const frontCache = [-1, -1, -1];
  const backCache = [-1, -1, -1];
  let lastWave = -1;

  const populateFace = (faceEl, wave, cardData) => {
    const codeEl = faceEl.querySelector("[data-face-code]");
    const tagEl = faceEl.querySelector("[data-face-tag]");
    const titleEl = faceEl.querySelector("[data-face-title]");
    const descEl = faceEl.querySelector("[data-face-desc]");
    const actionBtn = faceEl.querySelector("[data-face-action]");
    const actionLabel = faceEl.querySelector("[data-face-action-label]");

    if (codeEl) codeEl.textContent = `${wave.code} / 03`;
    if (tagEl) tagEl.textContent = cardData.tag;
    if (titleEl) titleEl.textContent = cardData.title;
    if (descEl) descEl.textContent = cardData.desc;
    if (actionLabel) actionLabel.textContent = cardData.actionLabel;
    if (actionBtn) {
      actionBtn.dataset.weekId = cardData.weekId || "";
      actionBtn.dataset.route = cardData.route || "";
      actionBtn.dataset.href = cardData.href || "";
    }
  };

  container.querySelectorAll("[data-face-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wId = btn.dataset.weekId;
      const route = btn.dataset.route;
      const href = btn.dataset.href;
      soundEngine && soundEngine.playTick && soundEngine.playTick(1100);
      if (wId && onOpenDetail) onOpenDetail(wId);
      else if (route && onNavigate) onNavigate(route);
      else if (href) window.location.href = href;
    });
  });

  const applyDeckProgress = (prog, smooth = false) => {
    const state = computeFlipDeckState(prog);
    slots.forEach((slot, idx) => {
      const cState = state.cards[idx];
      const cardEl = slot.querySelector("[data-flip-card]");
      const frontEl = slot.querySelector("[data-flip-front]");
      const backEl = slot.querySelector("[data-flip-back]");

      if (frontEl && frontCache[idx] !== cState.frontWave) {
        const w = EXPERTISE_WAVES[cState.frontWave];
        populateFace(frontEl, w, w.cards[idx]);
        frontCache[idx] = cState.frontWave;
      }
      if (backEl && backCache[idx] !== cState.backWave) {
        const w = EXPERTISE_WAVES[cState.backWave];
        populateFace(backEl, w, w.cards[idx]);
        backCache[idx] = cState.backWave;
      }
      if (cardEl) {
        cardEl.classList.toggle("is-smooth-flip", smooth);
        cardEl.style.transform = `translate3d(0, ${(-cState.lift * 0.35).toFixed(1)}px, ${cState.lift.toFixed(1)}px) rotateY(${cState.angle.toFixed(2)}deg)`;
      }
      slot.querySelectorAll("[data-flip-sheen]").forEach((sh) => {
        sh.style.opacity = cState.sheen.toFixed(3);
      });
    });

    if (lastWave !== state.activeWave) {
      lastWave = state.activeWave;
      const w = EXPERTISE_WAVES[state.activeWave];
      if (waveLabelEl) waveLabelEl.textContent = `${w.code} / 03 • ${w.label}`;
      if (waveSummaryEl) waveSummaryEl.textContent = w.summary;
      deckTabs.forEach((t, idx) => {
        const active = idx === state.activeWave;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
    }
    if (deckBar) {
      deckBar.style.transform = `scaleX(${Math.max(0.08, state.progress).toFixed(4)})`;
    }
  };

  applyDeckProgress(waveToDeckProgress(0), false);

  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const syncDeckFromScroll = () => {
    if (reduced || !deckSection || window.innerWidth < 1024) return;
    const rect = deckSection.getBoundingClientRect();
    const scrollable = Math.max(1, rect.height - window.innerHeight);
    const prog = clamp01(-rect.top / scrollable);
    applyDeckProgress(prog, false);
  };

  deckTabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => {
      soundEngine && soundEngine.playTick && soundEngine.playTick(1120);
      const targetProg = waveToDeckProgress(idx);
      if (!reduced && deckSection && window.innerWidth >= 1024) {
        const top = deckSection.getBoundingClientRect().top + window.scrollY;
        const scrollable = Math.max(1, deckSection.offsetHeight - window.innerHeight);
        const targetY = top + scrollable * targetProg;
        if (window.__dkvLenis && typeof window.__dkvLenis.scrollTo === "function") {
          window.__dkvLenis.scrollTo(targetY, { duration: 1.0 });
        } else {
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      } else {
        applyDeckProgress(targetProg, !reduced);
      }
    });
  });

  window.addEventListener("scroll", syncDeckFromScroll, { passive: true });

  return {
    onScrollUpdate() {
      syncDeckFromScroll();
    },
    destroy() {
      window.removeEventListener("scroll", syncDeckFromScroll);
      aboutNextGate.destroy();
      heroSpheres.destroy();
      ctaSpheres.destroy();
      hologram.destroy();
    },
  };
}
