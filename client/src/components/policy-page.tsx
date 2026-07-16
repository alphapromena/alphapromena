import { Streamdown } from "streamdown";
import { FooterV2, NavbarV2 } from "@/components/ui-v2";

interface PolicyPageProps {
  /** Small mono eyebrow label shown above the title, e.g. "Legal · Privacy". */
  eyebrow: string;
  /** Page heading, e.g. "Privacy Policy". */
  title: string;
  /** Raw markdown document to render as the page body. */
  markdown: string;
}

/**
 * Standalone legal / policy page. Reuses the site's header and footer so
 * it feels part of the marketing site, and renders a markdown document
 * inside a readable, single-column article.
 */
export function PolicyPage({ eyebrow, title, markdown }: PolicyPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-paper" style={{ color: "var(--ink)" }}>
      <NavbarV2 />

      <main className="flex-1">
        {/* Header band */}
        <section className="hero-wash" style={{ borderBottom: "1px solid var(--line)", paddingTop: "8.5rem", paddingBottom: "3rem" }}>
          <div className="container">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="display mt-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}>{title}</h1>
          </div>
        </section>

        {/* Document body */}
        <section className="py-14">
          <div className="container">
            <article className="policy-prose">
              <Streamdown>{markdown}</Streamdown>
            </article>
          </div>
        </section>
      </main>

      <FooterV2 />
    </div>
  );
}
