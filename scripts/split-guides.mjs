/**
 * One-time codemod: split each guide into its metadata and its prose.
 *
 * The companion of `split-doc-pages.mjs`, and here for the same reason —
 * fourteen files changed the same way read better as one rule than as
 * fourteen diffs. Both are deleted in the pull request that runs them.
 *
 *   guides/ShellGuide.tsx       slug, group, title, section titles
 *   guides/ShellGuide.body.tsx  the prose, and the components that draw it
 *
 * The section TITLES stay in the metadata on purpose: the search index
 * reads them, and the search index is loaded on every page. What goes is
 * the prose under them, which is the part that is 276 kB.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/ingot-docs/guides";

/** The comment block that sits directly above a key belongs with the key. */
function properties(objectSource) {
  const lines = objectSource.split("\n");
  const out = [];
  let current = null;
  let pending = [];

  for (const line of lines) {
    const match = /^ {2}([A-Za-z_]\w*):/.exec(line);
    if (match) {
      if (current) out.push(current);
      current = { key: match[1], lines: [...pending, line] };
      pending = [];
      continue;
    }
    if (current === null) {
      pending.push(line);
      continue;
    }
    if (/^ {2}(\/\/|\/\*|\*)/.test(line) || line.trim() === "") pending.push(line);
    else {
      current.lines.push(...pending, line);
      pending = [];
    }
  }
  if (current) out.push(current);
  return out;
}

/** One `{ id, title, body }` entry of the sections array, cut in two. */
function sections(sectionLines) {
  const inner = sectionLines.slice(1, -1);
  const entries = [];
  let current = null;
  // A comment between two entries introduces the one below it.
  let pending = [];
  for (const line of inner) {
    if (line === "    {") {
      current = [];
      continue;
    }
    if (line === "    },") {
      entries.push({ lines: current, above: pending });
      pending = [];
      current = null;
      continue;
    }
    if (current === null) {
      if (line.trim() === "" || /^ {4}(\/\/|\/\*|\*)/.test(line)) {
        pending.push(line);
        continue;
      }
      throw new Error(`line outside an entry: ${line}`);
    }
    current.push(line);
  }
  if (current !== null) throw new Error("an entry was left open");
  return entries.map(({ lines, above }) => {
    const at = lines.findIndex((line) => /^ {6}body:/.test(line));
    if (at === -1) throw new Error("an entry declares no body");
    const id = /^ {6}id: "([^"]+)"/.exec(lines[0]);
    if (!id) throw new Error(`an entry declares no id: ${lines[0]}`);
    const body = lines.slice(at);
    return {
      meta: [...above, "    {", ...lines.slice(0, at), "    },"].join("\n"),
      body: [
        body[0].replace(/^ {6}body:/, `  ${JSON.stringify(id[1])}:`),
        ...body.slice(1).map((line) => line.replace(/^ {4}/, "")),
      ].join("\n"),
    };
  });
}

let split = 0;
for (const file of readdirSync(DIR).filter((name) => name.endsWith("Guide.tsx"))) {
  const path = join(DIR, file);
  const source = readFileSync(path, "utf-8").split("\r\n").join("\n");
  const name = file.replace(/\.tsx$/, "");

  const open = source.indexOf(`export const ${name}: IngotGuidePage = {\n`);
  if (open === -1) throw new Error(`${file}: not the shape this codemod knows`);
  const head = source.slice(0, open);
  const close = source.lastIndexOf("\n};");
  const props = properties(source.slice(source.indexOf("\n", open) + 1, close));

  const metaKeys = props.filter((p) => p.key !== "sections");
  const sectionProp = props.find((p) => p.key === "sections");
  if (!sectionProp) throw new Error(`${file}: no sections`);
  const parts = sections(sectionProp.lines);

  writeFileSync(
    path,
    [
      'import type { IngotGuideMeta } from "@/ingot-docs/types";',
      "",
      `export const ${name}: IngotGuideMeta = {`,
      metaKeys.map((p) => p.lines.join("\n")).join("\n"),
      "  sections: [",
      parts.map((part) => part.meta).join("\n"),
      "  ],",
      `  body: () => import("@/ingot-docs/guides/${name}.body"),`,
      "};",
      "",
    ].join("\n"),
  );

  writeFileSync(
    join(DIR, `${name}.body.tsx`),
    [
      head
        .replace(
          'import type { IngotGuidePage } from "@/ingot-docs/types";',
          'import type { IngotGuideBody } from "@/ingot-docs/types";',
        )
        .trimEnd(),
      "",
      "const body: IngotGuideBody = {",
      parts.map((part) => part.body).join("\n"),
      "};",
      "",
      "export default body;",
      "",
    ].join("\n"),
  );
  split += 1;
}

console.log(`split ${split} guide(s) into metadata + prose`);
