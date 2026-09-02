import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotIcon } from "./IngotIcon";

/**
 * Horní lišta aplikace — jediná navigace, kterou admin má.
 *
 * 🚨 **Admin nemá boční menu.** Nahoře je jeden řádek s brandem, sekcemi
 * a účtem; obsah pod ním jde na plnou šířku. Není to estetická volba:
 * konfigurační obrazovky téhle aplikace jsou široké tabulky, a sloupec
 * ukousnutý vlevo je sloupec, který v tabulce chybí. ``IngotSideNav``
 * zůstává pro dokumentaci a jiné rejstříky, ne pro rám aplikace.
 *
 * Sekce je **tlačítko, ne odkaz**: rozbaluje mega menu (``IngotMegaMenu``),
 * takže nikam sama nevede. Odkazy jsou až položky uvnitř toho menu — a
 * proto je otevřená sekce označená ``aria-expanded``, ne ``aria-current``.
 *
 * Lišta si nedrží, která sekce je otevřená. Drží to volající, protože
 * jen on ví, jestli se má menu zavřít po prokliku, po ``Esc`` nebo po
 * změně routy — a komponenta, která by to hádala, hádá špatně.
 *
 * Ingot **nemá vlastní i18n namespace** — popisky dodává volající
 * přeložené.
 */

export interface IngotTopNavSection {
  /** Klíč sekce — hodnota pro ``openSection``/``onToggleSection``. */
  key: string;
  /** Popisek sekce, 1–3 slova. */
  label: string;
}

export function IngotTopNav({
  brand,
  sections = [],
  openSection = null,
  onToggleSection,
  actions,
  account,
  children,
  testId,
}: {
  /** Značka vlevo. Odznak režimu (např. platformy) patří sem. */
  brand: ReactNode;
  /** Sekce aplikace. Vejít se musí všechny na 1280 px — lišta se nezalamuje. */
  sections?: readonly IngotTopNavSection[];
  /** Klíč právě rozbalené sekce, nebo ``null``. Řízené zvenčí. */
  openSection?: string | null;
  /** Klik na sekci. Dostane klíč i tehdy, když se sekce zavírá. */
  onToggleSection?: (key: string) => void;
  /** Ikonové akce vpravo před účtem — zprávy, notifikace. */
  actions?: ReactNode;
  /** Účet úplně vpravo. Typicky ``IngotTopNavAccount``. */
  account?: ReactNode;
  /** Mega menu rozbalené pod lištou. Pozicuje se vůči ní. */
  children?: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div className="relative" data-testid={testId}>
      <div className="flex items-center gap-1 border-b border-border bg-surface px-4 py-2.5">
        <div className="mr-3 flex items-center gap-2.5 text-base font-bold tracking-[-0.02em] text-ink">
          {brand}
        </div>
        {sections.map((section) => {
          const open = section.key === openSection;
          return (
            <button
              key={section.key}
              type="button"
              aria-expanded={open}
              onClick={() => onToggleSection?.(section.key)}
              className={cx(
                "inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm",
                open
                  ? "bg-surface-3 font-medium text-ink"
                  : "text-ink-2 hover:bg-surface-2 hover:text-ink",
              )}
              data-testid={testId ? `${testId}-section-${section.key}` : undefined}
            >
              {section.label}
              <IngotIcon name="chevron-down" size={15} />
            </button>
          );
        })}
        <div className="flex-1" />
        {actions}
        {account}
      </div>
      {children}
    </div>
  );
}

/**
 * Účet v pravém rohu lišty — iniciály a šipka.
 *
 * Iniciály, ne fotka: aplikaci používají provozy, kde účet často nemá
 * avatar, a prázdné kolečko vypadá jako chyba načtení.
 */
export function IngotTopNavAccount({
  initials,
  label,
  expanded = false,
  onClick,
  testId,
}: {
  /** Dvě písmena. Delší se do kolečka nevejde. */
  initials: string;
  /** Přeložený ``aria-label`` — odečítač jinak přečte jen iniciály. */
  label: string;
  /** Je menu účtu otevřené? */
  expanded?: boolean;
  onClick?: () => void;
  testId?: string;
}): JSX.Element {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface py-[5px] pl-[5px] pr-2.5"
      data-testid={testId}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-ink font-mono text-[11px] font-semibold text-bg">
        {initials}
      </span>
      <IngotIcon name="chevron-down" size={13} className="text-ink-3" />
    </button>
  );
}
