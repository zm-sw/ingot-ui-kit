import {
  createContext,
  useContext,
  useId,
  type JSX,
  type ReactNode,
} from "react";

import { cx } from "./cx";
import { IngotIcon } from "./IngotIcon";

/**
 * Sbalitelná sekce postranního panelu — popisek, počet a obsah, který
 * se schová.
 *
 * 🚨 **Není to `IngotSection`.** Ta sází nadpis (`h2`/`h3`) a drží osnovu
 * stránky pro odečítač. Tahle sekce nadpis NENÍ: je to mono uppercase
 * popisek bloku v panelu vedle obsahu, a kdyby se sázel jako nadpis,
 * lhal by o osnově stránky přesně tak, jak `IngotSection` zakazuje.
 * Dvě různé sazby pod jedním propem by z jedné komponenty udělaly dvě
 * schované za přepínačem.
 *
 * 🪤 **Stav drží `<details>`, ne React.** Vypadá to jako místo pro
 * `useState`, ale prohlížeč to umí líp:
 *
 * - odečítač hlásí sbaleno/rozbaleno a Enter přepíná bez naší pomoci,
 * - `open` se dá nastavit z markupu, takže server i test vidí totéž,
 *   co uživatel,
 * - hledání na stránce (Ctrl+F) sbalený obsah v moderních prohlížečích
 *   najde a sekci samo rozbalí — vlastní stav by ho schoval nadobro,
 * - tisk stránky sbalený obsah nevynechá.
 *
 * Chevron se otáčí CSS přes `group-open`. Žádný JavaScript tu není a to
 * je záměr, ne úspora.
 */

/**
 * Jméno skupiny, ve které je otevřená vždy jen jedna sekce.
 *
 * Prázdný řetězec = žádná skupina; `<details name="">` se chová jako
 * `<details>` bez jména, takže se ta větev nemusí psát dvakrát.
 */
const DisclosureGroupContext = createContext<string>("");

/**
 * Skupina, ve které je otevřená vždy nejvýš jedna sekce (accordion).
 *
 * 🪤 Exkluzivitu drží **prohlížeč** přes `name` na `<details>`, ne náš
 * stav. Jméno se generuje (`useId`), takže dvě skupiny na jedné stránce
 * se nemůžou proplést — ručně psané jméno je přesně ten druh kolize,
 * kterou nikdo nehledá, dokud se dva panely nesejdou na jedné obrazovce.
 *
 * Prohlížeč, který `name` neumí, skupinu ignoruje a sekce se chovají
 * samostatně. Nic se nerozbije — jen se jich může otevřít víc.
 *
 * Sekce ve skupině MUSÍ být přímí potomci: `defaultOpen` na dvou z nich
 * je spor, který za tebe rozsoudí prohlížeč (nechá otevřenou poslední).
 */
export function IngotDisclosureGroup({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  const name = useId();
  return (
    <DisclosureGroupContext.Provider value={name}>
      <div data-testid={testId}>{children}</div>
    </DisclosureGroupContext.Provider>
  );
}

/**
 * Ingot **nemá vlastní i18n namespace** — `title` dodává volající.
 */
export function IngotDisclosure({
  title,
  count,
  defaultOpen = false,
  children,
  className,
  testId,
}: {
  /** Popisek bloku — už přeložený. Ne nadpis stránky. */
  title: ReactNode;
  /**
   * Kolik toho uvnitř je. Smysl má tam, kde se to dá spočítat (3 soubory),
   * ne jako ozdoba — sbalená sekce s počtem říká, co v ní čeká.
   */
  count?: number;
  /** Rozbalená hned po vykreslení. Výchozí false. */
  defaultOpen?: boolean;
  children: ReactNode;
  /** Průchozí třída — panel určuje šířku a okraje, vzhled primitivum. */
  className?: string;
  testId?: string;
}): JSX.Element {
  const group = useContext(DisclosureGroupContext);
  return (
    <details
      // Prázdné `name` je pro prohlížeč totéž co žádné.
      name={group === "" ? undefined : group}
      open={defaultOpen}
      className={cx("group border-b border-border", className)}
      data-testid={testId}
    >
      <summary
        className={cx(
          // Vlastní značku prohlížeče schováváme, protože chevron kreslíme
          // sami — jinak by u sekce stály dva ukazatele téhož.
          "flex cursor-pointer list-none items-center gap-2 px-3 py-2.5",
          "[&::-webkit-details-marker]:hidden",
          "hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink",
        )}
      >
        <IngotIcon
          name="chevron-right"
          size={13}
          className="text-ink-4 transition-transform group-open:rotate-90"
        />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-3">
          {title}
        </span>
        {count !== undefined && (
          <span className="font-mono text-[10.5px] tabular-nums text-ink-4">
            {count}
          </span>
        )}
      </summary>
      <div className="px-3 pb-3 pl-[30px] text-sm text-ink-2">{children}</div>
    </details>
  );
}
