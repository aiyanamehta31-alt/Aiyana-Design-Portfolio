/* =====================================================================
   CASE STUDY DATA · Nexo
   Nexo has its own world (js/worlds/nexo.js + css/worlds/nexo.css): its
   own colours, type, the heartbeat thread and the phase dock. This file
   holds only the words and pictures; the world lays them out as scenes.

   Sources (all in content/nexo/):
     deck   Nexo Final Presentation (1).pdf, page numbers given as p.N
     miro   PLAY_for_Gen_Alpha.pdf, page 1 (AEIOU field notes)
   Rule: nothing here is invented. Anything we don't know yet is written
   [NEEDS FROM AIYANA: ...] and shown marked on the page.
   ===================================================================== */
window.CASE_STUDIES = window.CASE_STUDIES || {};
window.CASE_STUDIES['nexo'] = {
  slug: 'nexo',
  title: 'Nexo',
  world: 'nexo',
  images: 'assets/images/projects/nexo/',

  /* The six phases, as a dog's day. The dock and the phase heads use these. */
  phases: [
    { id: 'whine', name: 'The whine', real: 'The problem' },
    { id: 'sniff', name: 'Sniffing around', real: 'Discover' },
    { id: 'scent', name: 'Picking up the scent', real: 'Define' },
    { id: 'fetch', name: 'Fetch', real: 'Develop' },
    { id: 'walkies', name: 'Walkies', real: 'Deliver' },
    { id: 'treat', name: 'Treat', real: 'Outcome and reflection' }
  ],

  /* 1. Cover (deck p2, p19) */
  cover: {
    logo: { src: 'nexo-logo.webp', width: 1800, height: 748 },
    tagline: 'A living bridge between you and your dog.',
    summary: 'A desk companion, a smart collar and an app that make room for shared play.',
    render: { src: 'cover-colourways-cutout.webp', width: 1800, height: 1944,
      alt: 'Three Nexo desk companions in orange, blue and black, each with a round face showing a blue blob.' },
    facts: [
      { label: 'My role', value: '[NEEDS FROM AIYANA: your role and the parts you personally did]' },
      { label: 'Team', value: '[NEEDS FROM AIYANA: team size and everyone on it]' },
      { label: 'App screens', value: 'Designed by [NEEDS FROM AIYANA: name(s)]' },
      { label: 'Project', value: 'Design thinking, 2025' },
      { label: 'Methods', value: 'Field observation, AEIOU, affinity mapping, personas, journey map, DVF scoring, CAD, 3D printing' }
    ]
  },

  /* 2. The whine: the opener (deck p3, p4, p9, p13) */
  opener: {
    owner: { src: 'sil-owner.webp', width: 648, height: 942, alt: '' },
    dog: { src: 'sil-dog.webp', width: 692, height: 819, alt: '' },
    wedge: 'Modern life',
    beats: [
      { time: '6 AM', text: 'A rushed walk, then work.' },
      { time: '3 PM', text: 'The dog waits by the door.' },
      { time: '6 PM', text: 'Reunited, but rushed.' }
    ],
    beatsSource: 'From our user journey map',
    heading: 'Play connects them. Busy lives interrupt it.',
    text: 'Both sides want more shared play, but have no way to sustain it.'
  },

  /* 3. Sniffing around: field research (deck p8, p12; miro p1) */
  field: {
    heading: 'We watched dogs where they actually live',
    text: 'Field observations at five sites, logged with the AEIOU framework: activities, environments, interactions, objects and users.',
    sites: [
      { name: 'Apartments', dog: 'Poligar Hound', note: 'Small spaces frustrate high-energy breeds.' },
      { name: 'Bakery', dog: 'Lhasa Apso (Prince)', note: 'New smells, sounds and people.' },
      { name: 'Café', dog: 'Lhasa Apso (Prince)', note: 'Calm, low-energy company.' },
      { name: 'Supermarket', dog: 'Terrier', note: 'Constant stimulation, not focused interaction.' },
      { name: 'College campus', dog: 'Campus dogs', note: 'Dogs find their own “certain spots” for security.' }
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
    photosCaption: 'Field observation photos',
    types: [
      { name: 'The Athlete', dogs: 'Poligar Hound', text: 'High physical and mental drive. Needs intense, purposeful activity.' },
      { name: 'The Socialite', dogs: 'Terrier, Indie', text: 'Thrives on human interaction and new things. Play is social.' },
      { name: 'The Companion', dogs: 'Lhasa Apso, Prince', text: 'Values calm closeness over vigorous activity. Play is bonding.' },
      { name: 'The Environmentalist', dogs: 'Campus dogs', text: 'Adapts to a large environment and regulates itself.' }
    ],
    owner: { name: 'The Guilty 9-to-5er', text: 'Loves their pet but is short on time and energy. Primary need: efficient ways to engage.' },
    aeiou: [
      { letter: 'A', name: 'Activities', tags: ['High-energy play', 'Routines', 'Destructive behaviours', 'Exploration'],
        finding: 'Ripping, chewing, pacing and whining show needs for activity that aren’t being met.' },
      { letter: 'E', name: 'Environments', tags: ['Apartments', 'Bakery and café', 'Supermarket', 'Campus'],
        finding: 'Dogs seek out “certain spots”: a specific bed, a corner, under a bench.' },
      { letter: 'I', name: 'Interactions', tags: ['Human and dog', 'Dogs and guests', 'Dog and objects', 'Dog and dog'],
        finding: 'Dogs demand interaction, barking and nudging to keep a good moment going.', beat: true },
      { letter: 'O', name: 'Objects', tags: ['Food and water', 'Leash', 'Play objects', 'Security spots'],
        finding: 'Food and treats are the strongest motivators. Play objects only work when a human joins in.' },
      { letter: 'U', name: 'Users', tags: ['The Athlete', 'The Socialite', 'The Companion', 'The Environmentalist'],
        finding: 'Four kinds of dog, and one kind of owner: the Guilty 9-to-5er.' }
    ],
    aeiouSource: 'From our AEIOU field notes'
  },

  /* 4. Sniffing around: quotes (deck p5–p6; affinity map Quotes cluster) */
  quotes: {
    heading: 'Guilty owners, and dogs who can’t ask',
    source: 'From our field research with dog owners',
    items: [
      { text: 'I wish I had more time to play with them.' },
      { text: 'I feel guilty when I can’t give them enough attention.' },
      { text: 'She is always super excited to see me come back home.' },
      { text: 'I play with him indoors rather than outdoors.' },
      { text: 'I want to spend more time with him, but I am usually so busy.' },
      { text: 'I think he prefers playing with me or humans in general.' },
      { text: 'I wished my dog could nudge me saying ‘I want to do this.’', key: true }
    ]
  },

  /* 5. Picking up the scent: affinity map (deck p7). Notes as written on
     the board; three we couldn't read clearly are left out. */
  affinity: {
    heading: 'Every sticky note, sorted into five clusters',
    text: 'Our observations and quotes, grouped on an affinity map. Two themes explained the rest.',
    original: { src: 'affinity-map.webp', width: 2400, height: 1350, caption: 'The original affinity map',
      alt: 'Affinity map with sticky notes grouped under Moments of Joy, Emotions, Behaviours, Quotes and Pain Points.' },
    clusters: [
      { name: 'Moments of joy', theme: 'Pets feel joy when interacting with objects or humans.', notes: [
        'Pets simulate outdoor activities inside the house: zoomies', 'Public places can be stimuli for dogs',
        'Gentle wagging when they see familiar humans', 'Love to be a part of human activities (walks, games, runs)',
        'Pet owners cuddle their pets instead of playing when they are tired', 'Play satisfies hunting drives in hounds',
        'Wag their tails when a human walks towards them', 'Enjoy playing with any basic physical items (rope, plastic)',
        'Open, tongue lolling when running', 'Owners do not have time to play with their dogs',
        'Pets get lazy too and less excited about things over time'] },
      { name: 'Emotions', theme: 'A communication barrier between pets and humans stops better interactions.', key: true, notes: [
        'People are guilty, but not enough to change their behaviour', 'Excited on seeing the human (wags tail)',
        'Wander around aimlessly a lot in the day (boredom)', 'Anticipation as food scraps around lunch, dinner or snack timings',
        'Dogs are very curious', 'Pets love physical attention', 'Food is a way to calm dogs down',
        'After finishing playing, dogs are happy (lay down, relaxed posture)', 'A second dog for the first one (companion)',
        'Pets feel lonely when not around other pets or humans', 'Patrons feel stressed about balancing pet time and other time',
        'Patrons feel guilty about not playing with their pets enough', 'Pet owners are constantly worried about their pets’ health',
        'Play reinforces trust in dogs', 'Humans feel guilty for not being able to give enough attention to pets',
        'Pets enjoy being next to their owners, even if not playing'] },
      { name: 'Behaviours', theme: 'Owners’ schedules come before pets’ preferences.', key: true, notes: [
        'Start whining for attention', 'Engagement play in an aggressive way, such as biting and pouncing',
        'Patrons relaxed after coming home instead of playing with their pet', 'Dogs bark when they see unfamiliar faces',
        'Territorial disputes amongst dogs towards night time', 'Designated spaces in the house for the pets',
        'Loud sounds tend to gain the attention of dogs', 'Understand your body language and respond to it, e.g. a high-pitched voice',
        'Lounge alone, most of the day, especially in the shade', 'Some lick between toes to cool off', 'Dogs play with their toys',
        'Circling around people, playful nips and mock chases with other dogs',
        'Patrons leave pets alone for long stretches of time while they are at work', 'Morning and evening walks are ritualistic',
        'Dogs like belly rubs and head pats', 'Retreat to shady spots under trees, benches or parked vehicles',
        'Kick slightly during short naps', 'Respond promptly to movement or motion', 'Ears swivel at distant sounds',
        'Pet owners try to make as much time for the pets as possible', 'Lounging in the sun',
        'Pets prefer interactive play with people rather than solo toys', 'If one dog runs and barks, others join in',
        'Only friendly with familiar faces', 'Highly reactive to sound', 'Dogs beg for attention',
        'Kids get scared of dogs in public places', 'Dogs tend to mark their spots',
        'Dogs get sleepy when they don’t get attention or take rest', 'Humans are unwilling to compromise on their lives for their pets'] },
      { name: 'Quotes', theme: '“I want to spend more time with him, but I am usually so busy.”', notes: [
        '“I wouldn’t say she enjoys it, but it’s the best option I have”', '“She enjoys bubble wrap more than puzzle toys”',
        '“It was about keep me engaged, but now it’s about give me toys”',
        '“My kids can come and nudge me to do things. I wished my dog nudge me saying ‘I want to do this.’”',
        '“Train your mind and train your nose”', '“I play with him indoors rather than outdoors”',
        '“I want to spend more time with him, but I am usually so busy”', '“She goes crazy from time to time running around the house”',
        '“I miss agility training. I don’t find proper equipment to do agility training”',
        '“How do you sensitize dogs to things that are necessary but also painful”', '“She starts digging into the tiles and keeps going”',
        '“Make it more engaging”', '“I got a dog behaviourist”', '“She is excited to see me come back home”',
        '“She wants to find a cat and every day I need to find her one at any cost”', '“I think he prefers playing with me or humans in general”'] },
      { name: 'Pain points', theme: 'Owners want to spend time with their pets but can’t, due to obligations.', notes: [
        'Pet owners are aware that their pets are bored when they are not around', 'Pet owners want to play but are too tired by daily responsibilities',
        'Owners are too tired to spend time with their pets', 'Pet owners have to control their pets in public',
        'Inconsistent engagement can erode progress', 'Quality play time heavily depends on family time schedules',
        'Coexistence ≠ attention and care', 'Pets don’t have a specific sleep schedule', 'Leashes can harm pets',
        'Reduced play = increased stress', 'Pets don’t understand why their owners are gone the whole day',
        'Lack of enough outdoor activity leads to pent-up energy, showing as minor destruction'] }
    ]
  },

  /* 6. Picking up the scent: personas and journey (deck p9, p11, p14, p15) */
  journey: {
    heading: 'Owner and dog hit their low point together, apart',
    text: 'Our persona Aisha and her dog Luna, followed from 6 AM to 9 PM. Both bottom out at 3 PM, in different places.',
    personas: [
      { name: 'Aisha Sharma', age: '32', lines: ['Works hybrid in Mumbai, long hours.', 'Lives in a small Bandra 1BHK with Luna.', 'Goal: effortless, meaningful bonding moments.'],
        quote: 'Luna’s my chaos cure, but I feel like her absent sidekick.', quoteLabel: 'Persona quote' },
      { name: 'Luna', age: '4', lines: ['Golden retriever; energetic, easily stimulated.', 'Needs regular activity and stimulation when alone.', 'Evenings: high-intensity play bursts.'] }
    ],
    /* Redrawn from the deck's emotion curve: 0 = low, 1 = high */
    slots: [
      { time: '6 AM', aisha: 'Stress and guilt', luna: 'Curious, slightly uneasy', a: 0.78, l: 0.52, pain: true },
      { time: '9 AM', aisha: 'Neutral, mild concern', luna: 'Calm, secure', a: 0.6, l: 0.7 },
      { time: '12 PM', aisha: 'Guilt and helplessness', luna: 'Mild boredom, restless', a: 0.38, l: 0.45, pain: true },
      { time: '3 PM', aisha: 'Emotional low point', luna: 'Bored, frustrated, lonely', a: 0.08, l: 0.12, pain: true, low: true,
        opportunity: 'Opportunity: micro-interactions during work.' },
      { time: '6 PM', aisha: 'Joy, with pressure', luna: 'Joy, relief', a: 0.92, l: 0.96 },
      { time: '9 PM', aisha: 'Calm, mild guilt', luna: 'Calm, secure', a: 0.6, l: 0.8 }
    ],
    originals: [
      { src: 'user-journey.webp', width: 2275, height: 1221, caption: 'Full user journey map',
        alt: 'User journey map from 6 AM to 9 PM with rows for action, touchpoints, emotion, an emotion curve, experience and opportunity, for both Aisha and Luna.' },
      { src: 'personas.webp', width: 2400, height: 1350, caption: 'Personas: Aisha and Luna',
        alt: 'Two personas: Aisha Sharma, 32, who works hybrid in Mumbai, and Luna, her 4-year-old golden retriever, with profile, goals, needs and behaviours.' },
      { src: 'empathy-map.webp', width: 1522, height: 1187, caption: 'Empathy map',
        alt: 'Empathy map with four quadrants, Say, Do, Think and Feel, filled with the owner’s words and feelings.' },
      { src: 'stakeholder-map.webp', width: 2400, height: 1349, caption: 'Stakeholder map',
        alt: 'Stakeholder map drawn as a bell curve, with core users at the centre, extended users and influencers around them, and extreme users at the edges.' }
    ]
  },

  /* 7. Picking up the scent: problem and HMW (deck p10, p13) */
  problem: {
    label: 'Problem statement',
    statement: 'It’s a lack of timely, shared play.',
    hmwLabel: 'How might we',
    hmw: 'How might we design experiences that allow connection, comfort and shared play for dogs and their owners?',
    keys: ['connection,', 'comfort', 'shared', 'play']
  },

  /* 8. Fetch: ideation and DVF (deck p16, p18) */
  ideation: {
    heading: 'Four concepts scored. Two joined into one.',
    text: 'Each concept was scored for desirability, viability and feasibility (DVF).',
    concepts: [
      { id: 'cube', name: 'Rubik’s Cube Play Unit', d: 3, v: 3, f: 4, src: 'concept-1.webp', width: 809, height: 806,
        alt: 'Sketch of a cube-shaped play unit with nine compartments, annotated furniture and storage.',
        fate: 'cut', reason: '[NEEDS FROM AIYANA: why the top-scoring concept was set aside]' },
      { id: 'breath', name: 'Breath-Powered Fetch', d: 1, v: 2, f: 4, src: 'concept-2.webp', width: 806, height: 806,
        alt: 'Sketch of two upright tubes, annotated blow and scent.',
        fate: 'cut', reason: 'Cut for its low score.' },
      { id: 'collar', name: 'Smart Collar', d: 4, v: 3, f: 1, src: 'concept-3.webp', width: 806, height: 806,
        alt: 'Sketch of a collar ring with a heartbeat trace, a happy and sad face, and paw prints around it.', fate: 'kept' },
      { id: 'ferro', name: 'Ferro Fluid Desk Companion', d: 4, v: 3, f: 2, src: 'concept-4.webp', width: 806, height: 806,
        alt: 'Sketch of a dog-like figure with floppy ears and a round face holding a ferrofluid blob.', fate: 'kept' }
    ],
    merge: { title: 'Desk companion + smart collar', reason: '[NEEDS FROM AIYANA: why these two were combined]' },
    sketches: [
      { src: 'idea-1.webp', width: 284, height: 281, alt: 'Sketch of a tall stacked play unit with a paw button.' },
      { src: 'idea-2.webp', width: 284, height: 281, alt: 'Sketch of a bone projected as a hologram.' },
      { src: 'idea-3.webp', width: 281, height: 281, alt: 'Sketch of an armchair joined to a dog house.' },
      { src: 'idea-4.webp', width: 281, height: 281, alt: 'Sketch of a dog’s face beside a bowl.' },
      { src: 'idea-5.webp', width: 281, height: 281, alt: 'Sketch of a dog, annotated tail mapping.' },
      { src: 'idea-6.webp', width: 284, height: 284, alt: 'Sketch of a spring launcher throwing balls for a dog, annotated spring fetch.' },
      { src: 'idea-7.webp', width: 284, height: 284, alt: 'Sketch of a grid-shaped mat.' },
      { src: 'idea-8.webp', width: 281, height: 284, alt: 'Sketch of a mat with circles, annotated twister for dogs.' },
      { src: 'idea-9.webp', width: 281, height: 284, alt: 'Sketch of a person walking a dog, annotated smart leash.' },
      { src: 'idea-10.webp', width: 281, height: 284, alt: 'Sketch of a dog with three buttons, annotated way to communicate.' },
      { src: 'ideation-session-1.webp', width: 808, height: 676, alt: 'Our team gathered round a table of prototypes during the ideation session.' },
      { src: 'ideation-session-2.webp', width: 811, height: 652, alt: 'Laptops and paper models on a table during the ideation session.' }
    ],
    sketchesCaption: 'Earlier ideas and the ideation session'
  },

  /* 9. Fetch: the form and the face (deck p20, p22) */
  form: {
    heading: 'From pencil to a printed, glowing face',
    text: 'Sketches became CAD, a foam mock-up, then a 3D print. An LED matrix and code gave it a face.',
    steps: [
      { label: 'Sketches', src: 'form-step-sketch.webp', width: 918, height: 1656, alt: 'Pencil sketches of a small dog-like body with a round face, from several angles.' },
      { label: 'CAD: the shell', src: 'form-step-cad-1.webp', width: 615, height: 720, alt: 'CAD render of a curved shell with a mesh surface.' },
      { label: 'CAD: the body', src: 'form-step-cad-2.webp', width: 615, height: 720, alt: 'CAD render of a rounded grey body with a ball head and a tail.' },
      { label: 'CAD: the face', src: 'form-step-cad-4.webp', width: 510, height: 720, alt: 'CAD render of the dark body with ears and a round face panel.' },
      { label: 'Foam mock-up', src: 'form-step-foam.webp', width: 850, height: 853, alt: 'A blue foam body with a yellow ball as the head, on a table.' },
      { label: '3D printing', src: 'form-step-printing.webp', width: 853, height: 853, alt: 'Three students watch a 3D printer at work.' },
      { label: 'The print', src: 'form-step-print.webp', width: 853, height: 853, alt: 'The blue 3D-printed Nexo body with a round face panel.', beat: true },
      { label: 'LED matrix', src: 'proto-led-circuit.webp', width: 1588, height: 1344, alt: 'A breadboard circuit with a microcontroller wired to an LED matrix on a desk.' },
      { label: 'The face, in code', src: 'proto-face-ui.webp', width: 716, height: 576, alt: 'The Nexo face interface: a blue blob inside a circle, with the readout IBI 692 ms, variability 21 percent.' }
    ]
  },

  /* 10. Walkies: the device (deck p19, p21) */
  device: {
    heading: 'Desk companion, smart collar, one app',
    text: 'Nexo sits on the owner’s desk. The collar stays with the dog, and the app brings the two together.',
    render: { src: 'cover-colourways-cutout.webp', width: 1800, height: 1944,
      alt: 'Three Nexo desk companions in orange, blue and black, each with a round face showing a blue blob.' },
    callouts: [
      { x: 0.82, y: 0.6, side: 'right', title: 'Round face screen', text: 'An animated blob, from the ferrofluid concept.' },
      { x: 0.6, y: 0.16, side: 'right', title: 'Dog-like form', text: 'Ears, a tail and four legs.' },
      { x: 0.2, y: 0.66, side: 'left', title: 'Three colours', text: 'Orange, blue and black.' }
    ],
    collars: [
      { src: 'collar-1.webp', width: 591, height: 561, alt: 'Cream smart collar with a metal clasp.' },
      { src: 'collar-2.webp', width: 585, height: 561, alt: 'Orange smart collar with a metal clasp.' },
      { src: 'collar-3.webp', width: 594, height: 561, alt: 'Green smart collar with a metal clasp.' },
      { src: 'collar-4.webp', width: 591, height: 561, alt: 'Navy smart collar with a metal clasp.' },
      { src: 'collar-5.webp', width: 591, height: 561, alt: 'Black smart collar with a metal clasp.' }
    ],
    collarsCaption: 'The smart collar in five colours'
  },

  /* 11. Walkies: the app (deck p23, p25, p26) */
  app: {
    heading: 'The app finds your best hour to play',
    text: 'It compares the dog’s activity with yours and suggests when you’re both most active.',
    credit: 'App screens designed by [NEEDS FROM AIYANA: name(s)]',
    screens: [
      { caption: 'Set a play goal', src: 'app-1.webp', width: 795, height: 1614, alt: 'App screen: adjust daily goal, set to 90 minutes of play per day, with quick presets.' },
      { caption: 'Remind at the best time', src: 'app-2.webp', width: 789, height: 1614, alt: 'App screen: reminder time of 5:00 PM, suggested from activity patterns, repeating Monday to Friday.' },
      { caption: 'Today’s play', src: 'app-3.webp', width: 789, height: 1614, alt: 'App screen: today’s play goal at 67 percent, 60 of 90 minutes, with heart rate, oxygen and activity readings.' },
      { caption: 'Best time together', src: 'app-4.webp', width: 792, height: 1614, alt: 'App screen: the dog’s and your activity through the day, with 5 to 6 PM highlighted as the best time to play together.', beat: true }
    ],
    prototype: { link: '', note: '[NEEDS FROM AIYANA: Figma prototype link, or “none”]' },
    video: { href: 'https://drive.google.com/file/d/1Sapj4Wv--YntSFVPO1xLCRfFYbcEdTJZ/view?usp=sharing',
      label: 'Watch the concept video', caption: 'Opens in Google Drive',
      poster: { src: 'video-still.webp', width: 1280, height: 720, alt: 'Video still: a man cups a labrador’s face in a sunlit living room.' } }
  },

  /* 12. Treat: outcome and reflection (deck p24, p3) */
  outcome: {
    heading: 'Designed to turn absence into presence',
    shifts: [['Guilt', 'Gentle invitations'], ['Absence', 'Presence'], ['One-sided awareness', 'Shared play']],
    points: [
      { title: 'Testing and feedback', text: '[NEEDS FROM AIYANA: what you got, or “none, leave it out”]' },
      { title: 'What I learned', text: '[NEEDS FROM AIYANA: one line, in your own words]' },
      { title: 'What I’d do next', text: '[NEEDS FROM AIYANA: one line]' }
    ]
  },

  /* Next project: { slug: 'other-project', title: 'Other project' }, or null */
  next: { slug: 'codes', title: 'Codes' }
};
