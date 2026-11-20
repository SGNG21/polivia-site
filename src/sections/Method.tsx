import { method } from '../content/site';

export default function Method() {
  return (
    <section className="method-section" id="methode">
      <div className="wrap">
        <div className="eyebrow">
          <span className="section-index">04 / NOTRE MÉTHODE</span>
        </div>
        <div className="method-title">
          <h2>
            On s'occupe de la technique.
            <br />
            <em>Vous gardez le contrôle.</em>
          </h2>
          <p>La technologie doit vous simplifier la vie, pas créer une nouvelle dépendance.</p>
        </div>
        <div className="method-grid">
          {method.map((m) => (
            <div key={m.step}>
              <span>{m.step}</span>
              <strong>{m.name}</strong>
              <p>{m.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
