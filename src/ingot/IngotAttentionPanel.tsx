import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * The dark "what the screen wants from you now" panel — it opens the
 * overviews of both admins.
 *
 * **A named exception to principle 02** ("the page background is always
 * darker than a card"): this is the one place where a card is darker than
 * the background, and exactly why it works as a signal. The exception
 * holds only while it is rare — hence the rule in the documentation: **at
 * most one per page**, and only for what awaits action. A second panel on
 * the same page is no longer a signal but a second background. (Owner's
 * decision, 2026-09-02, point 08.)
 *
 * Drawn with the ``--ink`` / ``--bg`` tokens, so in dark mode it inverts
 * to a light panel and the contrast holds by itself.
 *
 * The content (signal pills, links, chips) comes from the caller — the
 * panel holds the surface, the title and the right column, not the means
 * of signalling.
 *
 * The kit has no i18n namespace of its own — texts arrive translated.
 */
export function IngotAttentionPanel({
  title,
  children,
  aside,
  testId,
}: {
  /** Translated title — "What to handle now". */
  title: string;
  /** Panel body: a summary sentence, signal pills, actions. */
  children: ReactNode;
  /** Right column — chips of the affected records, a "+2 more" link. */
  aside?: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <section
      aria-label={title}
      className="rounded-lg bg-ink px-6 py-5 text-bg shadow-md"
      data-testid={testId}
    >
      <div className={cx("gap-6", aside !== undefined && "flex flex-wrap items-start")}>
        <div className="min-w-0 max-w-prose">
          <h2 className="text-base font-semibold">{title}</h2>
          <div className="mt-1.5 space-y-3 text-sm text-bg/80">{children}</div>
        </div>
        {/* 1.1: the aside grows — the overview's signal grid needs the rest
            of the width; a chip with a few lines just moves right (basis-80). */}
        {aside !== undefined && (
          <div className="min-w-0 flex-1 basis-80">{aside}</div>
        )}
      </div>
    </section>
  );
}
