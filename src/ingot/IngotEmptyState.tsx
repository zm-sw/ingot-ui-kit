import { type JSX, type ReactNode } from "react";

/**
 * Empty state — shipped together with `IngotTable`, not separately.
 *
 * Practically every list-shaped screen has an empty state and without it a
 * table is incomplete; separating them means designing the same interface
 * twice. Hence one pair.
 *
 * Usable outside a table too (a card, a panel) — which is why it is a
 * component of its own, not a prop of `IngotTable`.
 *
 * The kit has no i18n namespace of its own, so texts arrive translated.
 */
export function IngotEmptyState({
  title,
  description,
  action,
  testId,
}: {
  /** One sentence on what is not here ("Nothing here yet"). */
  title: ReactNode;
  /** Optionally why / what to do about it. */
  description?: ReactNode;
  /** Optional affordance ("Add the first item"). */
  action?: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="flex flex-col items-center gap-1 px-4 py-8 text-center"
      data-testid={testId}
    >
      <p className="text-sm font-medium text-ink-2">{title}</p>
      {description != null && (
        <p className="max-w-prose text-sm text-ink-3">{description}</p>
      )}
      {action != null && <div className="mt-2">{action}</div>}
    </div>
  );
}
