import {
  PROCESS_ICON_CATEGORIES,
  processIconInk,
  resolveProcessIcon,
  type ProcessIconVariant,
} from "./processIconLibrary";

/**
 * Ikonová vrstva kitu — sada výrobních operací (KAN-649).
 *
 * 🚨 **Geometrie tady NENÍ a nikdy nebude.** Bydlí v
 * ``processIconLibrary`` — 43 glyfů portovaných z téže
 * reference jako handoff — a tahle komponenta je jen obálka nad nimi.
 * Druhá kopie kreseb by se rozešla tiše: obě by se dál vykreslovaly a
 * lišily by se jen tvarem, kterého si nikdo nevšimne.
 *
 * 🔑 **Klíč je pro backend neprůhledný.** ``process_module_definitions
 * .icon_key`` ukládá token ``<klíč>`` / ``<klíč>:black`` /
 * ``<klíč>:white`` a jeho význam určuje ``parseProcessIconKey``, ne
 * tahle komponenta. Nepřekládej ho, nesestavuj z názvu operace a
 * nepřiřazuj automaticky — ikonu vybírá admin ručně a žádné párování
 * slug→ikona v repu není.
 *
 * ⛔ **Jméno konkrétní technologie sem nepiš** — ani do ukázky, ani do
 * příkladu. Platforma nesmí znát pojmy jedné domény
 * (``docs/GENERIC_PLATFORM.md``) a hlídá to hardcode ratchet. Potřebuješ
 * v ukázce doopravdy nějaké klíče? Vezmi si je z ``INGOT_OP_ICON_KEYS``,
 * které je vypisuje z knihovny za běhu.
 *
 * Pravidla použití (doc stránka je vypisuje celá):
 *
 * * ikona operace **nikdy nestojí bez názvu operace** — výjimkou je
 *   šířkově kritický řádek, kde musí nést ``title``;
 * * ikona a ``.opdot`` (tečka kategorie) se **nekombinují** — obojí
 *   říká totéž a vedle sebe si protiřečí;
 * * nová technologie = nová ikona v knihovně, **nikdy emoji**.
 */
export interface IngotOpIconProps {
  /**
   * Uložený ``icon_key``. ``null``/neznámý token vykreslí ``null``,
   * aby volající mohl spadnout na svůj vlastní náhradní glyf.
   */
  token: string | null | undefined;
  /** Hrana čtverce v px; sada operací se sází 18–22. */
  size?: number;
  /**
   * ``operation_category_color`` procesu, ke kterému ikona patří.
   * Uplatní se jen u varianty ``category`` — u ``:black``/``:white``
   * si barvu nese token sám.
   */
  categoryColor?: string | null;
  /**
   * Název operace pro odečítač. Vyplň JEN v šířkově kritickém řádku,
   * kde ikona stojí bez svého popisku; jinde ji nech dekorativní, ať
   * čtečka nečte název dvakrát.
   */
  title?: string;
  className?: string;
  testId?: string;
}

/**
 * Klíče, které knihovna operací zná — vyčtené z ní za běhu, ne opsané.
 *
 * Je to jediný způsob, jak ukázat skutečné ikony (doc web, picker),
 * aniž by se do zdrojáku napsalo jméno konkrétní technologie. Ten zákaz
 * není kosmetika: platforma nesmí znát pojmy jedné domény
 * (``docs/GENERIC_PLATFORM.md``) a hardcode ratchet ho vynucuje.
 */
export const INGOT_OP_ICON_KEYS: readonly string[] = PROCESS_ICON_CATEGORIES
  .flatMap((category) => category.items.map((item) => item.key))
  .sort();

/** Varianta inkoustu vyčtená z tokenu — pro volající, kteří potřebují
 *  vědět, jestli si ikona barvu určuje sama. */
export type IngotOpIconVariant = ProcessIconVariant;

export function IngotOpIcon({
  token,
  size = 20,
  categoryColor,
  title,
  className = "",
  testId,
}: IngotOpIconProps): JSX.Element | null {
  const resolved = resolveProcessIcon(token);
  if (resolved === null) {
    if (import.meta.env.DEV && token) {
      console.warn(`[IngotOpIcon] neznámý icon_key: "${token}"`);
    }
    return null;
  }
  const labelled = title !== undefined && title !== "";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className}`.trim()}
      style={{
        width: size,
        height: size,
        color: processIconInk(resolved.variant, categoryColor),
      }}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      data-testid={testId}
    >
      {resolved.icon}
    </span>
  );
}
