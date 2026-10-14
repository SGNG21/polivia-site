import { commitments } from '../content/site';

export default function Commitments() {
  return (
    <section className="world-ink commitments" aria-labelledby="eng-h">
      <div className="wrap">
        <h2 id="eng-h" className="t-h3 commitments-h">
          Ce sur quoi vous pouvez compter
        </h2>
        <ul className="commitments-grid">
          {commitments.map((c, i) => (
            <li key={c.k} data-reveal style={{ '--i': i } as React.CSSProperties}>
              <span className="c-value data">{c.v}</span>
              <span className="c-key">{c.k}</span>
              <span className="c-body small">{c.body}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
