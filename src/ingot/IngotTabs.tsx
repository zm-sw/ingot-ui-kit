import { useId, useRef, type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Přepínání pohledů na TENTÝŽ záznam (KAN-657) — spec Tabs v1.1,
 * ingot.css sekce 9.
 *
 * Řízená komponenta: ``value``/``onChange`` drží volající. Kit je
 * schválně bez routeru (doc web platil za react-router 7 660 B), takže
 * „hodnota v URL" NENÍ vnitřní záležitost komponenty — admin konzument
 * si ``value`` napojí na searchParams sám (vzorový snippet na doc
 * stránce). ``onChange`` nemění scroll pozici stránky: fokus se při
 * šipkách přesouvá s ``preventScroll``.
 *
 * Pravidla ze specu (hlídá doc stránka, ne kód): max. 6 tabů, popisky
 * 1–2 slova; kroky procesu = steps pattern, filtry = chip — taby na to
 * nejsou.
 *
 * A11y: ``role="tablist"/"tab"/"tabpanel"``, roving tabindex (Tab
 * zastaví jen na aktivním tabu), šipky + Home/End přepínají. Aktivní
 * tab je poznat i bez barvy: podtržení + tučnost.
 */

export interface IngotTabItem {
  /** Klíč pohledu — hodnota pro ``value``/``onChange`` (a URL volajícího). */
  key: string;
  /** Popisek, 1–2 slova, dodaný přeložený. */
  label: string;
  /** Počet záznamů v pohledu — vykreslí se mono vedle popisku. */
  count?: number;
}

export function IngotTabs({
  items,
  value,
  onChange,
  children,
  label,
  testId,
}: {
  /** Pohledy. Max. 6 — víc pohledů už je jiná stránka, ne tab. */
  items: readonly IngotTabItem[];
  /** Klíč aktivního pohledu. Řízené zvenčí — typicky z URL volajícího. */
  value: string;
  /** Přepnutí pohledu. Nesmí měnit scroll pozici stránky. */
  onChange: (key: string) => void;
  /** Obsah aktivního pohledu — vykreslí se jako ``tabpanel``. */
  children?: ReactNode;
  /** Přeložený ``aria-label`` seznamu tabů — Ingot překlady nemá. */
  label?: string;
  /** `data-testid` tablistu; tab dostane `${testId}-tab-${key}`. */
  testId?: string;
}): JSX.Element {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.key === value),
  );
  const panelId = `${baseId}-panel`;
  const tabId = (key: string) => `${baseId}-tab-${key}`;

  const moveTo = (index: number) => {
    const item = items[(index + items.length) % items.length];
    onChange(item.key);
    const next = listRef.current?.querySelector<HTMLElement>(
      `[id="${tabId(item.key)}"]`,
    );
    // preventScroll: přepnutí pohledu nesmí odscrolovat stránku jinam.
    next?.focus({ preventScroll: true });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveTo(activeIndex + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveTo(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(items.length - 1);
        break;
    }
  };

  return (
    <div>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex gap-1 border-b border-border"
        data-testid={testId}
      >
        {items.map((item) => {
          const active = item.key === value;
          return (
            <button
              key={item.key}
              id={tabId(item.key)}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={children === undefined ? undefined : panelId}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(item.key)}
              className={cx(
                "-mb-px inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm",
                active
                  ? "border-ink font-semibold text-ink"
                  : "border-transparent text-ink-3 hover:text-ink",
              )}
              data-testid={testId ? `${testId}-tab-${item.key}` : undefined}
            >
              {item.label}
              {item.count !== undefined && (
                <span className="font-mono text-xs text-ink-3">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {children !== undefined && (
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(items[activeIndex]?.key ?? "")}
          className="pt-4"
          data-testid={testId ? `${testId}-panel` : undefined}
        >
          {children}
        </div>
      )}
    </div>
  );
}
