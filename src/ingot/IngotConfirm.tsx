import {
  createContext,
  useCallback,
  useContext,
  useState,
  type JSX,
  type ReactNode,
} from "react";

import { Button } from "./Button";
import { IngotModal } from "./IngotModal";

/**
 * Confirmation dialog.
 *
 * Built on `IngotModal`, and that is the whole reason it exists as the
 * shell's second consumer: a confirm IS a modal with a fixed skeleton
 * (title, description, optional impact, two buttons). Because one place
 * holds that skeleton, every screen that asks "really?" gets the
 * accessibility bar — focus trap, ESC, scroll lock, labelled
 * `role="dialog"`, focus returned to the opener — without touching it.
 *
 * ## Two things beyond "a modal with two buttons"
 *
 * - **`impact`** — a slot for the computed consequence of the action,
 *   rendered in a bordered box under the description; the caller supplies
 *   the content.
 * - **Veto** — the content of the `impact` slot may REMOVE the confirm
 *   button and say why. Without it the dialog offered "Delete permanently"
 *   even where the server would refuse the step, and the operator learned
 *   the answer from an error message afterwards. A greyed-out button next
 *   to the reason reads as "wait a moment", so it is not offered at all.
 *
 * The veto belongs here although it is a step beyond a bare shell: it is a
 * general capability of a confirmation ("content may withdraw the
 * confirmation"), not domain knowledge — the dialog knows no entity and
 * no reason.
 *
 * ## Labels come from the caller
 *
 * The kit has no i18n namespace of its own, so every text including
 * `confirmLabel` / `cancelLabel` / `closeLabel` arrives translated.
 *
 * ## Buttons are the shared `Button`
 *
 * The dialog once carried a copy of the button classes, and the copy aged
 * exactly where it hurts most: `Button`'s `danger` variant has a
 * `dark:text-bg` exception because the dark `--danger` token LIGHTENS
 * (`#b91c1c` → `#f36464`) to stay readable as text, and white on that
 * lighter ground gives 3.08:1, below WCAG AA 4.5:1. The copied classes did
 * not have the exception, so the riskiest button in the product was the
 * least readable one in dark mode.
 *
 * Do not redraw these buttons by hand. A token's contrast moves with the
 * palette and one place gets fixed; a copy gets fixed wherever someone
 * remembers it.
 */

/**
 * The channel through which the `impact` slot's content withdraws the
 * confirmation.
 *
 * A context, not a prop: only the component inside the slot knows the
 * reason (it loads usage from the API), and it has no reference to the
 * dialog above it.
 */
const ConfirmVetoContext = createContext<(reason: ReactNode | null) => void>(
  () => {},
);

/** Call with a reason → the confirm button is not offered; `null` = no change. */
export function useConfirmVeto(): (reason: ReactNode | null) => void {
  return useContext(ConfirmVetoContext);
}

export function IngotConfirm({
  title,
  description,
  confirmLabel,
  cancelLabel,
  closeLabel,
  busy = false,
  onConfirm,
  onClose,
  testId,
  impact,
}: {
  /** Short title ("Delete permanently?"). `aria-labelledby` points at it. */
  title: string;
  /** What will happen. */
  description: ReactNode;
  /** Translated confirm verb ("Delete"). */
  confirmLabel: string;
  /** Translated cancel label ("Cancel"). */
  cancelLabel: string;
  /** Translated `aria-label` of the cross in the header. */
  closeLabel: string;
  /** Locks both buttons while the mutation runs. */
  busy?: boolean;
  onConfirm: () => void;
  /** Cancel · ESC · cross · click on the backdrop. */
  onClose: () => void;
  /** `data-testid` of the overlay; the buttons get `${testId}-confirm` / `-cancel`. */
  testId?: string;
  /** Computed impact; may withdraw the confirmation through `useConfirmVeto`. */
  impact?: ReactNode;
}): JSX.Element {
  // Wrapped in an object: a bare ReactNode passed to a useState setter
  // could be mistaken for an updater function. The setter's identity is
  // stable so a caller's effect does not loop.
  const [veto, setVeto] = useState<{ message: ReactNode } | null>(null);
  const setVetoReason = useCallback((reason: ReactNode | null) => {
    setVeto(reason == null ? null : { message: reason });
  }, []);

  return (
    <IngotModal
      title={title}
      onClose={onClose}
      closeLabel={closeLabel}
      width={448}
      testId={testId}
    >
      <div className="text-sm text-ink-2">{description}</div>
      {impact != null && (
        <div
          className="mt-3 rounded-md border border-border bg-bg p-3 text-sm"
          data-testid={testId ? `${testId}-impact` : undefined}
        >
          <ConfirmVetoContext.Provider value={setVetoReason}>
            {impact}
          </ConfirmVetoContext.Provider>
        </div>
      )}
      {veto && (
        <div
          className="mt-3 text-sm text-warn"
          role="alert"
          data-testid={testId ? `${testId}-blocked` : undefined}
        >
          {veto.message}
        </div>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={busy}
          data-testid={testId ? `${testId}-cancel` : undefined}
        >
          {cancelLabel}
        </Button>
        {/* A vetoed step does NOT offer the button at all — a greyed-out
            "Delete permanently" next to the reason reads as "wait a moment". */}
        {!veto && (
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            disabled={busy}
            data-testid={testId ? `${testId}-confirm` : undefined}
          >
            {confirmLabel}
          </Button>
        )}
      </div>
    </IngotModal>
  );
}
