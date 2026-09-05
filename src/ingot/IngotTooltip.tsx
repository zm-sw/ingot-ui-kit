import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type JSX,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";

import { MENU_LAYER } from "./modalLayer";
import { placePanel, type IngotPlacement } from "./placement";

/**
 * A short label that appears next to a control on hover or focus.
 *
 * It replaces the `title` attribute, which looks like a tooltip and is
 * not one: the browser shows it after a delay it owns, in a style nobody
 * can read at a glance, never on a touch screen, and a screen reader may
 * or may not announce it depending on the reader and the element. A row of
 * icon buttons documented entirely through `title` is a row of buttons a
 * keyboard user meets blind.
 *
 * **The tooltip DESCRIBES, it does not name.** The control keeps its own
 * accessible name (`aria-label` on an icon button); the tooltip is tied
 * with `aria-describedby`, so a screen reader says "Delete order, button"
 * and then the description — instead of saying the same words twice.
 *
 * That is also why a tooltip must never be the only place something is
 * said. It is a hint for the mouse and the eye; anything a person needs in
 * order to act belongs in the label or next to the control.
 *
 * Hover and focus both show it, ESC hides it while the pointer stays, and
 * the delay is short enough not to feel broken and long enough not to
 * flash while the pointer crosses a toolbar.
 */

/** How long the pointer must rest before the tooltip appears, in ms. */
export const INGOT_TOOLTIP_DELAY_MS = 400;

export function IngotTooltip({
  text,
  placement = "top-start",
  children,
  testId,
}: {
  /** Translated description. Short — a sentence at most. */
  text: string;
  placement?: IngotPlacement;
  /**
   * The control the tooltip describes. One element, and it must forward a
   * ref and take `aria-describedby` — which every kit control does.
   */
  children: ReactElement<{
    ref?: React.Ref<HTMLElement>;
    "aria-describedby"?: string;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;
  }>;
  testId?: string;
}): JSX.Element {
  const id = useId();
  const anchorRef = useRef<HTMLElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();
  const [shown, setShown] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShown(true), INGOT_TOOLTIP_DELAY_MS);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setShown(false);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!shown) {
      setPosition(null);
      return;
    }
    const anchor = anchorRef.current;
    const bubble = bubbleRef.current;
    if (!anchor || !bubble) return;
    const rect = anchor.getBoundingClientRect();
    const placed = placePanel({
      anchor: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      panel: { width: bubble.offsetWidth, height: bubble.offsetHeight },
      placement,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      scroll: { x: window.scrollX, y: window.scrollY },
    });
    setPosition({ top: placed.top, left: placed.left });
  }, [shown, placement]);

  // ESC hides a tooltip that is in the way — of a value under it, or of the
  // reader's attention. WCAG 1.4.13 asks for exactly this.
  useEffect(() => {
    if (!shown) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") hide();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [shown]);

  const trigger = cloneElement(children, {
    ref: anchorRef,
    "aria-describedby": shown ? id : undefined,
    onMouseEnter: (event: React.MouseEvent) => {
      children.props.onMouseEnter?.(event);
      show();
    },
    onMouseLeave: (event: React.MouseEvent) => {
      children.props.onMouseLeave?.(event);
      hide();
    },
    onFocus: (event: React.FocusEvent) => {
      children.props.onFocus?.(event);
      // Focus shows it at once: a keyboard user has already made their
      // intent clear by landing there, and a delay reads as nothing
      // happening.
      window.clearTimeout(timer.current);
      setShown(true);
    },
    onBlur: (event: React.FocusEvent) => {
      children.props.onBlur?.(event);
      hide();
    },
  });

  return (
    <>
      {trigger}
      {shown &&
        createPortal(
          <div
            ref={bubbleRef}
            id={id}
            role="tooltip"
            style={{
              position: "absolute",
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              zIndex: MENU_LAYER + 2,
              visibility: position === null ? "hidden" : undefined,
            }}
            className="pointer-events-none max-w-xs rounded-md bg-ink px-2 py-1 text-xs text-bg shadow-lg"
            data-testid={testId}
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
}
