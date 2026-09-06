import { IngotCode, IngotList } from "@/ingot";
import type { DocLang } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";

/**
 * "For kit authors" — the rules that bind whoever CHANGES the kit
 * (KAN-858).
 *
 * These sections used to sit among the usage rules, where a reader who
 * only wanted to build a screen had to walk past them. They are a
 * different audience with a different question: not "how do I use this"
 * but "what am I allowed to do to it".
 *
 * That is also why this page is its own menu group, at the end. A reader
 * arriving to build something reaches the answer without wading through
 * a contributor's rulebook, and a contributor finds their rulebook in one
 * place instead of four sections of somebody else's page.
 *
 * The doc web is a PUBLIC page: no issue keys, no repository paths, no
 * guard names in rendered text.
 */

function AddingPrimitive({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Primitivum bez stránky neexistuje a stránka bez primitiva je lež. Přidat komponentu a přidat její stránku je JEDNA změna, ne dvě — kontrola repozitáře odmítne obojí zvlášť."
          : "A primitive without a page does not exist, and a page without a primitive is a lie. Adding a component and adding its page is ONE change, not two — the repository's checks refuse either half on its own."}
      </p>
      <IngotList
        variant="ordered"
        items={
          cs
            ? [
                <>
                  Komponenta v kitu, exportovaná z jeho rozcestníku. Texty přicházejí
                  zvenčí; kit nepřekládá ani slovo.
                </>,
                <>
                  Ukázka jako samostatný modul. Stránka ho importuje{" "}
                  <strong>dvakrát</strong> — jednou jako kód, který se vykreslí, a
                  jednou jako text výpisu. Výpis se tak nemůže rozejít s tím, co ukázka
                  dělá, protože je to jeden soubor přečtený dvakrát.
                </>,
                <>
                  Stránka se stavem, verzí, značkou, tokeny, shrnutím, kdy použít a kdy
                  ne, a vlastnostmi. Prázdné pole projde typovou kontrolou; prázdnou
                  sekci odchytí test.
                </>,
                <>
                  Zápis v registru na abecedním místě podle jména, které stránka ukazuje
                  — bez předpony.
                </>,
                <>
                  Test, který komponentu jmenuje. Chybějící soubor s testem je přesně
                  to, čeho si v revizi nikdo nevšimne.
                </>,
              ]
            : [
                <>
                  The component in the kit, exported from its barrel. Texts arrive from
                  the caller; the kit translates not one word.
                </>,
                <>
                  The demo as a module of its own. The page imports it{" "}
                  <strong>twice</strong> — once as code that renders, once as the text
                  of the listing. The listing therefore cannot drift from what the demo
                  does, because it is one file read twice.
                </>,
                <>
                  The page, with its status, version, tag, tokens, summary, when to use
                  it and when not to, and its props. An empty array passes the
                  typecheck; an empty section is caught by a test.
                </>,
                <>
                  A registry entry, in alphabetical place by the name the page shows —
                  without the prefix.
                </>,
                <>
                  A test that names the component. A missing test file is exactly what
                  nobody notices in review.
                </>,
              ]
        }
      />
      <p>
        {cs
          ? "A verze. Změna komponenty bez posunu verze na její stránce neprojde: na těch verzích stojí vydávání, takže verze, která se nehne, je vydání, které nikdy nevyjde."
          : "And the version. A change to a component without moving the version on its page does not pass: releases stand on those versions, so a version that does not move is a release that never ships."}
      </p>
    </div>
  );
}

