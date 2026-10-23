# Velours · passation design pour Claude Code

Site personnel de Florian Grolleau · direction retenue « 5 · Velours » · version du 23 octobre 2026

Ce document décrit tout ce qu’il faut pour coder le nouveau site à partir des maquettes : jetons, structure de chaque section, états de chaque composant, fiche de chaque animation, règles de données, version imprimable, résultats des passes break-ui et mobile-native. Il ne contient pas le code de production.

## 0. À lire d’abord

### 0.1 Sources de vérité

| Priorité | Source | Rôle |
|---|---|---|
| 1 | Ce document | Règles, valeurs, comportements |
| 2 | `velours-styles.css` (livré avec ce document) | Feuille de style complète de la maquette, valeurs exactes. Les classes `v-*` peuvent être renommées, pas les valeurs |
| 3 | Canevas Design « Site Florian Grolleau » | Référence visuelle et interactive : pages « Étape 2 · Velours », « CV imprimable », « États des composants », « Étape 3 · cas extrêmes » |
| 4 | `assets/content.js` du dépôt `Flor5378/Flor5378.github.io` | Tout le texte FR et EN. Aucune chaîne de contenu codée en dur |

Les planches du canevas sont interactives : survols, bascule de langue, bascule de thème, menu, aperçus GitHub et feuille basse fonctionnent. Elles servent de prototype de référence pour le mouvement.

### 0.2 Ce qui change par rapport au site actuel

1. La forme est entièrement nouvelle. Rien de l’ancien style n’est conservé : ni Geist, ni le fond `#F7F8FA`, ni l’accent `#1D4ED8`, ni le rayon de 14 px, ni la mise en page en colonne de cartes.
2. Le monogramme « FG » de l’en-tête est supprimé. `CONFIG.initials` n’est plus utilisé nulle part ; le nom « Florian Grolleau » suffit. `CONFIG.photo` n’est pas utilisé non plus.
3. Dans `hero.meta`, la ligne « Actuellement » passe de « Libreville, Gabon » à « Versailles, France » (FR) et de « Libreville, Gabon » à « Versailles, France » (EN, libellé « Currently »). Le lieu des entrées d’expérience (« Libreville, Gabon » pour le ministère des Armées) reste inchangé : c’est le lieu du stage.
4. `ORGS.entreprises` reçoit Deloitte, EY, Capgemini Invent et Wavestone (objets exacts en 7.2).
5. De nouvelles chaînes d’interface entrent dans `ui` (liste en 7.3).

### 0.3 Points à faire trancher par Florian

Ces points n’ont pas été modifiés dans les maquettes.

1. Le dépôt `Flor5378/-ENG-GlobalRiskIntelligencePlatform` est privé ou introuvable. Le lien « tableau de bord prédictif » et la ligne de projet 11 mènent à une erreur 404. Les maquettes affichent l’état « Aperçu indisponible » et renvoient vers le profil GitHub.
2. L’introduction dit encore « Actuellement en stage au ministère des Armées » alors que le stage s’est terminé en août 2026.
3. `assets/logos/hadit.png` et `assets/logos/mun.png` sont référencés dans `content.js` mais absents du dépôt. Les maquettes montrent l’état « logo absent » (initiales `HADIT` et `MUN`).

## 1. Architecture conseillée

1. Site statique sur GitHub Pages, sans framework : HTML, une feuille de style, deux modules JS. Aucune bibliothèque d’animation n’est nécessaire ; tout le mouvement tient en CSS plus un petit intégrateur de ressorts (annexe B).
2. Fichiers proposés :

| Fichier | Contenu |
|---|---|
| `index.html` | Squelette, balises meta (6.4), script de thème avant affichage |
| `assets/css/velours.css` | Jetons (annexe A) et composants (reprendre `velours-styles.css`) |
| `assets/js/app.js` | Rendu FR/EN depuis `content.js`, navigation, aperçus, menu, feuille basse |
| `assets/js/motion.js` | Ressorts, forme liquide, surbrillances glissantes, pilule de navigation |
| `assets/content.js` | Inchangé dans sa structure, enrichi (7.2 et 7.3) |
| `assets/github.json` | Généré par une action GitHub (7.4) |
| `cv.html` | Version imprimable (section 8) |

3. Thème : au premier passage, suivre `prefers-color-scheme` ; ensuite, mémoriser le choix (`localStorage`, lecture protégée par `try`). Poser `data-theme` sur `<html>` dans un script en ligne dans `<head>`, avant la feuille de style, pour éviter un flash.
4. Langue : conserver le comportement actuel du site, mémoriser le choix, mettre à jour `<html lang>`, `document.title` (`docTitle`) et la meta description (`description`).
5. Mouvement réduit : `@media (prefers-reduced-motion: reduce)` pilote tout (section 5.9). La maquette expose aussi une prop `motion` pour le simuler.

## 2. Jetons de design

### 2.1 Couleurs

| Jeton | Clair | Sombre | Usage |
|---|---|---|---|
| `--paper` | `#F3EEE6` | `#170C0E` | Fond de page, feuilles paires |
| `--paper-2` | `#EAE2D6` | `#1F1012` | Feuilles « alt » (Formation, Projets, Organisations), panneaux d’intérêts, puces |
| `--ink` | `#241316` | `#F1E8DD` | Texte principal, bouton Menu, fond du menu téléphone |
| `--ink-2` | `#6B5A5C` | `#BCAAA7` | Texte secondaire, lieux, sous-titres, notes |
| `--wine` | `#6E1527` | `#E38D9C` | Accent : numéros, liens, pilule active, anneau de focus |
| `--wine-hero` | `#6E1527` | `#521020` | Surfaces bordeaux : accueil, contact, panneau d’aperçu, popover, feuille basse |
| `--wine-blob` | `#8E2A3D` | `#74192D` | Forme liquide (bord du dégradé), forme du contact |
| `--wine-blob-2` | `#A63D53` | `#8E2A3D` | Forme liquide (centre du dégradé radial, foyer 38 % 32 %, rayon 75 %) |
| `--wine-soft` | `rgba(110,21,39,.08)` | `rgba(227,141,156,.12)` | Surlignage `<mark>`, liens de dépôt, bascule de langue, capsule de navigation, pastilles d’initiales |
| `--wine-glide` | `rgba(110,21,39,.07)` | `rgba(241,232,221,.06)` | Surbrillance glissante des listes |
| `--on-wine` | `#F3EEE6` | `#F1E8DD` | Texte sur bordeaux |
| `--on-wine-2` | `rgba(243,238,230,.76)` | `rgba(241,232,221,.74)` | Texte secondaire sur bordeaux |
| `--on-wine-3` | `rgba(243,238,230,.14)` | `rgba(241,232,221,.12)` | Fonds translucides sur bordeaux (pastilles, boutons) |
| `--inv-2` | `rgba(243,238,230,.64)` | `rgba(23,12,14,.62)` | Texte secondaire du menu (surface `--ink`) |
| `--inv-3` | `rgba(243,238,230,.13)` | `rgba(23,12,14,.09)` | Fonds du menu (bouton fermer, bascules) |
| `--rule` | `#DCD1C4` | `#3A2528` | Filets, hachures des emplacements de logo |
| `--tile` | `#F8F4EE` | `#24131A` | Tuile survolée, fond d’emplacement de logo |
| `--bar` | `rgba(243,238,230,.8)` | `rgba(23,12,14,.8)` | Barre collante, avec `backdrop-filter: blur(18px) saturate(1.4)` |

Couleurs de langage GitHub dans les aperçus : Python `#3572A5`, Jupyter Notebook `#DA5B0B`, R `#198CE7`, SQL `#8A7F7A`, tout autre langage `--on-wine-2`.

`theme-color` : `#F3EEE6` en clair, `#170C0E` en sombre (couleur de la barre, pas de la marque).

Contrastes mesurés (WCAG 2.2, couleurs translucides composées sur leur fond réel). Tous les couples de texte passent le niveau AA (4,5:1).

| Couple | Clair | Sombre |
|---|---|---|
| `--ink` sur `--paper` | 15,41 | 15,82 |
| `--ink` sur `--paper-2` | 13,86 | 15,18 |
| `--ink-2` sur `--paper` | 5,61 | 8,62 |
| `--ink-2` sur `--paper-2` | 5,04 | 8,28 |
| `--wine` sur `--paper` | 10,10 | 7,81 |
| `--wine` sur `--wine-soft` | 8,74 | 6,56 |
| `--paper` sur `--wine` (pilule active) | 10,10 | 7,81 |
| `--on-wine` sur `--wine-hero` | 10,10 | 11,92 |
| `--on-wine-2` sur `--wine-hero` | 6,38 | 7,04 |
| `--on-wine-2` sur `--wine-blob` (texte au-dessus de la forme) | 4,78 | 5,57 |

### 2.2 Typographie

Famille unique : **Figtree**, variable (graisses 300 à 900, italique disponible), Google Fonts ou auto-hébergée en woff2 (préférable pour le CV imprimé). Repli : `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif`. Corps de base 17 px, `-webkit-font-smoothing: antialiased`.

| Rôle | Taille | Graisse | Interligne | Approche |
|---|---|---|---|---|
| Nom, accueil | `clamp(70px, 13.4vw, 206px)` | 300 | .86 | -.055em |
| Courriel, contact | `clamp(24px, min(9.6vw, 100cqi / (n × .47)), 148px)`, n = nombre de caractères | 300 | 1 | -.055em |
| Titre de section | `clamp(52px, 7.4vw, 112px)` ; sous 640 px `clamp(40px, 13.4vw, 64px)` | 300 | .95 | -.05em |
| Liens du menu téléphone | 34 px | 330 | 1.18 | -.03em |
| Introduction du profil | `clamp(21px, 2.05vw, 30px)` | 380 | 1.42 | -.012em |
| Titre d’entrée (organisation) | `clamp(24px, 2.2vw, 31px)` | 450 | 1.12 | -.025em |
| Titre d’aperçu | 30 px (panneau), 22 px (popover, feuille) | 450 | 1.12 | -.025em |
| Corps du contact | `clamp(18px, 1.6vw, 22px)` | 380 | 1.45 | 0 |
| Titre de projet | 19 px ; 17 px sous 640 px | 480 | 1.25 | -.015em |
| Libellés (compétences, groupes) | 20 px | 450 | normal | -.015em |
| Corps des entrées | 16 px | 400 | 1.66 | 0 |
| Période | 14,5 px, chiffres tabulaires | 700 | normal | 0 |
| Lieu, sous-titre, note | 14 à 15 px, `--ink-2` | 400 | 1.4 à 1.6 | 0 |
| Navigation | 14 px | 560 | normal | 0 |
| Boutons | 15,5 px | 700 (principal), 600 (secondaire) | 1 | 0 |
| Puces de compétence | 14,5 px | 550 | normal | 0 |
| Étiquettes, pastilles | 11,5 à 13 px | 650 à 700 | normal | 0 |
| Numéros de section | 14 px, `--wine`, chiffres tabulaires | 700 | normal | 0 |

Règles typographiques :

