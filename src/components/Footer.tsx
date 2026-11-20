import { manifesto, brand } from '../content/site';
import { Wordmark } from './Nav';

const links = [
  { href: '/#audit', label: "Auditer mon site" },
  { href: '/#offres', label: 'Les offres' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/#transition', label: 'Préparer ma transition' },
  { href: '/contact', label: 'Préparer mon projet' },
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/confidentialite', label: 'Confidentialité' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div>
          <a href="/">
            <Wordmark />
          </a>
          <p>{manifesto.quote}</p>
        </div>
        <nav className="footer-links" aria-label="Pied de page">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="footer-last">
          <span>
            © {new Date().getFullYear()} {brand.legalName} · {brand.areas.map((a) => a.name).join(' · ')}
          </span>
          <span>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
