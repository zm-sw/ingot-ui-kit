import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotMarketingComparisonDemo";
import demoSource from "@/ingot-docs/demos/IngotMarketingComparisonDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// KAN-664. Pairing is a property of the ROW, not the column — hence rows,
// not three separate columns that can shift by an item.
export const IngotMarketingComparisonDoc: IngotDocPage = {
  name: "IngotMarketingComparison",
  status: "beta",
  // 1.1 — header row set with the shared eyebrow type.
  version: "1.1",
  tag: ".cmp",
  tokens: [
    "--border",
    "--surface",
    "--surface-2",
    "--accent-bg",
    "--accent-ink",
    "--ink",
    "--ink-3",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Řádkové srovnání „dnes / s platformou“. Dvojice patří k jednomu úkolu, takže ji nejde napsat rozpojenou.",
    en: "A row-wise “today / with the platform” comparison. The pair belongs to one task, so it cannot be written apart.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Stránka staví „jak to je“ proti „jak to bude“ a k jednomu úkolu patří právě
        jedna dvojice.
      </>,
      <>
        Na srovnání záleží natolik, že se nesmí rozejít: řádky drží dvojici pohromadě,
        takže se jeden sloupec nemůže o položku posunout a začít tiše lhát.
      </>,
    ],
    en: [
      <>
        The page sets “how it is” against “how it will be” and exactly one pair belongs
        to one task.
      </>,
      <>
        The comparison matters enough that it must not drift: rows hold the pair
        together, so one column cannot slide by an item and start lying quietly.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Jsou to data administrace — tři sloupce, řazení, stránkování. Na to je{" "}
        <IngotCode>IngotTable</IngotCode>; tohle srovnání je sazba veřejné stránky bez
        chování tabulky.
      </>,
      <>
        Srovnávají se plány a u každého je cena a akce. Na to je{" "}
        <IngotCode>IngotMarketingPricing</IngotCode>.
      </>,
    ],
    en: [
      <>
        It is admin data — three columns, sorting, pagination. That is{" "}
        <IngotCode>IngotTable</IngotCode>; this comparison is public-page typography
        without table behaviour.
      </>,
      <>
        Plans are being compared and each has a price and an action. That is{" "}
        <IngotCode>IngotMarketingPricing</IngotCode>.
      </>,
    ],
  },
  props: [
    {
      name: "headers",
      type: "IngotMarketingComparisonHeaders",
      required: true,
      note: {
        cs: "Záhlaví tří sloupců — úkol, dnešek, stav s platformou. Obsah, dodaný přeložený.",
        en: "The three column headers — task, today, with the platform. Content, supplied translated.",
      },
    },
    {
      name: "rows",
      type: "readonly IngotMarketingComparisonRow[]",
      required: true,
      note: {
        cs: "Jeden řádek na jeden srovnávaný úkol.",
        en: "One row per compared task.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy — na mřížce.",
        en: "An anchor for tests — on the grid.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotMarketingComparisonRow",
      note: {
        cs: "Jeden úkol a jeho dvojice. Předává se polem rows.",
        en: "One task and its pair. Passed through the rows array.",
      },
      props: [
        {
          name: "id",
          type: "string",
          required: true,
          note: {
            cs: "Stabilní klíč řádku z dat — ne index, řádky se přeskládávají.",
            en: "A stable row key from the data — not an index, rows get reordered.",
          },
        },
        {
          name: "task",
          type: "string",
          required: true,
          note: { cs: "Úkol, který se srovnává.", en: "The task being compared." },
        },
        {
          name: "before",
          type: "IngotMarketingComparisonCell",
          required: true,
          note: { cs: "Jak to vypadá dnes.", en: "How it looks today." },
        },
        {
          name: "after",
          type: "IngotMarketingComparisonCell",
          required: true,
          note: {
            cs: "Jak to vypadá s platformou — zvýrazněný sloupec.",
            en: "How it looks with the platform — the highlighted column.",
          },
        },
      ],
    },
    {
      name: "IngotMarketingComparisonCell",
      note: {
        cs: "Buňka dvojice. Předává se vlastnostmi before a after.",
        en: "A cell of the pair. Passed through the before and after props.",
      },
      props: [
        {
          name: "icon",
          type: "IngotIconName",
          required: false,
          note: {
            cs: "Ikona před textem, 14 px. Dekorace — význam nese text.",
            en: "A 14 px icon before the text. Decoration — the text carries the meaning.",
          },
        },
        {
          name: "text",
          type: "string",
          required: true,
          note: { cs: "Co se v té buňce tvrdí.", en: "What the cell claims." },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Rozdíl mezi sloupci nenese jen barva: zvýrazněný sloupec má vlastní záhlaví a
        ikony, takže srovnání dává smysl i bez vnímání barvy.
      </>,
      <>
        Na úzkém viewportu se mřížka roluje vodorovně a neskládá se do sloupce. Složené
        srovnání přestane srovnávat — dvojice se rozpadne na dva samostatné odstavce.
      </>,
    ],
    en: [
      <>
        Colour is not the only carrier of the difference: the highlighted column has its
        own header and icons, so the comparison holds without colour perception.
      </>,
      <>
        On a narrow viewport the grid scrolls horizontally instead of folding into a
        column. A folded comparison stops comparing — the pair falls apart into two
        separate paragraphs.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>Záhlaví i buňky jsou obsah a dodává je volající přeložené.</>,
      <>
        Delší překlad řádek nerozláme — mřížka roluje vodorovně, takže se sloupce nezúží
        pod čitelnost.
      </>,
    ],
    en: [
      <>Headers and cells alike are content and arrive translated from the caller.</>,
      <>
        A longer translation does not break a row — the grid scrolls horizontally, so
        the columns never narrow below legibility.
      </>,
    ],
  },
};
