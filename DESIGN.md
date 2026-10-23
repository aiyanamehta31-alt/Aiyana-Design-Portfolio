# DESIGN.md — Aiyana's portfolio brief

> The source of truth for this portfolio. Refer back to this in future prompts.
> Last updated 2026-10-22: hero rebuilt as a black stage with a constant, perspective wheel matching the Quadro reference frames. The sections below the hero are unchanged.

I'm Aiyana, a design student building my portfolio for summer design internships at companies like Google, Microsoft, and design agencies. It must feel creative, personal, and professional, not like a generic AI-made template.

## References

- `references/quadro-opening-frame-1.png`, `-2.png`, `references/quadro-motion-frame-1.png` to `-4.png` and `references/quadro-motion-contact-sheet.png`: frames from a screen recording of the Quadro Studio (Framer template) opening, about one second apart.
- The hero copies their **layout, sizing, motion and typography style**. Never copy the reference's logo, text, photos or the "Made in Framer" badge.
- A reference for the final projects-grid design is still to come.

## Personality and idea

- I'm fun and bubbly, but very focused: when I have a goal, I get there. The site should express that tension: playful while wandering, precise when it lands.
- The look comes from my desktop wallpaper: a moody, warm grey stormy sea with one bright line of light on the water. Calm and atmospheric, with one sharp line of light cutting through.
- My case studies tell a journey: they open on the final outcome, then go back to the start and play the process forward.

## Tech

- Plain HTML, CSS, and JavaScript. No framework, no build step (it will go on GitHub Pages later).
- GSAP with ScrollTrigger (CDN) for scroll animation, Lenis (CDN) for smooth scrolling.
- Files: `index.html`, `css/style.css`, `js/main.js`, `assets/images/`, `references/`.
- All colours, fonts, spacing, and animation timings are CSS variables at the top of `style.css`.
- Animate with GPU-friendly properties only: translate, rotate, scale, opacity.

## Palette: "Storm Light" (do not add other colours)

| Role | Hex | Use |
| --- | --- | --- |
| Silver mist | `#E6E2D9` | Homepage start (hero) |
| Mist shade | `#D7D1C7` | In-between grey: top of the projects |
| Pale taupe | `#C8C1B4` | In-between grey: end of the projects |
| Storm taupe | `#B9B0A2` | Homepage end (About, Contact) |
| Deep cloud | `#57514A` | Case-study chapters (later) |
| Dark sea | `#1C1C1B` | Case-study chapters (later) |
| Text on light | `#1F1E1C` | All homepage text |
| Text on dark | `#ECE8DF` | Text on dark case-study chapters |
| Amber glow | `#845B23` on lighter greys, blending to `#5B3D16` on storm taupe; `#E2B877` on dark grounds | Cursor, links, highlights, active states |
| Line of light | soft silver-amber gradient (amber → `#FFFFFF` → amber) | The signature element |

- The two in-between greys sit one-third and two-thirds of the way from silver mist to storm taupe, so the blend is even.
- **The hero is its own black stage**, outside the Storm Light journey: background `--hero-bg` `#000000` (one variable, to change later), headline `#FFFFFF`, secondary text `#8A8A8A` (6.0:1 on black), nav links `#EDEDED`.
- **Contrast (WCAG AA):** the brief's `#8A5F24` (4.34:1 on mist) and `#6E4A1A` (3.69:1 on taupe) fall short of 4.5:1, so they are nudged to `#845B23` (4.64) and `#5B3D16` (4.61). The accent blends with the background, never dropping below 4.6:1. Text `#1F1E1C` stays at 7.8:1 or more throughout.

## Typography

- **Hero:** **Geist** (headline, paragraph, name, "Scroll to explore") and **Geist Mono** (nav links, "Let's talk" corner, card labels), both Google Fonts.
- **Rest of the page:** **Funnel Display** (headings) and **Funnel Sans** (body), both Google Fonts by the same designer: rounded, slightly bubbly letters held in a tight structure, with a clean, readable body face.

## Homepage: one continuous scroll

No full-screen chapters, no slides, no snapping: one long page.

### Colour: a continuous grey journey

- Below the black hero, the homepage is light. It starts on silver mist and blends continuously through the two in-between greys, ending on storm taupe at About and Contact.
- The blend is tied directly to scroll position: no hard edges between sections, one long gradient journey.
- Text stays dark `#1F1E1C` the whole way; the amber accent darkens with the background to keep its contrast.
- Reduced motion: the background changes in simple steps with a short fade instead of a scrubbed blend.

### Section 1: the hero (first screen)

