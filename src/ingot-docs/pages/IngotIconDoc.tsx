import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotIconDemo";
import demoSource from "@/ingot-docs/demos/IngotIconDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotIconDoc: IngotDocPage = {
  name: "IngotIcon",
  status: "stable",
  // 1.2 — přibyla pošta (``inbox``, ``send``, ``reply``, ``forward``,
  // ``tag``), ``archive``, ``star``, ``user``, ``building`` a ``more``.
  // Sada je širší, volající nemusí sáhnout na nic.
  version: "1.2",
  tag: "[data-icon]",
  tokens: ["currentColor"],
  summary: {
    cs: "Ikony rozhraní — jedna sada, jedna technika. Kreslí se čárou v mřížce 24×24, barví se textem rodiče a škáluje se jedním číslem.",
    en: "Interface icons — one set, one technique. Line art on a 24×24 grid, inked by the parent's text colour, scaled by a single number.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Do rozhraní patří symbol — v tlačítku, v navigaci, u prázdného
        stavu, vedle popisku ve výčtu.
      </>,
      <>
        Chystáš se nakreslit <IngotCode>&lt;svg&gt;</IngotCode> přímo do
        komponenty. To je ta chvíle, kdy se sáhne sem: pět nesouvisejících
        sad v jednom repu vzniklo přesně takhle, po jedné ikoně.
      </>,
      <>
        Glyf ti chybí. Přidej ho do sady — jedna ikona navíc je levnější
        než šestý ostrůvek.
      </>,
    ],
    en: [
      <>
        The interface needs a symbol — inside a button, in navigation,
        next to an empty state, beside a label in a list.
      </>,
      <>
        You are about to draw an <IngotCode>&lt;svg&gt;</IngotCode>{" "}
        straight into a component. That is the moment to come here: five
        unrelated sets in one repo grew exactly like that, one icon at a
        time.
      </>,
      <>
        The glyph you need is missing. Add it to the set — one more icon
        is cheaper than a sixth island.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Je to ikona <strong>výrobní operace</strong>. Ta má vlastní sadu i
        vlastní pravidla — <IngotCode>IngotOpIcon</IngotCode>. Klíč
        operace ukládá backend a ikona bez názvu je hádanka.
      </>,
      <>
        Ikona má nést význam, který nikde není napsaný. Symbol sám o sobě
        se nedá spolehlivě uhodnout; napiš popisek a ikonu nech vedle něj
        jako dekoraci.
      </>,
      <>
        Potřebuješ obrázek, ne symbol — logo, ilustraci, fotku. Sada je
        jednobarevná čára, ne obrazová knihovna.
      </>,
    ],
    en: [
      <>
        It is a <strong>manufacturing operation</strong> icon. That set has
        its own rules — <IngotCode>IngotOpIcon</IngotCode>. The key is
        stored by the backend and the icon alone is a riddle.
      </>,
      <>
        The icon would have to carry meaning that is written nowhere else.
        A symbol on its own cannot be guessed reliably; write the label and
        keep the icon beside it as decoration.
      </>,
      <>
        You need a picture, not a symbol — a logo, an illustration, a
        photo. This set is single-colour line art, not an image library.
      </>,
    ],
  },
  props: [
    {
      name: "name",
      type: "IngotIconName",
      required: true,
      note: {
        cs: "Klíč ze sady. Neznámý klíč typecheck nepustí; když přiteče z dat, komponenta nevykreslí nic a ve vývoji to napíše do konzole.",
        en: "A key from the set. An unknown key fails typecheck; if one arrives from data the component renders nothing and says so in the console in dev.",
      },
    },
    {
      name: "size",
      type: "number",
      required: false,
      note: {
        cs: "Hrana čtverce v px, výchozí 14. Sazba: 13 v malém tlačítku, 14 v tlačítku, 15 v navigaci, 20 u prázdného stavu.",
        en: "Square edge in px, default 14. Scale: 13 in a small button, 14 in a button, 15 in navigation, 20 next to an empty state.",
      },
    },
    {
      name: "title",
      type: "string",
      required: false,
      note: {
        cs: "Vyplň, JEN když ikona stojí sama a nese význam. Vedle textu ji nech prázdnou — jinak čtečka přečte totéž dvakrát.",
        en: "Fill in ONLY when the icon stands alone and carries meaning. Leave it empty next to text — otherwise a screen reader says the same thing twice.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Doplňkové třídy. Barvu neurčuj tady — ikona dědí currentColor rodiče.",
        en: "Extra classes. Do not set the colour here — the icon inherits the parent's currentColor.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "data-testid prvku.", en: "data-testid of the element." },
    },
  ],
  a11y: {
    cs: [
      <>
        Výchozí stav je <strong>dekorativní</strong> —{" "}
        <IngotCode>aria-hidden</IngotCode>. Drtivá většina ikon stojí vedle
        svého popisku a odečítač je má přeskočit.
      </>,
      <>
        S <IngotCode>title</IngotCode> se ikona stane obrázkem s názvem
        (<IngotCode>role=&quot;img&quot;</IngotCode>). To je jediný povolený
        tvar ikony bez viditelného popisku.
      </>,
      <>
        Barva jde z <IngotCode>currentColor</IngotCode>. Kontrast tedy
        neřeší ikona, ale text kolem ní — a mění se s motivem spolu s ním.
      </>,
    ],
    en: [
      <>
        The default is <strong>decorative</strong> —{" "}
        <IngotCode>aria-hidden</IngotCode>. Most icons sit next to their own
        label and a screen reader should skip them.
      </>,
      <>
        With <IngotCode>title</IngotCode> the icon becomes a named image
        (<IngotCode>role=&quot;img&quot;</IngotCode>). That is the only
        allowed shape for an icon without a visible label.
      </>,
      <>
        The colour comes from <IngotCode>currentColor</IngotCode>. Contrast
        is therefore decided by the surrounding text, and follows the theme
        with it.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Jediný text komponenty je <IngotCode>title</IngotCode> a dodává ho
        volající už přeložený. Sada nemá vlastní i18n jmenný prostor.
      </>,
      <>
        Klíč ikony se <strong>nepřekládá</strong> — je to identifikátor,
        ne text.
      </>,
    ],
    en: [
      <>
        The only text is <IngotCode>title</IngotCode> and the caller passes
        it already translated. The set has no i18n namespace of its own.
      </>,
      <>
        The icon key is <strong>not translated</strong> — it is an
        identifier, not copy.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Sada je jednobarevná čára. Vícebarevný glyf, výplň ani obrázek
        v ní není a nebude.
      </>,
      <>
        Pět starších sad v repu (<IngotCode>platformProcessesIcons</IngotCode>,{" "}
        <IngotCode>plans/icons</IngotCode>,{" "}
        <IngotCode>storageTypeIcons</IngotCode> a další) dožívá tam, kde je.
        Nové použití jde přes kit; hromadná migrace je samostatná práce.
      </>,
    ],
    en: [
      <>
        The set is single-colour line art. A multi-colour glyph, a fill or
        a bitmap is not in it and will not be.
      </>,
      <>
        Five older sets in this repo (<IngotCode>platformProcessesIcons</IngotCode>,{" "}
        <IngotCode>plans/icons</IngotCode>,{" "}
        <IngotCode>storageTypeIcons</IngotCode> and more) live out their days
        where they are. New usage goes through the kit; migrating them is
        separate work.
      </>,
    ],
  },
};
