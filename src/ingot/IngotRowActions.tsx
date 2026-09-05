import { type JSX } from "react";

import { IconButton } from "./IconButton";
import { IngotIcon, type IngotIconName } from "./IngotIcon";

/**
 * Akce jednoho řádku tabulky — ikonová tlačítka na konci řádku.
 *
 * Vlastní primitivum, protože řádkové akce mají jiný rozpočet než
 * tlačítka jinde: 28×28 px, bez rámečku a bez popisku. ``Button`` tuhle
 * hustotu neumí a nemá — tlačítko v hlavičce a tlačítko ve dvacátém
 * řádku tabulky nejsou totéž.
 *
 * 🚨 **Popisek je povinný a začíná slovesem.** Bez něj odečítač přečte
 * jen „tlačítko", dvacetkrát pod sebou. „Smazat objednávku", ne „Koš".
 *
 * ⚠️ **Akce jsou vždy na konci řádku a v témže pořadí.** Kdo je jednou
 * najde, hledá je na dalších stránkách na stejném místě; přeházené
 * pořadí je nejrychlejší cesta ke smazání špatného řádku.
 *
 * 🪤 **Nevratná akce je ``danger``, ale sama nemaže.** Tón mění jen to,
 * jak vypadá při najetí; potvrzení řeší ``IngotConfirm`` u volajícího.
 *
 * Ingot **nemá vlastní i18n namespace** — popisky dodává volající.
 */

export interface IngotRowAction {
  icon: IngotIconName;
  /** Přeložený popisek začínající slovesem. Povinný. */
  label: string;
  onClick: () => void;
  /** Nevratná akce — zčervená při najetí. */
  tone?: "default" | "danger";
  disabled?: boolean;
  testId?: string;
}

export function IngotRowActions({
  actions,
  testId,
}: {
  /** Akce v pevném pořadí. Víc než tři už patří do menu. */
  actions: readonly IngotRowAction[];
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="flex justify-end gap-0.5 text-ink-3"
      data-testid={testId}
    >
      {actions.map((action) => (
        <IconButton
          key={action.label}
          label={action.label}
          title={action.label}
          tone={action.tone === "danger" ? "danger" : "default"}
          disabled={action.disabled}
          onClick={action.onClick}
          data-testid={action.testId}
        >
          <IngotIcon name={action.icon} size={15} />
        </IconButton>
      ))}
    </div>
  );
}
