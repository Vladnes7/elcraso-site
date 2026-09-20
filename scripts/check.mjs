import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('dist');
const pages = ['index.html', 'services.html', 'masters.html', 'portfolio.html', 'reviews.html', 'contacts.html'];
const errors = [];

for (const page of pages) {
  const file = path.join(out, page);
  if (!fs.existsSync(file)) {
    errors.push(`Missing ${page}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) errors.push(`${page}: expected 1 h1, got ${h1Count}`);
  if (!html.includes('https://n1987394.yclients.com/')) errors.push(`${page}: booking link missing`);
  if (!html.includes('name="viewport"')) errors.push(`${page}: viewport missing`);
  if (!html.includes('main id="main"')) errors.push(`${page}: main landmark missing`);
  if (/<img(?![^>]*\balt=)[^>]*>/.test(html)) errors.push(`${page}: img without alt`);
  for (const src of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) if (!fs.existsSync(path.join(out, src[1]))) errors.push(`${page}: missing ${src[1]}`);
  for (const match of html.matchAll(/href="([a-z-]+\.html)(#[^"]+)?"/g)) {
    const target = path.join(out, match[1]);
    if (!fs.existsSync(target)) errors.push(`${page}: broken link ${match[1]}`);
    else if (match[2] && !fs.readFileSync(target,'utf8').includes(`id="${match[2].slice(1)}"`)) errors.push(`${page}: broken anchor ${match[0]}`);
  }
}

for (const required of ['assets/site.css', 'assets/site.js', 'robots.txt']) {
  if (!fs.existsSync(path.join(out, required))) errors.push(`Missing ${required}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Static checks passed: ${pages.length} pages and required assets.`);
