/* =====================================================================
   BRAND · Pebble & Co.
   Source: content/branding/pebble-and-co/ (6 images). Logo crops are
   listed in tools/brand-crops/pebble-and-co.json. Hex codes were sampled
   from the images, except the navy, which is a text colour added for
   contrast (coral and sky blue are too pale for small text on cream).
   DRAFT: `line`, `idea` and the signature text were drafted from what the
   work shows. Aiyana to edit.
   The photo of the child is only in the applications gallery, never on
   the book page.
   ===================================================================== */
window.BRANDS = window.BRANDS || {};
window.BRANDS['pebble-and-co'] = {
  slug: 'pebble-and-co',
  name: 'Pebble & Co.',
  category: 'Kids',
  line: 'A cheerful brand for little ones who play more.',   // DRAFT
  idea: 'A smiling pebble, sunny colours and soft rounded letters. Made to feel warm, safe and full of play.',   // DRAFT
  images: 'assets/images/projects/branding/pebble-and-co/',

  theme: {
    fonts: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&family=Nunito:wght@400;600;700&display=swap',
    heading: '"Baloo 2", "Arial Rounded MT Bold", sans-serif',
    body: 'Nunito, "Helvetica Neue", Arial, sans-serif',
    headingName: 'Baloo 2 ExtraBold',
    bodyName: 'Nunito',
    page: { ground: '#FCD33B', ink: '#1F3550', accent: '#F8716C' },
    ground: '#FDF1DA', ink: '#1F3550', accent: '#F8716C',
    alt: { ground: '#7FB8DE', ink: '#1F3550' }
  },

  effect: 'bounce',

  book: [
    { src: 'pebble-logo-tile-sm.webp', width: 720, height: 900, alt: 'The Pebble & Co. logo in coral bubble letters with a cream outline, on yellow with tiny stars.' },
    { src: 'pebble-flat-lay-sm.webp', width: 720, height: 900, alt: 'A sky-blue Pebble & Co. hang tag with the smiling pebble, among coral, yellow and wooden toy blocks.' },
    { src: 'pebble-product-shot-sm.webp', width: 720, height: 900, alt: 'A coral backpack with a cream P&Co script and yellow zip pulls, floating in a blue sky with a smiling sun.' },
    { src: 'pebble-lifestyle-detail-sm.webp', width: 720, height: 900, alt: 'A sunny-face mug of hot chocolate, a Pebble & Co. bag and a coral felt tag reading “Play more”.' }
  ],

  hero: { src: 'pebble-flat-lay.webp', width: 1664, height: 2080,
    alt: 'A sky-blue Pebble & Co. hang tag with the smiling pebble, among coral, yellow and wooden toy blocks and a printed ribbon.' },
  facts: [
    { label: 'Category', value: 'Kids' },
    { label: 'Context', value: '[NEEDS FROM AIYANA: course or self-initiated, year, and solo or team with your role]' },
    { label: 'Tools and credits', value: '[NEEDS FROM AIYANA: what made the logo, the mascot, the mockups and the photos]' }
  ],

  logo: {
    primary: [
      { src: 'logo-primary.webp', width: 830, height: 990, caption: 'Primary logo',
        alt: 'The Pebble & Co. logo on a sky-blue hang tag: a smiling pebble face above rounded white letters, with a yellow ampersand.' },
      { src: 'logo-mascot.webp', width: 1040, height: 840, caption: 'Mascot',
        alt: 'The pebble mascot drawn in coral line: a smiling pebble with rosy cheeks, waving arms and little feet.' }
    ],
    explorations: [
      { src: 'logo-bubble.webp', width: 1200, height: 771, caption: 'Bubble letters',
        alt: 'Pebble & Co. in coral bubble letters with a cream outline, on yellow.' },
      { src: 'logo-script.webp', width: 310, height: 225, caption: 'P&Co script',
        alt: 'A cream P&Co script embroidered on the coral backpack.' },
      { src: 'logo-bag.webp', width: 430, height: 380, caption: 'Multicolour wordmark',
        alt: 'Pebble & Co. printed in orange, yellow, blue and coral letters on a canvas bag.' }
    ]
  },

  colours: [
    { name: 'Cream', hex: '#FDF1DA' },
    { name: 'Sky blue', hex: '#7FB8DE' },
    { name: 'Coral', hex: '#F8716C' },
    { name: 'Yellow', hex: '#FCD33B' }
  ],

  signature: {
    kind: 'mascot',
    heading: 'Say hello to the pebble',
    text: 'It blinks and follows your pointer. Click it to see it bounce and wave.'   // DRAFT
  },

  gallery: [
    { src: 'pebble-flat-lay.webp', width: 1664, height: 2080, size: 'big', caption: 'Hang tag and toys',
      alt: 'A sky-blue Pebble & Co. hang tag with the smiling pebble, among coral, yellow and wooden toy blocks and a printed ribbon.' },
    { src: 'pebble-logo-tile.webp', width: 1664, height: 2080, caption: 'Bubble-letter logo',
      alt: 'The Pebble & Co. logo in coral bubble letters with a cream outline, on yellow with tiny stars.' },
    { src: 'pebble-icon-texture.webp', width: 1664, height: 2080, caption: 'Mascot and sky pattern',
      alt: 'The coral pebble mascot waving, on a sky-blue pattern of cream clouds and stars.' },
    { src: 'pebble-product-shot.webp', width: 1664, height: 2080, size: 'big', caption: 'Backpack',
      alt: 'A coral backpack with a cream P&Co script and yellow zip pulls, floating in a blue sky with a smiling sun.' },
    { src: 'pebble-lifestyle-detail.webp', width: 1664, height: 2080, caption: 'Mug, bag and “Play more” tag',
      alt: 'A sunny-face mug of hot chocolate, a Pebble & Co. bag and a coral felt tag reading “Play more”, with crayons and a rainbow toy.' },
    { src: 'pebble-lifestyle-action.webp', width: 1664, height: 2080, caption: 'A child jumping in a Pebble & Co. tee',
      note: '[NEEDS FROM AIYANA: AI-generated, or real with parents’ permission]',
      alt: 'A laughing child jumping on a sunny garden play mat, in a coral tee with a Pebble & Co. badge.' }
  ],

  reflection: [
    { title: 'What I learned', text: '[NEEDS FROM AIYANA: one line]' },
    { title: 'What I’d do next', text: '[NEEDS FROM AIYANA: one line]' }
  ]
};
