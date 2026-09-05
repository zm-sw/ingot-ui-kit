/**
 * The form's state (KAN-845) — when it seeds and when it resets.
 *
 * The bug this pins down was a data-loss bug and an invisible one: the
 * reset hung on the IDENTITY of ``initial``, so a parent that built the
 * object inline, or a refetch that returned an equal but new object, threw
 * away whatever the admin had typed. Nothing failed and nothing warned —
 * the form simply went back to the stored values mid-edit.
 *
 * What is measured here:
 *
 * 1. **A new but equal ``initial`` keeps what was typed.** This is the
 *    regression itself, and the one a component test cannot see because it
 *    needs the parent to re-render.
 * 2. **Data arriving late still seeds the form.** Nothing was typed yet —
 *    there was nothing to type into — so this is a seed, not a reset.
 * 3. **``resetKey`` resets.** That is the caller saying "different record
 *    now", and it is the only thing that does.
 * 4. **The seed happens in the same render**, not one frame later: a frame
 *    with the previous record's values is where a fast typist loses a
 *    keystroke.
 */
import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useIngotForm, type IngotFieldSpec } from "@/ingot";

const FIELDS: IngotFieldSpec[] = [
  { key: "name", kind: "text", label: "Name" },
  { key: "token", kind: "secret", label: "Token" },
];

function Harness({
  initial,
  resetKey,
}: {
  initial?: Record<string, unknown> | null;
  resetKey?: string | number;
}) {
  const form = useIngotForm(FIELDS, initial, resetKey);
  return (
    <div>
      <span data-testid="values">{JSON.stringify(form.values)}</span>
      <button type="button" onClick={() => form.setValue("name", "typed")}>
        type
      </button>
    </div>
  );
}

/** The parent re-renders with a NEW object holding the same data. */
function Parent({ data }: { data: Record<string, unknown> }) {
  const [, force] = useState(0);
  return (
    <div>
      <Harness initial={{ ...data }} />
      <button type="button" onClick={() => force((n) => n + 1)}>
        rerender
      </button>
    </div>
  );
}

const values = () => JSON.parse(screen.getByTestId("values").textContent || "null");

describe("useIngotForm", () => {
  it("keeps what was typed when the parent passes a new but equal initial", () => {
    render(<Parent data={{ name: "stored", token: "" }} />);
    fireEvent.click(screen.getByText("type"));
    expect(values().name).toBe("typed");

    fireEvent.click(screen.getByText("rerender"));
    expect(values().name).toBe("typed");
  });

  it("seeds itself once the data arrives", () => {
    const { rerender } = render(<Harness initial={null} />);
    expect(values()).toBeNull();

    rerender(<Harness initial={{ name: "stored", token: "" }} />);
    expect(values().name).toBe("stored");
  });

  it("seeds in the same render, not a frame later", () => {
    render(<Harness initial={{ name: "stored", token: "" }} />);
    // No act() wrapping a second pass: the value is there on first paint.
    expect(values().name).toBe("stored");
  });

  it("resets when resetKey changes — a different record", () => {
    const { rerender } = render(
      <Harness initial={{ name: "first", token: "" }} resetKey="1" />,
    );
    fireEvent.click(screen.getByText("type"));
    expect(values().name).toBe("typed");

    rerender(<Harness initial={{ name: "second", token: "" }} resetKey="2" />);
    expect(values().name).toBe("second");
  });

  it("does not reset while resetKey stays the same", () => {
    const { rerender } = render(
      <Harness initial={{ name: "first", token: "" }} resetKey="1" />,
    );
    fireEvent.click(screen.getByText("type"));

    rerender(<Harness initial={{ name: "refetched", token: "" }} resetKey="1" />);
    expect(values().name).toBe("typed");
  });

  it("still drops an untouched secret from the payload", () => {
    function PayloadHarness() {
      const form = useIngotForm(FIELDS, { name: "stored", token: "" });
      return <span data-testid="payload">{JSON.stringify(form.payload())}</span>;
    }
    render(<PayloadHarness />);
    const payload = JSON.parse(screen.getByTestId("payload").textContent || "{}");
    expect(payload).toEqual({ name: "stored" });
  });
});
