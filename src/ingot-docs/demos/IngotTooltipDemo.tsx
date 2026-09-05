import { Button, IngotRowActions, IngotTooltip } from "@/ingot";
import type { DocLang, Localized } from "@/ingot-docs/lang";

const TEXT: Localized<Record<string, string>> = {
  cs: {
    tip: "Naceňuje se z platných cen materiálu a operací.",
    recalculate: "Přepočítat cenu",
    edit: "Upravit objednávku",
    duplicate: "Duplikovat objednávku",
    remove: "Smazat objednávku",
    hint: "Popisek se ukáže po najetí i po zaostření klávesnicí. Řádkové akce ho používají místo atributu title.",
  },
  en: {
    tip: "Priced from the current material and operation rates.",
    recalculate: "Recalculate the price",
    edit: "Edit the order",
    duplicate: "Duplicate the order",
    remove: "Delete the order",
    hint: "The label shows on hover and on keyboard focus. Row actions use it instead of the title attribute.",
  },
};

export function Demo({ lang }: { lang: DocLang }): JSX.Element {
  const t = TEXT[lang];
  return (
    <div className="flex flex-col items-start gap-4">
      <IngotTooltip text={t.tip} testId="docs-tooltip">
        <Button variant="secondary">{t.recalculate}</Button>
      </IngotTooltip>
      <IngotRowActions
        actions={[
          { icon: "file", label: t.edit, onClick: () => undefined },
          { icon: "copy", label: t.duplicate, onClick: () => undefined },
          {
            icon: "trash",
            label: t.remove,
            tone: "danger",
            onClick: () => undefined,
          },
        ]}
      />
      <p className="text-xs text-ink-3">{t.hint}</p>
    </div>
  );
}
