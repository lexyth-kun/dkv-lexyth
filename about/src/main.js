import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  validateContentSchema,
  resolveHeaderTheme,
  createTeamCarouselController,
  createKeahlianDeckController,
  computeNextPageCharge,
  escapeHtml
} from './ui-controllers.js';
import { createWebGLStage } from './webgl-stage.js';
import { createTeamPointCloudScene } from './scene-team.js';
import { createKeahlianShardScene } from './scene-keahlian.js';
import { createExpertiseRibbonScene, createCtaParticleArchScene } from './scene-blue.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function createAmbientAudio() {
  let ctx = null;
  let gain = null;
  let playing = false;

  return {
    toggle() {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;
        ctx = new AudioCtx();
        gain = ctx.createGain();
        gain.gain.value = 0.0001;
        gain.connect(ctx.destination);

        // Subtle studio harmonic drone (A2 + E3 soft sine)
        const freqs = [110, 164.81, 220];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const subGain = ctx.createGain();
          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.value = f;
          subGain.gain.value = idx === 0 ? 0.45 : 0.16;
          osc.connect(subGain);
          subGain.connect(gain);
          osc.start();
        });
      }

      if (ctx.state === 'suspended') ctx.resume();
      playing = !playing;
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(playing ? 0.045 : 0.0001, now, 0.25);
      return playing;
    }
  };
}

function runPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloaderBar');
  const counter = document.getElementById('preloaderCounter');

  if (!preloader) {
    onComplete();
    return;
  }

  if (prefersReducedMotion) {
    if (bar) bar.style.transform = 'scaleX(1)';
    if (counter) counter.textContent = '100';
    preloader.classList.add('is-done');
    onComplete();
    return;
  }

  const obj = { val: 0 };
  gsap.to(obj, {
    val: 100,
    duration: 1.05,
    ease: 'power2.inOut',
    onUpdate() {
      const n = Math.round(obj.val);
      if (counter) counter.textContent = String(n).padStart(3, '0');
      if (bar) bar.style.transform = `scaleX(${n / 100})`;
    },
    onComplete() {
      preloader.classList.add('is-done');
      onComplete();
    }
  });
}

function hydrateShellAndHero(data) {
  document.title = data.meta.title;
  const brand = document.getElementById('headerBrand');
  if (brand) {
    brand.textContent = data.header.brandText;
    brand.href = data.header.brandHref;
    brand.setAttribute('aria-label', data.header.brandAriaLabel);
  }

  const contactBtn = document.getElementById('headerContactBtn');
  if (contactBtn) {
    contactBtn.href = data.header.contactHref;
    const txt = contactBtn.querySelector('.pill-text');
    if (txt) txt.textContent = data.header.contactLabel;
  }

  const menuList = document.getElementById('menuLinksList');
  if (menuList) {
    menuList.innerHTML = data.menu.links
      .map(
        (item) => `
        <li>
          <a class="menu-link-item" href="${escapeHtml(item.href)}" ${item.active ? 'aria-current="page"' : ''}>
            <span>${escapeHtml(item.label)}</span>
            <span class="menu-link-dot" aria-hidden="true"></span>
          </a>
        </li>`
      )
      .join('');
  }

  const menuMeta = document.getElementById('menuMetaNote');
  if (menuMeta) menuMeta.textContent = data.menu.metaNote;

  const kicker = document.getElementById('heroKicker');
  if (kicker) kicker.textContent = data.hero.kicker;

  const h1 = document.getElementById('heroHeadlinePrimary');
  if (h1) {
    h1.innerHTML = data.hero.headlinePrimary
      .map((word) => `<span class="hero-word">${escapeHtml(word)}</span>`)
      .join(' ');
  }

  const h2 = document.getElementById('heroHeadlineSecondary');
  if (h2) h2.textContent = data.hero.headlineSecondary;

  const sub = document.getElementById('heroSubcopy');
  if (sub) sub.textContent = data.hero.subcopy;

  const cue = document.getElementById('heroScrollCueText');
  if (cue) cue.textContent = data.hero.scrollCue;
}

function initHeaderInteractions(data, stage) {
  const menuBtn = document.getElementById('menuToggleBtn');
  const menuText = document.getElementById('menuToggleText');
  const menuCard = document.getElementById('floatingMenuCard');
  const backdrop = document.getElementById('menuBackdrop');
  const soundBtn = document.getElementById('soundToggleBtn');
  const motionBtn = document.getElementById('motionToggleBtn');

  let menuOpen = false;
  const setMenuOpen = (next) => {
    menuOpen = next;
    if (menuBtn) menuBtn.setAttribute('aria-expanded', String(menuOpen));
    if (menuText) menuText.textContent = menuOpen ? data.header.closeMenuLabel : data.header.menuLabel;
    if (menuCard) menuCard.hidden = !menuOpen;
    if (backdrop) backdrop.hidden = !menuOpen;
    if (menuOpen) {
      const firstLink = menuCard?.querySelector('a');
      if (firstLink) firstLink.focus();
    } else if (menuBtn) {
      menuBtn.focus();
    }
  };

  menuBtn?.addEventListener('click', () => setMenuOpen(!menuOpen));
  backdrop?.addEventListener('click', () => setMenuOpen(false));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) {
      setMenuOpen(false);
    }
  });

  const audio = createAmbientAudio();
  soundBtn?.addEventListener('click', () => {
    const active = audio.toggle();
    soundBtn.setAttribute('aria-pressed', String(active));
    soundBtn.setAttribute('aria-label', active ? 'Matikan suara latar' : 'Aktifkan suara latar');
  });

  let motionPaused = prefersReducedMotion;
  if (motionBtn) {
    motionBtn.setAttribute('aria-pressed', String(motionPaused));
    motionBtn.addEventListener('click', () => {
      motionPaused = !motionPaused;
      motionBtn.setAttribute('aria-pressed', String(motionPaused));
      motionBtn.setAttribute('aria-label', motionPaused ? 'Lanjutkan animasi latar' : 'Jeda animasi latar');
      document.documentElement.classList.toggle('is-motion-paused', motionPaused);
      stage.setPaused(motionPaused);
    });
  }
}

