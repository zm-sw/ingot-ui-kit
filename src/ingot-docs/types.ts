/**
 * Tvar doc stránek Ingotu (KAN-581, obsah KAN-624, jazyky KAN-627).
 *
 * Stránka NENÍ próza o komponentě — je to modul, který tu komponentu
 * doopravdy vykreslí. ``Demo`` proto vrací živý strom postavený nad
 * importem z ``@/ingot``; okopírované JSX by bylo přesně ten drift, kvůli
 * kterému se v tomhle repu smazaly ``docs/specs``.
 *
 * Guard ``ingot-doc-pages`` (``scripts/repo_checks.py``) páruje ``name``
 * s exportem z ``apps/web/src/ingot/index.ts`` 1:1 a odmítne PR, kde
 * primitivum stránku nemá — i PR, kde stránka nemá primitivum.
 *
 * 🚨 **Kontrakt na obsah je v TYPU, ne v próze** (KAN-624). ``useWhen``,
 * ``avoidWhen``, ``a11y`` a ``i18n`` jsou POVINNÁ pole, takže stránku bez
 * nich odmítne ``npm run typecheck`` — ne code review, které si té
 * chybějící sekce nemusí všimnout. Prázdné pole (``[]``) typecheck pustí;
 * druhé vynucení proto drží ``tests/ingot/DocsApp.test.tsx``.
 *
 * 🌍 **Co je text, je ``Localized``** (KAN-627). Přeložitelná pole nesou
 * ``Record<DocLang, …>``, takže přidání jazyka do ``DOC_LANGS`` shodí
 * typecheck všude, kde ten text chybí. Jazyk se nedá slíbit, aniž by se
 * napsal. Co text není — ``name``, ``Demo``, ``demoSource``, jméno a typ
 * vlastnosti — zůstává jedno pro všechny jazyky, protože se to nepřekládá
 * a duplikát by se rozešel.
 */
import type { JSX, ReactNode } from "react";

import type { Localized } from "@/ingot-docs/lang";

/**
 * Stránka doc webu, která NENÍ o komponentě (KAN-625).
 *
 * 🚨 Vlastní pojem, ne další ``IngotDocPage``. Registr komponent páruje
 * stránky s exporty z ``@/ingot`` **1 : 1 v obou směrech** a přesně tahle
 * obousměrnost je to, kvůli čemu guard vznikl: komponenta bez stránky je
 * lež stejně jako stránka bez komponenty. Kdyby se úvod nebo Překlady
 * přidaly do téhož seznamu, guard by je hlásil jako stránky o něčem, co
 * ``@/ingot`` neexportuje — a jediná cesta, jak ho umlčet, by bylo tu
 * obousměrnost rozvolnit. Tím by se ztratilo to jediné, co doc web nutí
 * zůstat úplný.
 *
 * Dva seznamy tedy schválně: ``INGOT_DOC_PAGES`` zůstává přísně 1 : 1,
 * ``INGOT_GUIDE_PAGES`` je pro všechno ostatní.
 */
export interface IngotGuideSection {
  /** Kotva v pravém sloupci. Nepřekládá se — je to cíl odkazu. */
  id: string;
  title: Localized<string>;
  body: Localized<ReactNode>;
}

/**
 * Skupina v levém menu. Tři schválně: co kit JE (``system``), jak se
 * z něj staví obrazovky (``app``), a co se od autora čeká (``rules``).
 * Čtvrtá skupina by znamenala, že se některá z těch tří rozpadla.
 */
export type IngotGuideGroup = "system" | "app" | "rules";

export interface IngotGuidePage {
  /** Kus hashe za ``#/`` — ``uvod``, ``preklady``. Nepřekládá se: je to
   *  routa, a přeložený slug by rozbil sdílené odkazy. */
  slug: string;
  /**
   * Do které části menu stránka patří. Povinné: průvodce bez skupiny by
   * se v číslovaném menu neměl kam zařadit, a výchozí skupina by tu
   * volbu jen tiše udělala za autora.
   */
  group: IngotGuideGroup;
  /** Nadpis stránky i popisek v menu. */
  title: Localized<string>;
  /** Jedna věta pod nadpis. */
  summary: Localized<string>;
  sections: readonly IngotGuideSection[];
}

export interface IngotPropRow {
  /** Jméno vlastnosti tak, jak se píše v JSX. Nepřekládá se — je to kód. */
  name: string;
  /** Typ zkráceně — sloupec je pro orientaci, ne náhrada za `.tsx`. */
  type: string;
  /** Nepovinné vlastnosti mají v tabulce jinou váhu než povinné. */
  required: boolean;
  /** Jedna věta: k čemu to je, ne co to dělá. */
  note: Localized<ReactNode>;
}

/**
 * Vlastnosti typu, který na komponentě SÁM nežije.
 *
 * ``IngotTable`` bere ``columns: readonly IngotColumn<Row>[]`` — a všechno,
 * čím se sloupec doopravdy nastavuje (``cell``, ``align``, ``cellClassName``),
 * je uvnitř toho typu. V tabulce vlastností komponenty by z toho zbyl jediný
 * řádek ``columns`` s jednou větou v poznámce, takže by ty vlastnosti na doc
 * webu nebyly dohledatelné vůbec.
 */
