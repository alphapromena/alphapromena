import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "./use-motion";

/**
 * Full-width section backed by a looping clip. The video is only attached to
 * the DOM once the band is near the viewport, so neither loop competes with
 * the hero frames for bandwidth on load. Under reduced motion the poster
 * stands in and nothing ever plays.
 */
export function VideoBand({
  id,
  src,
  poster,
  children,
  scrim = 0.72,
  className = "",
}: {
  id?: string;
  src: string;
  poster?: string;
  children: ReactNode;
  /** 0 to 1: how far the footage is pushed back behind the copy. */
  scrim?: number;
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      // Autoplay can still be refused; the poster underneath covers that.
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative overflow-hidden py-24 sm:py-32 lg:py-40 ${className}`}
      style={{ background: "var(--paper)", borderTop: "1px solid var(--line)" }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {poster && (
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        {!reduced && active && (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0" style={{ background: `rgba(243,242,241,${scrim})` }} />
        <div className="v4-vignette" />
      </div>

      <div className="relative mx-auto w-full max-w-[1300px] px-6 lg:px-10">{children}</div>
    </section>
  );
}
