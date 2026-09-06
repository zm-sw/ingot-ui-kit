import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IngotFieldInput, IngotForm, IngotTable } from "@/ingot";

/**
 * One checkbox in the kit. `IngotCheckbox`, the table's selection column
 * and the schema-driven field all render the same control, so the accent
 * colour and the hit size cannot drift between them.
 */

const KIT_DIR = join(__dirname, "..", "src", "ingot");

describe("checkbox control", () => {
  it("is written exactly once in src/ingot", () => {
    const hits: string[] = [];
    for (const file of readdirSync(KIT_DIR)) {
      if (!/\.tsx?$/.test(file) || file.includes(".test.")) continue;
      const src = readFileSync(join(KIT_DIR, file), "utf-8");
      if (/type="checkbox"/.test(src)) hits.push(file);
    }
    expect(hits).toEqual(["IngotCheckbox.tsx"]);
  });

  it("the table's selection boxes carry the shared control classes", () => {
    render(
      <IngotTable
        columns={[{ key: "n", header: "N", cell: (row: { id: string }) => row.id }]}
        rows={[{ id: "a" }, { id: "b" }]}
        rowKey={(row) => row.id}
        selectedKeys={new Set(["a"])}
        onSelectedKeysChange={() => {}}
        selectAllLabel="Select all"
        selectRowLabel={(row) => `Select ${row.id}`}
      />,
    );
    for (const box of screen.getAllByRole("checkbox")) {
      expect(box).toHaveClass("accent-accent");
      expect(box).toHaveClass("h-4");
    }
    expect(screen.getByLabelText("Select all")).toBeInTheDocument();
  });

  it("a boolean field in IngotFieldInput is the same control, bare", () => {
    render(
      <IngotFieldInput
        field={{ key: "on", kind: "boolean", label: "On" }}
        value={true}
        onChange={() => {}}
        testId="on"
      />,
    );
    const box = screen.getByTestId("on");
    expect(box).toHaveAttribute("type", "checkbox");
    expect(box).toHaveClass("accent-accent");
    expect(box.closest("label")).toBeNull();
  });

  it("IngotForm labels a boolean field through IngotCheckbox, so the text toggles it", async () => {
    const onChange = vi.fn();
    render(
      <IngotForm
        fields={[{ key: "on", kind: "boolean", label: "Enabled" }]}
        values={{ on: false }}
        onChange={onChange}
        testIdPrefix="f"
      />,
    );
    await userEvent.click(screen.getByText("Enabled"));
    expect(onChange).toHaveBeenCalledWith("on", true);
    expect(screen.getByLabelText("Enabled")).toBe(screen.getByTestId("f-on"));
  });

  it("an options field without a picker is a disabled select, not a free text input", () => {
    render(
      <IngotFieldInput
        field={{ key: "grp", kind: "options", label: "Group", optionsSource: "groups" }}
        value="g1"
        onChange={() => {}}
        testId="grp"
      />,
    );
    const select = screen.getByTestId("grp");
    expect(select.tagName).toBe("SELECT");
    expect(select).toBeDisabled();
    expect(select).toHaveAccessibleName("Group");
    expect(select).toHaveValue("g1");
  });
});
