import { createSafeContext } from "@mantine/core";
import { useCallback, useState } from "react";
import type { PropsWithChildren } from "react";
import type { Receipt } from "@/types";

type SetReceipt = (value: Receipt | ((prev: Receipt) => Receipt)) => void;

type ReceiptContextValue = {
  receipt: Receipt;
  itemCount: number;
  setReceipt: SetReceipt;
  onReceiptChange: (receipt: Receipt) => void;
};

const [ReceiptContextProvider, useReceiptContext] =
  createSafeContext<ReceiptContextValue>(
    "ReceiptContext was not found. Wrap your tree with <ReceiptProvider>."
  );

export function ReceiptProvider({ children }: PropsWithChildren) {
  const [receipt, setReceipt] = useState<Receipt>({
    items: [{ name: "", price: 0, discount: 0, buyer: "Begge" }],
  });

  const [itemCount, setItemCount] = useState<number>(1);

  const onReceiptChange = useCallback((receipt: Receipt) => {
    setItemCount(receipt.items.length);
  }, []);

  return (
    <ReceiptContextProvider
      value={{ receipt, itemCount, setReceipt, onReceiptChange }}
    >
      {children}
    </ReceiptContextProvider>
  );
}

export { useReceiptContext };
