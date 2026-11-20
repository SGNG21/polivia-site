# 06 — CRM POLIVIA + n8n : automatismes utiles aux sites, sans SaaS superflu

## Frappe CRM = pilotage commercial **POLIVIA seulement**
- Prospection et capture des demandes, dédoublonnage par identité/consentement, pipeline qualification → audit → maquette → devis → signé → site live → suivi/renouvellement.
- Données Frappe : lead, source, offre, statut, souhait de date de transition, rappel consenti, commercial assigné ; pas de photos, mots de passe ou secrets de clients.
- Raccordement par adaptateur versionné et événements fiables, API authentifiée, scopes minimaux ; indisponibilité CRM ne bloque ni formulaires ni sites publiés.
- Le **CRM métier pour chaque client** est un futur SaaS ou option sur devis, non un composant obligatoire V8.

## n8n : processus NON transactionnels à construire
1. Nouvel audit terminé → notification prospect + activité Frappe.
2. Lead qualifié → tâche de relance selon consentement et politique commerciale.
3. Brief validé → demande de pièces manquantes ; pas de renouvellement de demande inutile.
4. Maquette disponible → invitation consultation, rappel non intrusif.
5. Contrat/abonnement confirmé **par le backend** → onboarding, création dossier client et notification.
6. Site prêt en staging → reviewer/PO alertés ; **pas de publication automatique par n8n**.
7. Site publié → confirmation, guide domaine et contact support.
8. SEO hebdo → crawl autorisé, erreurs réelles, contrôle sitemap/liens, alerte si régression.
9. Search Console disponible → synthèse mensuelle et anomalies basées sur données réelles.
10. Formulaire client en échec → alerte immédiate et ticket.
11. Domaine/certificat arrivant à échéance → alerte selon contrôle fournisseur.
12. Facture/abonnement impayé → notification selon règle métier validée, **aucun débit direct n8n**.
13. Ticket ouvert → attribution et escalade ; pas de promesse de délai non tenable.
14. Site dégradé/incident → alerte, incident et information client proportionnée.

## Règles d'automatisation
- **Un workflow = objectif, propriétaire, déclencheur, idempotency key, source, destinataire, durée de conservation, environnement, limitation, retry, traitement erreur et kill switch.**
- Sources d'événements fiables : DB transactionnelle et outbox, pas webhook public autorisé à faire croire à une commande payée.
- n8n existant : vérifier version, service, API, capacité, licences selon usage, sauvegardes et comptes ; workflows existants protégés ; créer dans namespace/projet/environnement séparé avec compte dédié.
- Exécution avec échantillons de test synthétiques ; jamais de campagne commerciale en masse sans revue GDPR et action approuvée.

## Commerce et support
- Stripe TEST uniquement jusqu'au GO. Afficher prix/engagements validés, plans, taxes, contrat, crédits/annulations/impayés ; rapprochement obligatoire.
- Facturation française via outil conforme retenu après vérification des obligations applicables ; facturation ≠ Frappe CRM.
- Support client : tickets, incident classifié, pièces et URLs, statut, consentement de communication, historique, propriétaire de résolution, mesures de réponse réalistes, archive exportable.
