/* =====================================================================
   CASE STUDY DATA · Nexo
   One file per project. js/case-study.js renders it; no layout code here.

   Sections run in order. Each one has:
     id       used for the phase jump links and the lightbox groups
     tone     'mist' | 'taupe' | 'cloud' | 'sea' (the glass tint for this part)
     phase    'discover' | 'define' | 'develop' | 'deliver' to show it in the
              phase bar (leave it out for the cover, challenge, outcome)
     label    the small phase label above the heading
     heading  max 8 words
     text     max 2 short sentences (about 40 words)
     blocks   what follows, in order (see the block types in case-study.js)

   head     optional: 'split' | 'stack' | 'offset' (otherwise they rotate)

   Image layouts: 'full' | 'pair' | 'trio' | 'asym' (large + small) | 'compare'.
   Every image has src, width, height, alt and a caption (max 8 words).
   fit: 'contain' keeps a slide whole on a white mat instead of cropping it;
   position sets the crop (CSS object-position) when it is cropped.
   Anything wrapped in [PLACEHOLDER ...] is shown marked up on the page.
   ===================================================================== */
window.CASE_STUDIES = window.CASE_STUDIES || {};
window.CASE_STUDIES['nexo'] = {
  slug: 'nexo',
  title: 'Nexo',
  images: 'assets/images/projects/nexo/',

  /* 0. Cover: open on the final result */
  /* cutout: true for a transparent render that stands on the title */
  cover: {
    src: 'cover-colourways-cutout.webp', width: 1800, height: 1944, cutout: true,
    alt: 'Render of three Nexo desk companions in orange, blue and black, each with a round face showing a blue blob.'
  },
  tagline: 'A living bridge between you and your dog.',
  facts: [
    { label: 'Role', value: '[PLACEHOLDER: your role]' },
    { label: 'Timeline', value: '[PLACEHOLDER: e.g. 8 weeks, 2025]' },
    { label: 'Team', value: '[PLACEHOLDER: team size]' },
    { label: 'Tools', value: '[PLACEHOLDER: tools used]' }
  ],
  outcome: 'A desk companion, smart collar and app, prototyped and 3D printed.',

  sections: [
    /* 1. The challenge */
    {
      id: 'challenge', tone: 'mist', label: 'The challenge',
      heading: 'Busy lives leave little room for play',
      text: 'Play is the strongest connector between dogs and owners, but busy lifestyles interrupt it. Both sides want more shared play, but have no way to sustain it.',
      blocks: [
        { type: 'hmw', text: 'How might we design experiences that allow connection, comfort and shared play for dogs and their owners?' }
      ]
    },

    /* 2. Discover */
    {
      id: 'discover', tone: 'taupe', phase: 'discover', label: 'Discover',
      heading: 'Watching dogs and owners together',
      text: 'Field observations of dogs and their owners, sorted into an affinity map of joys, emotions, behaviours, quotes and pain points.',
      blocks: [
        { type: 'chips', items: ['Field observations', 'Affinity mapping', 'AEIOU framework', '[PLACEHOLDER: interviews? how many?]'] },
        { type: 'images', layout: 'trio', ratio: '5/6', items: [
          { src: 'field-dog-closeup.webp', width: 920, height: 1080, caption: 'Field observation, outdoors',
            alt: 'A spotted grey and white dog looks up at the camera with its mouth open.' },
          { src: 'field-family-dog.webp', width: 920, height: 1080, caption: 'A family with their dog',
            alt: 'An older woman in a wheelchair holds a beagle on her lap while a younger woman leans over them.' },
          { src: 'field-owner-puppy.webp', width: 916, height: 1080, caption: 'An owner holding her puppy',
            alt: 'A smiling young woman hugs a tan puppy to her chest.' }
        ] },
        { type: 'insights', items: [
          { text: 'Play is the strongest connector between dogs and owners.', source: 'Field observations' },
          { text: '“I wish I had more time to play with them.”', source: 'Owner quote' },
          { text: 'A communication barrier stops pets and humans interacting better.', source: 'Affinity map' }
        ] },
        { type: 'images', layout: 'asym', ratio: '16/9', items: [
          { src: 'affinity-map.webp', width: 2400, height: 1350, fit: 'contain', caption: 'Affinity map: five clusters of findings',
            alt: 'Affinity map with sticky notes grouped under Moments of Joy, Emotions, Behaviours, Quotes and Pain Points.' },
          { src: 'aeiou.webp', width: 1788, height: 1277, fit: 'contain', caption: 'AEIOU: activities, spaces and interactions',
            alt: 'AEIOU chart listing activities, environments, interactions, objects and users, such as high energy play, indoor spaces and human to dog.' }
        ] }
      ]
    },

    /* 3. Define */
    {
      id: 'define', tone: 'cloud', phase: 'define', label: 'Define',
      heading: 'One day, seen by owner and dog',
      text: 'A user journey follows Aisha and her dog Luna from 6 AM to 9 PM. Both hit their emotional low point mid-afternoon, apart.',
      blocks: [
        { type: 'images', layout: 'full', items: [
          { src: 'user-journey.webp', width: 2275, height: 1221, fit: 'contain', caption: 'User journey, 6 AM to 9 PM',
            alt: 'User journey map from 6 AM to 9 PM with rows for action, touchpoints, emotion, an emotion curve, experience and opportunity, for both Aisha and Luna.' }
        ] },
        { type: 'images', layout: 'asym', ratio: '16/9', items: [
          { src: 'personas.webp', width: 2400, height: 1350, fit: 'contain', caption: 'Personas: Aisha, 32, and Luna, 4',
            alt: 'Two personas: Aisha Sharma, 32, who works hybrid in Mumbai, and Luna, her 4-year-old golden retriever, with profile, goals, needs and behaviours.' },
          { src: 'empathy-map.webp', width: 1522, height: 1187, fit: 'contain', caption: 'Empathy map: say, do, think, feel',
            alt: 'Empathy map with four quadrants, Say, Do, Think and Feel, filled with the owner’s words and feelings.' }
        ] },
        { type: 'images', layout: 'full', items: [
          { src: 'stakeholder-map.webp', width: 2400, height: 1349, fit: 'contain', caption: 'Stakeholder map: core to extreme users',
            alt: 'Stakeholder map drawn as a bell curve, with core users at the centre, extended users and influencers around them, and extreme users at the edges, listed beside it: busy dog owners, family members, dog walkers, trainers, and dogs with separation anxiety.' }
        ] },
        { type: 'statement', label: 'Problem statement', text: 'It’s a lack of timely, shared play.' }
      ]
    },

    /* 4. Develop */
    {
      id: 'develop', tone: 'cloud', phase: 'develop', label: 'Develop', head: 'stack',
      heading: 'Four concepts, scored, then combined',
      text: 'Four concepts were sketched and scored for desirability, viability and feasibility (DVF). Two merged into one system, then the form moved from sketch to 3D print.',
      blocks: [
        { type: 'compare', ratio: '16/9',
          before: { src: 'ideation-dvf.webp', width: 2180, height: 1185, fit: 'contain', caption: 'Four concepts with DVF scores',
            alt: 'Ideation slide with four sketched concepts, Rubik’s Cube Play Unit, Breath-Powered Fetch, Smart Collar and Ferro Fluid Desk Companion, each with a DVF score, and photos of the ideation session.' },
          after: { src: 'concept-merge.webp', width: 1982, height: 944, fit: 'contain', caption: 'Desk companion plus Smart Collar',
            alt: 'Sketch of the Ferro Fluid Desk Companion plus a sketch of the Smart Collar, joined by a plus sign.' },
          note: 'The Ferro Fluid desk companion joined the Smart Collar. [PLACEHOLDER: one line on why these two, over the Rubik’s Cube unit (DVF 10)]' },
        { type: 'compare', ratio: '5/4',
          before: { src: 'form-sketches.webp', width: 1252, height: 2252, fit: 'contain', caption: 'Early form sketches',
            alt: 'Pencil sketches of a small dog-like body with a round face, drawn from several angles.' },
          after: { src: 'form-3d-print.webp', width: 1184, height: 1180, caption: 'The 3D-printed Nexo body',
            alt: 'A blue 3D-printed Nexo body with a round face panel, standing on a wooden table.' },
          note: 'Sketches were developed through CAD models and a foam mock-up into a 3D print.' },
        { type: 'images', layout: 'trio', ratio: '6/5', items: [
          { src: 'proto-led-circuit.webp', width: 1588, height: 1344, caption: 'LED matrix wired on a breadboard',
            alt: 'A breadboard circuit with a microcontroller wired to an LED matrix on a desk.' },
          { src: 'proto-face-ui.webp', width: 716, height: 576, fit: 'contain', mat: 'mist', caption: 'The face UI, reading IBI and variability',
            alt: 'Screen of the Nexo face interface: a soft blue blob inside a circle, with the readout IBI 692 ms, variability 21 percent, a list of readings and a Stop Breathing button.' },
          { src: 'proto-led-face.webp', width: 1612, height: 1344, caption: 'Testing the LED face with code',
            alt: 'A laptop showing code next to a breadboard and an LED matrix glowing blue.' }
        ] }
      ]
    },

    /* 5. Deliver */
    {
      id: 'deliver', tone: 'sea', phase: 'deliver', label: 'Deliver', head: 'split',
      heading: 'Nexo: companion, collar and app',
      text: 'A desk companion with an animated face, a smart collar for the dog, and an app that finds the best time to play together.',
      blocks: [
        { type: 'horizon' },
        { type: 'images', layout: 'asym', ratio: '1/1', items: [
          { src: 'cover-three-nexos.webp', width: 905, height: 1280, position: '50% 80%', caption: 'The Nexo family, face on',
            alt: 'Three rendered Nexo desk companions, orange, black and blue, standing side by side, each with a round face showing a blue blob.' },
          { src: 'render-side.webp', width: 375, height: 666, fit: 'contain', mat: 'mist', caption: 'Side view render',
            alt: 'Side view render of a dark grey Nexo with a tilted round face and a short tail.' }
        ] },
        { type: 'images', layout: 'full', items: [
          { src: 'smart-collar.webp', width: 2104, height: 537, fit: 'contain', caption: 'The Smart Collar in five colours',
            alt: 'Five Smart Collar bands in cream, orange, green, navy and black, each with a metal clasp.' }
        ] },
        { type: 'images', layout: 'full', items: [
          { src: 'app-screens.webp', width: 2084, height: 938, fit: 'contain', caption: 'App: play goals, reminders and activity',
            alt: 'Four app screens: adjusting a daily play goal of 90 minutes, a reminder time of 5:00 PM, today’s play goal at 67 percent, and the best time to play together.' }
        ] },
        { type: 'video', href: 'https://drive.google.com/file/d/1Sapj4Wv--YntSFVPO1xLCRfFYbcEdTJZ/view?usp=sharing',
          label: 'Watch the concept video', caption: 'Concept video (opens Google Drive)',
          poster: { src: 'video-still.webp', width: 1280, height: 720,
            alt: 'Video still: a man cups a labrador’s face in a sunlit living room.' } }
      ]
    },

    /* 6. Outcome and reflection */
    {
      id: 'outcome', tone: 'sea', label: 'Outcome',
      heading: 'What Nexo is designed to change',
      text: '[PLACEHOLDER: one line on results or feedback, if you have any]',
      blocks: [
        { type: 'shifts', label: 'The shift it designs for', items: [
          ['Guilt', 'Gentle invitations'],
          ['Absence', 'Presence'],
          ['One-sided awareness', 'Shared play']
        ] },
        { type: 'points', items: [
          { title: 'What I learned', text: '[PLACEHOLDER: one or two lines on what you learned]' },
          { title: 'What I’d do next', text: '[PLACEHOLDER: your next step for Nexo]' }
        ] }
      ]
    }
  ],

  /* 7. Next project: { slug: 'other-project', title: 'Other project' }, or null */
  next: null
};
