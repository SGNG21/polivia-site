import { projects } from '../content/site';

/**
 * Until a real screenshot exists for a project, `shot` is null and the card
 * renders a typographic plate. A fabricated browser mockup would be a lie
 * about work that was actually delivered, which is worse than no image.
 */
export default function Work() {
  return (
    <section className="world-ink band" id="realisations" aria-labelledby="work-h">
      <div className="wrap">
        <div className="section-head wide" data-reveal>
          <h2 id="work-h" className="t-h2">
            Du bâtiment à l’édition de luxe.
          </h2>
          <p className="lede">
            Des univers qui n’ont rien en commun, le même travail de fond : comprendre le
            métier, puis construire le parcours qui amène la demande.
          </p>
        </div>

        <ul className="work-grid">
          {projects.map((p, i) => (
            <li key={p.slug} className="work" data-reveal style={{ '--i': i % 3 } as React.CSSProperties}>
              <div className="work-plate">
                {p.shot ? (
                  <img src={p.shot} alt={`Site réalisé pour ${p.name}`} loading="lazy" decoding="async" />
                ) : (
                  <span className="work-plate-name" aria-hidden="true">
                    {p.name}
                  </span>
                )}
              </div>
              <div className="work-meta">
                <h3 className="t-h3">{p.name}</h3>
                <p className="work-sector small">{p.sector}</p>
                <p className="work-obj">{p.objective}</p>
                <p className="body-muted small">{p.body}</p>
                {p.liveUrl && (
                  <a className="work-link small" href={p.liveUrl} target="_blank" rel="noreferrer">
                    Voir le site en ligne
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