1. Chiffres tabulaires (`font-variant-numeric: tabular-nums`) sur les périodes, numéros de section et de projet, compteurs.
2. En français, espace fine insécable U+202F dans les nombres et avant le signe pour cent (« 2 500 », « 21 millions », « 90 % ») ; espace insécable U+00A0 avant le deux-points. À corriger dans `content.js`.
3. `text-wrap: balance` sur les titres d’entrée et les noms de tuiles, `text-wrap: pretty` sur les paragraphes.
4. Un nom composé ne se coupe jamais à ses traits d’union : chaque mot contenant un trait d’union est rendu dans un `<span>` en `white-space: nowrap`, les espaces restant des points de coupure (« Saint-Germain-en-Laye, » puis « Île-de-France »). S’applique aux lieux de l’accueil, du profil et des entrées.
5. Le courriel se coupe d’abord après « @ » (`<wbr>`), puis où il le faut (`overflow-wrap: anywhere`).
6. Les titres de section sont des `<h2>` ; le nom est l’unique `<h1>`.

### 2.3 Espacements et grille

| Élément | Valeur |
|---|---|
| Marge latérale `--pad` | `max(clamp(20px, 4.4vw, 72px), env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px))` |
| Conteneur | `max-width: 1320px`, centré |
| Feuille de section | padding `104px --pad 120px` ; sous 640 px `76px --pad 88px` ; chevauchement `margin-top: -40px` (-28 px) |
| Profil (première feuille) | `margin-top: 28px` (20 px) sous l’accueil |
| Accueil | marge latérale 12 px (8 px), padding `52px --pad 48px` (`34px 22px 28px`), hauteur min `clamp(560px, 52vw, 760px)`, collé à `top: 76px` (68 px sous 980 px) |
| Barre | padding `calc(12px + env(safe-area-inset-top))` `--pad` 12 px |
| Ligne d’entrée | grille `170px 1fr 1.25fr 56px`, gap 32, padding vertical 30 |
| Projets | grille `1.15fr .85fr`, gap 56 ; lignes de 60 px min |
| Compétences | grille `.55fr 1.6fr`, gap 40, padding vertical 24 |
| Profil | grille `.7fr 1.6fr`, gap 72 |
| Tuiles | 4 colonnes, gap 8 ; 3 sous 1180 px ; 2 sous 820 px |
| Intérêts | 3 colonnes, gap 16 ; 1 sous 980 px |
| En-tête de section | 38 px sous le titre (26 px sous 640 px) |

Points de rupture : 1180 px (navigation compacte), 980 px (une colonne, panneau d’aperçu remplacé par la feuille basse), 820 px (tuiles sur 2 colonnes), 640 px (téléphone : rayons réduits, tuiles empilées, boutons en liste), 400 px (noms de tuiles 13,5 px).

### 2.4 Rayons

| Élément | Rayon |
|---|---|
| Feuilles de section | 40 px en haut seulement (28 px sous 640 px) |
| Accueil | 40 px (28 px) |
| Menu téléphone | 32 px |
| Panneau d’aperçu, feuille basse, panneaux d’intérêts | 30 px |
| Popover d’aperçu | 26 px |
| Tuile | 22 px, 28 px au survol (20 px sous 640 px) |
| Emplacements de logo | carré 56 : 18 px ; carré 40 : 12 px ; large 120 × 44 : 14 px |
| Boutons, pilules, puces, bascules | 999 px |
| Pastille de statut | 20 px (supporte plusieurs lignes) |
| Bouton copier | 22 px (supporte plusieurs lignes) |
| Anneau de focus | forme de l’élément ; 6 px pour les liens texte ; 14 px pour les lignes de projet |

### 2.5 Ombres et matières

| Jeton | Clair | Sombre | Usage |
|---|---|---|---|
| `--sheet-shadow` | `0 -24px 60px -30px rgba(36,19,22,.34)` | `0 -24px 60px -24px rgba(0,0,0,.7)` | Bord supérieur des feuilles qui recouvrent la précédente |
| `--shadow` | `0 30px 70px -30px rgba(36,19,22,.55)` | `0 30px 70px -26px rgba(0,0,0,.85)` | Panneau d’aperçu, popover, menu, feuille basse |
| Barre | flou 18 px, saturation 1,4 sur `--bar` | idem | En-tête collant |
| Voile du menu | `rgba(11,5,6,.38)` | idem | Derrière le menu téléphone |
| Voile de la feuille basse | `rgba(11,5,6,.42)` | idem | Derrière la feuille d’aperçu |
| Assombrissement de l’accueil | `#0B0506`, opacité 0 à .42 | idem | Recul au défilement |

### 2.6 Courbes et ressorts

| Jeton | Valeur | Usage |
|---|---|---|
| `--ease-out` | `cubic-bezier(.23,1,.32,1)` | Entrées, révélations, soulignements, retours tactiles |
| `--ease-io` | `cubic-bezier(.77,0,.175,1)` | Fermetures, masque du croissant, transition de thème |
| `--spring` | `cubic-bezier(.3,1.25,.5,1)` | Ressort CSS à léger dépassement : bascule de langue, flèches, logos, titres, ouvertures |

Ressorts JS (annexe B) : intégration semi-implicite, pas plafonné à 32 ms, paramétrés par la réponse (période en secondes) et l’amortissement ζ. Ils sont interruptibles : une nouvelle cible conserve la vitesse en cours.

| Usage | Réponse | ζ | Arrêt |
|---|---|---|---|
| Pilule de navigation (x et largeur) | 0,38 s | 0,80 | écart et vitesse < 0,05 |
| Surbrillance glissante (y et hauteur) | 0,36 s | 0,86 | idem |
| Hauteur du panneau d’aperçu | 0,42 s | 0,90 | idem |
| Forme liquide (12 rayons) | 0,90 s | 0,55 | écart et vitesse < 0,0005 |

## 3. Structure des sections

Ordre de la page : barre, accueil, profil, puis les sections de `content.sections` dans leur ordre (Formation 01, Expérience 02, Projets 03, Compétences 04, Organisations 05, Intérêts 06, Contact 07). Chaque section est une « feuille » arrondie qui recouvre la précédente ; les feuilles alternent `--paper` et `--paper-2`, l’accueil et le contact sont bordeaux.

Règles transverses :

1. Une section sans contenu est masquée et retirée de la navigation ; les numéros sont recalculés (01, 02, ...). Un groupe vide (projets, organisations) est masqué.
2. Un champ optionnel absent (`sub`, lieu, `url`, `tags`, `logo`) est omis sans laisser de ligne vide ni de marge. Une organisation sans `url` est un titre simple, sans flèche.
3. Les numéros affichés à côté des titres et dans la navigation viennent de la position, pas du contenu.
4. Les ancres de section gardent les `id` de `content.js` (`formation`, `experience`, `projets`, `competences`, `organisations`, `interets`, `contact`) ; `scroll-margin-top` égal à la hauteur de la barre.

### 3.1 Barre

| Zone | Contenu | Détail |
|---|---|---|
| Gauche | « Florian Grolleau » | Lien vers `#top`, 17 px, 650. Aucun logo ni monogramme |
| Centre (au-dessus de 1180 px) | Navigation : 7 liens | Capsule `--wine-soft`, padding 4 ; pilule glissante sous l’item survolé ou la section lue (5.3) |
| Droite (au-dessus de 1180 px) | Bascule FR/EN, bouton de thème | Segment 2 × 42 px ; disque de 40 px |
| Droite (sous 1180 px) | Numéro et nom de la section lue, bouton « Menu » | Libellé `aria-live="polite"` ; « Accueil » quand aucune section n’est lue ; bouton fond `--ink`, texte `--paper` |

Collante en haut (`position: sticky; top: 0; z-index: 40`), fond `--bar` flouté.

Section lue (espion de défilement) : la dernière section dont le haut est passé au-dessus d’une ligne située à `min(40 % de la hauteur de fenêtre, 360px)` du haut. Avant la première section, aucune n’est lue.

### 3.2 Menu (sous 1180 px)

1. Panneau `position: fixed` en haut à droite (10 px, plus les zones sûres), largeur `min(440px, 100% - 20px)`, fond `--ink`, texte `--paper`, rayon 32, `--shadow`.
2. En-tête : « Sommaire » (14 px, `--inv-2`) et bouton fermer de 44 px.
3. Sept liens à 34 px, chacun précédé de son numéro (13 px, `--inv-2`) ; la section lue est soulignée.
4. Pied, séparé par un filet `--inv-3` : bascule FR/EN et bouton de thème, aux couleurs inversées.
5. Voile derrière le panneau. Fermeture : voile, Échap, bouton, ou choix d’un lien.
6. `max-height: calc(100dvh - 20px - env(safe-area-inset-top))`, défilement interne en `overscroll-behavior: contain` (paysage).
7. Le panneau naît du bouton Menu (5.6) : même couleur, même coin.

### 3.3 Accueil

| Zone | Contenu | Données |
|---|---|---|
| Haut gauche | Rôle A, 15 px, 600, `--on-wine-2` | `hero.role`, partie avant « · » |
| Haut droite | Pastille de statut avec point vivant | `hero.meta` « Statut » / « Status » |
| Centre | Nom sur deux lignes, « Florian » puis « Grolleau » | Fixe |
| Bas gauche | Rôle B (16 px, 600, `--on-wine`) et lieu avec pictogramme | `hero.role` après « · » ; `hero.meta` « Actuellement » / « Currently » |
| Bas droite | « Écrire » (principal, `mailto:`), « GitHub », « LinkedIn » (secondaires) | `CONFIG.email`, `CONFIG.github`, `CONFIG.linkedin` |
| Fond | Forme liquide SVG, dégradé radial `--wine-blob-2` vers `--wine-blob` | Centre à 74 % × 52 %, rayon 36 % du petit côté ; sous 700 px de large : 78 % × 60 %, 46 % |

L’accueil est collé (`top: 76px`) : les feuilles suivantes glissent par-dessus pendant qu’il recule (5.2).

Téléphone : la pastille passe sous le rôle A ; nom à 70 px ; boutons en grille de deux colonnes, « Écrire » sur toute la largeur, flèches alignées à droite.

### 3.4 Profil

Première feuille, sans numéro. Grille `.7fr 1.6fr`.

1. Colonne gauche : « Profil » (14 px, 700, `--wine`) ; liste de définitions des `hero.meta` sauf « Statut » (terme 13 px 650 `--ink-2`, valeur 18 px 550) ; bouton copier qui affiche l’adresse.
2. Colonne droite : `hero.intro` en 21 à 30 px ; le `<mark>` devient une pastille `--wine-soft` au texte `--wine`, coupée proprement sur plusieurs lignes (`box-decoration-break: clone`).

Téléphone : une colonne, l’introduction sous le bouton copier.

### 3.5 Formation (01) et Expérience (02)

Feuille alt pour Formation, normale pour Expérience. En-tête : numéro puis titre de section.

Chaque entrée est un `<article>` en grille de quatre colonnes :

| Colonne | Contenu | Données |
|---|---|---|
| 1 (170 px) | Période (14,5 px, 700) puis lieu (14 px, `--ink-2`) | `meta[0]`, `meta[1]` |
| 2 | Titre (lien externe avec flèche, ou texte) puis sous-titre | `title`, `url`, `sub` |
| 3 | Corps, puis étiquettes (pastilles 12,5 px 650, icône 14 px si fournie) | `body`, `tags` |
| 4 (56 px) | Emplacement de logo carré | `logo`, `short` |

