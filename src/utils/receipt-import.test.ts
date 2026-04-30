import { describe, expect, it } from "vitest";
import {
  calculateReceiptSetTotals,
  calculateTotals,
  importReceiptFiles,
  mapImportedReceiptToReceipt,
} from "@/utils/receipt-import";
import {
  addEmptyReceipt,
  appendReceipts,
  removeReceipt,
} from "@/utils/receipt-state";

describe("receipt import", () => {
  it("maps each JSON file to a separate receipt", async () => {
    const files = [
      new File(
        [JSON.stringify({ items: [{ name: "Milk", price: 12.5 }] })],
        "store-one.json",
        { type: "application/json" }
      ),
      new File(
        [JSON.stringify({ items: [{ name: "Bread", price: 8, discount: -2 }] })],
        "store-two.json",
        { type: "application/json" }
      ),
    ];

    const receipts = await importReceiptFiles(files);

    expect(receipts).toHaveLength(2);
    expect(receipts[0]).toMatchObject({
      name: "store-one",
      sourceFileName: "store-one.json",
      items: [{ name: "Milk", price: 12.5, discount: 0, buyer: "Begge" }],
    });
    expect(receipts[1]).toMatchObject({
      name: "store-two",
      sourceFileName: "store-two.json",
      items: [{ name: "Bread", price: 8, discount: 2, buyer: "Begge" }],
    });
  });

  it("rejects malformed JSON", async () => {
    await expect(
      importReceiptFiles([new File(["not json"], "broken.json")])
    ).rejects.toThrow();
  });

  it("returns no receipts when no files are imported", async () => {
    await expect(importReceiptFiles([])).resolves.toEqual([]);
  });

  it("creates stable receipt metadata from a parsed receipt", () => {
    const receipt = mapImportedReceiptToReceipt(
      { items: [{ name: "Tea", price: 20 }] },
      "April shopping.json",
      0
    );

    expect(receipt.id).toBe("receipt-april-shopping-1");
    expect(receipt.name).toBe("April shopping");
    expect(receipt.items[0].buyer).toBe("Begge");
  });
});

describe("receipt state", () => {
  const firstReceipt = {
    id: "receipt-one-1",
    name: "One",
    items: [{ name: "A", price: 10, discount: 0, buyer: "Begge" }],
  };
  const secondReceipt = {
    id: "receipt-two-1",
    name: "Two",
    items: [{ name: "B", price: 20, discount: 0, buyer: "Marie" }],
  };

  it("appends imported receipts and selects the first new one", () => {
    const state = appendReceipts(
      { receipts: [firstReceipt], activeReceiptId: firstReceipt.id },
      [secondReceipt]
    );

    expect(state.receipts).toHaveLength(2);
    expect(state.receipts[0]).toBe(firstReceipt);
    expect(state.receipts[1]).toMatchObject(secondReceipt);
    expect(state.activeReceiptId).toBe(secondReceipt.id);
  });

  it("keeps appended receipt ids unique", () => {
    const state = appendReceipts(
      { receipts: [firstReceipt], activeReceiptId: firstReceipt.id },
      [firstReceipt]
    );

    expect(state.receipts.map((receipt) => receipt.id)).toEqual([
      "receipt-one-1",
      "receipt-one-1-2",
    ]);
  });

  it("removes the active receipt and selects the next receipt", () => {
    const state = removeReceipt(
      {
        receipts: [firstReceipt, secondReceipt],
        activeReceiptId: firstReceipt.id,
      },
      firstReceipt.id
    );

    expect(state.receipts).toEqual([secondReceipt]);
    expect(state.activeReceiptId).toBe(secondReceipt.id);
  });

  it("removing the last receipt leaves an empty state", () => {
    const state = removeReceipt(
      { receipts: [firstReceipt], activeReceiptId: firstReceipt.id },
      firstReceipt.id
    );

    expect(state.receipts).toEqual([]);
    expect(state.activeReceiptId).toBeNull();
  });

  it("adds a blank receipt to an empty state and selects it", () => {
    const state = addEmptyReceipt({ receipts: [], activeReceiptId: null });

    expect(state.receipts).toHaveLength(1);
    expect(state.receipts[0]).toMatchObject({
      id: "receipt-manual-1",
      name: "Kvittering 1",
      items: [{ name: "", price: 0, discount: 0, buyer: "Begge" }],
    });
    expect(state.activeReceiptId).toBe("receipt-manual-1");
  });
});

describe("receipt totals", () => {
  it("calculates totals for the current receipt", () => {
    const totals = calculateTotals([
      { name: "A", price: 20, discount: 5, buyer: "Marie" },
      { name: "B", price: 10, discount: 0, buyer: "Patrick" },
      { name: "C", price: 8, discount: 2, buyer: "Begge" },
    ]);

    expect(totals.totalPrice).toBe(31);
    expect(totals.split.Marie).toBe(18);
    expect(totals.split.Patrick).toBe(13);
  });

  it("calculates totals across all receipts", () => {
    const totals = calculateReceiptSetTotals([
      {
        id: "one",
        name: "One",
        items: [{ name: "A", price: 30, discount: 0, buyer: "Begge" }],
      },
      {
        id: "two",
        name: "Two",
        items: [{ name: "B", price: 12, discount: 2, buyer: "Patrick" }],
      },
    ]);

    expect(totals.totalPrice).toBe(40);
    expect(totals.split.Marie).toBe(15);
    expect(totals.split.Patrick).toBe(25);
  });
});
