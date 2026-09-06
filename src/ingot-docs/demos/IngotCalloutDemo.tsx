import { Button, IngotCallout } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    infoTitle: "Ceník platí od pondělí",
    infoBody:
      "Změny se propíšou do nových poptávek. Rozpracované zakázky si drží ceny, se kterými byly založeny.",
    okTitle: "Kalibrace potvrzena",
    okBody: "Stroj je znovu v plánu a jeho operace se zařadily do fronty.",
    warnTitle: "Chybí norma spotřeby",
    warnBody: "Bez ní se operace naceňuje odhadem. Doplňte ji v nastavení procesu.",
    dangerTitle: "Zakázka je po termínu",
    dangerBody: "Tři operace čekají na volný stroj déle, než dovoluje termín odeslání.",
    reschedule: "Přeplánovat",
  },
  en: {
    infoTitle: "The price list applies from Monday",
    infoBody:
      "Changes reach new enquiries. Jobs already in progress keep the prices they were created with.",
    okTitle: "Calibration confirmed",
    okBody: "The machine is back in the plan and its operations rejoined the queue.",
    warnTitle: "Consumption standard missing",
    warnBody:
      "Without it the operation is priced by estimate. Add it in the process settings.",
    dangerTitle: "The job is past its date",
    dangerBody:
      "Three operations have waited for a free machine longer than the shipping date allows.",
    reschedule: "Reschedule",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="w-full max-w-xl space-y-3">
      <IngotCallout title={t.infoTitle} testId="docs-callout-info">
        {t.infoBody}
      </IngotCallout>
      <IngotCallout tone="ok" title={t.okTitle}>
        {t.okBody}
      </IngotCallout>
      <IngotCallout tone="warn" title={t.warnTitle}>
        {t.warnBody}
      </IngotCallout>
      <IngotCallout
        tone="danger"
        title={t.dangerTitle}
        actions={
          <Button size="sm" variant="secondary">
            {t.reschedule}
          </Button>
        }
      >
        {t.dangerBody}
      </IngotCallout>
    </div>
  );
}
