# Déploiement sur GitLab Pages

Ce document décrit la procédure de publication du projet EGD Atlas via GitLab Pages.

## 1. Vérifier le dépôt Git

Le dépôt local doit être initialisé et relié au remote GitLab.

```bash
git remote -v
git status
```

## 2. Lancer le build local

```bash
npm install
npm run build
```

La sortie de build est générée dans le dossier `dist/`.

## 3. Vérifier la configuration de publication

Le projet contient :

- `.gitlab-ci.yml` pour la pipeline de publication
- `vite.config.ts` avec la base de publication adaptée
- `public/robots.txt`, `public/sitemap.xml` et `public/site.webmanifest`

## 4. Publier via GitLab Pages

1. poussez le dépôt sur GitLab
2. ouvrez le projet GitLab
3. allez dans `Deploy > Pages`
4. activez GitLab Pages
5. assurez-vous que la branche `master` est bien utilisée par le pipeline

## 5. Vérifier la publication

Une fois la pipeline exécutée, la page publique doit être accessible via l’URL GitLab Pages du projet.

## 6. Bonnes pratiques

- ne versionnez pas les artefacts de build
- gardez les assets SEO dans `public/`
- testez toujours le build avant tout push critique
