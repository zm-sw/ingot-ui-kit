import { useId, useState, type JSX, type MouseEvent, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotEyebrow } from "./IngotEyebrow";
import { LockedRow, menuRowClass } from "./menuRow";
import { MENU_LAYER } from "./modalLayer";

/**
 * Rozbalené menu sekce z horní lišty — skupiny odkazů v jednom nebo
 * dvou sloupcích a náhledový sloupec vpravo.
 *
 * Tvar 2.0 přebírá nasazenou administraci (rozhodnutí vlastníka
 * 2026-09-02, body 01–03), ne opačně:
 *
 * - **Sloupce rostou z obsahu.** Do sedmi položek jeden sloupec, nad
 *   sedm dva (CSS columns; skupina se nezlomí uprostřed). Pevná
 *   třísloupcová mřížka z 1.0 dělala z většiny skutečných sekcí
 *   (1–8 položek) prázdnou tabulku.
 * - **Náhled sleduje položku pod kurzorem i pod fokusem.** Popisuje
 *   tu, na které čtenář stojí (``description``); dokud nestojí na
 *   žádné, popisuje první. Fokus přepíná náhled stejně jako myš —
 *   klávesnice není druhá kategorie.
 * - **Odečítač popis slyší z odkazu samotného.** Text náhledu je
 *   vizuální kopie; každý odkaz nese ``aria-describedby`` na element
 *   se SVÝM popisem, takže popis čte i ten, kdo náhledový sloupec
 *   nevidí. Sloupec sám je ``aria-hidden`` — jinak by odečítač slyšel
 *   všechno dvakrát.
 *
 * Otevřená sekce se v liště značí ``--surface-3``, ne akcentem: akcent
 * v téhle aplikaci znamená akci, a rozbalené menu žádná akce není.
 *
 * Ingot **nemá vlastní i18n namespace** — texty dodává volající.
 */

export interface IngotMegaMenuItem {
  href: string;
  label: string;
  /** Jedna věta o obrazovce. Kreslí se v náhledu a čte se odečítačem. */
  description?: string;
  /** Ikona před popiskem. Dekorativní — popisek nese význam. */
  icon?: ReactNode;
  /** Počet záznamů vpravo. Mono, protože je to číslo k porovnání. */
  count?: number;
  /** Právě otevřená položka. */
  current?: boolean;
  /**
   * Klik na odkaz. SPA volající tady zavolá router a ``preventDefault``;
   * ``href`` zůstává, aby fungoval střední klik a „otevřít v novém patře".
   */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Zamčená položka (např. modul, který si tenant zatím nezapnul).
   * Kreslí se VIDITELNĚ, ztlumeně a se zámkem, ale není to odkaz —
   * klik volá ``onLockedItemClick`` menu (typicky modal s vysvětlením).
   * Náhled pro ni funguje dál: popis je marketing té obrazovky.
   */
  locked?: boolean;
  /**
   * Ztlumená položka — NAVIGUJE normálně, jen je jemně odlišená
   * (např. modul, jehož výlohou je stránka s bránou; menu nezamyká).
   * Tvrdé zamčení bez navigace je ``locked``.
   */
  muted?: boolean;
  /**
   * Značka za popiskem, vpravo (tam, kde jinak stojí ``count``) —
   * třeba jiskra „tady je co objevit". Dekorativní.
   */
  marker?: ReactNode;
  /** Kotva testu položky — e2e kliká na konkrétní odkaz, ne na menu. */
  testId?: string;
}

export interface IngotMegaMenuGroup {
  /** Nadpis skupiny — mono verzálky. Bez něj se skupina kreslí bez hlavičky. */
  title?: string;
  items: readonly IngotMegaMenuItem[];
}

/** Nad tolik položek se odkazy lámou do dvou sloupců. */
const SINGLE_COLUMN_MAX = 7;

/** Geometry of an item row; colours come from menuRowClass. */
const ITEM_ROW = "flex items-center gap-2.5 rounded px-2 py-1.5 text-sm";

