/* =====================================================================
   AIYANA MEHTA · PORTFOLIO · case-study.js
   One template for every case study. A project card on the homepage links
   to #project/<slug>; this file loads projects/<slug>.js, renders it into a
   frosted glass sheet that grows out of the card, and handles the phase
   bar, the colour journey, the lightbox, focus and the back button.

   To add a project: write projects/<slug>.js (copy projects/nexo.js), put
   its images in assets/images/projects/<slug>/, and point a project card's
   link at #project/<slug> with data-project="<slug>". No layout code.

   1. Setup          5. Open, close, switch
   2. Rendering      6. Lightbox
   3. The sheet      7. Keyboard, routing, card clicks
   4. Scroll: colour journey, phase bar, progress, entrances
   Colours, blur, timings: tokens at the top of css/case-study.css.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Setup ---------- */
  var PROJECT_DIR = 'projects/';
  // Bump with each content change so browsers fetch the new project data instead of a cached copy.
  var DATA_VERSION = '3';
  var SLUG = /^[a-z0-9-]+$/;
  var HASH = /^#project\/([a-z0-9-]+)$/;
  var PHASES = [['discover', 'Discover'], ['define', 'Define'], ['develop', 'Develop'], ['deliver', 'Deliver']];

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canAnimate = !!Element.prototype.animate;
  var styles = getComputedStyle(root);
  function token(name) { return styles.getPropertyValue(name).trim(); }
  function ms(name, fallback) { var n = parseFloat(token(name)); return isNaN(n) ? fallback : n; }

  var FLIP_MS = ms('--cs-flip-ms', 700);
  var FADE_MS = ms('--cs-fade-ms', 320);
  var EASE = token('--cs-ease') || 'cubic-bezier(0.22, 1, 0.36, 1)';

  // The four glass tones, read from the CSS tokens.
  var TONES = {};
  ['mist', 'taupe', 'cloud', 'sea'].forEach(function (name) {
    TONES[name] = {
      rgb: token('--cs-' + name).split(',').map(Number),
      alpha: parseFloat(token('--cs-alpha-' + name)),
      ink: token('--cs-ink-' + name),
      amber: token('--cs-amber-' + name)
    };
  });

  if (!reduceMotion && 'IntersectionObserver' in window) root.classList.add('cs-motion');

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Text with any [PLACEHOLDER ...] marked up so it can't be missed.
  function rich(value) {
    return esc(value).replace(/\[PLACEHOLDER[^\]]*\]/g, function (m) { return '<mark class="cs-ph">' + m + '</mark>'; });
  }
  function portfolioLenis() { return window.portfolio && window.portfolio.lenis; }

  var ICON_CLOSE = '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M3.5 3.5l11 11M14.5 3.5l-11 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var ICON_PREV = '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M11.5 3.5L6 9l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_NEXT = '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M6.5 3.5L12 9l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_ARROW = '<svg viewBox="0 0 28 28" aria-hidden="true" focusable="false"><path d="M4 14h19M16 7l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_EXPAND = '<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M10.5 3.5h4v4M7.5 14.5h-4v-4M14.5 3.5l-4.5 4.5M3.5 14.5L8 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 28 28" aria-hidden="true" focusable="false"><circle cx="14" cy="14" r="13" fill="currentColor"/><path d="M11.5 9.2v9.6l7.6-4.8z" fill="#1C1C1B"/></svg>';

  /* ---------- 2. Rendering: data → HTML ----------
     Block types: hmw, chips, insights, images (full | pair | trio | asym),
     compare, statement, horizon, video, shifts, points.
     Section heads rotate through three compositions (split, stack, offset)
     so neighbouring sections never share a layout; a section can pin one
     with head: 'split' | 'stack' | 'offset'. */
  var HEADS = ['split', 'stack', 'offset'];
  var groups = {};   // lightbox images, one list per section

  // An image in a frame (outer glass shell, inner core), opening the lightbox.
  function figure(p, img, group, ratio, delay, tag) {
    var list = groups[group] || (groups[group] = []);
    var index = list.push({ src: p.images + img.src, width: img.width, height: img.height, alt: img.alt, caption: img.caption }) - 1;
    var core = 'cs-zoom__core' + (img.fit === 'contain' ? ' is-contain' : '') + (img.mat === 'mist' ? ' is-mist' : '');
    var imgStyle = img.position ? ' style="object-position:' + esc(img.position) + '"' : '';
    return '<figure class="cs-fig cs-reveal" style="--d:' + delay + 'ms">' +
      (tag ? '<span class="cs-compare__tag">' + esc(tag) + '</span>' : '') +
      '<button type="button" class="cs-zoom" data-group="' + esc(group) + '" data-index="' + index + '">' +
      '<span class="' + core + '"' + (ratio ? ' style="--ratio:' + esc(ratio) + '"' : '') + '>' +
      '<span class="sr-only">Open larger: </span>' +
      '<img src="' + esc(p.images + img.src) + '" width="' + img.width + '" height="' + img.height + '" alt="' + esc(img.alt) + '" loading="lazy" decoding="async"' + imgStyle + ' />' +
      '<span class="cs-zoom__hint" aria-hidden="true">' + ICON_EXPAND + '</span>' +
      '</span></button>' +
      '<figcaption>' + rich(img.caption) + '</figcaption></figure>';
  }

  // Words wrapped one by one, for the scrubbed reveal on statements.
  function words(text) {
    return rich(text).split(/(<mark[^>]*>.*?<\/mark>|\s+)/).map(function (w) {
      if (!w) return '';
      if (/^\s+$/.test(w)) return ' ';
      return '<span class="cs-word">' + w + '</span>';
    }).join('');
  }

  function block(p, b, group) {
    switch (b.type) {
      case 'hmw':
        var text = esc(b.text).replace(/^How might we/, '<span class="cs-hmw__lead">How might we</span>');
        return '<p class="cs-hmw cs-reveal">' + text + '</p>';

      case 'chips':
        return '<ul class="cs-chips" aria-label="Research methods">' +
          b.items.map(function (c, i) { return '<li class="cs-reveal" style="--d:' + (i * 60) + 'ms">' + rich(c) + '</li>'; }).join('') + '</ul>';

      case 'insights':
        // A bento: the first insight leads, large; the others stack beside it.
        return '<div class="cs-insights">' + b.items.map(function (it, i) {
          return '<div class="cs-insight cs-glass cs-reveal' + (i === 0 ? ' cs-insight--lead' : '') + '" style="--d:' + (i * 90) + 'ms">' +
            '<p>' + rich(it.text) + '</p>' + (it.source ? '<span>' + rich(it.source) + '</span>' : '') + '</div>';
        }).join('') + '</div>';

      case 'images':
        return '<div class="cs-grid cs-grid--' + esc(b.layout) + '">' + b.items.map(function (img, i) {
          var ratio = b.layout === 'full' || (b.layout === 'asym' && i === 1) ? '' : b.ratio;
          return figure(p, img, group, ratio, i * 90);
        }).join('') + '</div>';

      case 'compare':
        return '<div class="cs-compare"><div class="cs-compare__pair">' +
          figure(p, b.before, group, b.ratio, 0, b.beforeLabel || 'Before') +
          '<span class="cs-compare__arrow cs-reveal" style="--d:80ms" aria-hidden="true">' + ICON_ARROW + '</span>' +
          figure(p, b.after, group, b.ratio, 160, b.afterLabel || 'After') +
          '</div>' + (b.note ? '<p class="cs-compare__note cs-reveal">' + rich(b.note) + '</p>' : '') + '</div>';

      case 'statement':
        return '<div class="cs-statement"><p class="cs-statement__label cs-reveal">' + rich(b.label || 'Problem statement') + '</p>' +
          '<p class="cs-statement__text cs-scrub">' + words(b.text) + '</p></div>';

      case 'horizon':
        return '<div class="cs-horizon cs-reveal" aria-hidden="true"></div>';

      case 'video':
        // Breaks out of the column to the full width of the sheet.
        return '<figure class="cs-bleed cs-reveal"><a class="cs-video" href="' + esc(b.href) + '" target="_blank" rel="noopener">' +
          (b.poster ? '<img src="' + esc(p.images + b.poster.src) + '" width="' + b.poster.width + '" height="' + b.poster.height + '" alt="' + esc(b.poster.alt) + '" loading="lazy" decoding="async" />' : '') +
          '<span class="cs-video__scrim" aria-hidden="true"></span>' +
          '<span class="cs-video__body"><span class="cs-video__title">' + esc(b.label || 'Watch the video') + '</span>' +
          (b.caption ? '<span class="cs-video__caption">' + rich(b.caption) + '</span>' : '') + '</span>' +
          '<span class="cs-video__play">' + ICON_PLAY + '<span class="sr-only"> (opens in a new tab)</span></span></a></figure>';

      case 'shifts':
        // "From → to" lines, set large: the change the project designs for.
        return '<div class="cs-shifts">' + (b.label ? '<p class="cs-shifts__label cs-reveal">' + rich(b.label) + '</p>' : '') +
          '<ul>' + b.items.map(function (pair, i) {
            return '<li class="cs-reveal" style="--d:' + (i * 120) + 'ms"><span class="cs-shifts__from">' + rich(pair[0]) + '</span>' +
              '<span class="cs-shifts__arrow">' + ICON_ARROW + '<span class="sr-only"> becomes </span></span>' +
              '<span class="cs-shifts__to">' + rich(pair[1]) + '</span></li>';
          }).join('') + '</ul></div>';

      case 'points':
        return '<div class="cs-points">' + b.items.map(function (pt, i) {
          return '<div class="cs-reveal" style="--d:' + (i * 90) + 'ms"><h4>' + rich(pt.title) + '</h4><p>' + rich(pt.text) + '</p></div>';
        }).join('') + '</div>';
    }
    return '';
  }

  function sectionHTML(p, s, i) {
    var dark = s.tone === 'cloud' || s.tone === 'sea';
    var head = HEADS.indexOf(s.head) > -1 ? s.head : HEADS[i % HEADS.length];
    var inner = '<div class="cs-wrap"><header class="cs-head cs-head--' + head + '">' +
      (s.label ? '<p class="cs-label cs-reveal">' + rich(s.label) + '</p>' : '') +
      '<h3 class="cs-heading cs-reveal" style="--d:70ms" id="cs-h-' + esc(s.id) + '" tabindex="-1">' + rich(s.heading) + '</h3>' +
      (s.text ? '<p class="cs-text cs-reveal" style="--d:150ms">' + rich(s.text) + '</p>' : '') +
      '</header>';
    (s.blocks || []).forEach(function (b) {
      var html = block(p, b, s.id);
      // Full-bleed blocks close the column and open a new one after them.
      inner += b.type === 'video' ? '</div>' + html + '<div class="cs-wrap">' : html;
    });
    inner += '</div>';
    return '<section class="cs-section' + (dark ? ' is-dark-tone' : '') + '" id="cs-' + esc(s.id) + '" data-tone="' + esc(s.tone) + '"' +
      (s.phase ? ' data-phase="' + esc(s.phase) + '"' : '') + ' aria-labelledby="cs-h-' + esc(s.id) + '">' +
      inner.replace(/<div class="cs-wrap"><\/div>/g, '') + '</section>';
  }

  // The cover: the project's name set as a stage, the final result standing on it.
  function coverHTML(p) {
    var c = p.cover;
    var letters = esc(p.title).split('').map(function (ch, i) {
      return '<span class="cs-char" style="--i:' + i + '">' + (ch === ' ' ? '&nbsp;' : ch) + '</span>';
    }).join('');
    return '<section class="cs-section cs-section--cover" id="cs-cover" data-tone="mist" aria-labelledby="cs-title">' +
      '<div class="cs-wrap"><div class="cs-cover' + (c.cutout ? ' is-cutout' : '') + '">' +
      '<h2 class="cs-title cs-reveal" id="cs-title" aria-label="' + esc(p.title) + '"><span aria-hidden="true">' + letters + '</span></h2>' +
      '<div class="cs-cover__media cs-reveal" style="--d:220ms"><img src="' + esc(p.images + c.src) + '" width="' + c.width + '" height="' + c.height + '" alt="' + esc(c.alt) + '" fetchpriority="high" decoding="async" /></div>' +
      '<div class="cs-cover__meta">' +
      (p.tagline ? '<p class="cs-tagline cs-reveal" style="--d:300ms">' + rich(p.tagline) + '</p>' : '') +
      (p.outcome ? '<p class="cs-outcome cs-reveal" style="--d:360ms">' + rich(p.outcome) + '</p>' : '') +
      (p.facts && p.facts.length ? '<dl class="cs-facts cs-glass cs-reveal" style="--d:420ms">' + p.facts.map(function (f) {
        return '<div><dt>' + rich(f.label) + '</dt><dd>' + rich(f.value) + '</dd></div>';
      }).join('') + '</dl>' : '') +
      '</div></div></div></section>';
  }

  function nextHTML(p) {
    var n = p.next;
    var link = n && SLUG.test(n.slug)
      ? '<a class="cs-next__link" href="#project/' + esc(n.slug) + '"><span class="cs-next__kicker">Next project</span><span class="cs-next__title">' + esc(n.title) + '</span></a>'
      : ''; // no next case study yet: the close is just "Back to all work"
    return '<section class="cs-section cs-section--next is-dark-tone" id="cs-next" data-tone="sea" aria-label="Next project">' +
      '<div class="cs-wrap cs-next">' + link +
      '<a class="cs-next__back line-link" href="#work" data-cs-back>Back to all work</a></div></section>';
  }

  /* ---------- 3. The sheet (built once, filled per project) ---------- */
  var layer = document.createElement('div');
  layer.className = 'cs-layer';
  layer.hidden = true;
  layer.setAttribute('data-lenis-prevent', '');
  layer.innerHTML =
    '<div class="cs-backdrop" data-cs-close></div>' +
    '<div class="cs-sheet" role="dialog" aria-modal="true" aria-labelledby="cs-title" tabindex="-1">' +
      '<div class="cs-progress" aria-hidden="true"><span></span></div>' +
      '<header class="cs-bar">' +
        '<p class="cs-bar__name"></p>' +
        '<nav class="cs-phases" aria-label="Project phases"></nav>' +
        '<select class="cs-phase-select" aria-label="Jump to a part of the project"></select>' +
        '<button type="button" class="cs-close" aria-label="Close project" data-cs-close>' + ICON_CLOSE + '</button>' +
      '</header>' +
      '<div class="cs-scroll"><div class="cs-content"></div></div>' +
    '</div>';
  document.body.appendChild(layer);

  var backdrop = layer.querySelector('.cs-backdrop');
  var sheet = layer.querySelector('.cs-sheet');
  var bar = layer.querySelector('.cs-bar');
  var barName = layer.querySelector('.cs-bar__name');
  var phaseNav = layer.querySelector('.cs-phases');
  var phaseSelect = layer.querySelector('.cs-phase-select');
  var scroller = layer.querySelector('.cs-scroll');
  var content = layer.querySelector('.cs-content');
  var progress = layer.querySelector('.cs-progress span');

  var state = { open: false, busy: false, slug: null, project: null, card: null, pushed: false, returnFocus: null, inerted: [] };
  var stops = [];
  var revealer = null;
  var scrubs = [];      // statements whose words light up with scroll
  var coverImg = null;  // the cover picture drifts a little slower than the page

  function fill(p) {
    groups = {};
    state.project = p;
    barName.textContent = p.title;
    content.innerHTML = coverHTML(p) + p.sections.map(function (s, i) { return sectionHTML(p, s, i); }).join('') + nextHTML(p);

    var present = PHASES.filter(function (ph) { return content.querySelector('[data-phase="' + ph[0] + '"]'); });
    phaseNav.innerHTML = present.map(function (ph, i) {
      var first = content.querySelector('[data-phase="' + ph[0] + '"]');
      return (i ? '<span class="cs-phases__dot" aria-hidden="true">·</span>' : '') +
        '<a href="#' + first.id + '" data-phase-link="' + ph[0] + '">' + ph[1] + '</a>';
    }).join('');
    phaseSelect.innerHTML = '<option value="cs-cover">Overview</option>' + p.sections.map(function (s) {
      return '<option value="cs-' + esc(s.id) + '">' + esc((s.label || s.heading).replace(/\[PLACEHOLDER[^\]]*\]/g, '').trim()) + '</option>';
    }).join('');

    // Entrances, watched inside the sheet's own scroller.
    if (revealer) revealer.disconnect();
    if (root.classList.contains('cs-motion')) {
      revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); revealer.unobserve(e.target); }
        });
      }, { root: scroller, rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      Array.prototype.forEach.call(content.querySelectorAll('.cs-reveal'), function (el) { revealer.observe(el); });
    }

    scrubs = reduceMotion ? [] : Array.prototype.map.call(content.querySelectorAll('.cs-scrub'), function (el) {
      el.classList.add('is-scrubbing');
      return { el: el, words: el.querySelectorAll('.cs-word') };
    });
    coverImg = reduceMotion ? null : content.querySelector('.cs-cover__media img');

    scroller.scrollTop = 0;
    measure();
    lastKey = '';
    onSheetScroll();
  }

  /* ---------- 4. Scroll: colour journey, phase bar, progress ---------- */
  function measure() {
    stops = Array.prototype.map.call(content.querySelectorAll('section[data-tone]'), function (el) {
      return { el: el, id: el.id, top: el.offsetTop, tone: TONES[el.getAttribute('data-tone')] || TONES.mist, phase: el.getAttribute('data-phase') };
    });
  }

  var lastKey = '';
  var lastPhase = null;
  function lerp(a, b, t) { return a + (b - a) * t; }

  function onSheetScroll() {
    var top = scroller.scrollTop;
    var view = scroller.clientHeight;
    var max = scroller.scrollHeight - view;
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, top / max) : 0).toFixed(4) + ')';
    if (coverImg && top < view * 1.2) coverImg.style.transform = 'translate3d(0,' + (top * -0.12).toFixed(1) + 'px,0)';
    scrubs.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      var box = scroller.getBoundingClientRect();
      var t = Math.min(1, Math.max(0, (box.top + view * 0.9 - r.top) / (view * 0.45)));
      var n = s.words.length;
      Array.prototype.forEach.call(s.words, function (w, i) {
        w.style.opacity = (0.18 + 0.82 * Math.min(1, Math.max(0, t * n - i))).toFixed(3);
      });
    });
    if (!stops.length) return;

    // Which part is in the middle of the view, and how far into the blend
    // towards the next part we are (blend over the last stretch before it).
    var probe = top + view * 0.5;
    var i = 0;
    while (i < stops.length - 1 && stops[i + 1].top <= probe) i++;
    var cur = stops[i];
    var next = stops[i + 1];
    var t = 0;
    if (next && next.tone !== cur.tone) {
      var band = Math.min(view * 0.45, 420);
      t = Math.min(1, Math.max(0, (probe - (next.top - band)) / band));
      if (reduceMotion) t = t < 0.5 ? 0 : 1;   // steps; CSS fades the change
    }
    var a = cur.tone;
    var b = next ? next.tone : cur.tone;
    var rgb = [0, 1, 2].map(function (k) { return Math.round(lerp(a.rgb[k], b.rgb[k], t)); }).join(',');
    var alpha = lerp(a.alpha, b.alpha, t).toFixed(3);
    var side = t < 0.5 ? a : b;   // text flips at the midpoint of the blend
    var key = rgb + alpha + side.ink;
    if (key !== lastKey) {
      lastKey = key;
      sheet.style.setProperty('--cs-tint', rgb);
      sheet.style.setProperty('--cs-alpha', alpha);
      sheet.style.setProperty('--cs-ink', side.ink);
      sheet.style.setProperty('--cs-amber', side.amber);
    }

    var phase = cur.phase || null;
    if (phase !== lastPhase) {
      lastPhase = phase;
      Array.prototype.forEach.call(phaseNav.querySelectorAll('a'), function (link) {
        if (link.getAttribute('data-phase-link') === phase) link.setAttribute('aria-current', 'step');
        else link.removeAttribute('aria-current');
      });
    }
    var showing = t < 0.5 || !next ? cur : next;
    if (phaseSelect.value !== showing.id && phaseSelect.querySelector('option[value="' + showing.id + '"]')) phaseSelect.value = showing.id;
  }

  var ticking = false;
  scroller.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { onSheetScroll(); ticking = false; });
  }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(function () { if (state.open) { measure(); onSheetScroll(); } }).observe(content);
  window.addEventListener('resize', function () { if (state.open) { measure(); onSheetScroll(); } });

  // Jump to a part of the project, inside the sheet.
  function jumpTo(id) {
    var section = document.getElementById(id);
    if (!section) return;
    var head = section.querySelector('.cs-head') || section;
    var y = id === 'cs-cover' ? 0 : head.offsetTop - bar.offsetHeight - 24;
    scroller.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? 'auto' : 'smooth' });
    var heading = section.querySelector('h2, h3');
    if (heading) heading.focus({ preventScroll: true });
  }
  phaseSelect.addEventListener('change', function () { jumpTo(phaseSelect.value); });

  /* ---------- 5. Open, close, switch ---------- */
  var loading = {};
  function loadProject(slug) {
    var known = window.CASE_STUDIES && window.CASE_STUDIES[slug];
    if (known) return Promise.resolve(known);
    if (loading[slug]) return loading[slug];
    loading[slug] = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = PROJECT_DIR + slug + '.js?v=' + DATA_VERSION;
      script.async = true;
      script.onload = function () {
        var p = window.CASE_STUDIES && window.CASE_STUDIES[slug];
        if (p) resolve(p); else reject(new Error('No data in ' + script.src));
      };
      script.onerror = function () { delete loading[slug]; reject(new Error('Could not load ' + script.src)); };
      document.head.appendChild(script);
    });
    return loading[slug];
  }

  function findCard(slug) {
    var link = document.querySelector('.project-card a[data-project="' + slug + '"]');
    return link ? link.closest('.project-card') : null;
  }
  function cardRect(card) {
    if (!card) return null;
    var media = card.querySelector('.project-card__media') || card;
    var r = media.getBoundingClientRect();
    var onScreen = r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
    return onScreen ? r : null;
  }
  function flipFrom(r) {
    var to = sheet.getBoundingClientRect();
    return 'translate(' + (r.left - to.left).toFixed(1) + 'px,' + (r.top - to.top).toFixed(1) + 'px) scale(' +
      (r.width / to.width).toFixed(4) + ',' + (r.height / to.height).toFixed(4) + ')';
  }
  function run(el, frames, duration, delay) {
    if (!canAnimate) return Promise.resolve();
    var anim = el.animate(frames, { duration: duration, delay: delay || 0, easing: EASE, fill: 'both' });
    return anim.finished.then(function () { anim.cancel(); }, function () {});
  }

  // Everything outside the open dialog is inert, so focus stays inside.
  function setInert(on) {
    if (on) {
      state.inerted = Array.prototype.filter.call(document.body.children, function (el) {
        return el !== layer && el !== lightbox && el.tagName !== 'SCRIPT' && !el.inert;
      });
      state.inerted.forEach(function (el) { el.inert = true; });
    } else {
      state.inerted.forEach(function (el) { el.inert = false; });
      state.inerted = [];
    }
  }
  function lockPage(on) {
    var lenis = portfolioLenis();
    if (on) {
      var scrollbar = window.innerWidth - root.clientWidth;
      if (scrollbar > 0) document.body.style.paddingRight = scrollbar + 'px';
      root.classList.add('cs-open');
      if (lenis) lenis.stop();
    } else {
      root.classList.remove('cs-open');
      document.body.style.paddingRight = '';
      if (lenis) lenis.start();
    }
  }

  function openProject(slug, opts) {
    if (state.open || state.busy || !SLUG.test(slug)) return;
    state.busy = true;
    loadProject(slug).then(function (p) {
      if (opts.push) history.pushState({ csProject: slug }, '', '#project/' + slug);
      state.pushed = opts.push || opts.fromHistory;
      state.slug = slug;
      state.card = opts.card || findCard(slug);
      state.returnFocus = document.activeElement && document.activeElement !== document.body ? document.activeElement : (state.card && state.card.querySelector('a'));

      fill(p);
      lockPage(true);
      setInert(true);
      layer.hidden = false;
      state.open = true;
      measure();
      onSheetScroll();
      sheet.focus({ preventScroll: true });

      var from = !reduceMotion && cardRect(state.card);
      var done;
      if (from) {
        if (state.card) state.card.classList.add('is-cs-source');
        done = Promise.all([
          run(sheet, [{ transform: flipFrom(from), opacity: 0 }, { opacity: 1, offset: 0.22 }, { transform: 'none', opacity: 1 }], FLIP_MS),
          run(backdrop, [{ opacity: 0 }, { opacity: 1 }], FLIP_MS * 0.8),
          run(scroller, [{ opacity: 0 }, { opacity: 0, offset: 0.35 }, { opacity: 1 }], FLIP_MS),
          run(bar, [{ opacity: 0 }, { opacity: 0, offset: 0.35 }, { opacity: 1 }], FLIP_MS)
        ]);
      } else {
        done = run(layer, [{ opacity: 0 }, { opacity: 1 }], FADE_MS);
      }
      return done;
    }).then(function () {
      state.busy = false;
    }, function (err) {
      state.busy = false;
      if (window.console) console.warn('[case-study]', err && err.message);
      if (!state.open && HASH.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
      toast('That project didn’t load. Check your connection and try again.');
    });
  }

  function closeProject(fromHistory) {
    if (!state.open || state.busy) return;
    // Opened from a card or the back/forward buttons: let history close it,
    // so the back button and the × always agree.
    if (!fromHistory && state.pushed) { history.back(); return; }
    if (!fromHistory && HASH.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);

    state.busy = true;
    closeLightbox(true);
    var card = state.card;
    var to = !reduceMotion && cardRect(card);
    // The card's cover fades back in under the shrinking glass.
    if (to && card) card.classList.remove('is-cs-source');
    var done = to
      ? Promise.all([
          run(scroller, [{ opacity: 1 }, { opacity: 0, offset: 0.3 }, { opacity: 0 }], FLIP_MS * 0.85),
          run(bar, [{ opacity: 1 }, { opacity: 0, offset: 0.3 }, { opacity: 0 }], FLIP_MS * 0.85),
          run(sheet, [{ transform: 'none', opacity: 1 }, { opacity: 1, offset: 0.6 }, { transform: flipFrom(to), opacity: 0 }], FLIP_MS * 0.85),
          run(backdrop, [{ opacity: 1 }, { opacity: 0 }], FLIP_MS * 0.85)
        ])
      : run(layer, [{ opacity: 1 }, { opacity: 0 }], FADE_MS);

    done.then(function () {
      layer.hidden = true;
      if (card) card.classList.remove('is-cs-source');
      setInert(false);
      lockPage(false);
      state.open = false;
      state.busy = false;
      var back = state.returnFocus && document.contains(state.returnFocus) ? state.returnFocus : (card && card.querySelector('a'));
      if (back) back.focus({ preventScroll: true });
      if (state.afterClose) { var then = state.afterClose; state.afterClose = null; then(); }
    });
  }

  // From one project straight to the next, inside the open sheet.
  function switchProject(slug) {
    if (!state.open || state.busy || slug === state.slug) return;
    state.busy = true;
    loadProject(slug).then(function (p) {
      return run(content, [{ opacity: 1 }, { opacity: 0 }], 200).then(function () {
        if (state.card) state.card.classList.remove('is-cs-source');
        state.slug = slug;
        state.card = findCard(slug);
        if (state.card && !reduceMotion) state.card.classList.add('is-cs-source');
        fill(p);
        sheet.focus({ preventScroll: true });
        return run(content, [{ opacity: 0 }, { opacity: 1 }], 300);
      });
    }).then(function () { state.busy = false; }, function () { state.busy = false; });
  }

  // A short, polite message when a project can't be opened.
  var toastEl = null;
  var toastTimer = 0;
  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('p');
      toastEl.className = 'cs-toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 4200);
  }

  /* ---------- 6. Lightbox ---------- */
  var lightbox = document.createElement('div');
  lightbox.className = 'cs-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-labelledby', 'cs-lb-caption');
  lightbox.setAttribute('data-lenis-prevent', '');
  lightbox.innerHTML =
    '<div class="cs-lightbox__backdrop" data-lb-close></div>' +
    '<div class="cs-lightbox__panel">' +
      '<div class="cs-lightbox__stage"></div>' +
      '<div class="cs-lightbox__foot">' +
        '<div><p class="cs-lightbox__caption" id="cs-lb-caption"></p><p class="cs-lightbox__count" aria-live="polite"></p></div>' +
        '<div class="cs-lightbox__controls">' +
          '<button type="button" data-lb-prev aria-label="Previous image">' + ICON_PREV + '</button>' +
          '<button type="button" data-lb-next aria-label="Next image">' + ICON_NEXT + '</button>' +
          '<button type="button" data-lb-close aria-label="Close image viewer">' + ICON_CLOSE + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  document.body.appendChild(lightbox);

  var lbPanel = lightbox.querySelector('.cs-lightbox__panel');
  var lbImg = document.createElement('img');   // given a source when the lightbox first opens
  lbImg.className = 'cs-lightbox__img';
  lbImg.decoding = 'async';
  var lbCaption = lightbox.querySelector('.cs-lightbox__caption');
  var lbCount = lightbox.querySelector('.cs-lightbox__count');
  var lbPrev = lightbox.querySelector('[data-lb-prev]');
  var lbNext = lightbox.querySelector('[data-lb-next]');
  var lb = { items: [], index: 0, trigger: null, open: false };

  function showImage(i) {
    var item = lb.items[i];
    if (!item) return;
    lb.index = i;
    if (!lbImg.parentNode) lightbox.querySelector('.cs-lightbox__stage').appendChild(lbImg);
    lbImg.src = item.src;
    lbImg.width = item.width;
    lbImg.height = item.height;
    lbImg.alt = item.alt;
    lbCaption.textContent = item.caption.replace(/\[PLACEHOLDER[^\]]*\]/g, '').trim();
    lbCount.textContent = (i + 1) + ' of ' + lb.items.length;
    lbPrev.disabled = i === 0;
    lbNext.disabled = i === lb.items.length - 1;
  }
  function step(dir) {
    var i = lb.index + dir;
    if (i < 0 || i >= lb.items.length) return;
    showImage(i);
    if (!reduceMotion) run(lbImg, [{ opacity: 0, transform: 'translateX(' + (dir * 16) + 'px)' }, { opacity: 1, transform: 'none' }], 320);
  }
  function openLightbox(group, index, trigger) {
    lb.items = groups[group] || [];
    if (!lb.items.length) return;
    lb.trigger = trigger;
    lb.open = true;
    showImage(index);
    layer.inert = true;
    lightbox.hidden = false;
    lightbox.querySelector('.cs-lightbox__controls [data-lb-close]').focus({ preventScroll: true });
    run(lightbox.querySelector('.cs-lightbox__backdrop'), [{ opacity: 0 }, { opacity: 1 }], FADE_MS);
    run(lbPanel, reduceMotion ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'none' }], 420);
  }
  function closeLightbox(instant) {
    if (!lb.open) return;
    lb.open = false;
    var finish = function () {
      lightbox.hidden = true;
      layer.inert = false;
      if (!instant && lb.trigger) lb.trigger.focus({ preventScroll: true });
    };
    if (instant) { finish(); return; }
    run(lightbox, [{ opacity: 1 }, { opacity: 0 }], 240).then(finish);
  }

  lightbox.addEventListener('click', function (e) {
    if (e.target.closest('[data-lb-close]')) closeLightbox();
    else if (e.target.closest('[data-lb-prev]')) step(-1);
    else if (e.target.closest('[data-lb-next]')) step(1);
  });

  /* ---------- 7. Keyboard, routing, card clicks ---------- */
  // Clicks inside the sheet never reach the homepage's anchor handler.
  layer.addEventListener('click', function (e) {
    var zoom = e.target.closest('.cs-zoom');
    if (zoom) { openLightbox(zoom.getAttribute('data-group'), Number(zoom.getAttribute('data-index')), zoom); return; }
    if (e.target.closest('[data-cs-close]')) { closeProject(false); return; }

    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();
    e.stopPropagation();
    var href = link.getAttribute('href');
    var m = href.match(HASH);
    if (m) {
      history.replaceState({ csProject: m[1] }, '', href);
      switchProject(m[1]);
    } else if (link.hasAttribute('data-cs-back')) {
      state.afterClose = function () {
        var work = document.querySelector(href);
        if (!work) return;
        var lenis = portfolioLenis();
        var y = work.getBoundingClientRect().top + window.scrollY;
        if (lenis) lenis.scrollTo(y, { duration: 1 }); else window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      };
      closeProject(false);
    } else {
      jumpTo(href.slice(1));
    }
  });

  function focusables(scope) {
    return Array.prototype.filter.call(
      scope.querySelectorAll('a[href], button:not([disabled]), select, [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null || el === document.activeElement; }
    );
  }

  document.addEventListener('keydown', function (e) {
    if (!state.open) return;
    if (lb.open) {
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); return; }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); return; }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeProject(false);
      return;
    }
    if (e.key === 'Tab') {
      var list = focusables(lb.open ? lbPanel : sheet);
      if (!list.length) return;
      var first = list[0];
      var last = list[list.length - 1];
      var inside = (lb.open ? lbPanel : sheet).contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !inside)) { e.preventDefault(); first.focus(); }
    }
  });

  // Homepage cards: open with the grow animation; warm the data on hover.
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-project]');
    if (!link || state.open || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    var slug = link.getAttribute('data-project');
    if (!SLUG.test(slug)) return;
    e.preventDefault();
    openProject(slug, { card: link.closest('.project-card'), push: true });
  });
  ['pointerenter', 'focusin'].forEach(function (type) {
    document.addEventListener(type, function (e) {
      var link = e.target.closest && e.target.closest('.project-card') && e.target.closest('.project-card').querySelector('a[data-project]');
      if (link) loadProject(link.getAttribute('data-project')).catch(function () {});
    }, true);
  });

  // The URL is the source of truth: #project/<slug> means the sheet is open.
  function route(initial) {
    var m = location.hash.match(HASH);
    if (m) {
      if (!state.open) {
        var card = findCard(m[1]);
        if (initial && card) {
          // A shared link: bring the card into view, then grow out of it.
          var lenis = portfolioLenis();
          var y = card.getBoundingClientRect().top + window.scrollY - Math.max(0, (window.innerHeight - card.offsetHeight) / 2);
          if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
        }
        openProject(m[1], { card: card, push: false, fromHistory: !initial });
      } else if (state.slug !== m[1]) {
        switchProject(m[1]);
      }
    } else if (state.open) {
      closeProject(true);
    }
  }
  window.addEventListener('popstate', function () { route(false); });
  window.addEventListener('hashchange', function () { route(false); });
  if (HASH.test(location.hash)) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { requestAnimationFrame(function () { route(true); }); });
    else requestAnimationFrame(function () { route(true); });
  }
})();
