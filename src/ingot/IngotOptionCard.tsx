import { useId, type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Picking one variant where the choice needs an explanation.
 *
 * The difference from a plain radio is what is chosen: variants in
 * settings are not "yes/no" but decisions with consequences ("pricing by
 * weight" vs. "by machine time"). The explanatory sentence is therefore
 * not an extra hint — it is half of the choice, and it would not fit in a
 * dropdown.
 *
 * **The whole card is clickable, not only the circle.** A card with text
 * where only a 16 px dot reacts is a trap — especially on touch. Hence the
 * label is a ``<label>`` around the whole content.
 *
 * **The selected variant is recognised by outline, not fill.** A filled
 * card would compete with the content it describes; an accent outline is
 * enough and holds contrast in the dark theme too.
 *
 * The kit has no i18n namespace of its own — texts arrive translated.
 */

export function IngotOptionCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  disabled = false,
  testId,
}: {
  /** Group name — all variants of one choice share it. */
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: ReactNode;
  /** One sentence: what the choice means. Not what the button does. */
  description?: ReactNode;
  disabled?: boolean;
  testId?: string;
}): JSX.Element {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cx(
        "flex cursor-pointer gap-3 rounded-md border bg-surface px-4 py-3.5",
        checked
          ? "border-accent shadow-[0_0_0_1px_var(--accent)]"
          : "border-border-strong hover:border-ink-4",
        disabled && "cursor-not-allowed opacity-60",
      )}
      data-testid={testId}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="mt-0.5 h-4 w-4 flex-none accent-[var(--accent)]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{title}</span>
        {description !== undefined && (
          <span className="mt-0.5 block text-[13px] leading-[1.5] text-ink-3">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
