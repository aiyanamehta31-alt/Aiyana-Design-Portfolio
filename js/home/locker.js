/* =====================================================================
   SKILLS · the locker
   A steel school locker. The padlock is a combination dial: drag it round
   (any full turn opens it), or just click it, or press Enter or Space.
   The door swings open, the strip light flickers on, the handwriting and
   doodles write themselves in, and the page glides down to the stage once.
   Inside: the pixel portrait, two handwritten lines, stickers on the door
   (drag them about; "Put back" returns them) and a shelf of skill objects.
   Content comes from js/skills-data.js (window.SKILLS_LOCKER).
   ===================================================================== */
(function () {
  'use strict';

  var SWING_MS = 900;       // the door
  var GLIDE_DELAY = 1500;   // after the door has finished opening
  var GLIDE_MS = 1700;

  var scene = document.querySelector('[data-locker-scene]');
  if (!scene) return;
  var locker = scene.querySelector('[data-locker]');
  var padlock = scene.querySelector('[data-padlock]');
  var dial = scene.querySelector('[data-dial]');
  var back = scene.querySelector('[data-door-back]');
  var putBack = scene.querySelector('[data-putback]');
  var live = scene.querySelector('[data-locker-live]');
  var data = window.SKILLS_LOCKER || {};
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(v) { return esc(v).replace(/\[NEEDS FROM AIYANA[^\]]*\]/g, function (m) { return '<mark class="needs">' + m + '</mark>'; }); }
  function say(t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 30); }

  /* ---------- Fit: the locker (and its open door) always fit the width ---------- */
  function fit() {
    var narrow = window.innerWidth <= 760;
    var openDeg = narrow ? 118 : 138;
    var w = 380, h = 620;
    // How far the open door reaches (its near edge looks bigger in perspective).
    var door = 360 * Math.abs(Math.cos(openDeg * Math.PI / 180)) * 1.3;
    var avail = Math.min(scene.clientWidth, 1200) - 24;
    var scale = Math.min(1, avail / (w + door + 20), (window.innerHeight - 120) / h);
    scale = Math.max(0.45, scale);
    scene.style.setProperty('--lk-scale', scale.toFixed(3));
    scene.style.setProperty('--lk-shift', (-(door / 2) / w).toFixed(3));
  }
  window.addEventListener('resize', fit);
  fit();

  /* ---------- The portrait ---------- */
  var poster = scene.querySelector('[data-portrait]');
  if (data.portrait) {
    var im = new Image();
    im.src = data.portrait;
    im.alt = 'A pixel-art portrait of Aiyana.';
    poster.insertBefore(im, poster.firstChild);
  } else {
    // Placeholder: a pixel silhouette, drawn on a 34 × 40 grid.
    var c = document.createElement('canvas');
    c.width = 34; c.height = 40;
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', 'Placeholder for Aiyana’s pixel portrait: a pixelated silhouette.');
    var g = c.getContext('2d');
    g.fillStyle = '#2C2E33'; g.fillRect(0, 0, 34, 40);
    g.fillStyle = '#3A3D44'; for (var y = 0; y < 40; y += 2) g.fillRect(0, y, 34, 1);
    g.fillStyle = '#111214';
    for (var yy = 0; yy < 40; yy++) for (var xx = 0; xx < 34; xx++) {
      var dx = xx - 17, head = (dx * dx) / 42 + ((yy - 15) * (yy - 15)) / 64 < 1;   // head
      var body = yy > 25 && Math.abs(dx) < 6 + (yy - 25) * 0.9;                      // shoulders
      if (head || body) g.fillRect(xx, yy, 1, 1);
    }
    poster.insertBefore(c, poster.firstChild);
  }

  /* ---------- The handwritten notes ---------- */
  Array.prototype.forEach.call(scene.querySelectorAll('[data-note]'), function (p) {
    p.innerHTML = rich((data.notes || {})[p.getAttribute('data-note')] || '');
  });
  if (data.title) scene.querySelector('.hand--title').textContent = data.title;

  /* ---------- Stickers on the inside of the door ---------- */
  // Default places (px on the 360 × 600 door), in order: the big one, then the tools.
  var HOME = [[60, 40, -4], [52, 170, -6], [148, 164, 5], [240, 176, -3], [64, 270, 4], [160, 276, -5], [252, 282, 6]];
  var BIG = '<svg class="sticker__big" viewBox="0 0 220 96" role="img" aria-label="AIYANA"><rect x="2" y="2" width="216" height="92" rx="22" fill="#1A1A1C"/>' +
    '<text x="110" y="64" text-anchor="middle" font-family="Funnel Display, sans-serif" font-weight="800" font-size="50" letter-spacing="2" fill="#E2B877" stroke="#1A1A1C" stroke-width="2" paint-order="stroke">AIYANA</text>' +
    '<text x="110" y="64" text-anchor="middle" font-family="Funnel Display, sans-serif" font-weight="800" font-size="50" letter-spacing="2" fill="none" stroke="#FFF4E2" stroke-width="1.2" opacity=".55" transform="translate(-2 -2)">AIYANA</text>' +
    '<circle cx="196" cy="24" r="5" fill="#E2B877"/><path d="M190 80c8 0 14-4 16-10" stroke="#E2B877" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  var stickers = [];
  function makeSticker(html, label, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'sticker';
    b.setAttribute('aria-label', label + ' sticker. Use the arrow keys to move it.');
    b.innerHTML = html;
    var home = HOME[i % HOME.length];
    b.style.setProperty('--r', home[2] + 'deg');
    b.dataset.home = home[0] + ',' + home[1];
    b.style.left = home[0] + 'px';
    b.style.top = home[1] + 'px';
    back.appendChild(b);
    stickers.push(b);
  }
  makeSticker(BIG, 'AIYANA', 0);
  (data.tools || []).forEach(function (t, i) {
    var inner = t.logo
      ? '<img class="sticker__logo" src="' + esc(t.logo) + '" alt="' + esc(t.name) + ' logo" draggable="false" />'
      : '<span class="sticker__name">' + esc(t.name) + '<small>Logo to come</small></span>';
    makeSticker(inner, t.name, i + 1);
  });

  var canDrag = function () { return finePointer && window.innerWidth > 760 && locker.classList.contains('is-open'); };
  function place(s, x, y) {
    var maxX = back.offsetWidth - s.offsetWidth, maxY = back.offsetHeight - s.offsetHeight - 120;
    s.style.left = Math.round(Math.max(0, Math.min(maxX, x))) + 'px';
    s.style.top = Math.round(Math.max(0, Math.min(maxY, y))) + 'px';
  }
  stickers.forEach(function (s) {
    var drag = null;
    s.addEventListener('pointerdown', function (e) {
      if (!canDrag() || e.button > 0) return;
      e.preventDefault();
      // The door is scaled and turned in 3D, so screen pixels are squeezed: scale them back.
      var r = back.getBoundingClientRect();
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, left: s.offsetLeft, top: s.offsetTop,
        kx: r.width / back.offsetWidth || 1, ky: r.height / back.offsetHeight || 1 };
      s.setPointerCapture(e.pointerId);
      s.classList.add('is-dragging');
    });
    s.addEventListener('pointermove', function (e) {
      if (!drag || drag.id !== e.pointerId) return;
      place(s, drag.left + (e.clientX - drag.x) / drag.kx, drag.top + (e.clientY - drag.y) / drag.ky);
      putBack.hidden = false;
    });
    function end() { if (!drag) return; drag = null; s.classList.remove('is-dragging'); }
    s.addEventListener('pointerup', end);
    s.addEventListener('pointercancel', end);
    s.addEventListener('keydown', function (e) {
      var k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (!k || !locker.classList.contains('is-open')) return;
      e.preventDefault();
      var step = e.shiftKey ? 30 : 10;
      place(s, s.offsetLeft + k[0] * step, s.offsetTop + k[1] * step);
      putBack.hidden = false;
    });
  });
  putBack.addEventListener('click', function () {
    stickers.forEach(function (s) {
      var h = s.dataset.home.split(',');
      s.style.transition = reduce ? 'none' : 'left 600ms var(--ease-out), top 600ms var(--ease-out), transform 300ms var(--ease-out)';
      s.style.left = h[0] + 'px';
      s.style.top = h[1] + 'px';
      setTimeout(function () { s.style.transition = ''; }, 650);
    });
    say('Stickers put back');
  });

  /* ---------- The padlock: click it, or spin the dial a full turn ---------- */
  var opened = false;
  var spin = null, total = 0, dialAngle = 0;
  function angleAt(e) {
    var r = dial.getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI;
  }
  padlock.addEventListener('pointerdown', function (e) {
    if (opened || e.button > 0) return;
    e.preventDefault();
    spin = { id: e.pointerId, last: angleAt(e), moved: 0 };
    padlock.setPointerCapture(e.pointerId);
  });
  padlock.addEventListener('pointermove', function (e) {
    if (!spin || spin.id !== e.pointerId) return;
    var a = angleAt(e), d = a - spin.last;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    spin.last = a;
    spin.moved += Math.abs(d);
    total += d;
    dialAngle += d;
    dial.style.transform = 'rotate(' + dialAngle.toFixed(1) + 'deg)';
    if (Math.abs(total) >= 360) { spin = null; open('dial'); }
  });
  padlock.addEventListener('pointerup', function () {
    if (!spin) return;
    var wasClick = spin.moved < 12;
    spin = null;
    if (wasClick) open('click');
  });
  padlock.addEventListener('pointercancel', function () { spin = null; });
  // Enter, Space (and a click without the pointer events) open it too.
  padlock.addEventListener('click', function () { open('click'); });

  /* ---------- Opening ---------- */
  function clunk() {
    var s = window.siteSound;
    if (!s || !s.on()) return;   // only if the visitor already turned sound on
    var ac = s.context(), out = s.output(), t = ac.currentTime;
    var o = ac.createOscillator(), og = ac.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(55, t + 0.18);
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(og).connect(out);
    o.start(t); o.stop(t + 0.32);
    var len = Math.round(ac.sampleRate * 0.12), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    var n = ac.createBufferSource(), f = ac.createBiquadFilter(), ng = ac.createGain();
    n.buffer = buf; f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 2; ng.gain.value = 0.35;
    n.connect(f).connect(ng).connect(out);
    n.start(t);
  }

  function open(how) {
    if (opened) return;
    opened = true;
    padlock.setAttribute('aria-disabled', 'true');
    padlock.tabIndex = -1;
    say('The locker is open');
    var first = scene.querySelector('.shelf__item');
    if (reduce) {
      locker.classList.add('is-open', 'is-lit', 'is-written');
      if (first) first.focus({ preventScroll: true });
      return;
    }
    locker.classList.add('is-open', 'is-swinging');
    setTimeout(clunk, SWING_MS * 0.82);
    setTimeout(function () { locker.classList.add('is-flickering'); }, SWING_MS * 0.55);
    setTimeout(function () { locker.classList.remove('is-flickering'); locker.classList.add('is-lit'); }, SWING_MS * 0.55 + 900);
    setTimeout(function () { locker.classList.add('is-written'); }, SWING_MS + 300);
    setTimeout(function () {
      locker.classList.remove('is-swinging');
      if (first) first.focus({ preventScroll: true });
    }, SWING_MS);
    // Once only: glide down to the stage, unless the visitor does anything first.
    glideTimer = setTimeout(function () { glideTo(document.getElementById('stage'), 'auto'); }, SWING_MS + GLIDE_DELAY);
  }

  /* ---------- The glide down (stops the moment the visitor scrolls, clicks or types) ---------- */
  var glideTimer = 0, gliding = null;
  function stopGlide() {
    clearTimeout(glideTimer);
    if (!gliding) return;
    gliding.stop();
    gliding = null;
  }
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (type) {
    window.addEventListener(type, function () { if (gliding || glideTimer) stopGlide(); }, { passive: true, capture: true });
  });
  function glideTo(el, why) {
    if (!el || reduce) return;
    glideTimer = 0;
    var header = document.querySelector('.site-header');
    var y = el.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 20;
    var lenis = window.portfolio && window.portfolio.lenis;
    if (lenis) {
      lenis.scrollTo(y, { duration: GLIDE_MS / 1000 });
      gliding = { stop: function () { lenis.stop(); lenis.start(); } };
      setTimeout(function () { gliding = null; }, GLIDE_MS + 50);
      return;
    }
    var from = window.scrollY, start = performance.now(), live = true;
    gliding = { stop: function () { live = false; } };
    (function step(now) {
      if (!live) return;
      var t = Math.min(1, (now - start) / GLIDE_MS);
      var e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo(0, from + (y - from) * e);
      if (t < 1) requestAnimationFrame(step); else gliding = null;
    })(start);
  }

  /* ---------- The shelf: each object takes you to its skill on the stage ---------- */
  scene.querySelector('.shelf').addEventListener('click', function (e) {
    var b = e.target.closest('[data-skill]');
    if (!b) return;
    stopGlide();
    window.dispatchEvent(new CustomEvent('skills:select', { detail: { slug: b.getAttribute('data-skill'), focus: true } }));
    // A direct click is the visitor's own choice, so it glides even if the auto-glide was stopped.
    setTimeout(function () {
      var stage = document.getElementById('stage');
      if (reduce) { stage.scrollIntoView(); return; }
      glideTo(stage, 'shelf');
    }, 0);
  });

  // Phones: the stickers stay put.
  if (!finePointer) stickers.forEach(function (s) { s.setAttribute('aria-label', s.getAttribute('aria-label').replace(' Use the arrow keys to move it.', '')); });
  root.classList.add('has-locker');
})();
