/* ================================================================
   SparkTech — app.js  v7.0
   ================================================================ */
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const db = (fn, ms = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

/* ── State ── */
const S = {
  cart    : JSON.parse(localStorage.getItem('st_cart') || '[]'),
  wish    : JSON.parse(localStorage.getItem('st_wish') || '[]'),
  page    : document.body.dataset.page || 'home',
  pgNum   : 1,
  perPage : 8,
  brand   : 'all',
  sort    : 'default',
};
const saveCart = () => localStorage.setItem('st_cart', JSON.stringify(S.cart));
const saveWish = () => localStorage.setItem('st_wish', JSON.stringify(S.wish));

/* ── Helpers ── */
const fmtPrice  = p => (!p && p !== 0) ? 'Price on Request' : '₹' + Number(p).toLocaleString('en-IN');
const calcDisc  = (o, c) => (!o || o <= c) ? 0 : Math.round(((o - c) / o) * 100);
const starsHTML = r => '★'.repeat(Math.floor(r)) + (r % 1 >= .5 ? '½' : '') + '☆'.repeat(5 - Math.floor(r) - (r % 1 >= .5 ? 1 : 0));
const badgeCls  = b => {
  if (!b) return '';
  const lc = b.toLowerCase();
  if (['new','best seller','top rated'].includes(lc)) return 'badge-sky';
  if (['gaming','ultimate','pro'].includes(lc))        return 'badge-purple';
  if (['sale','flash'].includes(lc))                   return 'badge-red';
  return 'badge-yellow';
};

/* ================================================================
   TOAST
   ================================================================ */
function toast(msg, type = 'success') {
  const icons = { success:'fa-check-circle', error:'fa-times-circle', info:'fa-info-circle', warn:'fa-exclamation-triangle' };
  let box = $('#toast-container');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toast-container'; box.className = 'toast-container';
    document.body.appendChild(box);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span>`;
  box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 2800);
}
window.toast = toast;

/* ================================================================
   PRELOADER — home page only, once per session
   ================================================================ */
function initPreloader() {
  const pl = $('#preloader');
  if (!pl) return;
  if (S.page !== 'home') { pl.remove(); return; }
  if (sessionStorage.getItem('st_shown')) { pl.remove(); return; }

  document.body.style.overflow = 'hidden';
  const fill = pl.querySelector('.pl-bar-fill');
  let pct = 0;
  const ticker = setInterval(() => {
    pct = Math.min(pct + Math.random() * 7 + 2, 90);
    if (fill) fill.style.width = pct + '%';
  }, 50);

  setTimeout(() => {
    clearInterval(ticker);
    if (fill) { fill.style.transition = 'width .2s ease'; fill.style.width = '100%'; }
    setTimeout(() => {
      pl.classList.add('pl-exit');
      document.body.style.overflow = '';
      sessionStorage.setItem('st_shown', '1');
      setTimeout(() => pl.remove(), 700);
    }, 250);
  }, 2500);
}

/* ================================================================
   NAVBAR
   ================================================================ */
function initNavbar() {
  const nav = $('.navbar');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  $$('.navbar__links a[data-page], .mobile-nav__links a[data-page]').forEach(a => {
    if (a.dataset.page === S.page) a.classList.add('active');
  });

  /* Products dropdown */
  const trigger  = $('.navbar__links .has-dd');
  const dropdown = $('.nav-dropdown');
  let ddTm;
  const showDD = () => { clearTimeout(ddTm); dropdown?.classList.add('open'); };
  const hideDD = (ms = 180) => { ddTm = setTimeout(() => dropdown?.classList.remove('open'), ms); };
  trigger?.addEventListener('mouseenter', showDD);
  trigger?.addEventListener('mouseleave', () => hideDD());
  dropdown?.addEventListener('mouseenter', showDD);
  dropdown?.addEventListener('mouseleave', () => hideDD());
  trigger?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dropdown?.classList.toggle('open'); }
  });

  /* Mobile drawer */
  const ham = $('.hamburger'), drawer = $('.mobile-nav'), overlay = $('.mobile-nav-overlay');
  const openDrawer  = () => { ham?.classList.add('open'); drawer?.classList.add('open'); overlay?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeDrawer = () => { ham?.classList.remove('open'); drawer?.classList.remove('open'); overlay?.classList.remove('open'); document.body.style.overflow = ''; };
  ham?.addEventListener('click', () => drawer?.classList.contains('open') ? closeDrawer() : openDrawer());
  overlay?.addEventListener('click', closeDrawer);
  $$('.mobile-nav__links a').forEach(a => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); hideDD(0); } });

  /* Search clear button */
  $$('.s-clear').forEach(btn => {
    const wrap  = btn.closest('.navbar__search, .mobile-nav__search');
    const input = wrap?.querySelector('.search-input');
    if (!input) return;
    const sync = () => btn.classList.toggle('vis', input.value.length > 0);
    input.addEventListener('input', sync);
    sync();
    btn.addEventListener('click', () => {
      input.value = '';
      btn.classList.remove('vis');
      input.focus();
      wrap?.querySelector('.search-dropdown')?.classList.remove('show');
    });
  });

  updateBadges();
}

function updateBadges() {
  const ct = S.cart.reduce((s, i) => s + i.qty, 0);
  $$('#cart-badge').forEach(b => { b.textContent = ct; b.dataset.count = ct; });
  $$('#wish-badge').forEach(b => { b.textContent = S.wish.length; b.dataset.count = S.wish.length; });
}

/* ================================================================
   SEARCH
   ================================================================ */
function initSearch() {
  $$('.search-input').forEach(input => {
    input.addEventListener('input', db(e => {
      const q = e.target.value.trim().toLowerCase();
      if (q.length < 2) { closeSearchDD(input); return; }
      renderSearchDD(searchProds(q).slice(0, 7), input);
    }, 160));
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && input.value.trim())
        location.href = `search.html?q=${encodeURIComponent(input.value.trim())}`;
      if (e.key === 'Escape') closeSearchDD(input);
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.navbar__search, .mobile-nav__search'))
      $$('.search-dropdown').forEach(d => d.classList.remove('show'));
  });
}

function searchProds(q) {
  return SPARKTECH_PRODUCTS.filter(p => {
    const hay = [p.name, p.brand, p.description || '', p.category,
      ...(p.keywords || []), ...Object.values(p.specs || {})].join(' ').toLowerCase();
    return hay.includes(q);
  });
}

function renderSearchDD(results, input) {
  const wrap = input.closest('.navbar__search, .mobile-nav__search');
  if (!wrap) return;
  let dd = wrap.querySelector('.search-dropdown');
  if (!dd) { dd = document.createElement('div'); dd.className = 'search-dropdown'; wrap.appendChild(dd); }
  dd.innerHTML = !results.length
    ? '<div class="search-no">No results found.</div>'
    : results.map(p => {
        const img = (p.images || [])[0] || '';
        return `<div class="search-item" onclick="location.href='product.html?id=${p.id}'">
          <img src="${img}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/40x40/1C2235/38BEFF?text=?'">
          <div><div class="search-item__name">${p.name}</div><div class="search-item__price">${fmtPrice(p.price)}</div></div>
        </div>`;
      }).join('');
  dd.classList.add('show');
}

function closeSearchDD(input) {
  input?.closest('.navbar__search, .mobile-nav__search')?.querySelector('.search-dropdown')?.classList.remove('show');
}

/* ================================================================
   LAZY IMAGES
   ================================================================ */
let _lazyObs = null;
function initLazy() {
  if (!('IntersectionObserver' in window)) { $$('img.lazy').forEach(loadImg); return; }
  if (!_lazyObs) {
    _lazyObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { loadImg(e.target); _lazyObs.unobserve(e.target); } });
    }, { rootMargin: '150px' });
  }
  $$('img.lazy:not([data-obs])').forEach(img => { img.dataset.obs = '1'; _lazyObs.observe(img); });
}
function loadImg(img) {
  const src = img.dataset.src;
  if (!src || img.src === src) return;
  img.src = src;
  img.onload  = () => img.classList.add('loaded');
  img.onerror = () => { img.src = 'https://placehold.co/300x300/1C2235/38BEFF?text=SparkTech'; img.classList.add('loaded'); };
}

/* ================================================================
   SCROLL REVEAL
   ================================================================ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 55); obs.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  $$('.reveal').forEach(el => obs.observe(el));
}

/* ================================================================
   PRODUCT CARD HTML
   ================================================================ */
function cardHTML(p, grid = false) {
  const disc   = calcDisc(p.originalPrice, p.price);
  const inWish = S.wish.some(w => w.id === p.id);
  const inCart = S.cart.some(c => c.id === p.id);
  const img    = (p.images || [])[0] || 'https://placehold.co/300x300/1C2235/38BEFF?text=SparkTech';
  return `
    <article class="pcard${grid ? ' pcard--grid' : ''}" data-id="${p.id}"
      role="button" tabindex="0"
      onclick="cardClick(event,'${p.id}')"
      onkeydown="if(event.key==='Enter')location.href='product.html?id=${p.id}'">
      <div class="pcard__img">
        ${p.badge ? `<span class="pcard__badge ${badgeCls(p.badge)}">${p.badge}</span>` : ''}
        <img class="lazy" data-src="${img}"
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%231C2235'/%3E%3C/svg%3E"
          alt="${p.name}" loading="lazy">
        <div class="pcard__actions">
          <button class="pcard__act${inWish ? ' active' : ''}"
            onclick="toggleWish(event,'${p.id}')"
            title="${inWish ? 'Remove from wishlist' : 'Add to wishlist'}">
            <i class="fa${inWish ? 's' : 'r'} fa-heart"></i>
          </button>
          <button class="pcard__act"
            onclick="event.stopPropagation();location.href='product.html?id=${p.id}'" title="View">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="pcard__body">
        <div class="pcard__brand">${p.brand}</div>
        <div class="pcard__name">${p.name}</div>
        <div class="pcard__stars">
          <span class="stars">${starsHTML(p.rating)}</span>
          <span class="pcard__reviews">${p.rating} (${(p.reviews || 0).toLocaleString()})</span>
        </div>
        <div class="pcard__pricing">
          <span class="pcard__price">${fmtPrice(p.price)}</span>
          ${(p.originalPrice || 0) > (p.price || 0) ? `<span class="pcard__orig">${fmtPrice(p.originalPrice)}</span>` : ''}
          ${disc > 0 ? `<span class="pcard__disc">-${disc}%</span>` : ''}
        </div>
        <button class="pcard__cta${inCart ? ' in-cart' : ''}" onclick="addToCart(event,'${p.id}')">
          <i class="fas ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i>
          ${inCart ? 'In Cart' : 'Add to Cart'}
        </button>
      </div>
    </article>`;
}

function cardClick(e, id) { if (!e.target.closest('button')) location.href = `product.html?id=${id}`; }
window.cardClick = cardClick;

/* ================================================================
   CART OPERATIONS
   ================================================================ */
function addToCart(e, id) {
  e?.stopPropagation();
  const p  = SPARKTECH_PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const ex = S.cart.find(c => c.id === id);
  if (ex) { ex.qty++; toast('Qty updated ✓', 'info'); }
  else    { S.cart.push({ id, qty: 1 }); toast('Added to cart ✓', 'success'); }
  saveCart(); updateBadges();
  $$(`[data-id="${id}"] .pcard__cta`).forEach(b => { b.classList.add('in-cart'); b.innerHTML = `<i class="fas fa-check"></i> In Cart`; });
}
window.addToCart = addToCart;

function removeFromCart(id) { S.cart = S.cart.filter(c => c.id !== id); saveCart(); updateBadges(); renderCart(); }
window.removeFromCart = removeFromCart;

function updateQty(id, d) {
  const it = S.cart.find(c => c.id === id);
  if (!it) return;
  it.qty = Math.max(1, it.qty + d);
  saveCart(); updateBadges(); renderCart();
}
window.updateQty = updateQty;

/* ================================================================
   WISHLIST
   ================================================================ */
function toggleWish(e, id) {
  e?.stopPropagation();
  const p = SPARKTECH_PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const idx = S.wish.findIndex(w => w.id === id);
  if (idx > -1) { S.wish.splice(idx, 1); toast('Removed from wishlist', 'info'); }
  else          { S.wish.push({ id }); toast('Wishlisted ♥', 'success'); }
  saveWish(); updateBadges();
  $$(`[data-id="${id}"] .pcard__act`).forEach(b => {
    if (!b.querySelector('[class*="fa-heart"]')) return;
    const now = S.wish.some(w => w.id === id);
    b.classList.toggle('active', now);
    b.innerHTML = `<i class="fa${now ? 's' : 'r'} fa-heart"></i>`;
    b.title = now ? 'Remove from wishlist' : 'Add to wishlist';
  });
  if ($('#wishlist-overlay')?.classList.contains('open')) renderWishModal();
}
window.toggleWish = toggleWish;
window.toggleWishlist = toggleWish;

function renderWishModal() {
  const grid = $('#wishlist-grid');
  if (!grid) return;
  if (!S.wish.length) {
    grid.className = 'wish-empty';
    grid.innerHTML = '<i class="far fa-heart"></i><p>Your wishlist is empty.</p>';
    return;
  }
  grid.className = 'wish-grid';
  grid.innerHTML = S.wish.map(w => {
    const p = SPARKTECH_PRODUCTS.find(x => x.id === w.id);
    if (!p) return '';
    const img = (p.images || [])[0] || '';
    return `<div class="wish-card">
      <img src="${img}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/160x160/1C2235/38BEFF?text=?'">
      <button class="wish-card__del" onclick="toggleWish(event,'${p.id}')"><i class="fas fa-times"></i></button>
      <div class="wish-card__body">
        <div class="wish-card__name">${p.name}</div>
        <div class="wish-card__price">${fmtPrice(p.price)}</div>
        <button onclick="addToCart(event,'${p.id}')" style="width:100%;padding:.38rem;border-radius:7px;background:linear-gradient(135deg,var(--blue),var(--sky));color:#fff;font-size:.72rem;font-weight:700;border:none;cursor:pointer">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>`;
  }).join('');
}

/* ================================================================
   MARQUEE
   ================================================================ */
function initMarquee() {
  const t = $('.marquee__track');
  if (!t) return;
  t.innerHTML += t.innerHTML;
  $('.marquee-bar')?.addEventListener('mouseenter', () => t.classList.add('paused'));
  $('.marquee-bar')?.addEventListener('mouseleave', () => t.classList.remove('paused'));
}

/* ================================================================
   COUNTDOWN
   ================================================================ */
function initCountdown(sel) {
  const el = $(sel);
  if (!el) return;
  const end = new Date(Date.now() + 11 * 3600000 + 57 * 60000);
  const tick = () => {
    const d  = Math.max(0, end - Date.now());
    const hh = String(Math.floor(d / 3600000)).padStart(2, '0');
    const mm = String(Math.floor((d % 3600000) / 60000)).padStart(2, '0');
    const ss = String(Math.floor((d % 60000) / 1000)).padStart(2, '0');
    el.innerHTML = `
      <div class="cd-box"><span class="cd-num">${hh}</span><span class="cd-lbl">hrs</span></div>
      <div class="cd-box"><span class="cd-num">${mm}</span><span class="cd-lbl">min</span></div>
      <div class="cd-box"><span class="cd-num">${ss}</span><span class="cd-lbl">sec</span></div>`;
  };
  tick(); setInterval(tick, 1000);
}

/* ================================================================
   UNIFIED SLIDER ENGINE  v4.0
   
   Behavior specification:
   A. INITIAL STATE: All sliders start fully paused. No movement on load.
   B. VIEWPORT TRIGGER: IntersectionObserver watches each slider.
      When slider enters viewport → 5 s delay → autoplay starts.
   C. STEP-BASED ANIMATION: Every 2.5 s, exactly ONE card slides.
      Uses JS-controlled translateX (not CSS continuous animation).
      Smooth 0.45 s ease transition per step.
   D. MANUAL NAVIGATION:
      - Prev/Next buttons: move exactly ONE card per click.
      - Touch/swipe: smooth natural swipe on mobile.
   E. INTERACTION PAUSE:
      - Hover (desktop): pause immediately, resume 5 s after hover ends.
      - Touch (mobile): pause on touchstart, resume 5 s after touchend.
      - Button click: pause, resume 5 s after click.
   F. SEAMLESS LOOP: Double card set, wrap-around on overflow.
   ================================================================ */
function createSlider(containerEl, items, opts = {}) {
  if (!containerEl || !items || !items.length) return;

  const {
    stepMs      = 2500,   /* ms between each auto-step */
    pauseMs     = 5000,   /* ms to wait after interaction before resuming */
    viewDelay   = 5000,   /* ms after entering viewport before autoplay starts */
    cardW       = 241,    /* card width + gap (px) */
  } = opts;

  /* ── Find track ── */
  const track = containerEl.querySelector('.slider-track')
             || containerEl.querySelector('.carousel-track')
             || containerEl.querySelector('.carousel-track-m');
  if (!track) return;

  /* ── Find Prev/Next buttons (scope to slider-root or parent) ── */
  const root  = containerEl.closest('.slider-root') || containerEl.parentElement;
  const prevB = root?.querySelector('.sl-prev, .slider-prev, .carousel-arrow.prev');
  const nextB = root?.querySelector('.sl-next, .slider-next, .carousel-arrow.next');

  /* ── Build cards (two copies for seamless loop) ── */
  const oneSet = items.map(p => cardHTML(p)).join('');
  track.innerHTML = oneSet + oneSet;

  const loopW   = items.length * cardW;  /* width of one full set */
  let   offset  = 0;                     /* current translateX offset (positive = right) */
  let   autoTm  = null;                  /* step interval timer */
  let   pauseTm = null;                  /* resume-after-pause timer */
  let   ready   = false;                 /* becomes true after viewport delay fires */
  let   hovered = false;

  /* ── Apply transform with smooth transition ── */
  const applyTransform = (px, animate = true) => {
    track.style.transition = animate
      ? 'transform .45s cubic-bezier(.4,0,.2,1)'
      : 'none';
    track.style.transform = `translateX(-${px}px)`;
  };

  /* ── Normalize offset into [0, loopW) for seamless wrap ── */
  const normalizeOffset = () => {
    if (offset >= loopW) {
      offset -= loopW;
      applyTransform(offset, false); /* instant jump, no visible glitch */
    } else if (offset < 0) {
      offset += loopW;
      applyTransform(offset, false);
    }
  };

  /* ── Step one card forward/back ── */
  const stepForward = () => {
    offset += cardW;
    normalizeOffset();
    applyTransform(offset, true);
  };
  const stepBack = () => {
    offset -= cardW;
    normalizeOffset();
    applyTransform(offset, true);
  };

  /* ── Autoplay: step every stepMs ── */
  const startAuto = () => {
    if (!ready || hovered) return;
    clearInterval(autoTm);
    autoTm = setInterval(stepForward, stepMs);
  };

  const stopAuto = () => {
    clearInterval(autoTm);
    autoTm = null;
  };

  /* ── Pause for pauseMs then resume ── */
  const pauseAndResume = () => {
    stopAuto();
    clearTimeout(pauseTm);
    if (!hovered) pauseTm = setTimeout(startAuto, pauseMs);
  };

  /* ── Interaction helpers (used by buttons + touch) ── */
  const onInteract = () => pauseAndResume();

  /* ── Prev / Next buttons (one card per click) ── */
  prevB?.addEventListener('click', () => { stepBack();    onInteract(); });
  nextB?.addEventListener('click', () => { stepForward(); onInteract(); });

  /* ── Hover pause (desktop) ── */
  containerEl.addEventListener('mouseenter', () => {
    hovered = true;
    stopAuto();
    clearTimeout(pauseTm);
  });
  containerEl.addEventListener('mouseleave', () => {
    hovered = false;
    clearTimeout(pauseTm);
    pauseTm = setTimeout(startAuto, pauseMs);
  });

  /* ── Touch / swipe (mobile) ──
     Smooth natural swipe: track position follows finger, snaps to nearest card on release. */
  let touchStartX = 0, touchCurX = 0, isSwiping = false, swipeOffset = 0;

  containerEl.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchCurX   = touchStartX;
    isSwiping   = true;
    swipeOffset = offset;
    stopAuto();
    clearTimeout(pauseTm);
    track.style.transition = 'none';
  }, { passive: true });

  containerEl.addEventListener('touchmove', e => {
    if (!isSwiping) return;
    touchCurX   = e.touches[0].clientX;
    const delta = touchStartX - touchCurX;
    let   live  = ((swipeOffset + delta) % loopW + loopW) % loopW;
    track.style.transition = 'none';
    track.style.transform  = `translateX(-${live}px)`;
  }, { passive: true });

  containerEl.addEventListener('touchend', e => {
    if (!isSwiping) return;
    isSwiping = false;
    const delta = touchStartX - touchCurX;
    /* Snap: if dragged > 40px, move a card; otherwise snap back */
    if (Math.abs(delta) > 40) {
      const steps = Math.round(Math.abs(delta) / cardW) || 1;
      offset = delta > 0
        ? ((swipeOffset + steps * cardW) % loopW + loopW) % loopW
        : ((swipeOffset - steps * cardW) % loopW + loopW) % loopW;
    } else {
      offset = swipeOffset;
    }
    applyTransform(offset, true);
    pauseAndResume();
  }, { passive: true });

  /* ── IntersectionObserver: trigger viewport entry → 5 s delay → start ── */
  const visObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !ready) {
        setTimeout(() => {
          ready = true;
          if (!hovered) startAuto();
        }, viewDelay);
        visObs.unobserve(containerEl);
      }
    });
  }, { threshold: 0.2 });

  visObs.observe(containerEl);

  /* ── Initial state: slider is fully paused, at position 0 ── */
  applyTransform(0, false);
  initLazy();
}

/* ================================================================
   HERO SLIDER — category-based, fade transitions
   Same pause logic: hover pauses, 5 s after hover ends it resumes.
   Prev/Next pause for 5 s then resume.
   Starts paused; IntersectionObserver fires 5 s delay then autoplay.
   ================================================================ */
function initHeroSlider() {
  const slider = $('.hero-slider');
  if (!slider) return;
  const track = slider.querySelector('.hero-slider__track');
  const dotsC = slider.querySelector('.hero-slider__dots');
  const prevB = slider.querySelector('.hero-slider__prev');
  const nextB = slider.querySelector('.hero-slider__next');
  if (!track) return;

  const getSlides = () => $$('.hero-slide', track);
  if (!getSlides().length) return;

  let cur = 0, autoTm = null, pauseTm = null, ready = false;

  const goTo = n => {
    const ss = getSlides();
    const dd = dotsC ? $$('.hero-slider__dot', dotsC) : [];
    ss[cur]?.classList.remove('active');
    dd[cur]?.classList.remove('active');
    cur = ((n % ss.length) + ss.length) % ss.length;
    ss[cur]?.classList.add('active');
    dd[cur]?.classList.add('active');
  };

  const startAuto = () => { clearInterval(autoTm); autoTm = setInterval(() => goTo(cur + 1), 4200); };
  const pauseFor5 = () => { clearInterval(autoTm); clearTimeout(pauseTm); pauseTm = setTimeout(startAuto, 5000); };

  /* Build dots */
  if (dotsC) {
    dotsC.innerHTML = getSlides().map((_, i) =>
      `<span class="hero-slider__dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`
    ).join('');
    $$('.hero-slider__dot', dotsC).forEach(d =>
      d.addEventListener('click', () => { goTo(+d.dataset.i); pauseFor5(); })
    );
  }

  prevB?.addEventListener('click', () => { goTo(cur - 1); pauseFor5(); });
  nextB?.addEventListener('click', () => { goTo(cur + 1); pauseFor5(); });

  slider.addEventListener('mouseenter', () => { clearInterval(autoTm); clearTimeout(pauseTm); });
  slider.addEventListener('mouseleave', startAuto);

  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; clearInterval(autoTm); }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) goTo(cur + (dx < 0 ? 1 : -1));
    pauseFor5();
  }, { passive: true });

  track.addEventListener('click', e => {
    const sl = e.target.closest('.hero-slide[data-href]');
    if (sl) location.href = sl.dataset.href;
  });

  /* Viewport trigger: 5 s after hero enters view → start autoplay */
  const heroObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !ready) {
        ready = true;
        setTimeout(startAuto, 5000);
        heroObs.unobserve(slider);
      }
    });
  }, { threshold: 0.3 });
  heroObs.observe(slider);
}

