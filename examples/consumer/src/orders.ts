import type { IngotTone } from "@forgmatic/ingot";

/**
 * The data both reference screens stand on.
 *
 * Deliberately hard-coded and deliberately wide: nine columns, because a
 * table narrower than a phone proves nothing about a table.
 */
export interface Order {
  id: string;
  customer: string;
  product: string;
  state: string;
  tone: Extract<IngotTone, "neutral" | "accent" | "warn" | "danger">;
  due: string;
  pieces: number;
  price: number;
  operator: string;
  operatorInitials: string;
  site: string;
  note: string;
}

export const ORDERS: readonly Order[] = [
  {
    id: "2411-018",
    customer: "Kovosvit Sezimovo Ústí",
    product: "Příruba DN80",
    state: "Ve výrobě",
    tone: "accent",
    due: "12. 9. 2026",
    pieces: 240,
    price: 486000,
    operator: "Jan Marek",
    operatorInitials: "JM",
    site: "Hala B",
    note: "Materiál dorazil o dva dny dřív, výroba běží podle plánu.",
  },
  {
    id: "2411-019",
    customer: "Strojírny Poldi",
    product: "Konzole svařovaná",
    state: "Čeká na materiál",
    tone: "warn",
    due: "18. 9. 2026",
    pieces: 60,
    price: 124000,
    operator: "Petr Doležal",
    operatorInitials: "PD",
    site: "Hala A",
    note: "Dodavatel plechu potvrdil termín na příští týden.",
  },
  {
    id: "2411-021",
    customer: "TS Plzeň",
    product: "Hřídel kalená",
    state: "Po termínu",
    tone: "danger",
    due: "2. 9. 2026",
    pieces: 1200,
    price: 912000,
    operator: "Marie Krátká",
    operatorInitials: "MK",
    site: "Hala B",
    note: "Kalírna vrátila první sérii, běží přeměření.",
  },
  {
    id: "2411-024",
    customer: "Kovo Sedlčany",
    product: "Držák převodovky",
    state: "Hotovo",
    tone: "neutral",
    due: "28. 8. 2026",
    pieces: 15,
    price: 38500,
    operator: "Jan Marek",
    operatorInitials: "JM",
    site: "Hala A",
    note: "Předáno na expedici, čeká na odvoz.",
  },
];
