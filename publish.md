# Publier le site

Renseigner `homepage` dans `package.json` ne publie rien et ne crée pas de domaine. Le workflow actuel `.github/workflows/publish.yml` est lancé manuellement et envoie `dist/` vers un serveur FTP configuré avec des secrets et variables GitHub ; ce n'est pas GitHub Pages. Ne le lancez pas sans vérifier son serveur et sa configuration : la synchronisation distante peut supprimer des fichiers.

## Avec GitHub Pages

Le site utilise actuellement des chemins absolus à partir de `/` (ressources, liens, service worker). Il doit donc être servi à la racine d'un domaine. L'adresse habituelle d'un site de projet, `https://UTILISATEUR.github.io/DEPOT/`, ne fonctionnera pas correctement sans adapter les chemins, la configuration Vite et le service worker.

La solution la plus simple sans modifier ces chemins est d'utiliser un dépôt de site utilisateur nommé `UTILISATEUR.github.io`, ou un domaine personnalisé configuré sur GitHub Pages. Dans ce dépôt :

1. Construisez le site avec `npm install` puis `npm run build`.
2. Publiez le **contenu** de `dist/` à la racine de la branche de publication choisie (par exemple `gh-pages`), et envoyez cette branche sur GitHub. Ne publiez pas simplement les sources : les pages des générateurs sont créées pendant la construction.
3. Dans **Settings > Pages**, choisissez **Deploy from a branch**, puis la branche de publication et le dossier `/ (root)`. Enregistrez et attendez la fin du déploiement. L'adresse apparaît sur cette page.
4. Pour un domaine personnalisé, configurez le domaine dans **Settings > Pages** et suivez les instructions GitHub pour ses enregistrements DNS et HTTPS.
5. Mettez `homepage` dans `package.json` à jour avec le domaine réel, sans `https://`, puis reconstruisez et republiez : cette valeur sert notamment aux métadonnées et au sitemap.

Pour automatiser ces étapes, configurez un workflow GitHub Actions de construction et de déploiement Pages ; le dépôt actuel n'en contient pas. Consultez la [documentation GitHub Pages](https://docs.github.com/fr/pages) pour les prérequis, la visibilité et les domaines personnalisés.
