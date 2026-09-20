import { biz, nav, photos, services, atmoLabels, masters, reviews, works, homeWorks, workFilters, perks } from './data.mjs';

const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const rub = n => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`;

// Иконки в стиле Lucide (контур 1.5px).
const icons = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  ext: '<path d="M7 17 17 7M8 7h9v9"/>',
  star: '<path d="M11.5 2.3a.5.5 0 0 1 .9 0l2.3 4.7a2 2 0 0 0 1.6 1.2l5.2.7a.5.5 0 0 1 .3.9l-3.8 3.7a2 2 0 0 0-.6 1.9l.9 5.1a.5.5 0 0 1-.8.6l-4.6-2.4a2 2 0 0 0-2 0L6.4 21a.5.5 0 0 1-.8-.6l.9-5.1a2 2 0 0 0-.6-1.9L2.2 9.8a.5.5 0 0 1 .3-.9l5.2-.7a2 2 0 0 0 1.6-1.2z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4M16 2v4M3 10h18M9 16l2 2 4-4"/>',
  access: '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1M5 8l3-3 5.5 3-2.4 3.5M4.2 14.5a5 5 0 0 0 6.9 6M13.8 17.5a5 5 0 0 0-6.9-6"/>',
  parking: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
  paw: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.8 1C6.5 17.5 6.5 17.5 4.5 16.8A3.5 3.5 0 0 1 5.5 10Z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  wifi: '<path d="M12 20h.01M2 8.8a15 15 0 0 1 20 0M5 12.9a10 10 0 0 1 14 0M8.5 16.4a5 5 0 0 1 7 0"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  telegram: '<path d="M14.5 21.7a.5.5 0 0 0 .9 0l6.5-19a.5.5 0 0 0-.6-.6l-19 6.5a.5.5 0 0 0 0 .9l7.9 3.2a2 2 0 0 1 1.1 1.1zM21.9 2.1 10.9 13.1"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8a4 4 0 0 1 3.4 3.4zM17.5 6.5h.01"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  play: '<path d="M7 4v16l13-8z"/>',
};
const icon = (name, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
const social = key => (icons[key] ? icon(key) : `<span class="social__txt" aria-hidden="true">${key === 'vk' ? 'VK' : 'MAX'}</span>`);

const book = (label = 'Записаться онлайн', cls = 'btn') => `<a class="${cls}" href="${biz.booking}" target="_blank" rel="noopener">${label}${icon('arrow')}</a>`;
const outLink = (href, label, cls = 'link') => `<a class="${cls}" href="${href}" target="_blank" rel="noopener">${label}${icon('ext')}</a>`;
// Заголовок по словам: каждое слово поднимается с 3D-наклоном (приём с hagisbarbering.com).
function split(html) {
  let i = 0;
  return html.replace(/(<[^>]+>)|([^<\s]+)/g, (m, tag, word) => tag || `<span class="w"><span class="w__in" style="--i:${i++}">${word}</span></span>`);
}
const stars = `<span class="stars" role="img" aria-label="5 из 5">${icon('star', 'star').repeat(5)}</span>`;

export function createRenderer(images, site) {
  function picture(id, sizes, { eager = false, alt } = {}) {
    const m = images[id];
    const set = fmt => m.widths.map(w => `assets/img/${id}-${w}.${fmt} ${w}w`).join(', ');
    return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><img src="assets/img/${id}-${m.widths.at(-1)}.webp" srcset="${set('webp')}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(alt ?? photos[id][2])}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
  }

  function head(page, title, description) {
    const url = site ? `${site}/${page === 'index' ? '' : page + '.html'}` : '';
    const schema = page === 'index' || page === 'contacts' ? `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org', '@type': 'BeautySalon', name: 'El’Craso', telephone: '+79778663535',
      address: { '@type': 'PostalAddress', streetAddress: 'Городская ул., 12', addressLocality: 'Троицк', addressRegion: 'Москва', addressCountry: 'RU' },
      geo: { '@type': 'GeoCoordinates', latitude: biz.lat, longitude: biz.lon },
      openingHours: 'Mo-Su 10:00-22:00', aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '61' },
      ...(site ? { url: site + '/', image: `${site}/assets/og.jpg` } : {}), sameAs: biz.socials.map(s => s[1]),
    })}</script>` : '';
    return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}">
${site ? `<link rel="canonical" href="${url}">` : '<meta name="robots" content="noindex">'}
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:locale" content="ru_RU">${site ? `<meta property="og:url" content="${url}"><meta property="og:image" content="${site}/assets/og.jpg">` : ''}
<meta name="theme-color" content="#A48D78"><meta name="color-scheme" content="light"><link rel="icon" href="assets/favicon.png" type="image/png"><link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="preload" href="assets/fonts/oranienbaum.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="assets/fonts/onest.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/site.css">${schema}</head>`;
  }

  function header(page) {
    const links = nav.map(([id, label], i) => `<li style="--i:${i}"><a href="${id}.html"${id === page ? ' aria-current="page"' : ''}>${label}</a></li>`).join('');
    const socials = biz.socials.map(([n, u, k]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${n}">${social(k)}</a>`).join('');
    return `<a class="skip" href="#main">Перейти к содержимому</a>
<div class="promo"><div class="wrap promo__in"><span class="promo__item">${icon('clock')}${biz.hours}</span><span class="promo__item promo__addr">${icon('pin')}${biz.address}</span><a class="promo__item promo__phone" href="${biz.phoneHref}">${icon('phone')}${biz.phone}</a><span class="promo__social">${socials}</span></div></div>
<header class="header"><div class="wrap header__in">
<a class="brand" href="index.html"${page === 'index' ? ' aria-current="page"' : ''}><img src="assets/logo-mark.png" width="44" height="44" alt=""><span class="brand__name">El’Craso<small>салон красоты</small></span></a>
<nav class="nav" aria-label="Разделы сайта"><ul>${links}</ul></nav>
${book('Записаться', 'btn btn--small header__book')}
<button class="burger" type="button" aria-expanded="false" aria-controls="menu"><span class="sr">Меню</span><i></i><i></i></button>
</div>
<nav class="menu" id="menu" aria-label="Меню" hidden><ul>${links}</ul><a class="menu__phone" style="--i:5" href="${biz.phoneHref}">${biz.phone}</a><span class="menu__cta" style="--i:6">${book('Записаться онлайн', 'btn')}</span></nav>
</header>`;
  }

  // Заголовок секции: надзаголовок, h2, необязательный элемент справа.
  const secHead = (eyebrow, title, id, aside = '') => `<div class="sec-head" data-reveal><div><p class="eyebrow">${eyebrow}</p><h2 class="h2" id="${id}">${title}</h2></div>${aside}</div>`;

  function contactsBlock() {
    return `<section class="contacts band band--porcelain" aria-labelledby="contacts-title"><div class="wrap contacts__grid">
<div class="contacts__info" data-reveal>
<p class="eyebrow">Контакты</p>
<h2 class="h2" id="contacts-title">Ждём вас <em>в гости</em></h2>
<ul class="facts">
<li>${icon('pin')}<div><strong>${biz.address}</strong><span>${biz.addressNote}</span></div></li>
<li>${icon('clock')}<div><strong>${biz.hours}</strong><span>Без выходных</span></div></li>
<li>${icon('phone')}<div><a href="${biz.phoneHref}"><strong>${biz.phone}</strong></a><span>Звонки и запись</span></div></li>
</ul>
<div class="socials">${biz.socials.map(([n, u, k]) => `<a class="chip" href="${u}" target="_blank" rel="noopener">${social(k)}${n}</a>`).join('')}</div>
<div class="actions">${book()}${outLink(biz.maps, 'Маршрут', 'btn btn--ghost')}</div>
</div>
<div class="map" data-reveal><iframe title="El’Craso на Яндекс Картах" src="https://yandex.ru/map-widget/v1/org/el_craso/59447166729/?ll=${biz.lon}%2C${biz.lat}&amp;z=17" loading="lazy"></iframe></div>
</div></section>`;
  }

  function footer() {
    return `<footer class="footer"><div class="wrap footer__in">
<div class="footer__brand"><img src="assets/logo-mark.png" width="56" height="56" alt="" loading="lazy"><p class="footer__name">El’Craso</p><p>Салон красоты, ногтевая студия и парикмахерская в Троицке.</p></div>
<nav aria-label="Разделы сайта в подвале"><p class="footer__title">Разделы</p><ul>${nav.map(([id, l]) => `<li><a href="${id}.html">${l}</a></li>`).join('')}</ul></nav>
<div><p class="footer__title">Контакты</p><p>${biz.address}</p><p>${biz.hours}</p><p><a href="${biz.phoneHref}">${biz.phone}</a></p></div>
<div><p class="footer__title">Соцсети</p><ul>${biz.socials.map(([n, u]) => `<li>${outLink(u, n)}</li>`).join('')}</ul></div>
</div><div class="wrap footer__base"><span>© 2026 El’Craso</span>${book('Записаться онлайн', 'link')}</div></footer>`;
  }

  const page = (id, title, description, body) => `${head(id, title, description)}<body class="page-${id}">${header(id)}<main id="main">${body}</main>${footer()}<a class="float-book" href="${biz.booking}" target="_blank" rel="noopener">${icon('calendar')}<span>Записаться</span></a><script src="assets/site.js" defer></script></body></html>`;

  // Шапка внутренней страницы: текст слева, справа фото целиком (без обрезки) — основное и маленькое поверх.
  const pageHead = (eyebrow, title, lead, [main, small] = [], extra = '') => `<section class="phead band band--oat"><div class="wrap phead__grid">
<div class="phead__text"><p class="eyebrow">${eyebrow}</p><h1 class="h1 split">${split(title)}</h1><p class="lead">${lead}</p>${extra}</div>
${main ? `<div class="phead__media" data-intro><div class="phead__main">${picture(main, '(max-width: 760px) 80vw, 34vw', { eager: true })}</div>${small ? `<div class="phead__small">${picture(small, '(max-width: 760px) 40vw, 14vw')}</div>` : ''}</div>` : ''}
</div></section>`;

  // Карточка категории услуг — фото, название, цена «от».
  const serviceCard = s => `<li class="scard" data-reveal><a class="scard__link" href="services.html#${s.id}">
<div class="scard__img">${picture(s.cover, '(max-width: 760px) 50vw, 25vw', { alt: s.title })}</div>
<div class="scard__body"><h3>${s.title}</h3><p>${s.text}</p><span class="scard__foot"><span class="scard__price">от ${rub(s.from)}</span>${icon('arrow')}</span></div>
</a></li>`;

  const reviewCard = r => `<li class="rcard"><div class="rcard__top"><span class="rcard__avatar" aria-hidden="true">${r.author[0]}</span><div><p class="rcard__name">${r.author}</p><p class="rcard__meta">${r.service}</p></div></div>${stars}<blockquote><p>${r.text}</p></blockquote><p class="rcard__date">${r.date} · Яндекс Карты</p></li>`;

  // Бесконечная лента отзывов: вторая копия нужна для бесшовного цикла и скрыта от скринридеров.
  const marquee = list => `<div class="marquee" data-marquee>
<div class="marquee__track"><ul class="marquee__list">${list.map(reviewCard).join('')}</ul><ul class="marquee__list" aria-hidden="true" inert>${list.map(reviewCard).join('')}</ul></div>
</div>`;
  const marqueeToggle = `<button class="marquee__toggle" type="button" aria-pressed="false"><span class="sr">Остановить ленту отзывов</span>${icon('pause', 'ic ic--pause')}${icon('play', 'ic ic--play')}</button>`;

  // ——— Главная ———
  function index() {
    const hero = `<section class="hero" aria-labelledby="hero-title">
<div class="hero__photo">${picture('hero', '(max-width: 760px) 100vw, 66vw', { eager: true })}</div>
<div class="wrap hero__in"><div class="hero__text">
<p class="eyebrow" data-intro>Салон красоты в Троицке</p>
<h1 class="h1 split" id="hero-title">${split('Доверь нам себя и свою <em>красоту</em>')}</h1>
<p class="lead" data-intro>Волосы, ногти, брови и ресницы, барбер, косметология и лазерная эпиляция — в Троицке, на Городской улице, 12.</p>
<div class="actions" data-intro>${book()}<a class="btn btn--ghost" href="services.html">Услуги и цены</a></div>
<p class="hero__rating" data-intro>${stars}<span><strong>${biz.rating}</strong> на Яндекс Картах · ${biz.ratingCount}</span></p>
</div></div></section>`;

    const trust = `<section class="trust band band--porcelain" aria-label="Коротко о салоне"><div class="wrap"><ul class="trust__list">
<li>${icon('star')}<div><strong>${biz.rating} на Яндекс Картах</strong><span>${biz.ratingCount}, 49 отзывов</span></div></li>
<li>${icon('clock')}<div><strong>Каждый день</strong><span>с 10:00 до 22:00</span></div></li>
<li>${icon('calendar')}<div><strong>Онлайн-запись</strong><span>Выбор мастера и времени</span></div></li>
<li>${icon('pin')}<div><strong>Троицк, Городская ул., 12</strong><span>${biz.addressNote}</span></div></li>
</ul></div></section>`;

    const servicesBlock = `<section class="band band--feather" aria-labelledby="svc-title"><div class="wrap">
${secHead('Услуги', 'Всё для вашего <em>образа</em>', 'svc-title', '<a class="link" href="services.html">Полный прайс' + icon('arrow') + '</a>')}
<ul class="scards">${services.map(serviceCard).join('')}</ul>
<div class="all-prices" data-reveal><a class="btn btn--wide" href="services.html">Весь прайс: ${services.length} разделов, ${services.reduce((n, s) => n + s.items.length, 0)} услуг${icon('arrow')}</a><a class="btn btn--ghost btn--wide" href="${biz.phoneHref}">${icon('phone')}${biz.phone}</a></div>
</div></section>`;

    const atmo = ['reception', 'hall', 'lounge', 'wash', 'cosmetology', 'pedicureRoom'];
    const atmosphere = `<section class="band band--oat" aria-labelledby="atmo-title"><div class="wrap atmo">
<div class="atmo__text" data-reveal><p class="eyebrow">Атмосфера</p><h2 class="h2" id="atmo-title">Здесь принимают <em>как своих</em></h2>
<p class="lead">Бежевые стены, мрамор, бархатные кресла и тёплый свет. Отдельные кабинеты для косметологии и педикюра.</p>
<div class="actions">${book()}</div></div>
<ul class="atmo__grid">${atmo.map(id => `<li data-reveal>${picture(id, '(max-width: 760px) 50vw, 22vw')}<span>${atmoLabels[id]}</span></li>`).join('')}</ul>
</div></section>`;

    const perksBand = `<section class="perks band band--sand" aria-labelledby="perks-title"><div class="wrap">
<h2 class="sr" id="perks-title">Удобства салона</h2>
<ul class="perks__list">${perks.map(([ic, t, d]) => `<li data-reveal>${icon(ic)}<div><strong>${t}</strong>${d ? `<span>${d}</span>` : ''}</div></li>`).join('')}</ul>
</div></section>`;

    const team = `<section class="band band--porcelain" aria-labelledby="team-title"><div class="wrap">
${secHead('Мастера', 'Наша <em>команда</em>', 'team-title', '<a class="link" href="masters.html">Все мастера' + icon('arrow') + '</a>')}
<ul class="mcards">${masters.map(m => `<li class="mcard" data-reveal><span class="mcard__initial" aria-hidden="true">${m.name[0]}</span><div><h3>${m.name}</h3><p>${m.role}</p></div>${m.since ? `<span class="badge">${m.since}</span>` : ''}</li>`).join('')}</ul>
</div></section>`;

    const gallery = `<section class="band band--feather" aria-labelledby="works-title"><div class="wrap">
${secHead('Наши работы', 'Работы <em>мастеров</em>', 'works-title', '<a class="link" href="portfolio.html">Все работы' + icon('arrow') + '</a>')}
<ul class="wgrid">${homeWorks.map(id => `<li data-reveal><a href="portfolio.html">${picture(id, '(max-width: 760px) 50vw, 25vw')}</a></li>`).join('')}</ul>
</div></section>`;

    const reviewsBlock = `<section class="band band--oat reviews-band" aria-labelledby="rev-title"><div class="wrap">
${secHead('Отзывы', 'Что говорят <em>гости</em>', 'rev-title', `<p class="rating-inline">${stars}<span><strong>${biz.rating}</strong> на Яндекс Картах</span></p>`)}
</div>${marquee(reviews)}
<div class="wrap reviews-band__foot">${marqueeToggle}<a class="link" href="reviews.html">Больше отзывов${icon('arrow')}</a>${outLink(biz.leaveReview, 'Оставить отзыв')}</div></section>`;

    const finale = `<section class="finale band band--sand" aria-labelledby="finale-title"><div class="wrap finale__in">
<div class="finale__photo" data-reveal>${picture('facade', '(max-width: 760px) 100vw, 40vw')}</div>
<div class="finale__text" data-reveal><p class="eyebrow">Запись</p><h2 class="h2" id="finale-title">Ваше время для себя <em>уже рядом</em></h2><p class="lead">Выберите услугу, мастера и удобное время в онлайн-записи.</p><div class="actions">${book('Выбрать время')}<a class="btn btn--ghost" href="${biz.phoneHref}">${biz.phone}</a></div></div>
</div></section>`;

    return page('index', 'El’Craso — салон красоты в Троицке',
      'Салон красоты El’Craso в Троицке: стрижки и окрашивание, маникюр и педикюр, брови и ресницы, барбер, косметология, лазерная эпиляция. Городская ул., 12, ежедневно 10:00–22:00.',
      hero + servicesBlock + trust + atmosphere + perksBand + team + gallery + reviewsBlock + finale + contactsBlock());
  }

  // ——— Услуги и цены ———
  function servicesPage() {
    const toc = `<nav class="toc" aria-label="Разделы прайса"><ul class="wrap">${services.map(s => `<li><a href="#${s.id}">${s.title}</a></li>`).join('')}</ul></nav>`;
    const blocks = services.map((s, i) => {
      const withPhoto = s.items.filter(it => it[2]);
      const plain = s.items.filter(it => !it[2]);
      return `<section class="pcat band ${i % 2 ? 'band--porcelain' : 'band--feather'}" id="${s.id}" aria-labelledby="${s.id}-t"><div class="wrap">
<div class="pcat__head"><div><h2 class="h2" id="${s.id}-t">${s.title}</h2><p class="lead">${s.text}</p>${s.note ? `<p class="pcat__note">${s.note}</p>` : ''}</div>${book('Записаться', 'btn btn--small')}</div>
${withPhoto.length ? `<ul class="icards">${withPhoto.map(([n, p, ph, d]) => `<li class="icard">${picture(ph, '(max-width: 760px) 50vw, 20vw', { alt: n })}<div class="icard__body"><h3>${n}</h3><p class="icard__price">${p}</p>${d ? `<p class="icard__desc">${d}</p>` : ''}</div></li>`).join('')}</ul>` : ''}
${plain.length ? `<div class="plist-wrap${withPhoto.length ? '' : ' plist-wrap--solo'}">${withPhoto.length ? '' : `<div class="plist__photo">${picture(s.cover, '(max-width: 760px) 100vw, 30vw', { alt: s.title })}</div>`}<ul class="plist">${plain.map(([n, p, , d]) => `<li><span class="plist__name">${n}${d ? `<span class="plist__desc">${d}</span>` : ''}</span><span class="plist__price">${p}</span></li>`).join('')}</ul></div>` : ''}
</div></section>`;
    }).join('');
    return page('services', 'Услуги и цены — El’Craso, Троицк',
      'Полный прайс салона El’Craso: стрижки, окрашивание, маникюр, педикюр, брови и ресницы, лазерная эпиляция, макияж, косметология.',
      pageHead('Услуги и цены', 'Услуги <em>и цены</em>', 'Полный прайс салона по разделам. Выберите услугу и запишитесь онлайн к свободному мастеру.', ['s04', 's43'], `<div class="actions">${book()}</div>`)
      + toc + blocks);
  }

  // ——— Мастера ———
  function mastersPage() {
    const byId = Object.fromEntries(services.map(s => [s.id, s]));
    const list = masters.map(m => `<li class="master" data-reveal>
<div class="master__top"><span class="mcard__initial" aria-hidden="true">${m.name[0]}</span><div><h2 class="master__name">${m.name}</h2><p class="master__role">${m.role}</p></div>${m.since ? `<span class="badge">${m.since}</span>` : ''}</div>
${m.about ? `<p>${m.about}</p>` : ''}
<p class="master__links">${m.services.map(id => `<a class="chip" href="services.html#${id}">${byId[id].title}</a>`).join('')}</p>
</li>`).join('');
    return page('masters', 'Мастера — El’Craso, Троицк',
      'Мастера салона El’Craso: парикмахеры, барбер, мастера маникюра и педикюра, косметолог, мастер лазерной эпиляции.',
      pageHead('Мастера', 'Наша <em>команда</em>', 'Выбрать мастера и свободное время можно в онлайн-записи.', ['stylingBlonde', 'barberWork2'], `<div class="actions">${book('Выбрать мастера')}</div>`)
      + `<section class="band band--feather"><div class="wrap"><ul class="masters">${list}</ul></div></section>`);
  }

  // ——— Работы ———
  function portfolioPage() {
    const filters = `<div class="filters" role="group" aria-label="Фильтр работ">${workFilters.map(([id, l], i) => `<button type="button" data-filter="${id}" aria-pressed="${i === 0}">${l}</button>`).join('')}</div>`;
    const grid = `<ul class="gallery">${works.map(([id, cat], i) => `<li data-cat="${cat}"><button type="button" class="gallery__btn" data-index="${i}" aria-label="Открыть фото: ${esc(photos[id][2])}">${picture(id, '(max-width: 760px) 50vw, 25vw')}</button></li>`).join('')}</ul>`;
    const box = `<dialog class="lightbox" aria-label="Просмотр фото"><img alt="">
<button type="button" class="lightbox__close" aria-label="Закрыть">×</button><button type="button" class="lightbox__prev" aria-label="Предыдущее фото">←</button><button type="button" class="lightbox__next" aria-label="Следующее фото">→</button></dialog>`;
    return page('portfolio', 'Наши работы — El’Craso, Троицк',
      'Работы мастеров El’Craso: причёски и окрашивание, маникюр и педикюр, макияж, мужские и барбер-стрижки.',
      pageHead('Наши работы', 'Работы <em>мастеров</em>', 'Причёски, окрашивание, маникюр, макияж и мужские стрижки. Нажмите на фото, чтобы рассмотреть ближе.', ['darkWaves', 'nailsPearl'], filters)
      + `<section class="band band--feather"><div class="wrap">${grid}</div></section>${box}`
      + `<script type="application/json" id="works-data">${JSON.stringify(works.map(([id]) => ({ src: `assets/img/${id}-${images[id].widths.at(-1)}.webp`, alt: photos[id][2] })))}</script>`);
  }

  // ——— Отзывы ———
  function reviewsPage() {
    return page('reviews', 'Отзывы — El’Craso, Троицк',
      'Отзывы гостей салона El’Craso с Яндекс Карт: рейтинг 4,9, 61 оценка.',
      pageHead('Отзывы', 'Что говорят <em>гости</em>', 'Избранные отзывы с Яндекс Карт — целиком, без сокращений.', ['curlyHair', 'lounge'],
        `<p class="rating">${stars}<span class="rating__num">${biz.rating}</span><span>из 5 на Яндекс Картах<br>${biz.ratingCount}, 49 отзывов</span></p><div class="actions">${outLink(biz.maps, 'Все 49 отзывов на Яндекс Картах', 'btn')}${outLink(biz.leaveReview, 'Оставить отзыв', 'btn btn--ghost')}</div>`)
      + `<section class="band band--porcelain reviews-band" aria-label="Лента отзывов">${marquee(reviews)}<div class="wrap reviews-band__foot">${marqueeToggle}</div></section>`
      + `<section class="band band--feather" aria-labelledby="all-rev"><div class="wrap"><div class="rgrid__head"><h2 class="h2" id="all-rev">Избранные <em>отзывы</em></h2><p class="lead">10 отзывов из 49 — остальные на Яндекс Картах.</p></div><ul class="rgrid">${reviews.map(reviewCard).join('')}</ul></div></section>`);
  }

  // ——— Контакты ———
  function contactsPage() {
    return page('contacts', 'Контакты — El’Craso, Троицк',
      'Салон El’Craso: Троицк, Городская ул., 12 (ЖК «Академик»). Ежедневно 10:00–22:00. Телефон +7 (977) 866-35-35.',
      pageHead('Контакты', 'Как нас <em>найти</em>', 'Троицк, Городская улица, 12 — в ЖК «Академик». Работаем каждый день с 10:00 до 22:00.', ['facade', 'reception'], `<div class="actions">${book()}</div>`)
      + contactsBlock()
      + `<section class="perks band band--sand" aria-label="Удобства салона"><div class="wrap"><ul class="perks__list">${perks.map(([ic, t, d]) => `<li>${icon(ic)}<div><strong>${t}</strong>${d ? `<span>${d}</span>` : ''}</div></li>`).join('')}</ul></div></section>`);
  }

  return { index, services: servicesPage, masters: mastersPage, portfolio: portfolioPage, reviews: reviewsPage, contacts: contactsPage };
}
