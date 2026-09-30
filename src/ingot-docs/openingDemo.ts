/**
 * The live demo of the page a reader OPENED, loaded before the application
 * boots (KAN-985).
 *
 * Every other demo is `React.lazy` and arrives a frame after its page, with
 * a skeleton holding its place. For the page a reader lands on that frame
 * was a layout shift: the skeleton cannot know how tall the demo will be,
 * so everything under it jumped when the demo came — Lighthouse measured
 * CLS 0.108 on `/komponenty/table`, whose table is twice the skeleton's
 * height. The entry point already waits for this page's body for the same
 * reason (see `bodies.ts`); it now waits for the demo too, and the
 * prerendered file preloads its chunk next to the body's, so the wait is
 * one parallel fetch rather than another round trip.
 *
 * Only the opening page is held here, and only before the first render.
 * Swapping a page's demo from the lazy wrapper to the loaded component
 * while it is on screen would be a different component type, and React
 * would remount it and lose the reader's state in it. A page opened later
 * keeps its lazy demo and its skeleton — by then the reader is not in the
 * middle of reading text that the demo pushes away.
 */
import type { DocLang } from "@/ingot-docs/lang";
import type { IngotDocMeta } from "@/ingot-docs/types";

type Demo = (props: { lang: DocLang }) => JSX.Element;

let opening: { name: string; Demo: Demo } | null = null;

/** Load the opening page's demo. Call it only before the application boots. */
export async function loadOpeningDemo(page: IngotDocMeta): Promise<void> {
  const module = await page.demo();
  opening = { name: page.name, Demo: module.default };
}

/** The opening page's demo if it is already here, `undefined` otherwise. */
export function openingDemoOf(page: IngotDocMeta): Demo | undefined {
  return opening?.name === page.name ? opening.Demo : undefined;
}
