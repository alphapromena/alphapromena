# Alpha Pro MENA, Redesign v2: "Lineage"

Master plan for the full redesign of alphapromena.com. Assets are generated in Claude chat via Higgsfield. Code is executed in Claude Code, one phase per session, using the paste-ready prompts below. Drop this file in the repo root so Claude Code can reference it.

---

## 1. Current state (baseline)

- Stack: Vite + React SPA in `client/`, API in `api/` + `server/`, Drizzle ORM (`drizzle/`, Neon-style Postgres), `shared/`, pnpm, deployed on Vercel.
- Scripts: `pnpm dev` (frontend only), `vercel dev` (full stack), `pnpm check` (tsc), `pnpm db:generate` / `pnpm db:push`.
- Env: only `DATABASE_URL` required. Resend and the CRM webhook degrade gracefully (log-only) when unset. Do not break this behavior.
- Design today: light-locked theme, tokens as CSS custom properties in `index.css` (`--rose: #FF1E57`, `--paper`, `--ink`), Plus Jakarta Sans + IBM Plex Mono.
- Page today (one-page): hero, marquee of capabilities, practices (Data Governance & Intelligence powered by Ataccama One, Platform Dev, Banking & Finance), partnerships (Ataccama + Baker Tilly cards), about/values, 6-step process timeline, department cards, CTA band, contact form, footer, plus a scroll-triggered bottom-right Ataccama popup badge.
- Known issues: 3 TypeScript problems in `tsconfig.json`, tests removed during Vercel migration (`pnpm test` has nothing meaningful), unused components left over from earlier rounds (`AIChatBox.tsx`, `Map.tsx`, `gradient-card.tsx`, `department-contact-card.tsx`, `ComponentShowcase.tsx`), `todo.md` is a 26-round changelog and slightly stale.

## 2. Design direction: "Lineage"

One idea drives everything: **the page behaves like a data lineage graph.** A single brass thread of light enters at the hero and travels down the page, branching into nodes at each section: practices, partnerships, process, contact. Lineage is literally what Ataccama sells, so the metaphor is earned, not decorative. The audience is CDOs and CIOs at regulated Gulf institutions. The page's single job: make them believe Alpha Pro is the credible regional partner and book a discovery call.

### 2.1 Palette (dark-first, single theme)

| Token | Hex | Use |
|---|---|---|
| `--ink-950` | `#070A10` | Page background |
| `--ink-900` | `#0A0E16` | Base surfaces |
| `--ink-800` | `#101622` | Raised cards, inputs |
| `--line` | `#1C2432` | Hairlines, borders |
| `--sand-100` | `#EDE6D6` | Primary text |
| `--sand-400` | `#A9A08C` | Secondary text |
| `--brass-500` | `#C8A24A` | Accent: thread, CTAs, active nodes |
| `--brass-400` | `#D4B36A` | Accent hover |
| `--brass-glow` | `rgba(200,162,74,0.16)` | Glows, focus rings |

Contrast is verified: brass-500 on ink-900 is roughly 7.5:1, sand-100 on ink-900 is well above AAA. Brass is spent in one place at a time. If a section already has the thread, its buttons go ghost.

### 2.2 Typography

- Display: **Archivo** (variable, width 120 to 125, weight 700 to 800, tight tracking). Industrial, wide, premium. Used only for H1/H2.
- Body: **IBM Plex Sans** (400/500). 
- Utility: **IBM Plex Mono** (kept from v1) for eyebrows, labels, numbers, form labels, footer meta.
- Wave 2 Arabic pairs natively with **IBM Plex Sans Arabic**.
- Self-host via `@fontsource-variable/archivo`, `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`. `font-display: swap`, subset latin.
- Scale: `--text-display: clamp(2.75rem, 6vw, 5.25rem)`, `--text-h2: clamp(1.9rem, 3.5vw, 3rem)`, `--text-h3: 1.375rem`, `--text-body: 1.0625rem`, `--text-small: 0.875rem`, `--text-mono: 0.8125rem` with `letter-spacing: 0.08em` uppercase for eyebrows.

