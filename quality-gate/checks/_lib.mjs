// quality-gate/checks/_lib.mjs
// Utilitaires partagés : parcours de fichiers, parsing HTML léger, modèle de résultat.
// Aucune dépendance lourde. HTML parsé via node-html-parser (petit, rapide).

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";
import { parse } from "node-html-parser";

export const OK = "PASS";
export const WARN = "WARN";
export const BLOCK = "BLOCK";

/** Parcours récursif d'un dossier, filtré par extensions. */
export function walk(dir, exts = null, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (["node_modules", ".git", ".next/cache", "quality-gate"].includes(name)) continue;
      walk(p, exts, out);
    } else if (!exts || exts.includes(extname(p).toLowerCase())) {
      out.push(p);
    }
  }
  return out;
}

export const read = (p) => readFileSync(p, "utf8");
export const html = (s) => parse(s, { comment: false });

/**
 * Some SSG builds write each route twice on purpose: a flat `route.html`
 * (Vercel cleanUrls) and `route/index.html` (any other static host). Both
 * serve identical content for the same URL, so a naive walk() double-counts
 * it as two "different" pages with a "duplicate" title. Keep only the
 * `index.html` form when both exist for the same route.
 */
export function dedupePageFiles(files) {
  const set = new Set(files);
  return files.filter((p) => {
    if (!p.endsWith(".html") || p.endsWith("index.html")) return true;
    const dir = p.slice(0, -".html".length);
    return !set.has(join(dir, "index.html"));
  });
}

/** Un constat unitaire. severity ∈ {PASS, WARN, BLOCK}. */
export function finding(severity, check, message, where = "") {
  return { severity, check, message, where };
}

/** Applique les waivers : un BLOCK waivé (par nom de check) devient WARN annoté. */
export function applyWaivers(findings, waivers = []) {
  const byCheck = new Map(waivers.map((w) => [w.check, w]));
  return findings.map((f) => {
    if (f.severity === BLOCK && byCheck.has(f.check)) {
      const w = byCheck.get(f.check);
      return { ...f, severity: WARN, message: `${f.message}  [DÉROGATION: ${w.reason || "n/a"}${w.until ? ` — jusqu'au ${w.until}` : ""}]` };
    }
    return f;
  });
}

/** true si la page est indexable (robots ≠ noindex). */
export function isIndexable(root) {
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute("content") || "";
  return !/noindex/i.test(robots);
}

export function rel(root, p) {
  try { return relative(root, p); } catch { return p; }
}
