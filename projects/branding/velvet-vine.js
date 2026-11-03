/* =====================================================================
   BRAND · Velvet Vine
   One brand in the Branding book. Copy this file for a new brand (see the
   steps at the top of projects/branding.js).

   Source: content/branding/velvet-vine/ (14 images). Nothing is invented;
   anything not yet known is written [NEEDS FROM AIYANA: ...] and shows up
   marked on the page.
   DRAFT: `line`, `idea` and the signature text were drafted from what the
   work shows. Aiyana to edit.
   Left out on purpose: the philosophy page (vv_brandbook_p2_story) and the
   photographic direction page (vv_brandbook_p7_photography), which mention
   skincare and a body wash.
   ===================================================================== */
window.BRANDS = window.BRANDS || {};
window.BRANDS['velvet-vine'] = {
  slug: 'velvet-vine',
  name: 'Velvet Vine',
  category: 'Beverage',
  line: 'A botanical sparkling water that feels like quiet luxury.',   // DRAFT
  idea: 'Fig, vine and sparkle, drawn with a light hand. A palette of deep fig, sage and cream keeps it calm and premium.',   // DRAFT
  images: 'assets/images/projects/branding/velvet-vine/',

  /* The brand's world. Gilda Display is the closest free match to the
     wordmark's serif; it is not the wordmark's own font. Sage is only for
     large text and lines: on cream it is too pale for small text. */
  theme: {
    fonts: 'https://fonts.googleapis.com/css2?family=Gilda+Display&family=Montserrat:wght@400;500;600&display=swap',
    heading: '"Gilda Display", Georgia, serif',
    body: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
    headingName: 'Gilda Display',
    bodyName: 'Montserrat',
    page: { ground: '#F3EFE6', ink: '#4B254B', accent: '#8A967A' },
    ground: '#F3EFE6', ink: '#4B254B', accent: '#8A967A',
    alt: { ground: '#4B254B', ink: '#F3EFE6' }
  },

  /* The little touch as its page lands in the book */
  effect: 'sparkle',

  /* The book page: the first image is the large one */
  book: [
    { src: 'page-book.webp', width: 1306, height: 1632, alt: 'The Velvet Vine brand book: a deep purple cloth cover with the wordmark and a sage vine.' },
    { src: 'vv-slide-4-packaging-sm.webp', width: 720, height: 900, alt: 'Three cream Velvet Vine cans with a purple vine illustration, on marble.' },
    { src: 'vv-slide-3-menu-sm.webp', width: 720, height: 900, alt: 'The collection menu card listing Wild Fig, Garden Sage and Velvet Rose.' },
    { src: 'page-stationery.webp', width: 1306, height: 1632, alt: 'Velvet Vine stationery: a sage envelope, letterhead, business cards and a pencil.' }
  ],

  /* 1. Hero */
  hero: { src: 'vv-brandbook-p1-cover.webp', width: 2176, height: 1632,
    alt: 'The Velvet Vine brand guidelines book on a marble table, beside olive leaves.' },
  facts: [
    { label: 'Category', value: 'Beverage' },
    { label: 'Context', value: '[NEEDS FROM AIYANA: course or self-initiated, year, and solo or team with your role]' },
    { label: 'Tools and credits', value: '[NEEDS FROM AIYANA: what made the logo, illustrations, mockups and lifestyle photos]' }
  ],

  /* 3. The logo */
  logo: {
    primary: [
      { src: 'mark-wordmark.webp', width: 497, height: 366, caption: 'Primary wordmark',
        alt: 'The Velvet Vine wordmark in deep fig purple, with a sparkle and “Sparkling water” beneath.' },
      { src: 'mark-monogram.webp', width: 319, height: 396, caption: 'Monogram',
        alt: 'The Velvet Vine monogram: two stacked Vs and a sparkle inside an oval, with a sage vine.' }
    ],
    explorations: []
  },

  /* 4. Colour (the brand's own names and hex codes, from its board) */
  colours: [
    { name: 'Deep Fig Purple', hex: '#4B254B' },
    { name: 'Sage Green', hex: '#8A967A' },
    { name: 'Muted Cream', hex: '#F3EFE6' }
  ],

  /* 5. Signature interaction: the vine grows in, and a type tester */
  signature: {
    kind: 'vine',
    heading: 'Watch the vine grow',
    text: 'The stem draws, then each leaf unfolds. Type a word to set it in the brand’s fonts.',   // DRAFT
    sample: 'Velvet Vine'
  },

  /* 6. Applications: every image except the two left out above.
     size: big (2×2), wide (2×1) or small (1×1) in the gallery grid. */
  gallery: [
    { src: 'velvet-vine-assets.webp', width: 1664, height: 2080, size: 'big', caption: 'The identity board',
      alt: 'The Velvet Vine identity board: wordmark, vine, monogram, palette, icons, type, pattern and texture.' },
    { src: 'vv-slide-4-packaging.webp', width: 1664, height: 2080, caption: 'Packaging',
      alt: 'Three cream Velvet Vine cans with a purple vine illustration, on marble.' },
    { src: 'vv-slide-3-menu.webp', width: 1664, height: 2080, caption: 'Collection menu',
      alt: 'The Velvet Vine collection menu card beside figs, a linen napkin and a glass of sparkling water.' },
    { src: 'vv-slide-2-concept.webp', width: 1664, height: 2080, caption: 'Social post',
      alt: 'A sage-green social post reading “Refined. Organic. Pure.” with an illustrated fig.' },
    { src: 'vv-slide-5-lifestyle.webp', width: 1664, height: 2080, caption: 'Campaign',
      alt: 'An advert reading “Elevate Your Everyday”: a woman in a cream suit holding a Velvet Vine glass.' },
    { src: 'vv-brandbook-p1-cover.webp', width: 2176, height: 1632, size: 'wide', caption: 'Brand book cover',
      alt: 'The Velvet Vine brand guidelines book on a marble table, beside olive leaves.' },
    { src: 'vv-brandbook-p6-applications.webp', width: 2176, height: 1632, size: 'wide', caption: 'Brand book: applications',
      alt: 'A flat lay of a Velvet Vine can, a canvas tote with the monogram, a sage envelope, letterhead, business cards and a pencil.' },
    { src: 'vv-slide-6-detail.webp', width: 1664, height: 2080, caption: 'The vine on glass',
      alt: 'A glass of sparkling water printed with the purple vine, a halved fig behind it.' },
    { src: 'vv-slide-7-outro.webp', width: 1664, height: 2080, caption: 'Social post',
      alt: 'A deep purple social post reading “The Art of Botanicals.” with velvetvine.com and a sage vine.' },
    { src: 'vv-brandbook-p3-logo.webp', width: 2176, height: 1632, size: 'wide', caption: 'Brand book: the logo',
      alt: 'The brand book’s logo page: the primary wordmark, the monogram and notes on proportion, spacing and clear space.' },
    { src: 'vv-brandbook-p4-colors-typo.webp', width: 2176, height: 1632, size: 'wide', caption: 'Brand book: colour and type',
      alt: 'The brand book’s colour and typography page: deep fig purple, sage green and muted cream, with the heading and body fonts.' },
    { src: 'vv-brandbook-p5-illustrations.webp', width: 2176, height: 1632, size: 'wide', caption: 'Brand book: illustration',
      alt: 'The brand book’s illustration page: a botanical vine, a fig, a glass of sparkling water and the sparkle symbol.' }
  ],

  /* 7. Reflection */
  reflection: [
    { title: 'What I learned', text: '[NEEDS FROM AIYANA: one line]' },
    { title: 'What I’d do next', text: '[NEEDS FROM AIYANA: one line]' }
  ]
};
