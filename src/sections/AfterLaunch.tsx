/**
 * What happens after the site goes live.
 *
 * The demo panel below is explicitly labelled as a demonstration and uses
 * invented figures, because POLIVIA's real client data is not ours to publish
 * and fabricated results presented as real would be the one thing that sinks
 * the whole page's credibility. The shape of the reporting is the message.
 */
const DEMO_MONTHS = [
  { m: 'Jan', impressions: 420, clicks: 38 },
  { m: 'Fév', impressions: 610, clicks: 52 },
  { m: 'Mar', impressions: 880, clicks: 71 },
  { m: 'Avr', impressions: 1180, clicks: 96 },
  { m: 'Mai', impressions: 1490, clicks: 128 },
  { m: 'Juin', impressions: 1870, clicks: 164 },
];

const WORK = [
  {
    head: 'Vous voyez ce que Google voit',
    body: 'Search Console reliée, pages déclarées et suivies. Quand une page n’est pas retenue, on sait pourquoi et on le corrige — plutôt que de le découvrir six mois plus tard.',
  },
  {
    head: 'Vous savez d’où viennent les demandes',
    body: 'Quelle page, quelle requête, quel appareil. Dans le respect du consentement, et sans tableau de bord décoratif que personne ne lit.',
  },
  {
    head: 'On retravaille ce qui ne ramène rien',
    body: 'Les pages sans retour sont reprises, les requêtes qu’on rate deviennent des pages. Chaque mois, on vous dit ce qui a bougé et ce qu’on a changé.',
  },
];

export default function AfterLaunch() {
  const max = Math.max(...DEMO_MONTHS.map((d) => d.impressions));

  return (
    <section className="world-ink band after" id="suivi" aria-labelledby="after-h">
      <div className="wrap">
        <div className="section-head wide" data-reveal>
          <h2 id="after-h" className="t-h2">
            La mise en ligne n’est pas la fin de notre travail.
          </h2>
          <p className="lede">
            C’est le moment où l’on commence à savoir ce qui marche. Un site livré puis
            abandonné redescend ; un site suivi monte.
          </p>
        </div>

        <div className="after-grid">
          <ul className="after-work">
            {WORK.map((w, i) => (
              <li key={w.head} data-reveal data-reveal-delay={i * 90}>
                <h3 className="t-h3">{w.head}</h3>
                <p className="body-muted small">{w.body}</p>
              </li>
            ))}
          </ul>

          <figure className="panel" data-reveal data-reveal-delay={120}>
            <figcaption className="panel-head">
              <span className="panel-title small">Forme du rapport mensuel</span>
              <span className="panel-flag small">Démonstration — chiffres fictifs</span>
            </figcaption>

            <div className="panel-body">
              <div className="panel-rows">
                {DEMO_MONTHS.map((d) => (
                  <div className="panel-row" key={d.m}>
                    <span className="panel-m small data">{d.m}</span>
                    <span className="panel-bar" aria-hidden="true">
                      <span
                        className="panel-bar-fill"
                        style={{ inlineSize: `${(d.impressions / max) * 100}%` }}
                      />
                      <span
                        className="panel-bar-clicks"
                        style={{ inlineSize: `${(d.clicks / max) * 100}%` }}
                      />
                    </span>
                    <span className="panel-v small data">{d.impressions}</span>
                  </div>
                ))}
              </div>

              <p className="panel-legend small">
                <span className="key key-imp" aria-hidden="true" /> Impressions
                <span className="key key-clk" aria-hidden="true" /> Clics
              </p>

              <p className="panel-note small">
                Ce que vous lisez chaque mois : ce que Google a montré, ce qui a été cliqué, et
                ce qu’on en a conclu. Vos vrais chiffres apparaîtront ici une fois le site en
                ligne et la Search Console reliée.
              </p>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
