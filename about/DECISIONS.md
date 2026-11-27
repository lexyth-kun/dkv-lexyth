# DECISIONS.md: Catatan Keputusan Desain & Teknis (`/about/`)

## 1. Design Read & Arah Visual (R-37)
- **Design Read:** Halaman About editorial-eksperimental untuk siswa XI DKV SMK Bina Bangsa dan pengunjung `dkv.lexyth.my.id/about/`, dengan bahasa visual studio kreatif avant-garde meniru koreografi dan arsitektur `lusion.co/about` 1:1, dial `ENERGY 3 / RHYTHM 3 / MOTION 3`.
- **Peta Warna Keras (Inti Art Direction, Bukan Bug):**
  - `#000000` (Preloader, Hero, Team/Peran, Marquee DKV, Keahlian 08, Materi Pilihan 03, Pertemuan 06, Next-Page Teaser Bar)
  - **HARD SNAP (tanpa fade pelan)** -> `#1D3CFF` Electric Blue (Area Keahlian 4 kartu 3D + CTA Particle Arch)
  - **SLIDE-UP CURTAIN** -> `#FFFFFF` Putih dengan tinta `#09090B` (Footer resmi DKV)
  - Kontras terhitung: `#FFFFFF` di atas `#000000` = 21.0:1; `#FFFFFF` di atas `#1D3CFF` = 6.22:1 (lolos WCAG AA normal & besar); `#09090B` di atas `#FFFFFF` = 19.9:1.

## 2. Keputusan dari Konfirmasi Charles (A1–A5)
1. **Mode Antislop (`AFTER`):** Aturan anti-slop dari Prompt B.4 tetap dipatuhi selama build, lalu audit bernomor Mode AFTER ditulis di `about/anti-slop/audit-001-2026-11-26.md` beserta laporan Delivery Gate sebelum penyerahan.
2. **Isolasi Halaman & Handoff Rute Beranda -> `/about/`:** Seluruh kode visual, aset, bundle, pengujian, dan dokumentasi halaman About tetap terisolasi di dalam folder `/about/`. Atas laporan pengguna bahwa klik `ABOUT` dari Beranda masih menampilkan tampilan lama karena SPA router di `assets/index-D0mw0hQR.js` mencegat `navigateTo("about")` dan Service Worker `sw.js` menyimpan cache lama (`v34`), ditambahkan 1 baris handoff `window.location.href="/about/"` pada `navigateTo("about")` (tanpa mengubah tampilan Beranda sama sekali) plus pembaruan versi `sw.js` ke `bb-nexus-pwa-v35` (Network-First untuk `/about/dist/*` & `/about/content.json`).
3. **Menu Dropdown & Bar Hitam Next-Page:**
   - Karena codebase DKV tidak memiliki backend newsletter maupun halaman LABS, Menu Dropdown hanya menampilkan 4 tautan nyata (`BERANDA /`, `TENTANG /about/`, `MATERI /materi-siswa`, `KUMPUL TUGAS /kumpul-tugas`) tanpa form palsu dan tanpa kartu ketiga fiktif.
   - Bar Hitam Next-Page di bawah Footer diarahkan ke `/#silabus` (`Silabus XI DKV`) sesuai permintaan terbaru pengguna.
4. **Siluet Hologram Anonim 3D Team (Tanpa Wajah):** Atas permintaan terbaru pengguna, foto wajah pribadi dihapus dari folder `/about/` dan diganti dengan **siluet hologram anonim 3D prosedural tanpa wajah** (hooded silhouette dengan rongga wajah kosong gelap, garis rim hologram cyan-putih, scanline menyapu, dan energy wisps) dengan 4 variasi sudut kamera untuk 4 peran Kak Adrian (`Video & Audio Editor`, `Graphic Designer`, `AI Content Creator`, `Web Designer`).
5. **Konflik Em Dash (R-02) & Kontak Footer:**
   - Em dash (`:`) pada dua teks contoh di prompt diganti koma/titik tengah (`•`) agar patuh R-02.
   - Footer memakai kontak nyata dari codebase (`SMK Bina Bangsa • XI DKV`, `hello@lexyth.my.id`, Instagram/YouTube/GitHub `@lexyth`) tanpa mengarang alamat jalan fisik maupun nomor telepon.

## 3. Alasan Keputusan Visual & Teknis (R-31)
- **Tipografi:** Menggunakan `Inter` lokal yang sudah tersedia di `/assets/fonts/Inter-Variable.ttf` (plus `Inter-400.woff2`, `Inter-700.woff2`) dipadukan dengan `Syne` / `Space Grotesk` display fallback geometris atau geometric display tracking ketat berbasis Inter 700/800/900 lokal + `JetBrains Mono` / monospace sistem untuk indeks `[[ 001 ]]`, `08`, `03`, `06`. Alasan: memakai font lokal yang sudah ada di codebase menghindari render-blocking pihak ketiga (R-40) dan menjaga konsistensi lintas portal DKV.
- **Satu Shared WebGL Canvas:** Menggunakan satu instance `THREE.WebGLRenderer` (dengan fallback Canvas 2D dan mode statis untuk `prefers-reduced-motion`) yang mengganti scene aktif sesuai posisi scroll. Alasan: mencegah limit WebGL context browser (maks 8–16 konteks) dan menjaga konsumsi memori serta FPS tetap stabil di mobile 390px.
- **Bundling Tree-Shaken (`esbuild`):** Menyatukan `three`, `gsap`, `ScrollTrigger`, `lenis`, dan modul lokal ke `about/dist/about.bundle.js` agar halaman `/about/` mandiri di Cloudflare Pages (`pages_build_output_dir = "./"`), nol ketergantungan CDN saat runtime, dan menjaga payload JS `< 300KB` gzipped.
- **Optimasi Aset Media:** `images/logo.png` asli berukuran 935 KB dioptimalkan menjadi `about/assets/logo.webp` (24.7 KB, 256×256) dan 3 thumbnail materi (`cover-pr-1/3/4.png`, ~400 KB/file) dioptimalkan ke WebP ~35–55 KB agar LCP dan pemuatan preloader cepat (< 1.4 detik).
- **Aksesibilitas & Kontrol Gerak (R-32, R-39):** Semua section pinned tetap bisa dioperasikan lewat klik tombol dan keyboard (`ArrowLeft`/`ArrowRight`, `Tab`, `Enter`, `Escape`); animasi marquee dan WebGL mematuhi `prefers-reduced-motion: reduce` dan menyediakan tombol jeda gerak eksplisit.
