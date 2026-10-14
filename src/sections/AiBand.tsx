import { ai } from '../content/site';

const label: Record<(typeof ai)[number]['status'], string> = {
  live: 'Disponible',
  pilot: 'En test — pas encore livré',
  audit: 'Chiffré sur audit',
};

/**
 * Every capability carries its real status. The missed-call relaunch is a
 * pilot, so it says so: the previous site promised "0 appel perdu" as a
 * delivered feature, which the brief flags as a claim that cannot be kept.
 */
export default function AiBand() {
  return (
    <section className="world-ink band ai" id="ia" aria-labelledby="ai-h">
      <div className="wrap">
        <div className="section-head wide" data-reveal>
          <h2 id="ai-h" className="t-h2">
            L’IA, seulement là où elle vous fait gagner du temps.
          </h2>
          <p className="lede">
            Pas de catalogue, pas de démonstration de force. On regarde ce qui vous coûte des
            heures, et on automatise ça — ou rien.
          </p>
        </div>

        <ul className="ai-grid">
          {ai.map((a, i) => (
            <li key={a.name} className="card" data-reveal style={{ '--i': i } as React.CSSProperties}>
              <span className={`status status-${a.status}`}>{label[a.status]}</span>
              <h3 className="t-h3">{a.name}</h3>
              <p className="body-muted small">{a.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
