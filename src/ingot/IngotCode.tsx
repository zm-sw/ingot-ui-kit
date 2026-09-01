import { type JSX, type ReactNode } from "react";

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
  id,
  testId,
}: {
  children: ReactNode;
  /** Výpis přes celou šířku místo `<code>` uvnitř věty. */
  block?: boolean;
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
  return (
    <pre
      id={id}
      className="overflow-x-auto rounded border border-border bg-surface p-3 text-xs"
      data-testid={testId}
    >
      <code className="font-mono">{children}</code>
    </pre>
  );
}
