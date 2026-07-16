import { useEffect, useId, useRef, useState } from "react";

interface LineageThreadProps {
  /** Element ids the thread passes through, in document order. */
  waypoints: string[];
  /** Extend the path from the last waypoint to the bottom edge of the positioned parent. */
  exitBottom?: boolean;
  /** Draw the path in on mount (700ms). Ignored under prefers-reduced-motion. */
  drawIn?: boolean;
}

/** Vertical-biased cubic path through consecutive points. */
function buildPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dy = (b.y - a.y) / 2;
    d += ` C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
  }
  return d;
}

/**
 * The single brass thread of light. Renders as an SVG layer covering its
 * nearest positioned ancestor and routes a 1.5px brass line through the
 * given waypoint elements. Static in Phase 2; Phase 4 maps
 * stroke-dashoffset to scroll progress.
 */
export function LineageThread({ waypoints, exitBottom = true, drawIn = true }: LineageThreadProps) {
  const gradId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const drawnRef = useRef(false);
  const [geo, setGeo] = useState<{ d: string; w: number; h: number; origin: { x: number; y: number } | null }>({
    d: "",
    w: 0,
    h: 0,
    origin: null,
  });

  useEffect(() => {
    const svg = svgRef.current;
    const parent = svg?.parentElement;
    if (!svg || !parent) return;

    const compute = () => {
      const pr = parent.getBoundingClientRect();
      const pts = waypoints
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2 - pr.left, y: r.top + r.height / 2 - pr.top };
        });
      if (pts.length === 0) return;
      if (exitBottom) pts.push({ x: pts[pts.length - 1].x, y: pr.height });
      setGeo({ d: buildPath(pts), w: pr.width, h: pr.height, origin: pts[0] });
    };

    compute();

    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(compute, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [waypoints, exitBottom]);

  /* Draw-in: dashoffset animates from full length to 0, once. Resizes
     after the first draw re-render the path fully drawn. */
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !geo.d) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len = path.getTotalLength();

    if (!drawIn || reduceMotion || drawnRef.current) {
      path.style.transition = "none";
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
      return;
    }

    drawnRef.current = true;
    path.style.transition = "none";
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        path.style.transition = "stroke-dashoffset var(--dur-slow) var(--ease)";
        path.style.strokeDashoffset = "0";
      });
    });
  }, [geo.d, drawIn]);

  if (!geo.d) return <svg ref={svgRef} className="v2-thread" aria-hidden="true" />;

  return (
    <svg
      ref={svgRef}
      className="v2-thread"
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2={geo.h} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--brass-500)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--brass-500)" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path ref={pathRef} d={geo.d} stroke={`url(#${gradId})`} strokeWidth="1.5" />
      {geo.origin && <circle cx={geo.origin.x} cy={geo.origin.y} r="5" fill="var(--brass-500)" />}
    </svg>
  );
}
