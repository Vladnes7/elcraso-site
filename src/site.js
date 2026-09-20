// El’Craso: меню, появление блоков, лента отзывов, оглавление прайса, фильтр и просмотр работ.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

// ——— Мобильное меню ———
const burger = $('.burger');
const menu = $('#menu');
function setMenu(open) {
  menu.hidden = !open;
  burger.setAttribute('aria-expanded', String(open));
  burger.querySelector('.sr').textContent = open ? 'Закрыть меню' : 'Меню';
  document.body.style.overflow = open ? 'hidden' : '';
}
burger.addEventListener('click', () => setMenu(menu.hidden));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });
matchMedia('(min-width: 1101px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

// ——— Тень у шапки после начала прокрутки ———
const header = $('.header');
const onScroll = () => header.classList.toggle('is-stuck', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ——— Кнопка записи появляется после первого экрана ———
const floatBook = $('.float-book');
if (floatBook) {
  const toggleFloat = () => floatBook.classList.toggle('is-visible', scrollY > innerHeight * 0.7);
  addEventListener('scroll', toggleFloat, { passive: true });
  toggleFloat();
}

// ——— Появление блоков ———
if (!reduced && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-ready');
  $$('[data-intro]').forEach((el, i) => { el.style.setProperty('--d', `${0.08 + i * 0.1}s`); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in'))); });
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal]').forEach(el => io.observe(el));
}

// ——— Лента отзывов: кнопка паузы ———
$$('.marquee__toggle').forEach(btn => {
  const m = $('[data-marquee]', btn.closest('section'));
  btn.addEventListener('click', () => {
    const paused = m.classList.toggle('is-paused');
    btn.setAttribute('aria-pressed', String(paused));
    btn.querySelector('.sr').textContent = paused ? 'Запустить ленту отзывов' : 'Остановить ленту отзывов';
  });
});

// ——— Прайс: подсветка текущего раздела в оглавлении ———
const tocLinks = $$('.toc a');
if (tocLinks.length && 'IntersectionObserver' in window) {
  const byId = new Map(tocLinks.map(a => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    tocLinks.forEach(a => a.classList.remove('is-active'));
    const link = byId.get(e.target.id);
    link.classList.add('is-active');
    link.parentElement.parentElement.scrollTo({ left: link.offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' });
  }), { rootMargin: '-35% 0px -60% 0px' });
  $$('.pcat').forEach(s => spy.observe(s));
}

// ——— Портфолио: фильтр и просмотр фото ———
const gallery = $('.gallery');
if (gallery) {
  const buttons = $$('.filters button');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    $$('li', gallery).forEach(li => { li.hidden = btn.dataset.filter !== 'all' && li.dataset.cat !== btn.dataset.filter; });
  }));

  const data = JSON.parse($('#works-data').textContent);
  const box = $('.lightbox');
  const img = $('img', box);
  let current = 0;
  let opener = null;
  const visible = () => $$('li:not([hidden]) .gallery__btn', gallery).map(b => Number(b.dataset.index));
  function show(i) { current = i; img.src = data[i].src; img.alt = data[i].alt; }
  function step(dir) { const list = visible(); const pos = list.indexOf(current); show(list[(pos + dir + list.length) % list.length]); }
  gallery.addEventListener('click', e => {
    const btn = e.target.closest('.gallery__btn');
    if (!btn) return;
    opener = btn;
    show(Number(btn.dataset.index));
    box.showModal();
  });
  $('.lightbox__close', box).addEventListener('click', () => box.close());
  $('.lightbox__prev', box).addEventListener('click', () => step(-1));
  $('.lightbox__next', box).addEventListener('click', () => step(1));
  box.addEventListener('click', e => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });
  box.addEventListener('close', () => opener?.focus());
}
