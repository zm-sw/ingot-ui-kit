/**
 * Repo checks for the Ingot UI Kit, ported from the Forgmatic monorepo's
 * `scripts/repo_checks.py` when the kit moved into its own repository.
 * Three guards, same semantics as the originals:
 *
 *  - ingot-doc-pages: every value export matching /^Ingot[A-Z]/ (plus the
 *    unprefixed Button and Card) from the `src/ingot/index.ts` barrel must
 *    have a doc page registered in `src/ingot-docs/registry.ts`, and vice
 *    versa. Each page imports its demo module TWICE — once as code (it
 *    renders) and once as `?raw` text (the "show code" listing) — so the
 *    listing cannot drift from what the demo renders. Demo modules are
 *    published verbatim and must carry no comments. Guides need distinct
 *    slugs that don't shadow a primitive.
 *
 *  - ingot-docs-kit-only: markup that has a kit counterpart must not be
 *    hand-rolled in the doc web — the doc web TEACHES the kit.
 *
 *  - ingot-docs-no-internal-prose: the doc web is a PUBLIC page; rendered
 *    text must not name issue keys, monorepo paths or guard names.
 *
 * Exit code 0 = all green; 1 = at least one guard failed.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(
  /^\/([A-Za-z]):\//,
  "$1:/",
);
const INGOT_INDEX = join(ROOT, "src/ingot/index.ts");
const DOCS_DIR = join(ROOT, "src/ingot-docs");
const REGISTRY = join(DOCS_DIR, "registry.ts");

const failures = [];
function fail(guard, lines) {
  failures.push(`FAIL: [${guard}] ${lines.join("\n  ")}`);
}
function ok(guard, message) {
  console.log(`[${guard}] OK: ${message}`);
}

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
}

function read(path) {
  return readFileSync(path, "utf-8");
}

function* walk(dir, pattern) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full, pattern);
    else if (pattern.test(entry.name)) yield full;
  }
}

function rel(path) {
  return path.slice(ROOT.length).replaceAll("\\", "/").replace(/^\//, "");
}

// --- ingot-doc-pages --------------------------------------------------------

const COMPONENT_RE = /^Ingot[A-Z]\w*$/;
const DOCUMENTED_UNPREFIXED = new Set(["Button", "Card"]);

function exportedComponents() {
  const src = stripComments(read(INGOT_INDEX));
  const names = new Set();
  for (const match of src.matchAll(/export\s*\{([^}]*)\}\s*from/gs)) {
    for (const raw of match[1].split(",")) {
      const entry = raw.trim();
      if (!entry || entry.startsWith("type ")) continue;
      const name = entry.split(" as ")[0].trim();
      if (COMPONENT_RE.test(name) || DOCUMENTED_UNPREFIXED.has(name)) {
        names.add(name);
      }
    }
  }
  return names;
}

function documentedComponents(registrySrc) {
  const match = registrySrc.match(/INGOT_DOC_PAGES[^=]*=\s*\[([^\]]*)\]/s);
  if (!match) return new Set();
  return new Set(
    [...match[1].matchAll(/\b(\w+)Doc\b/g)].map((entry) => entry[1]),
  );
}

function registeredGuides(registrySrc) {
  const match = registrySrc.match(/INGOT_GUIDE_PAGES[^=]*=\s*\[([^\]]*)\]/s);
  if (!match) return [];
  return [...match[1].matchAll(/\b(\w+Guide)\b/g)].map((entry) => entry[1]);
}

function guardIngotDocPages() {
  const guard = "ingot-doc-pages";
  const registrySrc = stripComments(read(REGISTRY));
  const exported = exportedComponents();
  const documented = documentedComponents(registrySrc);

  const undocumented = [...exported].filter((n) => !documented.has(n)).sort();
  if (undocumented.length) {
    fail(guard, [
      `${undocumented.length} Ingot primitive(s) have no doc page:`,
      ...undocumented,
      "Add src/ingot-docs/pages/<Name>Doc.tsx and list it in the registry.",
      "Adding a primitive and its doc page is ONE PR, not two.",
    ]);
    return;
  }
  const orphaned = [...documented].filter((n) => !exported.has(n)).sort();
  if (orphaned.length) {
    fail(guard, [
      `${orphaned.length} doc page(s) document something the barrel does not export:`,
      ...orphaned,
      "Drop the page and its registry entry, or restore the export.",
    ]);
    return;
  }

  for (const name of [...documented].sort()) {
    const pagePath = join(DOCS_DIR, "pages", `${name}Doc.tsx`);
    const pageRel = rel(pagePath);
    if (!existsSync(pagePath)) {
      fail(guard, [`registry lists ${name}Doc but ${pageRel} does not exist.`]);
      continue;
    }
    const src = stripComments(read(pagePath));
    if (!src.includes(`name: "${name}"`)) {
      fail(guard, [`${pageRel} does not declare name: "${name}".`]);
    }
    const demoPath = join(DOCS_DIR, "demos", `${name}Demo.tsx`);
    const demoRel = rel(demoPath);
    if (!existsSync(demoPath)) {
      fail(guard, [
        `${pageRel} has no demo module (${demoRel}).`,
        "The demo lives in its own module so the page can import it TWICE —",
        "once as code (it renders) and once as text (?raw).",
      ]);
      continue;
    }
    const demoRaw = read(demoPath);
    if (/^[ \t]*\/\/|\/\*/m.test(demoRaw)) {
      fail(guard, [
        `${demoRel} contains a comment.`,
        "This module is published VERBATIM as the 'show code' listing on a",
        "PUBLIC page — a comment in it is a paragraph on the website.",
      ]);
    }
    const demoSrc = stripComments(demoRaw);
    if (!/from\s+["']@\/ingot(?:\/[^"']*)?["']/.test(demoSrc)) {
      fail(guard, [
        `${demoRel} never imports from '@/ingot'.`,
        "Demos MUST render the real component; copied JSX drifts silently.",
      ]);
    }
    const spec = `@/ingot-docs/demos/${name}Demo`;
    for (const [suffix, why] of [
      ["", "renders the live demo"],
      ["?raw", "is listed under the 'show code' toggle"],
    ]) {
      if (!src.includes(`from "${spec}${suffix}"`)) {
        fail(guard, [
          `${pageRel} does not import '${spec}${suffix}', the module that ${why}.`,
          "The page must import the SAME module twice: as code and as ?raw text.",
        ]);
      }
    }
  }

  const guides = registeredGuides(registrySrc);
  if (!guides.length) {
    fail(guard, [
      "no page registered in INGOT_GUIDE_PAGES.",
      "The doc web needs at least a landing page.",
    ]);
  }
  const slugs = new Map();
  for (const guide of guides) {
    const guidePath = join(DOCS_DIR, "guides", `${guide}.tsx`);
    const guideRel = rel(guidePath);
    if (!existsSync(guidePath)) {
      fail(guard, [`registry lists ${guide} but ${guideRel} does not exist.`]);
      continue;
    }
    const found = stripComments(read(guidePath)).match(
      /slug:\s*["']([^"']+)["']/,
    );
    if (!found) {
      fail(guard, [`${guideRel} declares no slug.`]);
      continue;
    }
    const slug = found[1];
    if (slugs.has(slug)) {
      fail(guard, [
        `slug '${slug}' is declared by both ${slugs.get(slug)} and ${guide}.`,
      ]);
    }
    if (exported.has(slug)) {
      fail(guard, [
        `guide ${guide} uses slug '${slug}', which is also an Ingot primitive.`,
        "Guide slugs and primitive names share ONE hash namespace. Rename the slug.",
      ]);
    }
    slugs.set(slug, guide);
  }

  if (!failures.length) {
    ok(
      guard,
      `${exported.size} Ingot primitive(s), each with a doc page rendering ` +
        `the real component; ${guides.length} guide page(s) on distinct slugs`,
    );
  }
}

