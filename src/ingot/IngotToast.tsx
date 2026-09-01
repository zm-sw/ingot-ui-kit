import { useEffect, useSyncExternalStore, type JSX } from "react";
import { createPortal } from "react-dom";

import { MENU_LAYER } from "./modalLayer";

/**
 * Imperativní toast (KAN-656) — spec Toast v1.0, ingot.css sekce 10.
 *
 * Potvrzení výsledku akce, které nezastaví práci. Dělba překryvů:
 * editace → Drawer, potvrzení → Modal, **výsledek → Toast**. Výsledek
 * uložení je toast se zpětnou akcí, ne modal „Hotovo".
 *
 * ## Proč imperativní API, ne JSX
 *
 * Výsledek akce hlásí kód, který akci provedl — mutace, handler, effect.
 * Deklarativní ``<Toast open={…}>`` by každého volajícího nutil držet
 * stav „toast je vidět" a časovač po svém; přesně ta duplicita, kvůli
 * které primitivum vzniká. Volá se ``toast({ text, undo })``, zobrazení
 * obstará JEDNOU namountovaný ``<IngotToast />``.
 *
 * ## Sklad je modul, ne kontext
 *
 * Fronta toastů žije v modulu (``useSyncExternalStore``), ne v React
 * kontextu. ``toast()`` se tak dá volat odkudkoli — i mimo strom, kde
 * žádný provider není (doc web nemá admin provider stack). Cena: druhý
 * namountovaný ``<IngotToast />`` by tutéž frontu vykreslil dvakrát,
 * proto patří do aplikace právě jeden (v demu doc webu je lokální).
 *
 * ## Časování
 *
 * Výchozích 4 s; toast se zpětnou akcí žije 8 s — operátor musí stihnout
 * text přečíst, pochopit a kliknout. ``duration`` obojí přebíjí.
 *
 * ## A11y
 *
 * Region ``aria-live="polite"``; ``tone="danger"`` (chyba operace)
 * hlásí ``assertive``. Toast stojí vlevo dole, aby nepřekryl primární
 * akci stránky (ta bydlí vpravo nahoře v hlavičce). V dark motivu
 * dostává border — per-komponentní override z handoffu: inverzní plocha
 * toastu se jinak na tmavém pozadí ztratí.
 */

export interface IngotToastOptions {
  /** Jedna věta v minulém čase — „Objednávka uložena." */
  text: string;
  /**
   * ``danger`` = chyba operace („Uložení se nepovedlo."). NE validace
   * formuláře — ta patří k poli, ne do toastu.
   */
  tone?: "default" | "danger";
  /** Zpětná akce. Přidá tlačítko a prodlouží život toastu na 8 s. */
  undo?: () => void;
  /** Přeložený popisek zpětné akce — Ingot překlady nemá. Výchozí „Zpět". */
  undoLabel?: string;
  /** Jak dlouho toast žije v ms. Výchozí 4000; s ``undo`` 8000. */
  duration?: number;
}

interface ToastItem extends IngotToastOptions {
  id: number;
}

let nextId = 0;
let items: readonly ToastItem[] = [];
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): readonly ToastItem[] {
  return items;
}

function dismiss(id: number): void {
  items = items.filter((item) => item.id !== id);
  emit();
}

/** Ohlásí výsledek akce. Zobrazí ho jednou namountovaný ``<IngotToast />``. */
export function toast(options: IngotToastOptions): void {
  nextId += 1;
  items = [...items, { ...options, id: nextId }];
  emit();
}

function ToastCard({ item }: { item: ToastItem }): JSX.Element {
  const { id, text, tone = "default", undo, undoLabel = "Zpět" } = item;
  const duration = item.duration ?? (undo === undefined ? 4000 : 8000);

  useEffect(() => {
    const timer = setTimeout(() => dismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration]);

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm shadow-lg dark:border dark:border-border-strong ${
        tone === "danger" ? "bg-danger text-white dark:text-bg" : "bg-ink text-bg"
      }`}
      data-testid="ingot-toast"
      data-tone={tone}
    >
      <span>{text}</span>
      {undo !== undefined && (
        <button
          type="button"
          className="shrink-0 font-semibold underline underline-offset-2 hover:opacity-80"
          onClick={() => {
            undo();
            dismiss(id);
          }}
        >
          {undoLabel}
        </button>
      )}
    </div>
  );
}

export function IngotToast({
  testId,
}: {
  /** `data-testid` regionu s toasty. */
  testId?: string;
}): JSX.Element {
  const current = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const polite = current.filter((item) => item.tone !== "danger");
  const assertive = current.filter((item) => item.tone === "danger");

  // Portál do body ze stejného důvodu jako u dialogů: region renderovaný
  // inline by se pohřbil pod stacking kontexty stránky. Vrstva nad všemi
  // dialogy — výsledek akce má být vidět i nad otevřeným překryvem.
  return createPortal(
    <div
      className="pointer-events-none fixed bottom-4 left-4 flex max-w-sm flex-col gap-2"
      style={{ zIndex: MENU_LAYER + 1 }}
      data-testid={testId}
    >
      <div aria-live="polite" className="flex flex-col gap-2 empty:hidden">
        {polite.map((item) => (
          <ToastCard key={item.id} item={item} />
        ))}
      </div>
      <div aria-live="assertive" className="flex flex-col gap-2 empty:hidden">
        {assertive.map((item) => (
          <ToastCard key={item.id} item={item} />
        ))}
      </div>
    </div>,
    document.body,
  );
}
