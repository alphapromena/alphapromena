import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "@/content/locale";
import { usePrefersReducedMotion, useMaxWidth } from "./use-motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The five build stops. On desktop the section pins and the stops travel
 * along the reading direction with a rose progress line tracking position,
 * so the sequence is felt rather than just listed. Narrow viewports and
 * reduced motion get the same content as an ordinary vertical list.
 */
export function BuildRail() {
  const t = useContent();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const narrow = useMaxWidth(1023);
  const horizontal = !reduced && !narrow;
  const rtl = t.dir === "rtl";

  useEffect(() => {
    if (!horizontal) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Lenis drives scroll from its own rAF loop, so nudge ScrollTrigger every
    // frame rather than relying solely on scroll events.
    const update = () => ScrollTrigger.update();
    gsap.ticker.add(update);

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
      gsap.to(track, {
        // In RTL the track starts at the right edge and travels the other way,
        // so the same scroll gesture still advances through the stops.
        x: () => (rtl ? distance() : -distance()),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (lineRef.current) {
              lineRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [horizontal, rtl]);

  const pillars = (
    <div className="mt-14 grid gap-6 md:grid-cols-3">
      {t.build.pillars.items.map((pillar) => (
        <div key={pillar.title} className="v4-card h-full p-7">
          <h4 className="v4-display text-[1.15rem]">{pillar.title}</h4>
          <p className="v4-body mt-3 text-[0.92rem]">{pillar.body}</p>
        </div>
      ))}
    </div>
  );

  if (!horizontal) {
    return (
      <section id="build" className="px-6 py-24 sm:py-32 lg:px-10" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="mx-auto w-full max-w-[1300px]">
          <p className="v4-eyebrow">{t.build.eyebrow}</p>
          <h2 className="v4-display mt-6" style={{ fontSize: "clamp(2rem, 7vw, 3.2rem)" }}>
            {t.build.heading}
          </h2>
          <p className="v4-lead mt-6">{t.build.intro}</p>
          <ol className="mt-12">
            {t.build.stops.map((stop) => (
              <li key={stop.index} className="v4-rule py-7">
                <span className="v4-num text-sm" style={{ color: "var(--rose)" }}>
                  {stop.index}
                </span>
                <h3 className="v4-display mt-2 text-[1.4rem]">{stop.title}</h3>
                <p className="v4-body mt-2 text-[0.95rem]">{stop.body}</p>
              </li>
            ))}
          </ol>
          <h3 className="v4-display mt-14 text-[1.4rem]">{t.build.pillars.heading}</h3>
          {pillars}
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="build"
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{ height: "100svh", borderTop: "1px solid var(--line)" }}
      >
        <div className="flex h-full flex-col justify-center">
          <div className="mx-auto w-full max-w-[1300px] px-10">
            <p className="v4-eyebrow">{t.build.eyebrow}</p>
            <h2 className="v4-display mt-5" style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)" }}>
              {t.build.heading}
            </h2>
            <p className="v4-lead mt-5">{t.build.intro}</p>
            <div className="mt-8 h-px w-full overflow-hidden" style={{ background: "var(--line)" }}>
              <span
                ref={lineRef}
                className="v4-bar block h-full w-full"
                style={{ background: "var(--rose)", transform: "scaleX(0)" }}
              />
            </div>
          </div>

          <ol ref={trackRef} className="mt-12 flex w-max gap-6 ps-10 pe-24">
            {t.build.stops.map((stop) => (
              <li key={stop.index} className="v4-card flex h-[16rem] w-[22rem] shrink-0 flex-col p-8">
                <span className="v4-num text-[2.8rem] leading-none" style={{ color: "var(--rose)" }}>
                  {stop.index}
                </span>
                <h3 className="v4-display mt-auto text-[1.5rem]">{stop.title}</h3>
                <p className="v4-body mt-3 text-[0.92rem]">{stop.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-10">
        <div className="mx-auto w-full max-w-[1300px]">
          <h3 className="v4-display text-[1.6rem]">{t.build.pillars.heading}</h3>
          {pillars}
        </div>
      </section>
    </>
  );
}
