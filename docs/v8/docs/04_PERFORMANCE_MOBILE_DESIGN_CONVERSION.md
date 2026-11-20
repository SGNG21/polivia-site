# 04 — Niveau premium : visuel, mouvement, UX, conversion et performance

## DA sur chaque métier
- BrandProfile séparé des tokens POLIVIA (V5 réservé à la marque) : palette justifiée, contraste, système typo, iconographie, composition, hiérarchie, image de marque, références/anti-références, grille et motion tokens.
- Trois directions test distinctes et examinées par un reviewer ; pas de « variation de couleur » sur un même template vendu comme personnalisation.
- Les preuves client sont vraies, attribuées et autorisées. Ce qui est en démonstration doit être étiqueté comme fictif.

## Motion et 3D
- Motion for React seulement si utile (apparition sobre, feedback, transition de panneaux). Pas de parallaxe continue épuisante, pas de scroll hijacking, pas d'éléments qui bougent au détriment du formulaire.
- Respect `prefers-reduced-motion`, pas de flash, pas d'animation infinie bloquante ; CPU/GPU et coût JS plafonnés ; option désactivation sur appareil lent.
- Three.js/React Three Fiber/Drei seulement après comparaison A/B, fallback statique et contrôle budget/performance/accessibilité. Aucun site client obligé d'accepter la 3D.

## Performance : mesures honnêtes
- Objectifs **Core Web Vitals terrain au 75e percentile** : LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1 (sur population appropriée et volume suffisant).
- **Lighthouse mobile ≥90** : objectif interne de labo pour site standard, distinct des Core Web Vitals ; analyser contexte d'exécution, 3 runs, variance et causes. Pas de score affiché si pas mesuré.
- Budget initial par page : route critique minimale, JS non requis différé, sous-ensembles de fontes, images/vidéos dimensionnées, chargements tiers bornés, cache et SSR/SSG si adapté. Mesurer TTFB, transfert total, JS hydratation, INP éventuel.
- Test de référence : cold cache, réseau contraint, mobiles Android milieu de gamme et Safari iOS réel si possible ; recontrôle après intégration analytics/cookie banner.

## Accessibilité
- Cible interne **WCAG 2.2 AA**, obligations RGAA selon applicabilité juridique réelle ; pas revendiquer conformité complète sur simple score automatique.
- Parcours clavier de bout en bout, focus visible, titres/logique landmarks, libellés, erreurs explicites, notifications accessibles, contraste, tailles des cibles tactiles, zoom, lecture sans mouvements, alt, médias sous-titrés/transcrits lorsque nécessaires.
- Lecteur d'écran sur navigation, formulaire, cookies et validation d'édition ; axe-core détecte une partie seulement des défauts.

## Conversion
- Le premier écran répond à : « pour qui », « quel service », « dans quelle zone », « pourquoi faire confiance », « quelle action ». CTA mobile lisible et fonctionnel, téléphone cliquable, formulaire simple et non intrusif, confidentialité visible, preuve de délivrabilité.
- Événements de conversion nommés et validés : `cta_click`, `contact_submit_success`, `call_click`, `quote_request_success`. L'événement « formulaire affiché » n'est pas une vente.
- Tracking consenti/nécessaire seulement selon finalité et base juridique ; éviter les dashboards manipulés par chiffres simulés.
- Mesure post-lancement : erreurs abandons, délivrabilité, sources de leads autorisées, qualité des demandes, temps de réponse POLIVIA, expérimentations réversibles et pas de dark patterns.
