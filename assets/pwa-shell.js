/* ============================================================================
 * BINA BANGSA NEXUS — PWA LIFECYCLE, ANTI-ZOOM GUARD & MOBILE APP PAGE SHELL
 * ============================================================================ */
(function (global) {
  "use strict";

  const INSTALL_DISMISS_KEY = "BB_NEXUS_PWA_INSTALL_DISMISSED_AT";
  let deferredPrompt = null;
  let pillTimer = null;

  function isStandaloneMode() {
    return (
      (global.matchMedia && global.matchMedia("(display-mode: standalone)").matches) ||
      Boolean(global.navigator && global.navigator.standalone)
    );
  }

  function isIosDevice() {
    const ua = (global.navigator && global.navigator.userAgent) || "";
    return /iphone|ipad|ipod/i.test(ua);
  }

  function isMobileAppViewport() {
    if (!global.matchMedia) return false;
    return global.matchMedia("(max-width: 1023px), (max-width: 1080px) and (orientation: portrait)").matches;
  }

  function vibrateTap(ms) {
    try {
      if (global.navigator && typeof global.navigator.vibrate === "function") {
        global.navigator.vibrate(ms || 10);
      }
    } catch (e) {}
  }

  function showNetworkPill(text, autoHideMs) {
    let pill = document.getElementById("pwaNetworkPill");
    if (!pill && document.body) {
      pill = document.createElement("div");
      pill.id = "pwaNetworkPill";
      pill.className = "pwa-network-pill";
      document.body.appendChild(pill);
    }
    if (!pill) return;
    pill.textContent = text;
    pill.classList.add("show");
    if (pillTimer) clearTimeout(pillTimer);
    if (autoHideMs > 0) {
      pillTimer = setTimeout(() => pill.classList.remove("show"), autoHideMs);
    }
  }

  function updateOnlineState(showBanner) {
    const online = global.navigator ? global.navigator.onLine : true;
    if (document.body) {
      document.body.classList.toggle("is-offline", !online);
    }
    const labelEl = document.getElementById("mobNetStatusLabel");
    if (labelEl) {
      labelEl.textContent = online ? "SMK Bina Bangsa" : "Offline (Data Lokal)";
    }
    if (showBanner) {
      showNetworkPill(
        online ? "Koneksi internet tersambung kembali" : "Sedang offline — data tersimpan di perangkat",
        online ? 2400 : 4200
      );
    }
  }

  function shouldShowInstallBanner() {
    if (isStandaloneMode()) return false;
    if (!isMobileAppViewport()) return false;
    const p = (global.location && global.location.pathname) || "/";
    const isMainPortal = p === "/" || p === "/index.html" || p.startsWith("/dashboard");
    if (!isMainPortal) return false;
    try {
      const dismissedAt = parseInt(localStorage.getItem(INSTALL_DISMISS_KEY) || "0", 10);
      if (dismissedAt && Date.now() - dismissedAt < 3 * 24 * 60 * 60 * 1000) {
        return false;
      }
    } catch (e) {}
    return Boolean(deferredPrompt) || isIosDevice();
  }

  function openIosInstallSheet() {
    let sheet = document.getElementById("pwaIosInstallSheet");
    if (!sheet && document.body) {
      sheet = document.createElement("div");
      sheet.id = "pwaIosInstallSheet";
      sheet.className = "pwa-ios-sheet";
      sheet.innerHTML = `
        <div class="pwa-ios-sheet-card" role="dialog" aria-modal="true" aria-label="Pasang Aplikasi ke Layar Utama">
          <div style="width:40px;height:4px;border-radius:999px;background:#cbd5e1;margin:0 auto 14px;"></div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
            <img src="/icons/icon-192.png?v=bb2" alt="Portal DKV" width="36" height="36" style="width:36px;height:36px;max-width:36px;max-height:36px;border-radius:10px;border:1px solid #e2e8f0;padding:3px;object-fit:contain;">
            <div>
              <strong style="font-size:0.92rem;color:#0a0f1d;display:block;">Pasang Portal Kelas di iPhone/iPad</strong>
              <span style="font-size:0.74rem;color:#64748b;">Akses layar penuh seperti aplikasi tanpa bar browser</span>
            </div>
          </div>
          <ol style="margin:12px 0 16px 18px;font-size:0.8rem;color:#334155;line-height:1.65;">
            <li>Ketuk tombol <strong>Bagikan (Share)</strong> di bar bawah Safari.</li>
            <li>Gulir ke bawah lalu pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.</li>
            <li>Ketuk <strong>Tambah</strong> — ikon <strong>Portal DKV</strong> langsung muncul di Home Screen.</li>
          </ol>
          <button type="button" id="pwaIosSheetClose" style="width:100%;border:none;border-radius:999px;padding:12px;background:#0a0f1d;color:#ffffff;font-weight:700;font-size:0.8rem;cursor:pointer;">Mengerti</button>
        </div>
      `;
      document.body.appendChild(sheet);
      sheet.addEventListener("click", (e) => {
        if (e.target === sheet) sheet.classList.remove("open");
      });
      sheet.querySelector("#pwaIosSheetClose").addEventListener("click", () => {
        sheet.classList.remove("open");
      });
    }
    if (sheet) sheet.classList.add("open");
  }

  async function triggerInstall() {
    vibrateTap(12);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const res = await deferredPrompt.userChoice;
        if (res && res.outcome === "accepted") {
          hideInstallBanner(false);
          const btn = document.getElementById("mobPwaInstallBtn");
          if (btn) btn.style.display = "none";
        }
      } catch (e) {}
      deferredPrompt = null;
      return;
    }
    if (isIosDevice()) {
      openIosInstallSheet();
    }
  }

  function hideInstallBanner(persistDismiss) {
    const b = document.getElementById("pwaInstallBanner");
    if (b) b.classList.remove("visible");
    if (persistDismiss) {
      try { localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now())); } catch (e) {}
    }
  }

  function renderInstallBanner() {
    const installBtn = document.getElementById("mobPwaInstallBtn");
    if (installBtn) {
      installBtn.style.display = (!isStandaloneMode() && (deferredPrompt || isIosDevice())) ? "inline-flex" : "none";
    }
    if (!shouldShowInstallBanner() || !document.body) return;
    let banner = document.getElementById("pwaInstallBanner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "pwaInstallBanner";
      banner.className = "pwa-install-banner";
      banner.innerHTML = `
        <img src="/icons/icon-192.png?v=bb2" alt="Portal DKV" class="pwa-install-icon" width="36" height="36" style="width:36px;height:36px;max-width:36px;max-height:36px;object-fit:contain;">
        <div style="flex:1;min-width:0;">
          <div style="font-weight:800;font-size:0.78rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Pasang Aplikasi Portal DKV</div>
          <div style="font-size:0.68rem;color:rgba(255,255,255,0.74);">Akses cepat materi, presensi, dan tugas</div>
        </div>
        <button type="button" class="pwa-install-cta" id="pwaInstallNowBtn">Pasang</button>
        <button type="button" class="pwa-install-close" id="pwaInstallDismissBtn" aria-label="Tutup">&times;</button>
      `;
      document.body.appendChild(banner);
      banner.querySelector("#pwaInstallNowBtn").addEventListener("click", triggerInstall);
      banner.querySelector("#pwaInstallDismissBtn").addEventListener("click", () => hideInstallBanner(true));
    }
    const raf = global.requestAnimationFrame || ((fn) => setTimeout(fn, 16));
    raf(() => banner.classList.add("visible"));
  }

  function installZoomLockGuards() {
    // Prevent accidental pinch-to-zoom / zoom-out on locked mobile app pages
    const preventZoomEvent = (e) => {
      if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
      }
    };
    global.addEventListener("gesturestart", preventZoomEvent, { passive: false });
    global.addEventListener("gesturechange", preventZoomEvent, { passive: false });
    global.addEventListener("gestureend", preventZoomEvent, { passive: false });
    document.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  function registerServiceWorker() {
    if (!global.navigator || !("serviceWorker" in global.navigator)) return;
    global.addEventListener("load", () => {
      global.navigator.serviceWorker.register("/sw.js", { scope: "/" })
        .then((reg) => {
          if (reg && typeof reg.update === "function") reg.update();
        })
        .catch(() => {});
    });
  }

  function getTabFromUrl() {
    try {
      const url = new URL(global.location.href);
      const qTab = url.searchParams.get("tab");
      if (qTab) return qTab.toLowerCase();
      const h = (global.location.hash || "").replace(/^#\/?(?:tab-)?/, "");
      return h ? h.toLowerCase() : "";
    } catch (e) {
      return "";
    }
  }

  function pushTabHistory(tabName) {
    try {
      const targetHash = `#/tab-${tabName}`;
      if (global.location && global.location.hash !== targetHash && global.history && global.history.pushState) {
        global.history.pushState({ pwaTab: tabName }, "", targetHash);
      }
    } catch (e) {}
  }

  function initPwaShell() {
    registerServiceWorker();
    installZoomLockGuards();
    updateOnlineState(false);
    global.addEventListener("online", () => updateOnlineState(true));
    global.addEventListener("offline", () => updateOnlineState(true));

    global.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      renderInstallBanner();
    });

    global.addEventListener("appinstalled", () => {
      deferredPrompt = null;
      hideInstallBanner(false);
      const installBtn = document.getElementById("mobPwaInstallBtn");
      if (installBtn) installBtn.style.display = "none";
      showNetworkPill("Aplikasi berhasil dipasang", 3000);
    });

    if (isIosDevice() && !isStandaloneMode()) {
      setTimeout(renderInstallBanner, 2200);
    }
  }

  global.BinaBangsaPWA = {
    isStandaloneMode,
    isIosDevice,
    isMobileAppViewport,
    vibrateTap,
    triggerInstall,
    getTabFromUrl,
    pushTabHistory,
    initPwaShell
  };

  initPwaShell();
})(window);
