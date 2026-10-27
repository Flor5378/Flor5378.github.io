# Flor5378.github.io

Site personnel statique, bilingue français et anglais, design « Velours ». HTML, CSS et JavaScript natifs : aucune dépendance, aucun build, aucune analytique. Déployé tel quel par GitHub Pages.

## Arborescence

```
index.html                  coquille HTML, métadonnées, barre, accueil, menu et feuille basse
cv.html                     CV imprimable sur deux pages A4 (?lang=en pour l'anglais)
velours-passation.md        spécification du design (référence)
velours-styles.css          feuille de référence de la maquette (valeurs exactes)
assets/
  content.js                TOUT le contenu FR et EN. Seul fichier à modifier au quotidien
  github.json               données des aperçus GitHub, écrites par l'action quotidienne
  css/velours.css           jetons, composants, thèmes clair et sombre, mouvement réduit
  css/cv.css                CV imprimable, partagé par cv.html et l'impression du site
  js/motion.js              ressorts, forme liquide, pilule de navigation, surbrillance
  js/app.js                 rendu, section lue, langue, thème, aperçus, menu, feuille basse
  js/cv.js                  rendu du CV depuis content.js
  js/dev-data.js            jeux de données de test, chargé seulement en local
  fonts/                    Figtree variable, auto-hébergée (licence OFL)
  logos/                    logos locaux (BAED, Passés composés, Bergen, MUN, Deloitte, EY, Capgemini, Wavestone)
  previews/                 images des aperçus de projets (WebP, 16:9)
  logos/tech/               icônes des technologies (Devicon)
  logos/sport/              pictogrammes de sport (Material Design Icons)
.github/workflows/github-data.yml   action quotidienne qui met à jour github.json
.github/scripts/github-data.mjs     script de cette action
```

## Mise en ligne

`Settings > Pages > Source: Deploy from a branch > main / (root)`. Le dépôt doit être public, sinon Pages exige un compte Pro.

L'action déclare elle-même `contents: write` pour écrire `assets/github.json` ; aucun réglage supplémentaire n'est nécessaire sur un dépôt personnel.

## Modifier le contenu

Tout se trouve dans `assets/content.js`, dans deux blocs symétriques `fr` et `en`. Toute modification doit être répercutée dans les deux. Les limites de saisie conseillées et la règle des espaces françaises sont rappelées en tête du fichier.

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

`sub`, `url`, `logo`, le lieu et `tags` sont facultatifs : un champ absent est simplement omis. Un lien de dépôt peut figurer dans `body` : `<a href="https://github.com/Flor5378/depot" data-repo="Flor5378/depot">texte</a>`. Il devient une pastille qui ouvre l'aperçu GitHub.

Ajouter un projet, dans `groups[].items` :

```js
{ title: 'Titre du projet', lang: 'FR', repo: 'Flor5378/nom-du-depot' },
```

Le lien et l'aperçu sont déduits de `repo`. Pour illustrer l'aperçu, ajoutez `image: 'assets/previews/x.webp'` (format 16:9, 1280 px de large conseillés) et `alt: 'Description de l’image'` dans chaque langue : l'image s'affiche en tête du panneau et de la feuille basse. Les mêmes champs sur un bloc des centres d'intérêt affichent l'image dans sa carte, qui passe alors en pleine largeur. La navigation, la numérotation des sections et les compteurs se régénèrent seuls. Une section ou un groupe vide est masqué.

Projets récents : le champ `featured` de la section Projets affiche une carte en tête de section, avant la liste. Un site avec `url` devient un lien à pastille vive ; sans `url`, il s'affiche comme inaccessible, sans lien. Supprimer `featured` retire la carte.

```js
featured: {
  label: 'Projets récents',
  title: 'Titre de la carte',
  body: 'Présentation en deux ou trois lignes.',
  sites: [
    { name: 'exemple.com', url: 'https://exemple.com', status: 'En développement' },
    { name: 'exemple.app', status: 'Pour l’instant inaccessible' }
  ]
},
```

