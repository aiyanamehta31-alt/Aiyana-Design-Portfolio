/* =====================================================================
   AIYANA MEHTA · PORTFOLIO · main.js
   0. Settings + wheel images (edit me)   5. Nav state
   1. Setup                               6. Hero: wheel, menu, top bar
   2. Smooth scroll                       7. Cursor (off by default)
   3. Anchor jumps                        8. Scroll animation (runs last)
   4. One black world                     9. All projects view (#work/all)
   Timings and colours for the rest of the page are tokens in style.css.
   ===================================================================== */

/* ---------- 0. Settings ---------- */
var ENABLE_CUSTOM_CURSOR = false;    // true brings back the amber bubble-to-bullseye cursor
var WHEEL_SECONDS_PER_TURN = 30;     // one full clockwise turn of the hero wheel, at one constant speed

/* The hero wheel's images.
   PLACEHOLDER: replace each with your real work (blueprints, 3D renders, blended
   images, sketches, UI screens). Landscape images work best (16:10); any size
   fills its card. `label` is the small tag in the card's corner: set it to ''
   to hide it. Desktop shows the first 10, tablets and phones the first 8. */
var WHEEL_IMAGES = [
  // Real work for now; Aiyana will send her own picks to swap in.
  { src: 'assets/images/projects/nexo/card-cover.webp',                          alt: 'Three Nexo desk companions in orange, black and blue.',                  label: 'Nexo' },
  { src: 'assets/images/projects/maggi/poster-beret-sm.webp',                    alt: 'A fork of masala noodles wearing a black beret, on yellow.',             label: 'Maggi' },
  { src: 'assets/images/projects/branding/velvet-vine/vv-slide-4-packaging-sm.webp', alt: 'Velvet Vine sparkling water cans in deep fig.',                     label: 'Velvet Vine' },
  { src: 'assets/images/projects/branding/static/static-flat-lay-sm.webp',        alt: 'STATIC. merch on brushed steel: a lanyard with a chrome ID tag, an acid-green zine and a holographic sticker sheet.', label: 'STATIC.' },
  { src: 'assets/images/projects/wiglet/card-cover.webp',                        alt: 'The Wiglet planner card with its blob mascot.',                         label: 'Wiglet' },
  { src: 'assets/images/projects/branding/koma/koma-slide-5-flatlay-sm.webp',    alt: 'A table of KOMA bao in bamboo steamers.',                               label: 'KOMA' },
  { src: 'assets/images/projects/wheel/koma-box.webp',                          alt: 'A black KOMA takeout box with a wire handle, a green steam mark and the KOMA wordmark.', label: 'Branding' },
  { src: 'assets/images/projects/sketching/lounge-pod-sheet.webp',              alt: 'A sketch sheet for a futurist lounge pod inspired by a wasp: form studies, a charcoal render with a yellow glow, and structural ribs.', label: 'Sketching and prototyping' },
  { src: 'assets/images/projects/codes/card-cover.webp',                         alt: 'A spiral galaxy of blue and violet dust, from a coded sketch.',         label: 'Codes' },
  { src: 'assets/images/projects/branding/meridian/meridian-icon-texture-sm.webp', alt: 'The Meridian emblem in gold foil, a runner on a winding trail below mountains and pines, on forest-green contour paper.', label: 'Meridian' }
];

