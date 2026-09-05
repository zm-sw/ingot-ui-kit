import type { JSX } from "react";

import { Button } from "./Button";

/**
 * Závěrečné CTA (KAN-664) — tmavý blok se dvěma velkými tlačítky
 * z handoffu Veřejné stránky.
 *
 * Pravidlo handoffu: tmavý blok smí být na stránce nejvýš DVAKRÁT
 * (tohle CTA + patička) — to hlídá skladba stránky, ne komponenta.
 *
 * Blok je „inverzní": kreslí se tokeny ``ink``/``bg`` prohozeně, takže
 * v tmavém motivu se obrátí sám a žádnou vlastní barvu nezavádí.
 *
 * Akce jsou ``Button as="a"`` — marketingové CTA naviguje (registrace,
 * kontakt), nic nespouští, takže je to odkaz. Vzhled se z ``Button``
 * NEOPISUJE, bere se z něj: do KAN-664 tu stály ručně psané ``<a>``
 * s okopírovanými třídami, a s nimi i kopie rozhodnutí o kontrastu
 * akcentu v tmavém motivu (``dark:text-bg``). Kopie a11y rozhodnutí je
 * to nejhorší, co se dá zdvojit — nerozbije se, jen tiše zestárne.
 *
 * 🪤 **Hlavní akce není neutrální.** Na tmavé ploše je světlé neutrální
 * tlačítko k nerozeznání od vedlejšího a závěrečná výzva pak nemá kam
 * poslat oko. Akcent je tady jediný barevný prvek bloku; vedlejší akce
 * je ``variant="inverse"``, tedy obrys barvou stránky pod obrácenou
 * plochou.
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
  /** Hlavní akce — akcentové vyplněné tlačítko na tmavé ploše. */
  primary: IngotMarketingCtaAction;
  /** Vedlejší akce — obrysové tlačítko. */
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
