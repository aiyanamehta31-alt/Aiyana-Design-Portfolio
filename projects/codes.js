/* =====================================================================
   CASE STUDY DATA · Codes
   Codes has its own world (js/worlds/codes.js + css/worlds/codes.css):
   a creative-coding playground where each sketch runs live. This file
   holds the words; the sketches themselves are in js/codes/.

   Sources (content/codes/): programminggeometric.js, movingelements.js,
   aiyanaAssignment3.js, assignment4.js and the Assignment 3 recording.
   Reflections are taken from the comment at the top of each file,
   tidied for spelling and grammar (approved by Aiyana).
   ===================================================================== */
window.CASE_STUDIES = window.CASE_STUDIES || {};
window.CASE_STUDIES['codes'] = {
  slug: 'codes',
  title: 'Codes',
  world: 'codes',
  images: 'assets/images/projects/codes/',

  cover: {
    line: 'Creative coding experiments in JavaScript: shapes, motion, type and space.',
    facts: [
      { label: 'Course', value: 'Coding' },
      { label: 'Year', value: '2026' },
      { label: 'Tools', value: 'JavaScript, HTML Canvas, canvas-sketch' }
    ],
    word: 'CODES'
  },

  sketches: [
    {
      id: 'orbit',
      title: 'Orbit',
      stage: 'First exercise',
      file: 'programminggeometric.js',
      module: 'js/codes/orbit.js',
      dimensions: [2048, 2048],
      still: 'orbit.webp',
      label: 'Neon rings turn around a ten-pointed star, circled by orbiting squares, pulsing triangles and glowing dots, with hexagons in the corners, on a dark violet ground.',
      hint: 'Move your pointer out from the centre to spin it faster.',
      how: 'Every shape is placed with polar coordinates: cos and sin of an angle, times a distance from the centre. Each layer adds elapsed time to its angle at its own speed, so the rings, squares and triangles drift against each other.',
      reflection: 'In class, our professor helped us understand movement more and more each day, which gave me the confidence to try a complex animation. It was still challenging to control many shapes and make their motion smooth and coordinated. Finally, I managed to bring all the animated elements together in a way that worked well.'
    },
    {
      id: 'bloom',
      title: 'Bloom',
      stage: 'Second exercise',
      file: 'movingelements.js',
      module: 'js/codes/bloom.js',
      dimensions: [2048, 2048],
      still: 'bloom.webp',
      label: 'A grid of small coloured squares pulls in towards the centre and opens into a many-petalled flower, then settles back into a grid.',
      hint: 'Move your pointer across to change the petals.',
      how: 'Each square measures its angle from the centre, and a sine wave of that angle sets how far it travels, which carves out the petals. A smoothstep curve eases the grid into the flower and back every six seconds.',
      reflection: 'This assignment was fairly hard: we learnt basic transformations in class, but I had to research more to turn squares into a flower. Making the animation smooth and responsive was hard at first, but my curiosity helped me experiment and understand angles and movement better. Through the struggle, I managed to create the effect I imagined.'
    },
    {
      id: 'wave',
      title: 'Wave',
      stage: 'Assignment 3',
      file: 'aiyanaAssignment3.js',
      module: 'js/codes/wave.js',
      dimensions: [1080, 1080],
      still: 'wave.webp',
      label: 'A word written in small light-blue dots on a dark ground, which melts into a ring of dots and back into the word.',
      hint: 'Type any word.',
      how: 'Text is drawn off-screen, sampled into dots, and matched point-for-point with a circle so they can morph.',
      reflection: 'I explored how a word can shift between two forms, combining what we learned in class: drawing text, sampling pixels, animating points and interpolating values. The challenge was making sure both shapes always have the same number of points, so the transition feels smooth. Solving that helped me understand point-based animation, and showed me how small techniques can combine into a more expressive motion experiment.'
    },
    {
      id: 'galaxy',
      title: 'Galaxy to Sun',
      stage: 'Final group project',
      file: 'assignment4.js',
      module: 'js/codes/galaxy.js',
      dimensions: [2560, 1440],
      still: 'galaxy.webp',
      stillSolar: 'galaxy-solar.webp',
      label: 'A wide spiral galaxy of blue and violet dust on black. After the warp: the Sun with eight textured planets moving on tilted orbits.',
      hint: 'Click the galaxy to warp into the solar system.',
      how: 'The galaxy is 100,000 particles placed along four spiral arms with polar maths. The solar system moves eight planets on tilted ellipses, each wearing a texture generated in code.',
      reflection: 'Our project explores scale and motion in space, moving from a large-scale galaxy to a detailed solar system. As a group, we refined the transitions, motion timing and visual consistency so both scenes work as a single piece. We learned how visual systems can be developed separately, then brought together into one coded artwork through iteration and collaboration.',
      credits: {
        team: 'Group project. Pratha led the concept and visual direction, Riva built the galaxy, and',
        mine: 'I built the solar system: orbital motion, planet spacing and procedural planet textures.'
      }
    }
  ],

  next: { slug: 'wiglet', title: 'Wiglet' }
};
