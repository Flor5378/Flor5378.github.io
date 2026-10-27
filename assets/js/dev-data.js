/* =========================================================================
   dev-data.js
   Jeux de données de la passe break-ui (passation, section 9). Chargé par
   app.js seulement en local, avec ?data=worst ou ?data=empty : jamais en
   production. Les cas extrêmes entrent par la même frontière que le contenu
   réel (un clone de content.js modifié), jamais par le balisage.
   ========================================================================= */

const LONG = 'Flor5378/-FR-ENG-AnalyseComparee_SouveraineteNumerique_UE_AfriqueDeLOuest_2026';

const section = (c, kind, id) => c.sections.find((s) => s.kind === kind && (!id || s.id === id));

function worst() {
  const content = structuredClone(CONTENT);
  const config = Object.assign({}, CONFIG, { email: 'florian.grolleau@sciencespo-saintgermainenlaye.fr' });
  const gh = {
    [LONG]: {
      description: 'Comparative study of digital sovereignty policies across the 27 EU member states and the 15 ECOWAS countries, combining a legal corpus of 1,284 texts, parliamentary debates and press coverage. The repository contains the scraping pipeline, the annotated dataset, topic models, a multilingual sentiment classifier fine-tuned on French, English and Portuguese, and the notebooks behind every figure of the final report.',
      language: 'Jupyter Notebook',
      pushedAt: '2026-10-02T09:00:00Z'
    },
    'Flor5378/-ENG-AirQualityIndexStudies': { description: 'Personal Project over Air Quality Index (AQI) Analysis and Machine Learning Prediction Implementation', language: 'Jupyter Notebook', pushedAt: '' }
  };

  const T = {
    fr: {
      role: 'Science politique, ingénierie data et intelligence économique appliquée aux enjeux de défense · Double diplôme Sciences Po Saint-Germain-en-Laye et CY Tech, spécialité data science et intelligence artificielle',
      meta: [['Statut', 'Disponible à partir de février 2027 pour un premier poste ou un volontariat international en entreprise'], ['Actuellement', 'Saint-Germain-en-Laye, Île-de-France'], ['Base', 'Région parisienne, France'], ['Mobilité', 'Europe, Afrique centrale et de l’Ouest, Amérique latine']],
      ihedn: { title: 'Institut des hautes études de défense nationale (IHEDN), session nationale jeunes', url: 'https://ihedn.fr', logo: 'ihedn.fr', wide: true, sub: 'Auditeur · cycle sur la souveraineté, la défense et les relations internationales', meta: ['10/2026 → aujourd’hui', 'École militaire, Paris'], body: 'Trois séminaires de cinq jours entre Paris, Toulon et Bruxelles, consacrés aux crises internationales et à la résilience nationale.' },
      ens: { title: 'ENS', meta: ['07/2021'], body: 'Université d’été.' },
      dgris: { title: 'Direction générale des relations internationales et de la stratégie (DGRIS)', url: 'https://www.defense.gouv.fr/dgris', logo: 'defense.gouv.fr', sub: 'Chargé de mission analyse de données et cartographie des risques géopolitiques, pôle Afrique subsaharienne et océan Indien', meta: ['11/2026 → aujourd’hui', 'Paris, site de Balard'], body: `Suivi quotidien des signaux faibles sur onze pays. J’y ai repris la <a href="https://github.com/Flor5378/Gabon-Monitor" data-repo="Flor5378/Gabon-Monitor">chaîne d’analyse du sentiment médiatique</a> pour l’étendre à six langues, maintenu le <a href="https://github.com/Flor5378/-ENG-GlobalRiskIntelligencePlatform" data-repo="Flor5378/-ENG-GlobalRiskIntelligencePlatform">tableau de bord prédictif</a> et publié une <a href="https://github.com/${LONG}" data-repo="${LONG}">étude comparée de souveraineté numérique</a> diffusée chaque semaine à 1 284 destinataires.`, tags: ['Python|python', 'DuckDB|duckdb', 'Streamlit|streamlit', 'NLP', 'OSINT', 'PostgreSQL|postgresql', 'Docker|docker', 'Analyse de sentiment multilingue', 'Hugging Face Transformers'] },
      obs: { title: 'Observatoire franco-gabonais des médias', meta: ['06/2026', 'Libreville, Gabon'], body: 'Atelier de deux jours.' },
      ey: { title: 'EY', url: 'https://www.ey.com', logo: 'assets/logos/ey.png', wide: true, sub: 'Stagiaire · Forensic & Integrity Services', meta: ['01/2026 → 03/2026', 'Paris-La Défense'], body: 'Trois mois en investigation : cartographie de réseaux d’entreprises et revue documentaire assistée par apprentissage automatique.', tags: ['Python|python', 'Neo4j'] },
      longProject: 'Analyse comparée des politiques de souveraineté numérique dans l’Union européenne et en Afrique de l’Ouest',
      research: 'Recherche',
      geoLabel: 'Géomatique, systèmes d’information géographique et data visualisation',
      longChip: 'Sciences sociales computationnelles appliquées aux médias d’Afrique centrale',
      cert: 'Certifications',
      inst: [['Organisation pour la sécurité et la coopération en Europe (OSCE)', 'https://www.osce.org'], ['Direction générale de l’armement', 'https://www.defense.gouv.fr/dga']]
    },
    en: {
      role: 'Political science, data engineering and competitive intelligence for defence issues · Dual degree, Sciences Po Saint-Germain-en-Laye and CY Tech, data science and artificial intelligence track',
      meta: [['Status', 'Available from February 2027 for a first role or an international corporate volunteer programme'], ['Currently', 'Saint-Germain-en-Laye, Île-de-France'], ['Based in', 'Paris area, France'], ['Mobility', 'Europe, Central and West Africa, Latin America']],
      ihedn: { title: 'Institute for Advanced Studies in National Defence (IHEDN), national youth session', url: 'https://ihedn.fr', logo: 'ihedn.fr', wide: true, sub: 'Auditor · programme on sovereignty, defence and international relations', meta: ['10/2026 → present', 'École militaire, Paris'], body: 'Three five-day seminars across Paris, Toulon and Brussels on international crises and national resilience.' },
      ens: { title: 'ENS', meta: ['07/2021'], body: 'Summer school.' },
      dgris: { title: 'Directorate General for International Relations and Strategy (DGRIS)', url: 'https://www.defense.gouv.fr/dgris', logo: 'defense.gouv.fr', sub: 'Data analysis and geopolitical risk mapping officer, Sub-Saharan Africa and Indian Ocean desk', meta: ['11/2026 → present', 'Paris, Balard site'], body: `Daily monitoring of weak signals across eleven countries. I took over the <a href="https://github.com/Flor5378/Gabon-Monitor" data-repo="Flor5378/Gabon-Monitor">media sentiment pipeline</a> and extended it to six languages, maintained the <a href="https://github.com/Flor5378/-ENG-GlobalRiskIntelligencePlatform" data-repo="Flor5378/-ENG-GlobalRiskIntelligencePlatform">predictive dashboard</a> and published a <a href="https://github.com/${LONG}" data-repo="${LONG}">comparative digital sovereignty study</a> sent every week to 1,284 recipients.`, tags: ['Python|python', 'DuckDB|duckdb', 'Streamlit|streamlit', 'NLP', 'OSINT', 'PostgreSQL|postgresql', 'Docker|docker', 'Multilingual sentiment analysis', 'Hugging Face Transformers'] },
      obs: { title: 'French-Gabonese Media Observatory', meta: ['06/2026', 'Libreville, Gabon'], body: 'Two-day workshop.' },
      ey: { title: 'EY', url: 'https://www.ey.com', logo: 'assets/logos/ey.png', wide: true, sub: 'Intern · Forensic & Integrity Services', meta: ['01/2026 → 03/2026', 'Paris-La Défense'], body: 'Three months in investigations: corporate network mapping and machine-learning-assisted document review.', tags: ['Python|python', 'Neo4j'] },
      longProject: 'Comparative analysis of digital sovereignty policies in the European Union and West Africa',
      research: 'Research',
      geoLabel: 'Geospatial, geographic information systems and data visualisation',
      longChip: 'Computational social science applied to Central African media',
      cert: 'Certifications',
      inst: [['Organization for Security and Co-operation in Europe (OSCE)', 'https://www.osce.org'], ['Directorate General for Armament', 'https://www.defense.gouv.fr/dga']]
    }
  };
  const more = ['Polars', 'Apache Spark', 'Airflow', 'dbt', 'FastAPI', 'Tableau', 'Looker Studio', 'Hugging Face Transformers', 'spaCy', 'NLTK', 'Gensim'];
  // 17 institutions et 23 entreprises, dont six sans logo avec Hadit (9.1).
  const companies = [['Boston Consulting Group', 'https://www.bcg.com', null], ['Roland Berger', 'https://www.rolandberger.com', null], ['McKinsey & Company', 'https://www.mckinsey.com', null], ['Accenture', 'https://www.accenture.com', 'accenture.com'], ['PwC', 'https://www.pwc.com', null], ['KPMG', 'https://kpmg.com', 'kpmg.com'], ['Kearney', 'https://www.kearney.com', null]];

  ['fr', 'en'].forEach((l) => {
    const c = content[l], t = T[l];
    c.hero.role = t.role;
    c.hero.meta = t.meta;
    const edu = section(c, 'entries', 'formation'), exp = section(c, 'entries', 'experience');
    edu.entries.unshift(t.ihedn);
    edu.entries.push(t.ens);
    exp.entries.unshift(t.dgris, t.obs, t.ey);
    const proj = section(c, 'projects');
    proj.groups[0].items.push({ title: t.longProject, lang: 'FR / EN', repo: LONG });
    proj.groups[2].items = proj.groups[2].items.filter((p) => p.repo === 'Flor5378/Gabon-Monitor');
    proj.groups.push({ label: t.research, items: [] });
    const skills = section(c, 'skills');
    skills.rows[0].chips = skills.rows[0].chips.concat(more);
    skills.rows[2].label = t.geoLabel;
    skills.rows[3].chips.push(t.longChip);
    skills.rows.push({ label: t.cert, chips: ['TOEIC 965'] });
    const orgs = section(c, 'orgs');
    orgs.groups[0].items = orgs.groups[0].items.concat(t.inst.map(([n, url]) => ({ fr: n, en: n, url })));
    orgs.groups[1].items = orgs.groups[1].items.concat(companies.map(([n, url, logo]) => ({ fr: n, en: n, url, logo: logo || undefined })));
  });
  // Les noms d'institutions ajoutés diffèrent selon la langue.
  const instFr = section(content.fr, 'orgs').groups[0].items, instEn = section(content.en, 'orgs').groups[0].items;
  T.fr.inst.forEach((_, i) => {
    const a = instFr[instFr.length - 2 + i], b = instEn[instEn.length - 2 + i];
    a.en = b.en; b.fr = a.fr;
  });
  return { content, config, gh };
}

