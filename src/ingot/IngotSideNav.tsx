import { type JSX, type ReactNode } from "react";

/**
 * Boční menu (KAN-628) — pojmenovaná skupina odkazů, jeden z nich aktivní.
 *
 * Drží tři věci, které se ručně opisují špatně:
 *
 * 1. **`<nav>` má popisek.** Na stránce s víc než jednou navigací je
 *    `aria-label` to jediné, čím je odečítač od sebe rozezná — jinak
 *    uživatel slyší „navigace" dvakrát a neví, která je která.
 * 2. **Aktivní položka nese `aria-current="page"`,** ne jen jinou barvu.
 *    Zvýraznění barvou je informace, kterou odečítač nevidí.
 * 3. **Odkaz je `<a>`,** ne `<div onClick>`. Prostřední tlačítko myši,
 *    „otevřít v novém panelu" i klávesnice pak fungují samy.
 *
 * Routování si drží volající: `href` je hotová adresa. Primitivum tak
 * nezná router a nesmí ho přitáhnout do bundlu — což je celý důvod, proč
 * `IngotPageHeader` vedle něj vznikl.
 *
 * Ingot **nemá vlastní i18n namespace** — `label` i popisky položek
 * dodává volající už přeložené.
 */
export interface IngotNavItem {
  /** Hotová adresa. Primitivum ji nesestavuje ani nevaliduje. */
  href: string;
  label: ReactNode;
  /** Právě zobrazená položka. Dostane `aria-current="page"`. */
  current?: boolean;
  testId?: string;
}

export function IngotSideNav({
  label,
  items,
  testId,
}: {
  /** `aria-label` navigace — povinný, viz docstring. */
  label: string;
  items: readonly IngotNavItem[];
  testId?: string;
}): JSX.Element {
  return (
    <nav aria-label={label} data-testid={testId}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-3">
        {label}
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={
                item.current
                  ? "block rounded bg-accent-bg px-2 py-1 text-sm text-accent-ink"
                  : "block rounded px-2 py-1 text-sm text-ink-2 hover:bg-surface-2"
              }
              data-testid={item.testId}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
