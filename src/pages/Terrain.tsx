import QuoteForm from '../components/QuoteForm';
import Seo from '../components/Seo';
import { brand, phoneDisplay, pricing } from '../content/site';
import { Wordmark } from '../components/Nav';

/**
 * Field landing page — the target of the QR code handed over in person.
 *
 * Deliberately the lightest page on the site: no scroll animation, no
 * navigation to wander off into. One offer, one action, on a phone, often on
 * a weak signal, with the prospect standing next to you.
 */
export default function Terrain() {
  const tel = brand.phone;
  const essentiel = pricing[0];

  return (
    <main className="page-head">
      <Seo
        title="Votre site professionnel"
        description={`Un site professionnel dès ${essentiel?.yearly} € HT/mois, conçu dans l’Yonne et sur la Côte d’Azur. Demandez votre devis en deux lignes.`}
        path="/terrain"
        noindex
      />

      <div className="wrap-tight">
        <Wordmark />

        <h1 className="t-h2">Votre site professionnel, à partir de {essentiel?.yearly} € HT/mois.</h1>

        <p className="lede">
          On s’est vus. Voici la suite : vous laissez votre nom et votre activité, et vous
          recevez un prix précis sous {brand.responseTime}.
        </p>

        <ul>
          {essentiel?.includes.slice(0, 4).map((i) => <li key={i} className="body-muted">{i}</li>)}
        </ul>

        <div className="card">
          <QuoteForm />
        </div>

        <div className="stub-cta">
          {tel && (
            <a className="btn btn-quiet btn-block btn-lg" href={`tel:${tel}`}>
              Appeler maintenant
            </a>
          )}
          <a className="btn btn-quiet btn-block btn-lg" href={`mailto:${brand.email}`}>
            Écrire un e-mail
          </a>
          {tel && <p className="small">{phoneDisplay(tel)}</p>}
        </div>

        <p className="small body-muted">
          POLIVIA — {brand.founder} · {brand.areas.map((a) => a.code).join(' et ')}
        </p>
      </div>
    </main>
  );
}
