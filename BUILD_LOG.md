# Build log

A dated entry for every change to the portfolio: what changed, why, which source files were used, and what's still needed from Aiyana. Newest first.

---

## 2026-10-27 · New project: Wiglet, with a live demo of its real scheduler

**Why:** to add my Agentic AI capstone as the first project, with proof you can use: the real scheduling logic running in the page.

**What changed**
- **A new "Wiglet" project with its own world inside the glass sheet:**
  - The look comes from the deck and the real widget: deep navy, the blue-to-teal gradient, Space Grotesk with JetBrains Mono labels, fixed blocks blue and flexible blocks teal.
  - A redrawn blob mascot floats in the sheet's corner. It blinks, bounces when something is placed, and tilts when something doesn't fit.
  - A floating glass dock shows the five phases.
- **Phases as a day:** Wake up (the problem), Make a plan, Get to work, Ship it, Tomorrow.
- **Scenes:**
  - Three places that never talk.
  - The question, revealed line by line.
  - Meet Wiglet and the four rules.
  - The AI-vs-code pipeline, with AI steps teal and code steps blue.
  - The agent loop.
  - Calls I made, not the AI.
  - What broke, as flip cards.
  - The process trail in numbers (≈30.5 h, ≈785k tokens, 143 tests, 25 commits) with the Sep 11 to Sep 23 timeline.
  - From mockup to menu bar.
  - Your key, your calendar (my email blurred on the Google sign-in screenshot).
  - The live demo.
  - Tomorrow.
- **The live demo:**
  - **Scheduler port:** `wiglet/scheduler.py` and the parts of `models.py` it needs, ported to `js/wiglet/scheduler.js`.
  - **Demo parser:** a rule-based stand-in for Whisper and the LLM, labelled as such in the widget, using the agent prompt's own rules and default durations (`js/wiglet/demo-parser.js`).
  - **Sample day:** DESG319 Lecture, Lunch and UGSEM5 Seminar, locked.
  - **Inputs:** a text box, six example chips, and voice where the browser supports speech recognition.
  - **On submit:** Perceive → Reason → Act → Observe light up, blocks slide into place, and updates are announced politely to screen readers.
  - **Also:** Reset day, and a "View the real scheduler" tab with the original `scheduler.py` next to the port.
  - **No network:** the demo makes no network calls. Everything is a classic script, so it also works from `file://`.
- **Tests:** 51 of the 53 tests in `tests/test_scheduler.py` were ported to `js/wiglet/scheduler.test.js`, 65 checks with the parametrised cases. Run `node js/wiglet/scheduler.test.js`: **65 of 65 pass**. The two timezone-only tests are not ported, since the port works in minutes.
- **Homepage:** Wiglet is now the first card (cover: the demo widget mid-plan and the mascot), followed by Nexo and Codes. The "Project name three" placeholder card is gone.
- **"Next project" links:** Wiglet → Nexo → Codes → Wiglet.
- **Shared shell:** worlds can list their own classic scripts (`scripts`), loaded in order before the sheet opens.
- **Generator:** `tools/embed-wiglet-source.mjs` regenerates `js/wiglet/scheduler-source.js` from the Wiglet repo. It reads only `scheduler.py` and refuses anything key-shaped.

**Security:** none of the Wiglet project's secret files (`.env`, `.env.example`, `credentials.json`, `token.json`) were opened, and nothing from `~/Library/Application Support/Wiglet` was read. Before committing, the portfolio was searched for `gsk_`, `sk-`, `sk-ant-`, `AIza`, `client_secret` and `refresh_token`. The only match is the guard pattern in `tools/embed-wiglet-source.mjs`.

**Files used:**
- `content/wiglet/Wiglet___Capstone_Presentation.pdf`: all 15 slides read. Slides 4, 12 and 13 exported as WebP.
- From the Wiglet repo, read only: `wiglet/` (scheduler, models, agent prompt, server serialisation, config), `static/` (`index.html`, `styles.css`, `app.js`, `wiglet.png`), `wiglet_mac/`, `tests/test_scheduler.py`, `BUILD_LOG.md`, `plan.md`, `README.md`, `retro.md`, `MACAPP.md`.

**Checked**
- Headless Chrome at 1440×900 and 390×844, over http:// and file://, plus reduced motion: no console errors.
- Every chip works, and Reset works.
- No network requests while using the demo.
- The code tab loads both sources.
- Nexo and Codes still open cleanly.

**Still needed from Aiyana**
- **The deployed Wiglet URL.** The "Try the real Wiglet" section is written but hidden until `real.liveUrl` in `projects/wiglet.js` is filled in (marked TODO there).

