/* =====================================================================
   BRAND KITS · the drawn parts of each brand page (js/worlds/brands.js)
   2026-11-26. Everything here was drawn in code for the portfolio, from
   what each brand's finished work shows: the symbols, the pattern, the
   badges and the packaging nets. The pages say so ("drawn for this page").
   Words on the badges come from Aiyana's own work (her posters, tags and
   stickers), never invented slogans.

   Per brand:
     stroke    line width and cap for the symbols
     symbols   [{ name, art }]   art is SVG inside a 48×48 box
     pattern   [a, b]            two symbols that repeat as the pattern
     badges    [{ text, sym }]   round stickers, text from her work
     keywords  the idea in a few words (DRAFT, from her brief lines)
     notes     handwritten notes for the four book images, in order
     world     the photos for "In the world" (first is the big one)
     pack      the packaging net: { type: wrap|box|stickers|tag, … }
               a tag's front is her image, or frontArt { sym, text } drawn
   ===================================================================== */
(function () {
  'use strict';

  // Small helpers so every drawn line can "draw itself in" (pathLength=1).
  function P(d, cls) { return '<path pathLength="1"' + (cls ? ' class="' + cls + '"' : '') + ' d="' + d + '"/>'; }
  function C(cx, cy, r, cls) { return '<circle pathLength="1"' + (cls ? ' class="' + cls + '"' : '') + ' cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>'; }
  function E(cx, cy, rx, ry, cls) { return '<ellipse pathLength="1"' + (cls ? ' class="' + cls + '"' : '') + ' cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/>'; }
  var F = 'is-fill';   // a shape filled with the brand's accent

  window.BRAND_KITS = {
    'velvet-vine': {
      stroke: { w: 1.6, cap: 'round' },
      symbols: [
        { name: 'Sparkle', art: P('M24 5C25.4 17.5 30.5 22.6 43 24C30.5 25.4 25.4 30.5 24 43C22.6 30.5 17.5 25.4 5 24C17.5 22.6 22.6 17.5 24 5Z', F) },
        { name: 'Fig', art: P('M24 13C20 13 18.5 17 15.5 20.5C9.5 27.5 12 40.5 24 40.5C36 40.5 38.5 27.5 32.5 20.5C29.5 17 28 13 24 13Z') + P('M24 13C24 9.5 26 7.5 29 6.5') + P('M20.5 33.5Q24 36.5 27.5 33.5') },
        { name: 'Leaf', art: P('M9 39C9 22 22 9 39 9C39 26 26 39 9 39Z') + P('M9 39L31 17') + P('M17 31L17 24M23 25L23 18M17 31L24 31M23 25L30 25') },
        { name: 'Vine', art: P('M24 43C23 32 20 24 26 6') + P('M23.5 31C17 29.5 13.5 25.5 13.5 21C19.5 21 23 25 23.5 31Z') + P('M25 19.5C30 18 33.5 14 33.5 9.5C28.5 10.5 25 14.5 25 19.5Z') },
        { name: 'Bubbles', art: C(18, 32, 6.5) + C(30.5, 20, 4.5) + C(22, 11, 2.8) + C(35, 34, 2.2) },
        { name: 'Glass', art: P('M14 7H34L31.5 41H16.5Z') + P('M15 15H33') + C(22, 26, 1.6) + C(27, 32, 1.6) + C(24, 20, 1.1) }
      ],
      pattern: [3, 0],
      badges: [
        { text: 'Refined · Organic · Pure ·', sym: 0 },
        { text: 'The Art of Botanicals ·', sym: 1 }
      ],
      keywords: ['Fig', 'Vine', 'Sparkle', 'Quiet luxury', 'Botanical calm'],   // DRAFT
      notes: ['the brand book', 'the cans', 'the menu card', 'stationery'],
      world: ['vv-slide-5-lifestyle.webp', 'vv-slide-2-concept.webp', 'vv-slide-7-outro.webp'],
      pack: {
        type: 'wrap', heading: 'The can',
        text: 'One label wraps the whole can: the wordmark on the front, the three flavours on the back, the vine running round the base.',   // DRAFT
        front: { src: 'mark-wordmark.webp', width: 497, height: 366 },
        lines: ['Sparkling water', 'Wild Fig', 'Garden Sage', 'Velvet Rose'],
        photos: ['vv-slide-4-packaging.webp', 'vv-slide-6-detail.webp']
      }
    },

    'static': {
      stroke: { w: 2.4, cap: 'square' },
      symbols: [
        { name: 'Bolt', art: P('M28 4L12 27H23L19 44L36 19H25Z', F) },
        { name: 'Signal lost', art: P('M8 40V35M16 40V30M24 40V24M32 40V18M40 40V12') + P('M6 9L42 43') },
        { name: 'Crosshair', art: C(24, 24, 12) + P('M24 4V15M24 33V44M4 24H15M33 24H44') },
        { name: 'Globe', art: C(24, 24, 17) + E(24, 24, 7, 17) + P('M7 24H41M10 15H38M10 33H38') },
        { name: 'Error', art: P('M24 6L44 41H4Z') + P('M24 18V29M24 33V36') },
        { name: 'Cursor', art: P('M12 6V38L20 30.5L25.5 42L31 39.5L25.5 28H36Z', F) }
      ],
      pattern: [2, 0],
      badges: [
        { text: 'All signals lost · All signals lost ·', sym: 1 },
        { text: 'System glitch · Reality distortion ·', sym: 3 }
      ],
      keywords: ['Signal loss', 'Glitch', 'Chrome', 'Night city', 'Noise as identity'],   // DRAFT
      notes: ['the poster', 'the merch kit', 'the campaign', 'bucket hat'],
      world: ['static-lifestyle-action.webp', 'static-lifestyle-detail.webp', 'static-icon-texture.webp'],
      pack: {
        type: 'stickers', heading: 'The sticker sheet',
        text: 'Every mark from the identity, cut as stickers for the holographic sheet that ships with the merch.',   // DRAFT
        items: [
          { src: 'logo-bolt.webp', width: 1200, height: 1240 },
          { src: 'logo-graffiti.webp', width: 400, height: 165 },
          { src: 'logo-globe.webp', width: 370, height: 200 },
          { src: 'logo-monogram.webp', width: 390, height: 350 },
          { src: 'logo-chrome.webp', width: 1200, height: 366 }
        ],
        photos: ['static-flat-lay.webp', 'static-product-shot.webp']
      }
    },

    'koma': {
      stroke: { w: 2.6, cap: 'round' },
      symbols: [
        { name: 'Bao', art: P('M8 32C8 20 15 12 24 12C33 12 40 20 40 32') + P('M6 32Q24 41 42 32') + P('M24 12V21M20 13.5Q16.5 18.5 18 25M28 13.5Q31.5 18.5 30 25') },
        { name: 'Steam', art: P('M17 42C11 36 23 30 17 22C13 16 19 11 17 6') + P('M30 42C24 36 36 30 30 22C26 16 32 11 30 6') },
        { name: 'Chopsticks', art: P('M10 43L35 6M18 43L41 10') },
        { name: 'Bowl', art: P('M6 22H42C42 33 34 40 24 40C14 40 6 33 6 22Z') + P('M18 40V43H30V40') + P('M19 16C17 12 21 10 19 6M28 16C26 12 30 10 28 6') },
        { name: 'Chilli', art: P('M15 15C12 27 21 40 39 42C31 34 27 23 23 15Z', F) + P('M19 15C19 11 21 8.5 25 7.5') },
        { name: 'Steamer', art: E(24, 14, 18, 5) + P('M6 14V34C6 37 14 40.5 24 40.5C34 40.5 42 37 42 34V14') + P('M6 23C6 26 14 29 24 29C34 29 42 26 42 23') }
      ],
      pattern: [1, 0],
      badges: [
        { text: 'Slow steamed · Slow steamed ·', sym: 0 },
        { text: 'Bold flavor, soft bite ·', sym: 1 }
      ],
      keywords: ['Steam', 'Soft bao', 'Bold flavour', 'Playful edge', 'Street food'],   // DRAFT
      notes: ['the logo', 'the table', 'takeout box', 'the pattern'],
      world: ['koma-slide-5-flatlay.webp', 'koma-slide-3-badges.webp', 'koma-slide-7-pattern.webp'],
      pack: {
        type: 'box', heading: 'The takeout box',
        text: 'A black box with one green steam mark on the lid and the thin wordmark on the front, opened flat.',   // DRAFT
        front: { src: 'box-front.webp', width: 740, height: 560 },
        lid: { src: 'box-lid.webp', width: 440, height: 200 },
        photos: ['koma-slide-6-packaging.webp', 'koma-slide-5-flatlay.webp']
      }
    },

    'meridian': {
      stroke: { w: 1.5, cap: 'round' },
      symbols: [
        { name: 'Peaks', art: P('M4 38L18 14L26 26L32 18L44 38') + P('M14.5 20L18 23L21.5 19.5') },
        { name: 'Pine', art: P('M24 6L14 22H20L11 34H37L28 22H34Z') + P('M24 34V42') },
        { name: 'Trail', art: P('M14 44C8 36 30 34 22 26C16 20 34 18 28 10', 'is-dash') + C(28, 8, 2.2, F) },
        { name: 'Compass', art: C(24, 24, 17) + P('M24 12L28 24L24 36L20 24Z') + P('M24 4V8M24 40V44M4 24H8M40 24H44') },
        { name: 'Sunrise', art: P('M15 34A9 9 0 0 1 33 34') + P('M4 34H44M24 14V19M11 21L14.5 24.5M37 21L33.5 24.5') + P('M12 40H36') },
        { name: 'Contour', art: P('M24 8C34 8 41 15 40 24C39 34 31 40 22 39C13 38 7 31 8 22C9 14 15 8 24 8Z') + P('M24 15C30 15 34 19 33 24C32 30 27 33 22 32C17 31 14 27 15 22C16 18 19 15 24 15Z') + C(24, 23.5, 2.5) }
      ],
      pattern: [5, 0],
      badges: [
        { text: 'Trail · Pace · Purpose · Trail · Pace · Purpose ·', sym: 0 },
        { text: 'Run further · Run further ·', sym: 2 }
      ],
      keywords: ['Peaks', 'Trails', 'Contour lines', 'Gold on green', 'Calm and premium'],   // DRAFT
      notes: ['on the trail', 'card and tag', 'the emblem', 'slow mornings'],
      world: ['meridian-lifestyle-action.webp', 'meridian-apparel-shot.webp', 'meridian-lifestyle-detail.webp'],
      pack: {
        type: 'tag', heading: 'The hang tag',
        text: 'A swing tag for the club’s kit: the peaks mark on the front, the three words of the club on the back.',   // DRAFT
        front: { src: 'logo-primary.webp', width: 620, height: 390 },
        lines: ['Trail.', 'Pace.', 'Purpose.'],
        photos: ['meridian-flat-lay.webp', 'meridian-lifestyle-detail.webp']
      }
    },

    'pebble-and-co': {
      stroke: { w: 2.6, cap: 'round' },
      symbols: [
        { name: 'Pebble', art: P('M24 8C16 8 11 20 10 28C9 37 15 42 24 42C33 42 39 37 38 28C37 20 32 8 24 8Z', F) + C(19.5, 26, 1.4) + C(28.5, 26, 1.4) + P('M20.5 31Q24 34.5 27.5 31') },
        { name: 'Cloud', art: P('M13 35H35C40 35 42.5 31 41.5 27.5C40.5 23.5 36.5 22 34 23C33 17 28 14 23 15C18 16 16 20 16 23C12 22 8 25 8 29C8 32.5 10 35 13 35Z') },
        { name: 'Star', art: P('M24 6L29 18L42 19L32 27.5L35.5 40.5L24 33L12.5 40.5L16 27.5L6 19L19 18Z', F) },
        { name: 'Sun', art: C(24, 24, 8.5, F) + P('M24 6V10M24 38V42M6 24H10M38 24H42M11.5 11.5L14.5 14.5M33.5 33.5L36.5 36.5M36.5 11.5L33.5 14.5M14.5 33.5L11.5 36.5') },
        { name: 'Rainbow', art: P('M7 36A17 17 0 0 1 41 36') + P('M13.5 36A10.5 10.5 0 0 1 34.5 36') + P('M20 36A4 4 0 0 1 28 36') },
        { name: 'Heart', art: P('M24 40C14 32 8 26 8 19C8 14 12 10 17 10C20 10 22 12 24 15C26 12 28 10 31 10C36 10 40 14 40 19C40 26 34 32 24 40Z', F) }
      ],
      pattern: [1, 2],
      badges: [
        { text: 'Play more · Play more · Play more ·', sym: 0 },
        { text: 'Pebble & Co. · Pebble & Co. ·', sym: 3 }
      ],
      keywords: ['Smiles', 'Sunshine', 'Soft shapes', 'Play', 'Warm and safe'],   // DRAFT
      notes: ['bubble letters', 'tag and toys', 'the backpack', 'play more'],
      world: ['pebble-lifestyle-action.webp', 'pebble-lifestyle-detail.webp', 'pebble-icon-texture.webp'],
      pack: {
        type: 'tag', heading: 'The toy tag',
        text: 'The tag that hangs off every toy: the smiling pebble on the front, a nudge to play on the back.',   // DRAFT
        frontArt: { sym: 0, text: 'Pebble & Co.' },
        lines: ['Play', 'more.'],
        photos: ['pebble-flat-lay.webp', 'pebble-product-shot.webp']
      }
    }
  };
})();
