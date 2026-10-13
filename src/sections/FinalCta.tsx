import QuoteForm from '../components/QuoteForm';
import { brand, phoneDisplay } from '../content/site';

export default function FinalCta() {
  const tel = phoneDisplay(brand.phone);

  return (
    <section className="world-ink band final" id="contact" aria-labelledby="cta-h">
      <div className="wrap final-in">
        <div className="final-pitch">
          <h2 id="cta-h" className="t-h2">
            Dites-nous où vous en êtes.
          </h2>
          <p className="lede">
            Vous décrivez votre activité en deux lignes. On revient vers vous sous{' '}
            {brand.responseTime} avec un premier regard sur votre visibilité et un prix — sans
            engagement et sans relance insistante.
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
              <span className="fc-k small">Secteurs</span>
              <span className="fc-v">
                {brand.areas.map((a) => `${a.name} (${a.code})`).join(' et ')}
              </span>
            </li>
          </ul>
        </div>

        <div className="final-form card">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
