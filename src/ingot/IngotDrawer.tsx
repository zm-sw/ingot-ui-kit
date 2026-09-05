import { useCallback, useId, useRef, type JSX, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cx } from "./cx";
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
 * Boční panel pro editaci (KAN-655) — spec Drawer v1.0, ingot.css sekce 11.
 *
 * Drawer je pro editaci, u které operátor potřebuje vidět seznam za ní.
 * Pravidlo z Pravidel: **delší editace → drawer, ne modal**; obsah delší
 * než dvě obrazovky → samostatná stránka. Dělba překryvů: editace →
 * Drawer, potvrzení → Modal, výsledek → Toast — a nikdy dva překryvy
 * nad sebou.
 *
 * A11y laťka je stejná jako u ``IngotModal`` (rozhodnutí vlastníka
 * 2026-08-25): focus trap, ESC, scroll lock, ``role="dialog"`` +
 * ``aria-modal``, návrat fokusu na spouštěč. Sdílená logika bydlí v
 * ``overlayChrome.ts`` — hlavně čítač zámku scrollu, který musí platit
 * přes modal i drawer najednou.
 *
 * Panel je flex sloupec na plnou výšku: hlavička a patka jsou vždy
 * vidět, scroluje jen tělo. Patka s akcemi se tak netlačí pod ohyb —
 * u vysokého formuláře je „Uložit" jinak potřeba hledat scrollováním.
 *
 * Portál do ``document.body`` ze stejného důvodu jako u modalu: overlay
 * renderovaný inline ze sticky buňky se pohřbí pod stacking kontexty
 * řádků pod sebou.
 */

/** Tvrdý strop šířky ze specu — širší editace už je stránka, ne drawer. */
const MAX_DRAWER_WIDTH = 560;

export function IngotDrawer({
  title,
  subtitle,
  onClose,
  children,
  footer,
  closeLabel,
  side = "right",
  width = 400,
  dismissable = true,
  testId,
}: {
  /** Vykreslí se do `<h2>`, na které ukazuje `aria-labelledby`. */
  title: ReactNode;
  /**
   * Druhý řádek hlavičky — kontext editovaného záznamu. Stejně jako u
   * ``IngotModal`` nese ``aria-describedby``, ne ``-labelledby``:
   * přístupné jméno má zůstat krátké a stabilní.
   */
  subtitle?: ReactNode;
  /** Volá ESC, zavírací tlačítko a (při ``dismissable``) klik do pozadí. */
  onClose: () => void;
  children: ReactNode;
  /**
   * Lišta akcí pod obsahem. Je VŽDY viditelná — panel je flex sloupec,
   * takže patka nescroluje s tělem a netlačí se pod ohyb.
   */
  footer?: ReactNode;
  /** Přeložený `aria-label` zavíracího tlačítka — Ingot překlady nemá. */
  closeLabel: string;
  /** Ze které strany panel vyjíždí. */
  side?: "right" | "left";
  /** Šířka panelu v px. Výchozí 400, tvrdý strop 560. */
  width?: number;
  /**
   * Jestli klik do pozadí zavírá. U rozepsaného formuláře vypnout —
   * jeden klik vedle by zahodil rozdělanou práci. ESC a zavírací
   * tlačítko fungují vždy.
   */
  dismissable?: boolean;
  /** `data-testid` overlaye; panel dostane `${testId}-panel`. */
  testId?: string;
}): JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
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
      className={cx(
        "fixed inset-0 flex bg-black/40",
        side === "left" ? "justify-start" : "justify-end",
      )}
      style={{ zIndex: layer }}
      // Zachytává se na overlayi, ne na dokumentu — stejný důvod jako u
      // IngotModal: dva otevřené překryvy nad sebou by jinak na jeden ESC
      // zavřely oba.
      onKeyDown={onKeyDown}
      onMouseDown={(event) => {
        if (dismissable && event.target === event.currentTarget) onClose();
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
        style={{ width: Math.min(width, MAX_DRAWER_WIDTH) }}
        className={cx(
          "flex h-full max-w-full flex-col border-border bg-surface shadow-lg outline-none",
          side === "left" ? "border-r" : "border-l",
        )}
        data-testid={testId ? `${testId}-panel` : undefined}
      >
        <OverlayHeader
          title={title}
          subtitle={subtitle}
          titleId={titleId}
          subtitleId={subtitleId}
          onClose={onClose}
          closeLabel={closeLabel}
          testId={testId}
        />
        <ModalDepthProvider>
          <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
          {footer !== undefined && (
            <div
              className="flex shrink-0 flex-wrap items-center gap-2 border-t border-border bg-surface px-4 py-3"
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
