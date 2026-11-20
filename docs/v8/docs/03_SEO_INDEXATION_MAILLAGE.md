# 03 — SEO industriel : découverte, indexabilité, maillage et visibilité mesurée

## Distinctions non négociables
`Publié` = accessible sur le Web. `Explorable` = les robots autorisés peuvent parcourir. `Indexable` = aucun blocage identifié et signaux cohérents. `Indexé` = présence confirmée via un outil de moteur/Google Search Console autorisé. `Visible` = impressions/clics/positions mesurés. **Aucune étape ne garantit la suivante.**

## A. Architecture et plan sémantique, avant le design
- Découper la proposition en **entités réelles** : métier → famille de services → service réel → preuve/réalisation → contact/zone ; chaque page a une intention principale et un rôle commercial.
- Créer `URL_MAP` : URL, type, cible, besoin utilisateur, mot-clé principal et variantes naturelles, statut indexation souhaité, page parente, canonical, données structurées justifiées, CTA, liens entrants et sortants pertinents.
- Corriger cannibalisation (plusieurs pages se disputant la même intention), duplication, pages sans valeur ; ne pas créer 50 pages « ville + métier » identiques. Un contenu unique pour un véritable service/territoire différencié seulement.
- URLs stables, lisibles, minuscules, slash convention décidée ; normaliser https/www ; aucun identifiant de session indexable ; paramètres maîtrisés.

## B. Maillage interne pensé comme graphe
- Toute page commerciale importante **doit être accessible via de vrais liens HTML `<a href>`** depuis la navigation, une rubrique, une page parente ou une ressource pertinente. Pas de liens uniquement en gestionnaire JS ou menu fermé inaccessible aux bots.
- Pages services : au moins un lien contextuel pertinent vers une page sœur, parent ou ressource complémentaire lorsque cela a du sens, un lien de conversion pertinent, et un retour structurel (breadcrumbs/navigation). **Ce n'est pas une règle magique de ranking** : pertinence > nombre arbitraire.
- Page accueil → grands services ; service principal → sous-services/preuves ; réalisations → service lié ; articles → service réellement associé ; pages locales → services opérés dans la zone réelle. Éviter liens circulaires artificiels et ancres sur-optimisées.
- Vérifier via crawl : **zéro page stratégique orpheline**, URLs essentielles atteignables idéalement en ≤3 clics depuis l'accueil selon la taille du site (objectif interne non officiel Google), ancres intelligibles, zéro lien interne 404/5xx, zéro renvoi vers staging, chaîne de redirections excessive signalée.
- Générer un `link_graph.json` avec sources, cibles, ancre, type et statut HTTP ; reviewer SEO valide sa cohérence. Le maillage évolue quand une nouvelle page est approuvée.

## C. Indexation technique
- Production : 200 HTML utile sur toutes pages déclarées indexables, aucun `noindex` involontaire, pas de `X-Robots-Tag` bloquant, pas de robots.txt qui masque les pages légitimes, canonical auto-cohérent, contenu visible dans HTML rendu, navigation crawlable.
- Staging : authentification d'accès ou blocage réel + `noindex` en défense complémentaire. **Un robots disallow seul n'empêche pas toujours une URL d'apparaître dans l'index** et peut empêcher Google de voir la directive noindex ; privilégier la protection par mot de passe.
- `sitemap.xml` uniquement URLs canoniques et publiables, `lastmod` exact quand disponible, exposition dans robots.txt, soumission Search Console avec accès du propriétaire ; XML valide.
- Canonicals : une seule version pour http/https, www/non-www, slash, UTM, doublons ; ne pas canoniser toutes les pages vers l'accueil. Redirections 301/308 de migration mappées, pas de boucles ni chaînes inutiles. Anciennes URLs valables préservées autant que possible.
- 404 réelles pour absences, pas de 200 « page introuvable » (soft 404), 410 quand disparition permanente et politique validée, liens cassés réparés. Pas d'URL encore en preview dans sitemap.
- Search Console : propriété vérifiée avec compte autorisé ; statut du sitemap, inspection de quelques URL représentatives, erreurs « explorée mais non indexée », canonical choisie et couverture ; enregistrer date de vérification, pas prétendre avoir accès sans OAuth.
- **L'API Google Indexing n'est pas un accélérateur pour des pages vitrines classiques** : usage limité aux cas documentés `JobPosting`/`BroadcastEvent` selon Google ; ne jamais l'utiliser pour contourner cette restriction.

## D. SEO on-page et éditorial
- `title` unique et utile, `meta description` unique attrayante (non garantie comme snippet), un H1 sémantique adapté, H2/H3 hiérarchiques, contenu expert rédigé pour le client, réponses à des questions réelles, sections lisibles, labels d'images, noms de fichiers descriptifs.
- Vérifier exactitude réglementaire : interdiction des faux diplômes, certifications, expériences, avis, adresse ou réalisations. Mettre en avant les preuves réellement fournies.
- Open Graph / Twitter cards adaptés, image partage licite, liens sociaux réels, `lang` HTML correct, `hreflang` seulement si traductions maintenues et pages alternatives réciproques.
- Schema.org JSON-LD seulement lorsque la donnée existe et que le type est pertinent (`Organization`, `LocalBusiness` si réel, `Service`, `BreadcrumbList` lorsque valide) ; passer Rich Results Test si type Google éligible. **Données structurées valides ≠ affichage enrichi garanti.**
- Google Business Profile : consentement du propriétaire, adresse/zone réelle, horaires/services/contact cohérents. Ne pas créer de faux points d'établissement. Mesurer local avec les données effectivement accessibles.

## E. GEO / moteurs IA
- Préférer clarté des entités, faits sourcés, contenu original, structure lisible, FAQ utile, mentions de marque exactes et éléments de confiance.
- Pas de « score IA garanti », pas de faux `llms.txt` présenté comme exigence Google, pas de promesse d'apparition dans ChatGPT/Gemini/AI Overviews. Les bonnes pratiques SEO usuelles restent la base.

## F. Assurance SEO avant/après
### Avant publication
Inventaire URLs, intentions, sitemap, robots, canonical, pages hors index, titre/meta/Hn, liens, 3xx/4xx, images, OG/schema, temps de chargement, vérif mobile, GSC prévue, redirections migration et sources. Scanner staging en navigateur non authentifié **si autorisé** sans indexer.
### Jour J
Vérification DNS/TLS, tests directs sur domaine final, suppression contrôlée `noindex` de prod, sitemap final, canonical propre, formulaires et email, redirections, capture de preuve par SHA ; envoyer sitemap GSC si autorisé.
### J+7 / J+14 / J+30 / mensuel
Mesurer erreurs Search Console, pages indexées réellement observables, pages « découverte/explorée non indexée », CWV terrain si données suffisantes, liens cassés, trafic et conversions **si consentement et collecte légitimes**, recommandations traçables ; correction sans déstabiliser les pages performantes.

## Limites Google documentées
Le sitemap ne garantit pas l'indexation ni le classement. Les liens HTML avec `href` améliorent la découvrabilité. Les pratiques de génération massive de contenu sans utilité peuvent relever du spam. La capacité à afficher des résultats enrichis n'est pas garantie même avec JSON-LD valide.
