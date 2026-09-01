import { type JSX, type ReactNode } from "react";

/**
 * Hlavička obrazovky (KAN-628) — nadpis, věta pod ním, akce vpravo.
 *
 * 🪤 **Vzniklo kvůli změřené pasti, ne kvůli eleganci.** Typografický spec
 * (`text-2xl font-semibold tracking-tight text-ink`) bydlel v
 * `components/admin/AdminPageHeader.tsx`, a ten si přes `Breadcrumb` táhne
 * `react-router-dom`. Kdokoli chtěl jen ty dvě třídy, zaplatil celý router:
 * doc web tím dostal `Breadcrumb-*.js` navíc (7 660 B změřeno na buildu).
 * Volba pak byla „opisovat třídy, nebo přitáhnout router" — a obojí je
 * špatně.
 *
 * Tohle primitivum je proto **bez routeru**. `AdminPageHeader` ho skládá:
 * drobečky nad ním, hlavička z něj. Spec tak má jedno místo a nikdo za něj
 * neplatí závislostí, kterou nepotřebuje.
 *
 * Ingot **nemá vlastní i18n namespace** — `title` i `description` dodává
 * volající už přeložené.
 */

/** Sdílený typografický spec. Jedno místo, na které smí guard ukázat. */
export const INGOT_PAGE_TITLE_CLASS =
  "text-2xl font-semibold tracking-tight text-ink";
export const INGOT_PAGE_DESC_CLASS = "mt-1 max-w-3xl text-sm text-ink-3";

export function IngotPageHeader({
  title,
  description,
  actions,
  titleAdornment,
  testId,
}: {
  /** Nadpis obrazovky. Detailní routy sem dávají jméno záznamu. */
  title: ReactNode;
  /** Jedna věta: co tu čtenář najde. */
  description?: ReactNode;
  /** Shluk akcí zarovnaný doprava (tlačítka, filtry, stavové odznaky). */
  actions?: ReactNode;
  /** Odznak vedle nadpisu — stav, počet, štítek. */
  titleAdornment?: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="flex flex-wrap items-end justify-between gap-3"
      data-testid={testId}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className={INGOT_PAGE_TITLE_CLASS}>{title}</h1>
          {titleAdornment}
        </div>
        {description ? (
          <p className={INGOT_PAGE_DESC_CLASS}>{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
