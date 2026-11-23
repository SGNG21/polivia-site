import type { ReactNode } from 'react';
import Seo from '../components/Seo';
import { brand, legal, missingLegal, phoneDisplay } from '../content/site';

const INTAKE_ACTIVE = Boolean(import.meta.env.VITE_FORM_ENDPOINT);
const COMPLETE = missingLegal(INTAKE_ACTIVE).length === 0;

/** A value the owner still has to supply: shown as such, never guessed. */
function Field({ value, label }: { value: string | null; label: string }) {
  return value ? <>{value}</> : <span className="legal-missing">À compléter : {label}</span>;
}

function LegalPage({ title, description, path, children }: { title: string; description: string; path: string; children: ReactNode }) {
  return (
    <>
      {/* Indexed only once every required item is filled in. */}
      <Seo title={title} description={description} path={path} noindex={!COMPLETE} />
      <section className="page-head">
        <div className="wrap-tight">
          <h1 className="t-h2">{title}</h1>
          <p className="body-muted small">Dernière mise à jour : {legal.updated}.</p>
        </div>
      </section>
      <div className="wrap-tight prose">{children}</div>
    </>
  );
}

export function MentionsLegales() {
  const p = legal.publisher;
  const tel = phoneDisplay(brand.phone);
  return (
    <LegalPage title="Mentions légales" description="Éditeur, hébergeur et conditions d’utilisation du site polivia.fr." path="/mentions-legales">
      <h2>Éditeur du site</h2>
      <dl className="legal-dl">
        <dt>Nom</dt>
        <dd>{p.name}</dd>
        <dt>Forme juridique</dt>
        <dd>
          <Field value={p.legalForm} label="Forme juridique" />
          {p.shareCapital && <>, au capital de {p.shareCapital}</>}
        </dd>
        <dt>SIREN</dt>
        <dd><Field value={p.siren} label="SIREN" /></dd>
        <dt>Immatriculation</dt>
        <dd><Field value={p.registration} label="Immatriculation" /></dd>
        <dt>TVA</dt>
        <dd><Field value={p.vat} label="TVA intracommunautaire ou mention d’exonération" /></dd>
        <dt>Siège</dt>
        <dd><Field value={p.address} label="Adresse du siège" /></dd>
        <dt>Téléphone</dt>
        <dd><Field value={tel} label="Téléphone" /></dd>
        <dt>E-mail</dt>
        <dd><a href={`mailto:${brand.email}`}>{brand.email}</a></dd>
        <dt>Directeur de la publication</dt>
        <dd><Field value={legal.publicationDirector} label="Directeur de la publication" /></dd>
      </dl>

      <h2>Hébergeur</h2>
      <p>
        {legal.host.name}, {legal.host.address}. Contact : <a href={legal.host.contact} rel="noreferrer">{legal.host.contact.replace('https://', '')}</a>.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, la mise en page et les éléments graphiques de ce site appartiennent à {p.name}, sauf mention contraire.
        Les noms des entreprises présentées dans les réalisations restent la propriété de leurs titulaires. Toute reproduction
        demande un accord écrit préalable.
      </p>

      <h2>Liens vers d’autres sites</h2>
      <p>
        Les réalisations renvoient vers les sites de nos clients. Nous ne sommes pas responsables de leur contenu actuel, qui
        relève de chaque entreprise.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des informations envoyées par les formulaires est décrit dans la page <a href="/confidentialite">Confidentialité</a>.
      </p>
    </LegalPage>
  );
}

export function Confidentialite() {
  return (
    <LegalPage title="Confidentialité" description="Quelles données POLIVIA reçoit par ses formulaires, pourquoi, combien de temps, et comment exercer vos droits." path="/confidentialite">
      <h2>Responsable du traitement</h2>
      <p>
        {legal.publisher.name}, <Field value={legal.publisher.address} label="Adresse du siège" />. Pour toute question :{' '}
        <a href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>

      <h2>Ce que nous recevons</h2>
      <p>Uniquement ce que vous saisissez dans un formulaire :</p>
      <ul>
        <li>demande de devis ou d’audit : nom, e-mail, téléphone (facultatif), activité, message ;</li>
        <li>Studio : nom de l’entreprise, métier, ville, prestations, ton souhaité, e-mail ;</li>
        <li>
          préparation d’une transition : entreprise, nom, e-mail, téléphone, site actuel, prestataire actuel, date de fin
          de contrat, message, et vos choix pour les deux cases facultatives.
        </li>
      </ul>
      <p>Ce site ne dépose aucun cookie, n’utilise aucun traceur et aucun outil de mesure d’audience.</p>

      <h2>Pourquoi, et sur quelle base</h2>
      <ul>
        <li>Répondre à votre demande (devis, audit, maquette, transition) : mesures précontractuelles prises à votre demande.</li>
        <li>Vous rappeler à l’approche de la fin de votre contrat actuel : votre consentement (case facultative).</li>
        <li>Vous envoyer nos nouveautés et offres : votre consentement (case facultative), retirable à tout moment.</li>
      </ul>
      <p>Vos données ne sont ni vendues ni louées, et ne servent à aucune décision automatisée.</p>

      <h2>Comment votre demande nous parvient</h2>
      {INTAKE_ACTIVE ? (
        <p>
          Le formulaire envoie votre demande à notre serveur de réception (<Field value={legal.intakeHosting} label="Hébergeur et pays du serveur de réception" />),
          qui l’enregistre avant de nous la transmettre. Une demande n’est confirmée à l’écran qu’une fois enregistrée.
        </p>
      ) : (
        <p>
          L’envoi d’un formulaire ouvre votre propre messagerie avec un message déjà rédigé : rien ne nous est transmis tant
          que vous ne l’avez pas envoyé. Il arrive dans notre messagerie professionnelle, hébergée par OVHcloud.
        </p>
      )}

      <h2>Qui y a accès</h2>
      <p>
        {legal.publisher.name} seulement. Nos prestataires techniques n’y accèdent que pour faire fonctionner le service :
        l’hébergeur du site ({legal.host.name}, qui traite les journaux techniques comme l’adresse IP)
        {INTAKE_ACTIVE ? ', l’hébergeur du serveur de réception' : ''} et notre messagerie (OVHcloud).
      </p>

      <h2>Transferts hors de l’Union européenne</h2>
      <p>
        {legal.host.name} est établi aux États-Unis. Il déclare adhérer au Data Privacy Framework UE–États-Unis et recourir aux
        clauses contractuelles types de la Commission européenne.
      </p>

      <h2>Combien de temps</h2>
      <p>
        Demandes : <Field value={legal.requestRetention} label="Durée de conservation des demandes" />. Les choix des cases
        facultatives valent jusqu’à ce que vous les retiriez. Sur simple demande, nous supprimons vos données plus tôt.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez accéder à vos données, les rectifier, les effacer, en limiter l’usage, vous y opposer, les récupérer dans un
        format lisible, et retirer votre consentement. Écrivez à <a href={`mailto:${brand.email}`}>{brand.email}</a> : nous
        répondons sous un mois. Si notre réponse ne vous satisfait pas, vous pouvez saisir la CNIL (<a href="https://www.cnil.fr" rel="noreferrer">cnil.fr</a>).
      </p>
    </LegalPage>
  );
}
