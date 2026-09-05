import { useEffect, useRef, type JSX, type ReactNode } from "react";

import { IconButton } from "./IconButton";
import { IngotIcon } from "./IngotIcon";

/**
 * Nápověda stránky se žárovkou (KAN-659) — spec PageHint v1.1,
 * ingot.css sekce 12 (v tomhle repu žije ta sekce v ``tokens.css``,
 * jediném stylesheetu, který balíček exportuje).
 *
 * Informační pruh nad obsahem. Klik na žárovku na ~2,4 s zvýrazní
 * prvky, kterých se nápověda týká, outlinem v barvě akcentu, pak
 * plynule zmizí. NENÍ to toggle — jednorázová akce: cílům se přidá
 * třída ``.is-hinted`` a po 2400 ms se zase odebere. Keyframes i
 * ``prefers-reduced-motion`` větev (probliknutí vypnuté, rámeček
 * zůstane) drží CSS, ne tenhle soubor.
 *
 * **Komponenta se o své viditelnosti nerozhoduje sama.** ``visible``
 * řídí přepínač „Nápověda na stránkách" v menu účtu volajícího
 * (preference ``hintsVisible`` na účtu) a ``onDismiss`` ukládá
 * skrytí per uživatel a stránka TAKÉ na účet — ne do localStorage;
 * preference žijí na účtu (pravidlo z handoffu). Kit backend nemá,
 * takže obojí je kontrakt s volajícím, ne vnitřní stav.
 *
 * ``level`` se řídí slovníkem uživatele (Jednoduše/Expert). Dokud
 * slovník neexistuje, prop funguje (propíše se do
 * ``data-hint-level``), ale všechny uživatele ber jako ``both`` —
 * filtrovat podle úrovně je věc volajícího, až bude mít podle čeho.
 *
 * This is the kit's only page-level help. Earlier help mechanisms of the
 * product (a help dock, deep-link highlights) are not part of the kit; the
 * `.is-hinted` idiom in `tokens.css` is the one highlight the kit ships.
 *
 * A11y: žárovka je obyčejné tlačítko s popisným ``aria-label``
 * (jednorázová akce, ne přepínač). Pruh patří v pořadí čtení PŘED
 * obsah — to je věc umístění u volajícího. Vypnutá nápověda
 * (``visible={false}``) vrací ``null``, takže nemění rozvržení ani
 * pořadí fokusu.
 */

export type IngotPageHintLevel = "simple" | "expert" | "both";

/** Délka zvýraznění cílů v ms — musí sedět s keyframes v CSS. */
export const INGOT_HINT_DURATION_MS = 2400;

const HINT_CLASS = "is-hinted";

export function IngotPageHint({
  title,
  children,
  targets = [],
  level = "both",
  dismissible = false,
  onDismiss,
  visible = true,
  bulbLabel = "Zvýraznit, čeho se nápověda týká",
  dismissLabel = "Skrýt nápovědu na této stránce",
  testId,
}: {
  /** Název obrazovky nebo úkolu, o kterém pruh mluví — ne „Nápověda". */
  title: string;
  /** 2–3 věty v druhé osobě: co tady uživatel udělá a čím. */
  children: ReactNode;
  /**
   * Selektory prvků, kterých se nápověda týká — typicky
   * ``[data-hint-target="…"]``. Bez cílů se žárovka kreslí jen jako
   * dekorace: tlačítko, které nemá co zvýraznit, by lhalo.
   */
  targets?: readonly string[];
  /**
   * Komu je nápověda určená podle slovníku uživatele. Propíše se do
   * ``data-hint-level``; filtrování je věc volajícího.
   */
  level?: IngotPageHintLevel;
  /** Ukáže křížek. Skrytí per uživatel a stránka ukládá volající na účet. */
  dismissible?: boolean;
  /** Klik na křížek. Perzistence patří na účet, ne do localStorage. */
  onDismiss?: () => void;
  /**
   * Řízená viditelnost — přepínač „Nápověda na stránkách" v menu účtu
   * volajícího. ``false`` nekreslí nic, layout se nezmění.
   */
  visible?: boolean;
  /** Přeložený popisek žárovky — Ingot překlady nemá. */
  bulbLabel?: string;
  /** Přeložený popisek křížku. */
  dismissLabel?: string;
  /** `data-testid` pruhu; žárovka dostane `${testId}-bulb`, křížek `${testId}-dismiss`. */
  testId?: string;
}): JSX.Element | null {
  const timerRef = useRef<number>();
  const litRef = useRef<Element[]>([]);

  const unlight = () => {
    window.clearTimeout(timerRef.current);
    for (const el of litRef.current) el.classList.remove(HINT_CLASS);
    litRef.current = [];
  };

  // Odchod ze stránky uprostřed cyklu nesmí nechat cíle svítit —
  // třída žije na CIZÍCH prvcích, React ji za nás neuklidí.
  useEffect(() => unlight, []);

  if (!visible) return null;

  const flash = () => {
    unlight();
    const found: Element[] = [];
    for (const selector of targets) {
      try {
        found.push(...document.querySelectorAll(selector));
      } catch {
        // Rozbitý selektor nesmí shodit celou dávku — cíle umí
        // přitéct i z dat a jeden překlep by zhasl všechny ostatní.
      }
    }
    for (const el of found) {
      // Opakovaný klik uprostřed cyklu: bez reflow mezi remove a add
      // by prohlížeč třídu považoval za nezměněnou a animace by se
      // nerestartovala.
      void (el as HTMLElement).offsetWidth;
      el.classList.add(HINT_CLASS);
    }
    litRef.current = found;
    timerRef.current = window.setTimeout(unlight, INGOT_HINT_DURATION_MS);
  };

  const bulb = <IngotIcon name="bulb" size={18} />;

  return (
    <div
      role="note"
      data-hint-level={level}
      className="flex items-start gap-3 rounded-lg border border-accent-border bg-accent-bg px-4 py-3 text-sm"
      data-testid={testId}
    >
      {targets.length > 0 ? (
        <IconButton
          label={bulbLabel}
          tone="accent"
          onClick={flash}
          className="-my-1 -ml-1.5"
          data-testid={testId ? `${testId}-bulb` : undefined}
        >
          {bulb}
        </IconButton>
      ) : (
        <span className="mt-0.5 shrink-0 text-accent">{bulb}</span>
      )}
      <div className="min-w-0">
        <strong className="font-semibold text-ink">{title}</strong>{" "}
        <span className="text-ink-2">{children}</span>
      </div>
      {dismissible && (
        <IconButton
          label={dismissLabel}
          onClick={onDismiss}
          className="-my-1 -mr-1.5 ml-auto"
          data-testid={testId ? `${testId}-dismiss` : undefined}
        >
          <IngotIcon name="close" size={14} />
        </IconButton>
      )}
    </div>
  );
}
