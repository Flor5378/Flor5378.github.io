/* =========================================================================
   app.js
   Rendu FR/EN depuis content.js, barre et navigation, accueil, thème,
   langue, espion de section. Aucune dépendance externe.
   ========================================================================= */

import { reducedMotion, liquidBlob, navPill, glide, springHeight } from './motion.js';

const root = document.documentElement;
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};

/* ------------------------------- utilitaires ------------------------------ */

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const pad2 = (n) => String(n).padStart(2, '0');

const ARROW = '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6.5 5H11v4.5"/></svg>';
const PIN = '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s4.5-4.2 4.5-7.6a4.5 4.5 0 0 0-9 0c0 3.4 4.5 7.6 4.5 7.6z"/><circle cx="8" cy="6.9" r="1.6"/></svg>';

// Un nom composé ne se coupe jamais à ses traits d'union : les espaces
// restent les seuls points de coupure (passation 2.2, règle 4 ; annexe H).
const keepCompounds = (text) => String(text || '').split(' ')
  .map((w) => `<span class="nb">${esc(w)}</span>`).join(' ');

// Courriel : coupure prioritaire après « @ » (annexe H).
const mailHTML = (email) => {
  const at = email.indexOf('@');
  return `${esc(email.slice(0, at + 1))}<wbr>${esc(email.slice(at + 1))}`;
};

const fine = () => typeof matchMedia === 'function' && matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ------------------------------ logos, initiales ----------------------------- */

