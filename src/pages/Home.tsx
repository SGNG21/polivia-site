import Hero from '../hero/Hero';
import Proof from '../sections/Proof';
import Constat from '../sections/Constat';
import System from '../sections/System';
import Offers from '../sections/Offers';
import Work from '../sections/Work';
import AfterLaunch from '../sections/AfterLaunch';
import AiBand from '../sections/AiBand';
import Pact from '../sections/Pact';
import Commitments from '../sections/Commitments';
import FinalCta from '../sections/FinalCta';
import Seo, { OrgSchema } from '../components/Seo';
import { useReveal } from '../lib/useReveal';

/**
 * The page's rhythm, deliberately: graphite for the film, the problem and the
 * method; ivory for the commercial moment and for the human one; graphite
 * again to close. Two worlds, five switches — the light sections are where a
 * visitor has to read carefully, the dark ones are where they look.
 */
export default function Home() {
  useReveal();
  return (
    <>
      <Seo
        title="POLIVIA — Création de site internet dans l’Yonne et sur la Côte d’Azur"
        description="Agence web et acquisition client pour artisans, commerçants et TPE/PME. Sites professionnels dès 1 490 €, référencement local, suivi mensuel, audit IA à 390 €. Yonne (89) et Alpes-Maritimes (06)."
        path="/"
      />
      <OrgSchema />

      <Hero />
      <Proof />
      <Constat />
      <System />

      <div className="seam-to-stone" aria-hidden="true" />
      <Offers />

      <div className="seam-to-ink" aria-hidden="true" />
      <Work />
      <AfterLaunch />
      <AiBand />

      <div className="seam-to-stone" aria-hidden="true" />
      <Pact />

      <div className="seam-to-ink" aria-hidden="true" />
      <Commitments />
      <FinalCta />
    </>
  );
}