export function IngotMegaMenu({
  groups,
  art,
  label,
  onLockedItemClick,
  testId,
}: {
  /** Skupiny odkazů. Sloupce (1–2) si menu rozdělí samo podle počtu položek. */
  groups: readonly IngotMegaMenuGroup[];
  /** Kresba sekce nad textem náhledu — schematická, dekorativní. */
  art?: ReactNode;
  /** Přeložený ``aria-label`` menu. */
  label: string;
  /**
   * Klik na zamčenou položku (``locked``) — typicky otevře modal
   * s vysvětlením, co modul umí a jak se zapíná. Bez callbacku se
   * zamčená položka kreslí jen ztlumeně.
   */
  onLockedItemClick?: (item: IngotMegaMenuItem) => void;
  testId?: string;
}): JSX.Element {
  const descId = useId();
  const [previewHref, setPreviewHref] = useState<string | null>(null);

  const flat = groups.flatMap((group) => group.items);
  const preview =
    flat.find((item) => item.href === previewHref) ?? flat[0] ?? null;
  const twoColumns = flat.length > SINGLE_COLUMN_MAX;

  return (
    // ``left-0`` vůči relativnímu obalu SVÉ sekce (IngotTopNav 2.2
    // renderMenu) — panel stojí pod svým tlačítkem. Kotvení k levému
    // okraji lišty by s hover-otevíráním nutilo kurzor přejíždět cizí
    // triggery a cestou je otvírat.
    <div
      // MENU_LAYER, not a fixed z-index: a menu belongs above every open
      // dialog (see modalLayer.ts); a hard-coded 60 ended up under the
      // second dialog opened.
      className="absolute left-0 top-[calc(100%+6px)] flex gap-5 rounded-lg border border-border bg-surface p-3 shadow-lg"
      style={{ zIndex: MENU_LAYER }}
      data-testid={testId}
    >
      <nav
        aria-label={label}
        className={cx("min-w-[13rem]", twoColumns && "w-[26rem]")}
        style={twoColumns ? { columnCount: 2, columnGap: "1rem" } : undefined}
      >
        {groups.map((group, index) => (
          <section
            key={group.title ?? index}
            className="mb-2 break-inside-avoid last:mb-0"
          >
            {group.title && (
              <IngotEyebrow className="px-2 pb-1 pt-1.5">{group.title}</IngotEyebrow>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const previewed = preview !== null && item.href === preview.href;
                const describedBy =
                  previewed && preview.description ? descId : undefined;
                if (item.locked) {
                  return (
                    <li key={item.href}>
                      <LockedRow
                        onClick={() => onLockedItemClick?.(item)}
                        onMouseEnter={() => setPreviewHref(item.href)}
                        onFocus={() => setPreviewHref(item.href)}
                        aria-describedby={describedBy}
                        data-testid={item.testId}
                        className={cx(ITEM_ROW, "w-full text-left")}
                      >
                        {item.icon}
                        {item.label}
                      </LockedRow>
                    </li>
                  );
                }
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={item.onClick}
                      onMouseEnter={() => setPreviewHref(item.href)}
                      onFocus={() => setPreviewHref(item.href)}
                      aria-current={item.current ? "page" : undefined}
                      aria-describedby={describedBy}
                      data-testid={item.testId}
                      className={cx(
                        ITEM_ROW,
                        menuRowClass({ current: item.current, muted: item.muted }),
                      )}
                    >
                      {item.icon}
                      {item.label}
                      {item.count !== undefined && (
                        <span className="ml-auto font-mono text-[11px] text-ink-4">
                          {item.count}
                        </span>
                      )}
                      {item.marker !== undefined && (
                        <span className="ml-auto inline-flex" aria-hidden="true">
                          {item.marker}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
      {preview !== null && (
        <div
          aria-hidden="true"
          className="w-56 shrink-0 border-l border-border py-1.5 pl-4"
          data-testid={testId ? `${testId}-preview` : undefined}
        >
          {art}
          <p className={cx("text-[13px] font-medium text-ink", art !== undefined && "mt-2")}>
            {preview.label}
          </p>
          {preview.description && (
            <p className="mt-1 text-xs leading-snug text-ink-3">
              {preview.description}
            </p>
          )}
        </div>
      )}
      {/* ``aria-describedby`` cíl mimo aria-hidden náhled — odečítač ho
          smí číst, oko ho nepotřebuje (vizuálně týž text kreslí náhled). */}
      {preview !== null && preview.description && (
        <span id={descId} className="sr-only">
          {preview.description}
        </span>
      )}
    </div>
  );
}
