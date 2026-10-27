/* =====================================================================
   WIGLET · scheduler.test.js
   The scheduler tests from Wiglet's tests/test_scheduler.py, ported to
   check the JavaScript port behaves the same. Run with:

     node js/wiglet/scheduler.test.js

   Times are minutes from midnight: at(10, 30) is 630. Two Python tests are
   not ported because they test timezone handling the port doesn't have:
   test_events_in_other_timezones_merge_by_instant and
   test_naive_datetimes_are_rejected. Everything else is here, including
   every case of the two parametrised tests.
   ===================================================================== */
'use strict';

const S = require('./scheduler.js');
const assert = require('node:assert/strict');

const at = (hour, minute = 0) => hour * 60 + minute;
const nextDay = (hour, minute = 0) => 24 * 60 + hour * 60 + minute;
const DAY_START = at(8);
const DAY_END = at(23);
const BUFFER = S.DEFAULT_CONFIG.buffer;

const event = (id, start, end, title = 'Class', allDay = false) => S.fixedEvent(id, title, start, end, allDay);
const task = (id, minutes, opts = {}) => S.flexibleItem(id, opts.name || id, minutes, opts);
const spans = (gaps) => gaps.map((g) => [g.start, g.end]);
const window = (start, end) => ({ start, end });

function build({ fixed = [], items = [], rubric = null, start = DAY_START, end = DAY_END, now = null } = {}) {
  return S.planDay({ fixedEvents: fixed, flexibleItems: items, rubric: rubric || S.rubric(), dayStart: start, dayEnd: end, now });
}
function placed(plan) {
  const out = {};
  plan.blocks.filter((b) => b.kind === S.BlockKind.FLEXIBLE).forEach((b) => { out[b.name] = b; });
  return out;
}

const tests = [];
const test = (name, fn) => tests.push([name, fn]);

/* ---------- compute_gaps: geometry ---------- */

test('empty day is one unpadded gap', () => {
  const gaps = S.computeGaps([], DAY_START, DAY_END);
  assert.deepEqual(spans(gaps), [[DAY_START, DAY_END]]);
  assert.equal(gaps[0].padBefore, false);
  assert.equal(gaps[0].padAfter, false);
});

test('single event splits the day and pads the inner edges', () => {
  const gaps = S.computeGaps([event('a', at(10), at(11))], DAY_START, DAY_END);
  assert.deepEqual(spans(gaps), [[DAY_START, at(10)], [at(11), DAY_END]]);
  assert.ok(gaps[0].padAfter && !gaps[0].padBefore);
  assert.ok(gaps[1].padBefore && !gaps[1].padAfter);
});

test('event covering the whole day leaves nothing', () => {
  assert.deepEqual(S.computeGaps([event('a', DAY_START, DAY_END)], DAY_START, DAY_END), []);
});

test('event starting before the day is clipped', () => {
  assert.deepEqual(spans(S.computeGaps([event('a', at(7), at(9))], DAY_START, DAY_END)), [[at(9), DAY_END]]);
});

test('event ending after the day is clipped', () => {
  assert.deepEqual(spans(S.computeGaps([event('a', at(22), nextDay(1))], DAY_START, DAY_END)), [[DAY_START, at(22)]]);
});

test('events entirely outside the day are ignored', () => {
  const before = event('a', at(5), at(6));
  const after = event('b', nextDay(1), nextDay(2));
  assert.deepEqual(spans(S.computeGaps([before, after], DAY_START, DAY_END)), [[DAY_START, DAY_END]]);
});

test('overlapping events merge', () => {
  const gaps = S.computeGaps([event('a', at(10), at(11)), event('b', at(10, 30), at(12))], DAY_START, DAY_END);
  assert.deepEqual(spans(gaps), [[DAY_START, at(10)], [at(12), DAY_END]]);
});

