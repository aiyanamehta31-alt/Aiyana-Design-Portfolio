/* =====================================================================
   BRANDING · one book of five brand identities, and each brand's story
   js/case-study.js loads this file (and css/worlds/branding.css) when the
   project data says world: 'branding'. The brand files listed in
   projects/branding.js load first (see `scripts`), as classic scripts, so
   everything also works from file://.

   1. Helpers                 5. Mount: turning the pages
   2. The book → HTML         6. Opening a brand (FLIP), and back
   3. A brand's story → HTML  7. The story's live parts
   4. Drawn pieces (SVG)
   ===================================================================== */
(function () {
  'use strict';

  var worlds = window.CASE_WORLDS = window.CASE_WORLDS || {};
  var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  var TURN_MS = 700;        // one page turn
  var AUTO_MS = 5000;       // auto-flip
  var IDLE_MS = 12000;      // auto-flip waits this long after any interaction

  /* ---------- 1. Helpers ---------- */
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var GAP = /\[NEEDS FROM AIYANA[^\]]*\]/g;
  function rich(value) { return esc(value).replace(GAP, function (m) { return '<mark class="br-needs">' + m + '</mark>'; }); }
  function brandsOf(p) { return p.brands.map(function (s) { return window.BRANDS && window.BRANDS[s]; }).filter(Boolean); }
  function img(b, i, opts) {
    opts = opts || {};
    return '<img' + (opts.cls ? ' class="' + opts.cls + '"' : '') + ' src="' + esc(b.images + i.src) + '" width="' + i.width + '" height="' + i.height +
      '" alt="' + (opts.decorative ? '' : esc(i.alt || '')) + '"' + (opts.eager ? '' : ' loading="lazy"') + ' decoding="async" draggable="false" />';
  }
  function zoom(b, i, group, caption, cls) {
    return '<button type="button" class="br-zoom' + (cls ? ' ' + cls : '') + '" data-zoom data-group="' + esc(group) + '" data-caption="' + esc(caption || i.caption || '') + '">' +
      '<span class="sr-only">Open larger: </span>' + img(b, i) + '</button>';
  }
  // The book: front cover, one page per brand, back cover.
  function pagesOf(p) {
    return [{ kind: 'cover' }].concat(brandsOf(p).map(function (b) { return { kind: 'brand', brand: b }; }), [{ kind: 'back' }]);
  }
  function pageName(pg) { return pg.kind === 'cover' ? 'Front cover' : pg.kind === 'back' ? 'Back cover' : pg.brand.name; }
  function themeVars(t) {
    return '--pg-ground:' + t.page.ground + ';--pg-ink:' + t.page.ink + ';--pg-accent:' + t.page.accent +
      ';--pg-heading:' + t.heading + ';--pg-body:' + t.body + ';--pg-label:' + (t.label || t.body);
  }

  var ICON = {
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14.5 6 8.5 12l6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9.5 6l6 6-6 6"/></svg>',
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4.5" y="4.5" width="6" height="6" rx="1.5"/><rect x="13.5" y="4.5" width="6" height="6" rx="1.5"/><rect x="4.5" y="13.5" width="6" height="6" rx="1.5"/><rect x="13.5" y="13.5" width="6" height="6" rx="1.5"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 6.5C10 5 7 4.6 4 5v13c3-.4 6 0 8 1.5 2-1.5 5-1.9 8-1.5V5c-3-.4-6 0-8 1.5Z"/><path d="M12 6.5v13"/></svg>',
    page: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4"/></svg>'
  };
  var SPARKLE = 'M0 -12C1 -3 3 -1 12 0C3 1 1 3 0 12C-1 3 -3 1 -12 0C-3 -1 -1 -3 0 -12Z';
  var STAR = 'M0 -10L2.9 -3.1 10 -3.1 4.3 1.2 6.2 8.1 0 4 -6.2 8.1 -4.3 1.2 -10 -3.1 -2.9 -3.1Z';
  var WISP = 'M0 0C-12 -12 12 -24 0 -38C-10 -50 8 -60 2 -72';

  /* ---------- 2. The book → HTML ---------- */
  // The little touch each brand's page makes as it lands (decorative).
  function fxHTML(effect) {
    if (effect === 'sparkle') return '<svg class="br-fx br-fx--sparkle" viewBox="-14 -14 28 28" aria-hidden="true"><path d="' + SPARKLE + '"/></svg>';
    if (effect === 'steam') return '<svg class="br-fx br-fx--steam" viewBox="-40 -80 80 84" aria-hidden="true">' +
      [-22, 0, 22].map(function (x, k) { return '<g transform="translate(' + x + ' 0)"><path style="--k:' + k + '" d="' + WISP + '"/></g>'; }).join('') + '</svg>';
    if (effect === 'contour') return '<svg class="br-fx br-fx--contour" viewBox="-100 -100 200 200" aria-hidden="true">' +
      [24, 46, 68, 90].map(function (r, k) {
        return '<path style="--k:' + k + '" d="' + blob(r, k, 48, 1.15) + '"/>';
      }).join('') + '</svg>';
    if (effect === 'bounce') return '<svg class="br-fx br-fx--stars" viewBox="-100 -100 200 200" aria-hidden="true">' +
      [[-70, -60], [64, -70], [-84, 18], [80, 30], [0, -90]].map(function (s, k) {
        return '<g transform="translate(' + s[0] + ' ' + s[1] + ')"><path style="--k:' + k + '" d="' + STAR + '"/></g>';
      }).join('') + '</svg>';
    return '';   // glitch is done to the page itself, in CSS
  }

  function faceHTML(pg, p, copy) {
    if (pg.kind === 'cover') {
      return '<div class="br-face br-face--cover"><div class="br-cv">' +
        '<p class="br-cv__title">' + esc(p.title) + '</p>' +
        '<span class="br-cv__rule" aria-hidden="true"></span>' +
        '<p class="br-cv__line">' + esc(p.cover.line) + '</p>' +
        '<ul class="br-cv__list">' + brandsOf(p).map(function (b) { return '<li>' + esc(b.name) + '</li>'; }).join('') + '</ul>' +
      '</div></div>';
    }
    if (pg.kind === 'back') {
      return '<div class="br-face br-face--back"><div class="br-cv br-cv--back">' +
        '<span class="br-cv__rule" aria-hidden="true"></span>' +
        '<p class="br-cv__thanks">' + esc(p.cover.back) + '</p>' +
        '<button type="button" class="br-round br-round--wide br-round--amber" data-act="start"' + (copy ? ' tabindex="-1"' : '') + '>' + ICON.prev + '<span>Back to the start</span></button>' +
      '</div></div>';
    }
    var b = pg.brand;
    return '<div class="br-face br-face--brand" data-brand="' + esc(b.slug) + '" style="' + esc(themeVars(b.theme)) + '">' +
      '<div class="br-pg">' +
        '<div class="br-pg__top"><p class="br-pg__name">' + esc(b.name) + '</p><p class="br-pg__tag">' + esc(b.category) + '</p></div>' +
        '<div class="br-pg__collage">' + b.book.map(function (im, k) {
          return '<span class="br-pg__img' + (k === 0 ? ' br-pg__img--big' : '') + '">' + img(b, im, { decorative: true }) + '</span>';
        }).join('') + '</div>' +
        '<p class="br-pg__line">' + esc(b.line) + '</p>' +
        '<p class="br-pg__open">Open brand <span aria-hidden="true">→</span></p>' +
      '</div>' + fxHTML(b.effect) +
    '</div>';
  }

  function pageHTML(pg, i, n, p) {
    var label = pg.kind === 'brand'
      ? pg.brand.name + ', ' + pg.brand.category + '. Page ' + (i + 1) + ' of ' + n + '. Open brand.'
      : pageName(pg) + '. Page ' + (i + 1) + ' of ' + n + '.';
    // The page is two halves hinged at the middle, so it can bend at the
    // crease as it turns. The right half is a copy, hidden from screen readers.
    return '<div class="br-page br-page--' + pg.kind + '" data-i="' + i + '"' + (pg.kind === 'brand' ? ' data-effect="' + esc(pg.brand.effect) + '"' : '') + '>' +
      '<div class="br-bob">' +
        '<div class="br-half br-half--l"' + (pg.kind === 'back' ? '' : ' aria-hidden="true"') + '><div class="br-clip">' + faceHTML(pg, p, false) + '</div><span class="br-edge"></span></div>' +
        '<div class="br-half br-half--r" aria-hidden="true"><div class="br-clip">' + faceHTML(pg, p, true) + '</div><span class="br-edge"></span></div>' +
        (pg.kind === 'back' ? '' : '<button type="button" class="br-hit" data-hit aria-label="' + esc(label) + '"></button>') +
      '</div>' +
    '</div>';
  }

  function bookHTML(p) {
    var pages = pagesOf(p);
    var brands = brandsOf(p);
    var n = pages.length;
    var nextLink = p.next ? '<a class="br-nextproject" href="#project/' + esc(p.next.slug) + '"><span>Next project</span><strong>' + esc(p.next.title) + ' →</strong></a>' : '';
    return '<div class="br-view br-view--book" data-view="book">' +
      '<section class="cs-section br-s br-landing" id="cs-cover" data-tone="studio" aria-labelledby="cs-title"><div class="br-wrap">' +
        '<header class="br-top">' +
          '<h2 class="br-title" id="cs-title">' + esc(p.title) + '</h2>' +
          '<p class="br-pageno">' + ICON.page + '<span data-pageno>Page 1 of ' + n + '</span></p>' +
        '</header>' +
        '<div class="br-book" role="region" aria-roledescription="book" aria-label="Branding book. Use the left and right arrow keys to turn the pages." data-book>' +
          '<div class="br-stage" data-stage>' + pages.map(function (pg, i) { return pageHTML(pg, i, n, p); }).join('') + '</div>' +
          '<span class="br-floor" aria-hidden="true"></span>' +
        '</div>' +
        '<p class="sr-only" aria-live="polite" data-live></p>' +
        '<ul class="br-grid" data-grid hidden>' + brands.map(function (b) {
          return '<li><button type="button" class="br-gridcard" data-open="' + esc(b.slug) + '" data-brand="' + esc(b.slug) + '" style="' + esc(themeVars(b.theme)) + '">' +
            '<span class="br-gridcard__img">' + img(b, b.book[0]) + '</span>' +
            '<span class="br-gridcard__name">' + esc(b.name) + '</span><span class="br-gridcard__tag">' + esc(b.category) + '</span>' +
            '<span class="br-gridcard__line">' + esc(b.line) + '</span></button></li>';
        }).join('') + '</ul>' +
        '<div class="br-controls">' +
          '<button type="button" class="br-round" data-act="prev" aria-label="Previous page">' + ICON.prev + '</button>' +
          '<button type="button" class="br-round br-round--wide" data-act="open">Open brand</button>' +
          '<button type="button" class="br-round" data-act="grid" aria-pressed="false" aria-label="Show all brands as cards">' + ICON.grid + '</button>' +
          '<button type="button" class="br-round" data-act="next" aria-label="Next page">' + ICON.next + '</button>' +
        '</div>' +
        '<div class="br-dots" role="group" aria-label="Jump to a brand">' + brands.map(function (b, k) {
          return '<button type="button" class="br-dot" data-go="' + (k + 1) + '" aria-label="' + esc(b.name) + '"></button>';
        }).join('') + '</div>' +
      '</div></section>' +
      '<section class="cs-section br-s br-close" data-tone="studio" aria-label="Next project"><div class="br-wrap">' + nextLink +
        '<a class="br-back" href="#work" data-cs-back>Back to all work</a></div></section>' +
    '</div>';
  }

  /* ---------- 3. A brand's story → HTML ---------- */
  function section(b, id, tone, inner) {
    return '<section class="cs-section br-s br-b br-b--' + id + '" data-tone="b-' + b.slug + '-' + tone + '" aria-labelledby="br-h-' + id + '"><div class="br-wrap">' + inner + '</div></section>';
  }

  function storyHTML(b, p) {
    var brands = brandsOf(p);
    var h = '';
    // 1. Hero
    h += '<section class="cs-section br-s br-b br-b--hero" data-tone="b-' + b.slug + '-ground" aria-labelledby="br-name"><div class="br-wrap">' +
      '<button type="button" class="br-backlink" data-act="book">' + ICON.book + '<span>Back to the book</span></button>' +
      '<div class="br-hero">' +
        '<div class="br-hero__text">' +
          '<h3 class="br-name" id="br-name" tabindex="-1">' + esc(b.name) + '</h3>' +
          '<p class="br-line">' + esc(b.line) + '</p>' +
          '<dl class="br-facts">' + b.facts.map(function (f) { return '<div><dt>' + esc(f.label) + '</dt><dd>' + rich(f.value) + '</dd></div>'; }).join('') + '</dl>' +
        '</div>' +
        '<figure class="br-hero__img" data-hero>' + zoom(b, b.hero, 'hero', b.name) + '</figure>' +
      '</div></div></section>';
    // 2. The idea
    h += section(b, 'idea', 'alt',
      '<div class="br-idea"><h4 class="br-h br-h--small" id="br-h-idea">The idea</h4><p class="br-idea__text">' + rich(b.idea) + '</p></div>');
    // 3. The logo
    var lg = b.logo;
    h += section(b, 'logo', 'ground',
      '<h4 class="br-h" id="br-h-logo">The logo</h4>' +
      '<div class="br-logo br-logo--' + lg.primary.length + '">' + lg.primary.map(function (im, k) {
        return '<figure class="br-logo__fig' + (k === 0 ? ' br-logo__fig--main' : '') + '">' + zoom(b, im, 'logo', im.caption) + '<figcaption>' + esc(im.caption) + '</figcaption></figure>';
      }).join('') + '</div>' +
      (lg.explorations && lg.explorations.length
        ? '<div class="br-explore"><h5 class="br-explore__h">Other explorations</h5><ul class="br-explore__row">' + lg.explorations.map(function (im) {
            return '<li><figure>' + zoom(b, im, 'logo', im.caption) + '<figcaption>' + esc(im.caption) + '</figcaption></figure></li>';
          }).join('') + '</ul></div>'
        : ''));
    // 4. Colour
    h += section(b, 'colour', 'ground',
      '<h4 class="br-h" id="br-h-colour">Colour</h4>' +
      '<ul class="br-swatches br-swatches--' + b.colours.length + '">' + b.colours.map(function (c) {
        return '<li><button type="button" class="br-swatch" data-copy="' + esc(c.hex) + '" style="--sw:' + esc(c.hex) + '" aria-label="Copy ' + esc(c.name + ', ' + c.hex) + '">' +
          '<span class="br-swatch__chip" aria-hidden="true"><span class="br-swatch__done">Copied</span></span>' +
          '<span class="br-swatch__name">' + esc(c.name) + '</span><span class="br-swatch__hex">' + esc(c.hex) + '</span></button></li>';
      }).join('') + '</ul><p class="br-hint">Click a colour to copy its hex code.</p><p class="sr-only" aria-live="polite" data-copied></p>');
    // 5. Signature interaction
    var sg = b.signature;
    h += section(b, 'sig', sg.tone || (sg.kind === 'mascot' ? 'alt' : 'ground'),
      '<div class="br-sig br-sig--' + sg.kind + '">' +
        '<div class="br-sig__text"><h4 class="br-h" id="br-h-sig">' + esc(sg.heading) + '</h4><p class="br-text">' + esc(sg.text) + '</p></div>' +
        '<div class="br-sig__stage">' + signatureHTML(b) + '</div>' +
      '</div>');
    // 6. Applications
    h += section(b, 'apps', 'ground',
      '<h4 class="br-h" id="br-h-apps">Applications</h4>' +
      '<ul class="br-apps">' + b.gallery.map(function (im) {
        return '<li class="br-apps__item br-apps__item--' + (im.size || 'small') + '">' + zoom(b, im, 'apps', im.caption) +
          '<p class="br-caption-sm">' + esc(im.caption) + (im.note ? ' <span class="br-note">' + rich(im.note) + '</span>' : '') + '</p></li>';
      }).join('') + '</ul>');
    // 7. Reflection, then on to the next brand or back to the book
    var next = brands[(brands.indexOf(b) + 1) % brands.length];
    h += section(b, 'reflect', 'alt',
      '<h4 class="br-h" id="br-h-reflect">Looking back</h4>' +
      '<div class="br-points">' + b.reflection.map(function (pt) { return '<div><h5>' + esc(pt.title) + '</h5><p>' + rich(pt.text) + '</p></div>'; }).join('') + '</div>' +
      '<div class="br-endnav">' +
        (next && next !== b ? '<button type="button" class="br-nextbrand" data-open="' + esc(next.slug) + '"><span>Next brand</span><strong>' + esc(next.name) + ' →</strong></button>' : '') +
        '<button type="button" class="br-backlink br-backlink--big" data-act="book">' + ICON.book + '<span>Back to the book</span></button>' +
      '</div>');
    return h;
  }

  /* ---------- 4. Drawn pieces (SVG) ---------- */
  // A closed, wobbly ring: contour lines and ripples.
  function ringPoints(r, k, steps, stretch, cx, cy) {
    var pts = [];
    for (var s = 0; s < steps; s++) {
      var t = s / steps * Math.PI * 2;
      var rr = r * (1 + 0.09 * Math.sin(3 * t + k * 0.8) + 0.05 * Math.sin(5 * t + k * 1.7));
      pts.push([(cx || 0) + Math.cos(t) * rr * stretch, (cy || 0) + Math.sin(t) * rr]);
    }
    return pts;
  }
  function smooth(pts) {
    // Closed Catmull-Rom curve through the points.
    var n = pts.length, d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
        (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d + 'Z';
  }
  function blob(r, k, steps, stretch) { return smooth(ringPoints(r, k, steps, stretch)); }

  // Velvet Vine: the vine, redrawn from the brand's illustration so it can grow.
  var LEAF = 'M0 0C20 -19 60 -20 86 0C60 20 20 19 0 0Z';
  function vineSVG() {
    var leaves = [[108, 252, -24], [97, 206, 204], [113, 152, -38], [102, 104, 214], [118, 46, -72]];
    return '<svg class="br-vine" viewBox="0 0 220 410" aria-hidden="true" focusable="false">' +
      '<path class="br-vine__stem" pathLength="1" d="M100 400C94 344 122 302 108 252S80 172 112 122S142 54 118 14" />' +
      '<path class="br-vine__stem br-vine__curl" pathLength="1" d="M104 334C80 330 76 302 95 300C108 299 109 315 98 316" />' +
      leaves.map(function (l, i) {
        return '<g transform="translate(' + l[0] + ' ' + l[1] + ') rotate(' + l[2] + ')"><g class="br-vine__leaf" style="--i:' + i + '">' +
          '<path class="br-vine__blade" d="' + LEAF + '" /><path class="br-vine__rib" d="M5 0L78 0" /></g></g>';
      }).join('') +
      '<g class="br-vine__spark" transform="translate(170 300)"><path d="' + SPARKLE + '" /></g>' +
      '<g class="br-vine__spark br-vine__spark--b" transform="translate(48 120) scale(0.6)"><path d="' + SPARKLE + '" /></g>' +
      '</svg>';
  }

  // KOMA: the bun icon, line by line, under rising steam.
  function bunSVG() {
    var lines = [
      'M52 214C40 150 90 104 150 102C210 104 260 150 248 214',          // dome
      'M138 106C136 94 164 94 162 106',                                 // knob
      'M140 110C116 124 104 150 110 176C118 160 128 136 146 114',       // pleats
      'M160 110C184 124 196 150 190 176C182 160 172 136 154 114',
      'M150 112C148 136 150 156 150 172',
      'M38 214C70 232 230 232 262 214',                                 // base
      'M38 214C30 242 74 254 150 254C226 254 270 242 262 214'
    ];
    return '<svg class="br-bun" viewBox="0 0 300 270" aria-hidden="true" focusable="false">' +
      '<g class="br-bun__steam">' + [118, 150, 182].map(function (x, k) {
        return '<g transform="translate(' + x + ' 92)"><path style="--k:' + k + '" d="' + WISP + '"/></g>';
      }).join('') + '</g>' +
      lines.map(function (d, k) { return '<path class="br-bun__line" style="--k:' + k + '" pathLength="1" d="' + d + '"/>'; }).join('') +
      '</svg>';
  }

  // Meridian: contour rings around the summit, the range, and the trail up.
  var MAP = { w: 800, h: 440, cx: 470, cy: 168, rings: 11 };
  function mapSVG() {
    var rings = '';
    for (var k = 0; k < MAP.rings; k++) {
      rings += '<path class="br-map__ring" style="--k:' + k + '" pathLength="1" d="' + smooth(ringPoints(22 + k * 34, k, 72, 1.45, MAP.cx, MAP.cy)) + '"/>';
    }
    return '<svg class="br-map" viewBox="0 0 ' + MAP.w + ' ' + MAP.h + '" aria-hidden="true" focusable="false">' +
      '<g data-rings>' + rings + '</g>' +
      '<path class="br-map__range" pathLength="1" d="M250 330L340 236L376 266L470 148L540 250L580 218L690 330" />' +
      '<path class="br-map__trail" pathLength="1" d="M380 438C340 404 432 384 404 352C380 326 452 312 438 280C424 252 470 236 458 206C450 186 472 170 470 152" />' +
      '<circle class="br-map__peak" cx="470" cy="148" r="5" />' +
      '</svg>';
  }

  // Pebble & Co.: the mascot, drawn from the brand's illustration.
  function mascotSVG() {
    return '<svg class="br-mascot" viewBox="0 0 320 300" aria-hidden="true" focusable="false">' +
      '<g class="br-mascot__body">' +
        '<g class="br-mascot__arm br-mascot__arm--l"><path d="M96 168C74 158 60 140 54 122" /><circle cx="50" cy="114" r="14" /></g>' +
        '<g class="br-mascot__arm br-mascot__arm--r"><path d="M224 168C246 158 260 140 266 122" /><circle cx="270" cy="114" r="14" /></g>' +
        '<path class="br-mascot__leg" d="M134 248L130 270" /><ellipse class="br-mascot__foot" cx="122" cy="276" rx="18" ry="11" />' +
        '<path class="br-mascot__leg" d="M186 248L190 270" /><ellipse class="br-mascot__foot" cx="198" cy="276" rx="18" ry="11" />' +
        '<path class="br-mascot__shell" d="M160 54C112 54 86 120 84 168C82 220 116 250 160 250C204 250 238 220 236 168C234 120 208 54 160 54Z" />' +
        '<g class="br-mascot__face">' +
          '<g class="br-mascot__eyes"><ellipse cx="140" cy="150" rx="7" ry="11" /><ellipse cx="180" cy="150" rx="7" ry="11" /></g>' +
          '<circle class="br-mascot__cheek" cx="124" cy="172" r="9" /><circle class="br-mascot__cheek" cx="196" cy="172" r="9" />' +
          '<path class="br-mascot__smile" d="M146 176Q160 190 174 176" />' +
        '</g>' +
      '</g></svg>';
  }

  function signatureHTML(b) {
    var sg = b.signature;
    if (sg.kind === 'vine') {
      return '<div class="br-vinebox" data-draw>' + vineSVG() + '</div>' +
        '<div class="br-tester">' +
          '<label class="br-tester__field"><span>Type a word</span><input type="text" data-tester maxlength="32" value="' + esc(sg.sample) + '" autocomplete="off" spellcheck="false" /></label>' +
          '<p class="br-tester__label">' + esc(b.theme.headingName) + '</p><p class="br-tester__sample br-tester__sample--h" data-sample>' + esc(sg.sample) + '</p>' +
          '<p class="br-tester__label">' + esc(b.theme.bodyName) + '</p><p class="br-tester__sample br-tester__sample--b" data-sample>' + esc(sg.sample) + '</p>' +
          '<p class="br-quiet">Headings are set in Gilda Display, the closest free match to the wordmark’s serif.</p>' +
        '</div>';
    }
    if (sg.kind === 'tune') {
      var w = b.logo.primary[0];
      return '<div class="br-tune" data-tune>' +
          '<div class="br-tune__screen">' + img(b, w, { cls: 'br-tune__img' }) + '<canvas class="br-tune__noise" width="160" height="58" aria-hidden="true"></canvas><span class="br-tune__scan" aria-hidden="true"></span></div>' +
          '<button type="button" class="br-round br-round--wide" data-retune>Lose the signal</button>' +
        '</div>';
    }
    if (sg.kind === 'steam') return '<div class="br-bunbox" data-draw>' + bunSVG() + '</div>';
    if (sg.kind === 'contour') return '<div class="br-mapbox" data-draw data-map>' + mapSVG() + '</div>';
    if (sg.kind === 'mascot') return '<button type="button" class="br-mascotbox" data-mascot aria-label="The pebble mascot. Click to make it bounce and wave.">' + mascotSVG() + '</button>';
    return '';
  }

  function render(p) {
    return '<div class="br-world" data-br-world>' + bookHTML(p) + '<div class="br-view br-view--story" data-view="story" hidden></div></div>';
  }

  /* ---------- 5. Mount: turning the pages ---------- */
  function mount(ctx) {
    var p = ctx.project;
    var scroller = ctx.scroller, content = ctx.content, sheet = ctx.sheet;
    var reduce = ctx.reduceMotion;
    var world = content.querySelector('[data-br-world]');
    var bookView = world.querySelector('[data-view="book"]');
    var storyView = world.querySelector('[data-view="story"]');
    var region = world.querySelector('[data-book]');
    var stage = world.querySelector('[data-stage]');
    var pageEls = Array.prototype.slice.call(world.querySelectorAll('.br-page'));
    var pages = pagesOf(p);
    var n = pageEls.length;
    var cur = 0;
    var cleanups = [], timers = [];
    function on(el, type, fn, opts) { el.addEventListener(type, fn, opts); cleanups.push(function () { el.removeEventListener(type, fn, opts); }); }
    function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }

    if (reduce) world.classList.add('is-reduced');
    world.classList.add('is-live');

    // Every brand's fonts, so each page shows in its own type.
    var fontsLoaded = {};
    function loadFonts(b) {
      if (!b.theme.fonts || fontsLoaded[b.theme.fonts]) return;
      fontsLoaded[b.theme.fonts] = true;
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = b.theme.fonts;
      document.head.appendChild(link);
    }
    brandsOf(p).forEach(loadFonts);

    /* The book's geometry. The current page is flat in the middle, its two
       halves bent a few degrees at the crease. The rest stand in a stack on
       each side, turned about 76° on their vertical axis so only a slice
       shows, each a little further out, smaller and darker. */
    function geometry(i) {
      var narrow = region.clientWidth < 640;
      var maxSide = narrow ? 2 : 5;
      var w = pageEls[0].offsetWidth;
      var d = i - cur, a = Math.abs(d), s = d < 0 ? -1 : 1;
      if (!a) return { x: 0, z: 0, ry: 0, scale: 1, shade: 0, a: 0, hide: false, bend: 4 };
      var scale = 1 - Math.min(a, maxSide) * (narrow ? 0.05 : 0.035);
      var slice = w * 0.5 * Math.cos(76 * Math.PI / 180) * scale;
      var inner = w * 0.5 + (narrow ? 8 : 14) + (a - 1) * (narrow ? 9 : 17);
      return {
        x: s * (inner + slice),
        z: -(w * 0.5 * Math.sin(76 * Math.PI / 180) * scale) - a * 18,
        ry: s * 76,
        scale: scale,
        shade: Math.min(0.72, 0.16 + a * 0.1),
        a: a,
        hide: a > maxSide,
        bend: 0
      };
    }
    function layout(instant) {
      pageEls.forEach(function (el, i) {
        var g = geometry(i);
        el.style.transition = instant || reduce ? 'none' : '';
        el.style.transform = 'translate3d(' + g.x.toFixed(1) + 'px,0,' + g.z.toFixed(1) + 'px) rotateY(' + g.ry + 'deg) scale(' + g.scale.toFixed(3) + ')';
        el.style.opacity = g.hide ? '0' : '1';
        el.style.visibility = g.hide ? 'hidden' : '';
        el.style.setProperty('--shade', g.shade.toFixed(2));
        el.style.setProperty('--bend', g.bend + 'deg');
        el.style.zIndex = String(50 - g.a);
        el.classList.toggle('is-centre', g.a === 0);
        el.classList.toggle('is-left', i < cur);
        var hit = el.querySelector('[data-hit]');
        if (hit) hit.tabIndex = g.a === 0 ? 0 : -1;
        el.querySelector('.br-half--l').toggleAttribute('inert', g.a !== 0 && pages[i].kind === 'back');
      });
      if (instant && !reduce) {
        void stage.offsetWidth;
        pageEls.forEach(function (el) { el.style.transition = ''; });
      }
    }

    // The bend at the crease while a page turns, so for a moment the
    // incoming page shows as a two-page spread before it settles flat.
    function bendTurn(from, to, dir) {
      if (reduce || !Element.prototype.animate) return;
      var out = pageEls[from], inc = pageEls[to];
      function half(el, side) { return el.querySelector('.br-half--' + side); }
      var opts = { duration: TURN_MS, easing: EASE };
      if (dir > 0) {
        half(out, 'r').animate([{ transform: 'rotateY(-4deg)' }, { transform: 'rotateY(-40deg)', offset: 0.4 }, { transform: 'rotateY(0deg)' }], opts);
        half(inc, 'l').animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(62deg)', offset: 0.42 }, { transform: 'rotateY(4deg)' }], opts);
        half(inc, 'r').animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-4deg)' }], { duration: TURN_MS, easing: EASE, delay: 90, fill: 'backwards' });
      } else {
        half(out, 'l').animate([{ transform: 'rotateY(4deg)' }, { transform: 'rotateY(40deg)', offset: 0.4 }, { transform: 'rotateY(0deg)' }], opts);
        half(inc, 'r').animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(-62deg)', offset: 0.42 }, { transform: 'rotateY(-4deg)' }], opts);
        half(inc, 'l').animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(4deg)' }], { duration: TURN_MS, easing: EASE, delay: 90, fill: 'backwards' });
      }
    }

    var pageno = world.querySelector('[data-pageno]');
    var live = world.querySelector('[data-live]');
    var dots = Array.prototype.slice.call(world.querySelectorAll('.br-dot'));
    var openBtn = world.querySelector('[data-act="open"]');
    var prevBtn = world.querySelector('[data-act="prev"]');
    var nextBtn = world.querySelector('[data-act="next"]');
    function describe() {
      var pg = pages[cur];
      pageno.textContent = 'Page ' + (cur + 1) + ' of ' + n;
      live.textContent = 'Page ' + (cur + 1) + ' of ' + n + ': ' + pageName(pg) + (pg.kind === 'brand' ? ', ' + pg.brand.category : '');
      dots.forEach(function (d) {
        var on = Number(d.getAttribute('data-go')) === cur;
        d.classList.toggle('is-on', on);
        if (on) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      openBtn.disabled = pg.kind !== 'brand' || gridOn;
      prevBtn.disabled = gridOn || cur === 0;
      nextBtn.disabled = gridOn || cur === n - 1;
    }

    // Each brand's page makes its small signature touch as it lands.
    var landTimer = 0;
    function land() {
      clearTimeout(landTimer);
      pageEls.forEach(function (el) { el.classList.remove('is-landed'); });
      if (reduce || pages[cur].kind !== 'brand') return;
      var el = pageEls[cur];
      landTimer = later(function () {
        void el.offsetWidth;
        el.classList.add('is-landed');
        landTimer = later(function () { el.classList.remove('is-landed'); }, 1100);
      }, TURN_MS - 220);
    }

    function go(i, user) {
      i = Math.max(0, Math.min(n - 1, i));
      if (i === cur) { if (user) interacted(); return; }
      var from = cur, dir = i > cur ? 1 : -1;
      cur = i;
      if (reduce) {
        stage.animate && stage.animate([{ opacity: 0.15 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
        layout(true);
      } else {
        layout(false);
        if (Math.abs(i - from) === 1) bendTurn(from, i, dir);
      }
      describe();
      land();
      if (user) interacted();
    }

    /* Auto-flip every 5 s; paused on hover and for a while after any
       interaction. After the back cover it goes back to the start. */
    var hovering = false, idleUntil = 0;
    function tick() {
      if (reduce || hovering || gridOn || document.hidden || !storyView.hidden || Date.now() < idleUntil) return;
      if (!sheet.isConnected || sheet.closest('[hidden]')) return;
      go(cur === n - 1 ? 0 : cur + 1, false);
    }
    if (!reduce) { var auto = setInterval(tick, AUTO_MS); cleanups.push(function () { clearInterval(auto); }); }
    function interacted() { idleUntil = Date.now() + IDLE_MS; }
    on(region, 'pointerenter', function () { hovering = true; });
    on(region, 'pointerleave', function () { hovering = false; });
    on(region, 'focusin', interacted);

    // Clicks: a side page comes to the middle; the middle page opens its brand.
    var dragged = false;
    on(region, 'click', function (e) {
      var page = e.target.closest('.br-page');
      if (!page || dragged) return;
      if (e.target.closest('[data-act]')) return;   // the back cover's own button
      var i = Number(page.getAttribute('data-i'));
      if (i !== cur) { go(i, true); return; }
      if (pages[i].kind === 'brand') openBrand(pages[i].brand.slug, { from: page, history: 'push' });
      else if (pages[i].kind === 'cover') go(1, true);
    });
    // Keyboard: arrow keys turn the pages anywhere on the book view (outside fields).
    on(sheet, 'keydown', function (e) {
      if (bookView.hidden || gridOn || e.defaultPrevented) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (document.querySelector('.cs-lightbox:not([hidden])')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1, true); keepFocus(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1, true); keepFocus(); }
    });
    function keepFocus() {
      if (!region.contains(document.activeElement)) return;
      var hit = pageEls[cur].querySelector('[data-hit]') || pageEls[cur].querySelector('[data-act="start"]');
      if (hit) hit.focus({ preventScroll: true });
    }
    // Horizontal wheel or trackpad.
    var wheelAcc = 0, wheelLock = 0;
    on(region, 'wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (Date.now() < wheelLock) return;
      wheelAcc += e.deltaX;
      if (Math.abs(wheelAcc) > 40) { go(cur + (wheelAcc > 0 ? 1 : -1), true); wheelAcc = 0; wheelLock = Date.now() + 450; }
    }, { passive: false });
    // Drag and swipe.
    var startX = null;
    on(region, 'pointerdown', function (e) { startX = e.clientX; dragged = false; });
    on(region, 'pointermove', function (e) { if (startX !== null && Math.abs(e.clientX - startX) > 8) dragged = true; });
    on(region, 'pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1), true);
      setTimeout(function () { dragged = false; }, 0);
    });
    on(region, 'pointercancel', function () { startX = null; dragged = false; });

    // The buttons and dots under the book, the grid, and the back cover's button.
    var gridOn = false;
    var grid = world.querySelector('[data-grid]');
    var dotsRow = world.querySelector('.br-dots');
    on(bookView, 'click', function (e) {
      var b = e.target.closest('[data-act], [data-open], [data-go]');
      if (!b || !bookView.contains(b)) return;
      if (b.hasAttribute('data-open')) { openBrand(b.getAttribute('data-open'), { from: b.querySelector('img'), history: 'push' }); return; }
      if (b.hasAttribute('data-go')) { go(Number(b.getAttribute('data-go')), true); return; }
      var act = b.getAttribute('data-act');
      if (act === 'prev') go(cur - 1, true);
      else if (act === 'next') go(cur + 1, true);
      else if (act === 'start') { e.stopPropagation(); go(0, true); keepFocus(); }
      else if (act === 'open') { if (pages[cur].kind === 'brand') openBrand(pages[cur].brand.slug, { from: pageEls[cur], history: 'push' }); }
      else if (act === 'grid') {
        gridOn = !gridOn;
        b.setAttribute('aria-pressed', String(gridOn));
        b.setAttribute('aria-label', gridOn ? 'Back to the book' : 'Show all brands as cards');
        grid.hidden = !gridOn;
        region.hidden = gridOn;
        dotsRow.hidden = gridOn;
        world.querySelector('.br-pageno').hidden = gridOn;
        describe();
        if (!gridOn) layout(true);
        interacted();
        ctx.measure();
      }
    });

    /* ---------- 6. Opening a brand (FLIP), and back ---------- */
    var openSlug = null;
    // A brand opened from the book gets its own history entry, marked
    // { layer: 1 }, so the back button returns to the book.
    function ownEntry() { return !!(history.state && history.state.layer); }
    function rgb(hex) { var h = hex.replace('#', ''); return [0, 2, 4].map(function (k) { return parseInt(h.slice(k, k + 2), 16); }).join(', '); }
    function themeBrand(b) {
      var t = b.theme;
      var rs = document.documentElement.style;
      // The glass takes the brand's colours (see tone() in js/case-study.js).
      [['ground', t.ground, t.ink, t.accent], ['alt', t.alt.ground, t.alt.ink, t.alt.ink]].forEach(function (x) {
        var key = 'b-' + b.slug + '-' + x[0];
        rs.setProperty('--cs-' + key, rgb(x[1]));
        rs.setProperty('--cs-alpha-' + key, '0.97');
        rs.setProperty('--cs-ink-' + key, x[2]);
        rs.setProperty('--cs-amber-' + key, x[3]);
      });
      storyView.setAttribute('data-brand', b.slug);
      var sv = storyView.style;
      sv.setProperty('--b-ground', t.ground);
      sv.setProperty('--b-ink', t.ink);
      sv.setProperty('--b-accent', t.accent);
      sv.setProperty('--b-alt', t.alt.ground);
      sv.setProperty('--b-alt-ink', t.alt.ink);
      sv.setProperty('--b-heading', t.heading);
      sv.setProperty('--b-body', t.body);
      sv.setProperty('--b-label', t.label || t.body);
      loadFonts(b);
    }

    // A flat copy of the page that grows into the story, or shrinks back.
    function ghostFrom(el) {
      var face = el.querySelector('.br-face');
      var g = document.createElement('div');
      g.className = 'br-ghost';
      g.setAttribute('aria-hidden', 'true');
      if (face) {
        var copy = face.cloneNode(true);
        copy.classList.add('br-ghost__face');
        g.appendChild(copy);
        g.style.background = getComputedStyle(face).backgroundColor;
      }
      return g;
    }
    function rectIn(r, box) { return { left: (r.left - box.left) + 'px', top: (r.top - box.top) + 'px', width: r.width + 'px', height: r.height + 'px' }; }
    function grow(fromRect, ghost, b, reverse) {
      var box = sheet.getBoundingClientRect();
      var view = scroller.getBoundingClientRect();
      var small = rectIn(fromRect, box), big = rectIn(view, box);
      small.borderRadius = '14px'; big.borderRadius = '0px';
      sheet.appendChild(ghost);
      var face = ghost.querySelector('.br-ghost__face');
      if (face) face.style.width = fromRect.width + 'px';
      var bg = b.theme.ground;
      var frames = reverse
        ? [Object.assign({}, big, { backgroundColor: bg }), Object.assign({}, small, { backgroundColor: ghost.style.background || bg })]
        : [Object.assign({}, small, { backgroundColor: ghost.style.background || bg }), Object.assign({}, big, { backgroundColor: bg })];
      var anim = ghost.animate(frames, { duration: TURN_MS, easing: EASE, fill: 'forwards' });
      if (face) face.animate(reverse ? [{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0, offset: 0.45 }, { opacity: 0 }], { duration: TURN_MS, easing: 'ease', fill: 'forwards' });
      return anim.finished.then(function () {
        if (reverse) { ghost.remove(); return; }
        return ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease', fill: 'forwards' }).finished.then(function () { ghost.remove(); });
      }, function () { ghost.remove(); });
    }

    var busy = false;
    function openBrand(slug, opts) {
      opts = opts || {};
      var b = window.BRANDS && window.BRANDS[slug];
      if (!b || busy) return;
      var fromEl = opts.from && !reduce && opts.from.closest ? opts.from : null;
      var fromRect = fromEl ? (fromEl.querySelector('.br-bob') || fromEl).getBoundingClientRect() : null;
      var ghost = fromEl && fromEl.classList.contains('br-page') ? ghostFrom(fromEl) : null;
      var wasStory = !storyView.hidden;
      themeBrand(b);
      unmountStory();
      storyView.innerHTML = storyHTML(b, p);
      storyView.hidden = false;
      bookView.hidden = true;
      openSlug = slug;
      var i = pages.findIndex(function (pg) { return pg.brand === b; });
      if (i >= 0) cur = i;
      scroller.scrollTop = 0;
      if (ctx.lenis) ctx.lenis.scrollTo(0, { immediate: true, force: true });
      var hash = '#project/branding/' + slug;
      if (opts.history === 'push' && location.hash !== hash) history.pushState({ csProject: 'branding', brand: slug, layer: 1 }, '', hash);
      else if (opts.history !== 'none' && location.hash !== hash) history.replaceState({ csProject: 'branding', brand: slug, layer: ownEntry() ? 1 : 0 }, '', hash);
      ctx.rescanZoom();
      ctx.measure();
      mountStory(b);
      var heading = storyView.querySelector('.br-name');
      if (heading) heading.focus({ preventScroll: true });
      if (fromRect && fromRect.width) {
        busy = true;
        if (!ghost) { ghost = document.createElement('div'); ghost.className = 'br-ghost'; }
        storyView.animate([{ opacity: 0 }, { opacity: 0, offset: 0.35 }, { opacity: 1 }], { duration: TURN_MS, easing: 'ease' });
        grow(fromRect, ghost, b, false).then(function () { busy = false; });
      } else if (!reduce) {
        storyView.animate([{ opacity: 0 }, { opacity: 1 }], { duration: wasStory ? 360 : 450, easing: EASE });
      }
    }

    function showBook(opts) {
      opts = opts || {};
      if (storyView.hidden || busy) return;
      var b = window.BRANDS[openSlug];
      var fromStory = !reduce && b ? storyView : null;
      var ghost = null, bigRect = null;
      if (fromStory) {
        ghost = document.createElement('div');
        ghost.className = 'br-ghost';
        bigRect = scroller.getBoundingClientRect();
      }
      unmountStory();
      storyView.hidden = true;
      storyView.innerHTML = '';
      bookView.hidden = false;
      if (gridOn) world.querySelector('[data-act="grid"]').click();
      openSlug = null;
      scroller.scrollTop = 0;
      if (ctx.lenis) ctx.lenis.scrollTo(0, { immediate: true, force: true });
      if (opts.history === 'replace' && location.hash !== '#project/branding') history.replaceState({ csProject: 'branding' }, '', '#project/branding');
      ctx.rescanZoom();
      ctx.measure();
      layout(true);
      describe();
      interacted();
      var page = pageEls[cur];
      var hit = page.querySelector('[data-hit]');
      if (hit) hit.focus({ preventScroll: true });
      if (fromStory && bigRect) {
        // The story shrinks back into its page.
        var target = page.querySelector('.br-bob').getBoundingClientRect();
        ghost = ghostFrom(page);
        busy = true;
        page.style.opacity = '0';
        grow(target, ghost, b, true).then(function () { page.style.opacity = ''; busy = false; });
      }
    }
    function backToBook() {
      // Opened with its own history entry: let the back button and this agree.
      if (ownEntry()) history.back();
      else showBook({ history: 'replace' });
    }
    on(storyView, 'click', function (e) {
      var b = e.target.closest('[data-act="book"], [data-open]');
      if (!b) return;
      if (b.hasAttribute('data-open')) openBrand(b.getAttribute('data-open'), { history: 'replace' });
      else backToBook();
    });

    /* ---------- 7. The story's live parts ---------- */
    var storyCleanups = [];
    function onS(el, type, fn, opts) { el.addEventListener(type, fn, opts); storyCleanups.push(function () { el.removeEventListener(type, fn, opts); }); }
    function unmountStory() { storyCleanups.forEach(function (fn) { fn(); }); storyCleanups = []; }

    function mountStory(b) {
      // Drawings run once each, as they come into view.
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
          if (e.target.hasAttribute('data-tune')) tuneIn(e.target);
        });
      }, { root: scroller, threshold: 0.3 });
      Array.prototype.forEach.call(storyView.querySelectorAll('[data-draw], [data-tune]'), function (el) { io.observe(el); });
      storyCleanups.push(function () { io.disconnect(); });

      // Colour: click to copy the hex code.
      var copied = storyView.querySelector('[data-copied]');
      Array.prototype.forEach.call(storyView.querySelectorAll('[data-copy]'), function (sw) {
        onS(sw, 'click', function () {
          var hex = sw.getAttribute('data-copy');
          var done = function () {
            sw.classList.add('is-copied');
            if (copied) copied.textContent = hex + ' copied';
            later(function () { sw.classList.remove('is-copied'); }, 1600);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(hex).then(done, done);
          else done();
        });
      });

      // Velvet Vine: the type tester.
      var tester = storyView.querySelector('[data-tester]');
      if (tester) onS(tester, 'input', function () {
        var text = tester.value || b.signature.sample;
        Array.prototype.forEach.call(storyView.querySelectorAll('[data-sample]'), function (s) { s.textContent = text; });
      });

      // STATIC.: tune in again.
      var retune = storyView.querySelector('[data-retune]');
      if (retune) onS(retune, 'click', function () { tuneIn(storyView.querySelector('[data-tune]'), true); });

      // Meridian: the contour lines bend away from the pointer.
      var mapBox = storyView.querySelector('[data-map]');
      if (mapBox && !reduce) bendMap(mapBox);

      // Pebble & Co.: the mascot blinks, watches the pointer, and waves.
      var mascot = storyView.querySelector('[data-mascot]');
      if (mascot) liveMascot(mascot);
    }

    // STATIC.: the wordmark comes through TV static.
    var tuneRaf = 0;
    function tuneIn(box, again) {
      var canvas = box.querySelector('canvas');
      var pic = box.querySelector('.br-tune__img');
      if (reduce || !canvas || !canvas.getContext) { box.classList.add('is-tuned'); return; }
      cancelAnimationFrame(tuneRaf);
      var g = canvas.getContext('2d');
      var data = g.createImageData(canvas.width, canvas.height);
      var start = performance.now(), dur = again ? 1500 : 1800;
      box.classList.remove('is-tuned');
      (function frame(now) {
        var t = Math.min(1, (now - start) / dur);
        var left = 1 - t;
        for (var k = 0; k < data.data.length; k += 4) {
          var v = Math.random() * 255;
          data.data[k] = data.data[k + 1] = data.data[k + 2] = v;
          data.data[k + 3] = 255 * Math.min(1, left * 1.4) * (Math.random() < 0.85 ? 1 : 0.4);
        }
        g.putImageData(data, 0, 0);
        var jitter = left > 0.08 && Math.random() < 0.6 ? (Math.random() - 0.5) * 28 * left : 0;
        pic.style.transform = 'translateX(' + jitter.toFixed(1) + 'px)';
        pic.style.opacity = String(Math.min(1, 0.15 + t * 1.2));
        pic.style.filter = left > 0.05 ? 'drop-shadow(' + (5 * left).toFixed(1) + 'px 0 rgba(249,13,140,0.85)) drop-shadow(' + (-5 * left).toFixed(1) + 'px 0 rgba(0,229,255,0.7))' : '';
        if (t < 1) tuneRaf = requestAnimationFrame(frame);
        else { g.clearRect(0, 0, canvas.width, canvas.height); pic.style.transform = pic.style.filter = ''; box.classList.add('is-tuned'); }
      })(start);
      storyCleanups.push(function () { cancelAnimationFrame(tuneRaf); });
    }

    // Meridian: each ring is redrawn with its points pushed away from the pointer.
    function bendMap(box) {
      var svg = box.querySelector('svg');
      var rings = Array.prototype.slice.call(svg.querySelectorAll('.br-map__ring'));
      var base = rings.map(function (el, k) { return ringPoints(22 + k * 34, k, 72, 1.45, MAP.cx, MAP.cy); });
      var pointer = null, raf = 0;
      function draw() {
        raf = 0;
        rings.forEach(function (el, k) {
          var pts = base[k].map(function (pt) {
            if (!pointer) return pt;
            var dx = pt[0] - pointer[0], dy = pt[1] - pointer[1];
            var dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist > 130) return pt;
            var f = Math.pow(1 - dist / 130, 2) * 34;
            return [pt[0] + dx / dist * f, pt[1] + dy / dist * f];
          });
          el.setAttribute('d', smooth(pts));
        });
      }
      onS(svg, 'pointermove', function (e) {
        var r = svg.getBoundingClientRect();
        pointer = [(e.clientX - r.left) / r.width * MAP.w, (e.clientY - r.top) / r.height * MAP.h];
        if (!raf) raf = requestAnimationFrame(draw);
      });
      onS(svg, 'pointerleave', function () { pointer = null; if (!raf) raf = requestAnimationFrame(draw); });
      storyCleanups.push(function () { cancelAnimationFrame(raf); });
    }

    // Pebble & Co.: blink now and then, look towards the pointer, wave on click.
    function liveMascot(btn) {
      var face = btn.querySelector('.br-mascot__face');
      var section = btn.closest('section');
      if (!reduce) {
        var blink = setInterval(function () {
          btn.classList.add('is-blinking');
          later(function () { btn.classList.remove('is-blinking'); }, 160);
        }, 3200);
        storyCleanups.push(function () { clearInterval(blink); });
        onS(section, 'pointermove', function (e) {
          var r = btn.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.45);
          var d = Math.sqrt(dx * dx + dy * dy) || 1, m = Math.min(1, d / 300);
          face.style.transform = 'translate(' + (dx / d * 9 * m).toFixed(1) + 'px,' + (dy / d * 6 * m).toFixed(1) + 'px)';
        });
        onS(section, 'pointerleave', function () { face.style.transform = ''; });
      }
      onS(btn, 'click', function () {
        if (reduce) return;
        btn.classList.remove('is-waving');
        void btn.offsetWidth;
        btn.classList.add('is-waving');
        later(function () { btn.classList.remove('is-waving'); }, 1300);
      });
    }

    /* ---------- Start ---------- */
    layout(true);
    describe();
    var ro = 'ResizeObserver' in window ? new ResizeObserver(function () { layout(true); }) : null;
    if (ro) { ro.observe(region); cleanups.push(function () { ro.disconnect(); }); }
    if (ctx.page) openBrand(ctx.page, { history: 'none' });

    return {
      route: function (page) {
        if (page && window.BRANDS && window.BRANDS[page]) { if (openSlug !== page) openBrand(page, { history: 'none' }); }
        else showBook({});
      },
      // History entries this world added on top of the project's own.
      depth: function () { return ownEntry() && openSlug ? 1 : 0; },
      refresh: function () { layout(true); },
      destroy: function () {
        timers.forEach(clearTimeout);
        cancelAnimationFrame(tuneRaf);
        unmountStory();
        cleanups.forEach(function (fn) { fn(); });
      }
    };
  }

  worlds.branding = {
    css: 'css/worlds/branding.css',
    // One classic script per brand, listed in projects/branding.js.
    scripts: function (p) { return (p.brands || []).map(function (s) { return 'projects/branding/' + s + '.js'; }); },
    render: render,
    mount: mount
  };
})();
