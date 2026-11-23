import { Link } from 'wouter';
import Seo from '../components/Seo';
import Work from '../sections/Work';
import { projects } from '../content/site';

export default function Realisations() {
  return (
    <>
      <Seo
        title="Réalisations"
        description={`${projects.length} sites livrés par POLIVIA, de la rénovation au transport : chaque entreprise garde son identité propre.`}
        path="/realisations"
      />
      <section className="page-head">
        <div className="wrap">
          <h1 className="t-h2">Réalisations.</h1>
          <p className="lede">
            Des sites réellement livrés, pas des maquettes. Chaque entreprise garde son identité propre ; les liens ouvrent le
            site en ligne tel qu’il est aujourd’hui.
          </p>
        </div>
      </section>
      <Work head={false} />
      <section className="page-block wrap-tight page-cta">
        <h2>Le vôtre pourrait être le suivant.</h2>
        <Link href="/contact" className="btn btn-primary">
          Demander un devis ↗
        </Link>
      </section>
    </>
  );
}
