import { useCallback, useEffect, useId, useRef, useState } from "react";

interface LineageThreadProps {
  /** Element ids the thread passes through, in document order. */
  waypoints: string[];
  /** Fired once per waypoint when it passes the viewport trigger line. */
  onActivate?: (id: string) => void;
}

/** Thread head leads the viewport center by this fraction of the viewport. */
const LEAD_RATIO = 0.12;
const INTRO_MS = 700;

type Pt = { id: string; x: number; y: number };

/** Vertical-biased cubic path through consecutive points (monotonic in y). */
function buildPath(pts: Pt[]) {
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
 * The single brass thread of light (§2.4). A position-fixed SVG layer:
 * the path lives in document coordinates inside a group translated by
 * -scrollY, so tracking scroll is a pure transform. Draw progress maps
 * stroke-dashoffset to a trigger line slightly ahead of viewport center
 * via a precomputed length↔y lookup. The hero load draw (700ms) is the
 * same system's intro tween, so scroll wiring cannot fight it.
 *
 * prefers-reduced-motion: rendered fully drawn, every waypoint activated
 * on load, no intro and no dashoffset mapping (scroll still updates the
 * translate, which is positioning, not animation).
 */
export function LineageThread({ waypoints, onActivate }: LineageThreadProps) {
  const gradId = useId();
  const gRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [origin, setOrigin] = useState<Pt | null>(null);
  const [originOn, setOriginOn] = useState(false);

  const onActivateRef = useRef(onActivate);
  onActivateRef.current = onActivate;
  const waypointsKey = waypoints.join(",");
  const getWaypoints = useCallback(() => waypointsKey.split(","), [waypointsKey]);

  useEffect(() => {
    const g = gRef.current;
    const path = pathRef.current;
    if (!g || !path) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ids = getWaypoints();

    let pts: Pt[] = [];
    let totalLen = 0;
    let samples: { len: number; y: number }[] = [];
    let introLen = 0; // floor: the intro never visually retracts
    let introDone = reduceMotion;
    const activated = new Set<string>();
    let rafUpdate = 0;
    let rafIntro = 0;
    let pending = false;
    let resizeTimer = 0;

    /* ── Layout measurement (only on mount / resize / reflow) ────── */
    const measure = (): boolean => {
      const sy = window.scrollY;
      pts = ids
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { id, x: r.left + r.width / 2, y: r.top + r.height / 2 + sy };
        })
        .filter((p): p is Pt => p !== null);
      if (pts.length < 2) return false;

      path.setAttribute("d", buildPath(pts));
      totalLen = path.getTotalLength();

      /* length↔y lookup so per-frame mapping never touches the DOM */
      samples = [];
      const step = Math.max(8, totalLen / 600);
      for (let l = 0; l < totalLen; l += step) samples.push({ len: l, y: path.getPointAtLength(l).y });
      samples.push({ len: totalLen, y: path.getPointAtLength(totalLen).y });

      const hero = document.getElementById("hero");
      const heroBottom = hero
        ? hero.getBoundingClientRect().bottom + sy
        : pts[0].y + window.innerHeight * 0.4;
      introLen = lenAtY(heroBottom);

      setOrigin(pts[0]);
      return true;
    };

    const lenAtY = (y: number): number => {
      if (samples.length === 0) return 0;
      if (y <= samples[0].y) return 0;
      if (y >= samples[samples.length - 1].y) return totalLen;
      let lo = 0;
      let hi = samples.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (samples[mid].y < y) lo = mid + 1;
        else hi = mid;
      }
      return samples[lo].len;
    };

    const triggerY = () => window.scrollY + window.innerHeight * (0.5 + LEAD_RATIO);

    /* ── Per-frame work: transform + dashoffset + set lookups only ── */
    const applyDrawn = (drawnLen: number) => {
      path.style.strokeDasharray = `${totalLen}`;
      path.style.strokeDashoffset = `${Math.max(totalLen - drawnLen, 0)}`;
    };

    const checkActivations = (tY: number) => {
      for (const p of pts) {
        if (!activated.has(p.id) && p.y <= tY) {
          activated.add(p.id);
          if (p.id === ids[0]) setOriginOn(true);
          onActivateRef.current?.(p.id);
        }
      }
    };

    const update = () => {
      pending = false;
      g.setAttribute("transform", `translate(0, ${-window.scrollY})`);
      if (reduceMotion) {
        path.style.strokeDasharray = "none";
        path.style.strokeDashoffset = "0";
        checkActivations(Infinity);
        return;
      }
      if (!introDone) return; // the intro tween owns dashoffset until it finishes
      const tY = triggerY();
      applyDrawn(Math.max(introLen, lenAtY(tY)));
      checkActivations(tY);
    };

    const requestUpdate = () => {
      if (!pending) {
        pending = true;
        rafUpdate = requestAnimationFrame(update);
      }
    };

    /* ── Hero intro: draw origin → hero exit over 700ms, then hand off ── */
    const runIntro = () => {
      setOriginOn(true);
      const target = Math.max(introLen, lenAtY(triggerY()));
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - t0) / INTRO_MS, 1);
        applyDrawn(target * easeOut(t));
        if (t < 1) {
          rafIntro = requestAnimationFrame(tick);
        } else {
          introDone = true;
          requestUpdate();
        }
      };
      applyDrawn(0);
      rafIntro = requestAnimationFrame(tick);
    };

    if (measure()) {
      if (reduceMotion) update();
      else {
        g.setAttribute("transform", `translate(0, ${-window.scrollY})`);
        runIntro();
      }
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });

    /* Reflow sources (resize, accordion toggles, async content) change
       waypoint positions — re-measure, debounced, keeping draw state. */
    const recompute = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (measure()) requestUpdate();
      }, 150);
    };
    window.addEventListener("resize", recompute);
    const ro = new ResizeObserver(recompute);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(rafUpdate);
      cancelAnimationFrame(rafIntro);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", recompute);
      ro.disconnect();
    };
  }, [getWaypoints]);

  return (
    <svg className="v2-thread" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--brass-500)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--brass-500)" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <g ref={gRef}>
        <path ref={pathRef} fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" />
        {origin && (
          <circle
            cx={origin.x}
            cy={origin.y}
            r="5"
            fill="var(--brass-500)"
            style={{ opacity: originOn ? 1 : 0, transition: "opacity var(--dur-fast) var(--ease)" }}
          />
        )}
        {origin && originOn && (
          <circle
            className="v2-thread-pulse"
            cx={origin.x}
            cy={origin.y}
            r="6"
            fill="none"
            stroke="var(--brass-500)"
            strokeWidth="1.5"
          />
        )}
      </g>
    </svg>
  );
}