// --- ingot-docs-kit-only ----------------------------------------------------

const BANNED_TAGS = {
  nav: "IngotSideNav",
  h1: "IngotPageHeader",
  h2: "IngotSection",
  h3: "IngotSection (level={3})",
  h4: "IngotSection",
  ul: "IngotList",
  ol: 'IngotList (variant="ordered")',
  li: "IngotList",
  pre: "IngotCode (block)",
  code: "IngotCode",
  table: "IngotTable",
  thead: "IngotTable",
  button: "Button",
  section: "IngotSection",
};
const TAG_RE = new RegExp(
  `<(${Object.keys(BANNED_TAGS).sort().join("|")})\\b`,
  "g",
);

function guardIngotDocsKitOnly() {
  const guard = "ingot-docs-kit-only";
  const hits = [];
  for (const path of walk(DOCS_DIR, /\.tsx$/)) {
    const code = stripComments(read(path));
    code.split("\n").forEach((line, index) => {
      for (const match of line.matchAll(TAG_RE)) {
        hits.push(`${rel(path)}:${index + 1}: <${match[1]}>`);
      }
    });
  }
  if (hits.length) {
    const tags = [...new Set(hits.map((h) => h.split("<")[1].replace(">", "")))]
      .sort();
    fail(guard, [
      `${hits.length} hand-rolled tag(s) in the Ingot doc web:`,
      ...hits.slice(0, 20),
      "The doc web TEACHES the kit. Use the primitive instead:",
      ...tags.map((tag) => `<${tag}> -> ${BANNED_TAGS[tag]}`),
      "Layout and ordinary prose stay hand-written on purpose: div, p, span,",
      "a, label, select, aside, strong.",
    ]);
  } else {
    ok(
      guard,
      `the doc web hand-rolls none of the ${Object.keys(BANNED_TAGS).length} ` +
        "tags that have a kit primitive",
    );
  }
}

