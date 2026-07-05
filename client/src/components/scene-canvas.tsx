import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Persistent, scroll-reactive WebGL scene rendered on a fixed, full-viewport
 * transparent canvas that sits behind the whole page. A geodesic wireframe
 * sphere with a glowing rose core and an orbiting particle shell rotates,
 * drifts and dollies as the page scrolls, so it reads as one continuous 3D
 * object that travels with the reader. Light sections paint over it; dark
 * "window" bands are transparent and reveal it.
 *
 * - Pointer parallax + scroll-driven camera/rotation.
 * - Honors prefers-reduced-motion (single static frame).
 * - Pauses when the tab is hidden. Disposes all GPU resources on unmount.
 * - No-ops if WebGL is unavailable (a CSS glow fallback stays visible).
 */
export default function SceneCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    const width = () => window.innerWidth;
    const height = () => window.innerHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width(), height());
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width() / height(), 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const world = new THREE.Group();
    scene.add(world);

    const ROSE = 0xff1e57;
    const PAPER = 0xfbfaf8;

    // ── Geodesic wireframe sphere ───────────────────────────────────
    const sphereGeo = new THREE.IcosahedronGeometry(1.85, 2);
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(sphereGeo),
      new THREE.LineBasicMaterial({ color: PAPER, transparent: true, opacity: 0.18 }),
    );
    world.add(wire);

    const nodePositions = sphereGeo.attributes.position;
    const nodeColors: number[] = [];
    const rose = new THREE.Color(ROSE);
    const paper = new THREE.Color(PAPER);
    for (let i = 0; i < nodePositions.count; i++) {
      const c = i % 7 === 0 ? rose : paper;
      nodeColors.push(c.r, c.g, c.b);
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", nodePositions.clone());
    nodeGeo.setAttribute("color", new THREE.Float32BufferAttribute(nodeColors, 3));
    const nodes = new THREE.Points(
      nodeGeo,
      new THREE.PointsMaterial({ size: 0.055, vertexColors: true, transparent: true, opacity: 0.9, sizeAttenuation: true }),
    );
    world.add(nodes);

    // ── Glowing rose core ───────────────────────────────────────────
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.34, 1),
      new THREE.MeshBasicMaterial({ color: ROSE }),
    );
    world.add(core);

    const glowTex = makeGlowTexture();
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glowTex, color: ROSE, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    glow.scale.set(4.4, 4.4, 1);
    world.add(glow);

    // ── Orbiting particle shell ─────────────────────────────────────
    const COUNT = 640;
    const pPos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.5 + Math.random() * 1.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: PAPER, size: 0.028, transparent: true, opacity: 0.5, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    scene.add(particles);

    world.rotation.set(0.35, 0.4, 0);

    // ── Pointer parallax ────────────────────────────────────────────
    const target = { x: 0.4, y: 0.35 };
    const cur = { x: 0.4, y: 0.35 };
    const onPointer = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.x = 0.4 + ny * 0.22;
      target.y = 0.4 + nx * 0.4;
    };
    if (!reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true });

    // ── Scroll progress (0 at top → 1 at bottom) ───────────────────
    let scrollP = 0;
    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollP = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    };
    readScroll();
    window.addEventListener("scroll", readScroll, { passive: true });

    // ── Render loop ─────────────────────────────────────────────────
    let raf = 0;
    const clock = new THREE.Clock();

    const renderFrame = () => {
      const t = clock.getElapsedTime();
      cur.x += (target.x - cur.x) * 0.05;
      cur.y += (target.y - cur.y) * 0.05;
      // scroll drives extra rotation, a downward drift and a slow dolly-out
      world.rotation.x = cur.x + scrollP * 0.6;
      world.rotation.y = cur.y + t * 0.07 + scrollP * 1.4;
      world.position.y = -scrollP * 1.6;
      camera.position.z = 6.2 + scrollP * 1.6;
      particles.rotation.y = -t * 0.03;
      particles.rotation.x = t * 0.02 + scrollP * 0.4;
      particles.position.y = -scrollP * 1.6;
      const pulse = 1 + Math.sin(t * 1.6) * 0.06;
      core.scale.setScalar(pulse);
      glow.material.opacity = 0.7 + Math.sin(t * 1.6) * 0.14;
      renderer.render(scene, camera);
    };

    let running = false;
    const loop = () => { renderFrame(); raf = requestAnimationFrame(loop); };
    const start = () => { if (!running) { running = true; clock.start(); raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };

    if (reduceMotion) renderFrame();
    else start();

    const onVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) stop(); else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      camera.aspect = width() / height();
      camera.updateProjectionMatrix();
      renderer.setSize(width(), height());
      readScroll();
      if (reduceMotion) renderFrame();
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", onResize);
      sphereGeo.dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
      nodeGeo.dispose();
      (nodes.material as THREE.Material).dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      glowTex.dispose();
      (glow.material as THREE.Material).dispose();
      particleGeo.dispose();
      (particles.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}

/** Radial-gradient sprite texture for the additive core bloom. */
function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,120,160,0.85)");
  g.addColorStop(0.6, "rgba(255,30,87,0.25)");
  g.addColorStop(1, "rgba(255,30,87,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.Texture(canvas);
  tex.needsUpdate = true;
  return tex;
}
