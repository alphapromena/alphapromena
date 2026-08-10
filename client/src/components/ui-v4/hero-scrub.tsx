import { useEffect, useRef, type ReactNode } from "react";
import { pinProgress, usePrefersReducedMotion } from "./use-motion";
import type { Scrub } from "./scrub";

type Manifest = {
  count: number;
  width: number;
  height: number;
  fps: number;
  ext: string;
};

const MANIFEST_URL = "/cinema/hero/manifest.json";
const SOURCES_URL = "/cinema/sources.json";
const POSTER_START = "/cinema/hero/poster-start.jpg";
const POSTER_END = "/cinema/hero/poster-end.jpg";

/** Frames pulled per idle slice while the rest streams in. */
const IDLE_CHUNK = 6;

/**
 * How many frames to decode up front. Each is roughly 77 KB, so twenty of
 * them is about 1.5 MB of eager transfer: right on a desktop connection,
 * wasteful on a phone. The poster underneath covers the opening frame either
 * way, and the draw step falls back to the nearest decoded frame, so a
 * smaller head start costs smoothness only in the first moments of the pin.
 */
function eagerFrameCount(mobile: boolean): number {
  const connection = (navigator as any).connection;
  if (connection?.saveData) return 5;
  if (/(^|-)2g$/.test(connection?.effectiveType ?? "")) return 5;
  if (connection?.effectiveType === "3g") return 8;
  return mobile ? 10 : 20;
}

const frameUrl = (i: number, ext: string) =>
  `/cinema/hero/frame_${String(i + 1).padStart(3, "0")}.${ext}`;

const idle: (cb: () => void) => number =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? (cb) => (window as any).requestIdleCallback(cb, { timeout: 400 })
    : (cb) => window.setTimeout(cb, 32);

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`frame failed: ${src}`));
    img.src = src;
  });
}

/**
 * Last-resort path when the optimized frame sequence is absent: stream the
 * raw clip once, seek through it, and keep the decoded frames in memory.
 * Scrubbing a <video> by currentTime directly stutters badly, so the video is
 * only ever used as a frame source, never as the thing being scrubbed.
 */
async function framesFromVideo(url: string, count: number): Promise<ImageBitmap[]> {
  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = url;

  await new Promise<void>((resolve, reject) => {
    video.addEventListener("loadedmetadata", () => resolve(), { once: true });
    video.addEventListener("error", () => reject(new Error("clip failed")), { once: true });
  });

  const frames: ImageBitmap[] = [];
  for (let i = 0; i < count; i++) {
    video.currentTime = (i / (count - 1)) * video.duration * 0.995;
    await new Promise<void>((resolve) =>
      video.addEventListener("seeked", () => resolve(), { once: true }),
    );
    frames.push(await createImageBitmap(video));
  }
  return frames;
}