/* ================================================================
   HOME PAGE
   ================================================================ */
function initHome() {
  initHeroSlider();
  initMarquee();
  initCountdown('#countdown');

  /* Featured carousel */
  const fcWrap = $('#featured-carousel');
  if (fcWrap) {
    const items = SPARKTECH_PRODUCTS.filter(p => p.featured).slice(0, 10);
    if (items.length) createSlider(fcWrap, items);
  }

  /* Per-category carousels */
  $$('[data-cat-carousel]').forEach(wrap => {
    const cat   = wrap.dataset.catCarousel;
    const items = SPARKTECH_PRODUCTS.filter(p => p.category === cat && p.featured).slice(0, 8);
    if (!items.length) { wrap.closest('section')?.remove(); return; }
    createSlider(wrap, items);
  });

  /* Brand strip */
  const strip = $('#brand-strip');
  if (strip) {
    const brands = [...new Set(SPARKTECH_PRODUCTS.map(p => p.brand))];
    strip.innerHTML = brands.map(b => `<span class="brand-chip">${b}</span>`).join('');
  }
}

/* ================================================================
   CATEGORY PAGE
   ================================================================ */
function initCategoryPage() {
  buildFilterBar(S.page);
  initFilterPills();
  renderGrid(S.page);
  initLoadMore(S.page);
}

