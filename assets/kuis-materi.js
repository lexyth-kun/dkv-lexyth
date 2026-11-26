/* ============================================================================
 * BINA BANGSA NEXUS — KUIS SINGKAT PER MATERI (12 PERTEMUAN PAV & AE)
 * 3 Pilihan Ganda + 2 Essay Singkat per pertemuan, lengkap dengan kunci jawaban
 * & pembahasan langsung setelah siswa mengirim jawaban.
 * ============================================================================ */
(function (global) {
  "use strict";

  const PROFILE_KEY = "BB_QUIZ_STUDENT_PROFILE_V1";
  const RESULTS_KEY = "BB_QUIZ_RESULTS_V1";
  const STYLE_ID = "bb-kuis-materi-style";

  const QUIZ_BANK = {
    "pr-01": {
      id: "pr-01",
      subject: "Premiere Pro • Minggu 01",
      title: "Pra-Produksi Iklan Produk TVC & Storyboard",
      mcq: [
        {
          id: "q1",
          question: "Urutan langkah pra-produksi iklan produk yang tepat sebelum mulai syuting adalah...",
          options: [
            "Render video -> Color grading -> Membuat storyboard",
            "Menentukan ide & masalah harian -> Menyusun Naskah 2 Kolom -> Membuat Storyboard 9 Frame",
            "Menambahkan musik latar -> Merekam Voice Over -> Memilih produk",
            "Menghapus Green Screen -> Memotong klip -> Menulis naskah"
          ],
          answer: 1,
          explanation: "Pra-produksi selalu dimulai dari ide/masalah produk, dituangkan ke Naskah 2 Kolom (Visual & Audio), lalu divisualkan ke dalam Storyboard 9 Frame sebelum syuting."
        },
        {
          id: "q2",
          question: "Pada format Naskah 2 Kolom untuk iklan produk/ILM, pembagian isi kolom kiri dan kanan adalah...",
          options: [
            "Kolom kiri untuk daftar alat kamera, kolom kanan untuk jadwal syuting",
            "Kolom kiri untuk anggaran biaya, kolom kanan untuk nama pemeran",
            "Kolom kiri untuk detail visual & ukuran shot, kolom kanan untuk teks Voice Over / audio",
            "Kolom kiri untuk nama software, kolom kanan untuk resolusi ekspor"
          ],
          answer: 2,
          explanation: "Naskah 2 Kolom memisahkan keterangan gambar/adegan (Visual) di kiri dan narasi/dialog/SFX (Audio) di kanan agar sinkron saat produksi."
        },
        {
          id: "q3",
          question: "Ukuran shot yang paling tepat untuk menonjolkan detail tekstur, embun, atau kemasan produk secara sangat dekat adalah...",
          options: [
            "WS (Wide Shot)",
            "MS (Medium Shot)",
            "ECU (Extreme Close Up)",
            "ELS (Extreme Long Shot)"
          ],
          answer: 2,
          explanation: "Extreme Close Up (ECU) memfokuskan kamera sangat dekat pada detail kecil produk sehingga terlihat tajam dan menggugah."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Jelaskan secara singkat perbedaan fungsi antara Wide Shot (WS) dan Close Up / Extreme Close Up (CU/ECU) pada Storyboard iklan produk!",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["lokasi", "suasana", "keseluruhan", "detail", "produk", "dekat", "ekspresi", "fokus"],
          sampleAnswer: "Wide Shot (WS) berfungsi memperlihatkan lokasi dan suasana keseluruhan adegan, sedangkan Close Up / Extreme Close Up (CU/ECU) berfungsi memfokuskan perhatian penonton pada ekspresi atau detail produk secara dekat."
        },
        {
          id: "e2",
          question: "Mengapa pembuatan Storyboard (9 Frame) penting dilakukan sebelum memulai syuting?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["panduan", "visual", "urutan", "adegan", "shot", "terarah", "hemat", "waktu", "terlewat"],
          sampleAnswer: "Storyboard menjadi panduan visual urutan adegan, ukuran shot, dan alur cerita sehingga proses syuting lebih terarah, hemat waktu, dan tidak ada adegan penting yang terlewat."
        }
      ]
    },

    "pr-02": {
      id: "pr-02",
      subject: "Premiere Pro • Minggu 02",
      title: "Foldering & Rough Cut Cepat (Q & W)",
      mcq: [
        {
          id: "q1",
          question: "Tujuan utama menyiapkan 5 folder proyek (seperti 01_Footage, 02_Audio, dst.) sebelum mulai mengedit di Premiere Pro adalah...",
          options: [
            "Mempercepat kecepatan internet saat upload",
            "Mencegah error 'Media Offline' dan menjaga seluruh file proyek rapi terstruktur",
            "Mengubah warna video secara otomatis",
            "Menambah durasi video menjadi lebih panjang"
          ],
          answer: 1,
          explanation: "Menyatukan semua bahan dalam 5 folder terstruktur di satu folder induk mencegah file terpencar yang sering memicu error 'Media Offline'."
        },
        {
          id: "q2",
          question: "Tombol shortcut di Source Monitor untuk menandai titik mulai (In) dan titik akhir (Out) potongan video sebelum ditarik ke Timeline adalah...",
          options: [
            "P dan S",
            "I dan O",
            "C dan V",
            "B dan N"
          ],
          answer: 1,
          explanation: "Tombol I (Mark In) menandai awal klip yang dipilih dan O (Mark Out) menandai akhir klip pada Three-Point Editing di Source Monitor."
        },
        {
          id: "q3",
          question: "Fungsi tombol Q dan W (Ripple Trim) pada Timeline Premiere Pro adalah...",
          options: [
            "Memperbesar dan memperkecil ukuran tampilan klip",
            "Q memotong sisi kiri Playhead dan merapatkan celah; W memotong sisi kanan Playhead dan merapatkan celah",
            "Menghapus seluruh audio pada track A1",
            "Menyimpan dan menutup proyek Premiere Pro"
          ],
          answer: 1,
          explanation: "Q melakukan Ripple Trim Previous Edit to Playhead (potong kiri + rapatkan) dan W melakukan Ripple Trim Next Edit to Playhead (potong kanan + rapatkan)."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Apa penyebab munculnya pesan error 'Media Offline' di Premiere Pro dan bagaimana cara mencegahnya?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["pindah", "dipindah", "hapus", "dihapus", "ubah nama", "rename", "folder", "rapi", "satu folder"],
          sampleAnswer: "Error 'Media Offline' muncul karena file video/audio mentah dipindahkan, dihapus, atau diubah nama foldernya setelah diimpor. Cara mencegahnya adalah mengumpulkan semua aset ke dalam 1 folder induk proyek yang rapi sejak awal dan tidak memindahkannya lagi."
        },
        {
          id: "e2",
          question: "Jelaskan perbedaan hasil saat memotong klip di Timeline memakai tombol Q dibanding tombol W!",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["kiri", "kanan", "awal", "akhir", "playhead", "celah", "rapat", "kosong"],
          sampleAnswer: "Tombol Q memangkas bagian klip di sebelah kiri Playhead (awal klip hingga Playhead) lalu otomatis menutup celah kosong, sedangkan tombol W memangkas bagian di sebelah kanan Playhead (dari Playhead hingga akhir klip) lalu langsung merapatkan celahnya."
        }
      ]
    },

    "pr-03": {
      id: "pr-03",
      subject: "Premiere Pro • Minggu 03",
      title: "Audio DeNoise & Audio Ducking",
      mcq: [
        {
          id: "q1",
          question: "Efek audio bawaan Premiere Pro yang dipakai untuk mengurangi suara desis kipas, AC, atau noise ruangan pada rekaman Voice Over adalah...",
          options: [
            "Ultra Key",
            "DeNoise",
            "Gaussian Blur",
            "Lumetri Color"
          ],
          answer: 1,
          explanation: "Efek DeNoise pada panel Effects dirancang khusus untuk meredam kebisingan latar (desis kipas/ruangan) pada rekaman vokal."
        },
        {
          id: "q2",
          question: "Apa yang dimaksud dengan teknik Audio Ducking dalam editing video ILM atau berita?",
          options: [
            "Menghapus seluruh musik latar agar video menjadi hening",
            "Mempercepat tempo suara narator hingga 2 kali lipat",
            "Mengecilkan volume musik latar secara halus saat narator berbicara agar suara vokal tetap jelas",
            "Menyamakan warna video dengan irama musik"
          ],
          answer: 2,
          explanation: "Audio Ducking menurunkan volume musik latar (sekitar -24 dB) saat suara narator masuk, lalu menaikkannya kembali saat jeda agar pesan narator terdengar jernih."
        },
        {
          id: "q3",
          question: "Susunan pemisahan 3 jalur audio (Track) yang rapi pada Timeline Premiere Pro adalah...",
          options: [
            "A1 Vokal/Voice Over, A2 SFX (Efek Suara), A3 Musik Latar",
            "Semua suara digabung menumpuk di A1",
            "A1 Video Utama, A2 Teks Judul, A3 Gambar",
            "A1 Musik Latar penuh 0 dB, A2 tanpa suara, A3 dihapus"
          ],
          answer: 0,
          explanation: "Memisahkan A1 untuk Vokal/VO, A2 untuk SFX, dan A3 untuk Musik Latar memudahkan pengaturan Audio Gain, DeNoise, dan Audio Ducking."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Mengapa rekaman suara narator (Voice Over) dan musik latar sebaiknya ditaruh di track audio yang terpisah?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["volume", "independen", "terpisah", "denoise", "ducking", "mengatur", "tidak mengganggu", "jelas"],
          sampleAnswer: "Agar pengaturan volume, pemberian efek DeNoise pada vokal, dan keyframe Audio Ducking pada musik dapat diatur secara terpisah tanpa saling mengganggu."
        },
        {
          id: "e2",
          question: "Bagaimana langkah singkat menurunkan volume musik latar secara halus saat narator mulai berbicara?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["keyframe", "garis", "volume", "a3", "turun", "kecil", "db", "ctrl", "pen"],
          sampleAnswer: "Lebarkan track musik (A3) hingga garis volume terlihat, tambahkan keyframe tepat sebelum dan saat narator mulai bicara (dengan Ctrl+klik atau Pen Tool), lalu turunkan garis volume musik sekitar -24 dB selama narator berbicara."
        }
      ]
    },

    "pr-04": {
      id: "pr-04",
      subject: "Premiere Pro • Minggu 04",
      title: "Elemen Grafis Berita (Lower Third & Running Text)",
      mcq: [
        {
          id: "q1",
          question: "Fungsi mengaktifkan Safe Margins (Title Safe) di layar Program Monitor sebelum menempatkan teks berita adalah...",
          options: [
            "Mengubah font teks menjadi miring",
            "Memastikan teks dan grafis berada di area aman agar tidak terpotong di layar TV maupun HP",
            "Menghapus latar belakang hijau pada video",
            "Menambah efek suara otomatis pada teks"
          ],
          answer: 1,
          explanation: "Safe Margins memberi panduan garis batas aman (Title Safe 80%) sehingga teks Lower Third atau judul tidak terpotong di berbagai rasio layar."
        },
        {
          id: "q2",
          question: "Panel di Premiere Pro yang digunakan untuk membuat bentuk kotak (Rectangle), Lower Third, dan teks grafis adalah...",
          options: [
            "Audio Track Mixer",
            "Essential Graphics",
            "Media Browser",
            "Lumetri Scopes"
          ],
          answer: 1,
          explanation: "Essential Graphics menyediakan layer Rectangle, Text, penataan posisi, serta animasi grafis berita secara rapi dalam satu klip."
        },
        {
          id: "q3",
          question: "Elemen grafis berita yang berfungsi menampilkan nama & jabatan narasumber di sepertiga bagian bawah layar disebut...",
          options: [
            "Watermark",
            "Lower Third",
            "Color Wheel",
            "Timecode"
          ],
          answer: 1,
          explanation: "Lower Third adalah papan teks informasi (nama, peran/jabatan, atau judul segmen) yang ditempatkan di sepertiga bawah layar."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Mengapa teks Lower Third sebaiknya diberi kotak latar belakang berwarna gelap atau kontras di belakang hurufnya?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["kontras", "terbaca", "jelas", "latar", "background", "terang", "bergerak"],
          sampleAnswer: "Untuk meningkatkan kontras sehingga teks nama atau informasi tetap mudah terbaca dengan jelas meskipun latar belakang video di belakangnya terang atau terus bergerak."
        },
        {
          id: "e2",
          question: "Apa perbedaan fungsi antara Lower Third dan Running Text pada tayangan berita televisi atau ILM?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["narasumber", "identitas", "nama", "berjalan", "horizontal", "bawah", "ringkasan", "informasi"],
          sampleAnswer: "Lower Third menampilkan identitas narasumber atau topik segmen yang sedang tayang di area kiri/bawah layar, sedangkan Running Text adalah teks berjalan horizontal di bagian paling bawah untuk menampilkan ringkasan berita atau info tambahan."
        }
      ]
    },

    "pr-05": {
      id: "pr-05",
      subject: "Premiere Pro • Minggu 05",
      title: "Studio Green Screen (Ultra Key) & Visual B-Roll",
      mcq: [
        {
          id: "q1",
          question: "Pada susunan layer/track video di Timeline Premiere Pro (V1, V2, V3), aturan penumpukan gambar yang benar adalah...",
          options: [
            "Track paling bawah (V1) selalu menutupi track di atasnya",
            "Track yang posisinya lebih atas selalu menutupi track di bawahnya",
            "Semua track dicampur menjadi transparan 50%",
            "Urutan track tidak berpengaruh pada tampilan video"
          ],
          answer: 1,
          explanation: "Di Timeline Premiere Pro, layer/track video di atas (misal V2/V3) menimpa visual di bawahnya (V1), kecuali bagiannya transparan atau di-keying."
        },
        {
          id: "q2",
          question: "Efek di Premiere Pro yang digunakan untuk menghapus layar kain hijau (Green Screen) di belakang presenter adalah...",
          options: [
            "Ultra Key",
            "DeNoise",
            "Crop",
            "Twirl"
          ],
          answer: 0,
          explanation: "Efek Ultra Key (pada folder Keying) menghapus warna hijau/biru menggunakan Key Color Eyedropper dan dilengkapi pengaturan Matte Cleanup."
        },
        {
          id: "q3",
          question: "Fungsi utama menumpuk klip B-Roll di atas suara narator pada video ILM atau berita adalah...",
          options: [
            "Mematikan suara narator agar tidak terdengar",
            "Menampilkan visual bukti kejadian/isu agar tayangan terasa nyata, dinamis, dan tidak monoton",
            "Mengganti format file menjadi PNG",
            "Membuat video diputar terbalik"
          ],
          answer: 1,
          explanation: "B-Roll memberikan bukti visual yang memperkuat ucapan narator sekaligus menjaga ritme tontonan tetap menarik."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Pada komposisi Green Screen, track mana yang diisi gambar/video latar belakang dan track mana yang diisi video subjek berkain hijau? Jelaskan singkat alasannya!",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["v1", "v2", "latar", "background", "subjek", "presenter", "atas", "bawah", "menutupi"],
          sampleAnswer: "Latar belakang (background) diletakkan di Track V1 dan video subjek berkain hijau di Track V2. Karena V2 berada di atas V1, saat warna hijau dihapus dengan Ultra Key, gambar latar di V1 langsung terlihat di belakang subjek."
        },
        {
          id: "e2",
          question: "Alat apa di dalam panel Effect Controls pada efek Ultra Key yang digunakan untuk memilih warna hijau yang ingin dihapus?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["pipet", "eyedropper", "key color", "warna", "hijau"],
          sampleAnswer: "Ikon Pipet (Eyedropper) pada parameter Key Color di panel Effect Controls, lalu klik pada area latar kain hijau di layar Program Monitor."
        }
      ]
    },

    "pr-06": {
      id: "pr-06",
      subject: "Premiere Pro • Minggu 06",
      title: "Color Grading & Master Export H.264",
      mcq: [
        {
          id: "q1",
          question: "Keuntungan menggunakan Adjustment Layer di atas semua potongan klip saat melakukan Color Grading adalah...",
          options: [
            "Menghapus suara desis secara otomatis",
            "Menerapkan warna/mood ke banyak klip sekaligus secara konsisten tanpa mengedit satu per satu",
            "Mengurangi ukuran resolusi video menjadi 240p",
            "Menambahkan subtitle otomatis"
          ],
          answer: 1,
          explanation: "Adjustment Layer bekerja seperti filter transparan di atas timeline sehingga satu setelan Lumetri Color berlaku seragam ke seluruh klip di bawahnya."
        },
        {
          id: "q2",
          question: "Shortcut keyboard di Premiere Pro untuk membuka jendela Export Media adalah...",
          options: [
            "Ctrl + Z",
            "Ctrl + N",
            "Ctrl + M",
            "Ctrl + T"
          ],
          answer: 2,
          explanation: "Menekan Ctrl + M membuka menu Export Media untuk mengatur format, preset, nama file, dan lokasi penyimpanan video akhir."
        },
        {
          id: "q3",
          question: "Format kompresi standar untuk mengekspor master video menjadi file .MP4 Full HD yang ringan dan bisa diputar di semua perangkat adalah...",
          options: [
            "H.264",
            "BMP Sequence",
            "WAV Only",
            "TIFF Uncompressed"
          ],
          answer: 0,
          explanation: "Format H.264 menghasilkan ekstensi .MP4 dengan kualitas tajam (1080p) namun ukuran file efisien untuk web, HP, dan proyektor."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Apa fungsi tahap Basic Correction di panel Lumetri Color sebelum membangun mood warna kreatif?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["pencahayaan", "exposure", "kontras", "white balance", "menyamakan", "konsisten", "kamera"],
          sampleAnswer: "Basic Correction berfungsi menyamakan pencahayaan (Exposure), kontras, dan keseimbangan warna (White Balance) antar potongan kamera agar tampak konsisten sebelum diberi nuansa warna emosi."
        },
        {
          id: "e2",
          question: "Sebutkan minimal 2 hal yang wajib diperiksa saat melakukan Quality Control (QC) sebelum mengekspor video final!",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["durasi", "audio", "suara", "teks", "typo", "safe", "in", "out", "warna", "hitam", "kosong"],
          sampleAnswer: "Hal yang perlu dicek saat QC antara lain: (1) durasi total sesuai ketentuan dan batas In–Out tidak menyisakan layar hitam kosong, (2) keseimbangan volume suara narator & musik tidak pecah, serta (3) seluruh teks bebas typo dan berada dalam Safe Margins."
        }
      ]
    },

    "ae-01": {
      id: "ae-01",
      subject: "After Effects • Minggu 01",
      title: "Toolbar, Anchor Point & 5 Shortcut Dasar (P-S-R-T-A)",
      mcq: [
        {
          id: "q1",
          question: "Shortcut keyboard untuk membuat Composition (kanvas kerja) baru di Adobe After Effects adalah...",
          options: [
            "Ctrl + N",
            "Ctrl + M",
            "Ctrl + E",
            "Ctrl + P"
          ],
          answer: 0,
          explanation: "Ctrl + N membuka jendela Composition Settings untuk mengatur nama, resolusi (1920x1080), frame rate, dan durasi (misal 7 detik)."
        },
        {
          id: "q2",
          question: "Kombinasi tombol shortcut untuk memindahkan titik poros (Anchor Point) tepat ke tengah layer/objek adalah...",
          options: [
            "Ctrl + C",
            "Ctrl + Alt + Home",
            "Shift + Delete",
            "Alt + F4"
          ],
          answer: 1,
          explanation: "Ctrl + Alt + Home (Center Anchor Point in Layer Content) menempatkan Anchor Point tepat di pusat objek secara presisi."
        },
        {
          id: "q3",
          question: "Arti dari 5 shortcut transformasi dasar P, S, R, T, A pada Timeline After Effects secara berurutan adalah...",
          options: [
            "Play, Stop, Render, Trim, Audio",
            "Position, Scale, Rotation, Opacity, Anchor Point",
            "Path, Stroke, Radius, Tint, Alpha",
            "Project, Solid, Ramp, Text, Align"
          ],
          answer: 1,
          explanation: "P = Position, S = Scale, R = Rotation, T = Opacity (Transparency), dan A = Anchor Point."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Mengapa Anchor Point wajib diletakkan tepat di tengah logo sebelum membuat animasi Rotation atau Scale?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["poros", "tengah", "pusat", "putar", "berputar", "simetris", "melenceng", "membesar"],
          sampleAnswer: "Karena Anchor Point adalah titik poros pergerakan; jika tidak berada di tengah, logo akan berputar melenceng atau membesar tidak simetris dari pusatnya."
        },
        {
          id: "e2",
          question: "Sebutkan perbedaan fungsi Selection Tool (V) dan Pan Behind / Anchor Point Tool (Y) di Toolbar After Effects!",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["memilih", "geser", "menggeser", "layer", "anchor", "poros", "tanpa"],
          sampleAnswer: "Selection Tool (V) digunakan untuk memilih dan menggeser posisi objek/layer, sedangkan Pan Behind Tool (Y) digunakan untuk memindahkan posisi titik poros (Anchor Point) tanpa menggeser letak visual objek."
        }
      ]
    },

    "ae-02": {
      id: "ae-02",
      subject: "After Effects • Minggu 02",
      title: "10 Teknik Teks Animasi Sinematik (Tugas 1 AE)",
      mcq: [
        {
          id: "q1",
          question: "Fitur bawaan pada layer teks After Effects untuk menganimasikan huruf demi huruf tanpa plugin adalah...",
          options: [
            "Menu 'Animate ▶' (Text Animator) pada layer teks",
            "Panel Info",
            "Effects > Audio Reverb",
            "Preferences > Media Cache"
          ],
          answer: 0,
          explanation: "Text Animator ('Animate ▶') memungkinkan animasi Position, Scale, Opacity, Blur, hingga 3D Rotation per karakter/kata dengan Range Selector."
        },
        {
          id: "q2",
          question: "Untuk membuat efek animasi teks 3D Flip per huruf, opsi apa yang wajib diaktifkan terlebih dahulu pada menu 'Animate ▶'?",
          options: [
            "Enable Audio Levels",
            "Enable Per-character 3D",
            "Flatten Layer",
            "Lock Layer"
          ],
          answer: 1,
          explanation: "Mengaktifkan 'Enable Per-character 3D' membuka sumbu rotasi 3D (X, Y, Z) pada setiap huruf secara individual."
        },
        {
          id: "q3",
          question: "Properti Text Animator utama yang dipakai untuk membentuk efek Flicker, Smooth Fade, maupun Typewriter adalah...",
          options: [
            "Opacity (diatur ke 0% lalu digerakkan lewat Range Selector)",
            "Stroke Width",
            "Audio Gain",
            "Time Stretch"
          ],
          answer: 0,
          explanation: "Ketiga gaya tersebut berbasis Animator Opacity 0% dengan variasi Range Selector (Smoothness/Offset/Wiggly Selector)."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Apa kelebihan memakai Text Animator ('Animate ▶') dibanding menganimasikan properti Transform utama pada layer teks?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["huruf", "karakter", "kata", "berurutan", "range", "dinamis", "per"],
          sampleAnswer: "Text Animator memungkinkan setiap huruf atau kata bergerak secara berurutan dengan kendali Range Selector, sedangkan Transform utama hanya menggerakkan seluruh teks sebagai satu blok kaku."
        },
        {
          id: "e2",
          question: "Mengapa pada satu Bumper Opening Studio sebaiknya cukup memilih 2–3 gaya teks animasi yang serasi, bukan menumpuk semua 10 gaya sekaligus?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["rapi", "bersih", "profesional", "terbaca", "fokus", "konsisten", "berlebihan", "berantakan"],
          sampleAnswer: "Agar tampilan bumper tetap bersih, profesional, konsisten dengan identitas studio, serta nama studio tetap fokus dan mudah terbaca tanpa terasa ramai atau berlebihan."
        }
      ]
    },

    "ae-03": {
      id: "ae-03",
      subject: "After Effects • Minggu 03",
      title: "3D Logo Animation Tanpa Plugin dari File .PNG (Tugas 2 AE)",
      mcq: [
        {
          id: "q1",
          question: "Format file gambar logo yang paling tepat digunakan agar latar belakang logo transparan saat diolah menjadi 3D di After Effects adalah...",
          options: [
            ".JPG latar putih solid",
            ".PNG transparan (atau file vektor)",
            ".MP3 audio",
            ".TXT teks"
          ],
          answer: 1,
          explanation: "File .PNG dengan saluran alpha (latar transparan) atau vektor memastikan hanya bentuk logo yang diekstrusi menjadi 3D tanpa kotak latar belakang."
        },
        {
          id: "q2",
          question: "Saklar/ikon pada baris layer Timeline yang wajib dicentang agar logo dapat bergerak pada sumbu X, Y, dan Z adalah...",
          options: [
            "Ikon Shy Layer",
            "Ikon 3D Layer (kubus 3D)",
            "Ikon Mute Audio",
            "Ikon Guide Layer"
          ],
          answer: 1,
          explanation: "Mencentang kolom 3D Layer (ikon kubus) mengaktifkan ruang 3 dimensi (sumbu Z) sehingga layer bisa memiliki kedalaman dan dilihat oleh Camera 3D."
        },
        {
          id: "q3",
          question: "Kombinasi layer yang dipakai untuk membuat gerakan kamera berputar (orbit) mengelilingi Logo 3D secara halus adalah...",
          options: [
            "Camera 3D yang di-parent (Pick Whip) ke sebuah Null Object 3D",
            "Adjustment Layer dan Audio Track",
            "Dua layer teks tanpa kamera",
            "Solid layer saja tanpa 3D Layer"
          ],
          answer: 0,
          explanation: "Mengikat Camera ke Null Object 3D membuat kita cukup menganimasikan rotasi Null Object agar kamera mengorbit logo dengan mulus."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Mengapa Camera 3D biasanya di-parent ke Null Object 3D saat membuat gerakan orbit mengelilingi logo?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["pusat", "halus", "orbit", "putar", "rotation", "mudah", "kontrol", "terpusat"],
          sampleAnswer: "Karena memutar properti Rotation pada Null Object yang berada di pusat logo menghasilkan gerakan orbit kamera yang terpusat, sangat halus, dan jauh lebih mudah diatur keyframe-nya."
        },
        {
          id: "e2",
          question: "Bagaimana prinsip dasar membuat logo .PNG datar terlihat tebal 3D tanpa memakai plugin tambahan?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["3d", "duplikat", "tumpuk", "sumbu z", "posisi z", "extrude", "bayangan", "shading"],
          sampleAnswer: "Aktifkan 3D Layer lalu tumpuk/duplikasi layer logo secara bertahap pada sumbu Z (atau manfaatkan 3D renderer) sambil membedakan warna/bayangan sisi samping dan wajah depan agar terlihat memiliki ketebalan 3D."
        }
      ]
    },

    "ae-04": {
      id: "ae-04",
      subject: "After Effects • Minggu 04",
      title: "Integrasi 3D Logo .PNG + Teks Animasi Studio (Tugas 3 AE)",
      mcq: [
        {
          id: "q1",
          question: "Timing kemunculan teks animasi nama studio yang paling ideal dalam sebuah Bumper 3D Logo adalah...",
          options: [
            "Muncul paling awal lalu menghilang sebelum logo terlihat",
            "Muncul tepat menjelang atau saat kamera 3D berhenti berputar menghadap wajah depan logo",
            "Muncul di detik terakhir selama 0,1 detik saja",
            "Muncul menumpuk menutupi seluruh bagian tengah logo"
          ],
          answer: 1,
          explanation: "Menyelaraskan masuknya teks saat gerakan kamera 3D mulai melambat/berhenti menciptakan alur visual yang rapi dan sinematik."
        },
        {
          id: "q2",
          question: "Shortcut cepat di After Effects untuk mengaktifkan Type Tool guna mengetik teks nama studio adalah...",
          options: [
            "Ctrl + T",
            "Ctrl + D",
            "Ctrl + W",
            "Ctrl + Q"
          ],
          answer: 0,
          explanation: "Ctrl + T langsung mengaktifkan Horizontal Type Tool agar siap mengetik teks di jendela Composition."
        },
        {
          id: "q3",
          question: "Tujuan membuat ukuran dan ketebalan huruf berbeda antara Nama Utama Studio dan sub-teks 'ANIMATION STUDIO' di bawahnya adalah...",
          options: [
            "Memperbesar ukuran file proyek",
            "Membangun hierarki visual agar nama utama langsung terbaca jelas dan sub-teks menjadi pendukung",
            "Menyembunyikan nama studio utama",
            "Memperlambat proses render"
          ],
          answer: 1,
          explanation: "Hierarki tipografi (utama tebal/besar, sub-teks lebih kecil & renggang) membantu mata penonton menangkap nama brand seketika."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Mengapa penyelarasan timing antara berhentinya gerakan Logo 3D dan masuknya Teks Animasi sangat penting pada bumper?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["alur", "mengalir", "fokus", "sinematik", "transisi", "rapi", "perhatian", "enak"],
          sampleAnswer: "Timing yang selaras membuat transisi dari gerakan logo ke kemunculan teks terasa mengalir alami, menjaga fokus mata penonton, dan memberi kesan profesional/sinematik."
        },
        {
          id: "e2",
          question: "Hal apa saja yang perlu diperhatikan pada posisi dan warna teks nama studio saat digabungkan dengan Logo 3D?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["tengah", "center", "seimbang", "jarak", "kontras", "terbaca", "warna", "latar"],
          sampleAnswer: "Posisi teks harus sejajar rapi (center) di bawah logo dengan jarak aman tanpa menabrak logo, serta warna teks harus kontras dengan latar belakang agar mudah terbaca."
        }
      ]
    },

    "ae-05": {
      id: "ae-05",
      subject: "After Effects • Minggu 05",
      title: "Pencahayaan Sinematik: CC Light Sweep, Glow & Depth of Field (Tugas 4 AE)",
      mcq: [
        {
          id: "q1",
          question: "Efek di After Effects yang digunakan untuk membuat kilatan sinar menyapu melintasi permukaan depan Logo 3D adalah...",
          options: [
            "CC Light Sweep",
            "Audio Bass & Treble",
            "Mosaic",
            "Warp Stabilizer"
          ],
          answer: 0,
          explanation: "CC Light Sweep menghasilkan garis kilatan cahaya metalik yang bisa dianimasikan menyapu wajah depan logo."
        },
        {
          id: "q2",
          question: "Pengaturan pada Camera Options di layer Camera 1 yang dinyalakan untuk menciptakan efek blur fokus lensa sinematik adalah...",
          options: [
            "Depth of Field",
            "Frame Blending",
            "Audio Waveform",
            "Time Remapping"
          ],
          answer: 0,
          explanation: "Menyalakan Depth of Field (lalu mengatur Focus Distance & Aperture) membuat objek di luar titik fokus tampak blur alami seperti kamera film."
        },
        {
          id: "q3",
          question: "Efek yang dipasang pada layer Background paling bawah untuk memberi gradasi cahaya studio lembut di tengah layar adalah...",
          options: [
            "Gradient Ramp (mode Radial Ramp)",
            "Ultra Key",
            "Invert",
            "Echo"
          ],
          answer: 0,
          explanation: "Gradient Ramp dengan pilihan Radial Ramp menciptakan latar gelap di tepi dan sedikit lebih terang di pusat belakang logo (efek spotlight studio)."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Di urutan layer mana efek CC Light Sweep sebaiknya dipasang pada susunan Logo 3D? Jelaskan singkat alasannya!",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["depan", "atas", "wajah", "terlihat", "menyapu", "jelas"],
          sampleAnswer: "Dipasang pada layer wajah depan/paling atas dari Logo 3D agar sapuan kilatan cahayanya terlihat jelas melintasi permukaan depan logo dan tidak tertutup layer lain."
        },
        {
          id: "e2",
          question: "Apa perbedaan fungsi efek Glow dan Depth of Field dalam memoles tampilan bumper 3D?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["pendar", "cahaya", "terang", "blur", "fokus", "lensa", "jarak", "kamera"],
          sampleAnswer: "Efek Glow menambahkan pendaran cahaya lembut di sekitar area terang logo/teks, sedangkan Depth of Field membuat area di luar jarak fokus kamera menjadi blur seperti lensa kamera bioskop."
        }
      ]
    },

    "ae-06": {
      id: "ae-06",
      subject: "After Effects • Minggu 06",
      title: "Sound Design & Render Final Master Bumper (.MP4 Full HD)",
      mcq: [
        {
          id: "q1",
          question: "Shortcut pada layer audio di Timeline After Effects untuk menampilkan grafik gelombang suara (Waveform) adalah...",
          options: [
            "Tekan tombol U sekali",
            "Tekan tombol L dua kali cepat (LL)",
            "Tekan tombol R dua kali",
            "Tekan tombol Space"
          ],
          answer: 1,
          explanation: "Menekan L sekali memunculkan Audio Levels, dan menekan LL (L dua kali) langsung menampilkan grafik Waveform audio."
        },
        {
          id: "q2",
          question: "Shortcut untuk mengunci batas awal dan batas akhir Work Area agar durasi render terkunci pas 5–7 detik adalah...",
          options: [
            "B (awal) dan N (akhir)",
            "I (awal) dan O (akhir)",
            "Q (awal) dan W (akhir)",
            "P (awal) dan S (akhir)"
          ],
          answer: 0,
          explanation: "Di After Effects, tombol B mengatur awal Work Area (Begin) dan tombol N mengatur akhir Work Area (End)."
        },
        {
          id: "q3",
          question: "Shortcut untuk mengirim komposisi After Effects langsung ke Adobe Media Encoder agar diekspor menjadi file .MP4 H.264 adalah...",
          options: [
            "Ctrl + Alt + M",
            "Ctrl + Shift + D",
            "Ctrl + Y",
            "Ctrl + K"
          ],
          answer: 0,
          explanation: "Ctrl + Alt + M mengirim komposisi ke antrean Adobe Media Encoder sehingga mudah diekspor ke format H.264 (.mp4) yang ringan dan bersuara."
        }
      ],
      essay: [
        {
          id: "e1",
          question: "Mengapa menampilkan gelombang audio (LL) sangat membantu saat menyinkronkan SFX Whoosh, Impact Boom, dan Shimmer?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["puncak", "gelombang", "visual", "tepat", "sinkron", "frame", "tumbukan", "cahaya"],
          sampleAnswer: "Karena puncak grafik gelombang suara terlihat jelas secara visual, sehingga puncak bunyi Impact atau Shimmer bisa disejajarkan tepat pada frame saat logo berhenti atau kilatan cahaya menyapu."
        },
        {
          id: "e2",
          question: "Bagaimana langkah singkat membuat efek penutup layar hitam halus (Fade Out) di akhir bumper 5–7 detik?",
          placeholder: "Tulis jawaban singkatmu di sini...",
          keywords: ["ctrl + y", "solid", "hitam", "atas", "opacity", "0%", "100%", "akhir"],
          sampleAnswer: "Buat Solid Hitam dengan Ctrl + Y lalu letakkan di baris layer paling atas, kemudian animasikan Opacity (T) dari 0% menjadi 100% pada sekitar 0,5–1 detik terakhir bumper."
        }
      ]
    }
  };

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readJson(key, fallback) {
    try {
      const raw = global.localStorage && global.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, val) {
    try {
      global.localStorage && global.localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  function getSavedProfile() {
    return readJson(PROFILE_KEY, { name: "", className: "" });
  }

  function saveProfile(name, className) {
    writeJson(PROFILE_KEY, {
      name: String(name || "").trim().slice(0, 80),
      className: String(className || "").trim().slice(0, 40)
    });
  }

  function getSavedResults() {
    return readJson(RESULTS_KEY, {});
  }

  function getSavedScore(weekId) {
    const all = getSavedResults();
    return all && all[weekId] ? all[weekId] : null;
  }

  function saveResult(weekId, resultObj) {
    const all = getSavedResults();
    all[weekId] = resultObj;
    writeJson(RESULTS_KEY, all);
  }

  function evaluateEssay(text, keywords) {
    const clean = String(text || "").toLowerCase().trim();
    if (clean.length < 8) return { matched: false, hitCount: 0 };
    const list = Array.isArray(keywords) ? keywords : [];
    let hits = 0;
    list.forEach(kw => {
      if (clean.includes(String(kw).toLowerCase())) hits++;
    });
    return { matched: hits >= 1, hitCount: hits };
  }

  function gradeSubmission(weekId, mcqAnswers, essayAnswers, studentName, studentClass) {
    const quiz = QUIZ_BANK[weekId];
    if (!quiz) return null;

    let mcqCorrect = 0;
    const mcqDetail = quiz.mcq.map(q => {
      const picked = typeof mcqAnswers[q.id] === "number" ? mcqAnswers[q.id] : -1;
      const isCorrect = picked === q.answer;
      if (isCorrect) mcqCorrect++;
      return { id: q.id, picked, answer: q.answer, isCorrect };
    });

    let essayMatched = 0;
    const essayDetail = quiz.essay.map(q => {
      const text = String(essayAnswers[q.id] || "").trim();
      const ev = evaluateEssay(text, q.keywords);
      if (ev.matched) essayMatched++;
      return { id: q.id, text, matched: ev.matched };
    });

    // Bobot: 3 PG = 60 poin (20/soal), 2 Essay = 40 poin (20/soal jika relevan, 10 jika sudah diisi singkat)
    let score = mcqCorrect * 20;
    essayDetail.forEach(ed => {
      if (ed.matched) score += 20;
      else if (ed.text.length >= 6) score += 10;
    });

    return {
      weekId,
      studentName: String(studentName || "").trim(),
      studentClass: String(studentClass || "").trim(),
      mcqCorrect,
      mcqTotal: quiz.mcq.length,
      essayMatched,
      essayTotal: quiz.essay.length,
      score: Math.min(100, score),
      mcqDetail,
      essayDetail,
      submittedAt: new Date().toISOString()
    };
  }

  function injectStyles() {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .bb-quiz-root {
        font-family: "Inter", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
        background: linear-gradient(155deg, #ffffff 0%, #f8fafc 100%);
        border: 1.5px solid rgba(37, 99, 235, 0.22);
        border-radius: 22px;
        padding: 22px 22px 20px;
        color: #0f172a;
        box-shadow: 0 16px 42px rgba(15, 23, 42, 0.08);
        display: flex;
        flex-direction: column;
        gap: 14px;
        box-sizing: border-box;
        width: 100%;
      }
      .bb-quiz-root * { box-sizing: border-box; }
      .bb-quiz-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        padding-bottom: 12px;
      }
      .bb-quiz-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #1d4ed8;
        background: #eff6ff;
        border: 1px solid rgba(37, 99, 235, 0.2);
        border-radius: 999px;
        padding: 4px 10px;
        margin-bottom: 6px;
      }
      .bb-quiz-title {
        margin: 0;
        font-size: 1.08rem;
        font-weight: 800;
        color: #0a0f1d;
        line-height: 1.3;
      }
      .bb-quiz-sub {
        margin: 4px 0 0;
        font-size: 0.78rem;
        color: #475569;
        line-height: 1.45;
      }
      .bb-quiz-scroll {
        display: flex;
        flex-direction: column;
        gap: 14px;
        max-height: calc(100dvh - 295px);
        overflow-y: auto;
        padding-right: 4px;
        overscroll-behavior-y: contain;
        -webkit-overflow-scrolling: touch;
      }
      .bb-quiz-identity {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 10px;
      }
      .bb-quiz-input,
      .bb-quiz-textarea {
        width: 100%;
        border: 1.25px solid #cbd5e1;
        border-radius: 12px;
        padding: 9px 12px;
        font-family: inherit;
        font-size: 0.82rem;
        color: #0f172a;
        background: #ffffff;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .bb-quiz-input:focus,
      .bb-quiz-textarea:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
      }
      .bb-quiz-textarea {
        min-height: 64px;
        resize: vertical;
        line-height: 1.45;
      }
      .bb-quiz-section-tag {
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #334155;
        margin: 2px 0 -4px;
      }
      .bb-quiz-qcard {
        background: #ffffff;
        border: 1.25px solid #e2e8f0;
        border-radius: 15px;
        padding: 13px 14px;
        display: flex;
        flex-direction: column;
        gap: 9px;
      }
      .bb-quiz-qcard.is-missing {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
      }
      .bb-quiz-qtext {
        font-size: 0.84rem;
        font-weight: 700;
        color: #0f172a;
        line-height: 1.45;
      }
      .bb-quiz-qnum {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 22px;
        padding: 0 6px;
        border-radius: 7px;
        background: #0a0f1d;
        color: #ffffff;
        font-size: 0.7rem;
        font-weight: 800;
        margin-right: 6px;
        vertical-align: 1px;
      }
      .bb-quiz-options {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .bb-quiz-opt {
        display: flex;
        align-items: flex-start;
        gap: 9px;
        padding: 9px 11px;
        border-radius: 11px;
        border: 1.2px solid #e2e8f0;
        background: #f8fafc;
        cursor: pointer;
        font-size: 0.8rem;
        color: #1e293b;
        line-height: 1.4;
        transition: border-color 0.14s ease, background 0.14s ease;
      }
      .bb-quiz-opt:hover {
        border-color: #93c5fd;
        background: #eff6ff;
      }
      .bb-quiz-opt input[type="radio"] {
        margin-top: 2px;
        accent-color: #2563eb;
        flex-shrink: 0;
        width: 15px;
        height: 15px;
      }
      .bb-quiz-opt.is-correct {
        border-color: #10b981;
        background: #ecfdf5;
        color: #065f46;
        font-weight: 700;
      }
      .bb-quiz-opt.is-wrong {
        border-color: #ef4444;
        background: #fef2f2;
        color: #991b1b;
      }
      .bb-quiz-answer-box {
        margin-top: 2px;
        padding: 10px 12px;
        border-radius: 11px;
        border-left: 3.5px solid #059669;
        background: #ecfdf5;
        font-size: 0.78rem;
        color: #064e3b;
        line-height: 1.48;
      }
      .bb-quiz-answer-box.is-warn {
        border-left-color: #d97706;
        background: #fffbeb;
        color: #78350f;
      }
      .bb-quiz-answer-label {
        display: block;
        font-size: 0.7rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 3px;
      }
      .bb-quiz-summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        padding: 13px 15px;
        border-radius: 14px;
        background: linear-gradient(135deg, #0a0f1d, #1e3a8a);
        color: #ffffff;
      }
      .bb-quiz-score-big {
        font-size: 1.35rem;
        font-weight: 800;
        font-variant-numeric: tabular-nums;
      }
      .bb-quiz-error {
        font-size: 0.78rem;
        font-weight: 600;
        color: #b91c1c;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 11px;
        padding: 9px 12px;
      }
      .bb-quiz-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        padding-top: 4px;
      }
      .bb-quiz-btn {
        appearance: none;
        border: 1.25px solid transparent;
        border-radius: 999px;
        padding: 10px 18px;
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: transform 0.12s ease, opacity 0.14s ease, background 0.14s ease;
      }
      .bb-quiz-btn:active { transform: scale(0.98); }
      .bb-quiz-btn-primary {
        background: #2563eb;
        color: #ffffff;
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.28);
      }
      .bb-quiz-btn-primary:hover { background: #1d4ed8; }
      .bb-quiz-btn-ghost {
        background: #ffffff;
        color: #0f172a;
        border-color: #cbd5e1;
      }
      .bb-quiz-btn-ghost:hover { border-color: #64748b; background: #f8fafc; }

      /* Dark theme variant for materi-siswa.html modal */
      .bb-quiz-root.theme-dark {
        background: linear-gradient(155deg, #0f172a 0%, #111c33 100%);
        border-color: rgba(56, 189, 248, 0.3);
        color: #f8fafc;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
      }
      .bb-quiz-root.theme-dark .bb-quiz-head { border-bottom-color: rgba(148, 163, 184, 0.18); }
      .bb-quiz-root.theme-dark .bb-quiz-eyebrow {
        color: #7dd3fc;
        background: rgba(2, 132, 199, 0.22);
        border-color: rgba(56, 189, 248, 0.35);
      }
      .bb-quiz-root.theme-dark .bb-quiz-title { color: #ffffff; }
      .bb-quiz-root.theme-dark .bb-quiz-sub,
      .bb-quiz-root.theme-dark .bb-quiz-section-tag { color: #94a3b8; }
      .bb-quiz-root.theme-dark .bb-quiz-input,
      .bb-quiz-root.theme-dark .bb-quiz-textarea {
        background: #0b1222;
        border-color: rgba(148, 163, 184, 0.28);
        color: #f8fafc;
      }
      .bb-quiz-root.theme-dark .bb-quiz-qcard {
        background: #16223a;
        border-color: rgba(148, 163, 184, 0.2);
      }
      .bb-quiz-root.theme-dark .bb-quiz-qtext { color: #f8fafc; }
      .bb-quiz-root.theme-dark .bb-quiz-qnum { background: #0284c7; }
      .bb-quiz-root.theme-dark .bb-quiz-opt {
        background: #0f172a;
        border-color: rgba(148, 163, 184, 0.24);
        color: #e2e8f0;
      }
      .bb-quiz-root.theme-dark .bb-quiz-opt:hover {
        border-color: #38bdf8;
        background: rgba(2, 132, 199, 0.18);
      }
      .bb-quiz-root.theme-dark .bb-quiz-opt.is-correct {
        background: rgba(16, 185, 129, 0.2);
        border-color: #34d399;
        color: #a7f3d0;
      }
      .bb-quiz-root.theme-dark .bb-quiz-opt.is-wrong {
        background: rgba(239, 68, 68, 0.2);
        border-color: #f87171;
        color: #fecaca;
      }
      .bb-quiz-root.theme-dark .bb-quiz-answer-box {
        background: rgba(6, 78, 59, 0.42);
        border-left-color: #34d399;
        color: #d1fae5;
      }
      .bb-quiz-root.theme-dark .bb-quiz-answer-box.is-warn {
        background: rgba(120, 53, 15, 0.42);
        border-left-color: #fbbf24;
        color: #fef3c7;
      }
      .bb-quiz-root.theme-dark .bb-quiz-btn-ghost {
        background: #1e293b;
        color: #f8fafc;
        border-color: rgba(148, 163, 184, 0.35);
      }

      /* Modal Shell */
      .bb-quiz-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(7, 12, 22, 0.78);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }
      .bb-quiz-modal-dialog {
        width: 100%;
        max-width: 720px;
        max-height: calc(100dvh - 32px);
        overflow-y: auto;
        border-radius: 22px;
        position: relative;
      }
      .bb-quiz-modal-close {
        appearance: none;
        border: 1px solid rgba(148, 163, 184, 0.32);
        background: rgba(15, 23, 42, 0.1);
        color: inherit;
        border-radius: 999px;
        width: 34px;
        height: 34px;
        font-size: 1.15rem;
        line-height: 1;
        cursor: pointer;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .bb-quiz-modal-close:hover { background: rgba(239, 68, 68, 0.16); border-color: #ef4444; }
      .bb-quiz-badge-done {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.7rem;
        font-weight: 800;
        padding: 3px 8px;
        border-radius: 999px;
        background: rgba(16, 185, 129, 0.16);
        color: #10b981;
        border: 1px solid rgba(16, 185, 129, 0.35);
      }

      @media (max-width: 850px), (max-width: 1080px) and (orientation: portrait) {
        .bb-quiz-root { padding: 16px 14px; border-radius: 18px; }
        .bb-quiz-scroll { max-height: none !important; overflow: visible !important; padding-right: 0; }
        .bb-quiz-identity { grid-template-columns: 1fr; }
        .bb-quiz-btn { width: 100%; }
        .bb-quiz-modal-backdrop { padding: 10px; align-items: flex-start; }
        .bb-quiz-modal-dialog { max-height: calc(100dvh - 20px); }
      }
    `;
    document.head.appendChild(style);
  }

  function renderQuizInto(container, weekId, opts) {
    if (!container) return;
    injectStyles();

    const quiz = QUIZ_BANK[weekId];
    if (!quiz) {
      container.innerHTML = "";
      return;
    }

    const options = opts || {};
    const isDark = options.theme === "dark";
    const onClose = typeof options.onClose === "function" ? options.onClose : null;
    const onUpdate = typeof options.onUpdate === "function" ? options.onUpdate : null;
    const profile = getSavedProfile();
    let saved = getSavedScore(weekId);
    let viewState = saved ? "result" : "form";

    function draw(errorMsg, missingIds) {
      const missingSet = new Set(missingIds || []);
      const letters = ["A", "B", "C", "D"];

      let summaryHtml = "";
      if (viewState === "result" && saved) {
        const who = [saved.studentName, saved.studentClass].filter(Boolean).join(" • ");
        summaryHtml = `
          <div class="bb-quiz-summary">
            <div>
              <div style="font-size:0.7rem; opacity:0.82; text-transform:uppercase; letter-spacing:0.05em; font-weight:700;">
                Hasil Kuis Singkat${who ? " • " + escapeHtml(who) : ""}
              </div>
              <div style="font-size:0.84rem; margin-top:3px;">
                Pilihan Ganda: <strong>${saved.mcqCorrect}/${saved.mcqTotal} Benar</strong> &nbsp;•&nbsp;
                Essay Singkat: <strong>${saved.essayMatched}/${saved.essayTotal} Sesuai Konsep</strong>
              </div>
            </div>
            <div class="bb-quiz-score-big">${saved.score}/100</div>
          </div>
        `;
      }

      const mcqHtml = quiz.mcq.map((q, idx) => {
        const resItem = viewState === "result" && saved
          ? (saved.mcqDetail || []).find(d => d.id === q.id)
          : null;
        const optsHtml = q.options.map((optText, oIdx) => {
          let cls = "bb-quiz-opt";
          let checked = "";
          if (resItem) {
            if (resItem.picked === oIdx) checked = "checked";
            if (oIdx === q.answer) cls += " is-correct";
            else if (resItem.picked === oIdx && !resItem.isCorrect) cls += " is-wrong";
          }
          const disabled = viewState === "result" ? "disabled" : "";
          return `
            <label class="${cls}">
              <input type="radio" name="bbq_${escapeHtml(weekId)}_${escapeHtml(q.id)}" value="${oIdx}" ${checked} ${disabled} />
              <span><strong>${letters[oIdx]}.</strong> ${escapeHtml(optText)}</span>
            </label>
          `;
        }).join("");

        let feedbackHtml = "";
        if (resItem) {
          feedbackHtml = `
            <div class="bb-quiz-answer-box ${resItem.isCorrect ? "" : "is-warn"}">
              <span class="bb-quiz-answer-label">
                ${resItem.isCorrect ? "Jawaban Kamu Benar" : "Jawaban yang Benar: " + letters[q.answer] + ". " + escapeHtml(q.options[q.answer])}
              </span>
              ${escapeHtml(q.explanation)}
            </div>
          `;
        }

        return `
          <div class="bb-quiz-qcard ${missingSet.has(q.id) ? "is-missing" : ""}" data-qid="${escapeHtml(q.id)}">
            <div class="bb-quiz-qtext"><span class="bb-quiz-qnum">${idx + 1}</span>${escapeHtml(q.question)}</div>
            <div class="bb-quiz-options">${optsHtml}</div>
            ${feedbackHtml}
          </div>
        `;
      }).join("");

      const essayHtml = quiz.essay.map((q, idx) => {
        const resItem = viewState === "result" && saved
          ? (saved.essayDetail || []).find(d => d.id === q.id)
          : null;
        const num = quiz.mcq.length + idx + 1;
        const val = resItem ? resItem.text : "";
        let feedbackHtml = "";
        if (resItem) {
          feedbackHtml = `
            <div class="bb-quiz-answer-box ${resItem.matched ? "" : "is-warn"}">
              <span class="bb-quiz-answer-label">
                ${resItem.matched ? "Sesuai Konsep — " : "Perlu Dilengkapi — "}Jawaban yang Benar:
              </span>
              ${escapeHtml(q.sampleAnswer)}
            </div>
          `;
        }
        return `
          <div class="bb-quiz-qcard ${missingSet.has(q.id) ? "is-missing" : ""}" data-qid="${escapeHtml(q.id)}">
            <div class="bb-quiz-qtext"><span class="bb-quiz-qnum">${num}</span>${escapeHtml(q.question)}</div>
            <textarea
              class="bb-quiz-textarea"
              data-essay-id="${escapeHtml(q.id)}"
              rows="2"
              placeholder="${escapeHtml(q.placeholder)}"
              ${viewState === "result" ? "readonly" : ""}
            >${escapeHtml(val)}</textarea>
            ${feedbackHtml}
          </div>
        `;
      }).join("");

      container.innerHTML = `
        <div class="bb-quiz-root ${isDark ? "theme-dark" : ""}" data-lenis-prevent data-lenis-prevent-touch data-lenis-prevent-wheel>
          <div class="bb-quiz-head">
            <div>
              <span class="bb-quiz-eyebrow">KUIS SINGKAT • ${escapeHtml(quiz.subject)}</span>
              <h3 class="bb-quiz-title">${escapeHtml(quiz.title)}</h3>
              <p class="bb-quiz-sub">Jawab 3 soal pilihan ganda dan 2 essay singkat di bawah, lalu klik <strong>Periksa Jawaban</strong> untuk melihat nilai dan kunci jawaban yang benar.</p>
            </div>
            ${onClose ? `<button type="button" class="bb-quiz-modal-close" data-action="close-modal" aria-label="Tutup kuis">&times;</button>` : ""}
          </div>

          ${summaryHtml}

          <div class="bb-quiz-scroll" data-scrollable="true">
            ${viewState === "form" ? (() => { const curProf = getSavedProfile(); return `
              <div class="bb-quiz-identity">
                <input type="text" class="bb-quiz-input" data-field="name" placeholder="Nama Siswa (opsional)" value="${escapeHtml(curProf.name)}" />
                <input type="text" class="bb-quiz-input" data-field="class" placeholder="Kelas (misal: XI DKV 1)" value="${escapeHtml(curProf.className)}" />
              </div>
            `; })() : ""}

            <div class="bb-quiz-section-tag">Bagian A — Pilihan Ganda (${quiz.mcq.length} Soal)</div>
            ${mcqHtml}

            <div class="bb-quiz-section-tag">Bagian B — Essay Singkat (${quiz.essay.length} Soal)</div>
            ${essayHtml}
          </div>

          ${errorMsg ? `<div class="bb-quiz-error">${escapeHtml(errorMsg)}</div>` : ""}

          <div class="bb-quiz-actions">
            ${viewState === "form" ? `
              <button type="button" class="bb-quiz-btn bb-quiz-btn-primary" data-action="submit-quiz">
                Periksa &amp; Lihat Jawaban Benar
              </button>
            ` : `
              <button type="button" class="bb-quiz-btn bb-quiz-btn-ghost" data-action="retry-quiz">
                Kerjakan Ulang Kuis
              </button>
            `}
            ${onClose ? `<button type="button" class="bb-quiz-btn bb-quiz-btn-ghost" data-action="close-modal">Tutup</button>` : ""}
          </div>
        </div>
      `;

      container.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
        btn.addEventListener("click", () => onClose && onClose());
      });

      const submitBtn = container.querySelector('[data-action="submit-quiz"]');
      if (submitBtn) {
        submitBtn.addEventListener("click", () => {
          const nameInput = container.querySelector('[data-field="name"]');
          const classInput = container.querySelector('[data-field="class"]');
          const stuName = nameInput ? nameInput.value.trim() : profile.name;
          const stuClass = classInput ? classInput.value.trim() : profile.className;
          saveProfile(stuName, stuClass);

          const mcqAnswers = {};
          const essayAnswers = {};
          const missing = [];

          quiz.mcq.forEach(q => {
            const checked = container.querySelector(`input[name="bbq_${weekId}_${q.id}"]:checked`);
            if (checked) mcqAnswers[q.id] = parseInt(checked.value, 10);
            else missing.push(q.id);
          });

          quiz.essay.forEach(q => {
            const ta = container.querySelector(`textarea[data-essay-id="${q.id}"]`);
            const val = ta ? ta.value.trim() : "";
            essayAnswers[q.id] = val;
            if (val.length < 3) missing.push(q.id);
          });

          if (missing.length > 0) {
            // Preserve current inputs in DOM without wiping them
            container.querySelectorAll(".bb-quiz-qcard").forEach(el => {
              el.classList.toggle("is-missing", missing.includes(el.getAttribute("data-qid")));
            });
            let errEl = container.querySelector(".bb-quiz-error");
            if (!errEl) {
              errEl = document.createElement("div");
              errEl.className = "bb-quiz-error";
              const actEl = container.querySelector(".bb-quiz-actions");
              if (actEl && actEl.parentNode) actEl.parentNode.insertBefore(errEl, actEl);
            }
            errEl.textContent = `Masih ada ${missing.length} soal yang belum diisi. Lengkapi semua pilihan ganda dan essay singkat terlebih dahulu.`;
            const firstMiss = container.querySelector(`.bb-quiz-qcard[data-qid="${missing[0]}"]`);
            if (firstMiss && firstMiss.scrollIntoView) {
              firstMiss.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
            if (onUpdate) onUpdate();
            return;
          }

          saved = gradeSubmission(weekId, mcqAnswers, essayAnswers, stuName, stuClass);
          saveResult(weekId, saved);
          viewState = "result";
          draw("", []);
          if (typeof options.onSubmitted === "function") options.onSubmitted(saved);
          if (onUpdate) onUpdate();
        });
      }

      const retryBtn = container.querySelector('[data-action="retry-quiz"]');
      if (retryBtn) {
        retryBtn.addEventListener("click", () => {
          viewState = "form";
          draw("", []);
          if (onUpdate) onUpdate();
        });
      }

      if (onUpdate) setTimeout(onUpdate, 40);
    }

    draw("", []);
  }

  function openModal(weekId, theme) {
    if (typeof document === "undefined" || !QUIZ_BANK[weekId]) return;
    injectStyles();

    const existing = document.getElementById("bbQuizModalOverlay");
    if (existing) existing.remove();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const backdrop = document.createElement("div");
    backdrop.id = "bbQuizModalOverlay";
    backdrop.className = "bb-quiz-modal-backdrop";
    backdrop.setAttribute("data-lenis-prevent", "");
    backdrop.setAttribute("data-lenis-prevent-touch", "");
    backdrop.setAttribute("data-lenis-prevent-wheel", "");

    const dialog = document.createElement("div");
    dialog.className = "bb-quiz-modal-dialog";
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    function close() {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prevOverflow;
      backdrop.remove();
      refreshCatalogBadges();
    }

    function onEsc(e) {
      if (e.key === "Escape") close();
    }

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) close();
    });
    document.addEventListener("keydown", onEsc);

    renderQuizInto(dialog, weekId, {
      theme: theme || "dark",
      onClose: close,
      onSubmitted: refreshCatalogBadges
    });
  }

  function refreshCatalogBadges() {
    if (typeof document === "undefined") return;
    document.querySelectorAll("[data-quiz-trigger]").forEach(btn => {
      const wid = btn.getAttribute("data-quiz-trigger");
      const res = getSavedScore(wid);
      if (res) {
        btn.innerHTML = `Kuis Singkat <span class="bb-quiz-badge-done">Skor ${res.score}</span>`;
      } else {
        btn.textContent = "Kuis Singkat (5 Soal)";
      }
    });
  }

  global.BinaBangsaQuiz = {
    QUIZ_BANK,
    getQuiz: (weekId) => QUIZ_BANK[weekId] || null,
    getSavedScore,
    gradeSubmission,
    renderInline: renderQuizInto,
    openModal,
    refreshCatalogBadges
  };

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", refreshCatalogBadges);
    } else {
      refreshCatalogBadges();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
