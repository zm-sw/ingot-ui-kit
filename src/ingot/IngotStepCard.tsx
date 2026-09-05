import { useId, useState, type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IconButton } from "./IconButton";
import { IngotEyebrow } from "./IngotEyebrow";
import { IngotIcon } from "./IngotIcon";

/**
 * A card for one step of a multi-step setup.
 *
 * Configuration in this product is not one long form but steps that can be
 * completed on different days by different people. The card therefore
 * carries its state permanently — a finished step stays finished and is
 * visible on returning to the screen.
 *
 * **A finished step is recognised by shape, not colour alone.** The green
 * header comes with a check mark instead of the number; whoever cannot
 * tell the colour reads the shape. Colour alone could not carry this
 * state — it is the one piece of information people come back to the
 * screen for.
 *
 * **The footer is for adding another item, not for confirming the step.**
 * A step is not confirmed by a button — it is done when it has what it
 * needs. A "Done" button would introduce a second state unrelated to the
 * card's content.
 *
 * The kit has no i18n namespace of its own — texts arrive translated.
 */

export function IngotStepCard({
  step,
  kicker,
  title,
  meta,
  done = false,
  doneLabel,
  collapsible = false,
  toggleLabel,
  children,
  footer,
  testId,
}: {
  /** Step number, two digits ("02"). A finished step replaces it with a check mark. */
  step: string;
  /** Line above the title — mono uppercase, typically "Step 02". */
  kicker: string;
  title: ReactNode;
  /**
   * Addition after the title — item count, unit ("2 / 2 active"). On a
   * collapsible card it is all that remains of a collapsed step, so it
   * belongs to a summary of the content, not decoration.
   */
  meta?: ReactNode;
  done?: boolean;
  /** Translated state label for a screen reader ("Done"). */
  doneLabel?: string;
  /**
   * Adds a button to the header that hides the body and the footer.
   * Finished steps collapse by themselves — see `open` below.
   */
  collapsible?: boolean;
  /** Translated label of the collapse button ("Collapse step"). */
  toggleLabel?: string;
  children: ReactNode;
  /** Footer — typically one "Add…" action. */
  footer?: ReactNode;
  testId?: string;
}): JSX.Element {
  const bodyId = useId();
  const [open, setOpen] = useState(!done);

  // The collapse of a finished step is state, but DERIVED from `done`: a
  // step that finishes on screen must collapse at once, otherwise
  // "automatically" would mean "after a reload" and the next step would
  // never come into view by itself. A manual toggle in between stays — it
  // is overridden only by the next change of `done`, i.e. new information,
  // not a re-render.
  const [syncedDone, setSyncedDone] = useState(done);
  if (syncedDone !== done) {
    setSyncedDone(done);
    setOpen(!done);
  }

  // A non-collapsible card has no state. Without this an earlier `open`
  // would hide the content of a card that never asked to collapse.
  const shown = !collapsible || open;

  return (
    <div
      className="overflow-hidden rounded-md border border-border bg-surface"
      data-testid={testId}
    >
      <div
        className={cx(
          "flex gap-3.5 border-b px-[18px] py-4",
          done
            ? "border-ok-border bg-ok-bg"
            : "border-border bg-surface-2",
        )}
      >
        <span
          className={cx(
            "grid h-[26px] w-[26px] flex-none place-items-center rounded-full border font-mono text-xs",
            done
              ? "border-ok bg-ok text-white"
              : "border-border-strong text-ink-3",
          )}
        >
          {done ? (
            <>
              <IngotIcon name="check" size={14} title={doneLabel} />
            </>
          ) : (
            step
          )}
        </span>
        <div className="min-w-0">
          <IngotEyebrow tone={done ? "ok" : "neutral"}>{kicker}</IngotEyebrow>
          <p className="mb-1 mt-[3px] flex items-baseline gap-2 text-base font-semibold tracking-[-0.015em] text-ink">
            {title}
            {meta !== undefined && (
              <span className="text-[13px] font-normal text-ink-3">{meta}</span>
            )}
          </p>
        </div>
        {collapsible && (
          <IconButton
            // `aria-controls` points at the body, not the card, so a screen
            // reader offers a jump to exactly what the button revealed.
            aria-expanded={open}
            aria-controls={bodyId}
            label={toggleLabel ?? ""}
            onClick={() => setOpen((prev) => !prev)}
            className="-mr-1.5 ml-auto self-start"
          >
            <IngotIcon
              name="chevron-right"
              size={13}
              className={cx("transition-transform", open && "rotate-90")}
            />
          </IconButton>
        )}
      </div>
      {/*
        The body stays in the DOM when collapsed and is hidden by `hidden`.
        Its `id` must always exist — an `aria-controls` pointing at nothing
        is a broken relation, not a temporary state, and find-in-page should
        still find a collapsed step.
      */}
      <div id={bodyId} hidden={!shown} className="px-[18px] py-4">
        {children}
      </div>
      {footer !== undefined && shown && (
        <div className="flex justify-center border-t border-border bg-surface p-2.5">
          {footer}
        </div>
      )}
    </div>
  );
}
