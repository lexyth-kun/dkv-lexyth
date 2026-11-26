import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
fs.mkdirSync(distDir, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(__dirname, 'src/main.js')],
  bundle: true,
  format: 'esm',
  minify: true,
  sourcemap: false,
  target: ['es2020'],
  outfile: path.join(distDir, 'about.bundle.js')
});

await esbuild.build({
  entryPoints: [path.join(__dirname, 'src/styles.css')],
  bundle: true,
  minify: true,
  external: ['/assets/*', '/about/assets/*'],
  target: ['chrome100', 'safari15', 'firefox100'],
  outfile: path.join(distDir, 'about.bundle.css')
});

const jsBuf = fs.readFileSync(path.join(distDir, 'about.bundle.js'));
const jsGz = zlib.gzipSync(jsBuf, { level: 9 });
const cssBuf = fs.readFileSync(path.join(distDir, 'about.bundle.css'));
const cssGz = zlib.gzipSync(cssBuf, { level: 9 });

const jsGzKB = +(jsGz.length / 1024).toFixed(2);
const cssGzKB = +(cssGz.length / 1024).toFixed(2);

console.log(`Built about.bundle.js:  ${(jsBuf.length / 1024).toFixed(2)} KB raw | ${jsGzKB} KB gzip`);
console.log(`Built about.bundle.css: ${(cssBuf.length / 1024).toFixed(2)} KB raw | ${cssGzKB} KB gzip`);

if (jsGzKB > 300) {
  console.error(`ERROR: JS gzip budget exceeded (${jsGzKB} KB > 300 KB)`);
  process.exit(1);
}
