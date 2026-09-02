import type { JSX } from "react";

import { Button, IngotCode, IngotList } from "@/ingot";
import type { DocLang } from "@/ingot-docs/lang";
import type { IngotGuidePage } from "@/ingot-docs/types";
import {
  MarketingComparison,
  MarketingCta,
  MarketingFaq,
  MarketingPricing,
  MarketingSectionHead,
  MarketingSegments,
  MarketingSteps,
  MarketingTri,
} from "@/marketing";

/**
 * Stránka „Veřejné stránky" (KAN-664) — marketingové bloky z handoffu
 * Veřejné stránky, s živými ukázkami.
 *
 * Bloky nejsou export ``@/ingot`` (v adminu nemají konzumenta), takže
 * nemají komponentní doc stránku — komponentní registr je párovaný
 * s barrel exporty 1 : 1 a marketing by tu obousměrnost rozbil. Proto
 * průvodce.
 *
 * ⚠️ Doc web je VEŘEJNÁ stránka: žádné klíče úkolů ani interní cesty
 * v renderovaném textu. Ukázková data (názvy plánů, ceny) jsou zjevně
 * smyšlená — skutečný ceník bere web z dat plánů, což text i říká.
 */

function SectionHeadExample({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="rounded-lg border border-border bg-bg p-6">
      <div className="space-y-10">
        <MarketingSectionHead
          eyebrow={cs ? "Jak to funguje" : "How it works"}
          title={
            cs
              ? "Od poptávky k nabídce bez přepisování"
              : "From inquiry to quote without retyping"
          }
          lede={
            cs
              ? "Stejné tokeny jako administrace, jen větší rozestupy. Sekci nese typografie a linka — žádné gradienty ani ilustrace."
              : "The same tokens as the admin, just larger spacing. Typography and the line carry the section — no gradients, no illustrations."
          }
        />
        <MarketingTri
          items={[
            {
              icon: "upload",
              title: cs ? "Nahrajte výkres" : "Upload a drawing",
              text: cs
                ? "Poptávka začíná souborem, ne formulářem o dvaceti polích."
                : "An inquiry starts with a file, not a twenty-field form.",
            },
            {
              icon: "bolt",
              title: cs ? "Okamžitý rozpad" : "Instant breakdown",
              text: cs
                ? "Operace a časy se spočítají z geometrie dílu."
                : "Operations and times are computed from the part geometry.",
            },
            {
              icon: "check",
              title: cs ? "Nabídka na odeslání" : "A quote ready to send",
              text: cs
                ? "Cena vzniká z vašich sazeb, ne z odhadu po telefonu."
                : "The price comes from your rates, not a phone estimate.",
            },
          ]}
        />
      </div>
    </div>
  );
}

function StepsExample({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="rounded-lg border border-border bg-bg p-6">
      <MarketingSteps
        items={[
          {
            title: cs ? "Nahrajte díl" : "Upload the part",
            text: cs
              ? "DXF, STEP nebo PDF — formát řeší platforma."
              : "DXF, STEP or PDF — the platform handles the format.",
          },
          {
            title: cs ? "Zkontrolujte rozpad" : "Review the breakdown",
            text: cs
              ? "Operace, časy a materiál na jedné obrazovce."
              : "Operations, times and material on one screen.",
          },
          {
            title: cs ? "Odešlete nabídku" : "Send the quote",
            text: cs
              ? "Zákazník dostane cenu, vy záznam v historii."
              : "The customer gets a price, you get a record in history.",
          },
        ]}
      />
    </div>
  );
}

function SegmentsExample({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="rounded-lg border border-border bg-bg p-6">
      <MarketingSegments
        items={[
          {
            title: cs ? "Zakázková kovovýroba" : "Custom metal fabrication",
            text: cs
              ? "Desítky poptávek týdně a každá jiná."
              : "Dozens of inquiries a week, each one different.",
            tags: [
              cs ? "Laser" : "Laser",
              cs ? "Ohyb" : "Bending",
              cs ? "Svařování" : "Welding",
            ],
          },
          {
            title: cs ? "Obrobny" : "Machine shops",
            text: cs
              ? "Ceny stojí na strojních časech, ne na odhadu."
              : "Prices stand on machine times, not on a guess.",
            tags: [cs ? "Frézování" : "Milling", cs ? "Soustružení" : "Turning"],
          },
          {
            title: cs ? "Konstrukční kanceláře" : "Design offices",
            text: cs
              ? "Rychlá zpětná vazba na vyrobitelnost dílu."
              : "Fast feedback on the manufacturability of a part.",
            tags: [cs ? "Prototypy" : "Prototypes", cs ? "Malé série" : "Small runs"],
          },
        ]}
      />
    </div>
  );
}

