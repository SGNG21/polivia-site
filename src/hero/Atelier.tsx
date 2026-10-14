import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { SCREEN_W, SCREEN_H, drawScreen } from './screen';

/* ===========================================================================
   « L'Atelier » — la scène du hero, en vraie 3D.

   D'après references/polivia-design-valide.png : un ordinateur posé sur une
   pierre sombre, sous une lumière de studio chaude, des panneaux de verre en
   lévitation, et la profondeur de champ d'un objectif ouvert.

   Le principe qui gouverne tout l'éclairage : pour un métal, l'environnement
   EST la lumière. Monter l'ambiante ne remplace jamais un reflet — elle
   délave le métal au lieu de le révéler. D'où des panneaux lumineux larges et
   réellement intenses plutôt qu'une lumière ambiante forte.
   =========================================================================== */

/** Profil à coins arrondis, extrudé : le chanfrein fait l'objet usiné. */
function chamfered(w: number, h: number, r: number, depth: number): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(-w + r, -h);
  s.lineTo(w - r, -h);
  s.quadraticCurveTo(w, -h, w, -h + r);
  s.lineTo(w, h - r);
  s.quadraticCurveTo(w, h, w - r, h);
  s.lineTo(-w + r, h);
  s.quadraticCurveTo(-w, h, -w, h - r);
  s.lineTo(-w, -h + r);
  s.quadraticCurveTo(-w, -h, -w + r, -h);
  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
    curveSegments: 6,
  });
  g.center();
  g.computeVertexNormals();
  return g;
}

/** L'écran, redessiné sur son canvas à chaque image. */
function useScreenTexture(): THREE.CanvasTexture {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = SCREEN_W;
    c.height = SCREEN_H;
    const tex = new THREE.CanvasTexture(c);
    // Une texture de couleur : elle doit être interprétée en sRGB, sinon le
    // doré vire au jaune délavé une fois le tone mapping appliqué.
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
}

function Laptop({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const tex = useScreenTexture();
  const ctx = useMemo(() => (tex.image as HTMLCanvasElement).getContext('2d'), [tex]);

  const bodyGeo = useMemo(() => chamfered(1.55, 1.02, 0.05, 0.055), []);
  const baseGeo = useMemo(() => chamfered(1.55, 1.02, 0.05, 0.03), []);
  useEffect(() => () => {
    bodyGeo.dispose();
    baseGeo.dispose();
    tex.dispose();
  }, [bodyGeo, baseGeo, tex]);

  useFrame((state, dt) => {
    if (ctx) {
      drawScreen(ctx, state.clock.getElapsedTime());
      tex.needsUpdate = true;
    }
    if (group.current) {
      const p = pointer.current ?? { x: 0, y: 0 };
      const d = Math.min(dt, 0.05);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -0.2 + p.x * 0.1, 2, d);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0.03 + p.y * 0.06, 2, d);
    }
  });

  return (
    <group ref={group} position={[0.35, 0.02, 0]} scale={1.42}>
      {/* Le capot, incliné comme un écran ouvert. */}
      <group rotation={[-0.1, 0, 0]} position={[0, 0.52, -0.46]}>
        <mesh geometry={bodyGeo}>
          <meshStandardMaterial color="#8d9299" metalness={0.98} roughness={0.28} envMapIntensity={1.9} />
        </mesh>
        {/* La dalle : émissive, donc elle éclaire et déborde dans le bloom. */}
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[2.96, 1.95]} />
          <meshStandardMaterial
            map={tex}
            emissiveMap={tex}
            emissive="#ffffff"
            emissiveIntensity={1.05}
            roughness={0.42}
            metalness={0}
          />
        </mesh>
      </group>

      {/* Le socle. */}
      <mesh geometry={baseGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.44, 0.52]}>
        <meshStandardMaterial color="#8d9299" metalness={0.98} roughness={0.33} envMapIntensity={1.7} />
      </mesh>
    </group>
  );
}

