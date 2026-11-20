# 07 — Légalité, cybersécurité, protection des données par site

## Légal par entreprise
- Mentions légales selon activité/régime, identité éditeur, coordonnées, immatriculation applicable, directeur de publication et hébergeur, informations activités réglementées si concernées.
- Politique confidentialité propre à chaque client : qui est responsable de traitement, quelles finalités/bases légales, sous-traitants, durée, droits et contact. CGV/CGU selon activité et actes réalisés, non des modèles universels non relus.
- Bandeau traceurs quand nécessaire : pas de traceur soumis à consentement avant choix ; accepter/refuser au même degré de simplicité ; modifier/retrait facile ; tests négatifs du refus.
- Formulaires : politique de collecte et minimisation, champs obligatoires clairement identifiés, base légale et consentement marketing distinct si requis ; DPA/SCC selon sous-traitance et transferts ; registre tenu côté entreprise selon obligation.
- Vérification humaine des mentions et documents sensibles avant vente; ne pas prétendre à une certification RGPD sur simple scan.

## Sécurité technique de la factory et des sites
- HTTPS HSTS avec stratégie réversible, CSP adaptée, headers de sécurité, contrôle CORS/CSRF selon architecture, uploads limités/scan, URL anti-SSRF, rate-limits, protection anti-abus, secrets serveur uniquement.
- Auth admin : MFA, RBAC, principe du moindre privilège, RLS tenant réellement testée et pas de service_role côté navigateur ; logs sans secrets ; historique immuable de publication/validation.
- DNS : contrôler possession, ne pas supprimer MX/SPF/DKIM/DMARC, vérifier SPF/DKIM/DMARC email transactionnel et protocole de réponse à incident.
- Dépendances et supply chain : licences, provenance, vulnérabilités, SBOM si utile, mises à jour avec PR/CI, rollback ; plugins externes non automatiquement dignes de confiance.
- Disponibilité : restauration de sauvegarde **testée**, surveillance TLS/domain/uptime/5xx/formulaires, pannes AI/backend indépendantes du front public ; RPO/RTO définis selon offre.
- Désabonnement/portabilité : nom de domaine au nom du titulaire convenu, export des données/contenus/médias sous droits, échéances et résiliation contractualisées ; éviter de confondre portabilité avec cession du code du produit SaaS POLIVIA.

## Juridique et obligations sectorielles
- Santé, finance, juridique, professions réglementées, alcool et autres secteurs à risque imposent revue spécifique ; n'importe quel JSON-LD ou texte IA ne suffit pas.
- RGAA : vérifier son applicabilité pour chaque client. WCAG 2.2 AA reste **notre objectif d'ingénierie** ; ne pas annoncer une conformité légale sans audit adapté.