---

## 2026-10-25 · New project: Codes (live creative-coding sketches)

**Why:** to show my creative coding work as something visitors can play with, not as videos or screenshots.

**What changed**
- **A new "Codes" project with its own world inside the glass sheet:**
  - Dark glass so the sketches glow, Geist for text, Geist Mono for labels and code, and amber `#E2B877` for controls.
  - The cover shows a small live Wave spelling CODES behind the title.
  - The four sketches run in order: Orbit, Bloom, Wave, then Galaxy to Sun, the final group project.
- **Each sketch section:**
  - A live canvas in a glass frame, with Play / View code tabs. The code view is syntax-highlighted and has a Copy button.
  - A "Try it" hint and controls built from real parameters in the code.
  - Full screen in a glass panel that stays interactive; Esc closes it.
  - A "How it works" line and the reflection from the file.
  - Galaxy to Sun's credits, with my part labelled.
- **Converted from canvas-sketch to plain browser modules** in `js/codes/` (no build step), run by one small shared runner, `js/codes/runner.js`:
  - Each sketch draws in its original coordinates (2048×2048, 1080×1080, 2560×1440), scaled to fit its container, with devicePixelRatio capped at 2.
  - Colours, shapes, timing, easing and maths are unchanged.
  - Orbit's glow (shadowBlur) is scaled with the canvas so it looks the same at any size.
- **Interaction fixes:**
  - Wave: typing now goes into a text input instead of the whole page. It's limited to 12 characters, Enter clears it, and the default is "WAVE". A word too wide for the 200px font is shrunk just enough to fit.
  - Bloom: the pointer (or a touch drag) now drives the petal count with the original formula, 4–11 petals.
  - Galaxy to Sun: clicks are scoped to the canvas, and "Back to the galaxy" replays the warp.
  - Orbit: new pointer interaction. Distance from the centre sets the tempo, from 0.5× at the centre to 1.8× at the edge.
- **Controls:**
  - Orbit: play/pause and speed.
  - Bloom: play/pause, grid size (`gridSize`) and a petal readout.
  - Wave: the word input, cycle time (`cycleTime`) and play/pause.
  - Galaxy to Sun: enter/back, orbit lines on/off, and play/pause.
- **Galaxy to Sun performance:**
  - The still galaxy layers (black, fog, 40,000 blue dots) are drawn once to an off-screen canvas.
  - The purple dust's per-frame random alpha (the shimmer) is pre-drawn as three versions and cycled, so each frame is two image draws instead of 100,000 dots.
  - Planet textures are made while the galaxy shows, and Saturn's ring pattern is made once.
  - The shared runner's clock replaces `performance.now()`, so pausing really pauses.
- **Loading and playback:**
  - Each sketch's code loads when it's about a screen away.
  - Only the most visible sketch plays; it pauses when scrolled away or when the tab is hidden.
- **Quality:**
  - With reduced motion, nothing autoplays: each sketch shows a real still frame with a Play button.
  - If JavaScript fails, the still frames show instead of empty boxes.
  - Canvases have `role="img"` and descriptions.
  - Every control is a real, labelled button, input or slider.
- **Homepage:** Codes replaces the "Project name two" placeholder card, with a Galaxy still as the cover.
- **Shared shell (`js/case-study.js`):**
  - Worlds can prepare before opening (`ready`).
  - The sheet gets a `data-world` attribute so each world's styles stay separate.
  - Generic world rules moved into `css/case-study.css`.

**Files used:** `content/codes/` (copied from the programming folder; the originals are untouched): `programminggeometric.js`, `movingelements.js`, `aiyanaAssignment3.js`, `assignment4.js`. The recording `assignment_3_video.mov` was only used to check the converted Wave matches. Reflections come from each file's top comment, tidied (approved). Stills in `assets/images/projects/codes/` are real frames rendered from the converted code.

**Checked**
- Headless Chrome at 1440×900, at 390×844, and with reduced motion: no console errors.
- About 60fps in the galaxy, the solar system and the other three sketches.
- Working: enter/back, the word input and Enter, the pointer driving petals (11 at the right edge), full screen with Esc (the case study stays open), and View code highlighting.

**Note:** the sketches load as ES modules, so view the site through a local server or GitHub Pages. Opened straight from the file system, the page shows the still frames.

---

## 2026-10-25 · Nexo case study rebuilt as its own world

**Why:** the first version read like a template. The brief asked for a case study with its own look, where scroll animation explains the research and design decisions instead of decorating them.

