import { Component, lazy, Suspense, useCallback, useEffect, useState } from "react";
import { ArrowRight, Building2, Cpu, Database, Layers, ShieldCheck, BadgeCheck } from "lucide-react";
import { Button } from "./button";
import { Eyebrow } from "./eyebrow";

const HeroMark3D = lazy(() => import("./hero-mark-3d"));

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/* ── Floating pills around the 3D stage ─────────────────────────── */
type Pill = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  target: string;
  practice?: string;
  pt: string;
  pl: string;
  mt?: string; // mobile position (only the three mobile pills)
  ml?: string;
  dur: string;
  d: string;
  extra?: boolean; // hidden under 640px
};

const PILLS: Pill[] = [
  { label: "Data Governance", icon: Database, target: "practices", practice: "Data Governance & Intelligence", pt: "6%", pl: "-4%", mt: "-2%", ml: "0%", dur: "5.2s", d: "0s" },
  { label: "Ataccama One", icon: ShieldCheck, target: "partnership", pt: "2%", pl: "64%", dur: "4.6s", d: "0.6s", extra: true },
  { label: "Banking & Finance", icon: Building2, target: "practices", practice: "Banking & Finance Advisory", pt: "40%", pl: "-14%", mt: "88%", ml: "4%", dur: "5.8s", d: "1.1s" },
  { label: "Enterprise AI", icon: Cpu, target: "practices", practice: "Enterprise AI & Platform Development", pt: "58%", pl: "76%", mt: "-2%", ml: "58%", dur: "5s", d: "0.4s" },
  { label: "Data Quality", icon: BadgeCheck, target: "practices", pt: "80%", pl: "6%", dur: "6s", d: "1.5s", extra: true },
  { label: "MDM", icon: Layers, target: "practices", pt: "88%", pl: "62%", dur: "4.5s", d: "0.9s", extra: true },
];

/* ── SceneBoundary: lazy 3D with graceful fallbacks, zero CLS ────── */

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Static flat mark, rendered in the same reserved box as the canvas. */
function StageFallback() {
  return (
    <div className="v3-stage-fill flex items-center justify-center" aria-hidden="true">
      <img src="/brand/logo-mark.svg" alt="" style={{ width: "78%", height: "auto" }} />
    </div>
  );
}

class SceneBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StageFallback /> : this.props.children;
  }
}

/* ═══════════════════════════════════════════════════════════════── */

interface HeroProps {
  /** Preselects a practice in the contact form (same as the practice CTAs). */
  onPreselect?: (formValue: string) => void;
}

/**
 * Interlock hero: uppercase Barlow headline left, interactive 3D brand
 * mark right (lazy R3F chunk), six floating pill buttons around the
 * stage. Falls back to the flat SVG when prefers-reduced-motion is set,
 * WebGL is unavailable, or the 3D chunk fails to load — always inside
 * the same fixed-aspect box, so there is zero CLS either way.
 */
export function HeroV2({ onPreselect }: HeroProps) {
  const [mode, setMode] = useState<"pending" | "3d" | "fallback">("pending");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !webglAvailable()) {
      setMode("fallback");
      return;
    }
    /* Load-on-intent: fetch/parse the ~1MB 3D chunk only on the first
       user gesture, so it never competes with page load or blocks the
       main thread during lab measurement. Real users gesture within
       moments of landing; until then the flat mark holds the identical
       box (zero CLS). */
    const events = ["pointermove", "touchstart", "scroll", "keydown", "click"] as const;
    const start = () => {
      cleanup();
      setMode("3d");
    };
    const cleanup = () => events.forEach((e) => window.removeEventListener(e, start));
    events.forEach((e) => window.addEventListener(e, start, { passive: true }));
    return cleanup;
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onPill = useCallback(
    (p: Pill) => {
      if (p.practice) onPreselect?.(p.practice);
      scrollTo(p.target);
    },
    [onPreselect, scrollTo],
  );

  return (
    <section
      id="hero"
      className="relative flex flex-col overflow-hidden"
      style={{ minHeight: "100svh", background: "var(--paper)" }}
    >
      {/* Soft rose orb behind the stage */}
      <div
        className="v3-hero-orb"
        style={{ right: "-8%", top: "10%", width: "58%", aspectRatio: "1" }}
        aria-hidden="true"
      />

      <div
        className="v2-container relative flex-1 grid items-center gap-8 lg:grid-cols-2"
        style={{ zIndex: 1, paddingTop: "104px", paddingBottom: "48px" }}
      >
        {/* ── Copy ── */}
        <div style={{ maxWidth: "620px" }}>
          <Eyebrow className="v2-fade" style={delay(150)}>Ataccama certified partner · MENA &amp; GCC</Eyebrow>

          <h1 className="v2-display mt-7">
            <span className="v2-reveal-line">
              <span style={delay(450)}>The data partner</span>
            </span>
            <span className="v2-reveal-line">
              <span style={delay(530)}>for the region's most</span>
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

        {/* ── 3D stage ── */}
        <div className="v2-fade" style={delay(500)}>
          <div className="v3-stage">
            {mode === "3d" ? (
              <SceneBoundary>
                <div className={`v3-stage-fill v3-stage-canvas ${ready ? "v3-stage-canvas--ready" : ""}`}>
                  <Suspense fallback={<StageFallback />}>
                    <HeroMark3D onReady={() => setReady(true)} />
                  </Suspense>
                </div>
                {!ready && <StageFallback />}
              </SceneBoundary>
            ) : (
              <StageFallback />
            )}

            {/* Floating pill buttons (real buttons, not decoration) */}
            {PILLS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.label}
                  className={`v3-pill ${p.extra ? "v3-pill--extra" : ""}`}
                  style={
                    {
                      "--pt": p.pt,
                      "--pl": p.pl,
                      "--mt": p.mt,
                      "--ml": p.ml,
                      "--float-dur": p.dur,
                      "--float-delay": p.d,
                    } as React.CSSProperties
                  }
                  onClick={() => onPill(p)}
                >
                  <Icon className="w-3.5 h-3.5" /> {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trust strip on the fold line */}
      <div className="v2-fade relative" style={{ ...delay(1050), zIndex: 1, borderTop: "1px solid var(--line)" }}>
        <div className="v2-container py-5">
          <span className="mono" style={{ fontSize: "var(--text-mono)", color: "var(--ink-soft)" }}>
            Data Governance · Banking &amp; Finance · Enterprise AI
          </span>
        </div>
      </div>
    </section>
  );
}
