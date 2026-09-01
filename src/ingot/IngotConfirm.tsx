import {
  createContext,
  useCallback,
  useContext,
  useState,
  type JSX,
  type ReactNode,
} from "react";

import { Button } from "./Button";
import { IngotModal } from "./IngotModal";

/**
 * Potvrzovací dialog — třetí primitivum Ingotu (KAN-583).
 *
 * Postavené nad `IngotModal`, a to je celý důvod, proč vzniklo jako druhý
 * konzument shellu: confirm **je** modal, jen s pevně danou kostrou (titulek,
 * popis, volitelný dopad, dvě tlačítka). Tím, že tu kostru drží jedno místo,
 * dostane a11y laťku z KAN-580 — focus trap, ESC, scroll lock, `role="dialog"`
 * s popiskem, návrat fokusu na spouštěč — každá obrazovka, která se ptá
 * „opravdu?", aniž by na to musela sáhnout.
 *
 * ## Dvě věci navíc, které to není jen „modal se dvěma tlačítky"
 *
 * - **`impact`** — slot pro spočítaný dopad (typicky `<ImpactSummary>`).
 *   Renderuje se v ohraničeném boxu pod popisem; obsah dodává volající.
 * - **Veto (KAN-422)** — obsah `impact` slotu smí potvrzovací tlačítko
 *   **sundat** a říct proč. Bez toho dialog nabízel „Smazat trvale" i tam, kde
 *   server krok odmítne (409 `has_orders` / `has_blocking_refs`), a operátor
 *   se odpověď dozvěděl až z chybové hlášky pod kartou. Zašedlé tlačítko vedle
 *   důvodu čte operátor jako „ještě chvíli", proto se nenabídne vůbec.
 *
 * Veto sem patří, ačkoli je to o krok víc než holá skořápka: je to obecná
 * schopnost potvrzení („obsah smí potvrzení odvolat"), ne znalost domény —
 * dialog sám o žádné entitě ani důvodu neví.
 *
 * ## Popisky dodává volající
 *
 * Ingot **nemá vlastní i18n namespace** (totéž pravidlo jako `IngotModal`
 * a `IngotFieldInput`), takže všechny texty včetně `confirmLabel` /
 * `cancelLabel` / `closeLabel` přicházejí už přeložené. Výchozí hodnoty přes
 * `common` namespace drží adaptér `components/admin/ConfirmDialog.tsx`.
 *
 * ## Tlačítka jedou přes sdílený `Button` (KAN-624)
 *
 * 🚨 Do KAN-624 měl dialog obě tlačítka opsaná z `@/components/ui/Button` —
 * a ta kopie zestárla přesně tam, kde to nejvíc bolí. Varianta `danger` má
 * v `Button` výjimku `dark:text-bg`, protože tmavá paleta `--danger`
 * ZESVĚTLUJE (`#b91c1c` → `#f36464`), aby se dala číst jako text; bílý text
 * na tom zesvětleném podkladu dává **3,08 : 1**, tedy pod WCAG AA 4,5 : 1.
 * Opsané třídy tu výjimku neměly, takže v tmavém režimu bylo nejrizikovější
 * tlačítko v aplikaci to nejhůř čitelné — a přes adaptér `ConfirmDialog` se
 * to týkalo ~40 obrazovek.
 *
 * Nepiš ta tlačítka znovu ručně. Kontrast tokenu se s paletou mění a jedno
 * místo se opraví; kopie se opraví tam, kde si na ni někdo vzpomene.
 */

/**
 * Kanál, kterým obsah `impact` slotu odvolá potvrzení.
 *
 * Kontext, ne prop: důvod zná až komponenta uvnitř slotu (načte usage
 * z API), a ta o dialogu nad sebou nemá referenci.
 */
const ConfirmVetoContext = createContext<(reason: ReactNode | null) => void>(
  () => {},
);

/** Zavolej s důvodem → potvrzovací tlačítko se nenabídne; `null` = beze změny. */
export function useConfirmVeto(): (reason: ReactNode | null) => void {
  return useContext(ConfirmVetoContext);
}

export function IngotConfirm({
  title,
  description,
  confirmLabel,
  cancelLabel,
  closeLabel,
  busy = false,
  onConfirm,
  onClose,
  testId,
  impact,
}: {
  /** Krátký titulek („Smazat trvale?"). Ukazuje na něj `aria-labelledby`. */
  title: string;
  /** Co se stane. */
  description: ReactNode;
  /** Přeložené sloveso potvrzení („Smazat"). */
  confirmLabel: string;
  /** Přeložený popisek zrušení („Zrušit"). */
  cancelLabel: string;
  /** Přeložený `aria-label` křížku v hlavičce. */
  closeLabel: string;
  /** Zamkne obě tlačítka, dokud mutace běží. */
  busy?: boolean;
  onConfirm: () => void;
  /** Zrušit · ESC · křížek · kliknutí do pozadí. */
  onClose: () => void;
  /** `data-testid` overlaye; tlačítka dostanou `${testId}-confirm` / `-cancel`. */
  testId?: string;
  /** Spočítaný dopad; smí přes `useConfirmVeto` potvrzení odvolat. */
  impact?: ReactNode;
}): JSX.Element {
  // Pole se jmenuje ``message``, ne ``reason``: identifier ratchet
  // (test_admin_identifier_ratchet) počítá ``.reason`` jako syrový
  // identifikátor v labelu — tady je to ale lokalizovaný ReactNode od
  // volajícího, žádný klíč.
  const [veto, setVeto] = useState<{ message: ReactNode } | null>(null);
  // Obal — ReactNode by se do ``useState`` setteru dal splést s updater
  // funkcí; a stabilní identita drží efekt volajícího bez smyčky.
  const setVetoReason = useCallback((reason: ReactNode | null) => {
    setVeto(reason == null ? null : { message: reason });
  }, []);

  return (
    <IngotModal
      title={title}
      onClose={onClose}
      closeLabel={closeLabel}
      width={448}
      testId={testId}
    >
      <div className="text-sm text-ink-2">{description}</div>
      {impact != null && (
        <div
          className="mt-3 rounded-md border border-border bg-bg p-3 text-sm"
          data-testid={testId ? `${testId}-impact` : undefined}
        >
          <ConfirmVetoContext.Provider value={setVetoReason}>
            {impact}
          </ConfirmVetoContext.Provider>
        </div>
      )}
      {veto && (
        <div
          className="mt-3 text-sm text-warn"
          role="alert"
          data-testid={testId ? `${testId}-blocked` : undefined}
        >
          {veto.message}
        </div>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={busy}
          data-testid={testId ? `${testId}-cancel` : undefined}
        >
          {cancelLabel}
        </Button>
        {/* Vetovaný krok tlačítko NENABÍDNE vůbec — zašedlé „Smazat trvale"
            vedle důvodu čte operátor jako „ještě chvíli". */}
        {!veto && (
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            disabled={busy}
            data-testid={testId ? `${testId}-confirm` : undefined}
          >
            {confirmLabel}
          </Button>
        )}
      </div>
    </IngotModal>
  );
}
