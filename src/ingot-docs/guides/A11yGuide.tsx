import { useState } from "react";

import {
  Button,
  IngotCode,
  IngotFieldInput,
  IngotList,
  IngotTable,
  type IngotColumn,
  type IngotFieldSpec,
} from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * "Accessibility" page — the WCAG 2.2 AA rules, how the kit holds them,
 * and the pre-release checklist.
 *
 * The slug "pristupnost" does not collide with the "pristupnost" anchor on
 * component pages: routes live after ``#/``, section anchors after a bare
 * ``#``.
 *
 * **The focus demo is LIVE.** The ring is not drawn as an image or a copied
 * ``outline`` — these are the real ``Button`` and ``IngotFieldInput`` from
 * the kit, so the reader can Tab through exactly what the page describes.
 * An image would drift with the first ring tweak and nobody would notice.
 *
 * The doc web is a PUBLIC page. Internal prose does not belong here: no
 * issue keys, repository paths or guard names.
 */

function Rules({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Cílová laťka je WCAG 2.2 AA a celý admin se ovládá z klávesnice. Není to jen povinnost: obsluha výroby pracuje klávesou rychleji než myší. Většinu pravidel drží komponenty samy — proto se obrazovky skládají z nich a ne z opsaných tříd, se kterými se laťka ztrácí."
          : "The bar is WCAG 2.2 AA and the whole admin is operable from the keyboard. That is not only an obligation: shop-floor staff work faster by key than by mouse. Most rules are held by the components themselves — which is why screens are assembled from them and not from copied classes, where the bar quietly drops."}
      </p>
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Vše jde ovládat klávesnicí a fokus je vždy vidět — prstenec se nikdy
                  nevypíná.
                </>,
                <>
                  Barva nikdy nenese význam sama: stav doprovází text nebo tvar. „Po
                  termínu“ se píše slovem, ne jen červenou tečkou. Platí to i pro grafy
                  a barevné tečky operací.
                </>,
                <>
                  Nadpisy jdou po úrovních bez přeskakování — odečítač se podle nich
                  orientuje.
                </>,
              ]
            : [
                <>
                  Everything works from the keyboard and focus is always visible — the
                  ring is never turned off.
                </>,
                <>
                  Colour never carries meaning alone: a state is accompanied by text or
                  shape. “Overdue” is spelled out, not left to a red dot. The same holds
                  for charts and operation colour dots.
                </>,
                <>
                  Headings go level by level without skipping — screen readers navigate
                  by them.
                </>,
              ]
        }
      />
    </div>
  );
}

function Contrast({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Kontrast se nehádá od oka — paleta je na něj měřená, takže stačí sáhnout po správném tokenu. Barva mimo tokeny tu záruku nemá."
          : "Contrast is not judged by eye — the palette is measured for it, so it is enough to reach for the right token. A colour outside the tokens carries no such guarantee."}
      </p>
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Text nejméně 4,5 : 1. <IngotCode>--ink</IngotCode>,{" "}
                  <IngotCode>--ink-2</IngotCode> a <IngotCode>--ink-3</IngotCode> drží
                  AA na bílé ploše i na <IngotCode>--surface-2</IngotCode>, ve světlém i
                  tmavém motivu.
                </>,
                <>
                  <IngotCode>--ink-4</IngotCode> je jen pro neaktivní stav a dekoraci,
                  nikdy pro čitelný obsah — na AA nedosáhne a dosáhnout nemá.
                </>,
                <>
                  Nesouvislé prvky potřebují nejméně 3 : 1: obrys vstupu, přepínač i
                  zaškrtávátko proto berou <IngotCode>--border-strong</IngotCode>, ne{" "}
                  <IngotCode>--border</IngotCode>. S běžným obrysem by hranice pole na
                  světlé ploše zmizela.
                </>,
              ]
            : [
                <>
                  Text at least 4.5 : 1. <IngotCode>--ink</IngotCode>,{" "}
                  <IngotCode>--ink-2</IngotCode> and <IngotCode>--ink-3</IngotCode> hold
                  AA on white and on <IngotCode>--surface-2</IngotCode> alike, in the
                  light and the dark theme.
                </>,
                <>
                  <IngotCode>--ink-4</IngotCode> is for disabled states and decoration
                  only, never for readable content — it does not reach AA and is not
                  meant to.
                </>,
                <>
                  Non-text elements need at least 3 : 1: the outline of an input, a
                  switch and a checkbox therefore take{" "}
                  <IngotCode>--border-strong</IngotCode>, not{" "}
                  <IngotCode>--border</IngotCode>. With the ordinary outline the edge of
                  a field would vanish on a light surface.
                </>,
              ]
        }
      />
    </div>
  );
}

