import { useId, useState, type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { IngotEyebrow } from "./IngotEyebrow";
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
  collapsible = false,
  toggleLabel,
  children,
  footer,
  testId,
}: {
  /** Pořadí kroku, dvojmístně („02"). Hotový krok ho nahradí fajfkou. */
  step: string;
  /** Řádek nad nadpisem — mono verzálky, typicky „Krok 02". */
  kicker: string;
  title: ReactNode;
  /**
   * Doplněk za nadpisem — počet položek, jednotka („2 / 2 aktivní").
   * U sbalitelné karty je to jediné, co ze sbaleného kroku zbude, takže
   * tam patří shrnutí obsahu, ne ozdoba.
   */
  meta?: ReactNode;
  done?: boolean;
  /** Přeložený popisek stavu pro odečítač („Hotovo"). */
  doneLabel?: string;
  /**
   * Přidá do záhlaví tlačítko, které schová tělo i patičku. Hotové kroky
   * se sbalují samy — viz `open` níž.
   */
  collapsible?: boolean;
  /** Přeložený popisek sbalovacího tlačítka („Sbalit krok"). */
  toggleLabel?: string;
  children: ReactNode;
  /** Patička — typicky jedna akce „Přidat…". */
  footer?: ReactNode;
  testId?: string;
}): JSX.Element {
  const bodyId = useId();
  const [open, setOpen] = useState(!done);

  //: Sbalení hotového kroku drží stav, ale ODVOZUJE se od `done`: krok,
  //: který se dokončí až na obrazovce, se musí sbalit hned, jinak by
  //: „automaticky" znamenalo „po reloadu" a další krok by se nikdy sám
  //: nedostal do zorného pole. Ruční přepnutí mezitím zůstává — přepíše
  //: ho teprve další změna `done`, tedy nová informace, ne překreslení.
  const [syncedDone, setSyncedDone] = useState(done);
  if (syncedDone !== done) {
    setSyncedDone(done);
    setOpen(!done);
  }

  //: Nesbalitelná karta žádný stav nemá. Bez tohohle by `open` z dřívějška
  //: schoval obsah kartě, která o sbalování nikdy nepožádala.
  const shown = !collapsible || open;

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
          <IngotEyebrow tone={done ? "ok" : "neutral"}>{kicker}</IngotEyebrow>
          <p className="mb-1 mt-[3px] flex items-baseline gap-2 text-base font-semibold tracking-[-0.015em] text-ink">
            {title}
            {meta !== undefined && (
              <span className="text-[13px] font-normal text-ink-3">{meta}</span>
            )}
          </p>
        </div>
        {collapsible && (
          <button
            type="button"
            //: `aria-controls` míří na tělo, ne na kartu — odečítač tak
            //: nabídne skok přesně na to, co tlačítko odkrylo.
            aria-expanded={open}
            aria-controls={bodyId}
            aria-label={toggleLabel}
            onClick={() => setOpen((prev) => !prev)}
            className="-mr-1.5 ml-auto grid h-7 w-7 flex-none place-items-center self-start rounded-sm text-ink-3 hover:bg-surface-3 hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
          >
            <IngotIcon
              name="chevron-right"
              size={13}
              className={cx("transition-transform", open && "rotate-90")}
            />
          </button>
        )}
      </div>
      {/*
        Tělo zůstává v DOM i sbalené a schová ho `hidden`. Vlastní `id`
        musí existovat pořád — `aria-controls` mířící do prázdna je
        rozbitý vztah, ne dočasný stav, a hledání na stránce má sbalený
        krok pořád najít.
      */}
      <div id={bodyId} hidden={!shown} className="px-[18px] py-4">
        {children}
      </div>
      {footer !== undefined && shown && (
        <div className="flex justify-center border-t border-border bg-surface p-2.5">
          {footer}
        </div>
      )}
    </div>
  );
}
