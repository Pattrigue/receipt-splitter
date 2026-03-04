import type { ReceiptItem } from "@/types";
import { ActionIcon, Group, Stack, Table } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useCallback } from "react";
import { JsonReceiptImportButton } from "@/components/JsonReceiptImportButton";
import { useReceiptContext } from "../context/ReceiptContext";
import { ReceiptTableRows } from "@/components/ReceiptTableRows";

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

  const handleImport = useCallback(
    (items: ReceiptItem[]) => setReceipt({ items }),
    [setReceipt]
  );

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
              <Group gap="xs" justify="flex-end" wrap="nowrap">
                <JsonReceiptImportButton onImport={handleImport} />
                <ActionIcon onClick={handleAddRow} variant="light">
                  <IconPlus size={14} />
                </ActionIcon>
              </Group>
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
