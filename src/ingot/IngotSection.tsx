import { type JSX, type ReactNode } from "react";

/**
 * Sekce obrazovky (KAN-628) — nadpis a to, co pod něj patří.
 *
 * Drží dvě věci, které se ručně rozejdou vždycky:
 *
 * 1. **Úroveň nadpisu odpovídá zanoření.** `<h2>` uvnitř sekce, `<h3>`
 *    v podsekci. Odečítač obrazovky se podle úrovní orientuje; přeskočená
 *    úroveň (`h1` → `h3`) mu rozbije osnovu stránky.
 * 2. **`id` je na sekci, ne na nadpisu.** Kotva pak skočí nad nadpis, ne
 *    doprostřed textu — a obsah stránky na ni může odkázat.
 *
 * Ingot **nemá vlastní i18n namespace** — `title` dodává volající.
 */
export function IngotSection({
  id,
  title,
  level = 2,
  children,
  testId,
}: {
  /** Kotva sekce. Bez ní na sekci nejde odkázat z obsahu stránky. */
  id?: string;
  title: ReactNode;
  /** Úroveň nadpisu. MUSÍ odpovídat zanoření, ne velikosti písma. */
  level?: 2 | 3;
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  const Heading = level === 3 ? "h3" : "h2";
  return (
    <section id={id} className="space-y-3" data-testid={testId}>
      <Heading
        className={
          level === 3
            ? "text-sm font-semibold text-ink"
            : "text-lg font-semibold text-ink"
        }
      >
        {title}
      </Heading>
      {children}
    </section>
  );
}
