/* =====================================================================
   WIGLET · demo-parser.test.js
   Checks the demo parser follows the real agent's rules (wiglet/agent.py):
   events vs tasks, time ranges, am/pm, clean titles, and never guessing
   a time. Run with:

     node js/wiglet/demo-parser.test.js

   Times are minutes from midnight: 17:00 is 1020.
   ===================================================================== */
'use strict';

const P = require('./demo-parser.js');
const assert = require('node:assert/strict');

const at = (hour, minute = 0) => hour * 60 + minute;
const tests = [];
const test = (name, fn) => tests.push([name, fn]);

// One event, nothing else.
function event(sentence) {
  const r = P.parse(sentence);
  assert.equal(r.error, '', 'unexpected error');
  assert.equal(r.items.length, 0, 'should not also be a task');
  assert.equal(r.events.length, 1, 'expected one event');
  return r.events[0];
}
// One task, nothing else.
function task(sentence, existing) {
  const r = P.parse(sentence, existing);
  assert.equal(r.error, '', 'unexpected error');
  assert.equal(r.events.length, 0, 'should not be an event');
  assert.equal(r.items.length, 1, 'expected one task');
  return { item: r.items[0], rubric: r.rubric, understood: r.understood };
}

/* ---------- The reported bug and the deck's sentence ---------- */

test('"5-6 pm i have a meeting add that to my shedule" is a Meeting event at 17:00-18:00', () => {
  const ev = event('5-6 pm i have a meeting add that to my shedule');
  assert.deepEqual(ev, { title: 'Meeting', start: at(17), end: at(18) });
  assert.deepEqual(P.parse('5-6 pm i have a meeting add that to my shedule').understood, ['Meeting · 5:00–6:00 pm · added to calendar']);
});

test('the deck sentence books "Meeting my friends" at 20:00-21:00', () => {
  assert.deepEqual(event('book 8–9pm for meeting my friends today'), { title: 'Meeting my friends', start: at(20), end: at(21) });
});

/* ---------- Ranges ---------- */

test('"5-6" with no am/pm reads inside the day: 17:00-18:00', () => {
  const ev = event('meeting 5-6');
  assert.deepEqual([ev.start, ev.end], [at(17), at(18)]);
});

test('"5–6pm" with an en dash and the am/pm once', () => {
  const ev = event('meeting 5–6pm');
  assert.deepEqual([ev.start, ev.end], [at(17), at(18)]);
});

test('"5pm-6pm"', () => {
  const ev = event('meeting 5pm-6pm');
  assert.deepEqual([ev.start, ev.end], [at(17), at(18)]);
});

test('"5 to 6"', () => {
  const ev = event('meeting 5 to 6');
  assert.deepEqual([ev.start, ev.end], [at(17), at(18)]);
});

test('"from 5 to 6"', () => {
  const ev = event('meeting from 5 to 6');
  assert.deepEqual([ev.start, ev.end], [at(17), at(18)]);
});

test('"between 5 and 6"', () => {
  const ev = event('meeting between 5 and 6');
  assert.deepEqual([ev.start, ev.end], [at(17), at(18)]);
});

test('"17:00-18:00" (24-hour)', () => {
  const ev = event('meeting 17:00-18:00');
  assert.deepEqual([ev.start, ev.end], [at(17), at(18)]);
});

test('"5:30-6:15 pm"', () => {
  const ev = event('meeting 5:30-6:15 pm');
  assert.deepEqual([ev.start, ev.end], [at(17, 30), at(18, 15)]);
});

test('"9-10" is the morning: 09:00-10:00', () => {
  const ev = event('meeting 9-10');
  assert.deepEqual([ev.start, ev.end], [at(9), at(10)]);
});

test('"11-1pm" keeps the start in the morning: 11:00-13:00', () => {
  const ev = event('meeting 11-1pm');
  assert.deepEqual([ev.start, ev.end], [at(11), at(13)]);
});

/* ---------- Single times ---------- */

test('"at 5pm" and "at 5:30 pm" on a calendar request', () => {
  assert.deepEqual(event('add dentist to my calendar at 5pm'), { title: 'Dentist', start: at(17), end: at(18) });
  const ev = event('put a call with Mum on my calender at 5:30 pm');
  assert.deepEqual([ev.title, ev.start, ev.end], ['Call with Mum', at(17, 30), at(18)]);   // a call is 30 min
});

