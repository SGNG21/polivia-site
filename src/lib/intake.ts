/**
 * Envoi des formulaires au service intake de l'usine (contrat : intake/handler.mjs `receive`).
 *
 * L'intake est conçu pour un formulaire HTML classique : POST multipart/form-data vers
 * /v1/devis/<siteId>, puis 303 vers la page de succès du site une fois la demande stockée,
 * ou page d'erreur HTML avec lien de retour. Il n'envoie aucun en-tête CORS : un fetch()
 * ne peut pas lire sa réponse. On soumet donc une vraie navigation — la CSP doit autoriser
 * l'origine de l'intake dans `form-action` (contrôlé au build), `connect-src` reste 'self'.
 */

export type IntakeService = 'devis' | 'audit' | 'studio' | 'transition';

/** Première ligne du message : garantit les 20 caractères minimum exigés par l'intake. */
export const SERVICE_LABELS: Record<IntakeService, string> = {
  devis: 'Demande de devis POLIVIA',
  audit: 'Réservation d’un audit IA POLIVIA',
  studio: 'Maquette du Studio POLIVIA',
  transition: 'Transition depuis un autre prestataire',
};

/** L'intake exige une « commune des travaux » dans la liste du site ; POLIVIA ne la demande pas. */
// ponytail: valeur fixe déclarée dans intake-site.json ; à retirer quand l'intake rendra la commune facultative par site.
export const TOWN_NOT_ASKED = 'Non demandée';

/** Le consentement Transition, repris tel quel : c'est aussi le `consentText` à déclarer dans intake-site.json. */
export const CONSENT_TEXT = 'Je demande à POLIVIA de me recontacter au sujet de ce projet.';

export function intakeFields(r: {
  service: IntakeService;
  name: string;
  email: string;
  phone?: string;
  consent: boolean;
  lines: (string | false | null | undefined)[];
}): Record<string, string> {
  return {
    name: r.name.trim(),
    email: r.email.trim(),
    phone: (r.phone ?? '').trim(),
    town: TOWN_NOT_ASKED,
    service: r.service,
    message: [SERVICE_LABELS[r.service], ...r.lines].filter(Boolean).join('\n').slice(0, 5000),
    consent: r.consent ? 'oui' : '', // jamais forcé : sans case cochée, l'intake refuse (422)
  };
}

/** Mêmes règles que l'intake, vérifiées avant de quitter la page (un refus 422 ferait perdre la saisie). */
export function intakeErrors(f: Record<string, string>): string[] {
  const e: string[] = [];
  const name = f.name ?? '';
  const email = (f.email ?? '').toLowerCase();
  const message = f.message ?? '';
  if (name.length < 2 || name.length > 120) e.push('Indiquez votre nom (2 à 120 caractères).');
  if (email.length > 254 || !/^[^@\s]{1,64}@[^@\s]+\.[a-z]{2,}$/.test(email)) e.push('Indiquez une adresse e-mail valide.');
  if (f.phone && !/^[+0-9 ().-]{6,20}$/.test(f.phone)) e.push('Le numéro de téléphone ne peut contenir que des chiffres, espaces, + ( ) . -');
  if (message.length < 20 || message.length > 5000) e.push('Le message doit faire entre 20 et 5 000 caractères.');
  if (f.consent !== 'oui') e.push('Cochez la case pour que nous puissions vous recontacter.');
  return e;
}

/** Soumission native : le navigateur quitte la page, l'intake répond 303 (succès) ou une page d'erreur.
 *  `onBack` : retour arrière restauré depuis le cache (bfcache), pour réactiver le bouton « Envoi… ». */
export function postToIntake(endpoint: string, fields: Record<string, string>, onBack: () => void): void {
  const form = document.createElement('form');
  window.addEventListener('pageshow', (e) => e.persisted && (form.remove(), onBack()), { once: true });
  form.method = 'post';
  form.enctype = 'multipart/form-data';
  form.action = endpoint;
  form.hidden = true;
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement('textarea'); // garde les retours à la ligne, contrairement à <input>
    input.name = name;
    input.value = value;
    form.append(input);
  }
  document.body.append(form);
  form.submit();
}