function ComparisonExample({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="rounded-lg border border-border bg-bg p-6">
      <MarketingComparison
        headers={{
          task: cs ? "Úkol" : "Task",
          before: cs ? "Dnes" : "Today",
          after: cs ? "S platformou" : "With the platform",
        }}
        rows={[
          {
            id: "quote",
            task: cs ? "Ocenit poptávku" : "Price an inquiry",
            before: {
              icon: "clock",
              text: cs ? "Dva až tři dny čekání" : "Two to three days of waiting",
            },
            after: {
              icon: "check",
              text: cs ? "Do minuty" : "Within a minute",
            },
          },
          {
            id: "rate",
            task: cs ? "Změna sazby stroje" : "Changing a machine rate",
            before: {
              icon: "alert",
              text: cs ? "Ruční přepis v tabulce" : "Retyping it in a spreadsheet",
            },
            after: {
              icon: "check",
              text: cs
                ? "Jedno pole, propíše se všude"
                : "One field, applied everywhere",
            },
          },
          {
            id: "margin",
            task: cs ? "Přehled marží" : "Margin overview",
            before: {
              icon: "close",
              text: cs ? "Až po fakturaci" : "Only after invoicing",
            },
            after: {
              icon: "check",
              text: cs ? "U každé nabídky" : "On every quote",
            },
          },
        ]}
      />
    </div>
  );
}

