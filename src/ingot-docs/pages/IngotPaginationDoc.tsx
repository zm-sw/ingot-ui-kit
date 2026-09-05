import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotPaginationDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotPaginationDemo?raw");

export const IngotPaginationDoc: IngotDocPage = {
  name: "IngotPagination",
  status: "beta",
  version: "1.0",
  tag: ".pager",
  tokens: ["--ink-3"],
  classNameNote: {
    cs: "Bere `className`, ale jen na rozvržení — šířku, mezery, umístění v mřížce. Vzhled drží primitivum.",
    en: "Takes `className`, but for layout only — width, spacing, placement in a grid. The look stays with the primitive.",
  },
  summary: {
    cs: "Stránkování pod tabulkou. Řízené volajícím — s tabulkou se nepře o to, kdo drží stav stránky.",
    en: "Pagination under a table. Controlled by the caller — it never fights the table over who owns the page state.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Seznam je delší, než co dává smysl vykreslit najednou, a data se načítají po
        stránkách — typicky ze serveru.
      </>,
      <>
        Pod tabulkou má stát pager ve tvaru předchozí / stav / další. Pořadí bloků list
        obrazovky je: filtr bar, pruh hromadných akcí, tabulka, pager.
      </>,
    ],
    en: [
      <>
        The list is longer than makes sense to render at once and the data is fetched a
        page at a time — typically from a server.
      </>,
      <>
        A previous / status / next pager belongs under the table. The block order of a
        list screen is: filter bar, bulk-action bar, table, pager.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Řádků je pár desítek a vejdou se do jednoho scrollboxu — sticky hlavička tabulky
        je pak jednodušší než stav stránky navíc.
      </>,
      <>
        Potřebuješ číslované stránky nebo „načíst další". Tenhle tvar je záměrně jen
        předchozí / další; jiný tvar znamená rozšířit primitivum, ne ho obcházet.
      </>,
    ],
    en: [
      <>
        There are only a few dozen rows and they fit one scroll box — the table's sticky
        header is then simpler than extra page state.
      </>,
      <>
        You need numbered pages or "load more". This shape is deliberately previous /
        next only; a different shape means extending the primitive, not working around
        it.
      </>,
    ],
  },
  props: [
    {
      name: "page",
      type: "number",
      required: true,
      note: {
        cs: "Aktuální stránka, číslovaná od 1.",
        en: "The current page, 1-based.",
      },
    },
    {
      name: "pageCount",
      type: "number",
      required: true,
      note: {
        cs: "Celkový počet stránek.",
        en: "The total number of pages.",
      },
    },
    {
      name: "onPageChange",
      type: "(page: number) => void",
      required: true,
      note: {
        cs: "Volá se s novým číslem stránky; mimo rozsah se nevolá vůbec.",
        en: "Called with the new page number; never called out of range.",
      },
    },
    {
      name: "prevLabel",
      type: "string",
      required: true,
      note: {
        cs: "Přeložené „Předchozí“.",
        en: 'Translated "Previous".',
      },
    },
    {
      name: "nextLabel",
      type: "string",
      required: true,
      note: {
        cs: "Přeložené „Další“.",
        en: 'Translated "Next".',
      },
    },
    {
      name: "status",
      type: "ReactNode",
      required: false,
      note: {
        cs: "Už složený stav („Strana 2 z 8“) — interpolaci umí jen volající.",
        en: 'The already-composed status ("Page 2 of 8") — only the caller can interpolate it.',
      },
    },
    {
      name: "label",
      type: "string",
      required: false,
      note: {
        cs: "Popisek navigačního orientačního bodu pro odečítač; rozliší dva pagery na jedné obrazovce.",
        en: "The label of the navigation landmark for screen readers; tells two pagers on one screen apart.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Průchozí třída obalu.",
        en: "Pass-through class on the wrapper.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "data-testid pageru.", en: "data-testid of the pager." },
    },
  ],
  a11y: {
    cs: [
      <>
        Pager je <IngotCode>&lt;nav&gt;</IngotCode> — orientační bod, na který odečítač
        umí skočit. S <IngotCode>label</IngotCode> se dva pagery na obrazovce nespletou.
      </>,
      <>
        Krajní tlačítka se vypínají: na první straně nejde „předchozí“, na poslední
        „další“. <IngotCode>onPageChange</IngotCode> se tak nikdy nezavolá mimo rozsah.
      </>,
      <>
        Stav se neohlašuje živě: mění se jen po kliknutí a fokus zůstává na tlačítku —
        hlášení navíc by rušilo.
      </>,
    ],
    en: [
      <>
        The pager is a <IngotCode>&lt;nav&gt;</IngotCode> — a landmark a screen reader
        can jump to. With <IngotCode>label</IngotCode>, two pagers on one screen cannot
        be confused.
      </>,
      <>
        The edge buttons disable themselves: no "previous" on the first page, no "next"
        on the last. <IngotCode>onPageChange</IngotCode> is therefore never called out
        of range.
      </>,
      <>
        The status is not announced live: it only changes after a click and focus stays
        on the button — an extra announcement would be noise.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>prevLabel</IngotCode>, <IngotCode>nextLabel</IngotCode> a{" "}
        <IngotCode>label</IngotCode> — všechno už přeložené od volajícího.
      </>,
      <>
        <IngotCode>status</IngotCode> přichází složený („Strana 2 z 8“): interpolace a
        skloňování patří do překladové vrstvy volajícího.
      </>,
    ],
    en: [
      <>
        <IngotCode>prevLabel</IngotCode>, <IngotCode>nextLabel</IngotCode> and{" "}
        <IngotCode>label</IngotCode> — all translated by the caller.
      </>,
      <>
        <IngotCode>status</IngotCode> arrives composed ("Page 2 of 8"): interpolation
        and pluralisation belong to the caller's translation layer.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        <strong>Číslované stránky.</strong> Jen předchozí / další; číslovaná lišta
        přibude, až si o ni řekne konkrétní obrazovka.
      </>,
      <>
        <strong>Velikost stránky.</strong> Přepínač „na stránku“ patří do filtr baru, ne
        do pageru.
      </>,
    ],
    en: [
      <>
        <strong>Numbered pages.</strong> Previous / next only; a numbered bar arrives
        once a concrete screen asks for it.
      </>,
      <>
        <strong>Page size.</strong> A "per page" switch belongs in the filter bar, not
        in the pager.
      </>,
    ],
  },
};