### 2.3 Structural language

- Eyebrows are written as catalog entries in mono, because the site is a registry of capabilities: `CATALOG / 01 · PRACTICES`, `LINEAGE / STEP 03 · ARCHITECTURE`, `REGISTRY · PARTNERSHIPS`. Numbering appears only where order is real (process steps, practice index).
- 12-column grid, `max-width: 1200px`, section padding `clamp(96px, 12vw, 160px)` vertical.
- Hairline dividers (`--line`) instead of boxed cards where possible. Cards get 1px `--line` borders, `border-radius: 8px`, no drop shadows, brass glow only on hover/active.

### 2.4 Motion

- One orchestrated hero load: thread draws in from the top, headline reveals by line mask, then the trust strip fades.
- Scroll: the thread's SVG `stroke-dashoffset` maps to scroll progress. Nodes fill with brass and pulse once when their section enters the viewport.
- Hover: cards lift 2px, their node pulses. Nothing else moves.
- `prefers-reduced-motion`: thread rendered fully drawn, no scroll mapping, no pulses.

### 2.5 Voice and copy rules

- Plain verbs, sentence case, specific over clever. No hype adjectives.
- **Never use em-dashes anywhere in site copy.** Use periods, commas, or restructure.
- CTAs name the action: "Book a discovery call", "Explore practices", "Send message" with a success toast "Message sent".
- The Ataccama fact leads: "Ataccama's certified Solution Partner across MENA."

### 2.6 Hero copy (draft, final pick during Phase 2)

- Eyebrow (mono): `ATACCAMA CERTIFIED PARTNER · MENA & GCC`
- H1 option A: **Data you can govern. AI you can trust.**
- H1 option B: **The data partner for the Gulf's most regulated institutions.**
- Subline: "Alpha Pro MENA helps enterprises across the GCC catalogue, govern, and activate their data. Certified Ataccama Solution Partner. Trusted by banks, insurers, and government."
- CTAs: primary "Book a discovery call", ghost "Explore practices".

## 3. Asset pipeline (Higgsfield, done in Claude chat)

All assets land in `client/public/assets/v2/`. Source PNGs are converted to AVIF + WebP in Phase 5.

| # | Asset | Spec | Status |
|---|---|---|---|
| A1 | `hero-lineage` | 16:9, 2K, dark dunes of data points with brass lineage thread | 2 concepts generated, pick one, then upscale to 4K |
| A2 | `bg-practices` | 21:9, subtle darker variant, low contrast so text sits on top | pending |
| A3 | `bg-banking` | 16:9, obsidian vault geometry, brass etch | pending |
| A4 | `bg-ai` | 16:9, neural dune field, very dim | pending |
| A5 | `og-image` | 1200x630, hero crop + logo + tagline (composited in code or Figma-style export) | pending |
| A6 | grain/noise texture | tileable 512px, 4% opacity overlay | pending |
| A7 (wave 2) | hero loop video | image-to-video from A1, 6s seamless loop, muted, `prefers-reduced-motion` fallback to A1 | optional |

Rule: backgrounds must stay quiet. If any generated asset competes with the headline, darken it with an ink-900 gradient overlay at 60 to 80%.

## 4. Execution phases

Each phase is one Claude Code session. Do not start a phase until the previous phase's gate passes. After every phase, append a `Round 27.x` entry to `todo.md` describing what changed.

Global gates for every phase: `pnpm check` clean, `pnpm build` passes, no console errors in dev, mobile at 375px reviewed.

---

### Phase 0: Baseline and cleanup

Goal: a clean branch with dead weight removed and type errors fixed, so the redesign starts from zero noise.

PASTE INTO CLAUDE CODE:

