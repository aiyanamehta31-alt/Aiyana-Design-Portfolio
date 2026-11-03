/* =====================================================================
   BRAND · KOMA
   Source: content/branding/koma/ (5 images). Logo crops are listed in
   tools/brand-crops/koma.json. Hex codes were sampled from the images.
   DRAFT: `line`, `idea` and the signature text were drafted from what the
   work shows. Aiyana to edit.
   ===================================================================== */
window.BRANDS = window.BRANDS || {};
window.BRANDS['koma'] = {
  slug: 'koma',
  name: 'KOMA',
  category: 'Food',
  line: 'Soft bao with bold flavour, served with a playful edge.',   // DRAFT
  idea: 'A steaming bun and a curl of steam do all the talking. Bright green on black keeps it hungry and fun.',   // DRAFT
  images: 'assets/images/projects/branding/koma/',

  theme: {
    fonts: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;800&display=swap',
    heading: 'Rubik, "Arial Rounded MT Bold", sans-serif',
    body: 'Rubik, "Helvetica Neue", Arial, sans-serif',
    headingName: 'Rubik ExtraBold',
    bodyName: 'Rubik',
    page: { ground: '#0E0E0E', ink: '#FFFFFF', accent: '#B6E530' },
    ground: '#0E0E0E', ink: '#FFFFFF', accent: '#B6E530',
    alt: { ground: '#B6E530', ink: '#0E0E0E' }
  },

  effect: 'steam',

  book: [
    { src: 'koma-slide-1-logo-sm.webp', width: 720, height: 900, alt: 'The KOMA logo: chunky green letters under three white curls of steam, with コマ beside them, on black.' },
    { src: 'koma-slide-5-flatlay-sm.webp', width: 720, height: 900, alt: 'A table of bao in bamboo steamers, chilli oil, chopsticks and a green KOMA napkin.' },
    { src: 'koma-slide-6-packaging-sm.webp', width: 720, height: 900, alt: 'A black KOMA takeout box with a green steam mark and wordmark.' },
    { src: 'koma-slide-7-pattern-sm.webp', width: 720, height: 900, alt: 'A green line-drawn bun on a pattern of white steam curls.' }
  ],

  hero: { src: 'koma-slide-5-flatlay.webp', width: 1664, height: 2080,
    alt: 'A table of bao in bamboo steamers, chilli oil, chopsticks, a green KOMA napkin and a KOMA sticker.' },
  facts: [
    { label: 'Category', value: 'Food' },
    { label: 'Context', value: '[NEEDS FROM AIYANA: course or self-initiated, year, and solo or team with your role]' },
    { label: 'Tools and credits', value: '[NEEDS FROM AIYANA: what made the logo, the mockups and the food photo]' }
  ],

  logo: {
    primary: [
      { src: 'logo-primary.webp', width: 1200, height: 625, caption: 'Primary logo',
        alt: 'The KOMA logo: chunky green letters with a white offset shadow, three curls of steam above, and コマ.' },
      { src: 'logo-bun.webp', width: 870, height: 800, caption: 'Bun icon',
        alt: 'A green line drawing of a pleated bao bun.' }
    ],
    explorations: [
      { src: 'logo-box.webp', width: 540, height: 450, caption: 'Thin wordmark with steam mark',
        alt: 'A thin geometric KOMA wordmark under an S-shaped steam mark, printed in green on the takeout box.' },
      { src: 'logo-sticker.webp', width: 540, height: 290, caption: 'Bold sticker wordmark',
        alt: 'A bold KOMA wordmark on a yellow-green sticker.' },
      { src: 'logo-badge.webp', width: 870, height: 975, caption: 'Slow steamed badge',
        alt: 'A round green badge reading “Slow steamed” around a line-drawn bun.' }
    ]
  },

  colours: [
    { name: 'Black', hex: '#0E0E0E' },
    { name: 'KOMA green', hex: '#B6E530' },
    { name: 'White', hex: '#FFFFFF' }
  ],

  signature: {
    kind: 'steam',
    heading: 'Fresh from the steamer',
    text: 'The bun draws in line by line, and the steam keeps rising.'   // DRAFT
  },

  gallery: [
    { src: 'koma-slide-5-flatlay.webp', width: 1664, height: 2080, size: 'big', caption: 'Table setting',
      alt: 'A table of bao in bamboo steamers, chilli oil, chopsticks, a green KOMA napkin and a KOMA sticker.' },
    { src: 'koma-slide-1-logo.webp', width: 1664, height: 2080, caption: 'Logo',
      alt: 'The KOMA logo: chunky green letters under three white curls of steam, with コマ beside them, on black.' },
    { src: 'koma-slide-6-packaging.webp', width: 1664, height: 2080, caption: 'Takeout box',
      alt: 'A black KOMA takeout box with a green steam mark and wordmark.' },
    { src: 'koma-slide-3-badges.webp', width: 1664, height: 2080, caption: 'Badges',
      alt: 'Two round badges: a green one reading “Slow steamed” and a white outline one reading “Bold flavor, soft bite”, each with a bun.' },
    { src: 'koma-slide-7-pattern.webp', width: 1664, height: 2080, caption: 'Bun icon and steam pattern',
      alt: 'A green line-drawn bun on a pattern of white steam curls.' }
  ],

  reflection: [
    { title: 'What I learned', text: '[NEEDS FROM AIYANA: one line]' },
    { title: 'What I’d do next', text: '[NEEDS FROM AIYANA: one line]' }
  ]
};
