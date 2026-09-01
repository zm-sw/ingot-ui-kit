import type { JSX } from "react";

/**
 * Závěrečné CTA (KAN-664) — tmavý blok se dvěma velkými tlačítky
 * z handoffu Veřejné stránky.
 *
 * Pravidlo handoffu: tmavý blok smí být na stránce nejvýš DVAKRÁT
 * (tohle CTA + patička) — to hlídá skladba stránky, ne komponenta.
 *
 * Blok je „inverzní": kreslí se tokeny ``ink``/``bg`` prohozeně, takže
 * v tmavém motivu se obrátí sám a žádnou vlastní barvu nezavádí.
 * Akce jsou odkazy, ne buttony — marketingové CTA naviguje (registrace,
 * kontakt), nic nespouští.
 */
export interface MarketingCtaAction {
  label: string;
  href: string;
}

export function MarketingCta({
  title,
  text,
  primary,
  secondary,
  testId,
}: {
  title: string;
  text?: string;
  /** Hlavní akce — světlé vyplněné tlačítko na tmavé ploše. */
  primary: MarketingCtaAction;
  /** Vedlejší akce — obrysové tlačítko. */
  secondary?: MarketingCtaAction;
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
        <a
          href={primary.href}
          className="inline-flex h-[42px] items-center justify-center rounded-md bg-bg px-5 text-[15px] font-medium text-ink hover:bg-surface-2"
        >
          {primary.label}
        </a>
        {secondary !== undefined && (
          <a
            href={secondary.href}
            className="inline-flex h-[42px] items-center justify-center rounded-md border border-bg/40 px-5 text-[15px] font-medium text-bg hover:bg-bg/10"
          >
            {secondary.label}
          </a>
        )}
      </div>
    </div>
  );
}
