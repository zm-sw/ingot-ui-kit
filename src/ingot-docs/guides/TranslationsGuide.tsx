import { IngotCode, IngotList } from "@/ingot";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * Stránka „Překlady“ (KAN-625) — jedno místo pro pravidlo, které platí
 * pro celý kit.
 *
 * Do KAN-625 se ta věta opakovala v poli ``i18n`` na všech stránkách
 * komponent. Opakované pravidlo se opravuje na šesti místech, takže se
 * dřív nebo později opraví na pěti; pole ``i18n`` na stránkách komponent
 * proto vypisuje jen KONKRÉTNÍ popisky té komponenty a obecné pravidlo
 * bydlí tady.
 *
 * ⚠️ Doc web je VEŘEJNÁ stránka.
 */
export const TranslationsGuide: IngotGuidePage = {
  slug: "preklady",
  title: { cs: "Překlady", en: "Translations" },
  summary: {
    cs: "Ingot nemá vlastní jazykové soubory. Každý viditelný text je vlastnost, kterou dodává volající už přeloženou.",
    en: "The Ingot has no language files of its own. Every visible string is a property the caller passes in already translated.",
  },
  sections: [
    {
      id: "pravidlo",
      title: { cs: "Pravidlo", en: "The rule" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              <strong>
                Žádné primitivum Ingotu nepřekládá ani jedno slovo.
              </strong>{" "}
              Kit nemá vlastní jazykové soubory a nesahá na překladový
              kontext. Všechno, co uživatel uvidí nebo uslyší, přijde dovnitř
              jako vlastnost — už ve správném jazyce.
            </p>
            <p>
              Je to záměr, ne mezera. Primitivum, které si popisky překládá
              samo, si k nim musí přinést vlastní jmenný prostor — a ten se
              pak pere s jmenným prostorem obrazovky o to, kdo je vlastníkem
              slova „Zrušit“. Tenhle kit tu otázku nemá, protože slovo nikdy
              nevlastní.
            </p>
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              <strong>No Ingot primitive translates a single word.</strong>{" "}
              The kit has no language files and never touches the translation
              context. Everything the user will see or hear arrives as a
              property — already in the right language.
            </p>
            <p>
              That is deliberate, not a gap. A primitive that translates its
              own labels has to bring its own namespace along — and that
              namespace then fights the screen’s namespace over who owns the
              word “Cancel”. This kit does not have that argument, because it
              never owns the word.
            </p>
          </div>
        ),
      },
    },
    {
      id: "co-to-znamena",
      title: {
        cs: "Co to znamená prakticky",
        en: "What that means in practice",
      },
      body: {
        cs: (
          <IngotList
            items={[
              <>
                Popisek, který nikam nepředáš, prostě nebude — primitivum za
                tebe nic nedoplní ani nehádá.
              </>,
              <>
                Text nemusí být řetězec. Většina slotů bere celý uzel, takže
                do nich jde poslat i větu s odkazem nebo zvýrazněním.
              </>,
              <>
                Množné číslo a formátování čísel, měn a datumů řeší volající.
                Kit dostane hotový text.
              </>,
              <>
                Přepnutí jazyka za běhu funguje samo: popisky přicházejí
                shora, takže se překreslí spolu s obrazovkou.
              </>,
            ]}
          />
        ),
        en: (
          <IngotList
            items={[
              <>
                A label you do not pass simply will not be there — the
                primitive fills in nothing and guesses nothing.
              </>,
              <>
                The text need not be a string. Most slots take a whole node,
                so you can pass a sentence with a link or emphasis in it.
              </>,
              <>
                Plurals and the formatting of numbers, currencies and dates
                are the caller’s job. The kit receives finished text.
              </>,
              <>
                Switching language at runtime works by itself: the labels come
                from above, so they re-render together with the screen.
              </>,
            ]}
          />
        ),
      },
    },
    {
      id: "neviditelne-popisky",
      title: {
        cs: "Nezapomeň na popisky, které nejsou vidět",
        en: "Do not forget the labels nobody sees",
      },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Nejčastější chyba nejsou nepřeložená tlačítka — těch si všimne
              každý. Jsou to texty, které vidí jen odečítač obrazovky, takže
              zůstanou v původním jazyce i v jinojazyčné administraci a nikdo
              to nenahlásí:
            </p>
            <IngotList
              items={[
                <>
                  <IngotCode>closeLabel</IngotCode> — popisek křížku
                  v dialogu. Bez něj odečítač přečte jen „tlačítko“.
                </>,
                <>
                  <IngotCode>caption</IngotCode> tabulky — popis, který se
                  nevykresluje do obrazu.
                </>,
                <>
                  <IngotCode>actionsLabel</IngotCode> — záhlaví sloupce
                  s řádkovými akcemi.
                </>,
                <>
                  <IngotCode>loadingLabel</IngotCode> — hlášení „načítám“.
                  Typově je nepovinné, ale jakmile se může načítat, je bez něj
                  hlášení prázdné.
                </>,
              ]}
            />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              The most common mistake is not untranslated buttons — everyone
              spots those. It is the strings only a screen reader sees, which
              therefore stay in the original language even in an
              otherwise-translated admin, and nobody reports them:
            </p>
            <IngotList
              items={[
                <>
                  <IngotCode>closeLabel</IngotCode> — the dialog’s close icon.
                  Without it a screen reader announces just “button”.
                </>,
                <>
                  <IngotCode>caption</IngotCode> on a table — a description
                  that is never painted on screen.
                </>,
                <>
                  <IngotCode>actionsLabel</IngotCode> — the header of the
                  row-actions column.
                </>,
                <>
                  <IngotCode>loadingLabel</IngotCode> — the “loading”
                  announcement. Optional in the type, but once loading can
                  happen the announcement is empty without it.
                </>,
              ]}
            />
          </div>
        ),
      },
    },
    {
      id: "kde-hledat",
      title: {
        cs: "Kde hledat konkrétní popisky",
        en: "Where to find the specific labels",
      },
      body: {
        cs: (
          <p className="text-sm text-ink-2">
            Každá stránka komponenty má vlastní sekci{" "}
            <strong>Překlady</strong>, kde jsou vyjmenované právě ty popisky,
            které si žádá ona. Tahle stránka drží pravidlo; tam najdeš seznam.
          </p>
        ),
        en: (
          <p className="text-sm text-ink-2">
            Every component page has its own <strong>Translations</strong>{" "}
            section listing exactly the labels that component asks for. This
            page holds the rule; the list is over there.
          </p>
        ),
      },
    },
  ],
};
