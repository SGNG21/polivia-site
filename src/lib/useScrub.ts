import { useEffect } from 'react';

/**
 * Écrit sur chaque `[data-scrub]` une variable `--p` qui va de 0 à 1 pendant
 * que l'élément traverse la fenêtre. Le CSS s'en sert pour lier une animation
 * au défilement.
 *
 * Une seule écoute passive pour toute la page, lue dans une frame d'animation,
 * et seuls les éléments actuellement à l'écran sont recalculés — un
 * observateur par section coûterait plus cher pour le même résultat, et
 * ScrollTrigger coûtait quarante kilo-octets plus un bug de restitution de
 * position (voir Hero).
 */
export function useScrub(): void {
  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>('[data-scrub]')];
    if (!nodes.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((n) => n.style.setProperty('--p', '1'));
      return;
    }

    // On ne mesure que ce qui est visible : hors écran, la valeur est figée
    // aux bornes et il n'y a rien à calculer.
    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) visible.add(el);
          else {
            visible.delete(el);
            el.style.setProperty('--p', e.boundingClientRect.top < 0 ? '1' : '0');
          }
        }
        if (visible.size) schedule();
      },
      { threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));

    let raf = 0;
    const measure = () => {
      raf = 0;
      const h = window.innerHeight;
      for (const el of visible) {
        const r = el.getBoundingClientRect();
        // 0 quand le haut de l'élément touche le bas de la fenêtre,
        // 1 quand son bas touche le haut : la course complète de la traversée.
        const span = r.height + h || 1;
        const p = Math.min(Math.max((h - r.top) / span, 0), 1);
        el.style.setProperty('--p', p.toFixed(4));
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
