import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotUserMenuDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotUserMenuDemo?raw");

export const IngotUserMenuDoc: IngotDocMeta = {
  name: "IngotUserMenu",
  status: "beta",
  version: "1.0",
  tag: ".usermenu",
  tokens: ["--surface", "--border", "--ink", "--ink-2", "--r-lg", "--shadow-lg"],
  classNameNote: {
    cs: "`className` nebere. Vypadá stejně na každé obrazovce; rozvržení patří obalu kolem něj.",
    en: "Does not take `className`. It looks the same on every screen; layout belongs to the wrapper around it.",
  },
  summary: {
    cs: "Menu účtu — identita, organizace, předvolby, odhlášení. Primitivum drží strukturu, ne obsah: vrstvy oddělené linkou a řádek „popisek vlevo, ovládací prvek vpravo“.",
    en: "The account menu — identity, organisation, preferences, sign-out. The primitive holds the structure, not the content: layers separated by a rule, and a row of “label on the left, control on the right”.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Menu pod účtem v horní liště. Vrstva identity nahoře, organizace, předvolby a
        odhlášení dole — vždy v tomhle pořadí.
      </>,
      <>
        Předvolby, které patří člověku, ne obrazovce: motiv vzhledu, jazyk, slovník,
        nápověda na stránkách.
      </>,
      <>
        Přepnutí do organizace, pod kterou je člověk přihlášený. Je to odkaz na jiné
        místo produktu, ne volba nastavení.
      </>,
      <>
        Odhlášení. Patří do poslední vrstvy, oddělené linkou od všeho, co se jen
        přepíná.
      </>,
    ],
    en: [
      <>
        The menu under the account in the top bar. The identity layer on top, then the
        organisation, the preferences and sign-out at the bottom — always in that order.
      </>,
      <>
        Preferences that belong to the person, not to a screen: appearance theme,
        language, vocabulary, in-page help.
      </>,
      <>
        Switching into the organisation the person is signed in under. It is a link to
        another place in the product, not a settings choice.
      </>,
      <>
        Signing out. It belongs in the last layer, separated by a rule from everything
        that is merely toggled.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotUserMenuDoc.body"),
};
