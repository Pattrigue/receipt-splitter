import type { Receipt, ReceiptItem } from "@/types";

export const SHARED_BUYER = "Begge";
export const SHARED_BUYER_LABEL = "Alle";

export type ImportedReceipt = {
  items: Array<{
    name?: string;
    price: number;
    discount?: number;
  }>;
};

export type ReceiptTotals = {
  totalPrice: number;
  split: Record<string, number>;
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
        buyer: SHARED_BUYER,
      },
    ],
  };
}

export function mapImportedReceiptToItems(parsed: ImportedReceipt): ReceiptItem[] {
  return parsed.items.map((it) => ({
    name: it.name ?? "",
    price: Number.isFinite(it.price) ? it.price : 0,
    discount: Number.isFinite(it.discount ?? 0) ? Math.abs(it.discount ?? 0) : 0,
    buyer: SHARED_BUYER,
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

export function calculateTotals(items: ReceiptItem[], participants: string[]): ReceiptTotals {
  const split = Object.fromEntries(participants.map((name) => [name, 0]));

  return items.reduce<ReceiptTotals>(
    (totals, item) => {
      const finalPrice = item.price - item.discount;
      totals.totalPrice += finalPrice;

      if (participants.includes(item.buyer)) {
        totals.split[item.buyer] += finalPrice;
      } else if (participants.length > 0) {
        const sharedPrice = finalPrice / participants.length;
        for (const participant of participants) {
          totals.split[participant] += sharedPrice;
        }
      }

      return totals;
    },
    { totalPrice: 0, split }
  );
}

export function calculateReceiptSetTotals(
  receipts: Receipt[],
  participants: string[]
): ReceiptTotals {
  return calculateTotals(receipts.flatMap((receipt) => receipt.items), participants);
}
