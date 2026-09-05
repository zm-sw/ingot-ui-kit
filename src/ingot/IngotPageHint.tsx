import { useEffect, useRef, type JSX, type ReactNode } from "react";

import { IconButton } from "./IconButton";
import { IngotIcon } from "./IngotIcon";

/**
 * Page hint with a bulb — spec PageHint v1.1 (its CSS section lives in
 * ``tokens.css``, the only stylesheet the package exports).
 *
 * An information strip above the content. A click on the bulb highlights
 * the elements the hint is about with an accent outline for ~2.4 s, then
 * fades. NOT a toggle — a one-shot action: targets get the ``.is-hinted``
 * class and lose it after 2400 ms. The keyframes and the
 * ``prefers-reduced-motion`` branch (flash off, outline stays) are held by
 * the CSS, not by this file.
 *
 * **The component does not decide its own visibility.** ``visible`` is
 * driven by the caller's "Hints on pages" switch in the account menu (a
 * per-account preference) and ``onDismiss`` stores the per-user, per-page
 * dismissal ALSO on the account — not in localStorage; preferences live
 * on the account (handoff rule). The kit has no backend, so both are a
 * contract with the caller, not internal state.
 *
 * ``level`` follows the user's dictionary (Simple / Expert). Until the
 * dictionary exists the prop works (it is written to ``data-hint-level``),
 * but treat every user as ``both`` — filtering by level is the caller's
 * job once it has something to filter by.
 *
 * This is the kit's only page-level help. Earlier help mechanisms of the
 * product (a help dock, deep-link highlights) are not part of the kit; the
 * `.is-hinted` idiom in `tokens.css` is the one highlight the kit ships.
 *
 * A11y: the bulb is a plain button with a descriptive ``aria-label`` (a
 * one-shot action, not a toggle). The strip belongs BEFORE the content in
 * reading order — that is placement, the caller's job. A hidden hint
 * (``visible={false}``) returns ``null``, so it changes neither layout nor
 * focus order.
 */

export type IngotPageHintLevel = "simple" | "expert" | "both";

/** How long targets stay highlighted, in ms — must match the CSS keyframes. */
export const INGOT_HINT_DURATION_MS = 2400;

const HINT_CLASS = "is-hinted";

export function IngotPageHint({
  title,
  children,
  targets = [],
  level = "both",
  dismissible = false,
  onDismiss,
  visible = true,
  bulbLabel = "Zvýraznit, čeho se nápověda týká",
  dismissLabel = "Skrýt nápovědu na této stránce",
  testId,
}: {
  /** Name of the screen or task the strip talks about — not "Help". */
  title: string;
  /** 2–3 sentences in the second person: what the user does here and with what. */
  children: ReactNode;
  /**
   * Selectors of the elements the hint is about — typically
   * ``[data-hint-target="…"]``. Without targets the bulb is drawn as
   * decoration only: a button with nothing to highlight would lie.
   */
  targets?: readonly string[];
  /**
   * Who the hint is for, by the user's dictionary. Written to
   * ``data-hint-level``; filtering is the caller's job.
   */
  level?: IngotPageHintLevel;
  /** Shows the cross. The per-user, per-page dismissal is stored by the caller on the account. */
  dismissible?: boolean;
  /** Click on the cross. Persistence belongs on the account, not in localStorage. */
  onDismiss?: () => void;
  /**
   * Controlled visibility — the caller's "Hints on pages" switch in the
   * account menu. ``false`` draws nothing and the layout does not change.
   */
  visible?: boolean;
  /** Translated label of the bulb — the kit has no translations. */
  bulbLabel?: string;
  /** Translated label of the cross. */
  dismissLabel?: string;
  /** `data-testid` of the strip; the bulb gets `${testId}-bulb`, the cross `${testId}-dismiss`. */
  testId?: string;
}): JSX.Element | null {
  const timerRef = useRef<number>();
  const litRef = useRef<Element[]>([]);

  const unlight = () => {
    window.clearTimeout(timerRef.current);
    for (const el of litRef.current) el.classList.remove(HINT_CLASS);
    litRef.current = [];
  };

  // Leaving the page mid-cycle must not leave the targets lit — the class
  // lives on FOREIGN elements and React will not clean it up for us.
  useEffect(() => unlight, []);

  if (!visible) return null;

  const flash = () => {
    unlight();
    const found: Element[] = [];
    for (const selector of targets) {
      try {
        found.push(...document.querySelectorAll(selector));
      } catch {
        // A broken selector must not take the whole batch down — targets
        // can arrive from data, and one typo would put out all the others.
      }
    }
    for (const el of found) {
      // A repeated click mid-cycle: without a reflow between remove and add
      // the browser would consider the class unchanged and the animation
      // would not restart.
      void (el as HTMLElement).offsetWidth;
      el.classList.add(HINT_CLASS);
    }
    litRef.current = found;
    timerRef.current = window.setTimeout(unlight, INGOT_HINT_DURATION_MS);
  };

  const bulb = <IngotIcon name="bulb" size={18} />;

  return (
    <div
      role="note"
      data-hint-level={level}
      className="flex items-start gap-3 rounded-lg border border-accent-border bg-accent-bg px-4 py-3 text-sm"
      data-testid={testId}
    >
      {targets.length > 0 ? (
        <IconButton
          label={bulbLabel}
          tone="accent"
          onClick={flash}
          className="-my-1 -ml-1.5"
          data-testid={testId ? `${testId}-bulb` : undefined}
        >
          {bulb}
        </IconButton>
      ) : (
        <span className="mt-0.5 shrink-0 text-accent">{bulb}</span>
      )}
      <div className="min-w-0">
        <strong className="font-semibold text-ink">{title}</strong>{" "}
        <span className="text-ink-2">{children}</span>
      </div>
      {dismissible && (
        <IconButton
          label={dismissLabel}
          onClick={onDismiss}
          className="-my-1 -mr-1.5 ml-auto"
          data-testid={testId ? `${testId}-dismiss` : undefined}
        >
          <IngotIcon name="close" size={14} />
        </IconButton>
      )}
    </div>
  );
}
