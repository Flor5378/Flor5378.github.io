/* =========================================================================
   content.js
   Tout le contenu du site, en français et en anglais.
   C’est le SEUL fichier à modifier pour mettre le site à jour.

   Conventions
   -----------
   logo   : 'exemple.fr'              → favicon récupéré automatiquement
            'assets/logos/x.png'      → fichier local, prioritaire
            absent ou fichier absent  → pastille avec les initiales ou `short`
   wide   : true                      → pastille allongée, pour un logo texte
   chips  : 'Nom'                     → texte seul
            'Nom|python'              → icône assets/logos/tech/python.svg
   repo   : 'Flor5378/nom-du-depot'   → lien et aperçu GitHub (assets/github.json)
   image  : 'assets/previews/x.webp'  → image de l’aperçu de projet, format 16:9
   alt    : 'Description de l’image'  → texte lu par les lecteurs d’écran

   Limites de saisie conseillées (au-delà, la mise en page souffre)
   ----------------------------------------------------------------
   Titre d’entrée 90 caractères · sous-titre 140 · corps d’entrée 600
   Titre de projet 110 · puce ou étiquette 40 · nom d’organisation 70
   Statut 90 · courriel sans limite (taille ajustée automatiquement)

   Typographie française : espace fine insécable U+202F dans les nombres et
   avant « % » (2 500, 21 millions, 90 %), espace insécable U+00A0 avant « : ».
   ========================================================================= */

const CONFIG = {
  email: 'f.grolleau@netc.fr',
  github: 'https://github.com/Flor5378',
  githubLabel: 'github.com/Flor5378',
  linkedin: 'https://www.linkedin.com/in/florian-grolleau-3a7a22274',
  site: 'https://flor5378.github.io'   // adresse publique, au pied du CV
};

/* Organisations visées, communes aux deux langues. */
const ORGS = {
  institutions: [
    { fr: 'OTAN', en: 'NATO', logo: 'nato.int', url: 'https://www.nato.int' },
    { fr: 'OCDE', en: 'OECD', logo: 'oecd.org', url: 'https://www.oecd.org' },
    { fr: 'Commission européenne', en: 'European Commission', logo: 'ec.europa.eu', url: 'https://commission.europa.eu' },
    { fr: 'SEAE', en: 'EEAS', logo: 'eeas.europa.eu', url: 'https://www.eeas.europa.eu' },
    { fr: 'Agence européenne de défense', en: 'European Defence Agency', logo: 'eda.europa.eu', url: 'https://eda.europa.eu' },
    { fr: 'Parlement européen', en: 'European Parliament', logo: 'europarl.europa.eu', url: 'https://www.europarl.europa.eu' },
    { fr: 'Banque centrale européenne', en: 'European Central Bank', logo: 'ecb.europa.eu', url: 'https://www.ecb.europa.eu' },
    { fr: 'Europol', en: 'Europol', logo: 'europol.europa.eu', url: 'https://www.europol.europa.eu' },
    { fr: 'Agence spatiale européenne', en: 'European Space Agency', logo: 'esa.int', url: 'https://www.esa.int' },
    { fr: 'AIEA', en: 'IAEA', logo: 'iaea.org', url: 'https://www.iaea.org' },
    { fr: 'Nations unies', en: 'United Nations', logo: 'un.org', url: 'https://www.un.org' },
    { fr: 'Banque mondiale', en: 'World Bank', logo: 'worldbank.org', url: 'https://www.worldbank.org' },
    { fr: 'Fonds monétaire international', en: 'International Monetary Fund', logo: 'imf.org', url: 'https://www.imf.org' },
    { fr: 'Banque de développement du Conseil de l’Europe', en: 'Council of Europe Development Bank', logo: 'coebank.org', url: 'https://coebank.org' },
    { fr: 'CEA', en: 'CEA', logo: 'cea.fr', url: 'https://www.cea.fr' }
  ],
  entreprises: [
    { fr: 'Airbus', en: 'Airbus', logo: 'airbus.com', url: 'https://www.airbus.com' },
    { fr: 'Safran', en: 'Safran', logo: 'safran-group.com', url: 'https://www.safran-group.com' },
    { fr: 'Thales', en: 'Thales', logo: 'thalesgroup.com', url: 'https://www.thalesgroup.com' },
    { fr: 'Dassault Aviation', en: 'Dassault Aviation', logo: 'dassault-aviation.com', url: 'https://www.dassault-aviation.com' },
    { fr: 'Dassault Systèmes', en: 'Dassault Systèmes', logo: '3ds.com', url: 'https://www.3ds.com' },
    { fr: 'KNDS', en: 'KNDS', logo: 'knds.com', url: 'https://www.knds.com' },
    { fr: 'Naval Group', en: 'Naval Group', logo: 'naval-group.com', url: 'https://www.naval-group.com' },
    { fr: 'MBDA', en: 'MBDA', logo: 'mbda-systems.com', url: 'https://www.mbda-systems.com' },
    { fr: 'ArianeGroup', en: 'ArianeGroup', logo: 'ariane.group', url: 'https://www.ariane.group' },
    { fr: 'Hadit', en: 'Hadit', short: 'HADIT' },   // déposer assets/logos/hadit.png puis ajouter logo
    { fr: 'LVMH', en: 'LVMH', logo: 'lvmh.com', url: 'https://www.lvmh.com' },
    { fr: 'Sopra Steria', en: 'Sopra Steria', logo: 'soprasteria.com', url: 'https://www.soprasteria.com' },
    { fr: 'Deloitte', en: 'Deloitte', logo: 'assets/logos/deloitte.png', url: 'https://www.deloitte.com' },
    { fr: 'EY', en: 'EY', logo: 'assets/logos/ey.png', url: 'https://www.ey.com' },
    { fr: 'Capgemini Invent', en: 'Capgemini Invent', logo: 'assets/logos/capgemini.png', url: 'https://www.capgemini.com' },
    { fr: 'Wavestone', en: 'Wavestone', logo: 'assets/logos/wavestone.png', url: 'https://www.wavestone.com' }
  ]
};

