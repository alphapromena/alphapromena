import { useEffect, useRef } from "react";
import { pinProgress, usePrefersReducedMotion } from "./use-motion";



const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/**
 * Three viewport-filling word slams driven by scroll position. Each word owns
 * a third of the pin: it rises in, holds while the reader sits on it, then
 * clears for the next. The closing word never leaves, so the section hands off
 * on a held frame rather than an empty screen.
 */
export function KineticManifesto({ words }: { words: readonly [string, string, string] }) {
  // Middle word carries the accent.
  const WORDS = words.map((text, i) => ({ text, rose: i === 1 }));
  const pinRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const pin = pinRef.current;
    if (!pin) return;

    let raf = 0;
    const tick = () => {
      const progress = pinProgress(pin);

      WORDS.forEach((_, i) => {
        const el = wordRefs.current[i];
        if (!el) return;

        const local = clamp01(progress * WORDS.length - i);
        const isLast = i === WORDS.length - 1;

        // A short entrance and a late exit leave a long fully-opaque hold in
        // the middle, so each word lands as a statement rather than a crossfade.
        const enter = easeOut(clamp01(local / 0.2));
        // The final word holds through the end of the pin.
        const exit = isLast ? 0 : easeOut(clamp01((local - 0.84) / 0.16));

        const opacity = enter * (1 - exit);
        const y = (1 - enter) * 46 - exit * 34;

        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0, ${y}px, 0)`;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, words]);

  if (reduced) {
    return (
      <section
        id="manifesto"
        className="px-6 py-32 lg:px-10"
        style={{ borderTop: "1px solid var(--line)" }}
      >
        <div className="mx-auto flex max-w-[1300px] flex-col gap-4">
          {WORDS.map((word) => (
            <h2
              key={word.text}
              className="v4-display"
              style={{
                fontSize: "clamp(3rem, 11vw, 9rem)",
                color: word.rose ? "var(--rose)" : "var(--ink)",
              }}
            >
              {word.text}
            </h2>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="manifesto"
      ref={pinRef}
      className="relative"
      style={{ height: "300vh", borderTop: "1px solid var(--line)" }}
    >
      <div
        className="sticky top-0 flex items-center justify-center overflow-hidden px-6 lg:px-10"
        style={{ height: "100svh" }}
      >
        <h2 className="sr-only">{words.join(" ")}</h2>
        <div className="relative grid w-full max-w-[1300px] place-items-center">
          {WORDS.map((word, i) => (
            <span
              key={word.text}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              aria-hidden="true"
              className="v4-display col-start-1 row-start-1 text-center"
              style={{
                fontSize: "clamp(3rem, 11vw, 9rem)",
                color: word.rose ? "var(--rose)" : "var(--ink)",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            >
              {word.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
