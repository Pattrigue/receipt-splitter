import { createSafeContext } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Receipt } from "@/types";
import { createEmptyReceipt } from "@/utils/receipt-import";

type UpdateActiveReceipt = (value: Receipt | ((prev: Receipt) => Receipt)) => void;

const initialReceipt = createEmptyReceipt();

type ReceiptContextValue = {
  receipts: Receipt[];
  activeReceiptId: string;
  activeReceipt: Receipt;
  itemCount: number;
  setActiveReceiptId: (id: string) => void;
  replaceReceipts: (receipts: Receipt[]) => void;
  updateActiveReceipt: UpdateActiveReceipt;
};

const [ReceiptContextProvider, useReceiptContext] =
  createSafeContext<ReceiptContextValue>(
    "ReceiptContext was not found. Wrap your tree with <ReceiptProvider>."
  );

export function ReceiptProvider({ children }: PropsWithChildren) {
  const [receipts, setReceipts] = useState<Receipt[]>([initialReceipt]);
  const [activeReceiptId, setActiveReceiptId] = useState<string>(initialReceipt.id);

  const activeReceipt = useMemo(
    () => receipts.find((receipt) => receipt.id === activeReceiptId) ?? receipts[0] ?? initialReceipt,
    [activeReceiptId, receipts]
  );

  const replaceReceipts = useCallback((nextReceipts: Receipt[]) => {
    const normalizedReceipts = nextReceipts.length > 0 ? nextReceipts : [createEmptyReceipt()];
    setReceipts(normalizedReceipts);
    setActiveReceiptId(normalizedReceipts[0].id);
  }, []);

  const updateActiveReceipt = useCallback<UpdateActiveReceipt>((value) => {
    setReceipts((prevReceipts) =>
      prevReceipts.map((receipt) => {
        if (receipt.id !== activeReceiptId) return receipt;
        return typeof value === "function" ? value(receipt) : value;
      })
    );
  }, [activeReceiptId]);

  const itemCount = activeReceipt?.items.length ?? 0;

  const value = useMemo(() => ({
    receipts,
    activeReceiptId,
    activeReceipt,
    itemCount,
    setActiveReceiptId,
    replaceReceipts,
    updateActiveReceipt,
  }), [
    receipts,
    activeReceiptId,
    activeReceipt,
    itemCount,
    replaceReceipts,
    updateActiveReceipt,
  ]);

  return (
    <ReceiptContextProvider value={value}>
      {children}
    </ReceiptContextProvider>
  );
}

export { useReceiptContext };
