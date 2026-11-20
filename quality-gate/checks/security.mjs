// quality-gate/checks/security.mjs
// Encode STANDARD-005 (Sécurité/RGPD) côté build & source.
// Attrape EXACTEMENT les fuites trouvées dans holding-ia :
//   VITE_*_KEY exposé au navigateur, service_role en clair, clé Anthropic, JWT Supabase en dur.
// Le test qui compte : le BUNDLE livré. Un secret dans le dist = un secret dans le navigateur.

import { existsSync } from "node:fs";
import { join } from "node:path";
import { walk, read, finding, rel, OK, WARN, BLOCK } from "./_lib.mjs";

// Motifs de secrets. On garde des extraits courts pour ne PAS re-logger la clé entière.
const PATTERNS = [
  { id: "sec.vite_secret", sev: BLOCK,
    re: /\bVITE_[A-Z0-9_]*(KEY|SECRET|TOKEN|SERVICE|PRIVATE|PASSWORD)\b/,
    msg: "Variable VITE_… secrète : préfixe VITE_ = embarqué dans le bundle navigateur. À déplacer côté serveur." },
  { id: "sec.service_role", sev: BLOCK,
    re: /service_role/,
    msg: "Occurrence 'service_role' : la clé qui bypasse la RLS ne doit jamais toucher le code ni un JSON de workflow." },
  { id: "sec.anthropic_key", sev: BLOCK,
    re: /sk-ant-api\d{2}-[A-Za-z0-9_-]{6,}/,
    msg: "Clé API Anthropic en clair (sk-ant-…). Régénérer + passer en variable d'env serveur." },
  { id: "sec.supabase_jwt", sev: BLOCK,
    re: /eyJhbGciOiJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/,
    msg: "JWT Supabase en dur (anon/service_role). Doit venir d'une variable d'env, jamais du repo." },
];

const SOURCE_EXT = [".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json", ".vue", ".svelte"];
const BUNDLE_EXT = [".js", ".mjs", ".cjs", ".html", ".css"];

function scan(files, out, context) {
  for (const p of files) {
    const txt = read(p);
    for (const { id, sev, re, msg } of PATTERNS) {
      const m = txt.match(re);
      if (m) {
        // n'affiche jamais le secret complet
        const hint = m[0].length > 16 ? m[0].slice(0, 12) + "…" : m[0];
        out.push(finding(sev, id, `${context}: ${msg} (motif: ${hint})`, p));
      }
    }
  }
}

export function runSecurity(cfg, projectRoot = ".") {
  const out = [];
  const s = cfg.security;

  // 1. Source : tout sauf build & deps
  const srcFiles = walk(projectRoot, SOURCE_EXT).filter(
    (p) => !p.includes("/node_modules/") && !p.includes(`/${cfg.buildDir}/`) && !p.endsWith(".config.json")
  );
  scan(srcFiles, out, "SOURCE");

  // 2. Bundle livré : LE test décisif
  const buildDir = join(projectRoot, cfg.buildDir);
  if (s.scanBuiltBundle && existsSync(buildDir)) {
    const bundle = walk(buildDir, BUNDLE_EXT);
    scan(bundle, out, "BUNDLE LIVRÉ");
  }

  // 3. Headers de sécurité (vercel.json)
  if (s.requireSecurityHeaders) {
    const hf = join(projectRoot, s.headersFile);
    if (!existsSync(hf)) {
      out.push(finding(WARN, "sec.headers.file", `${hf} absent : aucun header de sécurité déclaré (CSP, HSTS…).`));
    } else {
      const conf = read(hf);
      for (const h of s.securityHeaders || []) {
        if (!conf.includes(h)) out.push(finding(WARN, "sec.headers.missing", `Header de sécurité manquant dans ${hf}: ${h}`));
      }
    }
  }

  if (out.length === 0) out.push(finding(OK, "security", "Aucun secret exposé, headers présents. STANDARD-005 OK."));
  return out;
}
