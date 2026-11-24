/* =====================================================================
   JOURNEY · a project that opens on the result, then plays the process
   Used by Maggi and Branding (world: 'journey' in projects/<slug>.js).

   1. The opener: the finished work, full screen, with the name and one line.
   2. A short intro and the facts.
   3. Numbered chapters (01, 02 …) beside a sticky index, each made of
      steps: a small label, a line or two, then images (full | pair | trio |
      grid), an optional video, swatches or a handwritten note.
   4. Next project and "Back to all work".

   Data shape (projects/<slug>.js):
     opener: { images: [img…], kicker, line }      img = { src, width, height, alt, caption }
     intro, facts: [{ label, value }], tags: []
     chapters: [{ id, title, lead, steps: [{ label, text, layout, images, video, swatches, note }] }]
   Branding builds its chapters from the brand files (window.BRANDS), so a
   brand's data stays in one place. Never invent facts: gaps are written
   [NEEDS FROM AIYANA: …] and show with a dashed outline.
   ===================================================================== */
(function () {
  'use strict';
  var worlds = window.CASE_WORLDS = window.CASE_WORLDS || {};

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(v) { return esc(v).replace(/\[(NEEDS FROM AIYANA|PLACEHOLDER)[^\]]*\]/g, function (m) { return '<mark class="needs">' + m + '</mark>'; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- Branding: chapters from the brand files ---------- */
  function brandChapters(p) {
    return (p.brands || []).map(function (slug) {
      var b = window.BRANDS && window.BRANDS[slug];
      if (!b) return null;
      function at(img) { return img && Object.assign({}, img, { src: b.images + img.src }); }
      var steps = [];
      var ex = (b.logo && b.logo.explorations) || [];
      steps.push({ label: 'Where it started', text: b.idea, layout: ex.length > 2 ? 'trio' : 'pair', images: ex.map(at),
        note: ex.length ? 'the marks that didn’t make it' : '' });
      if (b.logo && b.logo.primary && b.logo.primary.length) {
        steps.push({ label: 'The mark', layout: b.logo.primary.length > 1 ? 'pair' : 'full', fit: 'contain', images: b.logo.primary.map(at) });
      }
      if (b.colours && b.colours.length) steps.push({ label: 'Colour', swatches: b.colours });
      var gallery = (b.gallery || []).map(at);
      if (gallery.length) steps.push({ label: 'In the world', layout: 'grid', images: gallery });
      var context = (b.facts || []).filter(function (f) { return /Context/i.test(f.label); })[0];
      return { id: slug, title: b.name, kicker: b.category, lead: b.line, context: context && context.value, accent: b.theme && b.theme.accent, steps: steps };
    }).filter(Boolean);
  }
  function brandOpener(p) {
    var imgs = (p.brands || []).map(function (slug) {
      var b = window.BRANDS && window.BRANDS[slug];
      return b && b.hero && Object.assign({}, b.hero, { src: b.images + b.hero.src, caption: b.name });
    }).filter(Boolean);
    return { images: imgs, kicker: 'Brand identity', line: p.cover && p.cover.line };
  }

  /* ---------- Rendering ---------- */
  function img(p, i, group, opts) {
    opts = opts || {};
    var src = /^(assets|https?:)/.test(i.src) ? i.src : (p.images || '') + i.src;
    return '<figure class="jr-fig' + (opts.fit === 'contain' || i.fit === 'contain' ? ' is-contain' : '') + '">' +
      '<button type="button" class="jr-zoom" data-zoom data-group="' + esc(group) + '" data-caption="' + esc(i.caption || '') + '">' +
        '<span class="sr-only">Open larger: </span>' +
        '<img src="' + esc(src) + '" width="' + (i.width || 1200) + '" height="' + (i.height || 900) + '" alt="' + esc(i.alt || '') + '"' +
        (opts.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async" /></button>' +
      (i.caption && !opts.noCaption ? '<figcaption>' + rich(i.caption) + '</figcaption>' : '') + '</figure>';
  }

  function openerHTML(p, o) {
    var many = o.images.length > 1;
    return '<section class="jr-open' + (many ? ' jr-open--strip' : '') + '" id="cs-cover" data-tone="journey" aria-labelledby="cs-title">' +
      '<div class="jr-open__media" data-jr-open-media>' + o.images.map(function (i, k) {
        return '<div class="jr-open__panel" style="--k:' + k + '">' + img(p, i, 'opener', { eager: k < 2, noCaption: !many }) + '</div>';
      }).join('') + '</div>' +
      '<div class="jr-open__copy" data-jr-open-copy>' +
        (o.kicker ? '<p class="jr-label">' + rich(o.kicker) + '</p>' : '') +
        '<h2 class="jr-open__title" id="cs-title" tabindex="-1">' + esc(p.title) + '</h2>' +
        (o.line ? '<p class="jr-open__line">' + rich(o.line) + '</p>' : '') +
      '</div>' +
      '<p class="jr-open__cue" aria-hidden="true"><span>Scroll for the story</span><span class="jr-open__arrow">↓</span></p>' +
    '</section>';
  }

  function introHTML(p, chapters) {
    var facts = p.facts || [];
    var tags = p.tags || [];
    return '<section class="jr-intro" data-tone="journey" aria-label="About this project"><div class="jr-wrap">' +
      (p.intro ? '<p class="jr-intro__text jr-rise">' + rich(p.intro) + '</p>' : '') +
      (tags.length ? '<ul class="jr-tags jr-rise">' + tags.map(function (t) { return '<li>' + rich(t) + '</li>'; }).join('') + '</ul>' : '') +
      (facts.length ? '<dl class="jr-facts jr-rise">' + facts.map(function (f) {
        return '<div><dt>' + esc(f.label) + '</dt><dd>' + rich(f.value) + '</dd></div>';
      }).join('') + '</dl>' : '') +
      '<p class="jr-intro__count jr-rise">' + chapters.length + ' chapters, from the first step to the finished piece.</p>' +
    '</div></section>';
  }

  function stepHTML(p, s, group) {
    var media = '';
    if (s.images && s.images.length) {
      media = '<div class="jr-media jr-media--' + esc(s.layout || 'full') + '">' +
        s.images.map(function (i) { return img(p, i, group, { fit: s.fit }); }).join('') + '</div>';
    }
    if (s.video) {
      media += '<figure class="jr-video"><video src="' + esc((p.images || '') + s.video.src) + '" poster="' + esc((p.images || '') + s.video.poster) + '"' +
        ' width="' + s.video.width + '" height="' + s.video.height + '" muted loop playsinline preload="none" data-jr-video aria-label="' + esc(s.video.alt) + '"></video>' +
        (s.video.caption ? '<figcaption>' + rich(s.video.caption) + '</figcaption>' : '') + '</figure>';
    }
    if (s.swatches) {
      media += '<ul class="jr-swatches">' + s.swatches.map(function (c) {
        return '<li><span class="jr-swatch" style="background:' + esc(c.hex) + '"></span><span class="jr-swatch__name">' + esc(c.name) + '</span><code>' + esc(c.hex) + '</code></li>';
      }).join('') + '</ul>';
    }
    return '<div class="jr-step jr-rise">' +
      (s.label ? '<p class="jr-step__label">' + rich(s.label) + '</p>' : '') +
      (s.text ? '<p class="jr-step__text">' + rich(s.text) + '</p>' : '') +
      media +
      (s.note ? '<p class="jr-note" aria-hidden="true">' + esc(s.note) + '</p>' : '') +
    '</div>';
  }

  function chapterHTML(p, c, n) {
    return '<section class="jr-chapter" id="jr-' + esc(c.id) + '" data-tone="journey" data-jr-chapter="' + esc(c.id) + '" aria-labelledby="jr-t-' + esc(c.id) + '"' +
      (c.accent ? ' style="--jr-accent:' + esc(c.accent) + '"' : '') + '>' +
      '<header class="jr-chapter__head jr-rise">' +
        '<p class="jr-num">' + pad(n) + (c.kicker ? '<span>' + rich(c.kicker) + '</span>' : '') + '</p>' +
        '<h3 class="jr-chapter__title" id="jr-t-' + esc(c.id) + '">' + rich(c.title) + '</h3>' +
        (c.lead ? '<p class="jr-chapter__lead">' + rich(c.lead) + '</p>' : '') +
        (c.context ? '<p class="jr-chapter__context">' + rich(c.context) + '</p>' : '') +
      '</header>' +
      (c.steps || []).map(function (s) { return stepHTML(p, s, 'ch-' + c.id); }).join('') +
    '</section>';
  }

  function indexHTML(chapters) {
    return '<nav class="jr-index" aria-label="Chapters"><ol>' + chapters.map(function (c, i) {
      return '<li><a href="#jr-' + esc(c.id) + '" data-jr-jump="' + esc(c.id) + '"><span class="jr-index__n">' + pad(i + 1) + '</span><span class="jr-index__t">' + esc(c.title.replace(/\[[^\]]*\]/g, '…')) + '</span></a></li>';
    }).join('') + '</ol></nav>';
  }

  function nextHTML(p) {
    var n = p.next;
    return '<section class="jr-next" id="cs-next" data-tone="journey" aria-label="Next project"><div class="jr-wrap">' +
      (n ? '<a class="jr-next__link" href="#project/' + esc(n.slug) + '"><span class="jr-label">Next project</span><span class="jr-next__title">' + esc(n.title) + ' <span aria-hidden="true">→</span></span></a>' : '') +
      '<a class="jr-next__back" href="#work" data-cs-back>Back to all work</a>' +
    '</div></section>';
  }

  function parts(p) {
    var chapters = p.brands ? brandChapters(p) : (p.chapters || []);
    var opener = p.brands ? brandOpener(p) : (p.opener || { images: [] });
    return { chapters: chapters, opener: opener };
  }

  function render(p) {
    var x = parts(p);
    return '<div class="jr" data-jr>' + openerHTML(p, x.opener) + introHTML(p, x.chapters) +
      '<div class="jr-body">' + indexHTML(x.chapters) +
        '<div class="jr-chapters">' + x.chapters.map(function (c, i) { return chapterHTML(p, c, i + 1); }).join('') + '</div>' +
      '</div>' + nextHTML(p) + '</div>';
  }

  /* ---------- Motion ---------- */
  function mount(ctx) {
    var scroller = ctx.scroller;
    var box = ctx.content.querySelector('[data-jr]');
    var cleanups = [];
    function on(el, type, fn, opt) { el.addEventListener(type, fn, opt); cleanups.push(function () { el.removeEventListener(type, fn, opt); }); }

    // Reveals: each step rises once as it comes in.
    var rises = box.querySelectorAll('.jr-rise');
    if (ctx.reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(rises, function (el) { el.classList.add('is-in'); });
    } else {
      box.classList.add('jr-motion');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { root: scroller, rootMargin: '0px 0px -12% 0px' });
      Array.prototype.forEach.call(rises, function (el) { io.observe(el); });
      cleanups.push(function () { io.disconnect(); });
    }

    // The index follows the chapter that holds the middle of the screen.
    var links = box.querySelectorAll('[data-jr-jump]');
    var chapters = box.querySelectorAll('[data-jr-chapter]');
    function setCurrent(id) {
      Array.prototype.forEach.call(links, function (a) {
        if (a.getAttribute('data-jr-jump') === id) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
      });
    }
    if ('IntersectionObserver' in window) {
      var watch = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) setCurrent(e.target.getAttribute('data-jr-chapter')); });
      }, { root: scroller, rootMargin: '-45% 0px -50% 0px' });
      Array.prototype.forEach.call(chapters, function (c) { watch.observe(c); });
      cleanups.push(function () { watch.disconnect(); });
    }

    function jump(id, smooth) {
      var el = box.querySelector('#jr-' + id);
      if (!el) return;
      var y = scroller.scrollTop + el.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 72;
      if (ctx.lenis && smooth) ctx.lenis.scrollTo(y, { duration: 1.1 });
      else scroller.scrollTo({ top: y, behavior: smooth && !ctx.reduceMotion ? 'smooth' : 'auto' });
      var h = el.querySelector('.jr-chapter__title');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
    Array.prototype.forEach.call(links, function (a) {
      on(a, 'click', function (e) { e.preventDefault(); jump(a.getAttribute('data-jr-jump'), true); });
    });

    // The opener: the work settles back and the words fade as the story starts.
    var media = box.querySelector('[data-jr-open-media]');
    var copy = box.querySelector('[data-jr-open-copy]');
    var cue = box.querySelector('.jr-open__cue');
    var ticking = false;
    function drift() {
      ticking = false;
      var h = scroller.clientHeight || 1;
      var t = Math.min(1, Math.max(0, scroller.scrollTop / h));
      if (media) media.style.transform = 'translate3d(0,' + (t * h * 0.22).toFixed(1) + 'px,0) scale(' + (1 - t * 0.06).toFixed(4) + ')';
      if (copy) copy.style.opacity = String(1 - t * 1.4);
      if (cue) cue.style.opacity = String(Math.max(0, 1 - t * 4));
    }
    if (!ctx.reduceMotion) {
      on(scroller, 'scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }, { passive: true });
      requestAnimationFrame(function () { box.classList.add('is-open'); });
    } else {
      box.classList.add('is-open');
    }

    // Videos play only while on screen, and never with reduced motion.
    var videos = box.querySelectorAll('[data-jr-video]');
    if (videos.length) {
      if (ctx.reduceMotion || !('IntersectionObserver' in window)) {
        Array.prototype.forEach.call(videos, function (v) { v.setAttribute('controls', ''); });
      } else {
        var vio = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { var pr = e.target.play(); if (pr && pr.catch) pr.catch(function () { e.target.setAttribute('controls', ''); }); }
            else e.target.pause();
          });
        }, { root: scroller, threshold: 0.35 });
        Array.prototype.forEach.call(videos, function (v) { vio.observe(v); });
        cleanups.push(function () { vio.disconnect(); Array.prototype.forEach.call(videos, function (v) { v.pause(); }); });
      }
    }

    // #project/branding/<brand> lands on that brand's chapter. On a fresh page
    // load the layout above it is still settling, so for four seconds it checks
    // every quarter second and lands again if the chapter has drifted, until
    // the visitor scrolls themselves.
    if (ctx.page) {
      var target = ctx.page, tries = 0, poll = 0;
      var stopLanding = function () { target = null; clearInterval(poll); };
      var land = function () {
        var el = target && box.querySelector('#jr-' + target);
        if (!el || ++tries > 16) { stopLanding(); return; }
        var off = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
        if (Math.abs(off - 72) > 4) jump(target, false);
      };
      setTimeout(land, 60);
      poll = setInterval(land, 250);
      ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (t) { on(scroller, t, stopLanding, { passive: true }); });
      cleanups.push(stopLanding);
    }

    // The glider (wide screens): the finished work, the intro, every chapter
    // and the next project down the left margin. In Branding the glider takes
    // each brand's own accent as it passes through that brand.
    if (window.CaseGlider) {
      var p = ctx.project;
      var x = parts(p);
      var bar = function () { return parseFloat(getComputedStyle(ctx.sheet).getPropertyValue('--cs-bar-h')) || 60; };
      var glider = window.CaseGlider({
        sheet: ctx.sheet, scroller: scroller, content: ctx.content, lenis: ctx.lenis, reduceMotion: ctx.reduceMotion,
        cls: 'jr-glider jr-glider--' + (p.slug || 'journey'),
        label: p.title + ', part by part',
        offset: function () { return bar() + 12; },
        items: [
          { name: p.brands ? 'All five, finished' : 'The finished work', sub: p.title, el: box.querySelector('#cs-cover'), focus: box.querySelector('#cs-title') },
          { name: 'About the project', el: box.querySelector('.jr-intro') }
        ].concat(x.chapters.map(function (c) {
          return { name: c.title.replace(/\[[^\]]*\]/g, '…'), sub: c.kicker || '', colour: c.accent, el: box.querySelector('#jr-' + c.id), focus: box.querySelector('#jr-t-' + c.id) };
        })).concat([{ name: 'Next project', sub: p.next ? p.next.title : '', el: box.querySelector('#cs-next') }])
      });
      cleanups.push(glider.destroy);
    }

    return {
      route: function (page) { if (page) jump(page, true); else scroller.scrollTo({ top: 0 }); },
      destroy: function () { cleanups.forEach(function (fn) { fn(); }); }
    };
  }

  worlds.journey = {
    css: 'css/worlds/journey.css',
    // Branding lists its brands; each brand's file loads first.
    scripts: function (p) { return (p.brands || []).map(function (s) { return 'projects/branding/' + s + '.js'; }); },
    render: render,
    mount: mount
  };
})();