function buildFilterBar(cat) {
  const brandSel = $('#brand-filter');
  if (brandSel) {
    const brands = [...new Set(SPARKTECH_PRODUCTS.filter(p => p.category === cat).map(p => p.brand))];
    brandSel.innerHTML = '<option value="all">All Brands</option>' +
      brands.map(b => `<option value="${b}">${b}</option>`).join('');
    brandSel.addEventListener('change', () => { S.brand = brandSel.value; S.pgNum = 1; renderGrid(cat); });
  }
  $('#sort-filter')?.addEventListener('change', e => { S.sort = e.target.value; S.pgNum = 1; renderGrid(cat); });
}

function initFilterPills() {
  $$('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      $$('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      S.brand = pill.dataset.filter || 'all';
      S.pgNum = 1;
      renderGrid(S.page);
      const sel = $('#brand-filter');
      if (sel) sel.value = S.brand;
    });
  });
}

function getFiltered(cat) {
  let list = SPARKTECH_PRODUCTS.filter(p => p.category === cat);
  if (S.brand !== 'all') list = list.filter(p => p.brand === S.brand);
  if (S.sort === 'price-asc')  list = [...list].sort((a,b) => (a.price||0)-(b.price||0));
  if (S.sort === 'price-desc') list = [...list].sort((a,b) => (b.price||0)-(a.price||0));
  if (S.sort === 'rating')     list = [...list].sort((a,b) => b.rating - a.rating);
  return list;
}

