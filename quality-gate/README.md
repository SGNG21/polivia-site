# DigitalOS Quality Gate

Le juge déterministe de l'usine à sites. Il **compile ta doctrine** (`STANDARD-003` SEO/GEO, `STANDARD-005` Sécurité) en checks pass/fail sur le **site rendu**, et **bloque la livraison** si un site n'est pas conforme.

> Ta douleur « je ne vérifie jamais 100% » vient de ce que la vérif vit dans des checklists qu'un humain doit lire. Ce gate la met dans du **code qui tourne tout seul, n'oublie rien, et coûte 0 token**.

Indépendant du framework : il audite le HTML/`dist` produit, pas ton code source. Marche avec Next.js, Vite, Astro, HTML statique.

---

## Ce qu'il vérifie

**Sécurité (`STANDARD-005`) — bloquant**
- Secrets `VITE_*` (KEY/SECRET/TOKEN…) → exposés au navigateur. Interdit.
- `service_role`, clé Anthropic `sk-ant-…`, JWT Supabase en dur → interdits dans source **et** bundle livré.
- Headers de sécurité (`CSP`, `HSTS`, `X-Frame-Options`…) dans `vercel.json`.

> Testé sur le repo `holding-ia` réel : **26 fuites détectées** (19 JWT, 2 service_role, 5 VITE_). Aucune ne serait passée.

**SEO / GEO (`STANDARD-003`) — bloquant**
- `<title>` 50–60, meta description 140–160, un seul `<h1>`, canonical absolu.
- `alt` sur images porteuses de sens, `sitemap.xml` + `robots.txt` présents, URLs propres.
- JSON-LD présent et parseable ; `LocalBusiness` avec `name`/`address`/`areaServed` (GEO local).

**AEO / qualité — avertissement**
- FAQ sans `FAQPage`, Open Graph incomplet, contenu < 300 mots sur pages stratégiques.

**Performance (Lighthouse CI)** — perf ≥ 90, SEO = 100, a11y ≥ 95, best-practices ≥ 95. Bloquant.

---

## Poser le gate sur un site (2 min)

```bash
# depuis la racine du repo du site
cp -r quality-gate .
cp -r .github/workflows/quality-gate.yml .github/workflows/
npm --prefix quality-gate install
```

Local, avant de pousser :
```bash
npm run build              # produit dist/ (ou out/ pour Next export → ajuster buildDir)
node quality-gate/run.mjs  # checks déterministes
npx lhci autorun --config=quality-gate/lighthouserc.json   # perf
```

En CI c'est automatique : chaque push déclenche le workflow. BLOCK ⇒ le job échoue ⇒ le deploy Vercel branché dessus ne part pas.

---

## Régler les seuils

Tout est dans `quality-gate/quality-gate.config.json`. `buildDir` : `dist` (Vite) ou `out` (Next export) ou `.next` selon le cas.

## Déroger (ton `Human-Override-Policy`)

Un BLOCK légitimement acceptable se déclare — il devient WARN tracé, jamais silencieux :

```json
"waivers": [
  { "check": "seo.content.min", "reason": "Landing mono-produit volontairement courte", "until": "2026-09-01" }
]
```

---

## Ce que le gate ne fait PAS

Il ne **génère** rien. Il juge. La génération (brief → maquette → build) reste à Claude / Claude Code, en amont. Séparation nette : le LLM crée (créatif, tokens justifiés), le gate vérifie (déterministe, 0 token). C'est ta doctrine — appliquée.
