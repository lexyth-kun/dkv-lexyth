# Halaman About `dkv.lexyth.my.id/about/` (Lusion 1:1 Rebuild)

Rebuild penuh halaman About untuk portal pembelajaran XI DKV SMK Bina Bangsa (`dkv.lexyth.my.id/about/`) mengikuti koreografi scroll, mekanisme pin/scrub, WebGL 3D, dan perpindahan latar keras (`#000000` -> SNAP `#1D3CFF` -> SLIDE-UP `#FFFFFF` -> `#000000` Next-Page) setara `lusion.co/about` 1:1 dengan 100% kode dan aset orisinal DKV.

## Informasi Agen & Lingkungan Build
- **Agen / Lingkungan:** Antigravity (Google DeepMind coding agent) pada VM Linux Ubuntu 24.04 (Node.js v22.23.5, Chrome headless + Playwright Python).
- **Catatan Model (Bagian 0.A):** Dikerjakan pada sesi aktif Antigravity yang disediakan lingkungan runtime (model tidak diganti ke tier lebih rendah).
- **Cakupan Ketat:** 100% perubahan berada di dalam folder `about/`. Nol file di luar `about/` diubah (`index.html`, Beranda, Materi, dan project `amc.web.id` tidak disentuh).
- **Backup & Branch Git:** Tag backup `backup-about-before-lusion` dibuat dari `main` (`b70ac85`) sebelum perubahan; seluruh pekerjaan dilakukan di worktree/branch terpisah `about/lusion-style` dengan Pull Request ke `main` (tidak di-merge otomatis).

## Struktur Folder `about/`
- `about/index.html`: Dokumen semantik utama (`lang="id"`, single `<h1>`, landmarks, `fetchpriority="high"` pada logo preloader).
- `about/content.json`: Satu sumber kebenaran seluruh teks, 4 peran Kak Adrian, 8 keahlian DKV, 3 materi pilihan, 6 pertemuan, 4 pilar area keahlian, footer resmi, dan next-page.
- `about/src/main.js`: Orkestrator Preloader `000->100`, Lenis (`lerp: 0.09`), GSAP ScrollTrigger, Header Inversion, Menu Dropdown, Web Audio toggle, dan Auto-Navigasi Next-Page.
- `about/src/webgl-stage.js`: Shared Three.js WebGLRenderer (dengan Canvas 2D fallback & reduced-motion static fallback) + Hero particle cloud & 3D obsidian canyon explorer.
- `about/src/scene-team.js`: 3D point-cloud portrait sampler dari `about/assets/adrian-lusion-portrait.webp` dengan 4 pose/sudut peran Kak Adrian, shoulder wisps, huruf latar 3D (`V`, `G`, `A`, `W`), dan dotted matrix rain.
- `about/src/scene-keahlian.js`: 3D iridescent chrome faceted shard dengan custom GLSL thin-film Fresnel shader.
- `about/src/scene-blue.js`: 3D white satin ribbon (Area Keahlian) dan 3D geometric particle arch (dots, `+`, segitiga) untuk CTA.
- `about/src/ui-controllers.js`: Pure state machines, validasi skema `content.json`, dan kalkulator kontras WCAG AA.
- `about/dist/about.bundle.js` & `about/dist/about.bundle.css`: Bundle produksi siap deploy Cloudflare Pages (`pages_build_output_dir = "./"`).
- `about/tests/about.test.mjs`: Suite unit test TDD (`node --test`).
- `about/PLANS.md`, `about/DECISIONS.md`, `about/anti-slop/audit-001-2026-11-26.md`, `about/screenshots/`.

## Perintah Build & Pengujian
Jalankan dari dalam folder `about/`:
```bash
npm install
npm test
npm run build
```

## Metrik Terukur (Pengukuran Lokal Nyata)
- **Unit Test (`npm test`):** 8/8 PASS (`0` fail).
- **Ukuran Bundle Produksi:**
  - `about/dist/about.bundle.js`: `852.37 KB` raw | **`236.71 KB` gzip** (di bawah batas `300 KB` gzip).
  - `about/dist/about.bundle.css`: `33.05 KB` raw | **`6.73 KB` gzip**.
- **Pengukuran Chrome Headless Lokal (`1440x900`):**
  - `DOMContentLoaded`: `251 ms`
  - `Load`: `261 ms`
  - `FCP`: `964 ms`
  - `LCP`: `964 ms`
  - `CLS`: `0`
  - Console errors: `0`, HTTP >= 400 requests: `0`
- **Skor Lighthouse Mobile:** Tidak diukur (`lighthouse` CLI tidak terpasang di VM; tidak mengarang angka sesuai R-40).
- **Kontras WCAG AA (terhitung lewat formula resmi):**
  - `#FFFFFF` di `#000000`: `21.00:1` (PASS)
  - `#B5B8C4` di `#000000`: `10.62:1` (PASS)
  - `#FFFFFF` di `#1D3CFF`: `6.68:1` (PASS)
  - `#09090B` di `#FFFFFF`: `19.90:1` (PASS)
  - `#4A4D57` di `#FFFFFF`: `8.43:1` (PASS)
- **Responsif & Target Sentuh (`390x844`, `820x1180`, `1440x900`, Zoom 200%):** Nol overflow horizontal (`overflow: false`), nol target sentuh `< 44px` (`smallTargetsCount: 0`).
