import { IngotRowActions } from "@/ingot";
export function Demo(): JSX.Element {
  return (
    <IngotRowActions
      actions={[
        { icon: "sliders", label: "Upravit vzorec", onClick: () => {} },
        { icon: "copy", label: "Duplikovat vzorec", onClick: () => {} },
        {
          icon: "trash",
          label: "Smazat vzorec",
          tone: "danger",
          onClick: () => {},
          testId: "docs-rowaction-delete",
        },
      ]}
      testId="docs-rowactions"
    />
  );
}
