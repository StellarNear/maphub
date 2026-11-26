# Architecture

- `src/index.html` et `src/js/index.js` : page d'accueil, cartes des générateurs et choix de langue.
- `languages/` : textes de l'accueil, réunis dans `languages.json` lors de la construction.
- `src/js/mfcg.js`, `Village.js`, `Dwellings.js`, `Cave.js` et `ToyTown2.js` : générateurs et visionneuse ; ce sont de gros fichiers JavaScript compilés depuis les applications d'origine, et non des sources découpées en modules classiques.
- `src/js/shared/` : composants et traitements de données partagés. `src/js/struct/` est généré depuis les définitions Protobuf.
- `protobuf/` : schémas des paramètres, cartes et palettes ; ils définissent les formats d'échange.
- `public/` : ressources statiques, styles, polices, fichiers des générateurs, documentation API et service worker.
- `pages.config.mjs`, `static.config.mjs` et `vite.config.js` : configuration des pages, des métadonnées et de la construction.
- `scripts/` : génération des pages, schémas, langues, icônes et autres fichiers distribués. `scripts/templates/` contient le modèle des pages de générateurs.
- `tests/` : tests Vitest des applications, des données et des fonctions partagées.
- `.github/workflows/` : automatisations de vérification, publication FTP et versions.
- `dist/` : résultat généré, à servir tel quel ; ne pas le modifier à la main.
