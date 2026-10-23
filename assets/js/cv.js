/* =========================================================================
   cv.js
   Rend le CV imprimable (deux pages A4) depuis content.js (passation 8).
   Utilisé par cv.html et par l'impression du site.
   ========================================================================= */

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad2 = (n) => String(n).padStart(2, '0');
const lower = (v) => String(v).toLowerCase();

// Mêmes repères que le site : libellés de hero.meta et ligne des langues.
const STATUS = ['statut', 'status'];
const NOW = ['actuellement', 'currently'];
const LANGS = ['langues', 'languages'];

const compounds = (text) => String(text || '').split(' ')
  .map((w) => `<span class="cv-nb">${esc(w)}</span>`).join(' ');
const bare = (url) => String(url).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

// Liens de dépôt : soulignés en accent, sans URL développée (8.2).
function body(html, gh, cfg) {
  const box = document.createElement('div');
  box.innerHTML = html || '';
  box.querySelectorAll('a[data-repo]').forEach((a) => {
    const missing = gh && gh.repos && gh.repos[a.dataset.repo] && gh.repos[a.dataset.repo].missing;
    a.className = 'lk';
    a.setAttribute('href', missing ? cfg.github : 'https://github.com/' + a.dataset.repo);
    a.removeAttribute('target');
    a.removeAttribute('data-repo');
  });
  return box.innerHTML;
}

function entry(e, gh, cfg) {
  const [period, place] = e.meta || [];
  const tags = e.tags && e.tags.length
    ? `<p class="cv-tags">${e.tags.map((t) => esc(String(t).split('|')[0])).join(' · ')}</p>` : '';
  return `<div class="cv-e"><p class="cv-when"><span>${esc(period || '')}</span>${place ? `<span class="p">${compounds(place)}</span>` : ''}</p>` +
    `<h3 class="cv-org">${esc(e.title)}</h3>${e.sub ? `<p class="cv-sub">${esc(e.sub)}</p>` : ''}` +
    `<p class="cv-txt">${body(e.body, gh, cfg)}</p>${tags}</div>`;
}

function foot(c, n, cfg) {
  return `<footer class="cv-foot"><span>Florian Grolleau · ${esc(c.ui.cv)}</span>` +
    `<a class="u" href="${esc(cfg.site)}">${esc(bare(cfg.site))}</a><span>${n} / 2</span></footer>`;
}

