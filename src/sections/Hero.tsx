import { Link } from 'wouter';
import { hero } from '../content/site';

/**
 * Pas de scène 3D : un cadre de navigateur en CSS pur, explicitement marqué
 * comme exemple fictif. Plus léger, plus honnête, et conforme à la règle
 * V8 "3D seulement sur justification métier" (docs/v8/docs/02).
 */
export default function Hero() {
  const [before, em, after] = hero.title;
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-content">
        <div className="hero-overline">
          <span className="pulse" aria-hidden="true" /> {hero.overline}
        </div>
        <h1 id="hero-title">
          {before}
          <em>{em}</em>
          {after}
          <span className="punctuation">.</span>
        </h1>
        <p className="hero-sub">{hero.sub}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#audit">
            Auditer mon site gratuitement <span aria-hidden="true">↗</span>
          </a>
          <Link href="/realisations" className="btn hero-secondary">
            Voir ce qu'on sait faire <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="hero-foot">
          {hero.foot.map((f) => (
            <span key={f.n}>
              <b>{f.n}</b> {f.label}
            </span>
          ))}
        </div>
      </div>

      <div className="hero-visual" aria-label="Exemple fictif de site web premium réalisé pour illustrer la direction artistique POLIVIA">
        <div className="hero-visual-head">
          <span>
            <span className="spark" aria-hidden="true" /> POLIVIA / SITE FACTORY
          </span>
          <span>
            CONCEPT 001 <span className="visual-cross" aria-hidden="true">✳</span>
          </span>
        </div>
        <div className="web-frame">
          <div className="mock-browser">
            <div className="browser-dots">
              <i />
              <i />
              <i />
            </div>
            <span>maison-oda.fr — exemple fictif</span>
            <span>↗</span>
          </div>
          <div className="showcase-site">
            <div className="showcase-nav">
              <span>
                MAISON <b>ODA.</b>
              </span>
              <span>
                Notre atelier&emsp;Nos réalisations&emsp;Contact <i>↗</i>
              </span>
            </div>
            <div className="showcase-image">
              <div className="showcase-image-overlay">
                <span>DES ESPACES QUI ONT UNE ÂME</span>
                <h2>
                  Le sens du
                  <br />
                  <i>détail.</i>
                </h2>
                <span className="fake-cta">Découvrir notre savoir-faire ↗</span>
              </div>
            </div>
            <div className="showcase-bottom">
              <span>MENUISERIE D'INTÉRIEUR · DEPUIS 2012</span>
              <span>01 / 03&emsp;━━━</span>
            </div>
          </div>
        </div>
        <div className="hero-float">
          <span className="hero-float-icon" aria-hidden="true">
            ✳
          </span>
          <div>
            <strong>Du premium, pas du prêt-à-jeter.</strong>
            <span>Une identité unique. Une technique maîtrisée.</span>
          </div>
        </div>
        <p className="hero-caption">VISUEL DE DÉMONSTRATION — AUCUNE RÉALISATION CLIENT REVENDIQUÉE</p>
      </div>
    </section>
  );
}
