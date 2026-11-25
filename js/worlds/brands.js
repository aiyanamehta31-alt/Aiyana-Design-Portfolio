/* =====================================================================
   BRANDS · Branding as a shelf of separate brand projects (2026-11-26)
   world: 'brands' in projects/branding.js. Replaces the journey layout,
   where the five brands ran one after another.

   #project/branding            the shelf: five bands, one per brand
   #project/branding/<brand>    that brand's own page, nothing else on it

   A brand page, in its own colours and type (like a freelance case study):
     the brand · the idea · the logo · colour · type · brand elements ·
     packaging · in the world · final designs · reflection · next brand
   Her images come from projects/branding/<brand>.js (window.BRANDS).
   The drawn parts (symbols, pattern, badges, construction grid, packaging
   net) come from js/worlds/brand-kits.js and are labelled as drawn for
   the page. Never invent facts: gaps read [NEEDS FROM AIYANA: …].
   ===================================================================== */
(function () {
  'use strict';
  var worlds = window.CASE_WORLDS = window.CASE_WORLDS || {};

  /* ---------- 1. Helpers ---------- */
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(v) { return esc(v).replace(/\[NEEDS FROM AIYANA[^\]]*\]/g, function (m) { return '<mark class="bd-needs">' + m + '</mark>'; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function brandsOf(p) { return (p.brands || []).map(function (s) { return window.BRANDS && window.BRANDS[s]; }).filter(Boolean); }
  function kitOf(b) { return (window.BRAND_KITS && window.BRAND_KITS[b.slug]) || { symbols: [], badges: [], keywords: [], notes: [], world: [], stroke: { w: 2, cap: 'round' } }; }
  function find(b, name) {
    var all = (b.gallery || []).concat(b.book || [], b.logo ? (b.logo.primary || []).concat(b.logo.explorations || []) : []);
    for (var i = 0; i < all.length; i++) if (all[i].src === name) return all[i];
    return null;
  }
  function img(b, i, opts) {
    opts = opts || {};
    return '<img src="' + esc(b.images + i.src) + '" width="' + (i.width || 1200) + '" height="' + (i.height || 900) + '" alt="' + (opts.decorative ? '' : esc(i.alt || '')) + '"' +
      (opts.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async" draggable="false" />';
  }
  function zoom(b, i, cls, opts) {
    opts = opts || {};
    return '<button type="button" class="bd-zoom' + (cls ? ' ' + cls : '') + '" data-zoom data-group="bd-' + esc(b.slug) + '" data-caption="' + esc(i.caption || i.alt || '') + '">' +
      '<span class="sr-only">Open larger: </span>' + img(b, i, opts) + '</button>';
  }
  function hexRgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    return [0, 2, 4].map(function (k) { return parseInt(h.substr(k, 2), 16); });
  }
  function rgbHex(c) { return '#' + c.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('').toUpperCase(); }
  function mix(hex, to, t) { var a = hexRgb(hex), b = hexRgb(to); return rgbHex(a.map(function (v, k) { return v + (b[k] - v) * t; })); }
  function lum(hex) {
    return hexRgb(hex).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
      .reduce(function (s, v, k) { return s + v * [0.2126, 0.7152, 0.0722][k]; }, 0);
  }
  function cmyk(hex) {
    var c = hexRgb(hex).map(function (v) { return v / 255; });
    var k = 1 - Math.max(c[0], c[1], c[2]);
    if (k >= 1) return '0 0 0 100';
    return c.map(function (v) { return Math.round((1 - v - k) / (1 - k) * 100); }).concat(Math.round(k * 100)).join(' ');
  }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function onColour(bg, t) { return contrast(bg, t.ink) >= contrast(bg, t.ground) ? t.ink : t.ground; }
  function themeVars(b) {
    var t = b.theme, kit = kitOf(b);
    var banner = t.page.ground !== t.ground ? t.page.ground : t.accent;
    return '--b-on-acc:' + onColour(t.accent, t) + ';--b-on-banner:' + onColour(banner, t) + ';--b-ground:' + t.ground + ';--b-ink:' + t.ink + ';--b-accent:' + t.accent +
      ';--b-alt:' + t.alt.ground + ';--b-alt-ink:' + t.alt.ink +
      ';--b-banner:' + banner +
      ';--b-head:' + t.heading + ';--b-body:' + t.body + ';--b-label:' + (t.label || t.body) +
      ';--b-sw:' + kit.stroke.w + ';--b-cap:' + kit.stroke.cap;
  }
  var ARROW = '<svg class="bd-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
  var BACK = '<svg class="bd-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 12H5M11 6l-6 6 6 6"/></svg>';

  /* ---------- 2. Drawn pieces ---------- */
  function symSVG(kit, s, cls) {
    return '<svg class="bd-sym' + (cls ? ' ' + cls : '') + '" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' + s.art + '</svg>';
  }

  // A repeating pattern of two of the brand's symbols. `way` is the colourway.
  function patternSVG(b, way, uid) {
    var kit = kitOf(b);
    if (!kit.symbols.length) return '';
    var a = kit.symbols[kit.pattern[0]], c = kit.symbols[kit.pattern[1]];
    var id = 'bdp-' + b.slug + '-' + uid;
    return '<svg class="bd-pattern bd-pattern--' + way + '" aria-hidden="true" focusable="false" width="100%" height="100%">' +
      '<defs><pattern id="' + id + '" width="132" height="132" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">' +
        '<g class="bd-pattern__a" transform="translate(14 14) scale(0.95)">' + a.art + '</g>' +
        '<g class="bd-pattern__b" transform="translate(80 78) scale(0.72) rotate(14 24 24)">' + c.art + '</g>' +
      '</pattern></defs><rect width="100%" height="100%" fill="url(#' + id + ')"/></svg>';
  }

  // A round sticker with words from her own work running round the edge.
  function badgeSVG(b, badge, k) {
    var kit = kitOf(b), s = kit.symbols[badge.sym] || kit.symbols[0];
    var id = 'bdb-' + b.slug + '-' + k;
    return '<svg class="bd-badge bd-badge--' + k + '" viewBox="0 0 200 200" role="img" aria-label="Sticker: ' + esc(badge.text.replace(/·/g, '').replace(/\s+/g, ' ').trim()) + '">' +
      '<defs><path id="' + id + '" d="M100 100m-70 0a70 70 0 1 1 140 0a70 70 0 1 1-140 0"/></defs>' +
      '<circle class="bd-badge__disc" cx="100" cy="100" r="96"/>' +
      '<circle class="bd-badge__ring" cx="100" cy="100" r="86"/>' +
      '<g class="bd-badge__spin"><text class="bd-badge__text"><textPath href="#' + id + '" textLength="430" lengthAdjust="spacing">' + esc(badge.text) + '</textPath></text></g>' +
      '<g class="bd-badge__sym" transform="translate(70 70) scale(1.25)">' + (s ? s.art : '') + '</g>' +
    '</svg>';
  }

  // The construction grid and clear space, drawn over the final logo.
  function constructSVG(i) {
    var w = i.width, h = i.height, x = Math.round(Math.min(w, h) * 0.16);
    var W = w + x * 2, H = h + x * 2;
    var lines = '';
    for (var c = 1; c < 6; c++) lines += P2('M' + (x + w * c / 6) + ' ' + x + 'V' + (x + h), 'bd-c-grid');
    for (var r = 1; r < 4; r++) lines += P2('M' + x + ' ' + (x + h * r / 4) + 'H' + (x + w), 'bd-c-grid');
    var cx = W / 2, cy = H / 2, rr = h / 2;
    var marks = [[0, 0], [W - x, 0], [0, H - x], [W - x, H - x]].map(function (q) {
      return '<rect class="bd-c-x" x="' + q[0] + '" y="' + q[1] + '" width="' + x + '" height="' + x + '"/>' +
        '<text class="bd-c-xt" x="' + (q[0] + x / 2) + '" y="' + (q[1] + x / 2) + '" font-size="' + Math.round(x * 0.5) + '">x</text>';
    }).join('');
    return '<svg class="bd-construct" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      P2('M0 0H' + W + 'V' + H + 'H0Z', 'bd-c-clear') +
      P2('M' + x + ' ' + x + 'H' + (W - x) + 'V' + (H - x) + 'H' + x + 'Z', 'bd-c-box') + lines +
      P2('M' + x + ' ' + x + 'L' + (W - x) + ' ' + (H - x) + 'M' + (W - x) + ' ' + x + 'L' + x + ' ' + (H - x), 'bd-c-diag') +
      '<circle pathLength="1" class="bd-c-circle" cx="' + cx + '" cy="' + cy + '" r="' + rr + '"/>' +
      P2('M' + cx + ' 0V' + H + 'M0 ' + cy + 'H' + W, 'bd-c-axis') + marks +
    '</svg>';
    function P2(d, cls) { return '<path pathLength="1" class="' + cls + '" d="' + d + '" vector-effect="non-scaling-stroke"/>'; }
  }

  // Packaging nets: solid lines are cuts, dashed lines are folds.
  function fit(i, bx, by, bw, bh) {
    var s = Math.min(bw / i.width, bh / i.height), w = i.width * s, h = i.height * s;
    return { x: bx + (bw - w) / 2, y: by + (bh - h) / 2, w: w, h: h };
  }
  function image(b, i, bx, by, bw, bh, clip) {
    var f = fit(i, bx, by, bw, bh);
    return '<image href="' + esc(b.images + i.src) + '" x="' + f.x.toFixed(1) + '" y="' + f.y.toFixed(1) + '" width="' + f.w.toFixed(1) + '" height="' + f.h.toFixed(1) + '"' +
      (clip ? ' clip-path="url(#' + clip + ')"' : '') + ' preserveAspectRatio="xMidYMid meet"/>';
  }
  function label(x, y, t, anchor) { return '<text class="bd-net__label" x="' + x + '" y="' + y + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + esc(t) + '</text>'; }
  function sym(kit, k, x, y, s, cls) { var it = kit.symbols[k]; return it ? '<g class="' + (cls || 'bd-net__sym') + '" transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + it.art + '</g>' : ''; }

  function netSVG(b) {
    var kit = kitOf(b), pk = kit.pack;
    if (!pk) return '';
    var t = b.theme;
    if (pk.type === 'wrap') {
      // The can label, opened flat: back | front | overlap.
      var h = '<rect class="bd-net__cut" x="40" y="70" width="680" height="230" style="fill:' + t.ground + '"/>' +
        '<rect class="bd-net__glue" x="680" y="70" width="40" height="230"/>' +
        '<path class="bd-net__fold" d="M260 70V300M500 70V300"/>' +
        image(b, pk.front, 300, 92, 160, 150) +
        '<text class="bd-net__brand" x="150" y="128" text-anchor="middle">' + esc(pk.lines[0]) + '</text>' +
        pk.lines.slice(1).map(function (l, k) { return '<text class="bd-net__line" x="150" y="' + (168 + k * 30) + '" text-anchor="middle">' + esc(l) + '</text>'; }).join('') +
        '<g class="bd-net__bars">' + [0, 3, 5, 9, 11, 14, 18, 20, 23, 27, 29, 32].map(function (v, k) { return '<rect x="' + (560 + v * 2.6) + '" y="118" width="' + (k % 3 ? 2 : 4) + '" height="64"/>'; }).join('') + '</g>' +
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (k) { return sym(kit, 3, 50 + k * 58, 250, 0.9); }).join('') +
        label(150, 54, 'back', 'middle') + label(380, 54, 'front', 'middle') + label(590, 54, 'side', 'middle') + label(700, 54, 'overlap', 'middle') +
        label(380, 334, 'wraps once round the can', 'middle');
      return '<svg class="bd-net" viewBox="0 0 760 350" role="img" aria-label="The Velvet Vine can label opened flat, with the back, front, side and overlap marked.">' + h + '</svg>';
    }
    if (pk.type === 'box') {
      // A takeout carton: four walls in a row, flaps above and below, a glue tab.
      var xs = [40, 190, 380, 530], ws = [150, 190, 150, 190], y0 = 150, hh = 210, out = '';
      xs.forEach(function (x, k) {
        var w = ws[k];
        out += '<path class="bd-net__cut bd-net__panel" d="M' + x + ' ' + y0 + 'L' + (x + 12) + ' ' + (y0 - 92) + 'H' + (x + w - 12) + 'L' + (x + w) + ' ' + y0 + '"/>';
        out += '<path class="bd-net__cut bd-net__panel" d="M' + x + ' ' + (y0 + hh) + 'L' + (x + 18) + ' ' + (y0 + hh + 80) + 'H' + (x + w - 18) + 'L' + (x + w) + ' ' + (y0 + hh) + '"/>';
        out += '<rect class="bd-net__wall" x="' + x + '" y="' + y0 + '" width="' + w + '" height="' + hh + '"/>';
      });
      out += '<path class="bd-net__glue" d="M720 ' + y0 + 'L748 ' + (y0 + 16) + 'V' + (y0 + hh - 16) + 'L720 ' + (y0 + hh) + 'Z"/>';
      out += '<path class="bd-net__fold" d="M40 ' + y0 + 'H720M40 ' + (y0 + hh) + 'H720M190 ' + y0 + 'V' + (y0 + hh) + 'M380 ' + y0 + 'V' + (y0 + hh) + 'M530 ' + y0 + 'V' + (y0 + hh) + 'M720 ' + y0 + 'V' + (y0 + hh) + '"/>';
      out += image(b, pk.front, 200, y0 + 20, 170, hh - 40);
      out += image(b, pk.lid, 214, y0 - 84, 142, 70);
      out += sym(kit, 1, 89, y0 + 79, 1.1) + sym(kit, 1, 579, y0 + 79, 1.1) + sym(kit, 0, 431, y0 + 79, 1.0);
      out += label(115, y0 + hh + 116, 'side', 'middle') + label(285, y0 + hh + 116, 'front', 'middle') + label(455, y0 + hh + 116, 'side', 'middle') + label(625, y0 + hh + 116, 'back', 'middle') + label(734, y0 - 16, 'glue', 'middle') +
        label(285, 40, 'lid flap', 'middle');
      return '<svg class="bd-net" viewBox="0 0 760 500" role="img" aria-label="The KOMA takeout box opened flat: four walls with the wordmark on the front, lid flaps above, base flaps below and a glue tab.">' + out + '</svg>';
    }
    if (pk.type === 'stickers') {
      // A kiss-cut sheet: each mark sits in its own cut line.
      var spots = [[60, 70, 190, 196], [280, 80, 300, 124], [610, 70, 110, 110], [600, 220, 130, 120], [280, 250, 300, 92], [60, 300, 190, 120]];
      var defs = '', body = '';
      pk.items.forEach(function (it, k) {
        var s = spots[k];
        var f = fit(it, s[0], s[1], s[2], s[3]);
        var id = 'bdk-' + b.slug + '-' + k;
        defs += '<clipPath id="' + id + '"><rect x="' + f.x.toFixed(1) + '" y="' + f.y.toFixed(1) + '" width="' + f.w.toFixed(1) + '" height="' + f.h.toFixed(1) + '" rx="10"/></clipPath>';
        body += '<rect class="bd-net__kiss" x="' + (f.x - 9).toFixed(1) + '" y="' + (f.y - 9).toFixed(1) + '" width="' + (f.w + 18).toFixed(1) + '" height="' + (f.h + 18).toFixed(1) + '" rx="16"/>' +
          image(b, it, s[0], s[1], s[2], s[3], id);
      });
      body += sym(kit, 2, 300, 380, 1.3, 'bd-net__sym bd-net__sym--ink') + sym(kit, 4, 400, 384, 1.1, 'bd-net__sym bd-net__sym--ink') + sym(kit, 5, 494, 380, 1.2, 'bd-net__sym bd-net__sym--ink');
      return '<svg class="bd-net" viewBox="0 0 760 470" role="img" aria-label="The STATIC. sticker sheet: the bolt emblem, the graffiti script, the globe badge, the S. monogram and the chrome wordmark, each in its own cut line.">' +
        '<defs><linearGradient id="bdh-' + b.slug + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2B2B2B"/><stop offset="0.45" stop-color="#151515"/><stop offset="1" stop-color="#232323"/></linearGradient>' + defs + '</defs>' +
        '<rect class="bd-net__cut" x="30" y="40" width="700" height="410" rx="18" fill="url(#bdh-' + b.slug + ')"/>' + body +
        label(380, 26, 'kiss cut: the sticker peels, the sheet stays', 'middle') + '</svg>';
    }
    if (pk.type === 'tag') {
      // A swing tag, front and back, with its hole and string.
      function tag(x, inner) {
        return '<path class="bd-net__cut bd-net__tag" d="M' + (x + 34) + ' 60H' + (x + 226) + 'L' + (x + 260) + ' 94V420H' + x + 'V94Z"/>' +
          '<circle class="bd-net__hole" cx="' + (x + 130) + '" cy="100" r="11"/>' + inner;
      }
      var front = tag(120, pk.frontArt
        ? sym(kit, pk.frontArt.sym, 190, 140, 2.5, 'bd-net__sym bd-net__sym--big') + '<text class="bd-net__line bd-net__line--big" x="250" y="340" text-anchor="middle">' + esc(pk.frontArt.text) + '</text>'
        : image(b, pk.front, 140, 130, 220, 250));
      var back = tag(420, pk.lines.map(function (l, k) { return '<text class="bd-net__line bd-net__line--big" x="550" y="' + (200 + k * 52) + '" text-anchor="middle">' + esc(l) + '</text>'; }).join('') +
        sym(kit, kit.pattern[0], 526, 330, 1, 'bd-net__sym bd-net__sym--ink') +
        '<g class="bd-net__bars bd-net__bars--ink">' + [0, 2, 3, 6, 8, 9, 12, 14, 17, 18].map(function (v, k) { return '<rect x="' + (498 + v * 6) + '" y="386" width="' + (k % 2 ? 2 : 4) + '" height="18"/>'; }).join('') + '</g>');
      return '<svg class="bd-net" viewBox="0 0 760 470" role="img" aria-label="The ' + esc(b.name) + ' tag, front and back, with its hole and string.">' +
        '<path class="bd-net__string" d="M250 100C300 20 420 20 550 100"/>' + front + back +
        label(250, 450, 'front', 'middle') + label(550, 450, 'back', 'middle') + '</svg>';
    }
    return '';
  }

  /* ---------- 3. The shelf ---------- */
  function shelfHTML(p) {
    var list = brandsOf(p);
    return '<div class="bd-view bd-view--shelf" data-bd-view="">' +
      '<section class="bd-shelf-top" id="cs-cover" data-tone="bshelf" aria-labelledby="cs-title"><div class="bd-col">' +
        '<h2 class="bd-shelf-top__title" id="cs-title" tabindex="-1">' + esc(p.title) + '</h2>' +
        '<p class="bd-shelf-top__line">' + rich(p.cover && p.cover.line) + '</p>' +
        '<p class="bd-shelf-top__text">' + rich(p.intro) + '</p>' +
        '<ul class="bd-tags">' + (p.tags || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '</div></section>' +
      '<section class="bd-shelf" data-tone="bshelf" aria-label="The ' + list.length + ' brands"><ol class="bd-bands">' +
        list.map(function (b, k) { return '<li>' + bandHTML(b, k, list.length, 'shelf') + '</li>'; }).join('') +
      '</ol></section>' +
      '<section class="bd-out" id="bd-out" data-tone="bshelf" aria-label="Next project"><div class="bd-col">' +
        (p.next ? '<a class="bd-out__next" href="#project/' + esc(p.next.slug) + '"><span>Next project</span><strong>' + esc(p.next.title) + ' ' + ARROW + '</strong></a>' : '') +
        '<a class="bd-out__back" href="#work" data-cs-back>Back to all work</a>' +
      '</div></section>' +
    '</div>';
  }

  // One brand as a band of its own colours: the name, a line, three images.
  function bandHTML(b, k, n, where) {
    var kit = kitOf(b);
    var pics = (b.book || []).slice(0, 3);
    return '<a class="bd-band" href="#project/branding/' + esc(b.slug) + '" data-brand="' + esc(b.slug) + '" data-bd-open style="' + esc(themeVars(b)) + '" id="bd-band-' + where + '-' + esc(b.slug) + '">' +
      patternSVG(b, 'band', where) +
      '<span class="bd-band__n" aria-hidden="true">' + pad(k + 1) + '<small>/' + pad(n) + '</small></span>' +
      '<span class="bd-band__copy">' +
        '<span class="bd-band__name">' + esc(b.name) + '</span>' +
        '<span class="bd-band__line">' + esc(b.category) + ' · ' + esc(b.line) + '</span>' +
        '<span class="bd-band__go">' + (where === 'next' ? 'Next brand' : 'Open the brand') + ARROW + '</span>' +
      '</span>' +
      '<span class="bd-band__fan" aria-hidden="true">' + pics.map(function (i, j) { return '<span class="bd-band__pic" style="--j:' + j + '">' + img(b, i, { decorative: true }) + '</span>'; }).join('') + '</span>' +
      (kit.symbols[0] ? '<span class="bd-band__sym" aria-hidden="true">' + symSVG(kit, kit.symbols[0]) + '</span>' : '') +
    '</a>';
  }

  /* ---------- 4. A brand's own page ---------- */
  var PARTS = [
    ['top', 'The brand'], ['idea', 'The idea'], ['logo', 'The logo'], ['colour', 'Colour'], ['type', 'Type'],
    ['elements', 'Brand elements'], ['pack', 'Packaging'], ['world', 'In the world'], ['final', 'Final designs'], ['notes', 'Reflection']
  ];
  function sid(b, part) { return 'bd-' + b.slug + '-' + part; }
  function head(b, part, title, aside) {
    return '<header class="bd-head bd-rise"><h3 class="bd-h" id="' + sid(b, part) + '-h" tabindex="-1">' + rich(title) + '</h3>' +
      (aside ? '<p class="bd-hand">' + esc(aside) + '</p>' : '') + '</header>';
  }
  function sec(b, part, tone, inner, cls) {
    return '<section class="bd-sec bd-sec--' + part + (cls ? ' ' + cls : '') + '" id="' + sid(b, part) + '" data-tone="b-' + esc(b.slug) + (tone === 'alt' ? '-alt' : '') + '"' +
      ' data-part="' + part + '" aria-labelledby="' + sid(b, part) + '-h"><div class="bd-col">' + inner + '</div></section>';
  }
  function drawnTag() { return '<p class="bd-drawn">Drawn for this page</p>'; }

  function brandHTML(p, b, k, list) {
    var kit = kitOf(b), t = b.theme;
    var next = list[(k + 1) % list.length];
    var h = '';

    // The switcher: back to the shelf, or straight to another brand.
    h += '<nav class="bd-switch" aria-label="Brands"><div class="bd-col">' +
      '<a class="bd-switch__all" href="#project/branding">' + BACK + 'All brands</a>' +
      '<ol>' + list.map(function (o, j) {
        return '<li><a href="#project/branding/' + esc(o.slug) + '"' + (o === b ? ' aria-current="page"' : '') + ' style="--dot:' + o.theme.accent + ';--dot2:' + o.theme.ground + '">' +
          '<span class="bd-switch__dot" aria-hidden="true"></span>' + esc(o.name) + '</a></li>';
      }).join('') + '</ol></div></nav>';

    // The brand: its name, its line, the hero picture and a sticker.
    h += '<section class="bd-sec bd-hero" id="' + sid(b, 'top') + '" data-tone="b-' + esc(b.slug) + '" data-part="top" aria-labelledby="' + sid(b, 'top') + '-h">' +
      patternSVG(b, 'hero', 'hero') +
      '<div class="bd-col bd-hero__grid">' +
        '<div class="bd-hero__copy">' +
          '<p class="bd-hero__count">Brand ' + pad(k + 1) + ' of ' + pad(list.length) + ' · ' + esc(b.category) + '</p>' +
          '<h3 class="bd-hero__name" id="' + sid(b, 'top') + '-h" tabindex="-1">' + esc(b.name) + '</h3>' +
          '<p class="bd-hero__line">' + rich(b.line) + '</p>' +
          '<dl class="bd-facts">' + (b.facts || []).map(function (f) { return '<div><dt>' + esc(f.label) + '</dt><dd>' + rich(f.value) + '</dd></div>'; }).join('') + '</dl>' +
        '</div>' +
        '<div class="bd-hero__art">' +
          '<figure class="bd-taped bd-hero__pic">' + zoom(b, Object.assign({}, b.hero, { caption: b.name }), '', { eager: true }) + '</figure>' +
          (kit.badges[0] ? '<div class="bd-hero__badge">' + badgeSVG(b, kit.badges[0], 'h') + '</div>' : '') +
        '</div>' +
      '</div></section>';

    // The idea: the brief in a line, the words it grew from, the first looks.
    var book = (b.book || []).slice(0, 4);
    h += sec(b, 'idea', 'ground',
      head(b, 'idea', 'The idea', 'where it started') +
      '<div class="bd-idea bd-rise">' +
        '<p class="bd-lead">' + rich(b.idea) + '</p>' +
        '<ul class="bd-words" aria-label="Key words">' + kit.keywords.map(function (w, j) { return '<li style="--j:' + j + '">' + esc(w) + '</li>'; }).join('') + '</ul>' +
      '</div>' +
      '<div class="bd-board bd-rise" aria-label="First looks">' + book.map(function (i, j) {
        return '<figure class="bd-board__pin bd-taped" style="--j:' + j + '">' + zoom(b, i) +
          (kit.notes[j] ? '<figcaption class="bd-hand bd-hand--pin">' + esc(kit.notes[j]) + '</figcaption>' : '') + '</figure>';
      }).join('') + '</div>');

    // The logo: the mark, its construction and clear space, the other marks tried.
    var prim = (b.logo && b.logo.primary) || [], ex = (b.logo && b.logo.explorations) || [];
    var main = prim[0];
    h += sec(b, 'logo', 'alt',
      head(b, 'logo', 'The logo', ex.length ? 'and the marks that didn’t make it' : '') +
      (main ? '<div class="bd-logo bd-rise">' +
        '<figure class="bd-logo__main" data-bd-construct>' +
          '<div class="bd-logo__stage"><div class="bd-logo__frame" style="aspect-ratio:' + (main.width + Math.round(Math.min(main.width, main.height) * 0.32)) + '/' + (main.height + Math.round(Math.min(main.width, main.height) * 0.32)) + ';--pad:' + (Math.min(main.width, main.height) * 0.16 / (main.width + Math.min(main.width, main.height) * 0.32) * 100).toFixed(2) + '%;--padY:' + (Math.min(main.width, main.height) * 0.16 / (main.height + Math.min(main.width, main.height) * 0.32) * 100).toFixed(2) + '%">' +
            img(b, main) + constructSVG(main) + '</div></div>' +
          '<figcaption><span>' + esc(main.caption) + '</span>' +
            '<button type="button" class="bd-toggle" data-bd-grid aria-pressed="true">Construction grid</button></figcaption>' +
        '</figure>' +
        (prim[1] ? '<figure class="bd-logo__second">' + zoom(b, prim[1]) + '<figcaption>' + esc(prim[1].caption) + '</figcaption></figure>' : '') +
        '<p class="bd-logo__note">The grid and the clear space (<em>x</em>, the space kept empty round the mark) are drawn over the final logo for this page.</p>' +
      '</div>' : '') +
      (main ? '<div class="bd-sizes bd-rise" aria-label="The logo at three sizes">' + ['Large', 'Medium', 'Small'].map(function (s, j) {
        return '<figure class="bd-sizes__item bd-sizes__item--' + j + '"><div>' + img(b, prim[1] && j === 2 ? prim[1] : main, { decorative: true }) + '</div><figcaption>' + s + (j === 2 && prim[1] ? ': ' + esc(prim[1].caption.toLowerCase()) : '') + '</figcaption></figure>';
      }).join('') + '</div>' : '') +
      (ex.length ? '<div class="bd-tried bd-rise"><h4 class="bd-h4">Marks that didn’t make it</h4><ul class="bd-tried__list">' + ex.map(function (i, j) {
        return '<li style="--j:' + j + '">' + zoom(b, i) + '<span class="bd-hand bd-hand--small">' + esc(i.caption) + '</span></li>';
      }).join('') + '</ul></div>' : ''));

    // Colour: paint chips with tints, codes, and how much of each to use.
    var cols = b.colours || [];
    var share = cols.length === 4 ? [44, 26, 18, 12] : cols.length === 3 ? [60, 30, 10] : cols.map(function () { return Math.round(100 / cols.length); });
    h += sec(b, 'colour', 'ground',
      head(b, 'colour', 'Colour', 'the brand’s own names') +
      '<ul class="bd-chips bd-rise">' + cols.map(function (c, j) {
        var on = lum(c.hex) > 0.4 ? '#141414' : '#FFFFFF';
        var rgb = hexRgb(c.hex);
        return '<li class="bd-chip" style="--c:' + c.hex + ';--on:' + on + ';--j:' + j + '">' +
          '<div class="bd-chip__face"><span class="bd-chip__name">' + esc(c.name) + '</span></div>' +
          '<div class="bd-chip__tints" aria-hidden="true">' + [0.25, 0.5, 0.75].map(function (v) { return '<span style="background:' + mix(c.hex, '#FFFFFF', v) + '"></span>'; }).join('') + '</div>' +
          '<dl class="bd-chip__codes"><div><dt>HEX</dt><dd>' + esc(c.hex.toUpperCase()) + '</dd></div><div><dt>RGB</dt><dd>' + rgb.join(' ') + '</dd></div><div><dt>CMYK</dt><dd>' + cmyk(c.hex) + '</dd></div></dl>' +
        '</li>';
      }).join('') + '</ul>' +
      '<div class="bd-mix bd-rise"><h4 class="bd-h4">How much of each</h4><div class="bd-mix__bar">' + cols.map(function (c, j) {
        return '<span style="--c:' + c.hex + ';flex:' + share[j] + ';--on:' + (lum(c.hex) > 0.4 ? '#141414' : '#FFFFFF') + '"><b>' + share[j] + '%</b></span>';
      }).join('') + '</div><p class="bd-small">A suggested balance for layouts, drawn for this page. CMYK is a screen conversion: check it with a proof before printing.</p></div>');

    // Type: the two faces, every letter, and a tester.
    h += sec(b, 'type', 'ground',
      head(b, 'type', 'Type') +
      '<div class="bd-type bd-rise">' +
        '<label class="bd-type__try"><span>Type something to try the fonts</span><input type="text" data-bd-tester maxlength="40" value="' + esc(b.name) + '" autocomplete="off" spellcheck="false" /></label>' +
        '<div class="bd-spec bd-spec--head"><p class="bd-spec__aa" aria-hidden="true">Aa</p><div><p class="bd-spec__name">' + esc(t.headingName) + '</p><p class="bd-spec__use">Headings and the big moments</p>' +
          '<p class="bd-spec__set" aria-hidden="true">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 &amp; ! ? .</p></div>' +
          '<p class="bd-spec__sample" data-bd-sample>' + esc(b.name) + '</p></div>' +
        '<div class="bd-spec bd-spec--body"><p class="bd-spec__aa" aria-hidden="true">Aa</p><div><p class="bd-spec__name">' + esc(t.bodyName) + '</p><p class="bd-spec__use">Everything people read</p>' +
          '<p class="bd-spec__set" aria-hidden="true">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 &amp; ! ? .</p></div>' +
          '<p class="bd-spec__sample bd-spec__sample--body" data-bd-sample>' + esc(b.name) + '</p></div>' +
        '<p class="bd-small">The closest free web fonts to the brand’s lettering, so the page can set it live.</p>' +
      '</div>');

    // Brand elements: symbols, the pattern, a watermark, stickers.
    var heroPic = find(b, kit.world[0]) || b.hero;
    h += sec(b, 'elements', 'alt',
      head(b, 'elements', 'Brand elements', 'small pieces the brand is built from') + drawnTag() +
      '<div class="bd-el-grid">' +
        '<div class="bd-symbols bd-rise"><h4 class="bd-h4">Symbols</h4><ul>' + kit.symbols.map(function (s, j) {
          return '<li style="--j:' + j + '">' + symSVG(kit, s, 'bd-draw') + '<span>' + esc(s.name) + '</span></li>';
        }).join('') + '</ul></div>' +
        '<div class="bd-patternbox bd-rise" data-bd-way="ground"><h4 class="bd-h4">Pattern</h4>' +
          '<div class="bd-patternbox__tile">' + patternSVG(b, 'tile', 'tile') + '</div>' +
          '<button type="button" class="bd-toggle" data-bd-swap aria-pressed="false">Swap the colourway</button></div>' +
        '<div class="bd-stickers bd-rise"><h4 class="bd-h4">Stickers</h4><div class="bd-stickers__row">' + kit.badges.map(function (bg, j) { return badgeSVG(b, bg, j); }).join('') + '</div>' +
          '<p class="bd-small">The words come from the brand’s own posters and tags.</p></div>' +
        '<figure class="bd-water bd-rise"><h4 class="bd-h4">Watermark</h4><div class="bd-water__pic">' + img(b, heroPic, { decorative: true }) +
          '<span class="bd-water__mark" aria-hidden="true">' + new Array(9).join('<span>' + esc(b.name) + '</span>') + '</span>' +
          '<span class="bd-water__corner" aria-hidden="true">' + (kit.symbols[0] ? symSVG(kit, kit.symbols[0]) : '') + esc(b.name) + '</span></div>' +
          '<figcaption class="bd-small">For photos and posts shared before launch: the name runs faintly across, the mark sits in the corner.</figcaption></figure>' +
      '</div>');

    // Packaging: the net, opened flat, beside the real thing.
    if (kit.pack) {
      h += sec(b, 'pack', 'ground',
        head(b, 'pack', kit.pack.heading || 'Packaging', 'opened flat') +
        '<p class="bd-lead bd-rise">' + rich(kit.pack.text) + '</p>' +
        '<div class="bd-pack bd-rise">' +
          '<figure class="bd-mat">' + netSVG(b) +
            '<figcaption><span class="bd-legend bd-legend--cut">cut</span>' + (kit.pack.type === 'wrap' || kit.pack.type === 'box' ? '<span class="bd-legend bd-legend--fold">fold</span><span class="bd-legend bd-legend--glue">glue</span>' : kit.pack.type === 'stickers' ? '<span class="bd-legend bd-legend--kiss">kiss cut</span>' : '<span class="bd-legend bd-legend--kiss">hole for the string</span>') +
            '<span class="bd-drawn bd-drawn--inline">Drawn for this page</span></figcaption></figure>' +
          '<div class="bd-pack__real">' + (kit.pack.photos || []).map(function (s, j) {
            var i = find(b, s); return i ? '<figure class="bd-taped" style="--j:' + j + '">' + zoom(b, i) + '<figcaption class="bd-hand bd-hand--small">' + (j ? 'up close' : 'the real thing') + '</figcaption></figure>' : '';
          }).join('') + '</div>' +
        '</div>');
    }

    // In the world: one big picture, the rest around it.
    var wl = kit.world.map(function (s) { return find(b, s); }).filter(Boolean);
    if (wl.length) {
      h += sec(b, 'world', 'ground',
        head(b, 'world', 'In the world', kitOf(b).worldNote || 'where people meet it') +
        '<div class="bd-world bd-world--' + Math.min(wl.length, 4) + ' bd-rise">' + wl.map(function (i, j) {
          return '<figure class="bd-world__item bd-world__item--' + j + '">' + zoom(b, i) +
            '<figcaption>' + rich(i.caption) + (i.note ? ' <span class="bd-note">' + rich(i.note) + '</span>' : '') + '</figcaption></figure>';
        }).join('') + '</div>');
    }

    // Final designs: a banner, then every finished piece.
    h += '<section class="bd-sec bd-sec--final" id="' + sid(b, 'final') + '" data-tone="b-' + esc(b.slug) + '" data-part="final" aria-labelledby="' + sid(b, 'final') + '-h">' +
      '<div class="bd-banner"><div class="bd-banner__run" aria-hidden="true">' + new Array(7).join('<span>Final designs</span>' + (kit.symbols[0] ? symSVG(kit, kit.symbols[0]) : '')) + '</div>' +
        '<h3 class="bd-banner__h sr-only" id="' + sid(b, 'final') + '-h" tabindex="-1">Final designs</h3></div>' +
      '<div class="bd-col"><ul class="bd-wall">' + (b.gallery || []).map(function (i, j) {
        return '<li class="bd-wall__item bd-rise' + (i.size === 'wide' ? ' is-wide' : '') + '" style="--j:' + (j % 3) + '">' + zoom(b, i) + '<span class="bd-wall__cap">' + rich(i.caption) + '</span></li>';
      }).join('') + '</ul></div></section>';

    // Reflection.
    h += sec(b, 'notes', 'ground',
      head(b, 'notes', 'Looking back') +
      '<ul class="bd-notes bd-rise">' + (b.reflection || []).map(function (r) { return '<li><strong>' + esc(r.title) + '</strong><span>' + rich(r.text) + '</span></li>'; }).join('') + '</ul>');

    // The next brand, as its own band.
    h += '<section class="bd-sec bd-sec--next" id="' + sid(b, 'next') + '" data-tone="b-' + esc(b.slug) + '" aria-label="Next brand">' +
      bandHTML(next, list.indexOf(next), list.length, 'next') +
      '<div class="bd-col bd-sec--next__back"><a class="bd-switch__all" href="#project/branding">' + BACK + 'All brands</a></div></section>';

    return '<div class="bd-view bd-view--brand" data-bd-view="' + esc(b.slug) + '" data-brand="' + esc(b.slug) + '" style="' + esc(themeVars(b)) + '" hidden>' + h + '</div>';
  }

  function render(p) {
    var list = brandsOf(p);
    return '<div class="bd" data-bd>' + shelfHTML(p) + list.map(function (b, k) { return brandHTML(p, b, k, list); }).join('') +
      '<div class="bd-wipe" data-bd-wipe aria-hidden="true"></div></div>';
  }

  /* ---------- 5. Mount: switching between the shelf and a brand ---------- */
  function mount(ctx) {
    var p = ctx.project, scroller = ctx.scroller, sheet = ctx.sheet, reduce = ctx.reduceMotion;
    var box = ctx.content.querySelector('[data-bd]');
    var list = brandsOf(p);
    var cleanups = [];
    function on(el, type, fn, opt) { if (!el) return; el.addEventListener(type, fn, opt); cleanups.push(function () { el.removeEventListener(type, fn, opt); }); }
    sheet.classList.add('bd-sheet');
    cleanups.push(function () { sheet.classList.remove('bd-sheet'); sheet.removeAttribute('data-bd-brand'); });

    // Each brand's web fonts, once.
    list.forEach(function (b) {
      var url = b.theme && b.theme.fonts;
      if (!url || document.querySelector('link[data-bd-font="' + b.slug + '"]')) return;
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = url; l.setAttribute('data-bd-font', b.slug);
      document.head.appendChild(l);
    });

    // Reveals: things rise (and drawings draw) once, as they come in.
    var io = null;
    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(box.querySelectorAll('.bd-rise, .bd-logo__main, .bd-symbols'), function (el) { el.classList.add('is-in'); });
    } else {
      box.classList.add('bd-motion');
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { root: scroller, rootMargin: '0px 0px -10% 0px' });
      Array.prototype.forEach.call(box.querySelectorAll('.bd-rise, .bd-logo__main, .bd-symbols'), function (el) { io.observe(el); });
      cleanups.push(function () { io.disconnect(); });
    }

    // Construction grid on and off; pattern colourway; the type tester.
    on(box, 'click', function (e) {
      var g = e.target.closest('[data-bd-grid]');
      if (g) {
        var fig = g.closest('[data-bd-construct]');
        var off = fig.classList.toggle('is-plain');
        g.setAttribute('aria-pressed', off ? 'false' : 'true');
        return;
      }
      var s = e.target.closest('[data-bd-swap]');
      if (s) {
        var pb = s.closest('.bd-patternbox');
        var alt = pb.getAttribute('data-bd-way') !== 'alt';
        pb.setAttribute('data-bd-way', alt ? 'alt' : 'ground');
        s.setAttribute('aria-pressed', alt ? 'true' : 'false');
        return;
      }
      var open = e.target.closest('[data-bd-open], .bd-switch a');
      if (open) { var r = open.getBoundingClientRect(); lastPoint = { x: e.clientX || r.left + r.width / 2, y: e.clientY || r.top + r.height / 2 }; }
    }, true);
    on(box, 'input', function (e) {
      if (!e.target.matches('[data-bd-tester]')) return;
      var v = e.target.value.trim() || ' ';
      Array.prototype.forEach.call(e.target.closest('.bd-type').querySelectorAll('[data-bd-sample]'), function (el) { el.textContent = v; });
    });

    // Showing one view (the shelf, or one brand) and its glider.
    var current = null, glider = null, lastPoint = null, wipeTimer = 0, settle = [];
    cleanups.push(function () { settle.forEach(clearTimeout); });
    // The colour wipe lives on the sheet itself, over the scrolling page.
    var wipe = box.querySelector('[data-bd-wipe]');
    if (wipe) { sheet.appendChild(wipe); cleanups.push(function () { if (wipe.parentNode) wipe.parentNode.removeChild(wipe); }); }
    function barH() { return parseFloat(getComputedStyle(sheet).getPropertyValue('--cs-bar-h')) || 60; }
    function makeGlider(view, b) {
      if (glider) { glider.destroy(); glider = null; }
      if (!window.CaseGlider) return;
      var items;
      if (!b) {
        items = [{ name: 'Branding', sub: list.length + ' brands', el: view.querySelector('#cs-cover'), focus: view.querySelector('#cs-title') }]
          .concat(list.map(function (o) { return { name: o.name, sub: o.category, el: view.querySelector('#bd-band-shelf-' + o.slug) }; }))
          .concat([{ name: 'Next project', sub: p.next ? p.next.title : '', el: view.querySelector('#bd-out') }]);
      } else {
        items = PARTS.map(function (pt) {
          var el = view.querySelector('#' + sid(b, pt[0]));
          return el && { name: pt[0] === 'pack' ? (kitOf(b).pack && kitOf(b).pack.heading) || pt[1] : pt[0] === 'notes' ? 'Looking back' : pt[1], sub: pt[0] === 'top' ? b.name : '', el: el, focus: view.querySelector('#' + sid(b, pt[0]) + '-h') };
        }).filter(Boolean).concat([{ name: 'Next brand', sub: list[(list.indexOf(b) + 1) % list.length].name, el: view.querySelector('#' + sid(b, 'next')) }]);
      }
      glider = window.CaseGlider({
        sheet: sheet, scroller: scroller, content: ctx.content, lenis: ctx.lenis, reduceMotion: reduce,
        cls: 'bd-glider' + (b ? ' bd-glider--' + b.slug : ' bd-glider--shelf'),
        label: b ? b.name + ', part by part' : 'Branding, brand by brand',
        offset: function () { return barH() + 14; },
        items: items
      });
    }
    function show(slug, animate) {
      var b = null;
      list.forEach(function (o) { if (o.slug === slug) b = o; });
      var key = b ? b.slug : '';
      if (key === current) { scroller.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); return; }
      function swap() {
        current = key;
        Array.prototype.forEach.call(box.querySelectorAll('[data-bd-view]'), function (v) { v.hidden = v.getAttribute('data-bd-view') !== key; });
        if (b) sheet.setAttribute('data-bd-brand', b.slug); else sheet.removeAttribute('data-bd-brand');
        if (ctx.lenis) ctx.lenis.scrollTo(0, { immediate: true, force: true });
        scroller.scrollTop = 0;
        if (ctx.measure) ctx.measure();
        var view = box.querySelector('[data-bd-view="' + key + '"]');
        makeGlider(view, b);
        // Measure again once the sheet has finished opening and the brand's
        // fonts have arrived (both move every part down the page).
        [350, 1200].forEach(function (ms) { settle.push(setTimeout(function () { if (glider) glider.refresh(); if (ctx.measure) ctx.measure(); }, ms)); });
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (glider) glider.refresh(); });
        var h = b ? view.querySelector('#' + sid(b, 'top') + '-h') : view.querySelector('#cs-title');
        if (h && animate) h.focus({ preventScroll: true });
      }
      if (!animate || reduce || !wipe) { swap(); return; }
      // The brand's colour spreads from where you clicked, then lifts away.
      var pt = lastPoint || { x: innerWidth / 2, y: innerHeight / 2 };
      var sr = sheet.getBoundingClientRect();
      wipe.style.setProperty('--x', (pt.x - sr.left) + 'px');
      wipe.style.setProperty('--y', (pt.y - sr.top) + 'px');
      wipe.style.background = b ? b.theme.ground : '#0D0D0D';
      wipe.classList.remove('is-out');
      wipe.classList.add('is-on');
      clearTimeout(wipeTimer);
      wipeTimer = setTimeout(function () {
        swap();
        wipe.classList.add('is-out');
        wipeTimer = setTimeout(function () { wipe.classList.remove('is-on', 'is-out'); }, 520);
      }, 460);
      lastPoint = null;
    }
    cleanups.push(function () { clearTimeout(wipeTimer); if (glider) glider.destroy(); });

    show(ctx.page || '', false);

    return {
      route: function (page) { show(page || '', true); },
      destroy: function () { cleanups.forEach(function (fn) { fn(); }); }
    };
  }

  worlds.brands = {
    css: 'css/worlds/brands.css',
    // The kits first, then each brand's file.
    scripts: function (p) { return ['js/worlds/brand-kits.js'].concat((p.brands || []).map(function (s) { return 'projects/branding/' + s + '.js'; })); },
    render: render,
    mount: mount,
    ownTones: true
  };
})();
