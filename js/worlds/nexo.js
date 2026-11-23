/* =====================================================================
   NEXO · its own world inside the glass sheet
   js/case-study.js loads this file (and css/worlds/nexo.css) when a
   project's data says world: 'nexo'. It gives the shell two functions:

     render(p)    the project data (projects/nexo.js) → HTML, in its
                  finished state, so it reads fine with no script/motion
     mount(ctx)   adds the motion on top, and returns { destroy }

   1. Helpers           5. The thread
   2. Scenes → HTML     6. The phase dock
   3. Mount             7. Scene motion (GSAP + ScrollTrigger)
   4. Measuring         8. Small live parts (AEIOU tabs, form steps, face)
   Easing for reveals: cubic-bezier(0.22, 1, 0.36, 1); every reveal is a
   fromTo, so elements always land exactly where the layout put them.
   ===================================================================== */
(function () {
  'use strict';

  var worlds = window.CASE_WORLDS = window.CASE_WORLDS || {};

  /* ---------- 1. Helpers ---------- */
  var EASE = 'nxOut';           // registered on mount: cubic-bezier(0.22, 1, 0.36, 1)
  var BEZIER = [0.22, 1, 0.36, 1];
  var easeReady = false;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Text with every [NEEDS FROM AIYANA ...] marked up so it can't be missed.
  function rich(value) {
    return esc(value).replace(/\[NEEDS FROM AIYANA[^\]]*\]/g, function (m) { return '<mark class="nx-needs">' + m + '</mark>'; });
  }
  function plain(value) { return String(value || '').replace(/\[NEEDS FROM AIYANA[^\]]*\]/g, '').trim(); }
  function f(n) { return Math.round(n * 10) / 10; }

  var P = null;   // the project data while rendering
  function src(name) { return esc(P.images + name); }
  function img(i, cls, eager) {
    return '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + src(i.src) + '" width="' + i.width + '" height="' + i.height +
      '" alt="' + esc(i.alt || '') + '"' + (eager ? '' : ' loading="lazy"') + ' decoding="async" />';
  }
  // An image that opens in the shell's glass lightbox (data-zoom + data-group).
  function zoom(i, group, caption, cls) {
    return '<button type="button" class="nx-zoom' + (cls ? ' ' + cls : '') + '" data-zoom data-group="' + esc(group) +
      '" data-caption="' + esc(plain(caption || i.caption || i.alt)) + '"><span class="sr-only">Open larger: </span>' + img(i) + '</button>';
  }

  // A smooth closed curve through points (Catmull-Rom as cubic Béziers).
  function closedCurve(p) {
    var n = p.length;
    var d = 'M' + f(p[0][0]) + ' ' + f(p[0][1]);
    for (var i = 0; i < n; i++) {
      var p0 = p[(i - 1 + n) % n], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[(i + 2) % n];
      d += 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        f(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ' ' + f(p2[1]);
    }
    return d + 'Z';
  }
  // An open smooth curve (for the journey's emotion curves).
  function openCurve(p) {
    var d = 'M' + f(p[0][0]) + ' ' + f(p[0][1]);
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
      d += 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        f(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ' ' + f(p2[1]);
    }
    return d;
  }
  // Nexo's face blob: nine soft lobes that drift with time t.
  function blob(t, cx, cy, r) {
    var pts = [];
    for (var i = 0; i < 36; i++) {
      var a = i / 36 * Math.PI * 2;
      var k = 1 + 0.15 * Math.sin(9 * a + t * 0.8) + 0.07 * Math.sin(4 * a - t * 1.3) + 0.05 * Math.sin(2 * a + t * 0.6);
      pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]);
    }
    return closedCurve(pts);
  }
  function face(cls) {
    return '<svg class="nx-face ' + (cls || '') + '" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
      '<circle class="nx-face__ring" cx="60" cy="60" r="54" />' +
      '<circle class="nx-face__screen" cx="60" cy="60" r="46" />' +
      '<path class="nx-face__blob" d="' + blob(0, 60, 60, 24) + '" /></svg>';
  }

  /* ---------- 2. Scenes → HTML ---------- */
  function phase(id) {
    var ph = P.phases.filter(function (x) { return x.id === id; })[0];
    return '<header class="nx-phase" data-phase-head="' + id + '">' +
      '<h3 class="nx-phase__name" id="nx-h-' + id + '" tabindex="-1">' + esc(ph.name) + '</h3>' +
      '<p class="nx-phase__real">' + esc(ph.real) + '</p></header>';
  }
  // A scene: tone = the glass tint, side = the margin it leans to.
  function scene(o, inner) {
    return '<section class="cs-section nx-s nx-s--' + o.id + '" id="nx-' + o.id + '" data-tone="' + o.tone + '" data-side="' + o.side + '"' +
      (o.phase ? ' data-phase-id="' + o.phase + '"' : '') + ' aria-labelledby="' + o.label + '">' + inner + '</section>';
  }
  // Words wrapped one by one; key words (compared without punctuation) get the accent.
  function words(text, keys) {
    var k = (keys || []).map(function (x) { return x.replace(/[^\w]/g, '').toLowerCase(); });
    return String(text).split(/\s+/).map(function (w) {
      var key = k.indexOf(w.replace(/[^\w]/g, '').toLowerCase()) > -1;
      return '<span class="nx-word' + (key ? ' is-key' : '') + '">' + esc(w) + '</span>';
    }).join(' ');
  }

  function coverHTML(p) {
    var c = p.cover;
    return '<section class="cs-section nx-s nx-cover" id="cs-cover" data-tone="paper" data-side="l" aria-labelledby="cs-title">' +
      '<div class="nx-wrap nx-cover__grid">' +
        '<h2 class="nx-cover__title" id="cs-title"><img src="' + src(c.logo.src) + '" width="' + c.logo.width + '" height="' + c.logo.height + '" alt="Nexo" fetchpriority="high" decoding="async" /></h2>' +
        '<div class="nx-cover__render">' + img(c.render, 'nx-cover__img', true) + '</div>' +
        '<div class="nx-cover__meta">' +
          '<p class="nx-cover__tagline">' + rich(c.tagline) + '</p>' +
          '<p class="nx-cover__summary">' + rich(c.summary) + '</p>' +
          '<dl class="nx-facts">' + c.facts.map(function (x) {
            return '<div><dt>' + rich(x.label) + '</dt><dd>' + rich(x.value) + '</dd></div>';
          }).join('') + '</dl>' +
        '</div>' +
        '<div class="nx-cover__pulse" data-thread-start>' + face('nx-face--cover') + '<span class="nx-cover__pulse-ring" aria-hidden="true"></span></div>' +
      '</div></section>';
  }

  function openerHTML(p) {
    var o = p.opener;
    return scene({ id: 'whine', tone: 'paper', side: 'l', phase: 'whine', label: 'nx-h-whine' },
      '<div class="nx-wrap">' + phase('whine') + '</div>' +
      '<div class="nx-pin" data-pin="1.3"><div class="nx-stage nx-opener__stage"><div class="nx-wrap nx-opener__inner">' +
        '<div class="nx-opener__scene">' +
          '<img class="nx-opener__owner" src="' + src(o.owner.src) + '" width="' + o.owner.width + '" height="' + o.owner.height + '" alt="" decoding="async" />' +
          '<p class="nx-opener__wedge">' + esc(o.wedge) + '</p>' +
          '<img class="nx-opener__dog" src="' + src(o.dog.src) + '" width="' + o.dog.width + '" height="' + o.dog.height + '" alt="" decoding="async" />' +
        '</div>' +
        '<div class="nx-opener__story">' +
          '<ul class="nx-opener__beats">' + o.beats.map(function (b) {
            return '<li class="nx-opener__beat"><span class="nx-opener__time">' + esc(b.time) + '</span> ' + esc(b.text) + '</li>';
          }).join('') + '</ul>' +
          '<p class="nx-source nx-opener__source">' + esc(o.beatsSource) + '</p>' +
          '<div class="nx-opener__end" data-beat data-beat-p="0.84"><h4 class="nx-h nx-h--big">' + esc(o.heading) + '</h4><p class="nx-text">' + esc(o.text) + '</p></div>' +
        '</div>' +
      '</div></div></div>');
  }

  function fieldHTML(p) {
    var d = p.field;
    return scene({ id: 'field', tone: 'paper', side: 'r', phase: 'sniff', label: 'nx-h-sniff' },
      '<div class="nx-wrap">' + phase('sniff') +
        '<div class="nx-head nx-head--split"><h4 class="nx-h">' + esc(d.heading) + '</h4><p class="nx-text">' + esc(d.text) + '</p></div>' +
        '<ul class="nx-sites" aria-label="Observation sites">' + d.sites.map(function (s) {
          return '<li class="nx-site nx-in"><span class="nx-site__spot" aria-hidden="true"></span><strong class="nx-site__name">' + esc(s.name) +
            '</strong><span class="nx-site__dog">' + esc(s.dog) + '</span><span class="nx-site__note">' + esc(s.note) + '</span></li>';
        }).join('') + '</ul>' +
        '<div class="nx-photos">' + d.photos.map(function (ph, i) {
          return '<div class="nx-photo nx-in" style="--i:' + i + '">' + zoom(ph, 'field', d.photosCaption) + '</div>';
        }).join('') + '</div>' +
        '<p class="nx-source">' + esc(d.photosCaption) + '</p>' +
        '<div class="nx-types">' +
          '<h5 class="nx-h5">Four kinds of dog, one kind of owner</h5>' +
          '<ul class="nx-tags">' + d.types.map(function (t, i) {
            return '<li class="nx-tag nx-in" style="--i:' + i + '"><span class="nx-tag__hole" aria-hidden="true"></span><strong>' + esc(t.name) +
              '</strong><span class="nx-tag__dogs">' + esc(t.dogs) + '</span><span class="nx-tag__text">' + esc(t.text) + '</span></li>';
          }).join('') +
          '<li class="nx-tag nx-tag--owner nx-in" style="--i:4"><span class="nx-tag__hole" aria-hidden="true"></span><strong>' + esc(d.owner.name) +
            '</strong><span class="nx-tag__dogs">The owner</span><span class="nx-tag__text">' + esc(d.owner.text) + '</span></li></ul>' +
        '</div>' +
        '<div class="nx-aeiou" data-aeiou>' +
          '<h5 class="nx-h5">AEIOU: tap a letter for what we found</h5>' +
          '<div class="nx-aeiou__letters" role="tablist" aria-label="AEIOU framework">' + d.aeiou.map(function (a, i) {
            return '<button type="button" class="nx-blob-btn nx-in" role="tab" id="nx-tab-' + a.letter + '" aria-controls="nx-panel-' + a.letter +
              '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" style="--i:' + i + '"><span class="nx-blob-btn__letter">' + a.letter +
              '</span><span class="nx-blob-btn__name">' + esc(a.name) + '</span></button>';
          }).join('') + '</div>' +
          '<div class="nx-aeiou__panels">' + d.aeiou.map(function (a) {
            return '<div class="nx-aeiou__panel" role="tabpanel" id="nx-panel-' + a.letter + '" aria-labelledby="nx-tab-' + a.letter + '"' + (a.beat ? ' data-beat' : '') + '>' +
              '<p class="nx-aeiou__finding">' + esc(a.finding) + '</p>' +
              '<ul class="nx-aeiou__tags">' + a.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
          }).join('') + '</div>' +
          '<p class="nx-source">' + esc(d.aeiouSource) + '</p>' +
        '</div>' +
      '</div>');
  }

  function quotesHTML(p) {
    var q = p.quotes;
    return scene({ id: 'quotes', tone: 'indigo', side: 'l', label: 'nx-h-quotes' },
      '<div class="nx-wrap">' +
        '<div class="nx-head nx-head--stack"><h4 class="nx-h" id="nx-h-quotes">' + esc(q.heading) + '</h4><p class="nx-source">' + esc(q.source) + '</p></div>' +
        '<ul class="nx-bubbles">' + q.items.map(function (it, i) {
          return '<li class="nx-bubble nx-in ' + (i % 2 ? 'is-right' : 'is-left') + (it.key ? ' is-key' : '') + '"' + (it.key ? ' data-beat' : '') + '>' +
            '<blockquote><p>“' + esc(it.text) + '”</p></blockquote></li>';
        }).join('') + '</ul>' +
      '</div>');
  }

  function affinityHTML(p) {
    var a = p.affinity;
    return scene({ id: 'affinity', tone: 'paper', side: 'r', phase: 'scent', label: 'nx-h-scent' },
      '<div class="nx-wrap">' + phase('scent') + '</div>' +
      '<div class="nx-pin" data-pin="1.5" data-pin-min="1024"><div class="nx-stage nx-affinity__stage"><div class="nx-wrap nx-affinity__inner">' +
        '<div class="nx-head nx-head--split nx-affinity__head"><h4 class="nx-h">' + esc(a.heading) + '</h4>' +
          '<div><p class="nx-text">' + esc(a.text) + '</p>' + '<p class="nx-affinity__orig"><button type="button" class="nx-pill" data-zoom data-group="affinity" data-caption="' + esc(a.original.caption) + '">' +
            'Open the original board<img src="' + src(a.original.src) + '" width="' + a.original.width + '" height="' + a.original.height + '" alt="' + esc(a.original.alt) + '" loading="lazy" hidden /></button></p></div></div>' +
        '<div class="nx-board" data-board data-beat data-beat-p="0.88">' + a.clusters.map(function (c) {
          return '<div class="nx-cluster' + (c.key ? ' is-key' : '') + '" style="--n:' + c.notes.length + '">' +
            '<h5 class="nx-cluster__name">' + esc(c.name) + '</h5>' +
            '<p class="nx-cluster__theme">' + esc(c.theme) + '</p>' +
            '<ul class="nx-notes">' + c.notes.map(function (n) { return '<li class="nx-note">' + esc(n) + '</li>'; }).join('') + '</ul></div>';
        }).join('') + '</div>' +
      '</div></div></div>');
  }

  function chartSVG(slots) {
    var W = 1200, H = 320, top = 34, span = 236;
    function pts(key) { return slots.map(function (s, i) { return [100 + i * 200, top + (1 - s[key]) * span]; }); }
    var a = pts('a'), l = pts('l');
    var marks = slots.map(function (s, i) {
      return '<g class="nx-chart__slot' + (s.pain ? ' is-pain' : '') + (s.low ? ' is-low' : '') + '" data-slot="' + i + '">' +
        '<line x1="' + (100 + i * 200) + '" y1="18" x2="' + (100 + i * 200) + '" y2="' + (H - 14) + '" class="nx-chart__tick" />' +
        '<circle cx="' + a[i][0] + '" cy="' + f(a[i][1]) + '" r="7" class="nx-chart__dot nx-chart__dot--a" />' +
        '<circle cx="' + l[i][0] + '" cy="' + f(l[i][1]) + '" r="7" class="nx-chart__dot nx-chart__dot--l" /></g>';
    }).join('');
    return '<svg class="nx-chart__svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Emotion curves for Aisha and Luna from 6 AM to 9 PM. Both fall to their lowest at 3 PM and peak together at 6 PM.">' +
      marks +
      '<path class="nx-chart__curve nx-chart__curve--a" d="' + openCurve(a) + '" />' +
      '<path class="nx-chart__curve nx-chart__curve--l" d="' + openCurve(l) + '" />' +
      '<circle class="nx-chart__anchor" data-thread-in cx="' + l[0][0] + '" cy="' + f(l[0][1]) + '" r="1" />' +
      '<circle class="nx-chart__anchor" data-thread-out cx="' + l[l.length - 1][0] + '" cy="' + f(l[l.length - 1][1]) + '" r="1" />' +
      '</svg>';
  }

  function journeyHTML(p) {
    var j = p.journey;
    return scene({ id: 'journey', tone: 'paper', side: 'l', label: 'nx-h-journey' },
      '<div class="nx-wrap">' +
        '<div class="nx-head nx-head--offset"><h4 class="nx-h" id="nx-h-journey">' + esc(j.heading) + '</h4><p class="nx-text">' + esc(j.text) + '</p></div>' +
        '<div class="nx-personas">' + j.personas.map(function (ps, i) {
          return '<article class="nx-persona nx-in ' + (i ? 'nx-persona--dog' : 'nx-persona--owner') + '" aria-label="Persona: ' + esc(ps.name) + '">' +
            '<p class="nx-persona__name">' + esc(ps.name) + ' <span>' + esc(ps.age) + '</span></p>' +
            '<ul>' + ps.lines.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
            (ps.quote ? '<blockquote class="nx-persona__quote"><p>“' + esc(ps.quote) + '”</p><footer>' + esc(ps.quoteLabel) + '</footer></blockquote>' : '') +
            '</article>';
        }).join('') + '<svg class="nx-personas__wave" viewBox="0 0 60 400" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 0H30C60 80 0 160 30 240S60 360 30 400H0Z" /></svg></div>' +
        '<figure class="nx-chart" data-chart data-thread-handoff>' +
          '<figcaption class="nx-chart__legend"><span class="nx-key nx-key--a">Aisha, owner</span><span class="nx-key nx-key--l">Luna, dog</span><span class="nx-source">Redrawn from our journey map</span></figcaption>' +
          chartSVG(j.slots) +
          '<ol class="nx-chart__labels">' + j.slots.map(function (s, i) {
            return '<li class="nx-chart__label' + (s.pain ? ' is-pain' : '') + (s.low ? ' is-low' : '') + '" data-slot="' + i + '"' + (s.low ? ' data-beat' : '') + '>' +
              '<span class="nx-chart__time">' + esc(s.time) + '</span>' +
              '<span class="nx-chart__feel nx-chart__feel--a">' + esc(s.aisha) + '</span>' +
              '<span class="nx-chart__feel nx-chart__feel--l">' + esc(s.luna) + '</span>' +
              (s.opportunity ? '<span class="nx-chart__opp">' + esc(s.opportunity) + '</span>' : '') + '</li>';
          }).join('') + '</ol>' +
        '</figure>' +
        '<div class="nx-originals"><p class="nx-h5">The originals</p><ul>' + j.originals.map(function (o) {
          return '<li>' + zoom(o, 'define', o.caption) + '<span>' + esc(o.caption) + '</span></li>';
        }).join('') + '</ul></div>' +
      '</div>');
  }

  function problemHTML(p) {
    var x = p.problem;
    return scene({ id: 'problem', tone: 'indigo', side: 'r', label: 'nx-h-problem' },
      '<div class="nx-wrap nx-problem__inner">' +
        '<p class="nx-label">' + esc(x.label) + '</p>' +
        '<h4 class="nx-statement nx-scrub" id="nx-h-problem" data-beat>' + words(x.statement) + '</h4>' +
        '<p class="nx-label nx-label--hmw">' + esc(x.hmwLabel) + '</p>' +
        '<p class="nx-hmw nx-scrub">' + words(x.hmw, x.keys) + '</p>' +
      '</div>');
  }

  function ideationHTML(p) {
    var d = p.ideation;
    var kept = d.concepts.filter(function (c) { return c.fate === 'kept'; });
    return scene({ id: 'ideation', tone: 'paper', side: 'l', phase: 'fetch', label: 'nx-h-fetch' },
      '<div class="nx-wrap">' + phase('fetch') +
        '<div class="nx-head nx-head--split"><h4 class="nx-h">' + esc(d.heading) + '</h4><p class="nx-text">' + esc(d.text) + '</p></div>' +
        '<div class="nx-concepts">' + d.concepts.map(function (c, i) {
          var total = c.d + c.v + c.f;
          return '<article class="nx-concept nx-in is-' + c.fate + '" style="--i:' + i + '" aria-label="' + esc(c.name) + ', DVF ' + total + (c.fate === 'cut' ? ', set aside' : ', carried forward') + '">' +
            '<div class="nx-concept__sketch">' + zoom(c, 'ideation', c.name) + (c.fate === 'cut' ? '<span class="nx-strike" aria-hidden="true"></span>' : '') + '</div>' +
            '<h5 class="nx-concept__name">' + esc(c.name) + '</h5>' +
            '<p class="nx-dvf" aria-hidden="true">' + c.d + ' + ' + c.v + ' + ' + c.f + ' = <strong class="nx-dvf__total" data-count="' + total + '">' + total + '</strong></p>' +
            (c.fate === 'cut' ? '<p class="nx-concept__reason">' + rich(c.reason) + '</p>' : '<p class="nx-concept__reason is-kept">Carried forward</p>') +
            '</article>';
        }).join('') + '</div>' +
        '<div class="nx-merge" data-beat>' +
          '<div class="nx-merge__pair">' + zoom(kept[1], 'ideation', kept[1].name, 'nx-merge__a') +
            '<span class="nx-merge__plus" aria-hidden="true">+</span>' + zoom(kept[0], 'ideation', kept[0].name, 'nx-merge__b') + '</div>' +
          '<div class="nx-merge__text"><p class="nx-merge__title">' + esc(d.merge.title) + '</p><p class="nx-text">' + rich(d.merge.reason) + '</p></div>' +
        '</div>' +
        '<div class="nx-sketches"><ul>' + d.sketches.map(function (s, i) {
          return '<li class="nx-in" style="--i:' + i + '">' + zoom(s, 'sketches', d.sketchesCaption) + '</li>';
        }).join('') + '</ul><p class="nx-source">' + esc(d.sketchesCaption) + '</p></div>' +
      '</div>');
  }

  function formHTML(p) {
    var d = p.form;
    return scene({ id: 'form', tone: 'paper', side: 'r', label: 'nx-h-form' },
      '<div class="nx-wrap"><div class="nx-head nx-head--stack"><h4 class="nx-h" id="nx-h-form">' + esc(d.heading) + '</h4><p class="nx-text">' + esc(d.text) + '</p></div></div>' +
      '<div class="nx-pin" data-pin="1.5"><div class="nx-stage nx-form__stage"><div class="nx-wrap nx-form__inner">' +
        '<div class="nx-form__frame">' + d.steps.map(function (s, i) {
          return '<figure class="nx-step' + (i === 0 ? ' is-on' : '') + '" data-step="' + i + '"' + (s.beat ? ' data-step-beat' : '') + '>' +
            '<div class="nx-step__mat">' + zoom(s, 'form', s.label) + '</div><figcaption>' + esc(s.label) + '</figcaption></figure>';
        }).join('') + '</div>' +
        '<ul class="nx-form__steps" aria-label="Steps from sketch to working face">' + d.steps.map(function (s, i) {
          return '<li><button type="button" data-step-go="' + i + '"' + (i === 0 ? ' aria-current="step"' : '') + '>' + esc(s.label) + '</button></li>';
        }).join('') + '</ul>' +
      '</div></div></div>');
  }

  function deviceHTML(p) {
    var d = p.device;
    return scene({ id: 'device', tone: 'paper', side: 'l', phase: 'walkies', label: 'nx-h-walkies' },
      '<div class="nx-wrap">' + phase('walkies') +
        '<div class="nx-head nx-head--split"><h4 class="nx-h">' + esc(d.heading) + '</h4><p class="nx-text">' + esc(d.text) + '</p></div>' +
        '<figure class="nx-device" data-device>' +
          '<div class="nx-device__img">' + img(d.render) + '</div>' +
          '<svg class="nx-device__lines" aria-hidden="true" focusable="false"></svg>' +
          d.callouts.map(function (c, i) {
            return '<div class="nx-callout nx-callout--' + c.side + '" data-callout="' + i + '" data-x="' + c.x + '" data-y="' + c.y + '">' +
              '<strong>' + esc(c.title) + '</strong><span>' + esc(c.text) + '</span></div>';
          }).join('') +
        '</figure>' +
        '<div class="nx-collars"><ul>' + d.collars.map(function (c, i) {
          return '<li class="nx-in" style="--i:' + i + '">' + zoom(c, 'collars', d.collarsCaption) + '</li>';
        }).join('') + '</ul><p class="nx-source">' + esc(d.collarsCaption) + '</p></div>' +
      '</div>');
  }

  function appHTML(p) {
    var d = p.app;
    var proto = d.prototype.link
      ? '<a class="nx-proto__link" href="' + esc(d.prototype.link) + '" target="_blank" rel="noopener">Open the Figma prototype<span class="sr-only"> (opens in a new tab)</span></a>'
      : '<p class="nx-proto__note">' + rich(d.prototype.note) + '</p>';
    return scene({ id: 'app', tone: 'paper', side: 'r', label: 'nx-h-app' },
      '<div class="nx-wrap"><div class="nx-head nx-head--offset"><h4 class="nx-h" id="nx-h-app">' + esc(d.heading) + '</h4><p class="nx-text">' + esc(d.text) + '</p>' +
        '<p class="nx-source">' + rich(d.credit) + '</p></div></div>' +
      '<div class="nx-pin" data-pin="1.5" data-pin-x><div class="nx-stage nx-app__stage"><div class="nx-app__viewport">' +
        '<div class="nx-track" tabindex="0" aria-label="Four app screens, scroll sideways">' + d.screens.map(function (s, i) {
          return '<figure class="nx-phone' + (s.beat ? ' is-key' : '') + '" data-phone="' + i + '">' + zoom(s, 'app', s.caption) +
            '<figcaption>' + esc(s.caption) + '</figcaption></figure>';
        }).join('') + '</div>' +
      '</div></div></div>' +
      '<div class="nx-wrap nx-app__more">' +
        '<div class="nx-proto"><p class="nx-h5">Prototype</p>' + proto + '</div>' +
        '<a class="nx-video" href="' + esc(d.video.href) + '" target="_blank" rel="noopener">' + img(d.video.poster) +
          '<span class="nx-video__body"><span class="nx-video__title">' + esc(d.video.label) + '</span><span class="nx-video__caption">' + esc(d.video.caption) + '</span></span>' +
          '<span class="nx-video__play" aria-hidden="true"><svg viewBox="0 0 28 28"><path d="M10.5 8.2v11.6l9.2-5.8z" fill="currentColor"/></svg></span>' +
          '<span class="sr-only"> (opens in a new tab)</span></a>' +
      '</div>');
  }

  function outcomeHTML(p) {
    var o = p.outcome;
    return scene({ id: 'outcome', tone: 'orange', side: 'l', phase: 'treat', label: 'nx-h-treat' },
      '<div class="nx-wrap">' + phase('treat') +
        '<h4 class="nx-h nx-outcome__h">' + esc(o.heading) + '</h4>' +
        '<ul class="nx-shifts">' + o.shifts.map(function (s) {
          return '<li class="nx-shift nx-in" data-beat><span class="nx-shift__from">' + esc(s[0]) + '</span>' +
            '<span class="nx-shift__arrow" aria-hidden="true"><svg viewBox="0 0 40 20"><path d="M2 10h33M28 3l7 7-7 7" /></svg></span><span class="sr-only"> becomes </span>' +
            '<span class="nx-shift__to">' + esc(s[1]) + '</span></li>';
        }).join('') + '</ul>' +
        '<div class="nx-reunion" data-reunion aria-hidden="true">' +
          '<img class="nx-reunion__owner" src="' + src(p.opener.owner.src) + '" width="' + p.opener.owner.width + '" height="' + p.opener.owner.height + '" alt="" loading="lazy" decoding="async" />' +
          '<span class="nx-reunion__touch" data-thread-end></span>' +
          '<img class="nx-reunion__dog" src="' + src(p.opener.dog.src) + '" width="' + p.opener.dog.width + '" height="' + p.opener.dog.height + '" alt="" loading="lazy" decoding="async" />' +
        '</div>' +
        '<div class="nx-points">' + o.points.map(function (pt) {
          return '<div class="nx-point nx-in"><h5>' + esc(pt.title) + '</h5><p>' + rich(pt.text) + '</p></div>';
        }).join('') + '</div>' +
      '</div>');
  }

  function closeHTML(p) {
    var n = p.next;
    var link = n && /^[a-z0-9-]+$/.test(n.slug)
      ? '<a class="nx-next" href="#project/' + esc(n.slug) + '"><span>Next project</span><strong>' + esc(n.title) + '</strong></a>' : '';
    return '<section class="cs-section nx-s nx-close" id="cs-next" data-tone="orange" data-side="l" aria-label="Next project">' +
      '<div class="nx-wrap">' + link + '<a class="nx-back" href="#work" data-cs-back>Back to all work</a></div></section>';
  }

  function render(p) {
    P = p;
    var html = '<div class="nx-world" data-nx-world>' +
      '<svg class="nx-thread" aria-hidden="true" focusable="false"><defs><linearGradient id="nx-thread-ink" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1"></linearGradient></defs>' +
        '<path class="nx-thread__line" stroke="url(#nx-thread-ink)" /><g class="nx-thread__knots"></g></svg>' +
      coverHTML(p) + openerHTML(p) + fieldHTML(p) + quotesHTML(p) + affinityHTML(p) + journeyHTML(p) + problemHTML(p) +
      ideationHTML(p) + formHTML(p) + deviceHTML(p) + appHTML(p) + outcomeHTML(p) + closeHTML(p) +
      '</div>';
    P = null;
    return html;
  }

  /* ---------- 3. Mount ---------- */
  function mount(ctx) {
    var p = ctx.project;
    var scroller = ctx.scroller;
    var content = ctx.content;
    var sheet = ctx.sheet;
    var world = content.querySelector('[data-nx-world]');
    var reduce = ctx.reduceMotion;
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    var motion = !reduce && !!(gsap && ST);
    var hover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var cleanups = [];
    var gctx = null;
    var dead = false;

    function on(el, type, fn, opts) { el.addEventListener(type, fn, opts); cleanups.push(function () { el.removeEventListener(type, fn, opts); }); }
    function barH() { return parseFloat(getComputedStyle(sheet).getPropertyValue('--cs-bar-h')) || 60; }
    function setVH() { content.style.setProperty('--nx-vh', scroller.clientHeight + 'px'); }
    setVH();

    sheet.classList.add('nx-sheet');
    if (motion) world.classList.add('is-motion');
    if (hover) world.classList.add('can-hover');

    // Pinned scenes: sticky stages with a little extra scroll (≤ 1.5 screens).
    var pins = Array.prototype.map.call(world.querySelectorAll('.nx-pin'), function (el) {
      return { el: el, stage: el.querySelector('.nx-stage'), extra: parseFloat(el.getAttribute('data-pin')) || 1, min: parseFloat(el.getAttribute('data-pin-min')) || 0 };
    });
    function pinOn(pin) { return motion && window.innerWidth >= pin.min; }
    function layoutPins() {
      pins.forEach(function (pin) {
        var live = pinOn(pin);
        pin.el.classList.toggle('is-pinned', live);
        pin.el.style.setProperty('--extra', live ? pin.extra : 0);
      });
    }
    layoutPins();

    /* ---------- 4. Measuring ---------- */
    function rel(el) {
      var w = world.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      return { x: r.left - w.left, y: r.top - w.top, w: r.width, h: r.height, cx: r.left - w.left + r.width / 2, cy: r.top - w.top + r.height / 2 };
    }
    // The y (in world space) of the reading line when a pinned scene is at progress p.
    function pinReadY(pin, prog) {
      var top = rel(pin.el).y;
      var extra = pin.el.offsetHeight - (scroller.clientHeight - barH());
      return top - barH() + prog * Math.max(0, extra) + scroller.clientHeight * READ;
    }

    var heads = Array.prototype.slice.call(world.querySelectorAll('[data-phase-head]'));

    /* ---------- 5. The thread ----------
       A static line, drawn once and part of the page: it scrolls with the
       story like everything else and never moves on its own. It grows out of
       the breathing face on the cover, meanders gently down the margin of each
       scene, sweeps across to the other side between scenes with a soft loop
       in the middle (a leash curling), flows into Luna's emotion curve and out
       of it, and ends where owner and dog touch. Small dots mark the key
       moments. Built on refresh only; nothing runs while scrolling. */
    var READ = 0.62;   // the reading line, as a share of the sheet's height (the dock uses it)
    var svg = world.querySelector('.nx-thread');
    var path = svg.querySelector('.nx-thread__line');
    var knotsG = svg.querySelector('.nx-thread__knots');
    var grad = svg.querySelector('linearGradient');
    var M = { worldTop: 0, view: 0, heads: [] };

    function sideX(side) {
      var wrap = world.querySelector('.nx-cover .nx-wrap');
      var w = world.clientWidth;
      var inner = wrap ? wrap.getBoundingClientRect() : null;
      var contentLeft = inner ? inner.left - world.getBoundingClientRect().left + parseFloat(getComputedStyle(wrap).paddingLeft) : 40;
      var m = Math.max(14, Math.min(64, contentLeft / 2));
      return side === 'l' ? m : w - m;
    }

    function buildThread() {
      var sr = scroller.getBoundingClientRect(), wr = world.getBoundingClientRect();
      M.worldTop = wr.top - sr.top + scroller.scrollTop;
      M.view = scroller.clientHeight;
      M.heads = heads.map(function (h) { return { id: h.getAttribute('data-phase-head'), y: rel(h).y }; });

      var W = world.clientWidth, H = world.scrollHeight;
      svg.setAttribute('width', W);
      svg.setAttribute('height', H);
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      grad.setAttribute('y2', H);
      var narrow = W < 700;
      var SWAY = narrow ? 4 : 9;           // how far the line meanders in a margin
      var WAVE = 560;                     // the length of one meander
      var LOOP = narrow ? 14 : 24;        // the loop's radius between scenes

      var start = rel(world.querySelector('[data-thread-start]'));
      var cur = { x: start.cx, y: start.cy };
      var d = 'M' + f(cur.x) + ' ' + f(cur.y);
      var knots = [];
      function curveTo(x, y) {
        var dy = (y - cur.y) * 0.5;
        d += 'C' + f(cur.x) + ' ' + f(cur.y + dy) + ' ' + f(x) + ' ' + f(y - dy) + ' ' + f(x) + ' ' + f(y);
        cur = { x: x, y: y };
      }
      // Down a margin, meandering gently: a smooth curve through swaying points.
      function runTo(base, y, from) {
        if (y <= cur.y + 4) return;
        var pts = [[cur.x, cur.y]];
        var steps = Math.max(1, Math.round((y - cur.y) / (WAVE / 4)));
        for (var k = 1; k <= steps; k++) {
          var yy = cur.y + (y - cur.y) * k / steps;
          pts.push([k === steps ? base : base + SWAY * Math.sin((yy - from) / WAVE * Math.PI * 2), yy]);
        }
        d += openCurve(pts).replace(/^M[^C]*/, '');
        cur = { x: pts[pts.length - 1][0], y: y };
      }
      function swayAt(base, y, from) { return base + SWAY * Math.sin((y - from) / WAVE * Math.PI * 2); }
      // Across to the other side, with a soft loop in the middle.
      function crossTo(x2, y2) {
        var x1 = cur.x, y1 = cur.y;
        if (Math.abs(x2 - x1) < 40) { curveTo(x2, y2); return; }
        var dir = x2 > x1 ? 1 : -1;
        var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        var sweep = dir > 0 ? 0 : 1;
        d += 'C' + f(x1) + ' ' + f(y1 + (my - y1) * 0.9) + ' ' + f(mx - dir * (Math.abs(x2 - x1) * 0.28)) + ' ' + f(my) + ' ' + f(mx) + ' ' + f(my);
        d += 'a' + LOOP + ' ' + LOOP + ' 0 1 ' + sweep + ' 0 ' + (-2 * LOOP) + 'a' + LOOP + ' ' + LOOP + ' 0 1 ' + sweep + ' 0 ' + (2 * LOOP);
        d += 'C' + f(mx + dir * (Math.abs(x2 - x1) * 0.28)) + ' ' + f(my) + ' ' + f(x2) + ' ' + f(y2 - (y2 - my) * 0.9) + ' ' + f(x2) + ' ' + f(y2);
        cur = { x: x2, y: y2 };
      }

      var stops = [];
      var sections = Array.prototype.slice.call(world.querySelectorAll('section.nx-s'));
      var endEl = world.querySelector('[data-thread-end]');
      var ended = false;
      sections.forEach(function (sec, si) {
        if (ended) return;
        var r = rel(sec);
        var tone = sec.getAttribute('data-tone');
        stops.push({ y: r.y, tone: tone });
        var base = sideX(sec.getAttribute('data-side') || 'l');
        var pad = parseFloat(getComputedStyle(sec).paddingTop) || 120;
        var from = r.y;
        if (si === 0) curveTo(base, Math.max(cur.y + 140, r.y + r.h * 0.9));
        // Cross in the empty space at the top of the scene, before its content.
        else crossTo(base, r.y + Math.max(60, pad * 0.8));

        var events = [];
        Array.prototype.forEach.call(sec.querySelectorAll('[data-beat]'), function (el) {
          var pinEl = el.closest('.nx-pin');
          var pin = pinEl && pins.filter(function (q) { return q.el === pinEl; })[0];
          var y = pin && pinEl.classList.contains('is-pinned') && el.hasAttribute('data-beat-p')
            ? pinReadY(pin, parseFloat(el.getAttribute('data-beat-p')))
            : rel(el).cy;
          if (el.closest('.nx-aeiou__panel') && el.closest('.nx-aeiou__panel').hidden) y = rel(el.closest('[data-aeiou]')).cy;
          events.push({ kind: 'beat', y: y });
        });
        var hand = sec.querySelector('[data-thread-handoff]');
        if (hand) {
          var a = rel(hand.querySelector('[data-thread-in]')), b = rel(hand.querySelector('[data-thread-out]'));
          events.push({ kind: 'hand', y: a.cy, a: a, b: b });
        }
        if (endEl && sec.contains(endEl)) events.push({ kind: 'end', y: rel(endEl).cy, el: rel(endEl) });
        events.sort(function (m, n) { return m.y - n.y; });

        events.forEach(function (ev) {
          if (ended) return;
          if (ev.kind === 'beat') {
            if (ev.y - 40 > cur.y) {
              runTo(base, ev.y, from);
              knots.push({ x: cur.x, y: ev.y, tone: tone });
            }
          } else if (ev.kind === 'hand') {
            // Into the emotion curve at its first point, out of it at its last.
            curveTo(ev.a.cx, ev.a.cy);
            d += 'M' + f(ev.b.cx) + ' ' + f(ev.b.cy);
            cur = { x: ev.b.cx, y: ev.b.cy };
            base = sideX('r');
            curveTo(swayAt(base, ev.b.cy + 180, from), ev.b.cy + 180);
          } else if (ev.kind === 'end') {
            curveTo(ev.el.cx, ev.el.cy);
            ended = true;
          }
        });
        if (!ended) runTo(base, r.y + r.h, from);
      });
      path.setAttribute('d', d);

      // Ink: orange, deep indigo over the orange scenes.
      grad.innerHTML = stops.map(function (st, i) {
        var col = st.tone === 'orange' ? 'var(--nx-deep)' : 'var(--nx-orange)';
        var next = stops[i + 1];
        var a = (st.y / H * 100).toFixed(3), b = ((next ? next.y : H) / H * 100).toFixed(3);
        return '<stop offset="' + a + '%" style="stop-color:' + col + '" /><stop offset="' + b + '%" style="stop-color:' + col + '" />';
      }).join('');
      knotsG.innerHTML = knots.map(function (kp) {
        return '<circle class="nx-knot' + (kp.tone === 'orange' ? ' is-deep' : '') + '" cx="' + f(kp.x) + '" cy="' + f(kp.y) + '" r="5" />';
      }).join('');
    }
    // The reading line, in story space (for the dock): scroll sums only.
    function storyY() { return scroller.scrollTop + M.view * READ - M.worldTop; }
    // Key moments in the pinned scenes used to pulse the moving tip; the line is still now.
    function pulse() {}

    /* ---------- 6. The phase dock ---------- */
    var dock = document.createElement('nav');
    dock.className = 'nx-dock';
    dock.setAttribute('aria-label', 'Project phases');
    dock.innerHTML = '<ul>' + p.phases.map(function (ph) {
      return '<li><button type="button" data-dock="' + ph.id + '" aria-label="' + esc(ph.name + ' (' + ph.real + ')') + '">' +
        '<span class="nx-dock__dot" aria-hidden="true"></span><span class="nx-dock__name" aria-hidden="true">' + esc(ph.name) + '</span></button></li>';
    }).join('') + '</ul>';
    sheet.appendChild(dock);
    cleanups.push(function () { dock.remove(); });

    var foldTimer = 0;
    var showing = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var id = e.target.getAttribute('data-phase-head');
        if (e.isIntersecting) showing.add(id); else showing.delete(id);
      });
      clearTimeout(foldTimer);
      if (showing.size) dock.classList.add('is-open');
      else foldTimer = setTimeout(function () { dock.classList.remove('is-open'); }, 500);
    }, { root: scroller, threshold: 0 });
    heads.forEach(function (h) { io.observe(h); });
    cleanups.push(function () { io.disconnect(); clearTimeout(foldTimer); });

    var currentPhase = null;
    function updateDock() {
      var y = storyY();
      var id = null;
      M.heads.forEach(function (h) { if (h.y <= y) id = h.id; });
      if (id === currentPhase) return;
      currentPhase = id;
      dock.classList.toggle('is-away', !id);
      Array.prototype.forEach.call(dock.querySelectorAll('button'), function (b) {
        if (b.getAttribute('data-dock') === id) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
    }
    function scrollToY(y) {
      y = Math.max(0, y);
      if (ctx.lenis) ctx.lenis.scrollTo(y, { duration: 1.2 });
      else scroller.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    }
    on(dock, 'click', function (e) {
      var b = e.target.closest('[data-dock]');
      if (!b) return;
      var h = world.querySelector('[data-phase-head="' + b.getAttribute('data-dock') + '"]');
      if (!h) return;
      scrollToY(scroller.scrollTop + h.getBoundingClientRect().top - scroller.getBoundingClientRect().top - barH() - 24);
      var heading = h.querySelector('h3');
      if (heading) heading.focus({ preventScroll: true });
    });

    /* ---------- 8. Small live parts ---------- */
    // AEIOU: five letters as tabs; each shows what we found.
    var aeiou = world.querySelector('[data-aeiou]');
    var tabs = Array.prototype.slice.call(aeiou.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(aeiou.querySelectorAll('[role="tabpanel"]'));
    aeiou.classList.add('is-tabs');
    function select(i, focus) {
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === i);
        t.tabIndex = k === i ? 0 : -1;
        panels[k].hidden = k !== i;
      });
      if (focus) tabs[i].focus();
      if (motion) gsap.fromTo(panels[i].children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: EASE, overwrite: true });
    }
    select(0, false);
    on(aeiou, 'click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t) select(tabs.indexOf(t), false);
    });
    on(aeiou, 'keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (k === undefined) return;
      e.preventDefault();
      select((k + tabs.length) % tabs.length, true);
    });

    // The form steps: one frame; buttons jump to a step.
    var formPin = pins.filter(function (x) { return x.el.closest('.nx-s--form'); })[0];
    var steps = Array.prototype.slice.call(world.querySelectorAll('.nx-step'));
    var stepBtns = Array.prototype.slice.call(world.querySelectorAll('[data-step-go]'));
    var stepNow = 0;
    function showStep(i) {
      if (i === stepNow) return;
      var back = i < stepNow;
      stepNow = i;
      steps.forEach(function (s, k) { s.classList.toggle('is-on', k === i); s.classList.toggle('is-past', k < i); });
      stepBtns.forEach(function (b, k) { if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      if (steps[i].hasAttribute('data-step-beat') && !back) pulse();
    }
    on(world.querySelector('.nx-form__steps'), 'click', function (e) {
      var b = e.target.closest('[data-step-go]');
      if (!b) return;
      var i = Number(b.getAttribute('data-step-go'));
      if (formPin && formPin.el.classList.contains('is-pinned')) {
        var top = scroller.scrollTop + formPin.el.getBoundingClientRect().top - scroller.getBoundingClientRect().top - barH();
        var range = formPin.el.offsetHeight - (scroller.clientHeight - barH());
        scrollToY(top + range * (i + 0.5) / steps.length);
      } else {
        showStep(i);
      }
    });
    function stageForm() { world.querySelector('.nx-s--form').classList.toggle('is-staged', !!(formPin && formPin.el.classList.contains('is-pinned'))); }
    stageForm();

    // The face: the blob breathes while it's on screen.
    var faces = Array.prototype.map.call(world.querySelectorAll('.nx-face'), function (el) {
      return { el: el, blob: el.querySelector('.nx-face__blob'), live: false };
    });
    var faceIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { faces.forEach(function (fc) { if (fc.el === e.target) fc.live = e.isIntersecting; }); });
    }, { root: scroller });
    faces.forEach(function (fc) { faceIO.observe(fc.el); });
    cleanups.push(function () { faceIO.disconnect(); });
    function breathe(time) {
      faces.forEach(function (fc) { if (fc.live) fc.blob.setAttribute('d', blob(time * 1.4, 60, 60, 24 + Math.sin(time * 1.6) * 1.6)); });
    }

    // Device callouts: lines from each label to its point on the render.
    var device = world.querySelector('[data-device]');
    var deviceLines = device.querySelector('.nx-device__lines');
    function drawCallouts() {
      var box = device.getBoundingClientRect();
      var pic = device.querySelector('.nx-device__img').getBoundingClientRect();
      deviceLines.setAttribute('viewBox', '0 0 ' + f(box.width) + ' ' + f(box.height));
      deviceLines.innerHTML = Array.prototype.map.call(device.querySelectorAll('[data-callout]'), function (c) {
        var r = c.getBoundingClientRect();
        var px = pic.left - box.left + pic.width * parseFloat(c.getAttribute('data-x'));
        var py = pic.top - box.top + pic.height * parseFloat(c.getAttribute('data-y'));
        var left = c.classList.contains('nx-callout--left');
        var sx = left ? r.right - box.left + 8 : r.left - box.left - 8;
        var sy = r.top - box.top + 12;
        if (window.innerWidth < 760) return '';
        return '<path class="nx-callout__line" d="M' + f(sx) + ' ' + f(sy) + 'L' + f(px) + ' ' + f(py) + '" pathLength="1" />' +
          '<circle class="nx-callout__dot" cx="' + f(px) + '" cy="' + f(py) + '" r="6" />';
      }).join('');
    }

    /* ---------- 7. Scene motion ---------- */
    // Scroll-linked motion catches up over a moment instead of jumping with every scroll step.
    var SCRUB = 0.6;
    function sc(o) { o.scroller = scroller; return o; }
    function playOnce(trigger, fn, start) {
      ST.create(sc({ trigger: trigger, start: start || 'top 85%', once: true, onEnter: fn }));
    }
    function pinTrigger(pin, anim) {
      return ST.create(sc({
        trigger: pin.el,
        start: function () { return 'top top+=' + barH(); },
        end: 'bottom bottom',
        scrub: SCRUB,
        animation: anim,
        invalidateOnRefresh: true
      }));
    }

    function buildMotion() {
      fitBoard();   // before the board's timeline measures where the notes sit
      gctx = gsap.context(function () {
        // Cover: logo letters settle, render rises, the face beats once.
        var cover = world.querySelector('.nx-cover');
        gsap.fromTo(cover.querySelector('.nx-cover__title'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: EASE, delay: 0.25 });
        gsap.fromTo(cover.querySelector('.nx-cover__render'), { opacity: 0, y: 70, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: EASE, delay: 0.45 });
        gsap.fromTo(cover.querySelectorAll('.nx-cover__meta > *'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.08, delay: 0.6 });
        gsap.fromTo(cover.querySelector('.nx-cover__pulse-ring'), { scale: 0.6, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 1.2, ease: 'power2.out', delay: 1.4 });
        gsap.to(cover.querySelector('.nx-cover__img'), { yPercent: -8, ease: 'none', scrollTrigger: sc({ trigger: cover, start: 'top top', end: 'bottom top', scrub: SCRUB }) });

        // Generic entrances for small parts (staggered by the order they appear).
        Array.prototype.forEach.call(world.querySelectorAll('.nx-head, .nx-phase, .nx-originals, .nx-sketches > .nx-source, .nx-collars > .nx-source'), function (el) {
          var kids = el.children;
          gsap.fromTo(kids, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.08, immediateRender: true,
            scrollTrigger: sc({ trigger: triggerFor(el), start: 'top 88%', once: true }) });
        });

        // The whine: they drift apart as modern life wedges in.
        var opPin = pins.filter(function (x) { return x.el.closest('.nx-s--whine'); })[0];
        if (opPin && opPin.el.classList.contains('is-pinned')) {
          var st = opPin.stage;
          var owner = st.querySelector('.nx-opener__owner'), dog = st.querySelector('.nx-opener__dog');
          // Half the gap between them, from layout offsets (not transformed rects),
          // so re-measuring mid-scroll gives the same answer.
          var gapX = function () {
            var right = owner.offsetLeft + owner.offsetWidth;
            return Math.max(0, (dog.offsetLeft - right) / 2 + Math.min(owner.offsetWidth, dog.offsetWidth) * 0.06);
          };
          var tl = gsap.timeline({ defaults: { ease: 'none' } });
          tl.fromTo(owner, { x: function () { return gapX(); } }, { x: 0, duration: 0.6 }, 0.05)
            .fromTo(dog, { x: function () { return -gapX(); } }, { x: 0, duration: 0.6 }, 0.05)
            .fromTo(st.querySelector('.nx-opener__wedge'), { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.35, ease: EASE, immediateRender: true }, 0.2);
          Array.prototype.forEach.call(st.querySelectorAll('.nx-opener__beat'), function (b, i) {
            tl.fromTo(b, { opacity: 0.12, y: 18 }, { opacity: 1, y: 0, duration: 0.14, ease: EASE }, 0.22 + i * 0.16);
          });
          tl.fromTo(st.querySelector('.nx-opener__source'), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.6);
          tl.fromTo(st.querySelectorAll('.nx-opener__end > *'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.14, stagger: 0.04, ease: EASE }, 0.74);
          tl.to({}, { duration: 0.1 });
          pinTrigger(opPin, tl);
        }

        // Sniffing around: sites, photos, dog tags, letters.
        groupIn('.nx-sites .nx-site', { y: 20, stagger: 0.08 });
        groupIn('.nx-photos .nx-photo', { y: 50, rotate: function (i) { return (i % 2 ? 4 : -4); }, stagger: 0.06 });
        Array.prototype.forEach.call(world.querySelectorAll('.nx-tag'), function (t, i) {
          gsap.fromTo(t, { rotate: i % 2 ? 10 : -10, y: -20, opacity: 0, transformOrigin: '50% 12px' },
            { rotate: 0, y: 0, opacity: 1, duration: 1.1, ease: 'elastic.out(1, 0.55)', delay: i * 0.07,
              scrollTrigger: sc({ trigger: t.parentNode, start: 'top 85%', once: true }) });
        });
        groupIn('.nx-aeiou .nx-blob-btn', { y: 30, scale: 0.7, stagger: 0.07, ease: 'back.out(1.8)' });

        // Quotes: speech bubbles pop up one by one as you scroll.
        Array.prototype.forEach.call(world.querySelectorAll('.nx-bubble'), function (b) {
          var right = b.classList.contains('is-right');
          gsap.fromTo(b, { opacity: 0, scale: 0.6, y: 30, transformOrigin: right ? '90% 100%' : '10% 100%' },
            { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.6)', scrollTrigger: sc({ trigger: b, start: 'top 82%', once: true }) });
        });

        // Picking up the scent: notes fall in a mess, then sort into clusters.
        var affPin = pins.filter(function (x) { return x.el.closest('.nx-s--affinity'); })[0];
        var board = world.querySelector('[data-board]');
        var notes = Array.prototype.slice.call(board.querySelectorAll('.nx-note'));
        var seed = 7;
        function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
        var scatter = notes.map(function () { return { x: rnd(), y: rnd(), r: (rnd() - 0.5) * 34 }; });
        // Where each note starts: a random spot on the board, in the board's own
        // layout pixels (offsets ignore transforms and the fit-to-stage scale).
        function noteOffset(n) {
          var x = 0, y = 0, el = n;
          while (el && el !== board) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
          return { x: x, y: y };
        }
        function from(i, axis) {
          var n = notes[i], o = noteOffset(n), s = scatter[i];
          if (axis === 'x') return s.x * (board.offsetWidth - n.offsetWidth) - o.x;
          return s.y * (board.offsetHeight - n.offsetHeight) - o.y;
        }
        if (affPin && affPin.el.classList.contains('is-pinned')) {
          var atl = gsap.timeline({ defaults: { ease: 'none' } });
          atl.fromTo(notes, { x: function (i) { return from(i, 'x'); }, y: function (i) { return from(i, 'y'); }, rotate: function (i) { return scatter[i].r; } },
            { x: 0, y: 0, rotate: 0, duration: 0.55, ease: 'power1.inOut', stagger: { each: 0.002, from: 'random' } }, 0.02);
          atl.fromTo(board.querySelectorAll('.nx-cluster__name, .nx-cluster__theme'), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.12, stagger: 0.02, ease: EASE }, 0.58);
          atl.fromTo(board.querySelectorAll('.nx-cluster.is-key'), { '--glow': 0 }, { '--glow': 1, duration: 0.1 }, 0.8);
          atl.to({}, { duration: 0.08 });
          pinTrigger(affPin, atl);
          board.classList.add('is-scrubbed');
        } else {
          collapseClusters();
          Array.prototype.forEach.call(board.querySelectorAll('.nx-cluster'), function (c) {
            var ns = c.querySelectorAll('.nx-note');
            gsap.fromTo(ns, { opacity: 0, y: -30, rotate: function (i) { return (i % 3 - 1) * 8; } },
              { opacity: 1, y: 0, rotate: 0, duration: 0.7, ease: EASE, stagger: 0.03, scrollTrigger: sc({ trigger: c, start: 'top 80%', once: true }) });
          });
        }

        // The journey: personas, then the curves draw as you read the day.
        groupIn('.nx-persona', { y: 40, stagger: 0.12 });
        var chart = world.querySelector('[data-chart]');
        var curves = chart.querySelectorAll('.nx-chart__curve');
        var labels = chart.querySelectorAll('.nx-chart__label');
        var slots = chart.querySelectorAll('.nx-chart__slot');
        gsap.set(curves, { strokeDasharray: 1, attr: { pathLength: 1 } });
        ST.create(sc({
          trigger: chart, start: 'top 75%', end: 'bottom 45%', scrub: SCRUB,
          onUpdate: function (self) {
            var pr = self.progress;
            gsap.set(curves, { strokeDashoffset: 1 - pr });
            var lit = Math.floor(pr * 6.0001);
            Array.prototype.forEach.call(labels, function (l, i) { l.classList.toggle('is-lit', i < lit || pr >= 1); });
            Array.prototype.forEach.call(slots, function (s, i) { s.classList.toggle('is-lit', i < lit || pr >= 1); });
          }
        }));
        chart.classList.add('is-scrubbed');

        // The problem and the question: words light up as they're read.
        Array.prototype.forEach.call(world.querySelectorAll('.nx-scrub'), function (el) {
          gsap.fromTo(el.querySelectorAll('.nx-word'), { opacity: 0.2 }, { opacity: 1, ease: 'none', stagger: 0.1,
            scrollTrigger: sc({ trigger: el, start: 'top 82%', end: 'bottom 50%', scrub: SCRUB }) });
        });

        // Fetch: concepts fly in, scores count up, two are crossed out, two merge.
        Array.prototype.forEach.call(world.querySelectorAll('.nx-concept'), function (c, i) {
          var total = c.querySelector('.nx-dvf__total');
          var n = Number(total.getAttribute('data-count'));
          var counter = { v: 0 };
          gsap.fromTo(c, { opacity: 0, y: 60, rotate: i % 2 ? 3 : -3 }, { opacity: 1, y: 0, rotate: 0, duration: 1, ease: EASE, delay: i * 0.09,
            scrollTrigger: sc({ trigger: c.parentNode, start: 'top 82%', once: true }),
            onStart: function () { gsap.to(counter, { v: n, duration: 1.1, ease: 'power2.out', delay: 0.2, onUpdate: function () { total.textContent = Math.round(counter.v); } }); } });
          if (c.classList.contains('is-cut')) {
            var tlc = gsap.timeline({ scrollTrigger: sc({ trigger: c, start: 'top 45%', once: true }) });
            tlc.fromTo(c.querySelector('.nx-strike'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: EASE })
               .fromTo(c.querySelector('.nx-concept__sketch img'), { opacity: 1 }, { opacity: 0.4, duration: 0.5 }, 0.1)
               .fromTo(c.querySelector('.nx-concept__reason'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: EASE }, 0.2);
          }
        });
        var merge = world.querySelector('.nx-merge');
        var mtl = gsap.timeline({ scrollTrigger: sc({ trigger: merge, start: 'top 75%', once: true }) });
        mtl.fromTo(merge.querySelector('.nx-merge__a'), { x: -120, opacity: 0, rotate: -6 }, { x: 0, opacity: 1, rotate: 0, duration: 1, ease: EASE })
           .fromTo(merge.querySelector('.nx-merge__b'), { x: 120, opacity: 0, rotate: 6 }, { x: 0, opacity: 1, rotate: 0, duration: 1, ease: EASE }, 0)
           .fromTo(merge.querySelector('.nx-merge__plus'), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(2)' }, 0.5)
           .fromTo(merge.querySelectorAll('.nx-merge__text > *'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: EASE }, 0.6);
        groupIn('.nx-sketches li', { y: 30, rotate: function (i) { return (i % 3 - 1) * 5; }, stagger: 0.04 });

        // The form: the frame steps through the build as you scroll.
        if (formPin && formPin.el.classList.contains('is-pinned')) {
          ST.create(sc({
            trigger: formPin.el, start: function () { return 'top top+=' + barH(); }, end: 'bottom bottom', scrub: SCRUB,
            onUpdate: function (self) { showStep(Math.min(steps.length - 1, Math.floor(self.progress * steps.length))); }
          }));
        }

        // Walkies: the render rises, callout lines draw, collars line up.
        var dtl = gsap.timeline({ scrollTrigger: sc({ trigger: device, start: 'top 75%', once: true }) });
        dtl.fromTo(device.querySelector('.nx-device__img'), { opacity: 0, y: 70, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: EASE })
           .fromTo(device.querySelectorAll('.nx-callout'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: EASE }, 0.6)
           .add(function () {
             gsap.fromTo(deviceLines.querySelectorAll('.nx-callout__line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, stagger: 0.12, ease: EASE });
             gsap.fromTo(deviceLines.querySelectorAll('.nx-callout__dot'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(2)', delay: 0.5 });
           }, 0.7);
        groupIn('.nx-collars li', { x: 80, stagger: 0.08 });

        // The app: phones slide sideways while you scroll down.
        var appPin = pins.filter(function (x) { return x.el.closest('.nx-s--app'); })[0];
        if (appPin && appPin.el.classList.contains('is-pinned')) {
          var track = appPin.el.querySelector('.nx-track');
          var vp = appPin.el.querySelector('.nx-app__viewport');
          var phones = track.querySelectorAll('.nx-phone');
          var keyFired = false;
          var xtl = gsap.timeline({ defaults: { ease: 'none' } });
          xtl.fromTo(track, { x: 0 }, { x: function () { return -Math.max(0, track.scrollWidth - vp.clientWidth); }, duration: 1 });
          pinTrigger(appPin, xtl);
          ST.create(sc({ trigger: appPin.el, start: function () { return 'top top+=' + barH(); }, end: 'bottom bottom',
            onUpdate: function (self) {
              var lit = Math.min(phones.length - 1, Math.floor(self.progress * phones.length));
              Array.prototype.forEach.call(phones, function (ph, i) { ph.classList.toggle('is-on', i === lit); });
              if (self.progress > 0.85 && !keyFired && self.direction > 0) { keyFired = true; pulse(); }
              if (self.progress < 0.6) keyFired = false;
            } }));
          appPin.el.classList.add('is-x');
          // Keyboard: tabbing to a phone scrolls the page to where it's in view.
          on(track, 'focusin', function (e) {
            var ph = e.target.closest('.nx-phone');
            if (!ph) return;
            var i = Number(ph.getAttribute('data-phone'));
            var top = scroller.scrollTop + appPin.el.getBoundingClientRect().top - scroller.getBoundingClientRect().top - barH();
            var range = appPin.el.offsetHeight - (scroller.clientHeight - barH());
            scroller.scrollTop = top + range * i / Math.max(1, phones.length - 1);
          });
        }
        groupIn('.nx-app__more > *', { y: 40, stagger: 0.1 });

        // Treat: each shift arrives with a beat; the two come back together.
        Array.prototype.forEach.call(world.querySelectorAll('.nx-shift'), function (s) {
          gsap.fromTo(s.children, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.8, ease: EASE, stagger: 0.1, scrollTrigger: sc({ trigger: s, start: 'top 80%', once: true }) });
        });
        var reunion = world.querySelector('[data-reunion]');
        var rgap = function (sign) {
          var w = reunion.getBoundingClientRect().width;
          return sign * w * 0.22;
        };
        gsap.timeline({ scrollTrigger: sc({ trigger: reunion, start: 'top 85%', end: 'center 55%', scrub: SCRUB }) })
          .fromTo(reunion.querySelector('.nx-reunion__owner'), { x: function () { return rgap(-1); } }, { x: 0, ease: 'none' }, 0)
          .fromTo(reunion.querySelector('.nx-reunion__dog'), { x: function () { return rgap(1); } }, { x: 0, ease: 'none' }, 0);
        groupIn('.nx-point', { y: 30, stagger: 0.1 });
      }, world);
    }
    // Inside a sticky stage, an element's own position moves with the pin, so
    // its entrance is triggered by the pinned scene instead.
    function triggerFor(el) { var pin = el.closest('.nx-pin.is-pinned'); return pin || el; }
    function groupIn(sel, o) {
      var els = world.querySelectorAll(sel);
      if (!els.length) return;
      var fromV = { opacity: 0 };
      var toV = { opacity: 1, duration: o.duration || 0.9, ease: o.ease || EASE, stagger: o.stagger || 0.06,
        scrollTrigger: sc({ trigger: triggerFor(els[0].parentNode), start: 'top 85%', once: true }) };
      ['x', 'y', 'rotate', 'scale'].forEach(function (k) {
        if (o[k] !== undefined) { fromV[k] = o[k]; toV[k] = k === 'scale' ? 1 : 0; }
      });
      gsap.fromTo(els, fromV, toV);
    }

    // Unpinned (phones, tablets), long clusters show six notes and a button for the rest,
    // so the board doesn't take five screens to scroll past.
    function collapseClusters() {
      Array.prototype.forEach.call(world.querySelectorAll('.nx-cluster'), function (c) {
        var n = c.querySelectorAll('.nx-note').length;
        if (n <= 6 || c.querySelector('.nx-cluster__more')) return;
        c.classList.add('is-collapsed');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'nx-pill nx-cluster__more';
        b.setAttribute('aria-expanded', 'false');
        b.textContent = 'Show all ' + n + ' notes';
        b.addEventListener('click', function () {
          var open = c.classList.toggle('is-collapsed') === false;
          b.setAttribute('aria-expanded', String(open));
          b.textContent = open ? 'Show fewer' : 'Show all ' + n + ' notes';
          refresh();
        });
        c.appendChild(b);
      });
    }

    // The affinity board is scaled to fit its stage when it's pinned.
    function fitBoard() {
      var board = world.querySelector('[data-board]');
      var pin = pins.filter(function (x) { return x.el.closest('.nx-s--affinity'); })[0];
      board.style.removeProperty('--fit');
      board.style.marginBottom = '';
      if (!pin || !pin.el.classList.contains('is-pinned')) return;
      var stage = pin.stage;
      var head = stage.querySelector('.nx-affinity__head');
      var avail = stage.clientHeight - head.offsetHeight - 150;   // room for the dock
      var need = board.offsetHeight;   // layout height: the scattered notes' transforms don't count
      var fit = Math.min(1, avail / need);
      board.style.setProperty('--fit', fit.toFixed(3));
      board.style.marginBottom = (-(1 - fit) * need).toFixed(1) + 'px';   // the scaled board takes only the room it shows
    }

    /* ---------- Start, refresh, stop ---------- */
    if (motion) {
      // cubic-bezier(0.22, 1, 0.36, 1), as a GSAP ease
      if (!easeReady) { gsap.registerEase(EASE, function (t) { return cubic(BEZIER, t); }); easeReady = true; }
      buildMotion();
      gsap.ticker.add(breathe);
      cleanups.push(function () { gsap.ticker.remove(breathe); });
    } else {
      fitBoard();
      if (window.innerWidth < 1024) collapseClusters();
    }

    var raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; updateDock(); });
    }
    on(scroller, 'scroll', onScroll, { passive: true });

    var refreshTimer = 0;
    function refresh() {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(function () {
        if (dead) return;
        setVH();
        layoutPins();
        stageForm();
        fitBoard();
        if (motion) ST.refresh();
        drawCallouts();
        buildThread();
        updateDock();
      }, 120);
    }
    Array.prototype.forEach.call(world.querySelectorAll('img'), function (im) {
      if (!im.complete) on(im, 'load', refresh);
    });
    on(window, 'resize', refresh);
    var ro = 'ResizeObserver' in window ? new ResizeObserver(refresh) : null;
    if (ro) { ro.observe(scroller); cleanups.push(function () { ro.disconnect(); }); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

    drawCallouts();
    buildThread();
    updateDock();
    if (motion) ST.refresh();

    // Decode every picture quietly in idle time, so a scene's images are ready
    // before it scrolls in (no decode hitch at the start of a scene).
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(function () { fn({ timeRemaining: function () { return 8; } }); }, 60); };
    var pending = Array.prototype.slice.call(world.querySelectorAll('img'));
    (function warm(deadline) {
      if (dead) return;
      while (pending.length && deadline.timeRemaining() > 4) {
        var im = pending.shift();
        im.loading = 'eager';
        if (im.decode) im.decode().catch(function () {});
      }
      if (pending.length) idle(warm);
    })({ timeRemaining: function () { return 0; } });

    return {
      refresh: refresh,
      destroy: function () {
        dead = true;
        clearTimeout(refreshTimer);
        if (raf) cancelAnimationFrame(raf);
        if (gctx) gctx.revert();
        cleanups.forEach(function (fn) { fn(); });
        sheet.classList.remove('nx-sheet');
      }
    };
  }

  // cubic-bezier(x1, y1, x2, y2) at time t, solved for x (Newton's method).
  function cubic(b, t) {
    var x1 = b[0], y1 = b[1], x2 = b[2], y2 = b[3];
    function bz(a1, a2, s) { return 3 * a1 * s * (1 - s) * (1 - s) + 3 * a2 * s * s * (1 - s) + s * s * s; }
    var s = t;
    for (var i = 0; i < 6; i++) {
      var x = bz(x1, x2, s) - t;
      var dx = 3 * x1 * (1 - s) * (1 - s) + 6 * (x2 - x1) * s * (1 - s) + 3 * (1 - x2) * s * s;
      if (Math.abs(dx) < 1e-6) break;
      s = Math.min(1, Math.max(0, s - x / dx));
    }
    return bz(y1, y2, s);
  }

  worlds.nexo = {
    css: 'css/worlds/nexo.css',
    fonts: 'https://fonts.googleapis.com/css2?family=Chewy&family=Inter+Tight:ital,wght@0,400..800;1,400&display=swap',
    render: render,
    mount: mount,
    // The scenes paint their own colours (a static layer), so the sheet doesn't blend tones on scroll.
    ownTones: true
  };
})();
