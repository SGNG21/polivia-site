import { projects } from '../content/site';

/**
 * La preuve réelle plutôt que le comparateur fictif du prototype V5 : on a
 * de vrais clients en ligne, mieux vaut les montrer qu'illustrer avec un
 * "avant/après" imaginaire. `liveUrl` reste `null` tant qu'un site n'est pas
 * vérifié en ligne.
 */
/** `head={false}` : sur la page Réalisations, le titre de page remplace l'en-tête de section de l'accueil. */
export default function Work({ head = true }: { head?: boolean }) {
  return (
    <section className="cases-section wrap" id="realisations" aria-labelledby={head ? 'cases-title' : undefined}>
      {head && (
        <div className="case-head">
          <div>
            <div className="eyebrow dark-eyebrow">
              <span className="section-index">02 / LA PREUVE PAR LE DESIGN</span>
            </div>
            <h2 id="cases-title">
              Moins cher ne veut pas dire <em>moins bien.</em>
            </h2>
          </div>
          <p>Des sites réellement livrés, pas des maquettes. Chaque entreprise garde son identité propre.</p>
        </div>
      )}

      <div className="work-grid">
        {projects.map((p) => (
          <article className="work-card" key={p.slug}>
            <span className="work-sector">{p.sector}</span>
            <h3>{p.name}</h3>
            <p className="work-obj">{p.objective}</p>
            <p className="work-body">{p.body}</p>
            {p.liveUrl && (
              <a className="work-link" href={p.liveUrl} target="_blank" rel="noreferrer">
                Voir le site en ligne ↗
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
