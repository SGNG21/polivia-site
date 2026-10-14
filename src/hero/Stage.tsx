import { Suspense, lazy, useEffect, useState } from 'react';
import { STAGES } from '../content/system';

/* L'instrument tourne derrière le décor. Importé dynamiquement et seulement
   là où il peut réellement tourner : un téléphone ne télécharge jamais ces
   ~260 Ko pour un objet qu'il n'afficherait pas. */
const Sculpture = lazy(() => import('./Sculpture'));

function useSculptureAllowed(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 900px)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    let webgl = false;
    try {
      const c = document.createElement('canvas');
      webgl = !!(c.getContext('webgl2') ?? c.getContext('webgl'));
    } catch {
      webgl = false;
    }
    if (reduced || small || coarse || cores <= 4 || !webgl) return;
    // Laisse le texte et le décor peindre avant d'aller chercher la 3D.
    const id = window.setTimeout(() => setOk(true), 400);
    return () => window.clearTimeout(id);
  }, []);
  return ok;
}

/* ===========================================================================
   La scène du hero.

   Reconstruite d'après references/polivia-design-valide.png : un décor en
   bokeh chaud, un appareil mis en scène, et des panneaux de verre flottant à
   des profondeurs différentes.

   Pourquoi en CSS 3D et non en WebGL : dans la référence, rien n'est un objet
   3D à matières — c'est un décor photographique surmonté d'interfaces à plat,
   en perspective. Les transformations 3D du navigateur rendent exactement
   cela, nettes à n'importe quelle densité de pixels (ce que le texte en WebGL
   ne sait pas faire), lisibles par un lecteur d'écran, indexables, et sans les
   260 Ko de three.js. La fidélité et la performance vont ici dans le même sens.

   Chaque couche lit --px / --py (pointeur) et --sy (scroll) posées par Hero,
   et se déplace proportionnellement à sa profondeur.
   =========================================================================== */

/** Un panneau de verre : fond translucide, filet d'or, halo. */
function Panel({
  depth,
  className,
  children,
  label,
}: {
  depth: number;
  className: string;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div
      className={`float panel-glass ${className}`}
      style={{ '--d': depth } as React.CSSProperties}
      aria-label={label}
      role={label ? 'group' : undefined}
    >
      {children}
    </div>
  );
}

/** Requêtes locales réelles du marché POLIVIA — aucune marque de moteur. */
const QUERIES = ['couvreur sens', 'électricien joigny', 'paysagiste antibes'];

export default function Stage() {
  const sculpture = useSculptureAllowed();

  return (
    <div className="stage" aria-hidden="true">
      {/* --- décor, du plus lointain au plus proche --- */}
      <div className="layer layer-bokeh" style={{ '--d': 1 } as React.CSSProperties} />

      {/* L'instrument : la profondeur du hero, pas son sujet. Il tourne
          derrière le navigateur et les panneaux. */}
      <div className="layer layer-sculpture" style={{ '--d': 4 } as React.CSSProperties}>
        {sculpture && (
          <Suspense fallback={null}>
            <Sculpture />
          </Suspense>
        )}
      </div>

      <div className="layer layer-glow" style={{ '--d': 2.5 } as React.CSSProperties} />

      <div className="stage-3d">
        {/* L'appareil : le site qu'on livre, mis en scène. */}
        <div className="float float-device" style={{ '--d': 7 } as React.CSSProperties}>
          <div className="device">
            <div className="device-bar">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="device-url" />
            </div>
            <div className="device-screen">
              <div className="mini-nav">
                <span className="mini-mark" />
                <span className="mini-links">
                  <i /><i /><i /><i />
                </span>
              </div>
              <div className="mini-hero">
                <p className="mini-eyebrow">Maison &amp; rénovation</p>
                <h3 className="mini-title">
                  L’artisanat,
                  <br />
                  <em>sans compromis.</em>
                </h3>
                <span className="mini-cta">Demander un devis</span>
              </div>
            </div>
          </div>
        </div>

        {/* La recherche locale : l'entrée du parcours d'acquisition. */}
        <Panel depth={11} className="float-search" label="Recherche locale">
          <div className="search-field">
            <svg viewBox="0 0 24 24" className="ico" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <span className="search-typed">
              plombier auxerre<span className="caret" />
            </span>
          </div>
          <ul className="search-rows">
            {QUERIES.map((q) => (
              <li key={q}>
                <svg viewBox="0 0 24 24" className="ico" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
                {q}
              </li>
            ))}
          </ul>
        </Panel>

        {/* Ce que la chaîne produit — libellés de capacité, aucun chiffre. */}
        <Panel depth={9} className="float-gains" label="Ce que le système produit">
          <ul className="gain-rows">
            {[
              { k: 'visibilite', t: 'Visibilité locale' },
              { k: 'appels', t: 'Appels et demandes' },
              { k: 'formulaires', t: 'Formulaires qualifiés' },
              { k: 'suivi', t: 'Suivi mensuel' },
            ].map((g) => (
              <li key={g.k}>
                <span className="gain-ico" />
                {g.t}
              </li>
            ))}
          </ul>
        </Panel>

        {/* Emplacement de la « carte de stats » de la maquette. Celle-ci
            affichait +236 % : un chiffre inventé. On garde la forme, on
            remplace le chiffre par ce qui est réellement suivi. */}
        <Panel depth={13} className="float-track" label="Suivi mensuel">
          <p className="track-k">Mesuré chaque mois</p>
          <svg className="spark" viewBox="0 0 120 32" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M0 28 L18 25 L34 22 L52 16 L70 13 L90 7 L120 3"
              fill="none"
              stroke="url(#sparkGold)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="sparkGold" x1="0" x2="1">
                <stop offset="0" stopColor="#b8863f" />
                <stop offset="1" stopColor="#ffe3a2" />
              </linearGradient>
            </defs>
          </svg>
          <p className="track-v">Impressions · Clics · Demandes</p>
        </Panel>

        {/* Les étapes, en pastilles — même source que la section plus bas. */}
        <Panel depth={6} className="float-chain" label="Les étapes">
          <ol className="chain">
            {STAGES.slice(0, 4).map((st, i) => (
              <li key={st.key}>
                <span className="chain-n">{String(i + 1).padStart(2, '0')}</span>
                {st.name}
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      {/* Le premier plan ferme la profondeur : feuillage et pierre en bas. */}
      <div className="layer layer-foreground" style={{ '--d': 16 } as React.CSSProperties} />
    </div>
  );
}
