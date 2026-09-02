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
    git("tag", `v${version}`);
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

const pkgPath = "package.json";
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
pkg.version = next;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

git("config", "user.name", "ingot-release-bot");
git("config", "user.email", "noreply@forgmatic.com");
git("add", "package.json");
git("commit", "-m", `chore(release): v${next}`);
git("tag", `v${next}`);
git("push", "origin", "HEAD:main", "--follow-tags");

writeFileSync("release-notes.txt", `${notes}\n`);
execFileSync("gh", ["release", "create", `v${next}`, "--title", `v${next}`, "--notes-file", "release-notes.txt"], {
  stdio: "inherit",
});
