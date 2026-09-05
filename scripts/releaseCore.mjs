/**
 * Which part of the version a release moves, as a pure function.
 *
 * The rule itself is CLAUDE.md's: X is a kit epoch a machine cannot judge,
 * Y is a new primitive or a breaking change, Z is everything else. What
 * belongs here is the arithmetic and one case the rule always implied but
 * the script did not carry — **a removal**.
 *
 * A removal is the end of a deprecation, and a consumer outside this
 * repository feels it exactly as hard as a renamed prop: their build stops.
 * Shipping that as a patch would be the one release nobody looks at twice.
 */

/**
 * ``before`` and ``now`` map a primitive to its documented version.
 * ``epoch`` is true when a commit announced ``release!:``.
 */
export function releaseChanges({ before, now, epoch = false }) {
  const majorOf = (version) => Number.parseInt(version.split(".")[0] ?? "0", 10);

  const added = [...now.keys()].filter((name) => !before.has(name));
  const removed = [...before.keys()].filter((name) => !now.has(name));
  const majorBumped = [...now.entries()]
    .filter(
      ([name, version]) =>
        before.has(name) && majorOf(version) > majorOf(before.get(name)),
    )
    .map(([name]) => name);
  const changed = [...now.entries()]
    .filter(([name, version]) => before.has(name) && before.get(name) !== version)
    .map(([name]) => name);

  const kind = epoch
    ? "major"
    : added.length > 0 || removed.length > 0 || majorBumped.length > 0
      ? "minor"
      : "patch";

  return { added, removed, majorBumped, changed, kind };
}

/** ``v1.2.3`` + a kind → the next version string. */
export function nextVersion(tag, kind) {
  const [x, y, z] = tag
    .slice(1)
    .split(".")
    .map((part) => Number.parseInt(part, 10));
  if (kind === "major") return `${x + 1}.0.0`;
  if (kind === "minor") return `${x}.${y + 1}.0`;
  return `${x}.${y}.${z + 1}`;
}

/** The release notes, which are also the changelog entry. One text. */
export function releaseNotes({ tag, next, changes, epoch = false }) {
  return [
    `Automatic release from the doc page registry (${tag} → v${next}).`,
    changes.added.length ? `New primitives: ${changes.added.join(", ")}.` : null,
    changes.removed.length
      ? `Removed after deprecation: ${changes.removed.join(", ")}.`
      : null,
    changes.majorBumped.length
      ? `Major bump: ${changes.majorBumped.join(", ")}.`
      : null,
    changes.changed.length
      ? `Changed components: ${changes.changed.join(", ")}.`
      : null,
    epoch ? "Kit epoch raised by a release!: commit." : null,
  ].filter(Boolean);
}
