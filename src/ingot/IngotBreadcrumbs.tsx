import { type JSX } from "react";

import { cx } from "./cx";
import { eyebrowClass } from "./IngotEyebrow";

/**
 * Breadcrumbs above the page header — where am I and how do I get back.
 *
 * In an application without a side menu the breadcrumbs carry the whole
 * orientation: the top bar says which section you are in, the breadcrumbs
 * say how deep.
 *
 * **The last crumb is not a link.** It is the place you stand, and a link
 * to itself promises a click that leads nowhere. The component therefore
 * renders it as text even if the caller sent an ``href``.
 *
 * On a section's root page no breadcrumbs are drawn at all — a single
 * crumb says nothing the header does not say better.
 *
 * The kit has no i18n namespace of its own — labels arrive translated.
 */

export interface IngotCrumb {
  label: string;
  /** Address. The last crumb need not have one — it is not rendered anyway. */
  href?: string;
}

export function IngotBreadcrumbs({
  items,
  label,
  testId,
}: {
  /** The path from top to bottom. A single crumb is not rendered. */
  items: readonly IngotCrumb[];
  /** Translated ``aria-label`` of the navigation. */
  label: string;
  testId?: string;
}): JSX.Element | null {
  if (items.length < 2) return null;
  return (
    <nav aria-label={label} data-testid={testId}>
      {/* The trail is one eyebrow-sized line; the `<ol>` cannot be an
          IngotEyebrow itself, so it borrows the class list. */}
      <ol className={cx("flex flex-wrap items-center gap-2", eyebrowClass({ size: "md" }))}>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-ink-4">
                  /
                </span>
              )}
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined} className="text-ink">
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="hover:text-ink">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
