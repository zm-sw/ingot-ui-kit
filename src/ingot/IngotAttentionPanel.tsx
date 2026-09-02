import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";

/**
 * Tmavý panel „co po tobě obrazovka chce teď“ — otevírá přehledy obou
 * administrací.
 *
 * **Pojmenovaná výjimka z principu 02** („pozadí stránky je vždy tmavší
 * než karta“): tohle je jediné místo, kde je karta tmavší než pozadí,
 * a právě proto funguje jako signál. Výjimka drží jen dokud je vzácná —
 * odtud pravidlo v dokumentaci: **nejvýš jeden na stránce**, a jen pro
 * to, co čeká na zásah. Druhý panel na téže stránce už není signál,
 * ale druhé pozadí. (Rozhodnutí vlastníka 2026-09-02, bod 08.)
 *
 * Kreslí se tokeny ``--ink``/``--bg``, takže v tmavém režimu se obrátí
 * na světlý panel a kontrast drží sám od sebe.
 *
 * Obsah (signální pilulky, odkazy, chipy) dodává volající — panel drží
 * plochu, nadpis a pravý sloupec, ne to, čím se signalizuje.
 *
 * Ingot **nemá vlastní i18n namespace** — texty dodává volající.
 */
export function IngotAttentionPanel({
  title,
  children,
  aside,
  testId,
}: {
  /** Přeložený nadpis — „Co řešit teď“. */
  title: string;
  /** Tělo panelu: věta souhrnu, signální pilulky, akce. */
  children: ReactNode;
  /** Pravý sloupec — chipy dotčených záznamů, odkaz „+2 další“. */
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
        {/* 1.1: aside roste — signální mřížka přehledu potřebuje zbytek
            šířky, chip s pár řádky se jen přisune doprava (basis-80). */}
        {aside !== undefined && (
          <div className="min-w-0 flex-1 basis-80">{aside}</div>
        )}
      </div>
    </section>
  );
}
