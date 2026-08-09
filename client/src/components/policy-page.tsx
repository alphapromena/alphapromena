import { useEffect } from "react";
import { Footer, Grain, Navbar } from "@/components/ui-v4";

interface PolicyPageProps {
  /** Small uppercase eyebrow label shown above the title, e.g. "Legal · Privacy". */
  eyebrow: string;
  /** Page heading, e.g. "Privacy Policy". */
  title: string;
  /** Pre-rendered document body (static HTML generated from the markdown
      source at build time — see client/src/content/policies/). */
  html: string;
}

/**
 * Standalone legal / policy page. Shares the v4 header, footer, and dark
 * palette so a visitor arriving from the footer stays inside the same site.
 *
 * SHIP-AS-IS (28.4): the document content is written for AlphaBeacon on
 * purpose. These URLs likely back the pending LinkedIn OAuth app review
 * (which requires public privacy/terms links), so do not rewrite or move
 * them without confirmation from Abdallah.
 */
export function PolicyPage({ eyebrow, title, html }: PolicyPageProps) {
  useEffect(() => {
    document.documentElement.classList.add("v4-dark");
    return () => document.documentElement.classList.remove("v4-dark");
  }, []);

  return (
    <div className="v4 flex min-h-screen flex-col">
      <Grain />
      <Navbar />

      <main id="main" className="flex-1">
        <header
          className="px-6 pb-14 pt-36 lg:px-10 lg:pt-44"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <div className="mx-auto w-full max-w-[1300px]">
            <p className="v4-eyebrow">{eyebrow}</p>
            <h1 className="v4-display mt-6" style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)" }}>
              {title}
            </h1>
          </div>
        </header>

        <div className="px-6 py-16 lg:px-10">
          <article
            className="v4-prose mx-auto w-full max-w-[70ch]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
