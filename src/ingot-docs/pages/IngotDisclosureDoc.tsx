import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotDisclosureDemo";
import demoSource from "@/ingot-docs/demos/IngotDisclosureDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// KAN-786. Born from a context panel that drew its own collapsible section
// — exactly what the kit warns against.
//
// Owner decision: a primitive of its OWN, not a ``collapsible`` prop on
// ``IngotSection``. That one sets a heading (h2/h3) and holds the page
// outline; this section is a mono uppercase block label. One prop over two
// typesettings would be two components hidden behind a switch.
//
// The group (accordion) is part of the first version, also by owner
// decision.
export const IngotDisclosureDoc: IngotDocPage = {
  name: "IngotDisclosure",
  status: "beta",
  // 1.1 — caption set by IngotEyebrow, the kit's shared mono label.
  version: "1.1",
  tag: ".disclosure",
  tokens: ["--border", "--surface-2", "--ink-2", "--ink-3", "--ink-4", "--font-mono"],
  summary: {
    cs: "Sbalitelná sekce postranního panelu — popisek, počet a obsah, který se schová. Stav drží prohlížeč, ne React.",
    en: "A collapsible section in a side panel — a label, a count and a body that hides. The browser holds the state, not React.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Postranní panel má víc bloků, než se vejde na výšku, a čtenář si
        vybírá, který ho zajímá — osa komunikace, doklady, soubory,
        poznámky, štítky.
      </>,
      <>
        Blok se dá spočítat a počet stojí za to ukázat i sbalený.{" "}
        <IngotCode>count</IngotCode> je pak to, podle čeho čtenář pozná, že
        se rozbalení vyplatí.
      </>,
      <>
        Sekce mají patřit k sobě tak, že otevřená je vždy nejvýš jedna —
        na to je <IngotCode>IngotDisclosureGroup</IngotCode>.
      </>,
    ],
    en: [
      <>
        A side panel has more blocks than fit its height and the reader
        picks the one they care about — the conversation timeline,
        documents, files, notes, labels.
      </>,
      <>
        The block can be counted and the count is worth showing while
        collapsed. <IngotCode>count</IngotCode> is then what tells the
        reader whether opening it pays off.
      </>,
      <>
        The sections belong together such that at most one is open — that
        is <IngotCode>IngotDisclosureGroup</IngotCode>.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Je to sekce obrazovky s nadpisem. Na to je{" "}
        <IngotCode>IngotSection</IngotCode>: sází{" "}
        <IngotCode>&lt;h2&gt;</IngotCode>/<IngotCode>&lt;h3&gt;</IngotCode>{" "}
        a drží osnovu stránky. Popisek téhle sekce nadpis NENÍ a nesmí se
        za něj vydávat.
      </>,
      <>
        Obsah je důležitý a sbalením se schová. Sbalená sekce znamená
        „tohle nepotřebuješ vidět hned“ — u varování nebo chyby je to
        špatná zpráva o obsahu.
      </>,
      <>
        Přepínají se pohledy na totéž místo. To jsou záložky{" "}
        <IngotCode>IngotTabs</IngotCode>: záložky mají vždy jeden vybraný
        pohled, sbalitelné sekce můžou být otevřené všechny nebo žádná.
      </>,
    ],
    en: [
      <>
        It is a screen section with a heading. That is{" "}
        <IngotCode>IngotSection</IngotCode>: it sets an{" "}
        <IngotCode>&lt;h2&gt;</IngotCode>/<IngotCode>&lt;h3&gt;</IngotCode>{" "}
        and holds the page outline. This section's label is NOT a heading
        and must not pass for one.
      </>,
      <>
        The content matters and collapsing hides it. A collapsed section
        says “you do not need to see this yet” — for a warning or an error
        that is the wrong thing to say.
      </>,
      <>
        Views of the same place are being switched. Those are tabs,{" "}
        <IngotCode>IngotTabs</IngotCode>: tabs always have exactly one view
        selected, collapsible sections can be all open or all closed.
      </>,
    ],
  },
  props: [
    {
      name: "title",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Popisek bloku — už přeložený. Sází se mono verzálkami, protože to není nadpis stránky.",
        en: "The block's label — already translated. Set in mono uppercase, because it is not a page heading.",
      },
    },
    {
      name: "count",
      type: "number",
      required: false,
      note: {
        cs: "Kolik toho uvnitř je. Jen tam, kde se to dá spočítat — sbalená sekce s počtem říká, co v ní čeká.",
        en: "How much is inside. Only where it can be counted — a collapsed section with a count says what waits in it.",
      },
    },
    {
      name: "defaultOpen",
      type: "boolean",
      required: false,
      note: {
        cs: "Rozbalená hned po vykreslení. Výchozí false.",
        en: "Expanded on first render. Defaults to false.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: { cs: "Obsah sekce.", en: "The section body." },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Průchozí třída — okraje a šířku určuje panel.",
        en: "A pass-through class — the panel sets margins and width.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "Kotva pro testy — na sekci.", en: "An anchor for tests — on the section." },
    },
  ],
  extraProps: [
    {
      name: "IngotDisclosureGroup",
      note: {
        cs: "Obal kolem sekcí, ve kterém je otevřená vždy nejvýš jedna. Exkluzivitu drží prohlížeč, ne náš stav; jméno skupiny se generuje, takže se dvě skupiny na jedné stránce nemůžou proplést.",
        en: "A wrapper around sections in which at most one is open. The browser holds the exclusivity, not our state; the group name is generated, so two groups on one page cannot interlock.",
      },
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Sekce skupiny. Musí to být přímí potomci — defaultOpen na dvou z nich je spor, který rozsoudí prohlížeč.",
            en: "The group's sections. They must be direct children — defaultOpen on two of them is a conflict the browser settles.",
          },
        },
        {
          name: "testId",
          type: "string",
          required: false,
          note: { cs: "Kotva pro testy — na obalu.", en: "An anchor for tests — on the wrapper." },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Sekce stojí na <IngotCode>&lt;details&gt;</IngotCode> a{" "}
        <IngotCode>&lt;summary&gt;</IngotCode>. Odečítač sám hlásí
        „sbaleno“ a „rozbaleno“ a Enter i mezerník přepínají bez naší
        pomoci — žádné <IngotCode>aria-expanded</IngotCode>, které by se
        dalo zapomenout přepnout.
      </>,
      <>
        Popisek NENÍ nadpis. Sekce se schválně nezapisuje do osnovy
        stránky — nadpis, který nic nestrukturuje, o osnově lže, a osnova
        je jedna z mála věcí, které se čtou naslepo.
      </>,
      <>
        Chevron je dekorace. Stav nese sám prvek, ne ikona, takže
        šipka odečítači nic neříká a otáčí se jen CSS.
      </>,
      <>
        Sbalený obsah není zahozený: hledání na stránce ho v moderních
        prohlížečích najde a sekci samo rozbalí, a tisk stránky ho
        nevynechá. Vlastní stav v Reactu by obojí ztratil.
      </>,
    ],
    en: [
      <>
        The section is built on <IngotCode>&lt;details&gt;</IngotCode> and{" "}
        <IngotCode>&lt;summary&gt;</IngotCode>. A screen reader announces
        “collapsed” and “expanded” on its own and Enter or Space toggles it
        without our help — no <IngotCode>aria-expanded</IngotCode> anyone
        could forget to flip.
      </>,
      <>
        The label is NOT a heading. The section deliberately stays out of
        the page outline — a heading that structures nothing lies about the
        outline, and the outline is one of the few things read blind.
      </>,
      <>
        The chevron is decoration. The element itself carries the state,
        not the icon, so the arrow says nothing to a screen reader and
        turns in CSS alone.
      </>,
      <>
        Collapsed content is not thrown away: find-on-page reaches it in
        modern browsers and expands the section itself, and printing does
        not skip it. React-held state would lose both.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>title</IngotCode> dodává volající už přeložený — kit
        vlastní jmenný prostor překladů nemá.
      </>,
      <>
        <IngotCode>count</IngotCode> je číslo, ne text. Sází se{" "}
        <IngotCode>tabular-nums</IngotCode>, takže sekce pod sebou mají
        počty zarovnané bez ohledu na jazyk.
      </>,
    ],
    en: [
      <>
        <IngotCode>title</IngotCode> arrives already translated from the
        caller — the kit has no translation namespace of its own.
      </>,
      <>
        <IngotCode>count</IngotCode> is a number, not copy. It is set in{" "}
        <IngotCode>tabular-nums</IngotCode>, so stacked sections line their
        counts up regardless of language.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Sbalování se neanimuje. Plynulá výška by znamenala vzít stav zpět
        do JavaScriptu a přijít o všechno, co{" "}
        <IngotCode>&lt;details&gt;</IngotCode> dává zadarmo.
      </>,
      <>
        Skupina nemá řízený režim. Prohlížeč drží, která sekce je
        otevřená; kdo tu volbu potřebuje číst nebo nastavovat zvenčí, ať
        si o to řekne — do té doby by řízený režim byl druhý zdroj pravdy
        vedle prvního.
      </>,
      <>
        Prohlížeč, který exkluzivní skupinu neumí, ji ignoruje a sekce se
        chovají samostatně. Nic se nerozbije, jen se jich může otevřít
        víc.
      </>,
    ],
    en: [
      <>
        Collapsing is not animated. A smooth height would mean taking the
        state back into JavaScript and losing everything{" "}
        <IngotCode>&lt;details&gt;</IngotCode> gives for free.
      </>,
      <>
        The group has no controlled mode. The browser holds which section
        is open; whoever needs to read or set that from outside should ask
        — until then a controlled mode would be a second source of truth
        beside the first.
      </>,
      <>
        A browser that does not support the exclusive group ignores it and
        the sections behave independently. Nothing breaks, more of them
        can just be open at once.
      </>,
    ],
  },
};