function empty() {
  const content = structuredClone(CONTENT);
  ['fr', 'en'].forEach((l) => {
    content[l].sections.forEach((s) => {
      if (s.kind === 'entries') s.entries = [];
      if (s.kind === 'projects') {
        s.groups.forEach((g) => { g.items = []; });
        if (s.featured) s.featured.sites = [];
      }
      if (s.kind === 'skills') s.rows = [];
      if (s.kind === 'orgs') s.groups.forEach((g) => { g.items = []; });
    });
  });
  return { content, config: CONFIG, gh: null };
}

export function dataset(name) {
  const data = name === 'worst' ? worst() : empty();
  mountToggle(name);
  return data;
}

// Contrôle segmenté en bas au centre : police système, piste grise, pastille blanche.
function mountToggle(current) {
  const bar = document.createElement('div');
  bar.className = 'v-dev';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Jeu de données, développement uniquement');
  [['demo', 'Démo'], ['worst', 'Cas extrêmes'], ['empty', 'Listes vides']].forEach(([key, label]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.setAttribute('aria-pressed', String(key === current));
    b.addEventListener('click', () => {
      const url = new URL(location.href);
      url.searchParams.set('data', key);
      location.href = url.toString();
    });
    bar.append(b);
  });
  document.body.append(bar);
}
