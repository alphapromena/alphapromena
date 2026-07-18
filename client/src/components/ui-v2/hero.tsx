import { useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";
import { Eyebrow } from "./eyebrow";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/**
 * Interlock hero: paper background, one soft rose orb, uppercase Barlow
 * headline left with a single rose word, and the flat brand mark placed
 * center-right as a placeholder until the interactive 3D mark lands in
 * Round 28.1. Load sequence: thread draws, headline lines reveal with an
 * 80ms stagger, trust strip fades last. Instant under reduced motion.
 */
export function HeroV2() {
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      id="hero"
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: "100svh", background: "var(--paper)" }}
    >
      {/* Soft rose orb behind the mark */}
      <div
        className="v3-hero-orb"
        style={{ right: "-8%", top: "12%", width: "56%", aspectRatio: "1" }}
        aria-hidden="true"
      />

      {/* Flat brand mark, center-right — replaced by the R3F 3D mark in 28.1 */}
      <img
        src="/brand/logo-mark.svg"
        alt=""
        aria-hidden="true"
        className="v2-fade absolute hidden md:block"
        style={{
          ...delay(600),
          right: "6%",
          top: "50%",
          transform: "translateY(-55%)",
          width: "min(34vw, 460px)",
        }}
      />

      <div
        className="v2-container relative flex-1 flex flex-col justify-center"
        style={{ zIndex: 1, paddingTop: "104px", paddingBottom: "48px" }}
      >
        <div style={{ maxWidth: "680px" }}>
          <Eyebrow className="v2-fade" style={delay(150)}>Ataccama certified partner · MENA &amp; GCC</Eyebrow>

          <h1 className="v2-display mt-7">
            <span className="v2-reveal-line">
              <span style={delay(450)}>The data partner</span>
            </span>
            <span className="v2-reveal-line">
              <span style={delay(530)}>for the Gulf's most</span>
            </span>
            <span className="v2-reveal-line">
              <span style={delay(610)}>
                <span className="v2-rose-word">regulated</span> institutions.
              </span>
            </span>
          </h1>

          <p className="v2-body v2-fade mt-7" style={{ ...delay(750), maxWidth: "46ch" }}>
            Alpha Pro MENA helps enterprises across the GCC catalogue, govern, and activate
            their data. Certified Ataccama Solution Partner. Trusted by banks, insurers,
            and government.
          </p>

          <div className="v2-fade mt-9 flex flex-wrap items-center gap-3" style={delay(850)}>
            <Button variant="rose" onClick={() => scrollTo("contact")}>
              Book a discovery call <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => scrollTo("practices")}>
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
          <span className="mono" style={{ fontSize: "var(--text-mono)", color: "var(--ink-faint)" }}>
            Data Governance · Banking &amp; Finance · Enterprise AI
          </span>
        </div>
      </div>
    </section>
  );
}