/**
 * Live focus ring. ``IngotFieldInput`` is a controlled input, so the value
 * is held by this demo's state — without it the field could not be typed
 * into and "try it with Tab" would be an empty sentence.
 */
const FOCUS_FIELD: IngotFieldSpec = {
  key: "focus-demo",
  kind: "text",
  label: "focus-demo",
};

function FocusDemo({ lang }: { lang: DocLang }): JSX.Element {
  const [value, setValue] = useState(lang === "cs" ? "Aktivní pole" : "Active field");
  const label = lang === "cs" ? "Zkušební pole" : "Sample field";
  return (
    <div
      className="flex flex-wrap items-center gap-4 rounded-md border border-border bg-surface-2 p-4"
      data-testid="docs-focus-ring"
    >
      <Button variant="accent">{lang === "cs" ? "Tlačítko" : "Button"}</Button>
      {/* The label wraps the input: ``IngotFieldInput`` exposes no id, so
          ``htmlFor`` would point into a void and the field would stay nameless. */}
      <label>
        <span className="sr-only">{label}</span>
        <IngotFieldInput
          field={FOCUS_FIELD}
          value={value}
          onChange={(next) => setValue(typeof next === "string" ? next : "")}
          testId="docs-focus-input"
        />
      </label>
      <span className="text-xs text-ink-3">
        {lang === "cs"
          ? "Klikni sem a projdi oba prvky Tabem — prstenec musí být vidět na obou."
          : "Click here and walk both elements with Tab — the ring has to show on both."}
      </span>
    </div>
  );
}

interface KeyRow {
  combo: string;
  note: Localized<string>;
}

const KEYS: readonly KeyRow[] = [
  {
    combo: "Tab",
    note: {
      cs: "Pořadí odpovídá vizuálnímu pořadí; skryté prvky z pořadí vypadávají.",
      en: "The order matches the visual order; hidden elements drop out of it.",
    },
  },
  {
    combo: "Esc",
    note: {
      cs: "Zavře boční panel, modální okno i rozbalené menu; fokus se vrací na prvek, který je otevřel.",
      en: "Closes the side panel, the modal and an expanded menu; focus returns to the element that opened it.",
    },
  },
  {
    combo: "↑ ↓",
    note: {
      cs: "Pohyb v seznamu a v rozbaleném menu; fokus neuteče mimo komponentu.",
      en: "Movement inside a list and an expanded menu; focus does not escape the component.",
    },
  },
  {
    combo: "Cmd/Ctrl K",
    note: {
      cs: "Globální hledání odkudkoli.",
      en: "Global search from anywhere.",
    },
  },
  {
    combo: "Enter",
    note: {
      cs: "Potvrdí formulář; v tabulce otevře detail zvýrazněného řádku.",
      en: "Submits a form; in a table it opens the detail of the highlighted row.",
    },
  },
];

function keyColumns(lang: DocLang): readonly IngotColumn<KeyRow>[] {
  return [
    {
      key: "combo",
      header: lang === "cs" ? "Klávesa" : "Key",
      cell: (row) => <IngotCode>{row.combo}</IngotCode>,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "note",
      header: lang === "cs" ? "Chování" : "Behaviour",
      cell: (row) => row.note[lang],
    },
  ];
}

