const fs = require('fs');
const path = require('path');

const root = __dirname;
const rootHtml = fs.readdirSync(root).filter(x => x.endsWith('.html')).sort();
const htmlFiles = [...rootHtml, ...fs.readdirSync(path.join(root, 'articles')).filter(x => x.endsWith('.html')).map(x => `articles/${x}`)];
const failures = [];
let checked = 0;

for (const rel of htmlFiles) {
  const file = path.join(root, rel);
  const html = fs.readFileSync(file, 'utf8');
  const attrs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]);
  for (const value of attrs) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(value)) continue;
    const clean = value.split('#')[0].split('?')[0];
    if (!clean) continue;
    checked++;
    const resolved = path.resolve(path.dirname(file), clean);
    if (!fs.existsSync(resolved)) failures.push(`${rel} -> ${value}`);
  }
  if (rel.startsWith('articles/')) {
    for (const required of ['rel="canonical"', 'property="og:title"', 'type="application/ld+json"', 'class="article-cover"']) {
      if (!html.includes(required)) failures.push(`${rel} missing ${required}`);
    }
  }
}

const index = fs.readFileSync(path.join(root, 'articles.js'), 'utf8');
const slugs = [...index.matchAll(/"slug":"([^"]+)"/g)].map(m => m[1]);
if (slugs.length !== 55) failures.push(`Expected 55 indexed articles, found ${slugs.length}`);
if (new Set(slugs).size !== slugs.length) failures.push('Duplicate article slugs found');

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const slug of slugs) if (!sitemap.includes(`/articles/${slug}.html`)) failures.push(`Sitemap missing ${slug}`);
for (const file of rootHtml.filter(x => x !== 'index.html')) if (!sitemap.includes(`/${file}`)) failures.push(`Sitemap missing ${file}`);

if (failures.length) {
  console.error(`Site check failed (${failures.length})\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`Site check passed: ${htmlFiles.length} HTML files, ${checked} local references, ${slugs.length} articles.`);