export interface IngotExtraPropGroup {
  /** Jméno typu tak, jak se píše (``IngotColumn<Row>``). */
  name: string;
  /** Jedna věta, kterou vlastností komponenty se ten typ předává. */
  note: Localized<ReactNode>;
  props: readonly IngotPropRow[];
}

export interface IngotDocPage {
  /**
   * Jméno exportu z ``@/ingot``. Guard ho čte z registru i odsud —
   * nesoulad shodí gate, takže menu a guard nemůžou rozejít.
   */
  name: string;
  /**
   * Stav primitiva — badge vedle nadpisu (KAN-663). ``stable`` znamená
   * „API se nemění bez ohlášení“, ``beta`` „ještě se hledá tvar“.
   * Povinné schválně: stránka bez stavu by tiše slibovala stabilitu.
   */
  status: "stable" | "beta";
  /**
   * Verze primitiva — druhý badge vedle nadpisu. Nepřekládá se, je to
   * číslo. Povinné ze stejného důvodu jako ``status``.
   *
   * 🚨 **Změna komponenty znamená zvednutí verze v témže commitu.**
   * Změněné chování pod nezměněnou verzí je tichá lež vůči každému, kdo
   * si komponentu zabudoval — a na rozdíl od chybějící verze ji nikdo
   * neuvidí. Pravidlo je v ``CLAUDE.md``, tenhle komentář je jeho
   * připomínka na místě, kde se hodnota píše.
   */
  version: string;
  /**
   * Selektor, pod kterým prvek vystupuje v návrhu (``.btn``, ``.badge``).
   *
   * Vypisuje se vedle nadpisu a na dlaždici rozcestníku, protože je to
   * jediné jméno, kterým se o prvku dá bavit s designérem — jméno
   * Reactového exportu zná jen kód.
   */
  tag: string;
  /**
   * Tokeny, na kterých komponenta stojí.
   *
   * Nejde o výčet všeho, co se v souboru vyskytne, ale o smlouvu:
   * změna kteréhokoli z nich se na téhle komponentě projeví všude
   * v produktu. Podle toho se při review pozná, co změna tokenu rozbije
   * — proto povinné a proto vlastní sekce, ne věta v přístupnosti.
   */
  tokens: readonly string[];
  /** Jedna věta do menu i nad ukázku. */
  summary: Localized<string>;
  /** Živá ukázka. MUSÍ renderovat skutečnou komponentu z ``@/ingot``. */
  Demo: () => JSX.Element;
  /**
   * Zdroj té ukázky, který se vypíše pod přepínačem „Ukaž kód“ (KAN-626).
   *
   * 🚨 **Nikdy sem nepiš řetězec ručně.** Okopírovaný výpis vypadá v den
   * zápisu stejně jako ukázka a od druhého dne tiše lže — je to táž třída
   * chyby, kvůli které guard vynucuje, že ``Demo`` renderuje skutečnou
   * komponentu.
   *
   * Jediný povolený zdroj je ``?raw`` import **téhož modulu**, ze kterého
   * pochází ``Demo``:
   *
   * ```ts
   * import { Demo } from "@/ingot-docs/demos/IngotTableDemo";
   * import demoSource from "@/ingot-docs/demos/IngotTableDemo?raw";
   * ```
   *
   * Tím odpadá otázka „co brání tomu, aby výpis a ukázka byly dvě různé
   * věci“: nic je rozejít nemůže, protože je to jeden soubor přečtený
   * dvakrát. Guard ``ingot-doc-pages`` obojí párování kontroluje, aby se
   * ten pár nedal rozpojit potichu.
   *
   * Nepřekládá se schválně — kód je kód.
   */
  demoSource: string;
  /**
   * Kdy po primitivu sáhnout. Situace, ne vlastnosti — čtenář se rozhoduje
   * podle toho, co staví, ne podle toho, co komponenta umí.
   */
  useWhen: Localized<readonly ReactNode[]>;
  /**
   * Kdy po něm NEsáhnout, a po čem místo toho. Tahle půlka je ta cennější:
   * primitivum použité mimo svůj obor se z repa odstraňuje hůř, než se do
   * něj přidává.
   */
  avoidWhen: Localized<readonly ReactNode[]>;
  props: readonly IngotPropRow[];
  /** Vlastnosti typů předávaných skrz ``props`` — viz `IngotExtraPropGroup`. */
  extraProps?: readonly IngotExtraPropGroup[];
  /**
   * Co primitivum drží za volajícího a co po něm naopak chce. Ne seznam
   * ``aria-*`` atributů, ale to, co konzument musí vědět, aby laťku nesnížil.
   */
  a11y: Localized<readonly ReactNode[]>;
  /**
   * Které popisky komponenta žádá už přeložené. Ingot nemá vlastní i18n
   * namespace — text vždycky dodává volající.
   */
  i18n: Localized<readonly ReactNode[]>;
  /**
   * Co první verze schválně NEUMÍ a čeká na konkrétního žadatele.
   *
   * Nepovinné: většina primitiv svůj obor pokrývá celý. Kde to neplatí
   * (``IngotTable``), je výčet chybějících schopností součástí dokumentace —
   * jinak si čtenář myslí, že narazil na chybu, a napíše si tabulku po svém.
   */
  limits?: Localized<readonly ReactNode[]>;
}
