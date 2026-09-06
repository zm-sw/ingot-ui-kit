import { useState } from "react";

import {
  Button,
  IngotAppFrame,
  IngotDrawer,
  IngotIcon,
  IngotProvider,
  IngotSideNav,
  IngotTopNav,
  IngotTopNavAccount,
  INGOT_FRAME_ROW,
  type IngotTopNavSection,
} from "@forgmatic/ingot";
import { applyTheme, readStoredTheme, writeStoredTheme } from "@forgmatic/ingot/theme";

import { OrderDetail } from "./OrderDetail";
import { OrderList } from "./OrderList";
import type { Order } from "./orders";

/**
 * The smallest application that is still a real one.
 *
 * It exists to fail. Every kind of mistake this repository cannot see in
 * its own tests shows up here as a build error: a module that leaked a
 * relative path out of the package, an export the barrel forgot, a peer
 * dependency nobody declared, a Tailwind class that only exists because
 * the doc web happened to have it in `content`.
 *
 * Nothing here reaches into the kit's sources. It installs the packed
 * package, exactly as anyone outside this repository would.
 *
 * ## What the two screens are for
 *
 * They answer a question the old single screen could not: **can a real
 * screen be built out of the kit alone?** Until the layout work landed the
 * answer was no — there was no frame, no grid, no action bar and no
 * loading state, so an application filled the gaps with its own utilities,
 * and that is where two products built from one kit stop looking alike.
 *
 * The `ingot-docs-kit-only` guard reads `examples/consumer/src` now. A
 * `<table>`, a `<button>` or a `<ul>` written here fails the build, which
 * is what turns "composed only from the kit" from a claim into a check.
 */
const SECTIONS: readonly IngotTopNavSection[] = [
  { key: "orders", label: "Zakázky", href: "#", current: true },
  { key: "production", label: "Výroba", href: "#" },
  { key: "settings", label: "Nastavení", href: "#" },
];

export function App(): JSX.Element {
  const [detail, setDetail] = useState<Order | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(readStoredTheme);

  function toggleTheme(): void {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    writeStoredTheme(next);
    applyTheme(next);
  }

  return (
    <IngotProvider lang="cs">
      <IngotAppFrame
        className="py-6"
        bar={
          <IngotTopNav
            brand={<span className="font-semibold">Forgmatic</span>}
            contentClassName={INGOT_FRAME_ROW}
            sectionsLabel="Sekce"
            sections={SECTIONS}
            // The bar does not wrap — that is in its own documentation. So
            // below `lg` the sections come out of it and the hamburger
            // carries them instead. Without this the bar is simply wider
            // than a phone and the whole document scrolls sideways;
            // measured at 375px before it was here.
            sectionsClassName="hidden lg:flex"
            menuButton={
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label="Otevřít menu"
                aria-expanded={menuOpen}
                className="lg:hidden"
                onClick={() => setMenuOpen(true)}
              >
                <IngotIcon name="menu" />
              </Button>
            }
            actions={
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {/* One word below `sm`: the bar there has room for controls,
                    not for their names. */}
                <span className="hidden sm:inline">
                  {theme === "dark" ? "Světlý motiv" : "Tmavý motiv"}
                </span>
                <IngotIcon name="bulb" />
              </Button>
            }
            account={<IngotTopNavAccount initials="JM" label="Účet Jan Marek" />}
          />
        }
      >
        {detail === null ? (
          <OrderList onOpen={setDetail} />
        ) : (
          <OrderDetail order={detail} onBack={() => setDetail(null)} />
        )}
      </IngotAppFrame>

      {/* Hiding the sections without this would not mean worse navigation
          on a phone, it would mean none. The drawer is a kit primitive, so
          the focus trap, ESC and the scroll lock come with it. */}
      {menuOpen && (
        <IngotDrawer
          side="left"
          width={280}
          title="Sekce"
          closeLabel="Zavřít menu"
          onClose={() => setMenuOpen(false)}
        >
          <IngotSideNav
            label="Sekce aplikace"
            // A section without an `href` is one with a menu behind it, and
            // this application has none — so the filter is a type guard
            // rather than a defensive `?? "#"`, which would put a link to
            // nowhere in the drawer.
            items={SECTIONS.filter(
              (section): section is typeof section & { href: string } =>
                section.href !== undefined,
            ).map((section) => ({
              href: section.href,
              label: section.label,
              current: section.current === true,
            }))}
          />
        </IngotDrawer>
      )}
    </IngotProvider>
  );
}
