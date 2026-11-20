import Hero from '../sections/Hero';
import BrandMarquee from '../sections/BrandMarquee';
import FreeAudit from '../sections/FreeAudit';
import Work from '../sections/Work';
import Pricing from '../sections/Pricing';
import Method from '../sections/Method';
import Studio from '../sections/Studio';
import Transition from '../sections/Transition';
import Manifesto from '../sections/Manifesto';
import Faq from '../sections/Faq';
import Seo, { OrgSchema, FaqSchema } from '../components/Seo';
import { useReveal } from '../lib/useReveal';

/** Structure complète reprise du prototype V5 validé le 2026-11-20 (references/polivia-v5-signature). */
export default function Home() {
  useReveal();
  return (
    <>
      <Seo
        title="POLIVIA — Création de site internet dans l’Yonne et sur la Côte d’Azur"
        description="Agence web pour artisans et TPE/PME : audit gratuit, sites premium dès 49 € HT/mois, référencement local. Yonne (89) et Alpes-Maritimes (06)."
        path="/"
      />
      <OrgSchema />
      <FaqSchema />

      <Hero />
      <BrandMarquee />
      <FreeAudit />
      <Work />
      <Pricing />
      <Method />
      <Studio />
      <Transition />
      <Faq />
      <Manifesto />
    </>
  );
}
