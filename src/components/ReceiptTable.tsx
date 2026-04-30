import { ReceiptTableRows } from "@/components/ReceiptTableRows";
import { ActionIcon, Group, Stack, Table, Tabs, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useCallback } from "react";
import { useReceiptContext } from "../context/ReceiptContext";

const ACTION_COL_WIDTH = 32;

interface ReceiptTableProps {
  showName: boolean;
}

export function ReceiptTable({ showName }: ReceiptTableProps) {
  const {
    receipts,
    activeReceipt,
    activeReceiptId,
    setActiveReceiptId,
    updateActiveReceipt,
  } = useReceiptContext();

  const handleAddRow = useCallback(() => {
    updateActiveReceipt((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", price: 0, discount: 0, buyer: "Begge" },
      ],
    }));
  }, [updateActiveReceipt]);


  return (
    <Stack gap="sm">
      <Tabs value={activeReceiptId} onChange={(value) => value && setActiveReceiptId(value)}>
        <Tabs.List>
          {receipts.map((receipt) => (
            <Tabs.Tab key={receipt.id} value={receipt.id}>
              <Group gap={6} wrap="nowrap">
                <Text size="sm" truncate="end" maw={160}>
                  {receipt.name}
                </Text>
                <Text size="xs" c="dimmed">
                  {receipt.items.length}
                </Text>
              </Group>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      <Table horizontalSpacing={6} striped>
        <Table.Thead>
          <Table.Tr>
            {showName && <Table.Th visibleFrom="sm">Vare</Table.Th>}

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
            items={activeReceipt.items}
            actionColWidth={ACTION_COL_WIDTH}
            showName={showName}
          />
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
