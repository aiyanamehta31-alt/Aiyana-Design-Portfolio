# Build log

A dated entry for every change to the portfolio: what changed, why, which source files were used, and what's still needed from Aiyana. Newest first.

---

## 2026-11-26 · Maggi card: the pack turning on a dark stage

- The Maggi card on the homepage (Selected work and All projects) no longer shows the yellow poster crop. Like Nexo, Branding and Wiglet it sits on a dark stage: Aiyana's final Nouilles Masala pack as a 3D box built in HTML/CSS (`.project-card__media--pack`, `.minipack` in `css/style.css`), turning slowly to show the front, side, back (cooking steps, nutrition table) and other side. Every face is her own artwork: `pack-front.webp` and crops of `dieline.webp` by background position, so no new image files. `style.css?v=18`.
- Asked by Aiyana: a black background like the others, "something to show", my choice.
- Checked at 1440×900: all four homepage cards now share the dark stage; the box turns cleanly with its top face showing.

---

## 2026-11-26 · Wiglet card: a phone with Wiglet open

- The Wiglet card on the homepage (Selected work and All projects) no longer uses the flat screenshot. Like Nexo and Branding it sits on a dark stage: a dummy phone, drawn in HTML/CSS in `index.html` + `css/style.css` (`.project-card__media--phone`, `.miniphone`), tilted and cropped by the card's edge, with Wiglet open on the lock screen and the blob floating beside it. The rows are the ones on Aiyana's own phone mockup (`assets/images/projects/wiglet/mockup-phone.webp`). `style.css?v=17`.
- Asked by Aiyana: a black background like Nexo's and Branding's, with "a little dummy phone" and Wiglet opened up on it.
- Checked at 1440×900 and 375×812: the phone scales with the card, times never touch their labels, no sideways scroll.

---

## 2026-11-26 · Branding, second pass: an editorial shelf, five different pages

**What changed**
- The shelf is now five tall photo covers side by side: closed covers show the name as a vertical spine, the one under the pointer opens wide with its name, line and "View the brand". The rounded bands, fanned photos, pills and wallpaper pattern are gone.
- Each brand page is built from its own plan (`BRAND_PAGES` in `js/worlds/brand-kits.js`), with its own order, numbering, headings, colour display, photo layout and an extra of its own: Velvet Vine (brand book: growing vine, a brand book to page through, fabric-strip colours), STATIC. (terminal: Tune in, the brief as a terminal, a colour readout, The drop), KOMA (menu: a menu card with a steaming bun), Meridian (field guide: a route down the page, a contour map that bends, Trail. Pace. Purpose., a filmstrip), Pebble & Co. (playroom: Meet the pebble, a mascot that watches and waves, pebble colours).
- `js/worlds/brands.js` rewritten around those plans; `css/worlds/brands.css` gained the five looks. `DATA_VERSION` 29.

**Why**
- Aiyana: every brand looked like the same format, and the shelf looked "a bit kiddish". She asked for each brand to be very different, with something extra in places.

**Checked**
- Local server at 1440×900: shelf (hover opens a cover), all five pages part by part, the wipe, tune-in, the book arrows, the map bend, the mascot. At 375×812: shelf and pages, nothing scrolls sideways.

**Still needed from Aiyana**
- Same as before: real sketches if she has them, and per brand the context, tools and credits, what she learned and what she'd do next. Menu, drop and mascot notes are read from her images and marked as drafts in code.

---

## 2026-11-26 · Branding: five separate brand projects, each with its own page

**What changed**
- New world `brands` (`js/worlds/brands.js`, `css/worlds/brands.css`, drawn kits in `js/worlds/brand-kits.js`); `projects/branding.js` now uses it. The journey world is no longer used.
- `#project/branding` is a shelf of five bands, one per brand, each in its own colours and type with three pictures fanned out. Clicking one wipes to that brand's colour and opens **only that brand**: the brand, the idea, the logo (with a construction grid and clear space drawn over it), colour (paint chips, tints, HEX/RGB/CMYK, a suggested balance), type (a live tester), brand elements (six symbols, a pattern with a colourway switch, two stickers, a watermark), packaging (a dieline opened flat beside the real photos), in the world, final designs (a running banner and a wall of every piece), looking back, and the next brand. A switcher at the top jumps between brands; the glider lists the brand's parts.
- Drawn for the page (and labelled so): symbols, patterns, stickers, construction grids, dielines, the colour balance. Sticker words come from her own work (“Refined. Organic. Pure.”, “All signals lost”, “Slow steamed”, “Trail. Pace. Purpose.”, “Play more”). No new images were needed; all photos are the existing `assets/images/projects/branding/` set.
- `DATA_VERSION` 28 (`case-study.js?v=28`).

**Why**
- Aiyana confirmed all five brands stay (Velvet Vine, STATIC., KOMA, Meridian, Pebble & Co.).
- Aiyana didn't want the brands one after another: each should be its own distinct project, explained like her reference's freelance projects (sketches, packaging, palettes, symbols, brand elements), and look like a lot of work.

**Checked**
- Local server at 1440×900: the shelf, all five brand pages part by part, the wipe between brands, the switcher, the glider (re-measured after the sheet opens), the grid and colourway switches. At 375×812: shelf and a brand page with no sideways scroll.

**Still needed from Aiyana**
- Real sketches or process work for any brand (the page would gain a "Sketches" part), plus per brand: context (course or self-initiated, year, solo or team), tools and credits, what she learned and what she'd do next; the Pebble & Co. child photo caption. The key words, brand lines and packaging blurbs are drafts for her to edit.

---

## 2026-11-25 · Wiglet rebuilt: clearly an agentic AI project

**What changed**
- `projects/wiglet.js` rewritten for the story world (theme `wiglet`), like Nexo and Maggi: one calm light page, in order, in plain words. The first section explains what makes it an AI agent (look, think, act, check: Perceive, Reason, Act, Observe), then the problem, the idea and rules, how it works (each step marked "AI model" or "Plain code"), the live demo, building it with Claude Code, what broke and the fix, what shipped, and what's next.
- The live demo moved into a reusable story block: `js/widgets/wiglet-demo.js` (the same scheduler, parser and code tab as before) and `css/widgets/wiglet-demo.css`. The card keeps the real app's dark look; the steps, examples, tabs and notes around it are now light. The em dash in "Didn't fit today" lines became a colon.
- `js/worlds/story.js` gained the `loop`, `pipeline`, `fixes` and `widget` blocks, a hero image, and a project's own `scripts`; `css/worlds/story.css` gained the Wiglet theme (cool white, Wiglet blue, teal only for code) and those blocks' styles.
- The old Wiglet world (`js/worlds/wiglet.js`, `css/worlds/wiglet.css`) is no longer loaded. `DATA_VERSION` 27.
- Left out: the "≈785k tokens" figure and the card-flip, counter and looping animations. All words come from the existing Wiglet data (deck, codebase, build log).

