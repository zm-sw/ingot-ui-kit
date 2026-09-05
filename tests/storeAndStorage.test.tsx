import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, render, screen } from "@testing-library/react";

import { IngotMegaMenu, MENU_LAYER } from "@/ingot";
import { createStore } from "@/ingot/store";
import { readStored, writeStored } from "@/ingot/storage";
import {
  ACCENT_STORAGE_KEY,
  LEGACY_THEME_STORAGE_KEY,
  THEME_STORAGE_KEY,
  readStoredTheme,
} from "@/ingot/theme";
import {
  DOCS_STORAGE_KEYS,
  LEGACY_DOCS_STORAGE_KEYS,
  readDocsStorage,
  writeDocsStorage,
} from "@/ingot-docs/storage";

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

  it("all keys share one scheme, the kit's and the doc web's alike", () => {
    const keys = [
      THEME_STORAGE_KEY,
      ACCENT_STORAGE_KEY,
      ...Object.values(DOCS_STORAGE_KEYS),
    ];
    for (const key of keys) {
      expect(key).toMatch(/^forgmatic\.ingot\./);
    }
  });

  it("reads fall back to the legacy key, writes go to the new one", () => {
    window.localStorage.setItem(LEGACY_THEME_STORAGE_KEY, "dark");
    expect(readStored(THEME_STORAGE_KEY, LEGACY_THEME_STORAGE_KEY)).toBe("dark");
    expect(readStoredTheme()).toBe("dark");
    writeStored(THEME_STORAGE_KEY, "light");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(readStored(THEME_STORAGE_KEY, LEGACY_THEME_STORAGE_KEY)).toBe("light");
  });

  it("the doc web's own keys behave the same way", () => {
    window.localStorage.setItem(LEGACY_DOCS_STORAGE_KEYS.lang, "en");
    expect(readDocsStorage("lang")).toBe("en");
    writeDocsStorage("lang", "cs");
    expect(window.localStorage.getItem(DOCS_STORAGE_KEYS.lang)).toBe("cs");
  });

  it("storage that throws is not an error, it is 'no choice yet'", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readStored(THEME_STORAGE_KEY)).toBeNull();
    expect(readStoredTheme()).toBe("system");
    expect(() => writeStored(THEME_STORAGE_KEY, "dark")).not.toThrow();
    getItem.mockRestore();
    setItem.mockRestore();
  });

  it("the language script reads the same key as the doc web does", () => {
    // Same reason as the anti-flash script below: it runs before any module
    // loads, so it cannot import the key and spells it by hand. It decides
    // the language of the site root, which is the one page whose language
    // is the reader's rather than the address's.
    const script = readFileSync(
      join(__dirname, "..", "public", "lang-init.js"),
      "utf-8",
    );
    expect(script).toContain(`"${DOCS_STORAGE_KEYS.lang}"`);
    expect(script).toContain(`"${LEGACY_DOCS_STORAGE_KEYS.lang}"`);
  });

  it("the shipped anti-flash script reads the same key as the theme module", () => {
    // It cannot import them: it runs before any module loads. So the two
    // spellings are pinned together here instead.
    const script = readFileSync(
      join(__dirname, "..", "src", "ingot", "theme-init.js"),
      "utf-8",
    );
    expect(script).toContain(`"${THEME_STORAGE_KEY}"`);
    expect(script).toContain(`"${LEGACY_THEME_STORAGE_KEY}"`);
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
