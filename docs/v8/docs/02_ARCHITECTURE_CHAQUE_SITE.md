# 02 — Anatomie complète d'un site premium

## Discovery, offre et intention
- Identifier personne morale, SIREN/SIRET quand pertinent, adresse réellement publique, zone d'intervention effective, activités, horaires, contact, services, différenciation, saisonnalité, objectifs de leads et objections clients.
- Relever les pièces justificatives et valider les témoignages, labels, qualifications et photos ; aucun détail commercial inventé par IA.
- Pour une refonte : inventaire complet des anciennes URLs, pages qui performent, ressources à conserver, formulaires/trackers, backlinks majeurs connus, redirections et domaine propriétaire.
- Définir l'ICP (client idéal), intentions de recherche (informationnelles, commerciales, locales), arborescence, matrice pages × mots-clés, argumentaire et événements de conversion.

## Composants de base testés
Header accessible, logo, nav sticky seulement si non intrusive, footer légal complet, hero avec preuve et CTA, grille services, présentation, réalisations réelles, secteurs/zones, équipe réelle si approprié, avis publiables et consentis, FAQ utile, coordonnées, formulaire anti-spam utilisable, preuves/rassurance, boutons `tel:` et `mailto:` vérifiés ; blog uniquement si l'offre prévoit des contenus suivis.

## Variabilité réelle
Trois exemples industriels : bâtiment local = portfolio travaux + services + secteurs ; cabinet de conseil = crédibilité + méthodologie + références ; service à domicile = confiance, territoire réel et prise de contact rapide. Chaque direction artistique possède rythme, typographie, densité, iconographie et composition propres. POLIVIA conserve sa V5, **les clients non**.

## Contraintes de conception
- Design tokens versionnés, contraste mesuré, espacements cohérents, typographies licenciées et optimisées, médias légitimes ; état de chargement/erreur/vide conçu et testé.
- Favoriser HTML sémantique, composants SSR/SSG adaptés, transitions sobres, Motion seulement pour faciliter lecture/hiérarchie ; respecter `prefers-reduced-motion`.
- 3D seulement sur justification métier et benchmark mobile ; ne jamais rendre les formulaires, navigation ou SEO dépendants d'un canvas ou JS d'animation.
- Pas de glissement horizontal à 320, 375, 390, 768, 1024, 1440px ; test zoom 200%, clavier et lecteurs d'écran sur scénarios critiques.

## Standards media
Image srcset/sizes, WebP/AVIF si pertinent, image LCP préchargée seulement si utile, dimensions fixées et alt informatif/alt vide si décoratif, vidéos légères avec poster et lecture non imposée, consentement et licences média stockées. Aucune photo mensongèrement présentée comme réalisation du client.

## Livraison au client
Documentation simple : propriété nom de domaine, accès autorisés, informations visibles, qui peut éditer, limites des modifications, support, sauvegarde/rollback, renouvellements et export. Édition avec prévisualisation et validation, pas publication accidentelle d'un contenu non vérifié.
