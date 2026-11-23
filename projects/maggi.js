/* =====================================================================
   CASE STUDY DATA · Maggi, re-dressed for France
   Shown with the journey world (js/worlds/journey.js): the finished pack
   first, then five chapters from the artboards to the exhibition table.
   Source: content/maggi/ (copied from the "rebranding maggi" folder; web
   copies via `node tools/brand-images.mjs --project maggi`).
   DRAFT: every `line`, `intro`, `lead` and `text` below was written from
   what the pictures show. Aiyana to edit. Gaps are [NEEDS FROM AIYANA: …].
   Left out on purpose: the team photo (other people's faces; ask first)
   and the selfie (IMG_7755).
   ===================================================================== */
window.CASE_STUDIES = window.CASE_STUDIES || {};
window.CASE_STUDIES['maggi'] = {
  slug: 'maggi',
  title: 'Maggi',
  world: 'journey',
  images: 'assets/images/projects/maggi/',

  opener: {
    kicker: 'Packaging and campaign',
    line: 'Maggi Masala noodles, re-dressed for a supermarket in France.',   // DRAFT
    images: [
      { src: 'pack-diner-ladder.webp', width: 896, height: 1200,
        alt: 'The new yellow Maggi Nouilles Masala box with a 1€ badge. A window cut in its side shows a tiny lit diner, and a little figure climbs a ladder to it.' }
    ]
  },

  intro: 'A new pack, a noodle with a moustache and a beret, and a display stacked into the Eiffel Tower. One forkful of masala noodles, made to feel at home in France.',   // DRAFT
  tags: ['Packaging', 'Brand campaign', 'Retail display', 'Exhibition'],
  facts: [
    { label: 'Year', value: '2026' },
    { label: 'Context', value: '[NEEDS FROM AIYANA: course and brief]' },
    { label: 'Team and my role', value: '[NEEDS FROM AIYANA: solo or team, and what you made]' },
    { label: 'Tools', value: '[NEEDS FROM AIYANA: Illustrator, and what made the store scenes]' }
  ],

  chapters: [
    {
      id: 'artboards',
      title: 'On the screen',
      lead: 'It started as flat artboards: posters, the pack front and its dieline, side by side.',   // DRAFT
      steps: [
        { label: 'Artboards', layout: 'full', note: 'every idea on one screen first',
          images: [{ src: 'making-illustrator.webp', width: 2400, height: 1800, caption: 'The posters and the pack, laid out in Illustrator.',
            alt: 'A laptop screen in Illustrator with six yellow artboards: noodle posters with a fork, a moustache and a beret, and the Maggi box.' }] },
        { label: 'The dieline', text: 'The box opened out flat, with the front, the sides, the cooking steps and the nutrition panel in place.',   // DRAFT
          layout: 'full', fit: 'contain',
          images: [{ src: 'dieline.webp', width: 1280, height: 763, caption: 'The dieline for the 70g box.',
            alt: 'The flat dieline of the Maggi Nouilles Masala box: yellow front with the 1€ badge, red sides, cooking steps and a nutrition table.' }] }
      ]
    },
    {
      id: 'pack',
      title: 'The pack',
      lead: 'Bright yellow, a 1€ badge, the noodles up close and one line: “Ce soir, c’est ça.”',   // DRAFT
      steps: [
        { label: 'The front', layout: 'pair',
          images: [
            { src: 'pack-front.webp', width: 1169, height: 1280, caption: 'Nouilles Masala, 70g.',
              alt: 'The front of the yellow Maggi Nouilles Masala box: the Maggi logo, a red 1€ badge, a close-up of noodles and the line Ce soir, c’est ça.' },
            { src: 'pack-open-diner.webp', width: 848, height: 1264, caption: 'Opened up into a scene.',
              alt: 'The Maggi box opened out on a yellow floor like a stage, with two tiny figures at a table between its panels.' }
          ] },
        { label: 'A world inside the box', text: '[NEEDS FROM AIYANA: what the tiny diner inside the pack stands for]',
          layout: 'full',
          images: [{ src: 'pack-diner-ladder.webp', width: 896, height: 1200, caption: 'The diner inside the box.',
            alt: 'The Maggi box with a window in its side showing a tiny lit diner, and a little figure on a ladder.' }] }
      ]
    },
    {
      id: 'character',
      title: 'A noodle with a moustache',
      lead: 'A fork, a beret and a moustache turn one forkful of noodles into a French character.',   // DRAFT
      steps: [
        { label: 'The posters', layout: 'pair', note: 'the beret came first',
          images: [
            { src: 'poster-beret.webp', width: 1056, height: 1408, caption: 'A forkful in a beret.',
              alt: 'A fork twirled with masala noodles wearing a small black beret, on bright yellow.' },
            { src: 'poster-moustache.webp', width: 1056, height: 1408, caption: '“Très Maggi.”',
              alt: 'A poster reading Très Maggi: a fork of noodles with a curled moustache, and the Maggi logo with Simplement irrésistible.' }
          ] },
        { label: 'Off the poster', text: 'The character walks off the poster: a folded card where it cooks, and a paper cup.',   // DRAFT
          layout: 'pair',
          images: [
            { src: 'card-noodle-chef.webp', width: 1200, height: 896, caption: 'A folded card: the noodle as a chef.',
              alt: 'A yellow folded card with a single noodle drawn as a chef with a moustache, an apron and a ladle.' },
            { src: 'cup.webp', width: 1024, height: 1024, caption: 'The cup.',
              alt: 'A yellow paper cup with a steaming noodle shaped like a hook, wearing a moustache, and the Maggi logo.' }
          ] }
      ]
    },
    {
      id: 'store',
      title: 'On the shelf',
      lead: 'The pack where it would live: on the shelf, at the till, and stacked into the Eiffel Tower.',   // DRAFT
      steps: [
        { label: 'In the aisle', text: '[NEEDS FROM AIYANA: how these store scenes were made]', layout: 'pair',
          images: [
            { src: 'store-eiffel.webp', width: 612, height: 852, caption: 'A display stacked into the Eiffel Tower.',
              alt: 'Maggi boxes stacked into an Eiffel Tower in a supermarket aisle, on a base reading Ce soir, c’est ça.' },
            { src: 'store-display.webp', width: 1248, height: 1248, caption: 'A floor stand with the 1€ badge.',
              alt: 'A red and yellow Maggi floor stand full of Nouilles Masala boxes in a supermarket, with a shopper reaching for one.' }
          ] },
        { label: 'Shelf, till and basket', layout: 'trio',
          images: [
            { src: 'store-shelf.webp', width: 1248, height: 1248, caption: 'On the shelf.',
              alt: 'Rows of yellow Maggi Nouilles Masala boxes on a supermarket shelf with a 1€ price tag.' },
            { src: 'store-checkout.webp', width: 1248, height: 1248, caption: 'At the till.',
              alt: 'A Maggi box on a checkout belt beside vegetables and a bottle of water.' },
            { src: 'store-basket.webp', width: 832, height: 1152, caption: 'In the basket.',
              alt: 'Looking down into a blue shopping basket at a yellow Maggi poster of a noodle fork in a beret.' }
          ] }
      ]
    },
    {
      id: 'show',
      title: 'On show',
      lead: 'The finished work on one table and one wall: the posters, the boxes, a pot of noodles and the screens.',   // DRAFT
      steps: [
        { label: 'The table',
          video: { src: 'show-walkthrough.mp4', poster: 'show-walkthrough-poster.webp', width: 1280, height: 720,
            alt: 'A short walk past the display: three yellow posters on the table, the Maggi boxes and a red pot, then the wall of prints.',
            caption: 'A walk past the display.' } },
        { label: 'The wall', layout: 'full', note: 'the whole journey, pinned up',
          images: [{ src: 'show-wall.webp', width: 2400, height: 1800, caption: 'Every piece, from the posters to the store scenes.',
            alt: 'A wall of prints above the table: the posters, the Eiffel Tower display, the shelf scenes, the cups and the nutrition panel.' }] }
      ]
    }
  ],

  next: { slug: 'wiglet', title: 'Wiglet' }
};
