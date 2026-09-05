/**
 * Shape of the Ingot doc pages.
 *
 * A page is NOT prose about a component — it is a module that really
 * renders it. ``Demo`` therefore returns a live tree built on an import
 * from ``@/ingot``; copied JSX would be exactly the drift that made the
 * product delete its hand-written spec documents.
 *
 * The ``ingot-doc-pages`` guard (``scripts/checks.mjs``) pairs ``name``
 * with an export from ``src/ingot/index.ts`` 1:1 and refuses a PR where a
 * primitive has no page — and a PR where a page has no primitive.
 *
 * **The content contract is in the TYPE, not in prose.** ``useWhen``,
 * ``avoidWhen``, ``a11y`` and ``i18n`` are REQUIRED fields, so a page
 * without them is refused by ``npm run typecheck`` — not by a code review
 * that may miss the missing section. An empty array (``[]``) passes the
 * typecheck; the second enforcement is held by ``tests/DocsApp.test.tsx``.
 *
 * **What is text is ``Localized``.** Translatable fields carry
 * ``Record<DocLang, …>``, so adding a language to ``DOC_LANGS`` fails the
 * typecheck everywhere that text is missing. A language cannot be promised
 * without being written. What is not text — ``name``, ``Demo``,
 * ``demoSource``, a prop's name and type — stays single for all languages,
 * because it is not translated and a duplicate would drift.
 */
import type { JSX, ReactNode } from "react";

import type { DocLang, Localized } from "@/ingot-docs/lang";

/**
 * A doc web page that is NOT about a component.
 *
 * A concept of its own, not another ``IngotDocPage``. The component
 * registry pairs pages with exports from ``@/ingot`` **1 : 1 in both
 * directions**, and exactly that bidirectionality is why the guard exists:
 * a component without a page is a lie just like a page without a
 * component. If the intro or Translations were added to the same list, the
 * guard would report them as pages about something ``@/ingot`` does not
 * export — and the only way to silence it would be to loosen that
 * bidirectionality. That would lose the one thing that forces the doc web
 * to stay complete.
 *
 * Two lists, then, on purpose: ``INGOT_DOC_PAGES`` stays strictly 1 : 1,
 * ``INGOT_GUIDE_PAGES`` is for everything else.
 */
export interface IngotGuideSection {
  /** Anchor in the right column. Not translated — it is a link target. */
  id: string;
  title: Localized<string>;
  body: Localized<ReactNode>;
}

/**
 * Group in the left menu.
 *
 * Three of them are for the reader who is BUILDING something: what the kit
 * is (``system``), how screens are made from it (``app``), and what is
 * expected of the screen (``rules``).
 *
 * ``authors`` is the fourth and it is a different audience, not a fourth
 * topic. It answers "what am I allowed to do to the kit", which is a
 * question only a contributor has — and it used to sit among the usage
 * rules, where everybody else had to walk past it. It comes last in the
 * menu for the same reason.
 */
export type IngotGuideGroup = "system" | "app" | "rules" | "authors";

export interface IngotGuidePage {
  /** The part of the hash after ``#/`` — ``uvod``, ``preklady``. Not
   *  translated: it is a route, and a translated slug would break shared links. */
  slug: string;
  /**
   * Which part of the menu the page belongs to. Required: a guide without a
   * group would have nowhere to go in the numbered menu, and a default
   * group would just silently make that choice for the author.
   */
  group: IngotGuideGroup;
  /** Page heading and menu label. */
  title: Localized<string>;
  /** One sentence under the heading. */
  summary: Localized<string>;
  sections: readonly IngotGuideSection[];
}

export interface IngotPropRow {
  /** Prop name as written in JSX. Not translated — it is code. */
  name: string;
  /** The type, abbreviated — the column is for orientation, not a substitute for `.tsx`. */
  type: string;
  /** Optional props carry a different weight in the table than required ones. */
  required: boolean;
  /** One sentence: what it is for, not what it does. */
  note: Localized<ReactNode>;
}

/**
 * Props of a type that does not live on the component ITSELF.
 *
 * ``IngotTable`` takes ``columns: readonly IngotColumn<Row>[]`` — and
 * everything a column is really configured with (``cell``, ``align``,
 * ``cellClassName``) is inside that type. In the component's props table
 * only a single ``columns`` row with one sentence in the note would remain,
 * so those props would not be findable on the doc web at all.
 */
export interface IngotExtraPropGroup {
  /** Type name as written (``IngotColumn<Row>``). */
  name: string;
  /** One sentence: through which component prop the type is passed. */
  note: Localized<ReactNode>;
  props: readonly IngotPropRow[];
}

