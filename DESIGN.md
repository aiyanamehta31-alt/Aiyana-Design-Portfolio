# DESIGN.md — Aiyana's portfolio brief

> The source of truth for this portfolio. Refer back to this in future prompts.
> Last updated 2026-11-23 (branch `simplify`): one pure black, a Hello section after the hero, a narrow two-column work grid (Nexo, Branding, Maggi, Wiglet), the journey world (the result first, then numbered chapters) for Maggi and Branding, the Skills stage removed, and the guide light replaced by a fabric the cursor bends (see "Homepage", "The fabric" and "Project worlds: Journey"). 2026-11-05: the homepage redesigned as one black world, with a calm type scale, a Skills placeholder, About as Aiyana's desktop and a wandering guide light (see "Homepage"). 2026-10-27: Wiglet added as the first project (see "Project worlds: Wiglet"). 2026-10-25: Nexo rebuilt as its own world inside the glass sheet (see "Project worlds: Nexo"). 2026-10-23: case studies added as a glass sheet over the homepage (first project: Nexo). 2026-10-22: hero rebuilt as a black stage with a constant, perspective wheel matching the Quadro reference frames.

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
- Files: `index.html`, `css/style.css`, `js/main.js`, `js/home/` (the fabric, the intro, the locker, the desktop, the storm mixer), `css/case-study.css`, `js/case-study.js`, `projects/<slug>.js`, `js/worlds/<world>.js` + `css/worlds/<world>.css` (a project's own world, loaded on demand), `assets/images/`, `content/` (original project files), `references/`, `BUILD_LOG.md` (a dated entry for every change).
- All colours, fonts, spacing, and animation timings are CSS variables at the top of `style.css`.
- Animate with GPU-friendly properties only: translate, rotate, scale, opacity.

## Palette: one black world (do not add other colours)

| Role | Hex | Use |
| --- | --- | --- |
| Black | `#000000` | The whole homepage, top to bottom, the same as the hero |
| Primary text | `#EDEDED` | Body text and titles (16.9:1) |
| Secondary text | `#9A9A9A` | Descriptions, intros (7.0:1) |
| Muted | `#7A7A7A` | Labels and quiet notes (4.6:1; the brief's `#6B6B6B` is only 3.7:1) |
| Amber | `#E2B877` | Links, focus, active states (11.3:1) |

- No light or beige sections on the homepage, and no colour blocks or hard cuts: sections are separated by space alone.
- No film grain: the black is one continuous `#000` from the hero down.
- **The hero** keeps its own black stage and type (`--hero-*` tokens).
- **Frosted widgets** (About) sit over a photo, so inside them the greys are lighter (`#BDBDBD`, `#ADADAD`) and the glass denser (`rgba(16,16,18,0.72)`), which keeps AA (5.5:1 and 4.6:1 on the brightest wallpaper).
- Case-study sheets keep their own worlds and colours (`css/case-study.css`, `css/worlds/`).

## Typography

- **Hero:** **Instrument Serif italic** ("Aiyana's" in the headline only), **Geist** ("portfolio", name, "Scroll to explore") and **Geist Mono** (nav links, "Let's talk" corner, card labels).
- **Rest of the homepage:** **Funnel Display** (section titles, project names), **Funnel Sans** (body) and **Geist Mono** (small labels).

### Type scale (homepage, strict)

| Step | Size | Font and style | Token |
| --- | --- | --- | --- |
| Label | 12px | Geist Mono, uppercase, letter-spacing 0.06em | `--t-label` |
| Secondary | 14px | Funnel Sans | `--t-small` |
| Body | 16px, line-height 1.6 | Funnel Sans | `--t-body` |
| Section title | clamp(28px, 3.2vw, 44px), weight 600, letter-spacing −0.025em | Funnel Display | `--t-title` |

- Only the hero headline may be larger.
- At most three text sizes per section; lines no longer than about 60 characters (`--measure: 60ch`).
- Project names are body size in weight 600; category and year are labels.

## Homepage: one continuous scroll

No full-screen chapters, no slides, no snapping: one long page.

### Layout

- Content sits in one centred column, at most 1200px wide (`--page-max`); Hello, Selected work, Skills and Contact use the narrower 960px column (`--page-narrow`, `.wrap--narrow`).
- Order: hero, Hello, Selected work, Skills, About, Contact, footer.

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
- Headline "Aiyana's portfolio" (2026-11-24), two fonts: "Aiyana's" in **Instrument Serif italic** (`--font-hero-name`, letter-spacing -0.01em) and "portfolio" in **Geist 500** at 0.82em, letter-spacing -0.045em. `#FFFFFF`, clamp(40px, 4.4vw, 64px) (phones clamp(34px, 10vw, 44px)), line-height 1. No paragraph underneath.

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

**Below the hero:** the black top bar (name, Work, Skills, About, Resume, Contact) stays tucked away while the hero is on screen and slides in once the visitor scrolls past it.

### Section 2: Hello

- Straight after the hero, before the work: who I am. Label "Hello", then "I'm Aiyana, a design student who designs journeys, not just screens." in Funnel Display, whose words light from grey to white as they scroll by (`js/home/intro.js`, any `[data-light-words]` heading; shown lit with reduced motion).
- Two short paragraphs side by side (one column on phones) and six pills for what I work on. School, course and year still to add.

### Section 3: Selected work

- A narrow two-column grid (one column under 640px), in this order: **Nexo, Branding, Maggi, Wiglet**. Each card: picture (4:3), category and year, name, one line, tag pills; it opens the project (`#project/<slug>`). Branding's picture is a small open book in 3D (tilted back on a table, pages rising from the spine over stacked paper edges, a thick cover, a cast shadow; it lifts a little on hover) that keeps turning its pages, one spread per brand (logo on the left, the brand in use on the right). Every 3.4 s a page turns like real paper over 1.6 s: it's built from ten thin strips hinged edge to edge, lifts by its outer edge and curls as it rises, then settles spine-first with the edge floating down last, each strip shaded by its angle; every picture is decoded before use so nothing flashes (`js/home/minibook.js`, pages in the card's `data-pages`; it turns only on screen, and stays open on the first spread with reduced motion).
- Hover: the picture zooms slightly, the card lifts and the name turns amber. No amber edge round the picture (a faint white one only); keyboard focus keeps its amber outline.
- Below them, **Explore more projects** opens the **All projects** view (`#work/all`): all five projects, Codes included, on the same black. "Back" (or Esc, or the browser's back button) returns to the same scroll position.

### Section 4: Skills, the locker

Code: `index.html` (section `.skills`), `css/skills.css`, `js/home/locker.js`; all content in **`js/skills-data.js`**. Galleries: `projects/skills.js`, `js/worlds/skills.js`, `css/worlds/skills.css`. Reference: `references/locker-reference.png` (look and feel only).

- **The locker (closed):** one grey steel school locker centred on the black, lit softly from above. CSS 3D with brushed-steel gradients; vents, hinges, handle, the "AIYANA" nameplate and the padlock are SVG.
- **The padlock** wiggles every few seconds and on hover, with "Open my locker" under it. Drag the dial a full turn, or click, Enter or Space, to open it.
- **Opening:** the door swings open in 900 ms with a small overshoot, the strip light flickers twice and stays on, and the doodles and handwriting (Caveat) write themselves in. A soft clunk plays only if the storm mixer's sound is already on.
- **Inside:** the pixel portrait, "Designer" with a halo, "About me…" and "I'm here to…", and stickers on the door (drag them on desktop; "Put back" returns them).
- **The shelf:** six objects (camera, sketchbook, tablet, 3D figure, clapper, rolled poster). Hover wiggles and names them; a click opens that skill's work in the glass sheet (`#project/skills/<skill>`).
- The 3D show-and-tell stage and its Period 1–6 tabs were removed on 2026-11-23: there isn't enough 3D work to show yet.
- **Reduced motion:** the locker opens instantly with no flicker or wipe.

### Section 5: About, as Aiyana's desktop

Code: `index.html` (section `.about`), `css/style.css` ("About: Aiyana's desktop"), `js/home/desktop.js`, `js/home/storm.js`.

- A large frosted window of my own design (no operating-system look): a bar with "Aiyana's desktop" and a **Straighten up** button, the storm-sea wallpaper, and a dock along the bottom.
- Frosted glass widgets that can be dragged by their bar, or moved with the arrow keys from their grip button (Shift for bigger steps). **Straighten up** glides them back to their places.
  - **Hi, I'm Aiyana:** a short bio and a photo slot.
  - **Where I've been:** education and experience as calendar-style entries.
  - **Toolbox:** my tools as generic app icons (never brand logos).
  - **Away from the desk:** a photo stack; click to shuffle.
  - **Storm mixer:** Rain, Sea and Thunder sliders over a live Web Audio soundscape (filtered noise for rain, slow swells for the sea, occasional low rumbles; no audio files). Nothing plays until **Play**; a clear **Mute**. The wallpaper reacts: rain streaks on the glass, the sea darkens, a soft flash for thunder.
  - A small **Wiglet blob** in the corner that blinks and squishes on hover (an easter egg).
- The dock brings each widget forward; **Resume** downloads the PDF.
- Phones (≤ 860px): the widgets stack as a column of cards on the wallpaper, dragging is off, and the dock sits under them.
- Names are my own, chosen not to echo a classmate's portfolio.

### Section 6: Contact and footer

- "Let's make something.", then Email, LinkedIn and Resume as clean rows with amber underlines that draw in on hover.
- A quiet footer row: copyright, credits, back to the top.

### The fabric: the cursor bends the page

Code: `js/home/fluid.js` (settings at its top, the fabric under `S.fabric`), `.fluid` in `css/style.css`. Replaced the wandering guide light on 2026-11-23, after water ripples, colour clouds, a liquid-glass blob and a colour-smoke trail were tried the same day.
- Behind the black there's a fine woven grid (threads every 30px, brighter knots where they cross). It stays dark except around the cursor, where it glows into view (about 190px round it), and wherever it's moving.
- A small WebGL fluid simulation runs under it. Moving the mouse (or a finger) pushes the flow, and the threads are drawn through it: they stretch, bend and curl behind the hand, then spring back within a second or so. A tap or click gives it a push.
- The grid is fixed to the page, so it scrolls with the content, and scrolling drags a soft elastic wave through it under the cursor.
- Colour stays soft: a faint wash in the colours of what's under the cursor tints the threads (`data-cloud="#hex #hex"`: greys in the hero and Hello, each project's own colours beside its card, amber in Skills and Contact, sea grey in About).
- It runs only while something moves (4.5 s after the last input), then keeps its last frame; it goes dark under a project sheet or All projects, and is off with reduced motion or without WebGL. The hero and body have no background of their own so the canvas shows through; `html` carries the black.

## Case studies: the glass sheet

Built 2026-10-23. Code: `css/case-study.css` (tokens at its top), `js/case-study.js` (the sheet, lightbox, URL and focus for every project, plus the default template). Nexo now has its own world (below); the template is there for the next projects.

**Adding a project:** write `projects/<slug>.js` (the data shape is documented at the top of `js/case-study.js`'s rendering section), put WebP images (max 2400px wide) in `assets/images/projects/<slug>/`, and give a homepage card `href="#project/<slug>" data-project="<slug>"`. No layout code. Source files stay untouched in `content/<slug>/`.

**Structure (Double Diamond, minimal):** cover → the challenge (with the "How might we" set large) → Discover (method chips, photos, an insight bento) → Define (journey map full width, problem statement whose words light up on scroll) → Develop (before → after comparisons) → Deliver (final renders, a full-bleed video) → Outcome ("from → to" shifts, learnings) → next project and "Back to all work". Each section: a small phase label, a heading of max 8 words, max 2 sentences, then visuals. Never invent findings, numbers or quotes; mark gaps `[PLACEHOLDER: …]` or `[NEEDS FROM AIYANA: …]` (both shown with a dashed outline).

**Opening:** the card grows into a frosted glass sheet (FLIP, 700ms, `cubic-bezier(0.22, 1, 0.36, 1)`) while the homepage blurs (14px) and dims (`rgba(28, 28, 27, 0.35)`). 20px margin on desktop, full screen on phones. URL `#project/<slug>`; back button, ×, Esc or clicking outside closes it back into the card.

**Glass and colour journey:** the sheet's tint blends with scroll: cover and challenge on silver mist, Discover on storm taupe, Define and Develop on deep cloud, Deliver and Outcome on dark sea. To keep WCAG AA on glass over the dimmed homepage, the tint opacity rises on the darker tones (mist 0.72, taupe 0.82, cloud 0.90, sea 0.72), and the amber per tone is `#5B3D16` (mist), `#4A3112` (taupe), `#F0CF9C` (cloud; `#E2B877` is only 3.8:1 there) and `#E2B877` (sea). Film grain at 4%, 1px edge `rgba(255,255,255,0.18)`, top highlight. Text flips light/dark at the midpoint of each blend.

**Cover:** the project name set huge as a stage, with the final render (a transparent cutout) standing on it, as in the Nexo deck. Its letters rise one by one and the render drifts slower than the scroll.

**Inside:** a slim glass phase bar (name, Discover · Define · Develop · Deliver with the current one in amber, ×; a dropdown on phones) and a 3px amber progress line. Section heads rotate through three compositions (split, stack, offset) so neighbours never match. Images sit in a glass tray (6px shell, 12px inner radius) and open in a glass lightbox (arrows, keys, Esc).

**Fallbacks:** no `backdrop-filter` or `prefers-reduced-transparency` → solid tones. `prefers-reduced-motion` → fades instead of the grow, tones change in steps, no scrubbing, parallax or reveals.

## Project worlds: Nexo

Rebuilt 2026-10-25. A project can have its own world: `world: 'nexo'` in `projects/nexo.js` loads `js/worlds/nexo.js` (renders the scenes, adds the motion) and `css/worlds/nexo.css`. The shared sheet, lightbox (any `data-zoom` image), `#project/nexo` URL, focus trap and Esc/back behaviour are unchanged. `projects/nexo.js` holds only words and pictures, each traced to `content/nexo/` (deck page numbers in comments).

**Look (from the Nexo deck):** indigo `#2E3091`, orange `#F36E23`, paper `#FBF9F5`. Inter Tight stands in for the deck's Switzer; Chewy for its HollyBerryPop (dog-day phase names only). The storm palette stays outside; inside, three glass tones: paper (ink indigo 9.4:1), indigo (ink paper 10:1, small accent `#FFB98A` 6.3:1) and orange (ink `#1C1D5E` 5.2:1). Orange text on paper is `#C9510F` and only for large display type (3.9:1). Orange itself is for the thread, the beats and big words on indigo.

**Structure: a dog's day over the Double Diamond.** The whine (the problem) → Sniffing around (Discover) → Picking up the scent (Define) → Fetch (Develop) → Walkies (Deliver) → Treat (outcome and reflection). Each phase name is set large in Chewy with the real phase name small underneath.

**The 12 scenes:** cover (logo, render, facts, the breathing face the thread grows from) · the whine (pinned 1.3 screens: owner and dog drift apart as MODERN LIFE wedges in; three beats from the journey map) · field research (five sites, eight photos, dog-type tags, AEIOU tabs) · quotes (speech bubbles, the "nudge me" quote is the key) · affinity board (pinned 1.5 screens on desktop: every note falls in a mess, then sorts into five clusters; two themes ringed in orange; phones show six notes per cluster with "Show all") · personas + journey (the thread flows through Luna's emotion curve; pain points light up; 3 PM is the low point) · problem + HMW (words light up; key words orange) · ideation (DVF totals count up, two concepts crossed out, two merge) · form (pinned 1.5: one frame steps from sketch to the coded face; step buttons jump) · device (callout lines on the render; five collars) · app (pinned 1.5: four screens slide sideways) + prototype slot + concept video · Treat (three shifts, then owner and dog come back together, where the thread ends).

**The thread** (final form 2026-11-24, after a scroll-drawn line, a walking dog and a leaping icon were tried and dropped): a static line, drawn once and part of the page, so it scrolls with the story like everything else and never moves by itself. It grows out of the breathing face on the cover, meanders gently down the margin of each scene (a soft 9px sway over 560px), and crosses to the other side in the empty space at the top of the next scene with a soft loop in the middle, like a leash curling. It flows into Luna's emotion curve at its first point and out of its last, and ends where owner and dog touch. Small filled dots mark the key moments. Orange, deep indigo over the orange scenes. Nothing about it runs while scrolling.

**The dock:** a glass pill at the bottom of the sheet with six dots; it opens to show the phase names while a phase heading is on screen (or on hover/focus), then folds back. The current phase's dot is orange. Clicking a dot jumps to that phase and focuses its heading.

**Motion rules:** GSAP ScrollTrigger on the sheet's scroller; Lenis smooths the sheet's own scroll (desktop, fine pointer); scroll-linked timelines use `scrub: 0.6` so they catch up smoothly instead of jumping with each scroll step. The Nexo sheet, its bar and the dock are solid (no backdrop blur). The tones fade as before, the whole sheet blending from one scene's colour to the next over the last stretch before it, but cheaply: the world declares `ownTones`, so the shell sets only the sheet's and bar's background colour per frame and flips the inherited colour variables (ink, accent, tint) once at the midpoint, instead of changing them every frame and restyling the whole story. The dock follows the flip with a 450 ms fade. Every picture is decoded in idle time after the sheet opens, so no scene stalls on its images. The dock works only from positions measured on refresh, so a scroll frame does no layout reads. Pinned scenes are CSS `position: sticky` stages, at most 1.5 screens of extra scroll. Reveals are `fromTo` with `cubic-bezier(0.22, 1, 0.36, 1)`. Positions are measured from layout offsets, not transformed rects, so re-measuring mid-scroll is safe. Everything is written in its finished state first; `prefers-reduced-motion` shows that state with no pins or scrubbing (the thread is static anyway).

## Project worlds: Codes

Added 2026-10-25. `projects/codes.js` (words), `js/worlds/codes.js` + `css/worlds/codes.css` (the world), `js/codes/*.js` (the four sketches as browser modules) and `js/codes/runner.js` (the canvas-sketch stand-in). Dark "night" glass (`12, 14, 20` at 0.94; ink `#ECE8DF`, amber `#E2B877`), Geist and Geist Mono. Each sketch runs live in its original coordinate space, scaled to its frame. Only the most visible sketch plays, and code loads when a sketch is about a screen away. With reduced motion, each sketch shows a still frame with a Play button. A new sketch needs a module exporting `dimensions` and `create()`, an entry in `projects/codes.js`, and a still in `assets/images/projects/codes/`.

## Project worlds: Wiglet

Added 2026-10-27. "Next project" now loops Nexo → Branding → Maggi → Wiglet → Codes → Nexo. `projects/wiglet.js` (words), `js/worlds/wiglet.js` + `css/worlds/wiglet.css` (the world), `js/wiglet/scheduler.js` (the real scheduler, ported; tests in `js/wiglet/scheduler.test.js`), `js/wiglet/demo-parser.js` (the labelled stand-in for Whisper + the LLM), `js/wiglet/scheduler-source.js` (generated by `tools/embed-wiglet-source.mjs`). Navy glass (`10, 14, 26` at 0.95; ink `#E8F0FF`, accent teal `#5EEAD4`), Space Grotesk + JetBrains Mono, the widget's own CSS inside the demo. Everything is a classic script, so it runs from `file://`, and the demo makes no network calls. The "Try the real Wiglet" section appears only once `real.liveUrl` is set.

## Project worlds: Journey (Maggi, Branding)

Added 2026-11-23. `world: 'journey'` loads `js/worlds/journey.js` and `css/worlds/journey.css`. The flow: **the finished work first, then the effort it took.**
- **Opener:** the finished piece full screen on black (several side by side for Branding), with the name set large (Funnel Display), one line and "Scroll for the story". As you scroll, the work settles back and the words fade.
- **Intro:** a sentence or two, tag pills and the facts (year, context, team and role, tools).
- **Chapters:** numbered 01, 02 … beside a sticky index (hidden under 1024px) that follows the chapter on screen; click to jump. Each chapter has a title, one lead line, then steps: a small label with an amber dash, a line or two, then pictures (full, pair, trio or grid; every picture opens the lightbox), a video (plays only on screen, never with reduced motion), colour swatches, or a handwritten note (Caveat) in the margin.
- **Colour:** one black (`0, 0, 0` at 0.97), ink `#EDEDED`, amber numbers; inside a brand's chapter its numbers, dashes and notes take the brand's own accent.
- **Data:** `opener`, `intro`, `tags`, `facts`, `chapters` in `projects/<slug>.js`. Branding builds its chapters from `projects/branding/<brand>.js` (explorations → the mark → colour → in the world), and `#project/branding/<brand>` lands on that chapter.
- **Maggi:** five chapters, from the Illustrator artboards and the dieline to the pack, the moustache character, the store scenes and the exhibition table. Images in `assets/images/projects/maggi/` (`node tools/brand-images.mjs --project maggi`); the team photo is left out until I say so.

## Project worlds: Branding (the flip book, no longer in use)

Added 2026-11-03, replaced by the journey world on 2026-11-23; the code stays in `js/worlds/branding.js` and `css/worlds/branding.css`. Five brand identities as **one book**: front cover, one page per brand, back cover, with page turns, auto-flip and a card grid. Each page grew into its brand's story, with one signature interaction per brand. Data: `projects/branding/<brand>.js`; images: `node tools/brand-images.mjs <brand>`, crops in `tools/brand-crops/<brand>.json`.

## Signature element: the line of light

- Link underlines grow in amber from the left on hover and focus.
- In case studies it draws across the top of Deliver, as if the light breaks through.

## Cursor: bubble to bullseye (switched off for now)

- **Currently off:** the normal system cursor is used. The code is kept; set `ENABLE_CUSTOM_CURSOR = true` at the top of `main.js` to bring it back.
- A soft, semi-transparent amber bubble (~34px) that follows the mouse with a slight lag and squishes/stretches in the direction of movement based on speed.
- Over anything interactive (links, buttons, project cards, wheel cards) it tightens into a larger outlined focus ring (~52px) with a small solid dot in the centre.
- Its colour follows the current accent.
- Hidden on touch devices, which keep the normal cursor.

## Navigation

- **In the hero:** the hero's own transparent top bar (see Section 1).
- **Below the hero:** a small fixed black top bar (my name on the left; Work, Skills, About, Resume, Contact on the right, in mono labels) slides in once the hero has scrolled away.
- "Scroll to explore" in the hero doubles as a shortcut to the work.

## Smaller interactions

- Headings and text fade and rise gently into view as they scroll in.
- Keep everything smooth and calm, never flashy.

## Quality

- Fully responsive. On tablets and phones the wheel has 8 cards and its own sizes (see Section 1), the phone nav becomes a MENU button, and touch devices skip hover zoom.
- Accessible: semantic HTML, alt text, visible keyboard focus, keyboard navigation.
- `prefers-reduced-motion`: no smooth scrolling, no wheel rotation or entrance (cards stay still in their ring), no hover zoom, no fabric effect, no rain animation or thunder flashes, no widget animations; everything shows in its final state.
- Audio never plays by itself. Every interaction has a keyboard path, and every control is labelled.
- Fast: no heavy libraries beyond GSAP, ScrollTrigger, and Lenis.
- Clearly marked placeholder text and images, to be replaced with real content.