Filet `--rule` entre deux entrées. Au survol d’une entrée : surbrillance glissante (5.4) et logo qui s’arrondit (5.5).

Le corps peut contenir des liens de dépôt (`<a data-repo="Flor5378/...">`) : ils deviennent des pastilles `--wine-soft` qui ouvrent un aperçu GitHub (5.7).

Un logo large (`wide: true`) dans une entrée occupe le même carré de 56 px, image contenue.

Téléphone (sous 980 px) : période et lieu en première ligne avec le logo (48 px) à droite, puis titre, sous-titre, corps et étiquettes sur toute la largeur.

### 3.6 Projets (03)

Feuille alt. En-tête : numéro et titre à gauche, note à droite (`note` ; au toucher, `ui.noteTouch`).

Grille `1.15fr .85fr` :

1. Liste : groupes (`groups[]`) avec une étiquette en pastille (libellé `--wine` 700, compteur `--ink-2`), puis des lignes. Ligne : numéro global sur deux chiffres (01 à 12), titre, pastille de langue (`FR`, `EN`, `FR / EN`), flèche visible quand la ligne est sélectionnée. Lien vers le dépôt (ou le profil GitHub si le dépôt est indisponible).
2. Panneau d’aperçu collé (`top: 96px`), bordeaux, rayon 30. Il montre l’invite au chargement, puis l’aperçu de la ligne survolée ou focalisée. Il garde la dernière sélection quand le pointeur quitte la liste (pas de retour à l’invite). États en 4.3.

Sous 980 px : panneau masqué ; toucher une ligne ouvre la feuille basse d’aperçu (5.6) au lieu de suivre le lien. Sur une tablette tactile au-dessus de 980 px : le premier appui sélectionne la ligne et remplit le panneau, le second ouvre le dépôt.

La maquette épingle Gabon Monitor au chargement pour la présentation. En production, afficher l’invite tant que rien n’est survolé.

### 3.7 Compétences (04)

Feuille normale. Une ligne par entrée de `rows` : libellé à gauche (20 px, 450), puces à droite. Puce : fond `--paper-2`, 14,5 px 550, hauteur 36 px min, icône 14 px quand `|icone` est fourni. Les puces ne sont pas interactives (survol décoratif seulement).

Téléphone : libellé au-dessus des puces.

### 3.8 Organisations (05)

Feuille alt. Titre long, note sous le titre. Deux groupes (« Institutions », « Entreprises ») : en-tête avec le libellé (20 px) et le compteur (`--wine`, 700), puis une grille de tuiles.

Tuile : lien externe, fond `--paper`, rayon 22, logo 40 px, nom (15,5 px, 550, `text-wrap: balance`), flèche qui apparaît au survol. Les tuiles d’une même rangée ont la même hauteur.

Sous 640 px : tuiles empilées (logo au-dessus du nom), pas de flèche, deux colonnes.

### 3.9 Intérêts (06)

Feuille normale. Trois panneaux (`blocks[]`) : `--paper-2`, rayon 30, padding 26. Contenu : titre en pastille (`meta[0]`), texte, puis une rangée en bas :

1. Lectures : logos (le premier large 120 × 44, les autres carrés 40).
2. Sports : pastilles avec pictogramme SVG de 22 px (remplissage `--wine`) et nom.
3. Jeu de stratégie : logo carré 40 et étiquette « Age of Empires II ».

Sous 980 px : une colonne.

### 3.10 Contact (07)

Feuille bordeaux, forme statique à droite (52 % de la largeur, 120 % de la hauteur, `--wine-blob`).

1. En-tête : numéro (`--on-wine-2`) et titre à gauche, corps à droite (max 40 caractères par ligne, `--on-wine-2`).
2. Courriel géant, lien `mailto:`, taille ajustée à la largeur disponible (2.2).
3. Actions : « Copier l’adresse » (fond `--on-wine-3`), « github.com/Flor5378 » et « LinkedIn » (contour).
4. Pied, séparé par un filet `--on-wine-3` : « Florian Grolleau » à gauche ; « Code source » (lien vers le dépôt du site) puis la licence en `<abbr title="...">` à droite (`ui.source`, `ui.license`, `ui.licenseTitle`).

Téléphone : actions en liste pleine largeur, 52 px de haut, libellé à gauche et icône à droite, « Copier l’adresse » en premier.

## 4. Composants et états

Les survols n’existent que pour un pointeur fin (`@media (hover: hover) and (pointer: fine)`). Au toucher, seul l’état actif existe. La planche « États des composants » montre chaque état en clair et en sombre.

### 4.1 Contrôles

| Composant | Repos | Survol | Focus clavier | Actif | Autres états |
|---|---|---|---|---|---|
| Bouton principal | Fond `--on-wine`, texte `--wine-hero`, 52 px, padding 0 24 | Flèche décalée de 3 px vers le haut à droite | Anneau 2 px `--on-wine`, décalage 3 px | `scale(.95)` | Aucun |
| Bouton secondaire | Contour 1,5 px `rgba(243,238,230,.38)`, texte `--on-wine` | Fond `--on-wine-3`, contour à 70 %, flèche décalée | Anneau 2 px `--on-wine` | `scale(.95)` | Aucun |
| Lien de titre d’entrée | Texte `--ink`, flèche `--wine` | Trait de 1,5 px tracé de gauche à droite, flèche décalée | Anneau 2 px `--wine`, rayon 6 | Opacité .62 | Sans `url` : texte simple |
| Lien de dépôt dans le texte | Pastille `--wine-soft`, texte `--wine` 600 | Fond `--wine`, texte `--paper` ; aperçu après 160 ms | Comme le survol, plus l’anneau | Fond `--wine` | Ouvert : fond `--wine` |
| Item de navigation | Texte `--ink-2` | Pilule `rgba(107,90,92,.16)` sous l’item, texte `--ink` | Anneau 2 px `--wine` | Aucun | Section lue : pilule `--wine`, texte `--paper`, `aria-current="location"` |
| Bascule FR/EN | Segment `--wine-soft`, langue active sur pastille `--wine`, texte `--paper` | Aucun | Anneau sur le bouton | `scale(.95)` | Au toucher : 46 × 44 px par bouton ; `aria-pressed` |
| Bouton de thème | Disque 40 px `--wine-soft` ; clair : soleil (disque réduit à 70 % et 8 rayons) ; sombre : croissant | Aucun | Anneau | `scale(.95)` | 44 px au toucher |
| Bouton Menu | Fond `--ink`, texte `--paper`, 40 px (44 au toucher) | Aucun | Anneau | `scale(.95)` | `aria-expanded` |
| Libellé de section (barre compacte) | Numéro `--wine` 700 et nom | Aucun | Aucun | Aucun | Bascule animée à chaque changement de section |
| Ligne de projet | Numéro, titre 19 px, pastille de langue | Surbrillance glissante, titre `--wine`, flèche qui entre | Anneau 2 px, décalage 2, rayon 14 | Fond `--wine-glide` | Sélectionnée : titre `--wine` et flèche |
| Tuile d’organisation | Fond `--paper`, rayon 22 | Fond `--tile`, montée de 2 px, rayon 28, logo rond, flèche | Anneau 2 px | `scale(.98)` | Logo carré, favicon, absent ; nom long sur plusieurs lignes |
| Puce de compétence | Fond `--paper-2`, texte `--ink` | Montée de 2 px, fond `--wine-soft`, texte `--wine` | Aucun (non focalisable) | Aucun | Avec ou sans icône |
| Bouton copier (profil) | Fond `--wine-soft`, texte `--wine`, montre l’adresse | Fond `--wine`, texte `--paper` | Anneau 2 px | `scale(.96)` | Copié : « Adresse copiée » pendant 1,8 s |
| Bouton copier (contact) | Fond `--on-wine-3` | Fond `rgba(243,238,230,.24)` | Anneau `--on-wine` | `scale(.95)` | Copié : idem |
| Courriel géant | Texte `--on-wine` | Soulignement de 0,045 em tracé de gauche à droite | Anneau `--on-wine`, rayon 6 | Opacité .62 | Long : coupure après « @ » |
| Liens du pied | Soulignement `--on-wine-3` | Soulignement `currentColor` | Anneau `--on-wine` | Opacité .62 | Au toucher : zone de 44 px de haut |

Anneau de focus : `outline: 2px solid` avec `outline-offset: 3px`, couleur `--wine` sur papier, `--on-wine` sur les surfaces bordeaux (accueil, contact, panneau, popover, feuille basse), `--paper` sur le menu. Uniquement en `:focus-visible`. L’anneau ne modifie jamais le rayon d’un bouton.

### 4.2 Emplacements de logo

| Type | Taille | Rayon | Vide (maquette) | Image | Absent |
|---|---|---|---|---|---|
| Carré, entrées | 56 × 56 (48 sous 980 px) | 18 | Hachures `--rule` 1 px tous les 7 px à 135° sur `--tile` | Plein cadre (`object-fit: cover`) si le logo a son propre fond ; sinon contenu avec 6 px de marge | Initiales ou `short`, 12 px 800 `--wine` sur `--wine-soft` |
| Carré, tuiles et intérêts | 40 × 40 | 12 | Idem | Favicon centré à 22 à 24 px sur `--tile` | Idem, 10,5 px |
| Large, intérêts | 120 × 44 | 14 | Idem | Contenu (`contain`) avec 6 px de marge, plaque blanche | Nom en capitales 10 px |

Règles :

1. Une image de logo est toujours posée sur une plaque claire (`#fff` ou `--tile` en clair, `#F1E8DD` en sombre), pour qu’un logo sombre reste lisible en thème sombre.
2. Résolution dans l’ordre : fichier local, puis favicon du domaine, puis initiales (7.5). Une image qui échoue (`onerror`) bascule sur les initiales.
3. Au survol d’une entrée, le logo devient rond, tourne de -8° et grossit à 1.04 ; au survol d’une tuile, il devient rond.

### 4.3 Aperçu GitHub (panneau, popover et feuille basse)

Trois contenants, un même contenu : panneau collé à droite des projets (bureau), popover sous ou au-dessus d’un lien de dépôt dans le texte (bureau), feuille basse (sous 980 px et au toucher).

| État | Contenu | Action |
|---|---|---|
| Invite (panneau seulement) | « GitHub · Flor5378 », la note, trois pastilles fantômes `--on-wine-3` | Aucune |
| Chargement | Groupe, titre et slug connus depuis `content.js` ; deux barres et deux pastilles en scintillement | Aucune |
| Disponible | « GitHub · Flor5378 · Groupe », titre du projet (`content.js`), slug, description (4 lignes au plus, points de suspension), pastilles : langage avec sa couleur, « Mis à jour le 11 août 2026 », « Rédigé en FR » | « Ouvrir le dépôt » |
| Sans description | Idem, description remplacée par « Pas de description sur GitHub. » en italique | « Ouvrir le dépôt » |
| Indisponible | Titre et slug, « Aperçu indisponible : dépôt privé ou introuvable. » en italique, aucune pastille | « Voir le profil GitHub » vers `CONFIG.github` |

Règles :

1. Le titre est celui de `content.js`, jamais le slug du dépôt (souvent illisible). Le slug suit en petit (12,5 px, `overflow-wrap: anywhere`).
2. Une pastille dont la donnée manque (langage, date) est omise ; si plus rien ne reste, la rangée disparaît.
3. La date vient de `pushed_at`, formatée par `Intl.DateTimeFormat` (`fr-FR` ou `en-GB`, jour numérique, mois long, année).
4. Dans la feuille basse, « Ouvrir le dépôt » est un bouton principal et « Fermer » un bouton translucide, tous deux de 52 px.

