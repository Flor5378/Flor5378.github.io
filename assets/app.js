/* =========================================================================
   app.js
   Rendu du contenu, sommaire actif, bascule FR/EN, thème, aperçus GitHub.
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

  function initials(name) {
    const words = name
      .replace(/[’'(),.]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1 && !/^(de|du|des|la|le|les|of|the|and|et|for|pour|i|am)$/i.test(w));
    if (!words.length) return name.slice(0, 2).toUpperCase();
    if (words[0] === words[0].toUpperCase() && words[0].length <= 5) return words[0];
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return words.slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  }

  // 'exemple.fr' → favicon distant ; 'assets/...' → fichier local ; sinon rien.
  function logoSrc(v) {
    if (!v) return null;
    if (v.indexOf('/') !== -1) return v;
    return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(v) + '&sz=128';
  }

  function logoTile(name, logo, extra, short) {
    const src = logoSrc(logo);
    const img = src
      ? `<img src="${src}" alt="" loading="lazy" onerror="this.remove()">`
      : '';
    return `<span class="logo ${extra || ''}"><span class="logo__fallback">${short || initials(name)}</span>${img}</span>`;
  }

  function chip(str) {
    const parts = String(str).split('|');
    const icon = parts[1]
      ? `<img class="chip__icon" src="assets/logos/tech/${parts[1]}.svg" alt="" loading="lazy" onerror="this.remove()">`
      : '';
    return `<li class="chip">${icon}<span>${parts[0]}</span></li>`;
  }

  const chips = (items) => `<ul class="chips">${items.map(chip).join('')}</ul>`;

  const extLink = (url, inner, repo) =>
    `<a href="${url}" target="_blank" rel="noopener"${repo ? ` data-repo="${repo}"` : ''}>${inner}</a>`;

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
    const title = e.url ? extLink(e.url, e.title) : e.title;
    return `
      <article class="row row--entry">
        <div class="row__head">
          ${logoTile(e.title, e.logo, 'logo--entry', e.short)}
          <div>
            <h3 class="row__title">${title}</h3>
            ${e.sub ? `<p class="row__sub">${e.sub}</p>` : ''}
          </div>
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
        const url = p.url || (p.repo ? 'https://github.com/' + p.repo : null);
        return `<li class="proj">${url ? extLink(url, inner, p.repo) : inner}</li>`;
      })
      .join('');
    return `
      <div class="row">
        ${metaList([g.label], 'row__meta')}
        <ul class="row__body proj-list">${items}</ul>
      </div>`;
  }

  function orgGroup(g) {
    const items = g.items
      .map((o) => {
        const name = o[lang] || o.fr || o.name;
        const inner = `${logoTile(name, o.logo, '', o.short)}<span class="org__name">${name}</span>`;
        return `<li class="org">${o.url ? extLink(o.url, inner) : inner}</li>`;
      })
      .join('');
    return `
      <div class="row">
        ${metaList([g.label], 'row__meta')}
        <ul class="row__body org-grid">${items}</ul>
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
    const logos = b.logos
      ? `<ul class="logo-row">${b.logos
          .map((l) => {
            const inner = `${logoTile(l.name, l.logo, '', l.short)}<span class="org__name">${l.name}</span>`;
            return `<li class="org">${l.url ? extLink(l.url, inner) : inner}</li>`;
          })
          .join('')}</ul>`
      : '';
    return `
      <div class="row">
        ${metaList(b.meta, 'row__meta')}
        <div class="row__body"><p>${b.body}</p>${logos}</div>
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
            <li>${extLink(CONFIG.github, CONFIG.githubLabel)}</li>
            <li>${extLink(CONFIG.linkedin, 'LinkedIn')}</li>
          </ul>
        </div>
      </div>`;
  }

  function sectionBlock(s, c) {
    let inner = '';
    if (s.kind === 'entries') inner = s.entries.map(entryBlock).join('');
    if (s.kind === 'projects') inner = s.groups.map(projectGroup).join('');
    if (s.kind === 'orgs') inner = s.groups.map(orgGroup).join('');
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
    if (s.kind === 'projects' || s.kind === 'orgs')
      return s.groups.reduce((n, g) => n + g.items.length, 0);
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
         <a href="https://github.com/Flor5378/Flor5378.github.io" target="_blank" rel="noopener">${
           lang === 'fr' ? 'Code source' : 'Source code'
         }</a>
       </footer>`;

    toc.innerHTML =
      `<p class="rail__label">${c.ui.toc}</p>` +
      c.sections
        .map((s) => {
          const n = countOf(s);
          return `<a href="#${s.id}" data-id="${s.id}">
                    <span>${s.navTitle || s.title}</span>${n ? `<span class="rail__count">${n}</span>` : ''}
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
        hidePreview();
        ticking = false;
      });
    },
    { passive: true }
  );

  /* ---------------------------- aperçus GitHub ---------------------------- */

  const fine =
    typeof matchMedia === 'function' &&
    matchMedia('(hover: hover) and (pointer: fine)').matches;
  let card = null;
  let showTimer = null;
  let hideTimer = null;

  function previewCard() {
    if (card) return card;
    card = document.createElement('div');
    card.className = 'preview';
    card.innerHTML = '<img alt=""><span class="preview__repo"></span>';
    document.body.appendChild(card);
    return card;
  }

  function showPreview(link) {
    const repo = link.dataset.repo;
    if (!repo) return;
    const el = previewCard();
    const img = el.querySelector('img');
    const src = 'https://opengraph.githubassets.com/1/' + repo;
    if (img.getAttribute('src') !== src) {
      img.setAttribute('src', src);
      el.querySelector('.preview__repo').textContent = repo;
    }

    const r = link.getBoundingClientRect();
    const w = 330;
    const h = 210;
    let left = Math.min(r.left, innerWidth - w - 16);
    let top = r.bottom + 10;
    if (top + h > innerHeight) top = Math.max(12, r.top - h - 10);
    el.style.left = Math.max(12, left) + 'px';
    el.style.top = top + 'px';
    el.classList.add('is-on');
  }

  function hidePreview() {
    if (card) card.classList.remove('is-on');
  }

  function bindPreview(root) {
    if (!fine) return;
    root.addEventListener('mouseover', (e) => {
      const a = e.target.closest('a[data-repo]');
      if (!a) return;
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      showTimer = setTimeout(() => showPreview(a), 180);
    });
    root.addEventListener('mouseout', (e) => {
      if (!e.target.closest('a[data-repo]')) return;
      clearTimeout(showTimer);
      hideTimer = setTimeout(hidePreview, 120);
    });
    root.addEventListener('focusin', (e) => {
      const a = e.target.closest('a[data-repo]');
      if (a) showPreview(a);
    });
    root.addEventListener('focusout', hidePreview);
  }

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

  bindPreview(main);
  render();
})();
