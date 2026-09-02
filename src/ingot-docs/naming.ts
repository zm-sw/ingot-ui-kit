/**
 * Jak se primitivum jmenuje na stránce a jak v kódu.
 *
 * V kódu je jméno exportu (``IngotBadge``) a to se nemění — importuje se
 * pod ním, píše se v ukázkách a stojí v adrese stránky. Ale prefix,
 * který v kódu odlišuje kit od zbytku aplikace, je v seznamu dvaceti
 * položek pod sebou jen šum: čtenář ho přečte dvacetkrát a rozlišuje ho
 * až to, co za ním následuje.
 *
 * Na stránce se proto ukazuje jméno bez něj — ``Badge``, ``Table``,
 * ``TopNav``. Je to čistě zobrazení: routa i každý výpis kódu zůstávají
 * na plném jméně, takže se podle stránky dá pořád rovnou importovat.
 *
 * 🪤 Prefix se ODŘEZÁVÁ, nedopočítává. ``Button`` a ``Card`` ho nikdy
 * neměly, takže projdou beze změny — a kdyby někdy vzniklo primitivum
 * jménem ``Ingots…``, hranice slova ho ochrání před uříznutím na půl.
 */

/** ``IngotBadge`` → ``Badge``; ``Button`` → ``Button``. */
export function displayName(name: string): string {
  const stripped = name.replace(/^Ingot(?=[A-Z])/, "");
  // Pojistka pro hypotetický export jménem přesně "Ingot": prázdný
  // popisek v menu je horší než prefix.
  return stripped || name;
}
