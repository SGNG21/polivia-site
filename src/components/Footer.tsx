import { Link } from 'wouter';
import { brand, phoneDisplay } from '../content/site';
import { Wordmark } from './Nav';

const columns = [
  {
    head: 'Offres',
    items: [
      { href: '/site-essentiel', label: 'Site Essentiel' },
      { href: '/site-sur-mesure', label: 'Site sur mesure' },
      { href: '/abonnement', label: 'Abonnement' },
      { href: '/audit-ia', label: 'Audit IA Express' },
    ],
  },
  {
    head: 'Agence',
    items: [
      { href: '/realisations', label: 'Réalisations' },
      { href: '/a-propos', label: 'À propos' },
      { href: '/contact', label: 'Contact et devis' },
    ],
  },
  {
    head: 'Informations',
    items: [
      { href: '/mentions-legales', label: 'Mentions légales' },
      { href: '/confidentialite', label: 'Confidentialité' },
    ],
  },
];

export default function Footer() {
  const tel = phoneDisplay(brand.phone);

  return (
    <footer className="footer world-ink">
      <div className="wrap footer-in">
        <div className="footer-brand">
          <Wordmark />
          <p className="small body-muted">{brand.promise}</p>
          <p className="small footer-area">
            {brand.areas.map((a) => `${a.name} (${a.code})`).join(' · ')}
          </p>
        </div>

        {columns.map((c) => (
          <nav key={c.head} className="footer-col" aria-label={c.head}>
            <h2 className="footer-head small">{c.head}</h2>
            <ul>
              {c.items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href}>{i.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="footer-col">
          <h2 className="footer-head small">Nous joindre</h2>
          <ul>
            <li>
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </li>
            {tel && brand.phone && (
              <li>
                <a className="data" href={`tel:${brand.phone}`}>
                  {tel}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="wrap footer-base small">
        <p>
          © {new Date().getFullYear()} {brand.legalName} — {brand.founder}
        </p>
        <p className="footer-made">Site conçu et développé par POLIVIA.</p>
      </div>
    </footer>
  );
}