### 4.4 Menu et feuille basse

| Composant | Fermé | Ouvert | Autres |
|---|---|---|---|
| Menu | Panneau découpé à la forme du bouton Menu (`clip-path`), invisible, hors de l’ordre de tabulation | Panneau entier, liens en cascade, voile | Focus piégé dans le panneau ; retour au bouton à la fermeture |
| Feuille basse | `translateY(110%)`, `visibility: hidden` ; absente au-dessus de 980 px | En bas de l’écran (8 px des bords, zone sûre en plus), voile | Glissée : suit le doigt ; vers le haut, résistance élastique |

## 5. Animations

Chaque fiche donne : nom (vocabulaire usuel entre parenthèses), déclencheur, propriétés animées, durée, courbe ou ressort, cascade ou délai, comportement en mouvement réduit. Les noms de classes renvoient à `velours-styles.css`. Aucune animation principale n’est un simple fondu : le fondu n’existe qu’en mouvement réduit.

Toutes les entrées utilisent `animation-fill-mode: backwards` pour que l’état de départ s’applique pendant le délai.

### 5.1 Chargement

| Nom | Déclencheur | Propriétés | Durée | Courbe | Cascade, délai | Mouvement réduit |
|---|---|---|---|---|---|---|
| Entrée de la feuille d’accueil (Scale in) | Chargement | `translateY(40px) scale(.96)` vers repos ; `border-radius` 80 px vers 40 px | 1100 ms | `--ease-out` | Aucun | Fondu 200 ms |
| Révélation du nom (Reveal par masque, Stagger) | Chargement | Chaque ligne dans un masque `overflow: hidden` ; texte `translateY(104%)` vers 0 | 1300 ms | `--spring` | 260 ms, puis 120 ms par ligne | Fondu 200 ms |
| Entrées de l’accueil (Blur in, Stagger) | Chargement | `opacity` 0 vers 1 ; `translateY(28px) scale(.985)` vers repos ; `blur(8px)` vers 0 | 1000 ms | `--ease-out` | Rôle A 300 ms, statut 420 ms, rôle B et lieu 700 ms, boutons 820 ms | Fondu 200 ms |
| Point vivant du statut (Pulse) | Chargement | Halo du point : `scale(1)` vers `scale(3.2)`, `opacity` .7 vers 0 | 1800 ms | `--ease-out` | 1600 ms, 3 itérations puis arrêt | Supprimé |
| Respiration de la forme (Spring) | Chargement | Les 12 rayons partent de 0,62 × R et rejoignent la forme de repos | Ressort 0,9 s, ζ .55 | Ressort | 380 ms | Forme de repos immédiate |

### 5.2 Défilement et transitions entre sections

| Nom | Déclencheur | Propriétés | Durée | Courbe | Cascade, délai | Mouvement réduit |
|---|---|---|---|---|---|---|
| Recul de l’accueil (Scroll-driven animation) | Défilement de 0 à 0,9 × la hauteur de l’accueil | Accueil `scale(1)` vers `scale(.94)`, origine en haut au centre ; voile `#0B0506` de 0 à .42 | Liée au défilement | Linéaire | Aucune | Désactivé |
| Arrivée des feuilles (Scroll reveal) | 4 % de la feuille visible (IntersectionObserver, une seule fois) | `translateY(56px)` vers 0 ; rayons du haut 96 px vers 40 px | 1000 ms | `--ease-out` | Aucune | Fondu 200 ms |
| Titre de section (Blur in) | Feuille vue | `translateY(.5em)`, `opacity` 0, `blur(8px)` vers repos | 1200 ms | `--spring` | Aucune | Fondu 200 ms |
| Cascade des contenus (Stagger, Blur in) | Feuille vue | Comme les entrées de l’accueil | 1000 ms | `--ease-out` | 160 ms, puis 80 ms par bloc (`--i`) | Fondu 200 ms |
| Révélation du courriel (Reveal par masque) | Feuille Contact vue | `translateY(104%)` vers 0 dans un masque | 1300 ms | `--spring` | 220 ms | Fondu 200 ms |
| Libellé de section, barre compacte (3D flip) | Changement de section lue | `opacity` 0, `perspective(700px) rotateX(-62deg) translateY(.3em)`, `blur(3px)` vers repos ; origine en haut | 520 ms | `--ease-out` | Aucune | Fondu 200 ms |

Avant l’arrivée d’une feuille, ses blocs animés sont en `visibility: hidden`, jamais en `display: none`, pour que la mise en page ne bouge pas.

### 5.3 Navigation

| Nom | Déclencheur | Propriétés | Durée | Courbe | Cascade, délai | Mouvement réduit |
|---|---|---|---|---|---|---|
| Pilule de navigation (Shared element transition, Spring) | Survol d’un item ; changement de section lue ; sortie du pointeur (retour à la section lue) | Pilule absolue : `translateX` et `width` ; couleur `--wine` sur la section lue, gris au survol d’un autre item | Ressort 0,38 s, ζ .8 ; apparition 200 ms ; couleur du texte 220 ms | Ressort | Aucune | Saut instantané |
| Ancrage de lecture (Spatial consistency) | Changement de langue | Le haut de la section lue reste au même endroit de l’écran (`scrollBy` de l’écart mesuré) | Instantané | Sans objet | Aucune | Identique |

La pilule se positionne sans animation au premier affichage et au redimensionnement ; elle ne glisse qu’en réponse à l’utilisateur.

### 5.4 Langue et thème

| Nom | Déclencheur | Propriétés | Durée | Courbe | Cascade, délai | Mouvement réduit |
|---|---|---|---|---|---|---|
| Bascule de langue (3D flip, Stagger) | Clic sur FR ou EN | Tous les textes marqués `.lx` : `opacity` 0, `perspective(700px) rotateX(-62deg) translateY(.3em)`, `blur(3px)` vers repos ; origine en haut | 700 ms | `--ease-out` | 22 ms par rang `--k` (0 à 7, du haut vers le bas d’un bloc) | Fondu 200 ms |
| Pastille de la bascule (Spring) | Clic | `translateX(0)` vers `translateX(42px)` (46 px au toucher) | 520 ms | `--spring` | Aucune | Instantané |
| Changement de thème (View transition, Reveal par clip-path) | Clic sur le bouton de thème | Le nouveau thème monte du bas : `clip-path: inset(100% 0 0 0 round 72px 72px 0 0)` vers `inset(0)` sur `::view-transition-new(root)`, l’ancien reste immobile | 860 ms | `--ease-io` | Aucune | Pas de View Transition ; bascule immédiate, couleurs en 260 ms |
| Icône soleil et lune (Morph) | Changement de thème | Rayons : `rotate(-60deg) scale(.4)`, `opacity` 0 ; disque : `scale(.7)` vers 1 ; masque du croissant : `translate(9px,-9px)` vers 0 | 560 ms (opacité des rayons 260 ms) | Rayons `--ease-out`, disque `--spring`, masque `--ease-io` | Aucune | Instantané |
| Repli sans View Transitions | Changement de thème | `background-color` et `color` de la page | 260 ms | `ease` | Aucune | Identique |

La bascule de langue rejoue l’animation en alternant deux noms d’images clés identiques (`v-flip-a`, `v-flip-b`) via un attribut `data-sw` sur la racine. Les changements de texte ne doivent jamais faire sauter la page : voir l’ancrage de lecture.

### 5.5 Survols (pointeur fin seulement)

| Nom | Déclencheur | Propriétés | Durée | Courbe | Cascade, délai | Mouvement réduit |
|---|---|---|---|---|---|---|
| Surbrillance glissante (Shared element, Spring) | Entrée du pointeur dans une ligne de Formation, Expérience ou Projets ; sortie de la liste | Bloc absolu `--wine-glide`, rayon 28, débordant de 24 px de chaque côté : `translateY` et `height` ; apparition par `opacity` | Ressort 0,36 s, ζ .86 ; opacité 260 ms | Ressort | Aucune | Saut instantané |
| Logo de ligne (Morph, Rotate) | Survol d’une entrée | `border-radius` 18 px vers 50 % ; `rotate(-8deg) scale(1.04)` | 560 ms | `--spring` | Aucune | Instantané |
| Flèche (Hover effect, Translate) | Survol d’un bouton ou d’un lien externe | `translate(3px,-3px)` | 360 ms | `--spring` | Aucune | Instantané |
| Trait des titres d’entrée (Reveal du soulignement) | Survol | `background-size` 0 vers 100 % × 1,5 px ; part de la gauche à l’entrée, sort par la droite | 520 ms | `--ease-out` | Aucune | Instantané |
| Soulignement du courriel | Survol | Idem, épaisseur 0,045 em | 620 ms | `--ease-out` | Aucune | Instantané |
| Tuile d’organisation (Hover lift, Morph) | Survol | `translateY(-2px)` ; rayon 22 vers 28 ; logo rond ; flèche de `translate(-6px,6px)` et `opacity` 0 vers repos ; fond `--tile` | 420 ms (montée, flèche), 520 ms (rayon), 260 ms (fond), 200 ms (opacité de la flèche) | `--spring`, fond `ease` | Aucune | Instantané |
| Puce de compétence (Hover lift) | Survol | `translateY(-2px)`, fond et couleur | 420 ms, couleurs 220 ms | `--spring` | Aucune | Instantané |
| Ligne de projet (Hover effect) | Survol ou focus | Titre `--wine` ; flèche de `translate(-6px,6px)` et `opacity` 0 vers repos | 420 ms, opacité 220 ms | `--spring` | Aucune | Instantané |
| Lien de dépôt | Survol, aperçu ouvert | Fond et couleur | 260 ms | `ease` | Aucune | Identique |
| Item de navigation | Survol | Couleur du texte | 220 ms | `ease` | Aucune | Identique |

### 5.6 Menus et feuilles

| Nom | Déclencheur | Propriétés | Durée | Courbe | Cascade, délai | Mouvement réduit |
|---|---|---|---|---|---|---|
| Ouverture du menu (Origin-aware, Morph par clip-path) | Clic sur Menu | `clip-path` de la forme du bouton, `inset(0 0 calc(100% - 44px) calc(100% - 98px) round 22px)`, vers `inset(0 round 32px)` ; `opacity` 0 vers 1 | 640 ms, opacité 100 ms | `--spring` | Aucune | Fondu 200 ms |
| Liens du menu (Stagger) | Ouverture | `opacity` 0 vers 1 ; `translateY(14px)` vers 0 | Opacité 420 ms, déplacement 640 ms | Opacité `ease`, déplacement `--spring` | 140 ms, puis 34 ms par lien | Fondu 200 ms |
| Fermeture du menu | Voile, Échap, bouton, lien | `clip-path` inverse ; `opacity` ; liens `opacity` et `translateY(14px)` | 520 ms ; opacité 180 ms après 340 ms ; liens 240 ms | `--ease-io` ; liens `--ease-out` | Aucune | Fondu 200 ms |
| Voiles | Ouverture, fermeture | `opacity` | 320 ms (menu), 300 ms (feuille) | `ease` | Aucune | Identique |
| Feuille basse d’aperçu (Slide in, Spring) | Appui sur une ligne de projet ou un lien de dépôt, sous 980 px | `translateY(110%)` vers 0 | 640 ms | `--spring` | Aucune | Fondu 200 ms |
| Fermeture de la feuille | Voile, Fermer, Échap, glisser | `translateY` vers 110 % | 520 ms | `--ease-io` | Aucune | Fondu 200 ms |
| Glisser pour fermer (Swipe to dismiss, Rubber-banding) | Geste sur la feuille | Suit le doigt vers le bas ; vers le haut, résistance `d × 40 / (40 + d)` ; ferme au-delà de 120 px ou au-delà de 0,11 px/ms (vitesse mesurée sur les 100 dernières ms) ; sinon revient en place | Geste, retour 640 ms | Retour `--spring` | Aucune | Geste identique, retour immédiat |

