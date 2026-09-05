import { createContext, useContext, useMemo, type ReactNode } from "react";

/**
 * How deep in modals the current render is.
 *
 * The owner's decision of 2026-08-10: **a "manage" affordance that
 * navigates away never appears inside a modal** (navigating unmounts the
 * modal and discards the half-written form) and **quick-create may stack
 * at most one level**. A comment saying "the caller guarantees placement"
 * guarantees nothing: a new caller does not read it and the affordance
 * shows up in a modal where it has no business.
 *
 * The context turns the rule into code. Without a provider the depth is
 * 0, so pages outside a modal are unchanged and a component that forgets
 * the provider behaves as before — fail-open towards today's behaviour,
 * not towards a new restriction.
 *
 * A modal built on `IngotModal` does NOT need the provider — the shell has
 * it inside. Manual wrapping remains only for dialogs that still draw
 * their own overlay.
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
