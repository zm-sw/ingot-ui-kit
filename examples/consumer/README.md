# Referenční konzument

Nejmenší aplikace, která je pořád skutečná: horní lišta, drobečky, hlavička
stránky, tabulka se zásuvkou v detailu a marketingový blok. Instaluje
`@forgmatic/ingot` zvenčí a do zdrojů kitu nesahá.

Existuje proto, aby padala. Chyby, které tenhle repozitář na sobě samém
nevidí, se tu projeví jako chyba buildu:

- relativní cesta, která vytekla z balíčku,
- export, na který se v barrelu zapomnělo,
- peer dependency, kterou nikdo nevyhlásil,
- typ, který dodává jenom tsconfig tohohle repozitáře,
- třída Tailwindu, která existovala jen proto, že ji doc web měl v `content`.

Poslední dva jsou nejzákeřnější: uvnitř repozitáře fungují vždycky.

## Spuštění

Z kořene repozitáře:

```bash
npm run consumer:pack
```

To zabalí kit přesně tak, jak ho dostane konzument, a rozbalí ho do
`vendor/ingot`. Potom:

```bash
cd examples/consumer && npm install && npm run build
```

## Co si z toho vzít do vlastní aplikace

Konfigurace je proti holé Vite aplikaci delší o čtyři věci, každou z nich
najdete v tomhle adresáři:

1. **Preset Tailwindu** a v `content` i zdroje kitu — třída, která se
   objevuje jen uvnitř `node_modules`, se jinak nevygeneruje a komponenta
   se vykreslí bez stylu.
2. **`tokens.css`** jedním importem na začátku vlastního stylu.
3. **`optimizeDeps.exclude`** pro balíček — kit se posílá jako zdroj v
   TypeScriptu, takže musí projít stejnou cestou jako vlastní soubory.
4. **Skript proti probliknutí** v `<head>` jako obyčejný, neodložený
   `<script>`. Kopíruje se z balíčku při každém buildu, aby se nikdy
   nerozešel s klíčem, který čte modul motivu.

Skutečný konzument místo `vendor/ingot` píše do `package.json` tag:

```json
"@forgmatic/ingot": "github:zm-sw/ingot-ui-kit#v1.1.1"
```

Tag, ne commit. Proč, je na veřejném webu v průvodci Pravidla použití.
