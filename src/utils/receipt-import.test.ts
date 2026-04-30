import { describe, expect, it } from "vitest";
import {
  calculateReceiptSetTotals,
  calculateTotals,
  importReceiptFiles,
  mapImportedReceiptToReceipt,
} from "@/utils/receipt-import";

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