function initHeroScrollChoreography(stage) {
  if (prefersReducedMotion) return;

  const heroSection = document.getElementById('sec-hero');
  if (!heroSection) return;

  const introStage = heroSection.querySelector('.hero-stage-intro');
  const stageOne = heroSection.querySelector('.hero-stage-one');
  const stageTwo = heroSection.querySelector('.hero-stage-two');
  const words = heroSection.querySelectorAll('.hero-word');
  const crosshairs = heroSection.querySelector('.hero-crosshairs');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: '+=2400',
      pin: true,
      scrub: 0.7,
      onUpdate(self) {
        stage.setState({ activeScene: 'hero', heroProgress: self.progress });
      }
    }
  });

  // 0..22%: Dissolve giant LEXYTH wordmark into Stage 1 word-by-word headline
  tl.to(introStage, { opacity: 0, y: -48, duration: 0.22, ease: 'power2.in' }, 0)
    .to(crosshairs, { opacity: 0.2, duration: 0.2 }, 0.08)
    .to(stageOne, { opacity: 1, duration: 0.08 }, 0.16)
    .to(
      words,
      {
        opacity: 1,
        y: 0,
        stagger: 0.032,
        duration: 0.22,
        ease: 'power3.out'
      },
      0.18
    )
    // 52..65%: Stage 1 exits upward as 3D canyon & explorer zoom out
    .to(stageOne, { opacity: 0, y: -44, duration: 0.16, ease: 'power2.in' }, 0.52)
    // 62..95%: Headline 2 slides in from right over 3D explorer canyon
    .fromTo(
      stageTwo,
      { opacity: 0, x: 90 },
      { opacity: 1, x: 0, duration: 0.24, ease: 'power3.out' },
      0.62
    )
    .to(stageTwo, { opacity: 1, duration: 0.14 }, 0.86);
}

export function setSurfaceAndHeader(sectionId) {
  const theme = resolveHeaderTheme(sectionId);
  const header = document.getElementById('siteHeader');
  if (header) header.setAttribute('data-header-theme', theme);

  const surface = theme === 'blue' ? 'blue' : theme === 'light' ? 'white' : 'black';
  document.body.setAttribute('data-surface', surface);
}

