import { IngotCode, IngotList } from "@/ingot";
import { DictionaryTermsDemo } from "@/ingot-docs/DictionaryTermsDemo";
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
  group: "rules",
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
    // Slovník Jednoduše/Expert (KAN-662). Rozhodnutí o formě režimu
    // „Obojí“ (závorka, ne tooltip) je zapsané TADY, protože tohle je
    // stránka, kterou si otevře ten, kdo bude termíny přidávat.
    {
      id: "slovnik",
      title: {
        cs: "Slovník: Jednoduše / Expert",
        en: "Dictionary: Simple / Expert",
      },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Odborné termíny mají dvě podoby: jednoduchý opis pro čtenáře,
              který obor teprve poznává, a expertní termín pro toho, kdo v
              něm žije. Kterou podobu uvidí, si volí uživatel — režimy jsou{" "}
              <strong>Jednoduše</strong>, <strong>Expert</strong> a výchozí{" "}
              <strong>Obojí</strong>.
            </p>
            <p>
              Režim „Obojí“ ukazuje expertní termín a jednoduchý opis{" "}
              <strong>v závorce za ním</strong> — ne v tooltipu. Tooltip
              nefunguje na dotykové obrazovce, odečítač obrazovky ho bez
              extra práce nepřečte a text mimo stránku nenajde ani
              vyhledávání. Závorka je delší, ale vidí ji každý.
            </p>
            <p>
              Vyzkoušej: přepni volbu <strong>Slovník</strong> vlevo dole a
              sleduj, jak se termíny níže překreslí.
            </p>
            <DictionaryTermsDemo lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Technical terms come in two forms: a plain description for a
              reader still learning the domain, and the expert term for the
              one who lives in it. Which form appears is the user’s choice —
              the modes are <strong>Simple</strong>, <strong>Expert</strong>{" "}
              and the default <strong>Both</strong>.
            </p>
            <p>
              The “Both” mode shows the expert term with the plain
              description <strong>in parentheses after it</strong> — not in a
              tooltip. Tooltips do not work on touch screens, screen readers
              skip them without extra wiring, and in-page search cannot find
              text that is not in the page. The parenthesis is longer, but
              everyone sees it.
            </p>
            <p>
              Try it: flip the <strong>Dictionary</strong> control in the
              bottom left and watch the terms below re-render.
            </p>
            <DictionaryTermsDemo lang="en" />
          </div>
        ),
      },
    },
    {
      id: "jak-pridat-termin",
      title: {
        cs: "Jak přidat termín",
        en: "How to add a term",
      },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Termíny bydlí v jednom registru vedle ostatních jazykových
              pomůcek doc webu. Každý termín je dvojice variant, obě už
              přeložené do všech jazyků, které doc web nese.
            </p>
            <IngotList
              variant="ordered"
              items={[
                <>
                  Přidej klíč do registru termínů: <IngotCode>expert</IngotCode>{" "}
                  povinně, <IngotCode>simple</IngotCode> jen pokud má termín
                  opravdový jednoduchý opis — ne jen synonymum.
                </>,
                <>
                  Typ registru vynucuje všechny jazyky: varianta, které
                  překlad chybí, neprojde kontrolou typů. Jazyk se nedá
                  slíbit, aniž by se napsal.
                </>,
                <>
                  V obsahu volej výběr přes{" "}
                  <IngotCode>termLabel(klíč, režim, jazyk)</IngotCode> — nikdy
                  nevpisuj jednu z variant natvrdo. Tím by se text odpojil od
                  volby uživatele.
                </>,
                <>
                  Termín bez <IngotCode>simple</IngotCode> varianty se ve
                  všech režimech ukazuje expertně — chybějící opis nikdy
                  neskončí jako prázdný text.
                </>,
              ]}
            />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Terms live in one registry next to the doc web’s other language
              helpers. Each term is a pair of variants, both already
              translated into every language the doc web carries.
            </p>
            <IngotList
              variant="ordered"
              items={[
                <>
                  Add the key to the term registry:{" "}
                  <IngotCode>expert</IngotCode> is required,{" "}
                  <IngotCode>simple</IngotCode> only when the term has a real
                  plain description — not just a synonym.
                </>,
                <>
                  The registry’s type enforces every language: a variant
                  missing a translation fails the type check. A language
                  cannot be promised without being written.
                </>,
                <>
                  In content, select via{" "}
                  <IngotCode>termLabel(key, mode, language)</IngotCode> —
                  never hard-code one of the variants. That would disconnect
                  the text from the user’s choice.
                </>,
                <>
                  A term without a <IngotCode>simple</IngotCode> variant shows
                  its expert form in every mode — a missing description never
                  ends up as empty text.
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