function FocusAndKeys({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-4 text-sm text-ink-2">
      <p>
        {lang === "cs" ? (
          <>
            Prstenec fokusu je 2px v barvě <IngotCode>--accent</IngotCode> s odsazením
            2px. Vstup dostane navíc měkký prstenec 3px v{" "}
            <IngotCode>--accent-bg</IngotCode>, aby bylo pole poznat i na zvednuté
            ploše. <IngotCode>outline: none</IngotCode> bez náhrady se nepoužívá nikdy —
            je to nejrychlejší způsob, jak obrazovku pro klávesnici zavřít.
          </>
        ) : (
          <>
            The focus ring is 2px of <IngotCode>--accent</IngotCode> with a 2px offset.
            An input adds a soft 3px ring in <IngotCode>--accent-bg</IngotCode>, so the
            field stays legible on a raised surface.{" "}
            <IngotCode>outline: none</IngotCode> without a replacement is never used —
            it is the fastest way to close a screen to keyboard users.
          </>
        )}
      </p>
      <FocusDemo lang={lang} />
      <p>
        {lang === "cs"
          ? "Pět kláves platí napříč celým adminem. Obrazovka si je nepředefinovává — přeučená klávesa stojí uživatele víc než ta chybějící."
          : "Five keys hold across the whole admin. A screen does not redefine them — a relearned key costs the user more than a missing one."}
      </p>
      <div className="overflow-x-auto">
        <IngotTable
          columns={keyColumns(lang)}
          rows={KEYS}
          rowKey={(row) => row.combo}
          caption={lang === "cs" ? "Klávesové zkratky" : "Keyboard shortcuts"}
          className="min-w-[34rem]"
          testId="docs-a11y-keys"
        />
      </div>
    </div>
  );
}

function Semantics({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Odečítač obrazovky nevidí rozvržení — čte roli, jméno a stav. Co obrazovka sděluje tvarem, musí sdělit i jimi."
          : "A screen reader does not see the layout — it reads role, name and state. Whatever a screen says by shape has to be said by those too."}
      </p>
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Ikonové tlačítko má vždy <IngotCode>aria-label</IngotCode> se
                  slovesem; dekorativní ikona se odečítači nehlásí.
                </>,
                <>
                  Modální okno a boční panel mají{" "}
                  <IngotCode>role=&quot;dialog&quot;</IngotCode>,{" "}
                  <IngotCode>aria-modal=&quot;true&quot;</IngotCode> a uzavřený fokus;
                  zbytek stránky je pod nimi označený jako <IngotCode>inert</IngotCode>,
                  aby se do něj nedalo protabovat.
                </>,
                <>
                  Hlášky a validace jdou do{" "}
                  <IngotCode>aria-live=&quot;polite&quot;</IngotCode>;{" "}
                  <IngotCode>assertive</IngotCode> je vyhrazené kritické chybě, protože
                  přeruší, co odečítač právě čte.
                </>,
                <>
                  Tabulka má skutečné hlavičkové buňky se <IngotCode>scope</IngotCode>,
                  jinak odečítač neví, ke kterému sloupci buňka patří; vybraný řádek
                  nese <IngotCode>aria-selected</IngotCode>.
                </>,
                <>
                  Chyba pole se váže na pole přes{" "}
                  <IngotCode>aria-describedby</IngotCode> — ne jen barvou rámečku,
                  kterou odečítač nepřečte.
                </>,
                <>
                  Klikatelná plocha nejméně 32 × 32 px v hustých tabulkách, na dotykovém
                  zařízení 44 × 44 px.
                </>,
                <>
                  <IngotCode>prefers-reduced-motion</IngotCode> vypíná posuny a animace;
                  zůstává jen změna barvy.
                </>,
              ]
            : [
                <>
                  An icon button always carries an <IngotCode>aria-label</IngotCode>{" "}
                  with a verb; a decorative icon is hidden from screen readers.
                </>,
                <>
                  A modal and a side panel carry{" "}
                  <IngotCode>role=&quot;dialog&quot;</IngotCode>,{" "}
                  <IngotCode>aria-modal=&quot;true&quot;</IngotCode> and a trapped
                  focus; the rest of the page beneath them is marked{" "}
                  <IngotCode>inert</IngotCode> so it cannot be tabbed into.
                </>,
                <>
                  Notifications and validation go to{" "}
                  <IngotCode>aria-live=&quot;polite&quot;</IngotCode>;{" "}
                  <IngotCode>assertive</IngotCode> is reserved for a critical error,
                  because it interrupts whatever the screen reader is reading.
                </>,
                <>
                  A table has real header cells with <IngotCode>scope</IngotCode>,
                  otherwise a screen reader cannot tell which column a cell belongs to;
                  a selected row carries <IngotCode>aria-selected</IngotCode>.
                </>,
                <>
                  A field error is tied to its field through{" "}
                  <IngotCode>aria-describedby</IngotCode> — not by the border colour
                  alone, which a screen reader never reads.
                </>,
                <>
                  Clickable area at least 32 × 32 px in dense tables, and 44 × 44 px on
                  touch.
                </>,
                <>
                  <IngotCode>prefers-reduced-motion</IngotCode> turns off shifts and
                  animation; only the colour change remains.
                </>,
              ]
        }
      />
    </div>
  );
}

