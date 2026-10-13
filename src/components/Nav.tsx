import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { brand } from '../content/site';

const links = [
  { href: '/#systeme', label: 'Le système' },
  { href: '/#offres', label: 'Offres' },
  { href: '/#realisations', label: 'Réalisations' },
  { href: '/#suivi', label: 'Suivi' },
  { href: '/a-propos', label: 'À propos' },
];

export function Wordmark() {
  return (
    <span className="wordmark">
      POLIVIA<span className="wm-stop">.</span>
    </span>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [path] = useLocation();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on route change and on Escape — a menu that traps you on a phone is
  // the fastest way to lose the visitor.
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav" data-scrolled={scrolled}>
      <div className="wrap nav-in">
        <Link href="/" aria-label={`${brand.name} — accueil`}>
          <Wordmark />
        </Link>

        <nav className="nav-links" aria-label="Navigation principale">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-right">
          <Link href="/contact" className="btn btn-primary nav-cta">
            Demander un devis
          </Link>
          <button
            type="button"
            className="nav-burger"
            aria-expanded={open}
            aria-controls="nav-panel"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
            <span className="burger-bars" data-open={open} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="nav-panel" id="nav-panel" ref={panel} data-open={open} hidden={!open}>
        <nav className="wrap" aria-label="Navigation">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}>
            Contact et devis
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** Thumb-reach actions, phone only. Mirrors whatever contact routes exist. */
export function Dock() {
  const tel = brand.phone;
  return (
    <div className="dock">
      <Link href="/contact" className="btn btn-primary">
        Demander un devis
      </Link>
      {tel && (
        <a href={`tel:${tel}`} className="btn btn-quiet">
          Appeler
        </a>
      )}
      {!tel && (
        <a href={`mailto:${brand.email}`} className="btn btn-quiet">
          Écrire
        </a>
      )}
    </div>
  );
}
