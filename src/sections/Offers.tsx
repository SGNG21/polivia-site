import { Link } from 'wouter';
import { offers, maintenance, audit } from '../content/site';

const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

/**
 * Le prix, composé pièce par pièce.
 *
 * `Intl` insère une espace fine insécable comme séparateur de milliers et
 * avant l'euro. Dans une police monospace chaque espace occupe une cellule
 * pleine, ce qui disloque « 1 490 € ». On remplace donc ces espaces par des
 * éléments à largeur choisie plutôt que de corriger après coup au
 * `word-spacing`, qui écrasait aussi l'espace après « dès ».
 */
function Price({ amount }: { amount: number }) {
  return (
    <>
      {nf.formatToParts(amount).map((part, i) =>
        part.type === 'group' ? (
          <span className="num-group" key={i} />
        ) : (
          <span key={i}>{part.value}</span>
        ),
      )}
      <span className="num-eur">€</span>
    </>
  );
}


/**
 * Anchor prices, visible. The brief is explicit: an artisan will not move
 * without a price marker, and hiding it behind "contact us" costs the lead.
 */
export default function Offers() {
  return (
    <section className="world-stone band" id="offres" aria-labelledby="offers-h">
      <div className="wrap">
        <div className="section-head wide" data-reveal>
          <h2 id="offers-h" className="t-h2">
            Trois façons d’avoir votre site. Les prix sont écrits.
          </h2>
          <p className="lede">
            Un devis précis demande un échange, mais vous avez droit à un repère avant de
            décrocher le téléphone.
          </p>
        </div>

        <ul className="offer-grid">
          {offers.map((o, i) => (
            <li
              key={o.slug}
              className={`offer card${o.featured ? ' offer-featured' : ''}`}
              data-reveal
              data-reveal-delay={i * 100}
            >
              {o.featured && <span className="offer-flag small">Le plus demandé</span>}

              <div className="offer-top">
                <h3 className="t-h3">{o.name}</h3>
                <p className="offer-kicker small">{o.kicker}</p>
              </div>

              <p className="offer-price data">
                {o.price.from && <span className="offer-from">dès</span>}
                <Price amount={o.price.amount} />
                {o.price.then && <span className="offer-then"> puis {o.price.then}</span>}
              </p>
              {o.commitment && <p className="offer-commit small">{o.commitment}</p>}

              <p className="body-muted">{o.body}</p>

              <ul className="ticks small">
                {o.includes.map((inc) => (
                  <li key={inc}>{inc}</li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`btn btn-block ${o.featured ? 'btn-primary' : 'btn-quiet'}`}
              >
                Demander un devis
              </Link>
            </li>
          ))}
        </ul>

        {/* Secondary offers: real, priced, but not competing for attention. */}
        <div className="offer-aside">
          <div className="aside-block" data-reveal>
            <h3 className="t-h3">Une fois le site en ligne</h3>
            <p className="body-muted small">
              L’entretien est optionnel. Vous pouvez aussi reprendre la main vous-même : le
              site vous appartient.
            </p>
            <ul className="price-rows">
              {maintenance.map((m) => (
                <li key={m.slug}>
                  <span className="pr-name">
                    {m.name}
                    <span className="pr-body small">{m.body}</span>
                  </span>
                  <span className="pr-price data">
                    <Price amount={m.price} />
                    <span className="pr-per">/mois</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="aside-block aside-audit" data-reveal data-reveal-delay={120}>
            <p className="marker">Pour les TPE et PME</p>
            <h3 className="t-h3">{audit.name}</h3>
            <p className="aside-price data">
              <Price amount={audit.price} />
            </p>
            <p className="body-muted small">{audit.body}</p>
            <ul className="ticks small">
              {audit.includes.map((inc) => (
                <li key={inc}>{inc}</li>
              ))}
            </ul>
            <Link href="/contact" className="btn btn-primary btn-block">
              Réserver un audit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