### 5.7 Aperçus GitHub

| Nom | Déclencheur | Propriétés | Durée | Courbe | Cascade, délai | Mouvement réduit |
|---|---|---|---|---|---|---|
| Popover de dépôt (Origin-aware, Morph par clip-path) | Survol ou focus d’un lien de dépôt, après 160 ms d’intention ; 0 ms si un aperçu était ouvert ou fermé il y a moins de 500 ms ; au toucher au-dessus de 980 px, premier appui | `clip-path` d’une pastille de 46 × 30 au coin du lien (en haut à gauche, ou en bas à gauche quand le popover est au-dessus) vers `inset(0 round 26px)` ; `opacity` | 640 ms, opacité 120 ms | `--spring` | Aucune | Fondu 200 ms |
| Fermeture du popover | Sortie du lien et de la carte (150 ms de grâce), appui ailleurs, Échap | `clip-path` inverse ; `opacity` | 300 ms ; opacité 160 ms après 140 ms | `--ease-io` | Aucune | Fondu 200 ms |
| Changement d’aperçu du panneau (Crossfade, Blur in, Stagger) | Sélection d’une autre ligne | Chaque bloc : `opacity` 0, `translateY(12px)`, `blur(6px)` vers repos | 520 ms | `--ease-out` | 40 ms par bloc (5 blocs) | Instantané |
| Hauteur du panneau (Layout animation, Spring) | Changement de contenu | `height` du panneau vers la hauteur mesurée du contenu | Ressort 0,42 s, ζ .9 | Ressort | Aucune | Instantané |
| Chargement (Skeleton, Shimmer) | Données en attente | `background-position` d’un dégradé `--on-wine-3` | 1600 ms en boucle | `linear` | Aucune | Statique |

Placement du popover : sous la dernière ligne du lien (10 px plus bas), aligné à gauche sur le lien et borné à la colonne de texte. Si un autre lien de dépôt suit dans le même paragraphe, le popover s’ouvre au-dessus de la première ligne du lien, pour ne jamais recouvrir le lien suivant. La carte reste ouverte tant que le pointeur est dessus.

### 5.8 Retours tactiles et petits états

| Nom | Déclencheur | Propriétés | Durée | Courbe | Cascade, délai | Mouvement réduit |
|---|---|---|---|---|---|---|
| Pression (Press feedback) | `:active` | `scale(.95)` boutons ; `.96` bouton copier ; `.98` tuiles ; `.92` bouton fermer | 140 à 160 ms | `--ease-out` | Aucune | Identique |
| Pression des lignes et liens | `:active` | Fond `--wine-glide` (lignes de projet) ; `opacity` .62 (liens texte) | Immédiat | Sans objet | Aucune | Identique |
| Libellé copié (Blur in) | Clic sur copier | Nouveau libellé : `opacity` 0, `translateY(28px) scale(.985)`, `blur(8px)` vers repos ; retour au libellé initial après 1,8 s | 360 ms | `--ease-out` | Aucune | Fondu 200 ms |
| Forme liquide réactive (Spring, Morph) | Déplacement de la souris sur l’accueil (`pointerType === 'mouse'`) | Les rayons proches du pointeur s’étirent jusqu’à +0,16 × R (influence gaussienne sur l’angle, proportionnelle à la proximité du contour) ; retour à la forme de repos à la sortie | Ressort 0,9 s, ζ .55, interruptible | Ressort | Aucune | Désactivé |

### 5.9 Mouvement réduit

Sous `@media (prefers-reduced-motion: reduce)` :

1. Toute animation à images clés devient un fondu d’opacité de 200 ms, sans délai, sans cascade, en une seule itération. Le contenu n’est jamais masqué.
2. Les transitions de `transform`, `clip-path` et `border-radius` passent à 0 ms. Les transitions de couleur et d’opacité restent.
3. Les ressorts JS sautent directement à leur cible.
4. Pas de View Transition pour le thème.
5. Pas de pulsation du statut, pas de scintillement, forme liquide immobile, pas de recul de l’accueil.
6. Menus, popovers et feuille basse restent utilisables, en fondu.

```css
@media (prefers-reduced-motion: reduce) {
  .v *, .v *::before, .v *::after {
    animation-name: v-fade !important;
    animation-duration: 200ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
  }
  .v-skel { animation: none !important; }
  .v-live::after { display: none; }
  .v-lang-bg, .v-cut, .v-disc, .v-rays, .v-sheetmenu, .v-pop, .v-logo,
  .v-psheet, .v-tile, .v-chip, .v-prow .ic { transition-duration: 0ms; }
}
@keyframes v-fade { from { opacity: 0; } }
```

### 5.10 Performance

1. N’animer que `transform`, `opacity`, `clip-path` et `filter`. Le flou reste réservé à des blocs de texte courts et à des durées brèves.
2. `width` et `height` ne sont animées que sur des éléments absolus et isolés (pilule de navigation, surbrillance glissante) et sur le panneau d’aperçu ; poser `contain: layout paint` sur la liste et le panneau. En cas de saccade, passer à une technique FLIP par `transform`.
3. Recul de l’accueil : `animation-timeline: scroll()` là où c’est disponible, sinon un écouteur de défilement passif qui écrit `transform` dans `requestAnimationFrame`.
4. La boucle `requestAnimationFrame` des ressorts ne tourne que tant qu’un ressort bouge, puis s’arrête.
5. `will-change: transform` uniquement sur l’accueil et les surbrillances.
6. Révélations par IntersectionObserver (seuil 0,04), observateur retiré après la première apparition.

## 6. Interactions, accessibilité, mobile

### 6.1 Clavier et focus

1. Ordre de tabulation : lien d’évitement « Aller au contenu », barre (nom, navigation ou Menu, langue, thème), boutons de l’accueil, bouton copier, liens des entrées et liens de dépôt, lignes de projet, tuiles, actions du contact, pied.
2. Anneau visible en `:focus-visible` seulement (4.1).
3. Échap ferme, dans cet ordre de priorité : menu, feuille basse, popover.
4. Menu et feuille basse : focus piégé ; à l’ouverture, focus sur le bouton fermer (menu) ou sur le titre de la carte (feuille, `tabindex="-1"`) ; à la fermeture, retour sur l’élément déclencheur ; reste de la page en `inert` pendant l’ouverture.
5. Popover : s’ouvre aussi au focus du lien. Son lien « Ouvrir le dépôt » n’est focalisable que lorsqu’il est ouvert (`tabindex="-1"` sinon).
6. Panneau d’aperçu : la sélection suit aussi le focus des lignes de projet.

### 6.2 ARIA

| Élément | Balisage |
|---|---|
| Nom | Unique `<h1>`, « Florian » et « Grolleau » sur deux lignes visuelles |
| Sections | `<section aria-labelledby>` vers leur `<h2>` ; profil `aria-label` (`ui.profile`) |
| Navigation | `<nav aria-label>` (`ui.toc`) ; item de la section lue `aria-current="location"` |
| Libellé de section (barre compacte) | `aria-live="polite"` |
| Bascule de langue | `<fieldset>` et `<legend>` masquée ; boutons `aria-pressed`, `lang="fr"` et `lang="en"` |
| Bouton de thème | `aria-label` (`ui.themeLabel`) et `aria-pressed` (vrai en sombre) |
| Bouton Menu | `aria-expanded`, `aria-controls` |
| Menu | `role="dialog"`, `aria-modal="true"`, `aria-label` (`ui.toc`) |
| Feuille basse | `role="dialog"`, `aria-modal="true"`, `aria-label` (`ui.sheetLabel`) ; `aria-hidden` quand fermée |
| Popover | `aria-hidden` quand fermé ; lien de dépôt relié par `aria-describedby` quand ouvert |
| Panneau d’aperçu | `aria-live="polite"` |
| Bouton copier | Libellé en `aria-live="polite"` |
| Logos et pictogrammes | Décoratifs (`alt=""`, `aria-hidden="true"`) car le nom est écrit à côté ; la rangée de logos des lectures porte un texte masqué listant les noms |
| Licence | `<abbr title>` (`ui.licenseTitle`) |

### 6.3 Toucher

1. Aucun état de survol au toucher : tous les `:hover` sont dans `@media (hover: hover) and (pointer: fine)`. Chaque élément touchable a un état `:active`.
2. Capacité détectée par `matchMedia('(hover: none), (pointer: coarse)')`, jamais par l’agent utilisateur.
3. Ligne de projet : sous 980 px, ouvre la feuille basse ; au-dessus, sur écran tactile, le premier appui sélectionne la ligne, le second suit le lien.
4. Lien de dépôt dans le texte : sous 980 px, ouvre la feuille basse ; au-dessus, premier appui pour l’aperçu, second pour le lien ; un appui ailleurs ferme l’aperçu.
5. Forme liquide : souris seulement.
6. Cibles d’au moins 44 × 44 px au toucher : boutons de la barre, bascule (46 × 44), fermer, liens du pied (padding vertical de 10 px), lien « Ouvrir le dépôt ».

### 6.4 Socle mobile à ajouter dans `index.html`

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#F3EEE6">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#170C0E">
<meta name="color-scheme" content="light dark">
```

1. Quand l’utilisateur force un thème, réécrire la valeur de `theme-color` en JS.
2. Jamais de `user-scalable=no` ni de `maximum-scale`.
3. Le reste du socle est déjà dans `velours-styles.css` : `-webkit-tap-highlight-color: transparent`, `text-size-adjust: 100%`, `touch-action: manipulation` sur liens et boutons, `user-select: none` sur les contrôles (jamais sur le texte), `-webkit-touch-callout: none` sur lignes et tuiles, `overflow-x: clip` sur la racine, zones sûres sur la barre, les marges, le menu et la feuille basse, `overscroll-behavior: contain` sur le menu et la feuille.
4. Aucun `100vh` : l’accueil a une hauteur en `clamp()`, le menu une hauteur maximale en `100dvh`.
5. Le tirer pour rafraîchir reste actif : c’est un document.

## 7. Données

### 7.1 Correspondance avec `content.js`

| Interface | Source |
|---|---|
| Nom | Fixe : « Florian Grolleau » |
| Rôle A et rôle B de l’accueil | `hero.role`, coupé sur « · » |
| Pastille de statut | Ligne de `hero.meta` dont le libellé est « Statut » ou « Status » |
| Lieu de l’accueil | Ligne « Actuellement » ou « Currently » |
| Profil | Lignes de `hero.meta` sauf le statut ; `hero.intro` (HTML, `<mark>` autorisé) |
| Courriel, GitHub, LinkedIn | `CONFIG.email`, `CONFIG.github`, `CONFIG.githubLabel`, `CONFIG.linkedin` |
| Navigation | `sections[].navTitle` s’il existe, sinon `title` |
| Entrées | `kind: 'entries'` : `title`, `url`, `logo`, `short`, `wide`, `sub`, `meta[0]` (période), `meta[1]` (lieu), `body` (HTML, liens `data-repo`), `tags` |
| Projets | `kind: 'projects'` : `note`, `groups[].label`, `items[].title`, `items[].lang`, `items[].repo` |
| Compétences | `kind: 'skills'` : `rows[].label`, `rows[].chips` |
| Organisations | `kind: 'orgs'` : `note`, `groups[].label`, `groups[].items` (objets `ORGS`) |
| Intérêts | `kind: 'prose'` : `blocks[].meta[0]`, `blocks[].body`, `blocks[].logos` ; sports depuis `SPORTS[lang]` |
| Contact | `kind: 'contact'` : `body` |
| Pied | `ui.source`, `ui.license`, `ui.licenseTitle` |
| Aperçus | `assets/github.json` (7.4) |

### 7.2 Modifications de contenu

```js
// CONTENT.fr.hero.meta
['Actuellement', 'Versailles, France'],
// CONTENT.en.hero.meta
['Currently', 'Versailles, France'],

