import {
  useEffect,
  useRef,
  type JSX,
  type MouseEvent,
  type ReactNode,
} from "react";

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
 * Sekce s víc obrazovkami je **tlačítko, ne odkaz**: rozbaluje mega menu
 * (``IngotMegaMenu``), takže nikam sama nevede — a proto nese
 * ``aria-expanded``, ne ``aria-current``. Sekce s JEDINOU obrazovkou je
 * naopak rovnou odkaz (``href``): menu s jednou položkou je krok navíc.
 * Zamčená sekce (``locked``) je ztlumené tlačítko se zámkem a klik volá
 * vysvětlení, ne navigaci.
 *
 * **Sekce se otevírá najetím i klikem** (rozhodnutí vlastníka
 * 2026-09-02, bod 02 — chování nasazené administrace). Klik jen otevírá,
 * nezavírá: ukazovátko projde přes tlačítko dřív, než dopadne klik,
 * takže panel už je v tu chvíli hoverem otevřený a toggle by ho zase
 * zhasnul. Zavírá odjezd myší (se 120ms prodlevou, aby cesta z tlačítka
 * do panelu nezhasla), klik mimo lištu, ``Escape`` a volající po
 * prokliku položky. Z klávesnice otevírá ``ArrowDown`` nebo ``Enter``.
 *
 * **Panel se kotví pod svou sekcí**, ne pod levým okrajem lišty:
 * ``renderMenu(key)`` se vykreslí do relativního obalu otevřené sekce.
 * S hover-otevíráním je to nutnost — panel u levého okraje by nutil
 * kurzor přejet přes triggery ostatních sekcí a cestou je otvírat.
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
  /**
   * Sekce s jedinou obrazovkou: rovnou odkaz, žádné menu. SPA volající
   * naviguje v ``onNavigate`` s ``preventDefault``; ``href`` zůstává
   * kvůli střednímu kliku.
   */
  href?: string;
  /** Klik na odkazovou sekci (``href``). */
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Sekce drží právě otevřenou obrazovku. U odkazové sekce nasadí
   * ``aria-current``; u menu sekce jen zvýraznění (tlačítko nikam
   * nevede, takže ``aria-current`` by lhalo — kde čtenář je, říká
   * ``aria-current`` na položce uvnitř menu).
   */
  current?: boolean;
  /**
   * Zamčená sekce (modul, který si tenant nezapnul): ztlumené tlačítko
   * se zámkem, klik volá ``onLockedClick`` místo menu či navigace.
   */
  locked?: boolean;
  /** Klik na zamčenou sekci — typicky modal s vysvětlením. */
  onLockedClick?: () => void;
  /** Odznak za popiskem — počet čekající práce u odkazové sekce. */
  badge?: ReactNode;
  /**
   * Ztlumená ODKAZOVÁ sekce — naviguje normálně, jen je jemně
   * odlišená (modul, jehož výlohou je stránka s bránou).
   */
  muted?: boolean;
  /**
   * Vlastní kotva testu sekce. Bez ní se odvodí
   * ``{testId}-section-{key}`` z kotvy lišty; existující testy a e2e
   * ale často drží vlastní jména a konverze je nemá přejmenovávat.
   */
  testId?: string;
}

/** Prodleva zavření po odjezdu myší — cesta z tlačítka do panelu nesmí zhasnout. */
const CLOSE_DELAY_MS = 120;