function mountTeamSection(content, stage, mountEl) {
  const { team } = content;
  const first = team.roles[0];

  const section = document.createElement('section');
  section.id = 'sec-team';
  section.className = 'sec sec-team';
  section.setAttribute('data-theme-section', 'team');
  section.setAttribute('aria-label', 'Peran Kak Adrian di Kelas DKV');
  section.innerHTML = `
    <div class="team-pin-viewport">
      <div class="team-top-row">
        <div id="teamIndexDisplay" class="team-bracket-index" aria-live="polite">[[ ${escapeHtml(first.index)} ]]</div>
        <div class="team-section-tag">${escapeHtml(team.sectionTag)}</div>
      </div>

      <div class="team-rulers" aria-hidden="true">
        <div class="team-ruler-left"><span>+</span><span>-</span><span>+</span><span>-</span><span>+</span></div>
        <div class="team-ruler-right"><span>+</span><span>-</span><span>+</span><span>-</span><span>+</span></div>
      </div>

      <div class="team-bottom-grid">
        <div class="team-role-card">
          <h2 id="teamNameDisplay" class="team-name-line">
            <span class="team-colons" aria-hidden="true">::</span>
            <span>${escapeHtml(first.name)}</span>
          </h2>
          <p id="teamRoleDisplay" class="team-role-title">${escapeHtml(first.role)}</p>
          <p id="teamDetailDisplay" class="team-role-detail">${escapeHtml(first.detail)}</p>
          <div class="team-controls-row">
            <button id="teamPrevBtn" type="button" class="team-arrow-btn" aria-label="Peran sebelumnya">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M11 4L6 9L11 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button id="teamNextBtn" type="button" class="team-arrow-btn team-arrow-btn-primary" aria-label="Peran berikutnya">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M7 4L12 9L7 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="team-progress-track" aria-hidden="true">
              <div id="teamProgressFill" class="team-progress-fill" style="width: 25%"></div>
            </div>
          </div>
        </div>

        <div class="team-bio-box">
          <p class="team-fixed-bio">${escapeHtml(team.fixedBio)}</p>
        </div>
      </div>
    </div>
  `;
  mountEl.appendChild(section);

  let teamScene = null;
  if (stage.isWebGL && stage.THREE) {
    teamScene = createTeamPointCloudScene(
      stage.THREE,
      stage.particleTex,
      stage.isMobile
    );
    stage.registerScene('team', teamScene);
  }

  const ctrl = createTeamCarouselController(team.roles.length);
  const idxEl = section.querySelector('#teamIndexDisplay');
  const nameEl = section.querySelector('#teamNameDisplay');
  const roleEl = section.querySelector('#teamRoleDisplay');
  const detailEl = section.querySelector('#teamDetailDisplay');
  const fillEl = section.querySelector('#teamProgressFill');

  let renderedIndex = 0;
  const applyRoleUI = (nextIdx) => {
    renderedIndex = nextIdx;
    const item = team.roles[nextIdx];
    if (idxEl) idxEl.textContent = `[[ ${item.index} ]]`;
    if (nameEl) {
      nameEl.innerHTML = `<span class="team-colons" aria-hidden="true">::</span><span>${escapeHtml(item.name)}</span>`;
    }
    if (roleEl) roleEl.textContent = item.role;
    if (detailEl) detailEl.textContent = item.detail;
    if (fillEl) fillEl.style.width = `${((nextIdx + 1) / team.roles.length) * 100}%`;
    stage.setState({ teamIndex: nextIdx });
    teamScene?.triggerRole(nextIdx);
  };

  let teamTrigger = null;
  const jumpToRole = (nextIdx) => {
    ctrl.setIndex(nextIdx);
    applyRoleUI(nextIdx);
    if (teamTrigger && !prefersReducedMotion) {
      const span = teamTrigger.end - teamTrigger.start;
      const targetScroll = teamTrigger.start + ((nextIdx + 0.35) / team.roles.length) * span;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  section.querySelector('#teamPrevBtn')?.addEventListener('click', () => {
    const nextIdx = (renderedIndex - 1 + team.roles.length) % team.roles.length;
    jumpToRole(nextIdx);
  });

  section.querySelector('#teamNextBtn')?.addEventListener('click', () => {
    const nextIdx = (renderedIndex + 1) % team.roles.length;
    jumpToRole(nextIdx);
  });

  section.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      jumpToRole((renderedIndex + 1) % team.roles.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      jumpToRole((renderedIndex - 1 + team.roles.length) % team.roles.length);
    }
  });

  if (!prefersReducedMotion) {
    teamTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=2400',
      pin: true,
      scrub: 0.5,
      onEnter() {
        setSurfaceAndHeader('team');
        stage.setState({ activeScene: 'team' });
      },
      onEnterBack() {
        setSurfaceAndHeader('team');
        stage.setState({ activeScene: 'team' });
      },
      onLeaveBack() {
        setSurfaceAndHeader('hero');
        stage.setState({ activeScene: 'hero' });
      },
      onUpdate(self) {
        const nextIdx = ctrl.setFromProgress(self.progress);
        stage.setState({ activeScene: 'team', teamProgress: self.progress, teamIndex: nextIdx });
        if (nextIdx !== renderedIndex) {
          applyRoleUI(nextIdx);
        }
      }
    });
  } else {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => stage.setState({ activeScene: 'team' }),
      onEnterBack: () => stage.setState({ activeScene: 'team' })
    });
  }
}