**What changed**
- **Nexo's own world inside the glass sheet.**
  - **Colours:** indigo `#2E3091`, orange `#F36E23` and paper, sampled from the deck PDF.
  - **Fonts:** Inter Tight (for the deck's Switzer) and Chewy (for HollyBerryPop).
  - **Glass:** three tones (paper, indigo, orange), each checked for WCAG AA. The storm palette stays on the homepage.
- **A dog's day over the Double Diamond:** The whine, Sniffing around, Picking up the scent, Fetch, Walkies, Treat, each with the real phase name underneath.
- **12 scenes:** cover · opener (owner and dog pushed apart by "Modern life") · field research (sites, photos, dog types, AEIOU tabs) · quotes as speech bubbles · affinity board (notes fall, then cluster) · personas and journey (the thread becomes Luna's emotion curve) · problem and HMW · ideation (DVF counts up, two crossed out, two merge) · form, sketch to coded face · device callouts and collars · app screens sliding sideways, plus the concept video · Treat (shifts, reunion).
- **The heartbeat thread:** a pulse line drawn down the margins as you scroll, with a glowing tip and an ECG "beat" at each key insight or decision.
- **The phase dock:** a glass pill of six dots at the bottom of the sheet. It opens to show the phase names while a phase heading is on screen; click a dot to jump to that phase.
- **Motion:**
  - GSAP ScrollTrigger on the sheet's own scroller, with Lenis smooth scroll inside the sheet.
  - Sticky pinned scenes, each at most 1.5 screens of extra scroll.
  - Every reveal is a `fromTo` with `cubic-bezier(0.22, 1, 0.36, 1)`.
  - Everything is re-measured on resize, image load and font load.
  - With `prefers-reduced-motion`, every scene shows finished and the thread is drawn in full.
- **Shared shell (`js/case-study.js`):**
  - Can now load a project world (`world: '<name>'` in the project data).
  - Measures the colour tones from layout, not from the growing sheet; this fixes the wrong tints.
  - Opens any `data-zoom` image in the lightbox.
  - Runs Lenis inside the sheet.
  - Marks `[NEEDS FROM AIYANA: …]` gaps.
  - Projects without a world still use the original template.
- **Images:** 43 new WebP crops from the deck (field photos, silhouettes, concept sketches, form steps, app screens, collars, logo). The 16 that nothing used any more were removed (all can be regenerated from `content/nexo/`).
- **Docs:** DESIGN.md has a new "Project worlds: Nexo" section, and this log was started.

**Files used (all in `content/nexo/`)**
- `Nexo Final Presentation (1).pdf`: every page. Problem framing p3–4, p13. Affinity map and quotes p5–7. Field photos p8. Journey map p9. Problem statement p10. Empathy map p11. AEIOU p12. Stakeholder map p14. Personas p15. Ideation and DVF p16–18. Renders p19. Form p20. Collar p21. Face prototype p22. App p23. Shifts p24. Video p25–26. Silhouettes p27.
- `PLAY_for_Gen_Alpha.pdf` (Miro export):
  - Page 1, the AEIOU field notes: sites, dogs, dog types, the Guilty 9-to-5er, key findings.
  - Pages 2–5 (Gen Alpha research) are **not used yet**; see below.
- `IMG_4056-removebg-preview.png` (logo; the crisp version is from deck p2), `WhatsApp Image 2025-12-09 at 12.59.11 AM.jpeg` (three colourways), and the two CAD/render cutouts (too low-resolution to use large; the deck renders were used instead).

**Checked**
- Headless Chrome at 1440×900 and 390×844, plus reduced motion: no console errors.
- Lightbox, Esc, AEIOU tabs, dock jump and focus, close and reopen all work.

**Still needed from Aiyana** (each is marked `[NEEDS FROM AIYANA]` on the page)
1. Your role and the parts you personally did. Only those will be credited to you.
2. Team size and everyone on it.
3. Who designed the app screens.
4. Why the top-scoring Rubik's Cube unit was set aside.
5. Why the desk companion and the smart collar were combined.
6. The Figma prototype link, or "none".
7. Testing and feedback, or "none, leave it out".
8. One learning, in your own words.
9. One next step.
10. *Not shown, just waiting on you:*
    - Roughly how many owners you spoke to. No number is shown until you give one.
    - Whether to use the Gen Alpha research (Miro pages 2–5) as the opener's starting point, or leave it out. It's left out for now.
    - Whether the collar was re-scored from 8 to 7 after the merge. The deck says 8 on p16 and 7 on p18; the page shows 8.