export function IngotTopNav({
  brand,
  menuButton,
  sections = [],
  openSection = null,
  onOpenSection,
  onCloseSection,
  renderMenu,
  actions,
  account,
  children,
  contentClassName,
  sectionsLabel,
  sectionsClassName,
  sectionsEnd,
  testId,
}: {
  /** Značka vlevo. Odznak režimu (např. platformy) patří sem. */
  brand: ReactNode;
  /** Tlačítko mobilního menu — kreslí se úplně vlevo, před brandem. */
  menuButton?: ReactNode;
  /** Sekce aplikace. Vejít se musí všechny na 1280 px — lišta se nezalamuje. */
  sections?: readonly IngotTopNavSection[];
  /** Klíč právě rozbalené sekce, nebo ``null``. Řízené zvenčí. */
  openSection?: string | null;
  /** Otevři sekci — volá se z hoveru, kliku i klávesnice. */
  onOpenSection?: (key: string) => void;
  /** Zavři otevřenou sekci — odjezd myší (po prodlevě), klik vedle, ``Escape``. */
  onCloseSection?: () => void;
  /**
   * Menu otevřené sekce — typicky ``IngotMegaMenu``. Kreslí se do
   * relativního obalu té sekce, takže panel stojí pod svým tlačítkem.
   */
  renderMenu?: (key: string) => ReactNode;
  /** Ikonové akce vpravo před účtem — zprávy, notifikace. */
  actions?: ReactNode;
  /** Účet úplně vpravo. Typicky ``IngotTopNavAccount``. */
  account?: ReactNode;
  /** Obsah pod lištou pozicovaný vůči ní (bannery, celolištové překryvy). */
  children?: ReactNode;
  /**
   * Třída vnitřního řádku — sem patří rám shellu (``mx-auto
   * max-w-[1440px]``, výška, odsazení). Ohraničení a plocha lišty
   * zůstávají na kitu, rám na shellu.
   */
  contentClassName?: string;
  /** Přeložený ``aria-label`` bloku sekcí — z lišty dělá pojmenovanou navigaci. */
  sectionsLabel?: string;
  /**
   * Třída obalu sekcí — typicky responsivní schování na mobilu
   * (``hidden lg:flex``), kde navigaci nese hamburger.
   */
  sectionsClassName?: string;
  /** Za poslední sekcí, uvnitř navigace — např. „Odemknout vše" day-1 režimu. */
  sectionsEnd?: ReactNode;
  testId?: string;
}): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);
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

  // Klik mimo lištu zavírá. Posluchač visí jen při otevřené sekci.
  useEffect(() => {
    if (openSection === null) return;
    function onDown(event: globalThis.MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        onCloseSection?.();
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openSection, onCloseSection]);

  return (
    <div
      ref={wrapperRef}
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
      <div className="border-b border-border bg-surface">
        <div className={cx("flex items-center gap-1 px-4 py-2.5", contentClassName)}>
        {menuButton}
        <div className="mr-3 flex items-center gap-2.5 text-base font-bold tracking-[-0.02em] text-ink">
          {brand}
        </div>
        <nav
          aria-label={sectionsLabel}
          className={cx("flex items-center gap-1", sectionsClassName)}
        >
        {sections.map((section) => {
          if (section.locked) {
            return (
              <button
                key={section.key}
                type="button"
                onClick={section.onLockedClick}
                className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm text-ink-4 hover:bg-surface-2 hover:text-ink-3"
                data-testid={
                  section.testId ?? (testId ? `${testId}-section-${section.key}` : undefined)
                }
              >
                {section.label}
                <IngotIcon name="lock" size={13} aria-hidden />
              </button>
            );
          }
          if (section.href !== undefined) {
            return (
              <a
                key={section.key}
                href={section.href}
                onClick={section.onNavigate}
                aria-current={section.current ? "page" : undefined}
                className={cx(
                  "inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-sm",
                  section.current
                    ? "bg-surface-2 font-medium text-ink"
                    : section.muted
                      ? "text-ink-4 hover:bg-surface-2 hover:text-ink-3"
                      : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                )}
                data-testid={
                  section.testId ?? (testId ? `${testId}-section-${section.key}` : undefined)
                }
              >
                {section.label}
                {section.badge}
              </a>
            );
          }
          const open = section.key === openSection;
          return (
            <div key={section.key} className="relative">
              <button
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
                    : section.current
                      ? "bg-surface-2 font-medium text-ink"
                      : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                )}
                data-testid={
                  section.testId ?? (testId ? `${testId}-section-${section.key}` : undefined)
                }
              >
                {section.label}
                <IngotIcon name="chevron-down" size={15} />
              </button>
              {open && renderMenu?.(section.key)}
            </div>
          );
        })}
        {sectionsEnd}
        </nav>
        <div className="flex-1" />
        {actions}
        {account}
        </div>
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
