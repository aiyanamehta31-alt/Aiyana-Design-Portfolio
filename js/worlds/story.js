/* =====================================================================
   STORY · a calm, one-page case study, built from blocks
   (2026-11-25; the same approach as the Nexo rebuild, made reusable)

   A project with world: 'story' gives:
     theme     { tone, glider }   its colours live in css/worlds/story.css
                                  under .st--<tone>
     top       { title, line, tags, film: { src, poster, caption }, facts }
     sections  [{ id, nav, heading, text, blocks: [...] }]
   Block types:
     p        { text }
     box      { tone: red|yellow, label, big, small }
     cards    { cols, label, numbered, items: [{ title, text }] }
     chips    { label, items: [text] }
     list     { label, numbered, items: [{ title, text }] }
     stats    { items: [{ n, label }], source }
     compare  { label, items: [{ title, sub, text, bad }] }
     tagline  { text, translation, note }
     swatches { items: [{ hex, name, text }] }
     fonts    { items: [{ family, name, use, sample }] }
     pics     { layout: 2|3|4|wide|narrow, label, items: [img] }
     fails    { items: [{ title, what, learned, images }] }
     timeline { label, items: [{ when, title, text }] }
     loop     { label, items: [{ name, plain, text }], note }   a cycle of steps
     pipeline { label, example, items: [{ step, what, by, ai, out }] }
     fixes    { label, items: [{ title, broke, fix }] }
     widget   { name, ... }   a live piece from window.STORY_WIDGETS[name]
                              (its script goes in the project's `scripts`)
   top can also carry `image` (a hero picture) instead of `film`.
   img = { src, width, height, alt, caption (shown under it), note (handwritten) }
   Nothing moves except a gentle rise as blocks come in, and the glider.
   ===================================================================== */
