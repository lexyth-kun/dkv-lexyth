import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  validateContentSchema,
  resolveHeaderTheme,
  escapeHtml
} from './ui-controllers.js';
import { createWebGLStage } from './webgl-stage.js';

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

  initHeaderInteractions(content, stage);
  initHeroScrollChoreography(stage);
  setSurfaceAndHeader('hero');

  // Smooth jump for in-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(targetEl);
        else targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  runPreloader(() => {
    ScrollTrigger.refresh();
  });

  window.__ABOUT_CTX__ = { content, stage, lenis, setSurfaceAndHeader };
}

bootstrap();