```
Read REDESIGN_V2_PLAN.md in the repo root, section Phase 0.

1. Create branch redesign/v2 from main. Tag the current main as pre-redesign-v2.
2. Fix the 3 TypeScript problems currently reported in tsconfig.json. Show me the diff before applying.
3. Verify these components have no remaining imports, then delete them: client/src/**/AIChatBox.tsx, Map.tsx, gradient-card.tsx, department-contact-card.tsx, ComponentShowcase.tsx. If anything still imports one, list it and stop.
4. Remove the test script from package.json OR add a single smoke test that renders <App /> without crashing, whichever is less work. State which you chose.
5. Run pnpm check and pnpm build. Fix anything that breaks.
6. Append a "Round 27.0: redesign baseline" entry to todo.md.
Commit with message "chore(redesign): baseline cleanup, fix tsconfig, remove dead components".
```

Gate: check + build clean, dead components gone, branch pushed.

---

### Phase 1: Design foundation (tokens + primitives)

Goal: the entire "Lineage" design system exists in code before any section is rebuilt.

PASTE INTO CLAUDE CODE:

```
Read REDESIGN_V2_PLAN.md sections 2.1 to 2.5. We are replacing the visual foundation on branch redesign/v2.

1. Install @fontsource-variable/archivo, @fontsource/ibm-plex-sans, @fontsource/ibm-plex-mono. Remove Plus Jakarta Sans. Import fonts in the app entry.
2. Rewrite the design tokens in client/src/index.css exactly per the plan: the 9 color tokens, the type scale, spacing scale (4px base: 1,2,3,4,6,8,12,16,24,32), --radius: 8px, motion durations (--dur-fast: 150ms, --dur-med: 300ms, --dur-slow: 700ms) and easing (--ease: cubic-bezier(0.22, 1, 0.36, 1)). Delete --rose, --paper and any light-theme remnants. The site is dark-first, single theme, so remove any theme switch code paths.
3. Build primitives in client/src/components/ui-v2/: Section (handles vertical rhythm and max-width), Eyebrow (mono, uppercase, catalog style with optional index like "CATALOG / 01"), Button (variants: brass, ghost; brass has --brass-glow focus ring), CardV2 (1px --line border, hover lift 2px), LineageNode (12px circle, idle = --line stroke, active = brass fill with one pulse animation, respects prefers-reduced-motion).
4. Add a temporary route /dev-tokens that renders every primitive, every color swatch with its hex, and the full type scale, so I can review in the browser. We delete this route in Phase 6.
5. Run pnpm check and pnpm build.
6. Append "Round 27.1: Lineage design foundation" to todo.md.
Commit: "feat(redesign): Lineage tokens, fonts, and ui-v2 primitives".
```

Gate: /dev-tokens reviewed in browser, contrast spot-checked, check + build clean.

---

### Phase 2: Shell (nav, hero, footer)

Goal: the first and last thing a visitor sees is fully redesigned. Requires asset A1 committed to `client/public/assets/v2/`.

PASTE INTO CLAUDE CODE:

```
Read REDESIGN_V2_PLAN.md sections 2 and Phase 2. Branch redesign/v2. Asset exists at client/public/assets/v2/hero-lineage.png.

1. Navbar: fixed, transparent over hero, gains ink-900/85 backdrop-blur after 40px scroll. Left: wordmark "Alpha Pro MENA" in Archivo 700. Right: mono links (Practices, Partnerships, Process, Contact) + brass Button "Book a call" that scrolls to the contact form. Mobile: full-screen overlay menu, focus-trapped.
2. Hero: full viewport height. Background: hero-lineage.png with an ink-950 gradient overlay left-to-right (85% to 20%) so the left third is readable. Content in the left column: Eyebrow "ATACCAMA CERTIFIED PARTNER · MENA & GCC", H1 in Archivo display size using copy option A from section 2.6, subline in sand-400, two CTAs (brass + ghost). Below the fold line, a thin trust strip in mono: "Data Governance · Banking & Finance · Enterprise AI". Load sequence per section 2.4, respecting prefers-reduced-motion.
3. Start the lineage thread: an absolutely positioned SVG line that begins at the hero CTA area and exits the bottom of the hero section. Static for now, the scroll behavior comes in Phase 4. Structure it so the path can later extend through the page (a single fixed SVG layer component, LineageThread, that accepts waypoints).
4. Footer: three columns on desktop. Column 1: wordmark + one-line description + "Certified Ataccama Solution Partner, MENA". Column 2: mono nav links. Column 3: contact email, Amman address line, LinkedIn. Bottom bar: copyright + built-with line in mono, hairline --line separator.
5. Keep all existing sections between hero and footer untouched and functional, even if visually mismatched for now.
6. pnpm check, pnpm build, review at 375px and 1440px.
7. Append "Round 27.2: shell" to todo.md.
Commit: "feat(redesign): navbar, Lineage hero, footer".
```