function Maintenance({ lang }: { lang: DocLang }): JSX.Element {
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <IngotList
        items={
          lang === "cs"
            ? [
                <>
                  Nová komponenta vzniká v systému, ne v obrazovce — dostane název,
                  pravidlo použití a stránku v téhle dokumentaci, a teprve pak se
                  použije. Komponenta poskládaná uvnitř jedné obrazovky je ostrůvek:
                  příště ji nikdo nenajde a napíše si vlastní.
                </>,
                <>
                  Vlastní barva, mezera nebo rádius v obrazovce znamená chybějící token.
                  Řeší se v systému, ne v obrazovce — jinak ta hodnota zůstane jediná
                  svého druhu a nikdo ji při další změně palety nenajde.
                </>,
                <>
                  Změna tokenu je změna produktu: prochází stejným review jako změna
                  kódu. Projeví se všude naráz, takže se nedá vrátit jednou obrazovkou.
                </>,
              ]
            : [
                <>
                  A new component is born in the system, not in a screen — it gets a
                  name, a rule of use and a page in this documentation, and only then is
                  used. A component assembled inside one screen is an island: nobody
                  finds it next time, and writes their own.
                </>,
                <>
                  A custom colour, spacing or radius in a screen means a missing token.
                  It is settled in the system, not in the screen — otherwise that value
                  stays one of a kind and nobody finds it at the next change of the
                  palette.
                </>,
                <>
                  Changing a token is changing the product: it goes through the same
                  review as a change of code. It lands everywhere at once, so it cannot
                  be undone by one screen.
                </>,
              ]
        }
      />
    </div>
  );
}

function Lifecycle({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Kit se instaluje z tagu, takže volající nesedí v tomhle repozitáři. Odebrat komponentu bez ohlášení proto znamená, že někomu v pondělí ráno přestane jít build a nemá si co přečíst. Odchod má tři kroky a růst má dvě podmínky."
          : "The kit is installed from a tag, so its callers do not sit in this repository. Removing a component without notice therefore means somebody's build stops on a Monday morning with nothing to read. Leaving has three steps; growing up has two conditions."}
      </p>
      <IngotList
        variant="ordered"
        items={
          cs
            ? [
                <>
                  Stránka dostane stav <strong>zastaralé</strong> a s ním datum
                  odstranění a náhradu. Odznak zčervená a stránka začíná upozorněním —
                  před ukázkou, ne za ní.
                </>,
                <>
                  Komponenta <strong>dál funguje beze změny nejméně dvě vydání</strong>.
                  Zastarání, které věc odstraní v příští verzi, je odstranění s
                  mezikrokem.
                </>,
                <>
                  Zmizí ve verzi, kterou stránka jmenovala — nikdy dřív. Je to{" "}
                  <strong>minor</strong>, ne patch: pro volajícího je to stejně tvrdá
                  změna jako přejmenovaný prop.
                </>,
              ]
            : [
                <>
                  The page gets the <strong>deprecated</strong> status, with a removal
                  version and a replacement. The badge turns red and the page opens with
                  the notice — before the demo, not after it.
                </>,
                <>
                  The component{" "}
                  <strong>keeps working, unchanged, for at least two releases</strong>.
                  A deprecation that removes the thing in the next version is a removal
                  with extra steps.
                </>,
                <>
                  It disappears in the version the page named — never sooner. That is a{" "}
                  <strong>minor</strong> bump, not a patch: to a caller it is as hard a
                  change as a renamed prop.
                </>,
              ]
        }
      />
      <p>
        {cs
          ? "Z bety na stabilní se komponenta dostane na důkazy, ne stářím: musí ji používat dva konzumenti (doc web se nepočítá, ten ukazuje všechno) a dvě vydání za sebou nesmí dostat major. Označit něco za stabilní, protože to vypadá hotově, je nejrychlejší cesta k systému, který si nesmí opravit vlastní chyby."
          : "A component moves from beta to stable on evidence, not on age: two consumers have to use it (the doc web does not count — it demonstrates everything) and it must go two releases without a major bump. Marking something stable because it looks finished is the fastest way to a system that may not fix its own mistakes."}
      </p>
      <p>
        {cs
          ? "Podle toho kritéria je dnes 36 z 55 primitiv v betě a zůstávají tam: kit zatím nemá dva konzumenty mimo tenhle repozitář. Až je bude mít, projde se seznam znovu — a bude z čeho rozhodovat."
          : "By that criterion 36 of the 55 primitives are in beta today and stay there: the kit does not yet have two consumers outside this repository. Once it does, the list gets another pass — and there will be something to decide on."}
      </p>
    </div>
  );
}

