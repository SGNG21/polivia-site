import { Fragment } from 'react';

const items = ['UNE TECHNOLOGIE À VOTRE SERVICE', 'UN PRIX JUSTE', 'UNE VRAIE EXIGENCE PREMIUM', 'VOTRE LIBERTÉ DIGITALE'];

export default function BrandMarquee() {
  return (
    <section className="brand-marquee" aria-label="Les engagements POLIVIA">
      <div className="wrap brand-marquee-inner">
        {items.map((t, i) => (
          <Fragment key={t}>
            {i > 0 && <i aria-hidden="true">✳</i>}
            <span>{t}</span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
