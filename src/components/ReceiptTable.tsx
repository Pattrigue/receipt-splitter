import { ReceiptTableRows } from "@/components/ReceiptTableRows";
import { ActionIcon, Badge, Button, Group, Scroller, Stack, Table, Tabs, Text, Tooltip } from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useCallback } from "react";
import type { MouseEvent } from "react";
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
    addEmptyReceipt,
    removeReceipt,
    setActiveReceiptId,
    updateActiveReceipt,
  } = useReceiptContext();

  const handleAddRow = useCallback(() => {
    if (!activeReceipt) return;

    updateActiveReceipt((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", price: 0, discount: 0, buyer: "Begge" },
      ],
    }));
  }, [activeReceipt, updateActiveReceipt]);

  const handleRemoveReceipt = useCallback(
    (event: MouseEvent, receiptId: string) => {
      event.preventDefault();
      event.stopPropagation();
      removeReceipt(receiptId);
    },
    [removeReceipt]
  );


  return (
    <Stack gap="sm">
      {receipts.length === 0 ? (
        <Stack
          align="center"
          gap="sm"
          h="calc(100dvh - var(--app-shell-header-height) - var(--app-shell-footer-height) - var(--app-shell-padding) * 2)"
          justify="center"
          mih={0}
        >
          <Stack align="center" gap={4}>
            <Text fw={600}>Ingen kvitteringer endnu</Text>
            <Text c="dimmed" size="sm" ta="center">
              Importér en JSON-fil eller opret en tom kvittering.
            </Text>
          </Stack>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={addEmptyReceipt}
            size="xs"
            variant="light"
          >
            Ny kvittering
          </Button>
        </Stack>
      ) : (
        <Tabs value={activeReceiptId} onChange={setActiveReceiptId}>
          <Tabs.List>
            <Scroller>
              {receipts.map((receipt) => (
                <Tabs.Tab
                  key={receipt.id}
                  value={receipt.id}
                  leftSection={
                    <Badge size="xs" variant="light">
                      {receipt.items.length}
                    </Badge>
                  }
                  rightSection={
                    <ActionIcon
                      aria-label={`Fjern ${receipt.name}`}
                      color="gray"
                      component="span"
                      onClick={(event) => handleRemoveReceipt(event, receipt.id)}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      size="xs"
                      variant="subtle"
                    >
                      <IconX size={12} />
                    </ActionIcon>
                  }
                >
                  <Text size="sm" truncate="end" maw={160}>
                    {receipt.name}
                  </Text>
                </Tabs.Tab>
              ))}

              <Tooltip label="Ny kvittering">
                <ActionIcon
                  aria-label="Ny kvittering"
                  ml="sm"
                  onClick={addEmptyReceipt}
                  size="sm"
                  style={{ alignSelf: "center", flex: "0 0 auto" }}
                  variant="light"
                >
                  <IconPlus size={16} />
                </ActionIcon>
              </Tooltip>
            </Scroller>
          </Tabs.List>
        </Tabs>
      )}

      {!activeReceipt ? null : (
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
      )}
    </Stack>
  );
}