// Sigle entre parenthèses, mot court gardé tel quel, sinon trois initiales (7.5).
function initials(name) {
  const acronym = String(name).match(/\(([A-ZÀ-Ý0-9&]{2,6})\)/);
  if (acronym) return acronym[1];
  // Parenthèses écartées aussi : « CY Tech (ex-EISTI) » donne CTE, pas « CT( ».
  const words = String(name).replace(/[’'()]/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    const g = Array.from(words[0]);
    return g.length <= 5 ? words[0] : g.slice(0, 2).join('').toUpperCase();
  }
  const stop = /^(de|du|des|la|le|les|l|d|et|en|à|au|aux|of|the|and|for|pour|sur|&)$/i;
  return words.filter((w) => !stop.test(w)).slice(0, 3).map((w) => Array.from(w)[0]).join('').toUpperCase();
}

// Fichier local d'abord, puis favicon du domaine, puis initiales (7.5).
const logoSrc = (v) => (!v ? null
  : v.startsWith('assets/') ? v
  : 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(v) + '&sz=128');

const FALLBACK = "this.parentNode.classList.replace('img','none');this.remove()";

// variant : 'row' (carré 56), 's40' (tuiles, intérêts) ou 'wide' (120 × 44).
function logoHTML(name, logo, short, variant) {
  const src = logoSrc(logo);
  const size = variant === 's40' ? ' s40' : variant === 'wide' ? ' wide' : '';
  const ini = `<span class="ini">${esc(short || initials(name))}</span>`;
  if (!src) return `<span class="v-logo${size} none" aria-hidden="true">${ini}</span>`;
  // Un logo local sans transparence a son propre fond : plein cadre dans une entrée.
  const cover = variant === 'row' && /\.(jpe?g|png)$/i.test(logo) && !/\/tech\//.test(logo) ? ' cover' : '';
  return `<span class="v-logo${size} img${cover}" aria-hidden="true">${ini}` +
    `<img src="${esc(src)}" alt="" loading="lazy" decoding="async" onerror="${FALLBACK}"></span>`;
}

// 'Nom|icone' : icône 14 px tirée de assets/logos/tech.
function tagHTML(str, cls) {
  const [name, icon] = String(str).split('|');
  const ico = icon
    ? `<img class="v-ico" src="assets/logos/tech/${esc(icon)}.svg" alt="" aria-hidden="true" loading="lazy" onerror="this.remove()">`
    : '';
  return `<li class="${cls}">${ico}${esc(name)}</li>`;
}

/* ------------------------------ données GitHub ------------------------------ */

let GH = null;   // assets/github.json, chargé après le premier affichage (7.4)
const repoMissing = (id) => !!(GH && GH.repos && GH.repos[id] && GH.repos[id].missing);
const repoHref = (id) => (repoMissing(id) ? CONFIG.github : 'https://github.com/' + id);

// Les liens de dépôt du texte deviennent des pastilles (3.5).
function repoLinks(html) {
  const box = document.createElement('div');
  box.innerHTML = html;
  box.querySelectorAll('a[data-repo]').forEach((a) => {
    a.className = 'v-repo';
    a.setAttribute('href', repoHref(a.dataset.repo));
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });
  return box.innerHTML;
}

/* --------------------------------- langue --------------------------------- */

function initialLang() {
  const url = new URLSearchParams(location.search).get('lang');
  if (url === 'fr' || url === 'en') return url;
  const saved = store.get('fg-lang');
  if (saved === 'fr' || saved === 'en') return saved;
  return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

let lang = initialLang();
const T = () => CONTENT[lang];

const STATUS = ['statut', 'status'];
const NOW = ['actuellement', 'currently'];
const metaRow = (labels) => T().hero.meta.find((m) => labels.includes(String(m[0]).toLowerCase()));

/* ---------------------------- sections affichées --------------------------- */

// Une section sans contenu est masquée et retirée de la navigation (3, règle 1).
function hasContent(s) {
  switch (s.kind) {
    case 'entries': return s.entries.length > 0;
    case 'projects':
    case 'orgs': return s.groups.some((g) => g.items.length > 0);
    case 'skills': return s.rows.length > 0;
    case 'prose': return s.blocks.length > 0;
    default: return true;
  }
}
const navSections = () => T().sections.filter(hasContent);

/* --------------------------------- accueil -------------------------------- */

function fillHero() {
  const c = T();
  const [roleA, ...rest] = String(c.hero.role).split('·');
  const status = metaRow(STATUS);
  const now = metaRow(NOW);

  $('#hero-kick').textContent = roleA.trim();
  $('#hero-status').innerHTML = status
    ? `<span class="v-live" aria-hidden="true"></span>${esc(status[1])}`
    : '';
  $('#hero-status').hidden = !status;
  $('#hero-role').innerHTML =
    `<span class="a">${esc(rest.join('·').trim())}</span>` +
    (now ? `<span class="b">${PIN}<span class="pl">${keepCompounds(now[1])}</span></span>` : '');
  $('#hero-ctas').innerHTML =
    `<a class="v-cta" href="mailto:${esc(CONFIG.email)}">${esc(c.ui.write)}${ARROW}</a>` +
    `<a class="v-ghost" href="${esc(CONFIG.github)}" target="_blank" rel="noopener">GitHub${ARROW}</a>` +
    `<a class="v-ghost" href="${esc(CONFIG.linkedin)}" target="_blank" rel="noopener">LinkedIn${ARROW}</a>`;
}

/* --------------------------------- feuilles -------------------------------- */

const sheetsEl = $('#sheets');
const ALT = new Set(['formation', 'projets', 'organisations']);
const sheets = new Map();   // id → <section>, créées une fois, remplies à chaque rendu

const sectionHead = (s, num, side = '') =>
  `<div class="v-head"><div><p class="v-num">${num}</p>` +
  `<h2 class="v-h2" id="v-h-${s.id}"><span class="in lx">${esc(s.title)}</span></h2></div>${side}</div>`;

function profileHTML() {
  const c = T();
  const meta = c.hero.meta.filter((m) => !STATUS.includes(String(m[0]).toLowerCase()));
  const intro = String(c.hero.intro).replace(/<mark>/g, '<mark class="v-mark">');
  return `<div class="v-in v-about-in">
      <div class="v-reveal" style="--i:0">
        <p class="v-k lx" style="--k:2">${esc(c.ui.profile)}</p>
        <dl class="v-meta">${meta.map((m, i) =>
          `<div><dt class="lx" style="--k:${i + 3}">${esc(m[0])}</dt><dd class="lx" style="--k:${i + 3}">${keepCompounds(m[1])}</dd></div>`).join('')}</dl>
        <button type="button" class="v-copy" data-copy aria-live="polite">${COPY_ICON}<span class="lbl">${mailHTML(CONFIG.email)}</span></button>
      </div>
      <p class="v-intro v-reveal lx" style="--i:1;--k:3">${intro}</p>
    </div>`;
}

function entryHTML(e, i) {
  const [period, place] = e.meta || [];
  const title = e.url
    ? `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.title)}${ARROW}</a>`
    : esc(e.title);
  const tags = e.tags && e.tags.length
    ? `<ul class="v-tags">${e.tags.map((t) => tagHTML(t, 'v-tag')).join('')}</ul>` : '';
  const pop = /data-repo=/.test(e.body || '')
    ? `<div class="v-pop" data-open="0" aria-hidden="true" id="pop-${popSeq++}"></div>` : '';
  return `<article class="v-row v-reveal" style="--i:${i}">
      <div class="v-w">${period ? `<p class="v-period">${esc(period)}</p>` : ''}${place ? `<p class="v-place lx" style="--k:2">${keepCompounds(place)}</p>` : ''}</div>
      <div class="v-o"><h3 class="v-org lx" style="--k:3">${title}</h3>${e.sub ? `<p class="v-sub lx" style="--k:4">${esc(e.sub)}</p>` : ''}</div>
      <div class="v-textc"><p class="v-body lx" style="--k:5">${repoLinks(e.body || '')}</p>${tags}${pop}</div>
      ${logoHTML(e.title, e.logo, e.short, 'row')}
    </article>`;
}
let popSeq = 0;

/* --------------------------------- projets --------------------------------- */

// Projet décrit dans content.js : titre, langue de rédaction et groupe (4.3, règle 1).
function projectInfo(id) {
  for (const s of T().sections) {
    if (s.kind !== 'projects') continue;
    for (const g of s.groups) {
      const it = g.items.find((p) => p.repo === id);
      if (it) return { title: it.title, lng: it.lang, group: g.label };
    }
  }
  return null;
}

const LANG_COLORS = { Python: '#3572A5', 'Jupyter Notebook': '#DA5B0B', R: '#198CE7', SQL: '#8A7F7A' };

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
}

// Un même contenu pour le panneau, le popover et la feuille basse (4.3).
// where : 'panel' (blocs en cascade), 'pop' ou 'sheet'.
function previewHTML(id, where) {
  const c = T();
  const info = projectInfo(id);
  const slug = id.split('/').pop();
  const title = info ? info.title : slug;
  const sw = (j) => (where === 'panel' ? ` v-swap" style="--j:${j}` : '');
  const kicker = `GitHub · Flor5378${where !== 'pop' && info ? ' · ' + info.group : ''}`;
  let html = `<p class="v-gk${sw(0)}">${esc(kicker)}</p>` +
    `<p class="v-gt${sw(1)}"${where === 'sheet' ? ' tabindex="-1" data-sheet-title' : ''}>${esc(title)}</p>` +
    (info ? `<p class="v-gk v-slug${sw(1)}">${esc(slug)}</p>` : '');

  if (!GH) {   // chargement
    return html + `<div class="v-skels${sw(2)}" aria-hidden="true"><span class="v-skel" style="width:92%"></span><span class="v-skel" style="width:58%"></span></div>` +
      `<p class="v-gm${sw(3)}" aria-hidden="true"><span class="v-skel v-skel-chip" style="width:96px"></span><span class="v-skel v-skel-chip" style="width:150px"></span></p>`;
  }
  const g = GH.repos && GH.repos[id];
  const ok = !!(g && !g.missing);
  const desc = ok ? (g.description || c.ui.noDesc) : c.ui.missing;
  html += `<p class="v-gd${ok && g.description ? '' : ' none'}${sw(2)}">${esc(desc)}</p>`;
  if (ok) {
    const date = fmtDate(g.pushedAt);
    const chips = [];
    if (g.language) chips.push(`<span class="v-gchip"><span class="v-ldot" style="background:${LANG_COLORS[g.language] || 'var(--on-wine-2)'}" aria-hidden="true"></span>${esc(g.language)}</span>`);
    if (date) chips.push(`<span class="v-gchip">${esc(c.ui.updated)} ${esc(date)}</span>`);
    if (where === 'panel' && info && info.lng) chips.push(`<span class="v-gchip">${esc(c.ui.writtenIn)} ${esc(info.lng)}</span>`);
    if (chips.length) html += `<p class="v-gm${sw(3)}">${chips.join('')}</p>`;
  }
  const href = ok ? 'https://github.com/' + id : CONFIG.github;
  const cta = ok ? c.ui.openRepo : c.ui.profileGh;
  if (where === 'sheet') {
    return html + `<div class="v-sheet-acts"><a class="v-cta" href="${esc(href)}" target="_blank" rel="noopener">${esc(cta)}${ARROW}</a>` +
      `<button type="button" class="v-chipbtn" data-sheet-close>${esc(c.ui.close)}</button></div>`;
  }
  const tab = where === 'pop' ? ' tabindex="-1"' : '';
  return html + `<a class="v-ga${sw(4)}" href="${esc(href)}" target="_blank" rel="noopener"${tab}>${esc(cta)}${ARROW}</a>`;
}

function projectsHTML(s, num) {
  const c = T();
  let n = 0;
  const groups = s.groups.filter((g) => g.items.length).map((g, gi) =>
    `<div class="v-group v-reveal" style="--i:${gi}">
        <p class="v-glabel lx" style="--k:3">${esc(g.label)}<span class="c">${g.items.length}</span></p>
        ${g.items.map((p) => {
          n += 1;
          return `<a class="v-prow${p.repo === selId ? ' sel' : ''}" href="${esc(repoHref(p.repo))}" target="_blank" rel="noopener" data-proj="${esc(p.repo)}">` +
            `<span class="n">${pad2(n)}</span><span class="t lx" style="--k:4">${esc(p.title)}</span><span class="l">${esc(p.lang)}</span>${ARROW}</a>`;
        }).join('')}
      </div>`).join('');
  const note = s.note
    ? `<p class="v-note lx" style="--k:2"><span class="hover">${esc(s.note)}</span><span class="touch">${esc(c.ui.noteTouch)}</span></p>` : '';
  return `<div class="v-in">${sectionHead(s, num, note)}
      <div class="v-proj">
        <div class="v-list" data-list="projets"><span class="v-glide" aria-hidden="true"></span>${groups}</div>
        <div class="v-panelW v-reveal" style="--i:${s.groups.length}">
          <div class="v-panel" data-k="${panelK}" aria-live="polite"><div class="v-panel-in">${panelInner()}</div></div>
        </div>
      </div>
    </div>`;
}

let selId = null;     // projet affiché dans le panneau
let panelK = 'a';     // alterné à chaque changement pour rejouer la cascade

function panelInner() {
  if (selId) return previewHTML(selId, 'panel');
  const s = T().sections.find((x) => x.kind === 'projects');
  return `<div class="v-panel-empty"><p class="v-gk v-swap" style="--j:0">GitHub · Flor5378</p>` +
    `<p class="big v-swap" style="--j:1">${esc(s ? s.note : '')}</p>` +
    `<span class="v-ghostrow v-swap" style="--j:2" aria-hidden="true"><span></span><span></span><span></span></span></div>`;
}

// Hauteur du panneau à ressort (0,42 s, ζ 0,9), réglée sur le contenu mesuré.
let panelHeight = null;
let panelEl = null;
function refreshPanel(animate) {
  const panel = $('.v-panel');
  if (!panel) return;
  if (panel !== panelEl) {
    panelEl = panel;
    panelHeight = springHeight(panel, 'panel');
  }
  if (animate) panelK = panelK === 'a' ? 'b' : 'a';
  panel.dataset.k = panelK;
  $('.v-panel-in', panel).innerHTML = panelInner();
  const h = $('.v-panel-in', panel).offsetHeight;
  if (animate) panelHeight(h);
  else panel.style.height = '';
}

function selectProject(row) {
  const id = row.dataset.proj;
  if (id === selId) return;
  selId = id;
  $$('.v-prow').forEach((r) => r.classList.toggle('sel', r === row));
  refreshPanel(true);
}

// Survol et focus remplissent le panneau ; la sélection reste au départ du pointeur.
document.addEventListener('mouseover', (e) => {
  if (!fine()) return;
  const row = e.target.closest('.v-prow');
  if (row) selectProject(row);
});
document.addEventListener('focusin', (e) => {
  const row = e.target.closest('.v-prow');
  if (!row) return;
  selectProject(row);
  // Surbrillance au clavier seulement : aucun état de survol au toucher (6.3).
  if (row.matches(':focus-visible')) glideTo(row);
});

const narrow = () => matchMedia('(max-width: 980px)').matches;
const coarse = () => matchMedia('(hover: none), (pointer: coarse)').matches;

document.addEventListener('click', (e) => {
  const row = e.target.closest('.v-prow');
  if (!row) return;
  if (narrow()) {   // sous 980 px : la feuille basse remplace le panneau
    e.preventDefault();
    openSheet(row.dataset.proj, row);
    return;
  }
  // Tablette tactile : premier appui pour l'aperçu, second pour le dépôt.
  if (coarse() && !row.classList.contains('sel')) {
    e.preventDefault();
    selectProject(row);
  }
});

/* ------------------------------ popover de dépôt ----------------------------- */

const pop = { link: null, openT: 0, closeT: 0, lastClose: 0 };

// Placement de l'annexe F : sous la dernière ligne du lien, ou au-dessus de la
// première quand un autre lien de dépôt suit dans le même paragraphe.
function placePopover(link, host) {
  const rects = link.getClientRects();
  const hr = host.getBoundingClientRect();
  const links = $$('[data-repo]', host);
  const up = links.indexOf(link) < links.length - 1;
  const first = rects[0], last = rects[rects.length - 1];
  const anchor = up ? first : last;
  return {
    up,
    left: Math.max(0, Math.min(anchor.left - hr.left, hr.width - 380)),
    top: up ? first.top - hr.top - 10 : last.bottom - hr.top + 10
  };
}

function showPop(link) {
  const host = link.closest('.v-textc');
  const card = host && $('.v-pop', host);
  if (!card) return;
  if (pop.link && pop.link !== link) unmarkLink(pop.link);
  pop.link = link;
  const pos = placePopover(link, host);
  card.innerHTML = previewHTML(link.dataset.repo, 'pop');
  $('.v-ga', card).removeAttribute('tabindex');
  card.classList.toggle('up', pos.up);
  card.style.left = `${Math.round(pos.left)}px`;
  card.style.top = `${Math.round(pos.top)}px`;
  card.setAttribute('aria-hidden', 'false');
  link.classList.add('on');
  link.setAttribute('aria-describedby', card.id);
  requestAnimationFrame(() => { card.dataset.open = '1'; });
}

function unmarkLink(link) {
  link.classList.remove('on');
  link.removeAttribute('aria-describedby');
}

function hidePop() {
  clearTimeout(pop.openT);
  clearTimeout(pop.closeT);
  if (!pop.link) return;
  const card = $('.v-pop', pop.link.closest('.v-textc'));
  unmarkLink(pop.link);
  pop.link = null;
  pop.lastClose = Date.now();
  if (!card) return;
  card.dataset.open = '0';
  card.setAttribute('aria-hidden', 'true');
  const ga = $('.v-ga', card);
  if (ga) ga.setAttribute('tabindex', '-1');
}

// Intention : 160 ms, immédiat si un aperçu est ouvert ou fermé depuis moins de 500 ms.
function wantPop(link, now) {
  clearTimeout(pop.closeT);
  clearTimeout(pop.openT);
  if (pop.link === link) return;
  const quick = now || pop.link || Date.now() - pop.lastClose < 500;
  pop.openT = setTimeout(() => showPop(link), quick ? 0 : 160);
}
function leavePop() {
  clearTimeout(pop.openT);
  clearTimeout(pop.closeT);
  pop.closeT = setTimeout(hidePop, 150);
}

document.addEventListener('mouseover', (e) => {
  if (!fine()) return;
  const link = e.target.closest('.v-repo');
  if (link) wantPop(link);
  else if (e.target.closest('.v-pop')) clearTimeout(pop.closeT);
});
document.addEventListener('mouseout', (e) => {
  if (!fine() || !pop.link && !pop.openT) return;
  const from = e.target.closest('.v-repo, .v-pop');
  const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.v-repo, .v-pop');
  if (from && from !== to) leavePop();
});
document.addEventListener('focusin', (e) => {
  const link = e.target.closest('.v-repo');
  if (link) wantPop(link);
  else if (e.target.closest('.v-pop')) clearTimeout(pop.closeT);
});
document.addEventListener('focusout', (e) => {
  if (!e.target.closest('.v-repo, .v-pop')) return;
  const to = e.relatedTarget;
  if (to && to.closest && to.closest('.v-pop, .v-repo')) return;
  leavePop();
});
document.addEventListener('click', (e) => {
  const link = e.target.closest('.v-repo');
  if (!link) return;
  if (narrow()) {
    e.preventDefault();
    openSheet(link.dataset.repo, link);
    return;
  }
  // Toucher au-dessus de 980 px : premier appui pour l'aperçu, second pour le lien.
  if (coarse() && pop.link !== link) {
    e.preventDefault();
    wantPop(link, true);
  }
});
// Un appui ailleurs ferme l'aperçu.
document.addEventListener('pointerdown', (e) => {
  if (pop.link && !e.target.closest('.v-pop, .v-repo')) hidePop();
});

/* -------------------------------- feuille basse ------------------------------ */

const sheetEl = $('#psheet');
const scrimEl = $('#scrim');
const sheet = { id: null, trigger: null, drag: null };

// Pendant une fenêtre modale, le reste de la page est inerte (6.1, règle 4).
function setInert(on) {
  ['#skip', '#bar', '#main'].forEach((sel) => { $(sel).inert = on; });
}

function fillSheet(id) {
  $('#psheet-in').innerHTML = previewHTML(id, 'sheet');
}

function openSheet(id, trigger) {
  hidePop();
  sheet.id = id;
  sheet.trigger = trigger;
  fillSheet(id);
  sheetEl.setAttribute('aria-label', T().ui.sheetLabel);
  sheetEl.setAttribute('aria-hidden', 'false');
  sheetEl.dataset.open = '1';
  scrimEl.dataset.open = '1';
  setInert(true);
  const title = $('[data-sheet-title]', sheetEl);
  if (title) title.focus({ preventScroll: true });
}

function closeSheet() {
  if (!sheet.id) return;
  sheet.id = null;
  sheetEl.dataset.open = '0';
  sheetEl.setAttribute('aria-hidden', 'true');
  scrimEl.dataset.open = '0';
  setInert(false);
  if (sheet.trigger && sheet.trigger.isConnected) sheet.trigger.focus({ preventScroll: true });
  sheet.trigger = null;
}

scrimEl.addEventListener('click', closeSheet);
sheetEl.addEventListener('click', (e) => { if (e.target.closest('[data-sheet-close]')) closeSheet(); });

// Glisser pour fermer, avec résistance vers le haut (5.6, annexe G).
sheetEl.addEventListener('pointerdown', (e) => {
  if (!sheet.id || e.target.closest('a, button')) return;
  sheet.drag = { id: e.pointerId, y0: e.clientY, dy: 0, samples: [[performance.now(), e.clientY]] };
  sheetEl.setPointerCapture(e.pointerId);
});
sheetEl.addEventListener('pointermove', (e) => {
  const d = sheet.drag;
  if (!d || e.pointerId !== d.id) return;
  let dy = e.clientY - d.y0;
  if (dy < 0) { const u = -dy; dy = -(u * 40) / (40 + u); }
  d.dy = dy;
  d.samples.push([performance.now(), e.clientY]);
  sheetEl.style.transition = 'none';
  sheetEl.style.transform = `translateY(${dy.toFixed(1)}px)`;
});
function endDrag() {
  const d = sheet.drag;
  if (!d) return;
  sheet.drag = null;
  const now = performance.now();
  const recent = d.samples.filter(([t]) => now - t < 100);
  const [t0, y0] = recent[0] || d.samples[0];
  const v = (d.samples[d.samples.length - 1][1] - y0) / Math.max(1, now - t0);   // px/ms sur 100 ms
  sheetEl.style.transition = '';
  sheetEl.style.transform = '';
  if (d.dy > 120 || (v > 0.11 && d.dy > 12)) closeSheet();
}
sheetEl.addEventListener('pointerup', endDrag);
sheetEl.addEventListener('pointercancel', endDrag);

// Focus piégé dans une fenêtre modale ouverte.
function trapFocus(e, box) {
  const items = $$('a[href], button:not([disabled]), [tabindex="0"]', box).filter((el) => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && (document.activeElement === first || !box.contains(document.activeElement))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/* ------------------------------ données GitHub ------------------------------ */

// Chargées une fois, après le premier affichage (7.4). Fichier introuvable :
// état « Indisponible » partout, liens conservés.
function loadGitHub() {
  fetch('assets/github.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
    .then((data) => { GH = data && data.repos ? data : { repos: {} }; })
    .catch(() => { GH = { repos: {}, failed: true }; })
    .then(() => {
      $$('.v-repo, .v-prow').forEach((a) => {
        const id = a.dataset.repo || a.dataset.proj;
        a.setAttribute('href', repoHref(id));
      });
      refreshPanel(!!selId);
      if (pop.link) showPop(pop.link);
      if (sheet.id) fillSheet(sheet.id);
    });
}

function entriesHTML(s, num) {
  return `<div class="v-in">${sectionHead(s, num)}
      <div class="v-list" data-list="${s.id}"><span class="v-glide" aria-hidden="true"></span>${s.entries.map(entryHTML).join('')}</div>
    </div>`;
}

const KINDS = { entries: entriesHTML, projects: (s, num) => projectsHTML(s, num) };

// Feuilles créées une fois (l'état « vue » et l'observateur y restent attachés).
function ensureSheets() {
  if (sheets.size) return;
  const profile = document.createElement('section');
  profile.className = 'v-sheet after-hero';
  profile.dataset.key = 'profil';
  sheetsEl.append(profile);
  sheets.set('profil', profile);
  T().sections.forEach((s) => {
    const el = document.createElement('section');
    el.id = s.id;
    el.className = 'v-sheet' + (ALT.has(s.id) ? ' alt' : '') + (s.kind === 'contact' ? ' v-contact' : '');
    el.setAttribute('aria-labelledby', `v-h-${s.id}`);
    sheetsEl.append(el);
    sheets.set(s.id, el);
  });
}

function fillSheets() {
  ensureSheets();
  const profile = sheets.get('profil');
  profile.setAttribute('aria-label', T().ui.profile);
  profile.innerHTML = profileHTML();
  const shown = navSections();
  T().sections.forEach((s) => {
    const el = sheets.get(s.id);
    const i = shown.indexOf(s);
    const build = KINDS[s.kind];
    el.hidden = i < 0 || !build;
    el.innerHTML = el.hidden ? '' : build(s, pad2(i + 1));
  });
  glides.clear();
  pop.link = null;
  panelEl = null;
  refreshPanel(false);
}

// Arrivée des feuilles : 4 % visible, une seule fois (5.2, 5.10).
const seenIO = typeof IntersectionObserver === 'function'
  ? new IntersectionObserver((list) => {
    list.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.dataset.seen = '1';
      seenIO.unobserve(en.target);
    });
  }, { threshold: 0.04 })
  : null;

function watchSheets() {
  sheets.forEach((el) => {
    if (el.dataset.seen) return;
    if (seenIO) seenIO.observe(el);
    else el.dataset.seen = '1';
  });
}

// Avant un nouveau rendu : une feuille déjà vue s'affiche sans rejouer son arrivée.
function settleSheets() {
  sheets.forEach((el) => { if (el.dataset.seen === '1') el.dataset.seen = '2'; });
}

/* -------------------------- surbrillance glissante -------------------------- */

const glides = new Map();   // liste → fonction de déplacement à ressort

function glideTo(row) {
  const list = row.closest('.v-list');
  if (!list) return;
  let to = glides.get(list);
  if (!to) {
    to = glide($('.v-glide', list), 'glide-' + list.dataset.list);
    glides.set(list, to);
  }
  const lr = list.getBoundingClientRect();
  const rr = row.getBoundingClientRect();
  const first = list.dataset.glide !== '1';
  to(rr.top - lr.top, rr.height, first);
  list.dataset.glide = '1';
}

document.addEventListener('mouseover', (e) => {
  if (!fine()) return;
  const row = e.target.closest('.v-row, .v-prow');
  if (row) glideTo(row);
});
document.addEventListener('mouseout', (e) => {
  const list = e.target.closest('.v-list');
  if (list && !list.contains(e.relatedTarget)) list.dataset.glide = '0';
});

/* ---------------------------------- copier --------------------------------- */

const COPY_ICON = '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 5.5h7v7h-7zM3.5 10.5v-7h7"/></svg>';
let copyTimer = 0;

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  try {
    const p = navigator.clipboard && navigator.clipboard.writeText(CONFIG.email);
    if (p && p.catch) p.catch(() => {});
  } catch (err) {}
  const restore = () => $$('[data-copy]').forEach((b) => {
    $('.lbl', b).outerHTML = `<span class="lbl">${b.classList.contains('v-copy') ? mailHTML(CONFIG.email) : esc(T().ui.copy)}</span>`;
  });
  $('.lbl', btn).outerHTML = `<span class="lbl">${esc(T().ui.copied)}</span>`;
  clearTimeout(copyTimer);
  copyTimer = setTimeout(restore, 1800);
});

