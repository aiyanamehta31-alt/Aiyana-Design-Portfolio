/* =====================================================================
   WIGLET DEMO · the live scheduler, as a block for the story world
   (moved out of js/worlds/wiglet.js on 2026-11-25, behaviour unchanged)

   A story block { type: 'widget', name: 'wigletDemo', ...config } renders
   the real Wiglet card. Typing a request (or tapping an example) runs the
   agent loop: Perceive, Reason, Act, Observe light up in turn, a simple
   parser stands in for Whisper + the LLM, and Wiglet's real scheduling
   logic (js/wiglet/scheduler.js, ported line for line from scheduler.py)
   places the tasks. A second tab shows the original Python next to the
   port. Nothing is sent anywhere.

   Needs, loaded first (the project's `scripts`): js/wiglet/scheduler.js,
   js/wiglet/demo-parser.js, js/wiglet/scheduler-source.js.
   ===================================================================== */
(function () {
  'use strict';
  var widgets = window.STORY_WIDGETS = window.STORY_WIDGETS || {};
  var CSS = 'css/widgets/wiglet-demo.css?v=1';

  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

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

  // The mascot, redrawn from the app's wiglet.png so it can blink and react.
  var MASCOT = '<svg class="wg-blob" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
    '<defs><radialGradient id="wgd-blob-fill" cx="0.36" cy="0.66" r="0.85">' +
      '<stop offset="0" stop-color="#2E6BEA"/><stop offset="0.55" stop-color="#3B9BE6"/><stop offset="1" stop-color="#6FE3C4"/>' +
    '</radialGradient></defs>' +
    '<path d="M60 14C84 14 104 34 106 60C108 88 88 106 60 106C32 106 12 90 14 62C16 34 36 14 60 14Z" fill="url(#wgd-blob-fill)"/>' +
    '<g class="wg-blob__eyes"><ellipse cx="50" cy="56" rx="4.6" ry="6.4" fill="#0B1530"/><ellipse cx="70" cy="56" rx="4.6" ry="6.4" fill="#0B1530"/>' +
    '<circle cx="51.4" cy="53.6" r="1.4" fill="#FFFFFF" opacity="0.8"/><circle cx="71.4" cy="53.6" r="1.4" fill="#FFFFFF" opacity="0.8"/></g></svg>';
  var ICON = {
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2.5" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v3.7h3.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function html(d) {
    return '<div class="wgd" data-wgd>' +
      '<div class="wgd__tabs" role="tablist" aria-label="Live demo or the real code">' +
        '<button type="button" role="tab" id="wgd-tab-try" aria-controls="wgd-panel-try" aria-selected="true">Try it</button>' +
        '<button type="button" role="tab" id="wgd-tab-code" aria-controls="wgd-panel-code" aria-selected="false" tabindex="-1">See the real scheduler code</button>' +
      '</div>' +
      '<div class="wgd__try" role="tabpanel" id="wgd-panel-try" aria-labelledby="wgd-tab-try">' +
        '<ol class="wgd__steps" aria-label="The agent loop for this request">' +
          [['perceive', 'Perceive'], ['reason', 'Reason'], ['act', 'Act'], ['observe', 'Observe']].map(function (s) {
            return '<li data-step="' + s[0] + '">' + s[1] + '</li>';
          }).join('') + '</ol>' +
        '<div class="wg-app" data-app>' +
          '<div class="card">' +
            '<header class="head"><span class="wiglet-mini" aria-hidden="true">' + MASCOT + '</span>' +
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
                '<label class="sr-only" for="wgd-input">Tell Wiglet what you want to do today</label>' +
                '<input id="wgd-input" type="text" placeholder="' + esc(d.placeholder) + '" maxlength="120" />' +
                '<button type="submit" class="send" aria-label="Send">&rarr;</button></form>' +
            '</footer>' +
          '</div>' +
        '</div>' +
        '<div class="wgd__side">' +
          '<p class="wgd__label">Try one</p>' +
          '<ul class="wgd__chips">' + d.chips.map(function (c) {
            return '<li><button type="button" class="wgd__chip" data-chip="' + esc(c) + '">' + esc(c) + '</button></li>';
          }).join('') + '</ul>' +
          '<p class="wgd__note">' + esc(d.flexNote) + '</p>' +
          '<p class="wgd__note" data-voice-note hidden>' + esc(d.voiceNote) + '</p>' +
        '</div>' +
        '<p class="sr-only" role="status" aria-live="polite" data-announce></p>' +
      '</div>' +
      '<div class="wgd__code" role="tabpanel" id="wgd-panel-code" aria-labelledby="wgd-tab-code" hidden>' +
        ['python', 'js'].map(function (k) {
          var title = k === 'python' ? 'wiglet/scheduler.py: the original' : 'js/wiglet/scheduler.js: the port running above';
          return '<div class="wgd__pane"><div class="wgd__bar"><span>' + title + '</span>' +
            '<button type="button" class="wgd__copy" data-copy="' + k + '">Copy</button></div>' +
            '<pre tabindex="0" aria-label="' + esc(title) + '"><code data-code="' + k + '"></code></pre></div>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function mount(root, d, env) {
    var reduce = env.reduceMotion;
    var S = window.WigletScheduler, Parser = window.WigletDemoParser;
    var cleanups = [], timers = [];
    function on(el, type, fn, opt) { el.addEventListener(type, fn, opt); cleanups.push(function () { el.removeEventListener(type, fn, opt); }); }
    function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }

    if (!document.querySelector('link[data-wgd-css]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = CSS;
      link.setAttribute('data-wgd-css', '');
      document.head.appendChild(link);
    }
    if (!S || !Parser) {
      root.querySelector('.wgd__try').innerHTML = '<p class="wgd__note">The demo could not load. Please reload the page.</p>';
      return { destroy: function () {} };
    }

    var app = root.querySelector('[data-app]');
    var mini = app.querySelector('.wiglet-mini');
    var timeline = app.querySelector('[data-timeline]');
    var unplacedEl = app.querySelector('[data-unplaced]');
    var summary = app.querySelector('[data-summary]');
    var heard = app.querySelector('[data-heard]');
    var input = app.querySelector('#wgd-input');
    var announce = root.querySelector('[data-announce]');
    var steps = root.querySelectorAll('.wgd__steps li');
    var understoodEl = app.querySelector('[data-understood]');
    var overlapEl = app.querySelector('[data-overlap]');
    var DAY_START = 8 * 60, DAY_END = 23 * 60;
    var COURSE_CODE = /\b[A-Z]{3,6}\d{1,4}/;   // server.py's rule for the "class" note

    function react(kind) {
      if (reduce) return;
      mini.classList.remove('is-bounce', 'is-tilt');
      void mini.offsetWidth;
      mini.classList.add(kind === 'tilt' ? 'is-tilt' : 'is-bounce');
    }

    // Tasks Wiglet places, and events the visitor put on the calendar.
    var state = { items: [], events: [], rubric: {}, nextId: 1 };
    var classes = d.fixed.map(function (f) { return S.fixedEvent(f.id, f.title, f.start, f.end, false); });
    function fixedNow() { return classes.concat(state.events); }

    function clock(minute) { var h = Math.floor(minute / 60) % 24, m = minute % 60; return (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m; }
    function durationText(mins) { var h = Math.floor(mins / 60), m = mins % 60; if (h && m) return h + ' hr ' + m + ' min'; if (h) return h + ' hr' + (h === 1 ? '' : 's'); return m + ' min'; }
    function openPhrase(mins) {
      if (!mins) return 'no open time left today';
      var h = Math.floor(mins / 60), m = mins % 60;
      if (h && m) return h + ' hr ' + m + ' min open today';
      if (h) return h + ' hr' + (h === 1 ? '' : 's') + ' open today';
      return m + ' min open today';
    }
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
        rows: rows,
        openMinutes: open.reduce(function (sum, s) { return sum + (s.end - s.start); }, 0),
        unplaced: plan.unplaced.map(function (u) { return { name: u.item.name, minutes: u.item.duration, largest: u.largestAvailable }; })
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

    function renderUnplaced(items) {
      if (!items.length) { unplacedEl.hidden = true; unplacedEl.replaceChildren(); return; }
      var head = document.createElement('strong');
      head.textContent = 'Didn’t fit today';
      var list = document.createElement('ul');
      items.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item.largest
          ? item.name + ': needs ' + item.minutes + ' min, biggest free block is ' + item.largest + ' min'
          : item.name + ': needs ' + item.minutes + ' min, no room left';
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
    function runLoop(done) {
      if (reduce) { done(); return; }
      var order = ['perceive', 'reason', 'act', 'observe'];
      order.forEach(function (name, i) {
        later(function () {
          Array.prototype.forEach.call(steps, function (s) {
            s.classList.toggle('is-on', s.getAttribute('data-step') === name);
            s.classList.toggle('is-done', order.indexOf(s.getAttribute('data-step')) < i);
          });
          if (name === 'act') done();
        }, i * 320);
      });
      later(function () {
        Array.prototype.forEach.call(steps, function (s) { s.classList.remove('is-on'); s.classList.add('is-done'); });
        later(function () { Array.prototype.forEach.call(steps, function (s) { s.classList.remove('is-done'); }); }, 900);
      }, order.length * 320);
    }

    function submit(text) {
      text = String(text || '').trim();
      if (!text) return;
      var parsed = Parser.parse(text, state.items);
      overlapEl.hidden = true;
      if (parsed.error || parsed.empty) {
        heard.textContent = '“' + text + '”';
        heard.hidden = false;
        understoodEl.textContent = parsed.error || 'The demo parser didn’t catch a task in that. Try one of the examples.';
        understoodEl.hidden = false;
        announce.textContent = understoodEl.textContent;
        react('tilt');
        return;
      }
      parsed.items.forEach(function (it) { state.items.push(S.flexibleItem('t' + (state.nextId++), it.name, it.duration, it)); });
      var overlaps = [];
      parsed.events.forEach(function (ev) {
        fixedNow().forEach(function (f) { if (ev.start < f.end && ev.end > f.start) overlaps.push(f.title); });
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

    on(app.querySelector('[data-composer]'), 'submit', function (e) { e.preventDefault(); submit(input.value); input.value = ''; });
    on(root.querySelector('.wgd__chips'), 'click', function (e) { var chip = e.target.closest('[data-chip]'); if (chip) submit(chip.getAttribute('data-chip')); });
    on(app.querySelector('[data-reset]'), 'click', function () {
      state.items = []; state.events = []; state.rubric = {};
      heard.hidden = true; understoodEl.hidden = true; overlapEl.hidden = true;
      draw(true, null);
      announce.textContent = 'Day reset to its three fixed blocks. ' + summary.textContent + '.';
    });

    // Voice, where the browser has speech recognition. Feeds the same parser.
    var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var mic = app.querySelector('[data-mic]');
    if (Recognition) {
      mic.hidden = false;
      root.querySelector('[data-voice-note]').hidden = false;
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
      cleanups.push(function () { if (rec) rec.abort(); });
    }

    // Tabs: Try it / See the real scheduler code.
    var tabList = root.querySelector('.wgd__tabs');
    var tabs = Array.prototype.slice.call(tabList.querySelectorAll('[role="tab"]'));
    var codeFilled = false;
    function selectTab(i, focus) {
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', String(k === i));
        t.tabIndex = k === i ? 0 : -1;
        root.querySelector('#' + t.getAttribute('aria-controls')).hidden = k !== i;
      });
      if (focus) tabs[i].focus();
      if (i === 1 && !codeFilled) {
        codeFilled = true;
        var sources = window.WigletSources || {};
        Array.prototype.forEach.call(root.querySelectorAll('[data-code]'), function (el) {
          var text = sources[el.getAttribute('data-code')];
          el.innerHTML = text ? highlight(text) : 'The source could not be loaded.';
        });
      }
      if (env.refresh) env.refresh();
    }
    on(tabList, 'click', function (e) { var t = e.target.closest('[role="tab"]'); if (t) selectTab(tabs.indexOf(t), false); });
    on(tabList, 'keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      var k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (i < 0 || k === undefined) return;
      e.preventDefault();
      selectTab((k + tabs.length) % tabs.length, true);
    });
    on(root, 'click', function (e) {
      var b = e.target.closest('[data-copy]');
      if (!b) return;
      var text = (window.WigletSources || {})[b.getAttribute('data-copy')];
      var done = function (ok) { b.textContent = ok ? 'Copied' : 'Copy failed'; later(function () { b.textContent = 'Copy'; }, 1800); };
      if (text && navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });

    draw(false, null);

    return {
      destroy: function () {
        timers.forEach(clearTimeout);
        cleanups.forEach(function (fn) { fn(); });
      }
    };
  }

  widgets.wigletDemo = { html: html, mount: mount };
})();
