import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotBreadcrumbsDemo";
import demoSource from "@/ingot-docs/demos/IngotBreadcrumbsDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotBreadcrumbsDoc: IngotDocPage = {
  name: "IngotBreadcrumbs",
  status: "stable",
  // 1.1 — caption set by IngotEyebrow, the kit's shared mono label.
  version: "1.1",
  tag: ".crumbs",
  tokens: ["--ink", "--ink-3", "--ink-4", "--font-mono"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Drobečky nad hlavičkou stránky — kde jsem a jak zpátky. V aplikaci bez bočního menu nesou celou orientaci do hloubky.",
    en: "Breadcrumbs above the page header — where I am and how to get back. In an application without a side menu they carry all the orientation in depth.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Detail, ke kterému se dá dojít jen přes seznam. Horní lišta říká,
        ve které sekci jsi, drobečky říkají, jak hluboko — a bez bočního
        menu tuhle druhou informaci nemá kdo jiný nést.
      </>,
      <>
        Cesta hlubší než dva články. Sekce, seznam, položka: teprve tady
        má čtenář co ztratit a drobečky mu to vrátí.
      </>,
      <>
        Návrat o úroveň výš, který není „zpátky v prohlížeči“. Kdo přišel
        z odkazu, historii nemá — cestu vzhůru mu ukážou jen drobečky.
      </>,
    ],
    en: [
      <>
        A detail you can only reach through a list. The top bar says which
        section you are in, the breadcrumbs say how deep — and without a
        side menu there is nobody else to carry that second piece.
      </>,
      <>
        A path deeper than two crumbs. Section, list, item: only here does
        the reader have something to lose, and the breadcrumbs give it back.
      </>,
      <>
        Going one level up in a way that is not the browser's back button.
        Someone who arrived from a link has no history — only the
        breadcrumbs show them the way upwards.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Kořenová stránka sekce. Jediný článek neřekne nic, co by hlavička
        neřekla líp — komponenta proto pro méně než dva články vrátí{" "}
        <IngotCode>null</IngotCode> a lišta se nekreslí vůbec.
      </>,
      <>
        Navigace mezi sourozenci — záložky nad obsahem, přepínač pohledů.
        Drobečky vedou nahoru, ne do stran; na kroky vedle je{" "}
        <IngotCode>IngotTabs</IngotCode>.
      </>,
      <>
        Náhrada hlavního menu. Drobečky říkají, kde stojíš, ne kam se dá
        jít — sekce aplikace patří do <IngotCode>IngotTopNav</IngotCode>.
      </>,
    ],
    en: [
      <>
        The root page of a section. A single crumb says nothing the header
        does not say better — so for fewer than two crumbs the component
        returns <IngotCode>null</IngotCode> and no trail is drawn at all.
      </>,
      <>
        Navigating between siblings — tabs above the content, a view
        switcher. Breadcrumbs lead upwards, not sideways; steps to the side
        are <IngotCode>IngotTabs</IngotCode>.
      </>,
      <>
        A replacement for the main menu. Breadcrumbs say where you stand,
        not where you can go — the application's sections belong to{" "}
        <IngotCode>IngotTopNav</IngotCode>.
      </>,
    ],
  },
  props: [
    {
      name: "items",
      type: "readonly IngotCrumb[]",
      required: true,
      note: {
        cs: "Cesta odshora dolů. Méně než dva články se nevykreslí vůbec.",
        en: "The path from the top down. Fewer than two crumbs render nothing at all.",
      },
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený aria-label navigace. Odečítač jinak ohlásí jen „navigace“.",
        en: "A translated aria-label for the navigation. Otherwise a screen reader announces only “navigation”.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro test. Na vzhled ani na chování nemá vliv.",
        en: "An anchor for tests. It affects neither appearance nor behaviour.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotCrumb",
      note: {
        cs: "Jeden článek cesty, předává se vlastností items.",
        en: "One crumb of the path, passed through the items prop.",
      },
      props: [
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Přeložený popisek. Vykreslí se mono verzálkami, takže krátce.",
            en: "A translated label. It renders in monospaced small caps, so keep it short.",
          },
        },
        {
          name: "href",
          type: "string",
          required: false,
          note: {
            cs: "Adresa. Poslední článek ji mít nemusí — stejně se jako odkaz nevykreslí.",
            en: "The address. The last crumb does not need one — it is not rendered as a link anyway.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Poslední článek <strong>není odkaz</strong>. Je to místo, kde
        stojíš, a odkaz sám na sebe je slib prokliku, který nikam nevede.
        Komponenta ho vykreslí jako text, i kdyby <IngotCode>href</IngotCode>{" "}
        dostala.
      </>,
      <>
        Ten poslední článek nese <IngotCode>aria-current="page"</IngotCode>,
        takže odečítač aktuální stránku pojmenuje, místo aby ji jen tiše
        přečetl jako další text v řadě.
      </>,
      <>
        Oddělovač je lomítko a je <IngotCode>aria-hidden</IngotCode> —
        je to kresba mezi články, ne slovo, které má někdo slyšet
        dvacetkrát za cestu.
      </>,
      <>
        Celek je <IngotCode>nav</IngotCode> se seznamem uvnitř, takže se dá
        přeskočit jedním krokem; <IngotCode>label</IngotCode> je proto
        povinný, ne doplňkový.
      </>,
    ],
    en: [
      <>
        The last crumb is <strong>not a link</strong>. It is the place where
        you stand, and a link to itself is a promise of a click-through that
        leads nowhere. The component renders it as text even if it was given
        an <IngotCode>href</IngotCode>.
      </>,
      <>
        That last crumb carries <IngotCode>aria-current="page"</IngotCode>,
        so a screen reader names the current page instead of quietly reading
        it as one more piece of text in the row.
      </>,
      <>
        The separator is a slash and it is{" "}
        <IngotCode>aria-hidden</IngotCode> — it is a mark between crumbs,
        not a word anyone should hear twenty times along the path.
      </>,
      <>
        The whole is a <IngotCode>nav</IngotCode> with a list inside, so it
        can be skipped in one step; that is why <IngotCode>label</IngotCode>{" "}
        is required, not optional.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Popisky článků i <IngotCode>label</IngotCode> dodává volající už
        přeložené — kit vlastní jmenný prostor překladů nemá.
      </>,
      <>
        Články se sázejí mono verzálkami. V překladu bývají delší a lišta
        se pak zalomí do druhého řádku, takže drž popisky na jednom slově.
      </>,
      <>
        Identifikátory v posledním článku — číslo objednávky, kód zakázky —
        se nepřekládají. Překládá se jen cesta k nim.
      </>,
    ],
    en: [
      <>
        Crumb labels and <IngotCode>label</IngotCode> are supplied by the
        caller already translated — the kit has no translation namespace of
        its own.
      </>,
      <>
        Crumbs are set in monospaced small caps. Translations tend to be
        longer and the trail then wraps onto a second line, so keep labels
        to a single word.
      </>,
      <>
        Identifiers in the last crumb — an order number, a job code — are
        not translated. Only the path leading to them is.
      </>,
    ],
  },
};
