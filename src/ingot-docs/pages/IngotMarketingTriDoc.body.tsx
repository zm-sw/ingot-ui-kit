import { IngotCode } from "@/ingot";
import type { IngotDocBody } from "@/ingot-docs/types";

// KAN-664. One rounded frame, panels separated by a hairline: ``gap:1px``
// on a ``--border`` background, so the gap IS the line.

const body: IngotDocBody = {
  avoidWhen: {
    cs: [
      <>
        Položky mají pořadí a jedna vede k druhé. To jsou kroky —{" "}
        <IngotCode>IngotMarketingSteps</IngotCode> číslují a kreslí šipku k dalšímu
        kroku.
      </>,
      <>
        Je to dlaždice v adminu. Na to je <IngotCode>Card</IngotCode>: trojice má
        rozestupy veřejné stránky a v administraci působí rozvolněně.
      </>,
    ],
    en: [
      <>
        The items have an order and one leads to the next. Those are steps —{" "}
        <IngotCode>IngotMarketingSteps</IngotCode> numbers them and draws an arrow to
        the next one.
      </>,
      <>
        It is a tile in the admin. That is <IngotCode>Card</IngotCode>: the trio carries
        public-page spacing and reads as loose inside the admin.
      </>,
    ],
  },
  props: [
    {
      name: "items",
      type: "readonly IngotMarketingTriItem[]",
      required: true,
      note: {
        cs: "Featury. Víc než tři mřížka unese, ale handoff počítá se třemi.",
        en: "The features. The grid carries more than three, but the handoff expects three.",
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
      name: "IngotMarketingTriItem",
      note: {
        cs: "Jedna featura. Předává se polem items.",
        en: "One feature. Passed through the items array.",
      },
      props: [
        {
          name: "icon",
          type: "IngotIconName",
          required: true,
          note: {
            cs: "Ikona z knihovny kitu, 18 px v akcentovém rámečku.",
            en: "An icon from the kit library, 18 px in an accent frame.",
          },
        },
        {
          name: "title",
          type: "string",
          required: true,
          note: {
            cs: "Titulek featury. Sází se jako h3.",
            en: "The feature title. Set as an h3.",
          },
        },
        {
          name: "text",
          type: "string",
          required: true,
          note: { cs: "Jedna věta pod titulkem.", en: "One sentence under the title." },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Titulky jsou <IngotCode>h3</IngotCode> pod <IngotCode>h2</IngotCode> hlavičky
        sekce, takže osnova sedí i tehdy, když čtenář stránku prochází po nadpisech.
      </>,
      <>
        Ikona je dekorace — nese ji <IngotCode>IngotIcon</IngotCode> s{" "}
        <IngotCode>aria-hidden</IngotCode>, protože význam už stojí v titulku vedle ní.
      </>,
    ],
    en: [
      <>
        The titles are <IngotCode>h3</IngotCode> under the section head's{" "}
        <IngotCode>h2</IngotCode>, so the outline holds even when a reader walks the
        page by headings.
      </>,
      <>
        The icon is decoration — <IngotCode>IngotIcon</IngotCode> marks it{" "}
        <IngotCode>aria-hidden</IngotCode>, because the meaning already stands in the
        title beside it.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>title</IngotCode> i <IngotCode>text</IngotCode> jsou obsah a dodává
        je volající přeložené.
      </>,
      <>
        Panely mají stejnou výšku bez ohledu na délku překladu — mřížka je táhne na
        nejvyšší z nich, takže delší jazyk rám nerozhodí.
      </>,
    ],
    en: [
      <>
        Both <IngotCode>title</IngotCode> and <IngotCode>text</IngotCode> are content
        and arrive translated from the caller.
      </>,
      <>
        The panels share a height regardless of translation length — the grid stretches
        them to the tallest, so a longer language does not upset the frame.
      </>,
    ],
  },
};

export default body;
