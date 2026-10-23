/* =========================================================================
   app.js
   Rendu FR/EN depuis content.js, barre et navigation, accueil, thème,
   langue, espion de section. Aucune dépendance externe.
   ========================================================================= */

import { reducedMotion, liquidBlob, navPill, glide } from './motion.js';

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
  return `<article class="v-row v-reveal" style="--i:${i}">
      <div class="v-w">${period ? `<p class="v-period">${esc(period)}</p>` : ''}${place ? `<p class="v-place lx" style="--k:2">${keepCompounds(place)}</p>` : ''}</div>
      <div class="v-o"><h3 class="v-org lx" style="--k:3">${title}</h3>${e.sub ? `<p class="v-sub lx" style="--k:4">${esc(e.sub)}</p>` : ''}</div>
      <div class="v-textc"><p class="v-body lx" style="--k:5">${repoLinks(e.body || '')}</p>${tags}</div>
      ${logoHTML(e.title, e.logo, e.short, 'row')}
    </article>`;
}

function entriesHTML(s, num) {
  return `<div class="v-in">${sectionHead(s, num)}
      <div class="v-list" data-list="${s.id}"><span class="v-glide" aria-hidden="true"></span>${s.entries.map(entryHTML).join('')}</div>
    </div>`;
}

const KINDS = { entries: entriesHTML };

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
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    measureBar();
    paintNav(true);
  });
}
