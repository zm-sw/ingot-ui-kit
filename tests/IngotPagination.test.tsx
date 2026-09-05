/**
 * `IngotPagination` (KAN-654) — the pager is controlled and the edge
 * buttons are disabled, so `onPageChange` never receives a page out of
 * range. The caller supplies the labels translated; the primitive owns no
 * text.
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
  it("is a <nav> with a label and shows the composed state", () => {
    renderPager(2);

    expect(
      screen.getByRole("navigation", { name: "Stránkování" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Strana 2 z 3")).toBeInTheDocument();
  });

  it("reports the neighbouring pages", () => {
    const onPageChange = renderPager(2);

    fireEvent.click(screen.getByRole("button", { name: "Předchozí" }));
    fireEvent.click(screen.getByRole("button", { name: "Další" }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it("cannot go back on the first page or forward on the last", () => {
    const first = renderPager(1);
    const prev = screen.getByRole("button", { name: "Předchozí" });
    expect(prev).toBeDisabled();
    fireEvent.click(prev);
    expect(first).not.toHaveBeenCalled();
  });

  it("next is disabled on the last page", () => {
    renderPager(3);
    expect(screen.getByRole("button", { name: "Další" })).toBeDisabled();
  });
});
