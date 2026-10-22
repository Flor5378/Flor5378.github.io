/* =========================================================================
   app.js
   Rendu du contenu, navigation active, bascule FR/EN, thème, aperçus GitHub,
   apparition au défilement. Aucune dépendance externe.
   ========================================================================= */

(function () {
  'use strict';

  const root = document.documentElement;
  const main = document.getElementById('main');
  const footer = document.getElementById('footer');
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const progress = document.getElementById('progress');
  const skip = document.getElementById('skip');
  const langSwitch = document.getElementById('lang-switch');
  const themeBtn = document.getElementById('theme-btn');
  const metaTheme = document.getElementById('meta-theme');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  const media = (q) => typeof matchMedia === 'function' && matchMedia(q).matches;

  /* Libellés d'interface propres à la mise en page, hors contenu. */
  const UI = {
    fr: { skip: 'Aller au contenu', cta: 'Me contacter', write: 'Écrire' },
    en: { skip: 'Skip to content', cta: 'Get in touch', write: 'Get in touch' }
  };

  /* Icônes au trait, 24 × 24. */
  const svg = (d, size, extra) =>
    `<svg width="${size || 16}" height="${size || 16}" viewBox="0 0 24 24" fill="none" stroke="currentColor"` +
    ` stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra || ''}>${d}</svg>`;

  const ICON = {
    pin: (s) => svg('<path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>', s),
    home: (s) => svg('<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>', s),
    mail: (s) => svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>', s),
    arrow: (s, cls) => svg('<path d="M7 17 17 7M8 7h9v9"/>', s, cls ? ` class="${cls}"` : ''),
    copy: (s) => svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>', s),
    check: (s) => svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', s),
    github: (s) =>
      `<svg width="${s || 16}" height="${s || 16}" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`,
    linkedin: (s) =>
      `<svg width="${s || 15}" height="${s || 15}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>`
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

  // Décoratif : le nom de l'organisation est toujours écrit à côté.
  function logoTile(name, logo, extra, short) {
    const src = logoSrc(logo);
    const img = src
      ? `<img src="${src}" alt="" loading="lazy" decoding="async" onerror="this.remove()">`
      : '';
    const label = short || initials(name);
    const long = label.length > 4 ? ' logo__fallback--long' : '';
    return `<span class="logo ${extra || ''}" aria-hidden="true"><span class="logo__fallback${long}">${label}</span>${img}</span>`;
  }

  function chip(str) {
    const parts = String(str).split('|');
    const icon = parts[1]
      ? `<img class="chip__icon" src="assets/logos/tech/${parts[1]}.svg" alt="" loading="lazy" onerror="this.remove()">`
      : '';
    return `<li class="chip">${icon}<span>${parts[0]}</span></li>`;
  }

  const chips = (items) => `<ul class="chips">${items.map(chip).join('')}</ul>`;

  const extLink = (url, inner, repo, attrs) =>
    `<a href="${url}" target="_blank" rel="noopener"${repo ? ` data-repo="${repo}"` : ''}${attrs || ''}>${inner}</a>`;

  // Délai d'apparition échelonné dans une même grille.
  const delay = (i) => ` style="--d:${i % 8}"`;

  const pad = (n) => String(n).padStart(2, '0');

  function heroBlock(c, ui) {
    const [status, ...facts] = c.hero.meta;
    const factIcons = [ICON.pin, ICON.home];
    const factList = facts
      .map(
        ([k, v], i) => `
          <li class="fact">
            <span class="fact__icon">${(factIcons[i] || ICON.pin)(17)}</span>
            <span><span class="fact__k">${k}</span><span class="fact__v">${v}</span></span>
          </li>`
      )
      .join('');
    return `
      <section class="hero wrap" id="top" aria-labelledby="hero-name">
        <div class="hero__top reveal">
          <img class="hero__avatar" src="${CONFIG.photo}" alt="" onerror="this.remove()">
          <p class="status"><span class="status__dot" aria-hidden="true"></span><span class="sr-only">${status[0]} : </span>${status[1]}</p>
        </div>
        <h1 class="hero__name reveal" id="hero-name" style="--d:1">Florian Grolleau</h1>
        <p class="hero__role reveal" style="--d:2">${c.hero.role}</p>
        <p class="hero__intro reveal" style="--d:3">${c.hero.intro}</p>
        <ul class="facts reveal" style="--d:4">${factList}</ul>
        <div class="actions reveal" style="--d:5">
          <a class="btn btn--primary" href="#contact">${ICON.mail()}<span>${ui.cta}</span></a>
          ${extLink(CONFIG.github, `${ICON.github()}<span>GitHub</span>`, null, ' class="btn"')}
          ${extLink(CONFIG.linkedin, `${ICON.linkedin()}<span>LinkedIn</span>`, null, ' class="btn"')}
        </div>
      </section>`;
  }

  function entryBlock(e, i) {
    const title = e.url ? extLink(e.url, `${e.title}${ICON.arrow(14, 'i-ext')}`) : e.title;
    const [when, ...where] = e.meta;
    return `
      <article class="card entry reveal"${delay(i)}>
        ${logoTile(e.title, e.logo, '', e.short)}
        <div class="entry__main">
          <div class="entry__top">
            <div>
              <h3 class="entry__title">${title}</h3>
              ${e.sub ? `<p class="entry__sub">${e.sub}</p>` : ''}
            </div>
            <div class="entry__meta">
              <span class="entry__when">${when}</span>
              ${where.map((w) => `<span class="entry__where">${ICON.pin(13)}${w}</span>`).join('')}
            </div>
          </div>
          <p class="entry__text">${e.body}</p>
          ${e.tags ? chips(e.tags) : ''}
        </div>
      </article>`;
  }

  const groupHead = (label, n) =>
    `<h3 class="group__head"><span>${label}</span><span class="count">${n}</span></h3>`;

  function projectGroup(g) {
    const items = g.items
      .map((p, i) => {
        const url = p.url || (p.repo ? 'https://github.com/' + p.repo : null);
        const repoName = p.repo ? p.repo.split('/').pop() : '';
        const inner = `
          <span class="proj__top"><span class="badge">${p.lang}</span>${url ? ICON.arrow(16, 'proj__arrow') : ''}</span>
          <span class="proj__title">${p.title}</span>
          ${repoName ? `<span class="proj__repo">${ICON.github(13)}<span>${repoName}</span></span>` : ''}`;
        return `<li class="card${url ? ' card--link' : ''} proj reveal"${delay(i)}>${url ? extLink(url, inner, p.repo) : `<div>${inner}</div>`}</li>`;
      })
      .join('');
    return `<div class="group">${groupHead(g.label, g.items.length)}<ul class="grid">${items}</ul></div>`;
  }

  function orgItem(o, i, cls) {
    const name = o[lang] || o.fr || o.name;
    const inner = `${logoTile(name, o.logo, (cls || '') + (o.wide ? ' logo--wide' : ''), o.short)}<span class="org__name">${name}</span>`;
    return o.url
      ? extLink(o.url, inner, null, ` title="${name}"`)
      : `<span title="${name}">${inner}</span>`;
  }

  function orgGroup(g) {
    const items = g.items
      .map((o, i) => `<li class="card${o.url ? ' card--link' : ''} org reveal"${delay(i)}>${orgItem(o, i, 'logo--sm')}</li>`)
      .join('');
    return `<div class="group">${groupHead(g.label, g.items.length)}<ul class="grid orgs">${items}</ul></div>`;
  }

  /* Une carte large pour les longues listes ; une carte seule en fin de rangée
     s'élargit aussi, pour ne pas laisser de trou dans la grille. */
  function skillGrid(rows) {
    const wide = rows.map((r) => r.chips.length > 10);
    let run = [];
    const flush = () => {
      if (run.length % 2) wide[run[run.length - 1]] = true;
      run = [];
    };
    wide.forEach((w, i) => (w ? flush() : run.push(i)));
    flush();
    const cards = rows
      .map(
        (r, i) => `
          <div class="card skill${wide[i] ? ' skill--wide' : ''} reveal"${delay(i)}>
            <div class="skill__head"><h3 class="skill__title">${r.label}</h3><span class="count">${r.chips.length}</span></div>
            ${chips(r.chips)}
          </div>`
      )
      .join('');
    return `<div class="bento">${cards}</div>`;
  }

  function interestGrid(blocks) {
    const cards = blocks
      .map((b, i) => {
        const logos = b.logos
          ? `<ul class="logo-row">${b.logos.map((l, j) => `<li class="org">${orgItem(l, j)}</li>`).join('')}</ul>`
          : '';
        return `
          <div class="card interest reveal"${delay(i)}>
            <h3 class="eyebrow">${b.meta.join(' · ')}</h3>
            <p>${b.body}</p>
            ${logos}
          </div>`;
      })
      .join('');
    return `<div class="interests">${cards}</div>`;
  }

  function contactBlock(s, c, ui) {
    return `
      <div class="card contact reveal">
        <div>
          <span class="eyebrow">${ui.write}</span>
          <p class="contact__lead">${s.body}</p>
        </div>
        <div class="contact__actions">
          <div class="contact__row">
            <a class="btn btn--primary" href="mailto:${CONFIG.email}">${ICON.mail()}<span>${CONFIG.email}</span></a>
            <button type="button" class="btn copy" data-copy="${CONFIG.email}"
                    data-label="${c.ui.copy}" data-done="${c.ui.copied}">${ICON.copy()}<span class="copy__label" aria-live="polite">${c.ui.copy}</span></button>
          </div>
          <div class="contact__row">
            ${extLink(CONFIG.github, `${ICON.github()}<span>${CONFIG.githubLabel}</span>`, null, ' class="btn"')}
            ${extLink(CONFIG.linkedin, `${ICON.linkedin()}<span>LinkedIn</span>`, null, ' class="btn"')}
          </div>
        </div>
      </div>`;
  }

  function sectionBlock(s, i, c, ui) {
    let inner = '';
    if (s.kind === 'entries') inner = s.entries.map(entryBlock).join('');
    if (s.kind === 'projects') inner = s.groups.map(projectGroup).join('');
    if (s.kind === 'orgs') inner = s.groups.map(orgGroup).join('');
    if (s.kind === 'skills') inner = skillGrid(s.rows);
    if (s.kind === 'prose') inner = interestGrid(s.blocks);
    if (s.kind === 'contact') inner = contactBlock(s, c, ui);
    return `
      <section class="section" id="${s.id}" aria-labelledby="${s.id}-title">
        <div class="wrap section__grid">
          <header class="section__head reveal">
            <span class="section__index" aria-hidden="true">${pad(i + 1)}</span>
            <h2 class="section__title" id="${s.id}-title">${s.title}</h2>
            ${s.note ? `<p class="section__note">${s.note}</p>` : ''}
          </header>
          <div class="section__body">${inner}</div>
        </div>
      </section>`;
  }

  /* -------------------------------- rendu -------------------------------- */

  let navLinks = [];
  let sections = [];
  let pill = null;

  function render() {
    const c = CONTENT[lang];
    const ui = UI[lang];

    root.lang = lang;
    document.title = c.docTitle;
    document.getElementById('meta-description').setAttribute('content', c.description);
    themeBtn.setAttribute('aria-label', c.ui.themeLabel);
    nav.setAttribute('aria-label', c.ui.toc);
    skip.textContent = ui.skip;

    main.innerHTML = heroBlock(c, ui) + c.sections.map((s, i) => sectionBlock(s, i, c, ui)).join('');

    footer.innerHTML = `
      <div class="wrap footer__inner">
        <span>© ${new Date().getFullYear()} Florian Grolleau</span>
        <a href="https://github.com/Flor5378/Flor5378.github.io" target="_blank" rel="noopener">${c.ui.source}</a>
        <a class="footer__license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.${lang}"
           target="_blank" rel="license noopener" title="${c.ui.licenseTitle}">${c.ui.license}</a>
      </div>`;

    if (!pill) {
      pill = document.createElement('span');
      pill.className = 'nav__pill';
      pill.setAttribute('aria-hidden', 'true');
    }
    nav.innerHTML = c.sections
      .map((s) => `<a href="#${s.id}" data-id="${s.id}">${s.navTitle || s.title}</a>`)
      .join('');
    nav.prepend(pill);

    langSwitch.querySelectorAll('.seg__btn').forEach((b) => {
      const on = b.dataset.lang === lang;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on);
    });

    navLinks = Array.from(nav.querySelectorAll('a'));
    sections = c.sections.map((s) => document.getElementById(s.id));
    activeId = undefined;
  }

  /* ------------------------- en-tête et navigation ------------------------ */

  let activeId;
  let navLock = null;
  let lockY = null;

  function unlock() {
    navLock = null;
    lockY = null;
  }
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) =>
    addEventListener(t, unlock, { passive: true, capture: true })
  );
  addEventListener('scrollend', () => {
    if (navLock) lockY = scrollY;
  });

  function measureHeader() {
    root.style.setProperty('--head-h', header.offsetHeight + 'px');
  }

  function movePill(link) {
    if (!pill) return;
    const smooth = media('(prefers-reduced-motion: reduce)') ? 'auto' : 'smooth';
    if (!link) {
      pill.classList.remove('is-on');
      if (nav.scrollLeft) nav.scrollTo({ left: 0, behavior: smooth });
      return;
    }
    pill.style.width = link.offsetWidth + 'px';
    pill.style.height = link.offsetHeight + 'px';
    pill.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
    pill.classList.add('is-on');

    // Navigation défilante sur petit écran : garder le lien actif visible.
    if (nav.scrollWidth > nav.clientWidth) {
      const left = link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2;
      nav.scrollTo({ left: Math.max(0, left), behavior: smooth });
    }
  }

  function spy() {
    const line = header.offsetHeight + Math.min(innerHeight * 0.3, 220);
    let active = null;
    for (const el of sections) {
      if (el && el.getBoundingClientRect().top <= line) active = el.id;
    }
    // En bas de page, la dernière section est forcément celle qu'on lit.
    const doc = document.documentElement;
    if (sections.length && innerHeight + scrollY >= doc.scrollHeight - 4) {
      active = sections[sections.length - 1].id;
    }
    if (navLock && lockY !== null && Math.abs(scrollY - lockY) > 48) unlock();
    if (navLock) active = navLock;
    if (active === activeId) return;
    activeId = active;
    let current = null;
    navLinks.forEach((a) => {
      const on = a.dataset.id === active;
      a.classList.toggle('is-active', on);
      if (on) {
        a.setAttribute('aria-current', 'true');
        current = a;
      } else {
        a.removeAttribute('aria-current');
      }
    });
    movePill(current);
  }

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    header.classList.toggle('is-scrolled', scrollY > 8);
    spy();
  }

  let ticking = false;
  addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        hidePreview();
        ticking = false;
      });
    },
    { passive: true }
  );

  addEventListener('resize', () => {
    measureHeader();
    activeId = undefined;
    spy();
  });

  /* ------------------------- apparition au défilement --------------------- */

  const canReveal =
    'IntersectionObserver' in window && !media('(prefers-reduced-motion: reduce)');
  let io = null;

  if (canReveal) {
    root.classList.add('js-reveal');
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          io.unobserve(el);
          const settle = (ev) => {
            if (ev.target !== el || ev.propertyName !== 'opacity') return;
            el.removeEventListener('transitionend', settle);
            el.classList.remove('reveal', 'is-in');
            el.style.removeProperty('--d');
          };
          el.addEventListener('transitionend', settle);
          el.classList.add('is-in');
        });
      },
      { rootMargin: '0px', threshold: 0 }
    );
  }

  // instant : après un changement de langue, tout s'affiche sans animation.
  function reveal(instant) {
    main.querySelectorAll('.reveal').forEach((el) => {
      if (io && !instant) io.observe(el);
      else el.classList.remove('reveal');
    });
  }

  /* ---------------------------- aperçus GitHub ---------------------------- */

  const fine = media('(hover: hover) and (pointer: fine)');
  let card = null;
  let showTimer = null;
  let hideTimer = null;

  function previewCard() {
    if (card) return card;
    card = document.createElement('div');
    card.className = 'preview';
    card.setAttribute('aria-hidden', 'true');
    card.innerHTML = '<img alt=""><span class="preview__repo"></span>';
    card.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    card.addEventListener('mouseleave', hidePreview);
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
    const w = 340;
    const h = 220;
    const left = Math.min(r.left, innerWidth - w - 16);
    const minTop = header.getBoundingClientRect().bottom + 8;
    let top = r.bottom + 10;
    if (top + h > innerHeight) top = r.top - h - 10;
    if (top < minTop) {
      hidePreview();
      return;
    }
    el.style.left = Math.max(12, left) + 'px';
    el.style.top = top + 'px';
    el.classList.add('is-on');
  }

  function hidePreview() {
    if (card) card.classList.remove('is-on');
  }

  function bindPreview(el) {
    if (!fine) return;
    el.addEventListener('mouseover', (e) => {
      const a = e.target.closest('a[data-repo]');
      if (!a) return;
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      showTimer = setTimeout(() => showPreview(a), 200);
    });
    el.addEventListener('mouseout', (e) => {
      if (!e.target.closest('a[data-repo]')) return;
      clearTimeout(showTimer);
      hideTimer = setTimeout(hidePreview, 120);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      clearTimeout(showTimer);
      hidePreview();
    });
  }

  /* ------------------------------ interactions ---------------------------- */

  function syncThemeColor() {
    const dark = root.dataset.theme === 'dark';
    if (metaTheme) metaTheme.setAttribute('content', dark ? '#0A0D13' : '#F7F8FA');
    themeBtn.setAttribute('aria-pressed', String(dark));
  }

  langSwitch.addEventListener('click', (e) => {
    const btn = e.target.closest('.seg__btn');
    if (!btn || btn.dataset.lang === lang) return;
    // Repère : première carte encore visible sous l'en-tête (les titres de
    // section, collants, ne bougent pas et ne peuvent servir de repère).
    // FR et EN ont la même structure : on la retrouve par son rang.
    const blocks = () => Array.from(main.querySelectorAll('.card'));
    const edge = header.getBoundingClientRect().bottom;
    const before = blocks();
    const idx = scrollY > 10 ? before.findIndex((el) => el.getBoundingClientRect().bottom > edge) : -1;
    const offset = idx >= 0 ? before[idx].getBoundingClientRect().top : 0;
    lang = btn.dataset.lang;
    store.set('fg-lang', lang);
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
    render();
    reveal(true);
    const mark = idx >= 0 ? blocks()[idx] : null;
    if (mark) scrollTo({ top: scrollY + mark.getBoundingClientRect().top - offset, behavior: 'instant' });
    onScroll();
  });

  themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set('fg-theme', next);
    syncThemeColor();
  });

  main.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy');
    if (!btn) return;
    const label = btn.querySelector('.copy__label');
    const write = navigator.clipboard
      ? navigator.clipboard.writeText(btn.dataset.copy)
      : Promise.reject();
    write
      .then(() => {
        clearTimeout(btn._t);
        label.textContent = btn.dataset.done;
        btn.classList.add('is-done');
        btn.querySelector('svg').outerHTML = ICON.check();
        btn._t = setTimeout(() => {
          label.textContent = btn.dataset.label;
          btn.classList.remove('is-done');
          btn.querySelector('svg').outerHTML = ICON.copy();
        }, 1600);
      })
      .catch(() => {
        const address = btn.previousElementSibling && btn.previousElementSibling.querySelector('span');
        if (address) getSelection().selectAllChildren(address);
      });
  });

  // Clic dans la navigation : la pastille va droit à la section visée.
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-id]');
    if (!a) return;
    navLock = a.dataset.id;
    lockY = null;
    spy();
  });

  // Au clavier, le lien qui reçoit le focus reste visible dans la barre défilante.
  nav.addEventListener('focusin', (e) => {
    const a = e.target.closest('a');
    if (a && nav.scrollWidth > nav.clientWidth) a.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  });

  /* -------------------------------- démarrage ----------------------------- */

  bindPreview(main);
  render();
  syncThemeColor();
  measureHeader();
  reveal(false);
  onScroll();

  // L'ancre de l'URL vise un contenu rendu après le chargement : on la rejoint
  // sans animation, puis à nouveau une fois les polices chargées, sauf si
  // l'utilisateur a déjà fait défiler la page.
  const hashTarget =
    location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
  let userMoved = false;
  ['wheel', 'touchstart', 'keydown'].forEach((t) =>
    addEventListener(t, () => { userMoved = true; }, { passive: true, once: true })
  );
  const toHash = () => {
    if (hashTarget && !userMoved) hashTarget.scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  if (hashTarget) requestAnimationFrame(toHash);

  // Les polices modifient la largeur des liens et la hauteur des blocs.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      measureHeader();
      activeId = undefined;
      toHash();
      spy();
    });
  }
})();
