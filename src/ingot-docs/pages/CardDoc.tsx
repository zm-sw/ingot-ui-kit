import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/CardDemo";
import demoSource from "@/ingot-docs/demos/CardDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const CardDoc: IngotDocPage = {
  name: "Card",
  summary: {
    cs: "Plocha, na které obsah stojí — ne rámeček, který se kreslí kolem něj. Umí se zvednout při najetí a jednou za obrazovku se obrátit do tmavé.",
    en: "The surface content sits on — not a border drawn around it. It can lift on hover, and once per screen it can invert to dark.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Obsah patří k sobě a má se vizuálně oddělit od zbytku obrazovky —
        panel nastavení, shrnutí, dlaždice v přehledu.
      </>,
      <>
        Potřebuješ hlavičku s nadpisem: <IngotCode>CardHeader</IngotCode> a{" "}
        <IngotCode>CardTitle</IngotCode> jedou s ní a drží stejné odsazení.
      </>,
      <>
        Dlaždice, která někam vede — <IngotCode>hover</IngotCode> ji při najetí
        zvedne. Samotná karta klikatelná není: obal ji{" "}
        <IngotCode>&lt;a&gt;</IngotCode>, nebo <IngotCode>&lt;button&gt;</IngotCode>.
      </>,
      <>
        Sdělení platformy, které má přebít okolí —{" "}
        <IngotCode>tone=&quot;dark&quot;</IngotCode>. Obrátí plochu, takže druhá taková
        karta vedle už nepřebije nic.
      </>,
    ],
    en: [
      <>
        The content belongs together and should be visually separated from the
        rest of the screen — a settings panel, a summary, a tile in an
        overview.
      </>,
      <>
        You need a header with a title: <IngotCode>CardHeader</IngotCode> and{" "}
        <IngotCode>CardTitle</IngotCode> come with it and keep the same padding.
      </>,
      <>
        A tile that leads somewhere — <IngotCode>hover</IngotCode> lifts it on
        pointer-over. The card itself is not clickable: wrap it in an{" "}
        <IngotCode>&lt;a&gt;</IngotCode> or a <IngotCode>&lt;button&gt;</IngotCode>.
      </>,
      <>
        A platform message that has to out-shout its surroundings —{" "}
        <IngotCode>tone=&quot;dark&quot;</IngotCode>. It inverts the surface, so a second
        one next to it out-shouts nothing.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Karta by obsahovala jedinou další kartu. Vnořené plochy čtenáři
        neřeknou nic navíc a odsazení se sčítá, dokud obsah nezmizí uprostřed.
      </>,
      <>
        Chceš jen odsazení. Na to je <IngotCode>className</IngotCode> na obalu; karta
        navíc kreslí okraj a pozadí, které tam nikdo nechtěl.
      </>,
    ],
    en: [
      <>
        The card would contain a single other card. Nested surfaces tell the
        reader nothing extra, and the padding compounds until the content is
        lost in the middle.
      </>,
      <>
        You only want padding. That is a <IngotCode>className</IngotCode> on a wrapper;
        a card also draws a border and a background nobody asked for.
      </>,
    ],
  },
  props: [
    {
      name: "elevation",
      type: '"flat" | "raised"',
      required: false,
      note: {
        cs: "Jak moc plocha vystupuje. Výchozí flat.",
        en: "How far the surface stands out. Defaults to flat.",
      },
    },
    {
      name: "hover",
      type: "boolean",
      required: false,
      note: {
        cs: "Zvedne kartu při najetí. Jen pro klikatelné dlaždice — a ta dlaždice musí být odkaz nebo tlačítko.",
        en: "Lifts the card on hover. Only for clickable tiles — and that tile has to be a link or a button.",
      },
    },
    {
      name: "tone",
      type: '"default" | "dark"',
      required: false,
      note: {
        cs: "Obrácená plocha pro sdělení platformy. Na obrazovce nejvýš jedna.",
        en: "An inverted surface for a platform message. At most one per screen.",
      },
    },
    {
      name: "padded",
      type: "boolean",
      required: false,
      note: {
        cs: "Vypni, když si obsah odsazení řídí sám (tabulka přes celou kartu).",
        en: "Turn off when the content owns its padding (a table filling the card).",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Průchozí třída — na rozvržení, ne na přebarvení.",
        en: "Pass-through class — for layout, not for recolouring.",
      },
    },
  ],
  extraProps: [
    {
      name: "CardHeader / CardTitle",
      note: {
        cs: (
          <>
            Hlavička karty a nadpis v ní. Jsou to části <IngotCode>Card</IngotCode>,
            proto mají tuhle stránku, a ne vlastní.
          </>
        ),
        en: (
          <>
            The card header and the title inside it. They are parts of{" "}
            <IngotCode>Card</IngotCode>, which is why they live on this page rather than
            on one of their own.
          </>
        ),
      },
      props: [
        {
          name: "children",
          type: "ReactNode",
          required: true,
          note: {
            cs: "Obsah hlavičky, resp. text nadpisu.",
            en: "The header contents, or the title text.",
          },
        },
        {
          name: "className",
          type: "string",
          required: false,
          note: { cs: "Průchozí třída.", en: "Pass-through class." },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Karta je <IngotCode>&lt;div&gt;</IngotCode>, ne <IngotCode>&lt;section&gt;</IngotCode>:
        vizuální plocha sama o sobě není orientační bod a odečítač by hlásil
        oblasti, které nikam nevedou. Potřebuješ-li osnovu, obal kartu{" "}
        <IngotCode>IngotSection</IngotCode>.
      </>,
      <>
        <IngotCode>CardTitle</IngotCode> je nadpis vizuálně, ne významově. Když má
        opravdu být v osnově stránky, patří dovnitř skutečný nadpis přes{" "}
        <IngotCode>IngotSection</IngotCode>.
      </>,
      <>
        Kontrast okraje i pozadí drží tokeny, takže karta funguje ve světlém
        i tmavém režimu bez zásahu. Uvnitř{" "}
        <IngotCode>tone=&quot;dark&quot;</IngotCode> ale nepiš barvy textu natvrdo —
        obrácená plocha si barvu předává děděním a{" "}
        <IngotCode>text-ink</IngotCode> na ní zmizí.
      </>,
      <>
        🚨 Klikatelná karta je <IngotCode>&lt;a&gt;</IngotCode> nebo{" "}
        <IngotCode>&lt;button&gt;</IngotCode>, nikdy <IngotCode>&lt;div&gt;</IngotCode> s{" "}
        <IngotCode>onClick</IngotCode>. Div se nedá zaostřit tabulátorem, neaktivuje
        se mezerníkem a odečítač ho neohlásí jako ovládací prvek — pro
        klávesnici ta dlaždice prostě neexistuje.
      </>,
      <>
        <IngotCode>hover</IngotCode> nesmí být jediné, co o klikatelnosti říká.
        Na dotykovém zařízení najetí neexistuje a při{" "}
        <IngotCode>prefers-reduced-motion</IngotCode> se zvednutí vypíná — karta
        proto musí mít viditelný titulek, který napoví, kam vede.
      </>,
    ],
    en: [
      <>
        A card is a <IngotCode>&lt;div&gt;</IngotCode>, not a{" "}
        <IngotCode>&lt;section&gt;</IngotCode>: a visual surface on its own is not a
        landmark, and a screen reader would announce regions that lead
        nowhere. If you need an outline, wrap the card in{" "}
        <IngotCode>IngotSection</IngotCode>.
      </>,
      <>
        <IngotCode>CardTitle</IngotCode> is a heading visually, not semantically. When it
        genuinely belongs in the page outline, put a real heading inside via{" "}
        <IngotCode>IngotSection</IngotCode>.
      </>,
      <>
        Border and background contrast come from tokens, so a card works in
        light and dark alike with no intervention. Inside{" "}
        <IngotCode>tone=&quot;dark&quot;</IngotCode>, though, do not hardcode text
        colours — the inverted surface passes its colour down by inheritance,
        and <IngotCode>text-ink</IngotCode> disappears on it.
      </>,
      <>
        🚨 A clickable card is an <IngotCode>&lt;a&gt;</IngotCode> or a{" "}
        <IngotCode>&lt;button&gt;</IngotCode>, never a <IngotCode>&lt;div&gt;</IngotCode> with{" "}
        <IngotCode>onClick</IngotCode>. A div cannot be focused with the keyboard,
        does not activate on space, and a screen reader does not announce it as
        a control — for the keyboard that tile simply does not exist.
      </>,
      <>
        <IngotCode>hover</IngotCode> must not be the only thing that says the card
        is clickable. Touch devices have no hover, and{" "}
        <IngotCode>prefers-reduced-motion</IngotCode> turns the lift off — so the
        card always needs a visible title that says where it leads.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Všechen text jsou <IngotCode>children</IngotCode> — karta žádný vlastní nemá.
      </>,
    ],
    en: [
      <>
        All text is <IngotCode>children</IngotCode> — the card has none of its own.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        <strong>Metrika a patička jsou kompozice, ne vlastnosti.</strong> Dlaždice
        s číslem je karta s <IngotCode>padded=&#123;false&#125;</IngotCode> a vlastním
        odsazením; patička s verzí a datem je řádek na konci karty. Obojí je
        v ukázce nahoře — kdyby to byly vlastnosti, karta by musela vědět, co
        je metrika, a to nevíme.
      </>,
      <>
        <strong>Zvýrazněné sdělení (callout) karta neumí</strong> a schválně to
        nepředstírá: není to plocha, na které obsah stojí, ale barevný proužek
        vedle něj. Vlastní primitivum dostane, až o něj řekne konkrétní
        obrazovka — dnes ten tvar v aplikaci používají dvě.
      </>,
      <>
        <strong>Prázdný stav není karta.</strong> Na to je{" "}
        <IngotCode>IngotEmptyState</IngotCode>, který kromě plochy řeší i text a
        akci.
      </>,
    ],
    en: [
      <>
        <strong>A metric tile and a footer are compositions, not props.</strong> A
        tile with a number is a card with <IngotCode>padded=&#123;false&#125;</IngotCode>{" "}
        and its own padding; a footer with a version and a date is a row at the
        end of the card. Both are in the demo above — were they props, the card
        would have to know what a metric is, and it does not.
      </>,
      <>
        <strong>The card does not do callouts</strong> and deliberately does not
        pretend to: a callout is not a surface content sits on but a coloured
        strip beside it. It gets its own primitive when a concrete screen asks
        for one — today two screens in the application use that shape.
      </>,
      <>
        <strong>An empty state is not a card.</strong> That is{" "}
        <IngotCode>IngotEmptyState</IngotCode>, which handles the copy and the
        action as well as the surface.
      </>,
    ],
  },
};
