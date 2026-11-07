/* =====================================================================
   SKILLS GALLERIES · every piece of one skill, in the glass sheet
   #project/skills/<skill>. Each piece opens in the glass lightbox.
   The work comes from js/skills-data.js (window.SKILLS), so adding work
   to the stage adds it here too.
   ===================================================================== */
(function () {
  'use strict';
  var worlds = window.CASE_WORLDS = window.CASE_WORLDS || {};

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(v) { return esc(v).replace(/\[NEEDS FROM AIYANA[^\]]*\]/g, function (m) { return '<mark class="needs">' + m + '</mark>'; }); }
  function skillOf(slug) {
    var all = window.SKILLS || [];
    return all.filter(function (s) { return s.slug === slug; })[0] || all[0];
  }

  function galleryHTML(slug) {
    var all = window.SKILLS || [];
    var s = skillOf(slug);
    if (!s) return '';
    var i = all.indexOf(s);
    return '<section class="cs-section sk-world" id="cs-cover" data-tone="skills" aria-labelledby="cs-title"><div class="sk-wrap">' +
      '<p class="sk-label">Period ' + (i + 1) + '</p>' +
      '<h2 class="sk-title" id="cs-title" tabindex="-1">' + esc(s.name) + '</h2>' +
      '<nav class="sk-tabs" aria-label="Other skills">' + all.map(function (o, k) {
        return '<a class="sk-tab" href="#project/skills/' + esc(o.slug) + '"' + (o === s ? ' aria-current="page"' : '') + '><small>Period ' + (k + 1) + '</small>' + esc(o.name) + '</a>';
      }).join('') + '</nav>' +
      '<ul class="sk-grid">' + s.pieces.map(function (p) {
        var title = p.title.replace(/\[NEEDS FROM AIYANA[^\]]*\]/g, 'Placeholder');
        return '<li class="sk-piece">' +
          '<button type="button" class="sk-zoom" data-zoom data-group="skill" data-caption="' + esc(title) + '">' +
            '<span class="sr-only">Open larger: </span><img src="' + esc(p.still) + '" width="800" height="600" alt="' + esc(p.alt || '') + '" loading="lazy" decoding="async" /></button>' +
          (p.placeholder ? '<p class="sk-badge">Placeholder</p>' : '') +
          '<h3>' + rich(p.title) + '</h3><p>' + rich(p.line) + '</p>' +
          '<ul class="sk-tools">' + (p.tools || []).map(function (t) { return '<li>' + rich(t) + '</li>'; }).join('') + '</ul></li>';
      }).join('') + '</ul>' +
      '<p class="sk-note"><mark class="needs">[NEEDS FROM AIYANA: the work for this skill]</mark> Each piece also turns on the Skills stage on the homepage.</p>' +
      '<a class="sk-back" href="#skills" data-cs-back>Back to Skills</a>' +
    '</div></section>';
  }

  function render(p) { return '<div class="sk-root" data-sk-root>' + galleryHTML(null) + '</div>'; }

  function mount(ctx) {
    var box = ctx.content.querySelector('[data-sk-root]');
    function show(slug) {
      box.innerHTML = galleryHTML(slug);
      ctx.rescanZoom();
      ctx.measure();
      ctx.scroller.scrollTop = 0;
      var h = box.querySelector('#cs-title');
      if (h) h.focus({ preventScroll: true });
    }
    show(ctx.page);
    return { route: function (page) { show(page); }, destroy: function () {} };
  }

  worlds.skills = { css: 'css/worlds/skills.css', render: render, mount: mount };
})();