// ORGS.entreprises, à la suite de Sopra Steria
{ fr: 'Deloitte', en: 'Deloitte', logo: 'deloitte.com', url: 'https://www.deloitte.com' },
{ fr: 'EY', en: 'EY', logo: 'ey.com', url: 'https://www.ey.com' },
{ fr: 'Capgemini Invent', en: 'Capgemini Invent', logo: 'capgemini.com', url: 'https://www.capgemini.com' },
{ fr: 'Wavestone', en: 'Wavestone', logo: 'wavestone.com', url: 'https://www.wavestone.com' }

// Section Intérêts : libellé court pour la navigation
navTitle: 'Intérêts'   // FR
navTitle: 'Interests'  // EN
```

1. Les logos des quatre nouvelles entreprises suivent la convention existante (favicon du domaine). Pour un rendu plus net, déposer les logos officiels dans `assets/logos/` et pointer `logo` vers ces fichiers.
2. Corriger les espaces françaises dans `content.js` (2.2, règle 2).
3. `CONFIG.initials` et `CONFIG.photo` peuvent rester dans le fichier mais ne sont plus lus.

### 7.3 Nouvelles chaînes d’interface (`ui`)

| Clé | FR | EN |
|---|---|---|
| `write` | Écrire | Write to me |
| `copy` (remplace « Copier ») | Copier l’adresse | Copy address |
| `copied` (remplace « Copié ») | Adresse copiée | Address copied |
| `menu` | Menu | Menu |
| `close` | Fermer | Close |
| `home` | Accueil | Home |
| `profile` | Profil | Profile |
| `noteTouch` | Touchez un projet pour afficher son aperçu GitHub. | Tap a project to see its GitHub preview. |
| `sheetLabel` | Aperçu du dépôt GitHub | GitHub repository preview |
| `updated` | Mis à jour le | Updated |
| `noDesc` | Pas de description sur GitHub. | No description on GitHub. |
| `missing` | Aperçu indisponible : dépôt privé ou introuvable. | Preview unavailable: private or missing repository. |
| `openRepo` | Ouvrir le dépôt | Open repository |
| `profileGh` | Voir le profil GitHub | View GitHub profile |
| `writtenIn` | Rédigé en | Written in |
| `langLegend` | Langue | Language |
| `skip` | Aller au contenu | Skip to content |
| `cv` | Curriculum vitae | Curriculum vitae |

### 7.4 Données GitHub

1. Ne pas interroger l’API GitHub depuis le navigateur : 60 requêtes par heure et par adresse IP sans authentification, et un aperçu qui dépend du réseau du visiteur.
2. Une action GitHub planifiée (quotidienne, et à chaque modification de `content.js`) lit tous les `repo` et tous les `data-repo`, appelle `GET https://api.github.com/repos/{owner}/{repo}` avec le jeton de l’action, puis écrit `assets/github.json` :

```json
{
  "generatedAt": "2026-10-23T06:00:00Z",
  "repos": {
    "Flor5378/Gabon-Monitor": { "description": "Gabon Monitor is a sentiment analysis project over gabonese media's ecosystem", "language": "Python", "pushedAt": "2026-08-11T09:12:00Z" },
    "Flor5378/-FR-MarchesPredictifs_ConcurrenceInformationnelle": { "description": null, "language": null, "pushedAt": "2026-04-20T17:40:00Z" },
    "Flor5378/-ENG-GlobalRiskIntelligencePlatform": { "missing": true }
  }
}
```

3. Le site charge ce fichier une fois, après le premier affichage. En attente : état « Chargement ». Fichier introuvable : état « Indisponible » partout, liens conservés.
4. Un dépôt `missing` renvoie vers `CONFIG.github`, partout (ligne de projet, lien dans le texte, bouton de l’aperçu).
5. L’ancien aperçu par image `opengraph.githubassets.com` est abandonné.

### 7.5 Logos et initiales

1. Résolution : `logo` qui commence par `assets/` est un fichier local ; sinon c’est un domaine, et le favicon vient du service actuel (`https://www.google.com/s2/favicons?domain=…&sz=128`, déjà utilisé par `assets/app.js`) ; en cas d’échec ou d’absence, `short`, sinon des initiales calculées.
2. Initiales : sigle entre parenthèses s’il existe (« … en Europe (OSCE) » donne OSCE) ; un seul mot de cinq caractères au plus est gardé tel quel (EY, PwC, KPMG, ENS) ; sinon la première lettre des trois premiers mots significatifs, en ignorant « de, du, des, la, le, les, l’, d’, et, en, à, au, aux, of, the, and, for, pour, sur, & » (« Boston Consulting Group » donne BCG, « Direction générale de l’armement » donne DGA). Découpage par graphèmes (`Array.from` ou `Intl.Segmenter`).

### 7.6 Limites de saisie conseillées

La saisie est libre aujourd’hui. Ces limites gardent la mise en page saine ; les inscrire en commentaire en tête de `content.js`.

| Champ | Limite conseillée | Au-delà |
|---|---|---|
| Titre d’entrée | 90 caractères | Plus de 3 lignes en bureau |
| Sous-titre | 140 | Plus de 2 lignes |
| Corps d’entrée | 600 | Entrée plus haute que l’écran sur téléphone |
| Titre de projet | 110 | Plus de 2 lignes dans la liste |
| Puce, étiquette | 40 | Pastille sur deux lignes |
| Nom d’organisation | 70 | Tuile sur plus de 3 lignes |
| Statut | 90 | Pastille sur plus de 2 lignes |
| Courriel | Aucune | Taille ajustée automatiquement |

## 8. Version imprimable (CV)

### 8.1 Principe

1. `cv.html` produit deux pages A4 depuis `content.js`, en français par défaut, en anglais avec `?lang=en`.
2. Sur le site, `@media print` imprime la même mise en page (bloc `.cv` masqué à l’écran, tout le reste masqué à l’impression). Imprimer le site donne donc le CV, dans la langue affichée.
3. Les planches « CV imprimable » du canevas (FR et EN, deux pages chacune) sont la référence ; le contenu tient en deux pages dans les deux langues.

### 8.2 Mise en page

| Élément | Valeur |
|---|---|
| Format | A4 portrait, `@page { size: A4; margin: 0 }`, page de 794 × 1123 px à 96 ppp |
| Marges | 46 px en haut, 52 px sur les côtés, pied de 40 px |
| Fond | Blanc ; aucun aplat sauf la pastille de statut ; `print-color-adjust: exact` |
| Couleurs | Encre `#241316`, secondaire `#6B5A5C`, tertiaire `#9A8B8C`, accent `#6E1527`, surlignage `#F4E9EA`, filets `#E4DAD0` |
| Police | Figtree, auto-hébergée |
| Page 1, en-tête | Nom sur deux lignes, 50 px, 300 ; rôle A (13 px, 600) et rôle B (13 px, 450, secondaire) ; à droite : pastille de statut (fond accent, blanc, 10,5 px), courriel (13 px, 650), GitHub, LinkedIn, lieu ; filet accent de 2 px |
| Page 1, introduction | Pleine largeur, 12,8 px, interligne 1,55, `<mark>` en pastille |
| Page 1, corps | Deux colonnes : 170 px et le reste, écart 26 px, filet vertical. Gauche : Compétences (libellé 11 px 700, liste 11 px), Langues. Droite : « 01 Expérience » |
| Page 2, en-tête | Nom (22 px, 350), courriel et lieu à droite, filet accent |
| Page 2, corps | Gauche : Centres d’intérêt, Institutions et entreprises de prédilection (listes en texte). Droite : « 02 Formation », « 03 Projets » (12 lignes : numéro, titre 12 px, pastille de langue, chemin `github.com/Flor5378/…` en 9,6 px, « dépôt privé » pour le dépôt indisponible) |
| Entrée | Période (10,8 px, 700, tabulaire) et lieu à droite ; organisation (14 px, 550) ; sous-titre (11,3 px) ; texte (11,5 px, interligne 1,48) ; étiquettes en texte (10,6 px, accent) |
| Liens de dépôt | Soulignés en accent, sans URL développée |
| Pied | « Florian Grolleau · Curriculum vitae », `flor5378.github.io` en accent, « 1 / 2 » |
| Coupures | `break-inside: avoid` sur les entrées et les lignes de projet ; `break-after: page` entre les pages |

Si le contenu grandit, réduire d’abord le texte des entrées de 11,5 à 11 px avant d’ajouter une troisième page.

## 9. Passe break-ui (étape 3)

### 9.1 Commutateur de données

1. Trois jeux de données à la frontière des données (jamais en modifiant le balisage) : « Démo » (le contenu réel), « Cas extrêmes », « Listes vides ».
2. Commutateur réservé au développement : paramètre `?data=worst` ou `?data=empty` lu seulement quand le site tourne en local ; contrôle segmenté fixé en bas au centre, police système, piste grise, pastille blanche. Jamais en production.
3. Dans le canevas : page « Étape 3 · cas extrêmes » (bureau, téléphone 390 px, 320 px, sombre EN, listes vides). Chaque planche porte le commutateur.

Valeurs des cas extrêmes, toutes plausibles pour ce site : courriel `florian.grolleau@sciencespo-saintgermainenlaye.fr` ; statut de 103 caractères ; lieu « Saint-Germain-en-Laye, Île-de-France » ; formation « Institut des hautes études de défense nationale (IHEDN), session nationale jeunes » avec logo large ; entrée « ENS » sans lieu, sans sous-titre, sans lien ; expérience « Direction générale des relations internationales et de la stratégie (DGRIS) » avec trois liens de dépôt dont un slug de 69 caractères, neuf étiquettes ; « Observatoire franco-gabonais des médias » sans logo ; « EY » avec logo large ; projet au titre de 106 caractères et à la description de 417 caractères ; dépôt sans date ; groupe « Terrain » à un seul projet ; groupe « Recherche » vide ; 34 puces dans une ligne ; puce de 76 caractères ; 17 institutions et 23 entreprises, dont six sans logo (Hadit compris).

