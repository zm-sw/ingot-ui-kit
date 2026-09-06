/**
 * Segmented switch — two or three short choices side by side, the selected
 * one lifted onto the surface. The handoff's `.seg` / `.segmented` pattern.
 *
 * **It is not `IngotTabs`.** Tabs switch a PANEL (`role="tablist"` plus a
 * `tabpanel` underneath); this switches a VALUE — a filter, a theme, a
 * preview width. Reaching for tabs to change a value promises a screen
 * reader a panel that is nowhere on the page.
 *
 * **The choices are radios, not pressed buttons.** The handoff sketches
 * the group with `aria-pressed`, which reads as three independent toggles
 * that happen to look coordinated; a screen reader then never says how
 * many choices there are or which of them is number two of three. One
 * value out of a named set is `role="radiogroup"`, so that is what the
 * component renders.
 *
 * That choice carries an obligation the browser will not discharge for us:
 * a native `<input type="radio">` group gets a roving tabindex and arrow
 * keys for free, a group of `<button role="radio">` gets neither. Both are
 * implemented here — Tab enters the group at the selected choice, arrows
 * and Home/End move the selection, and nothing else in the group is a tab
 * stop.
 *
 * The kit has no i18n namespace of its own: the group's `label` and every
 * option's `label` arrive translated.
 */

import { useId, useRef, type JSX } from "react";

import { cx } from "./cx";

export interface IngotSegmentedOption {
  value: string;
  label: string;
}

export function IngotSegmented({
  options,
  value,
  onChange,
  label,
  testId,
}: {
  options: readonly IngotSegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  /** Names the group for screen readers, e.g. "Theme". */
  label: string;
  /** Group testid; each option gets `${testId}-${value}`. */
  testId?: string;
}): JSX.Element {
  const baseId = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const optionId = (option: string) => `${baseId}-${option}`;

  // An unknown value would leave the group without a tab stop, so the
  // first choice holds it until the caller sends a value we know.
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  const moveTo = (index: number) => {
    const option = options[(index + options.length) % options.length];
    if (!option) return;
    onChange(option.value);
    // In a radio group the arrow keys move the selection AND the focus:
    // the two are the same thing here, so focus follows what was chosen.
    // preventScroll for the same reason as in IngotTabs — changing a
    // filter must not move the page under the reader.
    groupRef.current
      ?.querySelector<HTMLElement>(`[id="${optionId(option.value)}"]`)
      ?.focus({ preventScroll: true });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      // Down and Up as well as Right and Left: the group reads
      // left-to-right, but ARIA practices bind both axes and a reader who
      // learned the pattern on a vertical group expects them.
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveTo(activeIndex + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveTo(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(options.length - 1);
        break;
    }
  };

  return (
    // The group itself is not a tab stop (ARIA practices, and the same
    // shape as IngotTabs): the roving tabindex puts focus on the selected
    // choice, and the key handler sits on the container so the arrows work
    // from whichever of them holds focus.
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="inline-flex items-center gap-0.5 rounded-[7px] border border-border bg-surface-2 p-0.5"
      data-testid={testId}
    >
      {options.map((option, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={option.value}
            id={optionId(option.value)}
            type="button"
            role="radio"
            aria-checked={active}
            // Roving tabindex: the group is ONE tab stop, entered at the
            // selected choice. Without it Tab walks every option and the
            // arrow keys have nothing left to do.
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cx(
              "grid h-6 min-w-7 place-items-center rounded-[5px] px-2 text-xs font-medium",
              active
                ? "bg-surface text-ink shadow-sm"
                : "text-ink-3 hover:text-ink",
            )}
            data-testid={testId ? `${testId}-${option.value}` : undefined}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
