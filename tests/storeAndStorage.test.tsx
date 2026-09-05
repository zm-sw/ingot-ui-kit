import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, render, screen } from "@testing-library/react";

import { IngotMegaMenu, MENU_LAYER } from "@/ingot";
import { createStore } from "@/ingot/store";
import {
  LEGACY_STORAGE_KEYS,
  STORAGE_KEYS,
  readStorage,
  writeStorage,
} from "@/lib/storage";
import { readStoredTheme } from "@/lib/theme";

describe("createStore", () => {
  it("initialises lazily and notifies subscribers on set", () => {
    const init = vi.fn(() => 1);
    const store = createStore<number>(init);
    expect(init).not.toHaveBeenCalled();
    expect(store.get()).toBe(1);
    expect(init).toHaveBeenCalledTimes(1);

    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.set((prev) => prev + 1);
    expect(store.get()).toBe(2);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    store.set(5);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("use() re-renders a component on set", () => {
    const store = createStore("a");
    function Probe(): JSX.Element {
      return <span data-testid="p">{store.use()}</span>;
    }
    render(<Probe />);
    expect(screen.getByTestId("p")).toHaveTextContent("a");
    act(() => store.set("b"));
    expect(screen.getByTestId("p")).toHaveTextContent("b");
  });
});

describe("storage keys", () => {
  beforeEach(() => window.localStorage.clear());

  it("all keys share one scheme", () => {
    for (const key of Object.values(STORAGE_KEYS)) {
      expect(key).toMatch(/^forgmatic\.ingot\./);
    }
  });

  it("reads fall back to the legacy key, writes go to the new one", () => {
    window.localStorage.setItem(LEGACY_STORAGE_KEYS.theme, "dark");
    expect(readStorage("theme")).toBe("dark");
    expect(readStoredTheme()).toBe("dark");
    writeStorage("theme", "light");
    expect(window.localStorage.getItem(STORAGE_KEYS.theme)).toBe("light");
    expect(readStorage("theme")).toBe("light");
  });

  it("theme-init.js reads the same key as theme.ts, with the same legacy fallback", () => {
    const script = readFileSync(
      join(__dirname, "..", "public", "theme-init.js"),
      "utf-8",
    );
    expect(script).toContain(`"${STORAGE_KEYS.theme}"`);
    expect(script).toContain(`"${LEGACY_STORAGE_KEYS.theme}"`);
  });
});

describe("layers", () => {
  it("the mega menu sits on MENU_LAYER, above every dialog", () => {
    render(
      <IngotMegaMenu
        label="Menu"
        groups={[{ items: [{ href: "#a", label: "A" }] }]}
        testId="mm"
      />,
    );
    expect(screen.getByTestId("mm")).toHaveStyle({ zIndex: String(MENU_LAYER) });
    expect(screen.getByTestId("mm").className).not.toMatch(/z-\[/);
  });
});
