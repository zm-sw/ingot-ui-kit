import { useEffect, useRef, useState, type JSX } from "react";
import { createPortal } from "react-dom";

import { cx } from "./cx";
import { IngotIcon } from "./IngotIcon";
import { MENU_LAYER } from "./modalLayer";
import { useIngotLabels } from "./IngotProvider";
import { createStore } from "./store";

/**
 * Imperative toast — spec Toast v1.0.
 *
 * Confirmation of an action's result that does not stop the work. The
 * division of overlays: editing → Drawer, confirmation → Modal, **result
 * → Toast**. The result of a save is a toast with an undo action, not a
 * "Done" modal.
 *
 * ## Why an imperative API, not JSX
 *
 * The result of an action is reported by the code that performed it — a
 * mutation, a handler, an effect. A declarative ``<Toast open={…}>`` would
 * force every caller to hold the "toast is visible" state and a timer of
 * its own; exactly the duplication the primitive exists to remove. You
 * call ``toast({ text, undo })``; display is handled by ONE mounted
 * ``<IngotToast />``.
 *
 * ## The store is a module, not a context
 *
 * The toast queue lives in a module store, not in React context, so
 * ``toast()`` can be called from anywhere — even outside the tree where no
 * provider exists. The price: a second mounted ``<IngotToast />`` would
 * render the same queue twice, so an application has exactly one (the doc
 * web demo keeps a local one).
 *
 * ## Timing
 *
 * 4 s by default; a toast with an undo action lives 8 s — the operator
 * must manage to read, understand and click. ``duration`` overrides both.
 *
 * ## A11y
 *
 * Region ``aria-live="polite"``; ``tone="danger"`` (an operation error)
 * announces ``assertive``. The toast stands bottom-left so it does not
 * cover the page's primary action (which lives top-right in the header).
 * In dark mode it gets a border — a per-component override from the
 * handoff: the toast's inverted surface would otherwise vanish on the dark
 * background.
 */

export interface IngotToastOptions {
  /** One sentence in the past tense — "Order saved." */
  text: string;
  /**
   * ``danger`` = an operation error ("Saving failed."). NOT form
   * validation — that belongs to the field, not the toast.
   */
  tone?: "default" | "danger";
  /** Undo action. Adds a button and extends the toast's life to 8 s. */
  undo?: () => void;
  /**
   * Label of the undo action. Defaults to the ``toastUndo`` entry of
   * ``IngotProvider`` — English when no provider is mounted.
   */
  undoLabel?: string;
  /**
   * How long the toast lives, in ms. Default 4000; with ``undo`` 8000.
   *
   * ``null`` means it stays until somebody closes it — for a result the
   * operator must acknowledge, not merely notice.
   */
  duration?: number | null;
}

interface ToastItem extends IngotToastOptions {
  id: number;
}

let nextId = 0;
const toasts = createStore<readonly ToastItem[]>([]);

function dismiss(id: number): void {
  toasts.set((items) => items.filter((item) => item.id !== id));
}

/** Reports an action's result. Displayed by the one mounted ``<IngotToast />``. */
export function toast(options: IngotToastOptions): void {
  nextId += 1;
  const item: ToastItem = { ...options, id: nextId };
  toasts.set((items) => [...items, item]);
}

function ToastCard({ item }: { item: ToastItem }): JSX.Element {
  const labels = useIngotLabels();
  const {
    id,
    text,
    tone = "default",
    undo,
    undoLabel = labels.toastUndo,
  } = item;
  const duration =
    item.duration === undefined ? (undo === undefined ? 4000 : 8000) : item.duration;

  // A countdown the reader can stop. WCAG 2.2.1 asks for a timed message to
  // be dismissable or extendable; a toast that carries an undo action asks
  // for it twice over, because the whole point is that the operator gets to
  // decide. Pointer or focus inside pauses; leaving resumes with the time
  // that was left, not with a fresh four seconds.
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration ?? 0);
  useEffect(() => {
    if (duration === null || paused) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => dismiss(id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt));
    };
  }, [id, duration, paused]);

  return (
    <div
      className={cx(
        "pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm shadow-lg dark:border dark:border-border-strong",
        tone === "danger" ? "bg-danger text-white dark:text-bg" : "bg-ink text-bg",
      )}
      data-testid="ingot-toast"
      data-tone={tone}
      data-paused={paused ? "" : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span>{text}</span>
      {undo !== undefined && (
        <button
          type="button"
          className="shrink-0 font-semibold underline underline-offset-2 hover:opacity-80"
          onClick={() => {
            undo();
            dismiss(id);
          }}
        >
          {undoLabel}
        </button>
      )}
      <button
        type="button"
        aria-label={labels.toastClose}
        onClick={() => dismiss(id)}
        className="-mr-1 shrink-0 rounded p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        data-testid="ingot-toast-close"
      >
        <IngotIcon name="close" size={14} />
      </button>
    </div>
  );
}

export function IngotToast({
  testId,
}: {
  /** `data-testid` of the toast region. */
  testId?: string;
}): JSX.Element {
  const current = toasts.use();
  const polite = current.filter((item) => item.tone !== "danger");
  const assertive = current.filter((item) => item.tone === "danger");

  // Portal into body for the same reason as the dialogs: a region rendered
  // inline would be buried under the page's stacking contexts. The layer is
  // above every dialog — an action's result must show even over an open
  // overlay.
  return createPortal(
    <div
      className="pointer-events-none fixed bottom-4 left-4 flex max-w-sm flex-col gap-2"
      style={{ zIndex: MENU_LAYER + 1 }}
      data-testid={testId}
    >
      <div aria-live="polite" className="flex flex-col gap-2 empty:hidden">
        {polite.map((item) => (
          <ToastCard key={item.id} item={item} />
        ))}
      </div>
      <div aria-live="assertive" className="flex flex-col gap-2 empty:hidden">
        {assertive.map((item) => (
          <ToastCard key={item.id} item={item} />
        ))}
      </div>
    </div>,
    document.body,
  );
}
