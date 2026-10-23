/* =========================================================================
   app.js
   Rendu FR/EN depuis content.js, barre et navigation, accueil, thème,
   langue, espion de section. Aucune dépendance externe.
   ========================================================================= */

import { reducedMotion, liquidBlob, navPill } from './motion.js';

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
    if (el && el.getBoundingClientRect().top < line()) current = s.id;
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
