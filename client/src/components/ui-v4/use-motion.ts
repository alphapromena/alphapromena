import { useEffect, useState } from "react";

/**
 * Tracks the user's reduced-motion preference and keeps tracking it, so
 * flipping the OS setting takes effect without a reload. Every scrub, pin,
 * and autoplay in the v4 layer gates on this.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** True once the viewport is at or below the given breakpoint. */
export function useMaxWidth(px: number): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${px}px)`).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${px}px)`);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [px]);

  return matches;
}

/**
 * Scroll progress of an element through the viewport, 0 at the moment its top
 * hits the top of the viewport and 1 once it has been scrolled all the way
 * through. Used by every pinned section. Reads layout inside rAF only.
 */
export function pinProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const travel = rect.height - window.innerHeight;
  if (travel <= 0) return 0;
  return Math.min(1, Math.max(0, -rect.top / travel));
}
