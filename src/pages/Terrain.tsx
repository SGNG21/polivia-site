import QuoteForm from '../components/QuoteForm';
import Seo from '../components/Seo';
import { brand, phoneDisplay, offers } from '../content/site';
import { Wordmark } from '../components/Nav';

/**
 * Field landing page — the target of the QR code handed over in person.
 *
 * Deliberately the lightest page on the site: no 3D, no GSAP, no scroll
 * animation, no navigation to wander off into. One offer, one action, on a
 * phone, often on a weak signal, with the prospect standing next to you.
 */
export default function Terrain() {
  const tel = brand.phone;
  const essentiel = offers[0];

  return (
    <main className="world-ink terrain">
      <Seo
        title="Votre site professionnel"
        description="Un site professionnel dès 1 490 €, conçu dans l’Yonne et sur la Côte d’Azur. Demandez votre devis en deux lignes."
        path="/terrain"
        noindex
      />

      <div className="wrap-tight terrain-in">
        <Wordmark />

        <h1 className="t-h2 terrain-h">Votre site professionnel, à partir de 1 490 €.</h1>

        <p className="lede">
          On s’est vus. Voici la suite : vous laissez votre nom et votre activité, et vous
          recevez un prix précis sous {brand.responseTime}.
        </p>

        <ul className="terrain-points">
          {essentiel?.includes.slice(0, 4).map((i) => <li key={i}>{i}</li>)}
        </ul>

        <div className="terrain-form card">
          <QuoteForm />
        </div>

        <div className="terrain-direct">
          {tel && (
            <a className="btn btn-quiet btn-block btn-lg" href={`tel:${tel}`}>
              Appeler maintenant
            </a>
          )}
          <a className="btn btn-quiet btn-block btn-lg" href={`mailto:${brand.email}`}>
            Écrire un e-mail
          </a>
          {tel && <p className="small terrain-tel data">{phoneDisplay(tel)}</p>}
        </div>

        <p className="small terrain-foot">
          POLIVIA — {brand.founder} · {brand.areas.map((a) => a.code).join(' et ')}
        </p>
      </div>
    </main>
  );
}
