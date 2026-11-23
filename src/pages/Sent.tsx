import { Link } from 'wouter';
import Seo from '../components/Seo';
import { brand } from '../content/site';

/** Page de succès : l'intake n'y redirige (303) qu'une fois la demande enregistrée. */
export default function Sent() {
  return (
    <>
      <Seo title="Demande reçue" description="Votre demande a bien été enregistrée." path="/demande-envoyee" noindex />
      <section className="page-head">
        <div className="wrap-tight">
          <h1 className="t-h2">Demande reçue.</h1>
          <p className="lede">Elle est enregistrée : vous avez une réponse sous {brand.responseTime}.</p>
          <p className="body-muted">
            Une précision à ajouter ? Écrivez à <a className="inline-link" href={`mailto:${brand.email}`}>{brand.email}</a>.
          </p>
          <div className="stub-cta">
            <Link href="/" className="btn btn-quiet">
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
