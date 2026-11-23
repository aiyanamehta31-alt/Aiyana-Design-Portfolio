/* =====================================================================
   CASE STUDY DATA · Wiglet
   Wiglet has its own world (js/worlds/wiglet.js + css/worlds/wiglet.css)
   with a live demo that runs the real scheduler, ported to JavaScript
   (js/wiglet/scheduler.js). This file holds only words and pictures.

   Sources: the Wiglet deck (content/wiglet/, slide numbers as s.N) and
   the Wiglet codebase (read only; no secrets were opened or copied).
   ===================================================================== */
window.CASE_STUDIES = window.CASE_STUDIES || {};
window.CASE_STUDIES['wiglet'] = {
  slug: 'wiglet',
  title: 'Wiglet',
  world: 'wiglet',
  images: 'assets/images/projects/wiglet/',

  phases: [
    { id: 'wake', name: 'Wake up', real: 'The problem' },
    { id: 'plan', name: 'Make a plan', real: 'The idea and the rules' },
    { id: 'work', name: 'Get to work', real: 'How it’s built' },
    { id: 'ship', name: 'Ship it', real: 'What shipped, and the live demo' },
    { id: 'tomorrow', name: 'Tomorrow', real: 'What’s next' }
  ],

  /* Cover (s.1, s.8) */
  cover: {
    tagline: 'An ambient daily planner that already knows your day.',
    tags: ['Google Calendar', 'Voice + text', 'macOS menu bar'],
    facts: [
      { label: 'Course', value: 'Agentic AI (DESG319), FLAME University' },
      { label: 'Year', value: '2026' },
      { label: 'Team', value: 'Solo project' },
      { label: 'Built with', value: 'Python, FastAPI, Google Calendar API, Whisper, Groq LLM, HTML/CSS/JS, PyObjC (macOS)' },
      { label: 'Pair-programmer', value: 'Claude Code. I own the architecture; AI writes and debugs; I review every diff.' }
    ],
    cta: 'Try the live demo'
  },

  /* Wake up (s.2) */
  problem: {
    heading: 'Your day lives in three places that never talk',
    cards: [
      { title: 'The calendar', text: 'Knows your classes. Has no idea what you still need to do.' },
      { title: 'The to-do list', text: 'Knows your tasks. Has no idea when you’re actually free.' },
      { title: 'Your head', text: 'Does the mental math on free time, usually badly.' }
    ],
    lead: 'Planning tools are passive: they store what you type.',
    punch: 'None of them think with you.'
  },

  /* Make a plan (s.3, s.4, s.5) */
  question: {
    lines: ['What if your plan', 'was already built', 'the moment you', 'looked at it?'],
    sub: 'Fixed events placed. Free time surfaced. New tasks slotted in, by just saying them.'
  },
  meet: {
    heading: 'Meet Wiglet',
    image: { src: 'meet-laptop.webp', width: 1450, height: 830,
      alt: 'Design mockup: a laptop with the Wiglet card open over the desktop, showing the day’s classes, free time and tasks, with the mascot in the corner.' },
    traits: [
      { title: 'Ambient', text: 'A mascot in the corner. Tap to open, tap away to close.' },
      { title: 'Calendar-first', text: 'Google Calendar classes land automatically, and never move.' },
      { title: 'Voice-second', text: 'Speak or type to add, reprioritise and reshuffle.' }
    ]
  },
  rules: {
    heading: 'Four rules the agent lives by',
    items: [
      { title: 'Fixed stays fixed', text: 'Classes synced from the university calendar are hard-locked. Nothing ever moves them.', icon: 'lock' },
      { title: 'Flexible flows', text: 'Tasks, gym and hangouts slot into the gaps and reshuffle around each other.', icon: 'flow' },
      { title: 'Priority, said once', text: '“Gym is priority one today” acts immediately, then it’s forgotten.', icon: 'one' },
      { title: 'No memory, real results', text: 'What you said is discarded. What changed stays, on your real calendar.', icon: 'cal' }
    ]
  },

  /* Get to work (s.6 to s.11) */
  pipeline: {
    heading: 'AI at the language boundary, code for the logic',
    sentence: 'book 8–9pm for meeting my friends today',
    steps: [
      { step: 'Hear', what: 'Your voice becomes text', by: 'Whisper', ai: true, out: '“book 8–9pm for meeting my friends today”' },
      { step: 'Understand', what: 'Text becomes events: title, time, length, priority', by: 'LLM via Groq', ai: true, out: 'title: Meeting my friends · 20:00–21:00' },
      { step: 'Decide', what: 'Tasks fit into free gaps; classes never move', by: 'scheduler.py', ai: false, out: '20:00–21:00 is free' },
      { step: 'Act', what: 'Events written to Google Calendar, deduped', by: 'Calendar API', ai: false, out: 'Written once, not twice' },
      { step: 'Show', what: 'Timeline and open hours drawn in the widget', by: 'Frontend', ai: false, out: '8:00 – 9:00 · Meeting my friends' }
    ],
    close: 'The model understands you. The code decides, so every schedule is explainable and tested.'
  },
  loop: {
    heading: 'One agent, one loop, every message',
    steps: [
      { name: 'Perceive', title: 'Read the day', text: 'Today’s Google Calendar plus what you just said' },
      { name: 'Reason', title: 'Work it out', text: 'Parse intent, apply the priority rubric, lock classes' },
      { name: 'Act', title: 'Change it', text: 'Place blocks in free gaps and write them to Calendar' },
      { name: 'Observe', title: 'Check it', text: 'Read back, dedupe, refresh the widget' }
    ],
    close: 'What it observes feeds the next perceive, so the widget always shows the calendar’s real state.'
  },
  calls: {
    heading: 'I own the architecture. AI writes and debugs.',
    text: 'I review every diff. Why not full autonomy? Unfamiliar APIs and scheduling logic I need to explain, and defend, myself.',
    label: 'Calls I made, not the AI',
    items: [
      'Classes are hard-locked, never rescheduled',
      'No chat memory: requests vanish, results stay',
      'Rule-based scheduler, not an LLM-made plan',
      'Swapped Gemini for Groq after quota walls',
      'Cut generic AI suggestions for example hints',
      'Kept best_open_slot, deleted dead LLM code'
    ]
  },
  broke: {
    heading: 'What broke, and what I changed',
    hint: 'Flip a card to see the fix.',
    items: [
      { title: 'Model access', broke: 'gemini-2.5-flash was retired and the free quota ran out mid-testing.', fix: 'Moved the LLM layer to Groq with schema-tolerant parsing.' },
      { title: 'Calendar scope', broke: 'OAuth was read-only, so the agent could see my day but not change it.', fix: 'Widened the scope deliberately and re-authorised the app.' },
      { title: 'Duplicate events', broke: 'Repeating “add a meeting 6:15–7:15” wrote 8 copies to my real calendar.', fix: 'Title + time dedupe, retry-safe writes, 8 new tests.' },
      { title: 'UI drift', broke: 'The widget drifted from the mockup; every click stacked a new mic listener.', fix: 'Rebuilt the frontend to spec and fixed a hidden-element bug.' }
    ]
  },
  numbers: {
    heading: 'The process trail, in numbers',
    stats: [
      { value: 30.5, decimals: 1, prefix: '≈', suffix: '', label: 'hours spent' },
      { value: 785, decimals: 0, prefix: '≈', suffix: 'k', label: 'total tokens used' },
      { value: 143, decimals: 0, prefix: '', suffix: '', label: 'tests passing' },
      { value: 25, decimals: 0, prefix: '', suffix: '', label: 'logged commits' }
    ],
    source: 'Source: BUILD_LOG.md. ≈ marks figures reconstructed from the git log.',
    timeline: [
      { when: 'Sep 11', what: 'Repo, plan.md, BUILD_LOG.md: PR #1 reviewed and approved' },
      { when: 'Sep 17', what: 'Scheduler + 67 tests · Calendar read · parsing · FastAPI server · voice → MVP done' },
      { when: 'Sep 18–19', what: 'Multi-provider seam (4 adapters) · UI rebuild · per-visitor sessions' },
      { when: 'Sep 22', what: 'PKCE fix for invalid_grant · macOS menu-bar app · panel mode + tests' },
      { when: 'Sep 23', what: 'Card-as-window redesign, reverted · glassmorphism polish' }
    ]
  },

  /* Ship it (s.12, s.13) */
  shipped: {
    heading: 'From mockup to menu bar',
    mockup: { src: 'mockup-phone.webp', width: 530, height: 820, caption: 'Design mockup',
      alt: 'Design mockup of the Wiglet card on a phone lock screen at 9:41, listing DESG319 Lecture, Lunch, UGSEM5 Seminar, essay homework and gym.' },
    live: { src: 'live-widget.webp', width: 1650, height: 720, caption: 'Live today: real Google Calendar data',
      alt: 'The real Wiglet card in the macOS menu bar: a real class, ADBR308_UGSEM7, 4:15 to 5:10, and “no open time left today”.' },
    note: 'A real class, pulled live, and a correctly computed “no open time left today”.'
  },
  keys: {
    heading: 'Your key, your calendar',
    steps: [
      { title: 'Settings', text: 'Bring your own key: Groq, OpenAI or Anthropic.', src: 'signin-settings.webp', width: 730, height: 760,
        alt: 'Wiglet’s settings panel: provider set to Groq, an empty API key field, the model openai/gpt-oss-120b, and “Calendar connected”.' },
      { title: 'Google sign-in', text: 'Read and write access: the scope fix, live.', src: 'signin-google.webp', width: 735, height: 660,
        alt: 'Google’s consent screen: wiglet wants to access your Google Account, to view and edit events on all your calendars. The account address is blurred.' },
      { title: 'Result', text: 'New account, new calendar, loaded straight away.', src: 'signin-result.webp', width: 855, height: 520,
        alt: 'The Wiglet card showing AI ML Course from 2:00 to 6:00, fixed and synced, and “no open time left today”.' }
    ]
  },

  /* The live demo: the real scheduler, a sample student's day */
  demo: {
    heading: 'Plan a student’s day, live',
    text: 'Type what you want to do, or tap an example. The scheduler below is Wiglet’s real logic, ported line for line.',
    modeNote: 'Demo mode: a simple parser stands in for Whisper + the LLM. The scheduling below is the real Wiglet logic.',
    flexNote: 'In the real app, each placed task is written to your Google Calendar and then stays put. Here nothing is written anywhere, so everything you add stays flexible and reshuffles by priority.',
    voiceNote: 'Voice uses your browser’s own speech recognition (in Chrome, Google processes the audio).',
    fixed: [
      { id: 'desg319', title: 'DESG319 Lecture', start: 540, end: 630 },
      { id: 'lunch', title: 'Lunch', start: 720, end: 780 },
      { id: 'ugsem5', title: 'UGSEM5 Seminar', start: 900, end: 990 }
    ],
    chips: [
      'book 8–9pm for meeting my friends today',
      'gym for an hour, priority one',
      'study for 2 hours after 4',
      'coffee with Sam at 11',
      'essay homework, 1 hour',
      'read for 45 minutes tonight',
      'a 7 hour project'
    ],
    placeholder: 'gym is priority one today…'
  },

  /* Try the real Wiglet.
     TODO(Aiyana): paste the deployed URL into liveUrl to show this section.
     Left empty, the section is hidden. */
  real: {
    liveUrl: '',
    heading: 'Try the real Wiglet',
    text: 'The real app uses a real AI model. Open settings, choose Groq, and paste your own free API key from console.groq.com. Google Calendar sign-in is limited to approved test users while the app awaits Google verification, so without it Wiglet plans on an empty day.',
    button: 'Open the real Wiglet'
  },

  /* Tomorrow (s.15) */
  tomorrow: {
    heading: 'Where Wiglet goes from here',
    items: [
      { title: 'iOS app', text: 'A real lock-screen widget, with this backend behind it.' },
      { title: 'Reschedule emails', text: 'A Gmail skill that tells people when a plan moves.' },
      { title: 'Multi-day plans', text: 'Tomorrow and the week ahead, not only today.' }
    ]
  },

  next: { slug: 'codes', title: 'Codes' }
};
