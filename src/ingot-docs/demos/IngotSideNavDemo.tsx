import { IngotSideNav } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <IngotSideNav
      label="Ukázkové menu"
      testId="docs-sidenav"
      items={[
        { href: "#/IngotSideNav", label: "Právě zobrazené", current: true },
        { href: "#/IngotList", label: "Výčet" },
        { href: "#/IngotSection", label: "Sekce" },
      ]}
    />
  );
}
