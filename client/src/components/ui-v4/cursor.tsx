import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./use-motion";

/**
 * Rose dot that tracks the pointer exactly, plus a ring that lags behind it
 * and swells over interactive elements. Mounted only for fine pointers, and
 * never under reduced motion. Positions are written straight to transforms
 * inside rAF so React never re-renders on pointer movement.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { ...target };
    let frame = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      const interactive = (e.target as Element | null)?.closest(
        "a, button, input, textarea, select, [role='button']",
      );
      ring.dataset.active = interactive ? "true" : "false";
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      trail.x += (target.x - trail.x) * 0.16;
      trail.y += (target.y - trail.y) * 0.16;
      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    dot.style.opacity = "0";
    ring.style.opacity = "0";
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <>
      <div ref={dotRef} className="v4-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="v4-cursor-ring" aria-hidden="true" />
    </>
  );
}
