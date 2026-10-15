// Verifica, no dist/ gerado, links internos e âncoras (inclusive nas páginas em /en/).
// Uso: npm run build && npm run check
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
if (!existsSync(root)) {
  console.error('check-links: dist/ não existe; rode npm run build antes');
  process.exit(2);
}

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p);
  }
})(root);

const cache = new Map();
const idsOf = (file) => {
  if (!cache.has(file)) {
    const html = readFileSync(file, 'utf8');
    cache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return cache.get(file);
};

let broken = 0, badAnchors = 0, checked = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const seen = new Set();
  for (const m of html.matchAll(/href="(\/[^"#?]*)(#[^"]*)?"/g)) {
    const [, path, anchor = ''] = m;
    const key = path + anchor;
    if (seen.has(key)) continue;
    seen.add(key);
    if (/^\/(_astro|pagefind|_llms)/.test(path)) continue;
    const direct = join(root, path);
    const target = existsSync(direct) && statSync(direct).isFile() ? direct : join(direct, 'index.html');
    if (!existsSync(target)) {
      console.log(`QUEBRADO  ${file.replace(root, '')}  →  ${path}`);
      broken++;
      continue;
    }
    if (anchor && target.endsWith('.html')) {
      checked++;
      const id = decodeURIComponent(anchor.slice(1));
      if (!idsOf(target).has(id)) {
        console.log(`ÂNCORA    ${file.replace(root, '')}  →  ${path}${decodeURIComponent(anchor)}`);
        badAnchors++;
      }
    }
  }
}
console.log(`check-links: ${files.length} páginas, ${checked} âncoras verificadas, ${broken} links quebrados, ${badAnchors} âncoras ruins`);
process.exit(broken || badAnchors ? 1 : 0);
