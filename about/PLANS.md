# PLANS.md — Rebuild Halaman About `dkv.lexyth.my.id/about/` (Lusion 1:1)

**Branch:** `about/lusion-style` (worktree `/home/antigravity/lexyth-kun/dkv-lexyth-about-lusion`)
**Backup Tag:** `backup-about-before-lusion` (di commit `b70ac85` pada `main`)
**Cakupan Ketat:** 100% hanya folder `about/` (nol perubahan pada Beranda, `assets/index-D0mw0hQR.js`, atau halaman lain).
**Design Read (R-37):** Halaman About editorial-eksperimental untuk siswa XI DKV SMK Bina Bangsa dan pengunjung `dkv.lexyth.my.id/about/`, bergaya studio seniman WebGL dengan koreografi scroll pin/scrub dan perpindahan latar mendadak (`#000000` -> SNAP `#1D3CFF` -> SLIDE-UP `#FFFFFF` -> `#000000` next-page) setara `lusion.co/about` 1:1, dial `ENERGY 3 / RHYTHM 3 / MOTION 3`.

---

## Arsitektur File (100% di dalam `/about/`)

- `about/index.html` — Dokumen HTML semantik (`lang="id"`, landmarks, single `<h1>`, `fetchpriority="high"` pada logo preloader, zero blocking 3rd-party scripts).
- `about/content.json` — Satu sumber kebenaran seluruh teks, tautan nyata, peran, 8 keahlian, 3 materi pilihan, 6 pertemuan, 4 kartu area keahlian, footer, dan next-page.
- `about/src/styles.css` — Gaya responsif lengkap (desktop `1440px`, tablet `768px–1024px`, mobile `390px`), token warna keras (`#000000`, `#1D3CFF`, `#FFFFFF`), header color inversion, focus-visible WCAG AA, `prefers-reduced-motion`.
- `about/src/main.js` — Orkestrator utama: memuat `content.json`, merender DOM semantik, preloader `0->100`, Lenis (`lerp: 0.09`) + GSAP ScrollTrigger, header inversion, dropdown menu, ambient audio toggle, scroll-past-footer transition.
- `about/src/webgl-stage.js` — Satu shared Three.js WebGLRenderer (dengan Canvas 2D fallback & reduced-motion static fallback) untuk menjaga memori GPU efisien:
  - Hero 3D particle cloud + procedural 3D canyon & explorer silhouette zoom-out.
  - Team 3D point-cloud portrait dari `/about/assets/adrian-lusion-portrait.webp` dengan 4 morph pose/sudut kamera + vertical dotted rain & crosshair.
  - Keahlian 3D iridescent chrome faceted shard interaktif (drag/swipe/scroll).
  - CTA WebGL/Canvas particle arch (dots, `+`, segitiga).
- `about/src/ui-controllers.js` — Pure logic & state controllers yang diuji dengan Node test runner (`node:test`): validasi skema `content.json`, header theme state machine (`black` / `blue` / `white`), Team 4-role carousel state, Keahlian 8-skill swipe/index math, scroll-charge next-page state.
- `about/dist/about.bundle.js` & `about/dist/about.bundle.css` — Hasil bundle produksi ter-tree-shake (`esbuild`), target JS `< 300KB` gzipped.
- `about/tests/about.test.mjs` — Suite TDD (`node --test`): memverifikasi integritas `content.json` (nol em dash, nol placeholder, nol award palsu, semua URL valid), state machine header/theme/carousel/next-page, serta sanitasi HTML output.
- `about/screenshots/` — Bukti visual-regression desktop (`1440x900`) dan mobile (`390x844`) per milestone.
- `about/DECISIONS.md`, `about/README.md`, `about/anti-slop/audit-001-2026-11-26.md`.

---

## Rencana Kerja per Milestone (M1–M7)

