import { type JSX, type ReactNode } from "react";

/**
 * Výčet (KAN-628) — odrážky, čísla, nebo holý seznam bez značek.
 *
 * Proč to není „jen `<ul>`": značka a odsazení k sobě patří. Ruční výčty
 * v repu se liší v obojím (`list-disc pl-5`, `list-disc pl-4`, `ml-4`,
 * někde `space-y-1`, jinde nic), takže dva seznamy vedle sebe nesedí —
 * a nikdo neví, který z nich je ten správný.
 *
 * `variant="plain"` je pro seznamy odkazů (navigace, obsah stránky), kde
 * je odrážka šum: pořadí i tak nese `<li>`, takže odečítač počet položek
 * ohlásí, jen se nekreslí puntík.
 *
 * Ingot **nemá vlastní i18n namespace** — položky dodává volající.
 */
export function IngotList({
  items,
  variant = "bullet",
  testId,
}: {
  items: readonly ReactNode[];
  /** `bullet` odrážky · `ordered` čísla · `plain` bez značek. */
  variant?: "bullet" | "ordered" | "plain";
  testId?: string;
}): JSX.Element {
  const shared = "space-y-1.5 text-sm text-ink-2";
  if (variant === "ordered") {
    return (
      <ol className={`list-decimal pl-5 ${shared}`} data-testid={testId}>
        {items.map((item, index) => (
          // Položky jsou statický obsah bez identity; pole se za běhu
          // nepřeskládá, takže index je tu stabilní klíč.
          <li key={index}>{item}</li>
        ))}
      </ol>
    );
  }
  return (
    <ul
      className={
        variant === "plain" ? shared : `list-disc pl-5 ${shared}`
      }
      data-testid={testId}
    >
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
