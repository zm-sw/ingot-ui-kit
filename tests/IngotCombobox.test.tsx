/**
 * The search picker — measured where the wrong version looks right.
 *
 * - **Folding is two-sided.** Folding only the query looks like a working
 *   search until somebody types the diacritics they see on screen.
 * - **Ranking happens before the cut.** With the cut first, typing the
 *   exact name of the last option in a long catalogue shows everything
 *   except that option, and the field looks broken for no visible reason.
 * - **Keywords are matched and never drawn.** A row that suddenly shows a
 *   dial code is a different bug from one that cannot be found by it, and
 *   only measuring both tells them apart.
 * - **Leaving the field is not a silent loss.** A typed code that names
 *   exactly one option is that choice; a half-typed word is not, and must
 *   not stay in the field claiming to be a value.
 * - **The three words the field says itself come from the provider.** A
 *   consumer in another language must not be handed Czech.
 */
import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  INGOT_COMBOBOX_MAX_RENDERED,
  IngotCombobox,
  IngotProvider,
  type IngotComboboxOption,
} from "@/ingot";

const COUNTRIES: IngotComboboxOption[] = [
  { value: "AT", label: "Rakousko", keywords: ["AT", "AUT", "+43", "Austria"] },
  {
    value: "CZ",
    label: "Česká republika",
    keywords: ["CZ", "CZE", "+420", "Česko", "Czechia"],
  },
  { value: "DE", label: "Německo", keywords: ["DE", "DEU", "+49", "Germany"] },
  { value: "SK", label: "Slovensko", keywords: ["SK", "SVK", "+421"] },
];

async function labelsFor(
  query: string,
  options: IngotComboboxOption[] = COUNTRIES,
): Promise<string[]> {
  const { unmount } = render(
    <IngotCombobox options={options} value="" onChange={() => {}} label="Country" />,
  );
  await userEvent.type(screen.getByRole("combobox", { name: "Country" }), query);
  const labels = within(screen.getByRole("listbox"))
    .queryAllByRole("option")
    .map((element) => element.textContent ?? "");
  unmount();
  return labels;
}