test('"noon" is 12:00', () => {
  const { item } = task('lunch at noon');
  assert.deepEqual(item.preferredWindow, { start: at(12), end: at(13) });
});

/* ---------- Events vs tasks ---------- */

test('"gym at 6" stays a flexible task with a soft preference', () => {
  const { item } = task('gym at 6');
  assert.equal(item.name, 'Gym');
  assert.deepEqual(item.preferredWindow, { start: at(18), end: at(19) });
  assert.equal(item.preferenceIsHard, false);
});

test('"call with Sam at 4" is a task with a hard preference', () => {
  const { item } = task('call with Sam at 4');
  assert.equal(item.name, 'Call with Sam');
  assert.equal(item.duration, 30);
  assert.deepEqual(item.preferredWindow, { start: at(16), end: at(17) });
  assert.equal(item.preferenceIsHard, true);
});

test('a range for a plain task is a window, not an event', () => {
  const { item } = task('gym 5-6');
  assert.deepEqual(item.preferredWindow, { start: at(17), end: at(18) });
});

test('an event with a start but no end takes its length from the duration table', () => {
  assert.deepEqual(event('book coffee with Sam at 11'), { title: 'Coffee with Sam', start: at(11), end: at(11, 30) });
});

test('typos are tolerated: schedual, scedule, calandar', () => {
  assert.deepEqual(event('add the review to my schedual 3-4'), { title: 'Review', start: at(15), end: at(16) });
  assert.deepEqual([event('put standup on my scedule 9-10').start], [at(9)]);
  assert.equal(event('add tutorial to my calandar 2-3').title, 'Tutorial');
});

/* ---------- Never guess a time ---------- */

test('an unreadable time places nothing and says so', () => {
  const r = P.parse('meeting at half past five');
  assert.equal(r.items.length + r.events.length, 0);
  assert.equal(r.error, P.TIME_HELP);
});

test('a calendar request with no time at all is not guessed at', () => {
  const r = P.parse('add dentist to my calendar');
  assert.equal(r.items.length + r.events.length, 0);
  assert.equal(r.error, P.TIME_HELP);
});

/* ---------- Every chip ---------- */

test('chip: gym for an hour, priority one', () => {
  const { item, rubric, understood } = task('gym for an hour, priority one');
  assert.deepEqual([item.name, item.duration, item.preferredWindow], ['Gym', 60, null]);
  assert.deepEqual(rubric, { gym: 1 });
  assert.deepEqual(understood, ['Gym · 1 hr · flexible · priority #1']);
});

test('chip: study for 2 hours after 4', () => {
  const { item } = task('study for 2 hours after 4');
  assert.deepEqual([item.name, item.duration, item.preferredWindow], ['Study', 120, { start: at(16), end: at(23) }]);
});

test('chip: coffee with Sam at 11', () => {
  const { item } = task('coffee with Sam at 11');
  assert.deepEqual([item.name, item.duration, item.preferenceIsHard], ['Coffee with Sam', 30, true]);
  assert.deepEqual(item.preferredWindow, { start: at(11), end: at(12) });
});

test('chip: essay homework, 1 hour', () => {
  const { item } = task('essay homework, 1 hour');
  assert.deepEqual([item.name, item.duration], ['Essay homework', 60]);
});

test('chip: read for 45 minutes tonight', () => {
  const { item } = task('read for 45 minutes tonight');
  assert.deepEqual([item.name, item.duration, item.preferredWindow], ['Read', 45, { start: at(18), end: at(23) }]);
});

test('chip: a 7 hour project', () => {
  const { item } = task('a 7 hour project');
  assert.deepEqual([item.name, item.duration], ['Project', 420]);
});

test('chip: book 8–9pm for meeting my friends today (the deck sentence)', () => {
  const r = P.parse('book 8–9pm for meeting my friends today');
  assert.deepEqual(r.understood, ['Meeting my friends · 8:00–9:00 pm · added to calendar']);
});

test('"gym is priority one" re-ranks an existing task instead of adding one', () => {
  const r = P.parse('gym is priority one', [{ name: 'Gym', rubricKey: 'gym' }]);
  assert.equal(r.items.length, 0);
  assert.deepEqual(r.rubric, { gym: 1 });
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
