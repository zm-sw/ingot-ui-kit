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
  /** Rendered into the `<h2>` that `aria-labelledby` points at. */
  title: ReactNode;
  /**
   * Second header line — a breadcrumb trail, the context you are
   * departing from.
   *
   * **Not part of `aria-labelledby`.** The dialog's accessible name should
   * be short and stable; a breadcrumb trail ("Warehouse Prague / Rack 1 /
   * Shelf 2") would turn it into a paragraph the reader hears every time
   * focus returns to the dialog. The subtitle therefore carries
   * `aria-describedby`, not `-labelledby`.
   */
  subtitle?: ReactNode;
  /** Called by ESC, a click on the backdrop and the close button. */
  onClose: () => void;
  children: ReactNode;
  /**
   * Action bar under the content, separated by a line. Does not scroll
   * with the content (`sticky bottom-0`) — on a tall form "Save" would
   * otherwise be below the fold and the operator scrolls to find it.
   */
  footer?: ReactNode;
  /** Translated `aria-label` of the close button — the kit has no translations. */
  closeLabel: string;
  /** Maximum panel width in px. */
  width?: number;
  /**
   * Classes of the content wrapper. The default `p-4` suits forms; a
   * two-column layout where each column carries its own padding and the
   * divider must run edge to edge passes `""`.
   */
  bodyClassName?: string;
  /** `data-testid` of the overlay; the panel gets `${testId}-panel`. */
  testId?: string;
}): JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // The last opened dialog lies on top — a fixed ``z-50`` on all of them
  // let the DOM order decide, which does not follow the opening order.
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
    // The backdrop is a mouse convenience; the keyboard path is ESC and the
    // close button, both measured in tests/IngotModal.test.tsx.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 p-4"
      style={{ zIndex: layer }}
      // Caught on the overlay, not on the document: two open dialogs on top
      // of each other would otherwise both close on one ESC. Focus is inside
      // the panel, so the event bubbles here only from the top one — and
      // that one stops it.
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
