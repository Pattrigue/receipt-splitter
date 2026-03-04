import type { ReceiptItem } from "@/types";

export type ImportedReceipt = {
  items: Array<{
    name?: string;
    price: number;
    discount?: number;
  }>;
};

export function mapImportedReceiptToItems(parsed: ImportedReceipt): ReceiptItem[] {
  return parsed.items.map((it) => ({
    name: it.name ?? "",
    price: Number.isFinite(it.price) ? it.price : 0,
    discount: Number.isFinite(it.discount ?? 0) ? Math.abs(it.discount ?? 0) : 0,
    buyer: "Begge",
  }));
}