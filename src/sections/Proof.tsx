import { projects } from '../content/site';

/**
 * Real client names, set as type. No invented logos, no invented counts, no
 * star ratings — none of those exist yet. Typography carries the credibility
 * instead, which is also more honest than six coloured rectangles.
 */
export default function Proof() {
  return (
    <section className="world-ink proof" aria-labelledby="proof-h">
      <div className="wrap">
        <h2 id="proof-h" className="proof-h small">
          Des entreprises d’ici qui nous ont fait confiance
        </h2>
        <ul className="proof-list">
          {projects.map((p, i) => (
            <li key={p.slug} data-reveal data-reveal-delay={i * 60}>
              <span className="proof-name">{p.name}</span>
              <span className="proof-sector small">{p.sector}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
