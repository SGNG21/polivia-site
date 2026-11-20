import Hero from '../sections/Hero';
import BrandMarquee from '../sections/BrandMarquee';
import FreeAudit from '../sections/FreeAudit';
import Work from '../sections/Work';
import Pricing from '../sections/Pricing';
import Method from '../sections/Method';
import Transition from '../sections/Transition';
import Manifesto from '../sections/Manifesto';
import Faq from '../sections/Faq';
import Seo, { OrgSchema } from '../components/Seo';
import { useReveal } from '../lib/useReveal';

/**
 * Structure reprise du prototype V5 validé le 2026-11-20
 * (references/polivia-v5-signature). Une section du prototype reste à
 * construire : 05 "Le Studio POLIVIA" (configurateur multi-étapes avec
 * aperçu live) — un lot à part entière, pas branché dans cette passe.
 */
export default function Home() {
  useReveal();
  return (
    <>
      <Seo
        title="POLIVIA — Création de site internet dans l’Yonne et sur la Côte d’Azur"
        description="Agence web et acquisition client pour artisans, commerçants et TPE/PME. Audit gratuit, sites premium dès 49 € HT/mois, référencement local. Yonne (89) et Alpes-Maritimes (06)."
        path="/"
      />
      <OrgSchema />

      <Hero />
      <BrandMarquee />
      <FreeAudit />
      <Work />
      <Pricing />
      <Method />
      <Transition />
      <Faq />
      <Manifesto />
    </>
  );
}
