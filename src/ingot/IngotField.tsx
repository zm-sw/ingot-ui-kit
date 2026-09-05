import { useId, type JSX, type ReactNode } from "react";

import { cx } from "./cx";
import { INPUT_PAD, inputFrameChrome } from "./inputChrome";

/**
 * Popsané textové pole (KAN-651) — ruční stavební kámen běžných formulářů.
 *
 * 🚨 **Není to `IngotFieldInput`.** Ten je schema-driven: dostane popis pole
 * (`IngotFieldSpec`) a vykreslí jen vstup, schválně bez popisku, protože
 * popisek nad ním skládá `IngotForm`. Tahle komponenta je opačná větev —
 * formulář, který se píše rukou a jehož pole nemají žádné schéma, protože
 * jsou tři a jsou dané (název tokenu, počet kusů, e-mail). Do KAN-651 si takové
 * formuláře skládaly `<label>` + `<input>` Tailwindem samy (`AdminApiTokens`),
 * a s tím se pokaždé skládala znovu i a11y — což znamená, že se pokaždé
 * mohla složit jinak.
 *
 * Co komponenta drží za volajícího:
 *
 * * `label for` ↔ `input id` přes `useId`, takže vazba nemůže vzniknout
 *   špatně ani při dvou polích na jedné stránce. Placeholder popisek NENÍ.
 * * Chyba se hlásí textem a `aria-invalid`, ne jen červenou barvou, a je
 *   navázaná přes `aria-describedby` — stejně jako nápověda a přípona.
 * * Fokus je vidět na celém rámečku (`focus-within`), ne jen na `<input>`,
 *   protože přípona sedí uvnitř téhož rámečku.
 *
 * Ingot **nemá vlastní i18n namespace**: `label`, `hint`, `error`, `affix`
 * i `optionalLabel` dodává volající už přeložené.
 *
 * ⚠️ `IngotFieldInput` se uvnitř schválně nepoužívá. Sdílelo by se jediné
 * `<input type="text">`; naopak by se muselo vyrobit falešné
 * `IngotFieldSpec` jen proto, aby bylo co předat, a obě komponenty by se
 * svázaly typem, který jedna z nich nepotřebuje.
 */
export function IngotField({
  label,
  value,
  onChange,
  hint,
  error,
  affix,
  mono = false,
  optionalLabel,
  placeholder,
  required = false,
  disabled = false,
  testId,
}: {
  /** Podstatné jméno bez dvojtečky („Počet kusů“), už přeložené. */
  label: ReactNode;
  value: string;
  onChange: (next: string) => void;
  /** Celá věta s tečkou pod polem. */
  hint?: ReactNode;
  /** Text chyby. Jeho přítomnost zapíná error stav a `aria-invalid`. */
  error?: ReactNode;
  /**
   * Přípona s jednotkou nebo měnou („ks“, „%“). Jednotka NIKDY nepatří do
   * placeholderu — ten zmizí, jakmile uživatel začne psát.
   */
  affix?: ReactNode;
  /** Mono + `tabular-nums` pro kódy a čísla, která se čtou po sloupcích. */
  mono?: boolean;
  /**
   * Přeložené „— nepovinné“ vedle popisku.
   *
   * Jedna vlastnost místo dvojice `optional` + text schválně: `optional`
   * bez textu by byl stav, který nejde vykreslit, a Ingot ten text sám
   * nemá odkud vzít.
   */
  optionalLabel?: ReactNode;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** `data-testid` vstupu — testy sahají na to, co se ovládá. */
  testId?: string;
}): JSX.Element {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const affixId = `${id}-affix`;

  // Pořadí je pořadím čtení: nápověda, jednotka, teprve pak chyba.
  const describedBy = cx(
    hint != null && hintId,
    affix != null && affixId,
    error != null && errorId,
  );

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-medium text-ink-2">
        {label}
        {optionalLabel != null && (
          <span className="ml-1 font-normal text-ink-3">{optionalLabel}</span>
        )}
      </label>
      {/* The frame (radius, border, focus ring) comes from inputChrome, the
          same source as IngotSelect and IngotSearchInput, so a field next
          to a filter select has the same box. The frame is focus-within
          because the affix sits inside it. */}
      <div className={cx("flex items-center", inputFrameChrome({ error: error != null }))}>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(ev) => onChange(ev.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={error != null || undefined}
          aria-describedby={describedBy || undefined}
          className={cx(
            "w-full bg-transparent outline-none placeholder:text-ink-4 disabled:cursor-not-allowed disabled:text-ink-4",
            INPUT_PAD,
            mono && "font-mono tabular-nums",
          )}
          data-testid={testId}
        />
        {affix != null && (
          <span id={affixId} className="shrink-0 pr-3 text-xs text-ink-3">
            {affix}
          </span>
        )}
      </div>
      {hint != null && (
        <p id={hintId} className="text-xs text-ink-3">
          {hint}
        </p>
      )}
      {error != null && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
