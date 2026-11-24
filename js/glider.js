/* =====================================================================
   GLIDER · a project's parts down the left margin of the case-study sheet,
   with a rail and a glider that follows the story.
   Used by the project worlds (journey for Branding and Maggi, Wiglet,
   Codes); each world styles it in its own look through its class.
   Nexo has its own version of the same idea in js/worlds/nexo.js.

     var g = window.CaseGlider({
       sheet, scroller, lenis, reduceMotion,
       cls: 'jr-glider',                 // the world's styling hook
       label: 'Maggi, part by part',     // for screen readers
       items: [{ name, sub, el, focus, colour }],
       offset: function () { return 84; } // space to leave above a part when landing
     });
     g.refresh();  g.destroy();

   Click a part: glide there and focus its heading. Drag the glider, or press
   anywhere on the rail: scrub straight through. A part counts as reached
   once its top crosses 62% of the sheet. Shown only where the world's CSS
   shows it (wide screens); measuring is skipped while hidden.
   ===================================================================== */
(function () {
  'use strict';
  var READ = 0.62;

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  window.CaseGlider = function (o) {
    var sheet = o.sheet, scroller = o.scroller, items = o.items.filter(function (it) { return it && it.el; });
    var cleanups = [];
    function on(el, type, fn, opts) { el.addEventListener(type, fn, opts); cleanups.push(function () { el.removeEventListener(type, fn, opts); }); }

    var nav = document.createElement('nav');
    nav.className = 'glider ' + (o.cls || '');
    nav.setAttribute('aria-label', o.label || 'Parts of this project');
    nav.innerHTML = '<div class="glider__rail" aria-hidden="true"><span class="glider__line"></span><span class="glider__fill"></span><span class="glider__knob"></span></div>' +
      '<ol>' + items.map(function (it, i) {
        return '<li><a href="#" data-glide="' + i + '"><span class="glider__n">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
          '<span class="glider__t">' + esc(it.name) + (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</span></a></li>';
      }).join('') + '</ol>';
    sheet.appendChild(nav);
    cleanups.push(function () { nav.remove(); });

    var rail = nav.querySelector('.glider__rail');
    var knob = nav.querySelector('.glider__knob');
    var fill = nav.querySelector('.glider__fill');
    var links = Array.prototype.slice.call(nav.querySelectorAll('[data-glide]'));
    var G = { on: false, S: [], go: [], Y: [], top: 0, len: 1, cur: -1 };

    function offset() { return o.offset ? o.offset() : 84; }
    function measure() {
      G.on = nav.offsetParent !== null;
      if (!G.on) return;
      var base = scroller.scrollTop, top = scroller.getBoundingClientRect().top;
      var max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      var last = 0;
      G.go = []; G.S = [];
      items.forEach(function (it, i) {
        var abs = base + it.el.getBoundingClientRect().top - top;
        G.go.push(i === 0 ? 0 : Math.min(max, Math.max(0, abs - offset())));
        last = i === 0 ? 0 : Math.min(max, Math.max(last + 1, abs - scroller.clientHeight * READ));
        G.S.push(last);
      });
      G.S.push(Math.max(max, last + 1));
      var railTop = rail.getBoundingClientRect().top;
      G.Y = links.map(function (a) { var r = a.querySelector('.glider__n').getBoundingClientRect(); return r.top + r.height / 2 - railTop; });
      var n = G.Y.length;
      G.Y.push(G.Y[n - 1] + (n > 1 ? (G.Y[n - 1] - G.Y[n - 2]) * 0.6 : 24));
      G.top = G.Y[0];
      G.len = Math.max(1, G.Y[G.Y.length - 1] - G.top);
      rail.style.setProperty('--rail-top', G.top.toFixed(1) + 'px');
      rail.style.setProperty('--rail-len', G.len.toFixed(1) + 'px');
      G.cur = -1;
      update();
    }
    // Scroll position <-> place on the rail, part by part.
    function between(v, A, B) {
      for (var i = 0; i < A.length - 1; i++) {
        if (v < A[i + 1] || i === A.length - 2) {
          var t = Math.min(1, Math.max(0, (v - A[i]) / ((A[i + 1] - A[i]) || 1)));
          return B[i] + t * (B[i + 1] - B[i]);
        }
      }
      return B[0];
    }
    function update() {
      if (!G.on) return;
      var s = scroller.scrollTop;
      var y = between(s, G.S, G.Y);
      knob.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
      fill.style.transform = 'scaleY(' + Math.min(1, Math.max(0, (y - G.top) / G.len)).toFixed(4) + ')';
      var cur = 0;
      for (var i = 0; i < items.length; i++) if (s >= G.S[i] - 1) cur = i;
      if (cur === G.cur) return;
      G.cur = cur;
      links.forEach(function (a, k) { if (k === cur) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current'); });
      if (items[cur].colour) nav.style.setProperty('--glider-c', items[cur].colour); else nav.style.removeProperty('--glider-c');
    }

    function glideTo(y) {
      if (o.lenis) o.lenis.scrollTo(y, { duration: 1.2 });
      else scroller.scrollTo({ top: y, behavior: o.reduceMotion ? 'auto' : 'smooth' });
    }
    on(nav, 'click', function (e) {
      var a = e.target.closest('[data-glide]');
      if (!a) return;
      e.preventDefault();
      var i = Number(a.getAttribute('data-glide'));
      glideTo(G.go[i]);
      var f = items[i].focus || items[i].el;
      if (f) { if (!f.hasAttribute('tabindex')) f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
    });

    var dragging = false;
    function scrubTo(clientY) {
      var s = between(clientY - rail.getBoundingClientRect().top, G.Y, G.S);
      if (o.lenis) o.lenis.scrollTo(s, { immediate: true, force: true });
      else scroller.scrollTop = s;
    }
    on(rail, 'pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true;
      nav.classList.add('is-dragging');
      rail.setPointerCapture(e.pointerId);
      scrubTo(e.clientY);
      e.preventDefault();
    });
    on(rail, 'pointermove', function (e) { if (dragging) scrubTo(e.clientY); });
    function endDrag() { dragging = false; nav.classList.remove('is-dragging'); }
    on(rail, 'pointerup', endDrag);
    on(rail, 'pointercancel', endDrag);

    var raf = 0;
    on(scroller, 'scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; update(); });
    }, { passive: true });

    // Re-measure when anything changes size (images arriving, the window, fonts).
    var timer = 0;
    function refresh() { clearTimeout(timer); timer = setTimeout(measure, 150); }
    on(window, 'resize', refresh);
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(refresh);
      ro.observe(scroller);
      var inner = o.content || scroller.firstElementChild;
      if (inner) ro.observe(inner);
      cleanups.push(function () { ro.disconnect(); });
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    requestAnimationFrame(measure);

    return {
      refresh: refresh,
      destroy: function () {
        clearTimeout(timer);
        if (raf) cancelAnimationFrame(raf);
        cleanups.forEach(function (fn) { fn(); });
      }
    };
  };
})();
