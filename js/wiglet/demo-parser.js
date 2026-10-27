/* =====================================================================
   WIGLET · demo-parser.js
   DEMO ONLY. In the real Wiglet, Whisper turns speech into text and an
   LLM (gpt-oss-120b on Groq) turns text into structured items. Neither can
   run on a public portfolio page without an API key, so this small,
   rule-based parser stands in for them. It understands simple patterns
   only. The scheduling it feeds (js/wiglet/scheduler.js) is the real logic.

   It follows the rules in the agent's own prompt (wiglet/agent.py):
   - Two kinds of thing. An EVENT is a clear request to put something on
     the calendar ("add … to my calendar/schedule", "put … on my calendar",
     "book …", "schedule … for …", "create an event"); it is written at the
     stated time and then locked like a class. Everything else is a TASK,
     which Wiglet places in a gap. "gym at 6" on its own is a task with a
     preference, not an event. (Demo addition: with no real calendar, a
     stated time RANGE for a meeting, call, appointment, class or anything
     "with" someone is also treated as an event: "I have a meeting 5-6".)
   - An event with a start but no end takes its length from the duration
     table; failing that, one hour. An event with no readable time is never
     guessed at.
   - Default durations: gym 60, workout 60, run 45, lunch 45, dinner 60,
     breakfast 30, coffee 30, call 30, errand 30, reading 45, study 90,
     assignment 120, project work 120; anything else 60.
   - Times with no am/pm take the reading inside the 08:00-23:00 day, the
     earlier one if both fit: "7" is 19:00, "9" is 09:00, "5-6" is 17:00-18:00.
     An am/pm written once in a range applies to both ends.
   - "after four" -> 16:00 to 23:00; "tonight" -> 18:00 to 23:00;
     "morning" -> 05:00 to 12:00; "at 1" -> 13:00 to 14:00; "noon" is 12:00.
     ("afternoon" -> 12:00 to 17:00 is the demo's own addition.)
   - A task's preference is hard only when it involves another person or a
     booking ("coffee with Sam at 11"); "gym tonight" stays soft.
   - "gym is priority one" ranks gym first; lower rank wins.

   Times are minutes from midnight, as in scheduler.js.
   ===================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WigletDemoParser = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DAY_START = 8 * 60, DAY_END = 23 * 60;
  var TIME_HELP = 'I couldn’t catch the time. Try something like “5–6pm meeting”.';

  // The agent prompt's duration table, keyed by the words that mean each.
  var KINDS = [
    { key: 'gym', words: ['gym'], minutes: 60 },
    { key: 'workout', words: ['workout', 'work out', 'exercise'], minutes: 60 },
    { key: 'run', words: ['run', 'running', 'jog'], minutes: 45 },
    { key: 'lunch', words: ['lunch'], minutes: 45 },
    { key: 'dinner', words: ['dinner'], minutes: 60 },
    { key: 'breakfast', words: ['breakfast'], minutes: 30 },
    { key: 'coffee', words: ['coffee'], minutes: 30 },
    { key: 'call', words: ['call', 'phone'], minutes: 30 },
    { key: 'errand', words: ['errand', 'errands', 'groceries', 'shopping'], minutes: 30 },
    { key: 'reading', words: ['read', 'reading'], minutes: 45 },
    { key: 'study', words: ['study', 'studying', 'revise', 'revision'], minutes: 90 },
    { key: 'assignment', words: ['assignment'], minutes: 120 },
    { key: 'project', words: ['project'], minutes: 120 }
  ];
  var DEFAULT_MINUTES = 60;

  var NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, a: 1, an: 1 };
  var HOUR_WORDS = 'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve';
  // Someone else involved, or a booking: what makes a task's time hard,
  // and (with a stated range) what makes it an event in this demo.
  var SOCIAL = /\b(with|meeting|meet|call|appointment|booking|booked|interview|class|lecture|seminar|date)\b/i;
  // A clear request to write to the calendar.
  var EVENT_REQUEST = /\b(add|put)\b[^.]*\b(calendar|schedule)\b|\bbook\b|\bschedule\b[^.]*\b(for|at)\b|\bcreate (an |a )?event\b|\bon my (calendar|schedule)\b/i;

  function num(word) {
    if (word == null) return null;
    var w = String(word).toLowerCase();
    if (Object.prototype.hasOwnProperty.call(NUMBER_WORDS, w)) return NUMBER_WORDS[w];
    var n = parseFloat(w);
    return isNaN(n) ? null : n;
  }

  // One time of day. With am/pm, that reading; with a 24-hour hour (13+),
  // as written; otherwise the reading inside the day, the earlier one if both fit.
  function resolveHour(hour, minute, meridiem) {
    minute = minute || 0;
    if (meridiem) {
      var h = hour % 12 + (meridiem.toLowerCase() === 'pm' ? 12 : 0);
      return h * 60 + minute;
    }
    if (hour >= 13) return hour * 60 + minute;
    var options = [hour * 60 + minute];
    if (hour < 12) options.push((hour + 12) * 60 + minute);
    var inside = options.filter(function (t) { return t >= DAY_START && t < DAY_END; });
    return inside.length ? Math.min.apply(null, inside) : options[0];
  }

  // A range "A-B". An am/pm written once applies to both ends (unless that
  // would put the start after the end: "11-1pm" is 11:00-13:00).
  function resolveRange(h1, m1, ap1, h2, m2, ap2) {
    var end, start;
    if (ap2 || ap1) {
      end = resolveHour(h2, m2, ap2 || ap1);
      if (ap1) start = resolveHour(h1, m1, ap1);
      else {
        start = resolveHour(h1, m1, ap2);
        if (start >= end) start = resolveHour(h1, m1, ap2 === 'pm' ? 'am' : 'pm');
      }
      if (!ap2 && end <= start) end += 12 * 60;
      return { start: start, end: end };
    }
    if (h1 >= 13 || h2 >= 13) {
      start = h1 * 60 + (m1 || 0);
      end = h2 * 60 + (m2 || 0);
      if (end <= start && h2 < 12) end += 12 * 60;
      return { start: start, end: end };
    }
    // No am/pm: the reading inside the day, earliest first, with the end after the start.
    var starts = [h1 * 60 + (m1 || 0)];
    if (h1 < 12) starts.push((h1 + 12) * 60 + (m1 || 0));
    var best = null;
    starts.sort(function (a, b) { return a - b; }).forEach(function (s) {
      if (best || s < DAY_START || s >= DAY_END) return;
      var ends = [h2 * 60 + (m2 || 0), (h2 + 12) * 60 + (m2 || 0)].filter(function (e) { return e > s; });
      if (ends.length) best = { start: s, end: Math.min.apply(null, ends) };
    });
    if (best) return best;
    start = resolveHour(h1, m1, null);
    end = resolveHour(h2, m2, null);
    if (end <= start) end += 12 * 60;
    return { start: start, end: end };
  }

  /* ---------- Reading times out of a sentence ---------- */

  var H = '(\\d{1,2}|' + HOUR_WORDS + ')';
  var MIN = '(?::(\\d{2}))?';
  var AP = '\\s*(am|pm)?';
  var RANGE = new RegExp('\\b(?:from\\s+|between\\s+)?' + H + MIN + AP + '\\s*(?:-|to|until|till|and)\\s*' + H + MIN + AP + '\\b', 'i');

  function hourOf(token) { var n = num(token); return n == null ? null : n; }

  // Pulls the first time range out of `text`: { range, rest } or null.
  function takeRange(text) {
    var m = text.match(RANGE);
    if (!m) return null;
    // "between 5 and 6" needs "between"; a bare "5 and 6" is not a range.
    if (/\band\b/i.test(m[0]) && !/^between\b/i.test(m[0])) return null;
    // "2 to 3 hours" is a duration, not a time.
    if (/^\s*(hours?|hrs?|minutes?|mins?)\b/i.test(text.slice(m.index + m[0].length))) return null;
    // groups: 1 start hour, 2 start minutes, 3 start am/pm, 4 end hour, 5 end minutes, 6 end am/pm
    var h1 = hourOf(m[1]), h2 = hourOf(m[4]);
    if (h1 == null || h2 == null || h1 > 23 || h2 > 24) return null;
    var m1 = m[2] ? parseInt(m[2], 10) : 0, m2 = m[5] ? parseInt(m[5], 10) : 0;
    if (m1 > 59 || m2 > 59) return null;
    return { range: resolveRange(h1, m1, (m[3] || '').toLowerCase(), h2, m2, (m[6] || '').toLowerCase()), label: m[0].trim(), rest: text.replace(m[0], ' ') };
  }

  // Duration, priority and time-preference phrases, each taken out of the title.
  var NUMBER = '(\\d+(?:\\.\\d+)?|' + HOUR_WORDS + '|an|a)';
  var CLOCK = H + MIN + AP;
  var RULES = [
    { re: /\b(?:is\s+)?(?:my\s+)?top\s+priority\b/i, apply: function (m, o) { o.rank = 1; } },
    { re: /\b(?:is\s+)?(?:my\s+)?(?:priority|prio)\s*(?:#|number\s*|no\.?\s*)?(\d|one|two|three|four|five)\b/i, apply: function (m, o) { o.rank = num(m[1]); } },
    { re: new RegExp('\\b' + NUMBER + '\\s*(?:-\\s*)?(?:hours?|hrs?|h)\\b', 'i'), apply: function (m, o) { o.minutes = Math.round(num(m[1]) * 60); } },
    { re: /\b(\d+|fifteen|twenty|thirty|forty five|forty-five|forty|fifty)\s*(?:minutes?|mins?|m)\b/i, apply: function (m, o) {
      var words = { fifteen: 15, twenty: 20, thirty: 30, 'forty five': 45, 'forty-five': 45, forty: 40, fifty: 50 };
      o.minutes = words[m[1].toLowerCase()] || parseInt(m[1], 10);
    } },
    { re: /\b(?:at|for)\s+noon\b|\bnoon\b/i, apply: function (m, o) { o.at = 12 * 60; o.label = m[0].trim(); } },
    { re: new RegExp('\\bafter\\s+' + CLOCK, 'i'), apply: function (m, o) {
      o.window = { start: resolveHour(num(m[1]), m[2] ? parseInt(m[2], 10) : 0, m[3]), end: DAY_END };
      o.label = m[0].trim();
    } },
    { re: new RegExp('\\b(?:at|for)\\s+' + CLOCK + '(?!\\s*(?:hours?|hrs?|minutes?|mins?)\\b)', 'i'), apply: function (m, o) {
      if (/^for\b/i.test(m[0]) && !m[3]) return false;   // "for 2" without am/pm is not a time
      o.at = resolveHour(num(m[1]), m[2] ? parseInt(m[2], 10) : 0, m[3]);
      o.label = m[0].trim();
    } },
    { re: /\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i, apply: function (m, o) {
      o.at = resolveHour(parseInt(m[1], 10), m[2] ? parseInt(m[2], 10) : 0, m[3]);
      o.label = m[0].trim();
    } },
    { re: /\b(tonight|this evening|in the evening|evening)\b/i, apply: function (m, o) { o.window = { start: 18 * 60, end: DAY_END }; o.label = m[0]; } },
    { re: /\b(?:this|in the)?\s*morning\b/i, apply: function (m, o) { o.window = { start: 5 * 60, end: 12 * 60 }; o.label = m[0].trim(); } },
    { re: /\b(?:this|in the)?\s*afternoon\b/i, apply: function (m, o) { o.window = { start: 12 * 60, end: 17 * 60 }; o.label = m[0].trim(); } }
  ];

  // What still looks like a time after everything readable has been taken
  // out. If any is left, the time was there but unreadable: never guess.
  var LEFTOVER_TIME = /\b\d{1,2}(?::\d{2})?\s*(am|pm|o'?clock)\b|\b\d{1,2}:\d{2}\b|\b(at|from|between|until|till)\s+(\d|half|quarter|noonish)|\b(half past|quarter past|quarter to|o'?clock)\b|\d\s*[-–]\s*\d/i;

  /* ---------- Titles ---------- */

  // Instruction phrases, typos fixed first.
  function fixTypos(text) {
    return text
      .replace(/\b(shedule|schedual|scedule|schedle|shedual|schedul)\b/gi, 'schedule')
      .replace(/\b(calender|calandar|calendr|calander)\b/gi, 'calendar')
      .replace(/[–—]/g, '-')
      .replace(/\b(\d{1,2})\s*p\.m\.?/gi, '$1pm').replace(/\b(\d{1,2})\s*a\.m\.?/gi, '$1am');
  }
  var INSTRUCTIONS = [
    /\b(?:please\s+)?(?:can|could|would) you\b/gi,
    /\b(?:add|put|write)\s+(?:that|this|it)?\s*(?:in|on|to|into)\s+(?:my|the)\s+(?:calendar|schedule)\b/gi,
    /\b(?:on|to|in|into)\s+(?:my|the)\s+(?:calendar|schedule)\b/gi,
    /\bcreate\s+(?:an?\s+)?event(?:\s+for)?\b/gi,
    /\b(?:i\s+have|i've\s+got|i\s+got|there\s+is|there's)\s+(?:an?\s+)?/gi,
    /\b(?:add|put|book|schedule|plan)\b/gi,
    /\b(?:please|today|also)\b/gi
  ];
  var LEADING = /^(?:(?:i|i'd|i'm|want|wanna|need|to|would|like|do|go|going|some|a|an|the|for|and|then|is|it|my|that|this)\s+)+/i;
  var TRAILING = /(?:\s+(?:for|to|and|then|it|that|this|the|a|an|my|in|on|at|some|is))+$/i;

  function cleanTitle(text) {
    var t = text;
    INSTRUCTIONS.forEach(function (re) { t = t.replace(re, ' '); });
    t = t.replace(/[^\w'’ -]/g, ' ').replace(/\s+-\s+|^\s*-|-\s*$/g, ' ').replace(/\s+/g, ' ').trim();
    var before;
    do { before = t; t = t.replace(LEADING, '').replace(TRAILING, '').trim(); } while (t !== before);
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : '';
  }

  function kindOf(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < KINDS.length; i++) {
      for (var j = 0; j < KINDS[i].words.length; j++) {
        if (new RegExp('\\b' + KINDS[i].words[j] + '\\b').test(lower)) return KINDS[i];
      }
    }
    return null;
  }

  /* ---------- What was understood, in words ---------- */

  function clock(minute, withMeridiem) {
    var h = Math.floor(minute / 60) % 24, m = minute % 60;
    var s = (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m;
    return withMeridiem ? s + ' ' + (h < 12 ? 'am' : 'pm') : s;
  }
  function span(start, end) {
    var same = (Math.floor(start / 60) % 24 < 12) === (Math.floor(end / 60) % 24 < 12);
    return same ? clock(start) + '–' + clock(end, true) : clock(start, true) + '–' + clock(end, true);
  }
  function minutesText(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    if (h && m) return h + ' hr ' + m + ' min';
    if (h) return h + ' hr' + (h === 1 ? '' : 's');
    return m + ' min';
  }

  /* ---------- One clause ---------- */

  function parseClause(clause, wholeSentence) {
    var o = { text: clause };
    var rest = clause;

    var r = takeRange(rest);
    if (r) { o.range = r.range; o.label = r.label; rest = r.rest; }

    RULES.forEach(function (rule) {
      var m = rest.match(rule.re);
      if (m && rule.apply(m, o) !== false) rest = rest.replace(m[0], ' ');
    });

    o.unreadable = LEFTOVER_TIME.test(rest);
    o.name = cleanTitle(rest);
    o.request = EVENT_REQUEST.test(wholeSentence);
    return o;
  }

  /* ---------- One utterance ---------- */

  // -> { items, events, rubric, understood, error, empty }
  // `existing` is the demo's current tasks, so "gym is priority one" can rank
  // something already on the plan instead of adding a second gym.
  function parse(text, existing) {
    existing = existing || [];
    var said = fixTypos(String(text || ''))
      .replace(/\ban hour and a half\b/gi, '90 minutes')
      .replace(/\b(\d+) and a half hours?\b/gi, function (m, n) { return (parseInt(n, 10) + 0.5) + ' hours'; })
      .replace(/\bhalf an hour\b/gi, '30 minutes')
      .replace(/\ba couple of hours\b/gi, '2 hours')
      // keep "between 5 and 6" together through the split on "and"
      .replace(/\bbetween\s+(\S+)\s+and\s+(\S+)/gi, 'from $1 to $2');

    var clauses = said.split(/\s*[,;]\s*|\s+and then\s+|\s+then\s+|\s+and\s+(?!a half)/i).filter(Boolean);
    var out = { items: [], events: [], rubric: {}, understood: [], error: '', empty: false };

    for (var c = 0; c < clauses.length; c++) {
      var o = parseClause(clauses[c], said);
      var last = out.items[out.items.length - 1];

      if (o.unreadable) {
        out = { items: [], events: [], rubric: {}, understood: [], error: TIME_HELP, empty: false };
        return out;
      }

      // A clause with no task of its own adds to the one before it:
      // "gym for an hour, priority one" / "essay homework, 1 hour".
      if (!o.name) {
        if (last) {
          if (o.minutes) last.duration = o.minutes;
          if (o.window) { last.preferredWindow = o.window; last.preferenceLabel = o.label; }
          if (o.at != null) { last.preferredWindow = { start: o.at, end: o.at + 60 }; last.preferenceLabel = o.label; last.preferenceIsHard = SOCIAL.test(last.name); }
          if (o.rank) out.rubric[last.rubricKey] = o.rank;
        }
        continue;
      }

      var kind = kindOf(o.name);
      var key = kind ? kind.key : o.name.toLowerCase().split(' ')[0];
      var length = o.minutes || (kind ? kind.minutes : DEFAULT_MINUTES);

      // An event: a calendar request, or (demo) a range for something social.
      var isEvent = o.request || (o.range && SOCIAL.test(clauses[c]));
      if (isEvent) {
        var start = o.range ? o.range.start : o.at;
        if (start == null) { return { items: [], events: [], rubric: {}, understood: [], error: TIME_HELP, empty: false }; }
        var end = o.range ? o.range.end : start + length;
        out.events.push({ title: o.name, start: start, end: end });
        out.understood.push(o.name + ' · ' + span(start, end) + ' · added to calendar' +
          (start < DAY_START || end > DAY_END ? ' · outside the hours shown here' : ''));
        continue;
      }

      // "gym is priority one": a ranking for something already planned.
      var known = existing.some(function (it) { return it.rubricKey === key || it.name.toLowerCase() === o.name.toLowerCase(); });
      if (o.rank && known && !o.minutes && !o.window && o.at == null && !o.range) {
        out.rubric[key] = o.rank;
        out.understood.push(o.name + ' · priority #' + o.rank);
        continue;
      }

      var item = {
        name: o.name,
        rubricKey: key,
        duration: length,
        preferredWindow: null,
        preferenceLabel: '',
        preferenceIsHard: false
      };
      if (o.range) {
        // A range for a task: that's the window; its length is the default length.
        item.preferredWindow = o.range;
        item.preferenceLabel = o.label;
        if (!o.minutes) item.duration = o.range.end - o.range.start;
      } else if (o.at != null) {
        item.preferredWindow = { start: o.at, end: o.at + 60 };
        item.preferenceLabel = o.label;
        item.preferenceIsHard = SOCIAL.test(clauses[c]);
      } else if (o.window) {
        item.preferredWindow = o.window;
        item.preferenceLabel = o.label;
      }
      out.items.push(item);
      if (o.rank) out.rubric[key] = o.rank;
    }

    // Describe the tasks after the whole sentence is read (later clauses add to them).
    out.items.forEach(function (it) {
      var bits = [it.name, minutesText(it.duration), 'flexible'];
      if (it.preferenceLabel) bits.push(it.preferenceLabel + (it.preferenceIsHard ? ' (fixed time)' : ''));
      if (out.rubric[it.rubricKey]) bits.push('priority #' + out.rubric[it.rubricKey]);
      out.understood.push(bits.join(' · '));
    });
    // A ranking said in a separate clause about an existing task.
    Object.keys(out.rubric).forEach(function (k) {
      if (!out.items.some(function (it) { return it.rubricKey === k; }) &&
          !out.understood.some(function (u) { return u.toLowerCase().indexOf(k) === 0; })) {
        out.understood.push(k.charAt(0).toUpperCase() + k.slice(1) + ' · priority #' + out.rubric[k]);
      }
    });

    out.empty = !out.items.length && !out.events.length && !Object.keys(out.rubric).length;
    return out;
  }

  return { parse: parse, resolveHour: resolveHour, resolveRange: resolveRange, TIME_HELP: TIME_HELP, DAY_START: DAY_START, DAY_END: DAY_END };
});
