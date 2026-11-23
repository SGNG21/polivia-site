import Seo from '../components/Seo';
import QuoteForm from '../components/QuoteForm';
import FreeAudit from '../sections/FreeAudit';
import { audit } from '../content/site';
import { useReveal } from '../lib/useReveal';

export default function AuditIa() {
  useReveal();
  return (
    <>
      <Seo
        title="Audit de site et Audit IA Express"
        description={`Un premier regard gratuit sur votre site, ou l’Audit IA Express à ${audit.price} € : visibilité, demandes perdues, tâches automatisables, plan chiffré.`}
        path="/audit-ia"
      />
      <section className="page-head">
        <div className="wrap-tight">
          <h1 className="t-h2">Faites auditer votre site.</h1>
          <p className="lede">
            Deux formats : un premier regard gratuit pour savoir où vous en êtes, et l’{audit.name} à {audit.price} € pour
            repartir avec un plan chiffré.
          </p>
        </div>
      </section>

      <FreeAudit />

      <section className="page-block wrap" aria-labelledby="audit-express-title">
        <div className="audit-express">
          <article className="price-card featured">
            <span className="price-cap">Diagnostic approfondi</span>
            <h2 id="audit-express-title">{audit.name}</h2>
            <div className="price-number">
              {audit.price} €<span className="price-unit">une fois</span>
            </div>
            <p>{audit.body}</p>
            <ul>
              {audit.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </article>
          <div className="card final-form">
            <QuoteForm intent="audit" />
          </div>
        </div>
      </section>
    </>
  );
}
