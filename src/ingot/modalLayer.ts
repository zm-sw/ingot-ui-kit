import { useState } from "react";

/**
 * Vrstva dialogu — kdo se otevřel později, je nahoře (KAN-641).
 *
 * 🚨 **Pevný ``z-50`` na všech dialozích nestačí.** Při shodném
 * ``z-index`` rozhoduje pořadí v DOM, a to nekopíruje pořadí otevírání:
 *
 * * ``IngotModal`` se portáluje do ``document.body``, tedy až za celý
 *   strom stránky;
 * * dialogy, které si overlay pořád kreslí samy, zůstávají tam, kde je
 *   vyrenderuje stránka — tedy PŘED portály.
 *
 * Dialog otevřený tlačítkem UVNITŘ portálovaného modalu, ale
 * renderovaný ze stránky, proto skončil pod ním. Vlastník to popsal
 * přesně: „otevře se pod aktuálně otevřeným modálem, takže jej nevidím;
 * jediná cesta, jak se k němu dostanu, je zavřít ostatní."
 *
 * Vrstva se přiděluje **při mountu** a je monotónní, takže poslední
 * otevřený dialog leží nad vším, co bylo otevřené dřív — bez ohledu na
 * to, kde ve stromu bydlí a jestli se portáluje.
 *
 * ## Proč se čítač nevrací na začátek
 *
 * Nulovat ho, až se zavře poslední dialog, by znamenalo držet dva
 * čítače v souběhu (tenhle a zámek scrollu v ``IngotModal``) a
 * spoléhat, že se nikdy nerozejdou. ``z-index`` žádný praktický strop
 * nemá; {@link MAX_MODAL_LAYER} je pojistka proti utržení, ne rozpočet.
 */

/** Nejnižší vrstva dialogu — nad lepivými hlavičkami a nabídkami. */
export const BASE_MODAL_LAYER = 50;

/**
 * Strop, za který vrstva nevyleze.
 *
 * Relace, která otevře a zavře dialog dvě stě tisíckrát, je spíš
 * smyčka v kódu než práce člověka; strop je tam pro ni, aby se
 * ``z-index`` nedostal do řádů, kde už ho prohlížeče ignorují.
 */
export const MAX_MODAL_LAYER = 200_000;

/**
 * Vrstva rozbalovacích nabídek — nad VŠEMI dialogy.
 *
 * 🚨 Nabídka není dialog a nesmí se s nimi řadit. Visí na tlačítku, se
 * kterým operátor právě pracuje, takže patří nad cokoli otevřeného —
 * jinak se rozbalí POD modalem, ze kterého ji otevřel, a její položky
 * nejsou vidět. Přesně to se stalo, když dialogy dostaly vrstvy podle
 * pořadí otevření a nabídka zůstala na pevném ``z-50``.
 *
 * Není to závod o nejvyšší číslo: nabídka je krátkodobá, zavírá se při
 * scrollu, změně velikosti i kliknutí mimo, takže nemá jak přežít
 * otevření dalšího dialogu.
 */
export const MENU_LAYER = MAX_MODAL_LAYER + 1;

let nextLayer = BASE_MODAL_LAYER;

/**
 * Vrstva pro dialog, který se právě otevírá.
 *
 * Drží se ve stavu, takže se při překreslení nemění — dialog, který by
 * si vrstvu bral znovu při každém renderu, by přeskakoval nad své
 * vlastní potomky.
 */
export function useModalLayer(): number {
  const [layer] = useState(() => {
    nextLayer = Math.min(nextLayer + 1, MAX_MODAL_LAYER);
    return nextLayer;
  });
  return layer;
}