function renderGrid(cat) {
  const grid = $('#products-grid');
  if (!grid) return;
  const all    = getFiltered(cat);
  const toShow = all.slice(0, S.pgNum * S.perPage);
  const skelN  = Math.min(S.perPage, toShow.length || S.perPage);

  grid.innerHTML = Array(skelN).fill(0).map(() => `
    <div class="skel-card skel-card--grid">
      <div class="skeleton skel-img"></div>
      <div style="padding:.85rem">
        <div class="skeleton skel-line w60"></div>
        <div class="skeleton skel-line w100"></div>
        <div class="skeleton skel-line w80"></div>
      </div>
    </div>`).join('');

  setTimeout(() => {
    grid.innerHTML = toShow.length
      ? toShow.map(p => cardHTML(p, true)).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray)">
           <i class="fas fa-search" style="font-size:2rem;display:block;margin-bottom:.75rem"></i>
           <p>No products found.</p>
         </div>`;
    initLazy(); initReveal();
    const cnt = $('#filter-count');
    if (cnt) cnt.textContent = `${toShow.length} of ${all.length} products`;
    const btn = $('#load-more');
    if (btn) btn.style.display = toShow.length >= all.length ? 'none' : 'inline-flex';
  }, 360);
}

function initLoadMore(cat) {
  $('#load-more')?.addEventListener('click', function () {
    S.pgNum++;
    this.innerHTML = '<i class="fas fa-spinner" style="animation:spin 1s linear infinite"></i> Loading…';
    setTimeout(() => { this.innerHTML = '<i class="fas fa-plus"></i> Load More'; renderGrid(cat); }, 500);
  });
}

/* spin keyframe */
(function(){
  const s = document.createElement('style');
  s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(s);
}());

/* ================================================================
   PRODUCT DETAIL PAGE
   ================================================================ */
function initDetailPage() {
  const id = new URLSearchParams(location.search).get('id');
  const p  = SPARKTECH_PRODUCTS.find(x => x.id === id);
  if (!p) { location.href = 'index.html'; return; }
  document.title = `${p.name} — SparkTech`;
  renderDetail(p);
  initRelated(p);
  initLightbox();
}

const getMedia = p => [...(p.images || []), ...(p.videos || [])].filter(Boolean);

function renderDetail(p) {
  const container = $('#detail-container');
  if (!container) return;
  const disc     = calcDisc(p.originalPrice, p.price);
  const inWish   = S.wish.some(w => w.id === p.id);
  const inCart   = S.cart.some(c => c.id === p.id);
  const stockCls = p.stock > 10 ? 'in-stock' : p.stock > 0 ? 'low-stock' : 'out-stock';
  const stockTxt = p.stock > 10 ? `✓ In Stock (${p.stock} available)` : p.stock > 0 ? `⚡ Only ${p.stock} left!` : '✗ Out of Stock';
  const media    = getMedia(p);

  container.innerHTML = `
    <div class="detail-grid">
      <div class="detail-gallery">
        <div class="media-slider" id="main-slider">
          <div class="media-slider__track" id="media-track">
            ${media.map((src, i) => mediaSlideHTML(src, p.name, i)).join('')}
          </div>
          ${media.length > 1 ? `
            <button class="media-slider__prev" onclick="mediaPrev()"><i class="fas fa-chevron-left"></i></button>
            <button class="media-slider__next" onclick="mediaNext()"><i class="fas fa-chevron-right"></i></button>` : ''}
        </div>
        ${media.length > 1 ? `
          <div class="media-dots" id="media-dots">
            ${media.map((_,i) => `<span class="media-dot${i===0?' active':''}" onclick="mediaGo(${i})"></span>`).join('')}
          </div>` : ''}
        <div class="media-thumbs" id="media-thumbs">
          ${media.map((src, i) => thumbHTML(src, i)).join('')}
        </div>
      </div>
      <div class="detail-info">
        <div class="badge-row">
          ${p.badge ? `<span class="d-badge ${badgeCls(p.badge)}">${p.badge}</span>` : ''}
          ${p.stock > 0 && p.stock <= 5 ? `<span class="d-badge badge-red">⚡ Limited Stock</span>` : ''}
        </div>
        <div class="brand">${p.brand}</div>
        <h1>${p.name}</h1>
        <div class="rating-row">
          <span class="stars">${starsHTML(p.rating)}</span>
          <span class="rating-val">${p.rating}</span>
          <span class="rating-cnt">(${(p.reviews||0).toLocaleString()} reviews)</span>
        </div>
        <div class="price-box">
          <div style="display:flex;align-items:baseline;flex-wrap:wrap;gap:.4rem">
            <span class="price-main">${fmtPrice(p.price)}</span>
            ${(p.originalPrice||0) > (p.price||0) ? `<span class="price-orig">${fmtPrice(p.originalPrice)}</span>` : ''}
            ${disc > 0 ? `<span class="price-save">-${disc}% OFF</span>` : ''}
          </div>
          <div class="price-note">Inclusive of all taxes · Free delivery on orders above ₹999</div>
        </div>
        <p class="desc">${p.description || ''}</p>
        ${Object.keys(p.specs || {}).length ? `
          <div class="specs-title">Key Specifications</div>
          <div class="specs-grid">
            ${Object.entries(p.specs).map(([k,v]) =>
              `<div class="spec"><div class="spec__k">${k}</div><div class="spec__v">${v}</div></div>`
            ).join('')}
          </div>` : ''}
        <div class="stock-badge ${stockCls}">${stockTxt}</div>
        <div class="detail-actions">
          <button class="btn-cart-d${inCart ? ' in-cart' : ''}" id="d-cart-btn" onclick="dAddCart('${p.id}')">
            <i class="fas ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i>
            ${inCart ? 'Added to Cart' : 'Add to Cart'}
          </button>
          <button class="btn-icon-d${inWish ? ' wishlisted' : ''}" id="d-wish-btn" onclick="dToggleWish('${p.id}')" title="Wishlist">
            <i class="fa${inWish ? 's' : 'r'} fa-heart"></i>
          </button>
          <button class="btn-icon-d" id="d-share-btn" onclick="toggleSharePanel('${p.id}')" title="Share">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
        <div class="share-panel" id="share-panel">
          <div style="font-size:.74rem;font-weight:700;color:var(--gray-lt)">Share this product</div>
          <div class="share-url-row">
            <input class="share-url" id="share-url-input" readonly>
            <button class="btn btn-sm btn-outline" onclick="copyShareUrl()">Copy</button>
          </div>
          <div class="share-btns">
            <button class="share-btn share-whatsapp" onclick="shareWA('${p.id}')"><i class="fab fa-whatsapp"></i> WhatsApp</button>
            <button class="share-btn share-twitter"  onclick="shareTwitter('${p.id}')"><i class="fab fa-twitter"></i> Twitter/X</button>
          </div>
        </div>
      </div>
    </div>`;

  initMediaSlider(media);
}

function mediaSlideHTML(src, name, i) {
  if (/youtube\.com|youtu\.be/.test(src)) {
    const vid = src.match(/(?:v=|youtu\.be\/)([^?&/]+)/)?.[1] || '';
    return `<div class="media-slide"><iframe src="https://www.youtube.com/embed/${vid}?rel=0" frameborder="0" allowfullscreen loading="lazy"></iframe></div>`;
  }
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(src))
    return `<div class="media-slide"><video src="${src}" controls playsinline preload="metadata"></video></div>`;
  return `<div class="media-slide">
    <img src="${src}" alt="${name} ${i+1}" loading="${i===0?'eager':'lazy'}"
      onerror="this.src='https://placehold.co/600x600/1C2235/38BEFF?text=SparkTech'"
      data-lightbox="${src}">
  </div>`;
}

function thumbHTML(src, i) {
  if (/youtube\.com|youtu\.be|\.mp4|\.webm/i.test(src))
    return `<div class="media-thumb video-thumb${i===0?' active':''}" onclick="mediaGo(${i})"><i class="fas fa-play-circle" style="font-size:1.5rem"></i></div>`;
  return `<div class="media-thumb${i===0?' active':''}" onclick="mediaGo(${i})">
    <img src="${src}" alt="thumb" loading="lazy" onerror="this.src='https://placehold.co/64x64/1C2235/38BEFF?text=?'">
  </div>`;
}

let _mCur = 0, _mTotal = 0, _mTm = null;

function initMediaSlider(media) {
  _mTotal = media.length; _mCur = 0;
  if (_mTotal <= 1) return;
  const startAuto = () => { clearInterval(_mTm); _mTm = setInterval(mediaNext, 4000); };
  /* Media slider on product page: starts paused, begins after 5 s */
  setTimeout(startAuto, 5000);
  const sl = $('#main-slider');
  sl?.addEventListener('mouseenter', () => clearInterval(_mTm));
  sl?.addEventListener('mouseleave', () => { clearInterval(_mTm); _mTm = setInterval(mediaNext, 4000); });
  let sx = 0;
  sl?.addEventListener('touchstart', e => { sx = e.touches[0].clientX; clearInterval(_mTm); }, { passive: true });
  sl?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 38) { dx < 0 ? mediaNext() : mediaPrev(); }
    setTimeout(startAuto, 5000);
  }, { passive: true });
}

function mediaGo(n) {
  _mCur = ((n % _mTotal) + _mTotal) % _mTotal;
  const t = $('#media-track');
  if (t) { t.style.transition = 'transform .4s ease'; t.style.transform = `translateX(-${_mCur * 100}%)`; }
  $$('#media-dots .media-dot').forEach((d, i) => d.classList.toggle('active', i === _mCur));
  $$('#media-thumbs .media-thumb').forEach((t, i) => t.classList.toggle('active', i === _mCur));
}
function mediaNext() { mediaGo(_mCur + 1); }
function mediaPrev() { mediaGo(_mCur - 1); }
window.mediaGo = mediaGo; window.mediaNext = mediaNext; window.mediaPrev = mediaPrev;

/* Lightbox */
function initLightbox() {
  if ($('#lightbox')) return;
  const lb = document.createElement('div');
  lb.id = 'lightbox'; lb.className = 'lightbox';
  lb.innerHTML = `<img class="lightbox__img" id="lb-img" alt=""><button class="lightbox__close" onclick="closeLB()"><i class="fas fa-times"></i></button>`;
  document.body.appendChild(lb);
  document.addEventListener('click', e => { const el = e.target.closest('[data-lightbox]'); if (el) openLB(el.dataset.lightbox); });
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  lb.querySelector('#lb-img')?.addEventListener('click', () => lb.querySelector('#lb-img')?.classList.toggle('zoomed'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
}
function openLB(src) {
  const lb = $('#lightbox'), img = $('#lb-img');
  if (!lb || !img) return;
  img.src = src; img.classList.remove('zoomed');
  lb.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closeLB() { $('#lightbox')?.classList.remove('open'); document.body.style.overflow = ''; }
window.closeLB = closeLB;

/* Product share */
const buildProdURL = id => `${location.origin}${location.pathname.replace(/\/[^/]*$/, '/')}product.html?id=${encodeURIComponent(id)}`;

function toggleSharePanel(id) {
  const panel = $('#share-panel'), inp = $('#share-url-input');
  if (!panel) return;
  if (inp) inp.value = buildProdURL(id);
  panel.classList.toggle('open');
}
function copyShareUrl() {
  const v = $('#share-url-input')?.value;
  if (!v) return;
  navigator.clipboard?.writeText(v).then(() => toast('Link copied!', 'info')).catch(() => toast('Copy failed', 'error'));
}
function shareWA(id) {
  const p = SPARKTECH_PRODUCTS.find(x => x.id === id);
  window.open(`https://wa.me/?text=${encodeURIComponent(`🛍️ "${p?.name}" on SparkTech!\n${buildProdURL(id)}`)}`, '_blank');
}
function shareTwitter(id) {
  const p = SPARKTECH_PRODUCTS.find(x => x.id === id);
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${p?.name} on @SparkTechIndia`)}&url=${encodeURIComponent(buildProdURL(id))}`, '_blank');
}
window.toggleSharePanel = toggleSharePanel;
window.copyShareUrl     = copyShareUrl;
window.shareWA          = shareWA;
window.shareTwitter     = shareTwitter;