function Checklist({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {lang === "cs"
          ? "Tři rychlé zkoušky před vydáním obrazovky. Neměří všechno — ale co neprojde jimi, neprojde ani ničím dalším."
          : "Three quick checks before a screen ships. They do not measure everything — but what fails them fails everything else too."}
      </p>
      <IngotList
        variant="ordered"
        items={
          lang === "cs"
            ? [
                <>
                  Projdi obrazovku jen klávesou Tab: každý prvek je dosažitelný, fokus
                  je vidět a nikde se nezacyklí.
                </>,
                <>
                  Přibliž na 200 %: nic nepřeteče, nic se nepřekryje, text se neuřízne,
                  tabulka scrolluje vodorovně a horní lišta se nerozpadne.
                </>,
                <>
                  Představ si obrazovku v šedotisku: každý stav musí být poznat i bez
                  barvy.
                </>,
              ]
            : [
                <>
                  Walk the screen with the Tab key alone: every element is reachable,
                  focus is visible, and nothing loops.
                </>,
                <>
                  Zoom to 200 %: nothing overflows, nothing overlaps, no text is cut
                  off, the table scrolls horizontally and the top bar does not fall
                  apart.
                </>,
                <>
                  Picture the screen in greyscale: every state must be recognisable
                  without colour.
                </>,
              ]
        }
      />
    </div>
  );
}

export const A11yGuide: IngotGuidePage = {
  slug: "pristupnost",
  group: "rules",
  title: { cs: "Přístupnost", en: "Accessibility" },
  summary: {
    cs: "Pravidla WCAG 2.2 AA, která kit drží za obrazovky, kontrastní tokeny, klávesy platné všude a tři zkoušky před vydáním.",
    en: "The WCAG 2.2 AA rules the kit holds for screens, the contrast tokens, the keys that hold everywhere, and three pre-release checks.",
  },
  sections: [
    {
      id: "pravidla-a11y",
      title: { cs: "Pravidla", en: "Rules" },
      body: {
        cs: <Rules lang="cs" />,
        en: <Rules lang="en" />,
      },
    },
    {
      id: "kontrast",
      title: { cs: "Kontrast", en: "Contrast" },
      body: {
        cs: <Contrast lang="cs" />,
        en: <Contrast lang="en" />,
      },
    },
    {
      id: "fokus-a-klavesnice",
      title: { cs: "Fokus a klávesnice", en: "Focus and keyboard" },
      body: {
        cs: <FocusAndKeys lang="cs" />,
        en: <FocusAndKeys lang="en" />,
      },
    },
    {
      id: "semantika",
      title: {
        cs: "Sémantika a asistivní technologie",
        en: "Semantics and assistive technology",
      },
      body: {
        cs: <Semantics lang="cs" />,
        en: <Semantics lang="en" />,
      },
    },
    {
      id: "checklist",
      title: {
        cs: "Kontrola před vydáním",
        en: "The pre-release check",
      },
      body: {
        cs: <Checklist lang="cs" />,
        en: <Checklist lang="en" />,
      },
    },
  ],
};
