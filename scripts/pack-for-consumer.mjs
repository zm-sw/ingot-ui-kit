/**
 * Puts the packed kit into the example as a local dependency.
 *
 * The example must not reach into ``src/``. If it did, every kind of
 * mistake it is meant to catch — a relative path that leaked out of the
 * package, a missing export, a file outside ``files``, a type only this
 * repository's tsconfig supplies — would resolve anyway, and the example
 * would prove nothing while looking like proof.
 *
 * ``npm pack --dry-run --json`` names exactly the files a consumer
 * receives, so copying that list and nothing else answers the only
 * question that matters: is what leaves this repository enough to build an
 * application with? The list comes from npm rather than from a glob here,
 * because a second opinion about what ``files`` means is a second thing to
 * keep true.
 *
 * A directory, not the tarball itself: a ``file:`` tarball is recorded in
 * the lockfile by its integrity hash, the hash changes with every pack,
 * and npm then keeps installing the previous contents — silently, which is
 * the worst way for a check to be wrong.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const VENDOR = join(ROOT, "examples", "consumer", "vendor", "ingot");

const listing = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf-8",
  shell: process.platform === "win32",
});

const files = JSON.parse(listing)[0]?.files ?? [];
if (files.length === 0) {
  console.error("npm pack listed no files — nothing would reach a consumer");
  process.exit(1);
}

rmSync(VENDOR, { recursive: true, force: true });
for (const { path } of files) {
  const target = join(VENDOR, path);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(ROOT, path), target);
}

/**
 * The vendored manifest keeps only what a registry install would use.
 *
 * npm installs the devDependencies of a ``file:`` directory dependency but
 * not those of a package fetched from a registry. Left in, the example
 * would quietly inherit this repository's toolchain — including the very
 * type packages whose absence a consumer feels — and would then pass while
 * a real consumer failed. Which is the one outcome this example must not
 * have.
 */
const manifest = JSON.parse(readFileSync(join(VENDOR, "package.json"), "utf-8"));
delete manifest.devDependencies;
delete manifest.scripts;
writeFileSync(join(VENDOR, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`${files.length} packed file(s) -> examples/consumer/vendor/ingot`);
