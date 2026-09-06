import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { eyebrowClass } from "./IngotEyebrow";

/**
 * The facts about a record: label, value, label, value.
 *
 * It is the commonest block on a detail screen and the kit had nothing for
 * it, so every screen wrote its own — a hand-rolled `dl` here, a grid of
 * spans there, a two-column table somewhere else. Three shapes of the same
 * thing, and only one of them told a screen reader that "Customer" names
 * the text beside it.
 *
 * **Facts are mono.** A number, a code, a date read down a column only
 * line up in a monospaced face with `tabular-nums`; in the body face the
 * digits are different widths and the eye cannot compare two rows. That is
 * a rule of the system, not a preference, which is why it is a flag on the
 * item rather than a class the screen passes in.
 */
export interface IngotDescriptionItem {
  /** What the value is, already translated. */
  label: ReactNode;
  value: ReactNode;
  /** The value is a fact — a number, a code, a date. Sets mono + tabular. */
  mono?: boolean;
}

export function IngotDescriptionList({
  items,
  columns = 1,
  className,
  testId,
}: {
  items: readonly IngotDescriptionItem[];
  /**
   * `1` reads down the page — a narrow panel, a sidebar. `2` puts pairs
   * side by side for a wide detail, and folds back to one below `md`,
   * where two columns leave neither the label nor the value room.
   */
  columns?: 1 | 2;
  /** Layout only — where the block sits. */
  className?: string;
  testId?: string;
}): JSX.Element {
  return (
    // A real `dl`, not a grid of spans: it is what says that this label
    // names that value. Everything below is layout on top of that.
    <dl
      className={cx(
        "grid gap-x-6 gap-y-3",
        columns === 2 && "sm:grid-cols-2",
        className,
      )}
      data-testid={testId}
    >
      {items.map((item, index) => (
        // Each pair is its own row so a long value cannot drag its
        // neighbour's label out of line.
        <div key={index} className="min-w-0 space-y-0.5">
          <dt className={eyebrowClass({ tone: "muted" })}>{item.label}</dt>
          <dd
            className={cx(
              "text-sm text-ink",
              item.mono && "font-mono tabular-nums",
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
