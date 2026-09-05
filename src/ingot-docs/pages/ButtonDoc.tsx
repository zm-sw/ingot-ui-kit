import { IngotCode } from "@/ingot";
import { Demo } from "@/ingot-docs/demos/ButtonDemo";
import demoSource from "@/ingot-docs/demos/ButtonDemo?raw";
import type { IngotDocPage } from "@/ingot-docs/types";

export const ButtonDoc: IngotDocPage = {
  name: "Button",
  status: "stable",
  version: "1.1",
  tag: ".btn",
  tokens: ["--bg", "--surface", "--surface-2", "--border-strong", "--ink", "--ink-2", "--ink-4", "--accent", "--accent-ink", "--ok", "--danger", "--r-md"],
  classNameNote: {
    cs: "Bere `className` (a další atributy tlačítka) na rozvržení — šířku a zarovnání. Vzhled určují `variant` a `size`.",
    en: "Takes `className` (and the other button attributes) for layout — width and alignment. `variant` and `size` decide the look.",
  },
  summary: {
    cs: "Tlačítko se sedmi variantami, a s as=\"a\" i odkaz, který tak vypadá. Varianta nese význam akce, ne barvu — a v tmavém režimu drží kontrast, který opsané třídy ztrácejí.",
    en: "The button, in seven variants — and with as=\"a\" a link that looks like one. A variant carries the meaning of the action, not a colour, and in dark mode it holds a contrast that copied classes lose.",
  },
  Demo,
  demoSource,
  useWhen: {
    cs: [
      <>Cokoli, co uživatel odklikne. Tohle je jediné tlačítko v aplikaci.</>,
      <>
        Hlavní akce obrazovky — <IngotCode>variant=&quot;primary&quot;</IngotCode>, vpravo
        v hlavičce, a právě jedna. Druhá primární akce vedle první znamená,
        že ani jedna není hlavní.
      </>,
      <>
        Akce běží a je potřeba to ukázat — <IngotCode>loading</IngotCode> zamkne
        tlačítko, nasadí <IngotCode>aria-busy</IngotCode> a překryje popisek
        spinnerem, aniž by se tlačítko zúžilo.
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
        <IngotCode>as=&quot;a&quot;</IngotCode> s <IngotCode>href</IngotCode>.
        Vykreslí se odkaz, takže prostřední tlačítko myši i „otevřít
        v novém panelu“ fungují, a vzhled se nemusí opisovat.
      </>,
    ],
    en: [
      <>Anything the user clicks. This is the button in this application.</>,
      <>
        The main action of the screen — <IngotCode>variant=&quot;primary&quot;</IngotCode>,
        top right, and exactly one. A second primary action next to the first
        means neither of them is the main one.
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
        The action navigates rather than starts something (sign-up,
        contact, docs) — <IngotCode>as=&quot;a&quot;</IngotCode> with an{" "}
        <IngotCode>href</IngotCode>. It renders a link, so middle-click
        and “open in a new tab” work, and the look need not be copied.
      </>,
    ],
  },
  avoidWhen: {
    cs: [
      <>
        Je to odkaz uvnitř věty. Ten se sází jako text, ne jako tlačítko:{" "}
        <IngotCode>as=&quot;a&quot;</IngotCode> dává odkazu tvar tlačítka
        a ten uprostřed odstavce trhá řádek.
      </>,
      <>
        Chceš jinou barvu, než která z variant vychází. Barva tady není
        volba, ale význam; nová potřeba je nová varianta, ne{" "}
        <IngotCode>className</IngotCode>.
      </>,
    ],
    en: [
      <>
        It is a link inside a sentence. That is set as text, not as a
        button: <IngotCode>as=&quot;a&quot;</IngotCode> gives a link the
        shape of a button, and that shape tears a line of prose apart.
      </>,
      <>
        You want a colour other than the one the variant gives. Colour here is
        not a choice but a meaning; a new need is a new variant, not a{" "}
        <IngotCode>className</IngotCode>.
      </>,
    ],
  },
  props: [
    {
      name: "as",
      type: '"button" | "a"',
      required: false,
      note: {
        cs: 'Výchozí button. S "a" se vykreslí odkaz — pro akci, která naviguje, ne spouští.',
        en: 'Defaults to button. With "a" it renders a link — for an action that navigates rather than starts something.',
      },
    },
    {
      name: "href",
      type: "string",
      required: false,
      note: {
        cs: 'Povinný při as="a", jinde nedostupný. Odkaz bez cíle není odkaz: nedostane se do pořadí tabulátoru.',
        en: 'Required with as="a", unavailable otherwise. A link with no target is not a link: it never enters the tab order.',
      },
    },
    {
      name: "variant",
      type: '"primary" | "accent" | "ok" | "secondary" | "ghost" | "danger" | "inverse"',
      required: false,
      note: {
        cs: "Váha akce. Výchozí secondary — primární akce se řekne nahlas, protože má být na obrazovce jedna. inverse patří na obrácenou plochu (tmavý blok), kde je neutrální tlačítko neviditelné.",
        en: "The weight of the action. Defaults to secondary — a primary action is asked for out loud, because there should be one per screen. inverse belongs on an inverted field (a dark block), where a neutral button is invisible.",
      },
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      required: false,
      note: {
        cs: "Výška 28 / 34 / 42 px. Výchozí md.",
        en: "Height 28 / 34 / 42 px. Defaults to md.",
      },
    },
    {
      name: "iconOnly",
      type: "boolean",
      required: false,
      note: {
        cs: "Čtvercové tlačítko jen s ikonou. Vyžaduje aria-label.",
        en: "A square, icon-only button. Requires an aria-label.",
      },
    },
    {
      name: "loading",
      type: "boolean",
      required: false,
      note: {
        cs: 'Překryje popisek spinnerem, zamkne šířku a nasadí aria-busy. Jen na tlačítku — odkaz se rozpracovat nedá.',
        en: 'Covers the label with a spinner, locks the width and sets aria-busy. Buttons only — a link cannot be in progress.',
      },
    },
    {
      name: "leadingIcon",
      type: "ReactNode",
      required: false,
      note: { cs: "Ikona před popiskem.", en: "Icon before the label." },
    },
    {
      name: "trailingIcon",
      type: "ReactNode",
      required: false,
      note: { cs: "Ikona za popiskem.", en: "Icon after the label." },
    },
    {
      name: "disabled",
      type: "boolean",
      required: false,
      note: {
        cs: "Nedostupná akce. Pozor: zašedlé tlačítko neřekne proč.",
        en: "Unavailable action. Careful: a greyed-out button does not say why.",
      },
    },
  ],
  a11y: {
    cs: [
      <>
        <IngotCode>type</IngotCode> je vždycky <IngotCode>&quot;button&quot;</IngotCode>, pokud
        neřekneš jinak. Bez toho tlačítko uvnitř formuláře formulář odešle —
        chyba, která se projeví až v provozu a jen někdy.
      </>,
      <>
        <IngotCode>loading</IngotCode> nasadí <IngotCode>aria-busy</IngotCode> a tlačítko zamkne,
        takže dvojklik nespustí mutaci dvakrát.
      </>,
      <>
        Fokus kreslí prstenec 2px v barvě <IngotCode>--accent</IngotCode> s odsazením
        2px. <IngotCode>outline: none</IngotCode> na tlačítku nikdy — kdo ovládá
        aplikaci klávesnicí, tím přijde o jedinou informaci, kde se nachází.
      </>,
      <>
        <IngotCode>iconOnly</IngotCode> bez <IngotCode>aria-label</IngotCode> (nebo{" "}
        <IngotCode>aria-labelledby</IngotCode>) je chyba — ve vývojovém režimu na ni
        tlačítko upozorní do konzole. Popisek začíná slovesem: „Smazat řádek“,
        ne „Koš“.
      </>,
      <>
        Klikatelná plocha má být nejméně 32×32 px, na dotykovém zařízení
        44×44 px. Velikost <IngotCode>sm</IngotCode> je 28 px, a patří proto do hustých
        míst ovládaných myší — typicky do řádku tabulky. Na dotyk sáhni po{" "}
        <IngotCode>md</IngotCode> a výš.
      </>,
      <>
        🚨 Varianty <IngotCode>danger</IngotCode>, <IngotCode>accent</IngotCode> a <IngotCode>ok</IngotCode>{" "}
        mají v tmavém režimu výjimku: tmavá paleta ty tokeny{" "}
        <strong>zesvětluje</strong>, aby se daly číst jako text, a bílý text
        na nich klesá pod kontrastní minimum WCAG AA. Popisek se proto
        invertuje na barvu pozadí stránky. Kdo si tlačítko opíše, tuhle
        výjimku neopíše — a v tmavém režimu vyrobí nečitelné tlačítko.
      </>,
      <>
        <IngotCode>as=&quot;a&quot;</IngotCode> vykreslí opravdový odkaz, ne
        tlačítko, které naviguje. Odečítač ho hlásí jako odkaz, do pořadí
        tabulátoru se dostane přes <IngotCode>href</IngotCode> a Enter ho
        následuje — nic z toho tlačítko ve tvaru odkazu neumí. Proto je{" "}
        <IngotCode>href</IngotCode> povinný, a ne nepovinný.
      </>,
    ],
    en: [
      <>
        <IngotCode>type</IngotCode> is always <IngotCode>&quot;button&quot;</IngotCode> unless you
        say otherwise. Without that, a button inside a form submits the form —
        a bug that shows up in production and only sometimes.
      </>,
      <>
        <IngotCode>loading</IngotCode> sets <IngotCode>aria-busy</IngotCode> and locks the button,
        so a double click cannot fire the mutation twice.
      </>,
      <>
        Focus draws a 2px ring in <IngotCode>--accent</IngotCode> with a 2px offset.
        Never <IngotCode>outline: none</IngotCode> on a button — anyone driving the
        application from the keyboard loses the only clue to where they are.
      </>,
      <>
        <IngotCode>iconOnly</IngotCode> without an <IngotCode>aria-label</IngotCode> (or{" "}
        <IngotCode>aria-labelledby</IngotCode>) is a bug — in development mode the
        button says so in the console. The label starts with a verb: “Delete
        row”, not “Bin”.
      </>,
      <>
        The clickable area should be at least 32×32 px, and 44×44 px on touch.
        The <IngotCode>sm</IngotCode> size is 28 px, so it belongs in dense,
        pointer-driven places — a table row, typically. For touch, reach for{" "}
        <IngotCode>md</IngotCode> or larger.
      </>,
      <>
        🚨 The <IngotCode>danger</IngotCode>, <IngotCode>accent</IngotCode> and <IngotCode>ok</IngotCode>{" "}
        variants carry a dark-mode exception: the dark palette{" "}
        <strong>lightens</strong> those tokens so they stay readable as text,
        and white text on them drops below the WCAG AA contrast minimum. The
        label therefore inverts to the page background colour. Anyone copying
        the button will not copy that exception — and ships an unreadable
        button in dark mode.
      </>,
      <>
        <IngotCode>as=&quot;a&quot;</IngotCode> renders a real link, not a
        button that navigates. A screen reader announces it as a link, it
        enters the tab order through <IngotCode>href</IngotCode> and Enter
        follows it — which is exactly what a button shaped like a link
        cannot do. That is also why <IngotCode>href</IngotCode> is required
        rather than optional.
      </>,
    ],
  },
  i18n: {
    cs: [
      <>
        Popisek jsou <IngotCode>children</IngotCode> — dodává je volající už přeložené.
      </>,
      <>
        Tlačítko jen s ikonou potřebuje <IngotCode>aria-label</IngotCode>, jinak
        odečítač přečte „button“ a nic víc.
      </>,
    ],
    en: [
      <>
        The label is <IngotCode>children</IngotCode> — passed in by the caller, already
        translated.
      </>,
      <>
        An icon-only button needs an <IngotCode>aria-label</IngotCode>, otherwise a
        screen reader announces just “button”.
      </>,
    ],
  },
};
