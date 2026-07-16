import { useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";
import { Eyebrow } from "./eyebrow";
import { LineageThread } from "./lineage-thread";

/* Hard line breaks so each headline line can reveal through its own mask. */
const HEADLINE_LINES = ["The data partner", "for the Gulf's most", "regulated institutions."];

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/**
 * Lineage hero. Load sequence (§2.4): the thread draws in over 700ms,
 * headline lines reveal with an 80ms stagger, then the trust strip fades.
 * Everything renders instantly under prefers-reduced-motion (CSS).
 *
 * Background expects asset A1 at /assets/v2/hero-lineage.png; until it is
 * committed the ink scrim alone carries the frame.
 */
export function HeroV2() {
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section id="hero" className="relative flex flex-col overflow-hidden" style={{ minHeight: "100svh", background: "var(--ink-950)" }}>
      <div className="v2-hero-bg" aria-hidden="true" />
      <div className="v2-hero-scrim" aria-hidden="true" />
      <LineageThread waypoints={["thread-origin"]} />

      <div className="v2-container relative flex-1 flex flex-col justify-center" style={{ zIndex: 1, paddingTop: "104px", paddingBottom: "48px" }}>
        <div style={{ maxWidth: "640px" }}>
          <Eyebrow className="v2-fade" style={delay(150)}>Ataccama certified partner · MENA &amp; GCC</Eyebrow>

          <h1 className="v2-display mt-7">
            {HEADLINE_LINES.map((line, i) => (
              <span key={line} className="v2-reveal-line">
                <span style={delay(450 + i * 80)}>{line}</span>
              </span>
            ))}
          </h1>

          <p className="v2-body v2-fade mt-7" style={{ ...delay(750), maxWidth: "48ch" }}>
            Alpha Pro MENA helps enterprises across the GCC catalogue, govern, and activate
            their data. Certified Ataccama Solution Partner. Trusted by banks, insurers,
            and government.
          </p>

          <div className="v2-fade mt-9 flex flex-wrap items-center gap-3" style={delay(850)}>
            <Button variant="brass" onClick={() => scrollTo("contact")}>
              Book a discovery call <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" onClick={() => scrollTo("practices")}>
              Explore practices
            </Button>
          </div>

          {/* Origin of the lineage thread: measured, not seen. */}
          <span id="thread-origin" className="block w-3 h-3 mt-12" aria-hidden="true" />
        </div>
      </div>

      {/* Trust strip on the fold line */}
      <div className="v2-fade relative" style={{ ...delay(1050), zIndex: 1, borderTop: "1px solid var(--line)" }}>
        <div className="v2-container py-5">
          <span
            className="mono"
            style={{ fontSize: "var(--text-mono)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--sand-400)" }}
          >
            Data Governance · Banking &amp; Finance · Enterprise AI
          </span>
        </div>
      </div>
    </section>
  );
}
