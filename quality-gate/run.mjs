#!/usr/bin/env node
// quality-gate/run.mjs — JUGE GRADUÉ (STANDARD-003 compilé).
// Sécurité (BLOCK) + note SEO/GEO /100 + paliers. Sort en erreur si BLOQUER
// ou si le score < seuil de livraison (premium = 90 par défaut).
import { readFileSync } from "node:fs";
import { runSecurity } from "./checks/security.mjs";
import { runSeoScore } from "./checks/seo-score.mjs";
import { BLOCK } from "./checks/_lib.mjs";

const args = process.argv.slice(2);
const get = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };
const cfg = JSON.parse(readFileSync(get("--config", "quality-gate/quality-gate.config.json"), "utf8"));
const root = get("--root", ".");
const threshold = cfg.seo?.deployThreshold ?? 90; // premium

const C = { g: "\x1b[32m", y: "\x1b[33m", r: "\x1b[31m", d: "\x1b[2m", b: "\x1b[1m", x: "\x1b[0m" };
const mark = (ok, w) => (ok ? `${C.g}✓${C.x}` : `${w ? C.y + "~" : C.r + "✗"}${C.x}`);

// 1) Sécurité (bloquant absolu)
const sec = runSecurity(cfg, root).filter((f) => f.severity === BLOCK);
// 2) Score SEO/GEO gradué
const s = runSeoScore(cfg, root);

console.log(`\n${C.b}━━━ DigitalOS Quality Gate · STANDARD-003 /100 ━━━${C.x}`);
console.log(`${C.d}build: ${cfg.buildDir} · seuil livraison: ${threshold}${C.x}\n`);

console.log(`${C.b}Sécurité (STANDARD-005)${C.x}`);
if (sec.length === 0) console.log(`  ${C.g}✓ aucun secret exposé${C.x}`);
else sec.forEach((f) => console.log(`  ${C.r}✗ ${f.check}${C.x} ${f.message}${f.where ? ` ${C.d}(${f.where})${C.x}` : ""}`));

console.log(`\n${C.b}Critiques (9 · binaires)${C.x}`);
s.critiques.forEach((c) => console.log(`  ${mark(c.met)} ${c.id} ${C.d}${c.label}${c.waived ? " [dérogé]" : ""}${C.x}`));

console.log(`\n${C.b}Importants — ${s.score}/100${C.x}`);
s.importants.forEach((i) => console.log(`  ${mark(i.met)} ${i.id} (${i.pts}) ${C.d}${i.label}${i.waived ? " [dérogé]" : ""}${C.x}`));

console.log(`\n${C.b}Bonus — ${s.bonusScore}/20${C.x}`);
s.bonus.forEach((bn) => console.log(`  ${mark(bn.met, true)} ${bn.id} (${bn.pts}) ${C.d}${bn.label}${C.x}`));

const col = s.verdict.startsWith("VALIDER") ? C.g : s.verdict.startsWith("CORRIGER") ? C.y : C.r;
console.log(`\n${C.b}VERDICT : ${col}${s.verdict}${C.x}  ${C.d}(importants ${s.score}/100 · bonus ${s.bonusScore}/20)${C.x}`);

const blocked = sec.length > 0 || s.failedCritiques.length > 0 || s.score < threshold;
if (blocked) {
  const why = sec.length ? "secret exposé" : s.failedCritiques.length ? `critiques échouées: ${s.failedCritiques.join(", ")}` : `score ${s.score} < ${threshold}`;
  console.log(`${C.r}${C.b}\n⛔ Livraison refusée — ${why}.${C.x}\n`);
  process.exit(1);
}
console.log(`${C.g}${C.b}\n✅ Gate franchi (${s.verdict}).${C.x}\n`);
process.exit(0);
