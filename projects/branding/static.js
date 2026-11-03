/* =====================================================================
   BRAND · STATIC.
   Source: content/branding/static/ (6 images). Logo crops are listed in
   tools/brand-crops/static.json. Hex codes were sampled from the images.
   DRAFT: `line`, `idea` and the signature text were drafted from what the
   work shows. Aiyana to edit.
   No close-ups of the "OVERRDDE" text or the "STANDSIC" sticker: both stay
   small, inside whole images only.
   ===================================================================== */
window.BRANDS = window.BRANDS || {};
window.BRANDS['static'] = {
  slug: 'static',
  name: 'STATIC.',
  category: 'Streetwear',
  line: 'A glitch-born streetwear brand where noise becomes identity.',   // DRAFT
  idea: 'Inspired by signal loss and digital error. Acid green, hot pink and chrome, set against black.',   // DRAFT
  images: 'assets/images/projects/branding/static/',

  theme: {
    fonts: 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100,400;100,500;125,900&family=Space+Mono:wght@400;700&display=swap',
    heading: 'Archivo, "Arial Black", sans-serif',
    body: 'Archivo, "Helvetica Neue", Arial, sans-serif',
    label: '"Space Mono", ui-monospace, Menlo, monospace',   // small labels
    headingName: 'Archivo Expanded Black',
    bodyName: 'Archivo, with Space Mono for labels',
    page: { ground: '#050505', ink: '#EDEDED', accent: '#95E50F' },
    ground: '#050505', ink: '#EDEDED', accent: '#95E50F',
    alt: { ground: '#95E50F', ink: '#050505' }
  },

  effect: 'glitch',

  book: [
    { src: 'static-logo-tile-sm.webp', width: 720, height: 900, alt: 'The chrome STATIC. wordmark, glitched, over a cloud of green pixel noise on black.' },
    { src: 'static-flat-lay-sm.webp', width: 720, height: 900, alt: 'STATIC. merch on brushed steel: a black lanyard with a metal ID tag, a green zine and a holographic sticker sheet.' },
    { src: 'static-lifestyle-action-sm.webp', width: 720, height: 900, alt: 'A model in a black jacket and acid-green tee on a wet neon street under a STATIC. sign.' },
    { src: 'static-product-shot-sm.webp', width: 720, height: 900, alt: 'A black bucket hat with a chrome S. monogram and a hot-pink STATIC. tag.' }
  ],

  hero: { src: 'static-logo-tile.webp', width: 1664, height: 2080,
    alt: 'The chrome STATIC. wordmark, glitched, over a cloud of green pixel noise on black, with small pink interface marks in the corners.' },
  facts: [
    { label: 'Category', value: 'Streetwear' },
    { label: 'Context', value: '[NEEDS FROM AIYANA: course or self-initiated, year, and solo or team with your role]' },
    { label: 'Tools and credits', value: '[NEEDS FROM AIYANA: what made the logo, the mockups and the campaign photo]' }
  ],

  logo: {
    primary: [
      { src: 'logo-primary.webp', width: 665, height: 240, caption: 'Primary wordmark',
        alt: 'The upright, blocky STATIC. wordmark printed in black on the green zine cover.' },
      { src: 'logo-monogram.webp', width: 390, height: 350, caption: 'Monogram',
        alt: 'The S. monogram, embroidered in silver thread on the black bucket hat.' }
    ],
    explorations: [
      { src: 'logo-chrome.webp', width: 1200, height: 366, caption: 'Chrome wordmark',
        alt: 'An italic chrome version of the STATIC. wordmark with glitch slices.' },
      { src: 'logo-bolt.webp', width: 1200, height: 1240, caption: 'Lightning-bolt emblem',
        alt: 'A chrome lightning bolt through a broken chrome ring, outlined in hot pink.' },
      { src: 'logo-graffiti.webp', width: 400, height: 165, caption: 'Graffiti script',
        alt: 'A graffiti-script STATIC sticker on the holographic sheet.' },
      { src: 'logo-globe.webp', width: 370, height: 200, caption: 'Globe badge',
        alt: 'An oval badge with the STATIC. wordmark over a wireframe globe.' }
    ]
  },

  colours: [
    { name: 'Black', hex: '#020202' },
    { name: 'Acid green', hex: '#95E50F' },
    { name: 'Hot pink', hex: '#F90D8C' },
    { name: 'Chrome', hex: '#C4C4C4' }
  ],

  signature: {
    kind: 'tune',
    heading: 'Tune in',
    text: 'The wordmark comes through the noise. Lose the signal and it tunes in again.'   // DRAFT
  },

  gallery: [
    { src: 'static-logo-tile.webp', width: 1664, height: 2080, size: 'big', caption: 'Wordmark poster',
      alt: 'The chrome STATIC. wordmark, glitched, over a cloud of green pixel noise on black.' },
    { src: 'static-flat-lay.webp', width: 1664, height: 2080, caption: 'Merch: lanyard, zine and stickers',
      alt: 'STATIC. merch on brushed steel: a black lanyard with a metal ID tag, a green zine and a holographic sticker sheet.' },
    { src: 'static-product-shot.webp', width: 1664, height: 2080, caption: 'Bucket hat',
      alt: 'A black bucket hat with a chrome S. monogram and a hot-pink STATIC. tag.' },
    { src: 'static-lifestyle-action.webp', width: 1664, height: 2080, size: 'big', caption: 'Campaign',
      alt: 'A model in a black jacket and acid-green tee on a wet neon street under a STATIC. sign.' },
    { src: 'static-lifestyle-detail.webp', width: 1664, height: 2080, caption: 'Can, phone and stickers',
      alt: 'A chrome STATIC. can beside a hot-pink phone screen, a keyboard, a green cable and holographic stickers.' },
    { src: 'static-icon-texture.webp', width: 1664, height: 2080, caption: 'Emblem poster',
      alt: 'The lightning-bolt emblem over green and pink glitch texture, with STATIC. wordmarks around it.' }
  ],

  reflection: [
    { title: 'What I learned', text: '[NEEDS FROM AIYANA: one line]' },
    { title: 'What I’d do next', text: '[NEEDS FROM AIYANA: one line]' }
  ]
};