(function () {
  'use strict';

  /* ---------- 1. Setup ---------- */
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  // If the animation library didn't load, show everything immediately.
  if (!hasGsap) root.classList.remove('motion-ok');

  var styles = getComputedStyle(root);
  function token(name) { return styles.getPropertyValue(name).trim(); }
  function tokenNumber(name, fallback) {
    var n = parseFloat(token(name));
    return isNaN(n) ? fallback : n;
  }
  function headerHeight() {
    var header = document.querySelector('.site-header');
    return header ? header.offsetHeight : 0;
  }

  /* ---------- 2. Smooth scroll (Lenis, desktop only, never with reduced motion) ---------- */
  var lenis = null;
  if (!reduceMotion && finePointer && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    window.portfolio = { lenis: lenis };   // js/case-study.js pauses it while a project is open
    if (hasGsap) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    }
  }

  /* ---------- 3. Anchor jumps (nav, hints, back to top) ---------- */
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;
    var hash = link.getAttribute('href');

    // PLACEHOLDER links (case studies not built yet) do nothing for now.
    if (hash === '#') { event.preventDefault(); return; }
    // Case studies (#project/<slug>) are opened by js/case-study.js;
    // the All projects view (#work/all) by section 9 below.
    if (hash.indexOf('#project/') === 0 || hash.indexOf('#work/') === 0 || link.hasAttribute('data-all-back')) return;

    var target = document.querySelector(hash);
    if (!target) return;
    event.preventDefault();

    var y = hash === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - (target.matches('section') ? 0 : headerHeight() + 24);
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });

    // Move keyboard focus to where we jumped.
    var focusTarget = hash === '#top' ? document.getElementById('main') : target;
    if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
    focusTarget.focus({ preventScroll: true });
    if (history.replaceState) history.replaceState(null, '', hash === '#top' ? ' ' : hash);
  });

  /* ---------- 4. One black world ----------
     The homepage is one black page now (DESIGN.md); the old grey-to-taupe
     scroll blend is gone, so there is nothing to do here. */

  /* ---------- 5. Nav state ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  function updateNav() {
    var middle = window.innerHeight * 0.5;
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      var section = href === '#resume' ? null : document.querySelector(href);
      if (!section) return;
      var box = section.getBoundingClientRect();
      if (box.top <= middle && box.bottom > middle) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateNav();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  updateNav();

  /* ---------- 6. Hero: wheel, phone menu, top bar ---------- */
  var hero = document.querySelector('.hero');
  var wheelList = document.querySelector('.hero-wheel');

  if (hero && wheelList && WHEEL_IMAGES.length) {
    var cards = [];
    var geo = {};
    var spin = 0;                         // degrees turned so far, clockwise
    var loopId = 0;
    var lastTime = 0;
    var bornAt = performance.now();

    function lerp(a, b, t) { return a + (b - a) * t; }
    function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    // Ring geometry for the current hero size (see DESIGN.md, "Hero").
    function measure() {
      var W = hero.clientWidth;
      var H = hero.clientHeight;
      var phone = W < 640;
      var tablet = !phone && W < 1024;
      geo.count = Math.min(WHEEL_IMAGES.length, phone || tablet ? 8 : 10);
      geo.cx = W * 0.5;
      // Desktop/tablet: centre 63% and Ry 33vh were measured from the reference
      // frames (the brief's starting values were 66% and 38vh).
      geo.cy = H * (phone ? 0.62 : 0.63);
      geo.rx = phone ? W * 0.42 : tablet ? W * 0.32 : clamp(W * 0.25, 240, 520);
      geo.ry = phone ? H * 0.30 : clamp(H * 0.33, 220, 420);
      geo.maxW = W * (phone ? 0.62 : tablet ? 0.40 : 0.32);
      geo.minW = W * (phone ? 0.14 : tablet ? 0.09 : 0.05); // tablet min not in the brief: 9vw keeps the top arc full on tall screens
      geo.maxH = geo.maxW * 0.625;
      geo.step = 360 / geo.count;
      // The reference wheel is a ring tilted towards the viewer, seen in
      // perspective: cards near the top come closer, so they grow and spread
      // apart; the sides sink low and small. `u` is how strong that depth is,
      // taken from the smallest/largest card sizes above. The projection is
      // anchored to the numbers above: top card at cy - ry and maxW wide,
      // bottom card at cy + ry and minW wide, widest reach rx.
      var r = geo.minW / geo.maxW;
      geo.u = clamp((1 - r) / (1 + r), 0.3, 0.85);
      geo.bx = geo.rx * Math.sqrt(1 - geo.u * geo.u);
      geo.ay = geo.ry * (1 - geo.u * geo.u);
      geo.y0 = geo.cy + geo.u * geo.ry;
      // Start with two cards either side of 12 o'clock, as in the reference.
      geo.phase = -geo.step / 2;
      keepTextClear();
    }

    // Where a card sits at angle theta (degrees), before the entrance.
    function place(theta) {
      var a = theta * Math.PI / 180;
      var k = 1 / (1 - geo.u * Math.cos(a));         // perspective: 1/(1-u) at the top
      return {
        x: geo.cx + geo.bx * Math.sin(a) * k,
        y: geo.y0 - geo.ay * Math.cos(a) * k,
        w: geo.maxW * (1 - geo.u) * k,
        d: (1 + Math.cos(a)) / 2
      };
    }

    // Cards in the upper half of the ring must never touch the words; if one
    // would at any angle, widen the ring a little until it clears. Cards in the
    // lower half are dimmed and pass behind the text, as in the reference.
    function keepTextClear() {
      var heroBox = hero.getBoundingClientRect();
      var range = document.createRange();
      var boxes = ['.hero-copy__title', '.hero-copy__text'].map(function (sel) {
        range.selectNodeContents(document.querySelector(sel));   // the words, not the block
        var r = range.getBoundingClientRect();
        return { l: r.left - heroBox.left - 16, r: r.right - heroBox.left + 16, t: r.top - heroBox.top - 16, b: r.bottom - heroBox.top + 16 };
      });
      for (var tries = 0; tries < 30; tries++) {
        var clear = true;
        for (var th = -180; th < 180 && clear; th += 3) {
          var p = place(th);
          if (p.d < 0.5) continue;
          var rot = Math.abs(-0.22 * th) * Math.PI / 180;
          var h = p.w * 0.625;
          var halfW = (p.w * Math.cos(rot) + h * Math.sin(rot)) / 2;
          var halfH = (p.w * Math.sin(rot) + h * Math.cos(rot)) / 2;
          clear = !boxes.some(function (b) {
            return p.x + halfW > b.l && p.x - halfW < b.r && p.y + halfH > b.t && p.y - halfH < b.b;
          });
        }
        if (clear) return;
        geo.bx *= 1.03;
      }
    }

    function build() {
      if (cards.length === geo.count) return;
      wheelList.innerHTML = '';
      cards = WHEEL_IMAGES.slice(0, geo.count).map(function (item) {
        var li = document.createElement('li');
        li.className = 'wheel-card';
        var img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        img.decoding = 'async';
        img.draggable = false;
        li.appendChild(img);
        var shade = document.createElement('span');
        shade.className = 'wheel-card__shade';
        li.appendChild(shade);
        if (item.label) {
          var tag = document.createElement('span');
          tag.className = 'wheel-card__label';
          tag.setAttribute('aria-hidden', 'true');
          tag.textContent = item.label;
          li.appendChild(tag);
        }
        wheelList.appendChild(li);
        return { el: li, shade: shade };
      });
    }

    // Cards are sized once, at their largest; every size change is a scale.
    function sizeCards() {
      cards.forEach(function (card) {
        card.el.style.width = geo.maxW.toFixed(1) + 'px';
        card.el.style.height = geo.maxH.toFixed(1) + 'px';
        card.el.style.borderRadius = (geo.maxW * 0.04).toFixed(1) + 'px';
      });
    }

    function render(now) {
      cards.forEach(function (card, i) {
        // theta: clockwise from 12 o'clock, normalised to -180..180
        var theta = ((geo.phase + i * geo.step + spin) % 360 + 540) % 360 - 180;
        var p = place(theta);
        var d = p.d;                                   // 1 at the top, 0 at the bottom
        var x = p.x, y = p.y, w = p.w;
        var brightness = lerp(0.3, 1, Math.pow(d, 1.2));
        var opacity = lerp(0.4, 1, d);

        // Entrance: fade in from 0 and scale 0.95, 1.2s, 60ms apart.
        var intro = reduceMotion ? 1 : easeOut(clamp((now - bornAt - i * 60) / 1200, 0, 1));
        var scale = (w / geo.maxW) * (0.95 + 0.05 * intro);

        card.el.style.transform =
          'translate3d(' + (x - geo.maxW / 2).toFixed(1) + 'px,' + (y - geo.maxH / 2).toFixed(1) + 'px,0)' +
          ' rotate(' + (-0.22 * theta).toFixed(2) + 'deg)' +
          ' perspective(1000px) rotateX(' + (14 * d).toFixed(2) + 'deg)' +
          ' scale(' + scale.toFixed(4) + ')';
        card.el.style.opacity = (opacity * intro).toFixed(3);
        card.el.style.zIndex = String(Math.round(d * 100));
        card.shade.style.opacity = (1 - brightness).toFixed(3);
      });
    }

    function tick(now) {
      var dt = Math.min(0.1, (now - lastTime) / 1000);   // seconds; capped after a stall
      lastTime = now;
      spin = (spin + (360 / WHEEL_SECONDS_PER_TURN) * dt) % 360;
      render(now);
      loopId = requestAnimationFrame(tick);
    }
    function start() {
      if (reduceMotion || loopId) return;
      lastTime = performance.now();
      loopId = requestAnimationFrame(tick);
    }
    function stop() {
      cancelAnimationFrame(loopId);
      loopId = 0;
    }

    function layout() {
      measure();
      build();
      sizeCards();
      render(performance.now());
    }
    layout();
    window.addEventListener('resize', layout);
    start();

    // Pause in a hidden tab or when the hero is off screen; resume where it left off.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !document.hidden) start(); else stop();
      }).observe(hero);
    }
  }

  // Phone menu
  var menuButton = document.querySelector('.hero-menu');
  var menuPanel = document.getElementById('hero-menu-panel');
  if (menuButton && menuPanel) {
    function setMenu(open) {
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? 'Close' : 'Menu';
      menuPanel.hidden = !open;
    }
    menuButton.addEventListener('click', function () { setMenu(menuPanel.hidden); });
    menuPanel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menuPanel.hidden) { setMenu(false); menuButton.focus(); }
    });
  }

  // The light top bar stays tucked away (and out of the tab order) over the hero.
  var siteHeader = document.querySelector('.site-header');
  if (siteHeader && !(hero && 'IntersectionObserver' in window)) siteHeader.classList.remove('is-tucked');
  if (hero && siteHeader && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var overHero = entries[0].isIntersecting;
      siteHeader.classList.toggle('is-tucked', overHero);
      siteHeader.inert = overHero;
    }, { rootMargin: '-72px 0px 0px 0px' }).observe(hero);
  }

  /* ---------- 7. Cursor: soft bubble that tightens into a bullseye ---------- */
  var cursor = document.querySelector('.cursor');
  if (ENABLE_CUSTOM_CURSOR && cursor && finePointer) {
    root.classList.add('has-cursor');
    var body = cursor.querySelector('.cursor__body');
    var lag = tokenNumber('--cursor-lag', 0.18);
    var squishMax = tokenNumber('--cursor-squish', 0.45);
    var mouse = { x: -100, y: -100 };
    var at = { x: -100, y: -100 };
    var seen = false;
    var onTarget = false;
    var lastTime = performance.now();
    // Anything that reacts to the pointer gets the focus ring, wheel cards included.
    var targets = 'a, button, [role="button"], .project-card, .wheel-card, summary, label';

    cursor.classList.add('is-hidden');

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!seen) { at.x = mouse.x; at.y = mouse.y; seen = true; }
      cursor.classList.remove('is-hidden');
    }, { passive: true });

    document.addEventListener('pointerover', function (e) {
      onTarget = !!(e.target.closest && e.target.closest(targets));
      cursor.classList.toggle('is-target', onTarget);
    });
    document.documentElement.addEventListener('mouseleave', function () { cursor.classList.add('is-hidden'); });
    window.addEventListener('pointerdown', function () { cursor.classList.add('is-down'); });
    window.addEventListener('pointerup', function () { cursor.classList.remove('is-down'); });

    (function follow(now) {
      var dt = Math.min(64, now - lastTime) / 16.667;
      lastTime = now;

      if (reduceMotion) {
        at.x = mouse.x; at.y = mouse.y;
      } else {
        var ease = 1 - Math.pow(1 - lag, dt);
        at.x += (mouse.x - at.x) * ease;
        at.y += (mouse.y - at.y) * ease;
      }

      var dx = mouse.x - at.x;
      var dy = mouse.y - at.y;
      var speed = Math.sqrt(dx * dx + dy * dy);
      // Wandering = squishy. On a target = precise (barely stretches).
      var stretch = reduceMotion ? 0 : Math.min(speed / 110, squishMax) * (onTarget ? 0.2 : 1);
      var angle = Math.atan2(dy, dx) * 180 / Math.PI;

      cursor.style.transform = 'translate3d(' + at.x.toFixed(1) + 'px,' + at.y.toFixed(1) + 'px,0)';
      body.style.transform = 'rotate(' + angle.toFixed(1) + 'deg) scale(' + (1 + stretch).toFixed(3) + ',' + (1 - stretch * 0.55).toFixed(3) + ')';

      requestAnimationFrame(follow);
    })(lastTime);
  }

  /* ---------- 9. All projects view (#work/all) ----------
     "Explore more projects" opens every project in a view laid over the
     homepage, with its own URL. The page underneath never moves, so Back
     returns to exactly the same scroll position. */
  (function () {
    var view = document.getElementById('all-projects');
    if (!view) return;
    var ALL = '#work/all';
    var outside = [];
    var pushed = false;
    var returnFocus = null;

    function show(fromClick) {
      if (!view.hidden) return;
      returnFocus = fromClick ? document.activeElement : document.querySelector('.work-more__btn');
      view.hidden = false;
      view.scrollTop = 0;
      root.classList.add('all-open');
      if (lenis) lenis.stop();
      // Only the view is reachable while it is open.
      outside = Array.prototype.filter.call(document.body.children, function (el) {
        return el !== view && el.tagName !== 'SCRIPT' && !el.inert && !el.classList.contains('cs-layer') && !el.classList.contains('cs-lightbox');
      });
      outside.forEach(function (el) { el.inert = true; });
      if (!reduceMotion && view.animate) {
        view.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      }
      var title = document.getElementById('all-title');
      if (title) title.focus({ preventScroll: true });
    }
    function hide() {
      if (view.hidden) return;
      var done = function () {
        view.hidden = true;
        root.classList.remove('all-open');
        outside.forEach(function (el) { el.inert = false; });
        outside = [];
        if (lenis && !root.classList.contains('cs-open')) lenis.start();
        if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
      };
      if (!reduceMotion && view.animate) view.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease' }).finished.then(done, done);
      else done();
    }
    function back() {
      if (pushed) { pushed = false; history.back(); }
      else { history.replaceState(null, '', location.pathname + location.search); hide(); }
    }

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href="' + ALL + '"], [data-all-back]');
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
      e.preventDefault();
      if (link.hasAttribute('data-all-back')) { back(); return; }
      history.pushState({ allProjects: true }, '', ALL);
      pushed = true;
      show(true);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !view.hidden && !root.classList.contains('cs-open')) { e.preventDefault(); back(); }
    });
    // The URL is the source of truth. A case study opened from this view
    // keeps it open underneath (#project/...); anything else closes it.
    function route() {
      if (location.hash === ALL) show(false);
      else if (location.hash.indexOf('#project/') !== 0) { pushed = false; hide(); }
    }
    window.addEventListener('popstate', route);
    window.addEventListener('hashchange', route);
    if (location.hash === ALL) show(false);
  })();

  /* ---------- 8. Scroll animation (GSAP + ScrollTrigger) ---------- */
  if (!hasGsap || reduceMotion) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  var rise = tokenNumber('--reveal-rise', 28);
  var duration = tokenNumber('--reveal-duration', 0.9);
  var stagger = tokenNumber('--reveal-stagger', 0.1);

  // Headings and text fade and rise as they arrive.
  gsap.set('[data-reveal]', { y: rise });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { opacity: 1, y: 0, duration: duration, stagger: 0.08, ease: 'power3.out', clearProps: 'transform' });
    }
  });

  // Project cards come in one after another.
  gsap.set('[data-card]', { y: rise * 1.5 });
  ScrollTrigger.batch('[data-card]', {
    start: 'top 90%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { opacity: 1, y: 0, duration: duration, stagger: stagger, ease: 'power3.out', clearProps: 'transform' });
    }
  });

  // Recalculate once fonts and images have settled.
  window.addEventListener('load', function () { ScrollTrigger.refresh(); onScroll(); });
})();