test('contained event changes nothing', () => {
  const outer = [event('a', at(10), at(12))];
  const both = outer.concat([event('b', at(10, 30), at(11))]);
  assert.deepEqual(spans(S.computeGaps(both, DAY_START, DAY_END)), spans(S.computeGaps(outer, DAY_START, DAY_END)));
});

test('back-to-back events produce no zero-length gap', () => {
  const gaps = S.computeGaps([event('a', at(10), at(11)), event('b', at(11), at(12))], DAY_START, DAY_END);
  assert.deepEqual(spans(gaps), [[DAY_START, at(10)], [at(12), DAY_END]]);
  assert.ok(gaps.every((g) => S.gapDuration(g) > 0));
});

test('zero-length event blocks nothing', () => {
  assert.deepEqual(spans(S.computeGaps([event('a', at(10), at(10))], DAY_START, DAY_END)), [[DAY_START, DAY_END]]);
});

test('all-day event does not consume the day', () => {
  const allDay = event('a', DAY_START, DAY_END, 'Assignment due', true);
  assert.deepEqual(spans(S.computeGaps([allDay], DAY_START, DAY_END)), [[DAY_START, DAY_END]]);
});

test('input order does not matter', () => {
  const a = event('a', at(10), at(11)), b = event('b', at(14), at(15));
  assert.deepEqual(S.computeGaps([b, a], DAY_START, DAY_END), S.computeGaps([a, b], DAY_START, DAY_END));
});

test('inverted event is rejected', () => {
  assert.throws(() => S.computeGaps([event('a', at(11), at(10))], DAY_START, DAY_END));
});

test('inverted day bounds are rejected', () => {
  assert.throws(() => S.computeGaps([], DAY_END, DAY_START));
});

test('gaps are always sorted, positive and disjoint', () => {
  const messy = [
    event('a', at(14), at(15)),
    event('b', at(9), at(10)),
    event('c', at(9, 30), at(11)),
    event('d', at(11), at(11)),
    event('e', at(20), nextDay(2))
  ];
  const gaps = S.computeGaps(messy, DAY_START, DAY_END);
  assert.ok(gaps.every((g) => g.end > g.start));
  for (let i = 1; i < gaps.length; i++) assert.ok(gaps[i - 1].end <= gaps[i].start);
});

/* ---------- Placement: rubric and ordering ---------- */

test('higher-priority item gets the earlier slot', () => {
  const plan = build({ items: [task('gym', 60), task('deck', 60)], rubric: S.rubric({ gym: 1, deck: 2 }) });
  const blocks = placed(plan);
  assert.ok(blocks.gym.start < blocks.deck.start);
  assert.equal(plan.unplaced.length, 0);
});

test('lower-priority item is bumped when room runs out', () => {
  const plan = build({ items: [task('gym', 90), task('deck', 90)], rubric: S.rubric({ gym: 1, deck: 3 }), end: at(10) });
  assert.deepEqual(Object.keys(placed(plan)), ['gym']);
  assert.deepEqual(plan.unplaced.map((u) => u.item.name), ['deck']);
  assert.equal(plan.unplaced[0].reason, S.UnplacedReason.NO_ROOM);
});

test('unranked item is still placed but goes last', () => {
  const plan = build({ items: [task('gym', 30), task('errand', 30)], rubric: S.rubric({ gym: 1 }) });
  const blocks = placed(plan);
  assert.ok(blocks.gym.start < blocks.errand.start);
  assert.equal(plan.unplaced.length, 0);
});

test('within a tier the longer item is placed first', () => {
  const plan = build({ items: [task('alpha', 30), task('beta', 60)], rubric: S.rubric({ alpha: 1, beta: 1 }) });
  const blocks = placed(plan);
  assert.ok(blocks.beta.start < blocks.alpha.start);
});

test('equal priority and duration ties break by name', () => {
  const plan = build({ items: [task('beta', 30), task('alpha', 30)], rubric: S.rubric({ alpha: 1, beta: 1 }) });
  const blocks = placed(plan);
  assert.ok(blocks.alpha.start < blocks.beta.start);
});

