import { Button, IngotCallout } from "@/ingot";

export function Demo(): JSX.Element {
  return (
    <div className="w-full max-w-xl space-y-3">
      <IngotCallout title="Ceník platí od pondělí" testId="docs-callout-info">
        Změny se propíšou do nových poptávek. Rozpracované zakázky si drží ceny, se
        kterými byly založeny.
      </IngotCallout>
      <IngotCallout tone="ok" title="Kalibrace potvrzena">
        Stroj je znovu v plánu a jeho operace se zařadily do fronty.
      </IngotCallout>
      <IngotCallout tone="warn" title="Chybí norma spotřeby">
        Bez ní se operace naceňuje odhadem. Doplňte ji v nastavení procesu.
      </IngotCallout>
      <IngotCallout
        tone="danger"
        title="Zakázka je po termínu"
        actions={
          <Button size="sm" variant="secondary">
            Přeplánovat
          </Button>
        }
      >
        Tři operace čekají na volný stroj déle, než dovoluje termín odeslání.
      </IngotCallout>
    </div>
  );
}
