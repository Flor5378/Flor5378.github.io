# Flor5378.github.io

Site personnel statique, bilingue français / anglais. Aucune dépendance, aucun build, aucune analytique.

## Arborescence

```
index.html                  coquille HTML, métadonnées, en-tête et navigation
README.md
assets/
  content.js                TOUT le contenu FR et EN. Seul fichier à modifier au quotidien
  app.js                    rendu, navigation active, langue, thème, aperçus GitHub, animations
  style.css                 mise en page, typographie, thèmes clair et sombre, impression
  fonts/                    Geist et Geist Mono, auto-hébergées
  logos/                    logos fournis (BAED, Passés composés)
  logos/tech/               icônes des technologies (Devicon)
  logos/sport/              pictogrammes de sport (Material Design Icons)
  photo.jpg                 portrait, optionnel
```

## Mise en ligne

```bash
git clone https://github.com/Flor5378/Flor5378.github.io.git
cd Flor5378.github.io
# remplacer le contenu par celui de ce dossier
git add -A
git commit -m "Nouveau site personnel"
git push
```

`Settings > Pages > Source: Deploy from a branch > main / (root)`. Le dépôt doit être public, sinon Pages exige un compte Pro.

## Modifier le contenu

Tout se trouve dans `assets/content.js`, dans deux blocs symétriques `fr` et `en`. Toute modification doit être répercutée dans les deux.

Ajouter une expérience :

```js
{
  title: 'Nom de l’organisation',
  url: 'https://exemple.fr',
  logo: 'exemple.fr',
  sub: 'Intitulé du poste',
  meta: ['09/2026 → 02/2027', 'Ville'],
  body: 'Description factuelle en deux lignes.',
  tags: ['Python|python', 'SQL']
},
```

Ajouter un projet, dans `groups[].items` :

```js
{ title: 'Titre du projet', lang: 'FR', repo: 'Flor5378/nom-du-depot' },
```

Le lien et l’aperçu au survol sont déduits de `repo`. La navigation, la numérotation des sections et les compteurs se régénèrent seuls.

Dans `hero.meta`, la première ligne (le statut) s’affiche en pastille au-dessus du nom, les suivantes sous l’introduction avec une icône de lieu puis de maison.

## Logos

| Valeur de `logo` | Comportement |
| --- | --- |
| `'nato.int'` | favicon récupéré automatiquement auprès du service Google |
| `'assets/logos/x.png'` | fichier local, prioritaire |
| absent ou fichier introuvable | pastille avec les initiales, ou le champ `short` |

Ajoutez `wide: true` sur une entrée dont le logo est un texte long, la pastille s’allonge (cas de Passés composés).

Deux logos attendent encore un fichier local. Déposez-les et ils apparaissent sans autre modification :

```
assets/logos/mun.png
assets/logos/hadit.png
```

Format conseillé : PNG ou SVG carré, fond transparent, 128 px minimum.

Pour supprimer toute requête vers un service tiers, téléchargez les favicons une bonne fois et remplacez les valeurs de `logo` par les chemins locaux :

```powershell
mkdir assets\logos -Force
$sites = 'nato.int','oecd.org','airbus.com','safran-group.com','thalesgroup.com'
foreach ($s in $sites) {
  curl.exe -L -o "assets\logos\$($s.Split('.')[0]).png" "https://www.google.com/s2/favicons?domain=$s&sz=128"
}
```

Les logos affichés appartiennent à leurs détenteurs et ne sont utilisés qu’à titre de référence.

## Compétences

Chaque compétence s’écrit `'Nom'` ou `'Nom|icone'`, où `icone` correspond à un fichier de `assets/logos/tech/`. Les icônes disponibles :

```
bash css3 docker duckdb git html5 java javascript jupyter keras latex
matplotlib mongodb numpy pandas plotly postgresql powershell python r
react scikitlearn selenium streamlit ubuntu
```

Une icône absente ou mal nommée disparaît sans casser la mise en page, le libellé reste affiché. Pour ajouter une icône, récupérez le SVG depuis devicon.dev et déposez-le sous le nom voulu.

## Design

Une seule colonne de lecture, un en-tête collant et une navigation dont la pastille suit la section lue. Chaque section affiche son titre à gauche, collant sur grand écran, et son contenu en cartes à droite. Les jetons de couleur (fond, surfaces, filets, encres, accent) sont déclarés en tête de `style.css`, une fois pour le thème clair et une fois pour le thème sombre : changer l’accent revient à modifier `--accent` dans les deux blocs.

Les cartes apparaissent en fondu au défilement. L’animation est désactivée si le système demande de réduire les mouvements, et le contenu reste toujours visible sans elle.

## Fonctionnement

- Langue : `?lang=fr` ou `?lang=en` dans l’URL, sinon la langue du navigateur, puis mémorisation du choix.
- Thème : préférence système au premier chargement, puis mémorisation du choix.
- Aperçus de projets : image sociale générée par GitHub, chargée au survol uniquement, sur écran non tactile.
- Navigation : la pastille de l’en-tête suit la section lue ; sur mobile, la barre défile horizontalement et garde le lien actif visible.
- Impression : `Ctrl + P` produit une version CV propre, sans en-tête ni boutons.

## Licence

Le contenu du site est publié sous [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr) :
réutilisation libre avec attribution, hors usage commercial, et partage aux mêmes conditions.
Le lien figure en pied de page, dans les deux langues. Pour en changer, modifiez `ui.license`
et `ui.licenseTitle` dans `content.js` ainsi que l’URL du lien dans `app.js`.

## Crédits

Geist et Geist Mono sous licence SIL Open Font License. Devicon sous licence MIT. Pictogrammes de sport issus de Material Design Icons, licence Apache 2.0. Les logos affichés restent la propriété de leurs détenteurs.