Built to match the reference frames. The code lives in `index.html` (section `.hero`), `css/style.css` (section 5) and `js/main.js` (section 6). Settings at the top of `main.js`: `WHEEL_SECONDS_PER_TURN = 30`, `WHEEL_IMAGES` (the card list) and `ENABLE_CUSTOM_CURSOR = false`.

**Stage**
- Full viewport (`100vh`, then `100svh`), `overflow: hidden`, background `--hero-bg` (`#000000`).
- Layers, back to front: wheel cards (z-index by depth), centre text, then the top bar and corner details. Cards in the lower half of the ring pass behind the text.

**Wheel geometry**
- 10 cards (8 on tablets and phones), evenly spaced (36° apart). Theta is measured clockwise from 12 o'clock, from -180 to 180; d = (1 + cos theta) / 2 (1 at the top, 0 at the bottom).
- The ring is drawn **in perspective**, like the reference: a ring tilted towards the viewer, so cards near the top come closer, growing and spreading apart, while the sides sink low and small. It is anchored to these numbers:
  - Top card centre at `ringCentreY - Ry`, `32vw` wide. Bottom card centre at `ringCentreY + Ry`, about `5vw` wide, below the screen edge and cut off.
  - Widest horizontal reach `Rx` from the centre line (x = 50%).
  - The depth strength comes from the smallest/largest card ratio: u = (1 - min/max) / (1 + min/max).
  - Card width at any angle = maxW × (1 - u) / (1 - u cos theta). Height = width × 0.625 (16:10).
- **Desktop:** ring centre y 63%, Ry 33vh (clamped 220-420px), Rx 25vw (clamped 240-520px). Cards 5vw to 32vw. The brief's starting values were centre 66% and Ry 38vh; 63% and 33vh were measured from the reference frames.
- **Tablet (under 1024px):** Rx 32vw, cards 9vw to 40vw, 8 cards. (9vw keeps the top arc full on tall screens.)
- **Phone (under 640px):** ring centre y 62%, Rx 42vw, Ry 30vh, cards 14vw to 62vw, 8 cards.
- **Text guard:** cards in the upper half of the ring must never touch the words. If one would at any angle, the ring widens a little until it clears. On phones, where the text fills most of the width, this pushes the side cards partly off-screen.
- **Per card, every frame:**
  - In-plane tilt `rotate(-0.22 × theta deg)`: left cards lean clockwise, right cards anticlockwise; the top card is almost level.
  - Lean back `perspective(1000px) rotateX(14deg × d)`, so the top edge looks narrower.
  - Brightness lerp(0.3, 1, d^1.2), done as a black overlay's opacity (same look as `filter: brightness()`, but GPU-only).
  - Opacity lerp(0.4, 1, d); z-index round(d × 100).
  - Corner radius 4% of the card's width; no border, no shadow.
- Cards are sized once at their largest and moved only with `translate3d`, `rotate`, `scale` and opacity.

**Wheel motion**
- Clockwise: up the left side, across the top left to right, down the right side.
- One constant speed: a full turn takes `WHEEL_SECONDS_PER_TURN` (30s), using requestAnimationFrame with delta time.
- Scrolling, dragging and hovering never change speed or direction. It pauses when the tab is hidden or the hero is off screen, and resumes from the same angle.

**Hover**
- The image zooms 1 → 1.08 inside its frame over 600ms, `cubic-bezier(0.22, 1, 0.36, 1)`, and back on leave. The frame stays the same size.
- Pointer (hand) cursor. The wheel keeps turning. Cards are not links and do nothing on click.
- No hover zoom on touch devices or with reduced motion.

**Card images**
- One array in `main.js`: `WHEEL_IMAGES = [{ src, alt, label }]`, with `object-fit: cover` so any real image fills its card.
- Placeholders in `assets/images/wheel/` are tonal, photographic-feeling SVGs: Blended image, 3D model, Model photo, UI screens, Blueprint, Poster, Sketch, Journey map, Prototype, Render.
- The `label` shows as a small, quiet tag in the card's corner (set to `''` to hide).

**Centre text** (centred, vertical centre at 69%)
- Headline "Welcome to Aiyana's portfolio.": Geist 600, `#FFFFFF`, clamp(20px, 1.6vw, 26px) (phones clamp(18px, 5vw, 22px)), letter-spacing -0.03em, line-height 1.15. Small and confident, not a huge hero headline.
- Paragraph, 14px below: "A design student who designs journeys, not just screens. Fun on the outside, focused underneath." Geist 400, `#8A8A8A`, clamp(14px, 1.05vw, 16px), line-height 1.45, max-width 380px.