function mountBrandsAndKeahlian(content, stage, mountEl) {
  const { brands, keahlian } = content;

  // 3A. Stacked Statement + 3-Layer Marquee ("DKV")
  const brandsSec = document.createElement('section');
  brandsSec.id = 'sec-brands';
  brandsSec.className = 'sec sec-brands';
  brandsSec.setAttribute('data-theme-section', 'brands');
  brandsSec.setAttribute('aria-label', 'Prinsip Berkarya DKV');
  const repeatTrack = (txt) => `${escapeHtml(txt)}`.repeat(4);

  brandsSec.innerHTML = `
    <div class="brands-statement-wrap">
      <p class="brands-eyebrow">${escapeHtml(brands.eyebrow)}</p>
      <h2 class="brands-statement">
        ${brands.statement.map((line) => `<span class="brands-statement-line">${escapeHtml(line)}</span>`).join('')}
      </h2>
    </div>
    <div class="marquee-stack" aria-hidden="true">
      <div class="marquee-row marquee-row-1"><div class="marquee-track">${repeatTrack(brands.marqueeRows[0])}</div></div>
      <div class="marquee-row marquee-row-2"><div class="marquee-track">${repeatTrack(brands.marqueeRows[1])}</div></div>
      <div class="marquee-row marquee-row-3"><div class="marquee-track">${repeatTrack(brands.marqueeRows[2])}</div></div>
    </div>
  `;
  mountEl.appendChild(brandsSec);

  ScrollTrigger.create({
    trigger: brandsSec,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setSurfaceAndHeader('brands'),
    onEnterBack: () => setSurfaceAndHeader('brands')
  });

  // 3B. KEAHLIAN 08 Pinned Interactive Swipe/Drag/Scroll Stage
  const firstSkill = keahlian.items[0];
  const keahlianSec = document.createElement('section');
  keahlianSec.id = 'sec-keahlian';
  keahlianSec.className = 'sec sec-keahlian';
  keahlianSec.setAttribute('data-theme-section', 'keahlian');
  keahlianSec.setAttribute('aria-label', 'Delapan Keahlian Utama DKV');
  keahlianSec.innerHTML = `
    <div id="keahlianViewport" class="keahlian-pin-viewport">
      <div class="keahlian-top-bar">
        <div class="keahlian-heading-group">
          <h2 class="keahlian-title">${escapeHtml(keahlian.title)}</h2>
          <span class="keahlian-count">${escapeHtml(keahlian.count)}</span>
        </div>
        <p class="keahlian-hint">${escapeHtml(keahlian.hint)}</p>
      </div>

      <div class="keahlian-watermark" aria-hidden="true">${escapeHtml(keahlian.watermark)}</div>

      <div class="keahlian-bottom-stage">
        <article class="keahlian-card" aria-live="polite">
          <div class="keahlian-card-meta">
            <span id="keahlianItemIndex">${escapeHtml(firstSkill.index)} / ${escapeHtml(keahlian.count)}</span>
            <span id="keahlianItemSub" class="keahlian-card-sub">${escapeHtml(firstSkill.sublabel)}</span>
          </div>
          <h3 id="keahlianItemTitle" class="keahlian-card-title">${escapeHtml(firstSkill.title)}</h3>
          <p id="keahlianItemDesc" class="keahlian-card-desc">${escapeHtml(firstSkill.description)}</p>
        </article>

        <div class="keahlian-nav-panel">
          <div class="keahlian-arrows">
            <button id="keahlianPrevBtn" type="button" class="team-arrow-btn" aria-label="Keahlian sebelumnya">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M11 4L6 9L11 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button id="keahlianNextBtn" type="button" class="team-arrow-btn team-arrow-btn-primary" aria-label="Keahlian berikutnya">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M7 4L12 9L7 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div id="keahlianIndexStrip" class="keahlian-index-strip" role="tablist" aria-label="Pilih keahlian DKV">
            ${keahlian.items
              .map(
                (item, idx) => `
              <button
                type="button"
                role="tab"
                class="keahlian-index-btn"
                data-skill-idx="${idx}"
                aria-selected="${idx === 0 ? 'true' : 'false'}"
                aria-label="Keahlian ${escapeHtml(item.index)}: ${escapeHtml(item.title)}"
              >${escapeHtml(item.index)}</button>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  mountEl.appendChild(keahlianSec);

  let shardScene = null;
  if (stage.isWebGL && stage.THREE) {
    shardScene = createKeahlianShardScene(stage.THREE, stage.isMobile);
    stage.registerScene('keahlian', shardScene);
  }

  const deck = createKeahlianDeckController(keahlian.items.length);
  const idxEl = keahlianSec.querySelector('#keahlianItemIndex');
  const subEl = keahlianSec.querySelector('#keahlianItemSub');
  const titleEl = keahlianSec.querySelector('#keahlianItemTitle');
  const descEl = keahlianSec.querySelector('#keahlianItemDesc');
  const tabBtns = Array.from(keahlianSec.querySelectorAll('.keahlian-index-btn'));

  let activeIdx = 0;
  const renderSkill = (nextIdx) => {
    activeIdx = nextIdx;
    const item = keahlian.items[nextIdx];
    if (idxEl) idxEl.textContent = `${item.index} / ${keahlian.count}`;
    if (subEl) subEl.textContent = item.sublabel;
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.description;
    tabBtns.forEach((btn, i) => btn.setAttribute('aria-selected', String(i === nextIdx)));
    stage.setState({ keahlianIndex: nextIdx });
    shardScene?.spinToIndex(nextIdx);
  };

  let keahlianTrigger = null;
  const goToSkill = (nextIdx, syncScroll = true) => {
    const clamped = deck.setIndex(nextIdx);
    renderSkill(clamped);
    if (syncScroll && keahlianTrigger && !prefersReducedMotion) {
      const span = keahlianTrigger.end - keahlianTrigger.start;
      const denom = Math.max(1, keahlian.items.length - 1);
      window.scrollTo({ top: keahlianTrigger.start + (clamped / denom) * span, behavior: 'smooth' });
    }
  };

  keahlianSec.querySelector('#keahlianPrevBtn')?.addEventListener('click', () => goToSkill(activeIdx - 1));
  keahlianSec.querySelector('#keahlianNextBtn')?.addEventListener('click', () => goToSkill(activeIdx + 1));
  tabBtns.forEach((btn, idx) => btn.addEventListener('click', () => goToSkill(idx)));

  // Pointer drag/swipe support on stage
  const vp = keahlianSec.querySelector('#keahlianViewport');
  let dragStartX = null;
  vp?.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    dragStartX = e.clientX;
  });
  vp?.addEventListener('pointermove', (e) => {
    if (dragStartX === null) return;
    stage.setState({ keahlianDrag: e.clientX - dragStartX });
  });
  const endDrag = (e) => {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    dragStartX = null;
    stage.setState({ keahlianDrag: 0 });
    const nextIdx = deck.applyDragDelta(delta, 44);
    if (nextIdx !== activeIdx) goToSkill(nextIdx, false);
  };
  vp?.addEventListener('pointerup', endDrag);
  vp?.addEventListener('pointercancel', endDrag);

  keahlianSec.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToSkill(activeIdx + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSkill(activeIdx - 1);
    }
  });

  if (!prefersReducedMotion) {
    keahlianTrigger = ScrollTrigger.create({
      trigger: keahlianSec,
      start: 'top top',
      end: '+=2800',
      pin: true,
      scrub: 0.5,
      onEnter() {
        setSurfaceAndHeader('keahlian');
        stage.setState({ activeScene: 'keahlian' });
      },
      onEnterBack() {
        setSurfaceAndHeader('keahlian');
        stage.setState({ activeScene: 'keahlian' });
      },
      onLeaveBack() {
        setSurfaceAndHeader('brands');
        stage.setState({ activeScene: 'team' });
      },
      onUpdate(self) {
        const nextIdx = deck.setFromProgress(self.progress);
        stage.setState({ activeScene: 'keahlian', keahlianProgress: self.progress, keahlianIndex: nextIdx });
        if (nextIdx !== activeIdx) renderSkill(nextIdx);
      }
    });
  } else {
    ScrollTrigger.create({
      trigger: keahlianSec,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => stage.setState({ activeScene: 'keahlian' }),
      onEnterBack: () => stage.setState({ activeScene: 'keahlian' })
    });
  }
}

