import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotRowActionsDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotRowActionsDemo?raw");

export const IngotRowActionsDoc: IngotDocMeta = {
  name: "IngotRowActions",
  status: "stable",
  // 1.1 — actions are the kit's shared icon button (accent focus ring).
  // 1.2 (KAN-847) — the label shows in IngotTooltip instead of the
  // title attribute, which a touch screen never shows and a screen reader
  // may skip.
  // 1.3 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.4 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  version: "1.5",
  tag: ".rowactions",
  tokens: [
    "--surface-2",
    "--ink",
    "--ink-3",
    "--danger",
    "--danger-bg",
    "--accent-bg",
    "--r-sm",
  ],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Akce jednoho řádku tabulky — ikonová tlačítka 28×28 px na konci řádku, bez rámečku a bez viditelného popisku.",
    en: "The actions of a single table row — 28×28 px icon buttons at the end of the row, with no frame and no visible label.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Poslední sloupec tabulky. Akce jsou <strong>vždy</strong> na konci řádku a v
        témže pořadí — kdo je jednou najde, hledá je na dalších stránkách na stejném
        místě.
      </>,
      <>
        Jedna až tři akce nad jedním záznamem — upravit, duplikovat, smazat. Víc než tři
        už patří do menu.
      </>,
      <>
        Hustota, kterou běžné tlačítko neumí a nemá umět: 28×28 px, bez rámečku, bez
        popisku. Tlačítko v hlavičce a tlačítko ve dvacátém řádku tabulky nejsou totéž,
        a proto je tohle vlastní primitivum.
      </>,
    ],
    en: [
      <>
        The last column of a table. The actions are <strong>always</strong> at the end
        of the row and always in the same order — whoever finds them once looks for them
        in the same place on every later page.
      </>,
      <>
        One to three actions on a single record — edit, duplicate, delete. More than
        three belong in a menu.
      </>,
      <>
        A density an ordinary button cannot and should not offer: 28×28 px, no frame, no
        label. A button in a header and a button in the twentieth row of a table are not
        the same thing, which is why this is its own primitive.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotRowActionsDoc.body"),
};
