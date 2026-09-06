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
 * Side panel for editing — spec Drawer v1.0.
 *
 * A drawer is for editing where the operator needs to see the list behind
 * it. The rule from the guide: **longer editing → drawer, not modal**;
 * content longer than two screens → a page of its own. Division of
 * overlays: editing → Drawer, confirmation → Modal, result → Toast — and
 * never two overlays on top of each other.
 *
 * The accessibility bar is the same as ``IngotModal``'s (owner's
 * decision, 2026-08-25): focus trap, ESC, scroll lock, ``role="dialog"`` +
 * ``aria-modal``, focus returned to the opener. The shared logic lives in
 * ``overlayChrome.ts`` — above all the scroll-lock counter, which must
 * span modal and drawer at once.
 *
 * The panel is a full-height flex column: header and footer always
 * visible, only the body scrolls. The footer with actions thus never
 * slides below the fold — on a tall form "Save" would otherwise have to be
 * found by scrolling.
 *
 * Portal into ``document.body`` for the same reason as the modal: an
 * overlay rendered inline from a sticky cell gets buried under the
 * stacking contexts of the rows below.
 */

/** Hard width ceiling from the spec — wider editing is a page, not a drawer. */
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
  /** Rendered into the `<h2>` that `aria-labelledby` points at. */
  title: ReactNode;
  /**
   * Second header line — context of the record being edited. Like in
   * ``IngotModal`` it carries ``aria-describedby``, not ``-labelledby``:
   * the accessible name should stay short and stable.
   */
  subtitle?: ReactNode;
  /** Called by ESC, the close button and (when ``dismissable``) a click on the backdrop. */
  onClose: () => void;
  children: ReactNode;
  /**
   * Action bar under the content. ALWAYS visible — the panel is a flex
   * column, so the footer does not scroll with the body and never slides
   * below the fold.
   */
  footer?: ReactNode;
  /** Translated `aria-label` of the close button — the kit has no translations. */
  closeLabel: string;
  /** Which side the panel slides in from. */
  side?: "right" | "left";
  /** Panel width in px. Default 400, hard ceiling 560. */
  width?: number;
  /**
   * Whether a click on the backdrop closes. Turn off for a form in
   * progress — one stray click would discard the work. ESC and the close
   * button always work.
   */
  dismissable?: boolean;
  /** `data-testid` of the overlay; the panel gets `${testId}-panel`. */
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
    // Same as IngotModal: the backdrop is a mouse convenience, the keyboard
    // path is ESC and the close button.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cx(
        "fixed inset-0 flex animate-ingot-fade-in bg-black/40 motion-reduce:animate-none",
        side === "left" ? "justify-start" : "justify-end",
      )}
      style={{ zIndex: layer }}
      // Caught on the overlay, not on the document — same reason as in
      // IngotModal: two open overlays on top of each other would otherwise
      // both close on one ESC.
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
          "flex h-full max-w-full flex-col border-border bg-surface shadow-lg outline-none motion-reduce:animate-none",
          // The panel slides in from the edge it belongs to; coming from
          // the other side would say it belongs there instead.
          side === "left"
            ? "animate-ingot-slide-in-left border-r"
            : "animate-ingot-slide-in-right border-l",
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
