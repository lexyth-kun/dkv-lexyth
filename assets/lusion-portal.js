(function () {
  "use strict";

  class LusionWatercolorCanvas {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: true });
      this.particles = [];
      this.lastMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      this.colorPhase = 0;
      this.palette = [
        { r: 37, g: 99, b: 235 },
        { r: 30, g: 64, b: 175 },
        { r: 59, g: 130, b: 246 },
        { r: 14, g: 165, b: 233 },
        { r: 96, g: 165, b: 250 }
      ];
      this.rafId = null;
      this.resize();
      this.bindEvents();
      this.animate();
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
      this.canvas.style.width = window.innerWidth + "px";
      this.canvas.style.height = window.innerHeight + "px";
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    bindEvents() {
      window.addEventListener("resize", () => this.resize());
      window.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const dx = x - this.lastMouse.x;
        const dy = y - this.lastMouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.max(1, Math.min(Math.floor(dist / 10), 6));
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          this.addDrop(this.lastMouse.x + dx * t, this.lastMouse.y + dy * t, dist);
        }
        this.lastMouse.x = x;
        this.lastMouse.y = y;
      }, { passive: true });
    }

    addDrop(x, y, speed) {
      this.colorPhase = (this.colorPhase + 0.08) % this.palette.length;
      const idx = Math.floor(this.colorPhase);
      const next = (idx + 1) % this.palette.length;
      const frac = this.colorPhase - idx;
      const c1 = this.palette[idx];
      const c2 = this.palette[next];
      const r = Math.round(c1.r + (c2.r - c1.r) * frac);
      const g = Math.round(c1.g + (c2.g - c1.g) * frac);
      const b = Math.round(c1.b + (c2.b - c1.b) * frac);
      const radius = Math.random() * 18 + 16 + Math.min(speed * 0.35, 22);
      const maxRadius = radius * (Math.random() * 1.6 + 2.0);
      this.particles.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        radius,
        maxRadius,
        growthRate: Math.random() * 0.8 + 0.7,
        color: { r, g, b },
        alpha: Math.random() * 0.06 + 0.16,
        decay: Math.random() * 0.006 + 0.008
      });
      if (this.particles.length > 140) {
        this.particles.splice(0, this.particles.length - 140);
      }
    }

    animate() {
      this.rafId = requestAnimationFrame(() => this.animate());
      if (this.particles.length === 0) return;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.ctx.globalCompositeOperation = "multiply";
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        if (p.radius < p.maxRadius) p.radius += p.growthRate;
        p.alpha -= p.decay;
        if (p.alpha <= 0.005) {
          this.particles.splice(i, 1);
          continue;
        }
        const grad = this.ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha * 0.85})`);
        grad.addColorStop(0.55, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  window.initLusionPortal = function initLusionPortal(config) {
    const cfg = config || {};
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    let canvas = document.getElementById("watercolorCanvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "watercolorCanvas";
      document.body.prepend(canvas);
    }
    if (!reduceMotion && !coarsePointer) {
      new LusionWatercolorCanvas(canvas);
    }

    const mount = document.getElementById("lusionNavMount");
    if (mount && !cfg.hideNav) {
      const items = [
        { key: "home", label: "HOME", href: "/" },
        { key: "kumpul-tugas", label: "KUMPUL TUGAS", href: "/kumpul-tugas" },
        { key: "dashboard", label: "DASHBOARD", href: "/dashboard" }
      ];
      const linksHtml = items.map(it =>
        `<a href="${it.href}" class="nav-item ${cfg.activeRoute === it.key ? "active" : ""}">${it.label}</a>`
      ).join("");

      mount.innerHTML = `
        <header class="lusion-portal-header">
          <div class="lusion-portal-header-inner">
            <a href="/" class="nav-brand">
              <span class="brand-name">BINA BANGSA</span>
              <span class="brand-divider">/</span>
              <span class="brand-tag">${cfg.subtitle || "PORTAL KELAS"}</span>
            </a>
            <nav class="nav-center-pill" aria-label="Navigasi Portal Kelas">
              ${linksHtml}
            </nav>
            <div class="nav-right-actions">
              ${cfg.rightHtml || ""}
            </div>
          </div>
        </header>
      `;
    } else if (mount && cfg.hideNav) {
      mount.innerHTML = "";
    }
  };
})();
