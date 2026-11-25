/* =====================================================================
   CASE STUDY DATA · Branding
   Five brand identities, shown with the brands world (js/worlds/brands.js,
   2026-11-26): a shelf of five bands, and each brand opens on its own page
   in its own colours and type: the idea, the logo, colour, type, brand
   elements, packaging, in the world, final designs and a reflection.
   Each page is built from the brand's file in projects/branding/<brand>.js
   plus its drawn kit in js/worlds/brand-kits.js.
   #project/branding/<brand> opens that brand's page.
   (Earlier versions: js/worlds/journey.js and js/worlds/branding.js.)

   ADDING OR REORDERING A BRAND
   1. Put the brand's original images in content/branding/<brand>/.
   2. Make web copies: node tools/brand-images.mjs <brand>
      (WebP, max 2400px, into assets/images/projects/branding/<brand>/).
      Logo crops go in tools/brand-crops/<brand>.json first.
   3. Copy projects/branding/velvet-vine.js to projects/branding/<brand>.js
      and fill it in, and add the brand's kit to js/worlds/brand-kits.js.
   4. Add the brand's slug to `brands` below, in order.
   ===================================================================== */
window.CASE_STUDIES = window.CASE_STUDIES || {};
window.CASE_STUDIES['branding'] = {
  slug: 'branding',
  title: 'Branding',
  world: 'brands',
  images: 'assets/images/projects/branding/',

  cover: {
    line: 'Five identities, five worlds.'
  },

  intro: 'Five brands, each built from a blank page: a sparkling water, a streetwear label, a bao bar, a trail running club and a toy brand. Open one to see how it was made: the idea, the logo, the colours, the pieces it’s built from and the brand out in the world.',   // DRAFT
  tags: ['Brand identity', 'Logo design', 'Packaging', 'Art direction'],
  facts: [
    { label: 'Brands', value: 'Velvet Vine, STATIC., KOMA, Meridian, Pebble & Co.' },
    { label: 'Year', value: '[NEEDS FROM AIYANA: year]' }
  ],

  brands: ['velvet-vine', 'static', 'koma', 'meridian', 'pebble-and-co'],

  next: { slug: 'maggi', title: 'Maggi' }
};
