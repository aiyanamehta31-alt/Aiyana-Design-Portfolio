/* =====================================================================
   HELLO · the intro's words light up, grey to white, as they scroll by
   Any [data-light-words] heading. Reduced motion: shown lit, no scrubbing.
   ===================================================================== */
(function () {
  'use strict';
  var heads = document.querySelectorAll('[data-light-words]');
  if (!heads.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var items = Array.prototype.map.call(heads, function (h) {
    var label = h.textContent.trim();
    h.setAttribute('aria-label', label);
    h.innerHTML = label.split(/\s+/).map(function (w) {
      return '<span class="lw" aria-hidden="true">' + w.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</span>';
    }).join(' ');
    return { el: h, words: h.querySelectorAll('.lw'), lit: -1 };
  });

  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    items.forEach(function (it) {
      var r = it.el.getBoundingClientRect();
      // From when the heading's top reaches 85% of the screen until it reaches 40%.
      var t = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.45)));
      var n = Math.round(t * it.words.length);
      if (n === it.lit) return;
      it.lit = n;
      Array.prototype.forEach.call(it.words, function (w, i) { w.classList.toggle('is-lit', i < n); });
    });
  }
  function ask() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', ask);
  update();
})();
