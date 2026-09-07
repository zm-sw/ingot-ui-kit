import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/IngotBadgeDemo").then((module) => ({
    default: module.Demo,
  }));
const demoSource = () => import("@/ingot-docs/demos/IngotBadgeDemo?raw");

export const IngotBadgeDoc: IngotDocMeta = {
  name: "IngotBadge",
  status: "stable",
  // 1.1 (KAN-945) — the aside on what a badge is NOT said the kit had no
  // primitive for a count. It has one now, and the note names it.
  // 1.2 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  version: "1.2",
  tag: ".badge",
  tokens: [
    "--surface-2",
    "--border",
    "--ink",
    "--ink-2",
    "--accent-ink",
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
    "--font-mono",
    "--r-xs",
  ],
  classNameNote: {
    cs: "`className` nebere schválně: `bg-*` zvenčí by tiše přebilo tón a dvě různá sdělení by se kreslila stejně.",
    en: "Deliberately does not take `className`: a `bg-*` from outside would quietly override the tone and two different messages would look alike.",
  },
  summary: {
    cs: "Stavový štítek: stav entity jedním slovem, mono a verzálkami. Pojmenovává stav, ne akci.",
    en: "A status badge: the state of an entity in one word, mono and upper-case. It names a state, not an action.",
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Entita má stav, který se čte na první pohled — objednávka „ve výrobě“, poptávka
        „zamítnuto“, účet „archivováno“.
      </>,
      <>
        V řádku tabulky nebo v hlavičce detailu, kde by jinak vznikl další ručně
        obarvený <IngotCode>&lt;span&gt;</IngotCode>.
      </>,
      <>
        Stav právě běží a má to být vidět — <IngotCode>dot</IngotCode> přidá tečku. Je
        to dekorace navíc, význam pořád nese text.
      </>,
    ],
    en: [
      <>
        An entity has a state that is read at a glance — an order &quot;in
        production&quot;, a quote &quot;rejected&quot;, an account &quot;archived&quot;.
      </>,
      <>
        In a table row or a detail header, where another hand-coloured{" "}
        <IngotCode>&lt;span&gt;</IngotCode> would otherwise appear.
      </>,
      <>
        The state is live and that should show — <IngotCode>dot</IngotCode> adds a dot.
        It is decoration on top; the meaning still lives in the text.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/IngotBadgeDoc.body"),
};
