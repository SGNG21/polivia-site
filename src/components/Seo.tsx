import { brand, pricing, audit } from '../content/site';

/**
 * React 19 hoists <title>, <meta> and <link> to <head> from anywhere in the
 * tree, and the prerender pass bakes them into each route's static HTML — so
 * crawlers get real per-page metadata without a head-management dependency.
 */
export default function Seo({
  title,
  description,
  path,
  noindex,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}) {
  const url = `${brand.url}${path === '/' ? '/' : path}`;
  const full = path === '/' ? title : `${title} — ${brand.name}`;

  return (
    <>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={brand.name} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${brand.url}/og.jpg`} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}

/**
 * Organisation data. Deliberately omits postalAddress, telephone and
 * aggregateRating: none of the three is confirmed, and inventing them in
 * structured data is both a lie to Google and a manual-action risk.
 */
export function OrgSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${brand.url}#org`,
    name: brand.name,
    url: brand.url,
    email: brand.email,
    description: brand.promise,
    founder: { '@type': 'Person', name: brand.founder },
    priceRange: '49 € – 329 €',
    ...(brand.phone ? { telephone: brand.phone } : {}),
    areaServed: brand.areas.map((a) => ({
      '@type': 'AdministrativeArea',
      name: `${a.name} (${a.code})`,
    })),
    knowsAbout: [
      'création de site internet',
      'référencement local',
      'automatisation par intelligence artificielle',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Prestations POLIVIA',
      itemListElement: [
        ...pricing.map((t) => ({
          '@type': 'Offer',
          name: t.name,
          description: t.body,
          price: t.yearly,
          priceCurrency: 'EUR',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: t.yearly,
            priceCurrency: 'EUR',
            unitCode: 'MON',
          },
        })),
        {
          '@type': 'Offer',
          name: audit.name,
          description: audit.body,
          price: audit.price,
          priceCurrency: 'EUR',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
