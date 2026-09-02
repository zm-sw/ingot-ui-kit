import { IngotBreadcrumbs } from "@/ingot";
export function Demo(): JSX.Element {
  return (
    <IngotBreadcrumbs
      items={[
        { label: "Provoz", href: "#/IngotBreadcrumbs" },
        { label: "Objednávky", href: "#/IngotBreadcrumbs" },
        { label: "OBJ-2418" },
      ]}
      label="Kde se nacházíte"
      testId="docs-crumbs"
    />
  );
}