function dAddCart(id) {
  addToCart(null, id);
  const b = $('#d-cart-btn');
  if (b) { b.classList.add('in-cart'); b.innerHTML = '<i class="fas fa-check"></i> Added to Cart'; }
}
function dToggleWish(id) {
  toggleWish(null, id);
  const b = $('#d-wish-btn');
  if (b) {
    const now = S.wish.some(w => w.id === id);
    b.classList.toggle('wishlisted', now);
    b.innerHTML = `<i class="fa${now ? 's' : 'r'} fa-heart"></i>`;
  }
}
window.dAddCart = dAddCart; window.dToggleWish = dToggleWish;
window.detailAddCart = dAddCart; window.detailToggleWish = dToggleWish;

/* Related products — up to 20, same category slider */
function initRelated(p) {
  const section = $('#related-section');
  if (!section) return;
  const related = SPARKTECH_PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 20);
  if (!related.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  const outerEl = section.querySelector('.related-outer');
  if (!outerEl) return;
  const track = outerEl.querySelector('.carousel-track-m');
  if (track) track.innerHTML = '';
  createSlider(outerEl, related);
}

/* ================================================================
   CART PAGE
   ================================================================ */
function initCartPage() {
  restoreSharedCart();
  renderCart();
  initCartShare();
}