test('shuffling the input produces an identical plan', () => {
  const items = [task('gym', 60), task('deck', 45), task('lunch', 30)];
  const rubric = S.rubric({ gym: 1, lunch: 2, deck: 3 });
  assert.deepEqual(build({ items, rubric }), build({ items: items.slice().reverse(), rubric }));
});

test('rubric key overrides the display name', () => {
  const plan = build({
    items: [task('gym session', 60, { rubricKey: 'gym' }), task('deck', 60)],
    rubric: S.rubric({ gym: 1, deck: 2 })
  });
  const blocks = placed(plan);
  assert.ok(blocks['gym session'].start < blocks.deck.start);
});

/* ---------- Placement: fitting ---------- */

test('first fit takes the earliest gap, not the tightest', () => {
  const fixed = [event('a', at(11), at(12)), event('b', at(13, 10), at(14))];
  const plan = build({ fixed, items: [task('gym', 50)] });
  assert.equal(placed(plan).gym.start, DAY_START);
});

test('item too long for any gap is reported with the largest available', () => {
  const fixed = [event('a', at(10), at(11)), event('b', at(12), at(23))];
  const plan = build({ fixed, items: [task('deck', 150)] });
  assert.equal(Object.keys(placed(plan)).length, 0);
  const unplaced = plan.unplaced[0];
  assert.equal(unplaced.reason, S.UnplacedReason.TOO_LONG_FOR_ANY_GAP);
  // Morning gap is 08:00-10:00, minus 10 min of transit before the class.
  assert.equal(unplaced.largestAvailable, 110);
});

test('item longer than the day is reported separately', () => {
  const plan = build({ items: [task('epic', 20 * 60)] });
  assert.equal(plan.unplaced[0].reason, S.UnplacedReason.DURATION_EXCEEDS_DAY);
});

test('zero-length item is ignored', () => {
  const plan = build({ items: [task('nothing', 0)] });
  assert.equal(plan.blocks.length, 0);
  assert.equal(plan.unplaced.length, 0);
});

/* ---------- Placement: buffers ---------- */

test('block after a fixed event waits for transit', () => {
  const plan = build({ fixed: [event('a', at(8), at(9))], items: [task('gym', 60)] });
  assert.equal(placed(plan).gym.start, at(9) + BUFFER);
});

test('block at the start of the day needs no transit', () => {
  assert.equal(placed(build({ items: [task('gym', 60)] })).gym.start, DAY_START);
});

test('block before a fixed event leaves transit room', () => {
  const plan = build({ fixed: [event('a', at(10), at(11))], items: [task('gym', 110)] });
  assert.equal(placed(plan).gym.end, at(10) - BUFFER);
});

test('two blocks in one gap are separated by the buffer', () => {
  const plan = build({ items: [task('gym', 30), task('errand', 30)], rubric: S.rubric({ gym: 1 }) });
  const blocks = placed(plan);
  assert.ok(blocks.errand.start - blocks.gym.end >= BUFFER);
});

test('item that fits the raw gap but not the buffered one is not placed there', () => {
  const plan = build({ fixed: [event('a', at(10), at(23))], items: [task('deck', 115)] });
  assert.equal(Object.keys(placed(plan)).length, 0);
});

/* ---------- Placement: preferences ---------- */

test('soft preference is honoured when there is room', () => {
  const plan = build({ items: [task('gym', 60, { preferredWindow: window(at(18), at(21)), preferenceLabel: 'tonight' })] });
  const block = placed(plan).gym;
  assert.ok(block.start >= at(18));
  assert.equal(block.preferenceSatisfied, true);
});

test('soft preference yields rather than dropping the item', () => {
  const plan = build({ items: [task('gym', 60, { preferredWindow: window(at(18), at(21)) })], end: at(12) });
  const block = placed(plan).gym;
  assert.equal(block.start, DAY_START);
  assert.equal(block.preferenceSatisfied, false);
});

