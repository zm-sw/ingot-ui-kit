import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotEyebrow } from "./IngotEyebrow";
import { menuRowClass } from "./menuRow";

/**
 * Side menu — a named group of links, one of them active.
 *
 * It holds three things that are copied badly by hand:
 *
 * 1. **`<nav>` has a label.** On a page with more than one navigation the
 *    `aria-label` is the only thing a screen reader can tell them apart
 *    by — otherwise the user hears "navigation" twice and does not know
 *    which is which.
 * 2. **The active item carries `aria-current="page"`,** not just another
 *    colour. A colour highlight is information a screen reader does not
 *    see.
 * 3. **A link is an `<a>`,** not a `<div onClick>`. The middle mouse
 *    button, "open in a new tab" and the keyboard then work by themselves.
 *
 * Routing stays with the caller: `href` is a finished address. The
 * primitive knows no router and must not pull one into the bundle.
 *
 * The kit has no i18n namespace of its own — `label` and the item labels
 * arrive translated.
 */
export interface IngotNavItem {
  /** A finished address. The primitive neither builds nor validates it. */
  href: string;
  label: ReactNode;
  /** The currently shown item. Gets `aria-current="page"`. */
  current?: boolean;
  /**
   * Ordinal before the label — mono, tabular, not part of the label. A
   * screen reader reads it as part of the link, which is right: "02
   * Components" is a shorter orientation in speech too than the name alone.
   */
  ordinal?: string;
  /**
   * Sub-items nested UNDER this item, in their own `<ul>`.
   *
   * Nesting is structure, not indentation: a screen reader announces the
   * second list and its item count, so it is clear they belong to the
   * parent — which a flat list with a bigger `padding-left` cannot do.
   */
  children?: readonly IngotNavItem[];
  testId?: string;
}

export function IngotSideNav({
  label,
  items,
  testId,
}: {
  /** `aria-label` of the navigation — required, see the docstring. */
  label: string;
  items: readonly IngotNavItem[];
  testId?: string;
}): JSX.Element {
  return (
    <nav aria-label={label} data-testid={testId}>
      <IngotEyebrow tone="muted" className="mb-2">
        {label}
      </IngotEyebrow>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={cx(
                "flex items-baseline gap-2 rounded border px-2.5 py-1.5 text-sm",
                menuRowClass({ current: item.current, surface: "page" }),
              )}
              data-testid={item.testId}
            >
              {item.ordinal !== undefined && (
                <span
                  className={cx(
                    "font-mono text-[10.5px] tabular-nums",
                    item.current ? "text-ink-3" : "text-ink-4",
                  )}
                >
                  {item.ordinal}
                </span>
              )}
              {item.label}
            </a>
            {item.children && item.children.length > 0 && (
              <ul className="mt-0.5 space-y-0.5">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <a
                      href={child.href}
                      aria-current={child.current ? "page" : undefined}
                      className={cx(
                        "relative block rounded py-1 pl-[22px] pr-2 text-[13px]",
                        // A current child is marked by the bar on its left, not
                        // by a background — nesting reads better without a
                        // second highlighted box under the parent's.
                        child.current
                          ? "font-medium text-ink before:absolute before:bottom-1 before:left-[9px] before:top-1 before:w-0.5 before:bg-ink before:content-['']"
                          : menuRowClass({ dim: true }),
                      )}
                      data-testid={child.testId}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
