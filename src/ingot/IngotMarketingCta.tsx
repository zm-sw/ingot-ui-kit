import type { JSX } from "react";

import { Button } from "./Button";

/**
 * Closing CTA — the dark block with two large buttons from the "Public
 * pages" handoff.
 *
 * Handoff rule: a dark block may appear on a page at most TWICE (this CTA
 * + the footer) — the page composition holds that, not the component.
 *
 * The block is "inverse": drawn with the ``ink`` / ``bg`` tokens swapped,
 * so in the dark theme it inverts by itself and introduces no colour of
 * its own.
 *
 * The actions are ``Button as="a"`` — a marketing CTA navigates (sign-up,
 * contact), it triggers nothing, so it is a link. The look is NOT copied
 * from ``Button``, it is taken from it: hand-written ``<a>`` elements with
 * copied classes used to stand here, and with them a copy of the decision
 * about accent contrast in the dark theme (``dark:text-bg``). A copied
 * accessibility decision is the worst thing to duplicate — it does not
 * break, it quietly ages.
 *
 * **The main action is not neutral.** On a dark surface a light neutral
 * button is indistinguishable from the secondary one and the closing call
 * has nowhere to send the eye. The accent is the block's only coloured
 * element here; the secondary action is ``variant="inverse"``, an outline
 * in the page colour under the inverted surface.
 */
export interface IngotMarketingCtaAction {
  label: string;
  href: string;
}

export function IngotMarketingCta({
  title,
  text,
  primary,
  secondary,
  testId,
}: {
  title: string;
  text?: string;
  /** Main action — the filled accent button on the dark surface. */
  primary: IngotMarketingCtaAction;
  /** Secondary action — the outline button. */
  secondary?: IngotMarketingCtaAction;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="rounded-xl bg-ink px-8 py-12 text-center min-[1100px]:px-16"
      data-testid={testId}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-bg">
        {title}
      </h2>
      {text !== undefined && (
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-bg/80">
          {text}
        </p>
      )}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Button as="a" href={primary.href} variant="accent" size="lg">
          {primary.label}
        </Button>
        {secondary !== undefined && (
          <Button as="a" href={secondary.href} variant="inverse" size="lg">
            {secondary.label}
          </Button>
        )}
      </div>
    </div>
  );
}
