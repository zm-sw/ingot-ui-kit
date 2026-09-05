import { type JSX } from "react";

import { IconButton } from "./IconButton";
import { IngotIcon, type IngotIconName } from "./IngotIcon";

/**
 * Actions of one table row — icon buttons at the end of the row.
 *
 * A primitive of its own because row actions have a different budget from
 * buttons elsewhere: 28×28 px, no border, no label. ``Button`` does not
 * and should not have that density — a button in the header and a button
 * in the twentieth row of a table are not the same thing.
 *
 * **The label is required and starts with a verb.** Without it a screen
 * reader reads only "button", twenty times in a row. "Delete order", not
 * "Bin".
 *
 * **Actions are always at the end of the row and in the same order.**
 * Whoever finds them once looks for them in the same place on the next
 * pages; a shuffled order is the fastest way to delete the wrong row.
 *
 * **An irreversible action is ``danger``, but does not delete by itself.**
 * The tone changes only how it looks on hover; confirmation is
 * ``IngotConfirm`` at the caller.
 *
 * The kit has no i18n namespace of its own — labels arrive translated.
 */

export interface IngotRowAction {
  icon: IngotIconName;
  /** Translated label starting with a verb. Required. */
  label: string;
  onClick: () => void;
  /** Irreversible action — turns red on hover. */
  tone?: "default" | "danger";
  disabled?: boolean;
  testId?: string;
}

export function IngotRowActions({
  actions,
  testId,
}: {
  /** Actions in a fixed order. More than three belong in a menu. */
  actions: readonly IngotRowAction[];
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="flex justify-end gap-0.5 text-ink-3"
      data-testid={testId}
    >
      {actions.map((action) => (
        <IconButton
          key={action.label}
          label={action.label}
          title={action.label}
          tone={action.tone === "danger" ? "danger" : "default"}
          disabled={action.disabled}
          onClick={action.onClick}
          data-testid={action.testId}
        >
          <IngotIcon name={action.icon} size={15} />
        </IconButton>
      ))}
    </div>
  );
}
