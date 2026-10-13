/**
 * Build-time prerender.
 *
 * The site is a Vite SPA, which crawlers index unreliably and which paints
 * nothing until JS executes. Rather than migrate the whole project to a
 * framework for the sake of server rendering, each route is rendered once at
 * build time to real HTML and hydrated in the browser. That is the smallest
 * change that fixes both SEO and first paint.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

const mod = await import(path.join(root, 'dist-ssr/entry-server.js'));
const { render, routes, brand, offers, audit, maintenance, STAGES } = mod;
const template = await readFile(path.join(dist, 'index.html'), 'utf8');

/* No font preloading here on purpose. Preloading the two latin faces was
   measured on Slow 4G with 4x CPU throttling and made LCP worse — 1889ms to
   2508ms — because two high-priority font requests compete for bandwidth with
   the render-blocking stylesheet. The fonts stay discovered via the CSS. */

async function emit(route, file) {
  const { head, body } = await render(route);
  const html = template
    .replace('</head>', `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body.replace(/^<div id="root">|<\/div>$/g, '')}</div>`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html, 'utf8');
  return head;
}

const SITEMAP_EXCLUDE = new Set(['/terrain']);
const indexable = [];

for (const route of routes) {
  // Written twice on purpose. `/contact.html` is what Vercel's cleanUrls
  // serves at `/contact`; `/contact/index.html` is what every other static
  // host (and `vite preview`) looks for. Without the flat file, a request
  // for `/contact` falls through to the SPA fallback and every route ships
  // the home page's HTML — which silently destroys the whole prerender.
  const head =
    route === '/'
      ? await emit(route, path.join(dist, 'index.html'))
      : await emit(route, path.join(dist, `${route.slice(1)}.html`));
  if (route !== '/') await emit(route, path.join(dist, route, 'index.html'));

  if (!SITEMAP_EXCLUDE.has(route) && !/name="robots"[^>]*noindex/.test(head)) {
    indexable.push(route);
  }
  console.log(`  prerendered ${route}`);
}

// 404 for hosts that serve it directly.
await emit('/__not-found__', path.join(dist, '404.html'));

const origin = 'https://polivia.fr';
const today = new Date().toISOString().slice(0, 10);

await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map(
    (r) =>
      `  <url><loc>${origin}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${r === '/' ? '1.0' : '0.7'}</priority></url>`,
  )
  .join('\n')}
</urlset>
`,
  'utf8',
);

await writeFile(
  path.join(dist, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /terrain

Sitemap: ${origin}/sitemap.xml
`,
  'utf8',
);

/* llms.txt — a plain statement of what this business is and where the facts
   live, for assistants that read it instead of crawling. Generated from the
   same content the pages use so it cannot drift. */
const price = (n) => `${n.toLocaleString('fr-FR')} €`;
await writeFile(
  path.join(dist, 'llms.txt'),
  `# ${brand.name}

> ${brand.promise}

Agence web et acquisition client fondée par ${brand.founder}, intervenant dans l'Yonne (89) et les Alpes-Maritimes (06). Un interlocuteur unique, de l'audit au suivi mensuel.

## Offres

${offers
  .map((o) => `- [${o.name}](${origin}/${o.slug}) : ${o.price.from ? 'dès ' : ''}${price(o.price.amount)}${o.price.then ? ` puis ${o.price.then}` : ''}. ${o.body}`)
  .join('\n')}
- [${audit.name}](${origin}/audit-ia) : ${price(audit.price)}. ${audit.body}
${maintenance.map((m) => `- Maintenance ${m.name} : ${price(m.price)}/mois. ${m.body}`).join('\n')}

## Méthode

Sept étapes, chacune produisant un livrable :

${STAGES.map((st, i) => `${i + 1}. ${st.name} — ${st.claim}. Vous recevez : ${st.output}.`).join('\n')}

## Pages

- [Accueil](${origin}/) : offres, méthode, réalisations, suivi.
- [Contact et devis](${origin}/contact) : demande de devis, réponse sous ${brand.responseTime}.

## Contact

- E-mail : ${brand.email}${brand.phone ? `\n- Téléphone : ${brand.phone}` : ''}
- Zones : ${brand.areas.map((a) => `${a.name} (${a.code})`).join(', ')}

## Notes

Aucune position dans les moteurs de recherche n'est garantie. Les tarifs ci-dessus sont des prix d'ancrage ; un devis précis suppose un échange.
`,
  'utf8',
);

console.log(`\n  ${routes.length} routes prerendered, ${indexable.length} in sitemap, llms.txt written.`);
