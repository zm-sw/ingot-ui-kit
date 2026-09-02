import { type JSX, type ReactNode } from "react";

import { highlightTsx, type IngotCodeTokenKind } from "./highlightTsx";

/**
 * Barva pro každou roli tokenu. ``plain`` schválně nemá třídu — dědí
 * barvu textu výpisu, takže běžný kód je „normální" a zvýrazněné je
 * jen to, co nese význam.
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
 * Kód v textu (KAN-628) — `<code>` v odstavci, nebo výpis přes celou šířku.
 *
 * Vypadá to jako komponenta, která nemá co držet, jenže drží tu jednu věc,
 * na které ruční výpisy padají: **`block` se musí umět posunout do strany.**
 * Kód se nezalamuje, takže bez `overflow-x-auto` buď přeteče mimo stránku,
 * nebo ho někdo „opraví" zalomením a rozbije odsazení.
 *
 * Obsah se **nepřekládá** — je to kód.
 */
export function IngotCode({
  children,
  block = false,
  lang,
  id,
  testId,
}: {
  children: ReactNode;
  /** Výpis přes celou šířku místo `<code>` uvnitř věty. */
  block?: boolean;
  /**
   * Obarvit syntaxi. Jediná hodnota je záměr, ne rozdělaná práce: kit
   * vypisuje vlastní TSX ukázky a obarvovač je psaný na ně (viz
   * ``highlightTsx``). Další jazyk přijde, až tu bude výpis, který ho
   * potřebuje — obarvovač bez konzumenta je jen víc kódu k údržbě.
   */
  lang?: "tsx";
  /** Kotva výpisu — cíl pro `aria-controls` u přepínače, který ho odkrývá. */
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
  // 🪤 Obarvit jde jen text. ``children`` je ``ReactNode``, takže když
  // volající pošle prvky, není co tokenizovat — výpis se vykreslí tak,
  // jak přišel. Tiše, ne výjimkou: barva je ozdoba, kód je obsah.
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
