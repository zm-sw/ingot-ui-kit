import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotIcon, type IngotIconName } from "./IngotIcon";

/**
 * A tinted block that says something about the content it stands next to:
 * a note, a warning, a consequence.
 *
 * The kit had two neighbours and no middle. ``IngotPageHint`` is help for
 * a whole screen, driven by an account preference and dismissible per
 * page; ``IngotAttentionPanel`` is the one dark panel that opens an
 * overview. Between them sat the ordinary case — three sentences that
 * belong to THIS section — and every screen drew it by hand, which is why
 * the same warning came in three shades of amber.
 *
 * **The tone is the meaning, and it decides the role.** ``danger`` and
 * ``warn`` are announced as an alert, because they say something the
 * reader has to act on; ``info`` and ``ok`` are ordinary content a screen
 * reader meets in reading order. A block that shouts every time is a block
 * people learn to skip.
 *
 * **Colour is never the only signal.** Each tone brings its own icon and
 * the text says the same thing in words — a warning that is only amber is
 * no warning at all in greyscale or to a screen reader.
 *
 * The kit has no i18n namespace of its own — the title and the text arrive
 * translated.
 */

export type IngotCalloutTone = "info" | "ok" | "warn" | "danger";

const TONE: Record<
  IngotCalloutTone,
  { surface: string; icon: IngotIconName; iconColor: string }
> = {
  info: {
    surface: "border-accent-border bg-accent-bg text-ink-2",
    icon: "info",
    iconColor: "text-accent",
  },
  ok: {
    surface: "border-ok-border bg-ok-bg text-ink-2",
    icon: "save",
    iconColor: "text-ok",
  },
  warn: {
    surface: "border-warn-border bg-warn-bg text-ink-2",
    icon: "alert",
    iconColor: "text-warn",
  },
  danger: {
    surface: "border-danger-border bg-danger-bg text-ink-2",
    icon: "alert",
    iconColor: "text-danger",
  },
};

export function IngotCallout({
  tone = "info",
  title,
  children,
  actions,
  testId,
}: {
  tone?: IngotCalloutTone;
  /** One line, without a full stop — the block's own heading. */
  title?: ReactNode;
  /** The body: two or three sentences. Longer belongs on the page itself. */
  children: ReactNode;
  /** At most two actions, at the foot. A third means this is a screen, not a note. */
  actions?: ReactNode;
  testId?: string;
}): JSX.Element {
  const { surface, icon, iconColor } = TONE[tone];
  const urgent = tone === "warn" || tone === "danger";

  return (
    <div
      // An alert is announced when it appears; a note is read in place. The
      // tone decides which of the two this is, so a caller cannot draw a
      // warning that says nothing to a screen reader.
      role={urgent ? "alert" : undefined}
      className={cx("flex gap-3 rounded-lg border px-4 py-3 text-sm", surface)}
      data-testid={testId}
      data-tone={tone}
    >
      <span className={cx("mt-0.5 shrink-0", iconColor)}>
        <IngotIcon name={icon} size={16} />
      </span>
      <div className="min-w-0 space-y-1">
        {title != null && <strong className="block font-semibold text-ink">{title}</strong>}
        <div className="leading-relaxed">{children}</div>
        {actions != null && <div className="flex flex-wrap gap-2 pt-1">{actions}</div>}
      </div>
    </div>
  );
}
