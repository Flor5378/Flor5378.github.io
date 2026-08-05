/* =========================================================================
   content.js
   Tout le contenu du site, en français et en anglais.
   C’est le SEUL fichier à modifier pour mettre le site à jour.
   ========================================================================= */

const CONFIG = {
  email: 'f.grolleau@netc.fr',
  github: 'https://github.com/Flor5378',
  githubLabel: 'github.com/Flor5378',
  linkedin: 'https://www.linkedin.com/in/florian-grolleau', // à vérifier avant publication
  photo: 'assets/photo.jpg', // optionnel : si le fichier n’existe pas, l’avatar disparaît
  initials: 'FG'
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
      themeLabel: 'Basculer le thème',
      updated: 'Dernière mise à jour'
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
            sub: 'Master de science politique',
            meta: ['09/2022 → aujourd’hui', 'Saint-Germain-en-Laye'],
            body: 'Sciences sociales, analyse de données, relations internationales, économie. Humanités numériques, développement durable, analyse des politiques publiques, gouvernance.'
          },
          {
            title: 'CY Tech (ex-EISTI)',
            sub: 'Diplôme d’ingénieur en data science · double diplôme avec Sciences Po',
            meta: ['09/2022 → aujourd’hui', 'Cergy'],
            body: 'Data science, IA et machine learning (scikit-learn, pandas, Keras, NumPy), SQL, Java, R. Statistiques : modèles de régression, tests statistiques, plotly, seaborn, MATLAB, MongoDB, QGIS.'
          },
          {
            title: 'Université de Bergen',
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
            sub: 'Stagiaire data science et analyse',
            meta: ['04/2026 → 08/2026', 'Libreville, Gabon'],
            body: 'Analyse sur la zone de responsabilité permanente française en Afrique centrale, au sein du Détachement de liaison interarmées (DLIA-G) et du Bureau influence et lutte informationnelle. Construction d’un tableau de bord prédictif sur les enjeux socio-économiques régionaux et d’une chaîne d’analyse du sentiment médiatique.',
            tags: ['Python', 'DuckDB', 'Streamlit', 'NLP', 'OSINT']
          },
          {
            title: 'Bureau d’analyse des enjeux de défense',
            sub: 'Pôle partenariats · association de 150 membres',
            meta: ['04/2025 → 04/2026', 'France'],
            body: 'Relations partenaires, participation au salon MILIPOL 2025 et à des cérémonies officielles, rédaction d’articles et de notes de synthèse.'
          },
          {
            title: 'ANFSI',
            sub: 'Stagiaire · Agence numérique des forces de sécurité intérieure',
            meta: ['07/2025', 'France'],
            body: 'Amélioration de bases de données de drones (trajectoires, coordonnées, identifiants) sous PostgreSQL et MongoDB. Modèle de classification hybride (KNN, Random Forest, XGBoost) atteignant 90 % de précision.',
            tags: ['PostgreSQL', 'MongoDB', 'scikit-learn', 'XGBoost']
          },
          {
            title: 'Refuge pour ours de Kuterevo',
            sub: 'Bénévole',
            meta: ['08/2025', 'Croatie'],
            body: 'Soins aux animaux, entretien du refuge et maintenance des enclos.'
          },
          {
            title: 'MUN Saint-Germain',
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
        note: 'Code et rapports disponibles sur GitHub.',
        groups: [
          {
            label: 'Sciences sociales',
            items: [
              { title: 'Drones et éthique dans la guerre moderne', lang: 'EN' },
              { title: 'Entreprises privées et politiques migratoires américaines', lang: 'EN' },
              { title: 'Challenge Données et Territoires', lang: 'FR' },
              { title: 'Formations en ligne et taux de réussite', lang: 'FR' },
              { title: 'Marchés prédictifs et concurrence de l’information', lang: 'FR' }
            ]
          },
          {
            label: 'Data science',
            items: [
              { title: 'Classification de drones en Ukraine', lang: 'FR / EN' },
              { title: 'Études sur l’indice de qualité de l’air', lang: 'EN' },
              { title: 'Clustering des facteurs de criminalité aux États-Unis', lang: 'EN' },
              { title: 'Requêtes SQL et optimisation', lang: 'FR' },
              { title: 'Algorithmes de tri en Python', lang: 'FR' }
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
            chips: ['Python', 'scikit-learn', 'pandas', 'NumPy', 'Keras', 'NLP', 'R', 'SQL', 'PostgreSQL', 'MongoDB', 'Java', 'JavaFX', 'JavaScript', 'React', 'HTML/CSS', 'Docker', 'Git', 'Bash', 'PowerShell', 'LaTeX', 'Talend', 'Selenium', 'BeautifulSoup']
          },
          {
            label: 'Géomatique et data viz',
            chips: ['QGIS', 'ArcGIS', 'ArcPy', 'GeoPandas', 'Power BI', 'seaborn', 'plotly', 'statistiques']
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
        id: 'interets',
        title: 'Centres d’intérêt',
        kind: 'prose',
        blocks: [
          {
            meta: ['Lectures'],
            body: 'Revues à comité de lecture en économie, défense et aéronavale, et infographies spécialisées (Passé Composé, CNRS).'
          },
          {
            meta: ['Sports'],
            body: 'Handball (6 ans), tennis de table (10 ans), VTT (7 ans).'
          },
          {
            meta: ['Jeu de stratégie'],
            body: 'Joueur semi-professionnel d’Age of Empires II : 2 200 Elo, 150ᵉ mondial.'
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
      themeLabel: 'Toggle theme',
      updated: 'Last updated'
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
            sub: 'Master in Political Science',
            meta: ['09/2022 → present', 'Saint-Germain-en-Laye'],
            body: 'Social sciences, data analysis, international relations, economics. Digital humanities, sustainability, policy analysis, governance.'
          },
          {
            title: 'CY Tech (formerly EISTI)',
            sub: 'Master’s degree in engineering, data science · dual degree with Sciences Po',
            meta: ['09/2022 → present', 'Cergy'],
            body: 'Data science, AI and machine learning (scikit-learn, pandas, Keras, NumPy), SQL, Java, R. Statistics: regression models, statistical testing, plotly, seaborn, MATLAB, MongoDB, QGIS.'
          },
          {
            title: 'University of Bergen',
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
            sub: 'Data science and analysis intern',
            meta: ['04/2026 → 08/2026', 'Libreville, Gabon'],
            body: 'Analysis across the French permanent area of responsibility in Central Africa, within the Joint Liaison Detachment (DLIA-G) and the Influence and Information Warfare Office. Built a predictive dashboard on regional socio-economic issues and a media sentiment analysis pipeline.',
            tags: ['Python', 'DuckDB', 'Streamlit', 'NLP', 'OSINT']
          },
          {
            title: 'Office for the Analysis of Defence Issues',
            sub: 'Partnerships lead · 150-member association',
            meta: ['04/2025 → 04/2026', 'France'],
            body: 'Partner relations, MILIPOL 2025 trade show and official ceremonies, articles and briefing notes.'
          },
          {
            title: 'ANFSI',
            sub: 'Intern · French Digital Agency for Internal Security Forces',
            meta: ['07/2025', 'France'],
            body: 'Improved drone databases (trajectories, coordinates, identifiers) on PostgreSQL and MongoDB. Hybrid classification model (KNN, Random Forest, XGBoost) reaching 90% accuracy.',
            tags: ['PostgreSQL', 'MongoDB', 'scikit-learn', 'XGBoost']
          },
          {
            title: 'Kuterevo Bear Sanctuary',
            sub: 'Volunteer',
            meta: ['08/2025', 'Croatia'],
            body: 'Animal care, sanctuary upkeep and enclosure maintenance.'
          },
          {
            title: 'MUN Saint-Germain',
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
        note: 'Code and reports available on GitHub.',
        groups: [
          {
            label: 'Social sciences',
            items: [
              { title: 'Modern warfare UAVs and ethics', lang: 'EN' },
              { title: 'Private companies and US immigration policies', lang: 'EN' },
              { title: 'Data and Territories Challenge', lang: 'FR' },
              { title: 'Online courses and success rates', lang: 'FR' },
              { title: 'Predictive markets and information competition', lang: 'FR' }
            ]
          },
          {
            label: 'Data science',
            items: [
              { title: 'Drone classification in Ukraine', lang: 'FR / EN' },
              { title: 'Air quality index studies', lang: 'EN' },
              { title: 'Clustering US crime determinants', lang: 'EN' },
              { title: 'SQL queries and optimisation', lang: 'FR' },
              { title: 'Sorting algorithms in Python', lang: 'FR' }
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
            chips: ['Python', 'scikit-learn', 'pandas', 'NumPy', 'Keras', 'NLP', 'R', 'SQL', 'PostgreSQL', 'MongoDB', 'Java', 'JavaFX', 'JavaScript', 'React', 'HTML/CSS', 'Docker', 'Git', 'Bash', 'PowerShell', 'LaTeX', 'Talend', 'Selenium', 'BeautifulSoup']
          },
          {
            label: 'Geospatial and data viz',
            chips: ['QGIS', 'ArcGIS', 'ArcPy', 'GeoPandas', 'Power BI', 'seaborn', 'plotly', 'statistics']
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
        id: 'interets',
        title: 'Interests',
        kind: 'prose',
        blocks: [
          {
            meta: ['Reading'],
            body: 'Peer-reviewed journals in economics, defence and naval aviation, and specialised infographics (Passé Composé, CNRS).'
          },
          {
            meta: ['Sports'],
            body: 'Handball (6 years), table tennis (10 years), mountain biking (7 years).'
          },
          {
            meta: ['Strategy games'],
            body: 'Semi-professional Age of Empires II player: 2,200 Elo, ranked 150th worldwide.'
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
