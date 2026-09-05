import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Eyebrow — the kit's small mono caption: uppercase, letter-spaced, set
 * above or beside the thing it names (a nav group, a metric, a step's
 * kicker, a disclosure's title).
 *
 * Before this primitive existed the same idiom was drawn by hand in ten
 * places with four font sizes (9.5 / 10 / 10.5 / 11 px) and five letter
 * spacings. The preset even defined `text-eyebrow` and nobody used it. Two
 * sizes are enough: `sm` for captions inside components, `md` (the preset's
 * `text-eyebrow`) for captions that head a block of prose.
 *
 * Not a heading: it carries no heading role, so the page outline stays on
 * `IngotSection`. Not a badge: `IngotBadge` names a *state* on a bordered
 * pill; an eyebrow names a *thing* with bare text.
 *
 * `className` is for layout only (margins, flex) — colour and type come
 * from `size` and `tone`.
 */
export type IngotEyebrowTone = "neutral" | "muted" | "accent" | "ok" | "inherit";
export type IngotEyebrowSize = "sm" | "md";

const SIZE: Record<IngotEyebrowSize, string> = {
  sm: "text-[10.5px] font-medium leading-[1.4] tracking-[0.08em]",
  md: "text-eyebrow",
};

/** `inherit` leaves colour to the parent (a link that changes colour on hover). */
const TONE: Record<IngotEyebrowTone, string> = {
  neutral: "text-ink-3",
  muted: "text-ink-4",
  accent: "text-accent-ink",
  ok: "text-ok",
  inherit: "",
};

/**
 * Class list of an eyebrow, for the rare element that cannot be an
 * `IngotEyebrow` itself (an `<ol>` of breadcrumbs). Internal — not exported
 * from the barrel; consumers use the component.
 */
export function eyebrowClass({
  size = "sm",
  tone = "neutral",
}: { size?: IngotEyebrowSize; tone?: IngotEyebrowTone } = {}): string {
  return cx("font-mono uppercase", SIZE[size], TONE[tone]);
}

export function IngotEyebrow({
  as: Tag = "p",
  size = "sm",
  tone = "neutral",
  className,
  children,
  testId,
}: {
  /** Element to render. `p` by default; `span` inline; `div` for a block that holds other inline content. */
  as?: "p" | "span" | "div";
  size?: IngotEyebrowSize;
  tone?: IngotEyebrowTone;
  /** Layout only — margins, flex. Colour and type are `size` and `tone`. */
  className?: string;
  /** The caption, already translated. */
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <Tag className={cx(eyebrowClass({ size, tone }), className)} data-testid={testId}>
      {children}
    </Tag>
  );
}