describe("IngotCombobox search", () => {
  it.each(["cz", "cze", "cesko", "Česko", "czechia", "420"])(
    "%s finds the Czech Republic",
    async (query) => {
      expect(await labelsFor(query)).toContain("Česká republika");
    },
  );

  it("folds diacritics on both sides of the comparison", async () => {
    expect(await labelsFor("nemecko")).toEqual(["Německo"]);
    expect(await labelsFor("NĚMECKO")).toEqual(["Německo"]);
  });

  it("searches keywords without drawing them", async () => {
    render(
      <IngotCombobox
        options={COUNTRIES}
        value=""
        onChange={() => {}}
        label="Country"
      />,
    );
    await userEvent.type(screen.getByRole("combobox"), "czechia");
    expect(screen.getByRole("option")).toHaveTextContent(/^Česká republika$/);
  });

  it("ranks word-start matches before mid-word ones", async () => {
    const options: IngotComboboxOption[] = [
      { value: "a", label: "Nerez" },
      { value: "b", label: "Ocel", keywords: ["rezistentni"] },
      { value: "c", label: "Rez na hliniku" },
    ];
    expect(await labelsFor("rez", options)).toEqual([
      "Rez na hliniku",
      "Ocel",
      "Nerez",
    ]);
  });

  it("ranks before cutting to the render cap, and says it cut", async () => {
    const options: IngotComboboxOption[] = [
      ...Array.from({ length: 250 }, (_, index) => ({
        value: `f${index}`,
        label: `Item xzebra ${index}`,
      })),
      { value: "z", label: "Zebra" },
    ];
    render(
      <IngotCombobox options={options} value="" onChange={() => {}} label="Material" />,
    );
    await userEvent.type(screen.getByRole("combobox"), "zebra");
    const labels = within(screen.getByRole("listbox"))
      .queryAllByRole("option")
      .map((element) => element.textContent ?? "");
    expect(labels).toHaveLength(INGOT_COMBOBOX_MAX_RENDERED);
    expect(labels[0]).toBe("Zebra");
    expect(
      screen.getByText(
        `Showing the first ${INGOT_COMBOBOX_MAX_RENDERED} — narrow the search.`,
      ),
    ).toBeInTheDocument();
  });

  it("says so when nothing matches", async () => {
    render(
      <IngotCombobox
        options={COUNTRIES}
        value=""
        onChange={() => {}}
        label="Country"
      />,
    );
    await userEvent.type(screen.getByRole("combobox"), "qqq");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("shows the whole list when it opens on a chosen value", async () => {
    render(
      <IngotCombobox
        options={COUNTRIES}
        value="CZ"
        onChange={() => {}}
        label="Country"
      />,
    );
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.queryAllByRole("option")).toHaveLength(COUNTRIES.length);
  });
});

describe("IngotCombobox keyboard", () => {
  it("walks with the arrows, names the highlight, and takes it with Enter", async () => {
    const onChange = vi.fn();
    render(
      <IngotCombobox
        options={COUNTRIES}
        value=""
        onChange={onChange}
        label="Country"
      />,
    );
    const field = screen.getByRole("combobox");

    await userEvent.type(field, "{ArrowDown}");
    expect(field).toHaveAttribute("aria-expanded", "true");
    const first = field.getAttribute("aria-activedescendant");
    expect(first).not.toBeNull();
    expect(screen.getByRole("option", { name: /Rakousko/ })).toHaveAttribute(
      "id",
      first,
    );

    await userEvent.type(field, "{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("CZ");
  });

  it("End jumps to the last option and Home back to the first", async () => {
    const onChange = vi.fn();
    render(
      <IngotCombobox
        options={COUNTRIES}
        value=""
        onChange={onChange}
        label="Country"
      />,
    );
    const field = screen.getByRole("combobox");
    await userEvent.type(field, "{ArrowDown}{End}{Enter}");
    expect(onChange).toHaveBeenLastCalledWith("SK");

    await userEvent.type(field, "{ArrowDown}{End}{Home}{Enter}");
    expect(onChange).toHaveBeenLastCalledWith("AT");
  });

  it("Escape closes the list and puts the chosen label back in the field", async () => {
    render(
      <IngotCombobox
        options={COUNTRIES}
        value="CZ"
        onChange={() => {}}
        label="Country"
      />,
    );
    const field = screen.getByRole("combobox") as HTMLInputElement;
    await userEvent.type(field, "{ArrowDown}");
    await userEvent.clear(field);
    await userEvent.type(field, "nemec{Escape}");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(field.value).toBe("Česká republika");
  });
});

describe("IngotCombobox leaving the field", () => {
  function Harness({ onPick }: { onPick: (next: string) => void }): JSX.Element {
    const [value, setValue] = useState("");
    return (
      <div>
        <IngotCombobox
          options={COUNTRIES}
          value={value}
          onChange={(next) => {
            setValue(next);
            onPick(next);
          }}
          label="Country"
          testId="picker"
        />
        <button type="button">Save</button>
      </div>
    );
  }

  it("a typed text naming exactly one option is that choice", async () => {
    const onPick = vi.fn();
    render(<Harness onPick={onPick} />);
    await userEvent.type(screen.getByRole("combobox", { name: "Country" }), "CZ");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onPick).toHaveBeenCalledWith("CZ");
  });

  it("a half-typed text is not a choice and does not stay in the field", async () => {
    const onPick = vi.fn();
    render(<Harness onPick={onPick} />);
    const field = screen.getByRole("combobox", { name: "Country" }) as HTMLInputElement;
    await userEvent.type(field, "Česk");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onPick).not.toHaveBeenCalled();
    expect(field.value).toBe("");
  });

  it("the clear button empties the value and is named", async () => {
    const onPick = vi.fn();
    render(<Harness onPick={onPick} />);
    await userEvent.type(screen.getByRole("combobox", { name: "Country" }), "CZ");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await userEvent.click(screen.getByTestId("picker-clear"));
    expect(onPick).toHaveBeenLastCalledWith("");
  });

  it("a disabled field offers no clear button", () => {
    render(
      <IngotCombobox
        options={COUNTRIES}
        value="CZ"
        onChange={() => {}}
        label="Country"
        disabled
        testId="picker"
      />,
    );
    expect(screen.queryByTestId("picker-clear")).toBeNull();
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});

describe("IngotCombobox texts", () => {
  it("says its own three words in English without a provider", async () => {
    render(
      <IngotCombobox
        options={COUNTRIES}
        value="CZ"
        onChange={() => {}}
        label="Country"
      />,
    );
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
    await userEvent.type(screen.getByRole("combobox"), "{Backspace}qqq");
    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("takes the Czech set from the provider", async () => {
    render(
      <IngotProvider lang="cs">
        <IngotCombobox
          options={COUNTRIES}
          value="CZ"
          onChange={() => {}}
          label="Zeme"
        />
      </IngotProvider>,
    );
    expect(screen.getByRole("button", { name: "Vymazat" })).toBeInTheDocument();
    await userEvent.type(screen.getByRole("combobox"), "{Backspace}qqq");
    expect(screen.getByText("Žádné shody")).toBeInTheDocument();
  });
});
