/**
 * The doc-page registry, as data.
 *
 * The registry already holds everything a second tool needs to know about
 * a primitive — the name it goes by in a design (``tag``), its status and
 * version, the tokens it stands on, the values its props accept — and
 * until now none of it left the repository. The doc web renders it as
 * HTML, and HTML is where a machine's reading of it stops: a design
 * library, a linter for a design file or a Code Connect definition all had
 * to be typed out by hand next to the registry and would drift from it at
 * the first prop that changed.
 *
 * So the build writes ``components.json`` beside the site. It is generated
 * from ``INGOT_DOC_PAGES`` and from nothing else, which is the same reason
 * the doc page renders the real component rather than copied JSX.
 *
 * **What is deliberately NOT in it.** The demo and its source: a listing
 * belongs on the page, where the reader can see what it renders. And the
 * whole of ``useWhen`` — the manifest carries ``avoidWhen`` instead,
 * because the half a consumer skips is the half worth handing to a tool.
 */
import type { ReactNode } from "react";

import { DOC_LANGS, type DocLang, type Localized } from "@/ingot-docs/lang";
import { SITE_ORIGIN } from "@/ingot-docs/head";
import { displayName } from "@/ingot-docs/naming";
import { INGOT_DOC_PAGES } from "@/ingot-docs/registry";
import { pathOf } from "@/ingot-docs/routes";
import type { IngotDocMeta, IngotPropRow } from "@/ingot-docs/types";

/** Turns a `ReactNode` into the plain sentence a reader sees. */
export type NodeToText = (node: ReactNode) => string;

export interface ManifestProp {
  name: string;
  /** The type as the props table prints it. */
  type: string;
  required: boolean;
  /**
   * The members, when the type is a union of string literals — the values
   * a variant in a design file can take. Absent for everything else:
   * ``boolean`` has no members worth listing and ``ReactNode`` has none at
   * all.
   */
  values?: readonly string[];
}

export interface ManifestPropGroup {
  name: string;
  props: readonly ManifestProp[];
}

export interface ManifestComponent {
  /** Export name from `@forgmatic/ingot` — what an import says. */
  name: string;
  /** The name the doc web shows — `IngotBadge` → `Badge`. */
  display: string;
  /** The selector the element goes by in a design. The join key. */
  tag: string;
  status: IngotDocMeta["status"];
  version: string;
  deprecated?: IngotDocMeta["deprecated"];
  /** Tokens a change to which shows on this component everywhere. */
  tokens: readonly string[];
  /** One sentence on what `className` may do here, per language. */
  classNameNote: Localized<string>;
  summary: Localized<string>;
  /** When NOT to reach for it — the half a tool should be able to quote. */
  avoidWhen: Localized<readonly string[]>;
  a11y: Localized<readonly string[]>;
  props: readonly ManifestProp[];
  /** Props of types passed THROUGH a prop — `IngotColumn<Row>` and friends. */
  extraProps?: readonly ManifestPropGroup[];
  /** The doc page, per language. Absolute: the reader of this file is elsewhere. */
  page: Localized<string>;
}

export interface ComponentManifest {
  /** Version of the kit the manifest was written from. */
  kit: string;
  /** ISO date. A library built from this file can say how old it is. */
  generated: string;
  count: number;
  components: readonly ManifestComponent[];
}

/**
 * The members of a union of string literals, or `undefined`.
 *
 * Only a type whose every member is quoted qualifies. `"sm" | "md"` is a
 * set of variants; `string` and `number` are not, and neither is
 * `"a" | ReactNode`, where listing the quoted half would promise a
 * completeness the type does not have.
 */
export function enumValues(type: string): readonly string[] | undefined {
  const parts = type.split("|").map((part) => part.trim());
  if (parts.length < 2) return undefined;
  if (!parts.every((part) => /^"[^"]*"$/.test(part))) return undefined;
  return parts.map((part) => part.slice(1, -1));
}

function prop(row: IngotPropRow): ManifestProp {
  const values = enumValues(row.type);
  return {
    name: row.name,
    type: row.type,
    required: row.required,
    ...(values ? { values } : {}),
  };
}

/**
 * A `Localized<T>` built one language at a time.
 *
 * `Object.fromEntries` would lose the keys — it types them as `string`,
 * and the cast back to `Localized` would be a claim the compiler cannot
 * check. Filling a record the language list drives means adding a language
 * to `DOC_LANGS` fills this too, which is the whole point of that list.
 */
function localized<T>(make: (lang: DocLang) => T): Localized<T> {
  const out = {} as Record<DocLang, T>;
  for (const lang of DOC_LANGS) out[lang] = make(lang);
  return out;
}

/** Runs `toText` over every language of a `Localized` list. */
function localizedText(
  nodes: Localized<readonly ReactNode[]>,
  toText: NodeToText,
): Localized<readonly string[]> {
  return localized((lang) => nodes[lang].map(toText));
}

/**
 * One component's entry.
 *
 * Asynchronous because half of what the manifest describes -- the props,
 * the accessibility notes, when not to use it -- is loaded when a reader
 * opens the page rather than sitting in the entry chunk. The manifest is
 * written by the build, where an await costs nothing.
 */
async function component(
  doc: IngotDocMeta,
  toText: NodeToText,
): Promise<ManifestComponent> {
  const body = (await doc.body()).default;
  return {
    name: doc.name,
    display: displayName(doc.name),
    tag: doc.tag,
    status: doc.status,
    version: doc.version,
    ...(doc.deprecated ? { deprecated: doc.deprecated } : {}),
    tokens: doc.tokens,
    classNameNote: doc.classNameNote,
    summary: doc.summary,
    avoidWhen: localizedText(body.avoidWhen, toText),
    a11y: localizedText(body.a11y, toText),
    props: body.props.map(prop),
    ...(body.extraProps
      ? {
          extraProps: body.extraProps.map((group) => ({
            name: group.name,
            props: group.props.map(prop),
          })),
        }
      : {}),
    page: localized(
      (lang) => `${SITE_ORIGIN}${pathOf({ kind: "component", doc }, lang)}`,
    ),
  };
}

/**
 * The whole manifest.
 *
 * `toText` is a parameter rather than an import so this module stays free
 * of `react-dom/server`: it is read by the doc web's own tests, and a
 * server renderer pulled into the client bundle for four sentences would
 * be a poor trade. The build passes the renderer it already has.
 */
export async function componentManifest(
  toText: NodeToText,
  meta: { kit: string; generated: string },
): Promise<ComponentManifest> {
  return {
    kit: meta.kit,
    generated: meta.generated,
    count: INGOT_DOC_PAGES.length,
    components: await Promise.all(INGOT_DOC_PAGES.map((doc) => component(doc, toText))),
  };
}