function mountMateriAndPertemuan(content, stage, mountEl) {
  const mp = content.materiPertemuan;
  const section = document.createElement('section');
  section.id = 'sec-materi';
  section.className = 'sec sec-materi';
  section.setAttribute('data-theme-section', 'materi');
  section.setAttribute('aria-label', 'Materi Pilihan dan Daftar Pertemuan DKV');

  section.innerHTML = `
    <div class="outline-divider" aria-hidden="true">
      <div class="outline-divider-line outline-divider-line-top">${escapeHtml(mp.dividerTop)}</div>
      <div class="outline-divider-line outline-divider-line-bottom">${escapeHtml(mp.dividerBottom)}</div>
    </div>

    <div class="editorial-container">
      <div class="subsec-header">
        <div class="subsec-title-wrap">
          <h2 class="subsec-title">${escapeHtml(mp.materiTitle)}</h2>
          <span class="subsec-count">${escapeHtml(mp.materiCount)}</span>
        </div>
        <a class="subsec-action-link" href="/materi-siswa">Buka Semua Materi Siswa</a>
      </div>

      <div class="materi-grid">
        ${mp.materiItems
          .map(
            (item) => `
          <a class="materi-card" href="${escapeHtml(item.href)}">
            <div class="materi-thumb-wrap">
              <img
                src="${escapeHtml(item.image)}"
                alt="${escapeHtml(item.imageAlt)}"
                width="960"
                height="540"
                loading="lazy"
                decoding="async"
                class="materi-thumb"
              />
            </div>
            <div class="materi-body">
              <span class="materi-code">${escapeHtml(item.code)}</span>
              <h3 class="materi-card-title">${escapeHtml(item.title)}</h3>
              <p class="materi-card-summary">${escapeHtml(item.summary)}</p>
              <span class="materi-card-cta">${escapeHtml(item.cta)}</span>
            </div>
          </a>`
          )
          .join('')}
      </div>

      <div class="subsec-header" id="sec-pertemuan">
        <div class="subsec-title-wrap">
          <h2 class="subsec-title">${escapeHtml(mp.pertemuanTitle)}</h2>
          <span class="subsec-count">${escapeHtml(mp.pertemuanCount)}</span>
        </div>
        <span class="keahlian-hint">SILABUS XI DKV • ADOBE PREMIERE PRO</span>
      </div>

      <ol class="pertemuan-list">
        ${mp.pertemuanItems
          .map(
            (row) => `
          <li class="pertemuan-item">
            <a class="pertemuan-row" href="${escapeHtml(row.href)}">
              <span class="pertemuan-week">${escapeHtml(row.week)}</span>
              <span class="pertemuan-title-wrap">
                <span class="pertemuan-title">${escapeHtml(row.title)}</span>
                <span class="pertemuan-strike" aria-hidden="true"></span>
              </span>
              <span class="pertemuan-cat">${escapeHtml(row.category)}</span>
            </a>
          </li>`
          )
          .join('')}
      </ol>
    </div>
  `;
  mountEl.appendChild(section);

  ScrollTrigger.create({
    trigger: section,
    start: 'top 65%',
    end: 'bottom 35%',
    onEnter: () => {
      setSurfaceAndHeader('materi');
      stage.setState({ activeScene: 'none' });
    },
    onEnterBack: () => {
      setSurfaceAndHeader('materi');
      stage.setState({ activeScene: 'none' });
    }
  });

  if (!prefersReducedMotion) {
    // Subtle opposite horizontal drift on giant outline divider
    const topLine = section.querySelector('.outline-divider-line-top');
    const bottomLine = section.querySelector('.outline-divider-line-bottom');
    if (topLine && bottomLine) {
      gsap.fromTo(
        topLine,
        { xPercent: 4 },
        {
          xPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true }
        }
      );
      gsap.fromTo(
        bottomLine,
        { xPercent: -4 },
        {
          xPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'top top', scrub: true }
        }
      );
    }

    // Lusion Talks signature: scroll-exit strikethrough as each Pertemuan row exits upper band
    section.querySelectorAll('.pertemuan-item').forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 36%',
        onEnter: () => item.classList.add('is-passed'),
        onLeaveBack: () => item.classList.remove('is-passed')
      });
    });
  }
}

