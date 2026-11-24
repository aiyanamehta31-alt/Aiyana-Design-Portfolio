/* =====================================================================
   CASE STUDY DATA · Nexo
   Laid out by js/worlds/nexo.js + css/worlds/nexo.css: one calm paper
   page that tells the project in order, in plain words, with the real
   photos, sketches, CAD and prototype videos as proof.

   Sources:
     content/nexo/            the deck (Nexo Final Presentation), PLAY_for_Gen_Alpha.pdf
     content/nexo-process/    Aiyana's process photos and the three prototype videos (2025-12)
     Aiyana's written brief   (project title, brief, HMW, users, how it works), 2026-11-24
   Rule: nothing here is invented. Anything we don't know yet is written
   [NEEDS FROM AIYANA: ...] and shown marked on the page.
   ===================================================================== */
window.CASE_STUDIES = window.CASE_STUDIES || {};
window.CASE_STUDIES['nexo'] = {
  slug: 'nexo',
  title: 'Nexo',
  world: 'nexo',
  images: 'assets/images/projects/nexo/',

  /* The parts of the page, in order. The glider lists these. */
  parts: [
    { id: 'overview', name: 'Overview' },
    { id: 'problem', name: 'The problem' },
    { id: 'research', name: 'Research' },
    { id: 'insights', name: 'Insights' },
    { id: 'ideas', name: 'Ideas' },
    { id: 'shape', name: 'Shaping it' },
    { id: 'prototype', name: 'Prototyping' },
    { id: 'how', name: 'How it works' },
    { id: 'final', name: 'Final design' },
    { id: 'reflect', name: 'What it changes' }
  ],

  /* Top of the page: the name, one line, the concept video, the facts */
  intro: {
    logo: { src: 'nexo-logo.webp', width: 1800, height: 748 },
    line: 'A desk companion and a smart collar that help busy owners and their dogs play together, even when they are apart.',
    tags: ['Product design', 'User research', '3D modelling', 'Prototyping'],
    video: { src: 'video/concept.mp4', caption: 'The concept video',
      poster: { src: 'video-still.webp', width: 1280, height: 720, alt: 'A man cups a labrador’s face in a sunlit living room.' },
      missing: '[NEEDS FROM AIYANA: export the concept video from Canva (slide 26) as an MP4]' },
    facts: [
      { label: 'My role', value: '[NEEDS FROM AIYANA: your role and the parts you personally did]' },
      { label: 'Team', value: '[NEEDS FROM AIYANA: team size and everyone on it]' },
      { label: 'Project', value: 'Design thinking, 2025' },
      { label: 'Tools', value: 'Miro, Fusion 360, 3D printing, an LED matrix and code' }
    ]
  },

  /* 1. Overview: the brief, who it's for */
  overview: {
    render: { src: 'cover-colourways-cutout.webp', width: 1800, height: 1944,
      alt: 'Three Nexo desk companions in orange, blue and black, each with a round face showing a blue blob.' },
    heading: 'The brief',
    text: [
      'When owners are at work, their dogs spend long hours alone, and owners feel guilty about it. Most pet tech only watches the dog through a camera or tracks numbers.',
      'Nexo turns that time apart into a chance to play. It notices when the dog needs attention and gently invites the owner to play, instead of just reporting data.'
    ],
    hmw: 'How might we help dogs and their owners stay connected, comfortable and playing together through the day, even when they are apart?',
    users: [
      { who: 'Owners', text: 'Aged 20 to 45, working full-time, hybrid or long hours, and away from home for long stretches.' },
      { who: 'Dogs', text: 'From 6 months to 10 years old, often in city apartments with little to do during the day.' },
      { who: 'Also', text: 'Family, dog walkers and carers who look after the dog, and vets and trainers who guide healthy play.' }
    ]
  },

  /* 2. The problem (deck p3, p4, p13; the process poster) */
  problem: {
    heading: 'The problem',
    text: 'We followed one owner and her dog through a normal day. Both of them want more time to play, but the day keeps getting in the way.',
    day: [
      { time: '6 AM', text: 'A rushed walk, then work.' },
      { time: '3 PM', text: 'The dog waits by the door. Both are at their lowest point.' },
      { time: '6 PM', text: 'Together again, but tired and rushed.' }
    ],
    insight: 'Play is the strongest link between dogs and their owners, but busy lives interrupt it.'
  },

  /* 3. Research (deck p5–p8, p12; miro p1; process photos) */
  research: {
    heading: 'Research',
    text: 'We started by mapping what play means, then went out to watch dogs where they actually spend their day, and talked to their owners.',
    proof: [
      { src: 'process/team-research.webp', width: 1600, height: 1200, note: 'sorting our photos and notes',
        alt: 'Two students sit on a bed covered in printed dog photos and notes, writing on them, with a laptop open on Miro in front.' },
      { src: 'process/miro-play.webp', width: 1600, height: 918, note: 'our first mind map: what is play?',
        alt: 'A Miro board with coloured sticky notes mapped around the word PLAY, joined by lines.' },
      { src: 'process/research-wall.webp', width: 1600, height: 900, note: 'the research wall',
        alt: 'A wall of research: a research plan, observation photos of dogs, an empathy map and many sticky notes grouped into clusters.' }
    ],
    places: ['Apartments', 'A bakery', 'A café', 'A supermarket', 'A college campus'],
    methods: [
      { name: 'Watching', text: 'Observing dogs and owners in five places, noted with the AEIOU method: activities, environments, interactions, objects and users.' },
      { name: 'Talking', text: 'Asking owners how they play with their dogs, and what gets in the way.' },
      { name: 'Photos', text: 'Photographing what we saw, to sort and compare later.' }
    ],
    photos: [
      { src: 'field-1.webp', width: 660, height: 777, alt: 'A spotted grey and white dog looks up with its mouth open, on a paved path.' },
      { src: 'field-2.webp', width: 660, height: 777, alt: 'An older woman in a wheelchair holds a beagle while a younger woman leans over them.' },
      { src: 'field-3.webp', width: 657, height: 777, alt: 'A golden-brown dog rests its head on a bed.' },
      { src: 'field-4.webp', width: 660, height: 777, alt: 'A woman on a sofa beside a small white curly-haired dog.' },
      { src: 'field-5.webp', width: 660, height: 777, alt: 'A cream dog lies on a tiled floor, twisting round to look at the camera.' },
      { src: 'field-6.webp', width: 660, height: 777, alt: 'A man pets a large black dog beside a garden gate.' },
      { src: 'field-7.webp', width: 660, height: 777, alt: 'A tan dog in a collar stands on a tiled floor with its mouth open.' },
      { src: 'field-8.webp', width: 657, height: 777, alt: 'A smiling young woman hugs a tan puppy at a café table.' }
    ],
    quotes: [
      'I wish I had more time to play with them.',
      'I feel guilty when I can’t give them enough attention.',
      'I want to spend more time with him, but I am usually so busy.',
      'I wished my dog could nudge me saying ‘I want to do this.’'
    ]
  },

  /* 4. Insights (deck p7, p9, p11, p14, p15) */
  insights: {
    heading: 'Insights',
    text: 'We put every note and quote on an affinity map and sorted them into groups. Two groups explained most of what we saw.',
    map: { src: 'affinity-map.webp', width: 2400, height: 1350, note: 'the affinity map',
      alt: 'Affinity map with sticky notes grouped under Moments of Joy, Emotions, Behaviours, Quotes and Pain Points.' },
    groups: [
      { name: 'Moments of joy', text: 'Dogs are happiest playing with people or simple objects.' },
      { name: 'Emotions', text: 'Dogs can’t tell owners what they need, and owners feel guilty.', key: true },
      { name: 'Behaviours', text: 'The owner’s schedule always comes before the dog’s.', key: true },
      { name: 'Quotes', text: '“I want to spend more time with him, but I am usually so busy.”' },
      { name: 'Pain points', text: 'Owners want to spend time with their dogs, but work and chores come first.' }
    ],
    tools: [
      { src: 'personas.webp', width: 2400, height: 1350, caption: 'Personas: Aisha, 32, and her dog Luna, 4',
        alt: 'Two personas: Aisha Sharma, 32, who works hybrid in Mumbai, and Luna, her 4-year-old golden retriever.' },
      { src: 'user-journey.webp', width: 2275, height: 1221, caption: 'Their day, hour by hour',
        alt: 'User journey map from 6 AM to 9 PM for both Aisha and Luna, with an emotion curve.' },
      { src: 'empathy-map.webp', width: 1522, height: 1187, caption: 'What the owner says, does, thinks and feels',
        alt: 'Empathy map with four quadrants, Say, Do, Think and Feel.' },
      { src: 'stakeholder-map.webp', width: 2400, height: 1349, caption: 'Everyone around the dog',
        alt: 'Stakeholder map with core users at the centre and other users around them.' }
    ],
    hmw: 'How might we design experiences that allow connection, comfort and shared play for dogs and their owners?'
  },

  /* 5. Ideas (deck p16, p18; the process poster) */
  ideas: {
    heading: 'Ideas',
    text: 'We sketched lots of ideas, then scored our top four on three questions: do people want it, could it work as a product, and can we build it?',
    sketches: [
      { src: 'idea-1.webp', width: 284, height: 281, alt: 'Sketch of a tall stacked play unit with a paw button.' },
      { src: 'idea-2.webp', width: 284, height: 281, alt: 'Sketch of a bone projected as a hologram.' },
      { src: 'idea-3.webp', width: 281, height: 281, alt: 'Sketch of an armchair joined to a dog house.' },
      { src: 'idea-4.webp', width: 281, height: 281, alt: 'Sketch of a dog’s face beside a bowl.' },
      { src: 'idea-5.webp', width: 281, height: 281, alt: 'Sketch of a dog, annotated tail mapping.' },
      { src: 'idea-6.webp', width: 284, height: 284, alt: 'Sketch of a spring launcher throwing balls for a dog.' },
      { src: 'idea-7.webp', width: 284, height: 284, alt: 'Sketch of a grid-shaped mat.' },
      { src: 'idea-8.webp', width: 281, height: 284, alt: 'Sketch of a mat with circles, annotated twister for dogs.' },
      { src: 'idea-9.webp', width: 281, height: 284, alt: 'Sketch of a person walking a dog, annotated smart leash.' },
      { src: 'idea-10.webp', width: 281, height: 284, alt: 'Sketch of a dog with three buttons, annotated way to communicate.' }
    ],
    scored: [
      { name: 'Rubik’s Cube play unit', want: 3, product: 3, build: 4, src: 'concept-1.webp', width: 809, height: 806,
        alt: 'Sketch of a cube-shaped play unit with nine compartments.', kept: false,
        why: '[NEEDS FROM AIYANA: why the top-scoring idea was set aside]' },
      { name: 'Breath-powered fetch', want: 1, product: 2, build: 4, src: 'concept-2.webp', width: 806, height: 806,
        alt: 'Sketch of two upright tubes, annotated blow and scent.', kept: false, why: 'Set aside for its low score.' },
      { name: 'Smart collar', want: 4, product: 3, build: 1, src: 'concept-3.webp', width: 806, height: 806,
        alt: 'Sketch of a collar ring with a heartbeat trace and paw prints around it.', kept: true },
      { name: 'Desk companion', want: 4, product: 3, build: 2, src: 'concept-4.webp', width: 806, height: 806,
        alt: 'Sketch of a dog-like figure with floppy ears and a round face holding a ferrofluid blob.', kept: true }
    ],
    merge: 'The desk companion and the smart collar became one system: Nexo.',
    mergeWhy: '[NEEDS FROM AIYANA: why these two were combined]',
    poster: { src: 'process/process-poster.webp', width: 900, height: 1600, note: 'our process poster',
      alt: 'A printed poster titled The Creative Process, with field photos, personas, AEIOU, the affinity map, the final insight and HMW, ideation sketches and dog sketches.' },
    session: [
      { src: 'ideation-session-1.webp', width: 808, height: 676, alt: 'Our team gathered round a table of prototypes during the ideation session.' },
      { src: 'ideation-session-2.webp', width: 811, height: 652, alt: 'Laptops and paper models on a table during the ideation session.' }
    ]
  },

  /* 6. Shaping it: sketch to CAD (deck p20; process photos) */
  shape: {
    heading: 'Shaping it',
    text: 'We wanted something small and friendly that looks like a dog. It started as loose sketches, then was built up in CAD one step at a time.',
    sketches: [
      { src: 'process/first-sketch.webp', width: 720, height: 1280, note: 'the first loose shape',
        alt: 'A loose pencil sketch of a round dog shape with ears and a tail.' },
      { src: 'form-step-sketch.webp', width: 918, height: 1656, note: 'finding the form',
        alt: 'Pencil sketches of a small dog-like body with a round face, from several angles.' }
    ],
    cad: [
      { src: 'process/cad-first.webp', width: 1280, height: 720, label: 'A ball for a head',
        alt: 'CAD model: a ball head on an oval body with four short legs and a tail.' },
      { src: 'process/cad-body.webp', width: 1280, height: 720, label: 'A rounder body',
        alt: 'CAD model from the side: a rounded body, ball head and tail.' },
      { src: 'process/cad-ears.webp', width: 1280, height: 720, label: 'Ears',
        alt: 'CAD model with floppy ears added to the head.' },
      { src: 'process/cad-face.webp', width: 900, height: 1600, label: 'The round face',
        alt: 'CAD model with a round screen set into the front of the head.' }
    ]
  },

  /* 7. Prototyping (deck p20, p22; process photos and videos) */
  prototype: {
    heading: 'Prototyping',
    text: 'We tested the shape in foam, 3D printed it, and built the face: an LED light that reacts, and a coded blob that moves on screen.',
    steps: [
      { title: 'Foam model', text: 'A quick foam version to check the size and shape.',
        media: [{ src: 'form-step-foam.webp', width: 850, height: 853, alt: 'A blue foam body with a yellow ball as the head, on a table.' }] },
      { title: '3D printing', text: 'Printing the body in the lab, then holding the first print.',
        media: [
          { src: 'process/printing.webp', width: 1600, height: 1200, alt: 'Three students watch a 3D printer at work in the lab.' },
          { video: 'video/print-turn.mp4', poster: 'process/poster-print-turn.webp', width: 464, height: 832, alt: 'A hand turns the white 3D-printed Nexo body to show it from every side.' },
          { src: 'process/print-in-hand.webp', width: 900, height: 1600, alt: 'The white 3D-printed Nexo beside an open hand, to show its size.' }
        ] },
      { title: 'The light', text: 'An LED panel that glows as a hand moves over it.',
        media: [
          { video: 'video/led-test.mp4', poster: 'process/poster-led-test.webp', width: 832, height: 464, alt: 'A hand moves over a white panel and a red LED glows through it.' },
          { src: 'proto-led-circuit.webp', width: 1588, height: 1344, alt: 'A breadboard circuit with a microcontroller wired to an LED matrix.' }
        ] },
      { title: 'The face, in code', text: 'The blob that lives on Nexo’s face, running on a laptop.',
        media: [
          { video: 'video/face-test.mp4', poster: 'process/poster-face-test.webp', width: 464, height: 832, alt: 'On a laptop screen, a dark blob inside a circle changes shape.' },
          { src: 'proto-face-ui.webp', width: 716, height: 576, alt: 'The Nexo face interface: a blue blob inside a circle, with a heart rate readout.' }
        ] },
      { title: 'The print', text: 'The finished body with its round face.',
        media: [{ src: 'form-step-print.webp', width: 853, height: 853, alt: 'The blue 3D-printed Nexo body with a round face panel.' }] }
    ]
  },

  /* 8. How it works (Aiyana's brief) */
  how: {
    heading: 'How it works',
    text: 'Nexo is two objects and an app that work together.',
    steps: [
      { title: 'The collar senses', text: 'A light collar that feels like a normal one. It measures the dog’s heart rate and movement to tell when the dog is resting, active or needs attention.',
        src: 'collar-2.webp', width: 585, height: 561, alt: 'Orange smart collar with a metal clasp.' },
      { title: 'The desk companion shows it', text: 'A small dog on the owner’s desk. Its face shows the dog’s energy as soft moving shapes, calm when the dog rests and livelier as it gets active.',
        src: 'cover-colourways-cutout.webp', width: 1800, height: 1944, alt: 'Three Nexo desk companions in orange, blue and black.' },
      { title: 'The app invites you to play', text: 'When the dog is restless for a while, Nexo gently suggests a play break, and the app finds the time of day when you are both most active.',
        src: 'app-4.webp', width: 792, height: 1614, alt: 'App screen showing the dog’s and your activity, with 5 to 6 PM as the best time to play.' }
    ],
    loop: 'The dog’s energy reaches the owner’s desk, and the owner’s play reaches the dog.'
  },

  /* 9. Final design (deck p19, p21, p23, p25) */
  final: {
    heading: 'Final design',
    render: { src: 'cover-colourways-cutout.webp', width: 1800, height: 1944,
      alt: 'Three Nexo desk companions in orange, blue and black, each with a round face showing a blue blob.' },
    points: [
      { title: 'A round face screen', text: 'Shows a moving blob, from the ferrofluid idea.' },
      { title: 'A dog-like shape', text: 'Ears, a tail and four legs, small enough for a desk.' },
      { title: 'Three colours', text: 'Orange, blue and black.' }
    ],
    collars: [
      { src: 'collar-1.webp', width: 591, height: 561, alt: 'Cream smart collar.' },
      { src: 'collar-2.webp', width: 585, height: 561, alt: 'Orange smart collar.' },
      { src: 'collar-3.webp', width: 594, height: 561, alt: 'Green smart collar.' },
      { src: 'collar-4.webp', width: 591, height: 561, alt: 'Navy smart collar.' },
      { src: 'collar-5.webp', width: 591, height: 561, alt: 'Black smart collar.' }
    ],
    collarsNote: 'the collar, in five colours',
    appNote: 'App screens designed by [NEEDS FROM AIYANA: name(s)]',
    screens: [
      { caption: 'Set a play goal', src: 'app-1.webp', width: 795, height: 1614, alt: 'App screen: a daily goal of 90 minutes of play.' },
      { caption: 'Get reminded at the best time', src: 'app-2.webp', width: 789, height: 1614, alt: 'App screen: a reminder at 5:00 PM, suggested from activity patterns.' },
      { caption: 'See today’s play', src: 'app-3.webp', width: 789, height: 1614, alt: 'App screen: today’s play goal at 67 percent, with heart rate and activity readings.' },
      { caption: 'Find your best time together', src: 'app-4.webp', width: 792, height: 1614, alt: 'App screen: 5 to 6 PM highlighted as the best time to play together.' }
    ],
    prototype: '[NEEDS FROM AIYANA: Figma prototype link, or “none”]'
  },

  /* 10. What it changes (deck p24) */
  reflect: {
    heading: 'What it changes',
    shifts: [['Guilt', 'Gentle invitations'], ['Absence', 'Presence'], ['Just watching', 'Playing together']],
    points: [
      { title: 'Testing and feedback', text: '[NEEDS FROM AIYANA: what you got, or “none, leave it out”]' },
      { title: 'What I learned', text: '[NEEDS FROM AIYANA: one line, in your own words]' },
      { title: 'What I’d do next', text: '[NEEDS FROM AIYANA: one line]' }
    ]
  },

  next: { slug: 'branding', title: 'Branding' }
};
