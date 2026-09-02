import { type JSX, type ReactNode } from "react";

/**
 * Menu účtu — identita, organizace, předvolby, odhlášení.
 *
 * Primitivum drží **strukturu, ne obsah**: vrstvy oddělené linkou a
 * řádek „popisek vlevo, ovládací prvek vpravo". Které předvolby v něm
 * jsou, ví aplikace, ne kit — jinak by kit musel znát motiv, jazyk
 * i slovník, a každá nová volba by byla změna kitu.
 *
 * 🪤 **Předvolba se ukládá na účet, ne do prohlížeče.** Motiv, jazyk
 * i slovník sledují člověka na druhý počítač; volba uložená jen lokálně
 * vypadá, že funguje, dokud si ji někdo nezmění a nezjistí, že se
 * nepřenesla. (Dokumentace přihlášení nemá, takže tam je prohlížeč
 * jediná možnost — a je to výjimka, ne vzor.)
 *
 * 🚨 **Vypnutá nápověda nesmí změnit rozvržení stránky.** Přepínač
 * nápovědy schovává ``IngotPageHint``, a když se stránka pod ním
 * přeskládá, přijde uživatel o místo, kam se díval. Skrývá se
 * viditelnost, ne prostor.
 *
 * Ingot **nemá vlastní i18n namespace** — texty dodává volající.
 */

export function IngotUserMenu({
  children,
  label,
  testId,
}: {
  /** Vrstvy menu — typicky ``IngotUserMenuSection``. */
  children: ReactNode;
  /** Přeložený ``aria-label`` menu. */
  label: string;
  testId?: string;
}): JSX.Element {
  return (
    <div
      role="group"
      aria-label={label}
      className="w-80 overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
      data-testid={testId}
    >
      {children}
    </div>
  );
}

/** Jedna vrstva menu. Linku mezi vrstvami kreslí poslední pravidlo. */
export function IngotUserMenuSection({
  children,
  testId,
}: {
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="border-b border-border px-4 py-3 last:border-b-0"
      data-testid={testId}
    >
      {children}
    </div>
  );
}

/**
 * Řádek předvolby: popisek vlevo, ovládací prvek vpravo.
 *
 * Popisek je ``<label>`` jen tehdy, když ovládací prvek dostane ``htmlFor``
 * — jinak by menu slibovalo vazbu, kterou nemá. Volající proto předává
 * ``controlId`` u prvků, které id mají.
 */
export function IngotUserMenuRow({
  label,
  controlId,
  children,
  testId,
}: {
  label: ReactNode;
  /** ``id`` ovládacího prvku vpravo, pokud nějaké má. */
  controlId?: string;
  children: ReactNode;
  testId?: string;
}): JSX.Element {
  return (
    <div
      className="flex items-center justify-between gap-3 py-1.5 text-sm text-ink-2"
      data-testid={testId}
    >
      {controlId ? <label htmlFor={controlId}>{label}</label> : <span>{label}</span>}
      {children}
    </div>
  );
}
