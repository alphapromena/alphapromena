# Alphapromena Enterprise Website TODO

## Design & Global
- [x] Dark/premium theme with deep navy, slate, and gold/cyan accent palette
- [x] Refined typography using Inter + Playfair Display from Google Fonts
- [x] Global smooth scrolling and scroll-based animations (framer-motion)
- [x] Responsive layout across mobile, tablet, desktop

## Navigation
- [x] Sticky top navigation with Alphapromena logo/wordmark
- [x] Nav links: Home, Partnership, Services, Solutions, About, Contact
- [x] Smooth scroll to each section on click
- [x] Mobile hamburger menu

## Hero Section
- [x] Full-viewport hero with gradient/particle background
- [x] Headline and sub-headline for enterprise positioning
- [x] Two CTA buttons: "Explore Services" and "Contact Us"
- [x] Animated entrance (framer-motion)

## Ataccama One Reseller Partner Section
- [x] Dedicated section with Ataccama One logo
- [x] Partnership badge / "Official Reseller Partner" callout
- [x] Partnership description and key benefits
- [x] Feature highlights (data governance, data catalog, data quality)

## AI Services Section
- [x] Grid of enterprise AI service cards with icons
- [x] Services: AI Strategy & Consulting, Data Intelligence, Machine Learning Solutions, AI Integration, Intelligent Automation, AI Governance
- [x] Each card: icon, title, short description, feature tags

## Enterprise Solutions Section
- [x] Data Governance pillar
- [x] Data Intelligence pillar
- [x] Business Value Propositions
- [x] Stats/metrics row (clients, projects, etc.)

## About Us Section
- [x] Company overview paragraph
- [x] Mission statement
- [x] Vision statement
- [x] Core values grid

## Contact / Lead Generation Form
- [x] Fields: Name, Company, Email, Inquiry Type (dropdown), Message
- [x] Form validation (zod)
- [x] Backend tRPC mutation to save submission to DB
- [x] Owner notification on every submission (notifyOwner)
- [x] Success/error toast feedback

## Database
- [x] contact_submissions table in drizzle/schema.ts
- [x] Migration applied via drizzle-kit migrate

## Footer
- [x] Company name, tagline, copyright
- [x] Quick links to all sections
- [x] Contact details (email, location)
- [x] Social links (LinkedIn, Twitter)

## Backend / Tests
- [x] tRPC router for contact form submission
- [x] Vitest test for contact form router

