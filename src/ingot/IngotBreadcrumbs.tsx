import { type JSX } from "react";

/**
 * Drobečky nad hlavičkou stránky — kde jsem a jak zpátky.
 *
 * V aplikaci bez bočního menu nesou drobečky celou orientaci: horní
 * lišta říká, ve které sekci jsi, drobečky říkají, jak hluboko.
 *
 * 🪤 **Poslední článek není odkaz.** Je to místo, kde stojíš, a odkaz
 * sám na sebe je slib prokliku, který nikam nevede. Komponenta ho proto
 * vykreslí jako text, i kdyby volající ``href`` poslal.
 *
 * Na kořenové stránce sekce se drobečky nekreslí vůbec — jediný článek
 * neříká nic, co by hlavička neřekla líp.
 *
 * Ingot **nemá vlastní i18n namespace** — popisky dodává volající.
 */

export interface IngotCrumb {
  label: string;
  /** Adresa. Poslední článek ji mít nemusí — stejně se nevykreslí. */
  href?: string;
}

export function IngotBreadcrumbs({
  items,
  label,
  testId,
}: {
  /** Cesta odshora dolů. Jediný článek se nevykreslí. */
  items: readonly IngotCrumb[];
  /** Přeložený ``aria-label`` navigace. */
  label: string;
  testId?: string;
}): JSX.Element | null {
  if (items.length < 2) return null;
  return (
    <nav aria-label={label} data-testid={testId}>
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-ink-4">
                  /
                </span>
              )}
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined} className="text-ink">
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="hover:text-ink">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
