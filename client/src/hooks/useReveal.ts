import { useEffect, useRef } from "react";

/**
 * Scroll-reveal driver (Round 28.2). Attach the returned ref to a
 * container; when ~20% of it enters the viewport the container gains
 * .is-revealed, once, and descendants styled with .reveal-up /
 * .reveal-fade / .reveal-scale transition in (staggered via
 * --reveal-delay). Under prefers-reduced-motion the class is applied
 * immediately and the CSS renders everything instantly.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.2) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return ref;
}
