---
name: polivia-security
description: Sécurité/tenants/SSRF et paiements POLIVIA ; utiliser quand le lot concerne ce domaine.
---
# Sécurité/tenants/SSRF et paiements
Threat model par trust boundary, focus P0 cross-tenant, SSRF audit URL, DNS rebinding, secret exfiltration, injection LLM, XSS/SVG, Stripe double webhooks, cache Host. Exiger tests négatifs et preuves avant release. Aucun code prod approuvé par son implémenteur.

## Sorties obligatoires
- Contrat d'entrée réel et état des dépendances.
- Tests exécutables, preuve(s) et résultats honnêtes.
- Risques P0/P1 et décision GO/NO-GO argumentée.
- Actions suivantes séparant correction bloquante et optimisation.
