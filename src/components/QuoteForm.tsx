import { useRef, useState } from 'react';
import { brand } from '../content/site';
import { CONSENT_TEXT, intakeErrors, intakeFields, postToIntake } from '../lib/intake';

/**
 * Quote request form.
 *
 * Delivery: a native multipart POST to VITE_FORM_ENDPOINT, the factory intake
 * (src/lib/intake.ts), which redirects to /demande-envoyee once the request is
 * stored. When that variable is absent — which is the case until the
 * endpoint is provisioned — it opens a prefilled e-mail and keeps the form as
 * typed: opening a mail client proves nothing was sent (it may not even open),
 * so it is never shown as a success. A form that looks like it worked and did
 * not is the worst outcome for a site whose only job is to generate requests.
 *
 * Anti-spam without a third-party captcha: a honeypot field no human can see
 * plus a minimum fill time. Both are free and neither punishes the visitor.
 */

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
const MIN_FILL_MS = 2500;

const sectors = [
  'Bâtiment, rénovation',
  'Artisanat',
  'Commerce, institut',
  'Services aux entreprises',
  'Transport',
  'Santé, bien-être',
  'Autre',
];

type Status = { kind: 'idle' | 'sending' | 'error'; message?: string };
type Errors = Partial<Record<'name' | 'email' | 'sector' | 'consent', string>>;

export default function QuoteForm({ intent = 'devis' }: { intent?: 'devis' | 'audit' }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<Errors>({});
  const mounted = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  function validate(data: FormData): Errors {
    const next: Errors = {};
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const sector = String(data.get('sector') ?? '');

    if (name.length < 2) next.name = 'Indiquez votre nom pour qu’on sache à qui répondre.';
    // Deliberately permissive: the server confirms deliverability, and an
    // over-strict pattern rejects valid addresses and costs a real lead.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = 'Cette adresse ne permettrait pas de vous répondre.';
    if (!sector) next.sector = 'Choisissez votre activité.';
    if (!data.get('consent')) next.consent = 'Cochez la case pour que nous puissions vous recontacter.';
    return next;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (String(data.get('company_url') ?? '')) return; // honeypot tripped
    if (Date.now() - mounted.current < MIN_FILL_MS) {
      // A human with autofill can be this fast: say so instead of doing nothing.
      setStatus({ kind: 'error', message: 'Envoi trop rapide : vérifiez vos informations puis renvoyez.' });
      return;
    }

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    const payload = {
      intent,
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      sector: String(data.get('sector') ?? ''),
      message: String(data.get('message') ?? '').trim(),
      page: window.location.pathname,
      at: new Date().toISOString(),
    };

    setStatus({ kind: 'sending' });

    if (!ENDPOINT) {
      // No collector wired yet: hand the lead to the mail client instead of
      // pretending to have sent it.
      const body = [
        `Nom : ${payload.name}`,
        `E-mail : ${payload.email}`,
        payload.phone && `Téléphone : ${payload.phone}`,
        `Activité : ${payload.sector}`,
        '',
        payload.message || '(pas de message)',
      ]
        .filter(Boolean)
        .join('\n');
      const subject = intent === 'audit' ? 'Réservation d’un audit IA' : 'Demande de devis';
      window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      setStatus({
        kind: 'error',
        message: `Votre messagerie devrait s’ouvrir avec la demande déjà rédigée : rien ne nous parvient tant que vous ne l’avez pas envoyée. Si rien ne s’ouvre, écrivez-nous à ${brand.email}.`,
      });
      return;
    }

    const fields = intakeFields({
      service: intent,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      consent: true, // checked by validate()
      lines: [`Activité : ${payload.sector}`, payload.message && `\n${payload.message}`, `Page : ${payload.page}`],
    });
    const refused = intakeErrors(fields);
    if (refused.length) {
      setStatus({ kind: 'error', message: refused.join(' ') });
      return;
    }
    // The browser leaves the page: the intake answers with /demande-envoyee or an error page.
    postToIntake(ENDPOINT, fields, () => setStatus({ kind: 'idle' }));
  }

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className="row">
        <Field id="name" label="Votre nom" error={errors.name} required>
          <input id="name" name="name" type="text" autoComplete="name" required
            aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
        </Field>
        <Field id="email" label="Votre e-mail" error={errors.email} required>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required
            aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
        </Field>
      </div>

      <div className="row">
        <Field id="phone" label="Téléphone" hint="Facultatif">
          <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" />
        </Field>
        <Field id="sector" label="Votre activité" error={errors.sector} required>
          <select id="sector" name="sector" required defaultValue=""
            aria-invalid={!!errors.sector} aria-describedby={errors.sector ? 'sector-err' : undefined}>
            <option value="" disabled>Choisir</option>
            {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <Field id="message" label="Votre projet en deux lignes" hint="Facultatif">
        <textarea id="message" name="message" rows={4}
          placeholder="Ce que vous faites, ce que vous aimeriez obtenir." />
      </Field>

      {/* Honeypot: off-screen, not display:none, and never announced. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="company_url">Ne pas remplir</label>
        <input id="company_url" name="company_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="field">
        <label className="transition-checkline">
          <input id="consent" name="consent" type="checkbox" required
            aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'consent-err' : undefined} />{' '}
          {CONSENT_TEXT}
        </label>
        {errors.consent && <span className="field-err small" id="consent-err">{errors.consent}</span>}
      </p>

      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={status.kind === 'sending'}>
        {status.kind === 'sending'
          ? 'Envoi…'
          : intent === 'audit'
            ? 'Réserver mon audit'
            : 'Envoyer ma demande'}
      </button>

      <p className="form-legal small">
        Réponse sous {brand.responseTime}. Vos informations servent uniquement à vous répondre,
        ne sont ni revendues ni utilisées pour de la prospection, et sont supprimées sur simple
        demande à <a className="inline-link" href={`mailto:${brand.email}`}>{brand.email}</a>.
      </p>

      <p className="form-error small" role="alert">
        {status.kind === 'error' ? status.message : ''}
      </p>
    </form>
  );
}

function Field({
  id, label, hint, error, required, children,
}: {
  id: string; label: string; hint?: string; error?: string; required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <p className="field">
      <label htmlFor={id}>
        {label}
        {hint && <span className="field-hint"> — {hint}</span>}
        {required && <span className="sr-only"> (obligatoire)</span>}
      </label>
      {children}
      {error && (
        <span className="field-err small" id={`${id}-err`}>
          {error}
        </span>
      )}
    </p>
  );
}
