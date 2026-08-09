import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "./use-motion";

let lenis: Lenis | null = null;

/**
 * Scrolls to a section by id, routed through Lenis when it is running so the
 * easing matches the rest of the page. Falls back to a native jump when
 * smooth scrolling is off, which is also the reduced-motion path.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.1 });
  } else {
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }
}

/**
 * Mounts Lenis smooth scrolling for the v4 page. Skipped entirely under
 * reduced motion, where the browser's own scrolling is the correct behaviour.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 1.4,
    });
    lenis = instance;
    // Exposed in dev only so browser-driven QA can jump to an exact scroll
    // position instead of fighting the smoothing with synthetic wheel events.
    if (import.meta.env.DEV) {
      (window as unknown as { __lenis?: Lenis }).__lenis = instance;
    }

    let frame = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      lenis = null;
    };
  }, [reduced]);

  return <>{children}</>;
}
