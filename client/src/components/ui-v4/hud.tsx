import { useEffect, useRef, type MutableRefObject } from "react";

/**
 * Fixed readout that climbs from 00.0 to 99.9 in lockstep with the hero
 * scrub, so the abstract footage reads as a measurable outcome. Values are
 * written straight to the DOM inside rAF, never through React state, so the
 * page does not re-render sixty times a second while scrolling.
 */
export function Hud({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

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
    const bar = barRef.current;
    if (!value || !bar) return;

    let raf = 0;
    let shown = -1;

    const tick = () => {
      const progress = Math.min(1, Math.max(0, progressRef.current));
      const next = Math.round(progress * 999) / 10;
      if (next !== shown) {
        value.textContent = next.toFixed(1).padStart(4, "0");
        bar.style.transform = `scaleX(${progress})`;
        shown = next;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div
      ref={boxRef}
      className="fixed right-5 z-40 hidden select-none sm:block lg:right-8"
      style={{ top: "5.5rem", transition: "opacity 0.45s ease" }}
      aria-hidden="true"
    >
      <div
        className="px-3 py-2.5"
        style={{
          background: "rgba(11,12,13,0.42)",
          border: "1px solid var(--line)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="v4-eyebrow" style={{ fontSize: "0.6rem" }}>
          Data quality
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <span ref={valueRef} className="v4-num text-[1.6rem] leading-none">
            00.0
          </span>
          <span className="v4-num text-[0.8rem]" style={{ color: "var(--rose)" }}>
            %
          </span>
        </div>
        <div
          className="mt-2 h-px w-24 overflow-hidden"
          style={{ background: "rgba(243,242,241,0.14)" }}
        >
          <span
            ref={barRef}
            className="block h-full w-full origin-left"
            style={{ background: "var(--rose)", transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
