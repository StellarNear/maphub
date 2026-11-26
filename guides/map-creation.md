# Ajouter ou remplacer une carte

## Préparation

Installez les dépendances selon le [guide de démarrage](./start_guide.md).
Placez votre image JPG ou PNG dans [maps/](../maps), ou conservez-la ailleurs
sur votre ordinateur. Les images dans `maps/` sont ignorées par Git ; gardez
une sauvegarde de vos originaux.

## Conversion

Depuis la racine du dépôt, lancez :

```sh
npm run maps:convert
```

Sous Windows, utilisez `npm.cmd` si PowerShell bloque `npm`. Dans l'assistant :

1. Choisissez **Ajouter** ou **Remplacer**.
2. Pour un ajout, choisissez ou créez une région, indiquez le nom affiché et,
   si besoin, un dossier d'affichage. L'identifiant proposé retire les accents ;
   vous pouvez le modifier. En cas de doublon, choisissez un autre identifiant.
   Pour un remplacement, choisissez la carte existante : son identifiant,
   sa région, son nom et ses liens sont conservés.
3. Indiquez le chemin de l'image, puis confirmez. Un chemin relatif part de la
   racine du dépôt ; vous pouvez aussi saisir un chemin absolu.

L'assistant convertit uniquement cette image, vérifie les autres cartes déjà
générées et met à jour [catalog.json](../public/maps_converted/catalog.json).
Les anciennes sources ne sont pas nécessaires. Le nom du fichier source est
enregistré dans le catalogue publié, mais pas son chemin absolu.

## Vérification et publication

```sh
npm run build
npm run preview
```

Ouvrez l'adresse indiquée par Vite, suivie de `/coffre/` (par défaut
`http://localhost:4173/coffre/`). Vérifiez la carte, son nom et sa région ;
comparez-la à l'original, notamment les textes. Arrêtez le serveur avec
`Ctrl+C`. Versionnez les modifications dans `public/maps_converted/`, puis
suivez le [guide de publication](./publish.md).

La compression WebP qualité 90 est avec perte ; les grandes cartes sont
tuilées automatiquement. Les anciennes sorties d'une carte remplacée restent
sur le disque : examinez-les avant tout nettoyage manuel. Voir les
[détails et limites](../docs/known-maps.md).
