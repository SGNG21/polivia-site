import { Link } from 'wouter';
import Seo from '../components/Seo';
import QuoteForm from '../components/QuoteForm';

/**
 * Routed, indexed, and honest: the page exists, says what it will hold, and
 * still offers the conversion path. Better than a 404 on a link the footer
 * and the sitemap both advertise.
 */
export default function Stub({
  title,
  description,
  path,
  lede,
}: {
  title: string;
  description: string;
  path: string;
  lede: string;
}) {
  return (
    <>
      <Seo title={title} description={description} path={path} noindex />
      <section className="world-ink band page-head">
        <div className="wrap-tight stub">
          <h1 className="t-h2">{title}</h1>
          <p className="lede">{lede}</p>
          <p className="body-muted">
            Cette page est en cours de rédaction. En attendant, l’essentiel est sur la page
            d’accueil, ou dites-nous directement ce qu’il vous faut.
          </p>
          <div className="stub-cta">
            <Link href="/" className="btn btn-quiet">
              Retour à l’accueil
            </Link>
          </div>
          <div className="card stub-form">
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
