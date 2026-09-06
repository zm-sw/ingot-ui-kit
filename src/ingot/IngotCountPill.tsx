import type { JSX, ReactNode } from "react";

import { cx } from "./cx";

/**
 * A round pill with a number in it — how many records are behind the thing
 * it stands next to. The handoff's `.countpill`.
 *
 * It existed in the kit before this component did, but only as a PROPERTY
 * of `IngotTabs` (`IngotTabItem.count`), so a section heading that wanted
 * to carry a count had nothing to draw it with. `IngotTabs` now renders
 * this one, which is the point: one definition, so a tab's count and a
 * heading's count cannot drift into two different pills.
 *
 * **It is not `IngotBadge`.** A badge is a mono, upper-case, letter-spaced
 * label naming a STATE ("in production"); this is a round pill whose whole
 * content is a number. Side by side the difference is plain, and using one
 * for the other is how a screen ends up with two shapes meaning the same
 * thing.
 *
 * ## Zero is drawn
 *
 * The obvious rule from notification badges — hide the zero, because an
 * unread counter of nothing is noise — is the wrong rule here. This pill
 * labels a tab or a section heading, and there "0" is the answer to the
 * reader's question: the view is empty, do not click it. Hiding it would
 * make an empty section look exactly like one whose count nobody knows.
 *
 * ## When a screen reader needs a label, and when it does not
 *
 * `label` is optional, and that is a decision rather than an oversight.
 * The pill is nearly always read together with the text it sits beside —
 * inside a tab ("Items 12") or after a heading ("Article structure 10") —
 * and there an extra label would only say the same thing twice.
 *
 * A pill standing on its own is the case that needs one, because "10" by
 * itself means nothing. That is what `label` is for, and the doc page says
 * so: a number with no words around it gets a label, or it says nothing to
 * anyone who cannot see what it is next to.
 *
 * The kit has no i18n namespace of its own: `label` arrives translated.
 */
export function IngotCountPill({
  children,
  onInk = false,
  label,
  testId,
}: {
  /** The number. Nothing else belongs in a pill this size. */
  children: ReactNode;
  /** On a dark surface — inside a pressed tab or an attention panel. */
  onInk?: boolean;
  /**
   * Says what is being counted, for a screen reader, when the pill stands
   * alone. Supplied translated. Leave it out next to a heading or inside a
   * tab, where the neighbouring text already names it.
   */
  label?: string;
  testId?: string;
}): JSX.Element {
  return (
    <span
      // The role follows the label: a pill that names itself is one thing a
      // screen reader meets, and its own digits must not be read after the
      // name. Without a label it is plain text in reading order.
      role={label ? "img" : undefined}
      aria-label={label}
      className={cx(
        // min-w against h keeps a one-digit pill round and lets a
        // three-digit one grow sideways instead of clipping.
        "inline-flex h-[18px] min-w-[22px] items-center justify-center rounded-full px-1.5",
        "font-mono text-[11px] font-medium tabular-nums",
        onInk ? "bg-surface/20 text-surface" : "bg-surface-2 text-ink-3",
      )}
      data-testid={testId}
    >
      {children}
    </span>
  );
}
