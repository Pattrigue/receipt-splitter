import { Group, Text } from "@mantine/core";
import { useMemo } from "react";
import { useReceiptContext } from "./ReceiptContext";

type Split = { Marie: number; Patrick: number };

export function Footer() {
  const { receipt } = useReceiptContext();

  const { totalPrice, split } = useMemo(() => {
    let total = 0;
    const s: Split = { Marie: 0, Patrick: 0 };

    for (const item of receipt.items) {
      const finalPrice = item.price - item.discount;
      total += finalPrice;

      switch (item.buyer) {
        case "Marie":
          s.Marie += finalPrice;
          break;
        case "Patrick":
          s.Patrick += finalPrice;
          break;
        case "Begge":
          s.Marie += finalPrice / 2;
          s.Patrick += finalPrice / 2;
          break;
      }
    }

    return { totalPrice: total, split: s };
  }, [receipt.items]);

  const { Marie, Patrick } = split;

  return (
    <Group gap={32} justify="flex-end" h="100%">
      <div>
        <Text>Marie</Text>
        <Text>{`${Marie.toFixed(2).replace(".", ",")} kr.`}</Text>
      </div>
      <div>
        <Text>Patrick</Text>
        <Text>{`${Patrick.toFixed(2).replace(".", ",")} kr.`}</Text>
      </div>
      <div>
        <Text>Total</Text>
        <Text>{`${totalPrice.toFixed(2).replace(".", ",")} kr.`}</Text>
      </div>
    </Group>
  );
}
