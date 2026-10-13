import { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import type { Tier } from '../lib/capability';
import { STAGES } from '../content/system';

/* ===========================================================================
   « L'Atelier »

   Seven machined blades, alternating polished copper and graphite, standing
   in a crown under a studio key light. That is the beautiful object.

   Then the crown comes apart and the same seven blades file into a line:
   they become the seven stages of an acquisition system. One object, read
   twice — which is the argument the hero is making in words at the same time.

   Why seven blades and not a particle field or a glass vitrine: a crowd of
   particles is the stock 3D gesture and never resolves into something you
   could name, and glass costs a full extra scene render per frame for
   transmission. Seven solids share one geometry, need no post-processing,
   and mean something precise.
   =========================================================================== */

const COUNT = STAGES.length;
/* Tight enough that the seven blades close into a single machined drum. At a
   wider radius they read as seven scattered slabs, and the crown stops being
   an object you could point at. */
const RING_RADIUS = 0.62;
const LINE_PITCH = 0.52;

/** Rounded-rectangle profile; the chamfer is what reads as machined metal. */
function bladeGeometry(): THREE.ExtrudeGeometry {
  const w = 0.17;
  const h = 0.62;
  const r = 0.038;
  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h);
  shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r);
  shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h);
  shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r);
  shape.quadraticCurveTo(-w, -h, -w + r, -h);

  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.095,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 2,
    curveSegments: 5,
  });
  g.center();
  g.computeVertexNormals();
  return g;
}

/** Where blade `i` sits in each of the two readings. */
function layouts(i: number) {
  const a = (i / COUNT) * Math.PI * 2;
  const ring = {
    position: new THREE.Vector3(Math.sin(a) * RING_RADIUS, 0, Math.cos(a) * RING_RADIUS),
    rotation: new THREE.Euler(0, a, 0),
    scaleY: 1,
  };
  // In line the blades climb: the sequence is a progression, and the object
  // should say so before the labels do.
  const line = {
    position: new THREE.Vector3((i - (COUNT - 1) / 2) * LINE_PITCH, -0.55 + i * 0.16, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scaleY: 0.72 + i * 0.1,
  };
  return { ring, line };
}

type Props = { tier: Tier; morph: React.RefObject<number>; scroll: React.RefObject<number> };

function Blades({ tier, morph, scroll }: Props) {
  const group = useRef<THREE.Group>(null);
  const blades = useRef<(THREE.Mesh | null)[]>([]);
  const { camera } = useThree();

  const geometry = useMemo(() => bladeGeometry(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const slots = useMemo(() => Array.from({ length: COUNT }, (_, i) => layouts(i)), []);

  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (tier !== 'full') return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [tier]);

  const spin = useRef(0);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const m = morph.current ?? 0;
    const p = scroll.current ?? 0;

    // The crown turns while it is a crown, and stops once it is a sequence.
    spin.current += d * 0.38 * (1 - m);

    for (let i = 0; i < COUNT; i++) {
      const mesh = blades.current[i];
      const slot = slots[i];
      if (!mesh || !slot) continue;

      // Stagger: the blades nearest the front break formation first, so the
      // line assembles rather than snapping.
      const k = THREE.MathUtils.clamp((m - i * 0.055) / (1 - (COUNT - 1) * 0.055), 0, 1);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

      tmp.copy(slot.ring.position).lerp(slot.line.position, e);
      mesh.position.copy(tmp);
      mesh.rotation.y = THREE.MathUtils.lerp(slot.ring.rotation.y + spin.current, 0, e);
      mesh.scale.y = THREE.MathUtils.lerp(slot.ring.scaleY, slot.line.scaleY, e);

      // A touch of arc on the way over, so blades travel rather than slide.
      mesh.position.y += Math.sin(e * Math.PI) * 0.28;
    }

    if (group.current) {
      const g = group.current;
      const ty = pointer.current.x * 0.14;
      const tx = pointer.current.y * 0.08;
      g.rotation.y += (ty - g.rotation.y) * Math.min(1, d * 2.4);
      g.rotation.x += (tx - g.rotation.x) * Math.min(1, d * 2.4);
      g.position.y = -p * 1.3;
    }

    // The camera move is the cut between the two readings: a high
    // three-quarter view, where the crown is legible as a crown, descending to
    // eye level as the blades file into their sequence. Seen level, the ring
    // is just a row of rectangles; seen from above, the line is just a smear.
    camera.position.y = THREE.MathUtils.lerp(1.45, 0.28, m) + p * 0.9;
    camera.position.z = THREE.MathUtils.lerp(6.4, 7.4, m) - p * 1.3;
        // The camera aims well to the left of the object on purpose: that is what
    // pushes the sculpture into the right of the frame and leaves the headline
    // its own column. Aiming at the object would re-centre it over the text.
    camera.lookAt(THREE.MathUtils.lerp(0.55, 0.95, m), THREE.MathUtils.lerp(0.05, 0.12, m) - p * 0.4, 0);
  });

  return (
    <>
      <group ref={group} position={[2.35, 0.05, 0]}>
        {slots.map((_, i) => (
          <mesh
            key={i}
            ref={(el) => {
              blades.current[i] = el;
            }}
            geometry={geometry}
          >
            {i % 2 === 0 ? (
              <meshStandardMaterial color="#c07a47" metalness={0.95} roughness={0.17} envMapIntensity={2.4} />
            ) : (
              <meshStandardMaterial color="#939dab" metalness={0.82} roughness={0.19} envMapIntensity={2.3} />
            )}
          </mesh>
        ))}
      </group>

      {/* Procedural studio — no HDR fetched. For metal the environment is the
          light, so these panels are large and genuinely bright: small dim
          lightformers are what render copper as black plastic. */}
      <Environment resolution={tier === 'full' ? 256 : 128}>
        <Lightformer
          form="rect"
          intensity={6}
          color="#fff4e6"
          position={[0, 7, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[14, 10, 1]}
        />
        <Lightformer form="rect" intensity={9} color="#ffc48c" position={[6, 2.5, 4]} scale={[8, 10, 1]} />
        <Lightformer form="rect" intensity={3.2} color="#a9c4ec" position={[-7, -0.5, 3]} scale={[8, 9, 1]} />
        <Lightformer form="rect" intensity={6} color="#ffffff" position={[0, -5, 1.5]} scale={[12, 0.6, 1]} />
        <Lightformer form="rect" intensity={1.8} color="#5d6a7d" position={[0, 0, -9]} scale={[18, 18, 1]} />
      </Environment>

      <directionalLight position={[4, 6, 5]} intensity={2} color="#ffe2c2" />
      <directionalLight position={[-5, -1, 3]} intensity={0.6} color="#a9c4ec" />
      <ambientLight intensity={0.3} />
    </>
  );
}

function useOnScreen(ref: React.RefObject<HTMLElement | null>): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return visible;
}

export default function AssemblyCanvas({
  tier,
  morph,
  scroll,
}: {
  tier: Exclude<Tier, 'poster'>;
  morph: React.RefObject<number>;
  scroll: React.RefObject<number>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const visible = useOnScreen(host);

  return (
    <div ref={host} className="stage-host" aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={tier === 'full' ? [1, 1.75] : [1, 1.3]}
        gl={{ antialias: tier === 'full', alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.4, 7.6], fov: 34 }}
        style={{ pointerEvents: 'none' }}
      >
        <Blades tier={tier} morph={morph} scroll={scroll} />
      </Canvas>
    </div>
  );
}
