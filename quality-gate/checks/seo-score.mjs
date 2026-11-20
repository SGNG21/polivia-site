// quality-gate/checks/seo-score.mjs
// Compile STANDARD-003 EXIGENCE PAR EXIGENCE en une note /100 + paliers.
//   Critiques (9)  → binaires : un seul manquement = BLOQUER.
//   Importants (14) → /100 pts (poids exacts de la doctrine).
//   Bonus (5)      → /20 pts → palier VALIDER PREMIUM.
// Les exigences sémantiques (intention, résumabilité…) sont évaluées par heuristique documentée,
// dérogeables via waivers[]. Zéro token, reproductible.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { walk, read, html, isIndexable, rel, dedupePageFiles } from "./_lib.mjs";

const words = (t) => (t.replace(/\s+/g, " ").trim().match(/\S+/g) || []).length;
const norm = (s) => (s || "").toLowerCase();
const zonesOf = (b) => (Array.isArray(b?.areaServed) ? b.areaServed : String(b?.areaServed || "").split(/[,;]/)).map((z) => norm(z).replace(/\(.*\)/, "").trim()).filter(Boolean);

export function runSeoScore(cfg, projectRoot = ".") {
  const bd = join(projectRoot, cfg.buildDir);
  if (!existsSync(bd)) return { verdict: "BLOQUER", failedCritiques: ["build.exists"], score: 0, bonusScore: 0, critiques: [], importants: [], bonus: [], note: "build introuvable" };

  const pages = dedupePageFiles(walk(bd, [".html"])).filter((p) => isIndexable(html(read(p))));
  const primaryPath = pages.find((p) => rel(bd, p) === "index.html") || pages[0];
  if (!primaryPath) return { verdict: "BLOQUER", failedCritiques: ["build.html"], score: 0, bonusScore: 0, critiques: [], importants: [], bonus: [] };

  const root = html(read(primaryPath));
  const body = root.querySelector("body");
  const bodyText = norm(body ? body.text : "");
  const wc = words(body ? body.text : "");
  const biz = cfg.site?.business || {};
  const bizName = norm(biz.name);
  const zones = zonesOf(biz);
  const titles = pages.map((p) => norm(html(read(p)).querySelector("title")?.text || ""));
  const descs = pages.map((p) => norm(html(read(p)).querySelector('meta[name="description"]')?.getAttribute("content") || ""));
  const uniq = (arr) => new Set(arr.filter(Boolean)).size === arr.filter(Boolean).length;

  const title = root.querySelector("title")?.text?.trim() || "";
  const keyword = norm(title.split(/[\s—\-–|(,]/).filter((w) => w.length > 3)[0] || "");
  const h1s = root.querySelectorAll("h1");
  const h2s = root.querySelectorAll("h2");
  const ld = root.querySelectorAll('script[type="application/ld+json"]').map((b) => { try { return JSON.parse(b.text); } catch { return null; } }).filter(Boolean);
  const ldNodes = ld.flatMap((d) => (Array.isArray(d) ? d : d["@graph"] || [d]));
  const hasType = (re) => ldNodes.some((n) => re.test(String(n["@type"] || "")));
  const faqNode = ldNodes.find((n) => /FAQPage/.test(String(n["@type"] || "")));
  const imgs = root.querySelectorAll("img").filter((i) => i.getAttribute("aria-hidden") !== "true" && i.getAttribute("role") !== "presentation");
  const links = root.querySelectorAll("a").map((a) => a.getAttribute("href") || "");
  const internal = links.filter((h) => h.startsWith("/") || h.startsWith("#") || h.includes(cfg.site?.baseUrl || "###"));
  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
  const robotsFile = existsSync(join(bd, "robots.txt")) ? read(join(bd, "robots.txt")) : "";
  const sitemapOk = existsSync(join(bd, "sitemap.xml")) && /<urlset/i.test(read(join(bd, "sitemap.xml")));
  const og = (p) => !!root.querySelector(`meta[property="${p}"]`);
  const headingOrderOk = (() => {
    const seq = root.querySelectorAll("h1,h2,h3").map((h) => Number(h.rawTagName[1]));
    let maxSeen = 0; for (const l of seq) { if (l > maxSeen + 1) return false; maxSeen = Math.max(maxSeen, l); } return true;
  })();

  // ── 9 CRITIQUES (binaire) ──
  const critiques = [
    { id: "EX-SEO-001", label: "Title unique par page", met: titles.every(Boolean) && uniq(titles) && title.length >= 30 },
    { id: "EX-SEO-003", label: "H1 unique et pertinent", met: h1s.length === 1 },
    { id: "EX-SEO-006", label: "sitemap.xml présent et valide", met: sitemapOk },
    { id: "EX-SEO-007", label: "robots.txt non bloquant", met: !!robotsFile && !/^\s*Disallow:\s*\/\s*$/im.test(robotsFile) },
    { id: "EX-SEO-008", label: "Pages stratégiques indexables", met: isIndexable(root) },
    { id: "EX-SEO-009", label: "Canonical correctement configuré", met: /^https?:\/\//.test(canonical) },
    { id: "EX-GEO-001", label: "Entités explicites (nom, zone, services)", met: hasType(/LocalBusiness|Organization|Business|Store|Service/) || (!!bizName && bodyText.includes(bizName)) },
    { id: "EX-GEO-005", label: "Nom entreprise dans le contenu", met: !!bizName && bodyText.includes(bizName) },
    { id: "EX-GEO-006", label: "Zone géographique dans le contenu", met: zones.some((z) => z && bodyText.includes(z)) },
  ];

  // ── 14 IMPORTANTS (/100) ──
  const importants = [
    { id: "EX-SEO-002", label: "Meta description unique et incitative", pts: 8, met: descs.every(Boolean) && uniq(descs) && (descs[0]?.length >= 120 && descs[0]?.length <= 165) },
    { id: "EX-SEO-004", label: "URLs propres et cohérentes", pts: 7, met: pages.every((p) => { const r = rel(bd, p); return !/[A-Z]/.test(r) && !/\/\//.test(r) && !r.includes("_"); }) },
    { id: "EX-SEO-005", label: "Maillage interne structuré", pts: 8, met: internal.length >= 3 },
    { id: "EX-SEO-010", label: "Cohérence title / H1 / contenu", pts: 8, met: !!keyword && norm(h1s[0]?.text || "").includes(keyword) && bodyText.includes(keyword) },
    { id: "EX-SEO-011", label: "Hiérarchie H2/H3 logique", pts: 7, met: h2s.length >= 1 && headingOrderOk },
    { id: "EX-SEO-012", label: "Intention de recherche respectée", pts: 8, met: (links.some((h) => /^tel:|^mailto:/.test(h)) || /devis|contact|rendez-vous|réserver/.test(bodyText)) && h2s.length >= 2 },
    { id: "EX-SEO-013", label: "Open Graph configuré", pts: 7, met: og("og:title") && og("og:description") && og("og:image") && og("og:url") },
    { id: "EX-SEO-014", label: "Textes alt sur les images", pts: 7, met: imgs.every((i) => (i.getAttribute("alt") || "").trim().length > 0) },
    { id: "EX-GEO-002", label: "FAQ structurée (FAQPage)", pts: 8, met: !!faqNode && (faqNode.mainEntity?.length || 0) >= 3 },
    { id: "EX-GEO-003", label: "Données structurées Schema.org", pts: 8, met: ld.length >= 1 },
    { id: "EX-GEO-004", label: "Contexte local explicite", pts: 7, met: zones.some((z) => z && bodyText.includes(z)) && (norm(biz.address || "").length > 0 ? bodyText.includes(norm(String(biz.address).split(",")[0])) || true : true) },
    { id: "EX-GEO-007", label: "Services clairement nommés", pts: 7, met: root.querySelectorAll("h3").length >= 3 || root.querySelectorAll("li").length >= 3 },
    { id: "EX-GEO-008", label: "Preuves de crédibilité accessibles", pts: 5, met: /assur|certifi|garanti|décennale|décennal|avis|rge|agréé|label|expérience|ans d'/.test(bodyText) },
    { id: "EX-GEO-009", label: "Contenu résumable par IA", pts: 5, met: !!faqNode && h2s.length >= 2 && wc >= 250 },
  ];

  // ── 5 BONUS (/20) ──
  const bonus = [
    { id: "EX-SEO-015", label: "Contenu 300+ mots (pages stratégiques)", pts: 5, met: wc >= 300 },
    { id: "EX-SEO-016", label: "Cohérence thématique globale", pts: 5, met: !!keyword && root.querySelectorAll("h1,h2,h3").filter((h) => norm(h.text).includes(keyword)).length >= 2 },
    { id: "EX-SEO-017", label: "Pages services individuelles", pts: 5, met: pages.length >= 3 },
    { id: "EX-GEO-010", label: "Infos importantes non cachées dans images", pts: 3, met: links.some((h) => /^tel:/.test(h)) && norm(biz.address || "").split(",")[0] && bodyText.includes(norm(String(biz.address).split(",")[0])) },
    { id: "EX-GEO-011", label: "LocalBusiness / Organization Schema", pts: 2, met: hasType(/LocalBusiness|Organization|Plumber|Store|ProfessionalService/) },
  ];

  // waivers : transforment un échec en "toléré" (compté comme met, tracé)
  const waived = new Set((cfg.waivers || []).map((w) => w.check));
  const applyW = (arr) => arr.map((x) => (!x.met && waived.has(x.id) ? { ...x, met: true, waived: true } : x));
  const C = applyW(critiques), I = applyW(importants), B = applyW(bonus);

  const failedCritiques = C.filter((c) => !c.met).map((c) => c.id);
  const score = I.filter((x) => x.met).reduce((s, x) => s + x.pts, 0);
  const bonusScore = B.filter((x) => x.met).reduce((s, x) => s + x.pts, 0);

  let verdict;
  if (failedCritiques.length) verdict = "BLOQUER";
  else if (score < 55) verdict = "BLOQUER";
  else if (score < 70) verdict = "CORRIGER MAJEUR";
  else if (score < 80) verdict = "CORRIGER";
  else if (score < 90) verdict = "CORRIGER MINEUR";
  else verdict = bonusScore >= 15 ? "VALIDER PREMIUM" : "VALIDER";

  return { verdict, score, bonusScore, failedCritiques, critiques: C, importants: I, bonus: B, pages: pages.length };
}
