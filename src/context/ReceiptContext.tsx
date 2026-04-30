import { createSafeContext } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Receipt } from "@/types";
import {
  addEmptyReceipt as addEmptyReceiptToState,
  appendReceipts,
  removeReceipt as removeReceiptFromState,
} from "@/utils/receipt-state";
import type { ReceiptState } from "@/utils/receipt-state";

type UpdateActiveReceipt = (value: Receipt | ((prev: Receipt) => Receipt)) => void;

type ReceiptContextValue = {
  receipts: Receipt[];
  activeReceiptId: string | null;
  activeReceipt: Receipt | null;
  itemCount: number;
  setActiveReceiptId: (id: string | null) => void;
  addReceipts: (receipts: Receipt[]) => void;
  addEmptyReceipt: () => void;
  removeReceipt: (id: string) => void;
  updateActiveReceipt: UpdateActiveReceipt;
};

const [ReceiptContextProvider, useReceiptContext] =
  createSafeContext<ReceiptContextValue>(
    "ReceiptContext was not found. Wrap your tree with <ReceiptProvider>."
  );

export function ReceiptProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<ReceiptState>({
    receipts: [],
    activeReceiptId: null,
  });

  const activeReceipt = useMemo(
    () => state.receipts.find((receipt) => receipt.id === state.activeReceiptId) ?? null,
    [state.activeReceiptId, state.receipts]
  );

  const setActiveReceiptId = useCallback((id: string | null) => {
    setState((prevState) => ({
      ...prevState,
      activeReceiptId: id,
    }));
  }, []);

  const addReceipts = useCallback((receiptsToAdd: Receipt[]) => {
    setState((prevState) => appendReceipts(prevState, receiptsToAdd));
  }, []);

  const addEmptyReceipt = useCallback(() => {
    setState((prevState) => addEmptyReceiptToState(prevState));
  }, []);

  const removeReceipt = useCallback((id: string) => {
    setState((prevState) => removeReceiptFromState(prevState, id));
  }, []);

  const updateActiveReceipt = useCallback<UpdateActiveReceipt>((value) => {
    setState((prevState) => ({
      ...prevState,
      receipts: prevState.receipts.map((receipt) => {
        if (receipt.id !== prevState.activeReceiptId) return receipt;
        return typeof value === "function" ? value(receipt) : value;
      }),
    }));
  }, []);

  const itemCount = activeReceipt?.items.length ?? 0;

  const value = useMemo(() => ({
    receipts: state.receipts,
    activeReceiptId: state.activeReceiptId,
    activeReceipt,
    itemCount,
    setActiveReceiptId,
    addReceipts,
    addEmptyReceipt,
    removeReceipt,
    updateActiveReceipt,
  }), [
    state.receipts,
    state.activeReceiptId,
    activeReceipt,
    itemCount,
    addReceipts,
    addEmptyReceipt,
    removeReceipt,
    updateActiveReceipt,
  ]);

  return (
    <ReceiptContextProvider value={value}>
      {children}
    </ReceiptContextProvider>
  );
}

export { useReceiptContext };
