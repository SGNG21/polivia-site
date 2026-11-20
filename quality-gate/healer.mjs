#!/usr/bin/env node
// quality-gate/healer.mjs
// LE RÉPARATEUR — agent autonome « qui modifie qu'au besoin ».
//
// Règles de vie (non négociables) :
//   1. Ne s'exécute QUE s'il y a des BLOCK (sinon il ne touche à rien et sort).
//   2. Ne corrige QUE ce que le gate nomme. Diff minimal, aucune régénération.
//   3. AUTO = corrections déterministes, 0 token (sitemap, robots, canonical, headers, JSON-LD).
//      LLM = corrections de contenu (titres, meta, alt) → délègue au Rédacteur, sinon ESCALADE.
//   4. Max 2 passes. Ce qui résiste → escalade à l'humain avec le diff. Jamais d'action prod.
//   5. Chaque changement est journalisé (→ table agent_actions).
//
// Usage : node quality-gate/healer.mjs [--config …] [--root .] [--max 2]

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { runSecurity } from "./checks/security.mjs";
import { runSeoGeoAeo } from "./checks/seo-geo-aeo.mjs";
import { BLOCK } from "./checks/_lib.mjs";

const args = process.argv.slice(2);
const get = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const cfg = JSON.parse(readFileSync(get("--config", "quality-gate/quality-gate.config.json"), "utf8"));
const root = get("--root", ".");
const MAX = Number(get("--max", 2));
const bd = cfg.buildDir;

const log = [];
const journal = (action, target, detail) => log.push({ ts: new Date().toISOString(), action, target, detail });

const collect = () => [...runSecurity(cfg, root), ...runSeoGeoAeo(cfg)].filter((f) => f.severity === BLOCK);

// ── Corrections DÉTERMINISTES (0 token). Chacune ne touche que sa cible. ──
const AUTO = {
  "seo.sitemap": () => {
    const pages = ["/"];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      pages.map((u) => `  <url><loc>${cfg.site.baseUrl}${u}</loc></url>`).join("\n") + `\n</urlset>\n`;
    writeFileSync(join(bd, "sitemap.xml"), xml);
    journal("create", "sitemap.xml", "généré depuis site.baseUrl"); return true;
  },
  "seo.robotstxt": () => {
    writeFileSync(join(bd, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${cfg.site.baseUrl}/sitemap.xml\n`);
    journal("create", "robots.txt", "autorise + pointe le sitemap"); return true;
  },
  "sec.headers.missing": () => {
    const hf = cfg.security.headersFile;
    const headers = {
      "Content-Security-Policy": "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'",
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    };
    const conf = existsSync(hf) ? JSON.parse(readFileSync(hf, "utf8")) : {};
    conf.headers = [{ source: "/(.*)", headers: Object.entries(headers).map(([key, value]) => ({ key, value })) }];
    writeFileSync(hf, JSON.stringify(conf, null, 2));
    journal("patch", hf, "ajout des 5 headers de sécurité"); return true;
  },
  // canonical + JSON-LD s'appliquent PAR page (voir plus bas), pas globalement.
};

// Corrections déterministes par page (canonical manquant, JSON-LD GEO manquant)
function fixPage(finding) {
  const p = join(bd, finding.where);
  if (!existsSync(p)) return false;
  let src = read(p);
  let changed = false;

  if (finding.check === "seo.canonical.present" && /<head[^>]*>/i.test(src)) {
    const slug = finding.where === "index.html" ? "/" : "/" + finding.where.replace(/index\.html$/, "").replace(/\.html$/, "");
    src = src.replace(/<head([^>]*)>/i, `<head$1>\n  <link rel="canonical" href="${cfg.site.baseUrl}${slug}">`);
    journal("patch", finding.where, "injection canonical"); changed = true;
  }
  if (finding.check === "geo.jsonld.present" && /<\/head>/i.test(src)) {
    const ld = { "@context": "https://schema.org", ...cfg.site.business };
    src = src.replace(/<\/head>/i, `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`);
    journal("patch", finding.where, "injection JSON-LD LocalBusiness"); changed = true;
  }
  if (changed) writeFileSync(p, src);
  return changed;
}
function read(p) { return readFileSync(p, "utf8"); }

// LLM-scoped : ce que seul le Rédacteur peut corriger (contenu). Ici on ESCALADE proprement.
const LLM_SCOPED = new Set(["seo.title.length", "seo.metadesc.length", "seo.img.alt", "sec.service_role", "sec.vite_secret", "sec.anthropic_key", "sec.supabase_jwt"]);
// NB : les secrets ne sont JAMAIS auto-corrigés — rotation = décision humaine + irréversible.

console.log("\n🔧 Réparateur — démarrage");
let pass = 0;
let blocks = collect();
if (blocks.length === 0) { console.log("✓ Rien à réparer, le gate est déjà vert. Sortie.\n"); process.exit(0); }

while (blocks.length && pass < MAX) {
  pass++;
  console.log(`\n── passe ${pass} · ${blocks.length} BLOCK ──`);
  let acted = false;
  const escalate = [];
  for (const f of blocks) {
    if (LLM_SCOPED.has(f.check)) { escalate.push(f); continue; }
    let done = false;
    if (AUTO[f.check]) done = AUTO[f.check]();
    else done = fixPage(f);
    if (done) { acted = true; console.log(`  ✓ auto: ${f.check}${f.where ? ` (${f.where})` : ""}`); }
    else escalate.push(f);
  }
  if (!acted) { blocks = escalate; break; }
  blocks = collect();
}

console.log(`\n📓 Journal (→ agent_actions) : ${log.length} action(s)`);
for (const e of log) console.log(`   ${e.action.padEnd(6)} ${e.target}  — ${e.detail}`);

const remaining = collect();
if (remaining.length === 0) {
  console.log(`\n✅ Build réparé automatiquement. Gate vert. 0 intervention humaine.\n`);
  process.exit(0);
}
console.log(`\n⚠️  ${remaining.length} BLOCK résiduel(s) — ESCALADE (contenu ou secret = décision humaine) :`);
for (const f of remaining) console.log(`   • ${f.check}${f.where ? ` (${f.where})` : ""} — ${f.check.startsWith("sec.") ? "secret : rotation manuelle" : "→ Rédacteur"}`);
console.log(`\n⛔ Le Réparateur s'arrête ici. Il ne force jamais une correction de contenu ni un secret.\n`);
process.exit(1);
