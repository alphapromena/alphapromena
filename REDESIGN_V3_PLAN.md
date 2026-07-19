# Alpha Pro MENA, Redesign v3: "Interlock"

v3 supersedes the visual language of REDESIGN_V2_PLAN.md (sections 2 and 3). Everything else from v2 still applies: structure, section order, contact backend, SEO, accessibility, performance work, gates, and todo.md round discipline.

## Why v3
Stakeholder review rejected the invented Lineage palette. v3 is built strictly on the official brand kit and matches the interactive, motion-heavy feel of blacksync.ai.

## Brand tokens (official kit, exact)
--paper: #F3F2F1 (page background), --surface: #FFFFFF (cards), --ink: #313234 (primary text, dark bands), --ink-deep: #1A1C1E (darkest band stop), --rose: #FF1E57 (primary accent, CTAs), --rose-mid: #E92156 (hover), --rose-deep: #B7274F (pressed, and small rose text on light for AA contrast), --line: rgba(49,50,52,0.12).
Rule: pure --rose is reserved for buttons, large display words, and graphics. Small rose text on light uses --rose-deep.

## Typography
Barlow only, per the kit. Display: Barlow 700/800 UPPERCASE, tight tracking, huge. Body: Barlow 400/500. Eyebrows and labels: Barlow 600 uppercase, letter-spacing 0.08em. No other typeface ships.

## Visual language
Light-first. Generous whitespace, fully rounded pill buttons, white cards with soft shadows and 18px radius, rose used decisively: one highlighted word per headline. Full-width charcoal bands (ink to ink-deep gradient, off-white text, rose glow accents) break the rhythm at partnerships and the pre-footer CTA. The LineageThread mechanic survives, recolored rose, thin and elegant.

## Hero (next round)
The brand mark itself in interactive 3D: React Three Fiber, geometry extruded from the official SVG in client/public/brand/, rose glass and charcoal ceramic materials, mouse-follow rotation, idle float, floating pill badges around it, bold uppercase headline left. Lazy-loaded with a static SVG fallback and a prefers-reduced-motion fallback.

## Rounds
28.0 foundation reskin, 28.1 hero 3D, 28.2 sections + bands + motion, 28.3 OG/favicons + Lighthouse, 28.4 QA + launch.
