---
name: convert-known-maps
description: Ajouter et vérifier localement des cartes JPG ou PNG dans le coffre de Súriël, sans altérer les sources ni inventer de noms ou de données géographiques.
---

# Cartes du coffre de Súriël

Lire [la procédure détaillée](../../../docs/known-maps.md), le
[catalogue](../../../public/maps_converted/catalog.json) et le
[convertisseur](../../../scripts/convert-maps.mjs).

- Ne jamais modifier, renommer ou supprimer les originaux, ni les
  transmettre à un service externe sans accord explicite.
- Conserver la hiérarchie et les liens existants ; demander les noms inconnus
  ou ambigus. L'assistant ajoute ou remplace une carte à la fois sans exiger
  les autres sources.
- Les images restent matricielles : ne pas annoncer de données géographiques
  éditables. La conversion WebP à qualité 90 est avec perte.
- Une image jusqu'à 16 millions de pixels est convertie en un fichier WebP ;
  au-delà, ou au-delà de 16 383 pixels par côté, elle est tuilée.
- Préserver `/suriel/`, les deux langues et l'exclusion des cartes du cache
  hors connexion non borné.

Depuis la racine, avec les dépendances npm déjà installées :

```powershell
npm.cmd run maps:convert
npm.cmd test -- tests\shared\map-conversion.test.js tests\shared\site-config.test.js
$env:SITE_BASE_PATH = "/suriel/"
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

La commande `maps:convert` est interactive ; suivre le
[guide des cartes](../../../guides/map-creation.md). Comparer les cartes
converties à leurs sources, notamment textes et contours à
taille réelle ; tester les liens, l'arbre, les langues, le zoom et le
déplacement. Consulter le catalogue et le poids du build. Arrêter le serveur
après les essais. Les anciennes révisions ne sont pas supprimées
automatiquement : obtenir confirmation avant de retirer leurs seuls dossiers
précis, jamais les sources.
