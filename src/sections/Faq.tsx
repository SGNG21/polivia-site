import { faq } from '../content/site';

export default function Faq() {
  return (
    <section className="faq-section wrap" id="questions">
      <div className="faq-lead">
        <div className="eyebrow dark-eyebrow">
          <span className="section-index">07 / LE BON SENS, JUSQU'AU BOUT</span>
        </div>
        <h2>
          Des réponses claires.
          <br />
          <em>Sans petit caractère.</em>
        </h2>
        <p>La confiance commence par la transparence.</p>
        <a className="btn btn-ink" href="/contact">
          Parler de mon projet ↗
        </a>
      </div>
      <div className="faq-questions">
        {faq.map((f) => (
          <details key={f.q}>
            <summary>
              {f.q} <span aria-hidden="true">+</span>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
