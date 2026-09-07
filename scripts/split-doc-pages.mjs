/**
 * One-time codemod: split each doc page into its metadata and its body.
 *
 * Run once, checked in so the change is reviewable as a rule rather than
 * as 128 files of diff, and deleted in the same pull request. It is here
 * only so a reviewer can read what was done to every page instead of
 * reading it sixty-four times.
 *
 *   pages/IngotTableDoc.tsx       metadata + a loader for the body
 *   pages/IngotTableDoc.body.tsx  useWhen, avoidWhen, props, a11y, i18n…
 *
 * Measured before writing it: the metadata of all sixty-four pages is
 * 64 kB of source and the bodies are 458 kB. The bodies are what the
 * entry chunk was carrying for pages nobody had opened.
 *
 * The split is by top-level key, which is safe here because every page is
 * one prettier-formatted object literal — a key always starts a line at
 * exactly two spaces of indentation, and nothing else in the file does.
 * The script refuses a file it cannot account for rather than guessing.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/ingot-docs/pages";

/** What the menu, the search index and the guards need on every page load. */
const META = new Set([
  "name",
  "status",
  "deprecated",
  "version",
  "tag",
  "tokens",
  "classNameNote",
  "summary",
  // `useWhen` is body content that stays in the metadata on purpose: the
  // search index reads it, and the search index is loaded on every page.
  // Moving it out would mean either a search that can no longer find a
  // component by the situation it is for — which is half of what the
  // search is good at — or a generated index file nobody maintains. It is
  // 65 kB of the 458; the other 393 kB still go.
  "useWhen",
  "demo",
  "demoSource",
]);

/** What only the open page needs. */
const BODY = new Set(["avoidWhen", "props", "extraProps", "a11y", "i18n", "limits"]);

/** The comment block that sits directly above a key belongs with the key. */
function properties(objectSource) {
  const lines = objectSource.split("\n");
  const out = [];
  let current = null;
  let pending = [];

  for (const line of lines) {
    const match = /^ {2}([A-Za-z_]\w*)[:,]/.exec(line);
    if (match) {
      if (current) out.push(current);
      current = { key: match[1], lines: [...pending, line] };
      pending = [];
      continue;
    }
    if (current === null) {
      // Comments and blank lines before the first key.
      pending.push(line);
      continue;
    }
    // A line that opens a comment for the NEXT key rather than continuing
    // this one: hold it until we know which key it introduces.
    if (/^ {2}(\/\/|\/\*|\*)/.test(line) || line.trim() === "") pending.push(line);
    else {
      current.lines.push(...pending, line);
      pending = [];
    }
  }
  if (current) out.push(current);
  return { props: out, trailing: pending };
}

let split = 0;
for (const file of readdirSync(DIR).filter((name) => name.endsWith("Doc.tsx"))) {
  const path = join(DIR, file);
  // Line endings are the checkout's business: on Windows git hands these
  // back with CRLF, and every pattern below is written in LF.
  const source = readFileSync(path, "utf-8").split("\r\n").join("\n");
  const name = file.replace(/\.tsx$/, "");

  const open = source.indexOf(`export const ${name}: IngotDocPage = {\n`);
  if (open === -1) throw new Error(`${file}: not the shape this codemod knows`);
  const head = source.slice(0, open);
  const bodyStart = source.indexOf("\n", open) + 1;
  const close = source.lastIndexOf("\n};");
  if (close === -1) throw new Error(`${file}: no closing brace`);

  const { props, trailing } = properties(source.slice(bodyStart, close));
  const unknown = props.filter((p) => !META.has(p.key) && !BODY.has(p.key));
  if (unknown.length > 0) {
    throw new Error(`${file}: unknown key(s) ${unknown.map((p) => p.key).join(", ")}`);
  }
  if (trailing.some((line) => line.trim() !== "")) {
    throw new Error(`${file}: trailing content the split would drop`);
  }

  const pick = (set) =>
    props
      .filter((p) => set.has(p.key))
      .map((p) => p.lines.join("\n"))
      .join("\n");

  const metaText = pick(META);
  const bodyText = pick(BODY);

  // The two loaders are the only part of the header the metadata always
  // needs. Split by position rather than by pattern: they are written two
  // ways across the pages (one line or four, depending on how prettier
  // broke them), but they are always the LAST thing above the object.
  const loaderAt = head.indexOf("const demo = () =>");
  if (loaderAt === -1) throw new Error(`${file}: no demo loader above the object`);
  const demoLoaders = head.slice(loaderAt).trimEnd();
  const rest = head
    .slice(0, loaderAt)
    .split("\n")
    .filter((line) => !/^import /.test(line))
    .join("\n")
    .trim();

  // Whatever else sits above the object — version-history comments, and in
  // one page a template literal the props table prints — goes to the half
  // that reads it.
  const declared = [...rest.matchAll(/^(?:const|function|let) (\w+)/gm)].map(
    (m) => m[1],
  );
  const restBelongsToMeta = declared.some((id) =>
    new RegExp(`\\b${id}\\b`).test(metaText),
  );
  const metaRest = restBelongsToMeta ? rest : "";
  const bodyRest = restBelongsToMeta ? "" : rest;

  // `<IngotCode`, not the bare word: one page is CALLED IngotCode, and its
  // own name in `name:` is not a use of the component.
  const usesCodeInMeta = /<IngotCode\b/.test(metaText) || /<IngotCode\b/.test(metaRest);
  const usesCodeInBody = /<IngotCode\b/.test(bodyText) || /<IngotCode\b/.test(bodyRest);

  writeFileSync(
    path,
    [
      usesCodeInMeta ? 'import { IngotCode } from "@/ingot";' : null,
      'import type { IngotDocMeta } from "@/ingot-docs/types";',
      "",
      metaRest === "" ? null : `${metaRest}\n`,
      demoLoaders.trim(),
      "",
      `export const ${name}: IngotDocMeta = {`,
      metaText,
      `  body: () => import("@/ingot-docs/pages/${name}.body"),`,
      "};",
      "",
    ]
      .filter((part) => part !== null)
      .join("\n"),
  );

  writeFileSync(
    join(DIR, `${name}.body.tsx`),
    [
      usesCodeInBody ? 'import { IngotCode } from "@/ingot";' : null,
      'import type { IngotDocBody } from "@/ingot-docs/types";',
      "",
      bodyRest === "" ? null : `${bodyRest}\n`,
      "const body: IngotDocBody = {",
      bodyText,
      "};",
      "",
      "export default body;",
      "",
    ]
      .filter((part) => part !== null)
      .join("\n"),
  );
  split += 1;
}

console.log(`split ${split} doc page(s) into metadata + body`);
