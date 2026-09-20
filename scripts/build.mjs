// Сборка сайта: фото → webp/avif, шрифты и скрипты → dist/assets, страницы → dist/*.html.
// Запуск: npm run build  (с доменом: SITE_URL=https://elcraso.ru npm run build)
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { photos } from '../src/data.mjs';
import { createRenderer } from '../src/pages.mjs';

const out = path.resolve('dist');
const assets = path.join(out, 'assets');
const cache = path.resolve('.cache/img');
const site = process.env.SITE_URL?.replace(/\/$/, '') || '';

await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(path.join(assets, 'img'), { recursive: true });
await fs.mkdir(path.join(assets, 'fonts'), { recursive: true });
await fs.mkdir(cache, { recursive: true });

for (const f of ['oranienbaum.woff2', 'onest.woff2', 'cormorant-italic.woff2']) await fs.copyFile(`public/fonts/${f}`, path.join(assets, 'fonts', f));
for (const f of ['site.css', 'site.js']) await fs.copyFile(`src/${f}`, path.join(assets, f));
await fs.copyFile('public/fonts/cormorant-regular.ttf',path.join(assets,'fonts/cormorant-regular.ttf'));

// Фото: находим файл по префиксу имени, режем по ширинам, кэшируем (avif кодируется долго).
const images = {};
const UPSCALED = 'Фото для сайта/elcraso-upscaled';
const upscaled = (await fs.readdir(UPSCALED)).map(f => f.normalize('NFC'));
const findIn = async (dir, prefix) => (await fs.readdir(dir)).find(f => f.normalize('NFC').startsWith(prefix.normalize('NFC')));
await Promise.all(Object.entries(photos).map(async ([id, [dir, prefix]]) => {
  // Фото услуг: если есть улучшенная версия — берём её.
  const better = dir.endsWith('Услуги') && upscaled.find(f => f.startsWith(prefix.normalize('NFC')));
  const name = better || await findIn(dir, prefix);
  if (!name) throw new Error(`Нет фото ${prefix} в ${dir}`);
  const file = path.join(better ? UPSCALED : dir, name);
  const meta = await sharp(file).metadata();
  const { width, height } = meta.autoOrient ?? meta; // размеры с учётом поворота из EXIF
  const max = id === 'hero' ? 1600 : 1200;
  const widths = [...new Set([...[480, 800, 1200].filter(w => w < Math.min(width, max)), Math.min(width, max)])];
  for (const w of widths) for (const fmt of ['webp', 'avif']) {
    const target = path.join(cache, `${id}-${path.basename(file).normalize('NFC').replace(/\.\w+$/, '')}-${w}.${fmt}`);
    try { await fs.access(target); } catch {
      await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).toFormat(fmt, fmt === 'avif' ? { quality: 55, effort: 4 } : { quality: 80 }).toFile(target);
    }
    await fs.copyFile(target, path.join(assets, 'img', `${id}-${w}.${fmt}`));
  }
  images[id] = { width, height, widths };
}));

// Знак EC из логотипа — на тёмно-синей подложке, как в оригинале.
const logo = 'Фото для сайта/Логотип/' + (await fs.readdir('Фото для сайта/Логотип')).find(f => f.normalize('NFC').includes('векторный'));
const mark = sharp(logo).extract({ left: 290, top: 160, width: 500, height: 500 });
await mark.clone().resize(128, 128).png().toFile(path.join(assets, 'logo-mark.png'));
await mark.clone().resize(64, 64).png().toFile(path.join(assets, 'favicon.png'));
await mark.clone().resize(180, 180).png().toFile(path.join(assets, 'apple-touch-icon.png'));
await sharp(logo).resize(1200, 630, { fit: 'contain', background: '#0b0d14' }).jpeg({ quality: 85 }).toFile(path.join(assets, 'og.jpg'));

const pages = createRenderer(images, site);
for (const [id, render] of Object.entries(pages)) await fs.writeFile(path.join(out, `${id}.html`), render());

await fs.writeFile(path.join(out, 'robots.txt'), site ? `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
if (site) await fs.writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map(id => `<url><loc>${site}/${id === 'index' ? '' : id + '.html'}</loc></url>`).join('')}</urlset>\n`);

console.log(`Готово: ${Object.keys(pages).length} страниц, ${Object.keys(images).length} фото → dist/`);
