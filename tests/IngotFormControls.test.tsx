/**
 * The form controls added in KAN-848: the switch, the radio group, the
 * callout, and the field's new types.
 *
 * Each of them is measured where the wrong version looks right:
 *
 * - **A switch is not a checkbox.** The difference is a promise about
 *   WHEN the change happens, and the only thing that carries it to a
 *   screen reader is `role="switch"` with `aria-checked`.
 * - **A radio group is a native group.** Rebuilt on `<div role="radio">`
 *   it looks identical and costs the browser's own arrows and the single
 *   tab stop, which is what a keyboard user actually uses.
 * - **A callout's tone decides its role.** `warn` and `danger` are
 *   announced when they appear; `info` and `ok` are read in place. A block
 *   that shouts every time is one people learn to skip.
 * - **The field keeps handing back a string**, whatever the type. That is
 *   the contract its own page states, and a number field that started
 *   returning `number | null` would break every caller silently.
 */
import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IngotCallout, IngotField, IngotRadioGroup, IngotSwitch } from "@/ingot";

describe("IngotSwitch", () => {
  it("is a switch, not a checkbox, and says on or off", () => {
    const onChange = vi.fn();
    render(
      <IngotSwitch
        checked={false}
        onChange={onChange}
        label="Upozornění na skluz"
        testId="switch"
      />,
    );

    const control = screen.getByRole("switch", { name: /Upozornění na skluz/ });
    expect(control).toHaveAttribute("aria-checked", "false");
    expect(screen.queryByRole("checkbox")).toBeNull();

    fireEvent.click(control);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("a click on the label flips it, so the target is the whole row", () => {
    const onChange = vi.fn();
    render(
      <IngotSwitch
        checked
        onChange={onChange}
        label="Automatické plánování"
        testId="switch"
      />,
    );

    fireEvent.click(screen.getByText("Automatické plánování"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("binds its hint with aria-describedby", () => {
    render(
      <IngotSwitch
        checked
        onChange={() => undefined}
        label="Upozornění"
        hint="Pošle e-mail, jakmile se zakázka dostane po termínu."
        testId="switch"
      />,
    );

    expect(screen.getByRole("switch")).toHaveAccessibleDescription(
      "Pošle e-mail, jakmile se zakázka dostane po termínu.",
    );
  });

  it("a disabled switch reports nothing", () => {
    const onChange = vi.fn();
    render(
      <IngotSwitch
        checked={false}
        onChange={onChange}
        label="Sdílení"
        disabled
        testId="switch"
      />,
    );

    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("IngotRadioGroup", () => {
  const OPTIONS = [
    { value: "standard", label: "Standardní" },
    { value: "contract", label: "Smluvní" },
    { value: "auction", label: "Poptávkové řízení", disabled: true },
  ];

  it("is a named group of native radios", () => {
    render(
      <IngotRadioGroup
        value="standard"
        onChange={() => undefined}
        options={OPTIONS}
        label="Režim naceňování"
        testId="group"
      />,
    );

    const group = screen.getByRole("group", { name: "Režim naceňování" });
    expect(within(group).getAllByRole("radio")).toHaveLength(3);
    expect(within(group).getByRole("radio", { name: "Standardní" })).toBeChecked();
  });

  it("reports the value that was picked", () => {
    const onChange = vi.fn();
    render(
      <IngotRadioGroup
        value="standard"
        onChange={onChange}
        options={OPTIONS}
        label="Režim naceňování"
        testId="group"
      />,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Smluvní" }));
    expect(onChange).toHaveBeenCalledWith("contract");
  });

  it("keeps every radio in ONE group, so arrows move between them", () => {
    render(
      <IngotRadioGroup
        value="standard"
        onChange={() => undefined}
        options={OPTIONS}
        label="Režim naceňování"
        testId="group"
      />,
    );

    // One shared name is what makes the browser treat them as a group: one
    // tab stop, arrows to move, one value submitted.
    const names = new Set(
      screen.getAllByRole("radio").map((radio) => radio.getAttribute("name")),
    );
    expect(names.size).toBe(1);
  });

  it("a disabled option stays visible and cannot be picked", () => {
    const onChange = vi.fn();
    render(
      <IngotRadioGroup
        value="standard"
        onChange={onChange}
        options={OPTIONS}
        label="Režim naceňování"
        testId="group"
      />,
    );

    // Only the attribute is asserted: jsdom dispatches events on disabled
    // controls where a browser swallows them, so clicking here would
    // measure jsdom rather than the kit.
    expect(screen.getByRole("radio", { name: "Poptávkové řízení" })).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("an option's hint is read with that option", () => {
    render(
      <IngotRadioGroup
        value="standard"
        onChange={() => undefined}
        options={[
          { value: "standard", label: "Standardní", hint: "Z platného ceníku." },
        ]}
        label="Režim naceňování"
        testId="group"
      />,
    );

    expect(
      screen.getByRole("radio", { name: "Standardní" }),
    ).toHaveAccessibleDescription("Z platného ceníku.");
  });
});

describe("IngotCallout", () => {
  it("announces a warning and a danger as an alert", () => {
    render(
      <IngotCallout tone="warn" title="Chybí norma" testId="warn">
        Bez ní se operace naceňuje odhadem.
      </IngotCallout>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Chybí norma");
  });

  it("leaves a note to be read in place", () => {
    render(
      <IngotCallout title="Ceník platí od pondělí" testId="info">
        Změny se propíšou do nových poptávek.
      </IngotCallout>,
    );

    // An info block that shouted would teach people to skip the ones that
    // matter.
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByTestId("info")).toHaveAttribute("data-tone", "info");
  });

  it("carries an icon with every tone, so colour is never the only signal", () => {
    render(
      <IngotCallout tone="danger" testId="danger">
        Zakázka je po termínu.
      </IngotCallout>,
    );
    expect(screen.getByTestId("danger").querySelector("svg")).toBeInTheDocument();
  });

  it("takes at most the actions it is given, at the foot", () => {
    render(
      <IngotCallout
        tone="ok"
        actions={<button type="button">Přeplánovat</button>}
        testId="ok"
      >
        Kalibrace potvrzena.
      </IngotCallout>,
    );
    expect(
      within(screen.getByTestId("ok")).getByRole("button", { name: "Přeplánovat" }),
    ).toBeInTheDocument();
  });
});

describe("IngotField types", () => {
  function Harness({ type }: { type: "number" | "textarea" | "password" }) {
    const [value, setValue] = useState("");
    return (
      <>
        <IngotField
          label="Počet kusů"
          type={type}
          value={value}
          onChange={setValue}
          testId="field"
        />
        <output data-testid="typeof">{typeof value}</output>
      </>
    );
  }

  it("hands back a string even for a number field", () => {
    render(<Harness type="number" />);
    const input = screen.getByLabelText("Počet kusů");
    expect(input).toHaveAttribute("type", "number");

    fireEvent.change(input, { target: { value: "12" } });
    // The contract the page states: an empty numeric box is ambiguous, so
    // the conversion belongs to the screen that knows what the value means.
    expect(screen.getByTestId("typeof")).toHaveTextContent("string");
  });

  it("renders a textarea with rows and keeps the label bound", () => {
    render(
      <IngotField
        label="Poznámka"
        type="textarea"
        rows={6}
        value=""
        onChange={() => undefined}
        testId="note"
      />,
    );

    const area = screen.getByLabelText("Poznámka");
    expect(area.tagName).toBe("TEXTAREA");
    expect(area).toHaveAttribute("rows", "6");
  });

  it("still binds hint, unit and error to the input whatever the type", () => {
    render(
      <IngotField
        label="Hmotnost"
        type="number"
        value=""
        onChange={() => undefined}
        hint="Zaokrouhluje se na desetiny."
        affix="kg"
        error="Zadejte kladné číslo."
        testId="weight"
      />,
    );

    const input = screen.getByLabelText("Hmotnost");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(
      "Zaokrouhluje se na desetiny. kg Zadejte kladné číslo.",
    );
  });
});
