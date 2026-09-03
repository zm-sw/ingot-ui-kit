import { type JSX, type Ref } from "react";

import { cx } from "./cx";
import { IngotIcon } from "./IngotIcon";

/**
 * Hledací pole nad seznamem — první prvek filtr baru (``IngotToolbar``).
 *
 * Filtruje, nevyhledává: zužuje seznam, na kterém stojí, a proto nemá
 * tlačítko „Hledat“ ani vlastní obrazovku výsledků. Změna se hlásí
 * každým úhozem; kdo potřebuje debounce, drží si ho u dat, ne v poli —
 * pole nemá jak vědět, jestli za dotazem stojí síťový požadavek.
 *
 * Lupa je dekorace (``aria-hidden``): jméno pole nese ``label``.
 * ``type="search"`` dává prohlížečové vymazání křížkem zadarmo.
 *
 * Ingot **nemá vlastní i18n namespace** — texty dodává volající.
 *
 * 🪤 ``inputRef`` míří na ten ``<input>`` schválně, a ne na obal: obrazovka
 * s klávesovou zkratkou „skoč do hledání“ na pole jinak nedosáhne a sáhne
 * si do vnitřku primitiva (``wrap.querySelector("input")``). Takové
 * sáhnutí přejmenování elementu uvnitř kitu tiše rozbije a žádný test kitu
 * to nechytí — proto je cesta ven součástí API, ne náhoda.
 */
export function IngotSearchInput({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  inputRef,
  className,
  testId,
}: {
  value: string;
  onChange: (next: string) => void;
  /** Přeložený ``aria-label`` — placeholder jméno nenahradí, po vyplnění zmizí. */
  label: string;
  /** Přeložený placeholder. Nápověda formátu, ne jméno pole. */
  placeholder?: string;
  disabled?: boolean;
  /**
   * Ref na samotné pole — pro klávesovou zkratku, která do hledání skáče.
   * Ne na „fokus po mountu“; ten patří prohlížeči přes ``autoFocus``.
   */
  inputRef?: Ref<HTMLInputElement>;
  /** Průchozí třída — šířku určuje obrazovka, vzhled primitivum. */
  className?: string;
  testId?: string;
}): JSX.Element {
  return (
    <span className={cx("relative inline-flex items-center", className)}>
      <IngotIcon
        name="search"
        size={15}
        className="pointer-events-none absolute left-2.5 text-ink-4"
        aria-hidden
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        placeholder={placeholder}
        disabled={disabled}
        className={cx(
          "w-full rounded-md border border-border-strong bg-surface py-2 pl-8 pr-3 text-sm text-ink shadow-sm",
          "placeholder:text-ink-4 focus:border-ink focus:outline-none",
          "disabled:cursor-not-allowed disabled:text-ink-4",
        )}
        data-testid={testId}
      />
    </span>
  );
}
