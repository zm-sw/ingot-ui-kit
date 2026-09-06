import { IngotCode } from "@/ingot";
import type { IngotDocPage } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotAvatarDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotAvatarDemo?raw");

export const IngotAvatarDoc: IngotDocPage = {
  name: "IngotAvatar",
  status: "beta",
  version: "1.0",
  tag: ".avatar",
  tokens: ["--ink", "--bg", "--font-mono"],
  classNameNote: {
    cs: "Bere `className`, ale jen na okraje a zarovnání. Velikost je `size` a barva je pevná — kolečko, které má na každé obrazovce jinou velikost, přestane být tím, podle čeho čtenář pozná člověka.",
    en: "Takes `className`, but only for margins and alignment. The size is `size` and the colour is fixed — a circle that is a different size on every screen stops being the thing a reader recognises a person by.",
  },
  summary: {
    cs: "Člověk, jak malý člověk bývá: iniciály, nebo jeho obrázek. Iniciály dodává volající.",
    en: "A person, as small as a person gets: initials, or their picture. The initials come from the caller.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Účet v horní liště — <IngotCode>IngotTopNavAccount</IngotCode> ho používá.
      </>,
      <>
        Sloupec „obsluha“ v tabulce, autor komentáře, řádek seznamu lidí. Kolečko s
        iniciálami je rychlejší k přečtení než jméno, když se řádky prohlížejí očima.
      </>,
    ],
    en: [
      <>
        The account in the top bar — <IngotCode>IngotTopNavAccount</IngotCode> uses it.
      </>,
      <>
        An "operator" column in a table, a comment's author, a row in a list of people.
        A circle of initials is quicker to read than a name when rows are being skimmed.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Ikona nebo logo. To je <IngotCode>IngotIcon</IngotCode> — avatar znamená
        „člověk“ a kolečko s piktogramem to tvrdí o něčem, co člověk není.
      </>,
      <>
        Stav nebo počet v kolečku. Stav je <IngotCode>IngotBadge</IngotCode>, počet{" "}
        <IngotCode>IngotCountPill</IngotCode>.
      </>,
      <>
        Avatar jako tlačítko. Kolečko nic neovládá — obal ho udělá klikatelným, když má
        být klikatelný, a nese pak vlastní jméno i fokus.
      </>,
    ],
    en: [
      <>
        An icon or a logo. That is <IngotCode>IngotIcon</IngotCode> — an avatar means "a
        person", and a circle with a pictogram claims that about something that is not
        one.
      </>,
      <>
        A state or a count in a circle. A state is <IngotCode>IngotBadge</IngotCode>, a
        count is <IngotCode>IngotCountPill</IngotCode>.
      </>,
      <>
        An avatar as a button. The circle operates nothing — a wrapper makes it
        clickable where it should be, and then carries its own name and its own focus.
      </>,
    ],
  },
  props: [
    {
      name: "initials",
      type: "string",
      required: true,
      note: {
        cs: "Jedno až tři písmena, o kterých rozhoduje volající. Kit je z jména neodvozuje: „van der Berg“ ani jednoslovný firemní účet nejsou dvě slova s velkým prvním písmenem, a hádání dopadne tiše špatně přesně u těch jmen, která autoři kitu nemají.",
        en: 'One to three letters, decided by the caller. The kit does not derive them from a name: "van der Berg" and a single-word company account are not two words with a capital first letter, and guessing goes quietly wrong on exactly the names the kit\'s authors do not have.',
      },
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Čí je to tvář, už přeložené („Jan Marek“). Povinné: dvě písmena přečtená samostatně nejsou člověk, a avatar bez jména je nejčastější nepojmenovaný obrázek na admin obrazovce.",
        en: 'Whose face this is, already translated ("Jan Marek"). Required: two letters read out on their own are not a person, and an avatar without a name is the commonest unlabelled image on an admin screen.',
      },
    },
    {
      name: "src",
      type: "string",
      required: false,
      note: {
        cs: "Obrázek. Iniciály zůstávají pod ním — když se obrázek nenačte nebo se načítá, zbude písmeno, ne prázdné kolečko.",
        en: "A picture. The initials stay underneath it — when the image fails or is still loading, a letter is left rather than an empty circle.",
      },
    },
    {
      name: "size",
      type: '"sm" | "md"',
      required: false,
      note: {
        cs: "`sm` (výchozí) sedí účtu v liště, `md` řádku seznamu nebo detailu.",
        en: "`sm` (the default) matches the account in the bar, `md` a list row or a detail.",
      },
    },
    {
      name: "decorative",
      type: "boolean",
      required: false,
      note: {
        cs: "Něco kolem už říká, čí je to tvář — tlačítko se jménem, řádek, kde jméno stojí vedle kolečka. Avatar pak neříká nic vlastního, protože dvě jména na jedné věci se přečtou dvakrát. `label` zůstává povinné i tak: je to to, podle čeho je v kódu vidět, že se rozhodlo.",
        en: "Something around it already says whose face this is — a button with the name on it, a row where the name stands beside the circle. The avatar then says nothing of its own, because two names on one thing are read twice. `label` stays required even so: it is what shows, in the code, that the decision was made.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen okraje a zarovnání.",
        en: "Margins and alignment only.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: { cs: "Kotva pro testy.", en: "An anchor for tests." },
    },
  ],
  a11y: {
    cs: [
      <>
        Kolečko je jeden prvek se jménem (<IngotCode>role=&quot;img&quot;</IngotCode> +{" "}
        <IngotCode>aria-label</IngotCode>), ne jméno na obrázku uvnitř nepojmenované
        krabice. Odečítač pak přečte člověka jednou — ať se obrázek načetl, nebo ne.
      </>,
      <>
        Obrázek uvnitř má <IngotCode>alt=&quot;&quot;</IngotCode> a{" "}
        <IngotCode>aria-hidden</IngotCode>: jméno nese obal a druhé by ho zopakovalo.
      </>,
      <>
        Iniciály nejsou barevně odlišené podle člověka. Barva jako jediný nositel
        identity je přesně to, co WCAG zakazuje — a v kitu, kde si akcent vybírá
        uživatel, by navíc znamenala pokaždé jinou paletu.
      </>,
    ],
    en: [
      <>
        The circle is one named element (<IngotCode>role=&quot;img&quot;</IngotCode> +{" "}
        <IngotCode>aria-label</IngotCode>), not a name on a picture inside an unnamed
        box. A screen reader then reads the person once — whether the image loaded or
        not.
      </>,
      <>
        The image inside carries <IngotCode>alt=&quot;&quot;</IngotCode> and{" "}
        <IngotCode>aria-hidden</IngotCode>: the wrapper holds the name and a second one
        would repeat it.
      </>,
      <>
        The initials are not colour-coded per person. Colour as the sole carrier of
        identity is exactly what WCAG forbids — and in a kit where the user picks the
        accent it would mean a different palette every time.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>initials</IngotCode> i <IngotCode>label</IngotCode> dodává volající —
        kit vlastní jmenný prostor překladů nemá a zkracovat jméno je věc jazyka.
      </>,
    ],
    en: [
      <>
        <IngotCode>initials</IngotCode> and <IngotCode>label</IngotCode> both come from
        the caller — the kit has no i18n namespace of its own, and abbreviating a name
        is a matter of language.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Nemá stav (online, nepřítomen) ani skupinu překrytých koleček. Obojí je slib
        navíc: stav potřebuje pravidlo, kdy je čerstvý, a skupina pravidlo, kolik se
        jich ukáže a co se stane se zbytkem.
      </>,
      <>
        Barva je jedna, <IngotCode>--ink</IngotCode>. Kolečka obarvená podle jména
        vypadají živě a nesou nulovou informaci — dva lidé se stejným písmenem dostanou
        stejnou barvu a čtenář si z toho odnese domněnku.
      </>,
    ],
    en: [
      <>
        There is no status (online, away) and no stack of overlapping circles. Both are
        an extra promise: a status needs a rule for when it is fresh, and a stack needs
        one for how many show and what happens to the rest.
      </>,
      <>
        There is one colour, <IngotCode>--ink</IngotCode>. Circles tinted by name look
        lively and carry no information — two people with the same letter get the same
        colour, and the reader takes an assumption away from it.
      </>,
    ],
  },
};