### M1 — Foundation, TDD Harness, Preloader, Inverting Header, Menu Dropdown & Hero WebGL
- **Tugas:**
  1. Tulis `about/tests/about.test.mjs` lebih dulu (RED), lalu implementasikan `about/src/ui-controllers.js` hingga hijau (GREEN).
  2. Buat `about/build.mjs` dan verifikasi bundle size `< 300KB` gzipped.
  3. Implementasikan `about/index.html`, `about/src/styles.css`, Preloader (`0->100` + `/about/assets/logo.webp`, `< 1.4s`), Fixed Inverting Header (`LEXYTH`, tombol suara Web Audio, `HUBUNGI •`, `MENU ••`), Rounded Floating White Menu Dropdown (4 tautan nyata, Escape/backdrop close, focus management).
  4. Implementasikan Hero Pinned WebGL (`#000000`): particle cloud -> headline 1 kata demi kata -> 3D canyon & explorer zoom-out -> headline 2 dari kanan + `SCROLL TO EXPLORE`.
- **Verifikasi:** `npm test`, `npm run build`, Playwright screenshot desktop & mobile (`m1-hero-desktop.png`, `m1-menu-desktop.png`, `m1-hero-mobile.png`), cek zero console errors, commit ke `about/lusion-style`.

### M2 — Section Team (4 Peran Kak Adrian, 3D Point-Cloud Portrait Carousel)
- **Tugas:**
  1. Bangun point-cloud sampler dari `/about/assets/adrian-lusion-portrait.webp` menjadi ~18.000 partikel 3D putih/cyan dengan depth displacement & shoulder wisps.
  2. Implementasikan pinned 4-stop scroll choreography (`[[001]] Video & Audio Editor`, `[[002]] Graphic Designer`, `[[003]] AI Content Creator`, `[[004]] Web Designer`) + huruf geometris latar (`V`, `G`, `A`, `W`) + matrix dotted rain + crosshair + tombol panah biru sirkular + progress bar bawah + paragraf tetap kanan bawah.
  3. Keyboard ArrowLeft/ArrowRight & tombol klik untuk aksesibilitas dan mobile swipe.
- **Verifikasi:** Bandingkan berdampingan dengan referensi `Screenshot_2026-11-27_at_00.18.40.png`, tangkap `m2-team-desktop.png` & `m2-team-mobile.png`, commit.

### M3 — Stacked Statement, 3-Layer Marquee `"DKV"` & `KEAHLIAN 08` Pinned 3D Shard
- **Tugas:**
  1. Implementasikan statement kutipan Kak Adrian + 3-tier marquee `"DKV"` berlawanan arah (dengan tombol jeda gerak R-39).
  2. Implementasikan section `KEAHLIAN 08` pinned (`#000000`): giant outline `"KEAHLIAN"`, WebGL 3D iridescent chrome faceted shard, 8 kartu keahlian nyata DKV dengan sub-label (tanpa angka award palsu), dukungan drag/swipe/scroll/keyboard.
- **Verifikasi:** Tes interaksi drag/tombol & zero horizontal page overflow, tangkap `m3-keahlian-desktop.png` & `m3-keahlian-mobile.png`, commit.

### M4 — `MATERI PILIHAN 03` + `PERTEMUAN 06`
- **Tugas:**
  1. Giant outline typographic divider `"MULTIDISCIPLINARY / KREATIF"`.
  2. Grid `MATERI PILIHAN 03` dengan 3 thumbnail nyata teroptimasi (`materi-01..03.webp`) dan tautan aktif ke `/pav-pertemuan-1.html`, `/pav-pertemuan-3.html`, `/ae-pertemuan-4.html`.
  3. Daftar `PERTEMUAN 06` (semua 6 pertemuan PAV nyata) dengan efek scroll-exit strikethrough & peredupan teks saat baris melewati batas atas, sambil tetap mempertahankan klik/hover/focus kontras AA.
- **Verifikasi:** Klik semua tautan materi & pertemuan, tangkap `m4-materi-pertemuan-desktop.png` & `m4-materi-pertemuan-mobile.png`, commit.

