import { useEffect } from 'react';

/**
 * One IntersectionObserver for every [data-reveal] on the page.
 *
 * A per-element observer (or a GSAP ScrollTrigger per card) is the usual
 * shape and it costs a listener per node; one shared observer that unobserves
 * on first reveal costs almost nothing and cannot leak.
 */
export function useReveal(): void {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-shown])');
    if (!nodes.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((n) => n.setAttribute('data-shown', 'true'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const delay = Number(el.dataset.revealDelay ?? 0);
          el.style.transitionDelay = `${delay}ms`;
          el.setAttribute('data-shown', 'true');
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}
