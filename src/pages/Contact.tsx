import { useSearchParams } from 'wouter';
import QuoteForm from '../components/QuoteForm';
import Seo from '../components/Seo';
import { brand, phoneDisplay, audit } from '../content/site';
import { useReveal } from '../lib/useReveal';

export default function Contact() {
  useReveal();
  const [params] = useSearchParams();
  const intent = params.get('intent') === 'audit' ? 'audit' : 'devis';
  const tel = phoneDisplay(brand.phone);

  return (
    <>
      <Seo
        title="Demander un devis"
        description="Décrivez votre projet en deux lignes. Réponse sous 24 h avec un premier regard sur votre visibilité et un prix, sans engagement."
        path="/contact"
      />
      <section className="world-ink band page-head">
        <div className="wrap contact-in">
          <div className="contact-pitch">
            <h1 className="t-h2">
              {intent === 'audit' ? 'Réserver un audit IA.' : 'Demander un devis.'}
            </h1>
            <p className="lede">
              {intent === 'audit'
                ? `L’audit coûte ${audit.price} € et vous repartez avec un plan d’action chiffré, que vous travailliez avec nous ou non.`
                : `Deux lignes suffisent pour commencer. On revient vers vous sous ${brand.responseTime}.`}
            </p>

            <ul className="final-contact">
              <li>
                <span className="fc-k small">E-mail</span>
                <a className="fc-v" href={`mailto:${brand.email}`}>
                  {brand.email}
                </a>
              </li>
              {tel && brand.phone && (
                <li>
                  <span className="fc-k small">Téléphone</span>
                  <a className="fc-v data" href={`tel:${brand.phone}`}>
                    {tel}
                  </a>
                </li>
              )}
              <li>
                <span className="fc-k small">Sur le terrain</span>
                <span className="fc-v">
                  {brand.areas.map((a) => `${a.name} (${a.code})`).join(' et ')}
                </span>
              </li>
            </ul>
          </div>

          <div className="final-form card">
            <QuoteForm intent={intent} />
          </div>
        </div>
      </section>
    </>
  );
}
