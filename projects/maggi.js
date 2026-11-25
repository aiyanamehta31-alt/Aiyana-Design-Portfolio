/* =====================================================================
   CASE STUDY DATA · Maggi Nouilles Masala, a market entry for France
   Laid out by the story world (js/worlds/story.js + css/worlds/story.css):
   one calm page, the project in order, in plain words, with the real
   work and the ideas that didn't make it as proof.

   Sources (rebuilt 2026-11-25):
     The course brief (DESG261 Brief 02/10, FLAME University, 2026)
     The team's Google Drive folder "Final Group Assignment 3": Research
       Document, Research Insights, Campaign Platform, Packaging Design
       Rationale, Marketing Strategy Document, The 6 Hard Questions, Failed
       Output (with the Flora AI boards) and the three final posters
     content/maggi/ and content/maggi-story/ (Aiyana's own images)
   Rule: nothing here is invented. Unknowns are [NEEDS FROM AIYANA: ...].
   Numbers are quoted from the team's research document, with its sources.
   ===================================================================== */
window.CASE_STUDIES = window.CASE_STUDIES || {};
window.CASE_STUDIES['maggi'] = {
  slug: 'maggi',
  title: 'Maggi',
  world: 'story',
  images: 'assets/images/projects/maggi/',

  /* Maggi's own system, from the Campaign Platform */
  theme: { tone: 'maggi', glider: 'st-glider--maggi' },

  top: {
    title: 'Maggi in France',
    line: 'Bringing Maggi’s masala noodles into French supermarkets, as something that already feels at home there.',
    tags: ['Brand campaign', 'Packaging', 'Retail', 'AI workflow'],
    film: { src: 'show-walkthrough.mp4?v=2', caption: 'a walk past our final display',
      poster: { src: 'show-walkthrough-poster.webp', width: 1280, height: 720, alt: 'Our final display: three yellow Maggi posters, the boxes and a red pot on a table.' } },
    facts: [
      { label: 'Course', value: 'DESG261 Special Topics in Design, FLAME University' },
      { label: 'When', value: 'Semester 4, 2026' },
      { label: 'Team', value: 'Akshath Pissay, Aiyana Mehta, Divyanshi Jain, Sourajeet Das' },
      { label: 'My role', value: '[NEEDS FROM AIYANA: the parts you made]' },
      { label: 'Tools', value: 'Illustrator, Flora AI (Flux 2, Nano Banana 2, GPT Image 2), Claude, Manus' }
    ]
  },

  sections: [
    /* 1. The brief */
    { id: 'brief', nav: 'The brief', heading: 'The brief',
      text: 'Our class brief: launch Maggi’s masala noodles in France, and move them out of the “world foods” aisle into everyday supermarkets like Carrefour, Monoprix and Franprix.',
      blocks: [
        { type: 'box', tone: 'red', label: 'The catch', big: 'In France, convenience food feels like a failure, not a choice. The campaign had to earn permission, not just shelf space.' },
        { type: 'cards', cols: 2, label: 'Who it’s for', items: [
          { title: 'Main audience', text: 'Students and young professionals, 19 to 28, in Paris, Lyon and Marseille. Short on time and money, curious about new flavours, but wary of processed food.' },
          { title: 'Also', text: 'French-Indian and South Asian families, 28 to 45, who already know Maggi and can help introduce it.' }
        ] },
        { type: 'cards', cols: 3, label: 'Three problems to solve', items: [
          { title: 'Convenience is a dirty word', text: 'French food culture sees quick food as a moral failure. Speed alone won’t sell it.' },
          { title: 'The flavour is unfamiliar', text: 'Masala is mild in India but bold in France. It must not feel exotic or like homework.' },
          { title: 'Maggi means something else here', text: 'In France, Maggi is known for its liquid seasoning, in kitchens since the 1800s. Not for noodles.' }
        ] },
        { type: 'chips', label: 'The rules', tone: 'red', items: ['No Indian cooking or cultural signs', 'No “2-minute” speed claim', 'No students eating noodles at midnight', 'Keep Maggi’s yellow and red'] },
        { type: 'list', label: 'What we had to make', numbered: true, items: [
          { title: 'A campaign idea', text: 'One brand idea, a tagline and a visual language.' },
          { title: 'Three posters', text: 'One in French, one for the Paris Métro.' },
          { title: 'A new 70g pack', text: 'Front and back, with the EU nutrition label and French ingredients.' },
          { title: 'In-store sampling', text: 'A tasting cup, a counter display and a recipe card.' },
          { title: 'A marketing strategy', text: 'When to launch, where, and with whom.' }
        ] },
        { type: 'pics', layout: 'narrow', items: [
          { src: 'story/brief.webp', width: 693, height: 1600, note: 'the brief we were given', alt: 'The full course brief: Maggi 2-Minute Noodles Masala, market entry campaign for France, with the objective, audience, problems, deliverables and rules.' }
        ] }
      ] },

    /* 2. Research */
    { id: 'research', nav: 'Research', heading: 'Research',
      text: 'We researched six areas: the market, how young French people eat, the brands we were up against, culture and media, the rules on packaging, and other foreign brands that made it in France.',
      blocks: [
        { type: 'stats', items: [
          { n: '18%', label: 'of French homes buy instant noodles, against 74% in the UK.' },
          { n: '42%', label: 'of weeknight dinners in French cities are made in under 15 minutes.' },
          { n: '67%', label: 'of French 20 to 35 year olds call themselves cooking enthusiasts.' }
        ], source: 'From our research document (Euromonitor, CREDOC and survey figures, as cited there).' },
        { type: 'p', text: 'So the French already eat fast on weeknights. They just don’t eat instant noodles while doing it. It wasn’t a lack of demand. It was a lack of permission.' },
        { type: 'compare', label: 'Where the noodles sit today', items: [
          { title: 'Produits du monde', sub: 'The world foods aisle', text: 'Where most instant noodles live now, next to Asian sauces. It makes them feel foreign and niche.', bad: true },
          { title: 'Repas express', sub: 'The quick meals aisle', text: 'Where French ready meals and Lustucru live. This is where Maggi needed to be.' }
        ] },
        { type: 'cards', cols: 3, label: 'Who else is on the shelf', items: [
          { title: 'Lustucru', text: 'Safe and familiar, but plain.' },
          { title: 'Knorr', text: 'Warm, but thin.' },
          { title: 'Indomie', text: 'Interesting, but niche.' }
        ] },
        { type: 'box', tone: 'yellow', big: 'Nobody owned quick, genuinely interesting, and a choice you make for yourself. That gap became ours.' }
      ] },

    /* 3. Insights */
    { id: 'insights', nav: 'Insights', heading: 'Insights',
      text: 'From all of that, a few findings shaped every decision we made.',
      blocks: [
        { type: 'cards', cols: 2, numbered: true, items: [
          { title: 'Borrow the trust', text: 'Maggi’s seasoning has been in French kitchens since 1886. The yellow and red are the bridge between that bottle and the noodles.' },
          { title: 'People eat it, but don’t admit it', text: 'Young French people love food, eat alone on weeknights, and feel guilty about quick meals. The tone had to be recognition, never judgement.' },
          { title: 'Say the taste, not the place', text: 'Calling it “exotic” or “Indian” drops interest. Warm, deep and aromatic makes it wanted.' },
          { title: 'Make the private meal worth it', text: 'The dinner nobody sees is the real moment. Tonight, just for me.' },
          { title: 'The shelf is the first campaign', text: 'The pack has to look at home in the quick meals aisle, not the world foods aisle.' },
          { title: 'Be honest about health', text: 'Show the Nutri-Score openly. Frame it as an occasional treat, not a daily meal.' }
        ] },
        { type: 'box', tone: 'red', label: 'In one sentence', big: 'Whoever buys Maggi in France should feel they made a curious, clever choice, not a lazy one.' }
      ] },

    /* 4. The idea */
    { id: 'idea', nav: 'The idea', heading: 'The idea',
      text: 'Maggi isn’t entering France. It’s becoming French. The product doesn’t announce where it’s from; it simply acts like it has always lived there.',
      blocks: [
        { type: 'tagline', text: 'Ce soir, c’est ça.', translation: 'Tonight, this is it.',
          note: 'French because the campaign speaks French first. “C’est ça” means yes, exactly this, no more explaining needed.' },
        { type: 'list', label: 'Three posters, three ways of saying it', items: [
          { title: 'Ce soir, c’est ça.', text: 'The noodles in a beret. The decision is made.' },
          { title: 'Un Parisien comme les autres.', text: 'A noodle with a moustache, out for a walk. It belongs here.' },
          { title: 'Ce soir, juste pour toi.', text: 'The box as a building. A meal on your own terms.' }
        ] }
      ] },

    /* 5. Look and feel (Campaign Platform, Packaging Rationale) */
    { id: 'look', nav: 'Look and feel', heading: 'Look and feel',
      text: 'A small, strict system, so every poster, pack and display reads as the same campaign.',
      blocks: [
        { type: 'swatches', items: [
          { hex: '#F8CD04', name: 'Maggi yellow', text: 'The main field everywhere. It borrows trust from the yellow seasoning bottle.' },
          { hex: '#A6291E', name: 'Maggi red', text: 'The logo, the price and the lower band. Deeper than usual, so it feels less like a sale.' },
          { hex: '#FFFFFF', name: 'White', text: 'Only what’s needed. Three colours, nothing else.' }
        ] },
        { type: 'fonts', items: [
          { family: '"Bebas Neue", Impact, sans-serif', name: 'Bebas Neue', use: 'Headlines and the product name', sample: 'NOUILLES MASALA' },
          { family: '"Acumin Pro", "Funnel Sans", system-ui, sans-serif', name: 'Acumin Variable Concept', use: 'Body text and all the small print', sample: 'Ce soir, c’est ça.' }
        ] },
        { type: 'cards', cols: 3, label: 'How every image works', items: [
          { title: 'One object on yellow', text: 'Always the product, or part of it: noodles, a fork, a box.' },
          { title: 'Something unexpected', text: 'A beret on the noodles. A box that becomes a building. The second look is the brand moment.' },
          { title: 'Real, warm light', text: 'Photoreal, never illustrated. One warm light from the upper left.' }
        ] }
      ] },

    /* 6. How we made it (the brief asked for an AI workflow) */
    { id: 'making', nav: 'How we made it', heading: 'How we made it',
      text: 'The brief asked us to use at least three AI tools and show the workflow. We generated and compared ideas on Flora, using Flux 2, Nano Banana 2 and GPT Image 2, with Claude helping write the prompts. Then we put the final posters and pack together in Illustrator.',
      blocks: [
        { type: 'pics', layout: '2', items: [
          { src: 'story/flora-2.webp', width: 1600, height: 1242, note: 'a Flora board: one idea, many versions', alt: 'A Flora AI board of linked image nodes: Maggi metro poster versions made with Nano Banana 2 and GPT Image 2.' },
          { src: 'story/flora-4.webp', width: 1600, height: 980, note: 'pack ideas, with prompts written in Claude', alt: 'A Flora AI board with Claude prompt nodes leading to many Maggi box designs with faces.' }
        ] },
        { type: 'pics', layout: '2', items: [
          { src: 'making-illustrator.webp', width: 2400, height: 1800, note: 'finishing the posters and pack in Illustrator', alt: 'A laptop in Illustrator with the yellow poster artboards and the Maggi box.' },
          { src: 'story/pack-in-illustrator.webp', width: 1280, height: 831, note: 'the pack front, built by hand', alt: 'Illustrator with the Nouilles Masala box front: the Maggi logo, a 1€ badge and noodles.' }
        ] }
      ] },

    /* 7. What didn't work (the brief asked for failed outputs and what we learned) */
    { id: 'fails', nav: 'What didn’t work', heading: 'What didn’t work',
      text: 'Most of what we made didn’t make it. Here are the directions we dropped, and what each one taught us.',
      blocks: [
        { type: 'fails', items: [
          { title: 'Dark, moody noodles',
            what: 'We treated the noodles like building blocks for art, and swapped Maggi yellow for dark, moody light. The ads became confusing puzzles, and it wasn’t clear what we were selling.',
            learned: 'Food has to look like food, and the yellow has to stay.',
            images: [{ src: 'story/flora-1.webp', width: 1600, height: 877, alt: 'A grid of dark AI images: noodles as sculptures, coins, clocks and buildings, lit like a gallery.' }] },
          { title: 'The Métro idea',
            what: 'We tried posters and installations for the metro, but Maggi itself got lost in the scene. The AI also misspelled the name and drifted to London.',
            learned: 'The product has to be the hero, and every AI output needs checking.',
            images: [
              { src: 'story/metro-platform.webp', width: 764, height: 1024, alt: 'An AI image of a yellow Maggi noodle map poster on a London Underground platform, with Maggi misspelled as Maggie.' },
              { src: 'story/metro-map.webp', width: 764, height: 1024, alt: 'An AI poster titled The Maggie Noodle Network, a map of noodle routes across London.' }
            ] },
          { title: 'The old packet',
            what: 'Our first ideas used the old Maggi packet. When we moved them to the new box, they didn’t look as good.',
            learned: 'Design for the real final format from the start.',
            images: [{ src: 'story/flora-3.webp', width: 1600, height: 911, alt: 'A Flora board of AI images: the old Maggi packet opened up into tiny glowing rooms, with the line Ce soir, c’est ça.' }] },
          { title: '“Épuisé”, the tired face',
            what: 'A pack with a tired face, “épuisé” means exhausted. It was fun, but it forgot the pack’s real job: the 1€ price. And the AI back of pack came out as nonsense French.',
            learned: 'Every pack has to carry the main message, and AI text always needs a human check.',
            images: [
              { src: 'story/epuise-face.webp', width: 874, height: 990, alt: 'A yellow Maggi pack with a big tired cartoon face, the word Épuisé down the side and a bowl of steaming noodles.' },
              { src: 'story/epuise-back.webp', width: 1167, height: 1280, alt: 'An AI-made back of pack in French where the ingredients and text are garbled nonsense words.' }
            ] }
        ] },
        { type: 'pics', layout: '4', label: 'Other directions we tried', items: [
          { src: 'story/idea-paris-tag.webp', width: 960, height: 1280, alt: 'A noodle bent into a safety pin, holding a sketched Paris tag with the Eiffel Tower and Café de Flore.' },
          { src: 'story/idea-noodle-tower.webp', width: 960, height: 1280, alt: 'A single wavy noodle standing upright with a tiny Eiffel Tower on top, on yellow.' },
          { src: 'story/idea-paris-bowl.webp', width: 960, height: 1280, alt: 'A yellow Maggi bowl with a tiny sketched Paris, Eiffel Tower and all, built on top of the noodles.' },
          { src: 'story/idea-bowl-balloon.webp', width: 960, height: 1280, alt: 'A Maggi noodle bowl floating like a balloon, carrying a sketched Paris building on strings.' }
        ] },
        { type: 'pics', layout: 'small', label: 'Épuisé, in more detail', items: [
          { src: 'story/epuise-steam.webp', width: 1246, height: 1376, alt: 'Another Épuisé pack: the tired face with steam made of real noodles.' },
          { src: 'story/epuise-net.webp', width: 1024, height: 559, alt: 'An AI-made box net layout for the Épuisé pack, with panel sizes in millimetres.' }
        ] }
      ] },

    /* 8. The posters (Final Posters folder) */
    { id: 'posters', nav: 'The posters', heading: 'The posters',
      text: 'Three posters, one object each, all on Maggi yellow.',
      blocks: [
        { type: 'pics', layout: '3', items: [
          { src: 'story/poster-1-sm.webp', width: 720, height: 964, caption: 'Ce soir, c’est ça.', alt: 'Poster: a fork twirled with masala noodles wearing a black beret, under the line Ce soir, c’est ça.' },
          { src: 'story/poster-2-sm.webp', width: 720, height: 964, caption: 'Un Parisien comme les autres.', alt: 'Poster: a single noodle with a moustache walking along, under the line Un Parisien comme les autres.' },
          { src: 'story/poster-3-sm.webp', width: 720, height: 964, caption: 'Ce soir, juste pour toi.', alt: 'Poster: the Maggi box opened up like two tall buildings, with a tiny diner and two people at a table between them, under the line Ce soir, juste pour toi.' }
        ] }
      ] },

    /* 9. The pack (Packaging Design Rationale) */
    { id: 'pack', nav: 'The pack', heading: 'The pack',
      text: 'We changed the foil packet into a small box. In French shops the format decides the aisle: packets go to world foods, boxes go to quick meals.',
      blocks: [
        { type: 'pics', layout: '2', items: [
          { src: 'pack-front.webp', width: 1169, height: 1280, note: 'the front', alt: 'The front of the yellow Maggi Nouilles Masala box: the logo, a red 1€ badge, noodles and Ce soir, c’est ça.' },
          { src: 'pack-diner-ladder.webp', width: 896, height: 1200, note: 'a world inside the box', alt: 'The Maggi box with a window in its side showing a tiny lit diner, and a little figure on a ladder.' }
        ] },
        { type: 'cards', cols: 2, label: 'Why it looks like this', items: [
          { title: 'A box, not a packet', text: '115 × 105 × 30 mm. It puts Maggi next to Lustucru and Knorr, not in the world foods aisle.' },
          { title: '1€ instead of “2 minutes”', text: 'French shoppers care more about value and taste than speed. Cooking time moves to the back.' },
          { title: 'Nutri-Score C, shown openly', text: 'Hiding it would cost trust. It’s an occasional treat, and the pack says so honestly.' },
          { title: 'French first', text: 'French copy on the front, and a back that meets EU labelling rules.' }
        ] },
        { type: 'pics', layout: 'wide', items: [
          { src: 'dieline.webp', width: 1280, height: 763, note: 'the dieline: front, sides, cooking steps and nutrition', alt: 'The flat dieline of the Maggi Nouilles Masala box with the front, sides, cooking steps and nutrition table.' }
        ] }
      ] },

    /* 10. In the store (Marketing Strategy: retail rollout and sampling) */
    { id: 'store', nav: 'In the store', heading: 'In the store',
      text: 'Where the pack would live: on the counter first, then the end of the quick meals aisle, with a tasting cup and a recipe card to try it.',
      blocks: [
        { type: 'pics', layout: '2', items: [
          { src: 'store-eiffel.webp', width: 612, height: 852, note: 'boxes stacked into the Eiffel Tower', alt: 'Maggi boxes stacked into an Eiffel Tower in a supermarket aisle.' },
          { src: 'store-display.webp', width: 1248, height: 1248, note: 'a floor stand with the 1€ badge', alt: 'A red and yellow Maggi floor stand full of boxes in a supermarket.' }
        ] },
        { type: 'pics', layout: '3', items: [
          { src: 'store-shelf.webp', width: 1248, height: 1248, caption: 'On the shelf', alt: 'Rows of Maggi boxes on a supermarket shelf with a 1€ price tag.' },
          { src: 'store-checkout.webp', width: 1248, height: 1248, caption: 'At the till', alt: 'A Maggi box on a checkout belt beside vegetables.' },
          { src: 'store-basket.webp', width: 832, height: 1152, caption: 'In the basket', alt: 'Looking down into a blue shopping basket at a Maggi poster of a noodle fork in a beret.' }
        ] },
        { type: 'pics', layout: '2', label: 'Sampling', items: [
          { src: 'cup.webp', width: 1024, height: 1024, caption: 'The tasting cup', alt: 'A yellow paper cup with a steaming noodle shaped like a hook, wearing a moustache.' },
          { src: 'card-noodle-chef.webp', width: 1200, height: 896, caption: 'The folded card', alt: 'A yellow folded card with a noodle drawn as a chef with a moustache and a ladle.' }
        ] }
      ] },

    /* 11. Launch plan (Marketing Strategy Document) */
    { id: 'launch', nav: 'Launch plan', heading: 'Launch plan',
      text: 'We timed the launch for La Rentrée, early September, when everyone is back at work, tired, and the shops reset their shelves. Respect first, shelf second.',
      blocks: [
        { type: 'timeline', items: [
          { when: 'August', title: 'Chefs first', text: 'A respected Paris chef cooks Maggi his own way, on Marmiton. No ad, no campaign line.' },
          { when: 'September', title: 'La Rentrée', text: 'Counter displays in Monoprix, posters on Métro lines 4, 9 and 12, tastings in 12 stores, food creators on TikTok.' },
          { when: 'October', title: 'A bigger shelf', text: 'Use the first sales to win a spot at the end of the quick meals aisle.' },
          { when: 'January', title: 'The 1€ push', text: 'After the holidays, when people watch their money. Boxes in a yellow crate among the vegetables.' }
        ] },
        { type: 'box', tone: 'yellow', label: 'How we’d know it worked', big: 'Moving up from the counter to the quick meals aisle within 12 weeks, and people posting their own Maggi without being asked.' }
      ] },

    /* 12. On show */
    { id: 'show', nav: 'On show', heading: 'On show',
      text: 'The final display: the posters, the boxes and the store scenes, pinned up together.',
      blocks: [
        { type: 'pics', layout: 'wide', items: [
          { src: 'show-wall.webp', width: 2400, height: 1800, note: 'every piece, pinned up', alt: 'A wall of prints above the table: the posters, the Eiffel Tower display, the shelf scenes and the nutrition panel.' }
        ] },
        { type: 'pics', layout: 'wide', items: [
          { src: 'story/team.webp', width: 2400, height: 1800, note: 'the team: Akshath, Aiyana, Divyanshi and Sourajeet',
            alt: 'The four of us in front of our Maggi display, holding a box and laughing.' }
        ] },
        { type: 'list', label: 'Looking back', items: [
          { title: 'What I learned', text: '[NEEDS FROM AIYANA: one line, in your own words]' },
          { title: 'What I’d do next', text: '[NEEDS FROM AIYANA: one line]' }
        ] }
      ] }
  ],

  next: { slug: 'wiglet', title: 'Wiglet' }
};
