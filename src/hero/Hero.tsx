import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import gsap from 'gsap';
import Stage from './Stage';
import { brand } from '../content/site';
import { prefersReducedMotion } from '../lib/capability';

/** Les quatre promesses sous les boutons, comme dans la maquette validée. */
const MARKS = ['Sites haut de gamme', 'Référencement local', 'Plus de demandes', 'Suivi et évolution'];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const scroll = useRef(0);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    setLit(true);

    const ctx = gsap.context(() => {
      /* --- parallaxe : une seule écoute, deux variables CSS -------------
         Les couches lisent --px / --py et se décalent proportionnellement à
         leur profondeur. Rien ne repasse par React, donc aucun rendu par
         image ; le navigateur ne compose que des transformations. */
      let raf = 0;
      let tx = 0;
      let ty = 0;
      let cx = 0;
      let cy = 0;

      const tick = () => {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        el.style.setProperty('--px', cx.toFixed(4));
        el.style.setProperty('--py', cy.toFixed(4));
        raf = Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005 ? requestAnimationFrame(tick) : 0;
      };

      const onMove = (e: PointerEvent) => {
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
        if (!raf) raf = requestAnimationFrame(tick);
      };

      if (!reduced && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('pointermove', onMove, { passive: true });
      }

      /* --- entrée orchestrée ------------------------------------------- */
      if (!reduced) {
        const fonts = document.fonts
          ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))])
          : Promise.resolve();

        gsap.set('[data-h-line] > span', { yPercent: 115 });
        gsap.set('.panel-glass, .layer-foreground', { opacity: 0 });

        fonts.then(() => {
          gsap
            .timeline({ defaults: { ease: 'expo.out' } })
            .to('[data-h-line] > span', { yPercent: 0, duration: 1.2, stagger: 0.09 })
            .from('[data-h-eyebrow]', { opacity: 0, x: -12, duration: 0.8 }, 0.1)
            .from('[data-h-sub]', { opacity: 0, y: 16, duration: 0.8 }, 0.5)
            .from('[data-h-cta] > *', { opacity: 0, y: 14, duration: 0.7, stagger: 0.08 }, 0.65)
            .from('[data-h-marks] > li', { opacity: 0, y: 10, duration: 0.6, stagger: 0.06 }, 0.85)
            // La scène se monte ensuite, du plus loin au plus près.
            .to(
              '.panel-glass',
              { opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power2.out' },
              0.7,
            )
            .fromTo(
              '.panel-glass',
              { y: 22 },
              { y: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out' },
              0.7,
            )
            .to('.layer-foreground', { opacity: 1, duration: 1.2 }, 0.2);
        });
      }

      /* --- travelling au scroll ----------------------------------------
         Une simple écoute passive, pas ScrollTrigger. Le plugin ne servait
         qu'à produire une progression de 0 à 1 ; en contrepartie son
         `refresh()` écrit directement dans `scrollTop` pour mesurer, et
         quand la hauteur du document change pendant cette mesure — polices,
         images, sections révélées — il ne restitue pas la bonne position :
         la page s'ouvrait cinq mille pixels plus bas. */
      const onScroll = () => {
        const h = el.offsetHeight || 1;
        const p = Math.min(Math.max(window.scrollY / h, 0), 1);
        el.style.setProperty('--sy', p.toFixed(4));
        scroll.current = p;
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      return () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('scroll', onScroll);
        if (raf) cancelAnimationFrame(raf);
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero world-ink" ref={root} data-lit={lit} data-scrub>
      <Stage scroll={scroll} />

      <div className="wrap hero-in">
        <div className="hero-copy">
          <p className="hero-eyebrow" data-h-eyebrow>
            Sites web · Référencement · Acquisition clients
          </p>

          <h1 className="t-hero hero-title">
            <span data-h-line>
              <span>Le beau attire.</span>
            </span>
            <span data-h-line>
              <span className="em">Le résultat</span>
            </span>
            <span data-h-line>
              <span className="em">fait la différence.</span>
            </span>
          </h1>

          <p className="lede hero-lede" data-h-sub>
            POLIVIA conçoit des sites premium pour les artisans et les entreprises de l’Yonne
            et de la Côte d’Azur, puis construit autour le système qui les rend visibles et
            transforme ces visiteurs en demandes.
          </p>

          <div className="hero-cta" data-h-cta>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Discutons de votre projet
            </Link>
            <a href="#realisations" className="btn btn-quiet btn-lg">
              <span className="play" aria-hidden="true" />
              Voir nos réalisations
            </a>
          </div>

          <ul className="hero-marks" data-h-marks>
            {MARKS.map((m) => (
              <li key={m}>
                <span className="mark-ico" aria-hidden="true" />
                {m}
              </li>
            ))}
          </ul>

          <p className="hero-note small">
            <span className="pulse" aria-hidden="true" />
            Yonne (89) et Côte d’Azur (06) — réponse sous {brand.responseTime}
          </p>
        </div>
      </div>
    </section>
  );
}