function renderCart() {
  const list = $('#cart-items');
  if (!list) return;
  if (!S.cart.length) {
    list.innerHTML = `<div class="cart-empty">
      <i class="fas fa-shopping-cart"></i>
      <h3>Your cart is empty</h3>
      <p>Discover amazing products and add them!</p>
      <a href="index.html" class="btn btn-primary" style="margin-top:1rem">
        <i class="fas fa-arrow-left"></i> Continue Shopping
      </a>
    </div>`;
    calcSummary(); return;
  }
  list.innerHTML = S.cart.map(item => {
    const p = SPARKTECH_PRODUCTS.find(x => x.id === item.id);
    if (!p) return '';
    const img = (p.images || [])[0] || '';
    return `<div class="cart-item" data-id="${p.id}">
      <div class="cart-item__img">
        <img src="${img}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/80x80/1C2235/38BEFF?text=?'">
      </div>
      <div class="cart-item__info">
        <div class="cart-item__name">${p.name}</div>
        <div class="cart-item__brand">${p.brand}</div>
        <div class="cart-item__price">${fmtPrice((p.price||0) * item.qty)}</div>
        <div class="qty-row">
          <button class="qty-btn" onclick="updateQty('${p.id}',-1)"><i class="fas fa-minus" style="font-size:.55rem"></i></button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${p.id}',1)"><i class="fas fa-plus" style="font-size:.55rem"></i></button>
          <span style="font-size:.7rem;color:var(--gray);margin-left:.3rem">× ${fmtPrice(p.price)}</span>
        </div>
      </div>
      <button class="cart-item__del" onclick="removeFromCart('${p.id}')" title="Remove">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>`;
  }).join('');
  calcSummary();
}

