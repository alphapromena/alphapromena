import { useEffect } from "react";
import { Streamdown } from "streamdown";
import { Footer, Grain, Navbar } from "@/components/ui-v4";

interface PolicyPageProps {
  /** Small uppercase eyebrow shown above the title, e.g. "Legal · Privacy". */
  eyebrow: string;
  /** Page heading, e.g. "Privacy Policy". */
  title: string;
  /** Raw markdown document to render as the page body. */
  markdown: string;
}

/**
 * Standalone legal page. Shares the v4 header, footer, and dark palette so a
 * visitor arriving from the footer stays inside the same site rather than
 * landing on a differently-designed document.
 */
export function PolicyPage({ eyebrow, title, markdown }: PolicyPageProps) {
  useEffect(() => {
    document.documentElement.classList.add("v4-dark");
    return () => document.documentElement.classList.remove("v4-dark");
  }, []);

  return (
    <div className="v4 flex min-h-screen flex-col">
      <a href="#policy" className="v4-skip">
        Skip to content
      </a>
      <Grain />
      <Navbar />

      <main id="policy" className="flex-1">
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
          <article className="v4-prose mx-auto w-full max-w-[70ch]">
            <Streamdown>{markdown}</Streamdown>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
