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
 * Un seul monde — noir profond et or — comme la direction artistique validée.
 * Le rythme se fait par la lumière : les sections « relevées » portent un fond
 * légèrement plus clair et un halo, les autres restent dans le noir.
 *
 * L'ordre sert la vente : on impressionne, on nomme le problème, on montre la
 * méthode, on donne les prix, on prouve, on explique le suivi, on se présente,
 * on s'engage, on demande.
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
