/* ===========================================================================
   L'instrument — anneaux architecturaux imbriqués.

   Géométrie et éclairage d'origine : composant écrit par un autre worker sur
   ce dépôt, conservé tel quel sur décision de Geoffrey. Il n'est plus le sujet
   du hero mais sa profondeur : il tourne derrière le décor en bokeh, sous le
   navigateur mis en scène et les panneaux de verre.

   Chargé dynamiquement et seulement là où il peut tourner (voir Stage.tsx) :
   un téléphone ne télécharge jamais ces ~260 Ko.
   =========================================================================== */
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// Three nested, open architectural rings: a crafted acquisition engine,
// not arbitrary financial bars. All geometry is procedural and original.
function Instrument() {
  const assembly = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);
  const gems = useMemo(() => Array.from({length:9},(_,i)=>({a:i*Math.PI*2/9,r:1.7+(i%3)*0.11})),[]);
  /* Le canvas est en `pointer-events: none` (il vit sous le texte), donc R3F
     ne reçoit aucun événement et son `pointer` resterait figé : on écoute la
     fenêtre. */
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  /* Rendu à la demande. La rotation perpétuelle d'origine brûlait du GPU en
     continu sur une page que personne ne regarde la plupart du temps — et
     empêchait toute capture, le navigateur n'atteignant jamais un état stable.
     Ici l'objet suit le pointeur, s'amortit, puis se tait. */
  /* L'instrument tourne en continu : c'est ce qui donne vie au hero. Le coût
     est contenu en amont, pas ici — la boucle entière est coupée dès que la
     scène quitte l'écran ou que l'onglet passe en arrière-plan (voir le
     frameloop plus bas). Tourner devant personne, c'est ça qu'il fallait
     supprimer, pas le mouvement. */
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();

    if (assembly.current) {
      // Dérive lente de fond, à laquelle s'ajoute l'attraction du pointeur.
      const ty = 0.3 + Math.sin(t * 0.14) * 0.28 + pointer.current.x * 0.2;
      const tx = -0.23 + Math.cos(t * 0.11) * 0.09 + pointer.current.y * 0.13;
      assembly.current.rotation.y = THREE.MathUtils.damp(assembly.current.rotation.y, ty, 1.6, d);
      assembly.current.rotation.x = THREE.MathUtils.damp(assembly.current.rotation.x, tx, 1.6, d);
      // Respiration : l'objet avance et recule imperceptiblement.
      assembly.current.position.z = Math.sin(t * 0.23) * 0.22;
      assembly.current.position.y = Math.sin(t * 0.31) * 0.08;
    }
    // Les anneaux tournent à des vitesses incommensurables : la figure ne se
    // répète jamais tout à fait.
    if (inner.current) inner.current.rotation.z = t * 0.085;
    if (outer.current) outer.current.rotation.z = -t * 0.037;
  });
  return <group ref={assembly} rotation={[-0.25,0.28,0]}>
      <group ref={outer}>
        <mesh rotation={[0.3,0.4,0]}><torusGeometry args={[1.86,0.084,20,160]}/><meshPhysicalMaterial color="#a85930" metalness={0.96} roughness={0.17} clearcoat={1} clearcoatRoughness={0.12}/></mesh>
        <mesh rotation={[0.3,0.4,0]} scale={1.03}><torusGeometry args={[1.86,0.009,10,160]}/><meshBasicMaterial color="#f6c28a" transparent opacity={0.85}/></mesh>
        {gems.map(({a,r},i)=><mesh key={i} position={[Math.cos(a)*r,Math.sin(a)*r,0]} rotation={[0,0,a]}><octahedronGeometry args={[i%3===0?0.07:0.035,0]}/><meshStandardMaterial color="#ffdcac" metalness={0.8} roughness={0.15}/></mesh>)}
      </group>
      <group ref={inner} rotation={[-0.68,0.58,0]}>
        <mesh><torusGeometry args={[1.36,0.16,36,156]}/><meshPhysicalMaterial color="#c58e61" metalness={0.9} roughness={0.19} clearcoat={1}/></mesh>
        <mesh><torusGeometry args={[1.35,0.03,16,156]}/><meshBasicMaterial color="#ffcc86" transparent opacity={0.5}/></mesh>
      </group>
      <mesh rotation={[0.22,-0.5,0.38]}><icosahedronGeometry args={[0.74,3]}/><meshPhysicalMaterial color="#b8c7c9" metalness={0.38} roughness={0.045} clearcoat={1} clearcoatRoughness={0.06} envMapIntensity={2.1}/></mesh>
      <mesh><icosahedronGeometry args={[0.39,2]}/><meshStandardMaterial color="#ad5229" metalness={0.72} roughness={0.18} emissive="#9d3b0f" emissiveIntensity={0.22}/></mesh>
      <pointLight color="#ef8d4c" intensity={18} distance={5}/>
  </group>
}
/** Tourne tant qu'on la regarde, dort dès qu'on ne la regarde plus. */
function useAwake(): boolean {
  const [awake, setAwake] = useState(true);
  useEffect(() => {
    const onVis = () => setAwake(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    const host = document.querySelector('.layer-sculpture');
    if (!host) return () => document.removeEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(([e]) => setAwake(!!e?.isIntersecting && !document.hidden));
    io.observe(host);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      io.disconnect();
    };
  }, []);
  return awake;
}

export default function Sculpture() {
  const awake = useAwake();
  return <Canvas frameloop={awake ? 'always' : 'never'} camera={{position:[0,0,7.8],fov:36}} dpr={[1,1.5]} gl={{alpha:true,antialias:true,powerPreference:'high-performance'}}>
    <ambientLight intensity={0.32}/><directionalLight position={[4,6,6]} color="#ffe6c7" intensity={3}/><directionalLight position={[-6,-3,3]} color="#9bbbc3" intensity={2}/>
    <Environment resolution={128}><Lightformer form="rect" position={[0,6,2]} rotation={[-Math.PI/2,0,0]} scale={[12,5,1]} intensity={7}/><Lightformer form="rect" position={[5,1,4]} scale={[3,10,1]} intensity={6} color="#f6b77f"/><Lightformer form="rect" position={[-4,-1,3]} scale={[3,8,1]} intensity={5} color="#d9eaf2"/></Environment>
    <Instrument />
  </Canvas>
}
