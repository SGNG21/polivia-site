import { useState } from 'react';
import { brand, pricing } from '../content/site';

/**
 * Le Studio POLIVIA — parcours brief → maquette → validation → commande,
 * d'après la section 05 du prototype V5. Contrairement au prototype (qui
 * n'envoie rien nulle part), l'étape commande envoie une vraie demande par
 * le même circuit honnête que QuoteForm.tsx : repli mailto tant qu'aucun
 * VITE_FORM_ENDPOINT n'est configuré, jamais de faux succès.
 *
 * Règles locales déterministes pour générer la maquette (pas de génération
 * IA connectée) : on reformule simplement ce que l'utilisateur a saisi.
 */

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

type Step = 'brief' | 'edit' | 'approve' | 'order' | 'done';

type Brief = { business: string; sector: string; city: string; services: string; positioning: string; email: string };
type EditState = { title: string; subtitle: string; cta: string; services: string; palette: 'azur' | 'sauge' | 'charbon' | 'terracotta' };

const EMPTY_BRIEF: Brief = { business: '', sector: '', city: '', services: '', positioning: 'Professionnel, rassurant, accessible', email: '' };
const SAMPLE_BRIEF: Brief = {
  business: 'Atelier Martin',
  sector: 'Plomberie',
  city: 'Auxerre',
  services: 'Dépannage, installations, salle de bain',
  positioning: 'Professionnel, rassurant, accessible',
  email: 'contact@atelier-martin.fr',
};

function deriveEdit(b: Brief): EditState {
  const services = b.services
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    title: b.business && b.sector ? `${b.business} — ${b.sector} à ${b.city || 'votre ville'}` : 'Une belle vitrine pour une entreprise qui mérite d’être vue.',
    subtitle: b.services ? `${b.services}. Un interlocuteur unique, de la demande au suivi.` : 'Votre activité, vos valeurs et vos prestations prendront forme ici.',
    cta: 'Demander un devis',
    services: services.length ? services.join(', ') : 'Votre savoir-faire, Vos prestations, Votre proximité',
    palette: 'azur',
  };
}

const PALETTES: { value: EditState['palette']; label: string }[] = [
  { value: 'azur', label: 'Azuré — Bleu nuit et glacier' },
  { value: 'sauge', label: 'Sauge — Nature et élégance' },
  { value: 'charbon', label: 'Charbon — Noir et ivoire' },
  { value: 'terracotta', label: 'Terre — Chaleureux et authentique' },
];

