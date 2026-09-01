import type { JSX } from "react";

import { IngotCode, IngotList } from "@/ingot";
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
        columns={[
          {
            title: cs ? "Úkol" : "The task",
            cells: [
              { icon: "file", text: cs ? "Nacenit díl" : "Price a part" },
              {
                icon: "clock",
                text: cs ? "Odpovědět tentýž den" : "Reply the same day",
              },
            ],
          },
          {
            title: cs ? "Dnes" : "Today",
            cells: [
              {
                icon: "alert",
                text: cs
                  ? "Tabulky a odhady po telefonu"
                  : "Spreadsheets and phone estimates",
              },
              {
                icon: "clock",
                text: cs ? "Nabídka za dva dny" : "A quote in two days",
              },
            ],
          },
          {
            title: cs ? "S Forgmaticem" : "With Forgmatic",
            featured: true,
            cells: [
              {
                icon: "check",
                text: cs
                  ? "Cena z geometrie a vašich sazeb"
                  : "A price from geometry and your rates",
              },
              {
                icon: "bolt",
                text: cs ? "Nabídka za minuty" : "A quote in minutes",
              },
            ],
          },
        ]}
      />
    </div>
  );
}

function PricingExample({ lang }: { lang: DocLang }): JSX.Element {
  const cs = lang === "cs";
  return (
    <div className="rounded-lg border border-border bg-bg p-6 pt-9">
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
            badge: cs ? "Nejoblíbenější" : "Most popular",
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
                "Trojsloupcová mřížka je výchozí; pod 1100 px se skládá na jeden sloupec.",
                "Tmavý blok smí být na stránce nejvýš dvakrát — závěrečné CTA a patička.",
                "Texty i ceny jsou obsah: přicházejí z dat přes vlastnosti bloků, nikdy jako konstanty v kódu.",
              ]
            : [
                "The accent may sit on at most one element of a section.",
                "The three-column grid is the default; below 1100 px it stacks into one column.",
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
              18 px v akcentovém rámečku, titulek a malý text.
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
              text.
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
              Tři karty s pořadovým číslem a šipkou k dalšímu kroku; poslední
              karta šipku nemá. Číslo se počítá z pořadí — nedá se přeskočit.
            </p>
            <StepsExample lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              Three cards with an ordinal number and an arrow towards the next
              step; the last card has no arrow. The number is derived from the
              order — it cannot skip.
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
              Karty „pro koho to je" s tag pilulkami. Pilulky jsou neutrální —
              akcent v sekci patří hlavičce.
            </p>
            <SegmentsExample lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              "Who is it for" cards with tag pills. The pills stay neutral —
              the section's accent belongs to its head.
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
              Trojsloupcová mřížka úkol / dnes / s platformou; třetí sloupec je
              zvýrazněný a je jediným akcentovým prvkem sekce. Buňky nesou
              ikonu vedle textu.
            </p>
            <ComparisonExample lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              A three-column grid of task / today / with the platform; the
              third column is highlighted and is the section's only accented
              element. Cells carry an icon next to the text.
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
              Tři karty plánů, prostřední zvýrazněná s odznakem; odrážky
              s fajfkou 14 px. Blok neumí vykreslit nic, co nedostane přes{" "}
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
              Three plan cards, the middle one highlighted with a badge;
              bullets with a 14 px check. The block cannot render anything it
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
              Tmavý blok se dvěma velkými akcemi. Kreslí se prohozenými
              neutrálními tokeny, takže v tmavém motivu se obrátí sám. Na
              stránce smí být tmavý blok nejvýš dvakrát — tohle CTA a patička.
            </p>
            <CtaExample lang="cs" />
          </div>
        ),
        en: (
          <div className="space-y-3 text-sm text-ink-2">
            <p>
              A dark block with two large actions. It is drawn with the
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
