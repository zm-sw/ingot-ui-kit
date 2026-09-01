import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type JSX,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { ModalDepthProvider } from "./ModalDepthContext";
import { IngotIcon } from "./IngotIcon";
import { useModalLayer } from "./modalLayer";

/**
 * Sdílená skořápka dialogu — druhé primitivum Ingotu (KAN-580).
 *
 * Vzniklo proto, že v repu byl **padesát** ručních `fixed inset-0` overlayů,
 * 33 souborů `*Modal*`/`*Dialog*`/`*Drawer*` a **ani jeden sdílený shell** —
 * a ta chybějící skořápka už jednou zablokovala centrální opravu:
 * `ModalDepthContext` (KAN-109) musel zůstat fail-open kontextem, který si
 * každý modal obaluje ručně, protože nebylo kde ho zapojit. Tenhle shell to
 * místo je: `ModalDepthProvider` je uvnitř, takže hloubka platí pro každý
 * dialog nad ním, aniž by si na ni volající musel vzpomenout.
 *
 * ## Návrh podle nejtěžších případů, ne podle prvního zákazníka
 *
 * Slovník vyzkoušený na nejsložitější stránce repa
 * (`pages/admin/platformProcessesUi.tsx` → `Modal`) sem přinesl dvě věci,
 * na které se nedá přijít od jednoduché obrazovky:
 *
 * - **Portál do `document.body`.** Renderovaný inline platí z-index overlaye
 *   jen uvnitř nejbližšího stacking kontextu — modal otevřený ze sticky buňky
 *   matice se schoval pod sticky buňky řádků pod sebou.
 * - **`max-h-[90vh]` + vlastní scroll panelu** se sticky hlavičkou, aby dlouhý
 *   obsah nescroloval stránkou pod overlayem.
 *
 * ## A11y laťka (rozhodnutí vlastníka 2026-08-25)
 *
 * Platí od teď pro **každé** další primitivum, ne jen pro modal:
 * focus trap · ESC zavírá · scroll lock pozadí · `role="dialog"` +
 * `aria-modal` + popisek přes `aria-labelledby` · návrat fokusu na spouštěč.
 *
 * Ingot **nemá vlastní i18n namespace** (totéž pravidlo jako
 * `IngotFieldInput`), takže přeložený popisek zavíracího tlačítka podstrčí
 * volající.
 */

/** Co smí dostat fokus. `tabindex="-1"` je programový cíl, ne zastávka Tabu. */
const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Kolik dialogů je právě otevřených a jaký byl `overflow` před prvním z nich.
 *
 * Modul, ne stav komponenty: vnořený dialog nesmí při zavření odemknout
 * scroll, pod kterým pořád stojí ten vnější. Původní hodnota se schovává při
 * přechodu 0 → 1, aby ji druhý dialog nepřepsal už uzamčeným `"hidden"`.
 */
let openDialogs = 0;
let bodyOverflowBeforeLock = "";