### M5 — `AREA KEAHLIAN` (HARD SNAP `#000000` -> `#1D3CFF`) & CTA Particle Arch
- **Tugas:**
  1. Terapkan HARD SNAP instan latar `#000000` -> `#1D3CFF` (tanpa transisi fade pelan!) saat memasuki section `AREA KEAHLIAN`.
  2. Pinned 4 kartu 3D fanning -> aligning (`EDITING (E)`, `AUDIO & WARNA (A)`, `DESAIN (D)`, `AI & WEB (W)`) dengan pita putih 3D & dotted-leader capability list.
  3. Section CTA di latar `#1D3CFF` berlanjut: small caps `"SIAP NGULIK / BARENG DI KELAS?"`, reveal per huruf `"Ayo Mulai Berkarya!"`, WebGL/Canvas particle arch (dots, `+`, segitiga), tombol aksi ke `/materi-siswa`, dan pil `"LANJUT SCROLL"`.
- **Verifikasi:** Verifikasi snap warna keras, header kontras di atas biru, 4 kartu fanning/aligning, tangkap `m5-expertise-blue-desktop.png`, `m5-cta-blue-desktop.png`, `m5-blue-mobile.png`, commit.

### M6 — White Footer Slide-Up + Black Next-Page Bar + Auto-Navigation
- **Tugas:**
  1. Footer putih (`#FFFFFF`, teks `#09090B`) naik menutupi layar biru CTA dengan efek slide-up curtain; header otomatis membalik warna menjadi gelap (`#09090B`) saat Footer di atas.
  2. Isi Footer 100% data nyata codebase (`SMK Bina Bangsa • XI DKV`, `hello@lexyth.my.id`, Instagram/YouTube/GitHub `@lexyth`, navigasi nyata, tombol kembali ke atas).
  3. Bar hitam Next-Page di bawah Footer (`KARYA SISWA • HALAMAN BERIKUTNYA` -> `Galeri Karya Siswa` `/database-tugas`) dengan progress bar scroll-past-footer yang mengisi `0->100%` dan memicu layar transisi hitam + logo sebelum navigasi (juga aktif lewat klik/Enter).
- **Verifikasi:** Uji header inversion, klik semua tautan footer, uji scroll-past-footer & klik next-page, tangkap `m6-footer-white-desktop.png`, `m6-nextpage-desktop.png`, `m6-footer-mobile.png`, commit.

### M7 — Polish, Responsiveness 390px, WCAG AA Contrast, Reduced Motion, Audit Anti-Slop (Mode AFTER), Paket ZIP & PR
- **Tugas:**
  1. Jalankan script cek kontras WCAG AA (`contrast-check.py` / formula resmi) pada seluruh pasangan warna (hitam, biru `#1D3CFF`, putih).
  2. Uji keyboard-only (Tab, Shift+Tab, Enter, Space, Escape, ArrowLeft/Right), 200% zoom, `prefers-reduced-motion: reduce`, dan mobile `390x844` + tablet `820x1180` + desktop `1440x900`.
  3. Uji klik setiap elemen interaktif dan catat bukti click-through (R-35).
  4. Jalankan pengukuran performa nyata (Chrome/Lighthouse atau ukur bundle gzip, FCP/LCP/CLS dari browser real — jujur jika metrik tertentu tidak diukur, R-40).
  5. Jalankan Mode AFTER antislop -> tulis `about/anti-slop/audit-001-2026-11-26.md` + lengkapi `about/README.md` & `about/DECISIONS.md`.
  6. Bandingkan screenshot berdampingan dengan tangkapan live `lusion.co/about/`.
  7. Kemas ZIP versi (`dkv-about-lusion-v1.zip`) ke direktori artefak, push branch `about/lusion-style` + tag `backup-about-before-lusion`, buat Pull Request ke `main` (TIDAK merge tanpa persetujuan Charles).
