import { type JSX, type ReactNode } from "react";

import { highlightTsx, type IngotCodeTokenKind } from "./highlightTsx";

/**
 * A colour for every token role. ``plain`` deliberately has no class — it
 * inherits the listing's text colour, so ordinary code is "normal" and
 * only what carries meaning is highlighted.
 */
const TOKEN_CLASS: Record<IngotCodeTokenKind, string> = {
  comment: "italic text-code-comment",
  string: "text-code-string",
  keyword: "text-code-keyword",
  tag: "text-code-tag",
  attr: "text-code-attr",
  number: "text-code-number",
  punct: "text-code-punct",
  plain: "",
};

/**
 * Code in text — a `<code>` in a paragraph, or a full-width listing.
 *
 * It looks like a component with nothing to hold, yet it holds the one
 * thing hand-written listings fail at: **`block` must be able to scroll
 * sideways.** Code does not wrap, so without `overflow-x-auto` it either
 * overflows the page or someone "fixes" it by wrapping and breaks the
 * indentation.
 *
 * The content is **not translated** — it is code.
 */
export function IngotCode({
  children,
  block = false,
  lang,
  id,
  testId,
}: {
  children: ReactNode;
  /** A full-width listing instead of a `<code>` inside a sentence. */
  block?: boolean;
  /**
   * Highlight the syntax. The single value is intent, not unfinished
   * work: the kit prints its own TSX demos and the highlighter is written
   * for them (see ``highlightTsx``). Another language arrives once there
   * is a listing that needs it — a highlighter without a consumer is just
   * more code to maintain.
   */
  lang?: "tsx";
  /** Anchor of the listing — the target of `aria-controls` on the switch that reveals it. */
  id?: string;
  testId?: string;
}): JSX.Element {
  if (!block) {
    return (
      <code className="font-mono text-xs" id={id} data-testid={testId}>
        {children}
      </code>
    );
  }
  // Only text can be highlighted. ``children`` is a ``ReactNode``, so when
  // the caller passes elements there is nothing to tokenize — the listing
  // renders as it came. Silently, not with an exception: colour is
  // decoration, code is content.
  const source = lang && typeof children === "string" ? children : null;
  return (
    <pre
      id={id}
      className="overflow-x-auto rounded border border-border bg-surface p-3 text-xs"
      data-testid={testId}
    >
      <code className="font-mono">
        {source === null
          ? children
          : highlightTsx(source).map((token, index) => (
              <span key={index} className={TOKEN_CLASS[token.kind]}>
                {token.text}
              </span>
            ))}
      </code>
    </pre>
  );
}
