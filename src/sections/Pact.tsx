import { founder, pact } from '../content/site';

/**
 * The human sequence, placed straight after the AI band and in the limestone
 * world: the point is the contrast between what the technology can do and how
 * simple the relationship behind it is.
 *
 * No invented team, no stock portrait, no fabricated biography. Where a real
 * fact is missing the markup simply does not render it.
 */
export default function Pact() {
  return (
    <section className="world-stone band pact" aria-labelledby="pact-h">
      <div className="wrap">
        <h2 id="pact-h" className="t-h2 pact-h">
          {pact.headline}
        </h2>

        <div className="pact-grid">
          <div className="pact-who">
            <div className="pact-portrait">
              {founder.portrait ? (
                <img
                  src={founder.portrait}
                  alt={`${founder.name}, ${founder.role.toLowerCase()}`}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="pact-initials" aria-hidden="true">
                  GN
                </span>
              )}
            </div>
            <p className="pact-name">{founder.name}</p>
            <p className="pact-role small">{founder.role}</p>
            {founder.story.map((para) => (
              <p className="body-muted" key={para.slice(0, 24)}>
                {para}
              </p>
            ))}
          </div>

          <ul className="pact-stances">
            {pact.stances.map((s, i) => (
              <li key={s.head} data-reveal style={{ '--i': i } as React.CSSProperties}>
                <h3 className="t-h3">{s.head}</h3>
                <p className="body-muted">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="pact-closing">{pact.closing}</p>

        <p className="pact-rule small">
          Nous limitons le nombre de projets menés en même temps. Si nous ne sommes pas le bon
          interlocuteur pour vous, nous le dirons au premier rendez-vous plutôt qu’au
          troisième mois.
        </p>
      </div>
    </section>
  );
}
