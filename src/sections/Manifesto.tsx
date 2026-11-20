import { manifesto } from '../content/site';

export default function Manifesto() {
  return (
    <section className="manifesto" id="engagement">
      <div className="wrap manifesto-inner">
        <div className="eyebrow">{manifesto.eyebrow}</div>
        <h2>
          {manifesto.title[0]}
          <em>{manifesto.title[1]}</em>
        </h2>
        <p>{manifesto.body}</p>
        <blockquote>{manifesto.quote}</blockquote>
        <div className="manifesto-grid">
          {manifesto.pillars.map((p) => (
            <div key={p.n}>
              <b>{p.n}</b>
              <strong>{p.name}</strong>
              <span>{p.body}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