export interface IngotDocPage {
  /**
   * Export name from ``@/ingot``. The guard reads it from the registry and
   * from here — a mismatch fails the gate, so the menu and the guard
   * cannot drift apart.
   */
  name: string;
  /**
   * Status of the primitive — a badge next to the heading. ``stable`` means
   * "the API does not change without notice", ``beta`` "the shape is still
   * being found". Required on purpose: a page without a status would
   * silently promise stability.
   */
  status: "stable" | "beta" | "deprecated";
  /**
   * Set when ``status`` is ``deprecated``, and required then.
   *
   * The kit's old rule — "a breaking change rewrites every call site in the
   * same pull request" — assumed every caller lives in this repository. It
   * does not any more: the public web installs the package, and third-party
   * apps will. For those callers a removal without notice is a build that
   * stops on a Monday morning with no explanation.
   *
   * So a primitive leaves in three steps, and this field is the middle one:
   * it says WHEN the notice started, WHAT to use instead, and in which
   * version it goes away. A deprecation without ``removeIn`` is a warning
   * nobody can plan around, which is why the guard refuses it.
   */
  deprecated?: {
    /** The version the notice started in — "1.4". */
    since: string;
    /** What to use instead. Absent only when nothing replaces it. */
    replacedBy?: string;
    /** The version it disappears in — never sooner than two releases out. */
    removeIn: string;
  };
  /**
   * Version of the primitive — the second badge next to the heading. Not
   * translated, it is a number. Required for the same reason as ``status``.
   *
   * **Changing a component means bumping the version in the same commit.**
   * Changed behaviour under an unchanged version is a silent lie to
   * everyone who built the component in — and unlike a missing version,
   * nobody sees it. The rule is in ``CLAUDE.md``; this comment is its
   * reminder at the place where the value is written.
   */
  version: string;
  /**
   * Selector the element goes by in the design (``.btn``, ``.badge``).
   *
   * Shown next to the heading and on the overview tile, because it is the
   * only name the element can be discussed under with a designer — the
   * React export name is known only to code.
   */
  tag: string;
  /**
   * Tokens the component stands on.
   *
   * Not a list of everything that appears in the file, but a contract: a
   * change to any of them shows on this component everywhere in the
   * product. That is how a review tells what a token change breaks — hence
   * required, and hence its own section, not a sentence in accessibility.
   */
  tokens: readonly string[];
  /**
   * One sentence on what ``className`` may do here — layout only — or on
   * why the primitive does not take it at all.
   *
   * Required, because "does it take className?" is the question every
   * consumer asks first and the props table cannot answer it: a prop that
   * does not exist has no row. Without this field the answer would be
   * "read the source", which is exactly the barrier that makes the next
   * person write their own component.
   */
  classNameNote: Localized<string>;
  /** One sentence for the menu and above the demo. */
  summary: Localized<string>;
  /**
   * Live demo. MUST render the real component from ``@/ingot``.
   *
   * It is handed the reader's language, because a demo is part of the page
   * and a page that translates everything except the one thing the reader
   * is looking at is worse than one that translates nothing: it looks
   * finished. The demo holds its own texts as a ``Localized`` constant at
   * the top of the module, where the code listing shows them — the guard
   * refuses Czech anywhere else in a demo.
   */
  Demo: (props: { lang: DocLang }) => JSX.Element;
  /**
   * Source of that demo, printed under the "Show code" toggle.
   *
   * **Never write a string here by hand.** A copied listing looks like the
   * demo on the day it is written and lies silently from the next day on —
   * the same class of error that makes the guard enforce that ``Demo``
   * renders the real component.
   *
   * The only allowed source is a ``?raw`` import of **the same module**
   * that ``Demo`` comes from:
   *
   * ```ts
   * import { Demo } from "@/ingot-docs/demos/IngotTableDemo";
   * import demoSource from "@/ingot-docs/demos/IngotTableDemo?raw";
   * ```
   *
   * That removes the question "what keeps the listing and the demo from
   * being two different things": nothing can pull them apart, because it is
   * one file read twice. The ``ingot-doc-pages`` guard checks both
   * pairings so the pair cannot be disconnected quietly.
   *
   * Not translated on purpose — code is code.
   */
  demoSource: string;
  /**
   * When to reach for the primitive. Situations, not features — the reader
   * decides by what they are building, not by what the component can do.
   */
  useWhen: Localized<readonly ReactNode[]>;
  /**
   * When NOT to reach for it, and what to use instead. This half is the
   * more valuable one: a primitive used outside its domain is harder to
   * remove from the repo than it was to add.
   */
  avoidWhen: Localized<readonly ReactNode[]>;
  props: readonly IngotPropRow[];
  /** Props of types passed through ``props`` — see `IngotExtraPropGroup`. */
  extraProps?: readonly IngotExtraPropGroup[];
  /**
   * What the primitive holds for the caller and what it wants from them in
   * return. Not a list of ``aria-*`` attributes, but what a consumer must
   * know so as not to lower the bar.
   */
  a11y: Localized<readonly ReactNode[]>;
  /**
   * Which labels the component asks for already translated. Ingot has no
   * i18n namespace of its own — the caller always supplies the text.
   */
  i18n: Localized<readonly ReactNode[]>;
  /**
   * What the first version deliberately CANNOT do and waits for a concrete
   * requester.
   *
   * Optional: most primitives cover their whole domain. Where that does not
   * hold (``IngotTable``), the list of missing capabilities is part of the
   * documentation — otherwise the reader thinks they hit a bug and writes
   * a table of their own.
   */
  limits?: Localized<readonly ReactNode[]>;
}
