/* =====================================================================
   WIGLET · its own world inside the glass sheet
   js/case-study.js loads this file (and css/worlds/wiglet.css) when the
   project data says world: 'wiglet'. It needs three classic scripts loaded
   first (see `scripts` below): the scheduler port, the demo parser and the
   embedded scheduler source. All classic, so it works from file:// too.

   1. Helpers            4. The demo (plan, serialise, render, animate)
   2. Page → HTML        5. Scenes (reveals, counters, pipeline, loop)
   3. Mount              6. Mascot, dock
   The demo makes no network calls: everything below runs in the page.
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
  var P = null;
  function src(name) { return esc(P.images + name); }
  function img(i, cls) {
    return '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="' + src(i.src) + '" width="' + i.width + '" height="' + i.height +
      '" alt="' + esc(i.alt || '') + '" loading="lazy" decoding="async" />';
  }
  function zoom(i, group, caption) {
    return '<button type="button" class="wg-zoom" data-zoom data-group="' + group + '" data-caption="' + esc(caption || i.caption || '') + '">' +
      '<span class="sr-only">Open larger: </span>' + img(i) + '</button>';
  }

  // A small highlighter for the code tab (Python and JavaScript).
  var TOKENS = /(#[^\n]*|\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("""[\s\S]*?"""|`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b(\d+(?:\.\d+)?)\b|\b(def|return|if|elif|else|for|in|not|and|or|is|None|True|False|from|import|class|with|as|lambda|continue|break|raise|const|let|var|function|new|typeof|null|true|false|this|while|try|catch)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g;
  function highlight(text) {
    var out = '', last = 0, m;
    TOKENS.lastIndex = 0;
    while ((m = TOKENS.exec(text))) {
      var kind = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'n' : m[4] ? 'k' : 'f';
      out += esc(text.slice(last, m.index)) + '<span class="tok-' + kind + '">' + esc(m[0]) + '</span>';
      last = TOKENS.lastIndex;
    }
    return out + esc(text.slice(last));
  }

  // The mascot, redrawn from static/wiglet.png so it can blink and react.
  var mascots = 0;
  function mascot() {
    var n = ++mascots;   // unique gradient ids per copy
    return MASCOT.replace(/wg-blob-(fill|shine)/g, 'wg-blob-$1-' + n);
  }
  var MASCOT = '<svg class="wg-blob" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
    '<defs><radialGradient id="wg-blob-fill" cx="0.36" cy="0.66" r="0.85">' +
      '<stop offset="0" stop-color="#2E6BEA"/><stop offset="0.55" stop-color="#3B9BE6"/><stop offset="1" stop-color="#6FE3C4"/>' +
    '</radialGradient><radialGradient id="wg-blob-shine" cx="0.62" cy="0.3" r="0.4">' +
      '<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.35"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>' +
    '</radialGradient></defs>' +
    '<path class="wg-blob__body" d="M60 14C84 14 104 34 106 60C108 88 88 106 60 106C32 106 12 90 14 62C16 34 36 14 60 14Z" fill="url(#wg-blob-fill)"/>' +
    '<path d="M60 14C84 14 104 34 106 60C108 88 88 106 60 106C32 106 12 90 14 62C16 34 36 14 60 14Z" fill="url(#wg-blob-shine)"/>' +
    '<g class="wg-blob__eyes"><ellipse cx="50" cy="56" rx="4.6" ry="6.4" fill="#0B1530"/><ellipse cx="70" cy="56" rx="4.6" ry="6.4" fill="#0B1530"/>' +
    '<circle cx="51.4" cy="53.6" r="1.4" fill="#FFFFFF" opacity="0.8"/><circle cx="71.4" cy="53.6" r="1.4" fill="#FFFFFF" opacity="0.8"/></g></svg>';

  var ICON = {
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path class="wg-lock__shackle" d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    flow: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="4" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect class="wg-flow__block" x="3" y="15" width="9" height="4" rx="2" fill="currentColor"/></svg>',
    one: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 9.5 12.5 8v8.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    keyboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 9.5h.01M9 9.5h.01M12 9.5h.01M15 9.5h.01M18 9.5h.01M6 12.5h.01M9 12.5h.01M12 12.5h.01M15 12.5h.01M18 12.5h.01M8.5 15.5h7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2.5" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v3.7h3.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------- 2. Page → HTML ---------- */
  function phase(id) {
    var ph = P.phases.filter(function (x) { return x.id === id; })[0];
    return '<header class="wg-phase wg-in" data-phase-head="' + id + '">' +
      '<h3 class="wg-phase__name" id="wg-h-' + id + '" tabindex="-1">' + esc(ph.name) + '</h3>' +
      '<p class="wg-phase__real">' + esc(ph.real) + '</p></header>';
  }
  function scene(id, phaseId, label, inner, extra) {
    return '<section class="cs-section wg-s wg-s--' + id + (extra ? ' ' + extra : '') + '" id="wg-' + id + '" data-tone="navy"' +
      (phaseId ? ' data-phase-id="' + phaseId + '"' : '') + ' aria-labelledby="' + label + '"><div class="wg-wrap">' + inner + '</div></section>';
  }

  function coverHTML(p) {
    var c = p.cover;
    return '<section class="cs-section wg-s wg-cover" id="cs-cover" data-tone="navy" aria-labelledby="cs-title"><div class="wg-wrap wg-cover__grid">' +
      '<div class="wg-cover__text">' +
        '<p class="wg-mono wg-cover__kicker">Agentic AI · Final capstone</p>' +
        '<h2 class="wg-wordmark" id="cs-title">' + esc(p.title) + '</h2>' +
        '<p class="wg-cover__tagline">' + esc(c.tagline) + '</p>' +
        '<ul class="wg-tags" aria-label="What it connects">' + c.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '<a class="wg-cta" href="#wg-demo">' + esc(c.cta) + '</a>' +
      '</div>' +
      '<div class="wg-cover__mascot" aria-hidden="true">' + mascot() + '</div>' +
      '<dl class="wg-facts">' + c.facts.map(function (f) {
        return '<div><dt class="wg-mono">' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd></div>';
      }).join('') + '</dl>' +
    '</div></section>';
  }

  function problemHTML(p) {
    var d = p.problem;
    return scene('wake', 'wake', 'wg-h-wake', phase('wake') +
      '<h4 class="wg-h wg-in">' + esc(d.heading) + '</h4>' +
      '<div class="wg-three" data-three>' +
        d.cards.map(function (c, i) {
          return '<article class="wg-card wg-three__card wg-in" style="--i:' + i + '"><h5>' + esc(c.title) + '</h5><p>' + esc(c.text) + '</p></article>';
        }).join('') +
        '<svg class="wg-three__links" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">' +
          '<path class="wg-three__link wg-three__link--a" d="M40 10 H140" /><path class="wg-three__link wg-three__link--b" d="M160 10 H260" /></svg>' +
      '</div>' +
      '<p class="wg-statement wg-in"><span>' + esc(d.lead) + '</span> <strong>' + esc(d.punch) + '</strong></p>');
  }

  function questionHTML(p) {
    var q = p.question;
    return scene('question', 'plan', 'wg-h-plan', phase('plan') +
      '<div class="wg-field">' +
        '<p class="wg-mono wg-field__label">The question</p>' +
        '<p class="wg-question" data-lines>' + q.lines.map(function (l, i) {
          return '<span class="wg-question__line" style="--i:' + i + '">' + esc(l) + '</span>';
        }).join(' ') + '</p>' +
        '<p class="wg-field__sub wg-in">' + esc(q.sub) + '</p>' +
      '</div>');
  }

  function meetHTML(p) {
    var m = p.meet, r = p.rules;
    return scene('meet', 'plan', 'wg-h-meet',
      '<div class="wg-meet">' +
        '<div class="wg-meet__text"><h4 class="wg-h wg-in" id="wg-h-meet">' + esc(m.heading) + '</h4>' +
          '<ul class="wg-traits">' + m.traits.map(function (t, i) {
            return '<li class="wg-in" style="--i:' + i + '"><h5>' + esc(t.title) + '</h5><p>' + esc(t.text) + '</p></li>';
          }).join('') + '</ul></div>' +
        '<figure class="wg-meet__img wg-in">' + zoom(m.image, 'meet', 'Design mockup: Wiglet on a laptop') + '</figure>' +
      '</div>' +
      '<h4 class="wg-h wg-h--sub wg-in">' + esc(r.heading) + '</h4>' +
      '<ul class="wg-rules">' + r.items.map(function (it, i) {
        return '<li class="wg-card wg-rule wg-rule--' + it.icon + ' wg-in" style="--i:' + i + '"><span class="wg-rule__icon">' + ICON[it.icon] + '</span>' +
          '<h5>' + esc(it.title) + '</h5><p>' + esc(it.text) + '</p></li>';
      }).join('') + '</ul>');
  }

  function pipelineHTML(p) {
    var d = p.pipeline;
    return scene('pipeline', 'work', 'wg-h-work', phase('work') +
      '<h4 class="wg-h wg-in">' + esc(d.heading) + '</h4>' +
      '<div class="wg-key wg-in"><span class="wg-key__ai">AI</span> understands language <span class="wg-key__code">Code</span> decides and acts</div>' +
      '<ol class="wg-pipe" data-pipe>' + d.steps.map(function (s, i) {
        return '<li class="wg-pipe__step ' + (s.ai ? 'is-ai' : 'is-code') + ' wg-in" style="--i:' + i + '">' +
          '<p class="wg-mono wg-pipe__n">' + (i + 1) + ' · ' + esc(s.step) + '</p>' +
          '<p class="wg-pipe__by"><span>' + (s.ai ? 'AI' : 'Code') + '</span> ' + esc(s.by) + '</p>' +
          '<p class="wg-pipe__what">' + esc(s.what) + '</p>' +
          '<p class="wg-pipe__out">' + esc(s.out) + '</p></li>';
      }).join('') + '</ol>' +
      '<p class="wg-close wg-in">' + esc(d.close) + '</p>');
  }

  function loopHTML(p) {
    var d = p.loop;
    return scene('loop', 'work', 'wg-h-loop',
      '<h4 class="wg-h wg-in" id="wg-h-loop">' + esc(d.heading) + '</h4>' +
      '<div class="wg-loop" data-loop>' +
        '<svg class="wg-loop__ring" viewBox="0 0 400 400" aria-hidden="true"><circle cx="200" cy="200" r="150"/><circle class="wg-loop__spark" cx="200" cy="50" r="7"/></svg>' +
        '<ol class="wg-loop__nodes">' + d.steps.map(function (s, i) {
          return '<li class="wg-loop__node wg-loop__node--' + i + '"><p class="wg-mono">' + esc(s.name) + '</p><h5>' + esc(s.title) + '</h5><p>' + esc(s.text) + '</p></li>';
        }).join('') + '</ol>' +
      '</div>' +
      '<p class="wg-close wg-in">' + esc(d.close) + '</p>');
  }

  function callsHTML(p) {
    var d = p.calls;
    return scene('calls', 'work', 'wg-h-calls',
      '<div class="wg-calls">' +
        '<div><h4 class="wg-h wg-in" id="wg-h-calls">' + esc(d.heading) + '</h4><p class="wg-text wg-in">' + esc(d.text) + '</p></div>' +
        '<div class="wg-card wg-calls__list"><p class="wg-mono">' + esc(d.label) + '</p><ul>' + d.items.map(function (c, i) {
          return '<li class="wg-tick wg-in" style="--i:' + i + '"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" /></svg>' + esc(c) + '</li>';
        }).join('') + '</ul></div>' +
      '</div>');
  }

  function brokeHTML(p) {
    var d = p.broke;
    return scene('broke', 'work', 'wg-h-broke',
      '<h4 class="wg-h wg-in" id="wg-h-broke">' + esc(d.heading) + '</h4><p class="wg-text wg-in">' + esc(d.hint) + '</p>' +
      '<ul class="wg-flips">' + d.items.map(function (it, i) {
        return '<li class="wg-in" style="--i:' + i + '"><button type="button" class="wg-flip" aria-pressed="false">' +
          '<span class="wg-flip__inner"><span class="wg-flip__face wg-flip__front"><span class="wg-flip__title">' + esc(it.title) + '</span>' +
          '<span class="wg-flip__tag is-broke">Broke</span><span class="wg-flip__text">' + esc(it.broke) + '</span></span>' +
          '<span class="wg-flip__face wg-flip__back"><span class="wg-flip__title">' + esc(it.title) + '</span>' +
          '<span class="wg-flip__tag is-fix">Fix</span><span class="wg-flip__text">' + esc(it.fix) + '</span></span></span></button></li>';
      }).join('') + '</ul>');
  }

  function numbersHTML(p) {
    var d = p.numbers;
    return scene('numbers', 'work', 'wg-h-numbers',
      '<h4 class="wg-h wg-in" id="wg-h-numbers">' + esc(d.heading) + '</h4>' +
      '<ul class="wg-stats">' + d.stats.map(function (s, i) {
        var final = s.prefix + s.value.toFixed(s.decimals) + s.suffix;
        return '<li class="wg-card wg-in" style="--i:' + i + '"><span class="wg-stat" data-count="' + s.value + '" data-decimals="' + s.decimals +
          '" data-prefix="' + esc(s.prefix) + '" data-suffix="' + esc(s.suffix) + '">' + esc(final) + '</span><span class="wg-stat__label">' + esc(s.label) + '</span></li>';
      }).join('') + '</ul>' +
      '<ol class="wg-ship" data-ship>' + d.timeline.map(function (t, i) {
        return '<li class="wg-in" style="--i:' + i + '"><span class="wg-mono wg-ship__when">' + esc(t.when) + '</span><span class="wg-ship__what">' + esc(t.what) + '</span></li>';
      }).join('') + '</ol>' +
      '<p class="wg-source">' + esc(d.source) + '</p>');
  }

  function shippedHTML(p) {
    var d = p.shipped, k = p.keys;
    return scene('shipped', 'ship', 'wg-h-ship', phase('ship') +
      '<h4 class="wg-h wg-in">' + esc(d.heading) + '</h4>' +
      '<div class="wg-mm">' +
        '<figure class="wg-mm__mock wg-in">' + zoom(d.mockup, 'shipped') + '<figcaption class="wg-mono">' + esc(d.mockup.caption) + '</figcaption></figure>' +
        '<span class="wg-mm__arrow wg-in" aria-hidden="true">→</span>' +
        '<figure class="wg-mm__live wg-in">' + zoom(d.live, 'shipped') + '<figcaption class="wg-mono">' + esc(d.live.caption) + '</figcaption><p class="wg-text">' + esc(d.note) + '</p></figure>' +
      '</div>' +
      '<h4 class="wg-h wg-h--sub wg-in">' + esc(k.heading) + '</h4>' +
      '<ol class="wg-keys">' + k.steps.map(function (s, i) {
        return '<li class="wg-in" style="--i:' + i + '">' + zoom(s, 'keys', s.title) +
          '<p class="wg-mono">' + (i + 1) + ' · ' + esc(s.title) + '</p><p>' + esc(s.text) + '</p></li>';
      }).join('') + '</ol>');
  }

  function demoHTML(p) {
    var d = p.demo;
    return scene('demo', 'ship', 'wg-h-demo',
      '<div class="wg-demo__head"><h4 class="wg-h wg-in" id="wg-h-demo">' + esc(d.heading) + '</h4><p class="wg-text wg-in">' + esc(d.text) + '</p></div>' +
      '<div class="wg-demo__tabs" role="tablist" aria-label="Live demo or the real code">' +
        '<button type="button" role="tab" id="wg-tab-try" aria-controls="wg-panel-try" aria-selected="true">Try it</button>' +
        '<button type="button" role="tab" id="wg-tab-code" aria-controls="wg-panel-code" aria-selected="false" tabindex="-1">View the real scheduler</button>' +
      '</div>' +
      '<div class="wg-demo" role="tabpanel" id="wg-panel-try" aria-labelledby="wg-tab-try">' +
        '<ol class="wg-steps" aria-label="The agent loop for this request">' +
          ['Perceive', 'Reason', 'Act', 'Observe'].map(function (s) { return '<li data-step="' + s.toLowerCase() + '">' + s + '</li>'; }).join('') + '</ol>' +
        '<div class="wg-app" data-ui data-app>' +
          '<div class="card">' +
            '<header class="head"><span class="wiglet-mini" aria-hidden="true">' + mascot() + '</span>' +
              '<div class="titles"><p class="wg-app__title">Today</p></div>' +
              '<button type="button" class="icon ghost" data-reset aria-label="Reset day">' + ICON.reset + '<span>Reset day</span></button></header>' +
            '<p class="banner">' + esc(d.modeNote) + '</p>' +
            '<section class="timeline" data-timeline aria-label="Today’s plan"></section>' +
            '<section class="unplaced" data-unplaced hidden></section>' +
            '<footer class="foot">' +
              '<div class="footrow"><p class="summary" data-summary>&nbsp;</p>' +
                '<div class="actions"><button type="button" class="icon" data-mic aria-pressed="false" aria-label="Talk to Wiglet" hidden>' + ICON.mic + '</button></div></div>' +
              '<p class="heard" data-heard hidden></p>' +
              '<p class="wg-understood" data-understood hidden></p>' +
              '<p class="notice" data-overlap hidden></p>' +
              '<form class="composer" data-composer autocomplete="off">' +
                '<label class="sr-only" for="wg-input">Tell Wiglet what you want to do today</label>' +
                '<input id="wg-input" type="text" placeholder="' + esc(d.placeholder) + '" maxlength="120" />' +
                '<button type="submit" class="send" aria-label="Send">&rarr;</button></form>' +
            '</footer>' +
          '</div>' +
        '</div>' +
        '<div class="wg-chips"><p class="wg-mono">Try one</p><ul>' + d.chips.map(function (c) {
          return '<li><button type="button" class="wg-chip" data-chip="' + esc(c) + '">' + esc(c) + '</button></li>';
        }).join('') + '</ul></div>' +
        '<p class="wg-demo__note">' + esc(d.flexNote) + '</p>' +
        '<p class="wg-demo__note" data-voice-note hidden>' + esc(d.voiceNote) + '</p>' +
        '<p class="sr-only" role="status" aria-live="polite" data-announce></p>' +
      '</div>' +
      '<div class="wg-code" role="tabpanel" id="wg-panel-code" aria-labelledby="wg-tab-code" hidden>' +
        ['python', 'js'].map(function (k) {
          var title = k === 'python' ? 'wiglet/scheduler.py: the original' : 'js/wiglet/scheduler.js: the port running above';
          return '<div class="wg-code__pane"><div class="wg-code__bar"><span class="wg-mono">' + title + '</span>' +
            '<button type="button" class="wg-btn" data-copy="' + k + '">Copy</button></div>' +
            '<pre tabindex="0" aria-label="' + esc(title) + '"><code data-code="' + k + '"></code></pre></div>';
        }).join('') +
      '</div>');
  }

  function realHTML(p) {
    var r = p.real;
    if (!r.liveUrl) return '';   // not deployed yet (see TODO in projects/wiglet.js)
    return scene('real', 'ship', 'wg-h-real',
      '<div class="wg-card wg-real"><h4 class="wg-h" id="wg-h-real">' + esc(r.heading) + '</h4><p class="wg-text">' + esc(r.text) + '</p>' +
      '<a class="wg-cta" href="' + esc(r.liveUrl) + '" target="_blank" rel="noopener">' + esc(r.button) + '<span class="sr-only"> (opens in a new tab)</span></a></div>');
  }

  function tomorrowHTML(p) {
    var t = p.tomorrow, n = p.next;
    return scene('tomorrow', 'tomorrow', 'wg-h-tomorrow', phase('tomorrow') +
      '<h4 class="wg-h wg-in">' + esc(t.heading) + '</h4>' +
      '<ul class="wg-next3">' + t.items.map(function (it, i) {
        return '<li class="wg-card wg-in" style="--i:' + i + '"><h5>' + esc(it.title) + '</h5><p>' + esc(it.text) + '</p></li>';
      }).join('') + '</ul>' +
      (n ? '<a class="wg-nextlink" href="#project/' + esc(n.slug) + '"><span class="wg-mono">Next project</span><strong>' + esc(n.title) + ' →</strong></a>' : '') +
      '<a class="wg-back" href="#work" data-cs-back>Back to all work</a>');
  }

  function render(p) {
    P = p;
    var html = '<div class="wg-world">' + coverHTML(p) + problemHTML(p) + questionHTML(p) + meetHTML(p) + pipelineHTML(p) +
      loopHTML(p) + callsHTML(p) + brokeHTML(p) + numbersHTML(p) + shippedHTML(p) + demoHTML(p) + realHTML(p) + tomorrowHTML(p) + '</div>';
    P = null;
    return html;
  }

  /* ---------- 3. Mount ---------- */
  function mount(ctx) {
    var p = ctx.project;
    var scroller = ctx.scroller, content = ctx.content, sheet = ctx.sheet;
    var reduce = ctx.reduceMotion;
    var world = content.querySelector('.wg-world');
    var S = window.WigletScheduler, Parser = window.WigletDemoParser;
    var cleanups = [], timers = [];
    function on(el, type, fn, opts) { el.addEventListener(type, fn, opts); cleanups.push(function () { el.removeEventListener(type, fn, opts); }); }
    function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }

    if (!reduce) world.classList.add('is-motion');

    /* ---------- 6. Mascot (the guide) and dock ---------- */
    var guide = document.createElement('div');
    guide.className = 'wg-guide';
    guide.setAttribute('aria-hidden', 'true');
    guide.innerHTML = mascot();
    sheet.appendChild(guide);
    cleanups.push(function () { guide.remove(); });
    function react(kind) {
      if (reduce) return;
      guide.classList.remove('is-bounce', 'is-tilt');
      void guide.offsetWidth;   // restart the animation
      guide.classList.add(kind === 'tilt' ? 'is-tilt' : 'is-bounce');
    }

    var dock = document.createElement('nav');
    dock.className = 'wg-dock';
    dock.setAttribute('aria-label', 'Project phases');
    dock.innerHTML = '<ul>' + p.phases.map(function (ph) {
      return '<li><button type="button" data-dock="' + ph.id + '" aria-label="' + esc(ph.name + ' (' + ph.real + ')') + '">' +
        '<span class="wg-dock__dot" aria-hidden="true"></span><span class="wg-dock__name" aria-hidden="true">' + esc(ph.name) + '</span></button></li>';
    }).join('') + '</ul>';
    sheet.appendChild(dock);
    cleanups.push(function () { dock.remove(); });

    var heads = Array.prototype.slice.call(world.querySelectorAll('[data-phase-head]'));
    var showing = new Set(), foldTimer = 0;
    var headIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { var id = e.target.getAttribute('data-phase-head'); if (e.isIntersecting) showing.add(id); else showing.delete(id); });
      clearTimeout(foldTimer);
      if (showing.size) dock.classList.add('is-open');
      else foldTimer = setTimeout(function () { dock.classList.remove('is-open'); }, 500);
    }, { root: scroller });
    heads.forEach(function (h) { headIO.observe(h); });
    cleanups.push(function () { headIO.disconnect(); clearTimeout(foldTimer); });

    var current = null;
    function updateDock() {
      var line = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.6;
      var id = null;
      heads.forEach(function (h) { if (h.getBoundingClientRect().top <= line) id = h.getAttribute('data-phase-head'); });
      if (id === current) return;
      current = id;
      Array.prototype.forEach.call(dock.querySelectorAll('button'), function (b) {
        if (b.getAttribute('data-dock') === id) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
    }
    function scrollToEl(el) {
      var y = scroller.scrollTop + el.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 84;
      if (ctx.lenis) ctx.lenis.scrollTo(Math.max(0, y), { duration: 1.2 });
      else scroller.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
    }
    on(dock, 'click', function (e) {
      var b = e.target.closest('[data-dock]');
      if (!b) return;
      var h = world.querySelector('[data-phase-head="' + b.getAttribute('data-dock') + '"]');
      if (!h) return;
      scrollToEl(h);
      var heading = h.querySelector('h3');
      if (heading) heading.focus({ preventScroll: true });
    });
    var raf = 0;
    on(scroller, 'scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; updateDock(); });
    }, { passive: true });
    updateDock();

    /* ---------- 5. Scenes ---------- */
    // Reveal on entry (once). Content is visible without this: the hidden
    // starting state only applies once the world has .is-motion.
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        revealIO.unobserve(e.target);
        if (e.target.hasAttribute('data-count')) countUp(e.target);
      });
    }, { root: scroller, rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(world.querySelectorAll('.wg-in, [data-lines], [data-three], [data-ship], .wg-stat'), function (el) { revealIO.observe(el); });
    cleanups.push(function () { revealIO.disconnect(); });

    // The process trail: numbers count up from 0.
    function countUp(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
      var prefix = el.getAttribute('data-prefix') || '', suffix = el.getAttribute('data-suffix') || '';
      if (reduce) return;
      var start = performance.now(), dur = 1400;
      (function tick(now) {
        if (!el.isConnected) return;
        var t = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      })(start);
    }

    // Looping scenes (pipeline, agent loop) run only while on screen.
    function cycler(el, count, ms, onStep) {
      var i = -1, timer = 0;
      function step() { i = (i + 1) % count; onStep(i); timer = setTimeout(step, ms); }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          clearTimeout(timer);
          if (e.isIntersecting && !reduce && !document.hidden) step();
        });
      }, { root: scroller, threshold: 0.3 });
      io.observe(el);
      cleanups.push(function () { io.disconnect(); clearTimeout(timer); });
    }
    var pipe = world.querySelector('[data-pipe]');
    var pipeSteps = pipe.querySelectorAll('.wg-pipe__step');
    cycler(pipe, pipeSteps.length + 1, 1400, function (i) {
      Array.prototype.forEach.call(pipeSteps, function (s, k) { s.classList.toggle('is-active', k === i); s.classList.toggle('is-done', k < i); });
      pipe.style.setProperty('--at', Math.min(i, pipeSteps.length - 1));
    });
    var loop = world.querySelector('[data-loop]');
    var loopNodes = loop.querySelectorAll('.wg-loop__node');
    cycler(loop, loopNodes.length, 1500, function (i) {
      Array.prototype.forEach.call(loopNodes, function (n, k) { n.classList.toggle('is-active', k === i); });
    });

    // What broke: cards flip on tap, click or keyboard (and on hover, in CSS).
    on(world, 'click', function (e) {
      var flip = e.target.closest('.wg-flip');
      if (!flip) return;
      flip.setAttribute('aria-pressed', String(flip.getAttribute('aria-pressed') !== 'true'));
    });

    /* ---------- 4. The demo ---------- */
    var d = p.demo;
    var app = world.querySelector('[data-app]');
    var timeline = app.querySelector('[data-timeline]');
    var unplacedEl = app.querySelector('[data-unplaced]');
    var summary = app.querySelector('[data-summary]');
    var heard = app.querySelector('[data-heard]');
    var input = app.querySelector('#wg-input');
    var announce = world.querySelector('[data-announce]');
    var steps = world.querySelectorAll('.wg-steps li');
    var DAY_START = 8 * 60, DAY_END = 23 * 60;
    var COURSE_CODE = /\b[A-Z]{3,6}\d{1,4}/;   // server.py's rule for the "class" note

    // Tasks Wiglet places, and events the visitor asked to put on the calendar.
    // Events are fixed like classes: written at the stated time, never moved.
    var state = { items: [], events: [], rubric: {}, nextId: 1 };
    var classes = d.fixed.map(function (f) { return S.fixedEvent(f.id, f.title, f.start, f.end, false); });
    function fixedNow() { return classes.concat(state.events); }
    var understoodEl = app.querySelector('[data-understood]');
    var overlapEl = app.querySelector('[data-overlap]');

    // app.js: "09:00" -> "9:00", "13:30" -> "1:30" (12-hour, no am/pm).
    function clock(minute) {
      var h = Math.floor(minute / 60) % 24, m = minute % 60;
      return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m;
    }
    function durationText(mins) {
      var h = Math.floor(mins / 60), m = mins % 60;
      if (h && m) return h + ' hr ' + m + ' min';
      if (h) return h + ' hr' + (h === 1 ? '' : 's');
      return m + ' min';
    }
    // app.js openPhrase()
    function openPhrase(mins) {
      if (!mins) return 'no open time left today';
      var h = Math.floor(mins / 60), m = mins % 60;
      if (h && m) return h + ' hr ' + m + ' min open today';
      if (h) return h + ' hr' + (h === 1 ? '' : 's') + ' open today';
      return m + ' min open today';
    }
    // app.js kindLabel()
    function kindLabel(entry) {
      if (entry.note) return entry.kind === 'open' ? entry.note : (entry.kind === 'fixed' ? 'Fixed' : 'Flexible') + ' · ' + entry.note;
      if (entry.kind === 'open') return 'Open';
      if (entry.kind === 'fixed') return 'Fixed · synced';
      return entry.compromised ? 'Flexible · moved, ' + durationText(entry.minutes) : 'Flexible · ' + durationText(entry.minutes);
    }

    // server.py serialize(): one timeline with fixed, flexible and open rows.
    function solve() {
      var r = S.rubric(state.rubric);
      var plan = S.planDay({ fixedEvents: fixedNow(), flexibleItems: state.items, rubric: r, dayStart: DAY_START, dayEnd: DAY_END });
      var open = S.findOpenTime(plan);
      var byId = {};
      state.items.forEach(function (it) { byId[it.id] = it; });
      var rows = plan.blocks.map(function (b) {
        var note = '';
        // "added" for an event written from the demo; otherwise server.py's rule.
        if (b.kind === 'fixed') note = b.sourceId.indexOf('event-') === 0 ? 'added' : COURSE_CODE.test(b.name) ? 'class' : 'synced';
        else {
          var it = byId[b.sourceId], rank = it ? S.priorityOf(r, it) : r.defaultPriority;
          note = rank === r.defaultPriority ? '' : 'priority #' + rank;
        }
        return { key: b.sourceId, name: b.name, kind: b.kind, start: b.start, end: b.end, minutes: b.end - b.start, compromised: !b.preferenceSatisfied, note: note };
      }).concat(open.map(function (s) {
        return { key: 'open-' + s.start, name: 'Free', kind: 'open', start: s.start, end: s.end, minutes: s.end - s.start, compromised: false, note: '' };
      })).sort(function (a, b) { return a.start - b.start; });
      return {
        plan: plan, rows: rows,
        openMinutes: open.reduce(function (sum, s) { return sum + (s.end - s.start); }, 0),
        unplaced: plan.unplaced.map(function (u) { return { name: u.item.name, minutes: u.item.duration, largest: u.largestAvailable, reason: u.reason }; })
      };
    }

    // app.js renderTimeline(), with blocks that slide to their new places.
    function renderTimeline(rows, fresh) {
      var before = {};
      Array.prototype.forEach.call(timeline.children, function (el) { before[el.getAttribute('data-key')] = el.getBoundingClientRect().top; });
      timeline.replaceChildren();
      rows.forEach(function (entry) {
        var row = document.createElement('div');
        row.className = 'row ' + entry.kind;
        row.setAttribute('data-key', entry.key);
        var when = document.createElement('div');
        when.className = 'when';
        when.textContent = clock(entry.start) + ' – ' + clock(entry.end);
        var label = document.createElement('div');
        label.className = 'label';
        label.textContent = entry.name;
        if (entry.kind === 'fixed') {
          var lock = document.createElement('span');
          lock.className = 'wg-lockmark';
          lock.innerHTML = ICON.lock;
          lock.setAttribute('aria-label', 'locked');
          label.prepend(lock);
        }
        var kind = document.createElement('div');
        kind.className = 'kind';
        var dot = document.createElement('span');
        dot.className = 'dot ' + entry.kind;
        var text = document.createElement('span');
        text.textContent = kindLabel(entry);
        kind.append(dot, text);
        row.append(when, label, kind);
        timeline.append(row);
      });
      if (reduce) return;
      Array.prototype.forEach.call(timeline.children, function (el) {
        var key = el.getAttribute('data-key');
        var top = el.getBoundingClientRect().top;
        if (key in before && before[key] !== top) {
          el.animate([{ transform: 'translateY(' + (before[key] - top) + 'px)' }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        } else if (!(key in before) && fresh) {
          el.animate([{ opacity: 0, transform: 'translateX(-14px)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
          if (el.classList.contains('flexible')) el.classList.add('is-new');
        }
      });
    }

    // app.js renderUnplaced(), word for word.
    function renderUnplaced(items) {
      if (!items.length) { unplacedEl.hidden = true; unplacedEl.replaceChildren(); return; }
      var head = document.createElement('strong');
      head.textContent = 'Didn’t fit today';
      var list = document.createElement('ul');
      items.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item.largest
          ? item.name + ' — needs ' + item.minutes + ' min, biggest free block is ' + item.largest + ' min'
          : item.name + ' — needs ' + item.minutes + ' min, no room left';
        list.append(li);
      });
      unplacedEl.replaceChildren(head, list);
      unplacedEl.hidden = false;
    }

    var lastUnplaced = 0;
    function draw(fresh, said) {
      var result = solve();
      renderTimeline(result.rows, fresh);
      renderUnplaced(result.unplaced);
      summary.textContent = openPhrase(result.openMinutes);
      if (fresh) {
        var placedNow = result.rows.filter(function (r) { return r.kind === 'flexible'; }).length;
        var misses = result.unplaced.length;
        react(misses > lastUnplaced ? 'tilt' : 'bounce');
        lastUnplaced = misses;
        announce.textContent = (understoodEl.hidden ? '' : understoodEl.textContent + '. ') +
          'Plan updated. ' + placedNow + ' flexible ' + (placedNow === 1 ? 'task' : 'tasks') + ' placed' +
          (state.events.length ? ', ' + state.events.length + ' added to the calendar' : '') +
          (misses ? ', ' + misses + ' didn’t fit' : '') + '. ' + openPhrase(result.openMinutes) + '.' +
          (overlapEl.hidden ? '' : ' ' + overlapEl.textContent);
      } else {
        lastUnplaced = result.unplaced.length;
      }
      if (said != null) { heard.textContent = '“' + said + '”'; heard.hidden = !said; }
    }

    // The agent loop, lit up in turn, then the plan redrawn.
    var busy = false;
    function runLoop(done) {
      if (reduce) { done(); return; }
      busy = true;
      var order = ['perceive', 'reason', 'act', 'observe'];
      order.forEach(function (name, i) {
        later(function () {
          Array.prototype.forEach.call(steps, function (s) { s.classList.toggle('is-on', s.getAttribute('data-step') === name); s.classList.toggle('is-done', order.indexOf(s.getAttribute('data-step')) < i); });
          if (name === 'act') done();
        }, i * 260);
      });
      later(function () {
        Array.prototype.forEach.call(steps, function (s) { s.classList.remove('is-on'); s.classList.add('is-done'); });
        later(function () { Array.prototype.forEach.call(steps, function (s) { s.classList.remove('is-done'); }); busy = false; }, 900);
      }, order.length * 260);
    }

    function submit(text) {
      text = String(text || '').trim();
      if (!text) return;
      var parsed = Parser.parse(text, state.items);
      overlapEl.hidden = true;
      if (parsed.error || parsed.empty) {
        // Never guess: nothing is placed.
        heard.textContent = '“' + text + '”';
        heard.hidden = false;
        understoodEl.textContent = parsed.error || 'The demo parser didn’t catch a task in that. Try one of the examples.';
        understoodEl.hidden = false;
        announce.textContent = understoodEl.textContent;
        react('tilt');
        return;
      }
      parsed.items.forEach(function (it) {
        state.items.push(S.flexibleItem('t' + (state.nextId++), it.name, it.duration, it));
      });
      // Events go on the calendar as asked, even over something else (the real
      // app would write them), with a gentle note when they overlap.
      var overlaps = [];
      parsed.events.forEach(function (ev) {
        fixedNow().forEach(function (f) {
          if (ev.start < f.end && ev.end > f.start) overlaps.push(f.title);
        });
        state.events.push(S.fixedEvent('event-' + (state.nextId++), ev.title, ev.start, ev.end, false));
      });
      Object.keys(parsed.rubric).forEach(function (k) { state.rubric[k] = parsed.rubric[k]; });
      understoodEl.textContent = 'Understood: ' + parsed.understood.join('; ');
      understoodEl.hidden = !parsed.understood.length;
      if (overlaps.length) {
        overlapEl.textContent = 'Heads up: this overlaps ' + overlaps.join(' and ') + '.';
        overlapEl.hidden = false;
      }
      runLoop(function () { draw(true, text); });
    }

    on(app.querySelector('[data-composer]'), 'submit', function (e) {
      e.preventDefault();
      submit(input.value);
      input.value = '';
    });
    on(world.querySelector('.wg-chips'), 'click', function (e) {
      var chip = e.target.closest('[data-chip]');
      if (chip) submit(chip.getAttribute('data-chip'));
    });
    on(app.querySelector('[data-reset]'), 'click', function () {
      state.items = [];
      state.events = [];
      state.rubric = {};
      heard.hidden = true;
      understoodEl.hidden = true;
      overlapEl.hidden = true;
      draw(true, null);
      announce.textContent = 'Day reset to its three fixed blocks. ' + summary.textContent + '.';
    });

    // Voice, where the browser has speech recognition. Feeds the same parser.
    var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var mic = app.querySelector('[data-mic]');
    if (Recognition) {
      mic.hidden = false;
      world.querySelector('[data-voice-note]').hidden = false;
      var rec = null;
      on(mic, 'click', function () {
        if (rec) { rec.stop(); return; }
        rec = new Recognition();
        rec.lang = 'en-GB';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        mic.classList.add('recording');
        mic.setAttribute('aria-pressed', 'true');
        rec.onresult = function (ev) { submit(ev.results[0][0].transcript); };
        rec.onend = rec.onerror = function () { mic.classList.remove('recording'); mic.setAttribute('aria-pressed', 'false'); rec = null; };
        try { rec.start(); } catch (err) { rec.onend(); }
      });
    }

    // Tabs: Try it / View the real scheduler.
    var tabList = world.querySelector('.wg-demo__tabs');
    var tabs = Array.prototype.slice.call(tabList.querySelectorAll('[role="tab"]'));
    var codeFilled = false;
    function selectTab(i, focus) {
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', String(k === i));
        t.tabIndex = k === i ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = k !== i;
      });
      if (focus) tabs[i].focus();
      if (i === 1 && !codeFilled) {
        codeFilled = true;
        var sources = window.WigletSources || {};
        Array.prototype.forEach.call(world.querySelectorAll('[data-code]'), function (el) {
          var text = sources[el.getAttribute('data-code')];
          el.innerHTML = text ? highlight(text) : 'The source could not be loaded.';
        });
      }
    }
    on(tabList, 'click', function (e) { var t = e.target.closest('[role="tab"]'); if (t) selectTab(tabs.indexOf(t), false); });
    on(tabList, 'keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      var k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (i < 0 || k === undefined) return;
      e.preventDefault();
      selectTab((k + tabs.length) % tabs.length, true);
    });
    on(world, 'click', function (e) {
      var b = e.target.closest('[data-copy]');
      if (!b) return;
      var text = (window.WigletSources || {})[b.getAttribute('data-copy')];
      var done = function (ok) { b.textContent = ok ? 'Copied' : 'Copy failed'; later(function () { b.textContent = 'Copy'; }, 1800); };
      if (text && navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });

    draw(false, null);

    return {
      refresh: function () { updateDock(); },
      destroy: function () {
        timers.forEach(clearTimeout);
        if (raf) cancelAnimationFrame(raf);
        cleanups.forEach(function (fn) { fn(); });
      }
    };
  }

  worlds.wiglet = {
    css: 'css/worlds/wiglet.css',
    fonts: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400..700&family=JetBrains+Mono:wght@400;500;600&display=swap',
    // Classic scripts, loaded before the sheet opens (they work from file:// too).
    scripts: ['js/wiglet/scheduler.js', 'js/wiglet/demo-parser.js', 'js/wiglet/scheduler-source.js'],
    render: render,
    mount: mount
  };
})();
