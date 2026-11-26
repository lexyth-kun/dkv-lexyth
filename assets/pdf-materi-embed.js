(function () {
  var body = document.body;
  if (!body) return;

  var rawPdfUrl = body.getAttribute('data-pdf-url') || '';
  var pdfMode = body.getAttribute('data-pdf-mode') || 'auto'; // 'always' | 'auto'
  var pdfTitle = body.getAttribute('data-pdf-title') || document.title || 'Modul PDF Materi';
  if (!rawPdfUrl) return;

  var encodedPdfUrl = encodeURI(rawPdfUrl);
  var urlParams = new URLSearchParams(window.location.search || '');
  var preferSlides = urlParams.get('view') === 'slides' || window.location.hash === '#slides';

  var styleEl = document.createElement('style');
  styleEl.textContent = [
    'html.pdf-primary-view .slide,',
    'html.pdf-primary-view .ag-slide-bar { display: none !important; }',
    'html.pdf-primary-view body { padding: 76px 16px 32px !important; gap: 0 !important; }',
    '.pdf-viewer-shell {',
    '  display: none;',
    '  width: 100%;',
    '  max-width: 1280px;',
    '  margin: 0 auto;',
    '  background: rgba(15, 23, 42, 0.92);',
    '  border: 1px solid rgba(56, 189, 248, 0.28);',
    '  border-radius: 18px;',
    '  overflow: hidden;',
    '  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);',
    '}',
    'html.pdf-primary-view .pdf-viewer-shell { display: flex; flex-direction: column; }',
    '.pdf-viewer-toolbar {',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: space-between;',
    '  flex-wrap: wrap;',
    '  gap: 10px;',
    '  padding: 12px 18px;',
    '  background: rgba(15, 23, 42, 0.98);',
    '  border-bottom: 1px solid rgba(148, 163, 184, 0.2);',
    '  color: #F8FAFC;',
    '}',
    '.pdf-viewer-info { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }',
    '.pdf-viewer-badge {',
    '  font-family: "JetBrains Mono", monospace;',
    '  font-size: 11px;',
    '  font-weight: 700;',
    '  padding: 4px 10px;',
    '  border-radius: 999px;',
    '  background: rgba(2, 132, 199, 0.25);',
    '  border: 1px solid rgba(56, 189, 248, 0.45);',
    '  color: #7DD3FC;',
    '}',
    '.pdf-viewer-name { font-size: 14px; font-weight: 700; color: #F8FAFC; }',
    '.pdf-viewer-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }',
    '.pdf-tool-btn {',
    '  appearance: none;',
    '  border: 1px solid rgba(148, 163, 184, 0.35);',
    '  background: rgba(30, 41, 59, 0.9);',
    '  color: #E2E8F0;',
    '  font-size: 12.5px;',
    '  font-weight: 700;',
    '  padding: 7px 14px;',
    '  border-radius: 10px;',
    '  cursor: pointer;',
    '  text-decoration: none;',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 6px;',
    '  transition: all 0.16s ease;',
    '}',
    '.pdf-tool-btn:hover { border-color: #38BDF8; color: #FFFFFF; background: rgba(2, 132, 199, 0.35); }',
    '.pdf-tool-btn.primary { background: linear-gradient(135deg, #0284C7, #2563EB); border-color: #38BDF8; color: #FFFFFF; }',
    '.pdf-frame-wrap { width: 100%; height: calc(100vh - 165px); min-height: 540px; background: #1E293B; }',
    '.pdf-frame-wrap iframe { width: 100%; height: 100%; border: 0; display: block; background: #FFFFFF; }',
    '.pdf-mobile-hint {',
    '  display: none;',
    '  padding: 8px 14px;',
    '  font-size: 12px;',
    '  color: #CBD5E1;',
    '  background: rgba(2, 132, 199, 0.12);',
    '  border-top: 1px solid rgba(56, 189, 248, 0.2);',
    '  text-align: center;',
    '}',
    '@media (max-width: 768px) {',
    '  .pdf-frame-wrap { height: 72vh; min-height: 420px; }',
    '  .pdf-mobile-hint { display: block; }',
    '}'
  ].join('\n');
  document.head.appendChild(styleEl);

  var navBar = document.querySelector('.floating-nav-bar');
  var navToggleBtn = null;
  var viewerShell = null;
  var pdfReady = false;

  function ensureNavButtons() {
    if (!navBar) return;
    if (!navBar.querySelector('a[href*="/downloads/"], [data-pdf-direct-link]')) {
      var directLink = document.createElement('a');
      directLink.href = encodedPdfUrl;
      directLink.target = '_blank';
      directLink.rel = 'noopener noreferrer';
      directLink.className = 'nav-link-btn';
      directLink.setAttribute('data-pdf-direct-link', '1');
      directLink.style.cssText = 'background:rgba(2,132,199,0.28);padding:4px 12px;border-radius:999px;border:1px solid rgba(56,189,248,0.4);';
      directLink.textContent = '📄 PDF Materi';
      var pill = navBar.querySelector('.slide-counter-pill');
      if (pill) navBar.insertBefore(directLink, pill);
      else navBar.appendChild(directLink);
    }
    if (!navToggleBtn) {
      navToggleBtn = document.createElement('button');
      navToggleBtn.type = 'button';
      navToggleBtn.className = 'nav-link-btn';
      navToggleBtn.style.cssText = 'background:rgba(15,23,42,0.75);padding:4px 12px;border-radius:999px;border:1px solid rgba(148,163,184,0.4);cursor:pointer;';
      navToggleBtn.addEventListener('click', function () {
        setPdfActive(!document.documentElement.classList.contains('pdf-primary-view'));
      });
      var pill2 = navBar.querySelector('.slide-counter-pill');
      if (pill2) navBar.insertBefore(navToggleBtn, pill2);
      else navBar.appendChild(navToggleBtn);
    }
  }

  function buildViewerShell() {
    if (viewerShell) return viewerShell;
    viewerShell = document.createElement('section');
    viewerShell.className = 'pdf-viewer-shell';
    viewerShell.id = 'pdfViewerShell';

    var fileName = rawPdfUrl.split('/').pop() || 'Materi.pdf';
    viewerShell.innerHTML =
      '<div class="pdf-viewer-toolbar">' +
      '  <div class="pdf-viewer-info">' +
      '    <span class="pdf-viewer-badge">MODUL PDF</span>' +
      '    <span class="pdf-viewer-name"></span>' +
      '  </div>' +
      '  <div class="pdf-viewer-actions">' +
      '    <button type="button" class="pdf-tool-btn" data-action="toggle-slides">🖥️ Lihat Slide Ringkas HTML</button>' +
      '    <a class="pdf-tool-btn primary" target="_blank" rel="noopener noreferrer" href="' + encodedPdfUrl + '">↗️ Buka Penuh / Unduh PDF</a>' +
      '  </div>' +
      '</div>' +
      '<div class="pdf-frame-wrap">' +
      '  <iframe title="' + pdfTitle.replace(/"/g, '&quot;') + '" src="' + encodedPdfUrl + '#view=FitH"></iframe>' +
      '</div>' +
      '<div class="pdf-mobile-hint">Jika di layar HP hanya muncul halaman pertama atau pratinjau tertutup, tekan tombol <strong>Buka Penuh / Unduh PDF</strong> di atas.</div>';

    viewerShell.querySelector('.pdf-viewer-name').textContent = fileName;
    viewerShell.querySelector('[data-action="toggle-slides"]').addEventListener('click', function () {
      setPdfActive(false);
    });

    if (navBar && navBar.parentNode) {
      navBar.parentNode.insertBefore(viewerShell, navBar.nextSibling);
    } else {
      body.insertBefore(viewerShell, body.firstChild);
    }
    return viewerShell;
  }

  function updateToggleLabel() {
    var active = document.documentElement.classList.contains('pdf-primary-view');
    if (navToggleBtn) {
      navToggleBtn.textContent = active ? '🖥️ Lihat Slide HTML' : '📄 Tampilkan PDF';
    }
  }

  function setPdfActive(active) {
    if (!pdfReady) return;
    if (active) {
      buildViewerShell();
      document.documentElement.classList.add('pdf-primary-view');
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      document.documentElement.classList.remove('pdf-primary-view');
    }
    updateToggleLabel();
  }

  function activatePdfSupport(showNow) {
    pdfReady = true;
    ensureNavButtons();
    if (showNow) {
      setPdfActive(true);
    } else {
      updateToggleLabel();
    }
  }

  function checkPdfAvailable(url, cb) {
    fetch(url, { method: 'HEAD', cache: 'no-cache' })
      .then(function (res) {
        var ct = (res.headers.get('content-type') || '').toLowerCase();
        if (res.ok && ct.indexOf('pdf') !== -1) {
          cb(true);
          return;
        }
        if (res.status === 405 || (res.ok && !ct)) {
          return fetch(url, { method: 'GET', headers: { Range: 'bytes=0-4' }, cache: 'no-cache' })
            .then(function (r2) {
              var ct2 = (r2.headers.get('content-type') || '').toLowerCase();
              if (!r2.ok) { cb(false); return; }
              if (ct2.indexOf('pdf') !== -1) { cb(true); return; }
              return r2.text().then(function (txt) { cb(txt.indexOf('%PDF') === 0); });
            });
        }
        cb(false);
      })
      .catch(function () {
        cb(false);
      });
  }

  if (pdfMode === 'always') {
    activatePdfSupport(!preferSlides);
  } else {
    checkPdfAvailable(encodedPdfUrl, function (exists) {
      if (exists) {
        activatePdfSupport(!preferSlides);
      }
    });
  }
})();
