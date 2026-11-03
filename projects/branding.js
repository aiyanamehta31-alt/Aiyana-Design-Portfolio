/* =====================================================================
   CASE STUDY DATA · Branding
   Five brand identities, presented as one book (js/worlds/branding.js).
   Page 1 is the front cover, then one page per brand, then the back cover.
   Each brand opens into its own short story at #project/branding/<brand>.

   ADDING OR REORDERING A BRAND
   1. Put the brand's original images in content/branding/<brand>/.
   2. Make web copies: node tools/brand-images.mjs <brand>
      (WebP, max 2400px, plus small copies for the book's pages, into
      assets/images/projects/branding/<brand>/). Logo crops go in
      tools/brand-crops/<brand>.json first.
   3. Copy projects/branding/velvet-vine.js to projects/branding/<brand>.js
      and fill it in.
   4. Add the brand's slug to `brands` below, in book order.
   ===================================================================== */
window.CASE_STUDIES = window.CASE_STUDIES || {};
window.CASE_STUDIES['branding'] = {
  slug: 'branding',
  title: 'Branding',
  world: 'branding',
  images: 'assets/images/projects/branding/',

  cover: {
    line: 'Five identities, five worlds.',
    back: 'Thank you for flipping through'
  },

  brands: ['velvet-vine', 'static', 'koma', 'meridian', 'pebble-and-co'],

  next: { slug: 'wiglet', title: 'Wiglet' }
};
