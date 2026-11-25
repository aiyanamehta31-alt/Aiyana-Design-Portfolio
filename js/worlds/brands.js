/* =====================================================================
   BRANDS · Branding as five separate brand projects (2026-11-26)
   world: 'brands' in projects/branding.js.

   #project/branding            the shelf: five tall covers, one per brand,
                                the one under the pointer opens wide
   #project/branding/<brand>    that brand's own page, nothing else on it

   No two brand pages share a template. Each brand's plan in
   js/worlds/brand-kits.js (BRAND_PAGES) picks its look, its parts and their
   order, how parts are numbered and its own extra:
     Velvet Vine  book    roman numerals, a growing vine, the brand book
     STATIC.      signal  a terminal, the wordmark tuning in, the merch drop
     KOMA         menu    the identity as a menu card with a steaming bun
     Meridian     field   a contour map that bends, the club's three words
     Pebble & Co. play    a mascot that watches and waves, pebble swatches
   Drawn parts (symbols, pattern, stickers, construction grid, packaging
   nets) say "Drawn for this page". Never invent facts: gaps read
   [NEEDS FROM AIYANA: …].
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


  /* ---------- 3. Signature drawings (from the earlier flip book) ---------- */
  function pageOf(b) { return (window.BRAND_PAGES && window.BRAND_PAGES[b.slug]) || { look: 'book', numerals: 'plain', layout: ['top', 'idea', 'logo', 'colour', 'type', 'elements', 'pack', 'world', 'final', 'notes'], alt: [], names: {}, logo: { grid: true, sizes: true } }; }
  var SPARKLE = 'M0 -12C1 -3 3 -1 12 0C3 1 1 3 0 12C-1 3 -3 1 -12 0C-3 -1 -1 -3 0 -12Z';
  var WISP = 'M0 0C-12 -12 12 -24 0 -38C-10 -50 8 -60 2 -72';
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
    var n = pts.length, d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
        (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d + 'Z';
  }
  // Velvet Vine: the vine grows, then each leaf unfolds.
  var LEAF = 'M0 0C20 -19 60 -20 86 0C60 20 20 19 0 0Z';
  function vineSVG() {
    var leaves = [[108, 252, -24], [97, 206, 204], [113, 152, -38], [102, 104, 214], [118, 46, -72]];
    return '<svg class="bd-vine" viewBox="0 0 220 410" aria-hidden="true" focusable="false">' +
      '<path class="bd-vine__stem" pathLength="1" d="M100 400C94 344 122 302 108 252S80 172 112 122S142 54 118 14" />' +
      '<path class="bd-vine__stem" pathLength="1" d="M104 334C80 330 76 302 95 300C108 299 109 315 98 316" />' +
      leaves.map(function (l, i) {
        return '<g transform="translate(' + l[0] + ' ' + l[1] + ') rotate(' + l[2] + ')"><g class="bd-vine__leaf" style="--i:' + i + '">' +
          '<path class="bd-vine__blade" d="' + LEAF + '" /><path class="bd-vine__rib" d="M5 0L78 0" /></g></g>';
      }).join('') +
      '<g class="bd-vine__spark" transform="translate(170 300)"><path d="' + SPARKLE + '" /></g>' +
      '<g class="bd-vine__spark" transform="translate(48 120) scale(0.6)"><path d="' + SPARKLE + '" /></g></svg>';
  }
  // KOMA: the bun draws in line by line under rising steam.
  function bunSVG() {
    var lines = ['M52 214C40 150 90 104 150 102C210 104 260 150 248 214', 'M138 106C136 94 164 94 162 106',
      'M140 110C116 124 104 150 110 176C118 160 128 136 146 114', 'M160 110C184 124 196 150 190 176C182 160 172 136 154 114',
      'M150 112C148 136 150 156 150 172', 'M38 214C70 232 230 232 262 214', 'M38 214C30 242 74 254 150 254C226 254 270 242 262 214'];
    return '<svg class="bd-bun" viewBox="0 0 300 270" aria-hidden="true" focusable="false">' +
      '<g class="bd-bun__steam">' + [118, 150, 182].map(function (x, k) { return '<g transform="translate(' + x + ' 92)"><path style="--k:' + k + '" d="' + WISP + '"/></g>'; }).join('') + '</g>' +
      lines.map(function (d, k) { return '<path class="bd-bun__line" style="--k:' + k + '" pathLength="1" d="' + d + '"/>'; }).join('') + '</svg>';
  }
  // Meridian: contour rings round the summit, the range, the trail up.
  var MAP = { w: 800, h: 440, cx: 470, cy: 168, rings: 11 };
  function mapSVG() {
    var rings = '';
    for (var k = 0; k < MAP.rings; k++) rings += '<path class="bd-map__ring" style="--k:' + k + '" pathLength="1" d="' + smooth(ringPoints(22 + k * 34, k, 72, 1.45, MAP.cx, MAP.cy)) + '"/>';
    return '<svg class="bd-map" viewBox="0 0 ' + MAP.w + ' ' + MAP.h + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<g>' + rings + '</g>' +
      '<path class="bd-map__range" pathLength="1" d="M250 330L340 236L376 266L470 148L540 250L580 218L690 330" />' +
      '<path class="bd-map__trail" pathLength="1" d="M380 438C340 404 432 384 404 352C380 326 452 312 438 280C424 252 470 236 458 206C450 186 472 170 470 152" />' +
      '<circle class="bd-map__peak" cx="470" cy="148" r="5" /></svg>';
  }
  // Pebble & Co.: the mascot, drawn from her illustration.
  function mascotSVG() {
    return '<svg class="bd-mascot" viewBox="0 0 320 300" aria-hidden="true" focusable="false"><g class="bd-mascot__body">' +
      '<g class="bd-mascot__arm bd-mascot__arm--l"><path d="M96 168C74 158 60 140 54 122" /><circle cx="50" cy="114" r="14" /></g>' +
      '<g class="bd-mascot__arm bd-mascot__arm--r"><path d="M224 168C246 158 260 140 266 122" /><circle cx="270" cy="114" r="14" /></g>' +
      '<path class="bd-mascot__leg" d="M134 248L130 270" /><ellipse class="bd-mascot__foot" cx="122" cy="276" rx="18" ry="11" />' +
      '<path class="bd-mascot__leg" d="M186 248L190 270" /><ellipse class="bd-mascot__foot" cx="198" cy="276" rx="18" ry="11" />' +
      '<path class="bd-mascot__shell" d="M160 54C112 54 86 120 84 168C82 220 116 250 160 250C204 250 238 220 236 168C234 120 208 54 160 54Z" />' +
      '<g class="bd-mascot__face"><g class="bd-mascot__eyes"><ellipse cx="140" cy="150" rx="7" ry="11" /><ellipse cx="180" cy="150" rx="7" ry="11" /></g>' +
      '<circle class="bd-mascot__cheek" cx="124" cy="172" r="9" /><circle class="bd-mascot__cheek" cx="196" cy="172" r="9" />' +
      '<path class="bd-mascot__smile" d="M146 176Q160 190 174 176" /></g></g></svg>';
  }

  /* ---------- 4. The shelf: five covers ---------- */
  function coverHTML(b, k, n, where) {
    var pg = pageOf(b);
    var pic = find(b, pg.cover) || b.hero;
    return '<a class="bd-cover" href="#project/branding/' + esc(b.slug) + '" data-brand="' + esc(b.slug) + '" data-bd-open style="' + esc(themeVars(b)) + '" id="bd-cover-' + where + '-' + esc(b.slug) + '">' +
      '<span class="bd-cover__pic" aria-hidden="true">' + img(b, pic, { decorative: true, eager: where === 'shelf' }) + '</span>' +
      '<span class="bd-cover__shade" aria-hidden="true"></span>' +
      '<span class="bd-cover__spine" aria-hidden="true">' + esc(b.name) + '</span>' +
      '<span class="bd-cover__top"><span>' + pad(k + 1) + ' / ' + pad(n) + '</span><span>' + esc(b.category) + '</span></span>' +
      '<span class="bd-cover__foot">' +
        (where === 'next' ? '<span class="bd-cover__kicker">Next brand</span>' : '') +
        '<span class="bd-cover__name">' + esc(b.name) + '</span>' +
        '<span class="bd-cover__line">' + esc(b.line) + '</span>' +
        '<span class="bd-cover__go">View the brand' + ARROW + '</span>' +
      '</span></a>';
  }
  function shelfHTML(p) {
    var list = brandsOf(p);
    return '<div class="bd-view bd-view--shelf" data-bd-view="">' +
      '<section class="bd-shelf-top" id="cs-cover" data-tone="bshelf" aria-labelledby="cs-title"><div class="bd-wide bd-shelf-top__grid">' +
        '<h2 class="bd-shelf-top__title" id="cs-title" tabindex="-1">' + esc(p.title) + '</h2>' +
        '<div class="bd-shelf-top__side">' +
          '<p class="bd-shelf-top__line">' + rich(p.cover && p.cover.line) + '</p>' +
          '<p class="bd-shelf-top__text">' + rich(p.intro) + '</p>' +
          '<p class="bd-shelf-top__tags">' + (p.tags || []).map(esc).join('<span aria-hidden="true"> / </span>') + '</p>' +
        '</div>' +
      '</div></section>' +
      '<section class="bd-shelf" data-tone="bshelf" aria-label="The ' + list.length + ' brands"><ol class="bd-covers bd-wide">' +
        list.map(function (b, k) { return '<li' + (k === 0 ? ' class="is-lead"' : '') + '>' + coverHTML(b, k, list.length, 'shelf') + '</li>'; }).join('') +
      '</ol><p class="bd-shelf__hint bd-wide">Hover to look closer. Open one to see how it was built.</p></section>' +
      '<section class="bd-out" id="bd-out" data-tone="bshelf" aria-label="Next project"><div class="bd-wide">' +
        (p.next ? '<a class="bd-out__next" href="#project/' + esc(p.next.slug) + '"><span>Next project</span><strong>' + esc(p.next.title) + ' ' + ARROW + '</strong></a>' : '') +
        '<a class="bd-out__back" href="#work" data-cs-back>Back to all work</a>' +
      '</div></section>' +
    '</div>';
  }

  /* ---------- 5. A brand's own page, built from its plan ---------- */
  var DEFAULT_NAMES = { top: 'The brand', idea: 'The idea', logo: 'The logo', colour: 'Colour', type: 'Type', elements: 'Brand elements',
    pack: 'Packaging', world: 'In the world', final: 'Final designs', notes: 'Looking back', stickers: 'Stickers' };
  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  var ASIDE = {
    book: { idea: 'where it started', logo: 'and its proportions', colour: 'the brand’s own names', pack: 'opened flat' },
    signal: { idea: '// the brief, in one line', logo: '// final mark + rejected builds', colour: '// sampled from the work', drop: '// six pieces, one identity', pack: '// opened flat', signal: '// lose it, find it again' },
    menu: { menu: 'the identity, served', logo: 'the house mark', colour: 'three, no more', pack: 'opened flat' },
    field: { idea: 'where the trail starts', logo: 'and the marks left behind', colour: 'gold on forest', pack: 'opened flat' },
    play: { idea: 'where it started', mascot: 'say hello', logo: 'and the ones that didn’t make it', colour: 'sunny and soft', pack: 'opened flat' }
  };
  var TRIED = { book: 'Studies', signal: 'Rejected builds', menu: 'Tried, then left out', field: 'Marks left behind', play: 'The ones that didn’t make it' };
  function sid(b, part) { return 'bd-' + b.slug + '-' + part; }
  function nameOf(pg, part, b) {
    if (part === 'pack') { var kit = kitOf(b); return (pg.names && pg.names.pack) || (kit.pack && kit.pack.heading) || DEFAULT_NAMES.pack; }
    return (pg.names && pg.names[part]) || DEFAULT_NAMES[part] || part;
  }
  function numeral(pg, n) {
    if (pg.numerals === 'roman') return ROMAN[n] || String(n);
    if (pg.numerals === 'bracket') return '[' + pad(n) + ']';
    if (pg.numerals === 'no') return 'No. ' + pad(n);
    if (pg.numerals === 'marker') return pad(n);
    return String(n);
  }
  function head(b, pg, part, n) {
    var aside = (ASIDE[pg.look] || {})[part];
    return '<header class="bd-head bd-rise"><span class="bd-head__n" aria-hidden="true">' + esc(numeral(pg, n)) + '</span>' +
      '<h3 class="bd-h" id="' + sid(b, part) + '-h" tabindex="-1">' + rich(nameOf(pg, part, b)) + '</h3>' +
      (aside ? '<p class="bd-head__aside">' + esc(aside) + '</p>' : '') + '</header>';
  }
  function sec(b, pg, part, inner, cls) {
    var alt = (pg.alt || []).indexOf(part) > -1;
    return '<section class="bd-sec bd-sec--' + part + (cls ? ' ' + cls : '') + '" id="' + sid(b, part) + '" data-tone="b-' + esc(b.slug) + (alt ? '-alt' : '') + '"' +
      ' data-part="' + part + '" aria-labelledby="' + sid(b, part) + '-h"><div class="bd-col">' + inner + '</div></section>';
  }
  function drawnTag() { return '<p class="bd-drawn">Drawn for this page</p>'; }
  function facts(b) { return '<dl class="bd-facts">' + (b.facts || []).map(function (f) { return '<div><dt>' + esc(f.label) + '</dt><dd>' + rich(f.value) + '</dd></div>'; }).join('') + '</dl>'; }
  function heroPic(b, cls) { return '<figure class="bd-hero__pic' + (cls ? ' ' + cls : '') + '">' + zoom(b, Object.assign({}, b.hero, { caption: b.name }), '', { eager: true }) + '</figure>'; }

  var PART = {};

  // The brand, opened five different ways.
  PART.top = function (b, kit, pg, n, ctx) {
    var name = '<h3 class="bd-hero__name" id="' + sid(b, 'top') + '-h" tabindex="-1">' + esc(b.name) + '</h3>';
    var line = '<p class="bd-hero__line">' + rich(b.line) + '</p>';
    var count = 'Brand ' + pad(ctx.k + 1) + ' of ' + pad(ctx.n);
    var inner;
    if (pg.look === 'book') {
      inner = '<div class="bd-col bd-hero__stack"><p class="bd-hero__count">' + count + ' · ' + esc(b.category) + '</p>' + name + line +
        '<figure class="bd-hero__pic bd-frame">' + zoom(b, Object.assign({}, b.hero, { caption: b.name }), '', { eager: true }) + '</figure>' + facts(b) + '</div>';
    } else if (pg.look === 'signal') {
      inner = '<div class="bd-col bd-hero__split">' + heroPic(b, 'bd-scan') +
        '<div class="bd-hero__copy"><p class="bd-hero__count"><span>BRAND_' + pad(ctx.k + 1) + '/' + pad(ctx.n) + '</span><span>' + esc(b.category.toUpperCase()) + '</span><span class="bd-blink">SIGNAL FOUND</span></p>' +
        name + line + facts(b) + '</div></div>';
    } else if (pg.look === 'menu') {
      inner = '<div class="bd-hero__plate">' + heroPic(b) + '<div class="bd-hero__label">' + name + '<p class="bd-hero__count">' + count + ' · ' + esc(b.category) + '</p></div></div>' +
        '<div class="bd-col bd-hero__under">' + line + facts(b) + '</div>';
    } else if (pg.look === 'field') {
      inner = '<div class="bd-hero__map" data-bd-map>' + mapSVG() + '</div>' +
        '<div class="bd-col bd-hero__split"><div class="bd-hero__copy"><p class="bd-hero__count">' + count + ' · ' + esc(b.category) + '</p>' + name + line + facts(b) + '</div>' +
        heroPic(b, 'bd-frame') + '</div>';
    } else {
      inner = '<div class="bd-col"><div class="bd-hero__sky">' + patternSVG(b, 'hero', 'hero') +
        '<div class="bd-hero__copy"><p class="bd-hero__count">' + count + ' · ' + esc(b.category) + '</p>' + name + line + '</div>' +
        '<div class="bd-hero__art">' + heroPic(b, 'bd-taped') + '<span class="bd-hero__peek" aria-hidden="true">' + mascotSVG() + '</span></div></div>' + facts(b) + '</div>';
    }
    return '<section class="bd-sec bd-hero bd-hero--' + pg.look + '" id="' + sid(b, 'top') + '" data-tone="b-' + esc(b.slug) + '" data-part="top" aria-labelledby="' + sid(b, 'top') + '-h">' + inner + '</section>';
  };

  PART.idea = function (b, kit, pg, n) {
    var words = kit.keywords || [];
    var book = (b.book || []).slice(0, 4);
    var inner = head(b, pg, 'idea', n);
    if (pg.look === 'book') {
      inner += '<div class="bd-quote bd-rise"><div class="bd-quote__vine bd-drawbox">' + vineSVG() + '</div>' +
        '<blockquote class="bd-quote__text">' + rich(b.idea) + '</blockquote>' +
        '<p class="bd-quote__words">' + words.map(esc).join('<span class="bd-quote__dot" aria-hidden="true"></span>') + '</p></div>';
    } else if (pg.look === 'signal') {
      inner += '<div class="bd-term bd-rise"><p class="bd-term__bar"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>brief.txt</p>' +
        '<div class="bd-term__body"><p><b>&gt;</b> ' + rich(b.line) + '</p><p><b>&gt;</b> ' + rich(b.idea) + '</p>' +
        '<p><b>&gt;</b> keywords: ' + words.map(function (w) { return '<span class="bd-term__tag">' + esc(w) + '</span>'; }).join(' ') + '<span class="bd-term__cursor" aria-hidden="true"></span></p></div></div>' +
        '<div class="bd-strip bd-rise">' + book.map(function (i) { return '<figure class="bd-scan">' + zoom(b, i) + '</figure>'; }).join('') + '</div>';
    } else if (pg.look === 'field') {
      inner += '<div class="bd-waypoints bd-rise"><p class="bd-lead">' + rich(b.idea) + '</p><ol>' + words.map(function (w, j) {
        return '<li><span aria-hidden="true">' + pad(j + 1) + '</span>' + esc(w) + '</li>'; }).join('') + '</ol></div>' +
        '<div class="bd-row3 bd-rise">' + book.slice(1).map(function (i, j) { return '<figure class="bd-frame">' + zoom(b, i) + '<figcaption>' + esc(kit.notes[j + 1] || '') + '</figcaption></figure>'; }).join('') + '</div>';
    } else {
      inner += '<div class="bd-idea bd-rise"><p class="bd-lead">' + rich(b.idea) + '</p>' +
        '<ul class="bd-words" aria-label="Key words">' + words.map(function (w, j) { return '<li style="--j:' + j + '">' + esc(w) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="bd-board bd-rise">' + book.map(function (i, j) {
          return '<figure class="bd-board__pin bd-taped" style="--j:' + j + '">' + zoom(b, i) + (kit.notes[j] ? '<figcaption class="bd-hand">' + esc(kit.notes[j]) + '</figcaption>' : '') + '</figure>';
        }).join('') + '</div>';
    }
    return sec(b, pg, 'idea', inner);
  };

  // Velvet Vine: the brand book, page by page.
  PART.book = function (b, kit, pg, n) {
    var pages = (pg.book || []).map(function (s) { return find(b, s); }).filter(Boolean);
    return sec(b, pg, 'book', head(b, pg, 'book', n) +
      '<div class="bd-book bd-rise" data-bd-book><div class="bd-book__track" tabindex="0" aria-label="Brand book pages, scroll sideways">' + pages.map(function (i, j) {
        return '<figure class="bd-book__page">' + zoom(b, i) + '<figcaption><span>' + pad(j + 1) + '</span>' + esc((function (c) { return c.charAt(0).toUpperCase() + c.slice(1); })(i.caption.replace(/^Brand book:?\s*/i, '') || 'Cover')) + '</figcaption></figure>';
      }).join('') + '</div>' +
      '<div class="bd-book__nav"><button type="button" class="bd-book__btn" data-bd-page="-1" aria-label="Previous page">' + BACK + '</button>' +
        '<p class="bd-book__count" aria-live="polite"><span data-bd-page-n>1</span> / ' + pages.length + '</p>' +
        '<button type="button" class="bd-book__btn" data-bd-page="1" aria-label="Next page">' + ARROW + '</button></div></div>');
  };

  // STATIC.: the wordmark comes through the static.
  PART.signal = function (b, kit, pg, n) {
    var w = find(b, 'logo-chrome.webp') || (b.logo && b.logo.primary[0]);
    return sec(b, pg, 'signal', head(b, pg, 'signal', n) +
      '<div class="bd-tune bd-rise" data-bd-tune><div class="bd-tune__screen">' + img(b, w, { decorative: false }) +
        '<canvas class="bd-tune__noise" width="200" height="62" aria-hidden="true"></canvas><span class="bd-tune__scan" aria-hidden="true"></span></div>' +
        '<div class="bd-tune__side"><p class="bd-lead">' + rich(b.signature && b.signature.text) + '</p>' +
        '<button type="button" class="bd-btn" data-bd-retune>Lose the signal</button></div></div>');
  };

  // STATIC.: the merch drop, as a spec list.
  PART.drop = function (b, kit, pg, n) {
    return sec(b, pg, 'drop', head(b, pg, 'drop', n) +
      '<ol class="bd-drop bd-rise">' + (pg.drop || []).map(function (d, j) {
        var i = find(b, d.src);
        return '<li><span class="bd-drop__n">' + pad(j + 1) + '</span>' + (i ? '<span class="bd-drop__pic"' + (d.pos ? ' style="--pos:' + esc(d.pos) + '"' : '') + '>' + zoom(b, i) + '</span>' : '') +
          '<strong>' + esc(d.name) + '</strong><span class="bd-drop__what">' + esc(d.what) + '</span></li>';
      }).join('') + '</ol>');
  };

  // KOMA: the identity as a menu card, the bun steaming at the top.
  PART.menu = function (b, kit, pg, n) {
    return sec(b, pg, 'menu', head(b, pg, 'menu', n) +
      '<p class="bd-lead bd-rise">' + rich(b.idea) + '</p>' +
      '<div class="bd-menu bd-rise"><div class="bd-menu__bun bd-drawbox">' + bunSVG() + '</div>' +
        '<p class="bd-menu__title">' + esc(b.name) + '</p><p class="bd-menu__sub">' + rich(b.line) + '</p>' +
        '<ol class="bd-menu__list">' + (pg.menu || []).map(function (m) {
          return '<li><span class="bd-menu__name">' + esc(m.name) + '</span><span class="bd-menu__dots" aria-hidden="true"></span><span class="bd-menu__what">' + esc(m.what) + '</span></li>';
        }).join('') + '</ol>' +
        '<p class="bd-menu__foot">' + (kit.keywords || []).map(esc).join(' · ') + '</p></div>');
  };

  // Meridian: the three words from the tag.
  PART.tagline = function (b, kit, pg, n) {
    return '<section class="bd-sec bd-sec--tagline" id="' + sid(b, 'tagline') + '" data-tone="b-' + esc(b.slug) + '" data-part="tagline" aria-labelledby="' + sid(b, 'tagline') + '-h">' +
      '<div class="bd-col"><h3 class="bd-tagline" id="' + sid(b, 'tagline') + '-h" tabindex="-1">' + (pg.tagline || []).map(function (w, j) {
        return '<span class="bd-rise" style="--j:' + j + '">' + esc(w) + '</span>'; }).join(' ') + '</h3>' +
      '<p class="bd-small bd-rise">The club’s three words, from the back of its hang tag.</p></div></section>';
  };

  // Pebble & Co.: the mascot, alive.
  PART.mascot = function (b, kit, pg, n) {
    var orig = find(b, 'logo-mascot.webp');
    return sec(b, pg, 'mascot', head(b, pg, 'mascot', n) +
      '<div class="bd-meet bd-rise"><button type="button" class="bd-meet__pebble" data-bd-mascot aria-label="The pebble mascot. Click to make it wave.">' + mascotSVG() + '</button>' +
        '<div class="bd-meet__side"><ul class="bd-meet__list">' + (pg.mascot || []).map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
        '<p class="bd-small">It watches your pointer. Click it and it waves. Redrawn in code from the original:</p>' +
        (orig ? '<figure class="bd-meet__orig">' + zoom(b, orig) + '</figure>' : '') + '</div></div>');
  };

  PART.logo = function (b, kit, pg, n) {
    var prim = (b.logo && b.logo.primary) || [], ex = (b.logo && b.logo.explorations) || [];
    var main = prim[0], opt = pg.logo || {};
    var inner = head(b, pg, 'logo', n);
    if (main) {
      var m = Math.min(main.width, main.height);
      inner += '<div class="bd-logo bd-rise' + (opt.grid ? '' : ' bd-logo--plain') + '">' +
        '<figure class="bd-logo__main' + (opt.grid ? '' : ' is-plain') + '" data-bd-construct>' +
          '<div class="bd-logo__stage"><div class="bd-logo__frame" style="aspect-ratio:' + (main.width + Math.round(m * 0.32)) + '/' + (main.height + Math.round(m * 0.32)) +
            ';--pad:' + (m * 0.16 / (main.width + m * 0.32) * 100).toFixed(2) + '%;--padY:' + (m * 0.16 / (main.height + m * 0.32) * 100).toFixed(2) + '%">' +
            img(b, main) + (opt.grid ? constructSVG(main) : '') + '</div></div>' +
          '<figcaption><span>' + esc(main.caption) + '</span>' + (opt.grid ? '<button type="button" class="bd-toggle" data-bd-grid aria-pressed="true">Construction grid</button>' : '') + '</figcaption>' +
        '</figure>' +
        (prim[1] ? '<figure class="bd-logo__second">' + zoom(b, prim[1]) + '<figcaption>' + esc(prim[1].caption) + '</figcaption></figure>' : '') +
        (opt.grid ? '<p class="bd-logo__note">The grid and the clear space (<em>x</em>, the space kept empty round the mark) are drawn over the final logo for this page.</p>' : '') +
      '</div>';
      if (opt.sizes) inner += '<div class="bd-sizes bd-rise" aria-label="The logo at three sizes">' + ['Large', 'Medium', 'Small'].map(function (s, j) {
        return '<figure class="bd-sizes__item bd-sizes__item--' + j + '"><div>' + img(b, prim[1] && j === 2 ? prim[1] : main, { decorative: true }) + '</div><figcaption>' + s + '</figcaption></figure>';
      }).join('') + '</div>';
    }
    if (ex.length) inner += '<div class="bd-tried bd-rise"><h4 class="bd-h4">' + esc(TRIED[pg.look] || 'Marks that didn’t make it') + '</h4><ul class="bd-tried__list">' + ex.map(function (i, j) {
      return '<li style="--j:' + j + '">' + zoom(b, i) + '<span class="bd-tried__cap">' + (pg.look === 'signal' ? 'BUILD_' + pad(j + 1) + ' · ' : '') + esc(i.caption) + '</span></li>';
    }).join('') + '</ul></div>';
    return sec(b, pg, 'logo', inner);
  };

  PART.colour = function (b, kit, pg, n) {
    var cols = b.colours || [];
    var share = cols.length === 4 ? [44, 26, 18, 12] : cols.length === 3 ? [60, 30, 10] : cols.map(function () { return Math.round(100 / cols.length); });
    function on(c) { return lum(c.hex) > 0.4 ? '#141414' : '#FFFFFF'; }
    function codes(c) { var r = hexRgb(c.hex); return { hex: c.hex.toUpperCase(), rgb: r.join(' '), cmyk: cmyk(c.hex) }; }
    var inner = head(b, pg, 'colour', n), body;
    if (pg.look === 'book') {
      body = '<div class="bd-strips bd-rise">' + cols.map(function (c, j) { var x = codes(c);
        return '<div class="bd-strips__one" style="--c:' + c.hex + ';--on:' + on(c) + ';flex:' + share[j] + '"><span class="bd-strips__name">' + esc(c.name) + '</span>' +
          '<span class="bd-strips__codes">' + x.hex + '<br>RGB ' + x.rgb + '<br>CMYK ' + x.cmyk + '</span></div>'; }).join('') + '</div>' +
        '<p class="bd-small">Widths show a suggested balance, drawn for this page. CMYK is a screen conversion: proof it before printing.</p>';
    } else if (pg.look === 'signal') {
      body = '<table class="bd-readout bd-rise"><thead><tr><th scope="col">Swatch</th><th scope="col">Name</th><th scope="col">HEX</th><th scope="col">RGB</th><th scope="col">CMYK</th><th scope="col">Use</th></tr></thead><tbody>' +
        cols.map(function (c, j) { var x = codes(c); return '<tr><td><span class="bd-readout__sw" style="--c:' + c.hex + '"></span></td><th scope="row">' + esc(c.name.toUpperCase()) + '</th><td>' + x.hex + '</td><td>' + x.rgb + '</td><td>' + x.cmyk + '</td><td>' + (share[j] || '') + '%</td></tr>'; }).join('') +
        '</tbody></table><p class="bd-small">// use = a suggested balance, drawn for this page. CMYK is a screen conversion.</p>';
    } else if (pg.look === 'field') {
      body = '<ul class="bd-plates bd-rise">' + cols.map(function (c, j) { var x = codes(c);
        return '<li style="--c:' + c.hex + '"><span class="bd-plates__face" aria-hidden="true"></span><strong>' + esc(c.name) + '</strong><span>' + x.hex + ' · RGB ' + x.rgb + '<br>CMYK ' + x.cmyk + '</span></li>'; }).join('') + '</ul>' +
        mixBar(cols, share, on);
    } else if (pg.look === 'play') {
      body = '<ul class="bd-pebbles bd-rise">' + cols.map(function (c, j) { var x = codes(c);
        return '<li style="--c:' + c.hex + ';--on:' + on(c) + ';--j:' + j + '"><span class="bd-pebbles__stone">' + esc(c.name) + '</span><span class="bd-pebbles__codes">' + x.hex + '<br>RGB ' + x.rgb + '</span></li>'; }).join('') + '</ul>' +
        mixBar(cols, share, on);
    } else {
      body = '<ul class="bd-chips bd-rise">' + cols.map(function (c, j) { var x = codes(c);
        return '<li class="bd-chip" style="--c:' + c.hex + ';--on:' + on(c) + ';--j:' + j + '"><div class="bd-chip__face"><span class="bd-chip__name">' + esc(c.name) + '</span></div>' +
          '<div class="bd-chip__tints" aria-hidden="true">' + [0.25, 0.5, 0.75].map(function (v) { return '<span style="background:' + mix(c.hex, '#FFFFFF', v) + '"></span>'; }).join('') + '</div>' +
          '<dl class="bd-chip__codes"><div><dt>HEX</dt><dd>' + x.hex + '</dd></div><div><dt>RGB</dt><dd>' + x.rgb + '</dd></div><div><dt>CMYK</dt><dd>' + x.cmyk + '</dd></div></dl></li>'; }).join('') + '</ul>' +
        mixBar(cols, share, on);
    }
    return sec(b, pg, 'colour', inner + body);
  };
  function mixBar(cols, share, on) {
    return '<div class="bd-mix bd-rise"><h4 class="bd-h4">How much of each</h4><div class="bd-mix__bar">' + cols.map(function (c, j) {
      return '<span style="--c:' + c.hex + ';flex:' + share[j] + ';--on:' + on(c) + '"><b>' + share[j] + '%</b></span>';
    }).join('') + '</div><p class="bd-small">A suggested balance, drawn for this page. CMYK is a screen conversion: proof it before printing.</p></div>';
  }

  PART.type = function (b, kit, pg, n) {
    var t = b.theme;
    var set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 &amp; ! ? .';
    return sec(b, pg, 'type', head(b, pg, 'type', n) + '<div class="bd-type bd-rise">' +
      '<label class="bd-type__try"><span>' + (pg.look === 'signal' ? '&gt; type_something' : 'Type something to try the fonts') + '</span><input type="text" data-bd-tester maxlength="40" value="' + esc(b.name) + '" autocomplete="off" spellcheck="false" /></label>' +
      '<div class="bd-spec bd-spec--head"><p class="bd-spec__aa" aria-hidden="true">Aa</p><div><p class="bd-spec__name">' + esc(t.headingName) + '</p><p class="bd-spec__use">Headings and the big moments</p><p class="bd-spec__set" aria-hidden="true">' + set + '</p></div>' +
        '<p class="bd-spec__sample" data-bd-sample>' + esc(b.name) + '</p></div>' +
      '<div class="bd-spec bd-spec--body"><p class="bd-spec__aa" aria-hidden="true">Aa</p><div><p class="bd-spec__name">' + esc(t.bodyName) + '</p><p class="bd-spec__use">Everything people read</p><p class="bd-spec__set" aria-hidden="true">' + set + '</p></div>' +
        '<p class="bd-spec__sample bd-spec__sample--body" data-bd-sample>' + esc(b.name) + '</p></div>' +
      '<p class="bd-small">The closest free web fonts to the brand’s lettering, so the page can set it live.</p></div>');
  };

  PART.elements = function (b, kit, pg, n) {
    var photo = find(b, (kit.world || [])[0]) || b.hero;
    return sec(b, pg, 'elements', head(b, pg, 'elements', n) + drawnTag() +
      '<div class="bd-el-grid">' +
        '<div class="bd-symbols bd-rise"><h4 class="bd-h4">Symbols</h4><ul>' + kit.symbols.map(function (s, j) {
          return '<li style="--j:' + j + '">' + symSVG(kit, s, 'bd-draw') + '<span>' + esc(s.name) + '</span></li>'; }).join('') + '</ul></div>' +
        '<div class="bd-patternbox bd-rise" data-bd-way="ground"><h4 class="bd-h4">Pattern</h4><div class="bd-patternbox__tile">' + patternSVG(b, 'tile', 'tile') + '</div>' +
          '<button type="button" class="bd-toggle" data-bd-swap aria-pressed="false">Swap the colourway</button></div>' +
        '<div class="bd-stickers bd-rise"><h4 class="bd-h4">' + esc(nameOf(pg, 'stickers', b)) + '</h4><div class="bd-stickers__row">' + kit.badges.map(function (bg, j) { return badgeSVG(b, bg, j); }).join('') + '</div>' +
          '<p class="bd-small">The words come from the brand’s own posters and tags.</p></div>' +
        '<figure class="bd-water bd-rise"><h4 class="bd-h4">Watermark</h4><div class="bd-water__pic">' + img(b, photo, { decorative: true }) +
          '<span class="bd-water__mark" aria-hidden="true">' + new Array(9).join('<span>' + esc(b.name) + '</span>') + '</span>' +
          '<span class="bd-water__corner" aria-hidden="true">' + (kit.symbols[0] ? symSVG(kit, kit.symbols[0]) : '') + esc(b.name) + '</span></div>' +
          '<figcaption class="bd-small">For photos and posts shared before launch: the name runs faintly across, the mark sits in the corner.</figcaption></figure>' +
      '</div>');
  };

  PART.pack = function (b, kit, pg, n) {
    if (!kit.pack) return '';
    var t = kit.pack.type;
    return sec(b, pg, 'pack', head(b, pg, 'pack', n) + '<p class="bd-lead bd-rise">' + rich(kit.pack.text) + '</p>' +
      '<div class="bd-pack bd-rise"><figure class="bd-mat">' + netSVG(b) +
        '<figcaption><span class="bd-legend bd-legend--cut">cut</span>' +
          (t === 'wrap' || t === 'box' ? '<span class="bd-legend bd-legend--fold">fold</span><span class="bd-legend bd-legend--glue">glue</span>' : '<span class="bd-legend bd-legend--kiss">' + (t === 'stickers' ? 'kiss cut' : 'hole for the string') + '</span>') +
          '<span class="bd-drawn bd-drawn--inline">Drawn for this page</span></figcaption></figure>' +
        '<div class="bd-pack__real">' + (kit.pack.photos || []).map(function (s, j) {
          var i = find(b, s); return i ? '<figure style="--j:' + j + '">' + zoom(b, i) + '<figcaption>' + esc(j ? 'Up close' : 'The real thing') + '</figcaption></figure>' : '';
        }).join('') + '</div></div>');
  };

  PART.world = function (b, kit, pg, n) {
    var wl = (kit.world || []).map(function (s) { return find(b, s); }).filter(Boolean);
    if (!wl.length) return '';
    return sec(b, pg, 'world', head(b, pg, 'world', n) +
      '<div class="bd-world bd-rise"' + (pg.look === 'field' ? ' tabindex="0" aria-label="Photos, scroll sideways"' : '') + '>' + wl.map(function (i, j) {
        return '<figure class="bd-world__item bd-world__item--' + j + '">' + zoom(b, i) + '<figcaption>' + rich(i.caption) + (i.note ? ' <span class="bd-note">' + rich(i.note) + '</span>' : '') + '</figcaption></figure>';
      }).join('') + '</div>');
  };

  PART.final = function (b, kit, pg, n) {
    return '<section class="bd-sec bd-sec--final" id="' + sid(b, 'final') + '" data-tone="b-' + esc(b.slug) + '" data-part="final" aria-labelledby="' + sid(b, 'final') + '-h">' +
      '<div class="bd-banner"><div class="bd-banner__run" aria-hidden="true">' + new Array(7).join('<span>Final designs</span>' + (kit.symbols[0] ? symSVG(kit, kit.symbols[0]) : '')) + '</div>' +
        '<h3 class="bd-banner__h" id="' + sid(b, 'final') + '-h" tabindex="-1"><span class="bd-head__n" aria-hidden="true">' + esc(numeral(pg, n)) + '</span>Final designs</h3></div>' +
      '<div class="bd-col"><ul class="bd-wall">' + (b.gallery || []).map(function (i, j) {
        return '<li class="bd-wall__item bd-rise" style="--j:' + (j % 3) + '">' + zoom(b, i) + '<span class="bd-wall__cap">' + rich(i.caption) + '</span></li>';
      }).join('') + '</ul></div></section>';
  };

  PART.notes = function (b, kit, pg, n) {
    return sec(b, pg, 'notes', head(b, pg, 'notes', n) +
      '<ul class="bd-notes bd-rise">' + (b.reflection || []).map(function (r) { return '<li><strong>' + esc(r.title) + '</strong><span>' + rich(r.text) + '</span></li>'; }).join('') + '</ul>');
  };

  function brandHTML(p, b, k, list) {
    var kit = kitOf(b), pg = pageOf(b);
    var next = list[(k + 1) % list.length];
    var ctx = { k: k, n: list.length };
    var h = '<nav class="bd-switch" aria-label="Brands"><div class="bd-col">' +
      '<a class="bd-switch__all" href="#project/branding">' + BACK + 'All brands</a>' +
      '<ol>' + list.map(function (o) {
        return '<li><a href="#project/branding/' + esc(o.slug) + '"' + (o === b ? ' aria-current="page"' : '') + '>' + esc(o.name) + '</a></li>';
      }).join('') + '</ol></div></nav>';
    var n = 0;
    pg.layout.forEach(function (part) {
      if (!PART[part]) return;
      if (part !== 'top' && part !== 'tagline') n++;
      h += PART[part](b, kit, pg, n, ctx);
    });
    h += '<section class="bd-sec bd-sec--next" id="' + sid(b, 'next') + '" data-tone="b-' + esc(b.slug) + '" aria-label="Next brand">' +
      '<div class="bd-wide">' + coverHTML(next, list.indexOf(next), list.length, 'next') + '</div>' +
      '<div class="bd-col bd-sec--next__back"><a class="bd-switch__all" href="#project/branding">' + BACK + 'All brands</a></div></section>';
    return '<div class="bd-view bd-view--brand bd-look--' + pg.look + '" data-bd-view="' + esc(b.slug) + '" data-brand="' + esc(b.slug) + '" style="' + esc(themeVars(b)) + '" hidden>' + h + '</div>';
  }

  function render(p) {
    var list = brandsOf(p);
    return '<div class="bd" data-bd>' + shelfHTML(p) + list.map(function (b, k) { return brandHTML(p, b, k, list); }).join('') +
      '<div class="bd-wipe" data-bd-wipe aria-hidden="true"></div></div>';
  }

  /* ---------- 6. Mount ---------- */
  function mount(ctx) {
    var p = ctx.project, scroller = ctx.scroller, sheet = ctx.sheet, reduce = ctx.reduceMotion;
    var box = ctx.content.querySelector('[data-bd]');
    var list = brandsOf(p);
    var cleanups = [];
    function on(el, type, fn, opt) { if (!el) return; el.addEventListener(type, fn, opt); cleanups.push(function () { el.removeEventListener(type, fn, opt); }); }
    function later(fn, ms) { var t = setTimeout(fn, ms); cleanups.push(function () { clearTimeout(t); }); }
    sheet.classList.add('bd-sheet');
    cleanups.push(function () { sheet.classList.remove('bd-sheet'); sheet.removeAttribute('data-bd-brand'); });

    list.forEach(function (b) {
      var url = b.theme && b.theme.fonts;
      if (!url || document.querySelector('link[data-bd-font="' + b.slug + '"]')) return;
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = url; l.setAttribute('data-bd-font', b.slug);
      document.head.appendChild(l);
    });

    // Reveals: things rise, and drawings draw, once, as they come in.
    var WATCH = '.bd-rise, .bd-logo__main, .bd-symbols, .bd-drawbox, .bd-hero__map, [data-bd-tune]';
    var io = null;
    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(box.querySelectorAll(WATCH), function (el) { el.classList.add('is-in', 'is-tuned'); });
    } else {
      box.classList.add('bd-motion');
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          if (e.target.hasAttribute('data-bd-tune')) tuneIn(e.target);
          io.unobserve(e.target);
        });
      }, { root: scroller, rootMargin: '0px 0px -10% 0px' });
      Array.prototype.forEach.call(box.querySelectorAll(WATCH), function (el) { io.observe(el); });
      cleanups.push(function () { io.disconnect(); });
    }

    // STATIC.: the wordmark comes through TV static.
    var tuneRaf = 0;
    cleanups.push(function () { cancelAnimationFrame(tuneRaf); });
    function tuneIn(tb) {
      var canvas = tb.querySelector('canvas'), pic = tb.querySelector('.bd-tune__screen img');
      if (reduce || !canvas || !canvas.getContext) { tb.classList.add('is-tuned'); return; }
      cancelAnimationFrame(tuneRaf);
      var g = canvas.getContext('2d'), data = g.createImageData(canvas.width, canvas.height);
      var start = performance.now(), dur = 1700;
      tb.classList.remove('is-tuned');
      (function frame(now) {
        var t = Math.min(1, (now - start) / dur), left = 1 - t;
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
        else { g.clearRect(0, 0, canvas.width, canvas.height); pic.style.transform = pic.style.filter = ''; tb.classList.add('is-tuned'); }
      })(start);
    }

    // Meridian: the contour rings bend away from the pointer.
    Array.prototype.forEach.call(box.querySelectorAll('[data-bd-map]'), function (mb) {
      var svg = mb.querySelector('svg'), section = mb.closest('section');
      var rings = Array.prototype.slice.call(svg.querySelectorAll('.bd-map__ring'));
      var base = rings.map(function (el, k) { return ringPoints(22 + k * 34, k, 72, 1.45, MAP.cx, MAP.cy); });
      var pointer = null, raf = 0;
      function draw() {
        raf = 0;
        rings.forEach(function (el, k) {
          el.setAttribute('d', smooth(base[k].map(function (pt) {
            if (!pointer) return pt;
            var dx = pt[0] - pointer[0], dy = pt[1] - pointer[1], dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist > 140) return pt;
            var f = Math.pow(1 - dist / 140, 2) * 36;
            return [pt[0] + dx / dist * f, pt[1] + dy / dist * f];
          })));
        });
      }
      if (reduce) return;
      on(section, 'pointermove', function (e) {
        var r = svg.getBoundingClientRect();
        // The svg is sliced to cover; map the pointer through the same fit.
        var s = Math.max(r.width / MAP.w, r.height / MAP.h);
        var ox = (r.width - MAP.w * s) / 2, oy = (r.height - MAP.h * s) / 2;
        pointer = [(e.clientX - r.left - ox) / s, (e.clientY - r.top - oy) / s];
        if (!raf) raf = requestAnimationFrame(draw);
      });
      on(section, 'pointerleave', function () { pointer = null; if (!raf) raf = requestAnimationFrame(draw); });
      cleanups.push(function () { cancelAnimationFrame(raf); });
    });

    // Pebble & Co.: blink, look towards the pointer, wave on click.
    Array.prototype.forEach.call(box.querySelectorAll('[data-bd-mascot]'), function (btn) {
      var face = btn.querySelector('.bd-mascot__face'), section = btn.closest('section');
      if (!reduce) {
        var blink = setInterval(function () { btn.classList.add('is-blinking'); setTimeout(function () { btn.classList.remove('is-blinking'); }, 160); }, 3400);
        cleanups.push(function () { clearInterval(blink); });
        on(section, 'pointermove', function (e) {
          var r = btn.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.45);
          var d = Math.sqrt(dx * dx + dy * dy) || 1, m = Math.min(1, d / 300);
          face.style.transform = 'translate(' + (dx / d * 9 * m).toFixed(1) + 'px,' + (dy / d * 6 * m).toFixed(1) + 'px)';
        });
        on(section, 'pointerleave', function () { face.style.transform = ''; });
      }
      on(btn, 'click', function () {
        if (reduce) return;
        btn.classList.remove('is-waving'); void btn.offsetWidth; btn.classList.add('is-waving');
        later(function () { btn.classList.remove('is-waving'); }, 1300);
      });
    });

    // Velvet Vine: the brand book pages, one by one.
    Array.prototype.forEach.call(box.querySelectorAll('[data-bd-book]'), function (bk) {
      var track = bk.querySelector('.bd-book__track'), pages = track.children, count = bk.querySelector('[data-bd-page-n]');
      function current() {
        var best = 0, mid = track.scrollLeft + track.clientWidth / 2, gap = Infinity;
        Array.prototype.forEach.call(pages, function (pgEl, j) { var c = pgEl.offsetLeft + pgEl.offsetWidth / 2; if (Math.abs(c - mid) < gap) { gap = Math.abs(c - mid); best = j; } });
        return best;
      }
      on(track, 'scroll', function () { count.textContent = String(current() + 1); }, { passive: true });
      Array.prototype.forEach.call(bk.querySelectorAll('[data-bd-page]'), function (btn) {
        on(btn, 'click', function () {
          var j = Math.max(0, Math.min(pages.length - 1, current() + Number(btn.getAttribute('data-bd-page'))));
          var el = pages[j];
          track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
        });
      });
    });

    // Switches, the tester, and remembering where a brand was opened from.
    var lastPoint = null;
    on(box, 'click', function (e) {
      var g = e.target.closest('[data-bd-grid]');
      if (g) { var fig = g.closest('[data-bd-construct]'); var off = fig.classList.toggle('is-plain'); g.setAttribute('aria-pressed', off ? 'false' : 'true'); return; }
      var s = e.target.closest('[data-bd-swap]');
      if (s) { var pb = s.closest('.bd-patternbox'); var alt = pb.getAttribute('data-bd-way') !== 'alt'; pb.setAttribute('data-bd-way', alt ? 'alt' : 'ground'); s.setAttribute('aria-pressed', alt ? 'true' : 'false'); return; }
      var rt = e.target.closest('[data-bd-retune]');
      if (rt) { tuneIn(rt.closest('[data-bd-tune]')); return; }
      var open = e.target.closest('[data-bd-open], .bd-switch a');
      if (open) { var r = open.getBoundingClientRect(); lastPoint = { x: e.clientX || r.left + r.width / 2, y: e.clientY || r.top + r.height / 2 }; }
    }, true);
    on(box, 'input', function (e) {
      if (!e.target.matches('[data-bd-tester]')) return;
      var v = e.target.value.trim() || ' ';
      Array.prototype.forEach.call(e.target.closest('.bd-type').querySelectorAll('[data-bd-sample]'), function (el) { el.textContent = v; });
    });

    // Showing one view (the shelf, or one brand) and its glider.
    var current = null, glider = null, wipeTimer = 0, settle = [];
    cleanups.push(function () { settle.forEach(clearTimeout); clearTimeout(wipeTimer); if (glider) glider.destroy(); });
    var wipe = box.querySelector('[data-bd-wipe]');
    if (wipe) { sheet.appendChild(wipe); cleanups.push(function () { if (wipe.parentNode) wipe.parentNode.removeChild(wipe); }); }
    function barH() { return parseFloat(getComputedStyle(sheet).getPropertyValue('--cs-bar-h')) || 60; }
    function makeGlider(view, b) {
      if (glider) { glider.destroy(); glider = null; }
      if (!window.CaseGlider) return;
      var items;
      if (!b) {
        items = [{ name: 'Branding', sub: list.length + ' brands', el: view.querySelector('#cs-cover'), focus: view.querySelector('#cs-title') },
          { name: 'The five brands', el: view.querySelector('.bd-shelf') },
          { name: 'Next project', sub: p.next ? p.next.title : '', el: view.querySelector('#bd-out') }];
      } else {
        var pg = pageOf(b);
        items = pg.layout.map(function (part) {
          var el = view.querySelector('#' + sid(b, part));
          return el && { name: nameOf(pg, part, b), sub: part === 'top' ? b.name : '', el: el, focus: view.querySelector('#' + sid(b, part) + '-h') };
        }).filter(Boolean).concat([{ name: 'Next brand', sub: list[(list.indexOf(b) + 1) % list.length].name, el: view.querySelector('#' + sid(b, 'next')) }]);
      }
      glider = window.CaseGlider({
        sheet: sheet, scroller: scroller, content: ctx.content, lenis: ctx.lenis, reduceMotion: reduce,
        cls: 'bd-glider' + (b ? ' bd-glider--' + pageOf(b).look : ' bd-glider--shelf'),
        label: b ? b.name + ', part by part' : 'Branding',
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
        // Measure again once the sheet has opened and the brand's fonts are in.
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

    show(ctx.page || '', false);
    return {
      route: function (page) { show(page || '', true); },
      destroy: function () { cleanups.forEach(function (fn) { fn(); }); }
    };
  }

  worlds.brands = {
    css: 'css/worlds/brands.css',
    scripts: function (p) { return ['js/worlds/brand-kits.js'].concat((p.brands || []).map(function (s) { return 'projects/branding/' + s + '.js'; })); },
    render: render,
    mount: mount,
    ownTones: true
  };
})();
