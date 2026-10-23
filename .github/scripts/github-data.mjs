// Écrit assets/github.json : description, langage et date de dernière
// modification de chaque dépôt cité dans assets/content.js (projets et liens
// data-repo). Lancé par .github/workflows/github-data.yml (passation 7.4).
import { readFile, writeFile } from 'node:fs/promises';
import vm from 'node:vm';

const SRC = 'assets/content.js';
const OUT = 'assets/github.json';

const ctx = vm.createContext({});
vm.runInContext(`${await readFile(SRC, 'utf8')}\n;this.__content = CONTENT;`, ctx);
const content = ctx.__content;

const ids = new Set();
for (const lang of Object.keys(content)) {
  for (const s of content[lang].sections) {
    if (s.kind === 'projects') s.groups.forEach((g) => g.items.forEach((it) => it.repo && ids.add(it.repo)));
    if (s.kind === 'entries') {
      s.entries.forEach((e) => {
        for (const m of String(e.body || '').matchAll(/data-repo="([^"]+)"/g)) ids.add(m[1]);
      });
    }
  }
}

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'flor5378-github-io',
  'X-GitHub-Api-Version': '2022-11-28'
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const repos = {};
for (const id of [...ids].sort()) {
  const res = await fetch(`https://api.github.com/repos/${id}`, { headers });
  if (res.status === 404) {
    repos[id] = { missing: true };   // privé ou introuvable
    continue;
  }
  if (!res.ok) throw new Error(`${id} : HTTP ${res.status}`);
  const j = await res.json();
  repos[id] = j.private
    ? { missing: true }
    : { description: j.description, language: j.language, pushedAt: j.pushed_at };
}

// Le fichier n'est réécrit que si les dépôts ont changé : la date seule ne
// justifie pas un commit quotidien.
let previous = null;
try { previous = JSON.parse(await readFile(OUT, 'utf8')); } catch (e) {}
if (previous && JSON.stringify(previous.repos) === JSON.stringify(repos)) {
  console.log('Données GitHub inchangées.');
} else {
  const generatedAt = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  await writeFile(OUT, `${JSON.stringify({ generatedAt, repos }, null, 2)}\n`);
  console.log(`${Object.keys(repos).length} dépôts écrits dans ${OUT}.`);
}
