// quality-gate/checks/seo-geo-aeo.mjs
// Encode STANDARD-003 (SEO/GEO) en checks pass/fail sur le HTML *rendu*.
// Ce n'est pas une IA : c'est la doctrine compilée. Zéro token, 100% reproductible.

import { existsSync } from "node:fs";
import { join } from "node:path";
import { walk, read, html, finding, isIndexable, rel, OK, WARN, BLOCK, dedupePageFiles } from "./_lib.mjs";

const words = (t) => (t.replace(/\s+/g, " ").trim().match(/\S+/g) || []).length;

export function runSeoGeoAeo(cfg) {
  const buildDir = cfg.buildDir;
  const out = [];
  if (!existsSync(buildDir)) {
    return [finding(BLOCK, "build.exists", `Dossier de build introuvable: ${buildDir}. Le gate audite le HTML rendu.`)];
  }

  // --- fichiers globaux : sitemap / robots.txt ---
  if (cfg.seo.requireSitemap && !existsSync(join(buildDir, "sitemap.xml")))
    out.push(finding(BLOCK, "seo.sitemap", "sitemap.xml absent du build."));
  if (cfg.seo.requireRobotsTxt && !existsSync(join(buildDir, "robots.txt")))
    out.push(finding(BLOCK, "seo.robotstxt", "robots.txt absent du build."));

  const pages = dedupePageFiles(walk(buildDir, [".html"]));
  if (pages.length === 0)
    out.push(finding(BLOCK, "build.html", "Aucun fichier .html dans le build."));

  let geoLocalBusinessSeen = false;

  for (const p of pages) {
    const where = rel(buildDir, p);
    const root = html(read(p));
    const indexable = isIndexable(root);
    if (cfg.indexableOnly && !indexable) continue;

    // --- URL hygiene (nom de fichier) ---
    if (cfg.seo.urlHygiene) {
      if (/[A-Z]/.test(where)) out.push(finding(BLOCK, "seo.url.lowercase", "URL avec majuscules.", where));
      if (where.includes("_")) out.push(finding(WARN, "seo.url.hyphen", "Underscore dans l'URL (préférer les tirets).", where));
      if (/\/\//.test(where)) out.push(finding(BLOCK, "seo.url.doubleslash", "Double slash dans l'URL.", where));
    }

    // --- <title> ---
    const title = (root.querySelector("title")?.text || "").trim();
    if (!title) out.push(finding(BLOCK, "seo.title.present", "<title> manquant.", where));
    else if (title.length < cfg.seo.titleMinLen || title.length > cfg.seo.titleMaxLen)
      out.push(finding(BLOCK, "seo.title.length", `<title> ${title.length} car (attendu ${cfg.seo.titleMinLen}–${cfg.seo.titleMaxLen}).`, where));

    // --- meta description ---
    const desc = root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "";
    if (!desc) out.push(finding(BLOCK, "seo.metadesc.present", "meta description manquante.", where));
    else if (desc.length < cfg.seo.metaDescMinLen || desc.length > cfg.seo.metaDescMaxLen)
      out.push(finding(BLOCK, "seo.metadesc.length", `meta description ${desc.length} car (attendu ${cfg.seo.metaDescMinLen}–${cfg.seo.metaDescMaxLen}).`, where));

    // --- H1 unique ---
    if (cfg.seo.requireSingleH1) {
      const h1 = root.querySelectorAll("h1").length;
      if (h1 !== 1) out.push(finding(BLOCK, "seo.h1.single", `${h1} <h1> (attendu: exactement 1).`, where));
    }

    // --- canonical ---
    if (cfg.seo.requireCanonical) {
      const can = root.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
      if (!can) out.push(finding(BLOCK, "seo.canonical.present", "canonical manquant.", where));
      else if (cfg.seo.canonicalMustBeAbsolute && !/^https?:\/\//.test(can))
        out.push(finding(BLOCK, "seo.canonical.absolute", `canonical non absolu: ${can}`, where));
    }

    // --- robots index,follow ---
    if (cfg.seo.requireRobotsIndexFollow) {
      const robots = root.querySelector('meta[name="robots"]')?.getAttribute("content") || "";
      if (robots && /noindex|nofollow/i.test(robots))
        out.push(finding(WARN, "seo.robots.indexable", `meta robots = "${robots}" sur une page censée être indexable.`, where));
    }

    // --- Open Graph ---
    for (const og of cfg.seo.requireOpenGraph || []) {
      if (!root.querySelector(`meta[property="${og}"]`))
        out.push(finding(WARN, "seo.og", `Balise Open Graph manquante: ${og}`, where));
    }

    // --- alt sur images porteuses de sens ---
    if (cfg.seo.requireAltOnImages) {
      for (const img of root.querySelectorAll("img")) {
        const decorative = img.getAttribute("aria-hidden") === "true" || img.getAttribute("role") === "presentation";
        const alt = img.getAttribute("alt");
        if (!decorative && (alt === undefined || alt === null))
          out.push(finding(BLOCK, "seo.img.alt", `<img> sans attribut alt (src=${img.getAttribute("src") || "?"}).`, where));
      }
    }

    // --- contenu minimal sur pages stratégiques ---
    const isStrategic = (cfg.seo.strategicPages || []).some((s) => where.includes(s));
    if (isStrategic) {
      const body = root.querySelector("body");
      const wc = body ? words(body.text) : 0;
      if (wc < cfg.seo.minWordsStrategicPages)
        out.push(finding(WARN, "seo.content.min", `${wc} mots sur page stratégique (min ${cfg.seo.minWordsStrategicPages}).`, where));
    }

    // --- JSON-LD (GEO) ---
    const ldBlocks = root.querySelectorAll('script[type="application/ld+json"]');
    if (cfg.geo.requireJsonLd && ldBlocks.length === 0)
      out.push(finding(BLOCK, "geo.jsonld.present", "Aucun JSON-LD (données structurées) sur la page.", where));

    for (const b of ldBlocks) {
      let data;
      try { data = JSON.parse(b.text); }
      catch { out.push(finding(BLOCK, "geo.jsonld.valid", "JSON-LD non parseable.", where)); continue; }
      const nodes = Array.isArray(data) ? data : (data["@graph"] || [data]);
      for (const n of nodes) {
        const t = String(n["@type"] || "");
        if (/LocalBusiness|Organization|Business|Store|ProfessionalService|Plumber|Electrician|RoofingContractor|GeneralContractor|Contractor|Locksmith|HousePainter|MovingCompany|HVAC|Dentist|Physician|BeautySalon|HairSalon|DaySpa|MedicalBusiness|LegalService|Attorney|RealEstateAgent|Restaurant|Bakery|Notary/.test(t)) {
          geoLocalBusinessSeen = true;
          for (const prop of cfg.geo.localBusinessRequiredProps || []) {
            if (!(prop in n))
              out.push(finding(WARN, "geo.localbusiness.props", `JSON-LD ${t}: propriété "${prop}" manquante (GEO/SEO local).`, where));
          }
        }
      }
    }

    // --- AEO : FAQPage (warn seulement) ---
    if (cfg.aeo.faqPage === "warn") {
      const hasFaq = [...ldBlocks].some((b) => /"FAQPage"/.test(b.text));
      const looksLikeFaq = /faq|questions? fréquentes?/i.test(root.text);
      if (looksLikeFaq && !hasFaq)
        out.push(finding(WARN, "aeo.faqpage", "Contenu FAQ détecté sans schéma FAQPage (opportunité AEO manquée).", where));
    }
  }

  if (cfg.geo.requireLocalBusiness && !geoLocalBusinessSeen)
    out.push(finding(WARN, "geo.localbusiness.site", "Aucun LocalBusiness/Organization trouvé sur l'ensemble du site (GEO local faible)."));

  if (out.length === 0) out.push(finding(OK, "seo-geo-aeo", `${pages.length} page(s) conformes à STANDARD-003.`));
  return out;
}
