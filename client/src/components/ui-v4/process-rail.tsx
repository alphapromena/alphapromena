import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion, useMaxWidth } from "./use-motion";

gsap.registerPlugin(ScrollTrigger);

export type ProcessStep = { step: string; label: string; desc: string };

/** "STEP 04" reads as an instruction in prose but as a numeral on the card. */
const numeral = (step: string) => step.replace(/^STEP\s+/i, "");

/**
 * The six engagement stages. On desktop the section pins and the stages
 * travel sideways with a rose progress line tracking position, so the
 * sequence is felt rather than just listed. Narrow viewports and reduced
 * motion get the same content as an ordinary vertical list.
 */
export function ProcessRail({ steps }: { steps: ProcessStep[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const narrow = useMaxWidth(1023);
  const horizontal = !reduced && !narrow;

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
        x: () => -distance(),
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
  }, [horizontal]);

  if (!horizontal) {
    return (
      <section
        id="process"
        className="px-6 py-24 sm:py-32 lg:px-10"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <div className="mx-auto w-full max-w-[1300px]">
          <div className="v4-eyebrow mb-8">How we work</div>
          <h2 className="v4-display" style={{ fontSize: "clamp(2.4rem, 9vw, 4rem)" }}>
            A structured <span className="v4-rose">engagement.</span>
          </h2>
          <ol className="mt-12">
            {steps.map((step) => (
              <li key={step.step} className="py-7" style={{ borderTop: "1px solid var(--line)" }}>
                <span className="v4-num text-sm" style={{ color: "var(--rose)" }}>
                  {step.step}
                </span>
                <h3 className="v4-display mt-2 text-[1.5rem]">{step.label}</h3>
                <p className="v4-body mt-2 text-[0.95rem]">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: "100svh", borderTop: "1px solid var(--line)" }}
    >
      <div className="flex h-full flex-col justify-center">
        <div className="mx-auto w-full max-w-[1300px] px-10">
          <div className="v4-eyebrow mb-6">How we work</div>
          <h2 className="v4-display" style={{ fontSize: "clamp(2.6rem, 5vw, 4.4rem)" }}>
            A structured <span className="v4-rose">engagement.</span>
          </h2>
          <div
            className="mt-8 h-px w-full overflow-hidden"
            style={{ background: "rgba(243,242,241,0.12)" }}
          >
            <span
              ref={lineRef}
              className="block h-full w-full origin-left"
              style={{ background: "var(--rose)", transform: "scaleX(0)" }}
            />
          </div>
        </div>

        <ol ref={trackRef} className="mt-14 flex w-max gap-8 pl-10 pr-24">
          {steps.map((step) => (
            <li
              key={step.step}
              className="flex h-[18rem] w-[24rem] shrink-0 flex-col p-9"
              style={{ border: "1px solid var(--line)", background: "rgba(243,242,241,0.02)" }}
            >
              <span className="v4-num text-[3.2rem] leading-none" style={{ color: "var(--rose)" }}>
                {numeral(step.step)}
              </span>
              <h3 className="v4-display mt-auto text-[1.7rem]">{step.label}</h3>
              <p className="v4-body mt-3 text-[0.95rem]">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
