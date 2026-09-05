/**
 * IngotProvider (KAN-841) — the kit's dictionary for the labels a primitive
 * says itself.
 *
 * What is measured here and why exactly that:
 *
 * 1. **English is the default.** Without a provider the toast, the page
 *    hint and the secret field must not speak Czech — a consumer in another
 *    language used to be handed Czech without asking.
 * 2. **``lang`` switches the whole set at once.** One prop on one provider,
 *    not a label per component.
 * 3. **``labels`` overrides single entries and keeps the rest.**
 * 4. **A component's own prop wins over the provider.** The provider is a
 *    default, not a policy.
 *
 * Fake timers because the toast queue is a module store: every test ends
 * with ``runAllTimers`` so the queue is empty for the next one.
 */
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { vi } from "vitest";

import {
  INGOT_LABELS,
  IngotFieldInput,
  IngotPageHint,
  IngotProvider,
  IngotToast,
  toast,
  type IngotFieldSpec,
} from "@/ingot";

const STORED: IngotFieldSpec = {
  key: "token",
  kind: "secret",
  label: "Token",
  secretConfigured: true,
};
const EMPTY: IngotFieldSpec = { key: "token", kind: "secret", label: "Token" };

function Consumers({ field = STORED }: { field?: IngotFieldSpec }) {
  return (
    <>
      <IngotToast />
      <IngotPageHint
        title="Orders"
        targets={["#nowhere"]}
        dismissible
        onDismiss={() => undefined}
        testId="hint"
      >
        body
      </IngotPageHint>
      <IngotFieldInput
        field={field}
        value=""
        onChange={() => undefined}
        testId="secret"
      />
    </>
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  act(() => {
    vi.runAllTimers();
  });
  vi.useRealTimers();
});

describe("IngotProvider", () => {
  it("falls back to English without a provider", () => {
    render(<Consumers />);
    act(() => {
      toast({ text: "Saved.", undo: () => undefined });
    });
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
    expect(screen.getByTestId("hint-bulb")).toHaveAttribute(
      "aria-label",
      INGOT_LABELS.en.pageHintBulb,
    );
    expect(screen.getByTestId("hint-dismiss")).toHaveAttribute(
      "aria-label",
      INGOT_LABELS.en.pageHintDismiss,
    );
    expect(screen.getByTestId("secret")).toHaveAttribute("placeholder", "set");
  });

  it("lang switches the whole set at once", () => {
    render(
      <IngotProvider lang="cs">
        <Consumers field={EMPTY} />
      </IngotProvider>,
    );
    act(() => {
      toast({ text: "Uloženo.", undo: () => undefined });
    });
    expect(screen.getByRole("button", { name: "Zpět" })).toBeInTheDocument();
    expect(screen.getByTestId("hint-bulb")).toHaveAttribute(
      "aria-label",
      INGOT_LABELS.cs.pageHintBulb,
    );
    expect(screen.getByTestId("secret")).toHaveAttribute(
      "placeholder",
      "nenastaveno",
    );
  });

  it("labels overrides single entries and keeps the rest", () => {
    render(
      <IngotProvider labels={{ toastUndo: "Rückgängig" }}>
        <Consumers />
      </IngotProvider>,
    );
    act(() => {
      toast({ text: "Gespeichert.", undo: () => undefined });
    });
    expect(
      screen.getByRole("button", { name: "Rückgängig" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("secret")).toHaveAttribute("placeholder", "set");
  });

  it("a component prop wins over the provider", () => {
    render(
      <IngotProvider lang="cs">
        <IngotToast />
        <IngotPageHint
          title="Orders"
          targets={["#nowhere"]}
          bulbLabel="Show me"
          testId="hint"
        >
          body
        </IngotPageHint>
      </IngotProvider>,
    );
    act(() => {
      toast({ text: "Saved.", undo: () => undefined, undoLabel: "Revert" });
    });
    expect(screen.getByRole("button", { name: "Revert" })).toBeInTheDocument();
    expect(screen.getByTestId("hint-bulb")).toHaveAttribute(
      "aria-label",
      "Show me",
    );
  });

  it("every language carries every label", () => {
    const keys = Object.keys(INGOT_LABELS.en).sort();
    for (const lang of Object.keys(INGOT_LABELS) as (keyof typeof INGOT_LABELS)[]) {
      expect(Object.keys(INGOT_LABELS[lang]).sort()).toEqual(keys);
      for (const value of Object.values(INGOT_LABELS[lang])) {
        expect(value.trim()).not.toBe("");
      }
    }
  });
});
