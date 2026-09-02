/**
 * Rozdělení TS/TSX na barevné třídy — jediný zdroj zvýraznění pro
 * ``IngotCode block lang="tsx"``.
 *
 * 🚨 **Vlastní tokenizér, ne knihovna.** Kit se distribuuje jako zdroják
 * a nemá ANI JEDNU běhovou závislost — ``package.json`` má jen ``react``
 * a ``react-dom`` jako peer. Přidat sem shiki/prism/highlight.js znamená
 * přidat závislost každému konzumentovi kitu kvůli obarvení výpisu na
 * dokumentačním webu. To je špatný obchod: highlighter řeší desítky
 * jazyků, dialekty a témata, kdežto kit vypisuje jedinou věc — TSX
 * ukázky vlastních komponent.
 *
 * 🪤 **Není to parser a nemá jím být.** Skener jede zleva doprava a drží
 * jediný stav: jsme uvnitř JSX značky? Rozliší tím atribut od běžného
 * identifikátoru, což je jediná nejednoznačnost, na které by obarvení
 * ukázek viditelně padalo. Vše ostatní jsou lokální vzory.
 *
 * Cena té jednoduchosti je známá: ostrá závorka je v TS i „menší než",
 * i generikum. Za značku se proto bere jen tam, kde JSX opravdu smí
 * začít — po ``(``, ``{``, ``,``, ``=``, ``return`` a spol. Díky tomu
 * ``useState<string>(…)`` zůstane typem a ``<IngotTabs`` značkou.
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

// Kde smí JSX začít. Po identifikátoru, ``)`` nebo ``]`` je ostrá
// závorka porovnání nebo generikum, ne značka.
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

/** Rozdělí zdroják na tokeny; spojený ``text`` je vždy vstup beze změny. */
export function highlightTsx(source: string): IngotCodeToken[] {
  const tokens: IngotCodeToken[] = [];
  // Poslední ne-bílý znak a poslední slovo — jen kvůli rozhodnutí
  // „značka, nebo menšítko".
  let lastChar = "";
  let lastWord = "";
  // Uvnitř značky jsou identifikátory atributy — ale jen mimo ``{…}``,
  // uvnitř výrazu je to zase běžný kód.
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
      // Bílé znaky se ``lastChar`` netýkají — jinak by odřádkování
      // před ``<IngotTabs`` zahodilo, že jsme právě po ``(``.
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
