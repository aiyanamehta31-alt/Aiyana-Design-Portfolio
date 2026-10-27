/* =====================================================================
   WIGLET · demo-parser.js
   DEMO ONLY. In the real Wiglet, Whisper turns speech into text and an
   LLM (gpt-oss-120b on Groq) turns text into structured items. Neither can
   run on a public portfolio page without an API key, so this small,
   rule-based parser stands in for them. It understands simple patterns
   only. The scheduling it feeds (js/wiglet/scheduler.js) is the real logic.

   It follows the rules in the agent's own prompt (wiglet/agent.py):
   - default durations: gym 60, workout 60, run 45, lunch 45, dinner 60,
     breakfast 30, coffee 30, call 30, errand 30, reading 45, study 90,
     assignment 120, project work 120; anything else 60
   - "after four" -> 16:00 to 23:00; "tonight" -> 18:00 to 23:00;
     "morning" -> 05:00 to 12:00; "at 1" -> 13:00 to 14:00
     ("afternoon" -> 12:00 to 17:00 is the demo's own addition)
   - a time with no am/pm takes the reading inside the 08:00-23:00 day,
     the earlier one if both fit: "at 7" is 19:00, "at 9" is 09:00
   - a preference is hard only when it involves another person or a
     booking ("coffee with Sam at 11"); "gym tonight" stays soft
   - "gym is priority one" ranks gym first; lower rank wins

   Times are minutes from midnight, as in scheduler.js.
   ===================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WigletDemoParser = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DAY_START = 8 * 60, DAY_END = 23 * 60;

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
  var SOCIAL = /\b(with|meeting|meet|call with|appointment|booking|booked|interview|date)\b/i;

  function num(word) {
    if (word == null) return null;
    var w = String(word).toLowerCase();
    if (Object.prototype.hasOwnProperty.call(NUMBER_WORDS, w)) return NUMBER_WORDS[w];
    var n = parseFloat(w);
    return isNaN(n) ? null : n;
  }

  // "7" -> 19:00, "9" -> 09:00, "11" -> 11:00; am/pm when given wins.
  function resolveHour(hour, minute, meridiem) {
    minute = minute || 0;
    if (meridiem) {
      var h = hour % 12 + (meridiem.toLowerCase() === 'pm' ? 12 : 0);
      return h * 60 + minute;
    }
    var options = [hour * 60 + minute];
    if (hour < 12) options.push((hour + 12) * 60 + minute);
    var inside = options.filter(function (t) { return t >= DAY_START && t < DAY_END; });
    return inside.length ? Math.min.apply(null, inside) : options[0];
  }

  var NUMBER = '(\\d+(?:\\.\\d+)?|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|an|a)';
  var CLOCK = '(\\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)(?::(\\d{2}))?\\s*(am|pm)?';

  // Phrases the parser understands, each taking its words out of the task name.
  var RULES = [
    { re: new RegExp('\\b(?:is\\s+)?(?:my\\s+)?top\\s+priority\\b', 'i'), apply: function (m, o) { o.rank = 1; } },
    { re: new RegExp('\\b(?:is\\s+)?(?:my\\s+)?(?:priority|prio)\\s*(?:#|number\\s*|no\\.?\\s*)?(\\d|one|two|three|four|five)\\b', 'i'), apply: function (m, o) { o.rank = num(m[1]); } },
    { re: new RegExp('\\b' + NUMBER + '\\s*(?:hours?|hrs?|h)\\b', 'i'), apply: function (m, o) { o.minutes = Math.round(num(m[1]) * 60); } },
    { re: new RegExp('\\b(\\d+|' + 'fifteen|twenty|thirty|forty five|forty-five|forty|fifty' + ')\\s*(?:minutes?|mins?|m)\\b', 'i'), apply: function (m, o) {
      var words = { fifteen: 15, twenty: 20, thirty: 30, 'forty five': 45, 'forty-five': 45, forty: 40, fifty: 50 };
      o.minutes = words[m[1].toLowerCase()] || parseInt(m[1], 10);
    } },
    { re: new RegExp('\\bat\\s+' + CLOCK, 'i'), apply: function (m, o) {
      var t = resolveHour(num(m[1]), m[2] ? parseInt(m[2], 10) : 0, m[3]);
      o.window = { start: t, end: t + 60 };
      o.label = m[0].trim();
      o.at = true;
    } },
    { re: new RegExp('\\bafter\\s+' + CLOCK, 'i'), apply: function (m, o) {
      var t = resolveHour(num(m[1]), m[2] ? parseInt(m[2], 10) : 0, m[3]);
      o.window = { start: t, end: DAY_END };
      o.label = m[0].trim();
    } },
    { re: /\b(tonight|this evening|in the evening|evening)\b/i, apply: function (m, o) { o.window = { start: 18 * 60, end: DAY_END }; o.label = m[0]; } },
    { re: /\b(?:this|in the)?\s*morning\b/i, apply: function (m, o) { o.window = { start: 5 * 60, end: 12 * 60 }; o.label = m[0].trim(); } },
    { re: /\b(?:this|in the)?\s*afternoon\b/i, apply: function (m, o) { o.window = { start: 12 * 60, end: 17 * 60 }; o.label = m[0].trim(); } }
  ];

  // Words that carry no task: "I want to", "please add", "today"...
  var FILLER = /\b(i|i'd|i'm|want|wanna|need|needs|have|has|got|would|like|please|add|also|let's|lets|can|you|could|schedule|plan|put|in|do|some|my|today|for|about|around|roughly|maybe|to|go|going|the|and|then|is|it|of|a|an|time)\b/gi;

  function kindOf(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < KINDS.length; i++) {
      for (var j = 0; j < KINDS[i].words.length; j++) {
        if (new RegExp('\\b' + KINDS[i].words[j] + '\\b').test(lower)) return KINDS[i];
      }
    }
    return null;
  }

  function clean(name) {
    return name.replace(FILLER, ' ').replace(/[^\w'’ -]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function parseClause(clause) {
    var o = { text: clause };
    var rest = clause;
    RULES.forEach(function (rule) {
      var m = rest.match(rule.re);
      if (m) {
        rule.apply(m, o);
        rest = rest.replace(m[0], ' ');
      }
    });
    var name = clean(rest);
    o.name = name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
    return o;
  }

  // One utterance -> { items: [...], rubric: { key: rank }, empty: bool }.
  // `existing` is the demo's current items, so "gym is priority one" can rank
  // something already on the plan instead of adding a second gym.
  function parse(text, existing) {
    existing = existing || [];
    var said = String(text || '')
      .replace(/\ban hour and a half\b/gi, '90 minutes')
      .replace(/\b(\d+) and a half hours?\b/gi, function (m, n) { return (parseInt(n, 10) + 0.5) + ' hours'; })
      .replace(/\bhalf an hour\b/gi, '30 minutes')
      .replace(/\ba couple of hours\b/gi, '2 hours');

    var clauses = said.split(/\s*[,;]\s*|\s+and then\s+|\s+then\s+|\s+and\s+(?!a half)/i).filter(Boolean);
    var items = [];
    var rubric = {};

    clauses.forEach(function (clause) {
      var o = parseClause(clause);
      var last = items[items.length - 1];

      // A clause with no task of its own adds to the one before it:
      // "gym for an hour, priority one" / "essay homework, 1 hour".
      if (!o.name) {
        if (last) {
          if (o.minutes) last.duration = o.minutes;
          if (o.window) { last.preferredWindow = o.window; last.preferenceLabel = o.label; last.preferenceIsHard = !!(o.at && SOCIAL.test(last.name)); }
          if (o.rank) rubric[last.rubricKey] = o.rank;
        }
        return;
      }

      var kind = kindOf(o.name);
      var key = kind ? kind.key : o.name.toLowerCase().split(' ')[0];

      // "gym is priority one": a ranking for something already planned.
      var known = existing.some(function (it) { return it.rubricKey === key || it.name.toLowerCase() === o.name.toLowerCase(); });
      if (o.rank && known && !o.minutes && !o.window) {
        rubric[key] = o.rank;
        return;
      }

      items.push({
        name: o.name,
        rubricKey: key,
        duration: o.minutes || (kind ? kind.minutes : DEFAULT_MINUTES),
        preferredWindow: o.window || null,
        preferenceLabel: o.label || '',
        preferenceIsHard: !!(o.window && o.at && SOCIAL.test(clause))
      });
      if (o.rank) rubric[key] = o.rank;
    });

    return { items: items, rubric: rubric, empty: !items.length && !Object.keys(rubric).length };
  }

  return { parse: parse, resolveHour: resolveHour, DAY_START: DAY_START, DAY_END: DAY_END };
});