export default function Studio() {
  const [step, setStep] = useState<Step>('brief');
  const [brief, setBrief] = useState<Brief>(EMPTY_BRIEF);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [version, setVersion] = useState(1);
  const [approved, setApproved] = useState(false);
  const [plan, setPlan] = useState<(typeof pricing)[number]['slug']>('essentiel');
  const [term, setTerm] = useState<'yearly' | 'monthly'>('yearly');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const steps: { key: Step; label: string }[] = [
    { key: 'brief', label: 'Votre activité' },
    { key: 'edit', label: 'Votre maquette' },
    { key: 'approve', label: 'Votre validation' },
    { key: 'order', label: 'Votre commande' },
  ];
  const stepIndex = steps.findIndex((s) => s.key === step);

  function reset() {
    setStep('brief');
    setBrief(EMPTY_BRIEF);
    setEdit(null);
    setVersion(1);
    setApproved(false);
    setPlan('essentiel');
    setTerm('yearly');
    setSendError(null);
  }

  function onBriefSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Brief = {
      business: String(data.get('business') ?? '').trim(),
      sector: String(data.get('sector') ?? '').trim(),
      city: String(data.get('city') ?? '').trim(),
      services: String(data.get('services') ?? '').trim(),
      positioning: String(data.get('positioning') ?? EMPTY_BRIEF.positioning),
      email: String(data.get('email') ?? '').trim(),
    };
    setBrief(next);
    setEdit(deriveEdit(next));
    setStep('edit');
  }

  function onEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setEdit({
      title: String(data.get('title') ?? '').trim(),
      subtitle: String(data.get('subtitle') ?? '').trim(),
      cta: String(data.get('cta') ?? '').trim() || 'Demander un devis',
      services: String(data.get('services') ?? '').trim(),
      palette: (String(data.get('palette') ?? 'azur') as EditState['palette']),
    });
    setVersion((v) => v + 1);
  }

  async function onOrderConfirm() {
    setSending(true);
    setSendError(null);

    const tier = pricing.find((t) => t.slug === plan);
    const payload = {
      intent: 'studio',
      business: brief.business,
      sector: brief.sector,
      city: brief.city,
      services: brief.services,
      positioning: brief.positioning,
      email: brief.email,
      plan,
      planName: tier?.name,
      term,
      amount: tier ? (term === 'yearly' ? tier.yearly : tier.monthly) : null,
      version,
      page: window.location.pathname,
      at: new Date().toISOString(),
    };

    if (!ENDPOINT) {
      const body = [
        `Entreprise : ${payload.business} (${payload.sector}, ${payload.city})`,
        `Prestations : ${payload.services}`,
        `Formule souhaitée : ${payload.planName} — ${payload.amount} € HT/mois (${term === 'yearly' ? '12 mois' : 'sans engagement'})`,
        '',
        `Maquette version ${version}.`,
      ].join('\n');
      window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent('Ma maquette POLIVIA — ' + payload.business)}&body=${encodeURIComponent(body)}`;
      setSending(false);
      setStep('done');
      return;
    }

    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(String(res.status));
      setStep('done');
    } catch {
      setSendError(`L’envoi a échoué. Écrivez-nous directement à ${brand.email} — votre maquette version ${version} est prête, nous la retrouvons avec les informations ci-dessus.`);
    } finally {
      setSending(false);
    }
  }

  const e = edit ?? deriveEdit(EMPTY_BRIEF);
  const serviceTiles = e.services.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);

  return (
    <section className="atelier-section" id="atelier">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow dark-eyebrow">05 / LE STUDIO POLIVIA</div>
            <h2>Votre prochain site commence ici.</h2>
            <p>Un parcours en quatre étapes. Règles locales déterministes pour l'instant : la génération IA n'est pas encore branchée, rien n'est inventé au-delà de ce que vous saisissez.</p>
          </div>
          <button type="button" className="link-button" onClick={reset}>
            ↻ Nouveau projet
          </button>
        </div>

        <div className="journey" aria-label="Étapes du parcours">
          {steps.map((s, i) => (
            <div key={s.key} className={`journey-step${s.key === step ? ' active' : ''}${i < stepIndex ? ' done' : ''}`}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <strong>{s.label}</strong>
            </div>
          ))}
        </div>

        <div className="workbench">
          <div>
            {step === 'brief' && (
              <div className="panel">
                <div className="panel-top">
                  <span className="step-label">ÉTAPE 01</span>
                  <span className="chip">Aucun paiement</span>
                </div>
                <h3>Parlez-nous de votre entreprise.</h3>
                <p className="panel-sub">Quelques informations suffisent pour préparer une première proposition.</p>
                <form onSubmit={onBriefSubmit}>
                  <label htmlFor="st-business">
                    Nom de l'entreprise
                    <input id="st-business" name="business" defaultValue={brief.business} placeholder="Ex. Atelier Martin" required minLength={2} maxLength={80} />
                  </label>
                  <div className="form-row">
                    <label htmlFor="st-sector">
                      Votre métier
                      <input id="st-sector" name="sector" defaultValue={brief.sector} placeholder="Ex. Plomberie" required minLength={2} maxLength={100} />
                    </label>
                    <label htmlFor="st-city">
                      Votre ville
                      <input id="st-city" name="city" defaultValue={brief.city} placeholder="Ex. Auxerre" required minLength={2} maxLength={90} />
                    </label>
                  </div>
                  <label htmlFor="st-services">
                    Vos principales prestations
                    <textarea id="st-services" name="services" defaultValue={brief.services} rows={3} required minLength={4} maxLength={350} placeholder="Ex. Dépannage, installations, salle de bain" />
                  </label>
                  <label htmlFor="st-positioning">
                    Le ton de votre marque
                    <select id="st-positioning" name="positioning" defaultValue={brief.positioning}>
                      <option value="Professionnel, rassurant, accessible">Sérieux et rassurant</option>
                      <option value="Haut de gamme, précis, contemporain">Premium contemporain</option>
                      <option value="Humain, local, chaleureux">Proche et chaleureux</option>
                      <option value="Efficace, direct, réactif">Direct et efficace</option>
                    </select>
                  </label>
                  <label htmlFor="st-email">
                    E-mail de contact
                    <input id="st-email" name="email" type="email" defaultValue={brief.email} required maxLength={190} placeholder="contact@monentreprise.fr" />
                  </label>
                  <div className="form-actions">
                    <button type="button" className="btn btn-muted" onClick={() => setBrief(SAMPLE_BRIEF)}>
                      Remplir un exemple
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Créer mon aperçu ↗
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'edit' && (
              <div className="panel">
                <div className="panel-top">
                  <span className="step-label">ÉTAPE 02</span>
                  <span className="chip">VERSION {version}</span>
                </div>
                <h3>Un site qui vous ressemble.</h3>
                <p className="panel-sub">Modifiez votre projet. Chaque changement crée une version traçable.</p>
                <form onSubmit={onEditSubmit}>
                  <label htmlFor="st-title">
                    Titre principal
                    <input id="st-title" name="title" defaultValue={e.title} required minLength={4} maxLength={110} />
                  </label>
                  <label htmlFor="st-subtitle">
                    Texte de présentation
                    <textarea id="st-subtitle" name="subtitle" defaultValue={e.subtitle} rows={4} required minLength={10} maxLength={250} />
                  </label>
                  <label htmlFor="st-cta">
                    Bouton principal
                    <input id="st-cta" name="cta" defaultValue={e.cta} required minLength={3} maxLength={50} />
                  </label>
                  <label htmlFor="st-palette">
                    Ambiance visuelle
                    <select id="st-palette" name="palette" defaultValue={e.palette}>
                      {PALETTES.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </label>
                  <label htmlFor="st-services-edit">
                    Prestations (séparées par une virgule)
                    <textarea id="st-services-edit" name="services" defaultValue={e.services} rows={3} />
                  </label>
                  <button type="submit" className="btn btn-primary btn-full">
                    Appliquer les modifications ↗
                  </button>
                  <button type="button" className="btn btn-muted btn-full secondary-action" onClick={() => setStep('approve')}>
                    Passer à la validation →
                  </button>
                </form>
              </div>
            )}

            {step === 'approve' && (
              <div className="panel">
                <div className="panel-top">
                  <span className="step-label">ÉTAPE 03</span>
                  <span className="chip">VALIDATION CLIENT</span>
                </div>
                <h3>Votre maquette vous plaît ?</h3>
                <p className="panel-sub">Vérifiez attentivement le rendu. Votre accord portera sur la version exacte présentée.</p>
                <div className="approval-card">
                  <span className="approval-icon">✓</span>
                  <div>
                    <strong>{brief.business || 'Votre site'}</strong>
                    <small>Version {version} · {approved ? 'validée' : 'non validée'}</small>
                  </div>
                </div>
                <label className="checkbox-line">
                  <input type="checkbox" checked={approved} onChange={(ev) => setApproved(ev.target.checked)} />
                  <span>Je valide cette version de la maquette comme base du site à produire.</span>
                </label>
                <button type="button" className="btn btn-primary btn-full" disabled={!approved} onClick={() => setStep('order')}>
                  Valider cette maquette ↗
                </button>
                <button type="button" className="btn btn-muted btn-full secondary-action" onClick={() => setStep('edit')}>
                  ← Revenir aux modifications
                </button>
              </div>
            )}

            {step === 'order' && (
              <div className="panel">
                <div className="panel-top">
                  <span className="step-label">ÉTAPE 04</span>
                  <span className="chip">SANS ENCAISSEMENT</span>
                </div>
                <h3>Choisissez votre formule.</h3>
                <p className="panel-sub">Les tarifs ci-dessous sont ceux affichés plus haut sur le site. Aucune carte bancaire n'est demandée ici : cette étape envoie une demande, pas une commande.</p>
                <div className="pricing-select">
                  {pricing.map((t) => (
                    <label className="select-card" key={t.slug}>
                      <input type="radio" name="st-plan" checked={plan === t.slug} onChange={() => setPlan(t.slug)} />
                      <span>
                        <strong>{t.name}</strong>
                        <small>{t.includes.slice(0, 2).join(', ')}</small>
                      </span>
                    </label>
                  ))}
                </div>
                <label htmlFor="st-term">
                  Type d'abonnement
                  <select id="st-term" value={term} onChange={(ev) => setTerm(ev.target.value as 'yearly' | 'monthly')}>
                    <option value="yearly">12 mois minimum · tarif réduit</option>
                    <option value="monthly">Sans engagement · tarif libre</option>
                  </select>
                </label>
                <div className="total-card">
                  <span>Votre demande</span>
                  <strong>
                    {pricing.find((t) => t.slug === plan)?.[term]} € <small>HT/mois</small>
                  </strong>
                </div>
                <p className="small-note">Il s'agit d'une demande, pas d'un engagement : un devis précis et un contrat suivent un échange humain.</p>
                {sendError && <p className="form-error">{sendError}</p>}
                <button type="button" className="btn btn-primary btn-full" disabled={sending} onClick={onOrderConfirm}>
                  {sending ? 'Envoi…' : 'Préparer ma commande ↗'}
                </button>
              </div>
            )}

            {step === 'done' && (
              <div className="panel">
                <div className="completion-mark">✓</div>
                <span className="step-label">DEMANDE ENVOYÉE</span>
                <h3>Votre projet est prêt pour la prochaine étape.</h3>
                <p className="panel-sub">Votre maquette et votre choix commercial ont été transmis. Un contrat et un paiement réel ne sont jamais engagés automatiquement : la suite se discute avec vous.</p>
                <div className="summary-list">
                  <strong>{brief.business}</strong> — {brief.sector}, {brief.city}
                  <br />
                  Formule : {pricing.find((t) => t.slug === plan)?.name} ({term === 'yearly' ? '12 mois' : 'sans engagement'})
                </div>
                <button type="button" className="btn btn-muted btn-full" onClick={reset}>
                  Créer un autre projet →
                </button>
              </div>
            )}
          </div>

          <div className="preview-space">
            <div className="preview-header">
              <div>
                <span className="small-cap">LIVE SITE PREVIEW</span>
                <h3>Votre future vitrine</h3>
              </div>
              <div className="device-switch">
                <button type="button" className={device === 'desktop' ? 'active' : ''} aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}>
                  Bureau
                </button>
                <button type="button" className={device === 'mobile' ? 'active' : ''} aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')}>
                  Mobile
                </button>
              </div>
            </div>
            <div className={`site-frame${device === 'mobile' ? ' mobile' : ''}`} data-palette={e.palette === 'azur' ? undefined : e.palette}>
              <div className="site-navbar">
                <span>{brief.business || 'VOTRE MARQUE'}</span>
                <span>Accueil　Services　Contact</span>
              </div>
              <div className="site-body">
                <div className="site-kicker">
                  Bienvenue chez nous <span className="site-slash">/</span> {brief.sector || 'votre entreprise locale'}
                </div>
                <h2>{e.title}</h2>
                <p>{e.subtitle}</p>
                <div className="site-cta">
                  {e.cta} <span>↗</span>
                </div>
              </div>
              <div className="site-services">
                <div className="site-services-label">NOS EXPERTISES</div>
                <div className="services-grid">
                  {(serviceTiles.length ? serviceTiles : ['Votre savoir-faire', 'Vos prestations', 'Votre proximité']).map((s) => (
                    <div className="service-tile" key={s}>
                      {s} <span>↗</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="site-footer">
                <span>Un site POLIVIA</span>
                <span>Prévisualisation non publiée</span>
              </div>
            </div>
            <div className="preview-foot">
              <span>
                <span className="signal green" aria-hidden="true" /> Aperçu en direct
              </span>
              <span>Version {version}</span>
            </div>
          </div>
        </div>
        <p className="workbench-foot">Parcours local : rien n'est publié tant que vous ne validez pas de devis avec nous. Pas de compte, pas de paiement dans cette étape.</p>
      </div>
    </section>
  );
}
