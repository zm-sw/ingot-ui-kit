/**
 * Akcentové rodiny v ``tokens.css``.
 *
 * 🪤 **Puntík rodiny si barvu nedrží — bere ji z tabulky rodin.** Každý
 * puntík v přepínači nese ``data-accent`` a kreslí se ``var(--accent)``,
 * takže barvu, kterou slibuje, čte z těch samých bloků, které nasazují
 * rodinu na celou stránku.
 *
 * Jenže „výchozí rodina nemá vlastní blok" platí jen pro ``<html>``: tam
 * se chybějící atribut propadne na čtveřici v ``:root``. Prvek UVNITŘ
 * stránky se ale nepropadne nikam — zdědí to, co drží ``<html>``. Modrý
 * puntík se proto po přepnutí na oranžovou obarvil oranžově a v
 * přepínači byly oranžové dva.
 *
 * Test čte skutečný stylesheet, ne jméno třídy: měří se to, co se
 * doopravdy pošle do prohlížeče.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { ACCENT_CHOICES, DEFAULT_ACCENT } from "@/lib/accent";

const CSS = readFileSync(
  join(process.cwd(), "src/ingot/tokens.css"),
  "utf-8",
);

/** Bloky rodiny pro danou plochu — světlou (``:not(.dark)``) i tmavou. */
function descendantBlocks(choice: string): readonly string[] {
  return [
    `:root:not(.dark) [data-accent="${choice}"]`,
    `:root.dark [data-accent="${choice}"]`,
  ];
}

describe("akcentové rodiny", () => {
  it.each(ACCENT_CHOICES.map((choice) => [choice] as const))(
    "rodina %s má blok i pro prvek uvnitř stránky, ne jen pro <html>",
    (choice) => {
      // Bez potomkového selektoru by puntík dědil rodinu z <html> —
      // tedy tu právě vybranou, ne tu, kterou pojmenovává.
      for (const selector of descendantBlocks(choice)) {
        expect(CSS).toContain(selector);
      }
    },
  );

  it("výchozí rodina má blok taky — jinak se puntík obarví podle vybrané", () => {
    // Regrese: tenhle blok kdysi chyběl schválně („výchozí se propadne
    // na :root"), což uvnitř stránky neplatí.
    for (const selector of descendantBlocks(DEFAULT_ACCENT)) {
      expect(CSS).toContain(selector);
    }
  });

  it("výchozí rodina své hodnoty neopisuje, jen je odkazuje", () => {
    // Dvě definice téže modré by se dřív nebo později rozešly, takže
    // blok rodiny smí obsahovat jen odkazy na ``--blue-*``.
    const block = CSS.split(`:root:not(.dark) [data-accent="blue"]`)[1]?.split(
      "}",
    )[0];
    expect(block).toBeTruthy();
    expect(block).toContain("var(--blue-accent)");
    // Žádný hex uvnitř bloku — hodnota má jedno místo, a to je :root.
    expect(block).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});
