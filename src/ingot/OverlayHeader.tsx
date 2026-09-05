import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotIcon } from "./IngotIcon";

/**
 * Header of a dialog-like overlay: title (`<h2>` the panel's
 * `aria-labelledby` points at), optional subtitle (`aria-describedby`) and
 * the close button.
 *
 * Internal, not exported from the barrel. `IngotModal` and `IngotDrawer`
 * used to carry this markup twice, character for character; a change to
 * the close button or the subtitle's ARIA wiring had to be made in both
 * places and could be made in one. Behaviour (focus trap, scroll lock) is
 * shared in `overlayChrome.ts`; this is the shared markup.
 */
export function OverlayHeader({
  title,
  subtitle,
  titleId,
  subtitleId,
  onClose,
  closeLabel,
  sticky = false,
  testId,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Id the panel's `aria-labelledby` points at. */
  titleId: string;
  /** Id the panel's `aria-describedby` points at when `subtitle` is set. */
  subtitleId: string;
  onClose: () => void;
  /** Translated `aria-label` of the close button — the kit has no i18n. */
  closeLabel: string;
  /**
   * Modal: the panel scrolls as a whole, so the header sticks to its top.
   * Drawer: the body scrolls, the header is a fixed flex row.
   */
  sticky?: boolean;
  /** Base test id of the overlay; parts get `-subtitle` and `-close`. */
  testId?: string;
}): JSX.Element {
  return (
    <header
      className={cx(
        "flex items-start gap-2.5 border-b border-border bg-surface px-4 py-3",
        sticky ? "sticky top-0 z-10" : "shrink-0",
      )}
    >
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
  );
}