### 9.2 Ce qui cassait, et la correction appliquée

| N° | Gravité | Champ | Valeur | Problème | Correction (dans `velours-styles.css` et la maquette) |
|---|---|---|---|---|---|
| 1 | Cassé | `CONFIG.email`, contact | Courriel de 49 caractères | À 148 px, l’adresse débordait et le masque de révélation la coupait ; sur téléphone, coupure au milieu d’un mot | Taille ajustée à la largeur du conteneur (`100cqi`, variable `--mail-ch`) ; `<wbr>` après « @ » ; `overflow-wrap: anywhere` en dernier recours |
| 2 | Cassé | Bouton copier du profil | Même courriel | Pastille de hauteur fixe qui débordait de sa colonne | Hauteur minimale 44 px, padding vertical 10, rayon 22, coupure après « @ » |
| 3 | Cassé | Lieu de l’accueil (320 px) | « Saint-Germain-en-Laye, Île-de-France » | Conteneur flex sans retour à la ligne : débordement de 12 px | Pictogramme et texte séparés, texte dans un `<span>` qui revient à la ligne, `min-width: 0` |
| 4 | Laid | Lieux composés partout | Idem | Coupure à un trait d’union (« Île-de- » puis « France ») | Mots à trait d’union en `nowrap`, espaces conservées comme points de coupure |
| 5 | Laid | Libellé de compétence sur deux lignes | « Géomatique, systèmes d’information géographique et data visualisation » | Puces étirées en hauteur par `align-content: stretch` | `align-items` et `align-content: flex-start` sur les puces et étiquettes, `align-items: start` sur la ligne |
| 6 | Laid | Groupe de projets vide | `items: []` | Étiquette « Recherche 0 » sans lignes | Groupes et sections vides masqués, navigation et numéros recalculés |
| 7 | Laid | Date GitHub absente | `pushedAt` vide | « Mis à jour le Invalid Date » | Date validée ; pastille omise |
| 8 | Laid | Titre du popover | Slug de 69 caractères | Quatre lignes coupées au milieu des mots | Titre tiré de `content.js`, slug en petit dessous, titre à 22 px |
| 9 | Laid | Logo absent sans `short` | « Boston Consulting Group » | Hachures au lieu d’initiales | Initiales calculées (7.5) |
| 10 | Laid | Logo large dans une entrée | `wide: true` | Emplacement de 120 px dans une colonne de 56 px | Entrées toujours en carré, logo large contenu |
| 11 | Laid | Champs optionnels | `sub`, lieu ou `url` vides | Paragraphe vide avec sa marge ; lien vers une adresse vide | Éléments omis ; titre en texte simple sans `url` |
| 12 | Laid | Titres de section à 320 px | « Institutions et entreprises de prédilection » | Cinq lignes à 52 px ; « Compétences » touchait le bord | `clamp(40px, 13.4vw, 64px)` sous 640 px |
| 13 | Laid | Statut long | 103 caractères | Pastille au rayon infini sur quatre lignes | Rayon 20 px, largeur maximale 100 % |
| 14 | Fragile | Surbrillance glissante | Écran de 320 px | Débord horizontal de 4 px (défilement latéral possible) | Débord limité à `min(24px, --pad)` ; `overflow-x: clip` sur la racine |
| 15 | Fragile | Tuiles à 720 px (zoom 200 %) | Noms longs | Trois colonnes étroites, noms sur cinq lignes | Deux colonnes sous 820 px ; noms à 13,5 px sous 400 px |
| 16 | Fragile | Tout `content.js` | Saisie libre | Aucune limite | Limites conseillées (7.6) |

### 9.3 Décisions prises

1. Noms d’organisations, titres de projets et d’entrées : retour à la ligne, jamais de troncature (ce sont des noms qui identifient).
2. Descriptions GitHub : limitées à 4 lignes avec points de suspension ; le texte complet est sur GitHub.
3. Tuiles sur téléphone : deux colonnes empilées plutôt qu’une liste, pour une page plus courte.
4. Section sans contenu : masquée plutôt qu’un état vide, s’agissant d’un portfolio.
5. Initiales : trois lettres au plus, sauf sigle explicite ou `short`.

### 9.4 Ce qui a tenu

1. Titres d’entrée de trois lignes (`text-wrap: balance`) et lignes de hauteurs différentes.
2. Neuf étiquettes, 34 puces, 40 organisations : retours à la ligne propres.
3. Trois liens de dépôt dans un même paragraphe : les aperçus ne recouvrent jamais le lien suivant.
4. Titre de projet de 106 caractères : la pastille de langue reste alignée (`nowrap`).
5. Aucun texte au pluriel calculé : les compteurs sont des nombres seuls.
6. Thème sombre : contrastes et emplacements de logo corrects ; tous les survols sont réservés au pointeur fin.
7. Largeur de page égale à la largeur de l’écran à 320 et 390 px, en clair FR et en sombre EN (aucun débordement mesuré).

Non testé : écriture de droite à gauche (le site n’existe qu’en FR et en EN).

## 10. Passe mobile-native

Appliqué dans la maquette et dans `velours-styles.css` :

1. Tous les survols sous `(hover: hover) and (pointer: fine)` ; vérifié, aucun `:hover` hors de ce bloc.
2. `-webkit-tap-highlight-color: transparent` et un état `:active` pour chaque élément touchable (lignes, tuiles, liens, boutons).
3. `touch-action: manipulation` sur liens et boutons (pas de délai de 300 ms).
4. `user-select: none` sur les contrôles seulement ; `-webkit-touch-callout: none` sur lignes de projet et tuiles.
5. Zones sûres : barre (`safe-area-inset-top`), marges latérales, menu (haut et droite), feuille basse (bas).
6. Menu : `max-height` en `100dvh`, défilement interne `overscroll-behavior: contain` ; feuille basse en `contain`.
7. Cibles de 44 px au toucher (bascule 46 × 44, boutons 44, liens du pied).
8. Aperçus au toucher : feuille basse sous 980 px, double appui au-dessus.
9. `overflow-x: clip` sur la racine : aucun défilement latéral, le collé de l’accueil et de la barre reste intact.

À ajouter par Claude Code : balises de 6.4 et mise à jour de `theme-color` au changement de thème.

À vérifier sur un vrai téléphone (l’émulation ne reproduit pas ces points) : survols qui ne collent pas après un appui ; absence de flash au toucher ; zones sûres en paysage sur iPhone ; glisser pour fermer la feuille et résistance vers le haut ; View Transitions du thème sur Safari (repli en fondu de couleurs sinon) ; fluidité du flou de la barre et du recul de l’accueil sur un téléphone de quelques années.

## 11. Recette

1. Aucune trace de l’ancien style (Geist, `#F7F8FA`, `#1D4ED8`, rayon 14) ni du monogramme « FG ».
2. « Versailles, France » dans l’accueil et le profil, en FR et en EN.
3. Deloitte, EY, Capgemini Invent et Wavestone présents dans les entreprises, avec logo.
4. Les quatre combinaisons clair ou sombre et FR ou EN sont conformes aux planches.
5. Bascule de langue : textes en cascade, page qui ne saute pas, `<html lang>`, titre et description mis à jour.
6. Bascule de thème : révélation montante, icône soleil et lune, `theme-color` mis à jour, choix mémorisé, aucun flash au rechargement.
7. Navigation : la pilule suit le survol puis revient sur la section lue ; la section lue change au bon moment.
8. Projets : panneau d’aperçu au survol et au focus ; feuille basse au toucher ; cinq états d’aperçu vérifiés, dont le dépôt privé.
9. Liens de dépôt dans le texte : popover au bon endroit, jamais au-dessus du lien suivant.
10. Mouvement réduit : aucune translation, aucun ressort, contenu toujours visible.
11. Clavier seul : tout est atteignable, anneau visible, Échap ferme, focus piégé puis rendu.
12. Lecteur d’écran : un `<h1>`, des `<h2>` par section, `aria-current`, `aria-pressed`, `aria-expanded` corrects.
13. 320, 390, 768, 1024, 1180, 1440 et 1920 px : aucun débordement horizontal.
14. Zoom navigateur 200 % : aucune coupure de texte, aucune superposition.
15. Commutateur de données (développement) : « Cas extrêmes » et « Listes vides » conformes aux planches de l’étape 3.
16. Impression : deux pages A4 en FR et en EN, conformes aux planches du CV.
17. Lighthouse : accessibilité 100, bonnes pratiques 100, CLS inférieur à 0,05.

## Annexes

### A. Jetons CSS

Dans la maquette, les jetons sont portés par `.v` ; en production, les porter par `:root`.

```css
:root {
  color-scheme: light;
  --paper: #F3EEE6;   --paper-2: #EAE2D6;
  --ink: #241316;     --ink-2: #6B5A5C;
  --wine: #6E1527;    --wine-hero: #6E1527;
  --wine-blob: #8E2A3D; --wine-blob-2: #A63D53;
  --wine-soft: rgba(110,21,39,.08); --wine-glide: rgba(110,21,39,.07);
  --on-wine: #F3EEE6; --on-wine-2: rgba(243,238,230,.76); --on-wine-3: rgba(243,238,230,.14);
  --inv-2: rgba(243,238,230,.64); --inv-3: rgba(243,238,230,.13);
  --rule: #DCD1C4;    --tile: #F8F4EE;    --bar: rgba(243,238,230,.8);
  --sheet-shadow: 0 -24px 60px -30px rgba(36,19,22,.34);
  --shadow: 0 30px 70px -30px rgba(36,19,22,.55);
  --sans: 'Figtree', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --ease-out: cubic-bezier(.23,1,.32,1);
  --ease-io: cubic-bezier(.77,0,.175,1);
  --spring: cubic-bezier(.3,1.25,.5,1);
  --pad: max(clamp(20px, 4.4vw, 72px), env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px));
  --r-sheet: 40px;
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --paper: #170C0E;   --paper-2: #1F1012;
  --ink: #F1E8DD;     --ink-2: #BCAAA7;
  --wine: #E38D9C;    --wine-hero: #521020;
  --wine-blob: #74192D; --wine-blob-2: #8E2A3D;
  --wine-soft: rgba(227,141,156,.12); --wine-glide: rgba(241,232,221,.06);
  --on-wine: #F1E8DD; --on-wine-2: rgba(241,232,221,.74); --on-wine-3: rgba(241,232,221,.12);
  --inv-2: rgba(23,12,14,.62); --inv-3: rgba(23,12,14,.09);
  --rule: #3A2528;    --tile: #24131A;    --bar: rgba(23,12,14,.8);
  --sheet-shadow: 0 -24px 60px -24px rgba(0,0,0,.7);
  --shadow: 0 30px 70px -26px rgba(0,0,0,.85);
}
@media (max-width: 640px) { :root { --r-sheet: 28px; } }
```

Thème posé avant l’affichage, dans `<head>` :

```html
<script>
  (function () {
    var t = null;
    try { t = localStorage.getItem('theme'); } catch (e) {}
    if (t !== 'light' && t !== 'dark') {
      t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.dataset.theme = t;
  })();
</script>
```

### B. Ressorts

