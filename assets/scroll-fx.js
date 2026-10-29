// Эффекты прокрутки. Всё управляется атрибутами в разметке; без JS или при «меньше движения» страница остаётся статичной.
//   data-wipe          блок раскрывается из рамки по мере входа в экран, фото внутри «выдыхает» из увеличения
//   data-drift="0.08"  блок плывёт медленнее страницы (отрицательное число — в другую сторону)
//   data-hero          первый экран: фото уходит медленнее, текст поднимается и гаснет (--hp от 0 до 1)
//   data-count="4.9"   число набегает от нуля, когда попадает в экран (десятичный разделитель — запятая)
//   data-velocity      бегущая лента ускоряется вместе со скоростью прокрутки
//   data-split         заголовок раскладывается по словам, слова поднимаются по очереди
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  root.classList.add('fx');

  // ——— Заголовки по словам ———
  $$('[data-split]').forEach(h => {
    let i = 0;
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part.trim()) { frag.append(part); return; }
          const w = document.createElement('span'); w.className = 'sw';
          const inner = document.createElement('span'); inner.className = 'sw__in'; inner.style.setProperty('--i', i++);
          inner.textContent = part; w.append(inner); frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
    walk(h);
  });
  const seen = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); seen.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  $$('[data-split]').forEach(h => seen.observe(h));

  // ——— Числа ———
  const counters = $$('[data-count]').map(el => ({ el, to: parseFloat(el.dataset.count.replace(',', '.')), dec: (el.dataset.count.split(/[.,]/)[1] || '').length, done: false }));
  const fmt = (c, v) => v.toFixed(c.dec).replace('.', ',');
  const runCount = c => {
    c.done = true;
    const t0 = performance.now();
    const step = now => {
      const k = clamp((now - t0) / 1400);
      c.el.textContent = fmt(c, c.to * ease(k));
      if (k < 1) requestAnimationFrame(step); else c.el.textContent = fmt(c, c.to);
    };
    requestAnimationFrame(step);
  };

  // ——— Полоска прогресса ———
  const bar = document.createElement('div'); bar.className = 'fx-progress'; bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);

  // ——— Лента отзывов: скорость от прокрутки ———
  const tracks = $$('[data-velocity]');
  let rate = 1, lastY = scrollY, vel = 0;

  const wipes = $$('[data-wipe]');
  const drifts = $$('[data-drift]');
  const hero = $('[data-hero]');
  function $(s) { return document.querySelector(s); }

  let queued = false;
  function frame() {
    queued = false;
    const vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max) : 0})`;

    wipes.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top > vh + 80) return; // ниже экрана: остаётся закрытым; выше экрана: уже открыт
      // 0, когда верх блока у нижнего края экрана; 1, когда он поднялся до 62% высоты
      const p = ease(clamp((vh - r.top) / (vh * 0.38 + r.height * 0.25)));
      el.style.setProperty('--p', p.toFixed(3));
      el.classList.toggle('is-done', p > 0.995); // у раскрытого блока рамку убираем, чтобы не резала тень
    });
    drifts.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) return;
      const k = parseFloat(el.dataset.drift) || 0.08;
      el.style.setProperty('--dy', `${clamp((r.top + r.height / 2 - vh / 2) * -k, -80, 80).toFixed(1)}px`);
    });
    if (hero) {
      const hp = clamp(scrollY / (hero.offsetHeight * 0.9));
      hero.style.setProperty('--hp', hp.toFixed(3));
    }
    counters.forEach(c => { if (!c.done && c.el.getBoundingClientRect().top < vh * 0.9) runCount(c); });

    vel = vel * 0.86 + Math.abs(scrollY - lastY) * 0.14; lastY = scrollY;
    const target = 1 + clamp(vel / 28, 0, 1) * 7;
    rate += (target - rate) * 0.12;
    tracks.forEach(t => t.getAnimations().forEach(a => { a.playbackRate = rate; }));
    if (Math.abs(rate - 1) > 0.02 || vel > 0.2) request();
  }
  function request() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  frame();
})();