(function () {
  'use strict';
  var worlds = window.CASE_WORLDS = window.CASE_WORLDS || {};

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(v) { return esc(v).replace(/\[NEEDS FROM AIYANA[^\]]*\]/g, function (m) { return '<mark class="st-needs">' + m + '</mark>'; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var P = null;
  function src(name) { return esc(/^(assets|https?:)/.test(name) ? name : P.images + name); }

  function img(i, eager) {
    return '<img src="' + src(i.src) + '" width="' + i.width + '" height="' + i.height + '" alt="' + esc(i.alt || '') + '"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async" />';
  }
  function pic(i, group) {
    return '<figure class="st-pic">' +
      '<button type="button" class="st-zoom" data-zoom data-group="' + esc(group) + '" data-caption="' + esc(i.caption || i.note || i.alt || '') + '">' +
        '<span class="sr-only">Open larger: </span>' + img(i) + '</button>' +
      (i.caption ? '<figcaption class="st-cap">' + rich(i.caption) + '</figcaption>' : '') +
      (i.note ? '<figcaption class="st-note">' + rich(i.note) + '</figcaption>' : '') +
    '</figure>';
  }
  function label(t) { return t ? '<h4 class="st-h4">' + esc(t) + '</h4>' : ''; }

  /* ---------- Blocks ---------- */
  var B = {
    p: function (b) { return '<p class="st-p st-p--solo">' + rich(b.text) + '</p>'; },
    box: function (b) {
      return '<div class="st-box st-box--' + esc(b.tone || 'yellow') + '">' + (b.label ? '<p class="st-box__label">' + esc(b.label) + '</p>' : '') +
        '<p class="st-box__big">' + rich(b.big) + '</p>' + (b.small ? '<p class="st-box__small">' + rich(b.small) + '</p>' : '') + '</div>';
    },
    cards: function (b) {
      return '<div>' + label(b.label) + '<ul class="st-cards st-cards--' + (b.cols || 3) + '">' + b.items.map(function (c, k) {
        return '<li>' + (b.numbered ? '<span class="st-cards__n">' + pad(k + 1) + '</span>' : '') + '<strong>' + rich(c.title) + '</strong><span>' + rich(c.text) + '</span></li>';
      }).join('') + '</ul></div>';
    },
    chips: function (b) {
      return '<div>' + label(b.label) + '<ul class="st-chips' + (b.tone ? ' st-chips--' + esc(b.tone) : '') + '">' + b.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    },
    list: function (b) {
      return '<div>' + label(b.label) + '<ol class="st-list' + (b.numbered ? ' is-numbered' : '') + '">' + b.items.map(function (it, k) {
        return '<li>' + (b.numbered ? '<span class="st-list__n">' + (k + 1) + '</span>' : '') + '<div><strong>' + rich(it.title) + '</strong><span>' + rich(it.text) + '</span></div></li>';
      }).join('') + '</ol></div>';
    },
    stats: function (b) {
      return '<div><ul class="st-stats">' + b.items.map(function (s) {
        return '<li><span class="st-stats__n">' + esc(s.n) + '</span><span class="st-stats__l">' + rich(s.label) + '</span></li>';
      }).join('') + '</ul>' + (b.source ? '<p class="st-source">' + esc(b.source) + '</p>' : '') + '</div>';
    },
    compare: function (b) {
      return '<div>' + label(b.label) + '<ul class="st-compare">' + b.items.map(function (c, k) {
        return (k ? '<li class="st-compare__arrow" aria-hidden="true">→</li>' : '') +
          '<li class="st-compare__item' + (c.bad ? ' is-from' : ' is-to') + '"><strong>' + esc(c.title) + '</strong><em>' + esc(c.sub) + '</em><span>' + rich(c.text) + '</span></li>';
      }).join('') + '</ul></div>';
    },
    tagline: function (b) {
      return '<div class="st-tagline"><p class="st-tagline__fr" lang="fr">' + esc(b.text) + '</p><p class="st-tagline__en">' + esc(b.translation) + '</p>' +
        (b.note ? '<p class="st-tagline__note">' + rich(b.note) + '</p>' : '') + '</div>';
    },
    swatches: function (b) {
      return '<div>' + label(b.label || 'Colour') + '<ul class="st-swatches">' + b.items.map(function (s) {
        return '<li><span class="st-swatches__chip" style="background:' + esc(s.hex) + '"></span><strong>' + esc(s.name) + '</strong><code>' + esc(s.hex) + '</code><span>' + rich(s.text) + '</span></li>';
      }).join('') + '</ul></div>';
    },
    fonts: function (b) {
      return '<div>' + label(b.label || 'Type') + '<ul class="st-fonts">' + b.items.map(function (f) {
        return '<li><span class="st-fonts__aa" style="font-family:' + esc(f.family) + '">Aa</span><div><strong>' + esc(f.name) + '</strong><span>' + esc(f.use) + '</span>' +
          '<p class="st-fonts__sample" style="font-family:' + esc(f.family) + '" lang="fr">' + esc(f.sample) + '</p></div></li>';
      }).join('') + '</ul></div>';
    },
    pics: function (b, group) {
      return '<div>' + label(b.label) + '<div class="st-pics st-pics--' + esc(b.layout || '2') + '">' + b.items.map(function (i) { return pic(i, group); }).join('') + '</div></div>';
    },
    fails: function (b, group) {
      return '<ol class="st-fails">' + b.items.map(function (f) {
        return '<li class="st-fail"><div class="st-fail__media st-fail__media--' + f.images.length + '">' + f.images.map(function (i) { return pic(i, group); }).join('') + '</div>' +
          '<div class="st-fail__text"><h4 class="st-h4">' + esc(f.title) + '</h4><p class="st-p">' + rich(f.what) + '</p>' +
          '<p class="st-fail__learned"><span>What we learned</span>' + rich(f.learned) + '</p></div></li>';
      }).join('') + '</ol>';
    },
    timeline: function (b) {
      return '<div>' + label(b.label) + '<ol class="st-timeline">' + b.items.map(function (t) {
        return '<li><span class="st-timeline__when">' + esc(t.when) + '</span>' + (t.title ? '<strong>' + esc(t.title) + '</strong>' : '') + '<span>' + rich(t.text) + '</span></li>';
      }).join('') + '</ol></div>';
    },
    // A loop of steps that comes back to the start.
    loop: function (b) {
      return '<div>' + label(b.label) + '<ol class="st-loop">' + b.items.map(function (s, k) {
        return '<li><span class="st-loop__n">' + (k + 1) + '</span><strong>' + esc(s.name) + '</strong>' + (s.plain ? '<em>' + esc(s.plain) + '</em>' : '') + '<span>' + rich(s.text) + '</span></li>';
      }).join('') + '</ol>' + (b.note ? '<p class="st-loop__back"><span aria-hidden="true">↺</span> ' + rich(b.note) + '</p>' : '') + '</div>';
    },
    // Steps in a row, each marked as done by an AI model or by plain code.
    pipeline: function (b) {
      return '<div>' + label(b.label) + (b.example ? '<p class="st-pipe__ex">“' + esc(b.example) + '”</p>' : '') + '<ol class="st-pipe">' + b.items.map(function (s) {
        return '<li class="' + (s.ai ? 'is-ai' : 'is-code') + '"><span class="st-pipe__by">' + (s.ai ? 'AI model' : 'Plain code') + '</span><strong>' + esc(s.step) + '</strong><span>' + rich(s.what) + '</span>' +
          '<code>' + esc(s.by) + '</code>' + (s.out ? '<span class="st-pipe__out">' + esc(s.out) + '</span>' : '') + '</li>';
      }).join('') + '</ol></div>';
    },
    // What broke, and the fix.
    fixes: function (b) {
      return '<div>' + label(b.label) + '<ul class="st-fixes">' + b.items.map(function (f) {
        return '<li><strong>' + esc(f.title) + '</strong><p class="st-fixes__broke"><span>What broke</span>' + rich(f.broke) + '</p><p class="st-fixes__fix"><span>The fix</span>' + rich(f.fix) + '</p></li>';
      }).join('') + '</ul></div>';
    },
    // A live piece of a project, from window.STORY_WIDGETS (loaded by the project's scripts).
    widget: function (b) {
      var w = window.STORY_WIDGETS && window.STORY_WIDGETS[b.name];
      return '<div data-widget="' + esc(b.name) + '">' + (w ? w.html(b) : '') + '</div>';
    }
  };

  /* ---------- Page ---------- */
  function topHTML(p) {
    var t = p.top, f = t.film;
    return '<section class="cs-section st-top" id="cs-cover" data-tone="' + esc(p.theme.tone) + '" aria-labelledby="cs-title"><div class="st-col">' +
      '<h2 class="st-title" id="cs-title" tabindex="-1">' + esc(t.title) + '</h2>' +
      '<p class="st-lead">' + rich(t.line) + '</p>' +
      '<ul class="st-tags" aria-label="What the project covers">' + t.tags.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      (f ? '<figure class="st-film" data-st-film data-src="' + src(f.src) + '"><div class="st-film__frame">' + img(f.poster, true) +
        '<button type="button" class="st-film__play" data-st-play><span class="st-film__icon" aria-hidden="true"></span><span>Play the video</span></button></div>' +
        (f.caption ? '<figcaption class="st-note">' + esc(f.caption) + '</figcaption>' : '') + '</figure>' : '') +
      (t.image ? '<figure class="st-hero">' + img(t.image, true) + (t.image.note ? '<figcaption class="st-note">' + rich(t.image.note) + '</figcaption>' : '') + '</figure>' : '') +
      '<dl class="st-facts">' + t.facts.map(function (x) { return '<div><dt>' + esc(x.label) + '</dt><dd>' + rich(x.value) + '</dd></div>'; }).join('') + '</dl>' +
    '</div></section>';
  }
  function sectionHTML(p, s) {
    return '<section class="cs-section st-s st-s--' + esc(s.id) + '" id="st-' + esc(s.id) + '" data-tone="' + esc(p.theme.tone) + '" aria-labelledby="st-h-' + esc(s.id) + '"><div class="st-col">' +
      '<header class="st-head st-rise"><h3 class="st-h" id="st-h-' + esc(s.id) + '" tabindex="-1">' + esc(s.heading) + '</h3>' +
        (s.text ? '<p class="st-p">' + rich(s.text) + '</p>' : '') + '</header>' +
      (s.blocks || []).map(function (b) { return '<div class="st-block st-block--' + esc(b.type) + ' st-rise">' + (B[b.type] ? B[b.type](b, s.id) : '') + '</div>'; }).join('') +
    '</div></section>';
  }
  function nextHTML(p) {
    var n = p.next;
    return '<section class="cs-section st-next" id="cs-next" data-tone="' + esc(p.theme.tone) + '" aria-label="Next project"><div class="st-col">' +
      (n ? '<a class="st-next__link" href="#project/' + esc(n.slug) + '"><span>Next project</span><strong>' + esc(n.title) + ' →</strong></a>' : '') +
      '<a class="st-next__back" href="#work" data-cs-back>Back to all work</a></div></section>';
  }
  function render(p) {
    P = p;
    var html = '<div class="st st--' + esc(p.theme.tone) + '" data-st>' + topHTML(p) + p.sections.map(function (s) { return sectionHTML(p, s); }).join('') + nextHTML(p) + '</div>';
    P = null;
    return html;
  }

  /* ---------- Mount ---------- */
  function mount(ctx) {
    var p = ctx.project, scroller = ctx.scroller, sheet = ctx.sheet, reduce = ctx.reduceMotion;
    var box = ctx.content.querySelector('[data-st]');
    var cleanups = [];
    function on(el, type, fn, opt) { el.addEventListener(type, fn, opt); cleanups.push(function () { el.removeEventListener(type, fn, opt); }); }
    sheet.classList.add('st-sheet', 'st-sheet--' + p.theme.tone);
    cleanups.push(function () { sheet.classList.remove('st-sheet', 'st-sheet--' + p.theme.tone); });

    var rises = box.querySelectorAll('.st-rise');
    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(rises, function (el) { el.classList.add('is-in'); });
    } else {
      box.classList.add('is-motion');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { root: scroller, rootMargin: '0px 0px -8% 0px' });
      Array.prototype.forEach.call(rises, function (el) { io.observe(el); });
      cleanups.push(function () { io.disconnect(); });
    }

    // The video at the top: its still and a play button, until pressed.
    var film = box.querySelector('[data-st-film]');
    if (film) {
      on(film.querySelector('[data-st-play]'), 'click', function () {
        var frame = film.querySelector('.st-film__frame');
        var v = document.createElement('video');
        v.className = 'st-film__video';
        v.src = film.getAttribute('data-src');
        v.controls = true;
        v.playsInline = true;
        v.poster = frame.querySelector('img').getAttribute('src');
        frame.innerHTML = '';
        frame.appendChild(v);
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function () {});
        v.focus();
      });
    }

    // Live pieces (the Wiglet demo), each given its block's settings.
    var blocks = [];
    p.sections.forEach(function (s) { (s.blocks || []).forEach(function (b) { if (b.type === 'widget') blocks.push(b); }); });
    var refreshGlider = function () { if (glider) glider.refresh(); };
    Array.prototype.forEach.call(box.querySelectorAll('[data-widget]'), function (el, k) {
      var w = window.STORY_WIDGETS && window.STORY_WIDGETS[el.getAttribute('data-widget')];
      if (!w || !blocks[k]) return;
      var inst = w.mount(el, blocks[k], { scroller: scroller, reduceMotion: reduce, refresh: function () { refreshGlider(); } });
      if (inst && inst.destroy) cleanups.push(inst.destroy);
    });

    var glider = window.CaseGlider ? window.CaseGlider({
      sheet: sheet, scroller: scroller, content: ctx.content, lenis: ctx.lenis, reduceMotion: reduce,
      cls: 'st-glider ' + (p.theme.glider || ''), label: p.title + ', part by part',
      offset: function () { return (parseFloat(getComputedStyle(sheet).getPropertyValue('--cs-bar-h')) || 60) + 16; },
      items: [{ name: 'Overview', el: box.querySelector('#cs-cover'), focus: box.querySelector('#cs-title') }].concat(p.sections.map(function (s) {
        return { name: s.nav || s.heading, el: box.querySelector('#st-' + s.id), focus: box.querySelector('#st-h-' + s.id) };
      }))
    }) : null;
    if (glider) cleanups.push(glider.destroy);

    return {
      refresh: function () { if (glider) glider.refresh(); },
      destroy: function () { cleanups.forEach(function (fn) { fn(); }); }
    };
  }

  worlds.story = {
    css: 'css/worlds/story.css',
    fonts: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Caveat:wght@500;600&display=swap',
    // A project's own classic scripts (the Wiglet demo and its scheduler), in order.
    scripts: function (p) { return p.scripts || []; },
    render: render,
    mount: mount,
    ownTones: true
  };
})();
