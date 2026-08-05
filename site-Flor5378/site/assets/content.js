/* =========================================================================
   content.js
   Tout le contenu du site, en français et en anglais.
   C’est le SEUL fichier à modifier pour mettre le site à jour.

   Conventions
   -----------
   logo   : 'exemple.fr'              → favicon récupéré automatiquement
            'assets/logos/x.png'      → fichier local, prioritaire
            absent ou fichier absent  → pastille avec les initiales
   chips  : 'Nom'                     → texte seul
            'Nom|python'              → icône assets/logos/tech/python.svg
   repo   : 'Flor5378/nom-du-depot'   → aperçu GitHub au survol du lien
   ========================================================================= */

const CONFIG = {
  email: 'f.grolleau@netc.fr',
  github: 'https://github.com/Flor5378',
  githubLabel: 'github.com/Flor5378',
  linkedin: 'https://www.linkedin.com/in/florian-grolleau-3a7a22274',
  photo: 'assets/photo.jpg', // optionnel : si le fichier n’existe pas, l’avatar disparaît
  initials: 'FG'
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
    { fr: 'Frontex', en: 'Frontex', logo: 'frontex.europa.eu', url: 'https://www.frontex.europa.eu' },
    { fr: 'Europol', en: 'Europol', logo: 'europol.europa.eu', url: 'https://www.europol.europa.eu' },
    { fr: 'Agence spatiale européenne', en: 'European Space Agency', logo: 'esa.int', url: 'https://www.esa.int' },
    { fr: 'Nations unies', en: 'United Nations', logo: 'un.org', url: 'https://www.un.org' },
    { fr: 'Banque mondiale', en: 'World Bank', logo: 'worldbank.org', url: 'https://www.worldbank.org' },
    { fr: 'Fonds monétaire international', en: 'International Monetary Fund', logo: 'imf.org', url: 'https://www.imf.org' },
    { fr: 'Banque de développement du Conseil de l’Europe', en: 'Council of Europe Development Bank', logo: 'coebank.org', url: 'https://coebank.org' }
  ],
  entreprises: [
    { fr: 'Airbus', en: 'Airbus', logo: 'airbus.com', url: 'https://www.airbus.com' },
    { fr: 'Safran', en: 'Safran', logo: 'safran-group.com', url: 'https://www.safran-group.com' },
    { fr: 'Thales', en: 'Thales', logo: 'thalesgroup.com', url: 'https://www.thalesgroup.com' },
    { fr: 'Dassault Aviation', en: 'Dassault Aviation', logo: 'dassault-aviation.com', url: 'https://www.dassault-aviation.com' },
    { fr: 'Naval Group', en: 'Naval Group', logo: 'naval-group.com', url: 'https://www.naval-group.com' },
    { fr: 'MBDA', en: 'MBDA', logo: 'mbda-systems.com', url: 'https://www.mbda-systems.com' },
    { fr: 'ArianeGroup', en: 'ArianeGroup', logo: 'ariane.group', url: 'https://www.ariane.group' },
    { fr: 'LVMH', en: 'LVMH', logo: 'lvmh.com', url: 'https://www.lvmh.com' },
    { fr: 'Sopra Steria', en: 'Sopra Steria', logo: 'soprasteria.com', url: 'https://www.soprasteria.com' },
    { fr: 'Capgemini', en: 'Capgemini', logo: 'capgemini.com', url: 'https://www.capgemini.com' }
  ]
};

