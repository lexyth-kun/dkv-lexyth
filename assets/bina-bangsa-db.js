(function (global) {
  "use strict";

  const DB_KEY = "BB_NEXUS_PORTAL_V1";
  const SESSION_KEY = "BB_NEXUS_SESSION_V1";
  const GAS_URL_KEY = "DKV_GAS_WEBAPP_URL";
  const GAS_MANUAL_KEY = "DKV_GAS_MANUAL_OVERRIDE";
  const PENDING_CLOUD_KEY = "BB_NEXUS_PENDING_CLOUD_V1";
  const ACTIVE_SUBJECT_KEY = "BB_NEXUS_ACTIVE_SUBJECT_V1";
  const SEED_BASELINE_TS = "2026-01-01T00:00:00.000Z";
  const REQUIRED_GAS_VERSION = 4.0;
  let cachedDriveConfigUrl = "";
  const DEFAULT_STUDENT_PASS = "123456";
  const MAX_GRADEBOOK_SLOTS = 10; // Maksimal 10 slot per mata pelajaran
  const MAX_TOTAL_GRADEBOOK_SLOTS = 40;

  // ============================================================================
  // KELAS & MATA PELAJARAN RESMI (KHUSUS X DKV 1-3 & XI DKV 1-3)
  // ============================================================================
  const ALLOWED_CLASSES = [
    "X DKV 1", "X DKV 2", "X DKV 3",
    "XI DKV 1", "XI DKV 2", "XI DKV 3"
  ];

  const CLASS_MATRIX = {
    grades: ["X", "XI"],
    majors: [
      { code: "DKV", label: "Desain Komunikasi Visual", rombels: ["1", "2", "3"] }
    ]
  };

  const GRADE_XI_SUBJECTS = [
    {
      key: "editing_audio_video",
      code: "EAV",
      label: "Editing Audio & Video",
      shortLabel: "Editing Audio & Video",
      desc: "Premiere Pro • Pengolahan Audio & Video (Kelas XI DKV)"
    },
    {
      key: "perangkat_lunak",
      code: "PL",
      label: "Perangkat Lunak",
      shortLabel: "Perangkat Lunak",
      desc: "After Effects • Perangkat Lunak Desain (Kelas XI DKV)"
    }
  ];

  const GRADE_X_DEFAULT_SUBJECT = {
    key: "dkv_x",
    code: "DKVX",
    label: "Dasar-Dasar DKV (Kelas X)",
    shortLabel: "Kelas X DKV",
    desc: "Mata Pelajaran Produktif Kelas X DKV"
  };

  const ALL_SUBJECTS = [...GRADE_XI_SUBJECTS, GRADE_X_DEFAULT_SUBJECT];

  function buildDefaultSlotsForSubject(subjKey) {
    if (subjKey === "perangkat_lunak") {
      return [
        { id: "PL_T01", slotNum: 1, subjectKey: "perangkat_lunak", subject: "Perangkat Lunak", title: "Tugas 1 — Workspace & Dasar Keyframe After Effects", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "ae-01", updatedAt: SEED_BASELINE_TS },
        { id: "PL_T02", slotNum: 2, subjectKey: "perangkat_lunak", subject: "Perangkat Lunak", title: "Tugas 2 — 10 Teknik Teks Animasi After Effects", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "ae-02", updatedAt: SEED_BASELINE_TS },
        { id: "PL_T03", slotNum: 3, subjectKey: "perangkat_lunak", subject: "Perangkat Lunak", title: "Tugas 3 — Desain Aset Logo Studio (.PNG / Vektor)", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "ae-03", updatedAt: SEED_BASELINE_TS },
        { id: "PL_T04", slotNum: 4, subjectKey: "perangkat_lunak", subject: "Perangkat Lunak", title: "Tugas 4 — Konsep & Animasi Logo Motion", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "ae-04", updatedAt: SEED_BASELINE_TS },
        { id: "PL_T05", slotNum: 5, subjectKey: "perangkat_lunak", subject: "Perangkat Lunak", title: "Tugas 5 — Komposisi 3D, Lighting & Final Render Bumper", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "ae-06", updatedAt: SEED_BASELINE_TS },
        { id: "PL_T06", slotNum: 6, subjectKey: "perangkat_lunak", subject: "Perangkat Lunak", title: "Presentasi Karya Perangkat Lunak", category: "Presentasi", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "PL_T07", slotNum: 7, subjectKey: "perangkat_lunak", subject: "Perangkat Lunak", title: "Ulangan Harian 1 (Perangkat Lunak)", category: "Ulangan Harian", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "PL_T08", slotNum: 8, subjectKey: "perangkat_lunak", subject: "Perangkat Lunak", title: "Ulangan Harian 2 (Perangkat Lunak)", category: "Ulangan Harian", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "PL_T09", slotNum: 9, subjectKey: "perangkat_lunak", subject: "Perangkat Lunak", title: "Kuis Pemahaman Perangkat Lunak", category: "Kuis", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "PL_T10", slotNum: 10, subjectKey: "perangkat_lunak", subject: "Perangkat Lunak", title: "Penilaian Lainnya (Praktik / Sikap)", category: "Lainnya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS }
      ];
    }
    if (subjKey === "dkv_x") {
      return [
        { id: "DKVX_T01", slotNum: 1, subjectKey: "dkv_x", subject: "Dasar-Dasar DKV (Kelas X)", title: "Tugas Karya 1 — Dasar Desain & Komposisi", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "DKVX_T02", slotNum: 2, subjectKey: "dkv_x", subject: "Dasar-Dasar DKV (Kelas X)", title: "Tugas Karya 2 — Tipografi & Tata Letak", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "DKVX_T03", slotNum: 3, subjectKey: "dkv_x", subject: "Dasar-Dasar DKV (Kelas X)", title: "Tugas Karya 3 — Ilustrasi & Warna", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "DKVX_T04", slotNum: 4, subjectKey: "dkv_x", subject: "Dasar-Dasar DKV (Kelas X)", title: "Tugas Karya 4 — Fotografi Dasar", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "DKVX_T05", slotNum: 5, subjectKey: "dkv_x", subject: "Dasar-Dasar DKV (Kelas X)", title: "Tugas Karya 5 — Proyek Akhir DKV X", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "DKVX_T06", slotNum: 6, subjectKey: "dkv_x", subject: "Dasar-Dasar DKV (Kelas X)", title: "Presentasi Karya Kelas X", category: "Presentasi", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "DKVX_T07", slotNum: 7, subjectKey: "dkv_x", subject: "Dasar-Dasar DKV (Kelas X)", title: "Ulangan Harian 1", category: "Ulangan Harian", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "DKVX_T08", slotNum: 8, subjectKey: "dkv_x", subject: "Dasar-Dasar DKV (Kelas X)", title: "Ulangan Harian 2", category: "Ulangan Harian", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "DKVX_T09", slotNum: 9, subjectKey: "dkv_x", subject: "Dasar-Dasar DKV (Kelas X)", title: "Kuis Pemahaman Materi", category: "Kuis", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
        { id: "DKVX_T10", slotNum: 10, subjectKey: "dkv_x", subject: "Dasar-Dasar DKV (Kelas X)", title: "Penilaian Lainnya (Praktik / Sikap)", category: "Lainnya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS }
      ];
    }
    // Default: editing_audio_video
    return [
      { id: "EAV_T01", slotNum: 1, subjectKey: "editing_audio_video", subject: "Editing Audio & Video", title: "Tugas Karya 1 — Pra-Produksi & Storyboard", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "pr-01", updatedAt: SEED_BASELINE_TS },
      { id: "EAV_T02", slotNum: 2, subjectKey: "editing_audio_video", subject: "Editing Audio & Video", title: "Tugas Karya 2 — Rough Cut & Manajemen Folder", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "pr-02", updatedAt: SEED_BASELINE_TS },
      { id: "EAV_T03", slotNum: 3, subjectKey: "editing_audio_video", subject: "Editing Audio & Video", title: "Tugas Karya 3 — Editing Audio & Breaking News", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "pr-03", updatedAt: SEED_BASELINE_TS },
      { id: "EAV_T04", slotNum: 4, subjectKey: "editing_audio_video", subject: "Editing Audio & Video", title: "Tugas Karya 4 — Grafis Berita Lower Third & Running Text", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "pr-04", updatedAt: SEED_BASELINE_TS },
      { id: "EAV_T05", slotNum: 5, subjectKey: "editing_audio_video", subject: "Editing Audio & Video", title: "Tugas Karya 5 — B-Roll, Color Grading & Final Export", category: "Tugas Karya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "pr-06", updatedAt: SEED_BASELINE_TS },
      { id: "EAV_T06", slotNum: 6, subjectKey: "editing_audio_video", subject: "Editing Audio & Video", title: "Presentasi Karya Editing Audio & Video", category: "Presentasi", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
      { id: "EAV_T07", slotNum: 7, subjectKey: "editing_audio_video", subject: "Editing Audio & Video", title: "Ulangan Harian 1 (Editing Audio & Video)", category: "Ulangan Harian", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
      { id: "EAV_T08", slotNum: 8, subjectKey: "editing_audio_video", subject: "Editing Audio & Video", title: "Ulangan Harian 2 (Editing Audio & Video)", category: "Ulangan Harian", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
      { id: "EAV_T09", slotNum: 9, subjectKey: "editing_audio_video", subject: "Editing Audio & Video", title: "Kuis Pemahaman Editing Audio & Video", category: "Kuis", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS },
      { id: "EAV_T10", slotNum: 10, subjectKey: "editing_audio_video", subject: "Editing Audio & Video", title: "Penilaian Lainnya (Praktik / Sikap)", category: "Lainnya", maxScore: 100, kkm: 75, date: "", classScope: "ALL", linkedTaskId: "", updatedAt: SEED_BASELINE_TS }
    ];
  }

  const DEFAULT_GRADEBOOK_SLOTS_BY_SUBJECT = {
    editing_audio_video: buildDefaultSlotsForSubject("editing_audio_video"),
    perangkat_lunak: buildDefaultSlotsForSubject("perangkat_lunak"),
    dkv_x: buildDefaultSlotsForSubject("dkv_x")
  };

  const DEFAULT_GRADEBOOK_SLOTS = [
    ...DEFAULT_GRADEBOOK_SLOTS_BY_SUBJECT.editing_audio_video,
    ...DEFAULT_GRADEBOOK_SLOTS_BY_SUBJECT.perangkat_lunak,
    ...DEFAULT_GRADEBOOK_SLOTS_BY_SUBJECT.dkv_x
  ];

  const DEFAULT_ADRIAN_SCHEDULE = [
    { id: "SCH-SENIN", dayOfWeek: 1, dayLabel: "Senin", start: "12.30", end: "14.20", classCode: "XI DKV 1", note: "Reguler" },
    { id: "SCH-SELASA", dayOfWeek: 2, dayLabel: "Selasa", start: "13.05", end: "14.20", altStart: "12.30", altEnd: "14.20", classCode: "XI DKV 3", note: "Tukar jam ke-1: 12.30 – 14.20 WIB" },
    { id: "SCH-RABU", dayOfWeek: 3, dayLabel: "Rabu", start: "14.05", end: "15.35", classCode: "XI DKV 2", note: "Reguler" },
    { id: "SCH-KAMIS", dayOfWeek: 4, dayLabel: "Kamis", start: "16.00", end: "16.30", classCode: "XI DKV 3", note: "Reguler" }
  ];

  // ============================================================================
  // CLOUD SYNC STATE & LISTENERS
  // ============================================================================
  const syncStateListeners = [];
  const cloudCapabilities = {
    checked: false,
    nexusSupported: false,
    gradebookSupported: false,
    v4Supported: false,
    version: "",
    versionNum: 0,
    lastSyncAt: "",
    lastSyncState: "idle", // idle | syncing | synced | needs_gas_update | offline | error
    pendingCount: 0,
    lastError: ""
  };

  function emitSyncState() {
    cloudCapabilities.pendingCount = readPendingQueue().length;
    const snap = { ...cloudCapabilities };
    syncStateListeners.forEach(fn => {
      try { fn(snap); } catch (e) {}
    });
  }

  function onSyncStateChange(cb) {
    if (typeof cb === "function") {
      syncStateListeners.push(cb);
      try { cb({ ...cloudCapabilities }); } catch (e) {}
    }
  }

  function updateSyncState(partial) {
    Object.assign(cloudCapabilities, partial || {});
    emitSyncState();
    return { ...cloudCapabilities };
  }

  function setCloudCapabilities(data) {
    cloudCapabilities.checked = true;
    const supported = !!(data && (data.portalName === "Bina Bangsa Nexus" || data.nexusVersion || data.portalDb));
    const version = (data && data.nexusVersion) ? String(data.nexusVersion) : "";
    const versionNum = parseFloat(version || "0") || 0;
    const v4Supported = supported && versionNum >= REQUIRED_GAS_VERSION;
    const gradebookSupported = supported && versionNum >= 3.2;
    cloudCapabilities.nexusSupported = supported;
    cloudCapabilities.version = version;
    cloudCapabilities.versionNum = versionNum;
    cloudCapabilities.v4Supported = v4Supported;
    cloudCapabilities.gradebookSupported = gradebookSupported;
    if (!supported || !v4Supported) {
      cloudCapabilities.lastSyncState = "needs_gas_update";
    } else if (cloudCapabilities.lastSyncState === "needs_gas_update" || cloudCapabilities.lastSyncState === "idle") {
      cloudCapabilities.lastSyncState = "synced";
      cloudCapabilities.lastSyncAt = new Date().toISOString();
    }
    emitSyncState();
    return { ...cloudCapabilities };
  }

  function getCloudCapabilities() {
    cloudCapabilities.pendingCount = readPendingQueue().length;
    return { ...cloudCapabilities };
  }

  function resetCloudCapabilities() {
    cloudCapabilities.checked = false;
    cloudCapabilities.nexusSupported = false;
    cloudCapabilities.gradebookSupported = false;
    cloudCapabilities.v4Supported = false;
    cloudCapabilities.version = "";
    cloudCapabilities.versionNum = 0;
    cloudCapabilities.lastSyncState = "idle";
    cloudCapabilities.lastError = "";
    emitSyncState();
    return { ...cloudCapabilities };
  }

  function setManualGasUrl(url) {
    try {
      const clean = String(url || "").trim();
      if (clean && clean.startsWith("https://script.google.com/")) {
        localStorage.setItem(GAS_URL_KEY, clean);
        localStorage.setItem(GAS_MANUAL_KEY, "1");
      } else {
        localStorage.removeItem(GAS_URL_KEY);
        localStorage.removeItem(GAS_MANUAL_KEY);
        cachedDriveConfigUrl = "";
      }
    } catch (e) {}
    resetCloudCapabilities();
  }

  function getSavedActiveSubject() {
    try {
      const s = localStorage.getItem(ACTIVE_SUBJECT_KEY);
      if (s === "editing_audio_video" || s === "perangkat_lunak") return s;
    } catch (e) {}
    return "editing_audio_video";
  }

  function saveActiveSubject(subjKey) {
    const clean = subjKey === "perangkat_lunak" ? "perangkat_lunak" : "editing_audio_video";
    try { localStorage.setItem(ACTIVE_SUBJECT_KEY, clean); } catch (e) {}
    return clean;
  }

  // ============================================================================
  // CLASS & SUBJECT HELPERS
  // ============================================================================
  function canonicalClassCode(raw) {
    const s = String(raw || "").trim().replace(/\s+/g, " ");
    const u = s.toUpperCase();
    if (!u) return "XI DKV 1";
    if (u === "DKV1" || u === "XIDKV1" || u === "KELAS XI - 1" || u === "XI-1" || u === "XI - 1" || u === "XI DKV 1") return "XI DKV 1";
    if (u === "DKV2" || u === "XIDKV2" || u === "KELAS XI - 2" || u === "XI-2" || u === "XI - 2" || u === "XI DKV 2") return "XI DKV 2";
    if (u === "DKV3" || u === "XIDKV3" || u === "KELAS XI - 3" || u === "XI-3" || u === "XI - 3" || u === "XI DKV 3") return "XI DKV 3";
    if (u === "XDKV1" || u === "KELAS X - 1" || u === "X-1" || u === "X - 1" || u === "X DKV 1") return "X DKV 1";
    if (u === "XDKV2" || u === "KELAS X - 2" || u === "X-2" || u === "X - 2" || u === "X DKV 2") return "X DKV 2";
    if (u === "XDKV3" || u === "KELAS X - 3" || u === "X-3" || u === "X - 3" || u === "X DKV 3") return "X DKV 3";
    const compactMatch = u.match(/^(XI|X)([A-Z]{2,5})(\d+)$/);
    if (compactMatch) return compactMatch[1] + " " + compactMatch[2] + " " + compactMatch[3];
    return u;
  }

  function isAllowedClassCode(cls) {
    return ALLOWED_CLASSES.includes(canonicalClassCode(cls));
  }

  function isGradeXIClass(cls) {
    return canonicalClassCode(cls).startsWith("XI ");
  }

  function isGradeXClass(cls) {
    return canonicalClassCode(cls).startsWith("X ");
  }

  function legacyClassKey(classCode) {
    const c = canonicalClassCode(classCode);
    if (c === "XI DKV 1") return "DKV1";
    if (c === "XI DKV 2") return "DKV2";
    if (c === "XI DKV 3") return "DKV3";
    if (c === "X DKV 1") return "XDKV1";
    if (c === "X DKV 2") return "XDKV2";
    if (c === "X DKV 3") return "XDKV3";
    return c;
  }

  function parseClassParts(classCode) {
    const c = canonicalClassCode(classCode);
    const m = c.match(/^(X|XI)\s+([A-Z]+)\s*(\d+)?/i);
    if (m) {
      return { gradeLevel: m[1].toUpperCase(), major: m[2].toUpperCase(), rombel: m[3] || "1" };
    }
    return { gradeLevel: "XI", major: "DKV", rombel: "1" };
  }

  function resolveSubjectKey(rawSubj, classCode) {
    if (classCode && classCode !== "ALL" && isGradeXClass(classCode)) {
      return "dkv_x";
    }
    const s = String(rawSubj || "").trim().toLowerCase();
    if (s === "dkv_x" || s === "dkvx" || s === "kelas_x_dkv" || s.includes("kelas x") || s.includes("dasar-dasar dkv")) {
      return "dkv_x";
    }
    if (
      s === "perangkat_lunak" ||
      s === "after_effects" ||
      s === "pl" ||
      s === "ae" ||
      s.includes("perangkat lunak") ||
      s.includes("after effects") ||
      s.includes("after_effects") ||
      s.includes("motion")
    ) {
      return "perangkat_lunak";
    }
    return "editing_audio_video";
  }

  function getSubjectMeta(subjKey, classCode) {
    const k = resolveSubjectKey(subjKey, classCode);
    return ALL_SUBJECTS.find(x => x.key === k) || GRADE_XI_SUBJECTS[0];
  }

  function getSubjectsForClass(classCode) {
    if (classCode && classCode !== "ALL" && isGradeXClass(classCode)) {
      return [GRADE_X_DEFAULT_SUBJECT];
    }
    return GRADE_XI_SUBJECTS.slice();
  }

  function inferSlotSubjectKey(slot) {
    if (!slot) return "editing_audio_video";
    if (slot.subjectKey) return resolveSubjectKey(slot.subjectKey, slot.classScope && slot.classScope !== "ALL" ? slot.classScope : "");
    const idStr = String(slot.id || "").toUpperCase();
    if (idStr.startsWith("PL_")) return "perangkat_lunak";
    if (idStr.startsWith("DKVX_")) return "dkv_x";
    if (idStr.startsWith("EAV_")) return "editing_audio_video";
    const linked = String(slot.linkedTaskId || "").toLowerCase();
    if (linked.startsWith("ae-")) return "perangkat_lunak";
    const combined = `${slot.subject || ""} ${slot.title || ""}`;
    if (/perangkat lunak|after effects|\bae\b/i.test(combined)) return "perangkat_lunak";
    if (slot.classScope && slot.classScope !== "ALL" && isGradeXClass(slot.classScope)) return "dkv_x";
    return "editing_audio_video";
  }

  function inferSubmissionSubjectKey(sub) {
    if (!sub || typeof sub !== "object") return "editing_audio_video";
    const cls = canonicalClassCode(sub.class_code || sub.className || sub.class_name || "XI DKV 1");
    if (isGradeXClass(cls)) return "dkv_x";
    if (sub.subjectKey) return resolveSubjectKey(sub.subjectKey, cls);
    const tid = String(sub.task_id || sub.taskId || "").toLowerCase();
    if (tid.startsWith("ae-") || tid === "t-05" || tid === "t-06" || tid === "t-07") return "perangkat_lunak";
    if (tid.startsWith("pr-") || tid === "t-01" || tid === "t-02" || tid === "t-03" || tid === "t-04") return "editing_audio_video";
    const hay = `${sub.subject || ""} ${sub.task_title || sub.taskTitle || ""}`;
    if (/perangkat lunak|after effects|\bae\b|bumper|logo studio|10 teks/i.test(hay)) return "perangkat_lunak";
    return "editing_audio_video";
  }

  function getScheduledSlotForDay(teacher, dayIdx) {
    const day = typeof dayIdx === "number" ? dayIdx : getNowWibParts().dayOfWeek;
    const list = (teacher && Array.isArray(teacher.schedule)) ? teacher.schedule : [];
    return list.find(s => Number(s.dayOfWeek) === day) || null;
  }

  function getNowWibParts() {
    const now = new Date();
    try {
      const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Jakarta",
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
      const map = {};
      fmt.formatToParts(now).forEach(p => { if (p.type !== "literal") map[p.type] = p.value; });
      const wdMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      const hr = parseInt(map.hour, 10) % 24;
      const mn = parseInt(map.minute, 10) || 0;
      return {
        dayOfWeek: wdMap[map.weekday] !== undefined ? wdMap[map.weekday] : now.getDay(),
        dateKey: `HARI_${map.year}${map.month}${map.day}`,
        minutes: hr * 60 + mn
      };
    } catch (e) {
      const y = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, "0");
      const dy = String(now.getDate()).padStart(2, "0");
      return {
        dayOfWeek: now.getDay(),
        dateKey: `HARI_${y}${mo}${dy}`,
        minutes: now.getHours() * 60 + now.getMinutes()
      };
    }
  }

  function parseTimeMinutes(str) {
    const m = String(str || "").match(/(\d{1,2})[.:](\d{2})/);
    if (!m) return 0;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }

  function normalizeNis(nis) {
    return String(nis || "").trim();
  }

  function compactNisDigits(nis) {
    return String(nis || "").replace(/[^0-9a-zA-Z]/g, "").toLowerCase();
  }

  function normalizeWeekKey(wk) {
    const s = String(wk || "M01").trim().toUpperCase();
    if (/^M0[1-7]$/.test(s)) return s;
    const m = s.match(/(\d+)/);
    if (m) {
      const n = Math.max(1, Math.min(7, parseInt(m[1], 10)));
      return "M0" + n;
    }
    return "M01";
  }

  function getDefaultSessionKey() {
    return "M01";
  }

  function getTodaySessionKey() {
    return getDefaultSessionKey();
  }

  function formatTimeWIB(isoOrDate) {
    try {
      const d = isoOrDate ? new Date(isoOrDate) : new Date();
      return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    } catch (e) {
      return "-";
    }
  }

  function attendanceKey(classCode, weekKey, nis, subjectKey) {
    const cls = canonicalClassCode(classCode);
    const subj = resolveSubjectKey(subjectKey, cls);
    return `${cls}__${subj}__${normalizeWeekKey(weekKey || getTodaySessionKey())}__${normalizeNis(nis)}`;
  }

  function getAllClassCodes() {
    return ALLOWED_CLASSES.slice();
  }

  function readDbRaw() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function writeDbRaw(db) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {}
  }

  function isNewerTs(incomingTs, existingTs) {
    const inc = String(incomingTs || "").trim();
    const ext = String(existingTs || "").trim();
    if (!ext) return true;
    if (!inc) return false;
    return inc > ext;
  }

  function isNewerOrEqualTs(incomingTs, existingTs) {
    const inc = String(incomingTs || "").trim();
    const ext = String(existingTs || "").trim();
    if (!ext) return true;
    if (!inc) return false;
    return inc >= ext;
  }

  // ============================================================================
  // LOSSLESS MIGRATION TO v4 (MULTI-MAPEL + STRICT X/XI DKV 1-3)
  // ============================================================================
  function migrateDbToV4(db) {
    if (!db || typeof db !== "object") return;
    if (!db.gradebookDeletedSlots || typeof db.gradebookDeletedSlots !== "object" || Array.isArray(db.gradebookDeletedSlots)) {
      db.gradebookDeletedSlots = {};
    }
    if (!db.directGrades || typeof db.directGrades !== "object" || Array.isArray(db.directGrades)) {
      db.directGrades = {};
    }
    if (!db.learningProgress || typeof db.learningProgress !== "object" || Array.isArray(db.learningProgress)) {
      db.learningProgress = {};
    }
    if (!db.learningProgressTs || typeof db.learningProgressTs !== "object" || Array.isArray(db.learningProgressTs)) {
      db.learningProgressTs = {};
    }

    // 1. Bersihkan customClasses & filter kelas ajar guru agar hanya X DKV 1-3 & XI DKV 1-3
    db.customClasses = [];
    (db.teachers || []).forEach(t => {
      if (!t) return;
      const oldList = Array.isArray(t.taughtClasses) ? t.taughtClasses : [];
      const clean = [...new Set(oldList.map(canonicalClassCode).filter(isAllowedClassCode))];
      if (t.id === "GURU-ADRIAN" && (!db.schemaVersion || db.schemaVersion < 4)) {
        const wasOldDefault = clean.length === 0 || (clean.length === 3 && clean.every(c => c.startsWith("XI DKV ")));
        t.taughtClasses = wasOldDefault ? ALLOWED_CLASSES.slice() : clean;
        t.subject = "Editing Audio & Video • Perangkat Lunak (DKV)";
        if (!t.updatedAt) t.updatedAt = SEED_BASELINE_TS;
      } else {
        t.taughtClasses = clean.length ? clean : ["XI DKV 1", "XI DKV 2", "XI DKV 3"];
      }
    });

    // 2. Migrasi attendanceLogs dari kunci lama 3-bagian ke 4-bagian (berisi subjectKey)
    const migratedAtt = {};
    Object.values(db.attendanceLogs || {}).forEach(entry => {
      if (!entry || !entry.nis || entry.method === "Rekap Lab Awal") return;
      const cls = canonicalClassCode(entry.classCode || "XI DKV 1");
      if (!isAllowedClassCode(cls)) return;
      const wk = normalizeWeekKey(entry.weekKey || "M01");
      const nis = normalizeNis(entry.nis);
      const subj = resolveSubjectKey(entry.subjectKey || entry.subject || entry.note || "", cls);
      const newKey = attendanceKey(cls, wk, nis, subj);
      const norm = Object.assign({}, entry, {
        key: newKey,
        classCode: cls,
        subjectKey: subj,
        subjectLabel: getSubjectMeta(subj, cls).label,
        weekKey: wk,
        nis: nis,
        updatedAt: entry.updatedAt || SEED_BASELINE_TS
      });
      if (!migratedAtt[newKey] || isNewerOrEqualTs(norm.updatedAt, migratedAtt[newKey].updatedAt)) {
        migratedAtt[newKey] = norm;
      }
    });
    db.attendanceLogs = migratedAtt;

    // 3. Migrasi qrSessions agar selalu membawa subjectKey
    (db.qrSessions || []).forEach(q => {
      if (!q) return;
      q.classCode = canonicalClassCode(q.classCode || "XI DKV 1");
      q.weekKey = normalizeWeekKey(q.weekKey || "M01");
      q.subjectKey = resolveSubjectKey(q.subjectKey || q.subject || "", q.classCode);
      q.subject = getSubjectMeta(q.subjectKey, q.classCode).label;
    });

    // 4. Migrasi gradebookSlots & directGrades lama (T01..T10) -> EAV_Txx / PL_Txx / DKVX_Txx tanpa hilang nilai
    const oldSlots = Array.isArray(db.gradebookSlots) ? db.gradebookSlots : [];
    const slotIdRemap = {};
    const newSlotsById = {};
    const nowMigrationIso = new Date().toISOString();

    oldSlots.forEach(sl => {
      if (!sl || !sl.id) return;
      const rawId = String(sl.id).trim();
      const subjKey = inferSlotSubjectKey(sl);
      const meta = getSubjectMeta(subjKey);
      let nextId = rawId;
      if (!/^(EAV_|PL_|DKVX_)/i.test(rawId)) {
        nextId = `${meta.code}_${rawId}`;
      }
      slotIdRemap[rawId] = { id: nextId, subjectKey: subjKey };

      // Jika slot berasal dari default lama yang belum pernah diedit user, pakai timestamp baseline agar template baru bersih
      const isLegacyDefaultTs = sl.updatedAt === "2026-11-24T08:00:00.000Z";
      const migratedSlot = Object.assign({}, sl, {
        id: nextId,
        subjectKey: subjKey,
        subject: meta.label,
        classScope: sl.classScope && sl.classScope !== "ALL" && isAllowedClassCode(sl.classScope)
          ? canonicalClassCode(sl.classScope)
          : "ALL",
        updatedAt: isLegacyDefaultTs ? SEED_BASELINE_TS : (sl.updatedAt || SEED_BASELINE_TS)
      });
      if (!newSlotsById[nextId] || isNewerOrEqualTs(migratedSlot.updatedAt, newSlotsById[nextId].updatedAt)) {
        newSlotsById[nextId] = migratedSlot;
      }
    });

    // Pastikan setiap mapel (Editing Audio & Video, Perangkat Lunak, Kelas X DKV) memiliki template default jika masih kosong / belum lengkap
    ["editing_audio_video", "perangkat_lunak", "dkv_x"].forEach(subjKey => {
      const existingForSubj = Object.values(newSlotsById).filter(s => s.subjectKey === subjKey);
      const defaults = buildDefaultSlotsForSubject(subjKey);
      if (existingForSubj.length === 0) {
        defaults.forEach(tpl => {
          if (!db.gradebookDeletedSlots[tpl.id]) {
            newSlotsById[tpl.id] = { ...tpl };
          }
        });
      } else if (!db.schemaVersion || db.schemaVersion < 4) {
        // Saat upgrade pertama dari v3 ke v4, lengkapi slot default yang belum ada untuk tiap mapel (maks 10/mapel)
        let curCount = existingForSubj.length;
        defaults.forEach(tpl => {
          if (curCount >= MAX_GRADEBOOK_SLOTS) return;
          if (!newSlotsById[tpl.id] && !db.gradebookDeletedSlots[tpl.id]) {
            newSlotsById[tpl.id] = { ...tpl };
            curCount++;
          }
        });
      }
    });

    // Susun ulang slotNum per subject (1..10)
    const finalSlots = [];
    ["editing_audio_video", "perangkat_lunak", "dkv_x"].forEach(subjKey => {
      const list = Object.values(newSlotsById)
        .filter(s => s && s.subjectKey === subjKey)
        .filter(s => {
          const delTs = db.gradebookDeletedSlots[s.id];
          return !(delTs && (!s.updatedAt || delTs > s.updatedAt));
        })
        .sort((a, b) => {
          const na = parseInt(String(a.id).replace(/\D/g, ""), 10) || Number(a.slotNum) || 99;
          const nb = parseInt(String(b.id).replace(/\D/g, ""), 10) || Number(b.slotNum) || 99;
          return na - nb;
        })
        .slice(0, MAX_GRADEBOOK_SLOTS);
      list.forEach((s, i) => {
        s.slotNum = i + 1;
        finalSlots.push(s);
      });
    });
    db.gradebookSlots = finalSlots;

    // Remap semua directGrades dengan lossless preservation
    const migratedGrades = {};
    Object.keys(db.directGrades || {}).forEach(oldKey => {
      const g = db.directGrades[oldKey];
      if (!g || typeof g !== "object") return;
      const origSlotId = String(g.slotId || oldKey.split("__")[0] || "").trim();
      const nis = normalizeNis(g.nis || oldKey.split("__")[1] || "");
      if (!origSlotId || !nis) return;

      const mapped = slotIdRemap[origSlotId];
      let nextSlotId = mapped ? mapped.id : origSlotId;
      let subjKey = mapped ? mapped.subjectKey : resolveSubjectKey(g.subjectKey || "", g.classCode || "");
      if (!/^(EAV_|PL_|DKVX_)/i.test(nextSlotId)) {
        const meta = getSubjectMeta(subjKey);
        nextSlotId = `${meta.code}_${nextSlotId}`;
      }
      if (nextSlotId.startsWith("PL_")) subjKey = "perangkat_lunak";
      else if (nextSlotId.startsWith("DKVX_")) subjKey = "dkv_x";
      else if (nextSlotId.startsWith("EAV_")) subjKey = "editing_audio_video";

      const newKey = gradeKey(nextSlotId, nis);
      const normGrade = Object.assign({}, g, {
        key: newKey,
        slotId: nextSlotId,
        subjectKey: subjKey,
        nis: nis,
        classCode: canonicalClassCode(g.classCode || "XI DKV 1"),
        updatedAt: g.updatedAt || nowMigrationIso
      });
      if (!migratedGrades[newKey] || isNewerOrEqualTs(normGrade.updatedAt, migratedGrades[newKey].updatedAt)) {
        migratedGrades[newKey] = normGrade;
      }
    });
    db.directGrades = migratedGrades;

    db.schemaVersion = 4;
  }

  function bootstrapDb(rawStudents, initialAttendance, legacyTeacher) {
    let db = readDbRaw();
    if (!db || typeof db !== "object") db = {};

    if (!Array.isArray(db.teachers)) db.teachers = [];
    if (!Array.isArray(db.students)) db.students = [];
    db.customClasses = [];
    if (!Array.isArray(db.qrSessions)) db.qrSessions = [];
    if (!db.attendanceLogs || typeof db.attendanceLogs !== "object" || Array.isArray(db.attendanceLogs)) {
      const converted = {};
      if (Array.isArray(db.attendanceLogs)) {
        db.attendanceLogs.forEach(item => {
          if (item && item.key) converted[item.key] = item;
        });
      }
      db.attendanceLogs = converted;
    }
    if (!Array.isArray(db.notifications)) db.notifications = [];
    if (!db.notifReadMap || typeof db.notifReadMap !== "object" || Array.isArray(db.notifReadMap)) db.notifReadMap = {};
    if (!db.studentNotifClasses || typeof db.studentNotifClasses !== "object" || Array.isArray(db.studentNotifClasses)) db.studentNotifClasses = {};
    if (!db.gradebookUpdatedAt) db.gradebookUpdatedAt = "";
    if (!Array.isArray(db.gradebookSlots)) db.gradebookSlots = [];
    if (!db.gradebookDeletedSlots || typeof db.gradebookDeletedSlots !== "object" || Array.isArray(db.gradebookDeletedSlots)) {
      db.gradebookDeletedSlots = {};
    }
    if (!db.directGrades || typeof db.directGrades !== "object" || Array.isArray(db.directGrades)) {
      db.directGrades = {};
    }
    db.notifications = db.notifications.filter(n => n && n.type === "class_start");

    // Seed primary teacher (Adrian Ali Muthi, S.Ds) dengan timestamp baseline agar edit cloud/user selalu menang
    const adrianIdx = db.teachers.findIndex(t => t && t.id === "GURU-ADRIAN");
    if (adrianIdx < 0) {
      db.teachers.unshift({
        id: "GURU-ADRIAN",
        name: (legacyTeacher && legacyTeacher.name && !String(legacyTeacher.name).includes("S.Sn")) ? legacyTeacher.name : "Adrian Ali Muthi, S.Ds",
        nip: (legacyTeacher && legacyTeacher.nip) || "19920815 202421 1 008",
        username: "adrian",
        password: (legacyTeacher && legacyTeacher.pass) || "guru123",
        pin: "201023",
        subject: "Editing Audio & Video • Perangkat Lunak (DKV)",
        taughtClasses: ALLOWED_CLASSES.slice(),
        schedule: DEFAULT_ADRIAN_SCHEDULE.map(x => ({ ...x })),
        createdAt: SEED_BASELINE_TS,
        updatedAt: SEED_BASELINE_TS
      });
    } else {
      if (!db.teachers[adrianIdx].name || String(db.teachers[adrianIdx].name).includes("S.Sn")) {
        db.teachers[adrianIdx].name = "Adrian Ali Muthi, S.Ds";
      }
      if (!Array.isArray(db.teachers[adrianIdx].schedule) || !db.teachers[adrianIdx].schedule.length) {
        db.teachers[adrianIdx].schedule = DEFAULT_ADRIAN_SCHEDULE.map(x => ({ ...x }));
      }
      if (!db.teachers[adrianIdx].updatedAt) {
        db.teachers[adrianIdx].updatedAt = SEED_BASELINE_TS;
      }
      if (legacyTeacher) {
        if (legacyTeacher.name && !String(legacyTeacher.name).includes("S.Sn")) {
          db.teachers[adrianIdx].name = legacyTeacher.name;
        }
        db.teachers[adrianIdx].nip = legacyTeacher.nip || db.teachers[adrianIdx].nip;
        if (legacyTeacher.pass) db.teachers[adrianIdx].password = legacyTeacher.pass;
      }
    }

    // Seed 108 DKV XI students dengan timestamp baseline agar edit/ganti sandi dari device lain tidak tertimpa seed baru
    if (rawStudents && typeof rawStudents === "object") {
      ["DKV1", "DKV2", "DKV3"].forEach(legKey => {
        const grp = rawStudents[legKey];
        if (!grp || !Array.isArray(grp.students)) return;
        const classCode = canonicalClassCode(legKey);
        const parts = parseClassParts(classCode);
        grp.students.forEach(st => {
          const nis = normalizeNis(st.induk);
          if (!nis) return;
          const existIdx = db.students.findIndex(x => normalizeNis(x.nis) === nis);
          if (existIdx < 0) {
            db.students.push({
              nis: nis,
              name: st.name,
              classCode: classCode,
              legacyClassKey: legKey,
              gradeLevel: parts.gradeLevel,
              major: parts.major,
              rombel: parts.rombel,
              gender: st.gender || "L",
              status: st.status || "aktif",
              password: DEFAULT_STUDENT_PASS,
              passwordChanged: false,
              updatedAt: SEED_BASELINE_TS
            });
          } else {
            if (!db.students[existIdx].password) db.students[existIdx].password = DEFAULT_STUDENT_PASS;
            if (!db.students[existIdx].classCode) db.students[existIdx].classCode = classCode;
            if (!db.students[existIdx].updatedAt) db.students[existIdx].updatedAt = SEED_BASELINE_TS;
          }
        });
      });
    }

    // Jalankan migrasi v4 lossless (multi-mapel + kelas X/XI DKV 1-3)
    migrateDbToV4(db);

    writeDbRaw(db);
    return db;
  }

  function saveDb(db) {
    writeDbRaw(db);
    return db;
  }

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function setSession(sessObj, remember) {
    try {
      if (!sessObj) {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        return;
      }
      const str = JSON.stringify(sessObj);
      if (remember) {
        localStorage.setItem(SESSION_KEY, str);
        sessionStorage.removeItem(SESSION_KEY);
      } else {
        sessionStorage.setItem(SESSION_KEY, str);
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {}
  }

  function authenticateTeacher(db, identifier, password) {
    const idTrim = String(identifier || "").trim().toLowerCase();
    const passTrim = String(password || "").trim();
    if (!passTrim) return null;

    const hit = (db.teachers || []).find(t => {
      if (!t) return false;
      const matchesId =
        !idTrim ||
        String(t.username || "").toLowerCase() === idTrim ||
        String(t.nip || "").toLowerCase() === idTrim ||
        String(t.name || "").toLowerCase() === idTrim ||
        String(t.name || "").toLowerCase().includes(idTrim);
      if (!matchesId) return false;
      return passTrim === String(t.password || "") || (t.pin && passTrim === String(t.pin));
    });
    if (hit) return hit;

    const adrian = (db.teachers || []).find(t => t && t.id === "GURU-ADRIAN");
    if (adrian && (passTrim === String(adrian.pin) || passTrim === String(adrian.password))) {
      return adrian;
    }
    return null;
  }

  function registerTeacher(db, payload) {
    const name = String(payload.name || "").trim();
    const nip = String(payload.nip || "").trim();
    const username = String(payload.username || nip || name.split(/\s+/)[0] || "guru")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "");
    const subject = String(payload.subject || "Editing Audio & Video • Perangkat Lunak").trim();
    const password = String(payload.password || "").trim();
    const rawClasses = Array.isArray(payload.taughtClasses) ? payload.taughtClasses : [];
    const taughtClasses = [...new Set(rawClasses.map(canonicalClassCode).filter(isAllowedClassCode))];

    if (!name || !password) {
      return { ok: false, error: "Nama lengkap dan kata sandi wajib diisi." };
    }
    const duplicate = (db.teachers || []).find(t =>
      (username && String(t.username || "").toLowerCase() === username) ||
      (nip && String(t.nip || "").toLowerCase() === nip.toLowerCase())
    );
    if (duplicate) {
      return { ok: false, error: "Username atau NIP guru sudah terdaftar. Silakan masuk melalui tab Masuk Guru." };
    }

    const nowIso = new Date().toISOString();
    const teacher = {
      id: "GURU-" + Date.now() + "-" + Math.random().toString(36).slice(2, 5).toUpperCase(),
      name,
      nip: nip || "-",
      username,
      password,
      subject,
      taughtClasses: taughtClasses.length ? taughtClasses : ["XI DKV 1", "XI DKV 2", "XI DKV 3"],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    db.teachers.push(teacher);
    saveDb(db);
    postCloudAction({ action: "register_teacher", teacher });
    return { ok: true, teacher };
  }

  function updateTeacherClasses(db, teacherId, taughtClasses) {
    const teacher = (db.teachers || []).find(t => t && t.id === teacherId);
    if (!teacher) return null;
    const clean = [...new Set((taughtClasses || []).map(canonicalClassCode).filter(isAllowedClassCode))];
    teacher.taughtClasses = clean.length ? clean : ["XI DKV 1", "XI DKV 2", "XI DKV 3"];
    teacher.updatedAt = new Date().toISOString();
    saveDb(db);
    postCloudAction({ action: "register_teacher", teacher });
    return teacher;
  }

  function findStudentByNis(db, nisInput) {
    const raw = normalizeNis(nisInput);
    if (!raw) return null;
    const exact = (db.students || []).find(s => normalizeNis(s.nis).toLowerCase() === raw.toLowerCase());
    if (exact) return exact;
    const compact = compactNisDigits(raw);
    if (!compact) return null;
    return (db.students || []).find(s => compactNisDigits(s.nis) === compact) || null;
  }

  function authenticateStudent(db, nisInput, passwordInput) {
    const stu = findStudentByNis(db, nisInput);
    if (!stu) return { ok: false, error: "NIS tidak ditemukan di database siswa SMK Bina Bangsa." };
    const pass = String(passwordInput || "").trim();
    const expected = String(stu.password || DEFAULT_STUDENT_PASS);
    if (!pass || pass !== expected) {
      return { ok: false, error: "Kata sandi salah. Password awal seluruh siswa adalah 123456." };
    }
    return { ok: true, student: stu };
  }

  function upsertStudent(db, payload) {
    const nis = normalizeNis(payload.nis);
    const name = String(payload.name || "").trim().toUpperCase();
    const classCode = canonicalClassCode(payload.classCode || "XI DKV 1");
    if (!nis || !name) return { ok: false, error: "NIS dan Nama Siswa wajib diisi." };
    if (!isAllowedClassCode(classCode)) {
      return { ok: false, error: "Kelas harus salah satu dari X DKV 1–3 atau XI DKV 1–3." };
    }

    const parts = parseClassParts(classCode);
    const leg = legacyClassKey(classCode);
    const idx = (db.students || []).findIndex(s => normalizeNis(s.nis) === nis);
    const nowIso = new Date().toISOString();
    let record;
    if (idx >= 0) {
      record = Object.assign({}, db.students[idx], {
        nis,
        name,
        classCode,
        legacyClassKey: leg,
        gradeLevel: parts.gradeLevel,
        major: parts.major,
        rombel: parts.rombel,
        gender: payload.gender === "P" ? "P" : "L",
        status: payload.status || "aktif",
        updatedAt: nowIso
      });
      if (payload.password) record.password = String(payload.password);
      db.students[idx] = record;
    } else {
      record = {
        nis,
        name,
        classCode,
        legacyClassKey: leg,
        gradeLevel: parts.gradeLevel,
        major: parts.major,
        rombel: parts.rombel,
        gender: payload.gender === "P" ? "P" : "L",
        status: payload.status || "aktif",
        password: String(payload.password || DEFAULT_STUDENT_PASS),
        passwordChanged: false,
        updatedAt: nowIso
      };
      db.students.push(record);
    }

    saveDb(db);
    postCloudAction({ action: "upsert_students", students: [record] });
    return { ok: true, student: record };
  }

  function importStudentsBulk(db, rawText, fallbackClassCode) {
    const lines = String(rawText || "").split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const created = [];
    const skipped = [];
    const safeFallback = isAllowedClassCode(fallbackClassCode) ? canonicalClassCode(fallbackClassCode) : "XI DKV 1";
    lines.forEach((line, idx) => {
      if (idx === 0 && /^nis[\s,;\t]/i.test(line)) return;
      const cols = line.split(/[,;\t]+/).map(c => c.trim());
      if (cols.length < 2) { skipped.push(line); return; }
      const nis = cols[0];
      const name = cols[1];
      const candidateCls = cols[2] ? canonicalClassCode(cols[2]) : safeFallback;
      const cls = isAllowedClassCode(candidateCls) ? candidateCls : safeFallback;
      const gender = (cols[3] || "L").toUpperCase().startsWith("P") ? "P" : "L";
      const res = upsertStudent(db, { nis, name, classCode: cls, gender });
      if (res.ok) created.push(res.student);
      else skipped.push(line);
    });
    if (created.length > 0) {
      saveDb(db);
      postCloudAction({ action: "upsert_students", students: created });
    }
    return { count: created.length, skipped: skipped.length, students: created };
  }

  function resetStudentPassword(db, nis) {
    const stu = findStudentByNis(db, nis);
    if (!stu) return false;
    stu.password = DEFAULT_STUDENT_PASS;
    stu.passwordChanged = false;
    stu.updatedAt = new Date().toISOString();
    saveDb(db);
    postCloudAction({ action: "upsert_students", students: [stu] });
    return true;
  }

  function changeStudentPassword(db, nis, newPass) {
    const clean = String(newPass || "").trim();
    if (clean.length < 4) return { ok: false, error: "Minimal 4 karakter." };
    const stu = findStudentByNis(db, nis);
    if (!stu) return { ok: false, error: "Siswa tidak ditemukan." };
    stu.password = clean;
    stu.passwordChanged = true;
    stu.updatedAt = new Date().toISOString();
    saveDb(db);
    postCloudAction({ action: "upsert_students", students: [stu] });
    return { ok: true };
  }

  // ============================================================================
  // PRESENSI & QR GOOGLE LENS (TERPISAH PER MATA PELAJARAN!)
  // ============================================================================
  function parseQrTokenInfo(token) {
    const t = String(token || "").trim();
    // Format v4: BB-XIDKV1-EAV-M01-XXXX / BB-XIDKV1-PL-M01-XXXX / BB-XDKV1-DKVX-M01-XXXX
    const m5 = t.match(/^BB-([A-Z0-9]+)-(EAV|PL|DKVX)-(M0[1-7])-[A-Z0-9]+$/i);
    if (m5) {
      const cls = canonicalClassCode(m5[1]);
      const subjKey = resolveSubjectKey(m5[2], cls);
      return {
        classCode: cls,
        subjectKey: subjKey,
        subject: getSubjectMeta(subjKey, cls).label,
        weekKey: m5[3].toUpperCase()
      };
    }
    // Format lama: BB-XIDKV1-M01-XXXX
    const m4 = t.match(/^BB-([A-Z0-9]+)-(M0[1-7])-[A-Z0-9]+$/i);
    if (m4) {
      const cls = canonicalClassCode(m4[1]);
      const subjKey = resolveSubjectKey("editing_audio_video", cls);
      return {
        classCode: cls,
        subjectKey: subjKey,
        subject: getSubjectMeta(subjKey, cls).label,
        weekKey: m4[2].toUpperCase()
      };
    }
    return null;
  }

  function createQrSession(db, { classCode, weekKey, subjectKey, subject, teacherId, teacherName, originUrl }) {
    const cls = canonicalClassCode(classCode);
    const wk = normalizeWeekKey(weekKey || getTodaySessionKey());
    const subjKey = resolveSubjectKey(subjectKey || subject || "", cls);
    const subjMeta = getSubjectMeta(subjKey, cls);
    const compactCls = cls.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    const token = `BB-${compactCls}-${subjMeta.code}-${wk}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const base = String(originUrl || (typeof window !== "undefined" ? window.location.origin : "https://dkv.lexyth.my.id")).replace(/\/+$/, "");
    const parsedBack = parseQrTokenInfo(token);
    const isStandardSelfDescribing = !!(parsedBack && parsedBack.classCode === cls && parsedBack.weekKey === wk && parsedBack.subjectKey === subjKey);
    const scanUrl = isStandardSelfDescribing
      ? `${base}/dashboard-guru.html?qr=${encodeURIComponent(token)}`
      : `${base}/dashboard-guru.html?qr=${encodeURIComponent(token)}&c=${encodeURIComponent(cls)}&w=${encodeURIComponent(wk)}&sk=${encodeURIComponent(subjKey)}`;

    const session = {
      token,
      classCode: cls,
      weekKey: wk,
      subjectKey: subjKey,
      subject: subjMeta.label,
      teacherId: teacherId || "GURU-ADRIAN",
      teacherName: teacherName || "Guru Pengampu",
      scanUrl,
      createdAt: new Date().toISOString(),
      active: true
    };

    (db.qrSessions || []).forEach(q => {
      if (
        q &&
        canonicalClassCode(q.classCode) === cls &&
        resolveSubjectKey(q.subjectKey || q.subject, q.classCode) === subjKey &&
        normalizeWeekKey(q.weekKey) === wk
      ) {
        q.active = false;
      }
    });
    db.qrSessions.unshift(session);
    if (db.qrSessions.length > 80) db.qrSessions.length = 80;

    saveDb(db);
    session._cloudPromise = postCloudAction({ action: "create_qr_session", session: { ...session, _cloudPromise: undefined } });
    return session;
  }

  function processQrCheckIn(db, { token, classCode, weekKey, subjectKey, subject, student }) {
    if (!student) return { ok: false, error: "Siswa belum login." };
    const existingSess = (db.qrSessions || []).find(q => q.token === token);
    const fromToken = parseQrTokenInfo(token);
    const resolvedClass = canonicalClassCode(classCode || (existingSess && existingSess.classCode) || (fromToken && fromToken.classCode) || student.classCode);
    const resolvedWeek = normalizeWeekKey(weekKey || (existingSess && existingSess.weekKey) || (fromToken && fromToken.weekKey) || getTodaySessionKey());
    const resolvedSubjKey = resolveSubjectKey(
      subjectKey || (existingSess && existingSess.subjectKey) || (fromToken && fromToken.subjectKey) || subject || (existingSess && existingSess.subject) || "",
      resolvedClass
    );
    const resolvedSubjLabel = getSubjectMeta(resolvedSubjKey, resolvedClass).label;

    if (!existingSess && token) {
      db.qrSessions.unshift({
        token,
        classCode: resolvedClass,
        weekKey: resolvedWeek,
        subjectKey: resolvedSubjKey,
        subject: resolvedSubjLabel,
        teacherName: "Guru Kelas",
        createdAt: new Date().toISOString(),
        active: true
      });
    }

    const nowIso = new Date().toISOString();
    const k = attendanceKey(resolvedClass, resolvedWeek, student.nis, resolvedSubjKey);
    const log = {
      key: k,
      classCode: resolvedClass,
      subjectKey: resolvedSubjKey,
      subjectLabel: resolvedSubjLabel,
      weekKey: resolvedWeek,
      nis: student.nis,
      studentName: student.name,
      status: "H",
      method: "QR Google Lens",
      token: token || "MANUAL-QR",
      note: `Scan QR (${resolvedSubjLabel})`,
      updatedAt: nowIso,
      timeLabel: formatTimeWIB(nowIso)
    };
    db.attendanceLogs[k] = log;

    saveDb(db);
    const cloudPromise = postCloudAction({ action: "qr_checkin", log });
    return { ok: true, log, classCode: resolvedClass, weekKey: resolvedWeek, subjectKey: resolvedSubjKey, subject: resolvedSubjLabel, cloudPromise };
  }

  function submitStudentAbsence(db, { student, classCode, weekKey, subjectKey, status, reason }) {
    if (!student) return { ok: false, error: "Siswa belum login." };
    const stCode = status === "H" ? "H" : (status === "S" ? "S" : "I");
    const cls = canonicalClassCode(classCode || student.classCode);
    const wk = normalizeWeekKey(weekKey || getTodaySessionKey());
    const subjKey = resolveSubjectKey(subjectKey || "", cls);
    const subjLabel = getSubjectMeta(subjKey, cls).label;
    const defaultNote = stCode === "H" ? `Absen Login Siswa (${subjLabel})` : (stCode === "S" ? "Sakit" : "Izin");
    const cleanReason = String(reason || defaultNote).trim();
    const nowIso = new Date().toISOString();
    const k = attendanceKey(cls, wk, student.nis, subjKey);

    const log = {
      key: k,
      classCode: cls,
      subjectKey: subjKey,
      subjectLabel: subjLabel,
      weekKey: wk,
      nis: student.nis,
      studentName: student.name,
      status: stCode,
      method: stCode === "H" ? "Login NIS & Sandi" : "Akun Siswa",
      token: "",
      note: cleanReason,
      updatedAt: nowIso,
      timeLabel: formatTimeWIB(nowIso)
    };
    db.attendanceLogs[k] = log;

    saveDb(db);
    const cloudPromise = postCloudAction({ action: stCode === "H" ? "qr_checkin" : "submit_izin_sakit", log });
    return { ok: true, log, cloudPromise };
  }

  function setStudentAttendanceStatus(db, { classCode, weekKey, subjectKey, student, status, method, note, skipCloud }) {
    const cls = canonicalClassCode(classCode);
    const wk = normalizeWeekKey(weekKey || getTodaySessionKey());
    const subjKey = resolveSubjectKey(subjectKey || "", cls);
    const subjLabel = getSubjectMeta(subjKey, cls).label;
    const k = attendanceKey(cls, wk, student.nis, subjKey);
    const nowIso = new Date().toISOString();
    const log = {
      key: k,
      classCode: cls,
      subjectKey: subjKey,
      subjectLabel: subjLabel,
      weekKey: wk,
      nis: student.nis,
      studentName: student.name,
      status: status,
      method: method || "Input Guru",
      token: "",
      note: note || "",
      updatedAt: nowIso,
      timeLabel: formatTimeWIB(nowIso)
    };
    db.attendanceLogs[k] = log;
    if (!skipCloud) {
      saveDb(db);
      postCloudAction({ action: "set_attendance_item", log });
    }
    return log;
  }

  function setClassAttendanceBulk(db, { classCode, weekKey, subjectKey, students, status, method, note }) {
    const cls = canonicalClassCode(classCode);
    const wk = normalizeWeekKey(weekKey || getTodaySessionKey());
    const subjKey = resolveSubjectKey(subjectKey || "", cls);
    const subjLabel = getSubjectMeta(subjKey, cls).label;
    const nowIso = new Date().toISOString();
    const logs = [];
    (students || []).forEach(st => {
      if (!st || !st.nis) return;
      const k = attendanceKey(cls, wk, st.nis, subjKey);
      const log = {
        key: k,
        classCode: cls,
        subjectKey: subjKey,
        subjectLabel: subjLabel,
        weekKey: wk,
        nis: st.nis,
        studentName: st.name,
        status: status || "H",
        method: method || "Absen Massal Guru",
        token: "",
        note: note || "",
        updatedAt: nowIso,
        timeLabel: formatTimeWIB(nowIso)
      };
      db.attendanceLogs[k] = log;
      logs.push(log);
    });
    if (logs.length > 0) {
      saveDb(db);
      postCloudAction({ action: "set_attendance_bulk", logs });
    }
    return logs;
  }

  function getClassAttendanceBreakdown(db, classCode, weekKey, subjectKey) {
    const cls = canonicalClassCode(classCode);
    const wk = normalizeWeekKey(weekKey || getTodaySessionKey());
    const subjKey = resolveSubjectKey(subjectKey || "", cls);
    const subjMeta = getSubjectMeta(subjKey, cls);
    const activeStudents = (db.students || []).filter(s =>
      canonicalClassCode(s.classCode) === cls && s.status !== "keluar"
    );

    const rows = [];
    let countH = 0, countI = 0, countS = 0, countA = 0, countUnscanned = 0, countQr = 0;

    // Filter KETAT berdasarkan kelas + mata pelajaran + minggu!
    const logsBySessionNis = {};
    Object.values(db.attendanceLogs || {}).forEach(item => {
      if (!item || !item.nis) return;
      if (canonicalClassCode(item.classCode) !== cls) return;
      if (normalizeWeekKey(item.weekKey) !== wk) return;
      const itemSubj = resolveSubjectKey(item.subjectKey || item.subject || item.note || "", cls);
      if (itemSubj !== subjKey) return;
      const cn = compactNisDigits(item.nis);
      if (!cn) return;
      if (!logsBySessionNis[cn] || String(item.updatedAt || "") > String(logsBySessionNis[cn].updatedAt || "")) {
        logsBySessionNis[cn] = item;
      }
    });

    activeStudents.forEach(st => {
      const k = attendanceKey(cls, wk, st.nis, subjKey);
      const entry = (db.attendanceLogs && db.attendanceLogs[k]) || logsBySessionNis[compactNisDigits(st.nis)] || null;
      const status = entry && entry.status ? entry.status : "BELUM_SCAN";
      if (status === "H") {
        countH++;
        if (entry && String(entry.method || "").includes("QR")) countQr++;
      } else if (status === "I") countI++;
      else if (status === "S") countS++;
      else if (status === "A") countA++;
      else countUnscanned++;

      rows.push({
        student: st,
        status,
        method: entry ? entry.method : "Belum Scan QR",
        timeLabel: entry ? entry.timeLabel : "-",
        note: entry ? entry.note : ""
      });
    });

    const total = activeStudents.length;
    const pct = total > 0 ? Math.round((countH / total) * 1000) / 10 : 0;

    return {
      classCode: cls,
      subjectKey: subjKey,
      subjectLabel: subjMeta.label,
      weekKey: wk,
      total,
      countH,
      countI,
      countS,
      countA,
      countUnscanned,
      countQr,
      pct,
      rows
    };
  }

  function markRemainingUnscannedAs(db, classCode, weekKey, targetStatus, teacherName, subjectKey) {
    const breakdown = getClassAttendanceBreakdown(db, classCode, weekKey, subjectKey);
    const status = ["A", "H", "I", "S"].includes(targetStatus) ? targetStatus : "A";
    const changedLogs = [];
    const nowIso = new Date().toISOString();

    breakdown.rows.forEach(row => {
      if (row.status === "BELUM_SCAN") {
        const k = attendanceKey(breakdown.classCode, breakdown.weekKey, row.student.nis, breakdown.subjectKey);
        const log = {
          key: k,
          classCode: breakdown.classCode,
          subjectKey: breakdown.subjectKey,
          subjectLabel: breakdown.subjectLabel,
          weekKey: breakdown.weekKey,
          nis: row.student.nis,
          studentName: row.student.name,
          status,
          method: `Auto-Deteksi Belum Scan (${teacherName || "Guru"})`,
          token: "",
          note: status === "A" ? "Tidak memindai QR" : "",
          updatedAt: nowIso,
          timeLabel: formatTimeWIB(nowIso)
        };
        db.attendanceLogs[k] = log;
        changedLogs.push(log);
      }
    });

    if (changedLogs.length > 0) {
      saveDb(db);
      postCloudAction({ action: "set_attendance_bulk", logs: changedLogs });
    }
    return changedLogs.length;
  }

  function computeStudentOverallAttendancePct(db, nis, classCode, subjectKey) {
    const cls = canonicalClassCode(classCode);
    const targetSubj = subjectKey ? resolveSubjectKey(subjectKey, cls) : "";
    const cNis = compactNisDigits(nis);
    const logs = Object.values(db.attendanceLogs || {}).filter(l => {
      if (!l || !l.nis) return false;
      if (compactNisDigits(l.nis) !== cNis) return false;
      if (cls && canonicalClassCode(l.classCode) !== cls) return false;
      if (targetSubj) {
        const lSubj = resolveSubjectKey(l.subjectKey || l.subject || l.note || "", l.classCode);
        if (lSubj !== targetSubj) return false;
      }
      return true;
    });
    if (!logs.length) return null;
    const valid = logs.filter(l => ["H", "I", "S", "A"].includes(l.status));
    if (!valid.length) return null;
    const present = valid.filter(l => l.status === "H").length;
    return Math.round((present / valid.length) * 100);
  }

  function getStudentSelectedClasses(db, student) {
    if (!student) return [];
    const nis = normalizeNis(student.nis);
    const stored = (db && db.studentNotifClasses && Array.isArray(db.studentNotifClasses[nis]) && db.studentNotifClasses[nis].length)
      ? db.studentNotifClasses[nis]
      : (Array.isArray(student.selectedClasses) && student.selectedClasses.length ? student.selectedClasses : [student.classCode]);
    return [...new Set(stored.map(canonicalClassCode).filter(isAllowedClassCode))];
  }

  function updateStudentSelectedClasses(db, nis, selectedClasses) {
    const cleanNis = normalizeNis(nis);
    if (!cleanNis || !db) return [];
    const st = findStudentByNis(db, cleanNis);
    const cleaned = [...new Set((selectedClasses || []).map(canonicalClassCode).filter(isAllowedClassCode))];
    const finalList = cleaned.length ? cleaned : (st ? [canonicalClassCode(st.classCode)] : []);
    if (!db.studentNotifClasses || typeof db.studentNotifClasses !== "object") db.studentNotifClasses = {};
    db.studentNotifClasses[cleanNis] = finalList;
    if (st) st.selectedClasses = finalList;
    saveDb(db);
    return finalList;
  }

  function collectAllScheduleSlots(db, extraSchedule) {
    const raw = [];
    if (Array.isArray(extraSchedule)) raw.push(...extraSchedule);
    (db && Array.isArray(db.teachers) ? db.teachers : []).forEach(t => {
      if (t && Array.isArray(t.schedule)) raw.push(...t.schedule);
    });
    raw.push(...DEFAULT_ADRIAN_SCHEDULE);
    const seen = new Set();
    const out = [];
    raw.forEach(slot => {
      if (!slot || !slot.classCode || !slot.start) return;
      const cls = canonicalClassCode(slot.classCode);
      const key = `${Number(slot.dayOfWeek)}|${cls}|${String(slot.start).trim()}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ ...slot, classCode: cls });
    });
    return out;
  }

  function buildClassStartNotifications(db, allowedClasses, scheduleSource, readerId) {
    const allowedSet = new Set((allowedClasses || []).map(canonicalClassCode).filter(Boolean));
    if (allowedSet.size === 0) return [];

    const nowWib = getNowWibParts();
    const slots = (scheduleSource || []).filter(slot =>
      slot && allowedSet.has(canonicalClassCode(slot.classCode))
    );
    if (!slots.length) return [];

    const readMap = (db && db.notifReadMap && typeof db.notifReadMap === "object") ? db.notifReadMap : {};
    const todayItems = [];
    const upcomingItems = [];

    slots.forEach(slot => {
      const cls = canonicalClassCode(slot.classCode);
      const startMins = parseTimeMinutes(slot.start);
      const endMins = parseTimeMinutes(slot.end);
      const dow = Number(slot.dayOfWeek);
      const isToday = dow === nowWib.dayOfWeek;

      if (isToday) {
        const id = `NTF-START-${nowWib.dateKey}-${cls.replace(/\s+/g, "")}-${String(slot.start || "").replace(/[^0-9]/g, "")}`;
        const isRead = readerId ? (Array.isArray(readMap[id]) && readMap[id].includes(readerId)) : false;
        let phaseLabel = "Hari Ini";
        let title = `Jam Pelajaran Dimulai (${cls})`;
        let message = `Jam pelajaran ${cls} dimulai pukul ${slot.start} – ${slot.end} WIB (${slot.dayLabel}).`;
        if (nowWib.minutes < startMins) {
          phaseLabel = `Mulai ${slot.start} WIB`;
          title = `Jam Pelajaran Akan Dimulai (${cls})`;
          message = `Kelas ${cls} akan dimulai pukul ${slot.start} – ${slot.end} WIB (${slot.dayLabel}).`;
        } else if (nowWib.minutes <= endMins) {
          phaseLabel = "Sedang Berlangsung";
          title = `Jam Pelajaran Dimulai (${cls})`;
          message = `Kelas ${cls} sedang berlangsung (${slot.start} – ${slot.end} WIB).`;
        }
        if (slot.note && slot.note !== "Reguler") message += ` • ${slot.note}`;
        todayItems.push({
          id,
          type: "class_start",
          classCode: cls,
          dayOfWeek: dow,
          dayLabel: slot.dayLabel,
          start: slot.start,
          end: slot.end,
          isToday: true,
          phaseLabel,
          title,
          message,
          startMins,
          isRead
        });
      } else {
        const dist = ((dow - nowWib.dayOfWeek + 7) % 7) || 7;
        const id = `NTF-SCHED-${cls.replace(/\s+/g, "")}-${dow}-${String(slot.start || "").replace(/[^0-9]/g, "")}`;
        upcomingItems.push({
          id,
          type: "class_start",
          classCode: cls,
          dayOfWeek: dow,
          dayLabel: slot.dayLabel,
          start: slot.start,
          end: slot.end,
          isToday: false,
          phaseLabel: `${slot.dayLabel}, ${slot.start} WIB`,
          title: `Jadwal Mulai ${cls} (${slot.dayLabel})`,
          message: `Jam pelajaran ${cls} dimulai pukul ${slot.start} – ${slot.end} WIB${slot.note && slot.note !== "Reguler" ? " • " + slot.note : "."}`,
          dist,
          startMins,
          isRead: true
        });
      }
    });

    todayItems.sort((a, b) => a.startMins - b.startMins);
    upcomingItems.sort((a, b) => (a.dist - b.dist) || (a.startMins - b.startMins));
    return [...todayItems, ...upcomingItems];
  }

  function getNotificationsForTeacher(db, teacher) {
    if (!teacher) return [];
    const taught = Array.isArray(teacher.taughtClasses) ? teacher.taughtClasses : [];
    const sched = (Array.isArray(teacher.schedule) && teacher.schedule.length)
      ? teacher.schedule
      : collectAllScheduleSlots(db);
    return buildClassStartNotifications(db, taught, sched, teacher.id || "");
  }

  function getNotificationsForStudent(db, student) {
    if (!student) return [];
    const selected = getStudentSelectedClasses(db, student);
    const sched = collectAllScheduleSlots(db);
    return buildClassStartNotifications(db, selected, sched, "STU-" + normalizeNis(student.nis));
  }

  function parseSubmissionTimestamp(sub) {
    if (!sub || typeof sub !== "object") return 0;
    const rawIso = sub.created_at || sub.createdAt || sub.submittedAtIso || sub.timestamp || "";
    if (rawIso) {
      const parsed = Date.parse(rawIso);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
    const idStr = String(sub.id || "");
    const idMatch = idStr.match(/(?:sub_|SUB-MAN-)(\d{10,13})/i);
    if (idMatch) {
      const n = Number(idMatch[1]);
      if (Number.isFinite(n) && n > 0) return idMatch[1].length === 10 ? n * 1000 : n;
    }
    const label = String(sub.submitted_at || sub.createdAtLabel || "").trim();
    if (label && label !== "-") {
      const parsedLabel = Date.parse(label.replace(/\s*WIB\s*$/i, "").replace(/(\d{2})\.(\d{2})$/, "$1:$2"));
      if (Number.isFinite(parsedLabel) && parsedLabel > 0) return parsedLabel;
    }
    return 0;
  }

  function formatSubmissionTimeWIB(sub) {
    if (!sub || typeof sub !== "object") return "-";
    const rawLabel = String(sub.submitted_at || sub.createdAtLabel || "").trim();
    if (rawLabel && rawLabel !== "-" && /\d{1,2}[:.]\d{2}/.test(rawLabel)) {
      return /WIB/i.test(rawLabel) ? rawLabel : (rawLabel + " WIB");
    }
    const ts = parseSubmissionTimestamp(sub);
    if (ts > 0) {
      try {
        const d = new Date(ts);
        const dateStr = d.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", day: "2-digit", month: "short", year: "numeric" });
        const timeStr = d.toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false });
        return `${dateStr}, ${timeStr} WIB`;
      } catch (e) {}
    }
    return rawLabel || "-";
  }

  function buildTaskNotifications(db, submissions, allowedClasses, readerId, studentNis) {
    const list = Array.isArray(submissions) ? submissions : [];
    if (!list.length) return [];

    const allowedSet = new Set((allowedClasses || []).map(canonicalClassCode).filter(Boolean));
    const cleanStuNis = studentNis ? normalizeNis(studentNis) : "";
    const readMap = (db && db.notifReadMap && typeof db.notifReadMap === "object") ? db.notifReadMap : {};

    const scoped = list.filter(sub => {
      if (!sub || typeof sub !== "object") return false;
      if (cleanStuNis) {
        return normalizeNis(sub.student_nis || sub.studentNis || "") === cleanStuNis;
      }
      if (allowedSet.size === 0) return false;
      const cls = canonicalClassCode(sub.class_code || sub.className || sub.class_name || "");
      return allowedSet.has(cls);
    });

    const enriched = scoped.map(sub => {
      const subId = String(sub.id || "").trim() || ("SUB-" + String(sub.student_nis || "") + "-" + String(sub.task_id || ""));
      const id = `NTF-TASK-${subId}`;
      const cls = canonicalClassCode(sub.class_code || sub.className || sub.class_name || "XI DKV 1");
      const hasScore = sub.score !== null && sub.score !== undefined && sub.score !== "" && Number.isFinite(Number(sub.score));
      const alreadyRead = readerId ? (Array.isArray(readMap[id]) && readMap[id].includes(readerId)) : false;
      const isRead = cleanStuNis ? alreadyRead : (alreadyRead || hasScore);
      const rawMethod = String(sub.method || "").toLowerCase();
      const methodLabel = rawMethod === "file" ? "Upload File" : (rawMethod === "link" ? "Link Drive" : (sub.status || "Karya"));
      const sortTs = parseSubmissionTimestamp(sub);
      return {
        id,
        type: "task_submission",
        submissionId: subId,
        classCode: cls,
        studentName: String(sub.student_name || sub.repName || sub.studentName || "Siswa").trim(),
        studentNis: String(sub.student_nis || sub.studentNis || "").trim(),
        groupNum: String(sub.group_num || sub.groupNum || "").trim(),
        members: String(sub.members || "").trim(),
        taskTitle: String(sub.task_title || sub.taskTitle || "Tugas Praktik").trim(),
        fileName: String(sub.file_name || sub.fileName || "").trim(),
        fileUrl: String(sub.file_url || sub.driveUrl || sub.linkUrl || sub.previewUrl || sub.fileUrl || "#").trim(),
        methodLabel,
        timeLabel: formatSubmissionTimeWIB(sub),
        score: hasScore ? Number(sub.score) : null,
        feedback: String(sub.feedback || sub.note || "").trim(),
        sortTs,
        isRead
      };
    });

    enriched.sort((a, b) => (b.sortTs - a.sortTs));
    return enriched.slice(0, 60);
  }

  function getTaskNotificationsForTeacher(db, teacher, submissions) {
    if (!teacher) return [];
    const taught = Array.isArray(teacher.taughtClasses) ? teacher.taughtClasses : [];
    return buildTaskNotifications(db, submissions, taught, teacher.id || "", "");
  }

  function getTaskNotificationsForStudent(db, student, submissions) {
    if (!student || !student.nis) return [];
    return buildTaskNotifications(db, submissions, [], "STU-" + normalizeNis(student.nis), student.nis);
  }

  function markNotificationsRead(db, readerId, notifIds) {
    if (!readerId || !db) return;
    if (!db.notifReadMap || typeof db.notifReadMap !== "object" || Array.isArray(db.notifReadMap)) {
      db.notifReadMap = {};
    }
    const targetIds = Array.isArray(notifIds) ? notifIds : [];
    targetIds.forEach(id => {
      if (!id) return;
      if (!Array.isArray(db.notifReadMap[id])) db.notifReadMap[id] = [];
      if (!db.notifReadMap[id].includes(readerId)) db.notifReadMap[id].push(readerId);
    });
    saveDb(db);
    if (!String(readerId).startsWith("STU-")) {
      postCloudAction({ action: "mark_notif_read", teacherId: readerId, notifIds: targetIds.length ? targetIds : null });
    }
  }

  // ============================================================================
  // CLOUD TRANSPORT, RETRY QUEUE & CONFLICT-FREE MERGE (v4.0)
  // ============================================================================
  async function resolveGasUrl() {
    try {
      const isManual = localStorage.getItem(GAS_MANUAL_KEY) === "1";
      const local = localStorage.getItem(GAS_URL_KEY) || "";
      if (isManual && local && local.startsWith("https://script.google.com/")) return local;
      if (cachedDriveConfigUrl) return cachedDriveConfigUrl;
      const res = await fetch("/drive-config.json?t=" + Date.now());
      if (res.ok) {
        const cfg = await res.json();
        if (cfg && cfg.scriptUrl && cfg.scriptUrl.startsWith("https://script.google.com/")) {
          cachedDriveConfigUrl = cfg.scriptUrl;
          localStorage.setItem(GAS_URL_KEY, cfg.scriptUrl);
          return cfg.scriptUrl;
        }
      }
      if (local && local.startsWith("https://script.google.com/")) return local;
    } catch (e) {
      try {
        const fallback = localStorage.getItem(GAS_URL_KEY) || "";
        if (fallback && fallback.startsWith("https://script.google.com/")) return fallback;
      } catch (e2) {}
    }
    return "https://script.google.com/macros/s/AKfycbwFaoP2y-oVHt3Ta7pgcS2ncljzRNZ0MtKAIdECVdmDeFFYkUQ8M3Q2uURo5twhDz2XxA/exec";
  }

  function readPendingQueue() {
    try {
      const raw = localStorage.getItem(PENDING_CLOUD_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writePendingQueue(list) {
    try {
      const trimmed = Array.isArray(list) ? list.slice(-50) : [];
      localStorage.setItem(PENDING_CLOUD_KEY, JSON.stringify(trimmed));
    } catch (e) {}
    emitSyncState();
  }

  function enqueuePendingCloud(payload) {
    if (!payload || !payload.action) return;
    const list = readPendingQueue();
    const isGbBundle = payload.action === "save_gradebook_bundle";
    const isProg = payload.action === "save_learning_progress";
    const dedupKey = isGbBundle
      ? "__BB_GRADEBOOK_BUNDLE__"
      : (isProg ? "__BB_LEARNING_PROGRESS__" : (payload.action === "qr_checkin" || payload.action === "set_attendance_item" || payload.action === "submit_izin_sakit") && payload.log
          ? `ATT_${payload.log.key}`
          : (payload.action === "create_qr_session" && payload.session ? `QR_${payload.session.token}` : ""));

    let mergedPayload = payload;
    if (isGbBundle) {
      const existingGb = list.find(x => x && x.action === "save_gradebook_bundle");
      if (existingGb) {
        mergedPayload = {
          ...payload,
          directGrades: Object.assign({}, existingGb.directGrades || {}, payload.directGrades || {}),
          gradebookDeletedSlots: Object.assign({}, existingGb.gradebookDeletedSlots || {}, payload.gradebookDeletedSlots || {})
        };
      }
    }

    const filtered = dedupKey
      ? list.filter(x => {
          if (!x) return false;
          if (dedupKey === "__BB_GRADEBOOK_BUNDLE__") return x.action !== "save_gradebook_bundle";
          if (dedupKey === "__BB_LEARNING_PROGRESS__") return x.action !== "save_learning_progress";
          if (dedupKey.startsWith("ATT_")) return !(x.log && `ATT_${x.log.key}` === dedupKey);
          if (dedupKey.startsWith("QR_")) return !(x.session && `QR_${x.session.token}` === dedupKey);
          return true;
        })
      : list;
    filtered.push(mergedPayload);
    writePendingQueue(filtered);
  }

  async function ensureCloudCapabilitiesChecked(url, forceRecheck) {
    if (cloudCapabilities.checked && !forceRecheck) return { ...cloudCapabilities };
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const sep = url.includes("?") ? "&" : "?";
      const res = await fetch(url + sep + "action=ping&t=" + Date.now(), {
        method: "GET",
        redirect: "follow",
        signal: controller.signal
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        return setCloudCapabilities(data);
      }
    } catch (e) {
      updateSyncState({ lastSyncState: "offline", lastError: String(e && e.message ? e.message : e) });
    }
    return { ...cloudCapabilities };
  }

  async function sendCloudPostRaw(url, payload, opts) {
    const keepalive = !!(opts && opts.keepalive);
    const bodyStr = JSON.stringify(payload);
    const controller = (!keepalive && typeof AbortController !== "undefined") ? new AbortController() : null;
    const t = controller ? setTimeout(() => controller.abort(), 22000) : null;
    try {
      const fetchOpts = {
        method: "POST",
        redirect: "follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: bodyStr
      };
      if (controller) fetchOpts.signal = controller.signal;
      if (keepalive && bodyStr.length < 60000) fetchOpts.keepalive = true;
      const res = await fetch(url, fetchOpts);
      if (t) clearTimeout(t);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      if (t) clearTimeout(t);
      throw e;
    }
  }

  async function flushPendingCloudActions() {
    const list = readPendingQueue();
    if (!list.length) return { flushed: 0, remaining: 0 };
    const url = await resolveGasUrl();
    if (!url) return { flushed: 0, remaining: list.length };
    await ensureCloudCapabilitiesChecked(url);
    if (!cloudCapabilities.v4Supported) {
      updateSyncState({ lastSyncState: "needs_gas_update" });
      return { flushed: 0, remaining: list.length };
    }
    updateSyncState({ lastSyncState: "syncing" });
    const remaining = [];
    let flushed = 0;
    for (const item of list) {
      try {
        const resp = await sendCloudPostRaw(url, item);
        if (resp && resp.status === "ok" && resp.saved !== false) {
          flushed++;
        } else {
          remaining.push(item);
        }
      } catch (e) {
        remaining.push(item);
      }
    }
    writePendingQueue(remaining);
    updateSyncState({
      lastSyncState: remaining.length ? "error" : "synced",
      lastSyncAt: remaining.length ? cloudCapabilities.lastSyncAt : new Date().toISOString()
    });
    return { flushed, remaining: remaining.length };
  }

  async function postCloudAction(payload, opts) {
    try {
      const url = await resolveGasUrl();
      if (!url) return null;
      const actionName = payload && payload.action ? String(payload.action) : "";
      const isLegacyCompatible = actionName === "delete" || !actionName;
      if (!isLegacyCompatible && !cloudCapabilities.checked) {
        await ensureCloudCapabilitiesChecked(url);
      }
      if (!isLegacyCompatible && !cloudCapabilities.v4Supported && !(payload && payload.forceCloud)) {
        enqueuePendingCloud(payload);
        updateSyncState({ lastSyncState: "needs_gas_update" });
        return {
          status: "local_only",
          saved: false,
          reason: cloudCapabilities.nexusSupported ? "gas_outdated_v3" : "nexus_gas_not_deployed",
          serverVersion: cloudCapabilities.version || "unknown"
        };
      }
      updateSyncState({ lastSyncState: "syncing" });
      const resp = await sendCloudPostRaw(url, payload, opts);
      const confirmed = !!(resp && resp.status === "ok" && resp.saved !== false);
      if (!confirmed) {
        if (!isLegacyCompatible) enqueuePendingCloud(payload);
        updateSyncState({ lastSyncState: "error", lastError: (resp && resp.message) || "Server tidak mengonfirmasi penyimpanan" });
      } else {
        updateSyncState({ lastSyncState: "synced", lastSyncAt: new Date().toISOString(), lastError: "" });
      }
      return resp;
    } catch (e) {
      if (payload && payload.action && payload.action !== "delete") enqueuePendingCloud(payload);
      updateSyncState({ lastSyncState: "offline", lastError: String(e && e.message ? e.message : e) });
      return { status: "queued_offline", saved: false, error: String(e && e.message ? e.message : e) };
    }
  }

  function mergeCloudPortalDb(db, remoteDb) {
    if (!remoteDb || typeof remoteDb !== "object") return false;
    let changed = false;

    if (Array.isArray(remoteDb.teachers)) {
      remoteDb.teachers.forEach(rt => {
        if (!rt || !rt.id) return;
        const cleanClasses = Array.isArray(rt.taughtClasses)
          ? [...new Set(rt.taughtClasses.map(canonicalClassCode).filter(isAllowedClassCode))]
          : [];
        const normTeacher = Object.assign({}, rt, {
          taughtClasses: cleanClasses.length ? cleanClasses : ["XI DKV 1", "XI DKV 2", "XI DKV 3"]
        });
        const idx = db.teachers.findIndex(t => t.id === normTeacher.id);
        if (idx < 0) {
          db.teachers.push(normTeacher);
          changed = true;
        } else if (isNewerTs(normTeacher.updatedAt, db.teachers[idx].updatedAt)) {
          db.teachers[idx] = Object.assign({}, db.teachers[idx], normTeacher);
          changed = true;
        }
      });
    }

    if (Array.isArray(remoteDb.students)) {
      remoteDb.students.forEach(rs => {
        if (!rs || !rs.nis) return;
        const normStu = Object.assign({}, rs, {
          nis: normalizeNis(rs.nis),
          classCode: canonicalClassCode(rs.classCode || "XI DKV 1")
        });
        if (!isAllowedClassCode(normStu.classCode)) return;
        const idx = db.students.findIndex(s => normalizeNis(s.nis) === normStu.nis);
        if (idx < 0) {
          db.students.push(normStu);
          changed = true;
        } else if (isNewerTs(normStu.updatedAt, db.students[idx].updatedAt)) {
          db.students[idx] = Object.assign({}, db.students[idx], normStu);
          changed = true;
        }
      });
    }

    if (Array.isArray(remoteDb.qrSessions)) {
      remoteDb.qrSessions.forEach(rq => {
        if (!rq || !rq.token) return;
        const cls = canonicalClassCode(rq.classCode || "XI DKV 1");
        const subjKey = resolveSubjectKey(rq.subjectKey || rq.subject || "", cls);
        const normQr = Object.assign({}, rq, {
          classCode: cls,
          weekKey: normalizeWeekKey(rq.weekKey || "M01"),
          subjectKey: subjKey,
          subject: getSubjectMeta(subjKey, cls).label
        });
        const idx = db.qrSessions.findIndex(q => q.token === normQr.token);
        if (idx < 0) {
          db.qrSessions.unshift(normQr);
          changed = true;
        } else if (db.qrSessions[idx].active !== normQr.active) {
          db.qrSessions[idx] = Object.assign({}, db.qrSessions[idx], normQr);
          changed = true;
        }
      });
    }

    // Merge attendanceLogs (4-part key dengan subjectKey, bandingkan updatedAt)
    const remoteLogsList = Array.isArray(remoteDb.attendanceLogs)
      ? remoteDb.attendanceLogs
      : (remoteDb.attendanceLogs && typeof remoteDb.attendanceLogs === "object" ? Object.values(remoteDb.attendanceLogs) : []);
    remoteLogsList.forEach(rl => {
      if (!rl || !rl.nis) return;
      const cls = canonicalClassCode(rl.classCode || "XI DKV 1");
      if (!isAllowedClassCode(cls)) return;
      const wk = normalizeWeekKey(rl.weekKey || getTodaySessionKey());
      const subjKey = resolveSubjectKey(rl.subjectKey || rl.subject || rl.note || "", cls);
      const nis = normalizeNis(rl.nis);
      const rKey = attendanceKey(cls, wk, nis, subjKey);
      const normLog = Object.assign({}, rl, {
        key: rKey,
        classCode: cls,
        subjectKey: subjKey,
        subjectLabel: getSubjectMeta(subjKey, cls).label,
        weekKey: wk,
        nis: nis
      });
      const localEntry = db.attendanceLogs[rKey];
      if (!localEntry || isNewerTs(normLog.updatedAt, localEntry.updatedAt)) {
        db.attendanceLogs[rKey] = normLog;
        changed = true;
      }
    });

    if (Array.isArray(remoteDb.notifications)) {
      remoteDb.notifications.forEach(rn => {
        if (!rn || !rn.id || rn.type !== "class_start") return;
        if (!db.notifications.some(n => n.id === rn.id)) {
          db.notifications.unshift(rn);
          changed = true;
        }
      });
    }

    // Merge gradebookDeletedSlots tombstones
    const remoteBundle = (remoteDb.gradeOverrides && typeof remoteDb.gradeOverrides === "object")
      ? remoteDb.gradeOverrides["__BB_GRADEBOOK_BUNDLE__"]
      : null;
    const remoteDelSlots = (remoteDb.gradebookDeletedSlots && typeof remoteDb.gradebookDeletedSlots === "object")
      ? remoteDb.gradebookDeletedSlots
      : (remoteBundle && remoteBundle.gradebookDeletedSlots ? remoteBundle.gradebookDeletedSlots : null);

    if (remoteDelSlots) {
      if (!db.gradebookDeletedSlots || typeof db.gradebookDeletedSlots !== "object") db.gradebookDeletedSlots = {};
      Object.keys(remoteDelSlots).forEach(slotId => {
        const ts = String(remoteDelSlots[slotId] || "");
        if (ts && (!db.gradebookDeletedSlots[slotId] || ts > String(db.gradebookDeletedSlots[slotId]))) {
          db.gradebookDeletedSlots[slotId] = ts;
          changed = true;
        }
      });
    }

    // Merge gradebookSlots per-slot ID berdasarkan updatedAt (tidak menimpa antar mapel!)
    const remoteSlots = Array.isArray(remoteDb.gradebookSlots) && remoteDb.gradebookSlots.length
      ? remoteDb.gradebookSlots
      : (remoteBundle && Array.isArray(remoteBundle.gradebookSlots) ? remoteBundle.gradebookSlots : null);

    if (remoteSlots && remoteSlots.length) {
      if (!Array.isArray(db.gradebookSlots)) db.gradebookSlots = [];
      remoteSlots.forEach(rsl => {
        if (!rsl || !rsl.id) return;
        const subjKey = inferSlotSubjectKey(rsl);
        const meta = getSubjectMeta(subjKey);
        const normSlot = Object.assign({}, rsl, {
          id: String(rsl.id).trim(),
          subjectKey: subjKey,
          subject: meta.label
        });
        const delTs = db.gradebookDeletedSlots && db.gradebookDeletedSlots[normSlot.id];
        if (delTs && (!normSlot.updatedAt || delTs > normSlot.updatedAt)) return;

        const idx = db.gradebookSlots.findIndex(s => s && s.id === normSlot.id);
        if (idx < 0) {
          db.gradebookSlots.push(normSlot);
          changed = true;
        } else if (isNewerTs(normSlot.updatedAt, db.gradebookSlots[idx].updatedAt)) {
          db.gradebookSlots[idx] = Object.assign({}, db.gradebookSlots[idx], normSlot);
          changed = true;
        }
      });

      // Terapkan penghapusan slot dari tombstone & rapikan slotNum per mapel
      const beforeLen = db.gradebookSlots.length;
      db.gradebookSlots = db.gradebookSlots.filter(s => {
        if (!s || !s.id) return false;
        const delTs = db.gradebookDeletedSlots && db.gradebookDeletedSlots[s.id];
        return !(delTs && (!s.updatedAt || delTs > s.updatedAt));
      });
      if (db.gradebookSlots.length !== beforeLen) changed = true;

      ["editing_audio_video", "perangkat_lunak", "dkv_x"].forEach(sk => {
        let num = 0;
        db.gradebookSlots.forEach(s => {
          if (s && inferSlotSubjectKey(s) === sk) {
            num++;
            s.slotNum = num;
          }
        });
      });
    }

    // Merge directGrades per key berdasarkan updatedAt (termasuk tombstone deleted:true!)
    const remoteDirect = (remoteDb.directGrades && typeof remoteDb.directGrades === "object" && Object.keys(remoteDb.directGrades).length)
      ? remoteDb.directGrades
      : (remoteBundle && remoteBundle.directGrades && typeof remoteBundle.directGrades === "object" ? remoteBundle.directGrades : null);

    if (remoteDirect && typeof remoteDirect === "object") {
      if (!db.directGrades || typeof db.directGrades !== "object") db.directGrades = {};
      Object.keys(remoteDirect).forEach(gk => {
        const rg = remoteDirect[gk];
        if (!rg || !rg.slotId || !rg.nis) return;
        const cleanKey = gradeKey(rg.slotId, rg.nis);
        const lg = db.directGrades[cleanKey];
        if (!lg || isNewerTs(rg.updatedAt, lg.updatedAt)) {
          const isCleared = !!rg.deleted || rg.score === null || rg.score === undefined || String(rg.score).trim() === "";
          const cls = canonicalClassCode(rg.classCode || "XI DKV 1");
          const subjKey = rg.subjectKey
            ? resolveSubjectKey(rg.subjectKey, cls)
            : (String(rg.slotId).startsWith("PL_") ? "perangkat_lunak" : (String(rg.slotId).startsWith("DKVX_") ? "dkv_x" : "editing_audio_video"));
          db.directGrades[cleanKey] = {
            ...rg,
            key: cleanKey,
            slotId: String(rg.slotId).trim(),
            subjectKey: subjKey,
            nis: normalizeNis(rg.nis),
            classCode: cls,
            score: isCleared ? null : Number(rg.score),
            deleted: isCleared
          };
          changed = true;
        }
      });
    }

    // Merge learningProgress
    if (remoteDb.learningProgress && typeof remoteDb.learningProgress === "object") {
      if (!db.learningProgress) db.learningProgress = {};
      if (!db.learningProgressTs) db.learningProgressTs = {};
      const rTsMap = (remoteDb.learningProgressTs && typeof remoteDb.learningProgressTs === "object") ? remoteDb.learningProgressTs : {};
      Object.keys(remoteDb.learningProgress).forEach(rawCls => {
        const cls = canonicalClassCode(rawCls);
        const rModMap = remoteDb.learningProgress[rawCls];
        if (!rModMap || typeof rModMap !== "object") return;
        if (!db.learningProgress[cls]) db.learningProgress[cls] = {};
        if (!db.learningProgressTs[cls]) db.learningProgressTs[cls] = {};
        Object.keys(rModMap).forEach(modId => {
          const rTs = String((rTsMap[rawCls] && rTsMap[rawCls][modId]) || (rTsMap[cls] && rTsMap[cls][modId]) || remoteDb.updatedAt || "");
          const lTs = String(db.learningProgressTs[cls][modId] || "");
          if (!lTs || isNewerTs(rTs, lTs)) {
            if (db.learningProgress[cls][modId] !== rModMap[modId]) changed = true;
            db.learningProgress[cls][modId] = rModMap[modId];
            db.learningProgressTs[cls][modId] = rTs;
          }
        });
      });
    }

    if (changed) saveDb(db);
    return changed;
  }

  // Deteksi data lokal yang lebih baru daripada cloud (mis. hasil input sebelumnya di perangkat ini)
  // lalu dorong otomatis dengan merge aman ke server v4.0
  async function reconcileAndPushLocalNewerToCloud(db, remoteDb) {
    if (!db || !remoteDb || !cloudCapabilities.v4Supported) return { pushed: false };

    const remoteGrades = (remoteDb.directGrades && typeof remoteDb.directGrades === "object") ? remoteDb.directGrades : {};
    const newerGrades = {};
    Object.keys(db.directGrades || {}).forEach(gk => {
      const lg = db.directGrades[gk];
      if (!lg || !lg.slotId || !lg.nis) return;
      const rg = remoteGrades[gk];
      if (!rg || isNewerTs(lg.updatedAt, rg.updatedAt)) {
        newerGrades[gk] = lg;
      }
    });

    const remoteSlotsMap = {};
    (Array.isArray(remoteDb.gradebookSlots) ? remoteDb.gradebookSlots : []).forEach(s => {
      if (s && s.id) remoteSlotsMap[s.id] = s;
    });
    const newerSlots = (db.gradebookSlots || []).filter(sl => {
      if (!sl || !sl.id) return false;
      const rsl = remoteSlotsMap[sl.id];
      if (!rsl) return sl.updatedAt !== SEED_BASELINE_TS || Object.keys(newerGrades).length > 0;
      return isNewerTs(sl.updatedAt, rsl.updatedAt);
    });

    const remoteDel = (remoteDb.gradebookDeletedSlots && typeof remoteDb.gradebookDeletedSlots === "object") ? remoteDb.gradebookDeletedSlots : {};
    const newerDeleted = {};
    Object.keys(db.gradebookDeletedSlots || {}).forEach(sid => {
      if (isNewerTs(db.gradebookDeletedSlots[sid], remoteDel[sid])) {
        newerDeleted[sid] = db.gradebookDeletedSlots[sid];
      }
    });

    const remoteAttMap = {};
    const remoteAttArr = Array.isArray(remoteDb.attendanceLogs)
      ? remoteDb.attendanceLogs
      : (remoteDb.attendanceLogs && typeof remoteDb.attendanceLogs === "object" ? Object.values(remoteDb.attendanceLogs) : []);
    remoteAttArr.forEach(a => {
      if (!a || !a.nis) return;
      const cls = canonicalClassCode(a.classCode || "XI DKV 1");
      const subj = resolveSubjectKey(a.subjectKey || a.subject || a.note || "", cls);
      const k = attendanceKey(cls, a.weekKey || "M01", a.nis, subj);
      remoteAttMap[k] = a;
    });
    const newerAttLogs = Object.values(db.attendanceLogs || {}).filter(la => {
      if (!la || !la.nis) return false;
      const ra = remoteAttMap[la.key];
      return !ra || isNewerTs(la.updatedAt, ra.updatedAt);
    });

    const remoteTeacherMap = {};
    (Array.isArray(remoteDb.teachers) ? remoteDb.teachers : []).forEach(t => { if (t && t.id) remoteTeacherMap[t.id] = t; });
    const newerTeachers = (db.teachers || []).filter(t => {
      if (!t || !t.id) return false;
      const rt = remoteTeacherMap[t.id];
      if (!rt) return true;
      return isNewerTs(t.updatedAt, rt.updatedAt);
    });

    const remoteStuMap = {};
    (Array.isArray(remoteDb.students) ? remoteDb.students : []).forEach(s => { if (s && s.nis) remoteStuMap[normalizeNis(s.nis)] = s; });
    const newerStudents = (db.students || []).filter(s => {
      if (!s || !s.nis) return false;
      const rs = remoteStuMap[normalizeNis(s.nis)];
      if (!rs) return s.updatedAt !== SEED_BASELINE_TS || Object.keys(remoteStuMap).length === 0;
      return isNewerTs(s.updatedAt, rs.updatedAt);
    });

    const hasNewer =
      Object.keys(newerGrades).length > 0 ||
      newerSlots.length > 0 ||
      Object.keys(newerDeleted).length > 0 ||
      newerAttLogs.length > 0 ||
      newerTeachers.length > 0 ||
      newerStudents.length > 0;

    if (!hasNewer) return { pushed: false };

    const payload = {
      action: "sync_portal_db",
      portalDb: {
        teachers: newerTeachers,
        students: newerStudents,
        attendanceLogs: newerAttLogs,
        gradebookSlots: newerSlots.length ? db.gradebookSlots : [],
        gradebookDeletedSlots: newerDeleted,
        directGrades: newerGrades,
        learningProgress: db.learningProgress || {},
        learningProgressTs: db.learningProgressTs || {}
      }
    };
    const resp = await postCloudAction(payload);
    return { pushed: !!(resp && resp.status === "ok" && resp.saved !== false), resp };
  }

  // ============================================================================
  // BUKU NILAI LANGSUNG PER MATA PELAJARAN (MAKSIMAL 10 TUGAS PER MAPEL)
  // ============================================================================
  let gradebookCloudDebounceTimer = null;
  let dirtyGradeKeys = new Set();
  let lastDbRefForFlush = null;

  function gradeKey(slotId, nis) {
    return `${String(slotId || "").trim()}__${normalizeNis(nis)}`;
  }

  function getGradebookSlots(db, classCode, subjectKey) {
    if (!db) return [];
    if (!Array.isArray(db.gradebookSlots)) {
      db.gradebookSlots = DEFAULT_GRADEBOOK_SLOTS.map(s => ({ ...s }));
    }
    const targetSubj = subjectKey ? resolveSubjectKey(subjectKey, classCode && classCode !== "ALL" ? classCode : "") : "";
    let list = db.gradebookSlots.map((s) => {
      const sk = inferSlotSubjectKey(s);
      return {
        ...s,
        subjectKey: sk,
        subject: getSubjectMeta(sk).label,
        classScope: s.classScope && s.classScope !== "ALL" && isAllowedClassCode(s.classScope) ? canonicalClassCode(s.classScope) : "ALL",
        kkm: Number.isFinite(Number(s.kkm)) ? Number(s.kkm) : 75,
        maxScore: Number.isFinite(Number(s.maxScore)) ? Number(s.maxScore) : 100
      };
    });
    if (targetSubj) {
      list = list.filter(s => s.subjectKey === targetSubj);
    }
    if (classCode && classCode !== "ALL") {
      const targetCls = canonicalClassCode(classCode);
      list = list.filter(s => s.classScope === "ALL" || canonicalClassCode(s.classScope) === targetCls);
    }
    return list.slice(0, targetSubj ? MAX_GRADEBOOK_SLOTS : MAX_TOTAL_GRADEBOOK_SLOTS).map((s, idx) => ({
      ...s,
      slotNum: idx + 1
    }));
  }

  function syncGradebookToCloud(db, subsetDirectMap, opts) {
    if (!db) return Promise.resolve(null);
    const slots = (Array.isArray(db.gradebookSlots) ? db.gradebookSlots : []).slice(0, MAX_TOTAL_GRADEBOOK_SLOTS);
    const deletedSlots = (db.gradebookDeletedSlots && typeof db.gradebookDeletedSlots === "object") ? db.gradebookDeletedSlots : {};
    const directToSend = (subsetDirectMap && typeof subsetDirectMap === "object" && Object.keys(subsetDirectMap).length > 0)
      ? subsetDirectMap
      : ((db.directGrades && typeof db.directGrades === "object") ? db.directGrades : {});
    return postCloudAction({
      action: "save_gradebook_bundle",
      gradebookSlots: slots,
      gradebookDeletedSlots: deletedSlots,
      directGrades: directToSend,
      replaceDirectGrades: false,
      syncSheets: true
    }, opts);
  }

  function flushDirtyGradebookNow(opts) {
    if (gradebookCloudDebounceTimer) {
      clearTimeout(gradebookCloudDebounceTimer);
      gradebookCloudDebounceTimer = null;
    }
    if (!lastDbRefForFlush || dirtyGradeKeys.size === 0) return null;
    const subset = {};
    dirtyGradeKeys.forEach(k => {
      if (lastDbRefForFlush.directGrades && lastDbRefForFlush.directGrades[k]) {
        subset[k] = lastDbRefForFlush.directGrades[k];
      }
    });
    dirtyGradeKeys.clear();
    if (Object.keys(subset).length === 0) return null;
    return syncGradebookToCloud(lastDbRefForFlush, subset, opts);
  }

  function scheduleGradebookCloudSync(db, changedKey) {
    lastDbRefForFlush = db;
    if (changedKey) dirtyGradeKeys.add(changedKey);
    if (gradebookCloudDebounceTimer) clearTimeout(gradebookCloudDebounceTimer);
    gradebookCloudDebounceTimer = setTimeout(() => {
      flushDirtyGradebookNow();
    }, 450);
  }

  if (typeof window !== "undefined") {
    const flushOnLeave = () => {
      try { flushDirtyGradebookNow({ keepalive: true }); } catch (e) {}
    };
    window.addEventListener("pagehide", flushOnLeave);
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) flushOnLeave();
      });
    }
  }

  function saveGradebookSlot(db, payload) {
    if (!db) return { ok: false, error: "Database belum siap." };
    if (!Array.isArray(db.gradebookSlots)) db.gradebookSlots = [];
    const title = String(payload && payload.title ? payload.title : "").trim();
    if (!title) return { ok: false, error: "Nama tugas / penilaian wajib diisi." };

    const nowIso = new Date().toISOString();
    const rawScope = String(payload.classScope || "ALL").trim();
    const classScope = (!rawScope || rawScope.toUpperCase() === "ALL")
      ? "ALL"
      : (isAllowedClassCode(rawScope) ? canonicalClassCode(rawScope) : "ALL");
    const subjKey = resolveSubjectKey(
      payload.subjectKey || payload.subject || "",
      classScope !== "ALL" ? classScope : ""
    );
    const subjMeta = getSubjectMeta(subjKey);

    const existingIdx = payload.id ? db.gradebookSlots.findIndex(s => s && s.id === payload.id) : -1;
    const subjectSlots = db.gradebookSlots.filter(s => s && inferSlotSubjectKey(s) === subjKey);

    if (existingIdx < 0 && subjectSlots.length >= MAX_GRADEBOOK_SLOTS) {
      return {
        ok: false,
        error: `Maksimal ${MAX_GRADEBOOK_SLOTS} tugas / penilaian untuk ${subjMeta.label} sudah tercapai. Edit atau hapus salah satu slot terlebih dahulu.`
      };
    }

    const kkmVal = Number(payload.kkm);
    const maxVal = Number(payload.maxScore);

    if (existingIdx >= 0) {
      const updated = Object.assign({}, db.gradebookSlots[existingIdx], {
        title,
        category: String(payload.category || db.gradebookSlots[existingIdx].category || "Tugas Karya").trim(),
        subjectKey: subjKey,
        subject: subjMeta.label,
        date: String(payload.date || "").trim(),
        kkm: Number.isFinite(kkmVal) ? Math.max(0, Math.min(100, kkmVal)) : 75,
        maxScore: Number.isFinite(maxVal) ? Math.max(10, Math.min(100, maxVal)) : 100,
        classScope,
        linkedTaskId: String(payload.linkedTaskId || "").trim(),
        updatedAt: nowIso
      });
      db.gradebookSlots[existingIdx] = updated;
      db.gradebookUpdatedAt = nowIso;
      saveDb(db);
      syncGradebookToCloud(db, {});
      return { ok: true, slot: updated, isNew: false };
    }

    // Cari ID bersih <PREFIX>_T01..<PREFIX>_T10 yang belum terpakai
    let nextId = "";
    for (let n = 1; n <= MAX_GRADEBOOK_SLOTS; n++) {
      const cand = `${subjMeta.code}_T${String(n).padStart(2, "0")}`;
      if (!db.gradebookSlots.some(s => s && s.id === cand)) {
        nextId = cand;
        break;
      }
    }
    if (!nextId) nextId = `${subjMeta.code}_T_${Date.now()}`;

    if (db.gradebookDeletedSlots && db.gradebookDeletedSlots[nextId]) {
      delete db.gradebookDeletedSlots[nextId];
    }

    const created = {
      id: nextId,
      slotNum: subjectSlots.length + 1,
      subjectKey: subjKey,
      subject: subjMeta.label,
      title,
      category: String(payload.category || "Tugas Karya").trim(),
      date: String(payload.date || new Date().toISOString().slice(0, 10)).trim(),
      kkm: Number.isFinite(kkmVal) ? Math.max(0, Math.min(100, kkmVal)) : 75,
      maxScore: Number.isFinite(maxVal) ? Math.max(10, Math.min(100, maxVal)) : 100,
      classScope,
      linkedTaskId: String(payload.linkedTaskId || "").trim(),
      createdAt: nowIso,
      updatedAt: nowIso
    };
    db.gradebookSlots.push(created);
    let num = 0;
    db.gradebookSlots.forEach(s => { if (s && inferSlotSubjectKey(s) === subjKey) { num++; s.slotNum = num; } });
    db.gradebookUpdatedAt = nowIso;
    saveDb(db);
    syncGradebookToCloud(db, {});
    return { ok: true, slot: created, isNew: true };
  }

  function deleteGradebookSlot(db, slotId) {
    if (!db || !slotId) return false;
    if (!Array.isArray(db.gradebookSlots)) return false;
    const target = db.gradebookSlots.find(s => s && s.id === slotId);
    if (!target) return false;
    const subjKey = inferSlotSubjectKey(target);
    const nowIso = new Date().toISOString();

    db.gradebookSlots = db.gradebookSlots.filter(s => s && s.id !== slotId);
    let num = 0;
    db.gradebookSlots.forEach(s => { if (s && inferSlotSubjectKey(s) === subjKey) { num++; s.slotNum = num; } });

    if (!db.gradebookDeletedSlots || typeof db.gradebookDeletedSlots !== "object") db.gradebookDeletedSlots = {};
    db.gradebookDeletedSlots[slotId] = nowIso;

    const tombstones = {};
    if (db.directGrades && typeof db.directGrades === "object") {
      Object.keys(db.directGrades).forEach(k => {
        const g = db.directGrades[k];
        if (k.startsWith(slotId + "__") || (g && g.slotId === slotId)) {
          db.directGrades[k] = Object.assign({}, g || {}, {
            key: k,
            slotId,
            subjectKey: subjKey,
            score: null,
            deleted: true,
            updatedAt: nowIso
          });
          tombstones[k] = db.directGrades[k];
        }
      });
    }
    db.gradebookUpdatedAt = nowIso;
    saveDb(db);
    syncGradebookToCloud(db, tombstones);
    return true;
  }

  function getDirectGrade(db, slotId, nis) {
    if (!db || !db.directGrades || !slotId || !nis) return null;
    const cleanNis = normalizeNis(nis);
    const exact = db.directGrades[gradeKey(slotId, cleanNis)];
    if (exact) {
      if (exact.deleted || exact.score === null || exact.score === undefined || exact.score === "") return null;
      return exact;
    }
    const cNis = compactNisDigits(cleanNis);
    if (!cNis) return null;
    const vals = Object.values(db.directGrades);
    for (let i = 0; i < vals.length; i++) {
      const g = vals[i];
      if (g && g.slotId === slotId && compactNisDigits(g.nis) === cNis) {
        if (g.deleted || g.score === null || g.score === undefined || g.score === "") return null;
        return g;
      }
    }
    return null;
  }

  function setDirectGrade(db, { slotId, subjectKey, nis, studentName, classCode, score, note, updatedBy }) {
    if (!db || !slotId || !nis) return { ok: false, error: "Data nilai tidak lengkap." };
    if (!db.directGrades || typeof db.directGrades !== "object") db.directGrades = {};
    const cleanSlotId = String(slotId).trim();
    const cleanNis = normalizeNis(nis);
    const key = gradeKey(cleanSlotId, cleanNis);
    const nowIso = new Date().toISOString();
    const cls = canonicalClassCode(classCode || "XI DKV 1");
    const slotObj = (db.gradebookSlots || []).find(s => s && s.id === cleanSlotId);
    const resolvedSubj = subjectKey
      ? resolveSubjectKey(subjectKey, cls)
      : (slotObj ? inferSlotSubjectKey(slotObj) : resolveSubjectKey(cleanSlotId.startsWith("PL_") ? "perangkat_lunak" : "editing_audio_video", cls));
    const prev = db.directGrades[key] || {};

    if (score === null || score === undefined || String(score).trim() === "") {
      db.directGrades[key] = {
        key,
        slotId: cleanSlotId,
        subjectKey: resolvedSubj,
        nis: cleanNis,
        studentName: String(studentName || prev.studentName || "").trim(),
        classCode: cls,
        score: null,
        deleted: true,
        note: "",
        updatedAt: nowIso,
        updatedBy: String(updatedBy || prev.updatedBy || "Guru Pengampu").trim()
      };
      db.gradebookUpdatedAt = nowIso;
      saveDb(db);
      scheduleGradebookCloudSync(db, key);
      return { ok: true, cleared: true, key };
    }

    const parsed = Number(String(score).replace(",", "."));
    if (!Number.isFinite(parsed)) {
      return { ok: false, error: "Nilai harus berupa angka 0–100." };
    }
    const clamped = Math.round(Math.max(0, Math.min(100, parsed)) * 10) / 10;
    const entry = {
      key,
      slotId: cleanSlotId,
      subjectKey: resolvedSubj,
      nis: cleanNis,
      studentName: String(studentName || prev.studentName || "").trim(),
      classCode: cls,
      score: clamped,
      deleted: false,
      note: note !== undefined ? String(note).trim() : String(prev.note || "").trim(),
      updatedAt: nowIso,
      updatedBy: String(updatedBy || prev.updatedBy || "Guru Pengampu").trim()
    };
    db.directGrades[key] = entry;
    db.gradebookUpdatedAt = nowIso;
    saveDb(db);
    scheduleGradebookCloudSync(db, key);
    return { ok: true, entry };
  }

  function setDirectGradesBulk(db, entries) {
    if (!db || !Array.isArray(entries)) return { count: 0 };
    if (!db.directGrades || typeof db.directGrades !== "object") db.directGrades = {};
    const nowIso = new Date().toISOString();
    let count = 0;
    const changedMap = {};

    entries.forEach(item => {
      if (!item || !item.slotId || !item.nis) return;
      const cleanSlotId = String(item.slotId).trim();
      const cleanNis = normalizeNis(item.nis);
      const key = gradeKey(cleanSlotId, cleanNis);
      const cls = canonicalClassCode(item.classCode || "XI DKV 1");
      const slotObj = (db.gradebookSlots || []).find(s => s && s.id === cleanSlotId);
      const resolvedSubj = item.subjectKey
        ? resolveSubjectKey(item.subjectKey, cls)
        : (slotObj ? inferSlotSubjectKey(slotObj) : resolveSubjectKey(cleanSlotId.startsWith("PL_") ? "perangkat_lunak" : "editing_audio_video", cls));
      const prev = db.directGrades[key] || {};

      if (item.score === null || item.score === undefined || String(item.score).trim() === "") {
        db.directGrades[key] = {
          key,
          slotId: cleanSlotId,
          subjectKey: resolvedSubj,
          nis: cleanNis,
          studentName: String(item.studentName || prev.studentName || "").trim(),
          classCode: cls,
          score: null,
          deleted: true,
          note: "",
          updatedAt: nowIso,
          updatedBy: String(item.updatedBy || prev.updatedBy || "Guru Pengampu").trim()
        };
        changedMap[key] = db.directGrades[key];
        count++;
        return;
      }
      const parsed = Number(String(item.score).replace(",", "."));
      if (!Number.isFinite(parsed)) return;
      const clamped = Math.round(Math.max(0, Math.min(100, parsed)) * 10) / 10;
      db.directGrades[key] = {
        key,
        slotId: cleanSlotId,
        subjectKey: resolvedSubj,
        nis: cleanNis,
        studentName: String(item.studentName || prev.studentName || "").trim(),
        classCode: cls,
        score: clamped,
        deleted: false,
        note: item.note !== undefined ? String(item.note).trim() : String(prev.note || "").trim(),
        updatedAt: nowIso,
        updatedBy: String(item.updatedBy || prev.updatedBy || "Guru Pengampu").trim()
      };
      changedMap[key] = db.directGrades[key];
      count++;
    });

    if (count > 0) {
      db.gradebookUpdatedAt = nowIso;
      saveDb(db);
      syncGradebookToCloud(db, changedMap);
    }
    return { count };
  }

  function isKaryaSlot(slot) {
    if (!slot) return false;
    const cat = String(slot.category || "").trim().toLowerCase();
    return cat === "tugas karya" || cat === "karya" || cat === "proyek" || cat === "tugas";
  }

  function applyDefaultGradebookTemplate(db, replaceAll, subjectKey) {
    if (!db) return { added: 0, total: 0 };
    if (!Array.isArray(db.gradebookSlots)) db.gradebookSlots = [];
    const subjKey = resolveSubjectKey(subjectKey || "editing_audio_video");
    const templates = buildDefaultSlotsForSubject(subjKey);
    const nowIso = new Date().toISOString();
    let added = 0;

    if (replaceAll) {
      db.gradebookSlots = db.gradebookSlots.filter(s => s && inferSlotSubjectKey(s) !== subjKey);
      templates.forEach((s, idx) => {
        if (db.gradebookDeletedSlots) delete db.gradebookDeletedSlots[s.id];
        db.gradebookSlots.push({ ...s, slotNum: idx + 1, updatedAt: nowIso });
        added++;
      });
    } else {
      const existingSubj = db.gradebookSlots.filter(s => s && inferSlotSubjectKey(s) === subjKey);
      let count = existingSubj.length;
      templates.forEach(tpl => {
        if (count >= MAX_GRADEBOOK_SLOTS) return;
        const hasId = db.gradebookSlots.some(s => s && s.id === tpl.id);
        const hasSameTitle = existingSubj.some(s => s && String(s.title || "").trim().toLowerCase() === tpl.title.toLowerCase());
        if (!hasId && !hasSameTitle) {
          if (db.gradebookDeletedSlots) delete db.gradebookDeletedSlots[tpl.id];
          db.gradebookSlots.push({ ...tpl, updatedAt: nowIso });
          count++;
          added++;
        }
      });
      let num = 0;
      db.gradebookSlots.forEach(s => { if (s && inferSlotSubjectKey(s) === subjKey) { num++; s.slotNum = num; } });
    }

    if (added > 0) {
      db.gradebookUpdatedAt = nowIso;
      saveDb(db);
      syncGradebookToCloud(db, {});
    }
    const finalCount = db.gradebookSlots.filter(s => s && inferSlotSubjectKey(s) === subjKey).length;
    return { added, total: finalCount };
  }

  function getStudentDirectGrades(db, nis, classCode, subjectKey) {
    const slots = getGradebookSlots(db, classCode, subjectKey);
    return slots.map(slot => ({
      slot,
      entry: getDirectGrade(db, slot.id, nis)
    }));
  }

  function saveLearningProgressToCloud(db, learningProgress, learningProgressTs) {
    if (db) {
      db.learningProgress = learningProgress || {};
      db.learningProgressTs = learningProgressTs || {};
      saveDb(db);
    }
    return postCloudAction({
      action: "save_learning_progress",
      learningProgress: learningProgress || {},
      learningProgressTs: learningProgressTs || {}
    });
  }

  global.BinaBangsaDB = {
    DB_KEY,
    SESSION_KEY,
    GAS_URL_KEY,
    ACTIVE_SUBJECT_KEY,
    SEED_BASELINE_TS,
    REQUIRED_GAS_VERSION,
    DEFAULT_STUDENT_PASS,
    MAX_GRADEBOOK_SLOTS,
    ALLOWED_CLASSES,
    CLASS_MATRIX,
    GRADE_XI_SUBJECTS,
    GRADE_X_DEFAULT_SUBJECT,
    ALL_SUBJECTS,
    DEFAULT_GRADEBOOK_SLOTS,
    DEFAULT_GRADEBOOK_SLOTS_BY_SUBJECT,
    DEFAULT_ADRIAN_SCHEDULE,
    canonicalClassCode,
    isAllowedClassCode,
    isGradeXIClass,
    isGradeXClass,
    legacyClassKey,
    parseClassParts,
    resolveSubjectKey,
    getSubjectMeta,
    getSubjectsForClass,
    inferSlotSubjectKey,
    inferSubmissionSubjectKey,
    getSavedActiveSubject,
    saveActiveSubject,
    normalizeNis,
    normalizeWeekKey,
    getDefaultSessionKey,
    getTodaySessionKey,
    formatTimeWIB,
    attendanceKey,
    gradeKey,
    getAllClassCodes,
    getScheduledSlotForDay,
    setCloudCapabilities,
    getCloudCapabilities,
    resetCloudCapabilities,
    onSyncStateChange,
    updateSyncState,
    setManualGasUrl,
    parseQrTokenInfo,
    bootstrapDb,
    saveDb,
    getSession,
    setSession,
    authenticateTeacher,
    registerTeacher,
    updateTeacherClasses,
    findStudentByNis,
    authenticateStudent,
    upsertStudent,
    importStudentsBulk,
    resetStudentPassword,
    changeStudentPassword,
    createQrSession,
    processQrCheckIn,
    submitStudentAbsence,
    setStudentAttendanceStatus,
    setClassAttendanceBulk,
    getClassAttendanceBreakdown,
    markRemainingUnscannedAs,
    computeStudentOverallAttendancePct,
    getStudentSelectedClasses,
    updateStudentSelectedClasses,
    getNotificationsForTeacher,
    getNotificationsForStudent,
    formatSubmissionTimeWIB,
    getTaskNotificationsForTeacher,
    getTaskNotificationsForStudent,
    markNotificationsRead,
    getGradebookSlots,
    isKaryaSlot,
    applyDefaultGradebookTemplate,
    saveGradebookSlot,
    deleteGradebookSlot,
    getDirectGrade,
    setDirectGrade,
    setDirectGradesBulk,
    getStudentDirectGrades,
    syncGradebookToCloud,
    flushDirtyGradebookNow,
    saveLearningProgressToCloud,
    resolveGasUrl,
    postCloudAction,
    flushPendingCloudActions,
    mergeCloudPortalDb,
    reconcileAndPushLocalNewerToCloud
  };
})(window);
