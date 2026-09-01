/**
 * `IngotPagination` (KAN-654) — pager je řízený a krajní tlačítka se
 * vypínají, takže `onPageChange` nikdy nedostane stránku mimo rozsah.
 * Popisky dodává volající přeložené; primitivum žádný text nevlastní.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IngotPagination } from "@/ingot";

function renderPager(page: number, onPageChange = vi.fn()) {
  render(
    <IngotPagination
      page={page}
      pageCount={3}
      onPageChange={onPageChange}
      prevLabel="Předchozí"
      nextLabel="Další"
      status={`Strana ${page} z 3`}
      label="Stránkování"
    />,
  );
  return onPageChange;
}

describe("IngotPagination", () => {
  it("je <nav> s popiskem a ukazuje složený stav", () => {
    renderPager(2);

    expect(
      screen.getByRole("navigation", { name: "Stránkování" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Strana 2 z 3")).toBeInTheDocument();
  });

  it("hlásí sousední stránky", () => {
    const onPageChange = renderPager(2);

    fireEvent.click(screen.getByRole("button", { name: "Předchozí" }));
    fireEvent.click(screen.getByRole("button", { name: "Další" }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it("na první straně nejde zpět, na poslední dál", () => {
    const first = renderPager(1);
    const prev = screen.getByRole("button", { name: "Předchozí" });
    expect(prev).toBeDisabled();
    fireEvent.click(prev);
    expect(first).not.toHaveBeenCalled();
  });

  it("na poslední straně je „další“ vypnuté", () => {
    renderPager(3);
    expect(screen.getByRole("button", { name: "Další" })).toBeDisabled();
  });
});
