import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateContentSchema,
  resolveHeaderTheme,
  createTeamCarouselController,
  createKeahlianDeckController,
  computeNextPageCharge,
  computeContrastRatio,
  escapeHtml
} from '../src/ui-controllers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const contentPath = path.join(rootDir, 'content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

test('content.json passes schema validation with zero em dashes and zero placeholder slop', () => {
  const raw = fs.readFileSync(contentPath, 'utf8');
  assert.equal(raw.includes('\u2014'), false, 'content.json must not contain em dash (R-02)');
  assert.equal(/lorem ipsum|john doe|10k\+|99\.9%|awards|penghargaan palsu/i.test(raw), false, 'content.json must not contain fabricated/slop text');

  const result = validateContentSchema(content);
  assert.equal(result.ok, true, `Schema errors: ${result.errors.join('; ')}`);
  assert.equal(content.team.roles.length, 4);
  assert.equal(content.keahlian.items.length, 8);
  assert.equal(content.materiPertemuan.materiItems.length, 3);
  assert.equal(content.materiPertemuan.pertemuanItems.length, 6);
  assert.equal(content.expertise.cards.length, 4);
  assert.equal(content.menu.links.length, 4);
  assert.equal(content.nextPage.href, '/database-tugas');
});

test('all local image assets referenced in content.json exist and zero personal face photos are used', () => {
  assert.equal(content.team.portraitMode, 'anonymous-hologram-silhouette');
  assert.equal('portraitSrc' in content.team, false, 'Personal portrait photo must not be referenced');
  assert.equal(fs.existsSync(path.join(rootDir, 'assets/adrian-lusion-portrait.webp')), false, 'Personal portrait file must be removed');

  const rawContent = fs.readFileSync(contentPath, 'utf8');
  assert.equal(/adrian-lusion-portrait|adrian-profile|adrian-hologram/i.test(rawContent), false, 'No personal photo path allowed in content.json');

  const imagePaths = [
    content.preloader.logoSrc,
    ...content.materiPertemuan.materiItems.map((m) => m.image)
  ];
  for (const rel of imagePaths) {
    assert.ok(rel.startsWith('/about/assets/'), `Expected /about/assets/ path, got ${rel}`);
    const fileOnDisk = path.join(rootDir, rel.replace(/^\/about\//, ''));
    assert.equal(fs.existsSync(fileOnDisk), true, `Missing asset: ${fileOnDisk}`);
  }
});

test('resolveHeaderTheme returns exact abrupt section theme (black / blue / white)', () => {
  assert.equal(resolveHeaderTheme('hero'), 'dark');
  assert.equal(resolveHeaderTheme('team'), 'dark');
  assert.equal(resolveHeaderTheme('keahlian'), 'dark');
  assert.equal(resolveHeaderTheme('materi'), 'dark');
  assert.equal(resolveHeaderTheme('expertise'), 'blue');
  assert.equal(resolveHeaderTheme('cta'), 'blue');
  assert.equal(resolveHeaderTheme('footer'), 'light');
  assert.equal(resolveHeaderTheme('nextpage'), 'dark');
});

test('WCAG AA contrast ratios hold for all three color planes (#000000, #1D3CFF, #FFFFFF)', () => {
  assert.ok(computeContrastRatio('#FFFFFF', '#000000') >= 4.5);
  assert.ok(computeContrastRatio('#FFFFFF', '#1D3CFF') >= 4.5);
  assert.ok(computeContrastRatio('#09090B', '#FFFFFF') >= 4.5);
  assert.ok(computeContrastRatio('#1D3CFF', '#FFFFFF') >= 4.5);
  assert.ok(computeContrastRatio('#A1A1AA', '#000000') >= 4.5);
});

test('Team 4-role carousel wraps and maps scroll progress 0..1 to indices 0..3', () => {
  const team = createTeamCarouselController(4);
  assert.equal(team.getIndex(), 0);
  assert.equal(team.next(), 1);
  assert.equal(team.next(), 2);
  assert.equal(team.next(), 3);
  assert.equal(team.next(), 0);
  assert.equal(team.prev(), 3);
  assert.equal(team.setFromProgress(0), 0);
  assert.equal(team.setFromProgress(0.35), 1);
  assert.equal(team.setFromProgress(0.65), 2);
  assert.equal(team.setFromProgress(0.99), 3);
});

test('Keahlian 8-skill deck supports clamping, stepping, and drag deltas', () => {
  const deck = createKeahlianDeckController(8);
  assert.equal(deck.getIndex(), 0);
  assert.equal(deck.step(1), 1);
  assert.equal(deck.step(-5), 0);
  assert.equal(deck.step(99), 7);
  assert.equal(deck.applyDragDelta(-90, 40), 7);
  assert.equal(deck.applyDragDelta(90, 40), 6);
});

test('computeNextPageCharge accumulates only at bottom boundary and triggers at 1.0', () => {
  assert.equal(computeNextPageCharge(0.2, 120, false), 0);
  const c1 = computeNextPageCharge(0, 150, true, 600);
  assert.equal(c1, 0.25);
  const c2 = computeNextPageCharge(0.85, 200, true, 600);
  assert.equal(c2, 1);
});

test('escapeHtml neutralizes angle brackets and quotes safely', () => {
  assert.equal(escapeHtml('<script>"x" & \'y\'</script>'), '&lt;script&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/script&gt;');
});