Gate: hero reviewed on desktop + mobile, old sections still render, check + build clean.

---

### Phase 3: Content sections rebuild

Goal: every section between hero and footer rebuilt in the new language. Copy stays close to current content but tightened per section 2.5.

PASTE INTO CLAUDE CODE:

```
Read REDESIGN_V2_PLAN.md sections 2 and Phase 3. Branch redesign/v2. Rebuild all mid-page sections using ui-v2 primitives. Order on the page:

1. Practices. Eyebrow "CATALOG / 01 · PRACTICES". Three entries: Data Governance & Intelligence (powered by Ataccama One, the only certified Solution Partner across MENA), Enterprise AI & Platform Development, Banking & Finance Advisory. Desktop: a vertical index list on the left, detail panel on the right that swaps on hover/click with a 300ms fade. Mobile: stacked accordion. Each practice detail: 2 sentences + 4 mono capability chips + ghost "Get in touch" that scrolls to contact with the practice preselected in the form.
2. Partnerships. Eyebrow "REGISTRY · PARTNERSHIPS". Two CardV2 entries styled like certification records: Ataccama (Certified Solution Partner, MENA) and Baker Tilly. Each card: partner name in Archivo, a mono record line (region, since-year if known in the current code, scope), one sentence.
3. Process. Eyebrow "LINEAGE / PROCESS". The 6 existing steps (Discovery, Roadmap, Architecture, Sprints, UAT & go-live, Support) laid on the thread: on desktop the thread runs vertically through 6 LineageNodes, step title in Archivo h3, one sentence each in sand-400. Numbers are justified here, label them STEP 01 to STEP 06 in mono.
4. Values. Eyebrow "CATALOG / 02 · HOW WE WORK". Compress the current 6 values into a tight 3x2 grid, title + one line each. No icons.
5. Contact. Eyebrow "OPEN A RECORD". Two columns: left is a short pitch + direct email + the department routing as three mono rows (Data Governance, Banking & Finance, Enterprise AI) instead of separate department cards. Right is the form. Reuse the existing form logic, validation, API call, Resend email, and CRM webhook exactly as-is. Restyle inputs only: ink-800 background, --line border, brass focus ring, mono labels. Add a Practice select field (prefilled by the practice CTAs). Success state: replace form with "Message sent. We reply within one business day." Error state: inline, plain, tells the user to retry or email directly.
6. Remove the marquee capability ticker and the department cards section (their content is absorbed above). Remove the scroll-triggered Ataccama popup badge entirely. The Ataccama fact now lives in the hero eyebrow, practices, and partnerships. 
7. CTA band before footer: one line in Archivo ("Start with a discovery call.") + brass button. Thread terminates here at a final filled node.
8. pnpm check, pnpm build, click every CTA, submit the form once against dev.
9. Append "Round 27.3: sections rebuilt" to todo.md.
Commit: "feat(redesign): practices, partnerships, process, values, contact".
```

Gate: full page coherent top to bottom, form verified end to end (check the DB row or log), no orphan components, check + build clean.

---

### Phase 4: Signature motion

Goal: the lineage thread comes alive. This is the one memorable thing, executed precisely.

PASTE INTO CLAUDE CODE:

