/* =====================================================================
   WIGLET · scheduler.js
   A faithful JavaScript port of Wiglet's scheduling core:
   wiglet/scheduler.py and the parts of wiglet/models.py it needs.

   The one change: time is a number of minutes from the start of the
   demo's day (09:30 is 570; 01:00 the next morning is 1500), instead of
   timezone-aware datetimes. The demo only ever plans one day, so time
   zones never come into it. Everything else (merging, padding, the
   placement order, earliest fit, soft and hard preferences, the unplaced
   reasons, open time and its wording) follows the Python line by line.

   Pure: no clock, no network, no DOM. Loads as a classic script in the
   page (window.WigletScheduler) and as a CommonJS module in Node, where
   js/wiglet/scheduler.test.js runs the ported tests.
   ===================================================================== */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WigletScheduler = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- models.py ---------- */

  // PlannerConfig defaults: 10 min buffer, 15 min smallest usable gap,
  // 30 min smallest open slot worth announcing.
  var DEFAULT_CONFIG = Object.freeze({ buffer: 10, minUsableGap: 15, minOpenSlot: 30 });

  var BlockKind = Object.freeze({ FIXED: 'fixed', FLEXIBLE: 'flexible' });

  var UnplacedReason = Object.freeze({
    NO_ROOM: 'no_room',
    TOO_LONG_FOR_ANY_GAP: 'too_long_for_any_gap',
    PREFERENCE_UNSATISFIABLE: 'preference_unsatisfiable',
    DURATION_EXCEEDS_DAY: 'duration_exceeds_day'
  });

  // A FixedEvent: an immovable anchor. Never moved, never resized.
  function fixedEvent(id, title, start, end, isAllDay) {
    return { id: id, title: title, start: start, end: end, isAllDay: !!isAllDay };
  }

  // A FlexibleItem: something the user asked for, to be slotted into a gap.
  // duration is in minutes; preferredWindow is { start, end } or null.
  function flexibleItem(id, name, duration, opts) {
    opts = opts || {};
    return {
      id: id,
      name: name,
      duration: duration,
      rubricKey: opts.rubricKey || '',
      preferredWindow: opts.preferredWindow || null,
      preferenceLabel: opts.preferenceLabel || '',
      preferenceIsHard: !!opts.preferenceIsHard
    };
  }

  function priorityKey(item) {
    return (item.rubricKey || item.name).trim().toLowerCase();
  }

  // The priority ordering, stated once per session. Lower number wins.
  function rubric(order, defaultPriority) {
    return { order: order || {}, defaultPriority: defaultPriority == null ? 1000 : defaultPriority };
  }
  function priorityOf(r, item) {
    var key = priorityKey(item);
    return Object.prototype.hasOwnProperty.call(r.order, key) ? r.order[key] : r.defaultPriority;
  }

  // A Gap: a stretch of unclaimed time. The pad flags say which edges touch
  // something busy rather than the edge of the day.
  function gap(start, end, padBefore, padAfter) {
    return { start: start, end: end, padBefore: !!padBefore, padAfter: !!padAfter };
  }
  function gapDuration(g) { return g.end - g.start; }
  function usableSpan(g, buffer) {
    return [g.padBefore ? g.start + buffer : g.start, g.padAfter ? g.end - buffer : g.end];
  }
  function usableDuration(g, buffer) {
    var s = usableSpan(g, buffer);
    return Math.max(s[1] - s[0], 0);
  }

  /* ---------- Validation ---------- */

  function validateBounds(dayStart, dayEnd) {
    if (!(dayEnd > dayStart)) throw new Error('day_end must be after day_start');
  }

  /* ---------- Gap geometry ---------- */

  // Collapse overlapping and touching intervals into their union.
  function merge(intervals) {
    var ordered = intervals.slice().sort(function (a, b) { return a[0] - b[0]; });
    var merged = [];
    ordered.forEach(function (pair) {
      var start = pair[0], end = pair[1];
      if (merged.length && start <= merged[merged.length - 1][1]) {
        var prev = merged[merged.length - 1];
        merged[merged.length - 1] = [prev[0], Math.max(prev[1], end)];
      } else {
        merged.push([start, end]);
      }
    });
    return merged;
  }

  // Turn busy intervals into the free ones between them.
  function invert(busy, dayStart, dayEnd) {
    var gaps = [];
    var cursor = dayStart;
    var afterBusy = false;
    merge(busy).forEach(function (pair) {
      var start = pair[0], end = pair[1];
      if (start > cursor) gaps.push(gap(cursor, start, afterBusy, true));
      cursor = Math.max(cursor, end);
      afterBusy = true;
    });
    if (cursor < dayEnd) gaps.push(gap(cursor, dayEnd, afterBusy, false));
    return gaps;
  }

  // Clip timed events to the day and drop the ones that claim no time.
  function busySpans(events, dayStart, dayEnd) {
    var spans = [];
    events.forEach(function (event) {
      if (event.end < event.start) throw new Error('event ' + event.id + ' ends before it starts');
      if (event.end <= event.start) return;                          // zero-length event blocks nothing
      if (event.end <= dayStart || event.start >= dayEnd) return;    // entirely outside the planning day
      spans.push([Math.max(event.start, dayStart), Math.min(event.end, dayEnd)]);
    });
    return spans;
  }

  // Free intervals inside [dayStart, dayEnd], in chronological order.
  // All-day events are ignored: a note, not a commitment.
  function computeGaps(fixedEvents, dayStart, dayEnd) {
    validateBounds(dayStart, dayEnd);
    var timed = fixedEvents.filter(function (e) { return !e.isAllDay; });
    return invert(busySpans(timed, dayStart, dayEnd), dayStart, dayEnd);
  }

  // Drop time that has already passed.
  function trimBefore(gaps, now) {
    var trimmed = [];
    gaps.forEach(function (g) {
      if (g.end <= now) return;
      if (g.start < now) trimmed.push(gap(now, g.end, false, g.padAfter));
      else trimmed.push(g);
    });
    return trimmed;
  }

  /* ---------- Placement ---------- */

  function cmp(a, b) { return a < b ? -1 : a > b ? 1 : 0; }

  // Rubric order first; longest first within a tier; then name and id.
  function placementOrder(items, r) {
    return items.slice().sort(function (a, b) {
      return cmp(priorityOf(r, a), priorityOf(r, b)) ||
        cmp(-a.duration, -b.duration) ||
        cmp(a.name, b.name) ||
        cmp(a.id, b.id);
    });
  }

  function largestUsable(gaps, config) {
    if (!gaps.length) return 0;
    return Math.max.apply(null, gaps.map(function (g) { return usableDuration(g, config.buffer); }));
  }

  // Replace the gap at `index` with whatever is left of it either side.
  function consume(free, index, start, end) {
    var g = free[index];
    var remainders = [];
    if (start > g.start) remainders.push(gap(g.start, start, g.padBefore, true));
    if (end < g.end) remainders.push(gap(end, g.end, true, g.padAfter));
    return free.slice(0, index).concat(remainders, free.slice(index + 1));
  }

  // First fit: the earliest slot the item fits in. Null if there is none.
  function tryPlace(item, free, config, window, preferenceSatisfied) {
    for (var index = 0; index < free.length; index++) {
      var span = usableSpan(free[index], config.buffer);
      var start = span[0], end = span[1];
      if (window) {
        start = Math.max(start, window.start);
        end = Math.min(end, window.end);
      }
      if (end - start >= item.duration) {
        var finish = start + item.duration;
        var block = {
          sourceId: item.id,
          name: item.name,
          start: start,
          end: finish,
          kind: BlockKind.FLEXIBLE,
          preferenceSatisfied: preferenceSatisfied
        };
        return { block: block, free: consume(free, index, start, finish) };
      }
    }
    return null;
  }

  // Why didn't this fit: was there never room, or did someone else take it?
  function diagnose(item, original, config) {
    if (item.duration > largestUsable(original, config)) return UnplacedReason.TOO_LONG_FOR_ANY_GAP;
    return UnplacedReason.NO_ROOM;
  }

  function unplacedItem(item, reason, largestAvailable) {
    return { item: item, reason: reason, largestAvailable: largestAvailable || 0 };
  }

  // Build the day: fixed events as anchors, flexible items greedily around them.
  function planDay(args) {
    var fixedEvents = args.fixedEvents || [];
    var flexibleItems = args.flexibleItems || [];
    var r = args.rubric || rubric();
    var dayStart = args.dayStart, dayEnd = args.dayEnd;
    var config = args.config || DEFAULT_CONFIG;
    var now = args.now == null ? null : args.now;

    validateBounds(dayStart, dayEnd);

    var allDay = fixedEvents.filter(function (e) { return e.isAllDay; });
    var timed = fixedEvents.filter(function (e) { return !e.isAllDay; });

    var gaps = computeGaps(timed, dayStart, dayEnd);
    if (now !== null) gaps = trimBefore(gaps, now);

    var original = gaps.filter(function (g) { return usableDuration(g, config.buffer) >= config.minUsableGap; });
    var free = original.slice();

    var placed = [];
    var unplaced = [];
    var dayLength = dayEnd - dayStart;

    placementOrder(flexibleItems, r).forEach(function (item) {
      if (item.duration <= 0) return;
      if (item.duration > dayLength) {
        unplaced.push(unplacedItem(item, UnplacedReason.DURATION_EXCEEDS_DAY));
        return;
      }

      var attempt = null;
      if (item.preferredWindow) {
        attempt = tryPlace(item, free, config, item.preferredWindow, true);
      }

      if (attempt === null) {
        if (item.preferredWindow && item.preferenceIsHard) {
          unplaced.push(unplacedItem(item, UnplacedReason.PREFERENCE_UNSATISFIABLE, largestUsable(free, config)));
          return;
        }
        // Soft preference: better to schedule it at the wrong time and say so
        // than to drop it silently.
        attempt = tryPlace(item, free, config, null, !item.preferredWindow);
      }

      if (attempt === null) {
        unplaced.push(unplacedItem(item, diagnose(item, original, config), largestUsable(free, config)));
        return;
      }

      free = attempt.free;
      placed.push(attempt.block);
    });

    var fixedBlocks = timed
      .filter(function (e) { return e.end > dayStart && e.start < dayEnd && e.end > e.start; })
      .map(function (e) {
        return {
          sourceId: e.id,
          name: e.title,
          start: Math.max(e.start, dayStart),
          end: Math.min(e.end, dayEnd),
          kind: BlockKind.FIXED,
          preferenceSatisfied: true
        };
      });

    var blocks = placed.concat(fixedBlocks).sort(function (a, b) {
      return cmp(a.start, b.start) || cmp(a.kind, b.kind) || cmp(a.sourceId, b.sourceId);
    });
    var unplacedSorted = unplaced.slice().sort(function (a, b) {
      return cmp(priorityOf(r, a.item), priorityOf(r, b.item)) || cmp(a.item.name, b.item.name) || cmp(a.item.id, b.item.id);
    });

    return {
      dayStart: dayStart,
      dayEnd: dayEnd,
      blocks: blocks,
      unplaced: unplacedSorted,
      rubric: r,
      config: config,
      allDayEvents: allDay
    };
  }

  /* ---------- Open time ---------- */

  // Label a moment the way a person would say it out loud.
  function partOfDay(minute) {
    var hour = Math.floor(minute / 60) % 24;
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'tonight';
  }

  // Describe a span in round numbers, always rounding *down*.
  function durationPhrase(span) {
    var minutes = Math.floor(Math.floor(span) / 15) * 15;
    if (minutes < 60) return minutes + ' min';
    var hours = Math.floor(minutes / 60), remainder = minutes % 60;
    var unit = hours === 1 ? 'hr' : 'hrs';
    if (remainder === 0) return hours + ' ' + unit;
    if (remainder === 30) return hours + '.5 hrs';
    return hours + ' ' + unit + ' ' + remainder + ' min';
  }

  // Time that is still unclaimed and worth mentioning, in chronological order.
  function findOpenTime(plan, minLength, now) {
    var threshold = minLength != null ? minLength : plan.config.minOpenSlot;
    var busy = plan.blocks.map(function (b) { return [b.start, b.end]; });
    var gaps = invert(busy, plan.dayStart, plan.dayEnd);
    if (now != null) gaps = trimBefore(gaps, now);

    var slots = [];
    gaps.forEach(function (g) {
      var span = usableSpan(g, plan.config.buffer);
      var length = span[1] - span[0];
      if (length < threshold) return;
      var part = partOfDay(span[0]);
      var article = part === 'tonight' ? '' : 'this ';
      slots.push({
        start: span[0],
        end: span[1],
        partOfDay: part,
        phrase: durationPhrase(length) + ' free ' + article + part
      });
    });
    return slots;
  }

  // The one slot worth a proactive nudge: longest, earliest on a tie.
  function bestOpenSlot(slots) {
    if (!slots.length) return null;
    return slots.slice().sort(function (a, b) {
      return cmp(-(a.end - a.start), -(b.end - b.start)) || cmp(a.start, b.start);
    })[0];
  }

  return {
    DEFAULT_CONFIG: DEFAULT_CONFIG,
    BlockKind: BlockKind,
    UnplacedReason: UnplacedReason,
    fixedEvent: fixedEvent,
    flexibleItem: flexibleItem,
    rubric: rubric,
    priorityOf: priorityOf,
    gap: gap,
    gapDuration: gapDuration,
    usableSpan: usableSpan,
    usableDuration: usableDuration,
    computeGaps: computeGaps,
    planDay: planDay,
    findOpenTime: findOpenTime,
    bestOpenSlot: bestOpenSlot,
    partOfDay: partOfDay,
    durationPhrase: durationPhrase
  };
});
