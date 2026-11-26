# Démarrage local

## Prérequis

Installez [Node.js](https://nodejs.org/) 20.19.0 et npm 9.2.0, les versions indiquées dans `package.json`. Les dépendances ne sont pas incluses dans le dépôt. Une connexion Internet est nécessaire à leur installation.

## Commandes

Dans un terminal ouvert à la racine du dépôt :

```sh
npm install
npm run build
npm run preview
```

Le navigateur peut ensuite ouvrir l'adresse affichée par Vite, généralement `http://localhost:4173/`. Gardez le terminal ouvert ; `Ctrl+C` arrête le serveur. Sous Windows, si PowerShell bloque `npm.ps1`, utilisez `npm.cmd` à la place de `npm`.

La construction génère les fichiers Protobuf et les pages dans `dist/` ; il faut la relancer après une modification avant de prévisualiser le résultat.

Pour exécuter les tests : `npm test` après une construction ou après `npm run pre:gen:proto`.
