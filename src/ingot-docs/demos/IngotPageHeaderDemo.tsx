import { Button, IngotPageHeader } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <IngotPageHeader
      title="Šarže materiálu"
      description="Co operátor na téhle obrazovce najde, jednou větou."
      actions={<Button variant="primary">Přidat šarži</Button>}
      testId="docs-page-header"
    />
  );
}