function PricingExample({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  const tryIt = cs ? "Vyzkoušet" : "Try it";
  const talk = cs ? "Domluvit ukázku" : "Book a demo";
  const contact = cs ? "Kontaktovat" : "Get in touch";
  return (
    <div className="rounded-lg border border-border bg-bg p-6">
      <MarketingPricing
        plans={[
          {
            id: "start",
            name: "Start",
            price: "X XXX Kč",
            period: cs ? "měsíčně" : "per month",
            description: cs
              ? "Pro první poptávky."
              : "For your first inquiries.",
            features: [
              cs ? "Jeden uživatel" : "One user",
              cs ? "Základní rozpad operací" : "Basic operation breakdown",
            ],
            action: (
              <Button variant="secondary" className="w-full">
                {tryIt}
              </Button>
            ),
          },
          {
            id: "team",
            name: "Team",
            price: "X XXX Kč",
            period: cs ? "měsíčně" : "per month",
            description: cs
              ? "Pro dílnu s obchodem."
              : "For a shop with a sales desk.",
            features: [
              cs ? "Pět uživatelů" : "Five users",
              cs ? "Vlastní sazby strojů" : "Custom machine rates",
              cs ? "Historie nabídek" : "Quote history",
            ],
            featured: true,
            badge: cs ? "Nejčastější" : "Most popular",
            action: (
              <Button variant="primary" className="w-full">
                {talk}
              </Button>
            ),
          },
          {
            id: "firm",
            name: "Firm",
            price: "X XXX Kč",
            period: cs ? "měsíčně" : "per month",
            description: cs
              ? "Pro výrobu s více provozy."
              : "For production across multiple sites.",
            features: [
              cs ? "Neomezení uživatelé" : "Unlimited users",
              cs ? "Napojení na sklad" : "Inventory integration",
            ],
            action: (
              <Button variant="secondary" className="w-full">
                {contact}
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}

function FaqExample({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="rounded-lg border border-border bg-bg p-6">
      <MarketingFaq
        items={[
          {
            id: "data",
            question: cs
              ? "Komu patří nahraná data?"
              : "Who owns the uploaded data?",
            answer: cs
              ? "Vám. Výkresy i nabídky zůstávají ve vašem účtu a kdykoli je smažete."
              : "You. Drawings and quotes stay in your account and you can delete them at any time.",
          },
          {
            id: "trial",
            question: cs ? "Dá se to vyzkoušet zdarma?" : "Is there a free trial?",
            answer: cs
              ? "Ano, zkušební období nevyžaduje platební kartu."
              : "Yes, the trial period requires no payment card.",
          },
          {
            id: "import",
            question: cs
              ? "Přenesu si stávající ceníky?"
              : "Can I bring my existing price lists?",
            answer: cs
              ? "Sazby strojů a materiálů se dají naimportovat z tabulky."
              : "Machine and material rates can be imported from a spreadsheet.",
          },
        ]}
      />
    </div>
  );
}

function CtaExample({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="rounded-lg border border-border bg-bg p-6">
      <MarketingCta
        title={cs ? "Začněte nacenit první díl" : "Start pricing your first part"}
        text={
          cs
            ? "Registrace zabere minutu a zkušební období nic nestojí."
            : "Signing up takes a minute and the trial costs nothing."
        }
        primary={{ label: cs ? "Vyzkoušet zdarma" : "Try it free", href: "#" }}
        secondary={{ label: cs ? "Domluvit ukázku" : "Book a demo", href: "#" }}
      />
    </div>
  );
}

function Principles({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="space-y-3 text-sm text-ink-2">
      <p>
        {cs
          ? "Veřejné stránky se kreslí stejnými tokeny jako administrace — mají jen větší rozestupy a trojsloupcovou mřížku. Sekce nese typografie a linka; gradienty a ilustrace do bloků nepatří. Bloky se importují z modulu "
          : "Public pages are drawn with the same tokens as the admin — just with larger spacing and a three-column grid. Typography and the line carry a section; gradients and illustrations do not belong in the blocks. The blocks are imported from the "}
        <IngotCode>@/marketing</IngotCode>
        {cs ? " a řídí se čtyřmi pravidly:" : " module and follow four rules:"}
      </p>
      <IngotList
        items={
          cs
            ? [
                "Akcent smí být nejvýš na jednom prvku sekce.",
                "Trojsloupcová mřížka je výchozí a čtyři sloupce patří jen krokům procesu; pod 1100 px se mřížka skládá na jeden sloupec.",
                "Tmavý blok smí být na stránce nejvýš dvakrát — závěrečné CTA a patička.",
                "Texty i ceny jsou obsah: přicházejí z dat přes vlastnosti bloků, nikdy jako konstanty v kódu.",
              ]
            : [
                "The accent may sit on at most one element of a section.",
                "The three-column grid is the default and four columns belong to process steps only; below 1100 px the grid stacks into one column.",
                "A dark block may appear at most twice per page — the closing call to action and the footer.",
                "Copy and prices are content: they arrive from data through the blocks' properties, never as constants in code.",
              ]
        }
      />
    </div>
  );
}

export const PublicPagesGuide: IngotGuidePage = {
  slug: "verejne-stranky",
  group: "app",
  title: { cs: "Veřejné stránky", en: "Public pages" },
  summary: {
    cs: "Marketingové bloky veřejného webu: hlavička sekce, featury, kroky, segmenty, srovnání, ceník, časté dotazy a závěrečná výzva.",
    en: "The marketing blocks of the public site: section head, features, steps, segments, comparison, pricing, FAQ and the closing call to action.",
  },
  sections: [
    {
      id: "zasady",
      title: { cs: "Zásady", en: "Principles" },
      body: {
        cs: <Principles lang="cs" />,
        en: <Principles lang="en" />,
      },
    },
    {
      id: "hlavicka-sekce",
      title: {
        cs: "Hlavička sekce a trojice featur",
        en: "Section head and feature trio",
      },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Dvousloupec: štítek s nadpisem vlevo, uvozující odstavec vpravo.
              Akcent nese jen štítek. Pod hlavičkou trojice featur — ikona
              18 px v akcentovém rámečku, titulek a malý text. Trojice stojí
              v jednom zaobleném rámu a panely dělí vlasová linka, ne mezera:
              jsou to tři části jednoho celku, ne tři kartičky.
            </p>
            <SectionHeadExample lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              A two-column head: the label and heading on the left, the lede on
              the right. Only the label carries the accent. Below it a trio of
              features — an 18 px icon in an accent frame, a title and small
              text. The trio sits in one rounded frame with the panels split
              by a hairline rather than a gap: three parts of one whole, not
              three small cards.
            </p>
            <SectionHeadExample lang="en" />
          </div>
        ),
      },
    },
    {
      id: "kroky",
      title: { cs: "Kroky", en: "Steps" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Karty s pořadovým číslem a šipkou k dalšímu kroku; poslední
              karta šipku nemá. Číslo je malá akcentová pilulka, ne velké
              číslo — nejvyšší váhu v kartě má titulek kroku. Číslo se počítá
              z pořadí, takže se nedá přeskočit. Trojsloupcová mřížka je
              výchozí; čtyři sloupce patří jen krokům procesu.
            </p>
            <StepsExample lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Cards with an ordinal number and an arrow towards the next step;
              the last card has no arrow. The number is a small accent pill,
              not a large numeral — the step's title carries the most weight
              in the card. The number is derived from the order, so it cannot
              skip. The three-column grid is the default; four columns belong
              to process steps only.
            </p>
            <StepsExample lang="en" />
          </div>
        ),
      },
    },
    {
      id: "segmenty",
      title: { cs: "Segmenty", en: "Segments" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Karty „pro koho to je" se štítky. Štítek je hranatý mono
              malými písmeny — je to technický údaj o provozu, ne stav
              entity. Štítky zůstávají neutrální; akcent v sekci patří
              hlavičce.
            </p>
            <SegmentsExample lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              "Who is it for" cards with tags. A tag is a square lowercase
              mono label — a technical fact about a shop, not the status of
              an entity. Tags stay neutral; the section's accent belongs to
              its head.
            </p>
            <SegmentsExample lang="en" />
          </div>
        ),
      },
    },
    {
      id: "srovnani",
      title: { cs: "Srovnání", en: "Comparison" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Řádková tabulka úkol / dnes / s platformou. Řádek je ta
              podstatná jednotka: páruje jeden úkol s oběma stavy, takže se
              nedá napsat rozpojeně. Hlavička sedí na tlumené ploše, třetí
              sloupec je zvýrazněný a je jediným akcentovým prvkem sekce. Na
              úzké obrazovce se tabulka roluje do strany — složená mřížka už
              nic nesrovnává.
            </p>
            <ComparisonExample lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              A row table of task / today / with the platform. The row is the
              unit that matters: it pairs one task with both states, so it
              cannot be written apart. The header sits on the muted surface,
              the third column is highlighted and is the section's only
              accented element. On a narrow screen the table scrolls
              sideways — a grid that stacks no longer compares anything.
            </p>
            <ComparisonExample lang="en" />
          </div>
        ),
      },
    },
    {
      id: "cenik",
      title: { cs: "Ceník", en: "Pricing" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Tři karty plánů, prostřední zvýrazněná obrysem a stínem; odznak
              stojí v hlavičce karty vedle názvu plánu. Cena je mono, akce má
              každá karta a všechny sedí na jedné patě. Blok neumí vykreslit nic, co nedostane přes{" "}
              <IngotCode>plans</IngotCode> — názvy, ceny i výčty vlastností
              jsou data plánů platformy, žádné částky v kódu. Ceny v ukázce
              jsou proto schválně vyiksované.
            </p>
            <PricingExample lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Three plan cards, the middle one highlighted with an outline and
              a shadow; the badge sits in the card header next to the plan
              name. The price is set in mono, every card carries an action and
              all of them rest on one foot line. The block cannot render anything it
              does not receive through <IngotCode>plans</IngotCode> — names,
              prices and feature lists are the platform's plan data, no
              amounts in code. That is why the example prices are X-ed out on
              purpose.
            </p>
            <PricingExample lang="en" />
          </div>
        ),
      },
    },
    {
      id: "faq",
      title: { cs: "Časté dotazy", en: "FAQ" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Otázka je tlačítko s ohlášeným stavem rozbalení, odpověď je
              pojmenovaná oblast — celé ovladatelné klávesnicí. Odpověď je
              povinné pole: položku bez odpovědi nejde napsat.
            </p>
            <FaqExample lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              The question is a control that announces its expanded state, the
              answer a named region — all keyboard-operable. The answer is a
              required field: an item without one cannot be written.
            </p>
            <FaqExample lang="en" />
          </div>
        ),
      },
    },
    {
      id: "cta",
      title: { cs: "Závěrečná výzva", en: "Closing call to action" },
      body: {
        cs: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Tmavý blok se dvěma velkými akcemi; hlavní je akcentová, aby
              měl na tmavé ploše kam jít pohled. Kreslí se prohozenými
              neutrálními tokeny, takže v tmavém motivu se obrátí sám. Na
              stránce smí být tmavý blok nejvýš dvakrát — tohle CTA a patička.
            </p>
            <CtaExample lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              A dark block with two large actions; the primary one is
              accented so the eye has somewhere to land on the dark surface.
              It is drawn with the
              neutral tokens swapped, so it inverts itself in the dark theme.
              A page may hold at most two dark blocks — this call to action
              and the footer.
            </p>
            <CtaExample lang="en" />
          </div>
        ),
      },
    },
  ],
};
