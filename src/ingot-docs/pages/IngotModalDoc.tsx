import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/IngotModalDemo";
import demoSource from "@/ingot-docs/demos/IngotModalDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const IngotModalDoc: IngotDocPage = {
  name: "IngotModal",
  status: "stable",
  version: "0.1",
  summary: {
    cs: "Skořápka dialogu s a11y laťkou: focus trap, ESC, scroll lock, aria-modal a návrat fokusu na spouštěč.",
    en: "Dialog shell with the accessibility floor built in: focus trap, ESC, scroll lock, aria-modal and focus returned to the trigger.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>
        Obsah má překrýt obrazovku a vyžádat si rozhodnutí, než se dá
        pokračovat.
      </>,
      <>
        Dialog není jen „potvrď / zruš“ — je v něm formulář, náhled nebo
        výběr.
      </>,
      <>
        Vždycky, když bys jinak psal{" "}
        <IngotCode>&lt;div className=&quot;fixed inset-0 …&quot;&gt;</IngotCode> znovu.
        Dialog má být právě jeden způsob, ne tolik způsobů, kolik je
        obrazovek — a tohle primitivum je ten způsob.
      </>,
    ],
    en: [
      <>
        The content has to cover the screen and demand a decision before
        anything else can happen.
      </>,
      <>
        The dialog is more than "confirm / cancel" — it holds a form, a
        preview or a selection.
      </>,
      <>
        Any time you would otherwise write{" "}
        <IngotCode>&lt;div className=&quot;fixed inset-0 …&quot;&gt;</IngotCode> again.
        A dialog should be exactly one thing, not as many things as there are
        screens — and this primitive is that one thing.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Jde o potvrzení destruktivního kroku. Na to je{" "}
        <IngotCode>IngotConfirm</IngotCode>, který nad tímhle primitivem stojí a přidává
        tlačítka i veto.
      </>,
      <>
        Sdělení nikoho neblokuje („uloženo“, „nepovedlo se“). Dialog je
        nejtěžší afordance, kterou máš; hlášení v místě děje stačí.
      </>,
      <>
        Obsah je tak dlouhý, že se v panelu jenom posouvá. Pak je to
        obrazovka, ne dialog.
      </>,
    ],
    en: [
      <>
        You are confirming a destructive step. That is{" "}
        <IngotCode>IngotConfirm</IngotCode>, which is built on top of this primitive and
        adds the buttons and the veto.
      </>,
      <>
        The message blocks nobody ("saved", "that did not work"). A dialog is
        the heaviest affordance you have; a message where the action happened
        is enough.
      </>,
      <>
        The content is long enough that it only scrolls inside the panel. Then
        it is a screen, not a dialog.
      </>,
    ],
  },
  props: [
    {
      name: "title",
      type: "ReactNode",
      required: true,
      note: {
        cs: "Vykreslí se do nadpisu h2, na který ukazuje aria-labelledby.",
        en: "Rendered into the h2 heading that aria-labelledby points at.",
      },
    },
    {
      name: "onClose",
      type: "() => void",
      required: true,
      note: {
        cs: "Volá ESC, kliknutí do pozadí i zavírací tlačítko.",
        en: "Called by ESC, a backdrop click and the close button.",
      },
    },
    {
      name: "children",
      type: "ReactNode",
      required: true,
      note: { cs: "Obsah panelu.", en: "The panel body." },
    },
    {
      name: "closeLabel",
      type: "string",
      required: true,
      note: {
        cs: "Přeložený aria-label křížku — Ingot překlady nemá.",
        en: "Translated aria-label for the close icon — the Ingot has no translations of its own.",
      },
    },
    {
      name: "width",
      type: "number",
      required: false,
      note: {
        cs: "Maximální šířka panelu v px. Výchozí 480.",
        en: "Maximum panel width in px. Defaults to 480.",
      },
    },
    {
      name: "testId",
      type: "string",
      required: false,
      note: {
        cs: "data-testid overlaye; panel dostane `${testId}-panel`.",
        en: "data-testid of the overlay; the panel gets `${testId}-panel`.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        Laťku drží primitivum samo: <IngotCode>role=&quot;dialog&quot;</IngotCode>,{" "}
        <IngotCode>aria-modal=&quot;true&quot;</IngotCode> a{" "}
        <IngotCode>aria-labelledby</IngotCode> mířící na <IngotCode>&lt;h2&gt;</IngotCode>{" "}
        s titulkem.
      </>,
      <>
        Focus trap na Tab i Shift+Tab, ESC zavírá a po zavření se fokus vrací
        na prvek, který dialog otevřel.
      </>,
      <>
        Scroll lock pozadí se počítá podle hloubky: původní{" "}
        <IngotCode>overflow</IngotCode> se obnoví až se zavřením posledního dialogu,
        takže vnořený dialog ho neuvolní předčasně.
      </>,
      <>
        Ikona křížku je <IngotCode>aria-hidden</IngotCode>; popisek nese{" "}
        <IngotCode>aria-label</IngotCode> z <IngotCode>closeLabel</IngotCode>.
      </>,
    ],
    en: [
      <>
        The primitive holds the floor itself:{" "}
        <IngotCode>role=&quot;dialog&quot;</IngotCode>,{" "}
        <IngotCode>aria-modal=&quot;true&quot;</IngotCode> and{" "}
        <IngotCode>aria-labelledby</IngotCode> pointing at the <IngotCode>&lt;h2&gt;</IngotCode>{" "}
        that carries the title.
      </>,
      <>
        A focus trap on both Tab and Shift+Tab, ESC closes, and on close the
        focus returns to the element that opened the dialog.
      </>,
      <>
        The background scroll lock is depth-counted: the original{" "}
        <IngotCode>overflow</IngotCode> is restored only when the last dialog closes, so
        a nested dialog does not release it early.
      </>,
      <>
        The close icon is <IngotCode>aria-hidden</IngotCode>; the label comes from{" "}
        <IngotCode>closeLabel</IngotCode> via <IngotCode>aria-label</IngotCode>.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        <IngotCode>closeLabel</IngotCode> je povinný. Je to <IngotCode>aria-label</IngotCode>{" "}
        křížku a bez něj by ho odečítač přečetl jako „button“.
      </>,
      <>
        <IngotCode>title</IngotCode> a <IngotCode>children</IngotCode> dodává volající už
        přeložené.
      </>,
    ],
    en: [
      <>
        <IngotCode>closeLabel</IngotCode> is required. It is the{" "}
        <IngotCode>aria-label</IngotCode> of the close icon, and without it a screen
        reader announces just "button".
      </>,
      <>
        <IngotCode>title</IngotCode> and <IngotCode>children</IngotCode> arrive from the caller
        already translated.
      </>,
    ],
  },
};
