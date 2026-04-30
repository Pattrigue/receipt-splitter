import type { Receipt } from "@/types";
import { createEmptyReceipt, SHARED_BUYER } from "@/utils/receipt-import";

export type ReceiptState = {
  receipts: Receipt[];
  activeReceiptId: string | null;
};

export function makeUniqueReceipts(
  existingReceipts: Receipt[],
  receiptsToAdd: Receipt[]
): Receipt[] {
  const usedIds = new Set(existingReceipts.map((receipt) => receipt.id));

  return receiptsToAdd.map((receipt) => {
    let id = receipt.id;
    let suffix = 2;

    while (usedIds.has(id)) {
      id = `${receipt.id}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(id);
    return { ...receipt, id };
  });
}

export function appendReceipts(
  state: ReceiptState,
  receiptsToAdd: Receipt[]
): ReceiptState {
  if (receiptsToAdd.length === 0) return state;

  const uniqueReceipts = makeUniqueReceipts(state.receipts, receiptsToAdd);

  return {
    receipts: [...state.receipts, ...uniqueReceipts],
    activeReceiptId: uniqueReceipts[0].id,
  };
}

export function addEmptyReceipt(state: ReceiptState): ReceiptState {
  const receiptNumber = state.receipts.length + 1;
  const receipt = createEmptyReceipt(
    `receipt-manual-${receiptNumber}`,
    `Kvittering ${receiptNumber}`
  );

  return appendReceipts(state, [receipt]);
}

export function removeReceipt(state: ReceiptState, receiptId: string): ReceiptState {
  const removedIndex = state.receipts.findIndex((receipt) => receipt.id === receiptId);
  if (removedIndex === -1) return state;

  const receipts = state.receipts.filter((receipt) => receipt.id !== receiptId);
  if (receipts.length === 0) {
    return { receipts, activeReceiptId: null };
  }

  if (state.activeReceiptId !== receiptId) {
    return { receipts, activeReceiptId: state.activeReceiptId };
  }

  return {
    receipts,
    activeReceiptId: receipts[Math.min(removedIndex, receipts.length - 1)].id,
  };
}

export function renameParticipantInReceipts(
  receipts: Receipt[],
  previousName: string,
  nextName: string
): Receipt[] {
  if (previousName === nextName) return receipts;

  return receipts.map((receipt) => ({
    ...receipt,
    items: receipt.items.map((item) =>
      item.buyer === previousName ? { ...item, buyer: nextName } : item
    ),
  }));
}

export function removeParticipantFromReceipts(
  receipts: Receipt[],
  participant: string
): Receipt[] {
  return receipts.map((receipt) => ({
    ...receipt,
    items: receipt.items.map((item) =>
      item.buyer === participant ? { ...item, buyer: SHARED_BUYER } : item
    ),
  }));
}
