/**
 * Splitting TS/TSX into colour classes — the single source of highlighting
 * for ``IngotCode block lang="tsx"``.
 *
 * **A tokenizer of our own, not a library.** The kit is distributed as
 * source and has NOT ONE runtime dependency — ``package.json`` lists only
 * ``react`` and ``react-dom`` as peers. Adding shiki/prism/highlight.js
 * here would add a dependency to every consumer of the kit for the sake
 * of colouring a listing on the documentation web. A bad trade: a
 * highlighter handles dozens of languages, dialects and themes, while the
 * kit prints one thing — TSX demos of its own components.
 *
 * **It is not a parser and must not become one.** The scanner runs left
 * to right and keeps a single state: are we inside a JSX tag? That
 * distinguishes an attribute from an ordinary identifier, the one
 * ambiguity on which the colouring of demos would visibly fail. Everything
 * else is local patterns.
 *
 * The price of that simplicity is known: in TS an angle bracket is both
 * "less than" and a generic. It is taken as a tag only where JSX may
 * really start — after ``(``, ``{``, ``,``, ``=``, ``return`` and the
 * like. That is how ``useState<string>(…)`` stays a type and
 * ``<IngotTabs`` a tag.
 */

export type IngotCodeTokenKind =
  | "comment"
  | "string"
  | "keyword"
  | "tag"
  | "attr"
  | "number"
  | "punct"
  | "plain";

export interface IngotCodeToken {
  text: string;
  kind: IngotCodeTokenKind;
}

const KEYWORDS = new Set([
  "as", "async", "await", "break", "case", "catch", "class", "const",
  "continue", "default", "delete", "do", "else", "enum", "export",
  "extends", "false", "finally", "for", "from", "function", "if",
  "implements", "import", "in", "instanceof", "interface", "keyof", "let",
  "new", "null", "of", "readonly", "return", "satisfies", "static",
  "super", "switch", "this", "throw", "true", "try", "type", "typeof",
  "undefined", "var", "void", "while", "yield",
]);

// Where JSX may start. After an identifier, ``)`` or ``]`` an angle bracket
// is a comparison or a generic, not a tag.
const JSX_MAY_START_AFTER = new Set([
  "", "(", "{", "}", "[", ",", ";", ":", "=", ">", "&", "|", "?", "!", "+",
]);

const WS = /^\s+/;
const STRING =
  /^(?:"(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?|`(?:[^`\\]|\\.)*`?)/;
const NUMBER = /^\d[\w.]*/;
const WORD = /^[A-Za-z_$][\w$]*/;
const TAG_OPEN = /^<\/?(?=[A-Za-z])/;
const TAG_NAME = /^[A-Za-z][\w.]*/;
const PUNCT = /^[^\s\w$]/;

/** Splits the source into tokens; the joined ``text`` is always the input unchanged. */
export function highlightTsx(source: string): IngotCodeToken[] {
  const tokens: IngotCodeToken[] = [];
  // The last non-white character and the last word — only for the
  // "tag or less-than" decision.
  let lastChar = "";
  let lastWord = "";
  // Inside a tag identifiers are attributes — but only outside ``{…}``;
  // inside an expression it is ordinary code again.
  let inTag = false;
  let braceDepth = 0;
  let rest = source;

  const push = (text: string, kind: IngotCodeTokenKind): void => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind) last.text += text;
    else tokens.push({ text, kind });
    const trimmed = text.trimEnd();
    if (trimmed) lastChar = trimmed[trimmed.length - 1];
  };

  while (rest) {
    let match = WS.exec(rest);
    if (match) {
      // Whitespace does not touch ``lastChar`` — otherwise a line break
      // before ``<IngotTabs`` would forget that we are right after ``(``.
      const [text] = match;
      const last = tokens[tokens.length - 1];
      if (last && last.kind === "plain") last.text += text;
      else tokens.push({ text, kind: "plain" });
      rest = rest.slice(text.length);
      continue;
    }

    if (rest.startsWith("//")) {
      const end = rest.indexOf("\n");
      const text = end === -1 ? rest : rest.slice(0, end);
      push(text, "comment");
      rest = rest.slice(text.length);
      continue;
    }
    if (rest.startsWith("/*")) {
      const end = rest.indexOf("*/");
      const text = end === -1 ? rest : rest.slice(0, end + 2);
      push(text, "comment");
      rest = rest.slice(text.length);
      continue;
    }

    match = STRING.exec(rest);
    if (match) {
      push(match[0], "string");
      rest = rest.slice(match[0].length);
      lastWord = "";
      continue;
    }

    if (
      !inTag &&
      TAG_OPEN.test(rest) &&
      (JSX_MAY_START_AFTER.has(lastChar) || lastWord === "return")
    ) {
      const open = rest.startsWith("</") ? "</" : "<";
      push(open, "punct");
      rest = rest.slice(open.length);
      const name = TAG_NAME.exec(rest);
      if (name) {
        push(name[0], "tag");
        rest = rest.slice(name[0].length);
      }
      inTag = true;
      braceDepth = 0;
      lastWord = "";
      continue;
    }

    if (inTag && braceDepth === 0 && (rest.startsWith("/>") || rest[0] === ">")) {
      const close = rest.startsWith("/>") ? "/>" : ">";
      push(close, "punct");
      rest = rest.slice(close.length);
      inTag = false;
      lastWord = "";
      continue;
    }

    if (rest[0] === "{" || rest[0] === "}") {
      if (inTag) braceDepth += rest[0] === "{" ? 1 : -1;
      if (braceDepth < 0) braceDepth = 0;
      push(rest[0], "punct");
      rest = rest.slice(1);
      lastWord = "";
      continue;
    }

    match = NUMBER.exec(rest);
    if (match) {
      push(match[0], "number");
      rest = rest.slice(match[0].length);
      lastWord = "";
      continue;
    }

    match = WORD.exec(rest);
    if (match) {
      const word = match[0];
      push(
        word,
        KEYWORDS.has(word)
          ? "keyword"
          : inTag && braceDepth === 0
            ? "attr"
            : "plain",
      );
      rest = rest.slice(word.length);
      lastWord = word;
      continue;
    }

    match = PUNCT.exec(rest);
    const text = match ? match[0] : rest[0];
    push(text, "punct");
    rest = rest.slice(text.length);
    lastWord = "";
  }

  return tokens;
}