function ApiRules({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Komponenta kitu se pozná podle toho, co dovolí a co ne. Tahle čtyři pravidla platí pro každou z nich, takže se nemusíš u každé znovu ptát."
          : "A kit component is recognised by what it allows and what it does not. These four rules hold for every one of them, so you do not have to ask again at each."}
      </p>
      <IngotList
        items={
          cs
            ? [
                <>
                  <IngotCode>className</IngotCode> je rozvržení, nikdy vzhled. Šířka,
                  mezery, umístění v mřížce — nic, co mění barvu, rádius, řez písma nebo
                  vnitřní odsazení. Komponenta, jejímž smyslem je vypadat všude stejně,
                  ho nebere vůbec; každá stránka komponenty to říká nad tabulkou
                  vlastností.
                </>,
                <>
                  Co má cíl v DOM, bere <IngotCode>ref</IngotCode>. Zaostřit pole,
                  odrolovat řádek do výřezu, nastavit
                  <IngotCode>indeterminate</IngotCode> — všechno přes API. Sáhnout
                  dovnitř přes <IngotCode>querySelector</IngotCode> znamená přivázat
                  obrazovku k vnitřku komponenty, který se smí přejmenovat.
                </>,
                <>
                  Popisek, který potřebuje odečítač, je povinná vlastnost — ne nepovinná
                  s výchozí hodnotou. Nepovinný popisek je popisek, na který se
                  zapomene, a na obrazovce tu díru nikdo neuvidí.
                </>,
                <>
                  Každý viditelný text přichází přeložený od volajícího. Pár popisků,
                  které kit říká sám, bydlí ve slovníku{" "}
                  <IngotCode>IngotProvider</IngotCode> a bez něj jsou anglicky.
                </>,
              ]
            : [
                <>
                  <IngotCode>className</IngotCode> is layout, never look. Width,
                  spacing, placement in a grid — nothing that changes colour, radius,
                  weight or inner padding. A component whose whole point is to look the
                  same everywhere does not take it at all; every component page says
                  which it is, above the properties table.
                </>,
                <>
                  Anything with a DOM target takes <IngotCode>ref</IngotCode>. Focusing
                  a field, scrolling a row into view, setting{" "}
                  <IngotCode>indeterminate</IngotCode> — all through the API. Reaching
                  inside with <IngotCode>querySelector</IngotCode> ties the screen to
                  the component's insides, which are free to be renamed.
                </>,
                <>
                  A label a screen reader needs is a required property — not an optional
                  one with a default. An optional label is a label somebody forgets, and
                  nobody sees that hole on screen.
                </>,
                <>
                  Every visible string arrives translated from the caller. The few
                  labels the kit says itself live in the{" "}
                  <IngotCode>IngotProvider</IngotCode> dictionary and are English
                  without it.
                </>,
              ]
        }
      />
    </div>
  );
}

export const AuthorsGuide: IngotGuidePage = {
  slug: "pro-autory",
  group: "authors",
  title: { cs: "Pro autory kitu", en: "For kit authors" },
  summary: {
    cs: "Co platí pro toho, kdo kit mění: tvar API, jak primitivum přibývá a odchází, a co drží systém pohromadě.",
    en: "What binds whoever changes the kit: the shape of an API, how a primitive arrives and leaves, and what holds the system together.",
  },
  sections: [
    {
      id: "nove-primitivum",
      title: {
        cs: "Jak se přidává nové primitivum",
        en: "How a new primitive is added",
      },
      body: { cs: <AddingPrimitive lang="cs" />, en: <AddingPrimitive lang="en" /> },
    },
    {
      id: "api-pravidla",
      title: {
        cs: "Pravidla API komponent",
        en: "The API rules of a component",
      },
      body: { cs: <ApiRules lang="cs" />, en: <ApiRules lang="en" /> },
    },
    {
      id: "zivotni-cyklus",
      title: {
        cs: "Jak komponenta odchází a jak dospívá",
        en: "How a component leaves, and how it grows up",
      },
      body: { cs: <Lifecycle lang="cs" />, en: <Lifecycle lang="en" /> },
    },
    {
      id: "udrzba",
      title: { cs: "Údržba", en: "Maintenance" },
      body: { cs: <Maintenance lang="cs" />, en: <Maintenance lang="en" /> },
    },
  ],
};
