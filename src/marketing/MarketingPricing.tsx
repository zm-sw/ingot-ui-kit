import type { JSX, ReactNode } from "react";

import { IngotIcon } from "@/ingot";

/**
 * Ceník (KAN-664) — tři ``.pricecard`` z handoffu Veřejné stránky,
 * prostřední ``.is-featured`` s odznakem; odrážky s fajfkou 14 px.
 *
 * 🪤 **Zvýraznění je obrys ``--ink`` a stín, ne akcentový rámeček.**
 * Akcent v sekci nese odznak; kdyby ho nesla i karta, sekce má dva
 * akcentové prvky a čtenář neví, který z nich má číst jako důraz.
 *
 * 🪤 **Odznak sedí v hlavičce karty, ne absolutně přes horní hranu.**
 * Absolutní odznak vyžaduje, aby mu volající nechal místo nad ceníkem
 * (a když zapomene, uřízne se) — tichá vazba mezi kartou a jejím okolím.
 *
 * 🪤 **Akce je povinná a na patě karty.** Plán bez akce je slepá ulička,
 * a nezarovnaná akce dělá ze tří karet tři různě vysoké schody.
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
  /**
   * CTA karty — typicky odkaz na registraci; dodává volající. Povinná:
   * karta plánu, ze které se nedá pokračovat, je slepá ulička.
   */
  action: ReactNode;
}

export function MarketingPricing({
  plans,
  testId,
}: {
  plans: readonly MarketingPlan[];
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
          {/* ``mt-auto`` = paty karet sedí na jedné lince i s různě
              dlouhými výčty vlastností. */}
          <div className="mt-auto pt-6">{plan.action}</div>
        </div>
      ))}
    </div>
  );
}