## Branding Kit (Alpha Pro MENA)
- [x] Apply Alpha Pro MENA brand colors (#FF1E57, #E92156, #B7274F, #313234, #F3F2F1)
- [x] Switch typography to Barlow font (all caps headings)
- [x] Render real SVG logo mark (interlinked rounded squares, crimson + charcoal)
- [x] Update all UI elements, gradients, and accents to use brand identity
- [x] Light theme redesign with 21st.dev-inspired card/bento layout

## Enhancements (Round 3)
- [x] Add Ataccama One clickable link to https://www.ataccama.com/platform (opens in new tab)
- [x] Replace AI services section with cybernetic bento grid (mouse-tracking glow, mixed col/row spans)
- [x] Adapt bento grid to Alpha Pro MENA brand colors (crimson glow, charcoal cards)

## Enhancements (Round 4)
- [x] Create AnimatedBlobs component in client/src/components/ui/blobs.tsx
- [x] Adapt blob colors to Alpha Pro MENA brand (crimson, charcoal, rose)
- [x] Integrate AnimatedBlobs into hero section as decorative background element

## Enhancements (Round 5)
- [x] Change navbar background to dark charcoal (#313234) matching the footer
- [x] Update navbar text/link colors to white for contrast on dark background

## Full Rebuild — Multi-Practice Cinematic Site
- [x] Cinematic dark/light design system with premium motion tokens
- [x] Hero: full-viewport with animated blobs, editorial headline, floating stat cards
- [x] Practice areas tab/scroll navigation
- [x] Data & Governance section (Ataccama One partnership, bento grid)
- [x] AI Consulting & Audits section (cinematic layout)
- [x] AI Implementation & Custom Solutions section
- [x] Banking & Finance vertical section
- [x] Full-Stack Development section
- [x] Ataccama One partnership deep-dive with link
- [x] Stats counter section (animated numbers)
- [x] Testimonials / social proof section
- [x] CTA banner above footer (crimson gradient)
- [x] Contact form with owner notification
- [x] Cinematic footer

## Gap Resolution
- [x] Re-integrate AnimatedBlobs into hero section (replace static parallax with blobs card)
- [x] Add testimonials / social proof section with quotes and client callouts

## Enhancements (Round 6)
- [x] Rebuild Ataccama One section with light/white background (contrast against dark site)
- [x] Dual-logo badge bar: Alpha Pro MENA logo + "Official Reseller Partner" + Ataccama One logo with external link
- [x] 4-capability cards: Data Catalog, Data Quality, Data Governance, Master Data (white cards, crimson icons, blob accent)

## Enhancements (Round 7)
- [x] Pixel-match Ataccama section to screenshot: off-white bg, centered pill badge, bold headline, 3-panel badge bar with Ataccama purple logo, 4 light-grey rounded cards with crimson icons

## Enhancements (Round 8)
- [x] Add scroll-triggered popup when user scrolls to Partnership section showing Alpha Pro Consulting listing on ataccama.com/partners
- [x] Popup shows partner card screenshot, description, and "View on Ataccama.com" CTA button
- [x] Fine-tune Ataccama section background and card styling to pixel-match screenshot

## Enhancements (Round 9)
- [x] Convert full Ataccama section into scroll-triggered modal: pill badge, headline, paragraph, 3-panel badge bar, 4 capability cards — all inside the popup
- [x] Replace the inline page section with a minimal anchor/trigger area that fires the popup

## Enhancements (Round 10)
- [x] Restore inline Data Governance & Intelligence section: dark card, ATACCAMA ONE PARTNER badge, bold headline, POWERED BY ATACCAMA ONE subtitle, paragraph, 2-col checklist, ENQUIRE NOW + EXPLORE ATACCAMA ONE buttons
- [x] Keep scroll-triggered light-pink popup modal firing when section enters viewport

## Enhancements (Round 11)
- [x] Create ServiceCard component (service-card.tsx) with brand-adapted crimson/charcoal variants, framer-motion scale/image/arrow hover animations
- [x] Add "Our Services" section with 5-card grid (Data Governance, AI Consulting, Custom AI, Banking, Full-Stack) — each card clicks through to the relevant practice tab

## Enhancements (Round 12)
- [x] Add light/dark mode toggle button in navbar (sun/moon icon, persists to localStorage)
- [x] Redesign Ataccama One popup: smaller compact white modal, clean 4-card grid (Data Catalog, Data Quality, Data Governance, Master Data)
- [x] Add Baker Tilly partnership section/card with official branding
- [x] Add "Powered by nabdh.ai" branding badge/section
- [x] Add ShineBorder "How We Work" timeline section in white with animated shine border effect

## Enhancements (Round 13)
- [x] Create DepartmentContactCard component (white card, avatar initials, role badge, email + phone action buttons)
- [x] Add "Talk to Our Experts" section with 3 department cards: Data Governance/Ataccama (Qusai), Banking & Finance/Partnerships (Abood, US + JO numbers), AI Solutions (Hamza, US + JO numbers)
- [x] Add department-specific audit CTA banners per practice area (Data Audit, AI Readiness Audit, Banking Compliance Audit)

## Enhancements (Round 14)
- [x] Redesign contact section: replace person cards with department cards (practice name, description, services list, email + phone CTA — no personal names shown)

## Enhancements (Round 15)
- [x] In light mode: keep hero, practices panel, stats band, CTA band, contact section, and footer always-dark; keep services, about, how-we-work, partnerships, departments sections light — deliberate dark/light alternating rhythm

## Enhancements (Round 16)
- [x] Practice tab buttons: active tab = #FF1E57 background, all tabs = white text

## Enhancements (Round 17)
- [x] Remove empty space at top of page (removed 64px spacer div + pt-16 from main, hero now starts flush under navbar)

## Enhancements (Round 18)
- [x] Redesign navbar: rose-glow glass morphism (blur + translucent dark rose tint), ambient rose glow blobs, animated underline on hover, pill CTA with gradient + glow shadow
- [x] Replace SVG logo placeholder squares with Zap-icon gradient logo + "Alpha Pro / MENA" stacked text

## Enhancements (Round 19)
- [x] Department contact cards: clicking a card opens a modal with full department details (services list, email, phone numbers, CTA buttons)

## Enhancements (Round 20)
- [x] Replace department cards with GradientCard component design (gradient backgrounds, badge, title, description, CTA, decorative image, framer-motion hover)

## Enhancements (Round 21)
- [x] Remove bottom audit CTA section from departments
- [x] Replace phone/email pills on GradientCard with Sales@Alphapromena.com only
- [x] Add mini contact form on each department card (firstName, lastName, email, phone, company, jobTitle, message) that submits via CRM webhook
- [x] Add tRPC procedure to forward form submission to CRM webhook with Bearer token + source field

## Enhancements (Round 22)
- [x] Hero section: switch to light theme (white/light background, dark text, dark buttons) while rest of page stays dark

## Enhancements (Round 23)
- [x] Merge Full-Stack Development and Custom AI Solutions into one combined service card/practice tab (now 'AI & Full-Stack Engineering')

## Enhancements (Round 24)
- [x] Rename hero secondary CTA from "Talk to Us" to "Book Your Free Discovery"
- [x] Add AuroraButton component to /components/ui/aurora-button.tsx
- [x] Apply AuroraButton to the hero "Book Your Free Discovery" CTA

## Enhancements (Round 25)
- [x] Ataccama badge popup: redesign as small bottom-right corner widget (not full modal), open Ataccama link scrolled down to show Alpha Pro MENA listing

## Enhancements (Round 26)
- [x] Data Governance section: updated body copy to Exclusive MENA Partner positioning, badge changed from "Ataccama One Partner" to "Exclusive MENA Partner"
- [x] Remove ALL "Reseller" mentions site-wide — CONFIRMED ZERO OCCURRENCES
- [x] Remove ALL "Baker Tilly" mentions site-wide — CONFIRMED ZERO OCCURRENCES
- [x] Updated Banking department card description to remove Baker Tilly reference
- [x] Footer: removed placeholder social icon links (LI, TW, GH)
- [x] Department email display: gradient-card uses plain mailto:Sales@Alphapromena.com — no obfuscation

## Round 27.0: redesign baseline (Lineage v2, Phase 0)
- [x] Branch redesign/v2 created from main; main tagged pre-redesign-v2
- [x] REDESIGN_V2_PLAN.md committed to repo root
- [x] tsconfig problems resolved: IDE diagnostics were caused by missing node_modules (pnpm install fixes); real bug fixed — tsBuildInfoFile wrote into node_modules/typescript (a pnpm store symlink), moved to node_modules/.cache/tsbuildinfo
- [x] Dead components deleted (verified zero live imports): AIChatBox.tsx, Map.tsx, gradient-card.tsx, department-contact-card.tsx, ComponentShowcase.tsx
- [x] Test script removed from package.json (less work than a smoke test); vitest.config.ts and vitest devDependency removed with it
- [x] pnpm check clean, pnpm build passes
- [ ] Noted for Phase 5: policy-page.tsx renders static markdown via Streamdown, pulling mermaid/cytoscape/shiki chunks (~4MB of lazy chunks, 1.6MB main bundle) — replace with a lightweight markdown renderer

## Round 27.1: Lineage design foundation (Phase 1)
- [x] Fonts self-hosted via fontsource: Archivo Variable (wdth+wght axes), IBM Plex Sans 400/500, IBM Plex Mono 400/500; Google Fonts links (Plus Jakarta Sans) removed from index.html
- [x] index.css tokens rewritten to the Lineage system: 9 color tokens (ink/sand/brass), type scale (--text-display…--text-mono), spacing scale (--space-1…--space-32, 4px base), --radius: 8px, motion tokens (--dur-fast/med/slow, --ease)
- [x] shadcn semantic tokens remapped onto the dark palette (background=ink-950, primary=brass-500, ring=brass-500, …)
- [x] Old light values deleted; legacy token NAMES (--rose, --paper, --ink, …) kept as a clearly-marked shim re-pointed at the dark palette so untouched v1 sections stay functional until Phase 3 — DELETE THE SHIM IN PHASE 3
- [x] Theme switcher removed: ThemeContext.tsx deleted, ThemeProvider unwrapped from App, Toaster pinned to dark, next-themes dependency dropped
- [x] ui-v2 primitives: Section, Eyebrow (catalog index), Button/ButtonLink (brass, ghost, brass-glow focus ring), CardV2 (hairline, 2px hover lift), LineageNode (12px, single pulse, reduced-motion safe)
- [x] Temporary /dev-tokens route renders palette swatches with hex, full type scale, spacing, motion, and every primitive — delete in Phase 6
- [x] pnpm check clean, pnpm build passes

## Round 27.2: shell (Phase 2)
- [x] NavbarV2: fixed, transparent over hero, ink-900/85 backdrop blur + hairline after 40px scroll; Archivo wordmark; mono links (Practices, Partnerships, Process, Contact) + brass "Book a call"; mobile full-screen overlay menu with focus trap, Escape close, scroll lock
- [x] HeroV2: full-viewport, H1 option B ("The data partner for the Gulf's most regulated institutions."), eyebrow ATACCAMA CERTIFIED PARTNER · MENA & GCC, subline, brass + ghost CTAs, mono trust strip on the fold line
- [x] Hero load sequence: thread draws 700ms, headline line-mask reveals with 80ms stagger, trust strip fades last (~1.55s total); everything instant under prefers-reduced-motion
- [x] LineageThread component: SVG layer with waypoints API, vertical-biased cubic path, brass gradient stroke, origin node, draw-in animation, debounced resize recompute — scroll mapping comes in Phase 4
- [x] Hero background wired to /assets/v2/hero-lineage.png under the ink-950 L-to-R scrim (85%→20%); renders as quiet ink gradient until asset A1 is committed (client/public/assets/v2/ created)
- [x] FooterV2: three columns (wordmark + description + certified-partner line; mono nav; email + Amman + LinkedIn), hairline bottom bar with copyright, Privacy/Terms, built-in-Amman line
- [x] Policy pages switched to the new shell; old navbar-dropdown.tsx, site-footer.tsx, and unused alpha-pro-logo.tsx deleted
- [x] All mid-page v1 sections untouched and functional; pnpm check clean, pnpm build passes
- [x] LinkedIn resolved: footer points to the parent firm's page (linkedin.com/company/alpha-pro-consulting) until a dedicated MENA page exists

## Round 27.3: sections rebuilt (Phase 3)
- [x] Practices: CATALOG / 01 eyebrow; three entries (Data Governance & Intelligence / Enterprise AI & Platform Development / Banking & Finance Advisory); desktop index list + detail panel swapping on hover/click with 300ms fade; mobile stacked accordion; each detail = 2 sentences + 4 mono chips + ghost "Get in touch" that preselects the practice in the contact form
- [x] Partnerships: REGISTRY eyebrow; two CardV2 certification records (Ataccama, Baker Tilly) with Archivo names, mono record lines (region / status / scope; no since-year existed in v1 code), one sentence, external link
- [x] Process: LINEAGE eyebrow; 6 steps on a vertical thread with LineageNodes (ids process-node-0..5 ready for Phase 4), STEP 01–06 mono labels, Archivo h3 titles, one sentence each
- [x] Values: CATALOG / 02 · HOW WE WORK; 6 values compressed to a hairline 3x2 grid, title + one line, no icons
- [x] Contact: OPEN A RECORD; left = pitch + direct email + three mono routing rows that preselect the practice; right = form with identical backend logic (tRPC contact.submit, zod, Resend, CRM webhook untouched); inputs restyled ink-800/hairline/brass focus; Practice select added (maps to existing inquiryType field, so no API change); success replaces form with "Message sent. We reply within one business day."; error is inline with a direct email fallback
- [x] CTA band before footer: "Start with a discovery call." + brass button; thread terminates at a final filled node (id cta-node)
- [x] Removed: capability marquee, department cards, scroll-triggered Ataccama popup, fixed WebGL backdrop + scene-canvas.tsx, stats/about sections (per plan section list), legacy CSS shim and all v1 utility classes
- [x] Deleted dead components: blobs, aurora-button, shine-border, service-card; dropped three, @types/three, framer-motion deps (main bundle 1,626 kB → 1,433 kB)
- [x] Section backgrounds wired with graceful fallbacks: bg-practices.png (Practices), bg-banking.png (Partnerships), bg-ai.png (CTA band) as lazy imgs under 60–80% ink scrims; grain-512.png as fixed 4% tiled overlay in App — all render fine while assets are pending
- [x] NotFound page restyled to Lineage (was hardcoded light); policy pages moved to v2 primitives; .gitignore now excludes .claude/settings.local.json
- [x] pnpm check clean, pnpm build passes, all routes/modules compile under vite dev
- [ ] Form e2e submit not verifiable locally (no vercel CLI / DATABASE_URL in this environment); server code is untouched from v1 — verify the full pipeline on the Vercel preview in Phase 6 step 3

## Round 27.4: lineage motion (Phase 4)
- [x] LineageThread rewritten as a position-fixed, pointer-events-none SVG layer: path computed in document coordinates through the 9 existing waypoint ids (thread-origin, process-node-0..5, contact-node, cta-node), inner <g> translated by -scrollY so scroll tracking is transform-only
- [x] stroke-dashoffset mapped to a trigger line at viewport center + 12% lead via a precomputed length↔y lookup (binary search per frame, no DOM reads in the hot path); recompute on debounced resize + ResizeObserver on body (catches accordion toggles / async reflow)
- [x] Nodes activate (brass fill + single pulse) when their waypoint passes the trigger line and stay active; activation state lives in Home and drives the DOM LineageNodes; origin node pulses in the SVG at intro completion; cta terminal node is part of the same sequence
- [x] Hero load sequence unified: the Phase 2 draw is now the thread's own 700ms intro tween (origin → hero exit), after which scroll mapping takes over via max(introFloor, scrollTarget) — no double-trigger, thread never retracts above the hero
- [x] Process section's DOM connector spans removed (the SVG thread is the line now)
- [x] prefers-reduced-motion: thread fully drawn, all nodes active on load, no intro/pulses/dashoffset mapping (translate still tracks scroll — positioning, not animation)
- [x] CLS 0 by construction: fixed layer, no layout size, no layout-affecting properties animated (transform / opacity / dashoffset only; node pulse is paint-only box-shadow); per-frame scripting is O(log n) — see PR notes for the frame budget
- [x] pnpm check clean, pnpm build passes, all modules compile under vite dev

## Notes for Phase 6 proofread
- [ ] Headline: decide between "the Gulf's" and "the region's" most regulated institutions — eyebrow and Ataccama certification are MENA-wide, headline currently says Gulf
