import type { JSX, ReactNode } from "react";

import { IngotIcon } from "@/ingot";

/**
 * Ceník (KAN-664) — tři ``.pricecard`` z handoffu Veřejné stránky,
 * prostřední ``.is-featured`` s odznakem; odrážky s fajfkou 14 px.
 *
 * 🚨 **Žádné částky v kódu.** Ceny v prototypu (4 900 Kč…) jsou
 * placeholder — reálný ceník jsou platformní data (zdroj plánů,
 * memory ``plans-json-column-read-mutate-write``; entitlementy epic
 * KAN-499). Komponenta proto NEUMÍ vykreslit nic, co nedostane přes
 * ``plans``: název, cenu i výčet vlastností dodává volající z dat.
 * ``price`` je už naformátovaný řetězec — formátování měny patří tam,
 * kde se ví, jakou měnu a locale tenant má.
 */
export interface MarketingPlan {
  /** Stabilní klíč plánu z dat (ne index — plány se přeskládávají). */
  id: string;
  name: string;
  /** Naformátovaná cena z dat plánů — nikdy konstanta v JSX. */
  price: string;
  /** Perioda za cenou („měsíčně"…). Obsah, dodaný přeložený. */
  period?: string;
  description?: string;
  features: readonly string[];
  /** Zvýrazněná karta s odznakem. Nejvýš jedna. */
  featured?: boolean;
  /** Text odznaku zvýrazněné karty („Nejoblíbenější"…). */
  badge?: string;
  /** CTA karty — typicky odkaz na registraci; dodává volající. */
  action?: ReactNode;
}

export function MarketingPricing({
  plans,
  testId,
}: {
  plans: readonly MarketingPlan[];
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="grid items-start gap-6 min-[1100px]:grid-cols-3"
      data-testid={testId}
    >
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={
            plan.featured
              ? "relative rounded-lg border border-accent-border bg-surface p-6 shadow-md"
              : "rounded-lg border border-border bg-surface p-6"
          }
          data-testid={testId ? `${testId}-plan-${plan.id}` : undefined}
        >
          {plan.featured && plan.badge !== undefined && (
            <span className="absolute -top-3 left-6 rounded-full border border-accent-border bg-accent-bg px-2.5 py-0.5 text-xs font-medium text-accent-ink">
              {plan.badge}
            </span>
          )}
          <h3 className="text-[15px] font-semibold text-ink">{plan.name}</h3>
          <p className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-ink">
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
          {plan.action !== undefined && (
            <div className="mt-6">{plan.action}</div>
          )}
        </div>
      ))}
    </div>
  );
}