/* ---------------------------------- barre --------------------------------- */

const bar = $('#bar');
const nav = $('#nav');
const where = $('#where');
const pillTo = navPill($('#navpill'));
let activeId = '';
let hoverId = '';
let pillShown = false;

function fillNav() {
  const items = navSections().map((s, i) =>
    `<a href="#${s.id}" data-id="${s.id}" class="lx" style="--k:${i}">${esc(s.navTitle || s.title)}</a>`);
  $$('a', nav).forEach((a) => a.remove());
  nav.insertAdjacentHTML('beforeend', items.join(''));
  nav.setAttribute('aria-label', T().ui.toc);
}

// Pilule : section lue en bordeaux, item survolé en gris (5.3).
function paintNav(jump) {
  const links = $$('a', nav);
  links.forEach((a) => {
    if (a.dataset.id === activeId) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
  const target = links.find((a) => a.dataset.id === (hoverId || activeId));
  nav.dataset.pill = target ? '1' : '0';
  nav.dataset.hover = hoverId && hoverId !== activeId ? '1' : '0';
  if (!target) return;
  pillTo(target, jump || !pillShown);
  pillShown = true;
}

/* --------------------------------- menu ---------------------------------- */

const menuEl = $('#menu');
const menuBtn = $('#menu-btn');
const mscrimEl = $('#mscrim');
const menuOpen = () => menuEl.dataset.open === '1';

function fillMenu() {
  const c = T();
  menuEl.setAttribute('aria-label', c.ui.toc);
  $('#menu-nav').setAttribute('aria-label', c.ui.toc);
  $('#menu-close').setAttribute('aria-label', c.ui.close);
  const tab = menuOpen() ? '' : ' tabindex="-1"';
  $('#menu-nav').innerHTML = navSections().map((s, i) =>
    `<a href="#${s.id}" data-id="${s.id}" style="--k:${i}"${s.id === activeId ? ' aria-current="location"' : ''}${tab}>` +
    `<span class="n">${pad2(i + 1)}</span><span class="t">${esc(s.navTitle || s.title)}</span></a>`).join('');
}

// Le panneau naît du bouton Menu (clip-path, 5.6) ; focus sur Fermer à l'ouverture.
function openMenu() {
  hidePop();
  menuEl.dataset.open = '1';
  mscrimEl.dataset.open = '1';
  menuEl.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  $$('a', menuEl).forEach((a) => a.removeAttribute('tabindex'));
  setInert(true);
  $('#menu-close').focus({ preventScroll: true });
}

function closeMenu(returnFocus = true) {
  if (!menuOpen()) return;
  menuEl.dataset.open = '0';
  mscrimEl.dataset.open = '0';
  menuEl.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  $$('a', menuEl).forEach((a) => a.setAttribute('tabindex', '-1'));
  setInert(false);
  if (returnFocus) menuBtn.focus({ preventScroll: true });
}

menuBtn.addEventListener('click', openMenu);
$('#menu-close').addEventListener('click', () => closeMenu());
mscrimEl.addEventListener('click', () => closeMenu());
$('#menu-nav').addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(false); });

