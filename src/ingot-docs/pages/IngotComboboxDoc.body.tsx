import { IngotCode } from "@/ingot";
import type { IngotDocBody } from "@/ingot-docs/types";

const body: IngotDocBody = {
  avoidWhen: {
    cs: [
      <>
        Krátká sada, kde se dá vybrat očima — tam patří{" "}
        <IngotCode>IngotSelect</IngotCode>. Nativní select má klávesnici, odečítač i
        mobilní chování zdarma a na jedné obrazovce jich snese desítky.
      </>,
      <>
        Filtr nad seznamem, který si seznam neřídí — to je{" "}
        <IngotCode>IngotSearchInput</IngotCode>. Ten zužuje seznam, pod kterým stojí, a
        žádnou hodnotu nedrží.
      </>,
      <>
        Výběr více hodnot naráz. Hodnota je tady jeden řetězec; množina vybraných hodnot
        je <IngotCode>IngotChipGroup</IngotCode> vedle tohoto pole, nebo vlastní
        primitivum ten den, kdy si o něj obrazovka řekne.
      </>,
      <>
        Volný text, který nemusí být ze seznamu. Tohle pole po odchodu z něj text, který
        nepojmenovává právě jednu volbu, zahodí — schválně, aby v políčku nezůstalo
        nedopsané slovo tvářící se jako hodnota.
      </>,
    ],
    en: [
      <>
        A short set that can be picked with the eye — that is{" "}
        <IngotCode>IngotSelect</IngotCode>. A native select gets keyboard, screen reader
        and mobile behaviour for free and one screen can hold dozens.
      </>,
      <>
        A filter above a list that does not own the list — that is{" "}
        <IngotCode>IngotSearchInput</IngotCode>. It narrows the list it stands on and
        holds no value.
      </>,
      <>
        Picking several values at once. A value is one string here; a set of chosen
        values is <IngotCode>IngotChipGroup</IngotCode> next to this field, or a
        primitive of its own the day a screen asks for it.
      </>,
      <>
        Free text that need not come from the list. This field discards, on leaving it,
        any text that does not name exactly one option — deliberately, so a half-typed
        word never sits in it claiming to be a value.
      </>,
    ],
  },
  props: [
    {
      name: "options",
      type: "readonly IngotComboboxOption[]",
      required: true,
      note: {
        cs: "Volby v pořadí volajícího. Kit je nepřerovnává, jen řadí shody uvnitř úrovní.",
        en: "The options in the caller's order. The kit never reorders them; it only ranks matches within tiers.",
      },
    },
    {
      name: "value",
      type: "string",
      required: true,
      note: {
        cs: "Hodnota vybrané volby, nebo prázdný řetězec pro nevybráno. Řízené zvenčí.",
        en: 'The chosen option\'s value, or "" for none. Controlled from outside.',
      },
    },
    {
      name: "onChange",
      type: "(next: string) => void",
      required: true,
      note: {
        cs: "Nová hodnota při každé volbě; prázdný řetězec při vymazání.",
        en: "The new value on every choice; an empty string when the field is cleared.",
      },
    },
    {
      name: "label",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený `aria-label`. Povinný: pole obvykle stojí pod viditelným nadpisem, který není `label htmlFor`, a bez něj odečítač přečte hodnotu, ale neřekne, čeho je to hodnota.",
        en: "The translated `aria-label`. Required: the field usually sits under a visible caption that is not a `label htmlFor`, and without it a screen reader reads the value without saying what it is a value of.",
      },
    },
    {
      name: "placeholder",
      type: "string",
      required: false,
      note: {
        cs: "Přeložený text prázdného pole. Nápověda ke prázdnému stavu, ne jméno pole.",
        en: "The translated placeholder. A hint about the empty state, not the field's name.",
      },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Vypnuté pole — nejde psát ani mazat. Výchozí false.",
        en: "A disabled field — neither typing nor clearing. Defaults to false.",
      },
    },
    {
      name: "className",
      type: "string",
      required: false,
      note: {
        cs: "Jen rozvržení — typicky šířka.",
        en: "Layout only — typically a width.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "Kotva pro testy na obalu: prvek je pole plus seznam plus tlačítko vymazání, a test sahá po jednom z těch tří. Tlačítko vymazání nese `${testId}-clear`.",
        en: "An anchor for tests, on the wrapper: the control is a field plus a list plus a clear button, and a test reaches for one of the three. The clear button carries `${testId}-clear`.",
      },
    },
  ],
  extraProps: [
    {
      name: "IngotComboboxOption",
      note: {
        cs: "Jedna volba, předaná přes `options`.",
        en: "One option, passed through `options`.",
      },
      props: [
        {
          name: "value",
          type: "string",
          required: true,
          note: {
            cs: "Hodnota, která jde do `onChange`. Hledá se i podle ní při odchodu z pole.",
            en: "The value handed to `onChange`. It is also matched when the field is left.",
          },
        },
        {
          name: "label",
          type: "string",
          required: true,
          note: {
            cs: "Přeložený popisek — co ukáže řádek a co po volbě zůstane v poli.",
            en: "The translated label — what the row shows and what the field holds once chosen.",
          },
        },
        {
          name: "secondary",
          type: "string",
          required: false,
          note: {
            cs: "Přeložený druhý řádek pod popiskem. Hledá se, o úroveň níž než popisek.",
            en: "The translated second line under the label. Matched as well, one tier below the label.",
          },
        },
        {
          name: "keywords",
          type: "readonly string[]",
          required: false,
          note: {
            cs: "Hledá se, nikdy se nekreslí — kód, předvolba, jméno v jiném jazyce, alias.",
            en: "Matched, never drawn — a code, a dial code, a name in another language, an alias.",
          },
        },
        {
          name: "icon",
          type: "ReactNode",
          required: false,
          note: {
            cs: "Dekorativní značka před popiskem (vlaječka, glyf). Kreslí se v řádku a u vybrané volby i v poli.",
            en: "A decorative mark before the label (a flag, a glyph). Drawn in the row and, for the chosen option, in the field too.",
          },
        },
      ],
    },
  ],
  a11y: {
    cs: [
      <>
        Pole je <IngotCode>role=&quot;combobox&quot;</IngotCode> s{" "}
        <IngotCode>aria-expanded</IngotCode>, <IngotCode>aria-controls</IngotCode> a{" "}
        <IngotCode>aria-autocomplete=&quot;list&quot;</IngotCode>. Zvýrazněný řádek
        jmenuje <IngotCode>aria-activedescendant</IngotCode> — ohnisko zůstává v poli,
        protože člověk v něm dál píše.
      </>,
      <>
        Klávesnice: šipky chodí seznamem, Home a End skáčou na jeho konce, Enter vybere
        zvýrazněný řádek, Escape vrátí text na vybranou volbu a zavře seznam. Tab
        odchází dál po stránce — seznam není past.
      </>,
      <>
        <IngotCode>label</IngotCode> je povinný, protože jméno, které potřebuje
        odečítač, nesmí být volitelné: chybějící jméno není na obrazovce vidět.
      </>,
    ],
    en: [
      <>
        The field is <IngotCode>role=&quot;combobox&quot;</IngotCode> with{" "}
        <IngotCode>aria-expanded</IngotCode>, <IngotCode>aria-controls</IngotCode> and{" "}
        <IngotCode>aria-autocomplete=&quot;list&quot;</IngotCode>. The highlighted row
        is named by <IngotCode>aria-activedescendant</IngotCode> — focus stays in the
        field, because that is where the person keeps typing.
      </>,
      <>
        Keyboard: the arrows walk the list, Home and End jump to its ends, Enter takes
        the highlighted row, Escape reverts the text to the chosen option and closes the
        list. Tab leaves and carries on through the page — the list is not a trap.
      </>,
      <>
        <IngotCode>label</IngotCode> is required, because a name a screen reader needs
        must not be optional: a missing name is invisible on screen.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>label</IngotCode>, <IngotCode>placeholder</IngotCode> a texty voleb
        dodává volající už přeložené — kit vlastní jmenný prostor překladů nemá.
      </>,
      <>
        Tři věty si pole říká samo: jméno tlačítka vymazání, řádek „žádné shody“ a
        poznámka o uříznutém seznamu. Jsou ve slovníku{" "}
        <IngotCode>IngotProvider</IngotCode> a bez providera jsou anglicky. V poznámce o
        uříznutí se <IngotCode>{"{count}"}</IngotCode> nahradí počtem — zástupce, ne
        číslo, protože slovosled kolem něj se podle jazyka liší.
      </>,
      <>
        Hledání skládá diakritiku na obou stranách srovnání, takže „cesko“ najde „Česko“
        a „Česko“ najde pořád samo sebe.
      </>,
    ],
    en: [
      <>
        <IngotCode>label</IngotCode>, <IngotCode>placeholder</IngotCode> and the
        options' texts arrive already translated from the caller — the kit has no
        translation namespace of its own.
      </>,
      <>
        Three sentences the field says itself: the name of the clear button, the “no
        matches” row and the note about the cut list. They live in the{" "}
        <IngotCode>IngotProvider</IngotCode> dictionary and are English without a
        provider. In the note about the cut, <IngotCode>{"{count}"}</IngotCode> is
        replaced by the count — a placeholder rather than a number, because the word
        order around it differs by language.
      </>,
      <>
        The search folds diacritics on both sides of the comparison, so “cesko” finds
        “Česko” and “Česko” still finds itself.
      </>,
    ],
  },
  limits: {
    cs: [
      <>
        Jedna hodnota, ne množina. Více vybraných hodnot čeká na konkrétního žadatele.
      </>,
      <>
        Žádné skupiny v seznamu. Řádky jsou plochý seznam v pořadí volajícího; nadpisy
        skupin jako u <IngotCode>IngotMenu</IngotCode> tady zatím nikdo nepotřeboval.
      </>,
      <>
        Seznam kreslí nejvýš <IngotCode>INGOT_COMBOBOX_MAX_RENDERED</IngotCode> řádků a
        v posledním řádku to řekne. Není to stránkování ani virtualizace — delší katalog
        se zužuje psaním.
      </>,
      <>
        Seznam se nepřeklápí nad pole, když pod ním není místo. Je kreslený ve vlastním
        toku pole, aby byl stejně široký jako ono; <IngotCode>IngotPopover</IngotCode>{" "}
        umí překlopení, ale portuje se do <IngotCode>body</IngotCode> a šířku pole nemá
        odkud vzít.
      </>,
    ],
    en: [
      <>One value, not a set. Several chosen values wait for a concrete requester.</>,
      <>
        No groups in the list. The rows are a flat list in the caller's order; group
        headings like <IngotCode>IngotMenu</IngotCode>'s have had no requester here yet.
      </>,
      <>
        The list draws at most <IngotCode>INGOT_COMBOBOX_MAX_RENDERED</IngotCode> rows
        and says so in its last one. It is neither paging nor virtualization — a longer
        catalogue is narrowed by typing.
      </>,
      <>
        The list does not flip above the field when there is no room below. It is drawn
        in the field's own flow so that it is exactly as wide as the field;{" "}
        <IngotCode>IngotPopover</IngotCode> can flip, but it portals into{" "}
        <IngotCode>body</IngotCode> and has nowhere to learn the field's width from.
      </>,
    ],
  },
};

export default body;
