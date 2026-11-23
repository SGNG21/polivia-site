import { useRef, useState } from 'react';
import { brand, transition } from '../content/site';
import { CONSENT_TEXT, intakeErrors, intakeFields, postToIntake } from '../lib/intake';

/**
 * Formulaire de transition concurrent — même discipline que QuoteForm.tsx :
 * honeypot + délai minimal, repli mailto tant qu'aucun VITE_FORM_ENDPOINT
 * n'est configuré, qui garde le formulaire rempli et ne s'affiche jamais
 * comme un succès (ouvrir la messagerie n'envoie rien).
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
const MIN_FILL_MS = 2500;

type Status = { kind: 'idle' | 'sending' | 'error'; message?: string };

export default function Transition() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const mounted = useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (String(data.get('company_url') ?? '')) return; // honeypot
    if (Date.now() - mounted.current < MIN_FILL_MS) {
      setStatus({ kind: 'error', message: 'Envoi trop rapide : vérifiez vos informations puis renvoyez.' });
      return;
    }
    if (!data.get('contact_consent')) return; // the browser already refused it (required checkbox)

    const payload = {
      intent: 'transition',
      company: String(data.get('company') ?? '').trim(),
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      website: String(data.get('website') ?? '').trim(),
      provider: String(data.get('provider') ?? '').trim(),
      contractEnd: String(data.get('contract_end') ?? '').trim(),
      contactChannel: String(data.get('contact_channel') ?? 'email'),
      message: String(data.get('message') ?? '').trim(),
      followupOptin: data.get('followup_optin') === 'on',
      marketingOptin: data.get('marketing_optin') === 'on',
      page: window.location.pathname,
      at: new Date().toISOString(),
    };

    setStatus({ kind: 'sending' });

    if (!ENDPOINT) {
      const body = [
        `Entreprise : ${payload.company}`,
        `Nom : ${payload.name}`,
        `E-mail : ${payload.email}`,
        payload.phone && `Téléphone : ${payload.phone}`,
        payload.website && `Site actuel : ${payload.website}`,
        payload.provider && `Prestataire actuel : ${payload.provider}`,
        payload.contractEnd && `Fin de contrat estimée : ${payload.contractEnd}`,
        '',
        payload.message || '(pas de message)',
      ]
        .filter(Boolean)
        .join('\n');
      window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent('Préparer ma transition')}&body=${encodeURIComponent(body)}`;
      setStatus({ kind: 'error', message: `Votre messagerie devrait s’ouvrir avec la demande déjà rédigée : rien ne nous parvient tant que vous ne l’avez pas envoyée. Si rien ne s’ouvre, écrivez-nous à ${brand.email}.` });
      return;
    }

    const yes = (b: boolean) => (b ? 'oui' : 'non');
    const fields = intakeFields({
      service: 'transition',
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      consent: true, // required checkbox, checked above
      lines: [
        `Entreprise : ${payload.company}`,
        payload.website && `Site actuel : ${payload.website}`,
        payload.provider && `Prestataire actuel : ${payload.provider}`,
        payload.contractEnd && `Fin de contrat estimée : ${payload.contractEnd}`,
        `Rappel avant la fin du contrat : ${yes(payload.followupOptin)}`,
        `Nouveautés et offres POLIVIA : ${yes(payload.marketingOptin)}`,
        payload.message && `\n${payload.message}`,
      ],
    });
    const refused = intakeErrors(fields);
    if (refused.length) {
      setStatus({ kind: 'error', message: refused.join(' ') });
      return;
    }
    postToIntake(ENDPOINT, fields, () => setStatus({ kind: 'idle' }));
  }

  return (
    <section className="transition-section" id="transition" aria-labelledby="transition-title">
      <div className="wrap transition-layout">
        <div className="transition-intro">
          <div className="eyebrow">{transition.eyebrow}</div>
          <h2 id="transition-title">
            {transition.title[0]}
            <br />
            <em>{transition.title[1]}</em>
          </h2>
          <p>{transition.body}</p>
          <div className="transition-promise">
            {transition.promise.map((p) => (
              <div key={p}>
                <span className="transition-check" aria-hidden="true">✓</span> {p}
              </div>
            ))}
          </div>
          <p className="transition-quote">{transition.quote}</p>
        </div>

        <div className="transition-card">
          <div className="transition-card-heading">
            <span className="transition-pill">{transition.cardBadge}</span>
          </div>
          <h3>{transition.cardTitle}</h3>
          <p className="transition-note">{transition.cardNote}</p>

          <form className="transition-form" onSubmit={onSubmit}>
            <div className="transition-form-row">
              <label htmlFor="tr-company">
                Entreprise *
                <input id="tr-company" name="company" autoComplete="organization" maxLength={120} minLength={2} required />
              </label>
              <label htmlFor="tr-name">
                Votre nom *
                <input id="tr-name" name="name" autoComplete="name" maxLength={120} minLength={2} required />
              </label>
            </div>
            <div className="transition-form-row">
              <label htmlFor="tr-email">
                E-mail professionnel *
                <input id="tr-email" name="email" type="email" autoComplete="email" maxLength={254} required />
              </label>
              <label htmlFor="tr-phone">
                Téléphone (facultatif)
                <input id="tr-phone" name="phone" type="tel" autoComplete="tel" maxLength={35} />
              </label>
            </div>
            <label htmlFor="tr-website">
              Votre site actuel (facultatif)
              <input id="tr-website" name="website" type="url" autoComplete="url" maxLength={2048} placeholder="https://www.votre-site.fr" />
            </label>
            <div className="transition-form-row">
              <label htmlFor="tr-provider">
                Prestataire actuel (facultatif)
                <input id="tr-provider" name="provider" maxLength={120} />
              </label>
              <label htmlFor="tr-contract-end">
                Fin de contrat estimée (si connue)
                <input id="tr-contract-end" name="contract_end" type="date" />
              </label>
            </div>
            <label htmlFor="tr-message">
              Votre besoin (facultatif)
              <textarea id="tr-message" name="message" rows={3} maxLength={1500} placeholder="Refonte, meilleure visibilité Google, CRM, facturation…" />
            </label>

            <div className="hp" aria-hidden="true">
              <label htmlFor="tr-company-url">Ne pas remplir</label>
              <input id="tr-company-url" name="company_url" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <label className="transition-checkline">
              <input id="tr-contact-consent" name="contact_consent" type="checkbox" required />
              <span>
                {CONSENT_TEXT} <strong>*</strong>
              </span>
            </label>
            <label className="transition-checkline">
              <input id="tr-followup-optin" name="followup_optin" type="checkbox" />
              <span>Je souhaite recevoir un rappel à l'approche de la fin de mon contrat.</span>
            </label>
            <label className="transition-checkline">
              <input id="tr-marketing-optin" name="marketing_optin" type="checkbox" />
              <span>Je souhaite recevoir des nouveautés et offres POLIVIA (facultatif).</span>
            </label>

            <button type="submit" className="btn btn-primary btn-full" disabled={status.kind === 'sending'}>
              {status.kind === 'sending' ? 'Envoi…' : 'Préparer ma transition ↗'}
            </button>
            <p className="transition-mini">
              Vos informations servent uniquement à vous répondre. Aucune résiliation ni migration n'est lancée sans votre accord explicite.
            </p>
            <div className="transition-result" role="status" aria-live="polite">
              {status.kind === 'error' ? status.message : ''}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
