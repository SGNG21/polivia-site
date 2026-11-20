import { useState } from 'react';
import { Link } from 'wouter';
import { pricing } from '../content/site';

export default function Pricing() {
  const [term, setTerm] = useState<'yearly' | 'monthly'>('yearly');

  return (
    <section className="pricing wrap" id="offres">
      <div className="section-heading pricing-head">
        <div>
          <div className="eyebrow dark-eyebrow">
            <span className="section-index">03 / DES OFFRES CLAIRES</span>
          </div>
          <h2>
            Des ambitions premium.
            <br />
            <em>Des prix qui ont du sens.</em>
          </h2>
          <p>Choisissez la durée qui vous convient. Les services sont détaillés, sans surprises.</p>
        </div>
        <div className="price-switch" role="group" aria-label="Choisir le type d'engagement">
          <button type="button" aria-pressed={term === 'yearly'} className={term === 'yearly' ? 'active' : ''} onClick={() => setTerm('yearly')}>
            12 mois <span>Tarif réduit</span>
          </button>
          <button type="button" aria-pressed={term === 'monthly'} className={term === 'monthly' ? 'active' : ''} onClick={() => setTerm('monthly')}>
            Sans engagement
          </button>
        </div>
      </div>

      <div className="pricing-grid">
        {pricing.map((tier) => {
          const amount = term === 'yearly' ? tier.yearly : tier.monthly;
          const validated = term === 'yearly' ? tier.yearlyValidated : tier.monthlyValidated;
          return (
            <article className={`price-card${tier.featured ? ' featured' : ''}`} key={tier.slug}>
              <div className="price-cap">{tier.cap.toUpperCase()}</div>
              <h3>{tier.name}</h3>
              <div className="price-number">
                <span className="price-amount">{amount}</span>
                <span className="price-currency"> €</span>
                <span className="price-unit">HT/mois{!validated && ' · à confirmer'}</span>
              </div>
              <p>
                {term === 'yearly'
                  ? '12 mensualités minimum · sans frais de création'
                  : tier.setupFeeMonthly
                    ? `Sans engagement · mise en service proposée : ${tier.setupFeeMonthly.amount} € HT`
                    : 'Sans engagement · conditions mensuelles à formaliser'}
              </p>
              <ul>
                {tier.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <Link href="/contact" className={`btn ${tier.featured ? 'btn-primary' : 'btn-outline dark-outline'}`}>
                Créer ma maquette ↗
              </Link>
            </article>
          );
        })}
      </div>
      <p className="legalline">
        Tarifs HT mensuels. 49 € et 60 € pour Essentiel ainsi que 80 € pour Croissance sont des montants validés ; les autres
        montants restent à confirmer commercialement et contractuellement avant toute mise en vente effective.
      </p>
    </section>
  );
}
