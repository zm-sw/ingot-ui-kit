import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * A list — bullets, numbers, or a bare list without markers.
 *
 * Why it is not "just a `<ul>`": marker and indentation belong together.
 * Hand-written lists differed in both (`list-disc pl-5`, `list-disc pl-4`,
 * `ml-4`, `space-y-1` here and nothing there), so two lists side by side
 * did not line up — and nobody knew which was the right one.
 *
 * `variant="plain"` is for lists of links (navigation, page contents)
 * where a bullet is noise: `<li>` still carries the order, so a screen
 * reader announces the item count, only the dot is not drawn.
 *
 * The kit has no i18n namespace of its own — items come from the caller.
 */
export function IngotList({
  items,
  variant = "bullet",
  testId,
}: {
  items: readonly ReactNode[];
  /** `bullet` bullets · `ordered` numbers · `plain` no markers. */
  variant?: "bullet" | "ordered" | "plain";
  testId?: string;
}): JSX.Element {
  const shared = "space-y-1.5 text-sm text-ink-2";
  if (variant === "ordered") {
    return (
      <ol className={cx("list-decimal pl-5", shared)} data-testid={testId}>
        {items.map((item, index) => (
          // Items are static content without identity; the array is not
          // reordered at runtime, so the index is a stable key here.
          <li key={index}>{item}</li>
        ))}
      </ol>
    );
  }
  return (
    <ul
      className={cx(variant !== "plain" && "list-disc pl-5", shared)}
      data-testid={testId}
    >
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
