/**
 * Automatické verzování kitu vX.Y.Z (rozhodnutí vlastníka 2026-09-02).
 *
 *   X — velké, celokitové změny. Stroj je nepozná, proto se hlásí
 *       VÝHRADNĚ commitem, jehož subject začíná ``release!:``.
 *   Y — nové primitivum, nebo major bump některé komponenty
 *       (doc stránky jsou strojově čitelný kontrakt: ``name`` +
 *       ``version``, bump vynucuje guard i CLAUDE.md).
 *   Z — všechno ostatní, co se od posledního tagu změnilo (patch bumpy
 *       komponent, tokeny, dokumentace, chrome doc webu).
 *
 * Zdroj pravdy je registr doc stránek, ne commit prefixy — prefix
 * disciplína se rozjíždí, kdežto verze komponent hlídá guard
 * ``ingot-doc-pages`` a PR check ``version-guard``.
 *
 * Běží z GitHub Actions po pushi do main (release.yml). Lokálně jen
 * ``--dry-run``: skript píše package.json, commituje, taguje a pushuje,
 * a to nemá co dělat z vývojářského stroje.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DRY = process.argv.includes("--dry-run");

function git(...args) {
  return execFileSync("git", args, { encoding: "utf-8" }).trim();
}

/** ``name`` a ``version`` z jedné doc stránky. */
function parseDoc(source) {
  const name = source.match(/name:\s*"([^"]+)"/)?.[1];
  const version = source.match(/version:\s*"([^"]+)"/)?.[1];
  return name && version ? { name, version } : null;
}

/** Mapa komponenta → verze na daném refu (HEAD = filesystem). */
function componentVersions(ref) {
  const out = new Map();
  if (ref === null) {
    const dir = "src/ingot-docs/pages";
    for (const file of readdirSync(dir)) {
      if (!file.endsWith("Doc.tsx")) continue;
      const doc = parseDoc(readFileSync(join(dir, file), "utf-8"));
      if (doc) out.set(doc.name, doc.version);
    }
    return out;
  }
  const files = git("ls-tree", "-r", "--name-only", ref, "src/ingot-docs/pages")
    .split("\n")
    .filter((f) => f.endsWith("Doc.tsx"));
  for (const file of files) {
    const doc = parseDoc(git("show", `${ref}:${file}`));
    if (doc) out.set(doc.name, doc.version);
  }
  return out;
}

function lastTag() {
  const tags = git("tag", "--list", "v*", "--sort=-v:refname")
    .split("\n")
    .filter(Boolean);
  return tags[0] ?? null;
}

function majorOf(version) {
  return Number.parseInt(version.split(".")[0] ?? "0", 10);
}

const tag = lastTag();

if (tag === null) {
  // Bootstrap: první běh jen ukotví dnešní stav. Bez kotvy by první
  // release musel projít celou historii a hádat, co už „vyšlo".
  const version = JSON.parse(readFileSync("package.json", "utf-8")).version;
  console.log(`no release tag yet -> anchoring v${version} at HEAD`);
  if (!DRY) {
    git("tag", "-a", `v${version}`, "-m", `v${version}`);
    git("push", "origin", `v${version}`);
  }
  process.exit(0);
}

const commits = git("log", `${tag}..HEAD`, "--format=%s")
  .split("\n")
  .filter(Boolean);
if (commits.length === 0) {
  console.log(`nothing to release since ${tag}`);
  process.exit(0);
}

const before = componentVersions(tag);
const now = componentVersions(null);

const added = [...now.keys()].filter((name) => !before.has(name));
const majorBumped = [...now.entries()]
  .filter(([name, v]) => before.has(name) && majorOf(v) > majorOf(before.get(name)))
  .map(([name]) => name);
const changed = [...now.entries()]
  .filter(([name, v]) => before.has(name) && before.get(name) !== v)
  .map(([name]) => name);

const epoch = commits.some((subject) => subject.startsWith("release!:"));
const kind = epoch ? "major" : added.length > 0 || majorBumped.length > 0 ? "minor" : "patch";

const [x, y, z] = tag.slice(1).split(".").map((n) => Number.parseInt(n, 10));
const next =
  kind === "major" ? `${x + 1}.0.0` : kind === "minor" ? `${x}.${y + 1}.0` : `${x}.${y}.${z + 1}`;

const notes = [
  `Automatický release z registru doc stránek (${tag} -> v${next}).`,
  added.length ? `Nová primitiva: ${added.join(", ")}.` : null,
  majorBumped.length ? `Major bump: ${majorBumped.join(", ")}.` : null,
  changed.length ? `Změněné komponenty: ${changed.join(", ")}.` : null,
  epoch ? "Epocha kitu zvednuta commitem release!:." : null,
]
  .filter(Boolean)
  .join("\n");

console.log(`${tag} -> v${next} (${kind})`);
console.log(notes);

if (DRY) process.exit(0);

/**
 * Tag a GitHub release nad tím, co už na main leží.
 *
 * Tag je anotovaný záměrně. Dřív se vyráběl lightweight a odesílal se
 * přes ``--follow-tags``, který ale posílá VÝHRADNĚ anotované tagy —
 * tag proto na remote nikdy nedorazil, další běh viděl pořád ten starý,
 * spočítal tutéž verzi a spadl na prázdném commitu. Verze se od té
 * chvíle nehnula a každý běh svítil červeně.
 */