```
Read REDESIGN_V2_PLAN.md section 2.4 and Phase 4. Branch redesign/v2.

1. LineageThread: compute the SVG path through its waypoints (hero CTA, each process node, contact node, CTA band node) after layout, recompute on resize with a debounce. Map stroke-dashoffset to scroll progress with a small lead so the thread head is always slightly ahead of the viewport center. Use transform/opacity/dashoffset only, no layout thrash, target 60fps.
2. Nodes activate (brass fill + single pulse) when their waypoint passes the viewport trigger line. Once active, stay active.
3. Hero load sequence: thread draws over 700ms, then headline lines reveal with 80ms stagger, then trust strip fades in. Total under 1.6s.
4. prefers-reduced-motion: render the thread fully drawn and all nodes active, skip all animation including the hero sequence.
5. Verify no cumulative layout shift from the SVG layer (position: fixed, pointer-events: none, zero size impact).
6. pnpm check, pnpm build. Record a quick screen capture of a full-page scroll for review if tooling allows, otherwise describe frame timing from the Performance panel.
7. Append "Round 27.4: lineage motion" to todo.md.
Commit: "feat(redesign): scroll-driven lineage thread and hero sequence".
```

Gate: smooth scroll on a mid-range laptop, CLS 0, reduced-motion verified in DevTools emulation.

---

### Phase 5: Performance, SEO, accessibility

PASTE INTO CLAUDE CODE:

```
Read REDESIGN_V2_PLAN.md Phase 5. Branch redesign/v2.

1. Images: generate AVIF + WebP for every asset in client/public/assets/v2/ with a small script (sharp), serve via <picture> with srcset at 960/1440/2560 widths. Preload the hero image. Lazy-load everything below the fold.
2. Fonts: confirm latin subsets only, font-display swap, preload the two font files used above the fold.
3. SEO: rewrite title and meta description around "Ataccama certified partner MENA, data governance, enterprise AI". New OG tags pointing to assets/v2/og-image. JSON-LD: Organization + Service (three practices). Add sitemap.xml and robots.txt if missing.
4. Accessibility: visible focus states everywhere (brass ring), skip-to-content link, form labels tied to inputs, aria on the mobile menu and practice selector, check brass-on-ink and sand-on-ink pairs at AA with an automated tool.
5. Run Lighthouse on the Vercel preview: targets 90+ mobile, 95+ desktop on Performance, 100 on Accessibility and SEO. Fix what falls short, list anything intentionally deferred.
6. Delete the /dev-tokens route.
7. Append "Round 27.5: perf, SEO, a11y" to todo.md.
Commit: "chore(redesign): image pipeline, SEO, accessibility pass".
```

Gate: Lighthouse screenshots attached in the PR, axe clean.

---

### Phase 6: QA and launch

PASTE INTO CLAUDE CODE:

```
Read REDESIGN_V2_PLAN.md Phase 6. Branch redesign/v2.

1. Cross-check Chrome, Safari, Edge, and one real Android + iPhone via the Vercel preview URL. List anything broken and fix.
2. Copy proofread of every visible string: sentence case, no hype words, and confirm there are no em-dashes anywhere in the copy.
3. Verify the contact pipeline on the preview: DB row created, Resend email sent (or logged if unset), CRM webhook fired (or logged).
4. Open a PR redesign/v2 into main with before/after screenshots of every section and the Lighthouse report. Summarize all Round 27.x entries in the PR description.
5. After approval, merge, confirm production deploy on Vercel, smoke-test production, and tag redesign-v2-live.
```

Gate: Abdallah's sign-off on the preview URL before merge.

---

## 5. Wave 2 backlog (separate cycle, not in this redesign)

1. Arabic: i18n scaffold, IBM Plex Sans Arabic, full RTL mirroring, language toggle in the navbar. The Lineage system was chosen to survive RTL (the thread mirrors cleanly).
2. Hero loop video (asset A7) with static fallback.
3. Case studies / references page once client names are approved for public use.
4. Insights or LinkedIn feed section (possible AlphaBeacon tie-in).

## 6. Decisions locked

- One-page architecture stays. No new routes except legal pages if needed.
- Dark-first single theme. No theme switcher.
- Contact form backend untouched: UI-only restyle.
- Popup badge removed, Ataccama moves into hero, practices, partnerships.
- Brass is the only accent. If something needs a second accent, the answer is hierarchy, not another color.
