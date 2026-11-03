/* =====================================================================
   BRAND · Meridian
   Source: content/branding/meridian/ (6 images). Logo crops are listed in
   tools/brand-crops/meridian.json. Hex codes were sampled from the images.
   Contrast: gold on forest green measures 6.9:1, so it is used for small
   text too; cream is the body colour.
   DRAFT: `line`, `idea` and the signature text were drafted from what the
   work shows. Aiyana to edit.
   No close-ups of the notebook in the mug photo (its text is garbled).
   ===================================================================== */
window.BRANDS = window.BRANDS || {};
window.BRANDS['meridian'] = {
  slug: 'meridian',
  name: 'Meridian',
  category: 'Sport',
  line: 'A trail running club for people who run further.',   // DRAFT
  idea: 'Mountains, trails and contour lines in gold on forest green. Built to feel premium, calm and outdoors.',   // DRAFT
  images: 'assets/images/projects/branding/meridian/',

  theme: {
    fonts: 'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap',
    heading: 'Jost, "Futura", "Century Gothic", sans-serif',
    body: 'Jost, "Futura", "Helvetica Neue", sans-serif',
    headingName: 'Jost Light',
    bodyName: 'Jost',
    page: { ground: '#233228', ink: '#F6ECE1', accent: '#DBB56B' },
    ground: '#233228', ink: '#F6ECE1', accent: '#DBB56B',
    alt: { ground: '#F6ECE1', ink: '#233228' }
  },

  effect: 'contour',

  book: [
    { src: 'meridian-lifestyle-action-sm.webp', width: 720, height: 900, alt: 'A runner in a forest-green Meridian top and cap on a pine trail at golden hour.' },
    { src: 'meridian-flat-lay-sm.webp', width: 720, height: 900, alt: 'A forest-green Meridian business card with a gold peaks mark, and a cream hang tag reading “Trail. Pace. Purpose.”' },
    { src: 'meridian-icon-texture-sm.webp', width: 720, height: 900, alt: 'A gold emblem of a runner on a winding trail below mountain peaks, on a green contour-line pattern.' },
    { src: 'meridian-lifestyle-detail-sm.webp', width: 720, height: 900, alt: 'A cream Meridian mug of coffee beside a green hang tag on a wooden table.' }
  ],

  hero: { src: 'meridian-lifestyle-action.webp', width: 1664, height: 2080,
    alt: 'A runner in a forest-green Meridian top and cap on a pine trail at golden hour.' },
  facts: [
    { label: 'Category', value: 'Sport' },
    { label: 'Context', value: '[NEEDS FROM AIYANA: course or self-initiated, year, and solo or team with your role]' },
    { label: 'Tools and credits', value: '[NEEDS FROM AIYANA: what made the logo, the mockups and the runner photo]' }
  ],

  logo: {
    primary: [
      { src: 'logo-primary.webp', width: 620, height: 390, caption: 'Peaks mark and wordmark',
        alt: 'The Meridian logo in gold foil: an M drawn as two mountain peaks above MERIDIAN and “Trail running club”.' }
    ],
    explorations: [
      { src: 'logo-script.webp', width: 1200, height: 413, caption: 'Script wordmark',
        alt: 'Meridian in a flowing gold script on forest green.' },
      { src: 'logo-monogram.webp', width: 220, height: 230, caption: 'Serif M monogram',
        alt: 'A serif M monogram embroidered in gold on the green cap.' },
      { src: 'logo-emblem.webp', width: 500, height: 550, caption: 'Runner emblem',
        alt: 'A gold emblem of a runner on a winding trail below mountain peaks and pines.' },
      { src: 'logo-tag.webp', width: 680, height: 820, caption: 'Peaks badge on the hang tag',
        alt: 'A green hang tag with mountain peaks in a circle, MERIDIAN, “Run further” and “Premium trail-running club”.' }
    ]
  },

  colours: [
    { name: 'Forest green', hex: '#233228' },
    { name: 'Gold', hex: '#DBB56B' },
    { name: 'Cream', hex: '#F6ECE1' }
  ],

  signature: {
    kind: 'contour',
    heading: 'Follow the trail',
    text: 'Contour lines spread from the summit and the trail climbs to the peak. Move across the map and the lines bend away.'   // DRAFT
  },

  gallery: [
    { src: 'meridian-lifestyle-action.webp', width: 1664, height: 2080, size: 'big', caption: 'On the trail',
      alt: 'A runner in a forest-green Meridian top and cap on a pine trail at golden hour.' },
    { src: 'meridian-flat-lay.webp', width: 1664, height: 2080, caption: 'Business card and hang tag',
      alt: 'A forest-green Meridian business card with a gold peaks mark, and a cream hang tag reading “Trail. Pace. Purpose.”' },
    { src: 'meridian-logo-tile.webp', width: 1664, height: 2080, caption: 'Script wordmark',
      alt: 'Meridian in a flowing gold script on forest green.' },
    { src: 'meridian-icon-texture.webp', width: 1664, height: 2080, size: 'big', caption: 'Emblem and contour pattern',
      alt: 'A gold emblem of a runner on a winding trail below mountain peaks, on a green contour-line pattern.' },
    { src: 'meridian-apparel-shot.webp', width: 1664, height: 2080, caption: 'Running cap',
      alt: 'A forest-green running cap with a gold serif M monogram.' },
    { src: 'meridian-lifestyle-detail.webp', width: 1664, height: 2080, caption: 'Mug and hang tag',
      alt: 'A cream Meridian mug of coffee beside a green hang tag on a wooden table.' }
  ],

  reflection: [
    { title: 'What I learned', text: '[NEEDS FROM AIYANA: one line]' },
    { title: 'What I’d do next', text: '[NEEDS FROM AIYANA: one line]' }
  ]
};