**Why**
- Aiyana felt the Wiglet page looked "pretty AI" and asked for the Nexo and Maggi treatment, making it clear it is an agentic AI project.

**Checked**
- Local server at 1440×900: every part renders, the glider lists all ten parts, the demo places "gym for an hour, priority one" as Gym, priority #1 at 10:40, and the code tab fills with the scheduler source. At 375×812: one column, nothing wider than the screen.

---

## 2026-11-25 · Maggi: the walkthrough video cut to 7 seconds

- `assets/images/projects/maggi/show-walkthrough.mp4` now runs 0:00–0:07 (was 15 s): the table and the Maggi wall, stopping before the camera pans to other groups' work. Re-encoded (H.264, no sound, 1.1 MB); referenced as `show-walkthrough.mp4?v=2` so browsers fetch the new one. `DATA_VERSION` 26.
- Asked by Aiyana: "crop the first video at 00.07 seconds".

---

## 2026-11-25 · Maggi rebuilt as a clean, detailed workflow

**What changed**
- New reusable `story` world (`js/worlds/story.js`, `css/worlds/story.css`): the Nexo approach as blocks, so any project can be told the same calm way. Maggi is the first (`projects/maggi.js` rewritten, `world: 'story'`).
- Maggi now tells the whole project in order, in plain words: the walkthrough video, the brief, research, insights, the idea, look and feel (palette and type from the Campaign Platform), how we made it (Flora AI boards, Illustrator), what didn't work, the posters, the pack, the store, the launch plan, and the display with the team.
- New images in `assets/images/projects/maggi/story/`: the course brief, the three final posters (1600px copies from the team Drive "Final Posters"), four Flora AI workflow boards (from the Drive "Failed Output" doc), the dropped Épuisé packs, the London metro attempts, four other directions (Paris tag, noodle tower, Paris bowl, bowl balloon), the pack in Illustrator, and the team photo (Aiyana's own photo from her Maggi folder; she offered it 2026-11-25).
- `DATA_VERSION` 25. Branding still uses the journey world.

**Sources**
- The course brief (DESG261 Brief 02/10), and the team's Drive folder "Final Group Assignment 3": Research Document, Research Insights, Campaign Platform, Packaging Design Rationale, Marketing Strategy Document, The 6 Hard Questions, Failed Output. Read in the browser; only the posters and the Flora screenshots were copied.
- The team (Akshath Pissay, Aiyana Mehta, Divyanshi Jain, Sourajeet Das) is from the Research Document's cover. Research numbers are quoted with the sources the document gives.
- The "What didn't work" text follows the team's Failed Output doc; the misspelled "Maggie" and London setting of the metro images, and the garbled AI back of pack, are described from the images.

**Checked**
- Local server at 1440×900: every part renders, the glider lists all 13 parts, nothing broken. At 375×812: one column, nothing wider than the screen.

**Still needed from Aiyana**
1. Your role: which parts you made.
2. One learning and one next step, in your own words.

---

## 2026-11-25 · Nexo rebuilt as one clean, plain-worded page

**What changed**
- `projects/nexo.js`, `js/worlds/nexo.js` and `css/worlds/nexo.css` rewritten. Nexo is now one calm paper page that tells the project in order: the concept video first, then Overview, The problem, Research, Insights, Ideas, Shaping it, Prototyping, How it works, Final design and What it changes. The dog's-day phase names, the thread, the dock, the pinned and scrubbed scenes and the colour fades are gone.
- Plain words throughout ("Research", "Insights", "Ideas"…), short paragraphs, one accent colour, Chewy only for section titles.
- New proof, from Aiyana's own photos and videos (`assets/images/projects/nexo/process/`, `.../video/`): the team sorting notes, the Miro mind map of play, the research wall, the process poster, a first sketch, four CAD steps, 3D printing in the lab, the print in hand, and three silent prototype clips (the print turned in a hand, the LED panel lighting up under a hand, the coded face moving).
- The brief, HMW, target users and how it works are from Aiyana's written brief (2026-11-24), in simpler words.
- Nexo now uses the shared glider (`js/glider.js`) with its ten parts. `DATA_VERSION` 23.

**Why**
- Aiyana felt Nexo had "a lot going on", everything too big and not clear to a new visitor. She pointed to Prapti Digge's Scout page as the kind of clean, neat flow she wants (a reference for clarity only), and asked for simpler words, the video at the start, and lots of proof of the work.

**Sources and privacy**
- The Miro screenshot was cropped to remove the browser bar, which showed a classmate's email address.
- Not used: the class photo with "VitaTail" on the table (it may show another team's project), and the second phone photo of the CAD face (a near-duplicate).
- The concept video: the old Google Drive link is dead (page not found), and the PDF sent on 2026-11-25 holds only a still frame. The page plays `assets/images/projects/nexo/video/concept.mp4` once it exists; until then the still shows with a [NEEDS FROM AIYANA] note.
- "Fusion 360" in Tools is read from the CAD screenshots' interface.

**Checked**
- Local server at 1440×900: every part renders in the 60% column, the glider lists all ten parts, the prototype rows line up. At 375×812: one column, nothing wider than the screen except the clips' own frames, glider hidden.

**Still needed from Aiyana**
1. The concept video as an MP4 (Canva: open the deck, select slide 26, Share → Download → MP4 Video, "Selected pages": 26).
2. Your role, the team, who designed the app screens, why the cube idea was set aside, why the collar and companion were merged, the Figma link, testing, a learning and a next step (all marked on the page).

---

## 2026-11-24 · Every project: a 60% column and its own glider

**What changed**
- New `js/glider.js` (and section 8 of `css/case-study.css`): the Nexo index and glider as a shared piece any project world can use. It lists a project's important parts down the left margin of the sheet (1200px and wider), with a rail and a glider that follows the story; click to glide, drag to scrub.
- **Branding and Maggi** (`js/worlds/journey.js`, `css/worlds/journey.css`): the glider replaces the sticky chapter index on wide screens and the chapters centre in one column. Branding's glider is a bookmark ribbon in each brand's own accent; Maggi's is a yellow dot ringed in Maggi red. The opener now sits in the 60% column too.
- **Wiglet** (`js/worlds/wiglet.js`, `css/worlds/wiglet.css`): a day-planner glider (hour ticks, a blue-to-teal time block), with the live demo as its own stop. The dock stays below 1200px.
- **Codes** (`js/worlds/codes.js`, `css/worlds/codes.css`): a file-tree glider in Geist Mono with a blinking amber text cursor; each sketch shows its file name.
- Branding, Maggi, Wiglet and Codes now get the same 60% column as Nexo from 1100px, with their screen-width sizes scaled by 0.6 (`--jr-vw`, `--wg-vw`, `--cd-vw`) and the biggest titles capped lower (Wiglet 13→9rem, Codes 15→10rem).
- `DATA_VERSION` 22, `case-study.js?v=22`, `case-study.css?v=9`, `glider.js?v=1`.

**Why**
- Aiyana asked for the Nexo treatment on every project: a navigation that lets you move through any important part quickly, in each project's own look.

**Checked**
- Local server at 1440×900: each project opens with its glider; Branding (KOMA, ribbon turns STATIC green on the way), Maggi (On the shelf), Wiglet (Try the live demo, demo fits the column) and Codes (Wave) glide when clicked. At 375×812 the gliders are hidden, Wiglet's dock shows and the Branding opener is as before. The glide's smoothness can only be judged in a real browser window (the preview pane throttles animation).
- The detector's gradient-text warnings in `wiglet.css` are Wiglet's existing gradient wordmark and numbers (its own identity, noted in the file), not new.

---

## 2026-11-24 · Nexo: a calmer 60% column, and an index with a glider

**What changed**
- On screens 1100px and wider, Nexo's story is a centred column at most 60% of the screen (`--nx-max: min(60vw, 1120px)`), and everything inside is smaller to match: all 60 screen-width sizes in `css/worlds/nexo.css` now use `--nx-vw` (0.6vw on wide screens, 1vw below), and the biggest type has lower caps (phase names 136→96px, headings 68→52px, lead 30→26px, the MODERN LIFE wedge, the problem words, the shifts, the key quote and the next-project link). The opener's silhouettes are shorter (max 360→280px). The app's four phones now slide past inside the column, at most 520px tall, instead of across the whole sheet.
- New **index with a glider** (screens 1200px and wider), like Branding's chapter list: 01 The result, then the six phases, down the left margin. A rail beside it fills as you read, and a glider moves along it from part to part. Click a part to glide there; drag the glider or press the rail to scrub through the whole project. The bottom dock stays for smaller screens.
- The thread now runs about 40px beside the column instead of out in the margins, so it never crosses the index.
- `DATA_VERSION` and `case-study.js` bumped to 21 so browsers fetch the new files.

**Why**
- Aiyana found Nexo took up too much of the screen and came on too strongly, and asked for a way to move through it quickly, like the brand list in Branding: to the final product, to the process, to any part.

**Checked**
- Local server at 1440×900 and 1280×800: the column is 60% wide; clicking The whine, Picking up the scent, Fetch and Walkies glides to each and highlights it; dragging the glider from Fetch lands in Walkies; the index ends 16px before the thread at 1280. At 375×812 the dock shows and the index is hidden; nothing else changed on phones. Smoothness of the glide can only be judged in a real window (the preview pane throttles animation).

---

## 2026-11-24 · Hero title back to the original

**What changed**
- The hero is back to "Welcome to Aiyana's portfolio." in Geist 600 with the line underneath, exactly as before today. Both title experiments (9de4f2b: Instrument Serif italic + Geist; d5a31c5: Agbalumo in amber + Funnel Display) are reverted.

**Why**
- Aiyana didn't like either one and asked to go back to what it was.

---

## 2026-11-24 · Nexo: a still, flowing line, and the colour fades back

**Why:** Aiyana felt the scene crossings still stuttered and asked for a line that simply sits in the page and guides, with no movement of its own, flowy and good-looking. She also pointed out that the last change broke Nexo's smooth colour fades between scenes, and asked for them back exactly.

**What changed**
- **The line** (`js/worlds/nexo.js` "5. The thread", `css/worlds/nexo.css`): drawn once and static. From the cover face, a gentle meander down each scene's margin; a sweep across in the empty space at the top of the next scene with a soft loop in the middle; into Luna's emotion curve and out; ending where owner and dog touch. Small dots at the key moments. The moving tip, the dotted route, the per-frame easing and the per-scene paths are gone; nothing runs while scrolling.
- **The colour fades** are back as they were: the whole sheet blends from one scene's tone to the next. The static per-scene tone layer is gone. To keep it light, `js/case-study.js` now (for worlds with `ownTones`) sets only the sheet's and bar's background colour per frame and flips the inherited colour variables once at the midpoint. The inline colours are cleared when another project opens.

---

## 2026-11-23 · Nexo: no stutter between scenes

**Why:** the line was smooth within a scene, but crossing from one scene to the next lagged and went blocky.

**The cause:** at every scene boundary the shell blended the sheet's colours (paper, indigo, orange) by changing its CSS variables on every frame. Every element inherits them, so each frame of a crossing restyled and repainted the whole story. The dock (frosted glass) widening at each chapter, and pictures decoding as a scene came in, added to the same moments.

**What changed**
- The scenes paint their own tones: a static layer behind the thread (`.nx-tones` in `js/worlds/nexo.js`), each scene's colour easing in from the one before over the top of its padding. Each scene sets its own ink. Nexo declares `ownTones`, and `js/case-study.js` then skips its per-frame colour blend.
- The bar and the dock take the tone of the scene being read with one change per scene (a 450 ms fade), not one per frame. The dock is solid, no backdrop blur.
- Every picture in the story is decoded in idle time after it opens, so no scene stalls on its images.

---

## 2026-11-23 · Nexo: back to a line, rebuilt to be smooth

**Why:** Aiyana disliked the leaping icon too, and asked to go back to a line like the original, but smoother, more appealing and coherent: something that actually traces the reader through the project, in Nexo's colours, with no icon.

**What changed** (`js/worlds/nexo.js` "5. The thread", `css/worlds/nexo.css`)
- The leaping icon and its paw trail are gone.
- **The route:** from the breathing face on the cover, down each scene's margin, a smooth S across to the other side between scenes, into Luna's emotion curve and out of it, ending where owner and dog touch. No ECG spikes.
- **Reading aids:** a faint dotted copy of the route shows the way ahead; the orange line (deep indigo on orange scenes) fills in up to the reading line, led by a soft glowing tip; knots at the key moments fill with a ripple as the line reaches them.
- **Smoothness** (what made the first thread stutter, and the fix): it was one story-tall path redrawn every scroll, located with `getPointAtLength` and layout reads each frame. Now the route is built and sampled once per refresh, split into one path per scene so only the scene being read redraws; each frame eases the drawn length towards the reading line on GSAP's ticker (after Lenis), the tip moves by transform, and nothing is measured.

---

## 2026-11-23 · Nexo: a leaping icon instead of the walking dog

**Why:** Aiyana found the walking dog ugly and its motion choppy. She asked for a small icon that bounces from one section to the next like a dog jumping, with paw prints as a trail and no props, moving smoothly.

**What changed** (`js/worlds/nexo.js` "5. The leaping guide", `css/worlds/nexo.css`)
- The dog drawing, its moods, props and chapter tag are gone. The guide is the Nexo face icon (42px) resting in the margin at the reading line.
- The scenes alternate sides; crossing into the next scene makes it leap across to that margin in one arc (crouch, stretch, squash, settle), leaving paw prints along the arc that fade in about a second.
- Smoothness: each leap is a complete 820 ms animation played on its own clock (requestAnimationFrame, transforms only) rather than following every scroll step, so uneven scrolling can't make it stutter. Between leaps it does nothing on scroll beyond one comparison.

---

## 2026-11-23 · Nexo: smoother scrolling, and a walking Nexo instead of the thread

**Why:** Aiyana found the Nexo story abrupt and laggy to scroll, and wanted something more creative than the heartbeat line to guide people through it. She chose a walking Nexo companion.

**What made it lag, and the fixes**
- The sheet was frosted glass (a full-screen backdrop blur) whose tint changes between scenes, and the bar blurred the content scrolling under it: both re-rendered every frame. The Nexo sheet and bar are now solid (they were 90–96% opaque, so they look the same).
- The heartbeat thread was one SVG as tall as the story (about 23,000px), redrawn on every scroll with path lookups. It's gone.
- The thread and the dock measured every chapter head with `getBoundingClientRect` on every frame. Positions are now measured once on refresh; a scroll frame only does sums.
- Scroll-linked timelines (the pinned scenes, the emotion curve, the word reveals) used `scrub: true` and jumped with each scroll step; they now use `scrub: 0.6` and catch up smoothly.

**The walking guide** (`js/worlds/nexo.js` "5. The walking guide", `css/worlds/nexo.css`)
- A small Nexo companion walks in the left margin at the reading line; paw prints land in the story under its feet and drift away behind it; scrolling up turns it round; it sits and wags when the scroll stops.
- Each chapter gives it a mood and a prop (tear, sniff marks, "!", ball, leash, heart) and shows the chapter's name on a tag for a moment. Key moments that used to pulse the thread make it hop. It turns indigo over the orange scenes.
- The story column is 1120px (was 1240px) so laptops have room for it; it hides under 72px of margin, on the cover and with reduced motion.

---

## 2026-11-23 · New cards in the hero wheel: Nexo, a 3D render, sketching and prototyping, the STATIC. flat lay, the KOMA box, the Meridian emblem

**Why:** Aiyana asked to replace the Pebble & Co. bag in the circling wheel with her Futurist Lounge Pod sketch sheet, labelled "Sketching and prototyping".

**What changed**
- New image: `assets/images/projects/sketching/lounge-pod-sheet.webp` (and `-sm`), from "subjects/sketching and prototyping/Screenshot 2025-12-17 at 5.17.31 AM.pdf" (one page, rendered and copied to `content/sketching/`; `node tools/brand-images.mjs --project sketching`).
- The STATIC. card in the wheel now shows the merch flat lay (lanyard, zine, holographic stickers: `static-flat-lay-sm.webp`) instead of the model on the street.
- The Maggi store-display card is replaced by the KOMA takeout box, labelled "Branding": Aiyana's cut-out (kept in `content/wheel/`) set on a soft spotlight like the Nexo card, so the black box doesn't vanish on black (`assets/images/projects/wheel/koma-box.webp`, `node tools/brand-images.mjs --project wheel`). The Maggi beret poster stays.
- The Maggi beret card is replaced by a 3D render of the pod (blue and pink shading), labelled "3D modelling", uncropped: it's portrait, so it sits whole in the middle and its grey studio background is extended to 16:10 (`assets/images/projects/wheel/pod-render.webp`; original in `content/wheel/`).
- The Nexo card shows the three companions in front of the NEXO wordmark, the whole picture uncut: it was wider than the cards (1.83:1), so white was added above and below to make 16:10 (`assets/images/projects/wheel/nexo-companions.webp`; original in `content/wheel/`).
- The Meridian card shows the gold emblem on contour paper (`meridian-icon-texture-sm.webp`) instead of the trail runner. It moved up to 6th place so it shows on every screen; the KOMA bao picture moved to 10th (desktop only), which also keeps the two KOMA cards apart.
- `WHEEL_IMAGES` in `js/main.js`: the Pebble & Co. bag is out; the sketch sheet is in with the label "Sketching and prototyping". It sits 8th so it also shows on tablets and phones, which show only the first 8 cards; Meridian moved to 10th.

---

## 2026-11-23 · The Branding card is a 3D book that keeps turning; no amber hover edge

**Why:** Aiyana disliked the three-brand strip on the Branding card and asked for a book, the same size as the other cards, that keeps flipping through her branding work.

**What changed**
- The Branding card's picture is now a small open book (`index.html`, `js/home/minibook.js`, "Branding: a small open book" in `css/style.css`): five spreads, logo on the left and the brand in use on the right: Velvet Vine, STATIC., KOMA, Meridian, Pebble & Co. (the existing page images in `assets/images/projects/branding/`).
- **In 3D:** it lies tilted back on a table, each page rising from the spine over a stack of paper edges, on a thick cover with a cast shadow; it lifts a little on hover.
- **Turning like paper:** the turning page is built from ten thin strips hinged edge to edge. Every 3.4 s it turns over 1.6 s, driven frame by frame: it lifts by its outer edge and curls as it rises, crosses the spine, and settles spine-first with the edge floating down last, each strip shaded by its angle. Pictures are decoded before use and the page floats a hair above the paper, so nothing flashes or flickers. (A first version, one flat page on a CSS animation with a floating book, felt stiff and stuttered.)
- **No glitch on the pages underneath:** the turning page now floats 1.5px above the paper in world space (it used to sink under the left page as it landed), it curls up and away while landing instead of bending through the page, it carries the same spine shadow and sheen as the still pages with no extra shade at rest (so nothing changes brightness when it appears or goes), and each picture swap waits until the new picture has been drawn.
- It turns only while the card is on screen and the tab is visible; with reduced motion it stays still, open on the first spread.
- **Cards:** hovering a project no longer draws an amber edge round its picture (a faint white one instead). Keyboard focus keeps its amber outline.

---

## 2026-11-23 · A fabric the cursor bends, instead of the guide light (branch `simplify`)

**Why:** Aiyana didn't like the golden light following the scroll and wanted something fun to touch. We tried water ripples, colour clouds, a liquid-glass blob and a colour-smoke trail (after her friend's site). She then asked for the cursor to look as if it warps and bends the very fabric of the background, softer and subtler, smooth while scrolling, in her projects' colours.

**What changed**
- **Removed:** the guide light (`js/home/guide.js` deleted, its styles, the `data-guide` hooks, and the amber glow on section titles), and the earlier experiments.
- **Added** `js/home/fluid.js`: a WebGL fluid simulation drives a woven grid behind the black. The grid shows only round the cursor and where it moves; the flow bends its threads behind the hand, and they spring back. It scrolls with the page, and scrolling sends an elastic wave through it. A soft wash of the nearest project's colours (`data-cloud` in `index.html`) tints the threads.
- The hero and `body` lost their own black so the canvas behind shows through; `html` keeps the black.

---

## 2026-11-23 · Simpler, one black, the work first (branch `simplify`)

**Why:** the homepage felt like too much. Aiyana pointed to a friend's portfolio for its flow: a short "about me" before the work, a calm two-column work grid, and projects that show every step to the final piece. We took the flow only; the look stays hers, all black. Nothing of the reference site was copied.

**What changed**
- **One black:** the whole page is now `#000`, the same as the hero, and the film grain is gone, so there's no step from black to grey below the hero.
- **Hello** (new, after the hero; `index.html`, `js/home/intro.js`): "I'm Aiyana, a design student who designs journeys, not just screens." Its words light from grey to white as they scroll by. Two short paragraphs and six pills for what she works on. DRAFT text from her own words in DESIGN.md; school, course and year are [NEEDS FROM AIYANA].
- **Selected work:** a narrow (960px) two-column grid of Nexo, Branding, Maggi, Wiglet. Cards: picture, category and year, name, one line, tag pills. Codes moved to "Explore more projects", which now lists all five.
- **Hero wheel:** real work instead of the placeholder cards (Nexo, Maggi, the five brands, Wiglet, Codes) until Aiyana sends her own picks.
- **Journey world** (new: `js/worlds/journey.js`, `css/worlds/journey.css`): a project opens full screen on the finished work, then numbered chapters (01, 02 …) beside a sticky index go from the first step to the final piece, with handwritten notes (Caveat) and each brand's own accent on its numbers.
- **Maggi** (new: `projects/maggi.js`, `assets/images/projects/maggi/`): five chapters from the Illustrator artboards and the dieline, to the pack, the moustache character, the store scenes and the exhibition (with a 15 s walk-past video). From the "rebranding maggi" folder; originals copied to `content/maggi/`. Left out: the team photo (other people's faces) and a selfie.
- **Branding:** now uses the journey world instead of the flip book. The five finished brands open side by side; each brand's chapter goes explorations → the mark → colour → in the world, built from its existing file in `projects/branding/`. `#project/branding/<brand>` lands on that chapter. The book stays in `js/worlds/branding.js` and on `main`.
- **Next project** loops Nexo → Branding → Maggi → Wiglet → Codes → Nexo.
- **Skills:** the show-and-tell stage and the Period 1–6 tabs are gone (`js/home/stage.js` deleted, its styles removed). The locker stays; a shelf object now opens that skill's work (`#project/skills/<skill>`). The auto-glide is gone.
- **Tools:** `node tools/brand-images.mjs --project <slug>` makes web copies for any project, not just a brand.

**Still needed from Aiyana:** Maggi's brief, team and role, tools, and how the store scenes were made; the year for Branding; school, course and year for Hello; her own wheel images; and whether the team photo may be shown.

---

## 2026-11-06 · Skills: a locker, then a show-and-tell stage

**Why:** to replace the empty Skills placeholder with something only mine. My own locker opens onto my tools and skills, then a stage shows the work in 3D. I took the look and feel from my locker reference and none of a classmate's skills section (no numbered sheets, side lists, icon boxes, thumbnails beside rows or work counts).

**What changed**
- **The locker** (`js/home/locker.js`, `css/skills.css`):
  - **Look:** a grey steel school locker, centred and lit from above, built in CSS 3D. The steel is brushed gradients; the vents, hinges, handle, the "AIYANA" nameplate and the padlock are SVG.
  - **The padlock:** it wiggles every few seconds and on hover, with "Open my locker" under it. It's a combination dial: drag it round, and any full turn opens it. A click, Enter or Space also opens it.
  - **Opening:** a 900 ms swing with a small bounce, then the strip light flickers twice and stays on. The halo, arrows and underline draw themselves stroke by stroke while the handwriting (Caveat) writes in. A soft metal clunk plays only if the storm mixer's sound is on (`window.siteSound`, new in `js/home/storm.js`).
  - **Inside:**
    - The pixel portrait, taped up (a pixel silhouette as a placeholder).
    - "Designer" with a halo.
    - "About me…" and "I'm here to…".
    - On the door, a big "AIYANA" sticker and tool stickers (labelled name placeholders until the logo files arrive). Hover peels a corner. On desktop you drag them, or move them with the arrow keys; "Put back" returns them.
  - **The shelf:** six SVG objects (camera, sketchbook, tablet, 3D-printed figure, clapper, rolled poster). Each wiggles and shows its name, and a click glides to its skill on the stage.
  - **The glide:** once, 1.5 s after opening, the page glides down to the stage; any scroll, touch, key or click stops it.
- **The stage** (`js/home/stage.js`):
  - **The scene:** one Three.js r158 scene with a spotlight, a glossy round plinth and an amber rim light. The piece floats and turns slowly.
  - **Controls:** drag to spin with momentum, pinch or Ctrl+scroll to zoom (plain scroll only after clicking the stage), double-click to reset, and arrow keys or the round buttons to rotate.
  - **Below it:** "Period 1–6" class-schedule tabs; swapping sinks the old piece and raises the new one. Thumbnails with arrows, and an info card with "See all … work".
  - **Object builders:** model (.glb + Draco), phone (tap for the next screen), can, takeout box, poster (paper thickness, back note), prints (click deals), sketchbook (click opens) and screen (video texture, or a live placeholder clip).
  - **Real pieces:** the **Velvet Vine can** (its label from the brand book, wrapped round the front) and the **KOMA takeout box** (its front and lid from the packaging photo), under Graphic design. The crops are recorded in `tools/brand-crops/` (`node tools/brand-images.mjs <brand> --crops-only`).
  - **Loading:** Three.js and its loaders load as modules (import map in `index.html`) only over http(s) and only near the stage; from file:// or without WebGL, each piece shows its still image. The scene renders only while on screen and while something moves.
- **Data:** everything is in `js/skills-data.js`: the portrait, notes, stickers, and each piece's title, line, tools, type, still and files.
- **Galleries:** `#project/skills/<skill>` opens a grid of that skill's work in the glass sheet, with period tabs and the lightbox (`projects/skills.js`, `js/worlds/skills.js`, `css/worlds/skills.css`).
- **Placeholders:** stills in `assets/images/skills/placeholders/`.
- **Phones:** the top bar drops its Resume link (it's still in Contact and the dock), so the six links fit.

**Checked** (headless Chrome, 1440×900 and 390×844, http:// and file://)
- **Locker, with real mouse input:**
  - A full turn of the dial opens it.
  - A sticker drags and Put back returns it.
  - A shelf click selects UI design and glides the stage into view.
  - A wheel event stops the auto-glide.
- **Stage:**
  - Every object type renders.
  - Tapping the phone changes its screen, Enter opens the sketchbook, and a click deals the next print.
  - Drag spins the piece.
  - "See all" opens the gallery (period tabs work), and a piece opens in the lightbox ("1 of 3").
- **Reduced motion:** the locker opens instantly with no glide; the piece is still and turns 45° per button press.
- **file://:** each piece shows its still (including the real KOMA and Velvet Vine photos).
- **Phone:** the locker and its open door fit at 390px with no horizontal scroll, and the tabs are a swipeable row.
- **Errors:** none in the console.
- **The guide light** still lands on the Skills title.

**Still needed from Aiyana**
- **Portrait:** `assets/images/skills/portrait-pixel.png`, then set `portrait` in `js/skills-data.js`.
- **Locker notes:** the "About me…" and "I'm here to…" lines.
- **Tool stickers:** the final list, and each official logo file in `assets/images/skills/logos/`.
- **Every skill:** the work (titles, one line, tools, files):
  - 3D: .glb models.
  - UI: screen images.
  - Graphic: posters, plus a back image or note.
  - Sketching: sketch pages.
  - Video: the clip and a still frame.
  - Photography: the prints.
- **The two real pieces:** the tools used for the Velvet Vine can and the KOMA box.

---

## 2026-11-05 · Homepage redesign: one black world

**Why:** a big design pass so the homepage feels as cohesive, interactive and polished as the strongest portfolios my reviewers will see, while looking clearly my own. Before building, I checked a classmate's portfolio (Arnav Srinath) so nothing here copies his layouts, guide line, skills sheets, window-style About, music room, cursor or wording. His About uses the tab names "Work log", "The kit" and "Off the clock" and a "Tidy up" button, so my widgets are named "Where I've been", "Toolbox" and "Away from the desk", with "Straighten up".

**What changed**
- **One black world** (`css/style.css`, rewritten except the hero and cursor rules, which are unchanged):
  - The page is #0A0A0A from top to bottom. The grey-to-taupe scroll blend is removed (`js/main.js` section 4).
  - Sections are separated by space only.
  - Text is #EDEDED, #9A9A9A, and #7A7A7A for muted text (#6B6B6B would only be 3.7:1). The accent is amber #E2B877.
  - A 3% film grain sits over everything.
  - Content is a 1200px column, so the margins are free for the guide light.
- **Calm, even type:**
  - One scale: 12px mono labels (uppercase, 0.06em), 14px secondary, 16px body at 1.6, and section titles at clamp(28px, 3.2vw, 44px), weight 600. Only the hero is larger.
  - At most three sizes per section, 60-character lines. The scale is written into DESIGN.md.
  - The huge footer name and the big contact type are gone.
- **Selected work:**
  - Nexo runs full width, the three companions on a soft studio light (from the sharp 1800px cutout), with Wiglet and Codes side by side below.
  - Large covers that zoom slightly in their frame and lift on hover, with a faint amber edge.
  - The Explore more projects button and the All projects view (`#work/all`) are restyled black.
- **Skills:** a clearly marked placeholder section with its title, as you asked. The locker and 3D stage come next.
- **About, as Aiyana's desktop** (`js/home/desktop.js`, `js/home/storm.js`):
  - A frosted window of my own design over the storm-sea wallpaper (a placeholder photo for now).
  - **Widgets:**
    - Hi, I'm Aiyana: bio and photo slot.
    - Where I've been: calendar-style date badges.
    - Toolbox: generic icons, no brand logos.
    - Away from the desk: a photo stack you click to shuffle.
    - Storm mixer.
    - A Wiglet blob that blinks, squishes on hover and hops when clicked.
  - **Moving widgets:** drag them by their bar, or use the arrow keys on their grip button (Shift moves further). Moves are announced. "Straighten up" glides everything back.
  - **The dock** brings each widget forward. Resume downloads the PDF.
  - **The storm mixer** is a live Web Audio soundscape, with no audio files:
    - Rain is high filtered noise, the sea is deep noise swelling at 0.09 Hz, and thunder is low rumbles every 7 to 19 seconds.
    - Sound starts only on Play. Mute is clear, and the sound goes quiet when the tab is hidden.
    - The wallpaper reacts: rain streaks (drawn only while the desktop is on screen), the sea darkens, and thunder brings a soft flash.
  - **Phones (≤ 860px):** a column of cards on the wallpaper, with no dragging.
  - **Contrast:** inside the widgets the glass is denser and the greys lighter, so text stays AA over the brightest wallpaper (5.5:1 and 4.6:1).
- **The guide, a wandering light** (`js/home/guide.js`):
  - An amber orb that appears after the hero and weaves down the left margin with the scroll, leaving a trail that fades in under three seconds.
  - At each section title it lands beside it and the title glows for 1.3 seconds.
  - It never enters the content column. On phones it sits at the edge at 40% opacity.
  - It rests when nothing moves, and hides under the All projects view and the glass sheet.
- **Contact and footer:**
  - Email, LinkedIn and Resume as clean rows, with amber underlines that draw in and arrows that nudge.
  - A quiet one-line footer.
- **Navigation:** the top bar is black, with Skills added to both the top bar and the hero menu (the wheel itself is untouched).

**Checked** (headless Chrome at 1440×900, 1024×768 and 390×844, over http:// and file://)
- **Black page:** black throughout, no horizontal scroll at 390px, no console errors.
- **Guide light:** with real wheel scrolling it lit all four titles (Selected work, Skills, About, Contact) at both widths.
- **Desktop:**
  - Drag, keyboard moves with announcements, and Straighten up all work.
  - The dock brings widgets forward (on phones it scrolls to them), and the photo stack shuffles ("2 of 4").
  - The blob hops, and Play, Pause and Mute toggle with the right labels.
  - The Sea slider darkens the wallpaper and the Rain slider thickens the streaks.
- **Reduced motion (file://):** no light; titles fade in; no rain animation, flashes or widget animations.
- **Contrast:** every pair checked: 16.9, 7.0, 4.6, 10.7:1 on black; 8.9, 5.5, 4.6:1 inside the widgets.
- **Nothing broken:** Nexo, Wiglet, Codes, the All projects view and the Branding book open and close as before.

**Still needed from Aiyana**
- **Skills:** the next prompt (locker and 3D stage).
- **Wallpaper:** your real storm-sea image (the current one is a placeholder).
- **Hi:** a short bio and a small photo.
- **Where I've been:** education and experience entries (month, year, role, place).
- **Toolbox:** the final list.
- **Away from the desk:** the photos.
- **Resume PDF:** `assets/Aiyana-Mehta-Resume.pdf`, used by the dock and Contact.
- **Contact:** your real email and LinkedIn.
- **Selected work:** the intro line ("[Placeholder: tweak this intro.]").

---

## 2026-11-03 · New project: Branding, five brand identities as one book

**Why:** to show my brand identity work as one book to flip through, each brand opening into its own short story in its own colours and fonts.

**What changed**
- **The book** (`js/worlds/branding.js`, `css/worlds/branding.css`):
  - **Pages:** a front cover ("Branding", "Five identities, five worlds.", the five names, an amber rule on textured charcoal), one page per brand, and a back cover ("Thank you for flipping through", with a button back to the start). It sits on the site's black.
  - **Each brand page** is in that brand's colours and fonts: its name, a category tag, four images (one large, three small), one line, and "Open brand →".
  - **The motion** follows the four journal frames (`references/branding-carousel-1…4.webp`, copied from the previews you attached):
    - The current page lies flat with a slight bend at its crease.
    - The other pages are thin slices stacked on each side: turned 76°, smaller and darker towards the outside, with paper edges.
    - A turn takes 700 ms on cubic-bezier(0.22, 1, 0.36, 1). Each page is two halves hinged at the crease, so the outgoing page folds as it swings away and the incoming one shows as a two-page spread before it settles flat.
  - **Ways to turn the pages:**
    - auto-flip every 5 s (paused on hover and for 12 s after any interaction; after the back cover it returns to the start);
    - the round glass buttons, the arrow keys, the horizontal wheel or trackpad, and drag or swipe;
    - clicking a side page;
    - five brand dots;
    - a grid view of all brands as cards.
  - **Above and below the book:** a page counter ("Page 2 of 7") sits above, and an aria-live line announces each page.
  - **Signature touches as a page lands:**
    - Velvet Vine: a sparkle.
    - STATIC.: a 150 ms RGB-split glitch.
    - KOMA: wisps of steam.
    - Meridian: contour lines rippling out.
    - Pebble & Co.: a bounce and tiny stars.
- **Opening a brand:**
  - **The grow:** the page grows into the brand's story (FLIP, 700 ms) and "Back to the book" shrinks it back to the same page.
  - **Its own address:** each brand has its own URL (`#project/branding/<brand>`) and history entry, so the browser's back button returns to the book. The × closes everything in one go.
- **Each story:**
  1. Hero (strongest image, name, line, Category / Context / Tools and credits).
  2. The idea.
  3. The logo, with a labelled "Other explorations" row.
  4. Colour (big swatches; click to copy the hex).
  5. One signature interaction:
     - Velvet Vine: the vine grows and a type tester.
     - STATIC.: the wordmark tunes in from TV static ("Lose the signal" replays it).
     - KOMA: the bun draws in line by line under looping steam.
     - Meridian: contour lines spread from the summit, the trail climbs to the peak, and the lines bend away from the pointer.
     - Pebble & Co.: the mascot blinks, watches the pointer, and bounces and waves when clicked.
  6. Applications: every image, in a varied grid, in the glass lightbox with arrows.
  7. Reflection, then "Next brand" and "Back to the book".
- **Brand worlds:**

  | Brand | Fonts | Colours (hex sampled from the images) |
  |---|---|---|
  | Velvet Vine | Gilda Display + Montserrat | #4B254B / #8A967A / #F3EFE6 |
  | STATIC. | Archivo Expanded Black + Archivo, Space Mono labels | #020202 / #95E50F / #F90D8C / #C4C4C4 |
  | KOMA | Rubik ExtraBold | #0E0E0E / #B6E530 / #FFFFFF |
  | Meridian | Jost Light, wide spacing | #233228 / #DBB56B / #F6ECE1 |
  | Pebble & Co. | Baloo 2 ExtraBold + Nunito | #FDF1DA / #7FB8DE / #F8716C / #FCD33B |

  - **Contrast:**
    - Sage is used only large.
    - Gold on forest green measures 6.9:1.
    - Pebble's small text is navy #1F3550 (added for contrast, not sampled).
- **Logos as you set them:**
  - STATIC.: the primary is the upright blocky wordmark (cropped from the zine) with the S. monogram (from the hat). The chrome wordmark, lightning-bolt emblem, graffiti script and globe badge are under "Other explorations". The chrome poster stays the book's large image and the story's hero.
  - Meridian: the peaks mark and wordmark.
  - KOMA: the chunky logo with steam, plus the bun icon.
  - Pebble & Co.: the hang-tag logo, plus the mascot.
- **Left out, as asked:**
  - Velvet Vine: the philosophy and photographic direction pages (skincare, body wash).
  - STATIC.: no close-ups of "OVERRDDE" or "STANDSIC".
  - Meridian: no notebook close-up.
  - Pebble & Co.: the child photo is only in the gallery, with a caption marker.
- **Data, one file per brand:**
  - `projects/branding/<brand>.js` holds the images, text, colours, fonts and effect.
  - `projects/branding.js` sets the book order.
  - The one-line descriptions, "The idea" and the signature texts are marked `// DRAFT` for you to edit.
- **Images:**
  - `tools/brand-images.mjs` now also writes small copies (720 px) for the book's pages, and reads logo crops from `tools/brand-crops/<brand>.json`.
  - The 37 originals are copied, unchanged, into `content/branding/<brand>/`. The web copies are WebP (max 2400 px) and lazy-loaded, with written alt text.
  - Last round's unused crops are removed.
- **Homepage:**
  - "Selected work" shows Nexo, Wiglet, Codes; the three placeholder cards are gone.
  - A new "Explore more projects" button opens the **All projects** view (`#work/all`): every project, including Branding with a front-cover card. "Back", Esc or the browser's back button returns to the same scroll position.
- **Shell (`js/case-study.js`):**
  - Brand addresses: `#project/<slug>/<page>` links, a world's own history entries (closing steps back over them), and `ctx.page`, `ctx.measure` and `ctx.rescanZoom`.
  - Matching cards: when a project has two cards, the visible one is used.
  - `DATA_VERSION` 9.
- **Branches:** the first carousel draft is kept on `branding-v1`.

**Checked** (headless Chrome, 1440×900 and 390×844, over http:// and file://)
- **Book and stories:** every page and every brand story renders in its own colours and fonts. A turn shows the crease and two-page spread mid-way.
- **Controls:** all of these work:
  - the buttons, keys, wheel, swipe, dots, grid, side-page clicks and back-cover button;
  - auto-flip and its pause after an interaction;
  - the FLIP open and back;
  - copy ("#0E0E0E copied");
  - the type tester, tune-in, mascot wave and map bend;
  - the lightbox, its arrows, and Esc closing only the lightbox.
- **History:** browser back and forward between book and brand, and × from inside a brand back to All projects; Back from All projects returns to the same scroll position (1400 px).
- **Reduced motion:** no auto-flip, bends or touches. Pages crossfade and drawings show their final state.
- **Phone:** two side slices per stack, stories in one column, no horizontal scroll.
- **Nothing broken:** no console errors. Nexo, Wiglet and Codes still open, and Codes → Branding → Wiglet links. The Wiglet tests pass (65/65, 29/29).

**Still needed from Aiyana**
- For every brand: Context (course or self-initiated, year, solo or team and role), Tools and credits (including whether the photos are AI-generated), what I learned, and what I'd do next.
- The year on the Branding card.
- Pebble & Co.: whether the child photo is AI-generated or real with parents' permission.
- An edit of the drafted lines (one line, the idea, signature texts) in each brand file.

---

## 2026-10-27 · Wiglet demo: calendar events, time ranges and clean titles

**Why:** a reported bug. "5-6 pm i have a meeting add that to my shedule" became a flexible block at 10:40–11:40 called "5-6 pm meeting that shedule". The demo parser was missing two things the real agent (`wiglet/agent.py`) does: reading time ranges, and telling calendar events from tasks.

**What changed**
- **`js/wiglet/demo-parser.js`, rewritten to the agent's rules:**
  - **Time ranges:** "5-6 pm", "5–6pm", "5pm-6pm", "5 to 6", "from 5 to 6", "between 5 and 6", "17:00-18:00", "5:30-6:15", "8–9pm".
  - **am/pm and day reading:** an am/pm written once applies to both ends. With none, the reading inside the 08:00–23:00 day wins, the earlier one if both fit ("5-6" is 17:00–18:00, "9-10" is 09:00–10:00). Also single times with am/pm, and "noon".
  - **Events vs tasks:** a clear calendar request ("add … to my calendar/schedule", "put … on my calendar", "book …", "schedule … for …", "create an event") is an event, written at the stated time and locked. As a demo addition, a stated time range for a meeting, call, appointment, class or anything "with" someone is also an event. "gym at 6" stays a flexible task, as in the agent's prompt.
  - **Clean titles:** times, filler and instruction words are stripped, typos are tolerated (shedule, schedual, scedule, calender, calandar), and the first letter is capitalised.
  - **Never guess a time:** if a time is there but unreadable, or a calendar request has no time, nothing is placed and the widget says "I couldn’t catch the time. Try something like “5–6pm meeting”."
- **The demo widget:**
  - Events show with the lock and "Fixed · added", never move, and the day is re-solved around them.
  - An event that overlaps something gets "Heads up: this overlaps DESG319 Lecture."
  - Under the quoted sentence, an "Understood: …" line shows what the parser read.
  - The deck's sentence, "book 8–9pm for meeting my friends today", is now the first chip.
- **Tests:** new `js/wiglet/demo-parser.test.js`.

**Checked**
- Tests: **29 of 29** parser tests and **65 of 65** scheduler checks pass (`node js/wiglet/demo-parser.test.js`, `node js/wiglet/scheduler.test.js`).
- In headless Chrome:
  - The reported sentence places "Meeting" at 5:00–6:00, locked, as "Fixed · added".
  - The deck sentence places "Meeting my friends" at 8:00–9:00, locked.
  - "meeting 9-10" shows the overlap note with DESG319 Lecture.
  - "meeting at half past five" places nothing and shows the time message.
  - "gym at 6" stays flexible at 6:00.
- No console errors over http:// and file://.

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
