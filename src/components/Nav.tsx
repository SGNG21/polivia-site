import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { brand } from '../content/site';

const links = [
  { href: '/#audit', label: "L'audit gratuit" },
  { href: '/#realisations', label: 'Notre différence' },
  { href: '/#offres', label: 'Nos offres' },
  { href: '/a-propos', label: 'À propos' },
];

export function Wordmark() {
  return (
    <span className="brand">
      <span className="brand-mark">
        P<span className="brand-dot">.</span>
      </span>
      <span className="brand-text">
        POLIVIA <small>{brand.tagline}</small>
      </span>
    </span>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [path] = useLocation();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav wrap">
      <Link href="/" aria-label={`${brand.name} — accueil`}>
        <Wordmark />
      </Link>

      <nav className={`menu${open ? ' menu-open' : ''}`} aria-label="Navigation principale" id="main-menu">
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>

      <div className="nav-right">
        <Link href="/contact" className="btn btn-ink nav-action">
          Mettez-nous au défi <span aria-hidden="true">↗</span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-controls="main-menu"
          aria-expanded={open}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
