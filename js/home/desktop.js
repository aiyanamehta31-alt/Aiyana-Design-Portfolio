/* =====================================================================
   ABOUT · Aiyana's desktop
   Frosted widgets on the storm-sea wallpaper. Drag a widget by its bar, or
   focus its grip button and use the arrow keys (Shift for bigger steps).
   "Straighten up" puts every widget back. The dock brings a widget forward;
   Resume downloads the PDF. Phones (≤ 860px) get a plain column, no dragging.
   The storm mixer itself lives in js/home/storm.js.
   ===================================================================== */
(function () {
  'use strict';

  var STEP = 16;            // px per arrow key press (Shift: ×3)
  var DOCK_SPACE = 84;      // keep widgets clear of the dock

  var desk = document.querySelector('[data-desk]');
  if (!desk) return;
  var screen = desk.querySelector('[data-screen]');
  var widgets = Array.prototype.slice.call(desk.querySelectorAll('[data-widget]'));
  var live = desk.querySelector('[data-desk-live]');
  var narrowQuery = window.matchMedia('(max-width: 860px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function say(text) { live.textContent = ''; setTimeout(function () { live.textContent = text; }, 30); }
  function nameOf(w) { return w.querySelector('.widget__title').textContent; }
  function front(w) { widgets.forEach(function (x) { x.classList.toggle('is-front', x === w); }); }

  /* ---------- Moving widgets ---------- */
  function place(w, x, y) {
    var maxX = screen.clientWidth - w.offsetWidth;
    var maxY = screen.clientHeight - w.offsetHeight - DOCK_SPACE;
    w.style.left = Math.round(Math.max(0, Math.min(maxX, x))) + 'px';
    w.style.top = Math.round(Math.max(0, Math.min(maxY, y))) + 'px';
  }

  var drag = null;
  widgets.forEach(function (w) {
    var bar = w.querySelector('.widget__bar');
    var grip = w.querySelector('[data-grip]');

    bar.addEventListener('pointerdown', function (e) {
      if (narrowQuery.matches || e.button > 0) return;
      e.preventDefault();
      front(w);
      drag = { w: w, id: e.pointerId, dx: e.clientX - w.offsetLeft, dy: e.clientY - w.offsetTop };
      bar.setPointerCapture(e.pointerId);
      w.classList.add('is-dragging');
    });
    bar.addEventListener('pointermove', function (e) {
      if (!drag || drag.w !== w || drag.id !== e.pointerId) return;
      place(w, e.clientX - drag.dx, e.clientY - drag.dy);
    });
    function end(e) {
      if (!drag || drag.w !== w) return;
      drag = null;
      w.classList.remove('is-dragging');
      if (bar.hasPointerCapture && bar.hasPointerCapture(e.pointerId)) bar.releasePointerCapture(e.pointerId);
    }
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);

    // Keyboard: the grip moves its widget.
    grip.addEventListener('keydown', function (e) {
      var k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
      if (!k || narrowQuery.matches) return;
      e.preventDefault();
      var step = e.shiftKey ? STEP * 3 : STEP;
      front(w);
      place(w, w.offsetLeft + k[0] * step, w.offsetTop + k[1] * step);
      say(nameOf(w) + ' moved');
    });
    grip.addEventListener('click', function () { front(w); });
    w.addEventListener('pointerdown', function () { front(w); });
  });

  // "Straighten up": every widget glides back to its own place.
  var tidyTimer = 0;
  desk.querySelector('[data-tidy]').addEventListener('click', function () {
    desk.classList.add('is-tidying');
    widgets.forEach(function (w) { w.style.left = ''; w.style.top = ''; });
    clearTimeout(tidyTimer);
    tidyTimer = setTimeout(function () { desk.classList.remove('is-tidying'); }, 700);
    say('Widgets put back in place');
  });

  // Keep moved widgets on screen when the window changes size.
  window.addEventListener('resize', function () {
    if (narrowQuery.matches) return;
    widgets.forEach(function (w) { if (w.style.left) place(w, w.offsetLeft, w.offsetTop); });
  });

  /* ---------- The dock ---------- */
  desk.querySelector('.dock').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-open]');
    if (!btn) return;
    var w = desk.querySelector('[data-widget="' + btn.getAttribute('data-open') + '"]');
    if (!w) return;
    front(w);
    if (narrowQuery.matches) w.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    w.classList.remove('is-called');
    void w.offsetWidth;
    w.classList.add('is-called');
    w.focus({ preventScroll: !narrowQuery.matches });
  });

  /* ---------- Away from the desk: a photo stack ---------- */
  var stack = desk.querySelector('[data-stack]');
  if (stack) {
    var list = stack.querySelector('.stack__photos');
    var caption = desk.querySelector('[data-stack-caption]');
    var total = list.children.length;
    var shown = 1;
    var TILT = [-7, 5, -3, 1.5];
    function lay() {
      Array.prototype.forEach.call(list.children, function (li, i) {
        var fromTop = list.children.length - 1 - i;
        li.style.setProperty('--r', TILT[fromTop % TILT.length] + 'deg');
        li.style.setProperty('--dx', (fromTop * 3) + 'px');
        li.style.setProperty('--dy', (fromTop * 2) + 'px');
        li.classList.toggle('is-top', fromTop === 0);
      });
    }
    lay();
    var busy = false;
    stack.addEventListener('click', function () {
      if (busy) return;
      var top = list.lastElementChild;
      var done = function () {
        list.insertBefore(top, list.firstElementChild);
        stack.classList.remove('is-shuffling');
        lay();
        shown = shown % total + 1;
        caption.textContent = shown + ' of ' + total;
        busy = false;
      };
      if (reduce) { done(); return; }
      busy = true;
      stack.classList.add('is-shuffling');
      setTimeout(done, 380);
    });
  }

  /* ---------- The Wiglet blob (an easter egg) ---------- */
  var blob = desk.querySelector('[data-blob]');
  if (blob) {
    var blinkTimer = 0;
    var inView = false;
    function blink() {
      blinkTimer = setTimeout(function () {
        if (inView && !document.hidden) {
          blob.classList.add('is-blinking');
          setTimeout(function () { blob.classList.remove('is-blinking'); }, 150);
        }
        blink();
      }, 2600 + Math.random() * 2800);
    }
    if (!reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; }).observe(blob);
      blink();
    }
    blob.addEventListener('click', function () {
      blob.classList.remove('is-happy');
      void blob.offsetWidth;
      blob.classList.add('is-happy');
      say('The blob says hi');
    });
  }
})();
