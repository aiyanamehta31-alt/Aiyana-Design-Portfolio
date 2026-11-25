/* =====================================================================
   CASE STUDY DATA · Wiglet, an AI agent that plans your day
   Laid out by the story world (js/worlds/story.js + css/worlds/story.css),
   rebuilt 2026-11-25 like Nexo and Maggi: one calm page, in order, in
   plain words, made clear from the first line that this is an agentic
   AI project. The live demo is a story block (js/widgets/wiglet-demo.js)
   running the real scheduler, ported to JavaScript (js/wiglet/).

   Sources: the Wiglet deck (content/wiglet/) and the Wiglet codebase and
   its BUILD_LOG.md (read only; no secrets were opened or copied).
   Rule: nothing here is invented.
   ===================================================================== */
window.CASE_STUDIES = window.CASE_STUDIES || {};
window.CASE_STUDIES['wiglet'] = {
  slug: 'wiglet',
  title: 'Wiglet',
  world: 'story',
  images: 'assets/images/projects/wiglet/',
  theme: { tone: 'wiglet', glider: 'st-glider--wiglet' },
  // The demo block and the scheduler it runs, loaded before the page opens.
  scripts: ['js/wiglet/scheduler.js', 'js/wiglet/demo-parser.js', 'js/wiglet/scheduler-source.js', 'js/widgets/wiglet-demo.js'],

  top: {
    title: 'Wiglet',
    line: 'An AI agent that plans your day. It reads your calendar, listens to what you need to do, and fits it into your free time by itself.',
    tags: ['Agentic AI', 'Product design', 'Built end to end', 'Voice'],
    image: { src: 'meet-laptop.webp', width: 1450, height: 830, note: 'Wiglet, open over the desktop',
      alt: 'Design mockup: a laptop with the Wiglet card open over the desktop, showing the day’s classes, free time and tasks, with the mascot in the corner.' },
    facts: [
      { label: 'Course', value: 'Agentic AI (DESG319), FLAME University' },
      { label: 'Year', value: '2026' },
      { label: 'Team', value: 'Solo project' },
      { label: 'Built with', value: 'Python, FastAPI, Google Calendar API, Whisper, Groq LLM, HTML/CSS/JS, PyObjC (macOS)' },
      { label: 'Pair-programmer', value: 'Claude Code. I own the architecture; AI writes and debugs; I review every diff.' }
    ]
  },

  sections: [
    /* 1. What makes it an agent */
    { id: 'agent', nav: 'An AI agent', heading: 'An AI agent, not a chatbot',
      text: 'A chatbot answers you. An agent does something about it: it looks at what is going on, decides what to do, acts in the real world, and checks the result. Wiglet does this every time you talk to it.',
      blocks: [
        { type: 'loop', label: 'One loop, every message', items: [
          { name: 'Perceive', plain: 'Look', text: 'Reads today’s Google Calendar and what you just said.' },
          { name: 'Reason', plain: 'Think', text: 'Works out what you mean and what matters most. Classes are locked.' },
          { name: 'Act', plain: 'Do', text: 'Places tasks in your free gaps and writes them to your real calendar.' },
          { name: 'Observe', plain: 'Check', text: 'Reads the calendar back, removes duplicates, and updates the widget.' }
        ], note: 'What it sees after acting feeds the next round, so the widget always shows your calendar as it really is.' }
      ] },

    /* 2. The problem (deck s.2) */
    { id: 'problem', nav: 'The problem', heading: 'The problem',
      text: 'A student’s day lives in three places that never talk to each other.',
      blocks: [
        { type: 'cards', cols: 3, items: [
          { title: 'The calendar', text: 'Knows your classes. Has no idea what you still need to do.' },
          { title: 'The to-do list', text: 'Knows your tasks. Has no idea when you’re actually free.' },
          { title: 'Your head', text: 'Does the maths on free time, usually badly.' }
        ] },
        { type: 'box', tone: 'red', big: 'Planning tools only store what you type. None of them think with you.' }
      ] },

    /* 3. The idea (deck s.3 to s.5) */
    { id: 'idea', nav: 'The idea', heading: 'The idea',
      text: 'What if your plan was already made the moment you looked at it? Classes in place, free time shown, and new tasks slotted in just by saying them.',
      blocks: [
        { type: 'cards', cols: 3, label: 'What Wiglet is like', items: [
          { title: 'Always there', text: 'A small mascot in the corner. Tap to open, tap away to close.' },
          { title: 'Calendar first', text: 'Your Google Calendar classes appear by themselves, and never move.' },
          { title: 'Voice second', text: 'Speak or type to add, reprioritise and reshuffle.' }
        ] },
        { type: 'list', label: 'Four rules the agent follows', numbered: true, items: [
          { title: 'Fixed stays fixed', text: 'Classes from the university calendar are locked. Nothing ever moves them.' },
          { title: 'Flexible flows', text: 'Tasks, gym and hangouts fill the gaps and reshuffle around each other.' },
          { title: 'Priority, said once', text: '“Gym is priority one today” works straight away, then it’s forgotten.' },
          { title: 'No memory, real results', text: 'What you said is thrown away. What changed stays, on your real calendar.' }
        ] }
      ] },

    /* 4. How it works (deck s.6, s.7) */
    { id: 'how', nav: 'How it works', heading: 'How it works',
      text: 'AI is used only where language is involved. Everything that decides your day is ordinary code, so every plan can be explained and tested.',
      blocks: [
        { type: 'pipeline', label: 'One request, five steps', example: 'book 8–9pm for meeting my friends today', items: [
          { step: 'Hear', what: 'Your voice becomes text', by: 'Whisper', ai: true, out: '“book 8–9pm for meeting my friends today”' },
          { step: 'Understand', what: 'Text becomes events: title, time, length, priority', by: 'LLM via Groq', ai: true, out: 'Meeting my friends, 20:00–21:00' },
          { step: 'Decide', what: 'Tasks fit into free gaps; classes never move', by: 'scheduler.py', ai: false, out: '20:00–21:00 is free' },
          { step: 'Act', what: 'Events written to Google Calendar, once', by: 'Calendar API', ai: false, out: 'Written once, not twice' },
          { step: 'Show', what: 'Timeline and open hours drawn in the widget', by: 'Frontend', ai: false, out: '8:00 – 9:00 · Meeting my friends' }
        ] },
        { type: 'box', tone: 'yellow', big: 'The model understands you. The code decides.' }
      ] },

    /* 5. Try it (the live demo) */
    { id: 'demo', nav: 'Try it live', heading: 'Try it live',
      text: 'Type what you want to do, or tap an example. Watch the agent loop light up, then the plan change. The scheduling is Wiglet’s real logic, ported line for line.',
      blocks: [
        { type: 'widget', name: 'wigletDemo',
          modeNote: 'Demo mode: a simple parser stands in for Whisper + the LLM. The scheduling below is the real Wiglet logic.',
          flexNote: 'In the real app, each task Wiglet places is written to your Google Calendar and then stays put. Here nothing is written anywhere, so everything you add stays flexible and reshuffles by priority.',
          voiceNote: 'Voice uses your browser’s own speech recognition (in Chrome, Google processes the audio).',
          placeholder: 'gym is priority one today…',
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
          ] }
      ] },

    /* 6. Building it with AI (deck s.8 to s.11, BUILD_LOG.md) */
    { id: 'build', nav: 'Building it with AI', heading: 'Building it with AI',
      text: 'I built Wiglet with Claude Code as a pair-programmer. I own the architecture, the AI writes and debugs, and I review every change. I kept the big decisions for myself, because I need to be able to explain and defend them.',
      blocks: [
        { type: 'chips', label: 'Decisions I made, not the AI', items: [
          'Classes are locked, never rescheduled',
          'No chat memory: requests vanish, results stay',
          'A rule-based scheduler, not a plan made by an AI model',
          'Swapped Gemini for Groq after hitting limits',
          'Cut generic AI suggestions for example hints',
          'Kept best_open_slot, deleted unused AI code'
        ] },
        { type: 'stats', items: [
          { n: '≈30.5', label: 'hours of work' },
          { n: '143', label: 'automated tests passing' },
          { n: '25', label: 'logged commits' }
        ], source: 'From the project’s build log. ≈ marks a figure reconstructed from the git history.' },
        { type: 'timeline', label: 'How it came together', items: [
          { when: 'Sep 11', text: 'Repo, plan and build log set up; the first change reviewed and approved.' },
          { when: 'Sep 17', text: 'Scheduler and 67 tests, calendar reading, parsing, the server, voice: a working first version.' },
          { when: 'Sep 18–22', text: 'Four AI providers to choose from, a rebuilt UI, a sign-in fix, and the macOS menu-bar app.' },
          { when: 'Sep 23', text: 'Final polish.' }
        ] }
      ] },

    /* 7. What broke (deck s.10) */
    { id: 'broke', nav: 'What broke', heading: 'What broke, and what I changed',
      text: 'Working with a real calendar and real AI services meant real problems.',
      blocks: [
        { type: 'fixes', items: [
          { title: 'The AI model disappeared', broke: 'The Gemini model I used was retired, and the free quota ran out mid-testing.', fix: 'Moved the AI layer to Groq, with parsing that copes with small format changes.' },
          { title: 'It could look but not touch', broke: 'Calendar access was read-only, so the agent could see my day but not change it.', fix: 'Widened the permission on purpose and signed in again.' },
          { title: 'Eight copies of one meeting', broke: 'Repeating “add a meeting 6:15–7:15” wrote 8 copies to my real calendar.', fix: 'Checks title and time before writing, safe retries, and 8 new tests.' },
          { title: 'The UI drifted', broke: 'The widget drifted from the mockup, and every click added another microphone listener.', fix: 'Rebuilt the frontend to the design and fixed the hidden bug.' }
        ] }
      ] },

    /* 8. Shipped (deck s.12, s.13) */
    { id: 'shipped', nav: 'Shipped', heading: 'Shipped',
      text: 'From the design mockup to a real app in the macOS menu bar, running on a real calendar.',
      blocks: [
        { type: 'pics', layout: 'mixed', items: [
          { src: 'mockup-phone.webp', width: 530, height: 820, caption: 'The design mockup',
            alt: 'Design mockup of the Wiglet card on a phone lock screen at 9:41, listing DESG319 Lecture, Lunch, UGSEM5 Seminar, essay homework and gym.' },
          { src: 'live-widget.webp', width: 1650, height: 720, caption: 'Live: a real class, and “no open time left today”, worked out correctly',
            alt: 'The real Wiglet card in the macOS menu bar: a real class, ADBR308_UGSEM7, 4:15 to 5:10, and no open time left today.' }
        ] },
        { type: 'pics', layout: '3', label: 'Your key, your calendar', items: [
          { src: 'signin-settings.webp', width: 730, height: 760, caption: 'Bring your own AI key: Groq, OpenAI or Anthropic.',
            alt: 'Wiglet’s settings panel: provider set to Groq, an empty API key field, the model openai/gpt-oss-120b, and Calendar connected.' },
          { src: 'signin-google.webp', width: 735, height: 660, caption: 'Google sign-in, with read and write access.',
            alt: 'Google’s consent screen asking to view and edit events on all your calendars. The account address is blurred.' },
          { src: 'signin-result.webp', width: 855, height: 520, caption: 'A new account’s calendar, loaded straight away.',
            alt: 'The Wiglet card showing AI ML Course from 2:00 to 6:00, fixed and synced, and no open time left today.' }
        ] }
      ] },

    /* 9. What's next (deck s.15) */
    { id: 'next', nav: 'What’s next', heading: 'What’s next',
      blocks: [
        { type: 'cards', cols: 3, items: [
          { title: 'An iOS app', text: 'A real lock-screen widget, with this backend behind it.' },
          { title: 'Reschedule emails', text: 'A Gmail skill that tells people when a plan moves.' },
          { title: 'Plans for the week', text: 'Tomorrow and the week ahead, not only today.' }
        ] }
      ] }
  ],

  next: { slug: 'codes', title: 'Codes' }
};