Dans `hero.meta`, la ligne « Statut » s'affiche en pastille dans l'accueil, la ligne « Actuellement » sous le rôle avec une icône de lieu.

## Aperçus GitHub

Le navigateur n'interroge jamais l'API GitHub. L'action `github-data.yml` lit les dépôts cités dans `content.js`, chaque jour à 5 h 17 UTC et à chaque modification de `content.js` sur `main`, puis écrit description, langue et date de mise à jour dans `assets/github.json`. Un dépôt privé ou introuvable y est marqué `missing` : l'aperçu affiche alors « Aperçu indisponible » et renvoie vers le profil. Lancement manuel : onglet `Actions > Données GitHub des aperçus > Run workflow`.

## Logos

| Valeur de `logo` | Comportement |
| --- | --- |
| `'nato.int'` | favicon récupéré automatiquement auprès du service Google |
| `'assets/logos/x.png'` | fichier local, prioritaire |
| absent ou fichier introuvable | pastille avec les initiales, ou le champ `short` |

Dans une entrée, un logo local qui a son propre fond (coin opaque) remplit le carré ; un logo transparent y est contenu avec une marge. `wide: true` signale un logo texte : pastille allongée dans les intérêts, image contenue dans le carré d'une entrée.

Hadit (organisations) n'a pas encore de fichier, ses initiales s'affichent. Pour afficher son logo, déposez `assets/logos/hadit.png` puis ajoutez `logo: 'assets/logos/hadit.png'` à l'élément correspondant. Format conseillé : PNG ou SVG carré, fond transparent, 128 px minimum.

Les logos affichés appartiennent à leurs détenteurs et ne sont utilisés qu'à titre de référence.

## Compétences

Chaque compétence s'écrit `'Nom'` ou `'Nom|icone'`, où `icone` correspond à un fichier de `assets/logos/tech/`. Les icônes disponibles :

```
arcgis bash css3 docker duckdb geopandas git html5 java javascript jupyter
keras latex matplotlib mongodb numpy pandas plotly postgresql powershell
python qgis r react scikitlearn selenium streamlit talend ubuntu
```

Une icône absente ou mal nommée disparaît sans casser la mise en page, le libellé reste affiché.

## Fonctionnement

- Langue : `?lang=fr` ou `?lang=en` dans l'URL, sinon le choix mémorisé, sinon la langue du navigateur. La bascule garde la section lue au même endroit.
- Thème : clair au premier chargement, quelle que soit la préférence système, puis choix mémorisé, appliqué avant le premier affichage.
- Navigation : la pilule suit la section lue et le survol. Sous 1180 px, la barre affiche la section lue et un bouton Menu.
- Projets : panneau d'aperçu au survol ou au focus sur grand écran, feuille basse au toucher et sous 980 px.
- Mouvement réduit : aucune translation ni ressort, contenu toujours visible.
- Impression : `Ctrl + P` imprime le CV de deux pages dans la langue affichée. `cv.html` présente le même CV à l'écran.

## Test local

```bash
python3 -m http.server 8765
```

Puis `http://localhost:8765/`. En local seulement, `?data=worst` (cas extrêmes) et `?data=empty` (listes vides) chargent des jeux de test, avec un commutateur en bas de page. Ils n'existent jamais en production.

## Licence

Le contenu du site est publié sous [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr) : réutilisation libre avec attribution, hors usage commercial, et partage aux mêmes conditions. La mention figure au pied du contact, dans les deux langues (`ui.license` et `ui.licenseTitle` dans `content.js`).

## Crédits

Figtree sous licence SIL Open Font License (`assets/fonts/figtree-OFL.txt`). Devicon sous licence MIT. Icônes QGIS, ArcGIS, GeoPandas et Talend issues de Simple Icons (CC0). Pictogrammes de sport issus de Material Design Icons, licence Apache 2.0. Les logos affichés restent la propriété de leurs détenteurs.