export function IngotModal({
  title,
  subtitle,
  onClose,
  children,
  footer,
  closeLabel,
  width = 480,
  bodyClassName = "p-4",
  testId,
}: {
  /** Vykreslí se do `<h2>`, na které ukazuje `aria-labelledby`. */
  title: ReactNode;
  /**
   * Druhý řádek hlavičky — drobečková cesta, kontext, od čeho se
   * odchyluješ.
   *
   * 🚨 **Není součástí `aria-labelledby`.** Přístupné jméno dialogu má
   * být krátké a stabilní; drobečková cesta („Sklad Praha / Regál 1 /
   * Police 2“) by z něj udělala odstavec, který čtečka přečte při
   * každém návratu fokusu do dialogu. Podtitulek si proto nese
   * `aria-describedby`, ne `-labelledby`.
   */
  subtitle?: ReactNode;
  /** Volá ESC, kliknutí do pozadí i zavírací tlačítko. */
  onClose: () => void;
  children: ReactNode;
  /**
   * Lišta akcí pod obsahem, oddělená linkou. Nescroluje s obsahem
   * (`sticky bottom-0`) — u vysokého formuláře je „Uložit“ jinak pod
   * ohybem a operátor ho hledá scrollováním.
   */
  footer?: ReactNode;
  /** Přeložený `aria-label` zavíracího tlačítka — Ingot překlady nemá. */
  closeLabel: string;
  /** Maximální šířka panelu v px. */
  width?: number;
  /**
   * Třídy obalu obsahu. Výchozí `p-4` sedí formulářům; dvousloupcový
   * layout, kde si odsazení nese každý sloupec sám a dělicí linka má
   * jít od kraje ke kraji, si předá `""`.
   */
  bodyClassName?: string;
  /** `data-testid` overlaye; panel dostane `${testId}-panel`. */
  testId?: string;
}): JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // Poslední otevřený dialog leží nahoře — pevný ``z-50`` na všech
  // nechal rozhodovat pořadí v DOM, které pořadí otevírání nekopíruje.
  const layer = useModalLayer();
  const subtitleId = `${titleId}-sub`;

  // Spouštěč se čte při mountu — po zavření se na něj fokus vrací. Bez toho
  // spadne fokus na <body> a čtečka i klávesnice začínají od začátku stránky.
  const openerRef = useRef<Element | null>(null);
  if (openerRef.current === null && typeof document !== "undefined") {
    openerRef.current = document.activeElement;
  }

  useEffect(() => {
    const opener = openerRef.current;
    return () => {
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);

  useEffect(() => {
    if (openDialogs === 0) {
      bodyOverflowBeforeLock = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    openDialogs += 1;
    return () => {
      openDialogs -= 1;
      if (openDialogs === 0) document.body.style.overflow = bodyOverflowBeforeLock;
    };
  }, []);

  // Fokus do dialogu hned po otevření. Když uvnitř nic fokusovatelného není
  // (čistě informační dialog), vezme ho panel sám — má ``tabIndex={-1}``.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel).focus();
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const stops = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (stops.length === 0) {
        // Není kam cyklit — Tab by fokus vynesl z dialogu ven.
        event.preventDefault();
        return;
      }
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 p-4"
      style={{ zIndex: layer }}
      // Zachytává se na overlayi, ne na dokumentu: dva otevřené dialogy nad
      // sebou by jinak na jeden ESC zavřely oba. Fokus je uvnitř panelu, takže
      // událost sem bublá jen z toho vrchního — a ten ji zastaví.
      onKeyDown={onKeyDown}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      data-testid={testId}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle === undefined ? undefined : subtitleId}
        tabIndex={-1}
        style={{ maxWidth: width }}
        className="max-h-[90vh] w-full overflow-auto rounded-lg border border-border bg-surface shadow-lg outline-none"
        data-testid={testId ? `${testId}-panel` : undefined}
      >
        <header className="sticky top-0 z-10 flex items-start gap-2.5 border-b border-border bg-surface px-4 py-3">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="m-0 text-[15px] font-semibold text-ink">
              {title}
            </h2>
            {subtitle !== undefined && (
              <div
                id={subtitleId}
                className="mt-1 text-xs text-ink-3"
                data-testid={testId ? `${testId}-subtitle` : undefined}
              >
                {subtitle}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-3 hover:text-ink"
            data-testid={testId ? `${testId}-close` : undefined}
          >
            <IngotIcon name="close" size={14} />
          </button>
        </header>
        <ModalDepthProvider>
          <div className={bodyClassName}>{children}</div>
          {footer !== undefined && (
            <div
              className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 border-t border-border bg-surface px-4 py-3"
              data-testid={testId ? `${testId}-footer` : undefined}
            >
              {footer}
            </div>
          )}
        </ModalDepthProvider>
      </div>
    </div>,
    document.body,
  );
}
