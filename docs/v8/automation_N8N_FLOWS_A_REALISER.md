# Définition des automatisations n8n utiles à la Site Factory

**Tous les workflows sont des propositions à intégrer après audit ciblé de l'instance existante.** Aucun workflow existant ne doit être supprimé, remplacé ou exposé publiquement pour « simplifier ».

| Code | Déclencheur fiable | Action | Déduplication | Erreur et reprise | Criticité |
|---|---|---|---|---|---|
| WF01 | `audit.completed` signé depuis outbox | lead Frappe + email rapport réel | audit_id | file DLQ + relance | P1 |
| WF02 | `lead.consented` | rappel consenti / tâche Frappe | lead_id+campaign | stop opposition | P1 |
| WF03 | `brief.validated` | demande pièces manquantes | brief_version | limite rappels | P2 |
| WF04 | `preview.ready` | notification client | preview_SHA | retry borné | P2 |
| WF05 | `subscription.entitled` backend | email onboarding | entitlement_id | échec sans modifier droits | P1 |
| WF06 | `release.review_requested` | notification reviewer | release_SHA | aucune publication | P1 |
| WF07 | `site.published` backend | kit mise en ligne/FAQ client | release_id | retry | P1 |
| WF08 | tâche hebdo calendrier | crawl domaine autorisé, liens cassés | domain+week | rate-limit | P2 |
| WF09 | rapport GSC autorisé | anomalies index, impressions/clics | property+month | pas de données fictives | P2 |
| WF10 | alerte réelle | contact/form email défaillant | incident_id | escalade immédiate | P0 surveillance |
| WF11 | échéance fournisseur | expiration DNS/certif | domain+expiry | alerte propriétaire | P1 |
| WF12 | événement paiement du backend | relance documentaire | invoice_event_id | aucune création de paiement | P1 |
| WF13 | ticket entrant | triage et assignation | ticket_id | escalade humaine | P1 |
| WF14 | incident publié | notification proportionnée au client | incident_id | journal et preuve | P1 |

**Contrats requis par workflow:** owner, environnement, service account scoping, purpose, audit logs masqués, retention, input schema, idempotence, trigger authenticité, coût maximal, anti-boucle, kill switch, alerte, test avec données synthétiques, runbook de rollback.