test('hard preference is never relocated', () => {
  const plan = build({
    items: [task('lunch with Sam', 60, { preferredWindow: window(at(18), at(21)), preferenceIsHard: true })],
    end: at(12)
  });
  assert.equal(Object.keys(placed(plan)).length, 0);
  assert.equal(plan.unplaced[0].reason, S.UnplacedReason.PREFERENCE_UNSATISFIABLE);
});

test('preference window clips the placement rather than the gap start', () => {
  const plan = build({ items: [task('gym', 60, { preferredWindow: window(at(16), at(20)) })] });
  assert.equal(placed(plan).gym.start, at(16));
});

/* ---------- Determinism and re-planning ---------- */

test('planning is deterministic', () => {
  const fixed = [event('a', at(10), at(11)), event('b', at(14), at(15))];
  const items = [task('gym', 60), task('deck', 120), task('lunch', 45)];
  const rubric = S.rubric({ gym: 1, lunch: 2, deck: 3 });
  assert.deepEqual(build({ fixed, items, rubric }), build({ fixed, items, rubric }));
});

test('restating the rubric reshuffles the day', () => {
  const items = [task('gym', 90), task('deck', 90)];
  const first = build({ items, rubric: S.rubric({ deck: 1, gym: 2 }), end: at(11) });
  assert.deepEqual(Object.keys(placed(first)), ['deck']);
  assert.deepEqual(first.unplaced.map((u) => u.item.name), ['gym']);

  const second = build({ items, rubric: S.rubric({ gym: 1, deck: 2 }), end: at(11) });
  assert.deepEqual(Object.keys(placed(second)), ['gym']);
  assert.deepEqual(second.unplaced.map((u) => u.item.name), ['deck']);
});

test('nothing is scheduled in the past', () => {
  assert.equal(placed(build({ items: [task('gym', 60)], now: at(12, 30) })).gym.start, at(12, 30));
});

test('gaps entirely in the past are dropped', () => {
  const plan = build({ fixed: [event('a', at(14), at(15))], items: [task('gym', 60)], now: at(16) });
  assert.equal(placed(plan).gym.start, at(16));
});

/* ---------- Open time ---------- */

test('empty day is entirely open', () => {
  const slots = S.findOpenTime(build());
  assert.equal(slots.length, 1);
  assert.deepEqual([slots[0].start, slots[0].end], [DAY_START, DAY_END]);
});

test('full day has no open time', () => {
  assert.deepEqual(S.findOpenTime(build({ fixed: [event('a', DAY_START, DAY_END)] })), []);
});

test('slivers below the threshold are not announced', () => {
  assert.deepEqual(S.findOpenTime(build({ fixed: [event('a', at(8), at(8, 40))], end: at(9) })), []);
});

test('open time accounts for flexible blocks too', () => {
  const slots = S.findOpenTime(build({ items: [task('gym', 60)] }));
  assert.equal(slots.length, 1);
  assert.equal(slots[0].start, at(9) + BUFFER);
});

test('open time excludes the past', () => {
  const slots = S.findOpenTime(build(), null, at(20));
  assert.equal(slots.length, 1);
  assert.equal(slots[0].start, at(20));
});

test('a slot exactly at the threshold is included', () => {
  // 22:30-23:00 minus 10 min transit = 20 min, below the 30 min floor.
  assert.deepEqual(S.findOpenTime(build({ fixed: [event('a', at(8), at(22, 30))] })), []);
  assert.equal(S.findOpenTime(build({ fixed: [event('a', at(8), at(22, 20))] })).length, 1);
});

[[5, 'morning'], [11, 'morning'], [12, 'afternoon'], [16, 'afternoon'],
 [17, 'evening'], [20, 'evening'], [21, 'tonight'], [4, 'tonight']].forEach(([hour, expected]) => {
  test('part of day: ' + hour + ':' + ([11, 16, 20].includes(hour) ? '59' : '00') + ' is ' + expected, () => {
    assert.equal(S.partOfDay(at(hour, [11, 16, 20].includes(hour) ? 59 : 0)), expected);
  });
});

