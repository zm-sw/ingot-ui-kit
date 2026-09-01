import { type JSX, type ReactNode } from "react";

/**
 * Prázdný stav (KAN-585) — dodává se spolu s `IngotTable`, ne zvlášť.
 *
 * Prázdný stav má prakticky každá list-shaped obrazovka a bez něj je tabulka
 * nekompletní; oddělit je znamená dvakrát navrhovat totéž rozhraní. Proto
 * jeden tiket a jeden pár.
 *
 * Použitelný i mimo tabulku (karta, panel) — proto je to samostatná
 * komponenta, ne prop `IngotTable`.
 *
 * Ingot **nemá vlastní i18n namespace**, takže texty přicházejí už přeložené.
 */
export function IngotEmptyState({
  title,
  description,
  action,
  testId,
}: {
  /** Jedna věta, co tu není („Zatím tu nic není"). */
  title: ReactNode;
  /** Volitelně proč / co s tím. */
  description?: ReactNode;
  /** Volitelná afordance („Přidat první položku"). */
  action?: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="flex flex-col items-center gap-1 px-4 py-8 text-center"
      data-testid={testId}
    >
      <p className="text-sm font-medium text-ink-2">{title}</p>
      {description != null && (
        <p className="max-w-prose text-sm text-ink-3">{description}</p>
      )}
      {action != null && <div className="mt-2">{action}</div>}
    </div>
  );
}
