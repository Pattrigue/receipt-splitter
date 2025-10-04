import { ActionIcon, Stack, Table } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useCallback } from "react";
import { useReceiptContext } from "./ReceiptContext";
import { ReceiptTableRows } from "./ReceiptTableRows";

const ACTION_COL_WIDTH = 32;

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
    </Stack>
  );
}