[[30, '30 min'], [45, '45 min'], [47, '45 min'], [60, '1 hr'],
 [90, '1.5 hrs'], [105, '1 hr 45 min'], [120, '2 hrs'], [150, '2.5 hrs']].forEach(([minutes, expected]) => {
  test('duration phrase rounds down: ' + minutes + ' min reads "' + expected + '"', () => {
    assert.equal(S.durationPhrase(minutes), expected);
  });
});

test('phrase reads like a person wrote it', () => {
  // 20:50 class ends, 10 min transit, leaving 21:00-23:00 free.
  assert.equal(S.findOpenTime(build({ fixed: [event('a', at(8), at(20, 50))] }))[0].phrase, '2 hrs free tonight');
});

test('best open slot prefers the longest, then the earliest', () => {
  const short = { start: at(9), end: at(10), partOfDay: 'morning', phrase: '1 hr free this morning' };
  const longPm = { start: at(14), end: at(17), partOfDay: 'afternoon', phrase: '3 hrs free this afternoon' };
  const longAm = { start: at(8), end: at(11), partOfDay: 'morning', phrase: '3 hrs free this morning' };
  assert.equal(S.bestOpenSlot([short, longPm, longAm]), longAm);
  assert.equal(S.bestOpenSlot([]), null);
});

/* ---------- The scenario this whole thing exists for ---------- */

test('a realistic day, end to end', () => {
  const fixed = [
    event('c1', at(10), at(11), 'Design Studio'),
    event('c2', at(14), at(15), 'Client call'),
    event('c3', DAY_START, DAY_END, 'Assignment due', true)
  ];
  const items = [
    task('gym', 60, { preferredWindow: window(at(17), at(21)), preferenceLabel: 'this evening' }),
    task('lunch', 45),
    task('deck', 120)
  ];
  const plan = build({ fixed, items, rubric: S.rubric({ gym: 1, lunch: 2, deck: 3 }) });

  assert.equal(plan.unplaced.length, 0);
  assert.deepEqual(plan.allDayEvents.map((e) => e.title), ['Assignment due']);

  const blocks = placed(plan);
  assert.equal(blocks.gym.start, at(17));
  assert.ok(blocks.gym.preferenceSatisfied);
  assert.equal(blocks.lunch.start, DAY_START);
  assert.equal(blocks.deck.start, at(11) + BUFFER);

  const fixedBlocks = plan.blocks.filter((b) => b.kind === S.BlockKind.FIXED);
  assert.deepEqual(fixedBlocks.map((b) => [b.start, b.end]), [[at(10), at(11)], [at(14), at(15)]]);

  const nudge = S.bestOpenSlot(S.findOpenTime(plan));
  assert.ok(nudge && nudge.phrase.includes('free'));
});

test('the same day with less room reports what did not fit', () => {
  const fixed = [event('c1', at(10), at(11))];
  const items = [task('gym', 60), task('deck', 120)];
  const plan = build({ fixed, items, rubric: S.rubric({ gym: 1, deck: 3 }), end: at(13) });
  assert.ok('gym' in placed(plan));
  assert.equal(plan.unplaced[0].item.name, 'deck');
  assert.equal(plan.unplaced[0].reason, S.UnplacedReason.TOO_LONG_FOR_ANY_GAP);
  assert.ok(plan.unplaced[0].largestAvailable < 120);
});

/* ---------- Run ---------- */

let passed = 0;
const failures = [];
for (const [name, fn] of tests) {
  try { fn(); passed++; } catch (err) { failures.push([name, err]); }
}
failures.forEach(([name, err]) => console.log('FAIL  ' + name + '\n      ' + String(err.message).split('\n')[0]));
console.log(passed + ' of ' + tests.length + ' passed');
process.exitCode = failures.length ? 1 : 0;
