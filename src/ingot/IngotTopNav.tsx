import { useEffect, useRef, type JSX, type ReactNode } from "react";

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
 * **Sekce se otevírá najetím i klikem** (rozhodnutí vlastníka
 * 2026-09-02, bod 02 — chování nasazené administrace). Klik jen otevírá,
 * nezavírá: ukazovátko projde přes tlačítko dřív, než dopadne klik,
 * takže panel už je v tu chvíli hoverem otevřený a toggle by ho zase
 * zhasnul. Zavírá odjezd myší (se 120ms prodlevou, aby cesta z tlačítka
 * do panelu nezhasla), ``Escape`` a volající po prokliku položky.
 * Z klávesnice otevírá ``ArrowDown`` nebo ``Enter``.
 *
 * Stav drží volající (``openSection`` + ``onOpenSection``/
 * ``onCloseSection``): jen on ví, jestli se menu zavírá po prokliku
 * nebo po změně routy. Prodlevu odjezdu ale měří lišta — je to detail
 * chování, ne stav.
 *
 * Ingot **nemá vlastní i18n namespace** — popisky dodává volající
 * přeložené.
 */

export interface IngotTopNavSection {
  /** Klíč sekce — hodnota pro ``openSection``/``onOpenSection``. */
  key: string;
  /** Popisek sekce, 1–3 slova. */
  label: string;
}

/** Prodleva zavření po odjezdu myší — cesta z tlačítka do panelu nesmí zhasnout. */
const CLOSE_DELAY_MS = 120;

export function IngotTopNav({
  brand,
  sections = [],
  openSection = null,
  onOpenSection,
  onCloseSection,
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
  /** Otevři sekci — volá se z hoveru, kliku i klávesnice. */
  onOpenSection?: (key: string) => void;
  /** Zavři otevřenou sekci — odjezd myší (po prodlevě) a ``Escape``. */
  onCloseSection?: () => void;
  /** Ikonové akce vpravo před účtem — zprávy, notifikace. */
  actions?: ReactNode;
  /** Účet úplně vpravo. Typicky ``IngotTopNavAccount``. */
  account?: ReactNode;
  /** Mega menu rozbalené pod lištou. Pozicuje se vůči ní. */
  children?: ReactNode;
  testId?: string;
}): JSX.Element {
  const closeTimer = useRef<number | null>(null);
  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      onCloseSection?.();
    }, CLOSE_DELAY_MS);
  };
  useEffect(() => cancelClose, []);

  return (
    <div
      className="relative"
      data-testid={testId}
      onMouseEnter={cancelClose}
      onMouseLeave={() => {
        if (openSection !== null) scheduleClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && openSection !== null) {
          cancelClose();
          onCloseSection?.();
        }
      }}
    >
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
              onClick={() => onOpenSection?.(section.key)}
              onMouseEnter={() => {
                cancelClose();
                onOpenSection?.(section.key);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  onOpenSection?.(section.key);
                }
              }}
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