/** Draws a source cover-fit into the canvas, centred, no distortion. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  src: CanvasImageSource,
  sw: number,
  sh: number,
  cw: number,
  ch: number,
) {
  const scale = Math.max(cw / sw, ch / sh);
  const w = sw * scale;
  const h = sh * scale;
  ctx.drawImage(src, (cw - w) / 2, (ch - h) / 2, w, h);
}

export function HeroScrub({
  scrub,
  children,
}: {
  /** Published once per rendered frame so the HUD shares this exact tick. */
  scrub: Scrub;
  children?: ReactNode;
}) {
  const pinRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    // Reduced motion: hold the finished lattice, publish full progress so the
    // HUD reads its settled value, and never start a rAF loop.
    if (reduced) {
      scrub.set(1);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Low-memory devices get the poster with a gentle parallax instead of a
    // few hundred decoded frames they cannot hold.
    const lowMemory = (navigator as any).deviceMemory
      ? (navigator as any).deviceMemory < 4
      : false;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    let frames: (CanvasImageSource | undefined)[] = [];
    let sourceW = 1280;
    let sourceH = 720;
    let disposed = false;
    let raf = 0;
    let lastDrawn = -1;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        lastDrawn = -1;
      }
    };

    /** Nearest decoded frame at or below the target, else the nearest above. */
    const resolveFrame = (target: number) => {
      for (let i = target; i >= 0; i--) if (frames[i]) return i;
      for (let i = target + 1; i < frames.length; i++) if (frames[i]) return i;
      return -1;
    };

    const render = () => {
      if (disposed) return;
      const progress = pinProgress(pin);
      // Publish before drawing, so subscribers and the canvas agree on the
      // value within a single frame.
      scrub.set(progress);

      if (frames.length) {
        sizeCanvas();
        const target = Math.round(progress * (frames.length - 1));
        const index = resolveFrame(target);
        if (index >= 0 && index !== lastDrawn) {
          const frame = frames[index]!;
          ctx.fillStyle = "#F3F2F1";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawCover(ctx, frame, sourceW, sourceH, canvas.width, canvas.height);
          lastDrawn = index;
        }
      } else if (posterRef.current) {
        posterRef.current.style.transform = `translate3d(0, ${progress * -6}%, 0) scale(1.08)`;
      }

      raf = requestAnimationFrame(render);
    };

    const startFrames = async () => {
      if (lowMemory) return; // poster + parallax path

      let manifest: Manifest | null = null;
      try {
        const res = await fetch(MANIFEST_URL);
        if (res.ok) manifest = (await res.json()) as Manifest;
      } catch {
        manifest = null;
      }

      if (manifest) {
        sourceW = manifest.width;
        sourceH = manifest.height;
        // Halving the sequence on phones halves peak memory; the scrub still
        // advances several frames per flick so nothing reads as stepped.
        const indices = mobile
          ? Array.from({ length: Math.ceil(manifest.count / 2) }, (_, i) => i * 2)
          : Array.from({ length: manifest.count }, (_, i) => i);

        frames = new Array(indices.length);

        const eagerCount = eagerFrameCount(mobile);
        const eager = indices.slice(0, eagerCount);
        await Promise.all(
          eager.map(async (srcIndex, slot) => {
            try {
              frames[slot] = await loadImage(frameUrl(srcIndex, manifest!.ext));
            } catch {
              /* a dropped frame just resolves to its neighbour */
            }
          }),
        );

        let cursor = eagerCount;
        const streamNext = () => {
          if (disposed || cursor >= indices.length) return;
          const slice = indices.slice(cursor, cursor + IDLE_CHUNK);
          const base = cursor;
          cursor += IDLE_CHUNK;
          Promise.all(
            slice.map(async (srcIndex, k) => {
              try {
                frames[base + k] = await loadImage(frameUrl(srcIndex, manifest!.ext));
              } catch {
                /* ignore */
              }
            }),
          ).then(() => idle(streamNext));
        };
        idle(streamNext);
        return;
      }

      // No optimized sequence on disk: rebuild one from the source clip.
      try {
        const res = await fetch(SOURCES_URL);
        if (!res.ok) return;
        const sources = (await res.json()) as { heroClip: string };
        const bitmaps = await framesFromVideo(sources.heroClip, mobile ? 64 : 120);
        if (disposed) {
          bitmaps.forEach((b) => b.close());
          return;
        }
        sourceW = bitmaps[0].width;
        sourceH = bitmaps[0].height;
        frames = bitmaps;
      } catch {
        /* stays on the poster */
      }
    };

    sizeCanvas();
    const onResize = () => sizeCanvas();
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(render);
    void startFrames();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      frames.forEach((f) => {
        if (typeof ImageBitmap !== "undefined" && f instanceof ImageBitmap) f.close();
      });
      frames = [];
    };
  }, [scrub, reduced]);

  return (
    <section
      id="hero"
      ref={pinRef}
      className="relative"
      style={{ height: reduced ? "100svh" : "300vh" }}
    >
      <div className="sticky top-0 overflow-hidden" style={{ height: "100svh" }}>
        {/* The canvas box is reserved before any frame decodes, so the hero
            never shifts layout as assets arrive. */}
        <div className="absolute inset-0" style={{ background: "var(--paper)" }}>
          <img
            ref={posterRef}
            src={reduced ? POSTER_END : POSTER_START}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ willChange: "transform" }}
          />
          {!reduced && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            />
          )}
        </div>

        <div className="v4-vignette" />
        <div className="v4-hero-scrim" />

        {children}
      </div>
    </section>
  );
}
