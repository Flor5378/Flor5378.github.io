# Flor5378.github.io

Site personnel statique, bilingue français / anglais. Aucune dépendance, aucun build, aucune analytique.

## Arborescence

```
index.html                  coquille HTML, métadonnées, barre latérale
README.md
assets/
  content.js                TOUT le contenu FR et EN. Seul fichier à modifier au quotidien
  app.js                    rendu, sommaire actif, langue, thème, aperçus GitHub
  style.css                 mise en page, typographie, thèmes clair et sombre, impression
  fonts/                    Newsreader et IBM Plex Sans, auto-hébergés
  logos/tech/               icônes des technologies (Devicon)
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

Le lien et l’aperçu au survol sont déduits de `repo`. Le sommaire et les compteurs se régénèrent seuls.

## Logos

| Valeur de `logo` | Comportement |
| --- | --- |
| `'nato.int'` | favicon récupéré automatiquement auprès du service Google |
| `'assets/logos/x.png'` | fichier local, prioritaire |
| absent ou fichier introuvable | pastille avec les initiales, ou le champ `short` |

Trois logos attendent un fichier local, faute de site officiel exploitable. Déposez-les et ils apparaissent sans autre modification :

```
assets/logos/baed.png
assets/logos/mun.png
assets/logos/passe-compose.png
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

## Fonctionnement

- Langue : `?lang=fr` ou `?lang=en` dans l’URL, sinon la langue du navigateur, puis mémorisation du choix.
- Thème : préférence système au premier chargement, puis mémorisation du choix.
- Aperçus de projets : image sociale générée par GitHub, chargée au survol uniquement, sur écran non tactile.
- Impression : `Ctrl + P` produit une version CV propre, sans barre latérale.

## Crédits

Newsreader et IBM Plex Sans sous licence SIL Open Font License. Devicon sous licence MIT.
