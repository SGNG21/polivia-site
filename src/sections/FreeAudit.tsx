import { freeAudit } from '../content/site';

export default function FreeAudit() {
  return (
    <section className="audit-section wrap" id="audit" aria-labelledby="audit-title">
      <div className="audit-copy">
        <div className="eyebrow dark-eyebrow">
          <span className="section-index">{freeAudit.eyebrow}</span>
        </div>
        <h2 id="audit-title">
          {freeAudit.title[0]}
          <br />
          <em>{freeAudit.title[1]}</em>
        </h2>
        <p>{freeAudit.body}</p>
        <div className="audit-points">
          {freeAudit.points.map((p) => (
            <span key={p}>↗ {p}</span>
          ))}
        </div>
        <p className="audit-aside">{freeAudit.aside}</p>
      </div>

      <div className="audit-console">
        <div className="audit-console-top">
          <span className="audit-dot" aria-hidden="true" />
          <strong>LE DIAGNOSTIC POLIVIA</strong>
          <span className="audit-label">ÉTAPE 01</span>
        </div>
        <div className="audit-result" role="status">
          <p className="audit-status">{freeAudit.status}</p>
        </div>
        <a className="btn btn-primary btn-full" href="/contact?intent=audit">
          Demander mon audit ↗
        </a>
        <p className="audit-legal">Aucun score inventé, aucune collecte commerciale automatisée.</p>
      </div>
    </section>
  );
}