function fillWhere() {
  const list = navSections();
  const i = list.findIndex((s) => s.id === activeId);
  where.innerHTML = (i >= 0 ? `<span class="n">${pad2(i + 1)}</span>` : '') +
    `<span class="v-where-l"><span class="in">${esc(i >= 0 ? (list[i].navTitle || list[i].title) : T().ui.home)}</span></span>`;
}

nav.addEventListener('mouseover', (e) => {
  const a = e.target.closest('a[data-id]');
  if (!a || a.dataset.id === hoverId) return;
  hoverId = a.dataset.id;
  paintNav();
});
nav.addEventListener('mouseleave', () => {
  hoverId = '';
  paintNav();
});

/* ------------------------------ section lue ------------------------------- */

const line = () => Math.min(innerHeight * 0.4, 360);

function readSection() {
  let current = '';
  for (const s of navSections()) {
    const el = document.getElementById(s.id);
    if (el && !el.hidden && el.getBoundingClientRect().top < line()) current = s.id;
  }
  return current;
}

function setActive(id) {
  activeId = id;
  root.dataset.ssw = root.dataset.ssw === 'a' ? 'b' : 'a';
  paintNav();
  fillWhere();
  $$('a', $('#menu-nav')).forEach((a) => {
    if (a.dataset.id === id) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
}

/* ---------------------------- recul de l'accueil ---------------------------- */

const hero = $('#hero');
const dim = $('#dim');

function recede() {
  if (reducedMotion()) {
    hero.style.transform = '';
    dim.style.opacity = '';
    return;
  }
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
    const a = readSection();
    if (a !== activeId) setActive(a);
    recede();
  });
}, { passive: true });

