# POLIVIA — site

Site vitrine et d'acquisition de POLIVIA (Yonne 89 · Alpes-Maritimes 06).

## Stack

React 19 · TypeScript · Vite · wouter · GSAP · three.js / React Three Fiber.
Pas de framework CSS : un système de tokens dans `src/styles.css`.

## Commandes

```
pnpm install
pnpm dev        # développement
pnpm build      # typecheck + build client + build SSR + prérendu
pnpm preview    # servir dist/
```

## Prérendu

`pnpm build` rend chaque route en HTML statique (`scripts/prerender.mjs`), puis le
navigateur hydrate. C'est ce qui donne au site des métadonnées par page et un
premier rendu sans JavaScript, sans migrer vers un framework SSR.

Chaque route est écrite **deux fois** : `contact.html` (servi par `cleanUrls` de
Vercel sur `/contact`) et `contact/index.html` (pour tout autre hébergeur
statique). Sans le fichier plat, une requête sur `/contact` retombe sur le
fallback SPA et toutes les routes servent le HTML de l'accueil.

`sitemap.xml`, `robots.txt` et `llms.txt` sont générés depuis `src/content/`.

## Contenu

Tous les faits commerciaux sont dans `src/content/site.ts` et
`src/content/system.ts`. Rien n'est écrit en dur dans les composants.

Les champs non confirmés valent `null` et l'interface s'adapte plutôt que
d'afficher un contenu inventé :

- `brand.phone` — en attente du vrai numéro. Le renseigner active le lien
  `tel:`, la barre mobile et `telephone` dans les données structurées.
- `founder.portrait` — en attente d'une vraie photo ; une plaque typographique
  s'affiche en attendant.
- `projects[].shot` / `.liveUrl` — en attente des captures réelles.

## Formulaire

`VITE_FORM_ENDPOINT` reçoit le lead en JSON (POST). Sans cette variable, le
formulaire ouvre un e-mail prérempli plutôt que de perdre silencieusement la
demande. Antispam : honeypot + délai minimum de saisie, sans captcha tiers.

## 3D

La scène (`src/hero/Assembly.tsx`) est chargée dynamiquement et seulement sur
les appareils qui peuvent la rendre (`src/lib/capability.ts`). Les téléphones,
`prefers-reduced-motion` et l'absence de WebGL reçoivent `public/hero-poster.webp`,
un rendu de la même scène.