function Scene({ pointer, scroll }: { pointer: React.RefObject<{ x: number; y: number }>; scroll: React.RefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const s = scroll.current ?? 0;
    // Travelling : la caméra recule et s'élève pendant qu'on quitte le hero.
    camera.position.set(0.05 + s * 0.3, 0.34 + s * 1.4, 4.5 + s * 1.7);
    camera.lookAt(0.38, 0.02 - s * 0.5, 0);
  });

  return (
    <>
      <Laptop pointer={pointer} />

      {/* La pierre : une surface mate qui reçoit l'ombre et ancre l'objet,
          sans miroir. Le sol réfléchissant d'avant formait un grand trapèze
          gris qui délavait toute l'image et coûtait une passe de rendu. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0b0a08" roughness={0.95} metalness={0.2} envMapIntensity={0.35} />
      </mesh>

      {/* Le studio. Des panneaux larges et francs : pour un métal,
          l'environnement est la lumière. */}
      <Environment resolution={256}>
        {/* softbox principale, au-dessus, légèrement en avant */}
        <Lightformer form="rect" intensity={7} color="#fff3e2" position={[0, 6, 2.5]} rotation={[-Math.PI / 2, 0, 0]} scale={[14, 9, 1]} />
        {/* clé chaude, haute à droite : c'est elle qui donne l'or */}
        <Lightformer form="rect" intensity={16} color="#ffc27e" position={[5.4, 2.8, 3.2]} scale={[6, 10, 1]} />
        {/* déboucheur froid à gauche, pour que l'ombre ne vire pas au noir */}
        <Lightformer form="rect" intensity={1.7} color="#93a9c6" position={[-7, 0.4, 1.4]} scale={[6, 7, 1]} />
        {/* filet rasant bas : le trait qui dessine les chanfreins */}
        <Lightformer form="rect" intensity={9} color="#fff6e8" position={[0, -2.6, 2.4]} scale={[10, 0.4, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#4e5a6b" position={[0, 0, -9]} scale={[20, 20, 1]} />
      </Environment>

      {/* Des sources ponctuelles pour les éclats francs que l'environnement
          seul ne produit pas. */}
      <directionalLight position={[4.5, 5.5, 4.5]} intensity={3.2} color="#ffe2c0" />
      <directionalLight position={[-5, 1, 3]} intensity={0.4} color="#93a9c6" />
      <ambientLight intensity={0.16} />

      <EffectComposer enableNormalPass={false}>
        {/* La dalle émissive déborde : c'est le halo d'un écran allumé dans
            une pièce sombre. */}
        <Bloom intensity={0.5} luminanceThreshold={0.88} luminanceSmoothing={0.22} mipmapBlur radius={0.55} />
        {/* L'ouverture : le premier plan et l'arrière-plan fondent, le sujet
            reste net. C'est ce qui fait « photo » plutôt que « rendu ». */}
        <Vignette offset={0.32} darkness={0.72} />
      </EffectComposer>
    </>
  );
}

/** Tourne tant qu'on la regarde, dort dès qu'on ne la regarde plus. */
function useAwake(hostSelector: string): boolean {
  const [awake, setAwake] = useState(true);
  useEffect(() => {
    const onVis = () => setAwake(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    const host = document.querySelector(hostSelector);
    if (!host) return () => document.removeEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(([e]) => setAwake(!!e?.isIntersecting && !document.hidden));
    io.observe(host);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      io.disconnect();
    };
  }, [hostSelector]);
  return awake;
}

export default function Atelier({ scroll }: { scroll: React.RefObject<number> }) {
  const awake = useAwake('.layer-atelier');
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <Canvas
      frameloop={awake ? 'always' : 'never'}
      dpr={[1, 1.6]}
      camera={{ position: [0.05, 0.34, 4.5], fov: 34 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        // ACES rapproche le rendu d'une photographie : les hautes lumières
        // roulent au lieu d'être écrêtées, ce qui compte avec un écran
        // émissif et du bloom.
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <Scene pointer={pointer} scroll={scroll} />
    </Canvas>
  );
}
