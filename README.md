# Flor5378.github.io

Site personnel statique, bilingue français / anglais. Aucune dépendance, aucun build, aucun traceur.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Coquille HTML, métadonnées, barre latérale |
| `assets/content.js` | **Tout le contenu FR et EN.** Le seul fichier à modifier au quotidien |
| `assets/app.js` | Rendu, sommaire actif, bascule de langue et de thème |
| `assets/style.css` | Mise en page, typographie, thèmes clair et sombre, impression |
| `assets/photo.jpg` | Portrait, optionnel. Absent, l’avatar disparaît sans erreur |

## Mise en ligne

Depuis un clone du dépôt, en remplaçant l’ancien site :

```bash
git rm -r --cached . && rm -rf assets index.html   # nettoyage de l’existant
# copier ici les fichiers du nouveau site
git add -A
git commit -m "Nouveau site personnel"
git push origin main
```

Puis, dans les réglages GitHub du dépôt : `Settings → Pages → Source: Deploy from a branch → main / (root)`.
Le site est publié sur `https://flor5378.github.io`.

## À compléter avant publication

1. `CONFIG.linkedin` dans `assets/content.js` : vérifier l’URL exacte du profil.
2. `assets/photo.jpg` : déposer un portrait carré, environ 400 × 400 px.
3. Projets : ajouter `url: 'https://github.com/Flor5378/...'` à chaque entrée de `groups[].items` pour la rendre cliquable.

## Fonctionnement

- Langue : `?lang=fr` ou `?lang=en` dans l’URL, sinon la langue du navigateur, puis mémorisation du choix.
- Thème : préférence système au premier chargement, puis mémorisation du choix.
- Impression : `Ctrl + P` produit une version CV propre, sans barre latérale.
