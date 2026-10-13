import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { detectTier, type Tier } from '../lib/capability';
import { brand } from '../content/site';

const AssemblyCanvas = lazy(() => import('./Assembly'));

gsap.registerPlugin(ScrollTrigger);

/**
 * The three narrative beats. They run as a caption track beside the sculpture
 * and never gate the commercial message: the headline, the CTA and the phone
 * are in the first paint and stay put while this plays. A visitor who scrolls
 * at once, or who has reduced motion on, loses nothing but the performance.
 */
const BEATS = [
  { text: 'C’est beau, non ?', tone: 'show' },
  { text: 'Mais votre entreprise n’a pas besoin de 3D.', tone: 'turn' },
  { text: 'Elle a besoin de clients.', tone: 'land' },
] as const;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const morph = useRef(0);
  const scroll = useRef(0);
  const [tier, setTier] = useState<Tier | null>(null);
  const [beat, setBeat] = useState(-1);

  useEffect(() => setTier(detectTier()), []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reduced motion gets the conclusion, not the performance.
    if (reduced) {
      morph.current = 1;
      setBeat(BEATS.length - 1);
      return;
    }

    const ctx = gsap.context(() => {
      const fonts = document.fonts
        ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))])
        : Promise.resolve();

      gsap.set('[data-h-line] > span', { yPercent: 112 });

      fonts.then(() => {
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .to('[data-h-line] > span', { yPercent: 0, duration: 1.1, stagger: 0.085 })
          .from('[data-h-sub]', { y: 18, opacity: 0, duration: 0.8 }, 0.35)
          .from('[data-h-cta] > *', { y: 14, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.5)
          .from('[data-h-note]', { opacity: 0, duration: 0.8 }, 0.75);

        // The sculpture's own film: crown, hesitation, sequence.
        // Positions are absolute seconds on the timeline. Relative ones were
        // measured against empty `.to({}, {duration})` spacers, which GSAP
        // collapses — the three beats fired within 200ms of each other.
        gsap
          .timeline({ delay: 1.2 })
          .call(() => setBeat(0), undefined, 0)
          .call(() => setBeat(1), undefined, 2.8)
          .to(morph, { current: 1, duration: 2.2, ease: 'power3.inOut' }, 3.1)
          .call(() => setBeat(2), undefined, 4.7);
      });

      // Scroll owns the camera once the film is over.
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          scroll.current = self.progress;
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero world-ink" ref={root}>
      <div className="hero-stage">
        {tier === null || tier === 'poster' ? (
          <div className="hero-poster" aria-hidden="true" />
        ) : (
          <Suspense fallback={<div className="hero-poster" aria-hidden="true" />}>
            <AssemblyCanvas tier={tier} morph={morph} scroll={scroll} />
          </Suspense>
        )}
      </div>

      <div className="wrap hero-in">
        <div className="hero-copy">
          <h1 className="t-hero hero-title">
            <span data-h-line>
              <span>Un site qui va</span>
            </span>
            <span data-h-line>
              <span>chercher vos clients.</span>
            </span>
          </h1>

          <p className="lede hero-lede" data-h-sub>
            POLIVIA construit le système qui rend votre entreprise visible, puis transforme
            cette visibilité en demandes. Pour les artisans et les entreprises de l’Yonne et de
            la Côte d’Azur.
          </p>

          <div className="hero-cta" data-h-cta>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Demander un devis
            </Link>
            <a href="#systeme" className="btn btn-quiet btn-lg">
              Voir comment
            </a>
          </div>

          <p className="hero-note small" data-h-note>
            <span className="pulse" aria-hidden="true" />
            Yonne (89) et Côte d’Azur (06) — réponse sous {brand.responseTime}
          </p>
        </div>

        {/* The caption track. Decorative by design: the same argument is made
            in the headline above and in the section below, so a screen reader
            is not handed a three-line monologue. */}
        <p className="hero-beats" aria-hidden="true">
          {BEATS.map((b, i) => (
            <span key={b.text} className="beat" data-tone={b.tone} data-on={beat === i}>
              {b.text}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
