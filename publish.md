# Publier le site

Le site est prévu pour GitHub Pages à l'adresse `https://stellarnear.github.io/suriel/`. Le workflow `.github/workflows/pages.yml` construit, teste et publie le site sur GitHub, sans serveur FTP. Il est lancé **manuellement**, pas automatiquement à chaque modification.

## Première configuration

1. Commitez et envoyez les modifications, dont le workflow, sur la branche `main` de GitHub.
2. Sur le dépôt GitHub, ouvrez **Settings > Pages > Build and deployment** et choisissez **GitHub Actions** comme source.
3. Ouvrez l'onglet **Actions**, sélectionnez **Publish GitHub Pages**, puis **Run workflow**. Choisissez `main` et confirmez avec **Run workflow**.
4. Attendez la fin des étapes de construction et de déploiement. Si l'une échoue ou attend une approbation, ouvrez l'exécution dans **Actions** pour voir les détails.
5. Ouvrez l'adresse indiquée dans **Settings > Pages** et vérifiez l'accueil, les générateurs et la page API. La première publication peut prendre quelques minutes.

Pour les mises à jour suivantes, envoyez vos changements sur `main` puis relancez le workflow depuis **Actions**. Le site reste sur la dernière version publiée tant que le workflow n'a pas terminé avec succès.

La section **About** du dépôt est indépendante de la publication : son bouton en forme d'engrenage permet de renseigner la description, les sujets et l'adresse du site, mais ne déploie rien.

## Construction locale

`npm run build` construit le site pour la racine `/` par défaut. Le workflow définit `SITE_BASE_PATH=/suriel/` pour adapter les liens, ressources et service worker au sous-dossier GitHub Pages. `homepage` dans `package.json` indique l'adresse publique utilisée pour les métadonnées et le sitemap ; sa modification seule ne publie rien.

Le workflow historique `.github/workflows/publish.yml` utilise un serveur FTP externe et est distinct de GitHub Pages. Ne le lancez pas sans vérifier son serveur et sa configuration : la synchronisation distante peut supprimer des fichiers.