export function renderCV(root, lang, gh, data) {
  const cfg = (data && data.config) || CONFIG;
  const c = ((data && data.content) || CONTENT)[lang];
  const find = (labels) => c.hero.meta.find((m) => labels.includes(lower(m[0])));
  const status = find(STATUS);
  const now = find(NOW);
  const [roleA, ...roleB] = String(c.hero.role).split('·');
  const sections = c.sections;
  const byKind = (k) => sections.filter((s) => s.kind === k);
  const nonEmpty = (s) => (s.entries ? s.entries.length : s.groups ? s.groups.some((g) => g.items.length) : s.rows ? s.rows.length : s.blocks ? s.blocks.length : true);

  // Numéros 01, 02, 03 dans l'ordre du CV : Expérience, Formation, Projets.
  const entries = byKind('entries').filter(nonEmpty);
  const exp = entries.find((s) => s.id === 'experience') || entries[1] || null;
  const edu = entries.find((s) => s.id === 'formation') || entries[0] || null;
  const projects = byKind('projects').find(nonEmpty) || null;
  const skills = byKind('skills').find(nonEmpty) || null;
  const orgs = byKind('orgs').find(nonEmpty) || null;
  const prose = byKind('prose').find(nonEmpty) || null;
  let k = 0;
  const num = () => pad2(++k);

  const skillRows = skills ? skills.rows.filter((r) => !LANGS.includes(lower(r.label))) : [];
  const langRow = skills ? skills.rows.find((r) => LANGS.includes(lower(r.label))) : null;
  const chipNames = (list) => list.map((x) => esc(String(x).split('|')[0]));

  const side1 = (skills && skillRows.length
    ? `<section><h2 class="cv-h">${esc(skills.title)}</h2>${skillRows.map((r) =>
      `<div class="cv-sg"><p class="cv-sl">${esc(r.label)}</p><p class="cv-sv">${chipNames(r.chips).join(', ')}</p></div>`).join('')}</section>` : '') +
    (langRow ? `<section><h2 class="cv-h">${esc(langRow.label)}</h2><p class="cv-sv">${chipNames(langRow.chips).join(' · ')}</p></section>` : '');

  const main1 = exp
    ? `<section><h2 class="cv-h"><span class="k">${num()}</span>${esc(exp.title)}</h2>${exp.entries.map((e) => entry(e, gh, cfg)).join('')}</section>` : '';

  const intro = String(c.hero.intro);
  const page1 = `<article class="cv-page" aria-label="${esc(c.ui.cv)}, 1 / 2">
      <header class="cv-head">
        <div><h1 class="cv-name">Florian<br>Grolleau</h1>
          <p class="cv-role">${esc(roleA.trim())}<span class="b">${esc(roleB.join('·').trim())}</span></p></div>
        <p class="cv-contact">${status ? `<span class="cv-status">${esc(status[1])}</span>` : ''}` +
    `<a class="m" href="mailto:${esc(cfg.email)}">${esc(cfg.email)}</a>` +
    `<a href="${esc(cfg.github)}">${esc(cfg.githubLabel)}</a>` +
    `<a href="${esc(cfg.linkedin)}">${esc(bare(cfg.linkedin))}</a>` +
    `${now ? `<span>${compounds(now[1])}</span>` : ''}</p>
      </header>
      <p class="cv-intro">${intro}</p>
      <div class="cv-body"><aside class="cv-side">${side1}</aside><div class="cv-main">${main1}</div></div>
      ${foot(c, 1, cfg)}
    </article>`;

  const side2 = (prose
    ? `<section><h2 class="cv-h">${esc(prose.title)}</h2>${prose.blocks.map((b) =>
      `<div class="cv-sg"><p class="cv-sl">${esc((b.meta || [])[0] || '')}</p><p class="cv-sv">${b.body}</p></div>`).join('')}</section>` : '') +
    (orgs
      ? `<section><h2 class="cv-h">${esc(orgs.title)}</h2>${orgs.groups.filter((g) => g.items.length).map((g) =>
        `<div class="cv-sg"><p class="cv-sl">${esc(g.label)}</p><p class="cv-orgs">${g.items.map((o) => esc(o[lang] || o.fr || o.name)).join(', ')}</p></div>`).join('')}</section>` : '');

  // Formation avant Projets : les numéros suivent l'ordre de lecture (02, 03).
  const eduHTML = edu
    ? `<section><h2 class="cv-h"><span class="k">${num()}</span>${esc(edu.title)}</h2>${edu.entries.map((e) => entry(e, gh, cfg)).join('')}</section>` : '';
  let n = 0;
  const projHTML = projects
    ? `<section><h2 class="cv-h"><span class="k">${num()}</span>${esc(projects.title)}</h2>${projects.groups.filter((g) => g.items.length).map((g) =>
      `<div class="cv-pg"><p class="cv-pl">${esc(g.label)}</p>${g.items.map((p) => {
        n += 1;
        const missing = gh && gh.repos && gh.repos[p.repo] && gh.repos[p.repo].missing;
        const path = missing ? c.ui.privateRepo : 'github.com/' + p.repo;
        return `<div class="cv-p"><span class="n">${pad2(n)}</span><span class="t">${esc(p.title)}</span><span class="l">${esc(p.lang)}</span><span class="s">${esc(path)}</span></div>`;
      }).join('')}</div>`).join('')}</section>` : '';

  const nowText = now ? ` · ${esc(now[1])}` : '';
  const page2 = `<article class="cv-page" aria-label="${esc(c.ui.cv)}, 2 / 2">
      <header class="cv-mini"><span class="n">Florian Grolleau</span><span class="r">${esc(cfg.email)}${nowText}</span></header>
      <div class="cv-body"><aside class="cv-side">${side2}</aside><div class="cv-main">${eduHTML}${projHTML}</div></div>
      ${foot(c, 2, cfg)}
    </article>`;

  root.classList.add('cv');
  root.classList.remove('tight');
  root.lang = lang;
  root.innerHTML = page1 + '<div class="cv-gap" aria-hidden="true"></div>' + page2;
  fit(root);
}

// Une colonne qui dépasse sa page : texte des entrées à 11 px (8.2).
export function fit(root) {
  const over = () => Array.from(root.querySelectorAll('.cv-body')).some((b) => {
    const limit = b.getBoundingClientRect().bottom;
    return Array.from(b.children).some((col) => col.getBoundingClientRect().top + col.scrollHeight > limit + 1);
  });
  if (over()) root.classList.add('tight');
  return !over();
}