function mountExpertiseAndCta(content, stage, mountEl) {
  const { expertise, cta } = content;

  // 5A. AREA KEAHLIAN: HARD SNAP BLACK -> ELECTRIC BLUE (#1D3CFF)
  const expSec = document.createElement('section');
  expSec.id = 'sec-expertise';
  expSec.className = 'sec sec-expertise';
  expSec.setAttribute('data-theme-section', 'expertise');
  expSec.setAttribute('aria-label', 'Area Keahlian Utama DKV');
  expSec.innerHTML = `
    <div class="expertise-pin-viewport">
      <div class="expertise-header">
        <div class="expertise-title-wrap">
          <h2 class="expertise-title">${escapeHtml(expertise.sectionTitle)}</h2>
          <span class="expertise-count">${escapeHtml(expertise.sectionIndex)}</span>
        </div>
        <span class="keahlian-hint" style="color:#FFFFFF;">04 PILAR PRAKTIKUM DKV</span>
      </div>

      <div class="expertise-stage">
        <div id="expertiseCardsGrid" class="expertise-cards-grid">
          ${expertise.cards
            .map(
              (card, idx) => `
            <article class="exp-card" data-card-idx="${idx}">
              <div>
                <div class="exp-card-top">
                  <span class="exp-card-letter" aria-hidden="true">${escapeHtml(card.letter)}</span>
                  <span class="exp-card-badge">0${idx + 1}</span>
                </div>
                <h3 class="exp-card-title">${escapeHtml(card.title)}</h3>
                <p class="exp-card-sub">${escapeHtml(card.subtitle)}</p>
              </div>
              <ul class="exp-leader-list">
                ${card.items
                  .map(
                    (row) => `
                  <li class="exp-leader-item">
                    <span class="exp-leader-left">${escapeHtml(row.left)}</span>
                    <span class="exp-leader-dots" aria-hidden="true"></span>
                    <span class="exp-leader-right">${escapeHtml(row.right)}</span>
                  </li>`
                  )
                  .join('')}
              </ul>
            </article>`
            )
            .join('')}
        </div>
      </div>
    </div>
  `;
  mountEl.appendChild(expSec);

  if (stage.isWebGL && stage.THREE) {
    stage.registerScene('expertise', createExpertiseRibbonScene(stage.THREE, stage.isMobile));
    stage.registerScene('cta', createCtaParticleArchScene(stage.THREE, stage.isMobile));
  }

  // HARD SNAP trigger: instant switch #000000 -> #1D3CFF (no soft fade!)
  ScrollTrigger.create({
    trigger: expSec,
    start: 'top 68%',
    end: 'bottom 20%',
    onEnter() {
      setSurfaceAndHeader('expertise');
      stage.setState({ activeScene: 'expertise' });
    },
    onEnterBack() {
      setSurfaceAndHeader('expertise');
      stage.setState({ activeScene: 'expertise' });
    },
    onLeaveBack() {
      setSurfaceAndHeader('materi');
      stage.setState({ activeScene: 'none' });
    }
  });

  // Pinned 4-card 3D fanning -> aligning choreography on desktop (stepped Z avoids card intersection)
  const isDesktop = window.innerWidth >= 900;
  if (!prefersReducedMotion && isDesktop) {
    const cards = Array.from(expSec.querySelectorAll('.exp-card'));
    const fanStates = [
      { xPercent: 105, y: 42, z: -90, rotationZ: -11, rotationY: 12, scale: 0.9 },
      { xPercent: 36, y: 16, z: -30, rotationZ: -4, rotationY: 5, scale: 0.95 },
      { xPercent: -36, y: 16, z: 30, rotationZ: 4, rotationY: -5, scale: 0.95 },
      { xPercent: -105, y: 42, z: 90, rotationZ: 11, rotationY: -12, scale: 0.9 }
    ];

    cards.forEach((card, i) => {
      card.style.zIndex = String(i + 1);
      gsap.set(card, fanStates[i]);
    });

    const expTl = gsap.timeline({
      scrollTrigger: {
        trigger: expSec,
        start: 'top top',
        end: '+=2000',
        pin: true,
        scrub: 0.65,
        onUpdate(self) {
          stage.setState({ activeScene: 'expertise', expertiseProgress: self.progress });
        }
      }
    });

    expTl.to(
      cards,
      {
        xPercent: 0,
        y: 0,
        z: 0,
        rotationZ: 0,
        rotationY: 0,
        scale: 1,
        stagger: 0.05,
        duration: 0.72,
        ease: 'power3.out'
      },
      0
    );
  }

  // 5B. CTA SECTION ON CONTINUOUS ELECTRIC BLUE (#1D3CFF)
  const ctaSec = document.createElement('section');
  ctaSec.id = 'sec-cta';
  ctaSec.className = 'sec sec-cta';
  ctaSec.setAttribute('data-theme-section', 'cta');
  ctaSec.setAttribute('aria-label', 'Ajakan Mulai Berkarya');

  const headlineChars = Array.from(cta.headline)
    .map((ch) =>
      ch === ' '
        ? '<span class="cta-char cta-char-space">&nbsp;</span>'
        : `<span class="cta-char">${escapeHtml(ch)}</span>`
    )
    .join('');

  ctaSec.innerHTML = `
    <p class="cta-eyebrow">
      ${cta.eyebrowLines.map((l) => `<span>${escapeHtml(l)}</span>`).join('<br />')}
    </p>

    <div class="cta-center">
      <h2 class="cta-headline" aria-label="${escapeHtml(cta.headline)}">${headlineChars}</h2>
      <div class="cta-actions">
        <a class="cta-btn cta-btn-white" href="${escapeHtml(cta.primaryAction.href)}">${escapeHtml(cta.primaryAction.label)}</a>
        <a class="cta-btn cta-btn-dark" href="${escapeHtml(cta.secondaryAction.href)}">${escapeHtml(cta.secondaryAction.label)}</a>
      </div>
    </div>

    <button id="ctaContinueBtn" type="button" class="cta-continue-pill">
      <span>${escapeHtml(cta.continueLabel)}</span>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 5L7 9L11 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
  mountEl.appendChild(ctaSec);

  ctaSec.querySelector('#ctaContinueBtn')?.addEventListener('click', () => {
    const footerEl = document.getElementById('kontak');
    if (footerEl) {
      footerEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  });

  ScrollTrigger.create({
    trigger: ctaSec,
    start: 'top 62%',
    end: 'bottom 25%',
    onEnter() {
      setSurfaceAndHeader('cta');
      stage.setState({ activeScene: 'cta' });
    },
    onEnterBack() {
      setSurfaceAndHeader('cta');
      stage.setState({ activeScene: 'cta' });
    },
    onUpdate(self) {
      stage.setState({ ctaProgress: self.progress });
    }
  });

  if (!prefersReducedMotion) {
    const chars = ctaSec.querySelectorAll('.cta-char');
    gsap.fromTo(
      chars,
      { opacity: 0, y: 42, rotateX: -35 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.025,
        duration: 0.65,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaSec,
          start: 'top 72%',
          once: false
        }
      }
    );
  }
}

function mountFooterAndNextPage(content, stage, mountEl, lenis) {
  const { footer, nextPage, preloader } = content;

  // 6A. WHITE FOOTER CURTAIN SLIDING UP OVER ELECTRIC BLUE
  const footerEl = document.createElement('footer');
  footerEl.id = 'kontak';
  footerEl.className = 'sec sec-footer';
  footerEl.setAttribute('data-theme-section', 'footer');
  footerEl.setAttribute('aria-label', 'Footer dan Kontak Resmi Portal DKV');
  footerEl.innerHTML = `
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-identity">
          <div class="footer-brand-row">
            <img
              src="${escapeHtml(preloader.logoSrc)}"
              alt="${escapeHtml(preloader.logoAlt)}"
              width="48"
              height="48"
              loading="lazy"
              class="footer-logo"
            />
            <div>
              <p class="footer-school">${escapeHtml(footer.schoolName)}</p>
              <h2 class="footer-mentor">${escapeHtml(footer.mentorName)}</h2>
            </div>
          </div>
          <p class="footer-desc">${escapeHtml(footer.mentorRole)}</p>
        </div>

        <nav aria-label="Tautan Portal DKV">
          <h3 class="footer-col-title">Portal DKV</h3>
          <ul class="footer-link-list">
            ${footer.portalLinks
              .map(
                (item) => `
              <li>
                <a class="footer-link" href="${escapeHtml(item.href)}">
                  <span>${escapeHtml(item.label)}</span>
                </a>
              </li>`
              )
              .join('')}
          </ul>
        </nav>

        <div>
          <h3 class="footer-col-title">Kontak &amp; Kanal Resmi</h3>
          <a class="footer-email-link" href="mailto:${escapeHtml(footer.contactEmail)}">${escapeHtml(footer.contactEmail)}</a>
          <ul class="footer-link-list">
            ${footer.socials
              .map(
                (s) => `
              <li>
                <a class="footer-link" href="${escapeHtml(s.href)}" target="_blank" rel="noopener noreferrer">
                  <span>${escapeHtml(s.label)}</span>
                  <span class="footer-handle">${escapeHtml(s.handle)}</span>
                </a>
              </li>`
              )
              .join('')}
          </ul>
        </div>
      </div>

      <div class="footer-bottom-bar">
        <p class="footer-copy">${escapeHtml(footer.copyright)}</p>
        <button id="backToTopBtn" type="button" class="back-to-top-btn">
          <span>${escapeHtml(footer.backToTopLabel)}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 11V3M7 3L3.5 6.5M7 3L10.5 6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  mountEl.appendChild(footerEl);

  footerEl.querySelector('#backToTopBtn')?.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 0.75, force: true });
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  // Invert header cleanly to dark ink while White Footer covers top viewport
  ScrollTrigger.create({
    trigger: footerEl,
    start: 'top 84px',
    end: 'bottom 84px',
    onEnter() {
      const header = document.getElementById('siteHeader');
      if (header) header.setAttribute('data-header-theme', 'light');
    },
    onEnterBack() {
      const header = document.getElementById('siteHeader');
      if (header) header.setAttribute('data-header-theme', 'light');
    },
    onLeaveBack() {
      setSurfaceAndHeader('cta');
      stage.setState({ activeScene: 'cta' });
    }
  });

  // 6B. BLACK NEXT-PAGE TEASER BAR + SCROLL-PAST-FOOTER AUTO-NAVIGATION
  const nextSec = document.createElement('section');
  nextSec.id = 'sec-nextpage';
  nextSec.className = 'sec sec-nextpage';
  nextSec.setAttribute('data-theme-section', 'nextpage');
  nextSec.setAttribute('aria-label', 'Navigasi ke Halaman Galeri Karya Siswa');
  nextSec.innerHTML = `
    <a id="nextPageLink" class="nextpage-link" href="${escapeHtml(nextPage.href)}">
      <div class="nextpage-inner">
        <div>
          <p class="nextpage-eyebrow">${escapeHtml(nextPage.eyebrow)}</p>
          <h2 class="nextpage-title">${escapeHtml(nextPage.title)}</h2>
          <p class="nextpage-hint">${escapeHtml(nextPage.hint)}</p>
        </div>
        <span class="nextpage-arrow-badge" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
    </a>
    <div class="nextpage-charge-track" aria-hidden="true">
      <div id="nextPageProgressFill" class="nextpage-charge-fill"></div>
    </div>
  `;
  mountEl.appendChild(nextSec);

  ScrollTrigger.create({
    trigger: nextSec,
    start: 'top 84px',
    onEnter() {
      const header = document.getElementById('siteHeader');
      if (header) header.setAttribute('data-header-theme', 'dark');
    },
    onLeaveBack() {
      const header = document.getElementById('siteHeader');
      if (header) header.setAttribute('data-header-theme', 'light');
    }
  });

  const fillEl = nextSec.querySelector('#nextPageProgressFill');
  const linkEl = nextSec.querySelector('#nextPageLink');
  const overlayEl = document.getElementById('pageTransitionOverlay');

  let charge = 0;
  let navigating = false;
  let decayTimer = 0;

  const triggerNextPageTransition = (targetHref) => {
    if (navigating) return;
    navigating = true;
    if (fillEl) fillEl.style.transform = 'scaleX(1)';
    if (prefersReducedMotion || !overlayEl) {
      window.location.href = targetHref;
      return;
    }
    overlayEl.hidden = false;
    overlayEl.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => overlayEl.classList.add('is-active'));
    setTimeout(() => {
      window.location.href = targetHref;
    }, 480);
  };

  linkEl?.addEventListener('click', (e) => {
    if (prefersReducedMotion) return;
    e.preventDefault();
    triggerNextPageTransition(nextPage.href);
  });

  const applyWheelOrTouchCharge = (deltaY) => {
    if (navigating || prefersReducedMotion) return;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const isAtBottom = window.scrollY >= maxScroll - 8;
    charge = computeNextPageCharge(charge, deltaY, isAtBottom, 520);
    if (fillEl) fillEl.style.transform = `scaleX(${charge})`;

    clearTimeout(decayTimer);
    if (charge >= 1) {
      triggerNextPageTransition(nextPage.href);
    } else if (charge > 0) {
      decayTimer = setTimeout(() => {
        if (!navigating) {
          charge = 0;
          if (fillEl) fillEl.style.transform = 'scaleX(0)';
        }
      }, 900);
    }
  };

  window.addEventListener(
    'wheel',
    (e) => {
      if (e.deltaY > 0) applyWheelOrTouchCharge(e.deltaY);
      else if (charge > 0) applyWheelOrTouchCharge(e.deltaY);
    },
    { passive: true }
  );

  let touchStartY = null;
  window.addEventListener(
    'touchstart',
    (e) => {
      touchStartY = e.touches[0]?.clientY ?? null;
    },
    { passive: true }
  );
  window.addEventListener(
    'touchmove',
    (e) => {
      if (touchStartY === null) return;
      const curY = e.touches[0]?.clientY ?? touchStartY;
      const dy = touchStartY - curY;
      touchStartY = curY;
      if (dy > 0) applyWheelOrTouchCharge(dy * 2.2);
    },
    { passive: true }
  );
}