/* Sports, pictogrammes uniformes. */
const SPORTS = {
  fr: [
    { name: 'Handball', logo: 'assets/logos/sport/handball.svg' },
    { name: 'Tennis de table', logo: 'assets/logos/sport/table-tennis.svg' },
    { name: 'VTT', logo: 'assets/logos/sport/bike.svg' },
    { name: 'Course à pied', logo: 'assets/logos/sport/run.svg' }
  ],
  en: [
    { name: 'Handball', logo: 'assets/logos/sport/handball.svg' },
    { name: 'Table tennis', logo: 'assets/logos/sport/table-tennis.svg' },
    { name: 'Mountain biking', logo: 'assets/logos/sport/bike.svg' },
    { name: 'Running', logo: 'assets/logos/sport/run.svg' }
  ]
};

const CONTENT = {

  /* ----------------------------- FRANÇAIS ------------------------------ */
  fr: {
    docTitle: 'Florian Grolleau',
    description: 'Florian Grolleau, étudiant en science politique et ingénierie data science. Analyse d’influence, tableaux de bord prédictifs, géomatique.',
    ui: {
      toc: 'Sommaire',
      copy: 'Copier l’adresse',
      copied: 'Adresse copiée',
      write: 'Écrire',
      menu: 'Menu',
      close: 'Fermer',
      home: 'Accueil',
      profile: 'Profil',
      noteTouch: 'Touchez un projet pour afficher son aperçu GitHub.',
      sheetLabel: 'Aperçu du dépôt GitHub',
      updated: 'Mis à jour le',
      noDesc: 'Pas de description sur GitHub.',
      missing: 'Aperçu indisponible : dépôt privé ou introuvable.',
      openRepo: 'Ouvrir le dépôt',
      profileGh: 'Voir le profil GitHub',
      writtenIn: 'Rédigé en',
      langLegend: 'Langue',
      skip: 'Aller au contenu',
      cv: 'Curriculum vitae',
      privateRepo: 'dépôt privé',
      themeLabel: 'Basculer le thème',
      source: 'Code source',
      license: 'Contenu sous licence CC BY-NC-SA 4.0',
      licenseTitle: 'Attribution, pas d’utilisation commerciale, partage dans les mêmes conditions'
    },
    hero: {
      role: 'Science politique et Data Science · Étudiant en Double Diplôme Sciences Po & CY Tech (ex-EISTI)',
      intro: 'Étudiant en 5ᵉ année (Master 2), en double diplôme entre Sciences Po Saint-Germain-en-Laye et l’école d’ingénieurs CY Tech (ex-EISTI), j’évolue au confluent de deux disciplines interdépendantes. Ce cursus me permet de <mark>concilier rigueur scientifique, analyse quantitative et remise en contexte</mark> des projets que je mène, puis de collecter, traiter et interpréter les données qu’ils produisent. Après un stage au ministère des Armées, je souhaite poursuivre dans une organisation internationale, une institution européenne ou une entreprise tournée vers l’intelligence économique, le développement, la sécurité ou la finance.',
      meta: [
        ['Statut', 'Disponible à partir de février 2027 · Alternance & Stage'],
        ['Actuellement', 'Versailles, France'],
        ['Base', 'Île-de-France']
      ]
    },
    sections: [
      {
        id: 'formation',
        title: 'Formation',
        kind: 'entries',
        entries: [
          {
            title: 'Sciences Po Saint-Germain-en-Laye',
            url: 'https://www.sciencespo-saintgermainenlaye.fr/',
            logo: 'sciencespo-saintgermainenlaye.fr',
            sub: 'Master de science politique',
            meta: ['09/2022 → aujourd’hui', 'Saint-Germain-en-Laye'],
            body: 'Cursus généraliste en sciences sociales, centré sur les relations internationales, l’économie et l’analyse des politiques publiques. Le parcours humanités numériques y ajoute le traitement de la donnée appliqué aux questions de gouvernance.'
          },
          {
            title: 'CY Tech (ex-EISTI)',
            url: 'https://cytech.cyu.fr/',
            logo: 'cytech.cyu.fr',
            sub: 'Ingénieur mathématiques et informatique, spécialité data science et IA · double diplôme avec Sciences Po',
            meta: ['09/2022 → aujourd’hui', 'Cergy'],
            body: 'Cursus mené en parallèle de celui de Sciences Po. Machine learning, deep learning et statistiques appliquées sous Python et R, conception de bases de données, pratique régulière du SIG et de la visualisation.'
          },
          {
            title: 'Université de Bergen',
            url: 'https://www.uib.no/en',
            logo: 'assets/logos/uib.png',
            sub: 'Échange académique Erasmus',
            meta: ['01/2025 → 06/2025', 'Norvège'],
            body: 'Un semestre consacré aux aires régionales et aux régimes politiques : droits des peuples autochtones, politique russe, analyse comparée des régimes latino-américains.'
          }
        ]
      },
      {
        id: 'experience',
        title: 'Expérience',
        kind: 'entries',
        entries: [
          {
            title: 'Ministère des Armées',
            url: 'https://www.linkedin.com/company/commandement-pour-l-afrique-cpa/',
            logo: 'defense.gouv.fr',
            sub: 'Stagiaire Data Science et Relations Internationales',
            meta: ['04/2026 → 08/2026', 'Libreville, Gabon'],
            body: 'Analyste au sein du Détachement de liaison interarmées et du Bureau influence et lutte informationnelle (BILI), sur la zone de responsabilité permanente française en Afrique centrale. J’y ai construit un <a href="https://github.com/Flor5378/-ENG-GlobalRiskIntelligencePlatform" data-repo="Flor5378/-ENG-GlobalRiskIntelligencePlatform" target="_blank" rel="noopener">tableau de bord prédictif</a> des dynamiques socio-économiques régionales, puis une <a href="https://github.com/Flor5378/Gabon-Monitor" data-repo="Flor5378/Gabon-Monitor" target="_blank" rel="noopener">chaîne d’analyse du sentiment médiatique</a> qui traite en continu la presse et les réseaux sociaux de la zone : plus de 21 millions d’utilisateurs suivis, plusieurs dizaines de milliers de publications et plusieurs milliards de vues chaque semaine.',
            tags: ['Python|python', 'DuckDB|duckdb', 'Streamlit|streamlit', 'NLP', 'OSINT']
          },
          {
            title: 'Bureau d’analyse des enjeux de défense',
            url: 'https://www.linkedin.com/company/bureau-analyse-des-enjeux-de-la-d%C3%A9fense/',
            logo: 'assets/logos/baed.png',
            short: 'BAED',
            sub: 'Pôle partenariats · association de 150 membres',
            meta: ['04/2025 → 04/2026', 'France'],
            body: 'En charge des relations partenaires, des industriels de la défense aux autorités militaires. Présence au salon MILIPOL 2025 et aux cérémonies officielles (ravivage de la flamme, visite de la DGGN), rédaction d’articles et de notes de synthèse pour les membres.'
          },
          {
            title: 'ANFSI',
            url: 'https://www.linkedin.com/company/anfsi/',
            logo: 'interieur.gouv.fr',
            sub: 'Stagiaire · Agence numérique des forces de sécurité intérieure',
            meta: ['07/2025', 'France'],
            body: 'Reprise des bases de données de drones de l’agence, trajectoires, coordonnées et identifiants, sous PostgreSQL et MongoDB. J’y ai ajouté un modèle de classification hybride combinant KNN, forêts aléatoires et XGBoost, qui atteint 90 % de précision.',
            tags: ['PostgreSQL|postgresql', 'MongoDB|mongodb', 'scikit-learn|scikitlearn', 'XGBoost']
          },
          {
            title: 'Corps européen de solidarité',
            url: 'https://youth.europa.eu/solidarity_fr',
            logo: 'youth.europa.eu',
            sub: 'Bénévole · refuge pour ours de Kuterevo',
            meta: ['08/2025', 'Croatie'],
            body: 'Un mois de volontariat dans un refuge des montagnes croates : soins aux animaux, entretien du site et maintenance des enclos.'
          },
          {
            title: 'MUN Saint-Germain',
            logo: 'assets/logos/mun.png',
            short: 'MUN',
            sub: 'Trésorier · association de 100 membres',
            meta: ['09/2023 → 12/2024', 'Saint-Germain-en-Laye'],
            body: 'Gestion du budget, suivi des dépenses et reporting au conseil d’administration. J’ai également tenu la communication de l’association et animé une communauté de 2 500 abonnés.'
          }
        ]
      },
      {
        id: 'projets',
        title: 'Projets',
        kind: 'projects',
        note: 'Survolez un projet pour afficher son aperçu GitHub.',
        // Projets récents, en tête de la section. Un site sans `url` s’affiche comme inaccessible.
        featured: {
          label: 'Projets récents',
          title: 'Un écosystème de sites web et d’applications autour de la donnée',
          body: 'Encore en construction, cet écosystème concilie la collecte, le traitement et l’analyse de données avec des modèles de prédiction, sur un large éventail de domaines : statistiques, finance, économie, développement et géopolitique.',
          sites: [
            { name: 'worldofmetrics.com', url: 'https://worldofmetrics.com', status: 'Le plus récent · en développement' },
            { name: 'worldofstats.app', status: 'Pour l’instant inaccessible' },
            { name: 'worldofkpi.com', status: 'Pour l’instant inaccessible' },
            { name: 'global-eye.app', status: 'Pour l’instant inaccessible' }
          ]
        },
        groups: [
          {
            label: 'Sciences sociales',
            items: [
              { title: 'Drones et éthique dans la guerre moderne', lang: 'EN', repo: 'Flor5378/-ENG-Modern-Warfare-UAVs-and-Ethics', image: 'assets/previews/drones.webp', alt: 'Drone MQ-9 Reaper en vol au-dessus du désert' },
              { title: 'Entreprises privées et politiques migratoires américaines', lang: 'EN', repo: 'Flor5378/-ENG-DigitalDemocracyEssay', image: 'assets/previews/digital-democracy.webp', alt: 'Page de titre du rapport « Digital Democracy », Sciences Po Saint-Germain-en-Laye et CY Cergy Paris Université' },
              { title: 'Challenge Données et Territoires', lang: 'FR', repo: 'Flor5378/-FR-Data_and_Territories', image: 'assets/previews/donnees-territoires.webp', alt: 'Graphique du taux de croissance annuel des effectifs bilingues en breton et en basque, de 2004 à 2024' },
              { title: 'Formations en ligne et taux de réussite', lang: 'FR', repo: 'Flor5378/-FR-FormationsenLigneStatistiques', image: 'assets/previews/formations-en-ligne.webp', alt: 'Tableau des résultats d’une régression logistique sur la réussite à l’examen selon le genre et l’IDH' },
              { title: 'Marchés prédictifs et concurrence de l’information', lang: 'FR', repo: 'Flor5378/-FR-MarchesPredictifs_ConcurrenceInformationnelle', image: 'assets/previews/marches-predictifs.webp', alt: 'Extrait du mémoire sur les droits asymétriques des marchés prédictifs' }
            ]
          },
          {
            label: 'Data science',
            items: [
              { title: 'Classification de drones en Ukraine', lang: 'FR / EN', repo: 'Flor5378/-FR-ENG-DroneClassificationUA', image: 'assets/previews/drones-ukraine-v2.webp', alt: 'Synthèse de la classification des pistes radar simulées : indicateurs F1, carte des erreurs de rôle et matrice de confusion' },
              { title: 'Études sur l’indice de qualité de l’air', lang: 'EN', repo: 'Flor5378/-ENG-AirQualityIndexStudies', image: 'assets/previews/air-quality.webp', alt: 'Page de titre du rapport « Predicting Air Quality Index with Data Science and Machine Learning »' },
              { title: 'Clustering des facteurs de criminalité aux États-Unis', lang: 'EN', repo: 'Flor5378/-ENG-Final_Project_Clustering', image: 'assets/previews/clustering-criminalite.webp', alt: 'Analyse en composantes principales en trois dimensions des facteurs de criminalité' },
              { title: 'Requêtes SQL et optimisation', lang: 'FR', repo: 'Flor5378/-FR-RequetesSQLetOptimisationBDD', image: 'assets/previews/requetes-sql.webp', alt: 'Page de titre du projet de base de données sur la population française entre 1968 et 2020' }
            ]
          },
          {
            label: 'Terrain',
            items: [
              { title: 'Gabon Monitor, veille presse et réseaux sociaux', lang: 'FR', repo: 'Flor5378/Gabon-Monitor', image: 'assets/previews/gabon-monitor.webp', alt: 'Tableau de bord « Veille presse Gabon » : volume quotidien d’articles par source' },
              { title: 'Plateforme de renseignement prédictif', lang: 'EN', repo: 'Flor5378/-ENG-GlobalRiskIntelligencePlatform' }
            ]
          }
        ]
      },
      {
        id: 'competences',
        title: 'Compétences',
        kind: 'skills',
        rows: [
          {
            label: 'Data science',
            chips: ['Python|python', 'scikit-learn|scikitlearn', 'pandas|pandas', 'NumPy|numpy', 'Keras|keras', 'NLP', 'R|r', 'SQL', 'PostgreSQL|postgresql', 'MongoDB|mongodb', 'Java|java', 'JavaFX|java', 'JavaScript|javascript', 'React|react', 'HTML/CSS|html5', 'Docker|docker', 'Git|git', 'Bash|bash', 'PowerShell|powershell', 'LaTeX|latex', 'Talend|talend', 'Selenium|selenium', 'BeautifulSoup']
          },
          {
            label: 'Intelligence artificielle et données',
            chips: ['Machine learning', 'Deep learning', 'Text mining', 'Big data', 'Cloud computing']
          },
          {
            label: 'Géomatique et data visualisation',
            chips: ['QGIS|qgis', 'ArcGIS|arcgis', 'ArcPy|arcgis', 'GeoPandas|geopandas', 'Power BI', 'seaborn', 'plotly|plotly', 'statistiques']
          },
          {
            label: 'Science politique',
            chips: ['Relations internationales', 'Géopolitique', 'Analyse des politiques publiques', 'Politiques de la donnée publique', 'Sciences sociales computationnelles', 'Controverses de l’IA', 'Afrique centrale et golfe de Guinée', 'Europe occidentale', 'Scandinavie', 'Économie', 'Intelligence économique', 'Finance', 'Veille scientifique']
          },
          {
            label: 'Langues',
            chips: ['Français, langue maternelle', 'Anglais, C1', 'Allemand, B2']
          }
        ]
      },
      {
        id: 'organisations',
        title: 'Institutions et entreprises de prédilection',
        navTitle: 'Organisations',
        kind: 'orgs',
        note: 'Les structures dans lesquelles je souhaite exercer.',
        groups: [
          { label: 'Institutions', items: ORGS.institutions },
          { label: 'Entreprises', items: ORGS.entreprises }
        ]
      },
      {
        id: 'interets',
        title: 'Centres d’intérêt',
        navTitle: 'Intérêts',
        kind: 'prose',
        blocks: [
          {
            meta: ['Lectures'],
            body: 'Lecture suivie de revues à comité de lecture en économie, défense et aéronavale, d’ouvrages d’histoire, de bandes dessinées et de la presse spécialisée sur l’Afrique.',
            logos: [
              { name: 'Passés composés', logo: 'assets/logos/passe-compose.png', url: 'https://passes-composes.com', wide: true, short: 'PC' },
              { name: 'Éditions Soleil', logo: 'editions-soleil.fr', url: 'https://www.editions-soleil.fr' },
              { name: 'CNRS', logo: 'cnrs.fr', url: 'https://www.cnrs.fr' },
              { name: 'Africa Intelligence', logo: 'africaintelligence.fr', url: 'https://www.africaintelligence.fr' }
            ]
          },
          {
            meta: ['Sports'],
            body: 'Six ans de handball et dix ans de tennis de table en club. Le reste du temps, VTT et course à pied.',
            logos: SPORTS.fr
          },
          {
            meta: ['Jeu de stratégie'],
            body: 'Joueur semi-professionnel d’Age of Empires II, 2 200 Elo et 150ᵉ place mondiale. Un entraînement quotidien à la décision rapide en information incomplète.',
            logos: [
              { name: 'Age of Empires II', logo: 'ageofempires.com', url: 'https://www.ageofempires.com' }
            ],
            image: 'assets/previews/aoe-elo.webp',
            alt: 'Historique du classement Elo d’Age of Empires II en 1 contre 1 classé, d’environ 1 100 en 2022 à plus de 2 200 en 2026'
          }
        ]
      },
      {
        id: 'contact',
        title: 'Contact',
        kind: 'contact',
        body: 'Je cherche un stage ou une alternance en analyse de données, intelligence économique ou en finance, à partir de février 2027, pour 6 mois.'
      }
    ]
  },

  /* ------------------------------ ENGLISH ------------------------------ */
  en: {
    docTitle: 'Florian Grolleau',
    description: 'Florian Grolleau, political science and data science engineering student. Influence analysis, predictive dashboards, geospatial work.',
    ui: {
      toc: 'Contents',
      copy: 'Copy address',
      copied: 'Address copied',
      write: 'Write to me',
      menu: 'Menu',
      close: 'Close',
      home: 'Home',
      profile: 'Profile',
      noteTouch: 'Tap a project to see its GitHub preview.',
      sheetLabel: 'GitHub repository preview',
      updated: 'Updated',
      noDesc: 'No description on GitHub.',
      missing: 'Preview unavailable: private or missing repository.',
      openRepo: 'Open repository',
      profileGh: 'View GitHub profile',
      writtenIn: 'Written in',
      langLegend: 'Language',
      skip: 'Skip to content',
      cv: 'Curriculum vitae',
      privateRepo: 'private repository',
      themeLabel: 'Toggle theme',
      source: 'Source code',
      license: 'Content under a CC BY-NC-SA 4.0 licence',
      licenseTitle: 'Attribution, non-commercial, share alike'
    },
    hero: {
      role: 'Political Science and Data Science · Dual Degree Student, Sciences Po & CY Tech School of Engineering (formerly EISTI)',
      intro: 'Fifth-year student (Master 2) on a dual degree between Sciences Po Saint-Germain-en-Laye and the CY Tech engineering school (formerly EISTI), I work where two interdependent fields meet. That mix lets me pair <mark>scientific rigour and quantitative analysis with the context</mark> each project sits in, then collect, process and interpret the data the work produces. After an internship with the French Ministry of Armed Forces, I am looking to continue in an international organisation, a European institution or a company working on competitive intelligence, development, security or finance.',
      meta: [
        ['Status', 'Available from February 2027 · Work-study & Internship'],
        ['Currently', 'Versailles, France'],
        ['Based in', 'Île-de-France']
      ]
    },
    sections: [
      {
        id: 'formation',
        title: 'Education',
        kind: 'entries',
        entries: [
          {
            title: 'Sciences Po Saint-Germain-en-Laye',
            url: 'https://www.sciencespo-saintgermainenlaye.fr/en/',
            logo: 'sciencespo-saintgermainenlaye.fr',
            sub: 'Master in Political Science',
            meta: ['09/2022 → present', 'Saint-Germain-en-Laye'],
            body: 'A generalist social science degree centred on international relations, economics and policy analysis. The digital humanities track adds data work applied to governance questions.'
          },
          {
            title: 'CY Tech (formerly EISTI)',
            url: 'https://cytech.cyu.fr/',
            logo: 'cytech.cyu.fr',
            sub: 'Engineering degree in mathematics and computer science, data science and AI track · dual degree with Sciences Po',
            meta: ['09/2022 → present', 'Cergy'],
            body: 'Taken in parallel with the Sciences Po track. Machine learning, deep learning and applied statistics in Python and R, database design, regular GIS and visualisation work.'
          },
          {
            title: 'University of Bergen',
            url: 'https://www.uib.no/en',
            logo: 'assets/logos/uib.png',
            sub: 'Erasmus academic exchange',
            meta: ['01/2025 → 06/2025', 'Norway'],
            body: 'A semester on regional studies and political regimes: indigenous rights, Russian politics, comparative analysis of Latin American regimes.'
          }
        ]
      },
      {
        id: 'experience',
        title: 'Experience',
        kind: 'entries',
        entries: [
          {
            title: 'French Ministry of Armed Forces',
            url: 'https://www.linkedin.com/company/commandement-pour-l-afrique-cpa/',
            logo: 'defense.gouv.fr',
            sub: 'Data Science and International Relations Intern',
            meta: ['04/2026 → 08/2026', 'Libreville, Gabon'],
            body: 'Analyst within the Joint Liaison Detachment and the Influence and Information Warfare Office (BILI), covering the French permanent area of responsibility in Central Africa. I built a <a href="https://github.com/Flor5378/-ENG-GlobalRiskIntelligencePlatform" data-repo="Flor5378/-ENG-GlobalRiskIntelligencePlatform" target="_blank" rel="noopener">predictive dashboard</a> of regional socio-economic dynamics, then a <a href="https://github.com/Flor5378/Gabon-Monitor" data-repo="Flor5378/Gabon-Monitor" target="_blank" rel="noopener">media sentiment pipeline</a> that continuously processes regional press and social media: over 21 million users monitored, tens of thousands of posts and several billion views every week.',
            tags: ['Python|python', 'DuckDB|duckdb', 'Streamlit|streamlit', 'NLP', 'OSINT']
          },
          {
            title: 'Office for the Analysis of Defence Issues',
            url: 'https://www.linkedin.com/company/bureau-analyse-des-enjeux-de-la-d%C3%A9fense/',
            logo: 'assets/logos/baed.png',
            short: 'BAED',
            sub: 'Partnerships lead · 150-member association',
            meta: ['04/2025 → 04/2026', 'France'],
            body: 'In charge of partner relations, from defence manufacturers to military authorities. MILIPOL 2025 and official ceremonies (rekindling of the Flame of the Unknown Soldier, visit to the DGGN), articles and briefing notes for the members.'
          },
          {
            title: 'ANFSI',
            url: 'https://www.linkedin.com/company/anfsi/',
            logo: 'interieur.gouv.fr',
            sub: 'Intern · French Digital Agency for Internal Security Forces',
            meta: ['07/2025', 'France'],
            body: 'Reworked the agency’s drone databases, trajectories, coordinates and identifiers, on PostgreSQL and MongoDB. I added a hybrid classification model combining KNN, random forests and XGBoost, reaching 90% accuracy.',
            tags: ['PostgreSQL|postgresql', 'MongoDB|mongodb', 'scikit-learn|scikitlearn', 'XGBoost']
          },
          {
            title: 'European Solidarity Corps',
            url: 'https://youth.europa.eu/solidarity_en',
            logo: 'youth.europa.eu',
            sub: 'Volunteer · Kuterevo bear sanctuary',
            meta: ['08/2025', 'Croatia'],
            body: 'A month of volunteering at a sanctuary in the Croatian mountains: animal care, site upkeep and enclosure maintenance.'
          },
          {
            title: 'MUN Saint-Germain',
            logo: 'assets/logos/mun.png',
            short: 'MUN',
            sub: 'Treasurer · 100-member association',
            meta: ['09/2023 → 12/2024', 'Saint-Germain-en-Laye'],
            body: 'Budget management, expense tracking and board reporting. I also ran the association’s communications for a 2,500-follower community.'
          }
        ]
      },
      {
        id: 'projets',
        title: 'Projects',
        kind: 'projects',
        note: 'Hover a project to see its GitHub preview.',
        featured: {
          label: 'Recent projects',
          title: 'An ecosystem of websites and applications built around data',
          body: 'Still a work in progress, this ecosystem combines data collection, processing and analysis with predictive models, across a wide range of fields: statistics, finance, economics, development and geopolitics.',
          sites: [
            { name: 'worldofmetrics.com', url: 'https://worldofmetrics.com', status: 'Most recent · in development' },
            { name: 'worldofstats.app', status: 'Not accessible yet' },
            { name: 'worldofkpi.com', status: 'Not accessible yet' },
            { name: 'global-eye.app', status: 'Not accessible yet' }
          ]
        },
        groups: [
          {
            label: 'Social sciences',
            items: [
              { title: 'Modern warfare UAVs and ethics', lang: 'EN', repo: 'Flor5378/-ENG-Modern-Warfare-UAVs-and-Ethics', image: 'assets/previews/drones.webp', alt: 'MQ-9 Reaper drone flying over the desert' },
              { title: 'Private companies and US immigration policies', lang: 'EN', repo: 'Flor5378/-ENG-DigitalDemocracyEssay', image: 'assets/previews/digital-democracy.webp', alt: 'Title page of the “Digital Democracy” report, Sciences Po Saint-Germain-en-Laye and CY Cergy Paris Université' },
              { title: 'Data and Territories Challenge', lang: 'FR', repo: 'Flor5378/-FR-Data_and_Territories', image: 'assets/previews/donnees-territoires.webp', alt: 'Chart of the annual growth of bilingual Breton and Basque enrolment, from 2004 to 2024' },
              { title: 'Online courses and success rates', lang: 'FR', repo: 'Flor5378/-FR-FormationsenLigneStatistiques', image: 'assets/previews/formations-en-ligne.webp', alt: 'Results table of a logistic regression on exam success by gender and HDI' },
              { title: 'Predictive markets and information competition', lang: 'FR', repo: 'Flor5378/-FR-MarchesPredictifs_ConcurrenceInformationnelle', image: 'assets/previews/marches-predictifs.webp', alt: 'Excerpt from the paper on asymmetric rights in prediction markets' }
            ]
          },
          {
            label: 'Data science',
            items: [
              { title: 'Drone classification in Ukraine', lang: 'FR / EN', repo: 'Flor5378/-FR-ENG-DroneClassificationUA', image: 'assets/previews/drones-ukraine-v2.webp', alt: 'Summary of the simulated radar track classification: F1 scores, map of role errors and confusion matrix' },
              { title: 'Air quality index studies', lang: 'EN', repo: 'Flor5378/-ENG-AirQualityIndexStudies', image: 'assets/previews/air-quality.webp', alt: 'Title page of the “Predicting Air Quality Index with Data Science and Machine Learning” report' },
              { title: 'Clustering US crime determinants', lang: 'EN', repo: 'Flor5378/-ENG-Final_Project_Clustering', image: 'assets/previews/clustering-criminalite.webp', alt: 'Three-dimensional principal component analysis of crime factors' },
              { title: 'SQL queries and optimisation', lang: 'FR', repo: 'Flor5378/-FR-RequetesSQLetOptimisationBDD', image: 'assets/previews/requetes-sql.webp', alt: 'Title page of the database project on the French population between 1968 and 2020' }
            ]
          },
          {
            label: 'Field work',
            items: [
              { title: 'Gabon Monitor, press and social media monitoring', lang: 'FR', repo: 'Flor5378/Gabon-Monitor', image: 'assets/previews/gabon-monitor.webp', alt: '“Veille presse Gabon” dashboard: daily article volume by source' },
              { title: 'Predictive intelligence platform', lang: 'EN', repo: 'Flor5378/-ENG-GlobalRiskIntelligencePlatform' }
            ]
          }
        ]
      },
      {
        id: 'competences',
        title: 'Skills',
        kind: 'skills',
        rows: [
          {
            label: 'Data science',
            chips: ['Python|python', 'scikit-learn|scikitlearn', 'pandas|pandas', 'NumPy|numpy', 'Keras|keras', 'NLP', 'R|r', 'SQL', 'PostgreSQL|postgresql', 'MongoDB|mongodb', 'Java|java', 'JavaFX|java', 'JavaScript|javascript', 'React|react', 'HTML/CSS|html5', 'Docker|docker', 'Git|git', 'Bash|bash', 'PowerShell|powershell', 'LaTeX|latex', 'Talend|talend', 'Selenium|selenium', 'BeautifulSoup']
          },
          {
            label: 'Artificial intelligence and data',
            chips: ['Machine learning', 'Deep learning', 'Text mining', 'Big data', 'Cloud computing']
          },
          {
            label: 'Geospatial and data visualisation',
            chips: ['QGIS|qgis', 'ArcGIS|arcgis', 'ArcPy|arcgis', 'GeoPandas|geopandas', 'Power BI', 'seaborn', 'plotly|plotly', 'statistics']
          },
          {
            label: 'Political science',
            chips: ['International relations', 'Geopolitics', 'Policy analysis', 'Public data policy', 'Computational social science', 'AI controversies', 'Central Africa and Gulf of Guinea', 'Western Europe', 'Scandinavia', 'Economics', 'Competitive intelligence', 'Finance', 'Research monitoring']
          },
          {
            label: 'Languages',
            chips: ['French, native', 'English, C1', 'German, B2']
          }
        ]
      },
      {
        id: 'organisations',
        title: 'Institutions and companies I am aiming for',
        navTitle: 'Organisations',
        kind: 'orgs',
        note: 'Where I want to put these skills to work.',
        groups: [
          { label: 'Institutions', items: ORGS.institutions },
          { label: 'Companies', items: ORGS.entreprises }
        ]
      },
      {
        id: 'interets',
        title: 'Interests',
        navTitle: 'Interests',
        kind: 'prose',
        blocks: [
          {
            meta: ['Reading'],
            body: 'Regular reading of peer-reviewed journals in economics, defence and naval aviation, history books, graphic novels and specialised Africa coverage.',
            logos: [
              { name: 'Passés composés', logo: 'assets/logos/passe-compose.png', url: 'https://passes-composes.com', wide: true, short: 'PC' },
              { name: 'Éditions Soleil', logo: 'editions-soleil.fr', url: 'https://www.editions-soleil.fr' },
              { name: 'CNRS', logo: 'cnrs.fr', url: 'https://www.cnrs.fr' },
              { name: 'Africa Intelligence', logo: 'africaintelligence.com', url: 'https://www.africaintelligence.com' }
            ]
          },
          {
            meta: ['Sports'],
            body: 'Six years of handball and ten years of table tennis in club. Mountain biking and running the rest of the time.',
            logos: SPORTS.en
          },
          {
            meta: ['Strategy games'],
            body: 'Semi-professional Age of Empires II player, 2,200 Elo and ranked 150th worldwide. Daily practice at fast decisions under incomplete information.',
            logos: [
              { name: 'Age of Empires II', logo: 'ageofempires.com', url: 'https://www.ageofempires.com' }
            ],
            image: 'assets/previews/aoe-elo.webp',
            alt: 'Age of Empires II ranked 1v1 Elo history, from about 1,100 in 2022 to over 2,200 in 2026'
          }
        ]
      },
      {
        id: 'contact',
        title: 'Contact',
        kind: 'contact',
        body: 'I am looking for an internship or a work-study placement in data analysis, competitive intelligence or finance, from February 2027, for 6 months.'
      }
    ]
  }
};
