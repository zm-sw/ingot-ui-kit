import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotSkeletonDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotSkeletonDemo?raw");

export const IngotSkeletonDoc: IngotDocMeta = {
  name: "IngotSkeleton",
  status: "beta",
  version: "1.0",
  tag: ".skeleton",
  tokens: ["--surface", "--surface-2", "--surface-3", "--border", "--r-sm", "--r-md"],
  classNameNote: {
    cs: "Bere `className`, ale jen na umístění a šířku bloku. Barvy ani rytmus pulzu ne — kostra, která na každé obrazovce bliká jinak, přestane být poznávacím znamením načítání.",
    en: "Takes `className`, but only for the block's placement and width. Not the colours or the rhythm of the pulse — a skeleton that blinks differently on every screen stops being recognisable as loading.",
  },
  summary: {
    cs: "Tvar toho, co se načítá, dokud se to načítá. Drží místo, takže po dojití dat nic neposkočí.",
    en: "The shape of what is coming, while it is still coming. It holds the room, so nothing jumps when the data lands.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Víš, jaký tvar dorazí — odstavec, karty, tabulka, řada metrik. Kostra to řekne a
        zabere přesně to místo, které obsah vezme.
      </>,
      <>
        Načítání trvá déle než okamžik. Prázdná plocha se od rozbité obrazovky nepozná a
        skok obsahu čtenáře připraví o řádek, na který se díval.
      </>,
    ],
    en: [
      <>
        You know the shape that is coming — a paragraph, cards, a table, a row of
        metrics. The skeleton says so and takes exactly the room the content will.
      </>,
      <>
        The wait is longer than an instant. A blank area is indistinguishable from a
        broken screen, and the jump costs the reader the line they were looking at.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotSkeletonDoc.body"),
};
