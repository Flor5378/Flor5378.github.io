/* =========================================================================
   motion.js
   Ressorts, forme liquide, pilule de navigation, surbrillances glissantes.
   Valeurs de la passation : sections 2.6 et 5, annexes B et C.
   ========================================================================= */

export const reducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------- ressorts -------------------------------- */

// Ressort paramétré par sa réponse (période, en s) et son amortissement (zeta).
export function spring(x, response, zeta) {
  const w = (2 * Math.PI) / response;
  return { x, v: 0, t: x, k: w * w, c: 2 * zeta * w };
}

// Euler semi-implicite. Renvoie true quand le ressort est au repos.
export function step(s, dt, eps = 0.05) {
  const a = -s.k * (s.x - s.t) - s.c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
  return Math.abs(s.x - s.t) < eps && Math.abs(s.v) < eps;
}

// Saut immédiat à la cible.
export function snap(springs) {
  springs.forEach((s) => { s.x = s.t; s.v = 0; });
}

// Boucle partagée : ne tourne que tant qu'un ressort bouge.
const jobs = new Map();
let raf = 0;
let last = 0;

export function kick(key, springs, paint, eps = 0.05) {
  if (reducedMotion()) {
    snap(springs);
    paint();
    jobs.delete(key);
    return;
  }
  jobs.set(key, { springs, paint, eps });
  if (!raf) {
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }
}

function loop(now) {
  const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
  last = now;
  for (const [key, job] of jobs) {
    let rest = true;
    for (const s of job.springs) if (!step(s, dt, job.eps)) rest = false;
    job.paint();
    if (rest) jobs.delete(key);
  }
  raf = jobs.size ? requestAnimationFrame(loop) : 0;
}

/* ------------------------------ forme liquide ------------------------------ */

// Catmull-Rom fermée convertie en courbes de Bézier.
export function blobPath(cx, cy, rs) {
  const pts = rs.map((r, i) => {
    const a = (i / rs.length) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });
  const n = pts.length;
  const f = (v) => v.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}

const NB = 12;

// Forme de l'accueil : 12 rayons à ressort, réactifs à la souris.
export function liquidBlob(hero, pathEl) {
  const base = Array.from({ length: NB }, (_, i) => 1 + 0.13 * Math.sin(i * 1.9 + 0.6) + 0.09 * Math.cos(i * 2.7 + 1.3));
  const radii = base.map(() => spring(0.62, 0.9, 0.55));

  const geom = () => {
    const w = hero.offsetWidth, h = hero.offsetHeight, narrow = w < 700;
    return { cx: w * (narrow ? 0.78 : 0.74), cy: h * (narrow ? 0.6 : 0.52), R: Math.min(w, h) * (narrow ? 0.46 : 0.36) };
  };
  const paint = () => {
    const g = geom();
    pathEl.setAttribute('d', blobPath(g.cx, g.cy, radii.map((s) => s.x * g.R)));
  };
  const settle = () => {
    radii.forEach((s, i) => { s.t = base[i]; });
    kick('blob', radii, paint, 0.0005);
  };

  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || reducedMotion()) return;
    const r = hero.getBoundingClientRect(), g = geom();
    const dx = e.clientX - r.left - g.cx, dy = e.clientY - r.top - g.cy;
    const ang = Math.atan2(dy, dx) + Math.PI / 2;
    const near = Math.max(0, 1 - Math.abs(Math.hypot(dx, dy) - g.R) / (g.R * 1.1));
    radii.forEach((s, i) => {
      const a = (i / NB) * Math.PI * 2;
      const da = Math.abs(((ang - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      s.t = base[i] + 0.16 * near * Math.exp(-(da * da) / 0.35);
    });
    kick('blob', radii, paint, 0.0005);
  });
  hero.addEventListener('pointerleave', settle);

  if (reducedMotion()) {
    radii.forEach((s, i) => { s.x = s.t = base[i]; });
    paint();
  } else {
    paint();
    setTimeout(settle, 380); // respiration au chargement
  }
  return { paint };
}

// Forme statique du contact : viewBox 0 0 400 400, centre (200, 200), rayon 150.
export function contactBlobPath() {
  const shape = Array.from({ length: NB }, (_, i) => 1 + 0.12 * Math.sin(i * 2.3 + 2.1) + 0.08 * Math.cos(i * 1.6 + 0.4));
  return blobPath(200, 200, shape.map((s) => s * 150));
}

/* --------------------------- pilule de navigation --------------------------- */

export function navPill(pillEl) {
  const p = { x: spring(0, 0.38, 0.8), w: spring(0, 0.38, 0.8) };
  const paint = () => {
    pillEl.style.transform = `translateX(${p.x.x.toFixed(1)}px)`;
    pillEl.style.width = `${Math.max(0, p.w.x).toFixed(1)}px`;
  };
  return function to(item, jump = false) {
    if (!item) return;
    p.x.t = item.offsetLeft;
    p.w.t = item.offsetWidth;
    if (jump) {
      snap([p.x, p.w]);
      paint();
      return;
    }
    kick('pill', [p.x, p.w], paint);
  };
}

/* ------------------------- surbrillance glissante -------------------------- */

// Bloc absolu sous la ligne survolée d'une liste : translateY et height.
export function glide(el, key) {
  const g = { y: spring(0, 0.36, 0.86), h: spring(0, 0.36, 0.86) };
  const paint = () => {
    el.style.transform = `translateY(${g.y.x.toFixed(1)}px)`;
    el.style.height = `${Math.max(0, g.h.x).toFixed(1)}px`;
  };
  return function to(y, h, jump = false) {
    g.y.t = y;
    g.h.t = h;
    if (jump) {
      snap([g.y, g.h]);
      paint();
      return;
    }
    kick(key, [g.y, g.h], paint);
  };
}

/* --------------------------- hauteur d'un panneau -------------------------- */

export function springHeight(el, key) {
  const s = spring(0, 0.42, 0.9);
  const paint = () => { if (s.x > 1) el.style.height = `${s.x.toFixed(1)}px`; };
  return function to(h) {
    if (!s.x || s.x < 2) {
      s.x = el.offsetHeight || h;
      s.v = 0;
    }
    s.t = h;
    kick(key, [s], paint);
  };
}
