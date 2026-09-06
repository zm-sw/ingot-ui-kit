import type { JSX, ReactNode } from "react";

import { IngotIcon } from "./IngotIcon";

/**
 * Pricing — three ``.pricecard`` from the "Public pages" handoff, the
 * middle one ``.is-featured`` with a badge; bullets with a 14 px check.
 *
 * **The highlight is an ``--ink`` outline and a shadow, not an accent
 * border.** The accent in the section is carried by the badge; if the card
 * carried it too, the section would have two accent elements and the
 * reader would not know which one to read as emphasis.
 *
 * **The badge sits in the card's header, not absolutely across the top
 * edge.** An absolute badge requires the caller to leave room above the
 * pricing (and gets clipped when they forget) — a silent coupling between
 * the card and its surroundings.
 *
 * **The action is required and on the card's foot.** A plan without an
 * action is a dead end, and an unaligned action turns three cards into
 * three differently tall steps.
 *
 * **No amounts in code.** The prices in the prototype are placeholders —
 * the real pricing is platform data. The component therefore CANNOT render
 * anything it does not receive through ``plans``: name, price and the
 * feature list all come from the caller's data. ``price`` is an already
 * formatted string — currency formatting belongs where the tenant's
 * currency and locale are known.
 */
export interface IngotMarketingPlan {
  /** Stable plan key from the data (not an index — plans get reordered). */
  id: string;
  name: string;
  /** Formatted price from the plans data — never a constant in JSX. */
  price: string;
  /** Period after the price ("monthly"…). Content, supplied translated. */
  period?: string;
  description?: string;
  features: readonly string[];
  /** The highlighted card with a badge. At most one. */
  featured?: boolean;
  /** Badge text of the highlighted card ("Most popular"…). */
  badge?: string;
  /**
   * The card's CTA — typically a link to sign-up; supplied by the caller.
   * Required: a plan card you cannot proceed from is a dead end.
   */
  action: ReactNode;
}

export function IngotMarketingPricing({
  plans,
  testId,
}: {
  plans: readonly IngotMarketingPlan[];
  testId?: string;
}): JSX.Element {
  return (
    <div className="grid gap-6 min-[1100px]:grid-cols-3" data-testid={testId}>
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={
            plan.featured
              ? "flex flex-col rounded-lg border border-ink bg-surface p-6 shadow-md"
              : "flex flex-col rounded-lg border border-border bg-surface p-6"
          }
          data-testid={testId ? `${testId}-plan-${plan.id}` : undefined}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-ink">{plan.name}</h3>
            {plan.featured && plan.badge !== undefined && (
              <span className="rounded-sm border border-ink bg-ink px-1.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-surface">
                {plan.badge}
              </span>
            )}
          </div>
          <p className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-[32px] font-semibold tracking-[-0.03em] text-ink">
              {plan.price}
            </span>
            {plan.period !== undefined && (
              <span className="text-[13px] text-ink-3">{plan.period}</span>
            )}
          </p>
          {plan.description !== undefined && (
            <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
              {plan.description}
            </p>
          )}
          <ul className="mt-5 list-none space-y-2.5 p-0">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink-2"
              >
                <span className="mt-0.5 shrink-0 text-ok">
                  <IngotIcon name="check" size={14} />
                </span>
                {feature}
              </li>
            ))}
          </ul>
          {/* ``mt-auto`` = the cards' feet sit on one line even with feature
              lists of different lengths. */}
          <div className="mt-auto pt-6">{plan.action}</div>
        </div>
      ))}
    </div>
  );
}
