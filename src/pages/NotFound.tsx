import { Link } from 'wouter';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page introuvable"
        description="Cette adresse n’existe pas ou plus."
        path="/404"
        noindex
      />
      <section className="world-ink band page-head">
        <div className="wrap-tight stub">
          <p className="marker">Erreur 404</p>
          <h1 className="t-h2">Cette page n’existe pas.</h1>
          <p className="lede">
            Le lien est peut-être ancien. Tout part de l’accueil, et le devis est à deux clics.
          </p>
          <div className="stub-cta">
            <Link href="/" className="btn btn-primary">
              Retour à l’accueil
            </Link>
            <Link href="/contact" className="btn btn-quiet">
              Demander un devis
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
