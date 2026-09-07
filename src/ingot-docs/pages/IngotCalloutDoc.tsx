import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotCalloutDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotCalloutDemo?raw");

export const IngotCalloutDoc: IngotDocMeta = {
  name: "IngotCallout",
  status: "beta",
  // 2.0 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: a tone was renamed: `info` is now `accent`.
  version: "2.0",
  tag: ".callout",
  tokens: [
    "--accent",
    "--accent-bg",
    "--accent-border",
    "--ok",
    "--ok-bg",
    "--ok-border",
    "--warn",
    "--warn-bg",
    "--warn-border",
    "--danger",
    "--danger-bg",
    "--danger-border",
    "--ink",
    "--ink-2",
    "--r-lg",
  ],
  classNameNote: {
    cs: "`className` nebere. Tón určuje plochu, rám i ikonu; kdyby šly přepsat zvenčí, varování by v jedné aplikaci vypadalo třemi způsoby — přesně to, co tohle primitivum ruší.",
    en: "Does not take `className`. The tone decides the surface, the border and the icon; if they could be overridden from outside, one warning would look three ways in one application — exactly what this primitive exists to end.",
  },
  summary: {
    cs: "Podbarvený blok s poznámkou, varováním nebo důsledkem u obsahu, ke kterému patří. Tón určuje i to, jestli ho odečítač ohlásí.",
    en: "A tinted block with a note, a warning or a consequence, next to the content it belongs to. The tone also decides whether a screen reader announces it.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        K sekci patří dvě tři věty, které mění, jak se má číst — od kdy platí ceník, co
        se stane při uložení.
      </>,
      <>Je potřeba varovat před důsledkem akce dřív, než na ni uživatel sáhne.</>,
      <>Výsledek dlouhé operace má zůstat na stránce, ne zmizet jako toast.</>,
    ],
    en: [
      <>
        A section needs two or three sentences that change how it should be read — when
        a price list starts, what saving will do.
      </>,
      <>A consequence has to be flagged before the user reaches for the action.</>,
      <>
        The result of a long operation should stay on the page rather than vanish like a
        toast.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotCalloutDoc.body"),
};