**Top bar** (over the hero, transparent, padding 34px 32px)
- Left: my own monogram mark (a white circle with an "A", 28px), then "Aiyana Mehta" (`#FFFFFF`) over "Design portfolio" (`#8A8A8A`), Geist 14px.
- Centre "WORK"; right "ABOUT", "RESUME", "CONTACT" with 36px gaps.
- Links: Geist Mono 12px, uppercase, letter-spacing 0.02em, `#EDEDED`. On hover they turn `#FFFFFF` and a thin underline draws in from the left. They jump to the sections on the page.
- Phones: name on the left, a "MENU" button on the right that opens the links (Escape or choosing a link closes it).

**Corners**
- Bottom left (32px in): "LET'S TALK" over the email, Geist Mono 12px, letter-spacing 0.08em, `#8A8A8A`.
- Bottom centre (40px up): a small four-way arrow icon and "SCROLL TO EXPLORE", Geist 12px uppercase, letter-spacing 0.02em, `#8A8A8A`, linking to the work.
- Nothing in the bottom-right corner.

**Entrance**
- Cards fade in from opacity 0 and scale 0.95 over 1.2s, 60ms apart.
- Headline and paragraph fade up 12px over 800ms, starting at 300ms.
- Top bar and corners fade in over 600ms.

**Reduced motion:** no rotation, no entrance, no hover zoom; the cards stay still in their ring with two cards either side of 12 o'clock.

**Below the hero:** the light top bar (name, Work, About, Resume, Contact) stays tucked away while the hero is on screen and slides in once the visitor scrolls past it.

### Section 2: projects grid

- A clean grid of 6 project cards (3 columns on desktop, 2 on tablets, 1 on phones). Each has a cover, project name, one-line description, category and year.
- These cards **are** clickable; each will link to its case study (for now `#`).
- Hover: the cover zooms slightly inside its frame, the card lifts a little, and the cursor becomes the focus ring.
- Cards fade and rise in one after another as they scroll into view.
- Keep it simple for now. A reference for the final grid design is coming, and a glassmorphism style will be added later.

### Section 3: About and Contact

- The About (portrait placeholder, bio, three facts, a photo) and Contact (email, LinkedIn, resume) sections, restyled for the light page, on storm taupe.
- The footer closes with my name set very large, cropped by the bottom edge.

## Case studies (later): the four chapters

The chapter idea moves off the homepage and into **each project case study**. A case study opens on the outcome, then goes back and plays the journey forward, with the background shifting chapter by chapter:

1. **The final product** on silver mist `#E6E2D9`
2. **Back to the start** on storm taupe `#B9B0A2` (messy research, sticky notes)
3. **Figuring it out** on deep cloud `#57514A` (the process: Discover → Define → Iterate → Test)
4. **Where I landed** on dark sea `#1C1C1B` (the light breaks through: the line of light at full brightness)

Text and accent switch to the dark-ground values in chapters 3 and 4.

## Signature element: the line of light

- A thin horizontal line, like light on water: soft silver-amber on the light homepage (the divider above Contact). The black hero does not use it for now.
- Link underlines grow in amber from the left on hover and focus.
- In case studies it grows into a bright silver line in the final chapter, as if the light breaks through.

## Cursor: bubble to bullseye (switched off for now)

- **Currently off:** the normal system cursor is used. The code is kept; set `ENABLE_CUSTOM_CURSOR = true` at the top of `main.js` to bring it back.
- A soft, semi-transparent amber bubble (~34px) that follows the mouse with a slight lag and squishes/stretches in the direction of movement based on speed.
- Over anything interactive (links, buttons, project cards, wheel cards) it tightens into a larger outlined focus ring (~52px) with a small solid dot in the centre.
- Its colour follows the current accent.
- Hidden on touch devices, which keep the normal cursor.

## Navigation

- **In the hero:** the hero's own transparent top bar (see Section 1).
- **Below the hero:** a small fixed light top bar (my name on the left; Work, About, Resume, Contact on the right) slides in once the hero has scrolled away. Its background follows the page's grey, so it always stays readable.
- "Scroll to explore" in the hero doubles as a shortcut to the work.

## Smaller interactions

- Headings and text fade and rise gently into view as they scroll in.
- Keep everything smooth and calm, never flashy.

## Quality

- Fully responsive. On tablets and phones the wheel has 8 cards and its own sizes (see Section 1), the phone nav becomes a MENU button, and touch devices skip hover zoom.
- Accessible: semantic HTML, alt text, visible keyboard focus, keyboard navigation.
- `prefers-reduced-motion`: no smooth scrolling, no wheel rotation or entrance (cards stay still in their ring), no hover zoom, no squishing or scroll-scrubbed motion; background colour changes in steps.
- Fast: no heavy libraries beyond GSAP, ScrollTrigger, and Lenis.
- Clearly marked placeholder text and images, to be replaced with real content.
