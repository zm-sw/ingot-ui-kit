import { IngotCode } from "@/ingot";
import type { IngotDocMeta } from "@/ingot-docs/types";

const demo = () =>
  import("@/ingot-docs/demos/ButtonDemo").then((module) => ({ default: module.Demo }));
const demoSource = () => import("@/ingot-docs/demos/ButtonDemo?raw");

export const ButtonDoc: IngotDocMeta = {
  name: "Button",
  status: "stable",
  // 1.3 (KAN-953) - the focus ring is drawn from the kit's own
  // tokens now, instead of being left to the browser.
  // 1.4 (KAN-962) - one vocabulary for `size` and `tone` across the
  // kit: the type narrows the shared one instead of repeating its members.
  // 1.5 (KAN-963) - --border-strong darkens to reach the 3:1 the
  // accessibility page promises for a control's outline.
  version: "1.5",
  tag: ".btn",
  tokens: [
    "--bg",
    "--surface",
    "--surface-2",
    "--border-strong",
    "--ink",
    "--ink-2",
    "--ink-4",
    "--accent",
    "--accent-ink",
    "--ok",
    "--danger",
    "--r-md",
  ],
  classNameNote: {
    cs: "Bere `className` (a další atributy tlačítka) na rozvržení — šířku a zarovnání. Vzhled určují `variant` a `size`.",
    en: "Takes `className` (and the other button attributes) for layout — width and alignment. `variant` and `size` decide the look.",
  },
  summary: {
    cs: 'Tlačítko se sedmi variantami, a s as="a" i odkaz, který tak vypadá. Varianta nese význam akce, ne barvu — a v tmavém režimu drží kontrast, který opsané třídy ztrácejí.',
    en: 'The button, in seven variants — and with as="a" a link that looks like one. A variant carries the meaning of the action, not a colour, and in dark mode it holds a contrast that copied classes lose.',
  },
  demo,
  demoSource,
  useWhen: {
    cs: [
      <>Cokoli, co uživatel odklikne. Tohle je jediné tlačítko v aplikaci.</>,
      <>
        Hlavní akce obrazovky — <IngotCode>variant=&quot;primary&quot;</IngotCode>,
        vpravo v hlavičce, a právě jedna. Druhá primární akce vedle první znamená, že
        ani jedna není hlavní.
      </>,
      <>
        Akce běží a je potřeba to ukázat — <IngotCode>loading</IngotCode> zamkne
        tlačítko, nasadí <IngotCode>aria-busy</IngotCode> a překryje popisek spinnerem,
        aniž by se tlačítko zúžilo.
      </>,
      <>
        Ikona v řádku tabulky, kde na popisek není místo —{" "}
        <IngotCode>iconOnly</IngotCode> plus <IngotCode>aria-label</IngotCode>.
      </>,
      <>
        Akce je nevratná: <IngotCode>variant=&quot;danger&quot;</IngotCode>. Význam nese
        varianta, ne barva, kterou si vybereš.
      </>,
      <>
        Akce naviguje, nespouští (registrace, kontakt, dokumentace) —{" "}
        <IngotCode>as=&quot;a&quot;</IngotCode> s <IngotCode>href</IngotCode>. Vykreslí
        se odkaz, takže prostřední tlačítko myši i „otevřít v novém panelu“ fungují, a
        vzhled se nemusí opisovat.
      </>,
    ],
    en: [
      <>Anything the user clicks. This is the button in this application.</>,
      <>
        The main action of the screen —{" "}
        <IngotCode>variant=&quot;primary&quot;</IngotCode>, top right, and exactly one.
        A second primary action next to the first means neither of them is the main one.
      </>,
      <>
        An action is running and that has to show — <IngotCode>loading</IngotCode> locks
        the button, sets <IngotCode>aria-busy</IngotCode> and covers the label with a
        spinner without the button shrinking.
      </>,
      <>
        An icon in a table row, where there is no space for a label —{" "}
        <IngotCode>iconOnly</IngotCode> plus an <IngotCode>aria-label</IngotCode>.
      </>,
      <>
        The action is irreversible: <IngotCode>variant=&quot;danger&quot;</IngotCode>.
        The meaning lives in the variant, not in a colour you picked.
      </>,
      <>
        The action navigates rather than starts something (sign-up, contact, docs) —{" "}
        <IngotCode>as=&quot;a&quot;</IngotCode> with an <IngotCode>href</IngotCode>. It
        renders a link, so middle-click and “open in a new tab” work, and the look need
        not be copied.
      </>,
    ],
  },
  body: () => import("@/ingot-docs/pages/ButtonDoc.body"),
};
