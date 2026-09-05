import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotEyebrow } from "./IngotEyebrow";
import { menuRowClass } from "./menuRow";

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
  /**
   * Pořadové číslo před popiskem — mono, tabulární, ne součást popisku.
   * Odečítač ho čte jako součást odkazu, což je správně: „02 Komponenty"
   * je i v řeči kratší orientace než samotné jméno.
   */
  ordinal?: string;
  /**
   * Podpoložky vnořené POD tuhle položku, ve vlastním `<ul>`.
   *
   * Vnoření je struktura, ne odsazení: odečítač ohlásí druhý seznam
   * a jeho počet položek, takže je z něj poznat, že patří k rodiči —
   * což plochý seznam s větším `padding-left` neumí.
   */
  children?: readonly IngotNavItem[];
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
      <IngotEyebrow tone="muted" className="mb-2">
        {label}
      </IngotEyebrow>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={cx(
                "flex items-baseline gap-2 rounded border px-2.5 py-1.5 text-sm",
                menuRowClass({ current: item.current, surface: "page" }),
              )}
              data-testid={item.testId}
            >
              {item.ordinal !== undefined && (
                <span
                  className={cx(
                    "font-mono text-[10.5px] tabular-nums",
                    item.current ? "text-ink-3" : "text-ink-4",
                  )}
                >
                  {item.ordinal}
                </span>
              )}
              {item.label}
            </a>
            {item.children && item.children.length > 0 && (
              <ul className="mt-0.5 space-y-0.5">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <a
                      href={child.href}
                      aria-current={child.current ? "page" : undefined}
                      className={cx(
                        "relative block rounded py-1 pl-[22px] pr-2 text-[13px]",
                        // A current child is marked by the bar on its left, not
                        // by a background — nesting reads better without a
                        // second highlighted box under the parent's.
                        child.current
                          ? "font-medium text-ink before:absolute before:bottom-1 before:left-[9px] before:top-1 before:w-0.5 before:bg-ink before:content-['']"
                          : menuRowClass({ dim: true }),
                      )}
                      data-testid={child.testId}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
