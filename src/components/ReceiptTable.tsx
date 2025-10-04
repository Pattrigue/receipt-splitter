import type { Receipt } from "@/types";
import { ActionIcon, Divider, Group, Stack, Table, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { ReceiptTableRows } from "./ReceiptTableRows";
import { useReceiptContext } from "./ReceiptContext";
import { useCallback } from "react";

const ACTION_COL_WIDTH = 32;

type Split = { Marie: number; Patrick: number };

export function ReceiptTable() {
  const { receipt, setReceipt } = useReceiptContext();

  const handleAddRow = useCallback(() => {
    setReceipt((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", price: 0, discount: 0, buyer: "Begge" },
      ],
    }));
  }, [setReceipt]);

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
    <Stack gap={0}>
      <Table horizontalSpacing={6}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Pris</Table.Th>
            <Table.Th>Rabat</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Køber</Table.Th>
            <Table.Th w={ACTION_COL_WIDTH}>
              <ActionIcon onClick={handleAddRow} variant="light">
                <IconPlus size={14} />
              </ActionIcon>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <ReceiptTableRows
            items={receipt.items}
            actionColWidth={ACTION_COL_WIDTH}
          />
        </Table.Tbody>
      </Table>

      <Divider />

      <Group gap={32} justify="flex-end" pr="sm" mt="md">
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
    </Stack>
  );
}
