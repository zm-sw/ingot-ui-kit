import type { JSX, ReactNode } from "react";

import { cx } from "./cx";

/**
 * Status badge — the state of an entity in one word.
 *
 * Mono and uppercase on purpose: a badge names a STATE ("in production",
 * "done"), not an action. An action is a button, and the moment a badge
 * looks like a sentence, someone writes a sentence into it.
 *
 * **Tone goes only through `tone`; the component takes no `className`.**
 * A `className="bg-…"` racing the tone would lose silently — the caller
 * would believe the colour was overridden while it stayed. The ambiguity
 * cannot arise because the second spelling does not exist.
 *
 * What it is NOT:
 *
 * * **A count.** A badge with a number is a different primitive (round,
 *   `99+` threshold, mandatory screen-reader label, zero not drawn) and
 *   the kit does not have one yet. A number is not a state.
 * * **A clickable filter.** A badge is not interactive: no focus, no role,
 *   no keyboard handling. A filter you can switch on is a chip and must be
 *   a button.
 *
 * A11y: colour carries no meaning — the text does, and it is required.
 * `dot` is pure decoration of a live state and therefore `aria-hidden`.
 *
 * The kit has no i18n namespace of its own: the text arrives translated.
 */
export type IngotBadgeTone =
  | "neutral"
  | "ok"
  | "warn"
  | "danger"
  | "accent"
  | "ink";

/**
 * Tone → a background/text pair from tokens. Both must carry 4.5:1 in the
 * light and the dark theme; `tests/IngotBadge.test.tsx` measures it over
 * the real values from `tokens.css`, not over the class name.
 *
 * `ink` is the only solid one — it is the strongest emphasis and on a tint
 * it could not be told from `neutral`.
 */
const TONE: Record<IngotBadgeTone, string> = {
  neutral: "border-border bg-surface-2 text-ink-2",
  ok: "border-ok-border bg-ok-bg text-ok",
  warn: "border-warn-border bg-warn-bg text-warn",
  danger: "border-danger-border bg-danger-bg text-danger",
  accent: "border-accent-border bg-accent-bg text-accent-ink",
  ink: "border-ink bg-ink text-surface",
};

export function IngotBadge({
  children,
  tone = "neutral",
  dot = false,
  testId,
}: {
  /** The state in one word, already translated. */
  children: ReactNode;
  tone?: IngotBadgeTone;
  /** A dot for a live state ("running now"). Decoration, not meaning. */
  dot?: boolean;
  testId?: string;
}): JSX.Element {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5",
        "font-mono text-[11px] font-medium uppercase tracking-wide",
        TONE[tone],
      )}
      data-testid={testId}
    >
      {dot && (
        <span
          aria-hidden
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {children}
    </span>
  );
}