function calcSummary() {
  const sub  = S.cart.reduce((s, item) => {
    const p = SPARKTECH_PRODUCTS.find(x => x.id === item.id);
    return s + (p ? (p.price||0) * item.qty : 0);
  }, 0);
  const ship = sub > 0 && sub < 999 ? 99 : 0;
  const set  = (id, val) => { const el = $(id); if (el) el.textContent = val; };
  set('#sum-sub',   fmtPrice(sub));
  set('#sum-ship',  ship === 0 ? 'FREE' : fmtPrice(ship));
  set('#sum-total', fmtPrice(sub + ship));
  set('#cart-title-count', `${S.cart.reduce((s, i) => s + i.qty, 0)} items`);
  const shipEl = $('#sum-ship');
  if (shipEl) shipEl.className = ship === 0 ? 'sum-val free' : 'sum-val';
}

function initCartShare() {
  $('#cart-share-btn')?.addEventListener('click', openCartShare);
}
function openCartShare() {
  if (!S.cart.length) { toast('Add items to cart first!', 'warn'); return; }
  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(S.cart))));
    const base    = location.origin + location.pathname.replace(/\/[^/]*$/, '/');
    const url     = `${base}cart.html?sharedCart=${encodeURIComponent(encoded)}`;
    const inp     = $('#cart-share-url');
    if (inp) inp.value = url;
    $('#cart-share-panel')?.classList.toggle('open');
  } catch(e) { toast('Could not generate link', 'error'); }
}
function copyCartUrl() {
  const v = $('#cart-share-url')?.value;
  if (!v) return;
  navigator.clipboard?.writeText(v).then(() => toast('Cart link copied!', 'info')).catch(() => toast('Copy failed', 'error'));
}
function shareCartWA() {
  const v = $('#cart-share-url')?.value;
  if (!v) return;
  const n = S.cart.reduce((s, i) => s + i.qty, 0);
  window.open(`https://wa.me/?text=${encodeURIComponent(`🛒 My SparkTech cart (${n} item${n !== 1 ? 's' : ''}):\n${v}`)}`, '_blank');
}
window.openCartShare = openCartShare; window.copyCartUrl = copyCartUrl; window.shareCartWA = shareCartWA;