async function bootstrap() {
  const banner = document.getElementById('dataStateBanner');
  let content = null;

  try {
    const res = await fetch('/about/content.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    content = await res.json();
    const check = validateContentSchema(content);
    if (!check.ok) throw new Error(check.errors.join(', '));
  } catch (err) {
    if (banner) {
      banner.hidden = false;
      banner.textContent = `Gagal memuat konten halaman About (${err.message}). Silakan muat ulang halaman.`;
    }
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('is-done');
    return;
  }

  hydrateShellAndHero(content);

  const canvas = document.getElementById('webglCanvas');
  const stage = createWebGLStage(canvas, { reducedMotion: prefersReducedMotion });

  let lenis = null;
  if (!prefersReducedMotion) {
    lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  const mountEl = document.getElementById('sectionsMount');
  initHeaderInteractions(content, stage);
  initHeroScrollChoreography(stage);
  if (mountEl) {
    mountTeamSection(content, stage, mountEl);
    mountBrandsAndKeahlian(content, stage, mountEl);
    mountMateriAndPertemuan(content, stage, mountEl);
    mountExpertiseAndCta(content, stage, mountEl);
    mountFooterAndNextPage(content, stage, mountEl, lenis);
  }
  setSurfaceAndHeader('hero');

  // Smooth jump for in-page anchor links (accurate past GSAP pinned spacers)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const targetY = Math.max(0, Math.round(targetEl.getBoundingClientRect().top + window.scrollY));
        if (lenis) lenis.scrollTo(targetY, { duration: 0.75, force: true });
        else window.scrollTo({ top: targetY, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  runPreloader(() => {
    ScrollTrigger.refresh();
  });

  window.__ABOUT_CTX__ = { content, stage, lenis, setSurfaceAndHeader };
}

bootstrap();
