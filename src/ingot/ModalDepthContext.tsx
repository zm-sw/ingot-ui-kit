import { createContext, useContext, useMemo, type ReactNode } from "react";

/**
 * KAN-109 — jak hluboko v modalech se právě renderuje.
 *
 * Rozhodnutí vlastníka z 2026-08-10 znělo: **T2 afordance nikdy uvnitř
 * modalu** (navigace pryč modal odmountuje a zahodí rozepsaný formulář)
 * a **quick-create se smí stackovat nejvýš o jednu úroveň**. Do KAN-109
 * to drželo jen prózou v komentáři `QuickManageLink.tsx` — „the caller
 * guarantees placement". Komentář ale nic negarantuje: nový volající
 * ho nepřečte a afordance se objeví v modalu, kde nemá co dělat.
 *
 * Kontext to překlápí do kódu. Bez providera je hloubka 0, takže
 * stránky mimo modal se nemění a komponenta, která provider zapomene
 * obalit, se chová jako dosud — tedy fail-open směrem k dnešnímu
 * stavu, ne k novému omezení.
 *
 * ⚠️ **Modal postavený na ``IngotModal`` provider NEPOTŘEBUJE** — shell
 * ho má uvnitř (KAN-580). Ruční obalení zůstává povinné jen u modalů, které
 * si overlay pořád dělají samy; po sweepu zbylých ad-hoc dialogů odpadne
 * úplně.
 *
 * 🕰️ Do KAN-580 tady stálo, že „tohle nejde zapojit centrálně", protože
 * modaly nebyly jedna sdílená komponenta. Byla to pravda a byla to cena:
 * pravidlo vlastníka z 2026-08-10 se muselo odbavit fail-open kontextem,
 * který si každý modal obaluje ručně. Chybějící skořápka takhle jednou
 * zablokovala centrální opravu — proto ``IngotModal`` vznikl.
 */
const ModalDepthContext = createContext<number>(0);

/**
 * Nejhlubší modal, ze kterého se ještě smí nabídnout T1 „+ Přidat…".
 *
 * ``1`` = ze stránky (0) i z prvního modalu (1) ano, z modalu nad
 * modalem (2) už ne. Rozhodnutí vlastníka z 2026-08-10 znělo
 * „stacking max 1 úroveň", tedy JEDNA vrstva navíc nad tím, co je
 * zrovna otevřené.
 *
 * ⚠️ Ta věta jde číst i přísněji — „quick-create jen ze stránky".
 * Tady je schválně ta volnější: přísnější čtení by vyplo
 * ``+ Přidat kategorii…`` uvnitř modalu zakládání položky, což je
 * odbavená a nasazená featura (KAN-68 / #3188). Vypnout ji jako
 * vedlejší efekt zavádění konstanty by byla regrese schovaná
 * v refaktoru; jestli to vlastník myslel přísněji, je to vlastní
 * rozhodnutí a vlastní změna. Viz KAN-109.
 */
export const MAX_QUICK_CREATE_DEPTH = 1;

/** Obal kolem obsahu modalu — zvyšuje hloubku o jedna. */
export function ModalDepthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const depth = useContext(ModalDepthContext);
  const next = useMemo(() => depth + 1, [depth]);
  return (
    <ModalDepthContext.Provider value={next}>
      {children}
    </ModalDepthContext.Provider>
  );
}

/** Aktuální hloubka; 0 = nejsme v modalu. */
export function useModalDepth(): number {
  return useContext(ModalDepthContext);
}

/**
 * Smí se na téhle hloubce nabídnout T1 „+ Přidat…"?
 *
 * Volá se z komponent, které sentinel renderují — ne z těch, které ho
 * jen konzumují.
 */
export function useCanQuickCreate(): boolean {
  return useModalDepth() <= MAX_QUICK_CREATE_DEPTH;
}
