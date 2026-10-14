import { STAGES } from '../content/system';

/**
 * The seven stages, in HTML.
 *
 * The hero says this with metal; this section says it with words, because a
 * WebGL diagram cannot be read by a screen reader, cannot be indexed, and
 * cannot be understood by a visitor who arrives with reduced motion on. Every
 * stage is in the DOM at once rather than hidden behind tabs: an artisan
 * should be able to read the whole method without discovering an interaction.
 */
export default function System() {
  return (
    <section className="world-ink band system" id="systeme" aria-labelledby="sys-h" data-scrub>
      <div className="wrap">
        <div className="section-head wide" data-reveal>
          <p className="marker">Le système d’acquisition</p>
          <h2 id="sys-h" className="t-h2">
            Un site ne suffit pas. Il faut la chaîne complète.
          </h2>
          <p className="lede">
            Sept étapes, de l’état des lieux jusqu’aux corrections du mois suivant. Chacune
            produit quelque chose que vous recevez.
          </p>
        </div>

        {/* Le rail et l'éclat se remplissent au défilement : la chaîne se met
            sous tension à mesure qu'on la parcourt. Décoratifs — la liste
            ci-dessous se lit entièrement sans eux. */}
        <div className="stages-rail" aria-hidden="true">
          <span className="stages-rail-fill" />
        </div>

        <ol className="stages">
          <span className="stages-sweep" aria-hidden="true" />
          {STAGES.map((s, i) => (
            <li key={s.key} data-reveal style={{ '--i': i % 4 } as React.CSSProperties}>
              <span className="stage-n data" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="stage-name t-h3">{s.name}</h3>
              <p className="stage-claim">{s.claim}</p>
              <p className="body-muted small">{s.body}</p>
              <p className="stage-out small">
                <span className="stage-out-k">Vous recevez</span>
                {s.output}
              </p>
            </li>
          ))}
        </ol>

        <p className="system-foot small">
          Aucune position dans Google ne peut être garantie, par nous ni par personne. Ce qui
          s’engage, c’est la méthode, la mesure et les corrections.
        </p>
      </div>
    </section>
  );
}
