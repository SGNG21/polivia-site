import { Link } from 'wouter';
import Seo from '../components/Seo';
import { brand, founder, pact, commitments } from '../content/site';

export default function About() {
  const areas = brand.areas.map((a) => `${a.name} (${a.code})`).join(' et ');
  return (
    <>
      <Seo
        title="À propos"
        description={`POLIVIA, agence web et IA fondée par ${founder.name}. Un seul interlocuteur, de l’écoute à la construction, en ${areas}.`}
        path="/a-propos"
      />
      <section className="page-head">
        <div className="wrap-tight">
          <h1 className="t-h2">Une personne qui écoute, et qui construit.</h1>
          <p className="lede">
            {founder.name}, {founder.role.charAt(0).toLowerCase() + founder.role.slice(1)}. Sur le terrain en {areas}.
          </p>
        </div>
      </section>

      <section className="page-block wrap-tight prose" aria-labelledby="story-title">
        <h2 id="story-title">D’où vient POLIVIA</h2>
        {founder.story.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </section>

      <section className="page-block wrap" aria-labelledby="pact-title">
        <h2 id="pact-title" className="page-block-title">{pact.headline}</h2>
        <div className="stance-grid">
          {pact.stances.map((s) => (
            <article key={s.head}>
              <h3>{s.head}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
        <p className="pact-closing">{pact.closing}</p>
      </section>

      <section className="page-block wrap" aria-labelledby="commit-title">
        <h2 id="commit-title" className="page-block-title">Ce sur quoi vous pouvez compter</h2>
        <dl className="commit-grid">
          {commitments.map((c) => (
            <div key={c.k}>
              <dt>{c.k}</dt>
              <dd className="commit-v">{c.v}</dd>
              <dd>{c.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="page-block wrap-tight page-cta">
        <h2>Parlons de votre projet.</h2>
        <Link href="/contact" className="btn btn-primary">
          Demander un devis ↗
        </Link>
      </section>
    </>
  );
}
