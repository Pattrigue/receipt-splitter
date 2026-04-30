import type { Receipt, ReceiptItem } from "@/types";

export type ImportedReceipt = {
  items: Array<{
    name?: string;
    price: number;
    discount?: number;
  }>;
};

export type ReceiptTotals = {
  totalPrice: number;
  split: {
    Marie: number;
    Patrick: number;
  };
};

export function createEmptyReceipt(id = "receipt-1", name = "Kvittering 1"): Receipt {
  return {
    id,
    name,
    items: [
      {
        name: "",
        price: 0,
        discount: 0,
        buyer: "Begge",
      },
    ],
  };
}

export function mapImportedReceiptToItems(parsed: ImportedReceipt): ReceiptItem[] {
  return parsed.items.map((it) => ({
    name: it.name ?? "",
    price: Number.isFinite(it.price) ? it.price : 0,
    discount: Number.isFinite(it.discount ?? 0) ? Math.abs(it.discount ?? 0) : 0,
    buyer: "Begge",
  }));
}

export function receiptNameFromFileName(fileName: string): string {
  return fileName.replace(/\.json$/i, "") || fileName;
}

function receiptIdFromName(name: string, index: number): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `receipt-${slug || "import"}-${index + 1}`;
}

export function mapImportedReceiptToReceipt(
  parsed: ImportedReceipt,
  fileName: string,
  index: number
): Receipt {
  const name = receiptNameFromFileName(fileName);

  return {
    id: receiptIdFromName(name, index),
    name,
    sourceFileName: fileName,
    items: mapImportedReceiptToItems(parsed),
  };
}

export async function importReceiptFiles(files: File[]): Promise<Receipt[]> {
  return Promise.all(
    files.map(async (file, index) => {
      const text = await file.text();
      const parsed = JSON.parse(text) as ImportedReceipt;
      return mapImportedReceiptToReceipt(parsed, file.name, index);
    })
  );
}

export function calculateTotals(items: ReceiptItem[]): ReceiptTotals {
  return items.reduce<ReceiptTotals>(
    (totals, item) => {
      const finalPrice = item.price - item.discount;
      totals.totalPrice += finalPrice;

      switch (item.buyer) {
        case "Marie":
          totals.split.Marie += finalPrice;
          break;
        case "Patrick":
          totals.split.Patrick += finalPrice;
          break;
        case "Begge":
          totals.split.Marie += finalPrice / 2;
          totals.split.Patrick += finalPrice / 2;
          break;
      }

      return totals;
    },
    { totalPrice: 0, split: { Marie: 0, Patrick: 0 } }
  );
}

export function calculateReceiptSetTotals(receipts: Receipt[]): ReceiptTotals {
  return calculateTotals(receipts.flatMap((receipt) => receipt.items));
}
