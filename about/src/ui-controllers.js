export function validateContentSchema(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return { ok: false, errors: ['Root content must be an object'] };
  }
  const requiredTop = [
    'meta',
    'preloader',
    'header',
    'menu',
    'hero',
    'team',
    'brands',
    'keahlian',
    'materiPertemuan',
    'expertise',
    'cta',
    'footer',
    'nextPage'
  ];
  for (const key of requiredTop) {
    if (!data[key]) errors.push(`Missing top-level section: ${key}`);
  }
  if (!Array.isArray(data.team?.roles) || data.team.roles.length !== 4) {
    errors.push('team.roles must contain exactly 4 Kak Adrian roles');
  }
  if (!Array.isArray(data.keahlian?.items) || data.keahlian.items.length !== 8) {
    errors.push('keahlian.items must contain exactly 8 real DKV skills');
  }
  if (!Array.isArray(data.materiPertemuan?.materiItems) || data.materiPertemuan.materiItems.length !== 3) {
    errors.push('materiPertemuan.materiItems must contain exactly 3 items');
  }
  if (!Array.isArray(data.materiPertemuan?.pertemuanItems) || data.materiPertemuan.pertemuanItems.length !== 6) {
    errors.push('materiPertemuan.pertemuanItems must contain exactly 6 items');
  }
  if (!Array.isArray(data.expertise?.cards) || data.expertise.cards.length !== 4) {
    errors.push('expertise.cards must contain exactly 4 cards');
  }
  const hrefs = [
    data.header?.brandHref,
    data.header?.contactHref,
    ...(data.menu?.links || []).map((l) => l.href),
    ...(data.materiPertemuan?.materiItems || []).map((m) => m.href),
    ...(data.materiPertemuan?.pertemuanItems || []).map((p) => p.href),
    data.cta?.primaryAction?.href,
    data.cta?.secondaryAction?.href,
    ...(data.footer?.portalLinks || []).map((l) => l.href),
    ...(data.footer?.socials || []).map((s) => s.href),
    data.nextPage?.href
  ];
  for (const h of hrefs) {
    if (typeof h !== 'string' || !h.trim() || h === '#') {
      errors.push(`Invalid href detected: ${String(h)}`);
    }
  }
  return { ok: errors.length === 0, errors };
}

const SECTION_THEMES = {
  hero: 'dark',
  team: 'dark',
  brands: 'dark',
  keahlian: 'dark',
  materi: 'dark',
  pertemuan: 'dark',
  expertise: 'blue',
  cta: 'blue',
  footer: 'light',
  nextpage: 'dark'
};

export function resolveHeaderTheme(sectionId) {
  return SECTION_THEMES[sectionId] || 'dark';
}

export function createTeamCarouselController(totalRoles = 4) {
  let index = 0;
  const clampCount = Math.max(1, totalRoles);
  return {
    getIndex() {
      return index;
    },
    setIndex(nextIdx) {
      index = ((nextIdx % clampCount) + clampCount) % clampCount;
      return index;
    },
    next() {
      index = (index + 1) % clampCount;
      return index;
    },
    prev() {
      index = (index - 1 + clampCount) % clampCount;
      return index;
    },
    setFromProgress(progress) {
      const clamped = Math.max(0, Math.min(0.9999, Number(progress) || 0));
      index = Math.min(clampCount - 1, Math.floor(clamped * clampCount));
      return index;
    }
  };
}

export function createKeahlianDeckController(totalItems = 8) {
  let index = 0;
  const maxIndex = Math.max(0, totalItems - 1);
  return {
    getIndex() {
      return index;
    },
    setIndex(nextIdx) {
      index = Math.max(0, Math.min(maxIndex, Math.round(nextIdx)));
      return index;
    },
    step(delta) {
      index = Math.max(0, Math.min(maxIndex, index + delta));
      return index;
    },
    applyDragDelta(deltaX, threshold = 48) {
      if (deltaX <= -threshold) return this.step(1);
      if (deltaX >= threshold) return this.step(-1);
      return index;
    },
    setFromProgress(progress) {
      const clamped = Math.max(0, Math.min(1, Number(progress) || 0));
      index = Math.round(clamped * maxIndex);
      return index;
    }
  };
}

export function computeNextPageCharge(currentCharge, deltaY, isAtBottom, thresholdPx = 600) {
  if (!isAtBottom) return 0;
  const safeCurrent = Math.max(0, Math.min(1, Number(currentCharge) || 0));
  if (deltaY <= 0) {
    return Math.max(0, +(safeCurrent + deltaY / thresholdPx).toFixed(4));
  }
  return Math.min(1, +(safeCurrent + deltaY / thresholdPx).toFixed(4));
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function channelLuminance(v) {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function computeContrastRatio(hexA, hexB) {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const L1 = 0.2126 * channelLuminance(r1) + 0.7152 * channelLuminance(g1) + 0.0722 * channelLuminance(b1);
  const L2 = 0.2126 * channelLuminance(r2) + 0.7152 * channelLuminance(g2) + 0.0722 * channelLuminance(b2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function escapeHtml(input) {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
