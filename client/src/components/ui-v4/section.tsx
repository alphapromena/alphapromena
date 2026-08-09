import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "./use-motion";

/**
 * Standard section shell: consistent rhythm, a hairline rule, and a single
 * quiet reveal as it enters the viewport. Reveals are opt-out under reduced
 * motion, where content is simply present from the start.
 */
export function Section({
  id,
  eyebrow,
  children,
  className = "",
  rule = true,
}: {
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  rule?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative py-24 sm:py-32 lg:py-40 ${className}`}
      style={rule ? { borderTop: "1px solid var(--line)" } : undefined}
    >
      <div className="mx-auto w-full max-w-[1300px] px-6 lg:px-10">
        {eyebrow && (
          <Reveal>
            <div className="v4-eyebrow mb-10">{eyebrow}</div>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/** Fades and lifts its child once, the first time it enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "li" | "span";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translate3d(0, 22px, 0)",
        transition: reduced
          ? "none"
          : `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
