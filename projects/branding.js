/* =====================================================================
   CASE STUDY DATA · Branding
   Five brand identities, told with the journey world (js/worlds/journey.js):
   the five finished brands first, then one numbered chapter per brand that
   goes from the marks that didn't make it, to the logo, the colours and
   the brand out in the world. Each chapter is built from the brand's own
   file in projects/branding/<brand>.js, so a brand lives in one place.
   #project/branding/<brand> lands on that brand's chapter.
   (The earlier flip book is kept in js/worlds/branding.js and on main.)

   ADDING OR REORDERING A BRAND
   1. Put the brand's original images in content/branding/<brand>/.
   2. Make web copies: node tools/brand-images.mjs <brand>
      (WebP, max 2400px, into assets/images/projects/branding/<brand>/).
      Logo crops go in tools/brand-crops/<brand>.json first.
   3. Copy projects/branding/velvet-vine.js to projects/branding/<brand>.js
      and fill it in.
   4. Add the brand's slug to `brands` below, in order.
   ===================================================================== */
window.CASE_STUDIES = window.CASE_STUDIES || {};
window.CASE_STUDIES['branding'] = {
  slug: 'branding',
  title: 'Branding',
  world: 'journey',
  images: 'assets/images/projects/branding/',

  cover: {
    line: 'Five identities, five worlds.'
  },

  intro: 'Five brands, each built from a blank page: a sparkling water, a streetwear label, a bao bar, a trail running club and a toy brand. Every chapter starts with the marks that didn’t make it.',   // DRAFT
  tags: ['Brand identity', 'Logo design', 'Packaging', 'Art direction'],
  facts: [
    { label: 'Brands', value: 'Velvet Vine, STATIC., KOMA, Meridian, Pebble & Co.' },
    { label: 'Year', value: '[NEEDS FROM AIYANA: year]' }
  ],

  brands: ['velvet-vine', 'static', 'koma', 'meridian', 'pebble-and-co'],

  next: { slug: 'maggi', title: 'Maggi' }
};
