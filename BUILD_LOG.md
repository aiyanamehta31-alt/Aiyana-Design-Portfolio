# Build log

A dated entry for every change to the portfolio: what changed, why, which source files were used, and what's still needed from Aiyana. Newest first.

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
