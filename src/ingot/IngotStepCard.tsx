import { type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotIcon } from "./IngotIcon";

/**
 * Karta jednoho kroku vícekrokového nastavení.
 *
 * Konfigurace se v téhle aplikaci nedělá jedním dlouhým formulářem, ale
 * kroky, které se dají dokončit v různé dny a různými lidmi. Karta proto
 * nese svůj stav natrvalo — hotový krok zůstane hotový a je vidět
 * i po návratu na obrazovku.
 *
 * 🪤 **Hotový krok je poznat tvarem, ne jen barvou.** Zelené záhlaví
 * doprovází fajfka místo čísla; kdo barvu nerozliší, čte tvar. Sama
 * barva by tenhle stav neunesla — je to jediná informace, kvůli které
 * se člověk na obrazovku vrací.
 *
 * ⚠️ **Patička je pro přidání další položky, ne pro potvrzení kroku.**
 * Krok se nepotvrzuje tlačítkem — je hotový tehdy, když má, co
 * potřebuje. Tlačítko „Hotovo" by zavedlo druhý stav, který s obsahem
 * karty nesouvisí.
 *
 * Ingot **nemá vlastní i18n namespace** — texty dodává volající.
 */

export function IngotStepCard({
  step,
  kicker,
  title,
  meta,
  done = false,
  doneLabel,
  children,
  footer,
  testId,
}: {
  /** Pořadí kroku, dvojmístně („02"). Hotový krok ho nahradí fajfkou. */
  step: string;
  /** Řádek nad nadpisem — mono verzálky, typicky „Krok 02". */
  kicker: string;
  title: ReactNode;
  /** Doplněk za nadpisem — počet položek, jednotka. */
  meta?: ReactNode;
  done?: boolean;
  /** Přeložený popisek stavu pro odečítač („Hotovo"). */
  doneLabel?: string;
  children: ReactNode;
  /** Patička — typicky jedna akce „Přidat…". */
  footer?: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="overflow-hidden rounded-md border border-border bg-surface"
      data-testid={testId}
    >
      <div
        className={cx(
          "flex gap-3.5 border-b px-[18px] py-4",
          done
            ? "border-ok-border bg-ok-bg"
            : "border-border bg-surface-2",
        )}
      >
        <span
          className={cx(
            "grid h-[26px] w-[26px] flex-none place-items-center rounded-full border font-mono text-xs",
            done
              ? "border-ok bg-ok text-white"
              : "border-border-strong text-ink-3",
          )}
        >
          {done ? (
            <>
              <IngotIcon name="check" size={14} title={doneLabel} />
            </>
          ) : (
            step
          )}
        </span>
        <div className="min-w-0">
          <p
            className={cx(
              "font-mono text-[10.5px] uppercase tracking-[0.09em]",
              done ? "text-ok" : "text-ink-3",
            )}
          >
            {kicker}
          </p>
          <p className="mb-1 mt-[3px] flex items-baseline gap-2 text-base font-semibold tracking-[-0.015em] text-ink">
            {title}
            {meta !== undefined && (
              <span className="text-[13px] font-normal text-ink-3">{meta}</span>
            )}
          </p>
        </div>
      </div>
      <div className="px-[18px] py-4">{children}</div>
      {footer !== undefined && (
        <div className="flex justify-center border-t border-border bg-surface p-2.5">
          {footer}
        </div>
      )}
    </div>
  );
}
