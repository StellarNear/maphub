# Fantasy MapHub Generators

Fantasy MapHub rassemble plusieurs générateurs procéduraux de cartes et de plans : villes médiévales fantastiques, villages, bâtiments, grottes et clairières, ainsi qu'une visionneuse 3D.

## Origine et attribution

Les générateurs sont issus des travaux de [Watabou](https://watabou.github.io/). Ce dépôt reprend une version adaptée et réunie par [voluminor (sunsung)](https://github.com/voluminor/maphub), qui a notamment ajouté des fonctions d'édition, d'import et d'export. Le présent projet poursuit ce travail.

## Utilisation

Ouvrez un générateur depuis l'accueil. Son menu contextuel donne accès à la génération, aux réglages et aux exports. Les cartes peuvent être utilisées hors connexion après installation de l'application web, sous réserve que les ressources nécessaires aient été mises en cache.

Les formats disponibles dépendent du générateur : images PNG ou SVG, données JSON ou Protobuf, et OBJ pour la visionneuse 3D. L'import d'une carte éditable dans les générateurs de ville et de village nécessite un export étendu : les anciens exports de Watabou ne contiennent pas toutes les données nécessaires à la reprise de l'édition.

Le français est proposé par défaut ; le sélecteur permet de retrouver les libellés anglais. Les menus principaux sont traduits, mais certaines fenêtres et certains textes des générateurs restent en anglais. Dans les générateurs, changer de langue recharge la page : exportez votre travail avant de confirmer. Les noms des quartiers créés dans le générateur de villes suivent la langue choisie ; les cartes importées conservent leurs noms.

### Principales évolutions de la version reprise

- Ressources locales et application web installable, pour une utilisation possible hors connexion.
- Menus contextuels harmonisés, liens permanents et mode plein écran.
- Ouverture des villes et villages dans la visionneuse 3D.
- Import et export Protobuf, avec maintien des anciens formats JSON.
- Messages d'import plus explicites, indicateurs pour les exports longs et noms de fichiers différenciés.
- Outils supplémentaires, notamment la molette dans les générateurs de villes et de bâtiments et une règle avancée pour les villes.
- Documentation des paramètres via la page API et corrections de divers problèmes.

L'objectif à long terme est de disposer d'un ensemble autonome pour décrire un monde à différentes échelles, de la planète aux maisons, clairières et grottes. Les pistes déjà envisagées sont :

- Ajouter l'export des grottes et clairières.
- Ajouter une visualisation 3D des bâtiments, séparée ou intégrée à la visionneuse.
- Ajouter des liens vers les grottes, clairières et bâtiments depuis les générateurs de villes et villages, puis relier ces générateurs entre eux.
- Permettre une construction séparée ou ajouter directement à l'application une liste de cartes et de palettes enregistrées.

L'import et l'export des palettes en Protobuf, ainsi que l'export étendu des noms et étiquettes, font partie des évolutions déjà réalisées dans la version reprise.

## Développement

- [Démarrage local](./start_guide.md)
- [Architecture](./architecture.md)
- [Publication](./publish.md)

La configuration des pages et des métadonnées se trouve dans [pages.config.mjs](./pages.config.mjs), [static.config.mjs](./static.config.mjs) et [package.json](./package.json). Chaque générateur est autonome.

### Formats binaires

Les structures Protobuf sont définies dans [protobuf](./protobuf). L'import accepte les objets binaires bruts ainsi que les objets enveloppés au format `|DataType uint32|{protobuf binaire}|crc32IEEE({protobuf binaire})`. Les identifiants sont définis dans [DataType](./protobuf/data/enum.proto).

Structures principales : [GeoObj](./protobuf/data/geo/obj.proto), [DwellingsObj](./protobuf/data/dwellings/obj.proto) et les palettes [ville](./protobuf/data/palette/mfcg.proto), [village](./protobuf/data/palette/village.proto), [bâtiments](./protobuf/data/palette/dwellings.proto), [visionneuse](./protobuf/data/palette/viewer.proto), [grotte](./protobuf/data/palette/cave.proto) et [clairière](./protobuf/data/palette/glade.proto). Le format Protobuf est recommandé pour les nouvelles intégrations ; JSON conserve notamment la compatibilité avec les anciens formats.

## Galerie

![Menus des générateurs](.github/img/all-menu.png)

![Menu des grottes](.github/img/to_cave.png)
![Menu des bâtiments](.github/img/to_dwellings.png)
![Menu des villages](.github/img/to_village.png)
![Menu des villes](.github/img/to_mfcg.png)
![Menu de la visionneuse](.github/img/to_viewer.png)

![Application installée sur téléphone](.github/img/mob_app.jpg)
![Exemple de carte sur mobile](.github/img/mob_city.jpg)

## Contribution et licence

Les contributions sont bienvenues sous forme de pull requests décrivant les modifications. Le code est publié sous [MPL-2.0](./LICENSE).
