/* =====================================================================
   SKILLS · everything the locker and the show-and-tell stage show
   Adding work means editing only this file (and adding the files).

   THE LOCKER
   - portrait: path to the pixel portrait (assets/images/skills/portrait-pixel.png).
     Empty = the placeholder silhouette.
   - notes: the two handwritten lines inside the locker.
   - tools: the stickers on the inside of the door. `logo` is the official
     logo file in assets/images/skills/logos/ (used unaltered, only to show
     the software). Empty = a labelled placeholder sticker with the name.

   THE STAGE: one entry per skill, in "class schedule" order.
   Each piece:
     title, line (one line), tools (list)
     type: model | phone | can | box | poster | prints | sketchbook | screen
     still: an image of the piece (shown from file://, without WebGL, and in
            the gallery). alt: what that image shows.
     placeholder: true until the real work is in.
     and, by type:
       model       model: 'path/to/piece.glb' (Draco-compressed is fine)
       phone       screens: ['screen-1.webp', ...] (portrait images)
       can         label: image wrapped round the can; body: can colour
       box         front: image on the front; lid: image on the lid; body: box colour
       poster      front: poster image; back: process image (or note: text)
       prints      prints: ['photo-1.webp', ...]
       sketchbook  pages: ['sketch-1.webp', ...] (shown two at a time)
       screen      video: 'clip.mp4' (muted loop); poster: still frame
   ===================================================================== */
window.SKILLS_LOCKER = {
  portrait: '',   // [NEEDS FROM AIYANA: assets/images/skills/portrait-pixel.png]
  title: 'Designer',
  notes: {
    about: '[NEEDS FROM AIYANA: one short line]',
    here: '[NEEDS FROM AIYANA: one short line]'
  },
  // [NEEDS FROM AIYANA: the final list, and each official logo file]
  tools: [
    { name: 'Photoshop', logo: '' },
    { name: 'Illustrator', logo: '' },
    { name: 'Figma', logo: '' },
    { name: 'Blender', logo: '' },
    { name: 'After Effects', logo: '' }
  ]
};

(function () {
var PH = 'assets/images/skills/placeholders/';
var BR = 'assets/images/projects/branding/';

window.SKILLS = [
  {
    slug: '3d-modelling',
    name: '3D modelling and animation',
    object: 'figure',
    pieces: [
      { title: '[NEEDS FROM AIYANA: model title]', line: 'A placeholder figure until the real model is in.', tools: ['Blender'],
        type: 'model', model: '', still: PH + 'model.svg', alt: 'Placeholder: a simple grey figure on a plinth.', placeholder: true }
    ]
  },
  {
    slug: 'ui-design',
    name: 'UI design',
    object: 'tablet',
    pieces: [
      { title: '[NEEDS FROM AIYANA: app or screen set]', line: 'Three placeholder screens. Tap the phone to go to the next one.', tools: ['Figma'],
        type: 'phone', screens: [], still: PH + 'phone.svg', alt: 'Placeholder: a phone showing a blank app screen.', placeholder: true }
    ]
  },
  {
    slug: 'graphic-design',
    name: 'Graphic design',
    object: 'poster',
    pieces: [
      { title: 'Velvet Vine can', line: 'The botanical sparkling water can, with its own label from the brand book.', tools: ['[NEEDS FROM AIYANA: tools]'],
        type: 'can', label: BR + 'velvet-vine/can-label.webp', body: '#EEE8DE',
        still: BR + 'velvet-vine/vv-slide-4-packaging.webp', alt: 'Three cream Velvet Vine cans with a purple vine illustration, on marble.' },
      { title: 'KOMA takeout box', line: 'The bao brand’s black takeout box, with its green steam mark.', tools: ['[NEEDS FROM AIYANA: tools]'],
        type: 'box', front: BR + 'koma/box-front.webp', lid: BR + 'koma/box-lid.webp', body: '#141414',
        still: BR + 'koma/koma-slide-6-packaging.webp', alt: 'A black KOMA takeout box with a green steam mark and wordmark.' },
      { title: '[NEEDS FROM AIYANA: poster title]', line: 'A placeholder poster. The back will show the process.', tools: ['Illustrator'],
        type: 'poster', front: '', back: '', note: 'Process image goes here.', still: PH + 'poster.svg', alt: 'Placeholder: a poster card with a large shape.', placeholder: true }
    ]
  },
  {
    slug: 'product-sketching',
    name: 'Product sketching',
    object: 'sketchbook',
    pieces: [
      { title: '[NEEDS FROM AIYANA: sketch title]', line: 'A placeholder sketchbook. Click it to open.', tools: ['Pencil'],
        type: 'sketchbook', pages: [], still: PH + 'sketchbook.svg', alt: 'Placeholder: a closed sketchbook.', placeholder: true }
    ]
  },
  {
    slug: 'video-generation',
    name: 'Video generation',
    object: 'clapper',
    pieces: [
      { title: '[NEEDS FROM AIYANA: clip title]', line: 'A placeholder clip, drawn live, on a small screen.', tools: ['[NEEDS FROM AIYANA: tools]'],
        type: 'screen', video: '', still: PH + 'screen.svg', alt: 'Placeholder: a small screen showing a looping shape.', placeholder: true }
    ]
  },
  {
    slug: 'photography',
    name: 'Photography',
    object: 'camera',
    pieces: [
      { title: '[NEEDS FROM AIYANA: series title]', line: 'A stack of placeholder prints. Click to deal the next one.', tools: ['[NEEDS FROM AIYANA: camera]'],
        type: 'prints', prints: [], still: PH + 'prints.svg', alt: 'Placeholder: a small stack of photo prints.', placeholder: true }
    ]
  }
];
})();