// --- ingot-docs-no-internal-prose -------------------------------------------

const INTERNAL_RE = new RegExp(
  [
    String.raw`KAN-\d+`,
    String.raw`\b(?:apps/(?:web|api)|scripts)/[\w/.-]+`,
    String.raw`\bingot-(?:doc-pages|inventory|overlays|thead|docs-kit-only|public-api|docs-no-internal-prose)\b`,
  ].join("|"),
  "g",
);

function guardIngotDocsNoInternalProse() {
  const guard = "ingot-docs-no-internal-prose";
  const hits = [];
  for (const path of walk(DOCS_DIR, /\.tsx?$/)) {
    if (rel(path).includes("/demos/")) continue;
    const rendered = stripComments(read(path));
    rendered.split("\n").forEach((line, index) => {
      for (const match of line.matchAll(INTERNAL_RE)) {
        hits.push(`${rel(path)}:${index + 1}: ${match[0]}`);
      }
    });
  }
  if (hits.length) {
    fail(guard, [
      `${hits.length} internal reference(s) in text the doc web RENDERS:`,
      ...hits.slice(0, 20),
      "The doc web is a PUBLIC page. Issue keys, repo paths and guard names",
      "mean nothing to an outside reader. Put the explanation in a COMMENT —",
      "comments in pages/ and guides/ are not rendered. (Demo modules are the",
      "exception: they are published verbatim, so they carry no comments.)",
    ]);
  } else {
    ok(guard, "nothing the doc web renders names an issue key, a repo path or a guard");
  }
}

// ---------------------------------------------------------------------------

guardIngotDocPages();
guardIngotDocsKitOnly();
guardIngotDocsNoInternalProse();

if (failures.length) {
  for (const failure of failures) console.error(`\n${failure}`);
  process.exit(1);
}
