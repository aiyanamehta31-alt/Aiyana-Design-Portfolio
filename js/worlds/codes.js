/* =====================================================================
   CODES · a creative-coding playground inside the glass sheet
   js/case-study.js loads this file (and css/worlds/codes.css) when the
   project data says world: 'codes'. It gives the shell:

     render(p)    the page in its finished state: every sketch shows a
                  still frame (a real <img>) until its live code loads
     mount(ctx)   loads each sketch as it nears the screen, plays only the
                  one in view, wires the controls, tabs, code view and full
                  screen; returns { refresh, destroy, handleKey }

   The sketches are ES modules in js/codes/, run by js/codes/runner.js.

   1. Helpers           4. Loading and the one-at-a-time player
   2. Page → HTML       5. Controls per sketch
   3. Mount             6. Code view, full screen
   ===================================================================== */
(function () {
  'use strict';

  var worlds = window.CASE_WORLDS = window.CASE_WORLDS || {};

  /* ---------- 1. Helpers ---------- */
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // A small JavaScript highlighter: comments, strings, numbers, keywords, calls.
  var TOKENS = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|(`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b(\d+(?:\.\d+)?)\b|\b(const|let|var|function|return|if|else|for|of|in|new|export|import|from|true|false|null|this|while|break|continue|typeof|try|catch)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g;
  function highlight(src) {
    var out = '', last = 0, m;
    TOKENS.lastIndex = 0;
    while ((m = TOKENS.exec(src))) {
      var kind = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'n' : m[4] ? 'k' : 'f';
      out += esc(src.slice(last, m.index)) + '<span class="tok-' + kind + '">' + esc(m[0]) + '</span>';
      last = TOKENS.lastIndex;
    }
    return out + esc(src.slice(last));
  }

  var P = null;
  function src(name) { return esc(P.images + name); }

  /* ---------- 2. Page → HTML ---------- */
  function coverHTML(p) {
    var c = p.cover;
    return '<section class="cs-section cd-s cd-cover" id="cs-cover" data-tone="night" aria-labelledby="cs-title">' +
      '<div class="cd-wrap cd-cover__grid">' +
        '<div class="cd-cover__art" aria-hidden="true"><canvas class="cd-canvas" data-cover></canvas></div>' +
        '<h2 class="cd-title" id="cs-title">' + esc(p.title) + '</h2>' +
        '<p class="cd-line">' + esc(c.line) + '</p>' +
        '<dl class="cd-facts">' + c.facts.map(function (f) {
          return '<div><dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd></div>';
        }).join('') + '</dl>' +
        '<nav class="cd-index" aria-label="The four sketches"><ol>' + p.sketches.map(function (s) {
          return '<li><a href="#cd-' + s.id + '"><span class="cd-index__stage">' + esc(s.stage) + '</span><span class="cd-index__title">' + esc(s.title) + '</span></a></li>';
        }).join('') + '</ol></nav>' +
      '</div></section>';
  }

  function slider(id, act, label, min, max, step, value, unit) {
    return '<div class="cd-field"><label for="cd-' + act + '-' + id + '">' + label + '</label>' +
      '<input type="range" id="cd-' + act + '-' + id + '" data-act="' + act + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '" />' +
      '<output for="cd-' + act + '-' + id + '" data-out="' + act + '">' + value + unit + '</output></div>';
  }
  var PLAY = '<button type="button" class="cd-btn" data-act="toggle" aria-pressed="false">Play</button>';
  var FULL = '<button type="button" class="cd-btn cd-btn--quiet" data-act="full">Full screen</button>';

  function controlsHTML(s) {
    switch (s.id) {
      case 'orbit':
        return PLAY + slider(s.id, 'speed', 'Speed', 0.25, 2, 0.05, '1.00', '×') + FULL;
      case 'bloom':
        return PLAY + slider(s.id, 'grid', 'Grid size (gridSize)', 20, 60, 1, 40, '') +
          '<p class="cd-readout" aria-live="polite"><span>Petals</span> <output data-out="petals">8</output></p>' + FULL;
      case 'wave':
        return '<div class="cd-field cd-field--word"><label for="cd-word-wave">Type a word</label>' +
          '<input type="text" id="cd-word-wave" data-act="word" value="WAVE" maxlength="12" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="cd-word-help" />' +
          '<span class="cd-help" id="cd-word-help">Enter clears it.</span></div>' +
          slider(s.id, 'cycle', 'Cycle time (cycleTime)', 4, 16, 0.5, 8, ' s') + PLAY + FULL;
      case 'galaxy':
        return '<button type="button" class="cd-btn cd-btn--accent" data-act="enter">Enter the galaxy</button>' +
          '<label class="cd-switch"><input type="checkbox" data-act="orbits" checked /> <span>Orbit lines</span></label>' + PLAY + FULL;
    }
    return '';
  }

  function sketchHTML(s, i) {
    var wide = s.dimensions[0] / s.dimensions[1] > 1.2;
    var side = wide ? 'wide' : (i % 2 ? 'right' : 'left');
    return '<section class="cs-section cd-s cd-s--' + side + '" id="cd-' + s.id + '" data-tone="night" data-sketch="' + s.id + '" aria-labelledby="cd-h-' + s.id + '">' +
      '<div class="cd-wrap cd-grid">' +
        '<header class="cd-head">' +
          '<p class="cd-meta"><span>' + esc(s.stage) + '</span><span>' + esc(s.file) + '</span><span>' + s.dimensions[0] + ' × ' + s.dimensions[1] + '</span></p>' +
          '<h3 class="cd-h" id="cd-h-' + s.id + '" tabindex="-1">' + esc(s.title) + '</h3>' +
        '</header>' +
        '<div class="cd-stage">' +
          '<div class="cd-tabs" role="tablist" aria-label="' + esc(s.title) + ': play it or view the code">' +
            '<button type="button" role="tab" id="cd-tab-play-' + s.id + '" aria-controls="cd-play-' + s.id + '" aria-selected="true">Play</button>' +
            '<button type="button" role="tab" id="cd-tab-code-' + s.id + '" aria-controls="cd-code-' + s.id + '" aria-selected="false" tabindex="-1">View code</button>' +
          '</div>' +
          '<div class="cd-panel" role="tabpanel" id="cd-play-' + s.id + '" aria-labelledby="cd-tab-play-' + s.id + '">' +
            '<div class="cd-frame" style="--ratio:' + s.dimensions[0] + ' / ' + s.dimensions[1] + '; --ar:' + (s.dimensions[0] / s.dimensions[1]).toFixed(4) + '">' +
              '<img class="cd-still" src="' + src(s.still) + '" width="' + s.dimensions[0] + '" height="' + s.dimensions[1] + '" alt="' + esc(s.label) + '" loading="lazy" decoding="async" />' +
              '<canvas class="cd-canvas" role="img" aria-label="' + esc(s.label) + '" hidden></canvas>' +
              '<button type="button" class="cd-bigplay" data-act="toggle" hidden><span aria-hidden="true">▶</span> Play ' + esc(s.title) + '</button>' +
            '</div>' +
            '<p class="cd-hint"><span>Try it</span> ' + esc(s.hint) + '</p>' +
            '<div class="cd-controls">' + controlsHTML(s) + '</div>' +
          '</div>' +
          '<div class="cd-panel cd-code" role="tabpanel" id="cd-code-' + s.id + '" aria-labelledby="cd-tab-code-' + s.id + '" hidden>' +
            '<div class="cd-code__bar"><span>' + esc(s.module) + '</span><button type="button" class="cd-btn cd-btn--quiet" data-act="copy">Copy</button></div>' +
            '<pre tabindex="0" aria-label="Source code of ' + esc(s.title) + '"><code>Loading the code…</code></pre>' +
          '</div>' +
        '</div>' +
        '<div class="cd-notes">' +
          '<h4 class="cd-h4">How it works</h4><p class="cd-how">' + esc(s.how) + '</p>' +
          '<h4 class="cd-h4">Reflection</h4><blockquote class="cd-reflection"><p>' + esc(s.reflection) + '</p></blockquote>' +
          (s.credits ? '<p class="cd-credits">' + esc(s.credits.team) + ' <strong class="cd-mine"><span class="cd-mine__tag">My part</span> ' + esc(s.credits.mine) + '</strong></p>' : '') +
        '</div>' +
      '</div></section>';
  }

  function closeHTML() {
    return '<section class="cs-section cd-s cd-close" id="cs-next" data-tone="night" aria-label="Next project">' +
      '<div class="cd-wrap"><a class="cd-back" href="#work" data-cs-back>Back to all work</a></div></section>';
  }

  function render(p) {
    P = p;
    var html = '<div class="cd-world">' + coverHTML(p) + p.sketches.map(sketchHTML).join('') + closeHTML() + '</div>';
    P = null;
    return html;
  }

  /* ---------- 3. Mount ---------- */
  function mount(ctx) {
    var p = ctx.project;
    var scroller = ctx.scroller;
    var content = ctx.content;
    var sheet = ctx.sheet;
    var reduce = ctx.reduceMotion;
    var world = content.querySelector('.cd-world');
    var cleanups = [];
    var dead = false;
    function on(el, type, fn, opts) { el.addEventListener(type, fn, opts); cleanups.push(function () { el.removeEventListener(type, fn, opts); }); }

    sheet.classList.add('cd-sheet');
    cleanups.push(function () { sheet.classList.remove('cd-sheet'); });

    // Every live sketch on the page, by id ('cover' is the little Wave behind the title).
    var items = {};
    p.sketches.forEach(function (s) {
      var section = world.querySelector('[data-sketch="' + s.id + '"]');
      items[s.id] = { id: s.id, data: s, section: section, canvas: section.querySelector('.cd-canvas'),
        still: section.querySelector('.cd-still'), ratio: 0, ctrl: null, loading: false, wants: !reduce, full: false };
    });
    items.cover = { id: 'cover', data: { id: 'cover', module: 'js/codes/wave.js' }, section: world.querySelector('.cd-cover'),
      canvas: world.querySelector('[data-cover]'), ratio: 0, ctrl: null, loading: false, wants: !reduce, decorative: true };

    /* ---------- 4. Loading and the one-at-a-time player ---------- */
    function moduleURL(path) { return new URL(path, document.baseURI).href; }

    function load(item) {
      if (item.loading || item.ctrl || !window.CodesRunner) return;
      item.loading = true;
      import(moduleURL(item.data.module)).then(function (mod) {
        if (dead) return;
        item.canvas.hidden = false;
        if (item.still) item.still.hidden = true;
        var start = { bloom: 2.6, orbit: 0, galaxy: 0 }[item.id] || 0;
        item.ctrl = window.CodesRunner(item.canvas, mod, { startTime: start, onChange: function () { syncPlay(item); } });
        if (item.id === 'cover') item.ctrl.sketch.setWord(p.cover.word);
        wire(item);
        syncPlay(item);
        choose();
      }).catch(function (err) {
        item.loading = false;   // the still frame stays in place
        if (window.console) console.warn('[codes] could not load', item.data.module, err);
      });
    }

    // Load when a sketch is about a screen away; note how much of each is visible.
    var near = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var item = itemFor(e.target);
        if (item) load(item);
      });
    }, { root: scroller, rootMargin: '100% 0px 100% 0px' });
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var item = itemFor(e.target);
        if (item) item.ratio = e.isIntersecting ? e.intersectionRatio : 0;
      });
      choose();
    }, { root: scroller, threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.9, 1] });
    function itemFor(el) {
      for (var k in items) if (items[k].canvas.closest('.cd-frame, .cd-cover__art') === el) return items[k];
      return null;
    }
    Object.keys(items).forEach(function (k) {
      var box = items[k].canvas.closest('.cd-frame, .cd-cover__art');
      near.observe(box);
      seen.observe(box);
    });
    cleanups.push(function () { near.disconnect(); seen.disconnect(); });

    // Only one sketch plays: the most visible one that hasn't been paused by hand.
    var fullItem = null;
    function choose() {
      if (dead) return;
      var best = null;
      if (fullItem) best = fullItem;
      else if (!document.hidden) {
        Object.keys(items).forEach(function (k) {
          var it = items[k];
          if (!it.ctrl || !it.wants || it.ratio < 0.15) return;
          if (!best || it.ratio > best.ratio) best = it;
        });
      }
      Object.keys(items).forEach(function (k) {
        var it = items[k];
        if (!it.ctrl) return;
        if (it === best) it.ctrl.play(); else it.ctrl.pause();
      });
    }
    on(document, 'visibilitychange', choose);

    // The play buttons say what will happen; the big Play shows on a paused still.
    function syncPlay(item) {
      if (item.decorative || !item.ctrl) return;
      var playing = item.ctrl.playing;
      Array.prototype.forEach.call(item.section.querySelectorAll('.cd-controls [data-act="toggle"]'), function (b) {
        b.textContent = playing ? 'Pause' : 'Play';
        b.setAttribute('aria-pressed', String(!playing && !item.wants));
        b.setAttribute('aria-label', (playing ? 'Pause ' : 'Play ') + item.data.title);
      });
      // The big Play sits on a still that won't start by itself (reduced motion, or paused by hand).
      var big = item.section.querySelector('.cd-bigplay') || (item.full && full.querySelector('.cd-bigplay'));
      if (big) big.hidden = playing || item.wants;
    }
    function setWants(item, wants) {
      item.wants = wants;
      choose();
      syncPlay(item);
    }

    /* ---------- 5. Controls per sketch ---------- */
    function wire(item) {
      if (item.decorative) return;
      var s = item.ctrl.sketch;
      var box = item.section;
      function out(name, text) { var o = box.querySelector('[data-out="' + name + '"]'); if (o) o.textContent = text; }

      if (item.id === 'orbit') {
        var speed = box.querySelector('[data-act="speed"]');
        on(speed, 'input', function () { s.setSpeed(Number(speed.value)); out('speed', Number(speed.value).toFixed(2) + '×'); });
      }
      if (item.id === 'bloom') {
        var grid = box.querySelector('[data-act="grid"]');
        on(grid, 'input', function () { s.setGridSize(Number(grid.value)); out('grid', grid.value); item.ctrl.redraw(); });
        s.onPetals(function (n) { out('petals', n); });
      }
      if (item.id === 'wave') {
        var word = box.querySelector('[data-act="word"]');
        var cycle = box.querySelector('[data-act="cycle"]');
        on(word, 'input', function () { s.setWord(word.value); item.ctrl.redraw(); });
        on(word, 'keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); word.value = ''; s.setWord(''); item.ctrl.redraw(); }
        });
        on(cycle, 'input', function () { s.setCycleTime(Number(cycle.value)); out('cycle', cycle.value + ' s'); });
      }
      if (item.id === 'galaxy') {
        var enter = box.querySelector('[data-act="enter"]');
        var orbits = box.querySelector('[data-act="orbits"]');
        s.onScreen(function (screen) {
          enter.textContent = screen === 'galaxy' ? 'Enter the galaxy' : 'Back to the galaxy';
          item.canvas.setAttribute('aria-label', screen === 'galaxy' ? item.data.label : 'The Sun with eight textured planets moving on tilted orbits.');
        });
        on(enter, 'click', function () {
          if (s.screen === 'galaxy') s.enter(); else s.back();
          setWants(item, true);
        });
        on(item.canvas, 'click', function () {
          if (s.screen === 'galaxy') { s.enter(); setWants(item, true); }
        });
        on(orbits, 'change', function () { s.setOrbits(orbits.checked); item.ctrl.redraw(); });
      }
    }

    // Buttons that work the same in every section (and in full screen).
    on(world, 'click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      var section = b.closest('[data-sketch]') || (fullItem && fullItem.section);
      var item = section && items[section.getAttribute('data-sketch')];
      var act = b.getAttribute('data-act');
      if (act === 'toggle' && item) {
        if (!item.ctrl) { load(item); item.wants = true; return; }
        setWants(item, !item.ctrl.playing);
      } else if (act === 'full' && item) {
        openFull(item, b);
      } else if (act === 'copy' && item) {
        copyCode(item, b);
      }
    });

    // Tabs: Play / View code (arrow keys move between them).
    Array.prototype.forEach.call(world.querySelectorAll('.cd-tabs'), function (list) {
      var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
      function select(i, focus) {
        tabs.forEach(function (t, k) {
          t.setAttribute('aria-selected', String(k === i));
          t.tabIndex = k === i ? 0 : -1;
          document.getElementById(t.getAttribute('aria-controls')).hidden = k !== i;
        });
        if (focus) tabs[i].focus();
        var item = items[list.closest('[data-sketch]').getAttribute('data-sketch')];
        if (i === 1) { showCode(item); setWants(item, false); }
      }
      on(list, 'click', function (e) { var t = e.target.closest('[role="tab"]'); if (t) select(tabs.indexOf(t), false); });
      on(list, 'keydown', function (e) {
        var i = tabs.indexOf(document.activeElement);
        var k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (i < 0 || k === undefined) return;
        e.preventDefault();
        select((k + tabs.length) % tabs.length, true);
      });
    });

    /* ---------- 6. Code view, full screen ---------- */
    var sources = {};
    function showCode(item) {
      var pre = item.section.querySelector('.cd-code code');
      if (sources[item.id]) return;
      fetch(moduleURL(item.data.module)).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      }).then(function (text) {
        sources[item.id] = text;
        pre.innerHTML = highlight(text);
      }).catch(function () {
        pre.textContent = 'The code could not be loaded here. It is in ' + item.data.module + '.';
      });
    }
    function copyCode(item, button) {
      var text = sources[item.id];
      if (!text) return;
      var done = function (ok) {
        button.textContent = ok ? 'Copied' : 'Copy failed';
        setTimeout(function () { button.textContent = 'Copy'; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      else done(false);
    }

    // Full screen: the live frame and its controls move into a larger glass panel.
    var full = document.createElement('div');
    full.className = 'cd-full';
    full.hidden = true;
    full.setAttribute('role', 'dialog');
    full.setAttribute('aria-modal', 'true');
    full.innerHTML = '<div class="cd-full__backdrop" data-full-close></div>' +
      '<div class="cd-full__panel"><div class="cd-full__stage"></div>' +
      '<div class="cd-full__bar"><p class="cd-full__title"></p><div class="cd-full__controls"></div>' +
      '<button type="button" class="cd-btn cd-btn--quiet" data-full-close>Close</button></div></div>';
    document.body.appendChild(full);
    cleanups.push(function () { closeFull(true); full.remove(); });
    var fullStage = full.querySelector('.cd-full__stage');
    var fullControls = full.querySelector('.cd-full__controls');
    var moved = null;

    function openFull(item, trigger) {
      if (fullItem) return;
      var frame = item.section.querySelector('.cd-frame');
      var controls = item.section.querySelector('.cd-controls');
      moved = { item: item, frame: frame, controls: controls, frameHome: frame.parentNode, frameNext: frame.nextSibling,
        controlsHome: controls.parentNode, controlsNext: controls.nextSibling, trigger: trigger };
      fullStage.appendChild(frame);
      fullControls.appendChild(controls);
      full.querySelector('.cd-full__title').textContent = item.data.title + ' · ' + item.data.hint;
      full.setAttribute('aria-label', item.data.title + ', full screen');
      full.style.setProperty('--ar', (item.data.dimensions[0] / item.data.dimensions[1]).toFixed(4));
      full.hidden = false;
      document.querySelector('.cs-layer').inert = true;
      fullItem = item;
      item.full = true;
      if (!item.ctrl) load(item);
      item.wants = true;
      choose();
      syncPlay(item);
      var first = full.querySelector('[data-full-close].cd-btn');
      first.focus({ preventScroll: true });
    }
    function closeFull(silent) {
      if (!fullItem || !moved) return;
      moved.frameHome.insertBefore(moved.frame, moved.frameNext);
      moved.controlsHome.insertBefore(moved.controls, moved.controlsNext);
      full.hidden = true;
      var layer = document.querySelector('.cs-layer');
      if (layer) layer.inert = false;
      fullItem.full = false;
      var item = fullItem;
      fullItem = null;
      choose();
      syncPlay(item);
      if (!silent && moved.trigger) moved.trigger.focus({ preventScroll: true });
      moved = null;
    }
    on(full, 'click', function (e) {
      if (e.target.closest('[data-full-close]')) { closeFull(false); return; }
      // controls moved into full screen still work
      var b = e.target.closest('[data-act]');
      if (b && fullItem && b.getAttribute('data-act') === 'toggle') setWants(fullItem, !fullItem.ctrl || !fullItem.ctrl.playing);
    });
    // Esc closes full screen (and only that); Tab stays inside it.
    on(full, 'keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeFull(false); return; }
      if (e.key === 'Tab') {
        e.stopPropagation();
        var list = Array.prototype.filter.call(full.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])'), function (el) { return !el.disabled && el.offsetParent !== null; });
        if (!list.length) return;
        var first = list[0], last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Load the cover's Wave straight away.
    load(items.cover);

    function refresh() {
      Object.keys(items).forEach(function (k) { if (items[k].ctrl) items[k].ctrl.resize(); });
    }

    return {
      refresh: refresh,
      destroy: function () {
        dead = true;
        Object.keys(items).forEach(function (k) { if (items[k].ctrl) items[k].ctrl.destroy(); });
        cleanups.forEach(function (fn) { fn(); });
      }
    };
  }

  worlds.codes = {
    css: 'css/worlds/codes.css',
    fonts: 'https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@400;500;600&display=swap',
    // The runner is an ES module; it's loaded once and handed to the world.
    ready: function () {
      if (window.CodesRunner) return Promise.resolve();
      // If modules can't load (e.g. opened from the file system), the page still opens with its stills.
      return import(new URL('js/codes/runner.js', document.baseURI).href).then(function (m) { window.CodesRunner = m.run; }, function () {});
    },
    render: render,
    mount: mount
  };
})();
