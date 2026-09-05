import type { JSX } from "react";

import { IngotEyebrow } from "./IngotEyebrow";

/**
 * Header of a marketing section — "Public pages" handoff, ingot.css
 * section 13.
 *
 * Two columns: eyebrow + h2 on the left, lede on the right. The handoff's
 * thesis: no gradients and no illustrations — typography and a line carry
 * the section. The accent may sit on ONE element per section; here the
 * eyebrow carries it, so neither the heading nor the lede is accented.
 *
 * Responsiveness per the handoff: below 1100 px the grid collapses to one
 * column — hence the arbitrary variant ``min-[1100px]:``, not ``lg:``
 * (Tailwind's ``lg`` is 1024 px and would diverge from the handoff).
 *
 * Texts are content (CMS / branding data), not hard-coded — the component
 * therefore takes them exclusively through props.
 */
export function IngotMarketingSectionHead({
  eyebrow,
  title,
  lede,
  testId,
}: {
  /** Short caption above the heading — the section's only accent element. */
  eyebrow?: string;
  /** Section heading (h2). Supplied translated — content, not a constant. */
  title: string;
  /** Introductory paragraph in the right column. */
  lede?: string;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="grid gap-4 min-[1100px]:grid-cols-2 min-[1100px]:items-end min-[1100px]:gap-12"
      data-testid={testId}
    >
      <div>
        {eyebrow !== undefined && (
          <IngotEyebrow size="md" tone="accent" className="mb-3">
            {eyebrow}
          </IngotEyebrow>
        )}
        <h2 className="text-3xl font-semibold tracking-tight text-ink">
          {title}
        </h2>
      </div>
      {lede !== undefined && (
        <p className="text-[15px] leading-relaxed text-ink-3">{lede}</p>
      )}
    </div>
  );
}
