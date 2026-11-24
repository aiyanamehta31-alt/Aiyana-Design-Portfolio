/* =====================================================================
   NEXO · a calm, one-page case study inside the glass sheet
   (rebuilt 2026-11-25, after Prapti Digge's Scout page as a reference
   for clarity only: one paper page, the story in order, plain words,
   lots of real proof.)

   js/case-study.js loads this file and css/worlds/nexo.css for
   world: 'nexo'. The words and pictures are in projects/nexo.js.

     render(p)   the whole page, finished: name and concept video, then
                 Overview, The problem, Research, Insights, Ideas, Shaping
                 it, Prototyping, How it works, Final design, What it changes
     mount(ctx)  the glider, gentle reveals, the prototype clips (they play
                 only while on screen), and the concept video's play button

   Nothing moves on its own except the short prototype clips, and those
   stay still with reduced motion.
   ===================================================================== */
(function () {
  'use strict';
  var worlds = window.CASE_WORLDS = window.CASE_WORLDS || {};

  /* ---------- 1. Helpers ---------- */
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(v) { return esc(v).replace(/\[NEEDS FROM AIYANA[^\]]*\]/g, function (m) { return '<mark class="nx-needs">' + m + '</mark>'; }); }
  var P = null;
  function src(name) { return esc(P.images + name); }

  function img(i, eager) {
    return '<img src="' + src(i.src) + '" width="' + i.width + '" height="' + i.height + '" alt="' + esc(i.alt || '') + '"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async" />';
  }
  // A picture that opens larger, with an optional handwritten note under it.
  function pic(i, group, opts) {
    opts = opts || {};
    var note = i.note || i.caption || i.label || '';
    return '<figure class="nx-pic' + (opts.cls ? ' ' + opts.cls : '') + '">' +
      '<button type="button" class="nx-zoom" data-zoom data-group="' + esc(group) + '" data-caption="' + esc(note || i.alt || '') + '">' +
        '<span class="sr-only">Open larger: </span>' + img(i, opts.eager) + '</button>' +
      (note && !opts.noNote ? '<figcaption class="' + (opts.plain ? 'nx-cap' : 'nx-note') + '">' + rich(note) + '</figcaption>' : '') +
    '</figure>';
  }
  // A short prototype clip: silent, loops, plays only while on screen.
  function clip(m) {
    return '<figure class="nx-pic nx-clip">' +
      '<video data-nx-clip muted loop playsinline preload="none" width="' + m.width + '" height="' + m.height + '"' +
        ' poster="' + src(m.poster) + '" aria-label="' + esc(m.alt) + '"><source src="' + src(m.video) + '" type="video/mp4" /></video>' +
    '</figure>';
  }
  function media(m, group) { return m.video ? clip(m) : pic(m, group, { noNote: true }); }

  function section(id, inner, cls) {
    return '<section class="cs-section nx-s nx-s--' + id + (cls ? ' ' + cls : '') + '" id="nx-' + id + '" data-tone="paper" aria-labelledby="nx-h-' + id + '">' +
      '<div class="nx-col">' + inner + '</div></section>';
  }
  function head(id, heading, text) {
    return '<header class="nx-head nx-rise"><h3 class="nx-h" id="nx-h-' + id + '" tabindex="-1">' + esc(heading) + '</h3>' +
      (text ? '<p class="nx-p">' + rich(text) + '</p>' : '') + '</header>';
  }

  /* ---------- 2. Page ---------- */
  function topHTML(p) {
    var t = p.intro, v = t.video;
    return '<section class="cs-section nx-top" id="cs-cover" data-tone="paper" aria-labelledby="cs-title"><div class="nx-col">' +
      '<h2 class="nx-title" id="cs-title" tabindex="-1"><img src="' + src(t.logo.src) + '" width="' + t.logo.width + '" height="' + t.logo.height + '" alt="Nexo" fetchpriority="high" decoding="async" /></h2>' +
      '<p class="nx-lead">' + rich(t.line) + '</p>' +
      '<ul class="nx-tags" aria-label="What the project covers">' + t.tags.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      '<figure class="nx-film" data-nx-film data-src="' + src(v.src) + '">' +
        '<div class="nx-film__frame">' + img(v.poster, true) +
          '<button type="button" class="nx-film__play" data-nx-play><span class="nx-film__icon" aria-hidden="true"></span><span>Play the concept video</span></button>' +
        '</div>' +
        '<figcaption class="nx-note">' + esc(v.caption) + '</figcaption>' +
        '<p class="nx-film__missing" hidden>' + rich(v.missing) + '</p>' +
      '</figure>' +
      '<dl class="nx-facts">' + t.facts.map(function (f) { return '<div><dt>' + esc(f.label) + '</dt><dd>' + rich(f.value) + '</dd></div>'; }).join('') + '</dl>' +
    '</div></section>';
  }

  function overviewHTML(p) {
    var o = p.overview;
    return section('overview',
      '<div class="nx-brief">' +
        '<div class="nx-brief__art nx-rise">' + img(o.render) + '</div>' +
        '<div class="nx-brief__text nx-rise"><h3 class="nx-h" id="nx-h-overview" tabindex="-1">' + esc(o.heading) + '</h3>' +
          o.text.map(function (t) { return '<p class="nx-p">' + rich(t) + '</p>'; }).join('') + '</div>' +
      '</div>' +
      '<div class="nx-box nx-box--indigo nx-rise"><p class="nx-box__label">How might we</p><p class="nx-box__big">' + esc(o.hmw) + '</p></div>' +
      '<div class="nx-users nx-rise"><h4 class="nx-h4">Who it’s for</h4><dl>' + o.users.map(function (u) {
        return '<div><dt>' + esc(u.who) + '</dt><dd>' + esc(u.text) + '</dd></div>';
      }).join('') + '</dl></div>');
  }

  function problemHTML(p) {
    var d = p.problem;
    return section('problem', head('problem', d.heading, d.text) +
      '<ol class="nx-day nx-rise">' + d.day.map(function (b, i) {
        return '<li class="' + (i === 1 ? 'is-low' : '') + '"><span class="nx-day__time">' + esc(b.time) + '</span><span class="nx-day__text">' + esc(b.text) + '</span></li>';
      }).join('') + '</ol>' +
      '<div class="nx-box nx-box--orange nx-rise"><p class="nx-box__label">What we found</p><p class="nx-box__big">' + esc(d.insight) + '</p></div>');
  }

  function researchHTML(p) {
    var r = p.research;
    return section('research', head('research', r.heading, r.text) +
      '<div class="nx-proof nx-rise">' + r.proof.map(function (i, k) { return pic(i, 'research', { cls: 'nx-proof__' + k }); }).join('') + '</div>' +
      '<div class="nx-split nx-rise">' +
        '<div><h4 class="nx-h4">Where we went</h4><ul class="nx-chips">' + r.places.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        '<div><h4 class="nx-h4">How</h4><dl class="nx-methods">' + r.methods.map(function (m) {
          return '<div><dt>' + esc(m.name) + '</dt><dd>' + esc(m.text) + '</dd></div>';
        }).join('') + '</dl></div>' +
      '</div>' +
      '<div class="nx-photos nx-rise">' + r.photos.map(function (i) { return pic(i, 'field', { noNote: true }); }).join('') + '</div>' +
      '<p class="nx-note nx-note--center">some of the dogs we met</p>' +
      '<div class="nx-quotes nx-rise"><h4 class="nx-h4">What owners told us</h4><ul>' + r.quotes.map(function (q, i) {
        return '<li class="' + (i === r.quotes.length - 1 ? 'is-key' : '') + '"><p>“' + esc(q) + '”</p></li>';
      }).join('') + '</ul></div>');
  }

  function insightsHTML(p) {
    var d = p.insights;
    return section('insights', head('insights', d.heading, d.text) +
      '<div class="nx-rise">' + pic(d.map, 'insights', { cls: 'nx-wide' }) + '</div>' +
      '<ul class="nx-groups nx-rise">' + d.groups.map(function (g) {
        return '<li class="' + (g.key ? 'is-key' : '') + '"><strong>' + esc(g.name) + '</strong><span>' + esc(g.text) + '</span></li>';
      }).join('') + '</ul>' +
      '<h4 class="nx-h4 nx-rise">Tools we used to make sense of it</h4>' +
      '<div class="nx-tools nx-rise">' + d.tools.map(function (i) { return pic(i, 'insights', { plain: true }); }).join('') + '</div>' +
      '<div class="nx-box nx-box--indigo nx-rise"><p class="nx-box__label">So we asked</p><p class="nx-box__big">' + esc(d.hmw) + '</p></div>');
  }

  function ideasHTML(p) {
    var d = p.ideas;
    return section('ideas', head('ideas', d.heading, d.text) +
      '<div class="nx-sketches nx-rise">' + d.sketches.map(function (i) { return pic(i, 'ideas', { noNote: true }); }).join('') + '</div>' +
      '<p class="nx-note nx-note--center">a few of our first ideas</p>' +
      '<ul class="nx-scored nx-rise">' + d.scored.map(function (c) {
        var total = c.want + c.product + c.build;
        return '<li class="' + (c.kept ? 'is-kept' : 'is-cut') + '">' + pic(c, 'ideas', { noNote: true }) +
          '<div class="nx-scored__body"><p class="nx-scored__name">' + esc(c.name) + '</p>' +
            '<dl class="nx-scores"><div><dt>Want it</dt><dd>' + c.want + '</dd></div><div><dt>Product</dt><dd>' + c.product + '</dd></div><div><dt>Build it</dt><dd>' + c.build + '</dd></div><div class="is-total"><dt>Total</dt><dd>' + total + '</dd></div></dl>' +
            '<p class="nx-scored__fate">' + (c.kept ? 'Kept' : 'Set aside') + '</p>' +
            (c.why ? '<p class="nx-scored__why">' + rich(c.why) + '</p>' : '') +
          '</div></li>';
      }).join('') + '</ul>' +
      '<div class="nx-box nx-box--orange nx-rise"><p class="nx-box__big">' + esc(d.merge) + '</p><p class="nx-box__small">' + rich(d.mergeWhy) + '</p></div>' +
      '<div class="nx-poster nx-rise">' + pic(d.poster, 'ideas', { cls: 'nx-poster__main' }) +
        '<div class="nx-poster__side">' + d.session.map(function (i) { return pic(i, 'ideas', { noNote: true }); }).join('') +
        '<p class="nx-note">the ideation session</p></div></div>');
  }

  function shapeHTML(p) {
    var d = p.shape;
    return section('shape', head('shape', d.heading, d.text) +
      '<div class="nx-pair nx-rise">' + d.sketches.map(function (i) { return pic(i, 'shape'); }).join('') + '</div>' +
      '<ol class="nx-cad nx-rise">' + d.cad.map(function (i, k) {
        return '<li>' + pic(i, 'shape', { noNote: true }) + '<p class="nx-cad__label"><span>' + (k + 1) + '</span>' + esc(i.label) + '</p></li>';
      }).join('') + '</ol>' +
      '<p class="nx-note nx-note--center">the form, step by step in CAD</p>');
  }

  function prototypeHTML(p) {
    var d = p.prototype;
    return section('prototype', head('prototype', d.heading, d.text) +
      '<ol class="nx-steps">' + d.steps.map(function (s) {
        return '<li class="nx-step nx-rise"><div class="nx-step__text"><h4 class="nx-h4">' + esc(s.title) + '</h4><p class="nx-p">' + esc(s.text) + '</p></div>' +
          '<div class="nx-step__media nx-step__media--' + s.media.length + '">' + s.media.map(function (m) { return media(m, 'prototype'); }).join('') + '</div></li>';
      }).join('') + '</ol>');
  }

  function howHTML(p) {
    var d = p.how;
    return section('how', head('how', d.heading, d.text) +
      '<ol class="nx-how nx-rise">' + d.steps.map(function (s, k) {
        return '<li><div class="nx-how__art">' + img(s) + '</div><p class="nx-how__n">' + (k + 1) + '</p><h4 class="nx-h4">' + esc(s.title) + '</h4><p class="nx-p">' + esc(s.text) + '</p></li>';
      }).join('') + '</ol>' +
      '<div class="nx-box nx-box--indigo nx-rise"><p class="nx-box__big">' + esc(d.loop) + '</p></div>');
  }

  function finalHTML(p) {
    var d = p.final;
    return section('final', head('final', d.heading) +
      '<div class="nx-final nx-rise"><div class="nx-final__art">' + img(d.render) + '</div>' +
        '<ul class="nx-final__points">' + d.points.map(function (pt) { return '<li><strong>' + esc(pt.title) + '</strong><span>' + esc(pt.text) + '</span></li>'; }).join('') + '</ul></div>' +
      '<div class="nx-collars nx-rise">' + d.collars.map(function (i) { return pic(i, 'final', { noNote: true }); }).join('') + '</div>' +
      '<p class="nx-note nx-note--center">' + esc(d.collarsNote) + '</p>' +
      '<ul class="nx-screens nx-rise">' + d.screens.map(function (s) {
        return '<li>' + pic(s, 'final', { noNote: true }) + '<p class="nx-cap">' + esc(s.caption) + '</p></li>';
      }).join('') + '</ul>' +
      '<p class="nx-small">' + rich(d.appNote) + ' · ' + rich(d.prototype) + '</p>');
  }

  function reflectHTML(p) {
    var d = p.reflect;
    return section('reflect', head('reflect', d.heading) +
      '<ul class="nx-shifts nx-rise">' + d.shifts.map(function (s) {
        return '<li><span class="nx-shifts__from">' + esc(s[0]) + '</span><span class="nx-shifts__arrow" aria-hidden="true">→</span><span class="sr-only"> becomes </span><span class="nx-shifts__to">' + esc(s[1]) + '</span></li>';
      }).join('') + '</ul>' +
      '<dl class="nx-reflect nx-rise">' + d.points.map(function (pt) { return '<div><dt>' + esc(pt.title) + '</dt><dd>' + rich(pt.text) + '</dd></div>'; }).join('') + '</dl>');
  }

  function nextHTML(p) {
    var n = p.next;
    return '<section class="cs-section nx-next" id="cs-next" data-tone="paper" aria-label="Next project"><div class="nx-col">' +
      (n ? '<a class="nx-next__link" href="#project/' + esc(n.slug) + '"><span>Next project</span><strong>' + esc(n.title) + ' →</strong></a>' : '') +
      '<a class="nx-next__back" href="#work" data-cs-back>Back to all work</a></div></section>';
  }

  function render(p) {
    P = p;
    var html = '<div class="nx" data-nx>' + topHTML(p) + overviewHTML(p) + problemHTML(p) + researchHTML(p) + insightsHTML(p) +
      ideasHTML(p) + shapeHTML(p) + prototypeHTML(p) + howHTML(p) + finalHTML(p) + reflectHTML(p) + nextHTML(p) + '</div>';
    P = null;
    return html;
  }

  /* ---------- 3. Mount ---------- */
  function mount(ctx) {
    var p = ctx.project, scroller = ctx.scroller, sheet = ctx.sheet, reduce = ctx.reduceMotion;
    var box = ctx.content.querySelector('[data-nx]');
    var cleanups = [];
    function on(el, type, fn, opt) { el.addEventListener(type, fn, opt); cleanups.push(function () { el.removeEventListener(type, fn, opt); }); }
    sheet.classList.add('nx-sheet');
    cleanups.push(function () { sheet.classList.remove('nx-sheet'); });

    // Gentle reveals: each block rises in once, the first time it's seen.
    var rises = box.querySelectorAll('.nx-rise');
    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(rises, function (el) { el.classList.add('is-in'); });
    } else {
      box.classList.add('is-motion');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { root: scroller, rootMargin: '0px 0px -10% 0px' });
      Array.prototype.forEach.call(rises, function (el) { io.observe(el); });
      cleanups.push(function () { io.disconnect(); });
    }

    // Prototype clips: play while on screen, pause when not. With reduced
    // motion they stay still and show their controls instead.
    var clips = box.querySelectorAll('[data-nx-clip]');
    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(clips, function (v) { v.setAttribute('controls', ''); });
    } else {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { var pr = e.target.play(); if (pr && pr.catch) pr.catch(function () { e.target.setAttribute('controls', ''); }); }
          else e.target.pause();
        });
      }, { root: scroller, threshold: 0.4 });
      Array.prototype.forEach.call(clips, function (v) { vio.observe(v); });
      cleanups.push(function () { vio.disconnect(); Array.prototype.forEach.call(clips, function (v) { v.pause(); }); });
    }

    // The concept video: the still and a play button until it's pressed.
    // If the file isn't there yet, the button goes and the note shows.
    var film = box.querySelector('[data-nx-film]');
    var play = film.querySelector('[data-nx-play]');
    var fileSrc = film.getAttribute('data-src');
    if (location.protocol.indexOf('http') === 0 && window.fetch) {
      var probe = function (again) {
        fetch(fileSrc, { method: 'HEAD' }).then(function (r) { if (!r.ok) missing(); })
          .catch(function () { if (again) setTimeout(function () { probe(false); }, 800); });
      };
      probe(true);
    }
    function missing() { play.hidden = true; film.querySelector('.nx-film__missing').hidden = false; film.classList.add('is-missing'); }
    on(play, 'click', function () {
      var frame = film.querySelector('.nx-film__frame');
      var v = document.createElement('video');
      v.className = 'nx-film__video';
      v.src = fileSrc;
      v.controls = true;
      v.playsInline = true;
      v.poster = frame.querySelector('img').getAttribute('src');
      v.addEventListener('error', missing);
      frame.innerHTML = '';
      frame.appendChild(v);
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function () {});
      v.focus();
    });

    // The glider: every part of the page down the left margin (wide screens).
    var glider = window.CaseGlider ? window.CaseGlider({
      sheet: sheet, scroller: scroller, content: ctx.content, lenis: ctx.lenis, reduceMotion: reduce,
      cls: 'nx-glider', label: 'Nexo, part by part',
      offset: function () { return (parseFloat(getComputedStyle(sheet).getPropertyValue('--cs-bar-h')) || 60) + 16; },
      items: p.parts.map(function (pt, i) {
        return { name: pt.name, el: i === 0 ? box.querySelector('#cs-cover') : box.querySelector('#nx-' + pt.id),
          focus: box.querySelector(i === 0 ? '#cs-title' : '#nx-h-' + pt.id) };
      })
    }) : null;
    if (glider) cleanups.push(glider.destroy);

    return {
      refresh: function () { if (glider) glider.refresh(); },
      destroy: function () { cleanups.forEach(function (fn) { fn(); }); }
    };
  }

  worlds.nexo = {
    css: 'css/worlds/nexo.css',
    fonts: 'https://fonts.googleapis.com/css2?family=Chewy&family=Inter+Tight:ital,wght@0,400..800;1,400&family=Caveat:wght@500;600&display=swap',
    render: render,
    mount: mount,
    // One paper tone for the whole page; the shell paints it solid.
    ownTones: true
  };
})();
