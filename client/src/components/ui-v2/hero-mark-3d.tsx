import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/**
 * The Alpha Pro MENA brand mark as interactive 3D (Round 28.1).
 * Geometry is extruded at runtime from the official SVG in
 * /brand/logo-mark.svg — rose glass and charcoal ceramic materials,
 * idle float, damped pointer-follow tilt from anywhere on the page.
 *
 * This module is the ONLY place three/R3F/drei are imported, and it is
 * always loaded via React.lazy, so the 3D stack lives in its own chunk.
 */

const ROSE_MAT = new THREE.MeshPhysicalMaterial({
  color: "#FF1E57",
  roughness: 0.12,
  clearcoat: 1,
  clearcoatRoughness: 0.15,
});
const CHARCOAL_MAT = new THREE.MeshPhysicalMaterial({
  color: "#313234",
  roughness: 0.3,
  metalness: 0.1,
  clearcoat: 0.6,
});

const TILT_MAX = 0.35;
const TILT_LERP = 0.08;
const TARGET_WIDTH = 3.1; // ~80% of the visible stage width at z=6.2/fov 35

function Mark() {
  const svg = useLoader(SVGLoader, "/brand/logo-mark.svg");
  const rig = useRef<THREE.Group>(null);
  const tilt = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });
  const entrance = useRef(0);

  const { items, scale } = useMemo(() => {
    const items = svg.paths.map((p) => {
      const shapes = SVGLoader.createShapes(p);
      const geom = new THREE.ExtrudeGeometry(shapes, {
        depth: 14,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 1.5,
        bevelSegments: 4,
        curveSegments: 24,
      });
      const style = (p.userData as { style?: { fill?: string } } | undefined)?.style;
      const fill = String(style?.fill ?? "").toLowerCase();
      return { geom, material: fill === "#ff1e57" ? ROSE_MAT : CHARCOAL_MAT };
    });

    /* Center the union bounding box at the origin, then scale to stage. */
    const box = new THREE.Box3();
    for (const { geom } of items) {
      geom.computeBoundingBox();
      box.union(geom.boundingBox!);
    }
    const center = box.getCenter(new THREE.Vector3());
    for (const { geom } of items) geom.translate(-center.x, -center.y, -center.z);
    const size = box.getSize(new THREE.Vector3());
    return { items, scale: TARGET_WIDTH / size.x };
  }, [svg]);

  /* Pointer-follow from anywhere on the page, clamped and damped. */
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      tilt.current.ty = THREE.MathUtils.clamp(nx * TILT_MAX, -TILT_MAX, TILT_MAX);
      tilt.current.tx = THREE.MathUtils.clamp(ny * TILT_MAX * 0.7, -TILT_MAX, TILT_MAX);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);

  useFrame(({ clock }, delta) => {
    const g = rig.current;
    if (!g) return;
    const t = clock.elapsedTime;

    /* Entrance: quick 0.92 → 1 scale (fade happens on the wrapper). */
    entrance.current = Math.min(entrance.current + delta / 0.6, 1);
    const ease = 1 - Math.pow(1 - entrance.current, 3);
    g.scale.setScalar(0.92 + 0.08 * ease);

    /* Idle float: slow y sine + gentle sway (~5s loop). */
    g.position.y = Math.sin(t * (Math.PI * 2) / 5) * 0.07;
    g.rotation.z = Math.sin(t * (Math.PI * 2) / 7.3) * 0.03;

    /* Damped lean toward the cursor. */
    const s = tilt.current;
    s.cx += (s.tx - s.cx) * TILT_LERP;
    s.cy += (s.ty - s.cy) * TILT_LERP;
    g.rotation.x = s.cx;
    g.rotation.y = s.cy + Math.sin(t * (Math.PI * 2) / 9) * 0.04;
  });

  return (
    <group ref={rig}>
      {/* negative y-scale corrects the SVG coordinate flip */}
      <group scale={[scale, -scale, scale]}>
        {items.map((it, i) => (
          <mesh key={i} geometry={it.geom} material={it.material} castShadow />
        ))}
      </group>
    </group>
  );
}

/**
 * Full 3D stage: procedural Lightformer environment (no HDR fetches, works
 * offline), contact shadows, capped dpr, and a frameloop that pauses when
 * the hero scrolls offscreen or the tab is hidden.
 */
export default function HeroMark3D({ onReady }: { onReady?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={rootRef} className="v3-stage-fill" aria-hidden="true">
      <Canvas
        frameloop={inView && tabVisible ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.2], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => onReady?.()}
      >
        <Mark />
        <directionalLight position={[4, 6, 6]} intensity={0.8} />
        <Environment resolution={256} frames={1}>
          {/* large soft white overhead */}
          <Lightformer intensity={2.4} position={[0, 5, 2]} rotation={[-Math.PI / 2.4, 0, 0]} scale={[9, 5, 1]} color="#ffffff" />
          {/* rose-tinted side fill */}
          <Lightformer intensity={1.1} position={[-5, 0, 3]} rotation={[0, Math.PI / 3, 0]} scale={[3.5, 6, 1]} color="#ff8aa6" />
        </Environment>
        <ContactShadows position={[0, -1.7, 0]} opacity={0.35} scale={8} blur={2.6} far={4} resolution={512} />
      </Canvas>
    </div>
  );
}
