/* =========================================================================
   app.js
   Rendu du contenu, sommaire actif, bascule FR/EN et thème clair/sombre.
   Aucune dépendance externe.
   ========================================================================= */

(function () {
  'use strict';

  const main = document.getElementById('main');
  const toc = document.getElementById('toc');
  const langSwitch = document.getElementById('lang-switch');
  const themeBtn = document.getElementById('theme-btn');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ------------------------------- langue ------------------------------- */

  function initialLang() {
    const url = new URLSearchParams(location.search).get('lang');
    if (url === 'fr' || url === 'en') return url;
    const saved = store.get('fg-lang');
    if (saved === 'fr' || saved === 'en') return saved;
    return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  }

  let lang = initialLang();

  /* ------------------------------- gabarits ------------------------------ */

  const metaList = (items, cls) =>
    `<div class="meta ${cls || ''}">${items.map((m) => `<span>${m}</span>`).join('')}</div>`;

  const chips = (items) =>
    `<ul class="chips">${items.map((c) => `<li>${c}</li>`).join('')}</ul>`;

  function heroBlock(c) {
    const rows = c.hero.meta
      .map(([k, v]) => `<div class="kv"><dt>${k}</dt><dd>${v}</dd></div>`)
      .join('');
    return `
      <header class="hero row" id="top">
        <div class="row__head">
          <img class="hero__avatar" src="${CONFIG.photo}" alt="" onerror="this.remove()">
          <h1 class="hero__name">Florian Grolleau</h1>
          <p class="hero__role">${c.hero.role}</p>
        </div>
        <dl class="row__meta kv-list">${rows}</dl>
        <div class="row__body">
          <p class="hero__intro">${c.hero.intro}</p>
        </div>
      </header>`;
  }

  function entryBlock(e) {
    return `
      <article class="row row--entry">
        <div class="row__head">
          <h3 class="row__title">${e.title}</h3>
          ${e.sub ? `<p class="row__sub">${e.sub}</p>` : ''}
        </div>
        ${metaList(e.meta, 'row__meta')}
        <div class="row__body">
          <p>${e.body}</p>
          ${e.tags ? chips(e.tags) : ''}
        </div>
      </article>`;
  }

  function projectGroup(g) {
    const items = g.items
      .map((p) => {
        const inner = `<span class="proj__title">${p.title}</span><span class="proj__lang">${p.lang}</span>`;
        return p.url
          ? `<li class="proj"><a href="${p.url}" target="_blank" rel="noopener">${inner}</a></li>`
          : `<li class="proj">${inner}</li>`;
      })
      .join('');
    return `
      <div class="row">
        ${metaList([g.label], 'row__meta')}
        <ul class="row__body proj-list">${items}</ul>
      </div>`;
  }

  function skillRow(r) {
    return `
      <div class="row">
        ${metaList([r.label], 'row__meta')}
        <div class="row__body">${chips(r.chips)}</div>
      </div>`;
  }

  function proseBlock(b) {
    return `
      <div class="row">
        ${metaList(b.meta, 'row__meta')}
        <div class="row__body"><p>${b.body}</p></div>
      </div>`;
  }

  function contactBlock(s, c) {
    return `
      <div class="row">
        ${metaList([lang === 'fr' ? 'Écrire' : 'Get in touch'], 'row__meta')}
        <div class="row__body">
          <p>${s.body}</p>
          <ul class="links">
            <li>
              <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>
              <button type="button" class="copy" data-copy="${CONFIG.email}"
                      data-label="${c.ui.copy}" data-done="${c.ui.copied}">${c.ui.copy}</button>
            </li>
            <li><a href="${CONFIG.github}" target="_blank" rel="noopener">${CONFIG.githubLabel}</a></li>
            <li><a href="${CONFIG.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
          </ul>
        </div>
      </div>`;
  }

  function sectionBlock(s, c) {
    let inner = '';
    if (s.kind === 'entries') inner = s.entries.map(entryBlock).join('');
    if (s.kind === 'projects') inner = s.groups.map(projectGroup).join('');
    if (s.kind === 'skills') inner = s.rows.map(skillRow).join('');
    if (s.kind === 'prose') inner = s.blocks.map(proseBlock).join('');
    if (s.kind === 'contact') inner = contactBlock(s, c);
    return `
      <section class="section" id="${s.id}">
        <h2 class="section__title">${s.title}</h2>
        ${s.note ? `<p class="section__note">${s.note}</p>` : ''}
        ${inner}
      </section>`;
  }

  function countOf(s) {
    if (s.kind === 'entries') return s.entries.length;
    if (s.kind === 'projects') return s.groups.reduce((n, g) => n + g.items.length, 0);
    return null;
  }

  /* -------------------------------- rendu -------------------------------- */

  function render() {
    const c = CONTENT[lang];

    document.documentElement.lang = lang;
    document.title = c.docTitle;
    document.getElementById('meta-description').setAttribute('content', c.description);
    themeBtn.setAttribute('aria-label', c.ui.themeLabel);

    main.innerHTML =
      heroBlock(c) +
      c.sections.map((s) => sectionBlock(s, c)).join('') +
      `<footer class="footer">
         <span>© ${new Date().getFullYear()} Florian Grolleau</span>
         <span>${lang === 'fr' ? 'Site statique, sans traceur' : 'Static site, no trackers'}</span>
       </footer>`;

    toc.innerHTML =
      `<p class="rail__label">${c.ui.toc}</p>` +
      c.sections
        .map((s) => {
          const n = countOf(s);
          return `<a href="#${s.id}" data-id="${s.id}">
                    <span>${s.title}</span>${n ? `<span class="rail__count">${n}</span>` : ''}
                  </a>`;
        })
        .join('');

    langSwitch.querySelectorAll('.switch__btn').forEach((b) => {
      const on = b.dataset.lang === lang;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on);
    });

    tocLinks = Array.from(toc.querySelectorAll('a'));
    sections = c.sections.map((s) => document.getElementById(s.id));
    spy();
  }

  /* ----------------------------- sommaire actif --------------------------- */

  let tocLinks = [];
  let sections = [];
  let ticking = false;

  function spy() {
    let active = null;
    for (const el of sections) {
      if (el && el.getBoundingClientRect().top <= 140) active = el.id;
    }
    tocLinks.forEach((a) => a.classList.toggle('is-active', a.dataset.id === active));
  }

  addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        spy();
        ticking = false;
      });
    },
    { passive: true }
  );

  /* ------------------------------ interactions ---------------------------- */

  langSwitch.addEventListener('click', (e) => {
    const btn = e.target.closest('.switch__btn');
    if (!btn || btn.dataset.lang === lang) return;
    const anchor = tocLinks.find((a) => a.classList.contains('is-active'));
    lang = btn.dataset.lang;
    store.set('fg-lang', lang);
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
    render();
    if (anchor) {
      const target = document.getElementById(anchor.dataset.id);
      if (target && target.scrollIntoView) target.scrollIntoView({ block: 'start' });
    }
  });

  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    store.set('fg-theme', next);
  });

  main.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy');
    if (!btn) return;
    const write = navigator.clipboard
      ? navigator.clipboard.writeText(btn.dataset.copy)
      : Promise.reject();
    write
      .then(() => {
        btn.textContent = btn.dataset.done;
        btn.classList.add('is-done');
        setTimeout(() => {
          btn.textContent = btn.dataset.label;
          btn.classList.remove('is-done');
        }, 1600);
      })
      .catch(() => {});
  });

  render();
})();
