import { Eyebrow, FooterV2, NavbarV2 } from "@/components/ui-v2";

interface PolicyPageProps {
  /** Small mono eyebrow label shown above the title, e.g. "Legal · Privacy". */
  eyebrow: string;
  /** Page heading, e.g. "Privacy Policy". */
  title: string;
  /** Pre-rendered document body (static HTML generated from the markdown
      source at build time — see client/src/content/policies/). */
  html: string;
}

/**
 * Standalone legal / policy page. Reuses the site's header and footer so
 * it feels part of the marketing site, and renders a markdown document
 * inside a readable, single-column article.
 *
 * SHIP-AS-IS (28.4): the document content is written for AlphaBeacon on
 * purpose. These URLs likely back the pending LinkedIn OAuth app review
 * (which requires public privacy/terms links), so do not rewrite or move
 * them without confirmation from Abdallah.
 */
export function PolicyPage({ eyebrow, title, html }: PolicyPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--paper)" }}>
      <NavbarV2 />

      <main id="main" className="flex-1">
        {/* Header band */}
        <section className="hero-wash" style={{ borderBottom: "1px solid var(--line)", paddingTop: "8.5rem", paddingBottom: "3rem" }}>
          <div className="v2-container">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="v2-h2 mt-6">{title}</h1>
          </div>
        </section>

        {/* Document body */}
        <section className="py-14">
          <div className="v2-container">
            <article className="policy-prose" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </section>
      </main>

      <FooterV2 />
    </div>
  );
}