const CONTENT = {

  /* ----------------------------- FRANÇAIS ------------------------------ */
  fr: {
    docTitle: 'Florian Grolleau',
    description: 'Florian Grolleau, étudiant en science politique et ingénierie data science. Analyse d’influence, tableaux de bord prédictifs, géomatique.',
    ui: {
      toc: 'Sommaire',
      copy: 'Copier',
      copied: 'Copié',
      themeLabel: 'Basculer le thème'
    },
    hero: {
      role: 'Étudiant en 5ᵉ année (M2) · Science politique et ingénierie data',
      intro: 'Je travaille entre l’<mark>analyse politique et la data science</mark> : veille et analyse d’influence, tableaux de bord prédictifs, géomatique et modèles de classification. Double diplôme Sciences Po Saint-Germain-en-Laye et CY Tech.',
      meta: [
        ['Statut', 'Disponible à partir de septembre 2026'],
        ['Actuellement', 'Libreville, Gabon'],
        ['Base', 'Région parisienne, France']
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
            body: 'Sciences sociales, analyse de données, relations internationales, économie. Humanités numériques, développement durable, analyse des politiques publiques, gouvernance.'
          },
          {
            title: 'CY Tech (ex-EISTI)',
            url: 'https://cytech.cyu.fr/',
            logo: 'cytech.cyu.fr',
            sub: 'Diplôme d’ingénieur en data science · double diplôme avec Sciences Po',
            meta: ['09/2022 → aujourd’hui', 'Cergy'],
            body: 'Data science, IA et machine learning (scikit-learn, pandas, Keras, NumPy), SQL, Java, R. Statistiques : modèles de régression, tests statistiques, plotly, seaborn, MATLAB, MongoDB, QGIS.'
          },
          {
            title: 'Université de Bergen',
            url: 'https://www.uib.no/en',
            logo: 'uib.no',
            sub: 'Échange académique Erasmus',
            meta: ['01/2025 → 06/2025', 'Norvège'],
            body: 'Droits des peuples autochtones, politique russe, analyse comparative des régimes latino-américains.'
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
            sub: 'Stagiaire data science et analyse',
            meta: ['04/2026 → 08/2026', 'Libreville, Gabon'],
            body: 'Analyse sur la zone de responsabilité permanente française en Afrique centrale, au sein du Détachement de liaison interarmées (DLIA-G) et du Bureau influence et lutte informationnelle. Construction d’un <a href="https://github.com/Flor5378/-ENG-GlobalRiskIntelligencePlatform" data-repo="Flor5378/-ENG-GlobalRiskIntelligencePlatform" target="_blank" rel="noopener">tableau de bord prédictif</a> sur les enjeux socio-économiques régionaux et d’une <a href="https://github.com/Flor5378/Gabon-Monitor" data-repo="Flor5378/Gabon-Monitor" target="_blank" rel="noopener">analyse du sentiment médiatique</a>.',
            tags: ['Python|python', 'DuckDB|duckdb', 'Streamlit|streamlit', 'NLP', 'OSINT']
          },
          {
            title: 'Bureau d’analyse des enjeux de défense',
            url: 'https://www.linkedin.com/company/bureau-analyse-des-enjeux-de-la-d%C3%A9fense/',
            logo: 'assets/logos/baed.png',
            short: 'BAED',
            sub: 'Pôle partenariats · association de 150 membres',
            meta: ['04/2025 → 04/2026', 'France'],
            body: 'Relations partenaires, participation au salon MILIPOL 2025 et à des cérémonies officielles, rédaction d’articles et de notes de synthèse.'
          },
          {
            title: 'ANFSI',
            url: 'https://www.linkedin.com/company/anfsi/',
            logo: 'interieur.gouv.fr',
            sub: 'Stagiaire · Agence numérique des forces de sécurité intérieure',
            meta: ['07/2025', 'France'],
            body: 'Amélioration de bases de données de drones (trajectoires, coordonnées, identifiants) sous PostgreSQL et MongoDB. Modèle de classification hybride (KNN, Random Forest, XGBoost) atteignant 90 % de précision.',
            tags: ['PostgreSQL|postgresql', 'MongoDB|mongodb', 'scikit-learn|scikitlearn', 'XGBoost']
          },
          {
            title: 'Corps européen de solidarité',
            url: 'https://youth.europa.eu/solidarity_fr',
            logo: 'youth.europa.eu',
            sub: 'Bénévole · refuge pour ours de Kuterevo',
            meta: ['08/2025', 'Croatie'],
            body: 'Soins aux animaux, entretien du refuge et maintenance des enclos.'
          },
          {
            title: 'MUN Saint-Germain',
            logo: 'assets/logos/mun.png',
            short: 'MUN',
            sub: 'Trésorier · association de 100 membres',
            meta: ['09/2023 → 12/2024', 'Saint-Germain-en-Laye'],
            body: 'Gestion budgétaire, suivi financier et reporting au conseil d’administration. Communication et animation d’une communauté de 2 500 abonnés.'
          }
        ]
      },
      {
        id: 'projets',
        title: 'Projets',
        kind: 'projects',
        note: 'Survolez un projet pour afficher son aperçu GitHub.',
        groups: [
          {
            label: 'Sciences sociales',
            items: [
              { title: 'Drones et éthique dans la guerre moderne', lang: 'EN', repo: 'Flor5378/-ENG-Modern-Warfare-UAVs-and-Ethics' },
              { title: 'Entreprises privées et politiques migratoires américaines', lang: 'EN', repo: 'Flor5378/-ENG-DigitalDemocracyEssay' },
              { title: 'Challenge Données et Territoires', lang: 'FR', repo: 'Flor5378/-FR-Data_and_Territories' },
              { title: 'Formations en ligne et taux de réussite', lang: 'FR', repo: 'Flor5378/-FR-FormationsenLigneStatistiques' },
              { title: 'Marchés prédictifs et concurrence de l’information', lang: 'FR', repo: 'Flor5378/-FR-MarchesPredictifs_ConcurrenceInformationnelle' }
            ]
          },
          {
            label: 'Data science',
            items: [
              { title: 'Classification de drones en Ukraine', lang: 'FR / EN', repo: 'Flor5378/-FR-ENG-DroneClassificationUA' },
              { title: 'Études sur l’indice de qualité de l’air', lang: 'EN', repo: 'Flor5378/-ENG-AirQualityIndexStudies' },
              { title: 'Clustering des facteurs de criminalité aux États-Unis', lang: 'EN', repo: 'Flor5378/-ENG-Final_Project_Clustering' },
              { title: 'Requêtes SQL et optimisation', lang: 'FR', repo: 'Flor5378/-FR-RequetesSQLetOptimisationBDD' },
              { title: 'Algorithmes de tri en Python', lang: 'FR', repo: 'Flor5378/-FR-ENG-SortingAlgorithmsinPython' }
            ]
          },
          {
            label: 'Terrain',
            items: [
              { title: 'Plateforme de renseignement prédictif', lang: 'EN', repo: 'Flor5378/-ENG-GlobalRiskIntelligencePlatform' },
              { title: 'Gabon Monitor, veille presse et réseaux sociaux', lang: 'FR', repo: 'Flor5378/Gabon-Monitor' }
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
            chips: ['Python|python', 'scikit-learn|scikitlearn', 'pandas|pandas', 'NumPy|numpy', 'Keras|keras', 'NLP', 'R|r', 'SQL', 'PostgreSQL|postgresql', 'MongoDB|mongodb', 'Java|java', 'JavaFX', 'JavaScript|javascript', 'React|react', 'HTML/CSS|html5', 'Docker|docker', 'Git|git', 'Bash|bash', 'PowerShell|powershell', 'LaTeX|latex', 'Talend', 'Selenium|selenium', 'BeautifulSoup']
          },
          {
            label: 'Géomatique et data viz',
            chips: ['QGIS', 'ArcGIS', 'ArcPy', 'GeoPandas', 'Power BI', 'seaborn', 'plotly|plotly', 'statistiques']
          },
          {
            label: 'Science politique',
            chips: ['Relations internationales', 'Analyse des politiques publiques', 'Afrique centrale et golfe de Guinée', 'Europe occidentale', 'Scandinavie', 'Économie', 'Veille scientifique']
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
        kind: 'prose',
        blocks: [
          {
            meta: ['Lectures'],
            body: 'Revues à comité de lecture en économie, défense et aéronavale. Infographies institutionnelles et suivi spécialisé sur l’Afrique.',
            logos: [
              { name: 'Passé Composé', logo: 'assets/logos/passe-compose.png', short: 'PC' },
              { name: 'CNRS', logo: 'cnrs.fr', url: 'https://www.cnrs.fr' },
              { name: 'Africa Intelligence', logo: 'africaintelligence.fr', url: 'https://www.africaintelligence.fr' }
            ]
          },
          {
            meta: ['Sports'],
            body: 'Handball (6 ans), tennis de table (10 ans), VTT (7 ans).'
          },
          {
            meta: ['Jeu de stratégie'],
            body: 'Joueur semi-professionnel d’Age of Empires II : 2 200 Elo, 150ᵉ mondial.',
            logos: [
              { name: 'Age of Empires II', logo: 'ageofempires.com', url: 'https://www.ageofempires.com' }
            ]
          }
        ]
      },
      {
        id: 'contact',
        title: 'Contact',
        kind: 'contact',
        body: 'Ouvert aux opportunités en analyse de données, intelligence économique et affaires internationales, à partir de septembre 2026.'
      }
    ]
  },

  /* ------------------------------ ENGLISH ------------------------------ */
  en: {
    docTitle: 'Florian Grolleau',
    description: 'Florian Grolleau, political science and data science engineering student. Influence analysis, predictive dashboards, geospatial work.',
    ui: {
      toc: 'Contents',
      copy: 'Copy',
      copied: 'Copied',
      themeLabel: 'Toggle theme'
    },
    hero: {
      role: '5th-year student (M2) · Political science and data engineering',
      intro: 'I work between <mark>political analysis and data science</mark>: media monitoring and influence analysis, predictive dashboards, geospatial work and classification models. Dual degree from Sciences Po Saint-Germain-en-Laye and CY Tech.',
      meta: [
        ['Status', 'Available from September 2026'],
        ['Currently', 'Libreville, Gabon'],
        ['Based in', 'Paris area, France']
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
            body: 'Social sciences, data analysis, international relations, economics. Digital humanities, sustainability, policy analysis, governance.'
          },
          {
            title: 'CY Tech (formerly EISTI)',
            url: 'https://cytech.cyu.fr/',
            logo: 'cytech.cyu.fr',
            sub: 'Master’s degree in engineering, data science · dual degree with Sciences Po',
            meta: ['09/2022 → present', 'Cergy'],
            body: 'Data science, AI and machine learning (scikit-learn, pandas, Keras, NumPy), SQL, Java, R. Statistics: regression models, statistical testing, plotly, seaborn, MATLAB, MongoDB, QGIS.'
          },
          {
            title: 'University of Bergen',
            url: 'https://www.uib.no/en',
            logo: 'uib.no',
            sub: 'Erasmus academic exchange',
            meta: ['01/2025 → 06/2025', 'Norway'],
            body: 'Indigenous rights, Russian politics, comparative analysis of Latin American regimes.'
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
            sub: 'Data science and analysis intern',
            meta: ['04/2026 → 08/2026', 'Libreville, Gabon'],
            body: 'Analysis across the French permanent area of responsibility in Central Africa, within the Joint Liaison Detachment (DLIA-G) and the Influence and Information Warfare Office. Built a <a href="https://github.com/Flor5378/-ENG-GlobalRiskIntelligencePlatform" data-repo="Flor5378/-ENG-GlobalRiskIntelligencePlatform" target="_blank" rel="noopener">predictive intelligence dashboard</a> on regional socio-economic issues and a <a href="https://github.com/Flor5378/Gabon-Monitor" data-repo="Flor5378/Gabon-Monitor" target="_blank" rel="noopener">media sentiment analysis</a> pipeline.',
            tags: ['Python|python', 'DuckDB|duckdb', 'Streamlit|streamlit', 'NLP', 'OSINT']
          },
          {
            title: 'Office for the Analysis of Defence Issues',
            url: 'https://www.linkedin.com/company/bureau-analyse-des-enjeux-de-la-d%C3%A9fense/',
            logo: 'assets/logos/baed.png',
            short: 'BAED',
            sub: 'Partnerships lead · 150-member association',
            meta: ['04/2025 → 04/2026', 'France'],
            body: 'Partner relations, MILIPOL 2025 trade show and official ceremonies, articles and briefing notes.'
          },
          {
            title: 'ANFSI',
            url: 'https://www.linkedin.com/company/anfsi/',
            logo: 'interieur.gouv.fr',
            sub: 'Intern · French Digital Agency for Internal Security Forces',
            meta: ['07/2025', 'France'],
            body: 'Improved drone databases (trajectories, coordinates, identifiers) on PostgreSQL and MongoDB. Hybrid classification model (KNN, Random Forest, XGBoost) reaching 90% accuracy.',
            tags: ['PostgreSQL|postgresql', 'MongoDB|mongodb', 'scikit-learn|scikitlearn', 'XGBoost']
          },
          {
            title: 'European Solidarity Corps',
            url: 'https://youth.europa.eu/solidarity_en',
            logo: 'youth.europa.eu',
            sub: 'Volunteer · Kuterevo bear sanctuary',
            meta: ['08/2025', 'Croatia'],
            body: 'Animal care, sanctuary upkeep and enclosure maintenance.'
          },
          {
            title: 'MUN Saint-Germain',
            logo: 'assets/logos/mun.png',
            short: 'MUN',
            sub: 'Treasurer · 100-member association',
            meta: ['09/2023 → 12/2024', 'Saint-Germain-en-Laye'],
            body: 'Budget management, financial monitoring and board reporting. Communications for a 2,500-follower community.'
          }
        ]
      },
      {
        id: 'projets',
        title: 'Projects',
        kind: 'projects',
        note: 'Hover a project to see its GitHub preview.',
        groups: [
          {
            label: 'Social sciences',
            items: [
              { title: 'Modern warfare UAVs and ethics', lang: 'EN', repo: 'Flor5378/-ENG-Modern-Warfare-UAVs-and-Ethics' },
              { title: 'Private companies and US immigration policies', lang: 'EN', repo: 'Flor5378/-ENG-DigitalDemocracyEssay' },
              { title: 'Data and Territories Challenge', lang: 'FR', repo: 'Flor5378/-FR-Data_and_Territories' },
              { title: 'Online courses and success rates', lang: 'FR', repo: 'Flor5378/-FR-FormationsenLigneStatistiques' },
              { title: 'Predictive markets and information competition', lang: 'FR', repo: 'Flor5378/-FR-MarchesPredictifs_ConcurrenceInformationnelle' }
            ]
          },
          {
            label: 'Data science',
            items: [
              { title: 'Drone classification in Ukraine', lang: 'FR / EN', repo: 'Flor5378/-FR-ENG-DroneClassificationUA' },
              { title: 'Air quality index studies', lang: 'EN', repo: 'Flor5378/-ENG-AirQualityIndexStudies' },
              { title: 'Clustering US crime determinants', lang: 'EN', repo: 'Flor5378/-ENG-Final_Project_Clustering' },
              { title: 'SQL queries and optimisation', lang: 'FR', repo: 'Flor5378/-FR-RequetesSQLetOptimisationBDD' },
              { title: 'Sorting algorithms in Python', lang: 'FR', repo: 'Flor5378/-FR-ENG-SortingAlgorithmsinPython' }
            ]
          },
          {
            label: 'Field work',
            items: [
              { title: 'Predictive intelligence platform', lang: 'EN', repo: 'Flor5378/-ENG-GlobalRiskIntelligencePlatform' },
              { title: 'Gabon Monitor, press and social media monitoring', lang: 'FR', repo: 'Flor5378/Gabon-Monitor' }
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
            chips: ['Python|python', 'scikit-learn|scikitlearn', 'pandas|pandas', 'NumPy|numpy', 'Keras|keras', 'NLP', 'R|r', 'SQL', 'PostgreSQL|postgresql', 'MongoDB|mongodb', 'Java|java', 'JavaFX', 'JavaScript|javascript', 'React|react', 'HTML/CSS|html5', 'Docker|docker', 'Git|git', 'Bash|bash', 'PowerShell|powershell', 'LaTeX|latex', 'Talend', 'Selenium|selenium', 'BeautifulSoup']
          },
          {
            label: 'Geospatial and data viz',
            chips: ['QGIS', 'ArcGIS', 'ArcPy', 'GeoPandas', 'Power BI', 'seaborn', 'plotly|plotly', 'statistics']
          },
          {
            label: 'Political science',
            chips: ['International relations', 'Policy analysis', 'Central Africa and Gulf of Guinea', 'Western Europe', 'Scandinavia', 'Economics', 'Research monitoring']
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
        kind: 'prose',
        blocks: [
          {
            meta: ['Reading'],
            body: 'Peer-reviewed journals in economics, defence and naval aviation. Institutional infographics and specialised Africa coverage.',
            logos: [
              { name: 'Passé Composé', logo: 'assets/logos/passe-compose.png', short: 'PC' },
              { name: 'CNRS', logo: 'cnrs.fr', url: 'https://www.cnrs.fr' },
              { name: 'Africa Intelligence', logo: 'africaintelligence.com', url: 'https://www.africaintelligence.com' }
            ]
          },
          {
            meta: ['Sports'],
            body: 'Handball (6 years), table tennis (10 years), mountain biking (7 years).'
          },
          {
            meta: ['Strategy games'],
            body: 'Semi-professional Age of Empires II player: 2,200 Elo, ranked 150th worldwide.',
            logos: [
              { name: 'Age of Empires II', logo: 'ageofempires.com', url: 'https://www.ageofempires.com' }
            ]
          }
        ]
      },
      {
        id: 'contact',
        title: 'Contact',
        kind: 'contact',
        body: 'Open to roles in data analysis, competitive intelligence and international affairs, from September 2026.'
      }
    ]
  }
};