```js
// Ressort paramétré par sa réponse (période, en s) et son amortissement (zeta).
export function spring(x, response, zeta) {
  const w = (2 * Math.PI) / response;
  return { x, v: 0, t: x, k: w * w, c: 2 * zeta * w };
}

// Euler semi-implicite. Renvoie true quand le ressort est au repos.
export function step(s, dt, eps = 0.05) {
  const a = -s.k * (s.x - s.t) - s.c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
  return Math.abs(s.x - s.t) < eps && Math.abs(s.v) < eps;
}

// Boucle partagée : ne tourne que tant qu'un ressort bouge.
const jobs = new Map();
let raf = 0;
let last = 0;

export function kick(key, springs, paint, eps = 0.05) {
  if (reducedMotion()) {
    springs.forEach((s) => { s.x = s.t; s.v = 0; });
    paint();
    return;
  }
  jobs.set(key, { springs, paint, eps });
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
}

function loop(now) {
  const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
  last = now;
  for (const [key, job] of jobs) {
    let rest = true;
    for (const s of job.springs) if (!step(s, dt, job.eps)) rest = false;
    job.paint();
    if (rest) jobs.delete(key);
  }
  raf = jobs.size ? requestAnimationFrame(loop) : 0;
}

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Pilule de navigation (même principe pour la surbrillance glissante, avec `translateY` et `height`, réponse 0,36, ζ 0,86) :

```js
const pill = { x: spring(0, 0.38, 0.8), w: spring(0, 0.38, 0.8) };
const paintPill = () => {
  pillEl.style.transform = `translateX(${pill.x.x.toFixed(1)}px)`;
  pillEl.style.width = `${Math.max(0, pill.w.x).toFixed(1)}px`;
};
function pillTo(item, snap = false) {
  pill.x.t = item.offsetLeft;
  pill.w.t = item.offsetWidth;
  if (snap) { pill.x.x = pill.x.t; pill.w.x = pill.w.t; pill.x.v = pill.w.v = 0; paintPill(); return; }
  kick('pill', [pill.x, pill.w], paintPill);
}
```

### C. Forme liquide

```js
const NB = 12;
const base = Array.from({ length: NB }, (_, i) => 1 + 0.13 * Math.sin(i * 1.9 + 0.6) + 0.09 * Math.cos(i * 2.7 + 1.3));
const radii = base.map(() => spring(0.62, 0.9, 0.55));

function geom(hero) {
  const w = hero.offsetWidth, h = hero.offsetHeight, narrow = w < 700;
  return { cx: w * (narrow ? 0.78 : 0.74), cy: h * (narrow ? 0.6 : 0.52), R: Math.min(w, h) * (narrow ? 0.46 : 0.36) };
}

// Catmull-Rom fermée convertie en courbes de Bézier.
function blobPath(cx, cy, rs) {
  const pts = rs.map((r, i) => {
    const a = (i / rs.length) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const n = pts.length, f = (v) => v.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}

const paintBlob = () => {
  const g = geom(hero);
  pathEl.setAttribute('d', blobPath(g.cx, g.cy, radii.map((s) => s.x * g.R)));
};
const settle = () => { radii.forEach((s, i) => { s.t = base[i]; }); kick('blob', radii, paintBlob, 0.0005); };

hero.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'mouse' || reducedMotion()) return;
  const r = hero.getBoundingClientRect(), g = geom(hero);
  const dx = e.clientX - r.left - g.cx, dy = e.clientY - r.top - g.cy;
  const ang = Math.atan2(dy, dx) + Math.PI / 2;
  const near = Math.max(0, 1 - Math.abs(Math.hypot(dx, dy) - g.R) / (g.R * 1.1));
  radii.forEach((s, i) => {
    const a = (i / NB) * Math.PI * 2;
    const da = Math.abs(((ang - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    s.t = base[i] + 0.16 * near * Math.exp(-(da * da) / 0.35);
  });
  kick('blob', radii, paintBlob, 0.0005);
});
hero.addEventListener('pointerleave', settle);
paintBlob();
setTimeout(settle, 380); // respiration au chargement
```

Forme du contact : statique, `viewBox="0 0 400 400"`, centre (200, 200), rayon 150, profil `1 + 0.12 sin(2.3 i + 2.1) + 0.08 cos(1.6 i + 0.4)`, même `blobPath`.

### D. Changement de thème

```js
function setTheme(next) {
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
      m.setAttribute('content', next === 'dark' ? '#170C0E' : '#F3EEE6');
    });
  };
  if (!reducedMotion() && document.startViewTransition) document.startViewTransition(apply);
  else apply();
}
```

```css
::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
::view-transition-new(root) { animation: v-up 860ms cubic-bezier(.77,0,.175,1) both; }
@keyframes v-up {
  from { clip-path: inset(100% 0 0 0 round 72px 72px 0 0); }
  to   { clip-path: inset(0 0 0 0 round 0 0 0 0); }
}
```

### E. Section lue, recul de l’accueil, ancrage à la bascule de langue

```js
const line = () => Math.min(innerHeight * 0.4, 360);

function readSection(ids) {
  let current = '';
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < line()) current = id;
  }
  return current;
}

function recede() {
  if (reducedMotion()) return;
  const h = hero.offsetHeight || 1;
  const k = Math.min(1, Math.max(0, scrollY / (h * 0.9)));
  hero.style.transform = `scale(${(1 - 0.06 * k).toFixed(4)})`;
  dim.style.opacity = (0.42 * k).toFixed(3);
}

let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const a = readSection(visibleNavIds);
    if (a !== activeId) setActive(a); // pilule, aria-current, libellé de la barre compacte
    recede();
  });
}, { passive: true });

function setLang(next) {
  const anchor = activeId ? document.getElementById(activeId) : null;
  const top0 = anchor ? anchor.getBoundingClientRect().top : 0;
  render(next); // textes, attributs, data-sw alterné a/b pour rejouer la bascule
  if (anchor) {
    const d = anchor.getBoundingClientRect().top - top0;
    if (Math.abs(d) > 1) scrollBy(0, d);
  }
}
```

### F. Popover de dépôt

```js
// host : la colonne de texte de l'entrée (position: relative).
function placePopover(link, host) {
  const rects = link.getClientRects();
  const hr = host.getBoundingClientRect();
  const links = [...host.querySelectorAll('[data-repo]')];
  const up = links.indexOf(link) < links.length - 1; // un autre lien suit : ouvrir au-dessus
  const first = rects[0], last = rects[rects.length - 1];
  const anchor = up ? first : last;
  return {
    up,                                          // .up : translateY(-100%), clip depuis le bas
    left: Math.max(0, Math.min(anchor.left - hr.left, hr.width - 380)),
    top: up ? first.top - hr.top - 10 : last.bottom - hr.top + 10
  };
}
```

Intention : ouverture après 160 ms de survol ou de focus, immédiate si un aperçu est ouvert ou s’est fermé depuis moins de 500 ms ; fermeture 150 ms après la sortie du lien, annulée si le pointeur entre dans la carte.

### G. Feuille basse, glisser pour fermer

```js
let drag = null;
sheet.addEventListener('pointerdown', (e) => {
  drag = { id: e.pointerId, y0: e.clientY, dy: 0, samples: [[performance.now(), e.clientY]] };
  sheet.setPointerCapture(e.pointerId);
});
sheet.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  let dy = e.clientY - drag.y0;
  if (dy < 0) { const u = -dy; dy = -(u * 40) / (40 + u); } // résistance vers le haut
  drag.dy = dy;
  drag.samples.push([performance.now(), e.clientY]);
  sheet.style.transition = 'none';
  sheet.style.transform = `translateY(${dy.toFixed(1)}px)`;
});
const end = () => {
  if (!drag) return;
  const { dy, samples } = drag;
  drag = null;
  const now = performance.now();
  const recent = samples.filter(([t]) => now - t < 100);
  const [t0, y0] = recent[0] || samples[0];
  const v = (samples[samples.length - 1][1] - y0) / Math.max(1, now - t0); // px/ms sur 100 ms
  sheet.style.transition = '';
  sheet.style.transform = '';
  if (dy > 120 || (v > 0.11 && dy > 12)) closeSheet();
};
sheet.addEventListener('pointerup', end);
sheet.addEventListener('pointercancel', end);
```

`touch-action: none` sur la feuille (elle possède le geste) ; son contenu ne défile pas (description limitée à 4 lignes).

### H. Initiales, noms composés, courriel

```js
export function initials(name) {
  const acronym = name.match(/\(([A-ZÀ-Ý0-9&]{2,6})\)/);
  if (acronym) return acronym[1];
  const words = name.replace(/[’']/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    const g = Array.from(words[0]);
    return g.length <= 5 ? words[0] : g.slice(0, 2).join('').toUpperCase();
  }
  const stop = /^(de|du|des|la|le|les|l|d|et|en|à|au|aux|of|the|and|for|pour|sur|&)$/i;
  return words.filter((w) => !stop.test(w)).slice(0, 3).map((w) => Array.from(w)[0]).join('').toUpperCase();
}

// « Saint-Germain-en-Laye, Île-de-France » : coupures aux espaces seulement.
export function keepCompounds(text) {
  const frag = document.createDocumentFragment();
  text.split(' ').forEach((word, i, all) => {
    const span = document.createElement('span');
    span.className = 'nb'; // white-space: nowrap
    span.textContent = word;
    frag.append(span);
    if (i < all.length - 1) frag.append(' ');
  });
  return frag;
}

// Courriel : coupure prioritaire après « @ », taille ajustée par --mail-ch.
export function emailNode(email, el) {
  const at = email.indexOf('@');
  el.replaceChildren(email.slice(0, at + 1), document.createElement('wbr'), email.slice(at + 1));
  el.style.setProperty('--mail-ch', Array.from(email).length);
}
```

### I. Crochets d’état de `velours-styles.css`

| Crochet | Posé par | Effet |
|---|---|---|
| `data-theme="light" ou "dark"` sur la racine | Thème | Jetons |
| `data-lang` | Langue | Position de la pastille FR/EN |
| `data-sw="a" ou "b"` | Chaque bascule de langue (alterner) | Rejoue la bascule des textes `.lx` |
| `data-ssw="a" ou "b"` | Chaque changement de section lue (alterner) | Rejoue le libellé de la barre compacte |
| `data-motion="reduced"` | Maquette seulement | Simule le mouvement réduit ; en production, la requête media suffit |
| `data-seen="1"` sur `.v-sheet` | IntersectionObserver | Arrivée de la feuille, titre, cascade `.v-reveal` |
| `data-glide="1"` sur `.v-list` | Entrée du pointeur dans une ligne | Affiche la surbrillance |
| `data-pill="1"`, `data-hover="1"` sur `.v-nav` | Section lue, survol | Pilule visible, pilule grise |
| `data-open="1"` | Menu, popover, feuille, voiles | État ouvert |
| `data-k="a" ou "b"` sur `.v-panel` | Chaque changement d’aperçu (alterner) | Rejoue l’apparition des blocs `.v-swap` |
| `.lx` avec `--k` | Rendu | Textes qui basculent avec la langue, rang de cascade |
| `.v-reveal` avec `--i` | Rendu | Blocs révélés à l’arrivée d’une feuille, rang de cascade |
| `.an` avec `--d` | Rendu | Entrées de l’accueil, délai |
| `.v-dev` | Développement seulement | Commutateur de données de la passe break-ui |
