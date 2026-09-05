import { useCallback, useId, useRef, type JSX, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { ModalDepthProvider } from "./ModalDepthContext";
import { OverlayHeader } from "./OverlayHeader";
import { useModalLayer } from "./modalLayer";
import {
  trapOverlayTab,
  useOverlayFocusReturn,
  useOverlayInitialFocus,
  useOverlayScrollLock,
} from "./overlayChrome";

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

// Trap/scroll lock/návrat fokusu bydlí v ``overlayChrome.ts`` — od KAN-655
// je sdílí s ``IngotDrawer``, aby čítač zámku scrollu platil přes oba typy
// překryvů najednou.

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

  useOverlayFocusReturn();
  useOverlayScrollLock();
  useOverlayInitialFocus(panelRef);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      trapOverlayTab(event, panelRef.current);
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
        <OverlayHeader
          title={title}
          subtitle={subtitle}
          titleId={titleId}
          subtitleId={subtitleId}
          onClose={onClose}
          closeLabel={closeLabel}
          sticky
          testId={testId}
        />
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
