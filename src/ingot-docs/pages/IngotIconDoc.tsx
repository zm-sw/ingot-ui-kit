import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotIconDemo";
import demoSource from "@/ingot-docs/demos/IngotIconDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

// 1.4 (KAN-854): the development-only warning no longer reaches for a bundler's field directly. A consumer's typecheck used to fail
// inside our source, on a file they never wrote, unless their
// tsconfig happened to include the bundler's types. Nothing a
// caller passes or sees changed.
export const IngotIconDoc: IngotDocPage = {
  name: "IngotIcon",
  status: "stable",
  // 1.2 — mail arrived (``inbox``, ``send``, ``reply``, ``forward``,
  // ``tag``), plus ``archive``, ``star``, ``user``, ``building`` and
  // ``more``. The set is wider; callers touch nothing.
  //
  // 1.3 (KAN-784) — ``star-filled`` arrived, the first and so far only fill
  // in the set. Owner decision: two SHAPES read in greyscale too, two
  // colours do not, and today a starred thread differs from an unstarred
  // one only by colour. The promise "there is and will be no fill in the
  // set" therefore softened to a narrow exception rather than being dropped
  // — the rewritten Limits section holds it. Callers touch nothing.
  version: "1.4",
  tag: "[data-icon]",
  tokens: ["currentColor"],
  classNameNote: {
    cs: "Bere `className` na umístění a barvu — glyf kreslí `currentColor`, velikost je `size`.",
    en: "Takes `className` for placement and colour — the glyph draws in `currentColor`, the size is `size`.",
  },
  summary: {
    cs: "Ikony rozhraní — jedna sada, jedna technika. Kreslí se čárou v mřížce 24×24, barví se textem rodiče a škáluje se jedním číslem.",
    en: "Interface icons — one set, one technique. Line art on a 24×24 grid, inked by the parent's text colour, scaled by a single number.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Do rozhraní patří symbol — v tlačítku, v navigaci, u prázdného stavu, vedle
        popisku ve výčtu.
      </>,
      <>
        Chystáš se nakreslit <IngotCode>&lt;svg&gt;</IngotCode> přímo do komponenty. To
        je ta chvíle, kdy se sáhne sem: pět nesouvisejících sad v jednom repu vzniklo
        přesně takhle, po jedné ikoně.
      </>,
      <>
        Glyf ti chybí. Přidej ho do sady — jedna ikona navíc je levnější než šestý
        ostrůvek.
      </>,
    ],
    en: [
      <>
        The interface needs a symbol — inside a button, in navigation, next to an empty
        state, beside a label in a list.
      </>,
      <>
        You are about to draw an <IngotCode>&lt;svg&gt;</IngotCode> straight into a
        component. That is the moment to come here: five unrelated sets in one repo grew
        exactly like that, one icon at a time.
      </>,
      <>
        The glyph you need is missing. Add it to the set — one more icon is cheaper than
        a sixth island.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Je to ikona <strong>výrobní operace</strong>. Ta má vlastní sadu i vlastní
        pravidla — <IngotCode>IngotOpIcon</IngotCode>. Klíč operace ukládá backend a
        ikona bez názvu je hádanka.
      </>,
      <>
        Ikona má nést význam, který nikde není napsaný. Symbol sám o sobě se nedá
        spolehlivě uhodnout; napiš popisek a ikonu nech vedle něj jako dekoraci.
      </>,
      <>
        Potřebuješ obrázek, ne symbol — logo, ilustraci, fotku. Sada je jednobarevná
        čára, ne obrazová knihovna.
      </>,
    ],
    en: [
      <>
        It is a <strong>manufacturing operation</strong> icon. That set has its own
        rules — <IngotCode>IngotOpIcon</IngotCode>. The key is stored by the backend and
        the icon alone is a riddle.
      </>,
      <>
        The icon would have to carry meaning that is written nowhere else. A symbol on
        its own cannot be guessed reliably; write the label and keep the icon beside it
        as decoration.
      </>,
      <>
        You need a picture, not a symbol — a logo, an illustration, a photo. This set is
        single-colour line art, not an image library.
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
        <IngotCode>aria-hidden</IngotCode>. Drtivá většina ikon stojí vedle svého
        popisku a odečítač je má přeskočit.
      </>,
      <>
        S <IngotCode>title</IngotCode> se ikona stane obrázkem s názvem (
        <IngotCode>role=&quot;img&quot;</IngotCode>). To je jediný povolený tvar ikony
        bez viditelného popisku.
      </>,
      <>
        Barva jde z <IngotCode>currentColor</IngotCode>. Kontrast tedy neřeší ikona, ale
        text kolem ní — a mění se s motivem spolu s ním.
      </>,
      <>
        <strong>Stav nesmí stát jen na barvě.</strong> Přepnutý stav si vezme druhý tvar
        (<IngotCode>star</IngotCode> → <IngotCode>star-filled</IngotCode>), protože
        barvoslepý uživatel rozdíl žluté a šedé nevidí a{" "}
        <IngotCode>aria-pressed</IngotCode> neuslyší — ten je pro odečítač. Obojí je
        potřeba, ne jedno z toho.
      </>,
    ],
    en: [
      <>
        The default is <strong>decorative</strong> — <IngotCode>aria-hidden</IngotCode>.
        Most icons sit next to their own label and a screen reader should skip them.
      </>,
      <>
        With <IngotCode>title</IngotCode> the icon becomes a named image (
        <IngotCode>role=&quot;img&quot;</IngotCode>). That is the only allowed shape for
        an icon without a visible label.
      </>,
      <>
        The colour comes from <IngotCode>currentColor</IngotCode>. Contrast is therefore
        decided by the surrounding text, and follows the theme with it.
      </>,
      <>
        <strong>State must not rest on colour alone.</strong> A toggled state takes the
        second shape (<IngotCode>star</IngotCode> → <IngotCode>star-filled</IngotCode>),
        because a colour-blind reader cannot see yellow against grey and will never hear{" "}
        <IngotCode>aria-pressed</IngotCode> — that one is for the screen reader. Both
        are needed, not either.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Jediný text komponenty je <IngotCode>title</IngotCode> a dodává ho volající už
        přeložený. Sada nemá vlastní i18n jmenný prostor.
      </>,
      <>
        Klíč ikony se <strong>nepřekládá</strong> — je to identifikátor, ne text.
      </>,
    ],
    en: [
      <>
        The only text is <IngotCode>title</IngotCode> and the caller passes it already
        translated. The set has no i18n namespace of its own.
      </>,
      <>
        The icon key is <strong>not translated</strong> — it is an identifier, not copy.
      </>,
    ],
  },
  limits: {
    cs: [
      <>Sada je jednobarevná čára. Vícebarevný glyf ani obrázek v ní není a nebude.</>,
      <>
        Výplň je jediná výjimka a má podmínky: smí být jen{" "}
        <IngotCode>currentColor</IngotCode> a smí vzniknout jen jako druhý{" "}
        <strong>tvar</strong> k čárovému glyfu, který nese stav — dnes{" "}
        <IngotCode>star</IngotCode> a <IngotCode>star-filled</IngotCode>. Důvod je
        čitelnost: dva tvary se přečtou i v šedotónu, dvě barvy ne. Dekorativní výplň do
        sady nepatří.
      </>,
      <>
        Pár se pozná podle jména (<IngotCode>-filled</IngotCode>), ne podle vlastnosti.
        Až budou páry víc než tři, překlopí se to na vlastnost — s dvěma jmény by
        vlastnost jen zesložitila typ za nic.
      </>,
      <>
        Pět starších sad v repu (<IngotCode>platformProcessesIcons</IngotCode>,{" "}
        <IngotCode>plans/icons</IngotCode>, <IngotCode>storageTypeIcons</IngotCode> a
        další) dožívá tam, kde je. Nové použití jde přes kit; hromadná migrace je
        samostatná práce.
      </>,
    ],
    en: [
      <>
        The set is single-colour line art. A multi-colour glyph or a bitmap is not in it
        and will not be.
      </>,
      <>
        A fill is the one exception, and it comes with conditions: it may only be{" "}
        <IngotCode>currentColor</IngotCode>, and it may only exist as a second{" "}
        <strong>shape</strong> for a line glyph that carries a state — today{" "}
        <IngotCode>star</IngotCode> and <IngotCode>star-filled</IngotCode>. The reason
        is legibility: two shapes read in greyscale, two colours do not. A decorative
        fill does not belong in the set.
      </>,
      <>
        The pair is told apart by name (<IngotCode>-filled</IngotCode>), not by a prop.
        Once there are more than three pairs this flips to a prop — with two names a
        prop would only complicate the type for nothing.
      </>,
      <>
        Five older sets in this repo (<IngotCode>platformProcessesIcons</IngotCode>,{" "}
        <IngotCode>plans/icons</IngotCode>, <IngotCode>storageTypeIcons</IngotCode> and
        more) live out their days where they are. New usage goes through the kit;
        migrating them is separate work.
      </>,
    ],
  },
};
