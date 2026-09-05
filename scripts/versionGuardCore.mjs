/**
 * What the version guard decides, without touching git.
 *
 * The rule is CLAUDE.md's: a change to the kit moves the version on the doc
 * page of the primitive it changes. The first version of the guard checked
 * two things too loosely — it looked only at ``.tsx`` files, so a change to
 * ``tokens.css``, ``fields.ts`` or ``overlayChrome.ts`` shipped unversioned,
 * and it accepted a bump on ANY page, so moving IngotBadge's version paid
 * for a change to IngotTable.
 *
 * This module answers one question: given the changed kit files and the
 * pages whose version moved, which pages still owe a bump? It is pure, so
 * the mapping is unit-tested instead of being discovered on a red PR.
 *
 * Three kinds of kit file, three answers:
 *
 * 1. **A primitive** (``IngotTable.tsx``, ``Button.tsx``) owes a bump on
 *    its own page. Nothing else pays for it.
 * 2. **A shared module** (``overlayChrome.ts``, ``inputChrome.ts``) owes a
 *    bump on every primitive that imports it, directly or through another
 *    module. The importers are read from the source, not from a
 *    hand-written list, because a hand-written list is the first thing to
 *    drift when a module gains a consumer.
 * 3. **``tokens.css``** owes a bump on every page that DECLARES one of the
 *    tokens whose value changed. That is what the ``tokens`` field on a doc
 *    page is for: it already promises "a change to any of these shows on
 *    this component", so the guard holds the page to its own promise
 *    instead of demanding all forty-nine.
 *
 * The barrel (``index.ts``) is the fourth case: it owes nothing by itself
 * when a page was ADDED — that is a new primitive arriving with its own
 * page and its own version — and otherwise behaves like a shared module.
 *
 * A ``release!:`` commit is the escape hatch for a kit-wide change nobody
 * wants to spell out page by page.
 */

const COMPONENT_RE = /^(?:Ingot[A-Z]\w*|Button|Card)$/;

/** ``src/ingot/IngotTable.tsx`` → ``IngotTable``. */
export function moduleName(file) {
  return file.replace(/^.*\//, "").replace(/\.(tsx?|css)$/, "");
}

/** Which local modules a kit file imports (``./cx`` → ``cx``). */
export function localImports(source) {
  const names = new Set();
  for (const match of source.matchAll(/from\s+"\.\/([\w.-]+)"/g)) {
    names.add(match[1].replace(/\.(tsx?|css)$/, ""));
  }
  for (const match of source.matchAll(/import\s+"\.\/([\w.-]+)"/g)) {
    names.add(match[1].replace(/\.(tsx?|css)$/, ""));
  }
  return [...names];
}

/**
 * Reverse import graph: module → every kit module that reaches it,
 * transitively. ``sources`` maps a module name to its file contents.
 */
export function importers(sources) {
  const direct = new Map();
  for (const [name, source] of Object.entries(sources)) {
    for (const imported of localImports(source)) {
      if (!direct.has(imported)) direct.set(imported, new Set());
      direct.get(imported).add(name);
    }
  }
  const closure = new Map();
  for (const name of Object.keys(sources)) {
    const seen = new Set();
    const queue = [...(direct.get(name) ?? [])];
    while (queue.length > 0) {
      const next = queue.pop();
      if (next === name || seen.has(next)) continue;
      seen.add(next);
      queue.push(...(direct.get(next) ?? []));
    }
    closure.set(name, seen);
  }
  return closure;
}

/** Custom properties whose VALUE differs between two stylesheets. */
export function changedTokens(before, after) {
  const read = (css) => {
    const values = new Map();
    for (const match of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      const [, name, value] = match;
      const key = `${name}`;
      const clean = value.trim().replace(/\s+/g, " ");
      // A token declared in several blocks (light, dark, accent families)
      // is one contract: any of its values moving is a change to it.
      values.set(key, [...(values.get(key) ?? []), clean].sort().join("|"));
    }
    return values;
  };
  const from = read(before);
  const to = read(after);
  const moved = new Set();
  for (const [name, value] of to) {
    if (from.get(name) !== value) moved.add(name);
  }
  for (const name of from.keys()) {
    if (!to.has(name)) moved.add(name);
  }
  return [...moved].sort();
}

/**
 * The pages each changed kit file owes a bump on.
 *
 * ``input`` carries the changed files (already filtered to substantive kit
 * changes), the kit sources, the doc pages (name → declared tokens), the
 * names of pages whose version moved and of pages that were added.
 * Returns one entry per file that still owes something.
 */
export function pagesOwed({
  changedFiles,
  sources,
  pages,
  bumpedPages,
  addedPages,
  tokensBefore = "",
  tokensAfter = "",
}) {
  const paid = new Set([...bumpedPages, ...addedPages]);
  const reach = importers(sources);
  const pageNames = new Set(Object.keys(pages));
  const owed = [];

  for (const file of changedFiles) {
    const name = moduleName(file);

    if (file.endsWith("tokens.css")) {
      const moved = changedTokens(tokensBefore, tokensAfter);
      const dependents = Object.entries(pages)
        .filter(([, tokens]) => tokens.some((token) => moved.includes(token)))
        .map(([page]) => page);
      const missing = dependents.filter((page) => !paid.has(page));
      if (missing.length > 0) {
        owed.push({ file, reason: `tokens ${moved.join(", ")}`, pages: missing });
      }
      continue;
    }

    if (pageNames.has(name) && COMPONENT_RE.test(name)) {
      if (!paid.has(name)) owed.push({ file, reason: "its own page", pages: [name] });
      continue;
    }

    if (name === "index") {
      // A new primitive arrives here together with its page; anything else
      // in the barrel is a shared change and pays like one.
      if (addedPages.length > 0 || bumpedPages.length > 0) continue;
      const dependents = [...(reach.get(name) ?? [])].filter((dep) =>
        pageNames.has(dep),
      );
      owed.push({
        file,
        reason: "the public API changed",
        pages: dependents.length > 0 ? dependents : [...pageNames].sort(),
      });
      continue;
    }

    const dependents = [...(reach.get(name) ?? [])]
      .filter((dep) => pageNames.has(dep) && COMPONENT_RE.test(dep))
      .sort();
    const missing = dependents.filter((page) => !paid.has(page));
    if (missing.length > 0) {
      owed.push({ file, reason: "every primitive that imports it", pages: missing });
    }
  }

  return owed;
}
