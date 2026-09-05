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
 * The shared dialog shell.
 *
 * It exists because the product once had fifty hand-rolled
 * `fixed inset-0` overlays and not one shared shell — and the missing
 * shell blocked a central fix: `ModalDepthContext` had to stay a fail-open
 * context that every modal wrapped by hand, because there was nowhere to
 * plug it in. This shell is that place: `ModalDepthProvider` is inside, so
 * depth applies to every dialog above it without the caller remembering.
 *
 * ## Designed from the hardest cases, not the first customer
 *
 * Two things the most complex screen taught, which a simple one never
 * would:
 *
 * - **Portal into `document.body`.** Rendered inline, the overlay's
 *   z-index only counts inside the nearest stacking context — a modal
 *   opened from a sticky matrix cell hid under the sticky cells of the
 *   rows below it.
 * - **`max-h-[90vh]` + the panel's own scroll** with a sticky header, so
 *   long content does not scroll the page under the overlay.
 *
 * ## Accessibility bar (owner's decision, 2026-08-25)
 *
 * Applies to EVERY overlay primitive, not only the modal: focus trap · ESC
 * closes · background scroll lock · `role="dialog"` + `aria-modal` +
 * `aria-labelledby` · focus returned to the opener.
 *
 * The kit has no i18n namespace of its own, so the translated label of the
 * close button comes from the caller.
 */

// Trap, scroll lock and focus return live in overlayChrome.ts, shared with
// IngotDrawer so the scroll-lock counter spans both kinds of overlay.

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