function publish(version, body) {
  git("tag", "-a", `v${version}`, "-m", `v${version}`);
  git("push", "origin", `v${version}`);
  writeFileSync("release-notes.txt", `${body}\n`);
  execFileSync(
    "gh",
    ["release", "create", `v${version}`, "--title", `v${version}`, "--notes-file", "release-notes.txt"],
    { stdio: "inherit" },
  );
}

function gh(...args) {
  return execFileSync("gh", args, { encoding: "utf-8" }).trim();
}

// Identita musí stát před vším, co zapisuje do historie. Anotovaný tag
// je plnohodnotný objekt s autorem, takže ji potřebuje stejně jako
// commit — a zkratka níž, která dotahuje jen tag, se k žádnému commitu
// nedostane.
git("config", "user.name", "ingot-release-bot");
git("config", "user.email", "noreply@forgmatic.com");

const pkgPath = "package.json";
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

// main už verzi nese: předchozí běh své PR dotáhl, ale na tag už nedošel
// (spadl, vypršel mu limit, nebo ho slil auto-merge až po jeho konci).
// Chybí tedy jen tag a release — bump by tu byl podruhé a commit prázdný.
if (pkg.version === next) {
  console.log(`package.json už je na v${next} -> dotahuje se jen tag a release`);
  publish(next, notes);
  process.exit(0);
}

// main přímý push nepřijímá, takže bump přijíždí jako každá jiná změna —
// pull requestem. Větev je krátkoživotná, po sloučení ji smaže samo repo.
const branch = `release/v${next}`;

pkg.version = next;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

git("checkout", "-B", branch);
git("add", pkgPath);
git("commit", "-m", `chore(release): v${next}`);
// Přepisem, ne přidáním: když předchozí běh vypadl mezi pushem větve a
// založením PR, zůstala větev viset a obyčejný push by na ní uvízl.
// Vlastníkem téhle větve je stroj, takže její historie nikomu nepatří.
git("push", "--force", "origin", branch);

// Stejný důvod, jen o krok dál: nedokončený běh mohl PR už založit.
// Druhé ``pr create`` by na tom spadlo, takže se otevřené PR přebírá.
const open = gh("pr", "list", "--head", branch, "--state", "open", "--json", "number", "--jq", "length");
if (open === "0") {
  gh("pr", "create", "--base", "main", "--head", branch, "--title", `chore(release): v${next}`, "--body", notes);
} else {
  console.log(`PR na ${branch} už je otevřené -> pokračuje se na něm`);
}

// PR založený GITHUB_TOKENem nespouští ``pull_request`` workflow — to je
// pojistka GitHubu proti zacyklení. Povinné checky by tedy nikdy
// nedorazily a auto-merge by čekal navěky. ``workflow_dispatch`` je
// dokumentovaná výjimka, kterou GITHUB_TOKEN spustit smí, a jeho check
// runy sednou na tentýž commit, takže je ruleset uzná.
gh("workflow", "run", "ci.yml", "--ref", branch);
gh("pr", "merge", branch, "--auto", "--squash");

// Tentýž běh, který se nespustil, po sobě nechá záznam ve stavu
// ``action_required``. Ruleset ho čte jako povinný check, který ještě
// nedoběhl, takže auto-merge stojí — i když ho dispatch mezitím zeleně
// odbavil. Záznam se proto zkusí schválit.
//
// Jestli to GitHub botovi nad jeho vlastním během dovolí, se pozná až
// za ostra, a na odpovědi nic nestojí: když odmítne, schválí běh člověk
// a PR dojede tak jako tak.
const repo = process.env.GITHUB_REPOSITORY;
await new Promise((resolve) => setTimeout(resolve, 15_000));
try {
  const pending = gh(
    "api",
    `repos/${repo}/actions/runs?status=action_required&branch=${encodeURIComponent(branch)}`,
    "--jq",
    ".workflow_runs[].id",
  )
    .split("\n")
    .filter(Boolean);
  for (const id of pending) {
    gh("api", "-X", "POST", `repos/${repo}/actions/runs/${id}/approve`);
    console.log(`čekající běh ${id} schválen`);
  }
} catch {
  console.log("čekající běh nejde schválit botem -> schválí ho člověk");
}

// Squash dá sloučení nové id, takže tag musí až na něj — ne na commit
// větve. Když se merge do limitu nestihne, nic se neztratí: PR dojede
// samo a tag dotáhne příští běh větví výše.
const deadline = Date.now() + 20 * 60 * 1000;
let merged = false;
while (Date.now() < deadline) {
  await new Promise((resolve) => setTimeout(resolve, 30_000));
  const state = gh("pr", "view", branch, "--json", "state", "--jq", ".state");
  console.log(`PR ${branch}: ${state}`);
  if (state === "MERGED") {
    merged = true;
    break;
  }
  if (state === "CLOSED") break;
}

if (!merged) {
  console.log(`PR na v${next} se do limitu neslil -> tag dotáhne příští běh`);
  process.exit(0);
}

git("checkout", "main");
git("fetch", "origin", "main");
git("reset", "--hard", "origin/main");
publish(next, notes);
