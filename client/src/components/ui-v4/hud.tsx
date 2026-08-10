import { useEffect, useRef } from "react";
import { useContent } from "@/content/locale";
import { usePrefersReducedMotion } from "./use-motion";
import type { Scrub } from "./scrub";

/** Scale the readout reaches at the end of the pin. */
const MAX_SCALE = 2;
/**
 * Where the readout is treated as complete.
 *
 * Rounding alone would only print 99.9 in the last 0.05% of the pin, a band
 * a scroll gesture flies straight past, so the number would appear to stop at
 * 99.8 and the pop would never fire. The last half percent saturates instead.
 */
const COMPLETE_AT = 0.995;
/** Falling back below this re-arms the pop for the next pass through the pin. */
const REARM_AT = 0.97;

/**
 * Fixed readout that climbs from 00.0 to 99.9 with the hero scrub and grows as
 * it climbs, so the number performs the outcome it reports.
 *
 * Two details matter for stability. The box is reserved at the final size from
 * first paint and only the glyphs scale inside it, so growth costs no layout
 * and no CLS. And the value is driven from the scrub's own animation frame
 * rather than a second loop of its own, so the number cannot lag the canvas.
 */
export function Hud({ scrub }: { scrub: Scrub }) {
  const t = useContent();
  const valueRef = useRef<HTMLSpanElement>(null);
  const growRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // The readout is an instrument attached to the hero, so it retires once the
  // hero leaves. Left up, it would sit on top of every section below.
  useEffect(() => {
    const box = boxRef.current;
    const hero = document.getElementById("hero");
    if (!box || !hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        box.style.opacity = entry.isIntersecting ? "1" : "0";
        box.style.pointerEvents = entry.isIntersecting ? "auto" : "none";
      },
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const value = valueRef.current;
    const grow = growRef.current;
    const bar = barRef.current;
    const pop = popRef.current;
    if (!value || !grow || !bar) return;

    // Reduced motion: settle at the final value and the final size, with no
    // growth and no pop.
    if (reduced) {
      value.textContent = "99.9";
      grow.style.transform = `scale(${MAX_SCALE})`;
      bar.style.transform = "scaleX(1)";
      return;
    }

    let shown = -1;
    let popped = false;

    return scrub.subscribe((raw) => {
      const progress = Math.min(1, Math.max(0, raw));

      // Growth is linear with the scrub, so the number tracks the assembly
      // rather than easing away from it.
      grow.style.transform = `scale(${1 + progress * (MAX_SCALE - 1)})`;

      const next = progress >= COMPLETE_AT ? 99.9 : Math.round(progress * 999) / 10;
      if (next !== shown) {
        value.textContent = next.toFixed(1).padStart(4, "0");
        bar.style.transform = `scaleX(${progress})`;
        shown = next;
      }

      if (!popped && progress >= COMPLETE_AT) {
        popped = true;
        if (pop) {
          // Restart the keyframe even if the class is already present.
          pop.classList.remove("v4-hud-pop");
          void pop.offsetWidth;
          pop.classList.add("v4-hud-pop");
        }
      } else if (popped && progress < REARM_AT) {
        popped = false;
        pop?.classList.remove("v4-hud-pop");
      }
    });
  }, [scrub, reduced]);

  return (
    <div
      ref={boxRef}
      className="fixed z-40 hidden select-none sm:block"
      style={{
        insetBlockStart: "5.5rem",
        insetInlineEnd: "1.5rem",
        transition: "opacity 0.45s ease",
      }}
      aria-hidden="true"
    >
      <div
        className="px-3 py-2.5"
        style={{
          background: "rgba(255,255,255,0.72)",
          border: "1px solid var(--line)",
          borderRadius: "12px",
          backdropFilter: "blur(6px)",
        }}
      >
        {/* Label holds its size while the number grows past it. */}
        <div className="v4-eyebrow" style={{ fontSize: "0.6rem" }}>
          {t.hero.hudLabel}
        </div>

        {/* Reserved at the 2x size from first paint: the glyphs scale inside
            this box, so nothing around them ever moves. */}
        <div ref={popRef} className="v4-hud-slot">
          <div ref={growRef} className="v4-hud-grow">
            <span ref={valueRef} className="v4-num v4-hud-value">
              00.0
            </span>
            <span className="v4-num v4-hud-pct">%</span>
          </div>
        </div>

        <div
          className="mt-2 h-px w-24 overflow-hidden rounded-full"
          style={{ background: "var(--line)" }}
        >
          <span
            ref={barRef}
            className="v4-bar block h-full w-full"
            style={{ background: "var(--rose)", transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
