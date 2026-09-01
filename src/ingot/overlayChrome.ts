import { useEffect, useRef, type RefObject } from "react";

/**
 * Společná overlay logika dialogových primitiv (KAN-655).
 *
 * Vzniklo vytažením z ``IngotModal.tsx``, když přibyl ``IngotDrawer`` a
 * a11y laťka (rozhodnutí vlastníka 2026-08-25) začala platit pro dva
 * překryvy najednou. Zámek scrollu je tu proto MODUL, ne stav komponenty:
 * drawer otevřený nad modalem (nebo obráceně) nesmí při svém zavření
 * odemknout scroll, pod kterým pořád stojí ten druhý překryv.
 *
 * 🚨 **Interní modul, ne veřejné API.** Nic odsud nevede přes
 * ``src/ingot/index.ts`` ven — konzument kitu skládá dialogy z
 * ``IngotModal``/``IngotDrawer``, ne z jejich vnitřností. Hranici hlídá
 * guard ``ingot-public-api`` (v monorepu); tady platí stejné pravidlo.
 */

/** Co smí dostat fokus. `tabindex="-1"` je programový cíl, ne zastávka Tabu. */
export const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Kolik překryvů je právě otevřených a jaký byl `overflow` před prvním z
 * nich. Původní hodnota se schovává při přechodu 0 → 1, aby ji druhý
 * překryv nepřepsal už uzamčeným `"hidden"`.
 */
let openDialogs = 0;
let bodyOverflowBeforeLock = "";

/** Zamkne scroll pozadí po dobu života překryvu; čítač sdílí všechny. */
export function useOverlayScrollLock(): void {
  useEffect(() => {
    if (openDialogs === 0) {
      bodyOverflowBeforeLock = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    openDialogs += 1;
    return () => {
      openDialogs -= 1;
      if (openDialogs === 0) {
        document.body.style.overflow = bodyOverflowBeforeLock;
      }
    };
  }, []);
}

/**
 * Přečte spouštěč při mountu a po unmountu na něj vrátí fokus. Bez toho
 * spadne fokus na <body> a čtečka i klávesnice začínají od začátku stránky.
 */
export function useOverlayFocusReturn(): void {
  const openerRef = useRef<Element | null>(null);
  if (openerRef.current === null && typeof document !== "undefined") {
    openerRef.current = document.activeElement;
  }

  useEffect(() => {
    const opener = openerRef.current;
    return () => {
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
}

/**
 * Fokus do překryvu hned po otevření. Když uvnitř nic fokusovatelného
 * není, vezme ho panel sám — má mít ``tabIndex={-1}``.
 */
export function useOverlayInitialFocus(
  panelRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel).focus();
    // panelRef je ref, ne hodnota — efekt má běžet jen při mountu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Focus trap na Tab i Shift+Tab uvnitř panelu. Volá se z ``onKeyDown``
 * overlaye; klávesy jiné než Tab nechává být (ESC si řeší volající, aby
 * dva otevřené překryvy nad sebou nezavřel jeden stisk).
 */
export function trapOverlayTab(
  event: React.KeyboardEvent<HTMLElement>,
  panel: HTMLElement | null,
): void {
  if (event.key !== "Tab" || !panel) return;
  const stops = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
  if (stops.length === 0) {
    // Není kam cyklit — Tab by fokus vynesl z překryvu ven.
    event.preventDefault();
    return;
  }
  const first = stops[0];
  const last = stops[stops.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === panel)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