function restoreSharedCart() {
  const param = new URLSearchParams(location.search).get('sharedCart');
  if (!param) return;
  try {
    const json  = decodeURIComponent(escape(atob(decodeURIComponent(param))));
    const data  = JSON.parse(json);
    if (!Array.isArray(data)) return;
    const valid = data.filter(it => it.id && it.qty > 0 && SPARKTECH_PRODUCTS.find(p => p.id === it.id));
    if (!valid.length) return;
    S.cart = valid; saveCart(); updateBadges();
    toast(`🎉 Cart restored — ${valid.reduce((s,i)=>s+i.qty,0)} item(s)!`, 'success');
    history.replaceState({}, '', location.pathname);
  } catch(e) { /* ignore */ }
}

/* ================================================================
   MODALS
   ================================================================ */
function initModals() {
  const overlay  = $('#wishlist-overlay');
  const closeBtn = overlay?.querySelector('.modal-close');
  $('#open-wishlist')?.addEventListener('click', () => { overlay?.classList.add('open'); renderWishModal(); });
  closeBtn?.addEventListener('click', () => overlay?.classList.remove('open'));
  overlay?.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
}

/* ================================================================
   SEARCH PAGE
   ================================================================ */
function initSearchPage() {
  const q    = new URLSearchParams(location.search).get('q') || '';
  const grid = $('#search-grid');
  const hdr  = $('#search-heading');
  $$('.search-input').forEach(i => { if (!i.value) i.value = q; });
  if (!grid) return;
  if (!q) { grid.innerHTML = '<p style="color:var(--gray);padding:1rem">Enter a search query above.</p>'; return; }
  const results = searchProds(q.toLowerCase());
  if (!results.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray)">
      <i class="fas fa-search" style="font-size:2rem;display:block;margin-bottom:.75rem"></i>
      <p>No results for "<strong>${q}</strong>".</p>
      <a href="index.html" class="btn btn-outline" style="margin-top:1rem">Back to Home</a>
    </div>`;
  } else {
    grid.innerHTML = results.map(p => cardHTML(p, true)).join('');
    if (hdr) hdr.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for: "${q}"`;
  }
  initLazy(); initReveal();
}

/* ================================================================
   MAIN INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initSearch();
  initReveal();
  initModals();

  switch (S.page) {
    case 'home':    initHome();         break;
    case 'cart':    initCartPage();     break;
    case 'product': initDetailPage();   break;
    case 'search':  initSearchPage();   break;
    default:        initCategoryPage(); break;
  }

  initLazy();
});