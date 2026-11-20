# Dossier V8 — référentiel POLIVIA Site Factory

Copie de travail de `POLIVIA_V8_SITE_FACTORY_EXCELLENCE_2026-11-20` (remis le 2026-11-20),
installée dans ce dépôt sans écraser quoi que ce soit d'existant, conformément à
`docs/14_MODE_D_EMPLOI_CLAUDE_IMPLEMENTATION.md` point 1.

## Ce qui est copié ici
- `00_COMMENCER_ICI.md`, `01_MISSION_CLAUDE_SITE_FIRST.md` : décision business et mandat.
- `docs/01` à `docs/14` : les 14 contrats techniques et procédures du dossier V8.
- `contracts/` : work packages (16), SiteSpec exemple, schéma JSON des preuves.
- `matrices/*_TEMPLATE.csv`, `RECEPTION_PAR_SITE.TEMPLATE.csv`, `INDEX_RECEPTION.json` : gabarits vierges du dossier, inchangés.
- `matrices/RECEPTION_POLIVIA_SITE.csv` et `matrices/URL_MAP_POLIVIA_SITE.csv` : **instances remplies pour ce site**, voir `R0_RECONNAISSANCE.md`.
- `POLIVIA_V7_MANDAT_EXCLUSIF_CLAUDE_SANS_ICOS.md`, `SHA256_REFERENCES.json`, `CHECKSUMS.sha256`, `DELIVERY_STATUS.json` : traçabilité du dossier V7/V8.

## Ce qui n'est pas copié (volontairement)
- `references/POLIVIA_MISSION_CLAUDE_ULTRA_V7_DOSSIER_COMPLET_2026-11-19.zip` (archive V7 complète, ~4,9 Mo)
  et `references/POLIVIA_V5_HTML_POUR_DEVELOPPEUR.zip` (~0,7 Mo) : archives historiques volumineuses,
  non nécessaires au code de ce dépôt. Leur sha256 est dans `SHA256_REFERENCES.json`. Elles restent
  disponibles dans le pack original transmis par l'utilisateur si besoin de les ré-ouvrir.
- `scripts/release_gate.py`, `scripts/test_gate_synthetic.py`, `scripts/validate_package.py` :
  prototype Python de la politique de gate, pas raccordé à une CI JS/TS de ce dépôt. À réimplémenter
  en TypeScript dans le pipeline réel le jour où un gate automatisé est construit (cf. `docs/14`, point 6),
  plutôt que d'importer un interpréteur Python supplémentaire pour un prototype déjà simulé.

## Statut
Dossier structurel, pas une certification. Voir `docs/09_GATES_ET_ACCEPTATION.md` pour les règles GO/NO-GO
et `R0_RECONNAISSANCE.md` pour l'état réel de ce dépôt au 2026-11-20.