/* ---------------------------------- thème --------------------------------- */

const themeBtns = () => $$('[data-theme-btn]');

function syncTheme() {
  const dark = root.dataset.theme === 'dark';
  themeBtns().forEach((b) => {
    b.setAttribute('aria-pressed', String(dark));
    b.setAttribute('aria-label', T().ui.themeLabel);
  });
}

function setTheme(next) {
  const apply = () => {
    root.dataset.theme = next;
    store.set('theme', next);
    $$('meta[name="theme-color"]').forEach((m) =>
      m.setAttribute('content', next === 'dark' ? '#170C0E' : '#F3EEE6'));
    syncTheme();
  };
  if (!reducedMotion() && document.startViewTransition) document.startViewTransition(apply);
  else apply();
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-theme-btn]')) setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

/* --------------------------------- rendu ---------------------------------- */

function fillUi() {
  const c = T();
  root.lang = lang;
  root.dataset.lang = lang;
  document.title = c.docTitle;
  $('#meta-description').setAttribute('content', c.description);
  $('#skip').textContent = c.ui.skip;
  $$('[data-ui]').forEach((el) => { el.textContent = c.ui[el.dataset.ui]; });
  $$('[data-lang-switch] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  syncTheme();
}

function render() {
  fillUi();
  fillHero();
  fillSheets();
  fillNav();
  fillMenu();
  fillWhere();
  paintNav(true);
}

// Changement de langue : la section lue reste au même endroit (annexe E).
function setLang(next) {
  if (next === lang) return;
  const anchor = activeId ? document.getElementById(activeId) : null;
  const top0 = anchor ? anchor.getBoundingClientRect().top : 0;
  lang = next;
  store.set('fg-lang', lang);
  const url = new URL(location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
  root.dataset.sw = root.dataset.sw === 'a' ? 'b' : 'a';
  settleSheets();
  render();
  if (anchor) {
    const d = anchor.getBoundingClientRect().top - top0;
    if (Math.abs(d) > 1) scrollBy({ top: d, behavior: 'instant' });
  }
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-lang-switch] button');
  if (b) setLang(b.dataset.lang);
});

/* -------------------------------- démarrage ------------------------------- */

function measureBar() {
  root.style.setProperty('--bar-h', `${bar.offsetHeight}px`);
}

render();
watchSheets();
measureBar();
liquidBlob(hero, $('#blob'));
activeId = readSection();
fillWhere();
paintNav(true);
recede();

addEventListener('resize', () => {
  measureBar();
  paintNav(true);
  if (sheet.id && !narrow()) closeSheet();
});

// Échap ferme, par priorité : menu, feuille basse, popover (6.1, règle 3).
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (menuOpen()) closeMenu();
    else if (sheet.id) closeSheet();
    else if (pop.link) hidePop();
    return;
  }
  if (e.key !== 'Tab') return;
  if (menuOpen()) trapFocus(e, $('#menu'));
  else if (sheet.id) trapFocus(e, sheetEl);
});

// Données GitHub chargées après le premier affichage.
requestAnimationFrame(() => setTimeout(loadGitHub, 0));

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    measureBar();
    paintNav(true);
  });
}
